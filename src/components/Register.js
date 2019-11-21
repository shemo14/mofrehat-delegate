import React, { Component } from "react";
import {View, Text, Image, TouchableOpacity, KeyboardAvoidingView } from "react-native";
import {Container, Content, Form, Item, Input, Label, Button, Toast, CheckBox, Icon, Picker} from 'native-base'
import styles from '../../assets/styles'
import i18n from '../../locale/i18n'
import {DoubleBounce} from "react-native-loader";
import Modal from "react-native-modal";
import * as Permissions from 'expo-permissions';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import * as Animatable from 'react-native-animatable';
import {register, getCities} from '../actions'
import {connect} from "react-redux";
import ReactotronConfig from '../../ReactotronConfig'

class Register extends Component {
    constructor(props){
        super(props);
        this.state = {
            fullName: '',
            mail: '',
            phone: '',
            password: '',
            rePassword: '',
            token: '',
            userId: null,
            isLoaded: false,
            location: '',
            isModalVisible: false,
            city: '',
            mapRegion: null,
            hasLocationPermissions: false,
            initMap: true,
			checked: true,
			selectedCity: null,
            userImage: null,
			personalImgBase64: null,
			plateImgBase64: null,
			vehicleLicensesBase64: null,
            personalImg: '',
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

        // check if there is image then set it and make button not disabled
        if (!result.cancelled) {
            this.setState({ userImage: result.uri ,personalImgBase64:result.base64 ,personalImg:filename});
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

        // check if there is image then set it and make button not disabled
        if (!result.cancelled) {
            this.setState({ userImage: result.uri ,plateImgBase64:result.base64 ,plateImg:filename});
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

        // check if there is image then set it and make button not disabled
        if (!result.cancelled) {
            this.setState({ userImage: result.uri ,vehicleLicensesBase64:result.base64 ,vehicleLicenses:filename});
        }
    };

    renderSubmit(){
        if (this.state.fullName == ''
            || this.state.mail == ''
            || this.state.phone == ''
            || this.state.password == ''
            || this.state.rePassword == ''
            || this.state.mail == ''
            // || this.state.city == ''
            || this.state.selectedCity == null
            || this.state.checked == false
            || this.state.personalImgBase64 == null
            || this.state.plateImgBase64 == null
            || this.state.vehicleLicensesBase64 == null ){
            return (
				<Button disabled onPress={() => this.onRegisterPressed()} style={[styles.loginBtn , styles.inputMarginBottom, { backgroundColor : '#999' }]}>
					<Text style={styles.btnTxt}>{ i18n.t('register') }</Text>
				</Button>
            );
        }

        if (this.state.isLoaded){
            return(
                <View style={{ alignSelf: 'center', justifyContent: 'center' }}>
                    <DoubleBounce size={20} color="#B7264B" style={{ alignSelf: 'center' }} />
                </View>
            )
        }

        return (
            <Button onPress={() => this.onRegisterPressed()} style={[styles.loginBtn , styles.inputMarginBottom]}>
                <Text style={styles.btnTxt}>{ i18n.t('register') }</Text>
            </Button>
        );
    }


    validate = () => {
        let isError = false;
        let msg = '';

        if (this.state.phone.length <= 0 || this.state.phone.length !== 10) {
            isError = true;
            msg = i18n.t('phoneValidation');
        }else if (this.state.password.length <= 0) {
            isError = true;
            msg = i18n.t('passwordRequired');
        }else if (this.state.password != this.state.rePassword) {
            isError = true;
            msg = i18n.t('verifyPassword');
        }else if (this.state.password.length < 6) {
            isError = true;
            msg = i18n.t('passwordLength');
        }else if (this.state.mail.length <= 0 || this.state.mail.indexOf("@") === -1 || this.state.mail.indexOf(".") === -1) {
            isError = true;
            msg = i18n.t('emailNotCorrect');
        }

        if (msg != ''){
            Toast.show({
                text: msg,
                type: "danger",
                duration: 3000
            });
        }
        return isError;
    };

    onRegisterPressed() {
        const err = this.validate();
        if (!err){
            this.setState({ isLoaded: true });

            const { fullName, mail, phone, password, token, location, city, mapRegion, selectedCity, personalImgBase64, plateImgBase64, vehicleLicensesBase64 } = this.state;
            const data = {
                fullName,
                mail ,
                phone,
                password,
                token,
                location,
                city,
                selectedCity,
                mapRegion,
                personalImgBase64,
                vehicleLicensesBase64,
                plateImgBase64,
            };

            this.props.register(data, this.props);
        }
    }

    _toggleModal = () => this.setState({ isModalVisible: !this.state.isModalVisible });

    async componentWillMount() {

        this.props.getCities(this.props.lang);

        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            alert('صلاحيات تحديد موقعك الحالي ملغاه');
        }else {
            const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync({});
            const userLocation = { latitude, longitude };
            this.setState({  initMap: false, mapRegion: userLocation });
        }

        let getCity = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=';
        getCity    += this.state.mapRegion.latitude + ',' + this.state.mapRegion.longitude;
        getCity    += '&key=AIzaSyCJTSwkdcdRpIXp2yG7DfSRKFWxKhQdYhQ&language=ar&sensor=true';

        ReactotronConfig.log(getCity);

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

    componentWillReceiveProps(nextProps) {
		this.setState({ isLoaded: false });
        console.log('new props of register', nextProps);
	}

	_handleMapRegionChange  = async (mapRegion) =>  {
        this.setState({ mapRegion });

        let getCity = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=';
        getCity += mapRegion.latitude + ',' + mapRegion.longitude;
        getCity += '&key=AIzaSyDYjCVA8YFhqN2pGiW4I8BCwhlxThs1Lc0&language=ar&sensor=true';

        console.log('locations data', getCity);

        try {
            const { data } = await axios.get(getCity);
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

    render() {
    	console.log('register props', this.props.registering);
        return (
			<Container style={styles.container}>
				<TouchableOpacity style={styles.authBack} onPress={() => this.props.navigation.goBack()}>
					<Icon type={'FontAwesome'} name={'angle-right'} style={[styles.transform, styles.rightHeaderIcon]} />
				</TouchableOpacity>

				<Content contentContainerStyle={styles.flexGrow}>
					<View style={styles.imageBackgroundStyle}>
						<Animatable.View animation="zoomIn" duration={1400}>
							<Image source={require('../../assets/images/logo.png')} style={styles.logoStyle} resizeMode={'contain'} />
						</Animatable.View>

						<View style={styles.loginFormContainerStyle}>
							<KeyboardAvoidingView behavior={'padding'} style={styles.keyboardAvoid}>
								<Form  style={[styles.w100 , styles.ph25 ]}>
									<View style={styles.itemView}>
										<Item floatingLabel style={styles.loginItem} bordered>
											<Label style={styles.label}>{ i18n.t('fullName') }</Label>
											<Input onChangeText={(fullName) => this.setState({fullName})} autoCapitalize='none' style={styles.input}  />
										</Item>
									</View>

									<View style={[ styles.itemView , styles.inputMarginTop ]}>
										<Item floatingLabel style={styles.loginItem} bordered>
											<Label style={styles.label}>{ i18n.t('email') }</Label>
											<Input onChangeText={(mail) => this.setState({mail})} keyboardType={'email-address'} style={styles.input}  />
										</Item>
									</View>

									<View>
										<Item style={[styles.itemPicker, { borderColor: '#fff' }]} regular >
											<Picker
												mode="dropdown"
												style={[styles.picker, { color: '#fff' } ]}
												placeholderStyle={{ color: "#fff" }}
												placeholderIconColor="#fff"
												selectedValue={this.state.selectedCity}
												onValueChange={(value) => this.setState({ selectedCity: value })}
											>
												<Picker.Item label={ i18n.t('selectCity') } value={null} />
												{
													this.props.cities.map((city, i) => (
														<Picker.Item key={i} label={city.name} value={city.id} />
													))
												}
											</Picker>
											<Image source={require('../../assets/images/right_wight_arrow_drop.png')} style={styles.pickerImg} resizeMode={'contain'} />
										</Item>
									</View>

									<View style={[ styles.itemView , styles.inputMarginTop ]}>
										<Item floatingLabel style={[styles.loginItem , { top:0 , height:50}]} bordered onPress={this._personalImage}>
											<Label style={[styles.label , {top:-5}]}>{ i18n.t('personalImg') }</Label>
											<Input autoCapitalize='none'  disabled value={this.state.personalImg}  style={[styles.input , { height:30 , lineHeight:23 , top:3}]}  />
										</Item>
										<Image source={require('../../assets/images/photo-camera.png')} style={styles.regMarker} resizeMode={'contain'} />
									</View>

									<View style={[ styles.itemView , styles.inputMarginTop ]}>
										<Item floatingLabel style={[styles.loginItem , { top:0 , height:50}]} bordered onPress={this._plateImage}>
											<Label style={[styles.label , {top:-5}]}>{ i18n.t('plateImg') }</Label>
											<Input autoCapitalize='none'  disabled value={this.state.plateImg}  style={[styles.input , { height:30 , lineHeight:23 , top:3}]}  />
										</Item>
										<Image source={require('../../assets/images/photo-camera.png')} style={styles.regMarker} resizeMode={'contain'} />
									</View>

									<View style={[ styles.itemView , styles.inputMarginTop ]}>
										<Item floatingLabel style={[styles.loginItem , { top:0 , height:50}]} bordered onPress={this._vehicleLicensesImage}>
											<Label style={[styles.label , {top:-5}]}>{ i18n.t('vehicleLicenses') }</Label>
											<Input autoCapitalize='none'  disabled value={this.state.vehicleLicenses}  style={[styles.input , { height:30 , lineHeight:23 , top:3}]}  />
										</Item>
										<Image source={require('../../assets/images/photo-camera.png')} style={styles.regMarker} resizeMode={'contain'} />
									</View>

									<View style={[ styles.itemView , styles.inputMarginTop ]}>
										<Item floatingLabel style={styles.loginItem} bordered>
											<Label style={styles.label}>{ i18n.t('phoneNumber') }</Label>
											<Input onChangeText={(phone) => this.setState({phone})} keyboardType={'number-pad'} style={styles.input}  />
										</Item>
									</View>

									<View style={[ styles.itemView , styles.inputMarginTop ]}>
										<Item floatingLabel style={[styles.loginItem , { top:0 , height:50}]} bordered onPress={() =>this._toggleModal()}>
											<Label style={[styles.label , {top:-5}]}>{ i18n.t('location') }</Label>
											<Input autoCapitalize='none'  disabled value={this.state.city}  style={[styles.input , { height:30 , lineHeight:23 , top:3}]}  />
										</Item>
										<Image source={require('../../assets/images/map_marker_white.png')} style={styles.regMarker} resizeMode={'contain'} />
									</View>

									<View style={[ styles.itemView , styles.inputMarginTop ]}>
										<Item floatingLabel style={styles.loginItem} bordered>
											<Label style={[styles.label]}>{ i18n.t('password') }</Label>
											<Input autoCapitalize='none' onChangeText={(password) => this.setState({password})} secureTextEntry style={styles.input}  />
										</Item>

									</View>

									<View style={[ styles.itemView , styles.inputMarginTop ]}>
										<Item floatingLabel style={styles.loginItem} bordered>
											<Label style={[styles.label]}>{ i18n.t('rePassword') }</Label>
											<Input autoCapitalize='none' onChangeText={(rePassword) => this.setState({rePassword})} secureTextEntry style={styles.input}  />
										</Item>

									</View>

									<TouchableOpacity onPress={() => this.setState({ checked: !this.state.checked })} style={[ styles.inputMarginTop ,styles.directionRow]}>
										<CheckBox checked={this.state.checked} color={'transparent'} style={styles.checkBox} />
										<Text style={styles.agreeText}>{ i18n.t('agreeTo') } <Text  style={styles.termsText}>{ i18n.t('terms') }</Text></Text>
									</TouchableOpacity>

									<View style={styles.loginBtnContainer}>
										{ this.renderSubmit() }
									</View>
								</Form>
							</KeyboardAvoidingView>

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
						</View>
					</View>
				</Content>
			</Container>
        );
    }
}

const mapStateToProps = ({ auth, profile, lang, city, register }) => {
	return {
		loading: auth.loading,
		auth: auth.user,
		user: profile.user,
		cities: city.cities,
		registering: register.register,
		lang: lang.lang,
	};
};

export default connect(mapStateToProps, { register, getCities })(Register);