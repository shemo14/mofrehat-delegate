import React, { Component } from "react";
import {View, Text, Image, TouchableOpacity, I18nManager, Linking, Platform, Dimensions, ImageBackground, Animated,Switch} from "react-native";
import {Container, Content, Icon, Header, Left, Button, Right, Item, Picker} from 'native-base'
import styles from '../../assets/styles'
import i18n from '../../locale/i18n'
import COLORS from '../../src/consts/colors'
import {connect} from "react-redux";
import {DoubleBounce} from "react-native-loader";
import axios from "axios";
import CONST from "../consts";
import {updateProfile , chooseLang} from "../actions";
import * as Animatable from 'react-native-animatable';



const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;
const IS_IPHONE_X = height === 812 || height === 896;


class Settings extends Component {
    constructor(props){
        super(props);

        this.state={
            status: null,
            backgroundColor: new Animated.Value(0),
            availabel: 0,
            value:0,
            SwitchOnValueHolder:false,
            language:this.props.lang
        }
    }

    onChangeLang(value){
        this.setState({ language: value })
        if (this.props.lang != value){
            this.props.chooseLang(value);
        }
    }

    stopNotification = (value) =>{
        this.setState({  SwitchOnValueHolder:!this.state.SwitchOnValueHolder})
    }

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
                        <Text style={[styles.headerText , styles.headerTitle]}>{ i18n.t('settings') }</Text>
                        <Left style={styles.flex0}/>
                    </Animated.View>
                </Header>
                <Content  contentContainerStyle={styles.flexGrow} style={[styles.homecontent ]}  onScroll={e => this.headerScrollingAnimation(e) }>
                    <ImageBackground source={require('../../assets/images/setting_bg.png')} resizeMode={'cover'} style={styles.imageBackground}>
                        <View style={[styles.curvedImg]}>
                            <Image source={require('../../assets/images/setting_pic.png')} style={[styles.headImg , styles.bBLR0]} resizeMode={'cover'} />
                            <View style={styles.overBg}/>
                        </View>
                        <View style={styles.p20}>
                            <Animatable.View animation="fadeInUp" duration={1000} style={styles.directionRowSpace}>
                                <Text style={[styles.type ,{color:COLORS.mediumgray  , fontSize:16 }]}>{ i18n.t('notifications') }</Text>
                                <Switch
                                    onValueChange={(value) => this.stopNotification(value)}
                                    value={this.state.SwitchOnValueHolder}
                                    onTintColor={COLORS.mediumgray}
                                    thumbTintColor={COLORS.labelBackground}
                                    tintColor={'#c5c5c5'}
                                />
                            </Animatable.View>

                            <Animatable.View animation="fadeInUp" duration={1300} style={[styles.line , {borderColor:'#cfcfcf'}]}/>

                            <Animatable.View animation="fadeInUp" duration={1500} style={styles.directionRowSpace}>
                                <Item style={[styles.catPicker ]} regular >
                                    <Picker
                                        mode="dropdown"
                                        style={[styles.pickerLabel, { width: width - 80, marginRight:20 , right:Platform.OS === 'ios' ? 15 : 10 }]}
                                        placeholderStyle={{ color: "#acabae" }}
                                        placeholderIconColor="#acabae"
                                        textStyle={{ color: "#acabae" }}
                                        itemTextStyle={{ color: '#acabae' }}
                                        selectedValue={this.state.language}
                                        onValueChange={(value) => this.onChangeLang(value)}
                                    >
                                        <Picker.Item label={i18n.t('languageSettings')} value={null} />
                                        <Picker.Item label={'العربية'} value={"ar"} />
                                        <Picker.Item label={'English'} value={"en"} />
                                    </Picker>
                                    <Image source={require('../../assets/images/right_arrow_drop.png')}  style={styles.dropArrow} resizeMode={'contain'} />
                                </Item>
                            </Animatable.View>

                            <Animatable.View animation="fadeInUp" duration={1700}>
                                <TouchableOpacity  onPress={() => this.props.navigation.navigate('login')} style={styles.delAcc}>
                                    <Text style={[styles.type ,{color:'#ff3c3c'}]}>{ i18n.t('deleteAcc') }</Text>
                                </TouchableOpacity>
                            </Animatable.View>



                        </View>
                    </ImageBackground>
                </Content>
            </Container>

        );
    }
}

const mapStateToProps = ({ profile, lang }) => {
    return {
        user: profile.user,
        lang: lang.lang
    };
};

export default connect(mapStateToProps, {updateProfile , chooseLang})(Settings);