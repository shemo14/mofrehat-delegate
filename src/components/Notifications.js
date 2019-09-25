import React, { Component } from "react";
import {View, Text, Image, TouchableOpacity, Dimensions, ImageBackground, Animated, I18nManager} from "react-native";
import {Container, Content, Icon, Header,Button} from 'native-base'
import styles from '../../assets/styles'
import i18n from '../../locale/i18n'
import COLORS from '../../src/consts/colors'
import { DoubleBounce } from 'react-native-loader';
import FooterSection from './FooterSection';
import RBSheet from "react-native-raw-bottom-sheet";
import DrawerCustomization from '../routes/DrawerCustomization';
import * as Animatable from 'react-native-animatable';



const height = Dimensions.get('window').height;
const IS_IPHONE_X = height === 812 || height === 896;


class Notifications extends Component {
    constructor(props){
        super(props);

        this.state={
            status: null,
            backgroundColor: new Animated.Value(0),
            availabel: 0,
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
    closeDrawer(){
        this.RBSheet.close()
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
                        <Button transparent onPress={() => this.RBSheet.open()} style={styles.headerBtn}>
                            <Image source={require('../../assets/images/menu.png')} style={[styles.headerMenu , styles.transform]} resizeMode={'contain'} />
                        </Button>
                        <Text style={[styles.headerText , styles.t15]}>{ i18n.t('notifications') }</Text>
                        <Button onPress={() => this.props.navigation.navigate('cart')} transparent  style={styles.headerBtn}>
                            <Image source={require('../../assets/images/shopping_cart.png')} style={styles.headerMenu} resizeMode={'contain'} />
                        </Button>
                    </Animated.View>
                </Header>
                <Content  contentContainerStyle={styles.flexGrow} style={styles.homecontent}  onScroll={e => this.headerScrollingAnimation(e) }>
                    <ImageBackground source={  I18nManager.isRTL ? require('../../assets/images/bg_blue_big.png') : require('../../assets/images/bg_blue_big2.png')} resizeMode={'cover'} style={styles.imageBackground}>
                        <View style={[ styles.mt90 , styles.ph25]}>

                            <Animatable.View animation="fadeInUp" duration={1000} style={styles.notiBlock}>
                                <View style={styles.notiBorder}/>
                                <View style={[styles.directionRowSpace ,styles.mb5]}>
                                    <Text style={[styles.termsText , {color:COLORS.boldgray , fontSize:14}]}>تنبيه من الاداره</Text>
                                    <TouchableOpacity >
                                        <Image source={require('../../assets/images/error.png')} style={styles.error} resizeMode={'contain'} />
                                    </TouchableOpacity>
                                </View>

                                <Text style={[styles.type ,{color:COLORS.mediumgray , lineHeight:22,  writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr'}]}>التصنيف التصنيف التصنيف التصنيف التصنيف التصنيف التصنيف التصنيف التصنيف التصنيف التصنيف </Text>
                            </Animatable.View>
                            <Animatable.View animation="fadeInUp" duration={1000} style={styles.notiBlock}>
                                <View style={styles.notiBorder}/>
                                <View style={[styles.directionRowSpace ,styles.mb5]}>
                                    <Text style={[styles.termsText , {color:COLORS.boldgray , fontSize:14}]}>تنبيه من الاداره</Text>
                                    <TouchableOpacity >
                                        <Image source={require('../../assets/images/error.png')} style={styles.error} resizeMode={'contain'} />
                                    </TouchableOpacity>
                                </View>

                                <Text style={[styles.type ,{color:COLORS.mediumgray , lineHeight:22,  writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr'}]}>التصنيف التصنيف التصنيف التصنيف التصنيف التصنيف التصنيف </Text>
                            </Animatable.View>
                            <Animatable.View animation="fadeInUp" duration={1000} style={styles.notiBlock}>
                                <View style={styles.notiBorder}/>
                                <View style={[styles.directionRowSpace ,styles.mb5]}>
                                    <Text style={[styles.termsText , {color:COLORS.boldgray , fontSize:14}]}>تنبيه من الاداره</Text>
                                    <TouchableOpacity >
                                        <Image source={require('../../assets/images/error.png')} style={styles.error} resizeMode={'contain'} />
                                    </TouchableOpacity>
                                </View>

                                <Text style={[styles.type ,{color:COLORS.mediumgray , lineHeight:22,  writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr'}]}>التصنيف التصنيف التصنيف التصنيف التصنيف التصنيف التصنيف </Text>
                            </Animatable.View>
                            <Animatable.View animation="fadeInUp" duration={1000} style={styles.notiBlock}>
                                <View style={styles.notiBorder}/>
                                <View style={[styles.directionRowSpace ,styles.mb5]}>
                                    <Text style={[styles.termsText , {color:COLORS.boldgray , fontSize:14}]}>تنبيه من الاداره</Text>
                                    <TouchableOpacity >
                                        <Image source={require('../../assets/images/error.png')} style={styles.error} resizeMode={'contain'} />
                                    </TouchableOpacity>
                                </View>

                                <Text style={[styles.type ,{color:COLORS.mediumgray , lineHeight:22,  writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr'}]}>التصنيف التصنيف التصنيف التصنيف التصنيف التصنيف التصنيف </Text>
                            </Animatable.View>
                            <Animatable.View animation="fadeInUp" duration={1000} style={styles.notiBlock}>
                                <View style={styles.notiBorder}/>
                                <View style={[styles.directionRowSpace ,styles.mb5]}>
                                    <Text style={[styles.termsText , {color:COLORS.boldgray , fontSize:14}]}>تنبيه من الاداره</Text>
                                    <TouchableOpacity >
                                        <Image source={require('../../assets/images/error.png')} style={styles.error} resizeMode={'contain'} />
                                    </TouchableOpacity>
                                </View>

                                <Text style={[styles.type ,{color:COLORS.mediumgray , lineHeight:22,  writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr'}]}>التصنيف التصنيف التصنيف التصنيف التصنيف التصنيف التصنيف </Text>
                            </Animatable.View>

                        </View>
                    </ImageBackground>
                </Content>

                <FooterSection routeName={'notifications'} navigation={this.props.navigation}/>
                {/*drawer content*/}
                <RBSheet
                    ref={ref => {
                        this.RBSheet = ref;
                    }}
                    height={400}
                    duration={350}
                    customStyles={{
                        container: styles.drawerCont
                    }}
                >
                    <DrawerCustomization onClose={() => this.closeDrawer()} navigation={this.props.navigation}/>
                </RBSheet>
            </Container>

        );
    }
}

export default Notifications;