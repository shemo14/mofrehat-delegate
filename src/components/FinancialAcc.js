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
import {getFinancial, profile} from "../actions";
import {connect} from "react-redux";
import {NavigationEvents} from "react-navigation";

const height = Dimensions.get('window').height;
const width  = Dimensions.get('window').width;

const IS_IPHONE_X = height === 812 || height === 896;


class FinancialAcc extends Component {
    constructor(props){
        super(props);

        this.state={
            status: null,
            backgroundColor: new Animated.Value(0),
            availabel: 0,
        }
    }

    componentWillMount() {
        const token =  this.props.user ?  this.props.user.token : null;
        this.props.getFinancial( this.props.lang  , token )
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

    renderNoData(){
        if ((this.props.financial).length <= 0){
            return(
                <View style={{ width: width - 50, backgroundColor: '#fff', alignSelf: 'center', alignItems: 'center', justifyContent: 'center', marginTop: 10, height: (70*height)/100 , borderColor: '#ddd', borderWidth: 1 }}>
                    <Image source={require('../../assets/images/empty.png')} resizeMode={'contain'} style={{ justifyContent: 'center', alignSelf: 'center', width: 200, height: 200 }} />
                    <View style={{ flexDirection: 'row', marginTop: 15 }}>
                        <Text style={[styles.type ,{color:COLORS.labelBackground, fontSize: 16, fontWeight: 'bold', fontFamily: I18nManager.isRTL ? 'cairo' : 'openSans' }]}>{i18n.t('noData')}</Text>
                        <Image source={require('../../assets/images/sad-emoji-png.png')} style={{ height: 25, width: 25, marginHorizontal: 5 }} resizeMode={'contain'}/>
                    </View>
                </View>
            );
        }

        return <View />
    }

    _keyExtractor = (item, index) => item.id;

    renderItems = (item) => {
        return(
            <Animatable.View animation="fadeInUp" duration={1000} style={[styles.directionRowSpace , styles.orderDet]}>
                <Text style={[styles.type , {color:COLORS.boldgray , width:'20%' , textAlign: 'center'} ]}>{item.order_id}</Text>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('myOrders')} style={styles.viewOrder}>
                    <Text style={[styles.type  , {color:COLORS.mediumgray } ]}>{ i18n.t('viewOrder') }</Text>
                </TouchableOpacity>
                <Text style={[styles.type , {color:COLORS.labelBackground , width:'20%' , textAlign: 'center'} ]}>{item.price}</Text>
            </Animatable.View>
        );
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
                        <Text style={[styles.headerText , styles.headerTitle]}>{ i18n.t('financialAcc') }</Text>
                        <Left style={styles.flex0}/>
                    </Animated.View>
                </Header>
                <Content  contentContainerStyle={styles.flexGrow} style={styles.homecontent}  onScroll={e => this.headerScrollingAnimation(e) }>
                    { this.renderLoader() }
                    <ImageBackground source={  I18nManager.isRTL ? require('../../assets/images/bg_blue_big.png') : require('../../assets/images/bg_blue_big2.png')} resizeMode={'cover'} style={styles.imageBackground}>
                        <View style={[Platform.OS === 'ios' ? styles.mt90 : styles.mT70 , styles.ph25]}>
                            { this.renderNoData() }
                            {
                                (this.props.financial).length > 0 ? (
                                    <View style={[styles.directionRowSpace , styles.mb10 , styles.ph23]}>
                                        <Text style={[styles.type ]}>{ i18n.t('number') }</Text>
                                        <Text style={[styles.type ]}>{ i18n.t('orderDet') }</Text>
                                        <Text style={[styles.type ]}>{ i18n.t('price') }</Text>
                                    </View>
                                ) : (<View />)
                            }
                            <View style={[styles.flatContainer , {paddingHorizontal:0}]}>
                                <FlatList
                                    data={this.props.financial}
                                    renderItem={({item}) => this.renderItems(item)}
                                    numColumns={1}
                                    keyExtractor={this._keyExtractor}
                                />
                            </View>
                        </View>
                    </ImageBackground>
                </Content>

                <FooterSection routeName={'financialAcc'} navigation={this.props.navigation}/>
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


const mapStateToProps = ({ lang , financial, profile }) => {
    return {
        lang: lang.lang,
        financial: financial.financial,
        loader: financial.loader,
        user: profile.user,
    };
};
export default connect(mapStateToProps, { profile  , getFinancial })(FinancialAcc);