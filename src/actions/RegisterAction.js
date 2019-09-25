import axios from "axios";
import CONST from "../consts";
import {AsyncStorage} from "react-native";
import {Toast} from "native-base";


export const register = (lang , id , ) => {
    return (dispatch) => {

        AsyncStorage.getItem('deviceID').then(device_id => {
            axios({
                url: CONST.url + 'delegate_register',
                method: 'POST',
                data: {id, device_id, lang}
            }).then(response => {
                    this.setState({ isSubmitted: false });

                    if (response.data.status == 200){
                        this.props.navigation.navigate('verifyAcc')
                    }

                    Toast.show({
                        text: response.data.msg,
                        type: response.data.status == 200 ? "success" : "danger",
                        duration: 3000
                    });
                dispatch({type: 'register', payload: response.data})
                }).catch(e => {
                    Toast.show({
                        text: 'يوجد خطأ ما الرجاء المحاولة مرة اخري',
                        type: "danger",
                        duration: 3000
                    });
                })
            })
        })


    }
};
