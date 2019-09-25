import axios from "axios";
import CONST from "../consts";


export const getReportsReasons = (lang ,  token ) => {
    return (dispatch) => {

        axios({
            url: CONST.url + 'reports_reasons',
            method: 'POST',
            headers: token != null ? {Authorization: token} : null,
            data: {lang}
        }).then(response => {
            dispatch({type: 'getReportsReasons', payload: response.data})
        })

    }
};

export const setReport = (lang , order_id ,reason_id ,  token ) => {
    return (dispatch) => {

        axios({
            url: CONST.url + 'set_report',
            method: 'POST',
            headers: token != null ? {Authorization: token} : null,
            data: {lang , order_id ,reason_id}
        }).then(response => {
            dispatch({type: 'setReport', payload: response.data})
        })

    }
};
