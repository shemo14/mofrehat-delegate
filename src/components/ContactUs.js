import React, { Component } from "react";
import {View, Text, Image, TouchableOpacity, I18nManager, Linking, Platform, Dimensions, ImageBackground, Animated,} from "react-native";
import {Container, Content, Icon, Header, List, ListItem, Left, Button, Item, Input, Right} from 'native-base'
import styles from '../../assets/styles'
import i18n from '../../locale/i18n'
import COLORS from '../../src/consts/colors'
import { DoubleBounce } from 'react-native-loader';
import {connect} from "react-redux";
import Communications from 'react-native-communications';
import * as Animatable from 'react-native-animatable';
import {getContactUs} from "../actions";
import contactUs from "../reducers/ContactUsReducer";



const height = Dimensions.get('window').height;
const IS_IPHONE_X = height === 812 || height === 896;


class ContactUs extends Component {
    constructor(props){
        super(props);

        this.state={
            status: null,
            backgroundColor: new Animated.Value(0),
            availabel: 0,
            value:0,
        }
    }


    componentWillMount() {
        this.props.getContactUs( this.props.lang )
    }

    renderLoader(){
        if (this.props.loader){
            return(
                <View style={{ alignItems: 'center', justifyContent: 'center', height: height , alignSelf:'center' , backgroundColor:'#fff' , width:'100%' , position:'absolute' , zIndex:1  }}>
                    <DoubleBounce size={20} color={COLORS.labelBackground} />
                </View>
            );
        }
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


    _linkPressed (url){
        Linking.openURL(url);
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
                        <Text style={[styles.headerText , styles.headerTitle]}>{ i18n.t('contactUs') }</Text>
                        <Left style={styles.flex0}/>
                    </Animated.View>
                </Header>
                <Content  contentContainerStyle={styles.flexGrow} style={[styles.homecontent ]}  onScroll={e => this.headerScrollingAnimation(e) }>
                    { this.renderLoader() }
                    <ImageBackground source={require('../../assets/images/contact_bg.png')} resizeMode={'cover'} style={styles.imageBackground}>
                        <View style={[styles.curvedImg]}>
                            <Image source={require('../../assets/images/contact_pic.png')} style={[styles.headImg , styles.bBLR0]} resizeMode={'cover'} />
                            <View style={styles.overBg}/>
                        </View>
                        <View style={styles.p20}><Animatable.View animation={I18nManager.isRTL ? "fadeInRight" : "fadeInLeft"} duration={1000}>
                            <TouchableOpacity style={styles.directionRow} onPress={() => Communications.phonecall(this.props.phone, true)}>
                                <Image source={require('../../assets/images/smartphone.png')} style={[styles.headerMenu ,styles.mr10]} resizeMode={'contain'} />
                                <Text style={[styles.type ,{color:COLORS.mediumgray , fontSize:16 }]}>{this.props.phone}</Text>
                            </TouchableOpacity>
                        </Animatable.View>

                            <View style={[styles.line , {borderColor:'#cfcfcf'}]}/>
                            <Animatable.View animation={I18nManager.isRTL ? "fadeInRight" : "fadeInLeft"} duration={1400}>
                                <TouchableOpacity  style={styles.directionRow} onPress={()=> Communications.email(this.props.mail , null , null , null , null)}>
                                    <Image source={require('../../assets/images/internet.png')} style={[styles.headerMenu ,styles.mr10]} resizeMode={'contain'} />
                                    <Text style={[styles.type ,{color:COLORS.mediumgray  , fontSize:16 }]}>{this.props.mail}</Text>
                                </TouchableOpacity>
                            </Animatable.View>

                            <View style={[styles.line , {borderColor:'#cfcfcf'}]}/>

                            {
                                this.props.socials.map((soc, i) => (
                                        <View key={i}>
                                            <Animatable.View animation={I18nManager.isRTL ? "fadeInRight" : "fadeInLeft"}
                                                             duration={1800}>
                                                <TouchableOpacity style={styles.directionRow}
                                                                  onPress={() => this._linkPressed(soc.url)}>
                                                    <Image source={{ uri: soc.logo }}
                                                           style={[styles.headerMenu, styles.mr10]} resizeMode={'contain'}/>
                                                    <Text style={[styles.type, {
                                                        color: COLORS.mediumgray,
                                                        fontSize: 16
                                                    }]}>{soc.name}</Text>
                                                </TouchableOpacity>
                                            </Animatable.View>

                                            < View style={[styles.line , {borderColor:'#cfcfcf'}]}/>
                                        </View>
                                    )
                                )
                            }


                        </View>
                    </ImageBackground>
                </Content>
            </Container>

        );
    }
}


const mapStateToProps = ({ lang , contactUs }) => {
    return {
        lang: lang.lang,
        phone: contactUs.phone,
        mail: contactUs.mail,
        socials: contactUs.socials,
        loader: contactUs.loader
    };
};
export default connect(mapStateToProps, {getContactUs})(ContactUs);