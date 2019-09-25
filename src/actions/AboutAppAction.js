import axios from "axios";
import CONST from "../consts";


export const getAboutApp = lang => {
    return (dispatch) => {
        axios({
            url: CONST.url + 'about_app',
            method: 'POST',
            data: {lang}
        }).then(response => {
            dispatch({type: 'getAboutApp', payload: response.data});
        });
    }
};
