import React, { Component } from "react";
import {View, Text, Image, TouchableOpacity, I18nManager, FlatList, Platform, Dimensions, ImageBackground, Animated,} from "react-native";
import {
    Container,
    Content,
    Icon,
    Header,
    List,
    ListItem,
    Left,
    Button,
    Item,
    Input,
    Right,
    CheckBox,
    Form, Label, Textarea
} from 'native-base'
import styles from '../../assets/styles'
import i18n from '../../locale/i18n'
import COLORS from '../../src/consts/colors'
import { DoubleBounce } from 'react-native-loader';
import * as Animatable from 'react-native-animatable';
import { getSuggestions, profile} from "../actions";
import {connect} from "react-redux";



const height = Dimensions.get('window').height;
const IS_IPHONE_X = height === 812 || height === 896;


class Complaints extends Component {
    constructor(props){
        super(props);

        this.state={
            status: null,
            backgroundColor: new Animated.Value(0),
            availabel: 0,
            value:0,
            proposalTitle:'',
            msg:'',
        }
    }

    sendSugg(){
        const token =  this.props.user ?  this.props.user.token : null;
        const title = this.state.proposalTitle;
        const msg = this.state.msg;
        this.props.getSuggestions( this.props.lang , title , msg , token );
        this.props.navigation.navigate('notifications')
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
                        <Text style={[styles.headerText , styles.headerTitle]}>{ i18n.t('complaints') }</Text>
                        <Left style={styles.flex0}/>
                    </Animated.View>
                </Header>
                <Content  contentContainerStyle={styles.flexGrow} style={[styles.homecontent ]}  onScroll={e => this.headerScrollingAnimation(e) }>
                    <ImageBackground source={require('../../assets/images/rules_bg.png')} resizeMode={'cover'} style={styles.imageBackground}>

                        <View style={[styles.curvedImg]}>
                            <Image source={require('../../assets/images/rules.png')} style={[styles.headImg , styles.bBLR0]} resizeMode={'cover'} />
                            <View style={styles.overBg}/>
                        </View>

                        <View style={styles.p20}>
                            <View style={styles.mb20}>
                                <Text style={[styles.termsText , styles.aSFS , {color:COLORS.boldgray , fontSize:14,  writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr'}]}>{ i18n.t('compText') }</Text>
                            </View>
                            <View style={[styles.itemView ,{borderColor: COLORS.mediumgray}]}>
                                <Item floatingLabel style={[styles.loginItem,{width:'100%'}]} bordered>
                                    <Label style={[styles.label , {backgroundColor: '#fff' , color:COLORS.mediumgray , top:15 , left:12}]}>{ i18n.t('proposalTitle') }</Label>
                                    <Input onChangeText={(proposalTitle) => this.setState({proposalTitle})} autoCapitalize='none' style={[styles.input ,{color:COLORS.mediumgray}]}  />
                                </Item>
                            </View>
                            <View style={[styles.mt15, styles.mb10]} >
                                <Textarea
                                    placeholder={ i18n.t('noteDetails') }
                                    value={this.state.msg} onChangeText={(msg) => this.setState({msg})}
                                    autoCapitalize='none'
                                    style={[styles.textArea]}
                                    placeholderTextColor={COLORS.mediumgray}
                                />
                            </View>

                            <Animatable.View animation="flash" duration={1000}>
                                <Button onPress={() => this.sendSugg()} style={[styles.loginBtn , styles.mt15 , {alignSelf:'flex-end'}]}>
                                    <Text style={styles.btnTxt}>{ i18n.t('sendButton') }</Text>
                                </Button>
                            </Animatable.View>
                        </View>

                    </ImageBackground>
                </Content>
            </Container>

        );
    }
}

const mapStateToProps = ({ lang , suggestions, profile }) => {
    return {
        lang: lang.lang,
        suggestions: suggestions.suggestions,
        loader: suggestions.loader,
        user: profile.user,
    };
};
export default connect(mapStateToProps, { profile  , getSuggestions })(Complaints);