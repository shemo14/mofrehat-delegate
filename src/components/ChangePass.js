import React, { Component } from "react";
import {View, Text, Image, TouchableOpacity, ImageBackground, BackHandler, Linking, AsyncStorage, I18nManager, KeyboardAvoidingView , Platform} from "react-native";
import {Container, Content, Form, Item, Input, Label, Button, Toast, Header, Icon} from 'native-base'
import styles from '../../assets/styles'
import i18n from '../../locale/i18n'
import {DoubleBounce} from "react-native-loader";
import * as Animatable from 'react-native-animatable';


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
        this.props.navigation.navigate("login" );
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

export default ChangePass;