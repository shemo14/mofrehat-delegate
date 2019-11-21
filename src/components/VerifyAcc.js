import React, { Component } from "react";
import {View, Text, Image, TouchableOpacity, ImageBackground, BackHandler, Linking, AsyncStorage, I18nManager, KeyboardAvoidingView , Platform} from "react-native";
import {Container, Content, Form, Item, Input, Label, Button, Toast, Header, Icon} from 'native-base'
import styles from '../../assets/styles'
import i18n from '../../locale/i18n'
import {DoubleBounce} from "react-native-loader";
import * as Animatable from 'react-native-animatable';
import { userLogin, profile, activeAccount } from '../actions'
import CONST from "../consts";
import { connect } from 'react-redux';

class VerifyAcc extends Component {
    constructor(props){
        super(props);
        this.state = {
            code:'',
            isSubmitted: false,
			userId: null
        }
    }

	componentWillMount() {
		const code = this.props.navigation.state.params.code;
		alert(code);
		this.setState({ userId: null })
	}

    renderSubmit(){
		if (this.state.code == '' ){
			return(
				<Button disabled onPress={() => this.onNextPressed()} style={[styles.loginBtn , {marginBottom:40, backgroundColor: '#999' }]}>
					<Text style={styles.btnTxt}>{ i18n.t('next') }</Text>
				</Button>
			)
		}

        if (this.state.isSubmitted){
            return(
				<View style={{ alignSelf: 'center', justifyContent: 'center' }}>
                	<DoubleBounce style={{ alignSelf: 'center' }}  size={20} color="#B7264B" />
				</View>
            )
        }

        return (
            <Button onPress={() => this.checkCode()} style={styles.loginBtn}>
                <Text style={styles.btnTxt}>{ i18n.t('next') }</Text>
            </Button>
        );
    }

	checkCode(){
		const { code, password, phone, deviceId } = this.props.navigation.state.params;
		const type = 'delegate';

		if (code == this.state.code){
			this.setState({ isSubmitted: true });
			this.props.userLogin({ phone, password, deviceId , type}, this.props.lang);
			this.props.activeAccount(phone);
		}else{
			Toast.show({
				text: i18n.t('codeNotCorrect'),
				type: "danger",
				duration: 3000
			});
		}
	}

	componentWillReceiveProps(newProps){
		console.log('auth data', newProps);

		if (newProps.auth !== null && newProps.auth.status === 200){

			console.log('this is user id...', this.state.userId);

			if (this.state.userId === null){
				this.setState({ userId: newProps.auth.data.id });
				this.props.profile(newProps.auth.data.token);
			}

			this.props.navigation.navigate('myOrders');
		}

		if (newProps.auth !== null) {
			Toast.show({
				text: newProps.auth.msg,
				type: newProps.auth.status === 200 ? "success" : "danger",
				duration: 3000
			});
		}

		this.setState({ isSubmitted: false });
	}


    render() {
        return (
			<Container style={styles.container}>
				<TouchableOpacity style={styles.authBack} onPress={() => this.props.navigation.goBack()}>
					<Icon type={'FontAwesome'} name={'angle-right'} style={[styles.transform, styles.rightHeaderIcon  , {height:45 , width:45}]} />
				</TouchableOpacity>

				<Content contentContainerStyle={styles.flexGrow}>
					<View style={styles.imageBackgroundStyle}>
						<Animatable.View animation="zoomIn" duration={1400}>
							<Image source={require('../../assets/images/logo.png')} style={styles.logoStyle} resizeMode={'contain'} />
						</Animatable.View>
						<View style={styles.loginFormContainerStyle}>
							<KeyboardAvoidingView behavior={'padding'} style={styles.keyboardAvoid}>
								<Form  style={[styles.w100 , styles.ph25 ]}>
									<Text style={styles.authTitle}>{ i18n.t('verifyAcc') }</Text>
									<Text style={styles.authDesc}>{ i18n.t('verifyAccText') }</Text>

									<View style={styles.itemView}>
										<Item floatingLabel style={styles.loginItem} bordered>
											<Label style={styles.label}>{ i18n.t('activationCode') }</Label>
											<Input onChangeText={(code) => this.setState({code})} keyboardType={'number-pad'} style={styles.input}  />
										</Item>
									</View>

									<View style={[styles.loginBtnContainer , styles.mt45 ]}>
										{ this.renderSubmit() }
									</View>
								</Form>
							</KeyboardAvoidingView>
						</View>
					</View>
				</Content>
			</Container>
        );
    }
}


const mapStateToProps = ({ auth, profile, lang }) => {
	return {
		loading: auth.loading,
		auth: auth.user,
		user: profile.user,
		lang: lang.lang
	};
};

export default connect(mapStateToProps, { userLogin, profile, activeAccount })(VerifyAcc);