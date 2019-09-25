import React, { Component } from "react";
import {View, Text, Image, TouchableOpacity, I18nManager,  Platform, Dimensions, ScrollView, Animated,Slider } from "react-native";
import {Container, Content, Icon, Header,  Button,  CheckBox} from 'native-base'
import styles from '../../assets/styles'
import i18n from '../../locale/i18n'
import COLORS from '../../src/consts/colors'
import { DoubleBounce } from 'react-native-loader';
import Swiper from 'react-native-swiper';
import ImageViewer from 'react-native-image-zoom-viewer';
import Modal from "react-native-modal";
import Communications from "react-native-communications";
import * as Animatable from 'react-native-animatable';
import {NavigationEvents} from "react-navigation";
import {getNewOrder, profile , acceptOrder , getReportsReasons , setReport} from "../actions";
import {connect} from "react-redux";


const height = Dimensions.get('window').height;
const IS_IPHONE_X = height === 812 || height === 896;



class NewOrderDet extends Component {
    constructor(props){
        super(props);

        this.state={
            status: null,
            backgroundColor: new Animated.Value(0),
            availabel: 0,
            value:0,
            fancyModal: false,
            reportModal: false,
            checkedReason: false,
            selectedId: 1,
        }
    }

    static navigationOptions = () => ({
        drawerLabel: () => null
    });

    componentWillMount() {
        const token =  this.props.user ?  this.props.user.token : null;
        this.props.getNewOrder( this.props.lang , this.props.navigation.state.params.id , token )
        this.props.getReportsReasons( this.props.lang  , token )
    }
    reportModal = () => {
        this.setState({ reportModal: !this.state.reportModal });
    };

    checkReason(reasonId){
        this.setState({ selectedId: reasonId });

    }
    sendReport(){
        const token =  this.props.user ?  this.props.user.token : null;
        this.props.setReport( this.props.lang , this.props.navigation.state.params.id ,this.state.selectedId  , token )
        this.props.navigation.navigate('myOrders') ;
        this.reportModal()
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


    fancyModal = () => {
        this.setState({ fancyModal: !this.state.fancyModal });
    };

    onFocus(payload){
        this.setState({ status: null });
        this.componentWillMount()
    }
    acceptOrder(){
        const token =  this.props.user ?  this.props.user.token : null;
        this.props.acceptOrder( this.props.lang , this.props.navigation.state.params.id , token )
        this.props.navigation.navigate('myOrders')
    }

    renderBtn(){
        if(this.props.newOrder.status ==0){
            return(
                <Animatable.View animation="flash" duration={1400}>
                    <Button onPress={() => this.acceptOrder()} style={[styles.loginBtn , styles.mb20]}>
                        <Text style={styles.btnTxt}>{ i18n.t('ok') }</Text>
                    </Button>
                </Animatable.View>
            )
        }
        else if(this.props.newOrder.status ==1){
            return(
                <Animatable.View animation="flash" duration={1400}>
                    <Button disabled={true} style={[styles.loginBtn , styles.mb20 , {backgroundColor:'#e5e5e5'}]}>
                        <Text style={[styles.btnTxt , {color:'#888888'}]}>{ i18n.t('hanging') }</Text>
                    </Button>
                </Animatable.View>
            )
        }
        else{
            <View/>
        }
    }

    renderCallOrReport(){
        if(this.props.newOrder.status ==2) {
            return (
                <TouchableOpacity onPress={() => this.reportModal()} style={styles.directionRowCenter}>
                    <Text style={[styles.type , styles.mr10 ,{color:COLORS.darkRed }]}>{ i18n.t('report') }</Text>
                    <Image source={require('../../assets/images/warning.png')} style={[{width:20 , height:20} , styles.transform ]} resizeMode={'contain'} />
                </TouchableOpacity>
            )
        }else {
            return (
                <TouchableOpacity onPress={() => Communications.phonecall(this.props.newOrder.user.phone, true)}
                                  style={styles.directionRowCenter}>
                    <Text style={[styles.type, styles.mr10, {color: COLORS.darkRed}]}>{i18n.t('call')}</Text>
                    <Image source={require('../../assets/images/call.png')}
                           style={[{width: 20, height: 20}, styles.transform]} resizeMode={'contain'}/>
                </TouchableOpacity>
            )
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
                        <Button transparent onPress={() => this.props.navigation.goBack()} style={styles.headerBtn}>
                            <Icon type={'FontAwesome'} name={'angle-right'} style={[styles.transform, styles.rightHeaderIcon]} />
                        </Button>
                        <Text style={[styles.headerText , styles.t15]}>{ i18n.t('orderDet') }</Text>
                        <Button transparent onPress={() => this.fancyModal()} style={styles.headerBtn}>
                            <Image source={require('../../assets/images/zoom.png')} style={[styles.headerMenu , styles.transform]} resizeMode={'contain'} />
                        </Button>
                    </Animated.View>
                </Header>
                <Content  contentContainerStyle={styles.flexGrow} style={styles.homecontent}  onScroll={e => this.headerScrollingAnimation(e) }>
                    <NavigationEvents onWillFocus={payload => this.onFocus(payload)} />
                    { this.renderLoader() }
                    <Swiper horizontal={Platform.OS === 'ios' ? true :false} dotStyle={styles.eventdoteStyle2} activeDotStyle={styles.eventactiveDot2}
                            containerStyle={styles.eventswiper2} showsButtons={false} autoplay={true}>
                        {
                            this.props.newOrder.items.map((item,i) => (
                                <View key={i} style={styles.directionColumn}>
                                    <View style={styles.swiperimageEvent2}>
                                        <Image source={ {uri:item.url} } style={{width:'100%' , height:'100%'}} resizeMode={'cover'}/>
                                    </View>
                                    <View style={styles.prodDet}>
                                        <Text style={[styles.type ,{color:COLORS.boldgray}]}>{item.name}</Text>
                                        <Text style={[styles.type ,{color:COLORS.mediumgray}]}>{item.category}</Text>
                                        <Text style={[styles.type ,{color:COLORS.labelBackground}]}>{ i18n.t('NumberOfItems') } {item.quantity}</Text>
                                        <Animatable.View animation="zoomIn" duration={1000} style={[ styles.availableProduct,styles.pack]}>
                                            <View style={styles.directionRow}>
                                                <Text style={[styles.type ,{color:COLORS.boldgray}]}>{ i18n.t('productPrice') } : </Text>
                                                <Text style={[styles.type ,{color:COLORS.labelBackground}]}>{item.price}</Text>
                                            </View>
                                            <View style={styles.directionRow}>
                                                <Text style={[styles.type ,{color:COLORS.boldgray}]}>{ i18n.t('packagingPrice') } : </Text>
                                                <Text style={[styles.type ,{color:COLORS.labelBackground}]}>{item.package_price}</Text>
                                            </View>
                                        </Animatable.View>

                                        <View style={[styles.desc , styles.mb25 , styles.mt10 ]}>
                                            <Text style={[styles.type , styles.aSFS ,{color:COLORS.boldgray}]}>{ i18n.t('orderSpecification') }</Text>
                                            <Text style={[styles.type , styles.aSFS ,{color:COLORS.mediumgray}]}>{ i18n.t('packingMethod') } : {item.package_name}</Text>
                                            <Text style={[styles.type , styles.aSFS ,{color:COLORS.mediumgray,  writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr'}]}>{item.desc}</Text>
                                        </View>

                                    </View>
                                </View>
                            ))

                        }
                    </Swiper>
                    <View style={styles.prodDet}>

                        <View style={[styles.line , {marginVertical:0}]}/>
                        <View style={[styles.tklfa , { borderColor:COLORS.yellowBorder}]}>
                            <Text style={[styles.type ,{color:COLORS.boldgray}]}>{ i18n.t('fullOrderCost') } : </Text>
                            <Text style={[styles.type ,{color:COLORS.labelBackground}]}>{this.props.newOrder.total}</Text>
                        </View>

                        <View style={[styles.line , {marginVertical:0}]}/>
                        <View style={[styles.tklfa , { borderColor:COLORS.purpleBorder}]}>
                            <Text style={[styles.type ,{color:COLORS.boldgray}]}>{ i18n.t('deliveryPrice') } : </Text>
                            <Text style={[styles.type ,{color:COLORS.labelBackground}]}>{this.props.newOrder.shaping_price}</Text>
                        </View>

                        <View style={[styles.line , {marginVertical:0}]}/>


                        <View style={[styles.desc , styles.mt10 ]}>
                            <Text style={[styles.type , styles.aSFS ,{color:COLORS.boldgray }]}>{ i18n.t('specOfClient') }</Text>
                            <View style={[styles.directionRowSpace , styles.w100 , styles.mb10 ]}>
                                <View style={styles.directionRowCenter}>
                                    <View style={styles.mandob}>
                                        <Image source={{uri:this.props.newOrder.user.avatar}} style={[styles.profileImg , {height:50}]} resizeMode={'cover'} />
                                    </View>
                                    <Text style={[styles.type ,{color:COLORS.labelBackground  }]}>{this.props.newOrder.user.name}</Text>
                                </View>

                                {
                                    this.renderCallOrReport()
                                }


                            </View>
                        </View>

                        <View style={[styles.line , {marginVertical:0}]}/>

                        <View style={[styles.desc , styles.mb25 , styles.mt15 ]}>
                            <Text style={[styles.type , styles.aSFS,{color:COLORS.boldgray }]}>{ i18n.t('deliveryPlace') }</Text>
                            <View style={[styles.directionRowSpace , styles.w100 ]}>
                                <View  style={[ styles.directionRow , styles.mt15]} >
                                    <Image source={require('../../assets/images/marker_gray.png')} style={[styles.headerMenu , styles.mr10]} resizeMode={'contain'} />
                                    <Text style={[styles.type ,{color:COLORS.mediumgray ,  writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr'  , maxWidth:'80%'}]}>{this.props.newOrder.location.address}</Text>
                                </View>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('location' ,{lat:this.props.newOrder.location.lat , long:this.props.newOrder.location.long})} style={{top:8}} >
                                    <Image source={require('../../assets/images/location.png')} style={[styles.headerMenu]} resizeMode={'contain'} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {this.renderBtn()}


                    </View>

                    <Modal style={{}} isVisible={this.state.fancyModal} onBackdropPress={() => this.fancyModal()}>
                        <ImageViewer enableImageZoom={true} onSwipeDown={() => this.fancyModal()} enableSwipeDown={true} imageUrls={this.props.newOrder.items}/>
                    </Modal>

                    <Modal isVisible={this.state.reportModal} onBackdropPress={() => this.reportModal()}>
                        <View style={[styles.reportModal]}>

                            <View style={styles.viewLine}></View>

                            <Text style={[styles.type , styles.mb25 ,{color:COLORS.boldgray , textAlign:'center' }]}>{ i18n.t('reportReason') }</Text>

                            {
                                this.props.reportsReasons.map((reason, i) => (
                                    <View key={i} style={[ styles.directionRow, styles.mb10]}>
                                        <CheckBox onPress={ () => this.checkReason(reason.id)} checked={this.state.selectedId == reason.id ? true : false} color={COLORS.labelBackground}
                                                  style={[styles.checkBox, {borderColor: COLORS.labelBackground}]}/>
                                        <Text style={[styles.type, {color: COLORS.mediumgray}]}>{reason.name}</Text>
                                    </View>
                                ))
                            }

                            <Button onPress={() => this.sendReport() } style={[styles.loginBtn , styles.mt30]}>
                                <Text style={styles.btnTxt}>{ i18n.t('sendButton') }</Text>
                            </Button>

                        </View>
                    </Modal>
                </Content>
            </Container>

        );
    }
}

const mapStateToProps = ({ lang , newOrder, profile , report }) => {
    return {
        lang: lang.lang,
        newOrder: newOrder.newOrder,
        reportsReasons: report.reportsReasons,
        loader: newOrder.loader,
        user: profile.user,
    };
};
export default connect(mapStateToProps, {getNewOrder , profile  , acceptOrder , getReportsReasons , setReport})(NewOrderDet);