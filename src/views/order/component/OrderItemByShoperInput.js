import React from 'react';
import MoneyItem from './MoneyItem';
import Request from '@/util/Request';
import Config from '@/config/config';
import Toast from '@/component/Toast';
import Message from '@/component/Message';
import { Badge } from 'react-native-elements';
import FastImage from '@/component/FastImage';
import FilterStatus from '@/util/FilterStatus';
import { Text, View, StyleSheet, TouchableOpacity, Linking } from 'react-native';

export default class AllOrder extends React.Component {
	constructor(props) {
		super(props);
		this.renderBtn = this.renderBtn.bind(this);
	}

	componentDidMount() {}

	// 更新衣物状态
	async updateOrderStatus(status) {
		let { id } = this.props.detail;
		let orderStatus = await Request.post('/order/updateOrderStatus', { orderid: id, status: status });
		if (orderStatus.data === 'success') {
			return this.props.onSearch();
		}
		return;
	}

	// 联系用户
	async onConnectUs() {
		let { detail } = this.props;
		let res = await Request.get('/order/getOrderById', { id: detail.id });
		console.log(res, 333);
		let phone = res.data ? res.data.home_phone : '18210619398';
		let tel = `tel:${phone}`; // 目标电话
		Linking.canOpenURL(tel)
			.then(supported => {
				if (!supported) {
					Message.warning('用户电话', phone);
				} else {
					return Linking.openURL(tel);
				}
			})
			.catch(error => Message.warning('用户电话', phone));
	}

	// 点击查看详情页面
	onSearchDetail(id) {
		const { navigation } = this.props;
		navigation.navigate('OrderDetailScreen', {
			id: id,
		});
	}

	// 完成清洗
	successClear() {
		Message.confirm('已完成清洗', '清洗完成后，订单将归类于已完成订单', async () => {
			this.props.setLoading(true);
			await this.updateOrderStatus(5);
			this.props.setLoading(false);
			Toast.success('已完成清洗');
			this.props.onSearch();
		});
	}

	renderBtn() {
		let actionBtn = [],
			detail = this.props.detail || {};
		let { status, id, is_sure } = detail;

		// 联系用户
		const connectBtn = (
			<TouchableOpacity
				key="connectBtn"
				onPress={this.onConnectUs.bind(this)}
				style={styles.order_item_right_bottom_btn}
			>
				<Text style={styles.order_pay_font}>联系用户</Text>
			</TouchableOpacity>
		);

		// 设置金额
		const clearSucessBtn = (
			<TouchableOpacity
				key="clearSucessBtn"
				style={styles.order_item_right_bottom_btn}
				onPress={() => this.props.navigation.navigate('GoodsScreen', { orderId: id })}
			>
				<Text style={styles.order_pay_font}>设置金额</Text>
			</TouchableOpacity>
		);

		// 确认完成清洗
		const successClear = (
			<TouchableOpacity
				key="successClear"
				style={styles.order_item_right_bottom_btn}
				onPress={this.successClear.bind(this)}
			>
				<Text style={styles.order_pay_font}>完成清洗</Text>
			</TouchableOpacity>
		);
		if (status === 5) {
			actionBtn = [connectBtn];
		}
		if (status === 2) {
			actionBtn = [connectBtn, clearSucessBtn];
			is_sure === 2 && actionBtn.push(successClear);
		}
		return actionBtn;
	}

	render() {
		const { id, create_time, status, code, home_username, money, urgency } = this.props.detail;
		return (
			<View style={styles.order_item}>
				<View style={styles.order_item_left}>
					<FastImage
						style={styles.order_item_left_img}
						source={{ uri: `${Config.baseUrl}/logo_square.jpg` }}
					/>
				</View>
				<View style={styles.order_item_right}>
					<View style={styles.order_item_right_title}>
						<View style={styles.order_item_right_title_left}>
							<Text style={styles.font_title_style}>{code}</Text>
						</View>
						<View style={styles.order_item_right_title_right}>
							<Text style={styles.font_title_style}>{FilterStatus.filterOrderStatus(status)}</Text>
						</View>
					</View>
					<View style={styles.order_item_right_time}>
						<View style={styles.order_item_right_time_left}>
							<Text style={{ fontSize: 10, color: '#333' }}>{create_time}</Text>
						</View>
						{Number(urgency) === 2 && (
							<View style={styles.order_item_right_time_right}>
								<Badge value="加急订单" status="success" textStyle={{ fontSize: 10 }} />
							</View>
						)}
					</View>
					<TouchableOpacity style={styles.order_item_touch} onPress={this.onSearchDetail.bind(this, id)}>
						<View style={styles.order_item_right_adrress}>
							<Text style={styles.font_desc_style}>订单方式：手动录入</Text>
						</View>
						<View style={styles.order_item_right_adrress}>
							<Text style={styles.font_desc_style}>客户姓名：{home_username}</Text>
						</View>
						{Number(urgency) === 2 && (
							<>
								<MoneyItem text="加急费用：" money={Number(money * 0.5).toFixed(2)} />
								<MoneyItem text="洗衣总费用：" money={Number(money * 1.5).toFixed(2)} />
							</>
						)}
					</TouchableOpacity>
					<View style={styles.order_item_right_bottom}>{this.renderBtn()}</View>
				</View>
			</View>
		);
	}
}

const order_item_left_width = 35;
const styles = StyleSheet.create({
	font_title_style: {
		fontSize: 14,
		color: '#606060',
	},
	font_desc_style: {
		fontSize: 12,
		color: '#333',
		lineHeight: 28,
	},
	order_item_touch: {
		paddingTop: 10,
	},
	order_item: {
		minHeight: 150,
		margin: 10,
		marginBottom: 0,
		backgroundColor: '#fff',
		flexDirection: 'row',
		padding: 10,
	},
	order_item_left: {
		width: order_item_left_width,
		height: order_item_left_width,
	},
	order_item_left_img: {
		width: order_item_left_width,
		height: order_item_left_width,
	},
	order_item_right: {
		flex: 1,
		marginLeft: 10,
	},
	order_item_right_title: {
		height: 20,
		justifyContent: 'center',
		flexDirection: 'row',
	},
	order_item_right_title_left: {
		flex: 1,
	},
	order_item_right_title_right: {
		width: 72,
		alignItems: 'flex-end',
	},
	order_item_right_time: {
		height: 25,
		alignItems: 'center',
		borderBottomColor: '#f2f2f2',
		borderBottomWidth: 1,
		flexDirection: 'row',
	},
	order_item_right_time_left: {
		flex: 1,
	},
	order_item_right_goods: {
		flexDirection: 'row',
	},
	order_item_right_goods_left: {
		flex: 1,
	},
	order_item_right_goods_right: {
		width: 70,
		alignItems: 'flex-end',
	},
	order_item_right_bottom: {
		height: 40,
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'flex-end',
	},
	order_item_right_bottom_btn: {
		padding: 5,
		borderWidth: 1,
		borderColor: '#fb9dd0',
		alignItems: 'center',
		borderRadius: 5,
		marginHorizontal: 5,
	},
	order_pay_font: {
		color: '#fb9dd0',
	},
});