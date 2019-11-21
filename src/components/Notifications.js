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
import axios from "axios";
import CONST from "../consts";
import {connect} from "react-redux";
import {NavigationEvents} from "react-navigation";

const height = Dimensions.get('window').height;
const width  = Dimensions.get('window').width;
const IS_IPHONE_X = height === 812 || height === 896;


class Notifications extends Component {
    constructor(props){
        super(props);

        this.state={
            status: null,
            backgroundColor: new Animated.Value(0),
            availabel: 0,
            notifications: [],
            loader: false
        }
    }

    static navigationOptions = () => ({
        drawerLabel: () => null
    });

    componentWillMount() {
        this.setState({ loader: true })
		axios({
			url: CONST.url + 'notifications',
			method: 'POST',
			headers: { Authorization: this.props.user.token },
		}).then(response => {
			this.setState({ notifications: response.data.data, loader: false  });
		});

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

	renderLoader(){
		if (this.state.loader){
			return(
				<View style={{ alignItems: 'center', justifyContent: 'center', height: height , alignSelf:'center' , backgroundColor:'#fff' , width:'100%' , position:'absolute' , zIndex:1  }}>
					<DoubleBounce size={20} color={COLORS.labelBackground} />
				</View>
			);
		}
	}

    headerScrollingAnimation(e){
        if (e.nativeEvent.contentOffset.y > 30){
            console.log(e.nativeEvent.contentOffset.y);
            this.setAnimate(0)
        } else{
            this.setAnimate(1)
        }
    }

    onDeleteNotification(id){
		axios({
			url: CONST.url + 'delete_notification',
			method: 'POST',
			headers: { Authorization: this.props.user.token },
            data: { notify_id: id }
		}).then(response => {
			this.componentWillMount()
		});
    }

    closeDrawer(){
        this.RBSheet.close()
    }

    navigateToOrder(id){
        if (id)
            this.props.navigation.navigate('newOrderDet', { id })
    }

    onFocus(){
        this.componentWillMount()
    }

    render() {
        const backgroundColor = this.state.backgroundColor.interpolate({
            inputRange: [0, 1],
            outputRange: ['rgba(0, 0, 0, 0)', '#00000099']
        });

        return (
            <Container>
                <NavigationEvents onWillFocus={() => this.onFocus()} />
                <Header style={[styles.header , styles.plateformMarginTop]} noShadow>
                    <Animated.View style={[styles.headerView  , styles.animatedHeader ,{ backgroundColor: backgroundColor}]}>
                        <TouchableOpacity transparent onPress={() => this.RBSheet.open()} style={[styles.headerBtn, { flex: 0.7 }]}>
                            <Image source={require('../../assets/images/menu.png')} style={[styles.headerMenu , styles.transform]} resizeMode={'contain'} />
                        </TouchableOpacity>
                        <Text style={[styles.headerText , styles.t15, { alignSelf: 'center', flex: 5, textAlign: "center" }]}>{ i18n.t('notifications') }</Text>
                    </Animated.View>
                </Header>
                <Content  contentContainerStyle={styles.flexGrow} style={styles.homecontent}  onScroll={e => this.headerScrollingAnimation(e) }>
                    { this.renderLoader() }
                    <ImageBackground source={  I18nManager.isRTL ? require('../../assets/images/bg_blue_big.png') : require('../../assets/images/bg_blue_big2.png')} resizeMode={'cover'} style={styles.imageBackground}>
                        <View style={[ styles.mt90 , styles.ph25]}>
                            {
                                this.state.notifications.map(( notification, i ) => (
									<Animatable.View key={i} animation="fadeInUp" duration={1000} style={styles.notiBlock}>
										<View style={styles.notiBorder}/>
										<TouchableOpacity onPress={() => this.navigateToOrder(notification.order_id)} style={[styles.directionRowSpace ,styles.mb5]}>
											<Text style={[styles.termsText , {color:COLORS.boldgray , fontSize:14}]}>{ notification.title }</Text>
											<TouchableOpacity onPress={() => this.onDeleteNotification(notification.id)}>
												<Image source={require('../../assets/images/error.png')} style={styles.error} resizeMode={'contain'} />
											</TouchableOpacity>
                                        </TouchableOpacity>
										<Text style={[styles.type ,{color:COLORS.mediumgray , lineHeight:22,  writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr'}]}>{ notification.body }</Text>
									</Animatable.View>
                                ))
                            }
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

const mapStateToProps = ({ profile, lang }) => {
	return {
		user: profile.user,
		lang: lang.lang,
	};
};
export default connect(mapStateToProps, {  })(Notifications);