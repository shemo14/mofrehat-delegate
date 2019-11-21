import axios from "axios";
import CONST from "../consts";


export const finishOrder = (lang , order_id , token ) => {
    return (dispatch) => {

        axios({
            url: CONST.url + 'finish_order',
            method: 'POST',
            headers: token != null ? {Authorization: token} : null,
            data: {order_id, lang}
        }).then(response => {
            dispatch({type: 'finishOrder', payload: response.data})
        })

    }
};
