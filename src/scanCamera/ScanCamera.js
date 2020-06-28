/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-console */
import React from 'react';
import message from '../component/Message';
import { RNCamera } from 'react-native-camera';
import CommonHeader from '../component/CommonHeader';
import { StyleSheet, Text, View, Easing, Animated } from 'react-native';

export default class ScanCameraScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			moveAnim: new Animated.Value(0),
			scanResult: '',
		};
	}

	componentDidMount() {
		this.startAnimation();
	}

	startAnimation() {
		this.state.moveAnim.setValue(0);
		Animated.timing(this.state.moveAnim, {
			toValue: -200,
			duration: 1500,
			easing: Easing.linear,
		}).start(() => this.startAnimation());
	}

	//  识别二维码
	onBarCodeRead(result) {
		let { scanResult } = this.state;
		if (scanResult) {
			return;
		}
		message.warning('hello', result.data);
		this.setState({
			scanResult: result.data,
		});
	}

	render() {
		const { navigation } = this.props;
		return (
			<View style={styles.container}>
				<CommonHeader title="扫码开门" navigation={navigation} />
				<RNCamera
					ref={ref => {
						this.camera = ref;
					}}
					style={styles.preview}
					type={RNCamera.Constants.Type.back}
					flashMode={RNCamera.Constants.FlashMode.on}
					onBarCodeRead={this.onBarCodeRead.bind(this)}
				>
					<View style={styles.rectangleContainer}>
						<View style={styles.rectangle} />
						<Animated.View
							style={[
								styles.border,
								{
									transform: [{ translateY: this.state.moveAnim }],
								},
							]}
						/>
						<Text style={styles.rectangleText}>将二维码放入框内，即可自动扫描</Text>
					</View>
				</RNCamera>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
	},
	preview: {
		flex: 1,
		justifyContent: 'flex-end',
		alignItems: 'center',
	},
	rectangleContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'transparent',
	},
	rectangle: {
		height: 200,
		width: 200,
		borderWidth: 1,
		borderColor: '#00FF00',
		backgroundColor: 'transparent',
	},
	rectangleText: {
		flex: 0,
		color: '#fff',
		marginTop: 10,
	},
	border: {
		flex: 0,
		width: 200,
		height: 2,
		backgroundColor: '#00FF00',
	},
});
