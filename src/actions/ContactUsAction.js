import axios from "axios";
import CONST from "../consts";


export const getContactUs = lang => {
    return (dispatch) => {

        axios({
            url: CONST.url + 'app_info',
            method: 'POST',
            data: {lang}
        }).then(response => {
            dispatch({type: 'getContactUs', payload: response.data})
        })

    }
};
