import React, { Component } from "react";
import {View, Text, Image, TouchableOpacity, ImageBackground, BackHandler, Linking, AsyncStorage, I18nManager, KeyboardAvoidingView , Platform} from "react-native";
import {Container, Content, Form, Item, Input, Label, Button, Toast, Header, Icon} from 'native-base'
import styles from '../../assets/styles'
import i18n from '../../locale/i18n'
import {DoubleBounce} from "react-native-loader";
import * as Animatable from 'react-native-animatable';


class VerifyCode extends Component {
    constructor(props){
        super(props);
        this.state = {
            isSubmitted: false,
            activeCode: ''
        }
    }

    componentWillMount() {
		const {code, id} = this.props.navigation.state.params;
		alert(code);
	}

	renderSubmit(){
        if (this.state.isSubmitted){
            return(
                <DoubleBounce size={20} color="#B7264B" />
            )
        }

        return (
            <Button onPress={() => this.onNextPressed()} style={styles.loginBtn}>
                <Text style={styles.btnTxt}>{ i18n.t('next') }</Text>
            </Button>
        );
    }

    onNextPressed() {
		const {code, id} = this.props.navigation.state.params;
        if (this.state.activeCode == code ){
			 this.props.navigation.navigate("changePass", { id } );
        }else{
			Toast.show({
				text: i18n.t('codeNotCorrect'),
				type: "danger",
				duration: 3000
			});
        }
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
									<Text style={styles.authTitle}>{ i18n.t('recoverPass') }</Text>
									<Text style={styles.authDesc}>{ i18n.t('verifyText') }</Text>

									<View style={styles.itemView}>
										<Item floatingLabel style={styles.loginItem} bordered>
											<Label style={styles.label}>{ i18n.t('verifyCode') }</Label>
											<Input onChangeText={(activeCode) => this.setState({activeCode})} keyboardType={'number-pad'} style={styles.input}  />
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

export default VerifyCode;