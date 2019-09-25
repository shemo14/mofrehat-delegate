import React, { Component } from "react";
import {View, Text, Image, TouchableOpacity, I18nManager, FlatList, Platform, Dimensions, ImageBackground, Animated,ScrollView} from "react-native";
import {Container, Content, Icon, Header, List, Right, Left, Button, Item, Input} from 'native-base'
import styles from '../../assets/styles'
import i18n from '../../locale/i18n'
import COLORS from '../../src/consts/colors'
import { DoubleBounce } from 'react-native-loader';
import FooterSection from './FooterSection';
import RBSheet from "react-native-raw-bottom-sheet";
import DrawerCustomization from '../routes/DrawerCustomization';
import * as Animatable from 'react-native-animatable';
import {connect} from "react-redux";
import {getOrders , profile , deleteOrder} from "../actions";



const height = Dimensions.get('window').height;
const IS_IPHONE_X = height === 812 || height === 896;


class MyOrders extends Component {
    constructor(props){
        super(props);

        this.state={
            status: null,
            backgroundColor: new Animated.Value(0),
            availabel: 0,
            orderType:0
        }
    }



    static navigationOptions = () => ({
        drawerLabel: () => null
    });


    componentWillMount() {
        this.getOrders(0);
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

    getOrders(type){
        this.setState({orderType:type})
        const token =  this.props.user ?  this.props.user.token : null;
        this.props.getOrders( this.props.lang , type , token )
    }

    deleteOrder(order_id){
        const token =  this.props.user ?  this.props.user.token : null;
        const type = this.state.orderType;
        this.props.deleteOrder( this.props.lang , order_id , token , type )
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
    closeDrawer(){
        this.RBSheet.close()
    }

    renderImages(images){
        let view = ( <View /> );
        if(images[0]){
            view = (
                <View>
                    <Image source={{ uri: images[0] }}
                           style={[styles.scrollImg2]}
                           resizeMode={'cover'}/>
                </View>
            )
        }

        if(images[1]){
            view = (
                <View>
                    <Image source={{ uri: images[0] }}
                           style={[styles.scrollImg2, {position: 'absolute', left: 10}]}
                           resizeMode={'cover'}/>
                    <Image source={{ uri: images[1] }}
                           style={styles.scrollImg2} resizeMode={'cover'}/>
                </View>
            )
        }

        if(images[2]){
            view = (
                <View>
                    <Image source={{ uri: images[0] }}
                           style={[styles.scrollImg2, {position: 'absolute', left: 10}]}
                           resizeMode={'cover'}/>
                    <Image source={{ uri: images[1] }}
                           style={styles.scrollImg2} resizeMode={'cover'}/>
                    <Image ssource={{ uri: images[2] }}
                           style={[styles.scrollImg2, {position: 'absolute', right: 10}]}
                           resizeMode={'cover'}/>
                </View>
            )
        }

            return view;
    }

    renderOrders(){
        if(this.state.orderType === 0){
            return(
                <View style={styles.flatContainer}>

                    {

                        this.props.myOrders.map((myOrder, i) => (
                            <Animatable.View key={i} animation="zoomIn" duration={1000} style={[styles.scrollParent2 , styles.orderProduct ]}>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('newOrderDet', { id: myOrder.id })}>
                                    { this.renderImages(myOrder.images) }
                                </TouchableOpacity>
                                <Image source={require('../../assets/images/orange_circle.png')} style={styles.orangeCircle} resizeMode={'contain'} />
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('newOrderDet')}>
                                    <Text style={[styles.type ,{color:COLORS.boldgray}]}>{myOrder.order_no}</Text>
                                </TouchableOpacity>
                                {/*<Text style={[styles.type ,{color:COLORS.mediumgray}]}>التصنيف</Text>*/}
                                <Text style={[styles.headerText ,{color:COLORS.labelBackground}]}>{myOrder.price}</Text>
                            </Animatable.View>

                        ))
                    }

                </View>
            )
        } else if(this.state.orderType === 1){
            return(
                <View style={styles.flatContainer}>
                    {

                        this.props.myOrders.map((myOrder, i) => (
                            <Animatable.View key={i} animation="zoomIn" duration={1000} style={[styles.scrollParent2 , styles.orderProduct ]}>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('newOrderDet', { id: myOrder.id })}>
                                    { this.renderImages(myOrder.images) }
                                </TouchableOpacity>
                                <Image source={require('../../assets/images/orange_circle.png')} style={styles.orangeCircle} resizeMode={'contain'} />
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('newOrderDet')}>
                                    <Text style={[styles.type ,{color:COLORS.boldgray}]}>{myOrder.order_no}</Text>
                                </TouchableOpacity>
                                {/*<Text style={[styles.type ,{color:COLORS.mediumgray}]}>التصنيف</Text>*/}
                                <Text style={[styles.headerText ,{color:COLORS.labelBackground}]}>{myOrder.price}</Text>
                            </Animatable.View>
                        ))
                    }
                </View>
            )
        } else {
            return(
                <View style={styles.flatContainer}>
                    {

                        this.props.myOrders.map((myOrder, i) => (
                            <Animatable.View key={i} animation="zoomIn" duration={1000} style={[styles.scrollParent2 , styles.orderProduct ]}>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('newOrderDet', { id: myOrder.id })}>
                                    { this.renderImages(myOrder.images) }
                                </TouchableOpacity>
                                <Image source={require('../../assets/images/orange_circle.png')} style={styles.orangeCircle} resizeMode={'contain'} />
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('newOrderDet')}>
                                    <Text style={[styles.type ,{color:COLORS.boldgray}]}>{myOrder.order_no}</Text>
                                </TouchableOpacity>
                                {/*<Text style={[styles.type ,{color:COLORS.mediumgray}]}>التصنيف</Text>*/}
                                <Text style={[styles.headerText ,{color:COLORS.labelBackground}]}>{myOrder.price}</Text>
                                <TouchableOpacity onPress={() => this.deleteOrder(myOrder.id)} style={{alignSelf:'flex-end'}}>
                                    <Image source={require('../../assets/images/dustbin_red.png')} style={styles.headerMenu} resizeMode={'contain'} />
                                </TouchableOpacity>
                            </Animatable.View>

                        ))
                    }
                </View>
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
                        <Right style={styles.flex0}>
                            <Button transparent onPress={() => this.RBSheet.open()} style={styles.headerBtn}>
                                <Image source={require('../../assets/images/menu.png')} style={[styles.headerMenu , styles.transform]} resizeMode={'contain'} />
                            </Button>
                        </Right>
                        <Text style={[styles.headerText , styles.headerTitle]}>{ i18n.t('myOrders') }</Text>
                        <Left style={styles.flex0}/>
                    </Animated.View>
                </Header>
                <Content  contentContainerStyle={styles.flexGrow} style={styles.homecontent}  onScroll={e => this.headerScrollingAnimation(e) }>
                    { this.renderLoader() }
                    <ImageBackground source={  I18nManager.isRTL ? require('../../assets/images/bg_blue_big.png') : require('../../assets/images/bg_blue_big2.png')} resizeMode={'cover'} style={styles.imageBackground}>
                        <View style={Platform.OS === 'ios' ? styles.mt90 : styles.mT70}>

                            <View style={styles.orderTabs}>
                                 <TouchableOpacity onPress={ () => this.getOrders(0)} style={this.state.orderType === 0 ? styles.activeTab : styles.normalTab}>
                                     <Text style={this.state.orderType === 0 ? styles.activeTabText :styles.normalTabText} >{ i18n.t('newOrd') }</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={ () => this.getOrders(1)} style={this.state.orderType === 1 ? styles.activeTab : styles.normalTab}>
                                    <Text style={this.state.orderType === 1 ? styles.activeTabText :styles.normalTabText} >{ i18n.t('underway') }</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={ () => this.getOrders(2)} style={this.state.orderType === 2?  styles.activeTab : styles.normalTab}>
                                    <Text style={this.state.orderType === 2 ? styles.activeTabText :styles.normalTabText} >{ i18n.t('implementedOrd') }</Text>
                                </TouchableOpacity>
                            </View>

                            { this.renderOrders() }

                        </View>
                    </ImageBackground>
                </Content>

                <FooterSection routeName={'myOrders'} navigation={this.props.navigation}/>
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
                    <DrawerCustomization routeName={'myOrders'} onClose={() => this.closeDrawer()} navigation={this.props.navigation}/>
                </RBSheet>
            </Container>

        );
    }
}
const mapStateToProps = ({lang ,  myOrders , profile }) => {
    return {
        lang: lang.lang,
        myOrders: myOrders.myOrders,
        loader: myOrders.loader,
        user: profile.user,
    };
};
export default connect(mapStateToProps, {getOrders , profile , deleteOrder})(MyOrders);