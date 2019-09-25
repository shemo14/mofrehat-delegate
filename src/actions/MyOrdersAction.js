import axios from "axios";
import CONST from "../consts";
import {AsyncStorage} from "react-native";


export const getOrders = (lang ,type , token) => {
    return (dispatch) => {
        getOrdersItems(lang, type ,token , dispatch)
    }
};


export const deleteOrder = (lang , order_id , token , type  ) => {
    return (dispatch) => {
        axios({
            url: CONST.url + 'deleted_order',
            headers: token != null ? {Authorization: token} : null,
            method: 'POST',
            data: { lang , order_id}
        }).then(response => {
            getOrdersItems(lang, type ,token , dispatch)
        })

    }
};

export const acceptOrder = (lang , order_id , token  ) => {
    return (dispatch) => {
        axios({
            url: CONST.url + 'accept_order',
            headers: token != null ? {Authorization: token} : null,
            method: 'POST',
            data: { lang , order_id}
        }).then(response => {
            getOrdersItems(lang, token , dispatch)
        })

    }
};

const getOrdersItems = (lang , type , token , dispatch ) => {
    console.log('tokeeeeeen' , token)
    axios({
        url: CONST.url + 'my_orders',
        method: 'POST',
        headers: token != null ? {Authorization: token} : null,
        data: {lang , type}
    }).then(response => {
        dispatch({type: 'getOrders', payload: response.data})
    })
}

