import axios from "axios";
import CONST from "../consts";
import {AsyncStorage} from "react-native";


export const getNewOrder = (lang , order_id , token ) => {
    return (dispatch) => {

        axios({
            url: CONST.url + 'order_details',
            method: 'POST',
            headers: token != null ? {Authorization: token} : null,
            data: {order_id, lang}
        }).then(response => {
            dispatch({type: 'getNewOrder', payload: response.data})
        })

    }
};
