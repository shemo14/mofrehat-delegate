import React, { Component } from "react";
import {
    View,
    Text,
    Dimensions,
    ImageBackground,
    Animated,
    KeyboardAvoidingView, I18nManager, Image
} from "react-native";
import {Container, Content, Icon, Header, Right, Left, Button} from 'native-base'
import styles from '../../assets/styles'
import i18n from '../../locale/i18n'
import * as Permissions from 'expo-permissions';
import MapView from 'react-native-maps';



const height = Dimensions.get('window').height;
const IS_IPHONE_X = height === 812 || height === 896;


class Location extends Component {
    constructor(props){
        super(props);

        this.state={
            status: null,
            backgroundColor: new Animated.Value(0),
            availabel: 0,
            oldPass:'',
            newPass:'',
            reNewPass:'',
            latitude: 37.78825,
            longitude: -122.4324,
        }
    }

    componentWillMount() {
        this.setState({latitude: this.props.navigation.state.params.lat,
            longitude:  this.props.navigation.state.params.long,})
        console.log('this.props.navigation.state.params.lat' , this.props.navigation.state.params.lat , 'this.props.navigation.state.params.long' , this.props.navigation.state.params.long)
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
                        <Text style={[styles.headerText , styles.headerTitle]}>{i18n.t('location')}</Text>
                        <Left style={styles.flex0}/>
                    </Animated.View>
                </Header>
                <Content  contentContainerStyle={styles.flexGrow} style={[styles.homecontent ]}  onScroll={e => this.headerScrollingAnimation(e) }>
                    <ImageBackground source={  I18nManager.isRTL ? require('../../assets/images/bg_blue.png') : require('../../assets/images/bg_blue2.png')} resizeMode={'cover'} style={styles.imageBackground}>
                        <View style={[styles.loginFormContainerStyle , styles.whiteBg , {padding:0}]}>
                            <MapView
                                style={styles.mapView}
                                initialRegion={{
                                    latitude: Number(this.state.latitude),
                                    longitude: Number(this.state.longitude),
                                    latitudeDelta: 0.0922,
                                    longitudeDelta: 0.0421,
                                }}
                            >
                                <MapView.Marker
                                                coordinate={({
                                                    latitude: Number(this.state.latitude),
                                                    longitude: Number(this.state.longitude),
                                                })}
                                >
                                    <Image source={require('../../assets/images/location_map.png')} resizeMode={'contain'} style={styles.mapMarker}/>
                                </MapView.Marker>
                            </MapView>
                        </View>
                    </ImageBackground>
                </Content>

            </Container>

        );
    }
}

export default Location;