import React, { Component } from "react";
import {View, Text, Image, TouchableOpacity, ImageBackground, BackHandler, Linking, AsyncStorage, I18nManager, KeyboardAvoidingView , Platform} from "react-native";
import {Container, Content, Form, Item, Input, Label, Button, Toast, Header, Icon} from 'native-base'
import styles from '../../assets/styles'
import i18n from '../../locale/i18n'
import {DoubleBounce} from "react-native-loader";
import * as Animatable from 'react-native-animatable';
import axios from 'axios';
import CONST from "../consts";
import {connect} from "react-redux";


class ChangePass extends Component {
    constructor(props){
        super(props);
        this.state = {
            newPass:'',
            reNewPass:'',
            isSubmitted: false,
        }
    }

    renderSubmit(){
		if (this.state.newPass == '' || this.state.reNewPass == '' ){
			return (
				<Button disabled style={[styles.loginBtn ,styles.btnWidth, { backgroundColor: '#999' }]}>
					<Text style={styles.btnTxt}>{ i18n.t('next') }</Text>
				</Button>
			);
		}

        if (this.state.isSubmitted){
            return(
				<View style={{ justifyContent: 'center', alignItems: 'center' }}>
					<DoubleBounce size={20} color="#B7264B" style={{ alignSelf: 'center' }} />
				</View>
            )
        }

        return (
            <Button onPress={() => this.renewPassword()} style={styles.loginBtn}>
                <Text style={styles.btnTxt}>{ i18n.t('next') }</Text>
            </Button>
        );
    }

	renewPassword() {
		if(this.state.newPass != this.state.reNewPass){
			Toast.show({
				text: i18n.t('verifyPassword'),
				type: "danger",
				duration: 3000
			});
			return false
		}

		const id = this.props.navigation.state.params.id;
		this.setState({ isSubmitted: true });
		axios.post(CONST.url + 'change_password' ,{
			id: id,
			password: this.state.newPass,
			lang:this.props.lang
		}).then(response => {
		    if (response.data.status === 200)
			    this.props.navigation.navigate("login" );

			Toast.show({
				text: response.data.msg,
				type: response.data.status === 200 ? "success" :"danger",
				duration: 3000
			});
		});
    }

    render() {
        return (
            <Container style={styles.container}>

                <Content contentContainerStyle={styles.flexGrow}>
                    <TouchableOpacity style={styles.authBack} onPress={() => this.props.navigation.goBack()}>
                        <Icon type={'FontAwesome'} name={'angle-right'} style={[styles.transform, styles.rightHeaderIcon]} />
                    </TouchableOpacity>
                        <View style={styles.imageBackgroundStyle}>
                            <Animatable.View animation="zoomIn" duration={1400}>
                                <Image source={require('../../assets/images/logo.png')} style={styles.logoStyle} resizeMode={'contain'} />
                            </Animatable.View>

                            <View style={styles.loginFormContainerStyle}>
                                <KeyboardAvoidingView behavior={'padding'} style={styles.keyboardAvoid}>
                                    <Form style={[styles.w100 , styles.ph25 ]}>
                                        <Text style={styles.authTitle}>{ i18n.t('recoverPass') }</Text>
                                        <Text style={styles.authDesc}>{ i18n.t('changePassText') }</Text>

                                        <View style={[ styles.itemView ]}>
                                            <Item floatingLabel style={styles.loginItem} bordered>
                                                <Label style={[styles.label]}>{ i18n.t('newPass') }</Label>
                                                <Input autoCapitalize='none' onChangeText={(newPass) => this.setState({newPass})} secureTextEntry style={styles.input}  />
                                            </Item>
                                        </View>

                                        <View style={[ styles.itemView , styles.inputMarginTop ]}>
                                            <Item floatingLabel style={styles.loginItem} bordered>
                                                <Label style={[styles.label]}>{ i18n.t('verifyNewPass') }</Label>
                                                <Input autoCapitalize='none' onChangeText={(reNewPass) => this.setState({reNewPass})} secureTextEntry style={styles.input}  />
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

const mapStateToProps = ({ profile, lang }) => {
	return {
		user: profile.user,
		lang: lang.lang,
	};
};
export default connect(mapStateToProps, {})(ChangePass);