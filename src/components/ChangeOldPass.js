import React, { Component } from "react";
import {
    View,
    Text,
    Dimensions,
    ImageBackground,
    Animated,
    KeyboardAvoidingView, I18nManager
} from "react-native";
import {Container, Content, Icon, Header, Right, Left, Button, Item, Input, Form, Label} from 'native-base'
import styles from '../../assets/styles'
import i18n from '../../locale/i18n'
import COLORS from '../../src/consts/colors'
import * as Animatable from 'react-native-animatable';



const height = Dimensions.get('window').height;
const IS_IPHONE_X = height === 812 || height === 896;


class ChangeOldPass extends Component {
    constructor(props){
        super(props);

        this.state={
            status: null,
            backgroundColor: new Animated.Value(0),
            availabel: 0,
            oldPass:'',
            newPass:'',
            reNewPass:'',
        }
    }



    static navigationOptions = () => ({
        drawerLabel: () => null
    });



    setAnimate(availabel){
        if (availabel === 0){
            Animated.timing(
                this.state.backgroundColor,
                {
                    toValue: 1,
                    duration: 1000,
                },
            ).start();
            this.setState({ availabel: 1 });
        }else {
            Animated.timing(
                this.state.backgroundColor,
                {
                    toValue: 0,
                    duration: 1000,
                },
            ).start();
            this.setState({ availabel: 0 });
        }

        console.log(availabel);
    }

    headerScrollingAnimation(e){
        if (e.nativeEvent.contentOffset.y > 30){
            console.log(e.nativeEvent.contentOffset.y);
            this.setAnimate(0)
        } else{
            this.setAnimate(1)
        }
    }

    render() {
        const backgroundColor = this.state.backgroundColor.interpolate({
            inputRange: [0, 1],
            outputRange: ['rgba(0, 0, 0, 0)', '#00000099']
        });


        return (
            <Container>
                <Header style={[styles.header , styles.plateformMarginTop]} noShadow>
                    <Animated.View style={[styles.headerView  , styles.animatedHeader ,{ backgroundColor: backgroundColor}]}>
                        <Right style={styles.flex0}>
                            <Button transparent onPress={() => this.props.navigation.goBack()} style={styles.headerBtn}>
                                <Icon type={'FontAwesome'} name={'angle-right'} style={[styles.transform, styles.rightHeaderIcon]} />
                            </Button>
                        </Right>
                        <Text style={[styles.headerText , styles.headerTitle]}>{i18n.t('changePass')}</Text>
                        <Left style={styles.flex0}/>
                    </Animated.View>
                </Header>
                <Content  contentContainerStyle={styles.flexGrow} style={[styles.homecontent ]}  onScroll={e => this.headerScrollingAnimation(e) }>
                        <ImageBackground source={  I18nManager.isRTL ? require('../../assets/images/bg_blue.png') : require('../../assets/images/bg_blue2.png')} resizeMode={'cover'} style={styles.imageBackground}>
                            <View style={[styles.loginFormContainerStyle , styles.whiteBg]}>
                                <KeyboardAvoidingView behavior={'padding'} style={styles.keyboardAvoid}>
                                    <Form style={styles.whiteForm }>
                                        <View style={styles.ph10}>

                                            <Animatable.View animation="zoomIn" duration={1000} style={[styles.itemView ,{borderColor: COLORS.mediumgray}]}>
                                                <Item floatingLabel style={[styles.loginItem,{width:'100%'}]} bordered>
                                                    <Label style={[styles.label , {backgroundColor: '#fff' , color:COLORS.mediumgray , top:15}]}>{ i18n.t('oldPass') }</Label>
                                                    <Input onChangeText={(oldPass) => this.setState({oldPass})} autoCapitalize='none' secureTextEntry style={[styles.input ,{color:COLORS.mediumgray}]}  />
                                                </Item>
                                            </Animatable.View>

                                            <Animatable.View animation="zoomIn" duration={1400} style={[styles.itemView  , styles.inputMarginTop ,{borderColor: COLORS.mediumgray}]}>
                                                <Item floatingLabel style={styles.loginItem} bordered>
                                                    <Label style={[styles.label , {backgroundColor: '#fff' , color:COLORS.mediumgray , top:15}]}>{ i18n.t('newPass') }</Label>
                                                    <Input onChangeText={(newPass) => this.setState({newPass})} autoCapitalize='none' secureTextEntry style={[styles.input ,{color:COLORS.mediumgray}]}  />
                                                </Item>
                                            </Animatable.View>

                                            <Animatable.View animation="zoomIn" duration={1800} style={[ styles.itemView , styles.inputMarginTop ,{borderColor: COLORS.mediumgray}]}>
                                                <Item floatingLabel style={styles.loginItem} bordered>
                                                    <Label style={[styles.label , {backgroundColor: '#fff' , color:COLORS.mediumgray , top:15}]}>{ i18n.t('verifyNewPass') }</Label>
                                                    <Input onChangeText={(verifyNewPass) => this.setState({verifyNewPass})} autoCapitalize='none' secureTextEntry style={[styles.input ,{color:COLORS.mediumgray}]}  />
                                                </Item>
                                            </Animatable.View>
                                        </View>

                                        <Animatable.View animation="flash" duration={2200}>
                                            <Button onPress={() => this.props.navigation.navigate('passCode')} style={[styles.loginBtn ,styles.btnWidth]}>
                                                <Text style={styles.btnTxt}>{ i18n.t('save') }</Text>
                                            </Button>
                                        </Animatable.View>

                                    </Form>
                                </KeyboardAvoidingView>
                            </View>
                        </ImageBackground>
                </Content>

            </Container>

        );
    }
}

export default ChangeOldPass;