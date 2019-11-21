import axios from "axios";
import CONST from "../consts";
import {AsyncStorage} from "react-native";
import {Toast} from "native-base";


export const register = (data, props) => {
	return (dispatch) => {

		AsyncStorage.getItem('deviceID').then(device_id => {
			axios({
				url: CONST.url + 'delegate_register',
				method: 'POST',
				data: {
					name: data.fullName,
					email: data.mail,
					phone: data.phone,
					password: data.password,
					city_id: data.selectedCity,
					address: data.city,
					device_id,
					lang: 'ar',
					lat: data.mapRegion.latitude,
					lng: data.mapRegion.longitude,
					profile_img: data.personalImgBase64,
					license_img: data.vehicleLicensesBase64,
					vehicle_img: data.plateImgBase64
				}
			}).then(response => {
				dispatch({type: 'register', payload: response.data});
				if (response.data.status == 200){
					props.navigation.navigate('verifyAcc', { code: response.data.data.code, phone: data.phone, password: data.password, deviceId: device_id })
				}

				Toast.show({
					text: response.data.msg,
					type: response.data.status == 200 ? "success" : "danger",
					duration: 3000
				});
			})
		})

	}
};
