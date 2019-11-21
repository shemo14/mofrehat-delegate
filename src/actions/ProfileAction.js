import axios from 'axios';
import CONST from '../consts'
import {Toast} from "native-base";
import {AsyncStorage} from "react-native";


export const profile = (token) => {
    return (dispatch) => {
        axios({
            method: 'POST',
            url: CONST.url + 'user_data',
            headers: {Authorization: "Bearer " + token}
        }).then(response => {
            const data = response.data.data;
            dispatch({type: 'profile_data', data})
        })
    }
};

export const updateProfile = (data) => {
    return (dispatch) => {
        axios({
            url: CONST.url + 'update_profile',
            method: 'POST',
            headers: {Authorization: data.token },
            data: {
                name:       data.name,
                phone:      data.phone,
                image:      data.image,
                email:      data.email,
                lat:        data.lat,
                long:       data.long,
                city_id:    data.cityId,
                address:    data.address,
                lang:       data.lang,
            }}).then(response => {
            if (response.data.status == 200) {
                const data = response.data.data;
                dispatch({type: 'update_profile', data})
            }
            Toast.show({
                text: response.data.msg,
                type: response.data.status == 200 ? "success" : "danger",
                duration: 3000
            });
        }).catch(() => {
            Toast.show({
                text: 'لم يتم التعديل بعد , الرجاء المحاوله مره اخري',
                type: "danger",
                duration: 3000
            });
        })
    }
}

export const delegatedChecked = (token, props) => {
    return (dispatch) => {
        axios({
            url: CONST.url + 'delegateActiveChecked',
            method: 'POST',
            headers: {Authorization: token },
        }).then(response => {
                if (response.data.status != 200){
					props.navigation.navigate('notConfirmed');
					dispatch({ type: 'delegated_checked' })
                }
            }
        )
    }
}

export const logout = (token) => {
    return (dispatch) => {
        axios({
            url: CONST.url + 'logout',
            method: 'POST',
            headers: {Authorization: token },
        }).then(response => {
                AsyncStorage.multiRemove(['token', 'auth', 'profile'])
                dispatch({type: 'logout'})
            }
        )
    }
}

