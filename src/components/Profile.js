import React, { Component } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    I18nManager,
    FlatList,
    Platform,
    Dimensions,
    ImageBackground,
    Animated,
    ScrollView,
    KeyboardAvoidingView
} from "react-native";
import {Container, Content, Icon, Header, List, Right, Left, Button, Item, Input, Label, Form} from 'native-base'
import styles from '../../assets/styles'
import i18n from '../../locale/i18n'
import COLORS from '../../src/consts/colors'
import { DoubleBounce } from 'react-native-loader';
import FooterSection from './FooterSection';
import RBSheet from "react-native-raw-bottom-sheet";
import DrawerCustomization from '../routes/DrawerCustomization';
import Modal from "react-native-modal";
import * as Permissions from 'expo-permissions';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import * as Animatable from 'react-native-animatable';



const height = Dimensions.get('window').height;
const IS_IPHONE_X = height === 812 || height === 896;


class Profile extends Component {
    constructor(props){
        super(props);

        this.state={
            status: null,
            backgroundColor: new Animated.Value(0),
            availabel: 0,
            profileType:0,
            fullName: '',
            mail: '',
            phone: '',
            userImage: null,
            base64: null,
            personalImg: '',
            location: '',
            isModalVisible: false,
            city: '',
            mapRegion: null,
            hasLocationPermissions: false,
            initMap: true,
            plateImg: '',
            vehicleLicenses: '',
        }
    }



    askPermissionsAsync = async () => {
        await Permissions.askAsync(Permissions.CAMERA);
        await Permissions.askAsync(Permissions.CAMERA_ROLL);

    };

    _personalImage = async () => {

        this.askPermissionsAsync();

        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
            base64:true,

        });

        let localUri = result.uri;
        let filename = localUri.split('/').pop();
        console.log(result);

        // check if there is image then set it and make button not disabled
        if (!result.cancelled) {
            this.setState({ userImage: result.uri ,base64:result.base64 ,personalImg:filename});
        }
    };



    _plateImage = async () => {

        this.askPermissionsAsync();

        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
            base64:true,

        });

        let localUri = result.uri;
        let filename = localUri.split('/').pop();
        console.log(result);

        // check if there is image then set it and make button not disabled
        if (!result.cancelled) {
            this.setState({ userImage: result.uri ,base64:result.base64 ,plateImg:filename});
        }
    };


    _vehicleLicensesImage = async () => {

        this.askPermissionsAsync();

        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
            base64:true,

        });

        let localUri = result.uri;
        let filename = localUri.split('/').pop();
        console.log(result);

        // check if there is image then set it and make button not disabled
        if (!result.cancelled) {
            this.setState({ userImage: result.uri ,base64:result.base64 ,vehicleLicenses:filename});
        }
    };



    _toggleModal = () => this.setState({ isModalVisible: !this.state.isModalVisible });

    async componentWillMount() {


        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            alert('صلاحيات تحديد موقعك الحالي ملغاه');
        }else {
            const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync({});
            const userLocation = { latitude, longitude };
            this.setState({  initMap: false, mapRegion: userLocation });

        }

        let getCity = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=';
        getCity += this.state.mapRegion.latitude + ',' + this.state.mapRegion.longitude;
        getCity += '&key=AIzaSyDYjCVA8YFhqN2pGiW4I8BCwhlxThs1Lc0&language=ar&sensor=true';

        console.log(getCity);

        try {
            const { data } = await axios.get(getCity);
            this.setState({ city: data.results[0].formatted_address });

        } catch (e) {
            console.log(e);
        }
    }



    async componentDidMount(){
        await Permissions.askAsync(Permissions.CAMERA);
        await Permissions.askAsync(Permissions.CAMERA_ROLL);
        const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync({});
        const userLocation = { latitude, longitude };
        this.setState({  initMap: false, mapRegion: userLocation });
    }


    _handleMapRegionChange  = async (mapRegion) =>  {
        console.log(mapRegion);
        this.setState({ mapRegion });

        let getCity = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=';
        getCity += mapRegion.latitude + ',' + mapRegion.longitude;
        getCity += '&key=AIzaSyDYjCVA8YFhqN2pGiW4I8BCwhlxThs1Lc0&language=ar&sensor=true';

        console.log('locations data', getCity);


        try {
            const { data } = await axios.get(getCity);
            console.log(data);
            this.setState({ city: data.results[0].formatted_address });

        } catch (e) {
            console.log(e);
        }
    }

    _getLocationAsync = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            this.setState({
                locationResult: 'Permission to access location was denied',
            });
        } else {
            this.setState({ hasLocationPermissions: true });
        }

        let location = await Location.getCurrentPositionAsync({});

        // Center the map on the location we just fetched.
        this.setState({mapRegion: { latitude: location.coords.latitude, longitude: location.coords.longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421 }});
    };



    confirmLocation(){
        this.setState({ isModalVisible: !this.state.isModalVisible })
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


    renderProfile(){
        if(this.state.profileType === 0){
            return(
                <View style={styles.profileParent}>


                    <Animatable.View animation="zoomIn" duration={1000} style={[styles.profileImgParent , {marginTop:0 , borderColor:'#b8dbeb' , borderWidth:4}]}>
                        <Image source={require('../../assets/images/profile.png')} style={[styles.profileImg]} resizeMode={'cover'} />
                    </Animatable.View>

                    <View style={styles.directionColumnCenter}>
                        <Animatable.Text animation="fadeInUp" duration={1400} style={[styles.type , styles.termsText ,{color:COLORS.boldgray }]}>{ i18n.t('fullName') }</Animatable.Text>
                        <Animatable.View animation="fadeInUp" duration={1800}>
                            <TouchableOpacity onPress={ () => this.setState({profileType:2})} style={styles.directionRowCenter}>
                                <Image source={require('../../assets/images/edit_profile.png')} style={[styles.headerMenu , styles.transform , {marginRight:7}]} resizeMode={'contain'} />
                                <Text style={[styles.type ,{color:COLORS.darkRed , marginVertical:10}]}>{ i18n.t('editProfile') }</Text>
                            </TouchableOpacity>
                        </Animatable.View>
                    </View>

                    <View style={[styles.line , {borderColor:'#cfcfcf'}]}/>

                    <Animatable.View animation={I18nManager.isRTL ? "fadeInRight" : "fadeInLeft"} duration={2000} style={[ styles.directionRow , styles.ph23]}>
                        <Image source={require('../../assets/images/smartphone.png')} style={[styles.headerMenu ,styles.mr10]} resizeMode={'contain'} />
                        <Text style={[styles.type ,{color:COLORS.mediumgray}]}>12365478945</Text>
                    </Animatable.View>

                    <Animatable.View animation={I18nManager.isRTL ? "fadeInRight" : "fadeInLeft"} duration={2000} style={[ styles.directionRow , styles.ph23 , styles.mt15]}>
                        <Image source={require('../../assets/images/marker_gray.png')} style={[styles.headerMenu ,styles.mr10]} resizeMode={'contain'} />
                        <Text style={[styles.type ,{color:COLORS.mediumgray}]}>الرياض - جدة</Text>
                    </Animatable.View>

                    <View style={[styles.line , {borderColor:'#cfcfcf'}]}/>

                    <TouchableOpacity onPress={() => this.props.navigation.navigate('changeOldPass')} style={[ styles.directionRowCenter , {alignSelf:'center'}]}>
                        <Animatable.Text animation="fadeInUp" duration={2400} style={[styles.headerText ,{color:COLORS.labelBackground}]}>{ i18n.t('changePass') }</Animatable.Text>
                    </TouchableOpacity>
                </View>
            )
        }else if(this.state.profileType === 1) {
            return(
                <View style={styles.profileParent}>

                    <View style={styles.ph10}>
                        <View style={[ styles.directionRow]}>
                            <Image source={require('../../assets/images/license_plate.png')} style={[styles.headerMenu ,styles.mr10]} resizeMode={'contain'} />
                            <Text style={[styles.type ,{color:COLORS.mediumgray}]}>{ i18n.t('plateImg') }</Text>
                        </View>
                        <Image source={require('../../assets/images/car.jpeg')} style={[styles.carImg]} resizeMode={'cover'} />
                        <View style={[ styles.directionRowSpace , styles.mt15]}>
                            <View style={styles.directionRow}>
                                <Image source={require('../../assets/images/driving_license.png')} style={[styles.headerMenu ,styles.mr10]} resizeMode={'contain'} />
                                <Text style={[styles.type ,{color:COLORS.mediumgray}]}>{ i18n.t('vehicleLicenses') }</Text>
                            </View>
                            <TouchableOpacity >
                                <Text style={[styles.type ,{color:COLORS.labelBackground}]}>https://imgbb.com/</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={[styles.line , {borderColor:'#cfcfcf'}]}/>


                    <TouchableOpacity onPress={() => this.setState({profileType:3})} style={styles.directionRowCenter}>
                        <Image source={require('../../assets/images/edit_profile.png')} style={[styles.headerMenu , styles.transform , {marginRight:7}]} resizeMode={'contain'} />
                        <Text style={[styles.type ,{color:COLORS.darkRed , marginVertical:10}]}>{ i18n.t('modifyVehicleData') }</Text>
                    </TouchableOpacity>
                </View>
            )
        }else if(this.state.profileType === 2) {
            return(
                <View style={styles.profileParent}>
                    <KeyboardAvoidingView behavior={'padding'} style={styles.keyboardAvoid}>
                        <View style={styles.ph23}>

                            <View style={[styles.itemView ,{borderColor: COLORS.mediumgray}]}>
                                <Item floatingLabel style={[styles.loginItem,{width:'100%'}]} bordered>
                                    <Label style={[styles.label , {backgroundColor: '#fff' , color:COLORS.mediumgray , top:15}]}>{ i18n.t('fullName') }</Label>
                                    <Input value={this.state.fullName} onChangeText={(fullName) => this.setState({fullName})} autoCapitalize='none' style={[styles.input ,{color:COLORS.mediumgray}]}  />
                                </Item>
                            </View>

                            <View style={[styles.itemView , styles.inputMarginTop ,{borderColor: COLORS.mediumgray}]}>
                                <Item floatingLabel style={[styles.loginItem,{width:'100%'}]} bordered>
                                    <Label style={[styles.label , {backgroundColor: '#fff' , color:COLORS.mediumgray , top:15}]}>{ i18n.t('email') }</Label>
                                    <Input value={this.state.mail} onChangeText={(mail) => this.setState({mail})} keyboardType={'email-address'} style={[styles.input ,{color:COLORS.mediumgray}]}  />
                                </Item>
                            </View>

                            <View onPress={this._personalImage} style={[ styles.itemView , styles.inputMarginTop ,{borderColor: COLORS.mediumgray} ]}>
                                <Item floatingLabel style={[styles.loginItem , { top:0 , height:50 , width:'100%'}]} bordered onPress={this._personalImage}>
                                    <Label style={[styles.label , {backgroundColor: '#fff' , color:COLORS.mediumgray ,top:-5}]}>{ i18n.t('personalImg') }</Label>
                                    <Input autoCapitalize='none'  disabled value={this.state.personalImg}  style={[styles.input , { height:30 , lineHeight:28 , top:3 , color:COLORS.mediumgray , paddingRight:15}]}  />
                                </Item>
                                <Image source={require('../../assets/images/photo-camera-gray.png')} style={styles.regMarker} resizeMode={'contain'} />
                            </View>

                            <View style={[ styles.itemView , styles.inputMarginTop ,{borderColor: COLORS.mediumgray}]}>
                                <Item floatingLabel style={[styles.loginItem , { top:0 , height:50 , width:'100%'}]} bordered onPress={() =>this._toggleModal()}>
                                    <Label style={[styles.label , {backgroundColor: '#fff' , color:COLORS.mediumgray ,top:-5}]}>{ i18n.t('location') }</Label>
                                    <Input autoCapitalize='none'  disabled value={this.state.city}  style={[styles.input , { height:30 , lineHeight:23 , top:3, color:COLORS.mediumgray, paddingRight:15}]}  />
                                </Item>
                                <Image source={require('../../assets/images/marker_gray.png')} style={styles.regMarker} resizeMode={'contain'} />
                            </View>

                            <View style={[ styles.itemView , styles.inputMarginTop ,{borderColor: COLORS.mediumgray}]}>
                                <Item floatingLabel style={[styles.loginItem,{width:'100%'}]} bordered>
                                    <Label style={[styles.label , {backgroundColor: '#fff' , color:COLORS.mediumgray , top:15}]}>{ i18n.t('phoneNumber') }</Label>
                                    <Input value={this.state.phone} onChangeText={(phone) => this.setState({phone})} keyboardType={'number-pad'} style={[styles.input ,{color:COLORS.mediumgray}]}  />
                                </Item>
                            </View>


                            <Button onPress={() => this.setState({profileType:0})} style={[styles.loginBtn , styles.mt30]}>
                                <Text style={styles.btnTxt}>{ i18n.t('save') }</Text>
                            </Button>

                        </View>
                    </KeyboardAvoidingView>
                </View>
            )
        }else if(this.state.profileType === 3) {
            return(
                <View style={styles.profileParent}>
                    <KeyboardAvoidingView behavior={'padding'} style={styles.keyboardAvoid}>
                        <View style={styles.ph23}>

                            <View   onPress={this._plateImage}style={[ styles.itemView ,{borderColor: COLORS.mediumgray} ]}>
                                <Item floatingLabel style={[styles.loginItem , { top:0 , height:50 , width:'100%'}]} bordered onPress={this._plateImage}>
                                    <Label style={[styles.label , {backgroundColor: '#fff' , color:COLORS.mediumgray ,top:-5}]}>{ i18n.t('plateImg') }</Label>
                                    <Input autoCapitalize='none'  disabled value={this.state.plateImg}  style={[styles.input , { height:30  , lineHeight:28 , top:3 , color:COLORS.mediumgray , paddingRight:15}]}  />
                                </Item>
                                <Image source={require('../../assets/images/photo-camera-gray.png')} style={styles.regMarker} resizeMode={'contain'} />
                            </View>

                            <View  onPress={this._vehicleLicensesImage} style={[ styles.itemView , styles.inputMarginTop ,{borderColor: COLORS.mediumgray} ]}>
                                <Item floatingLabel style={[styles.loginItem , { top:0 , height:50 , width:'100%'}]} bordered onPress={this._vehicleLicensesImage}>
                                    <Label style={[styles.label , {backgroundColor: '#fff' , color:COLORS.mediumgray ,top:-5}]}>{ i18n.t('vehicleLicenses') }</Label>
                                    <Input autoCapitalize='none'  disabled value={this.state.vehicleLicenses}  style={[styles.input , { height:30 , lineHeight:28 , top:3 , color:COLORS.mediumgray , paddingRight:15}]}  />
                                </Item>
                                <Image source={require('../../assets/images/photo-camera-gray.png')} style={styles.regMarker} resizeMode={'contain'} />
                            </View>


                            <Button onPress={() => this.setState({profileType:1})} style={[styles.loginBtn , styles.mt30]}>
                                <Text style={styles.btnTxt}>{ i18n.t('save') }</Text>
                            </Button>

                        </View>
                    </KeyboardAvoidingView>
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
                        <Text style={[styles.headerText , styles.headerTitle]}>{ i18n.t('user') }</Text>
                        <Left style={styles.flex0}/>
                    </Animated.View>
                </Header>
                <Content  contentContainerStyle={styles.flexGrow} style={styles.homecontent}  onScroll={e => this.headerScrollingAnimation(e) }>
                    <ImageBackground source={  I18nManager.isRTL ? require('../../assets/images/bg_blue_big.png') : require('../../assets/images/bg_blue_big2.png')} resizeMode={'cover'} style={styles.imageBackground}>
                        <View style={Platform.OS === 'ios' ? styles.mt90 : styles.mT70}>

                            <View style={styles.orderTabs}>
                                <TouchableOpacity onPress={ () => this.setState({profileType:0})} style={[this.state.profileType === 0 || this.state.profileType === 2 ? styles.activeTab : styles.normalTab , {width:'50%'}]}>
                                    <Text style={this.state.profileType === 0 || this.state.profileType === 2  ? styles.activeTabText :styles.normalTabText} >{ i18n.t('personalInfo') }</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={ () => this.setState({profileType:1})} style={[this.state.profileType === 1 || this.state.profileType === 3 ? styles.activeTab : styles.normalTab , {width:'50%'}]}>
                                    <Text style={this.state.profileType === 1 || this.state.profileType === 3  ? styles.activeTabText :styles.normalTabText} >{ i18n.t('vehicleInfo') }</Text>
                                </TouchableOpacity>
                            </View>

                            { this.renderProfile() }

                        </View>
                    </ImageBackground>
                    <Modal onBackdropPress={()=> this.setState({ isModalVisible : false })} isVisible={this.state.isModalVisible}>
                        <View style={[styles.modalStyle , styles.p10]}>
                            {
                                !this.state.initMap ? (
                                    <MapView
                                        style={styles.mapView}
                                        initialRegion={{
                                            latitude: this.state.mapRegion.latitude,
                                            longitude: this.state.mapRegion.longitude,
                                            latitudeDelta: 0.0922,
                                            longitudeDelta: 0.0421,
                                        }}
                                    >
                                        <MapView.Marker draggable
                                                        coordinate={this.state.mapRegion}
                                                        onDragEnd={(e) =>  this._handleMapRegionChange(e.nativeEvent.coordinate)}
                                        >
                                            <Image source={require('../../assets/images/location_map.png')} resizeMode={'contain'} style={styles.mapMarker}/>
                                        </MapView.Marker>
                                    </MapView>
                                ) : (<View />)
                            }
                            <Button onPress={() => this.confirmLocation()} style={[styles.loginBtn ,styles.mt10]}>
                                <Text style={styles.btnTxt}>{ i18n.t('confirm') }</Text>
                            </Button>
                        </View>
                    </Modal>
                </Content>

                <FooterSection routeName={'profile'} navigation={this.props.navigation}/>
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
                    <DrawerCustomization  onClose={() => this.closeDrawer()} navigation={this.props.navigation}/>
                </RBSheet>
            </Container>

        );
    }
}

export default Profile;