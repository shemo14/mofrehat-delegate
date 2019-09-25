import React, { Component } from "react";
import {View, Text, Image, TouchableOpacity, ImageBackground, BackHandler, Linking, AsyncStorage, I18nManager, KeyboardAvoidingView , Platform} from "react-native";
import {Container, Content, Form, Item, Input, Label, Button, Toast, Header, Icon} from 'native-base'
import styles from '../../assets/styles'
import i18n from '../../locale/i18n'
import {DoubleBounce} from "react-native-loader";
import * as Animatable from 'react-native-animatable';


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

        this.props.navigation.navigate("verifyCode" );
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