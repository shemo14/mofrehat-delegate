import axios from 'axios';
import { AsyncStorage } from 'react-native';
import CONST from '../consts';

export const userLogin = ({phone, password, deviceId, type}, lang) => {
    return (dispatch) => {
        dispatch({type: 'login_user'});

        axios.post( CONST.url + 'login', {phone, password, device_id: deviceId, type, lang})
            .then(response => handelLogin(dispatch, response.data))
            .catch(error => console.warn(error.data));
    };
};


export const tempAuth = () => {
    return (dispatch) => {
        dispatch({type: 'temp_auth'});
    };
};


export const activeAccount = phone => {
    return (dispatch) => {
        dispatch({ type: 'active_account' });
        axios.post(CONST.url + 'active_account', { phone }).then(response => {
            if (response.data.status != 200){
                alert(response.data.msg);
            }
        })
    };
};

const handelLogin = (dispatch, data) => {
    if (data.status != 200){
        loginFailed(dispatch, data)
    }else{
        loginSuccess(dispatch, data)
    }
};


const loginSuccess = (dispatch, data) => {
    AsyncStorage.setItem('token', JSON.stringify(data.data.token))
        .then(() => dispatch({type: 'login_success', data }));
};

const loginFailed = (dispatch, error) => {
    dispatch({type: 'login_failed', error});
}
