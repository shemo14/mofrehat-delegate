import axios from "axios";
import CONST from "../consts";


export const getFinancial = (lang , token ) => {
    return (dispatch) => {

        axios({
            url: CONST.url + 'financial_accounts',
            method: 'POST',
            headers: token != null ? {Authorization: token} : null,
            data: { lang}
        }).then(response => {
            dispatch({type: 'getFinancial', payload: response.data})
        })

    }
};
