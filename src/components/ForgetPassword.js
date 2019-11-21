import React, { Component } from "react";
import {View, Text, Image, TouchableOpacity, ImageBackground, BackHandler, Linking, AsyncStorage, I18nManager, KeyboardAvoidingView , Platform} from "react-native";
import {Container, Content, Form, Item, Input, Label, Button, Toast, Header, Icon} from 'native-base'
import styles from '../../assets/styles'
import i18n from '../../locale/i18n'
import {DoubleBounce} from "react-native-loader";
import * as Animatable from 'react-native-animatable';
import axios from "axios";
import CONST from "../consts";

class ForgetPassword extends Component {
    constructor(props){
        super(props);
        this.state = {
            phoneStatus: 0,
            phone:'',
            isSubmitted: false,
        }
    }

    renderSubmit(){
        if (this.state.isSubmitted){
            return(
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <DoubleBounce size={20} color="#B7264B" style={{ alignSelf: 'center' }} />
                </View>
            )
        }

        return (
            <Button onPress={() => this.onCheckPhone()} style={styles.loginBtn}>
                <Text style={styles.btnTxt}>{ i18n.t('next') }</Text>
            </Button>
        );
    }

	onCheckPhone(){
		this.setState({ isSubmitted: true });
		axios.post(CONST.url + 'forget_password' ,{
			phone: this.state.phone,
		}).then(response => {
			Toast.show({
				text: response.data.msg,
				type: response.data.status === 200 ? "success" :"danger",
				duration: 3000
			});
			this.setState({ isSubmitted: false , phone:'' });
			this.props.navigation.navigate("verifyCode" , {id:response.data.data.id , code:response.data.data.code});
		})
	}


    render() {
        return (
			<Container style={styles.container}>
				<TouchableOpacity style={styles.authBack} onPress={() => this.props.navigation.goBack()}>
					<Icon type={'FontAwesome'} name={'angle-right'} style={[styles.transform, styles.rightHeaderIcon ]} />
				</TouchableOpacity>
				<Content contentContainerStyle={styles.flexGrow}>
					<View style={styles.imageBackgroundStyle}>
						<Animatable.View animation="zoomIn" duration={1400}>
							<Image source={require('../../assets/images/logo.png')} style={styles.logoStyle} resizeMode={'contain'} />
						</Animatable.View>

						<View style={styles.loginFormContainerStyle}>
							<KeyboardAvoidingView behavior={'padding'} style={styles.keyboardAvoid}>
								<Form  style={[styles.w100 , styles.ph25 ]}>
									<Text style={styles.authTitle}>{ i18n.t('recoverPass') }</Text>
									<Text style={styles.authDesc}>{ i18n.t('confirmNum') }</Text>

									<View style={styles.itemView}>
										<Item floatingLabel style={styles.loginItem} bordered>
											<Label style={styles.label}>{ i18n.t('phoneNumber') }</Label>
											<Input onChangeText={(phone) => this.setState({phone})} keyboardType={'number-pad'} style={styles.input}  />
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

export default ForgetPassword;