import axios from "axios";
import CONST from "../consts";


export const getSuggestions = (lang ,title , msg, token ) => {
    return (dispatch) => {

        axios({
            url: CONST.url + 'suggestions',
            method: 'POST',
            headers: token != null ? {Authorization: token} : null,
            data: { lang  ,title , msg}
        }).then(response => {
            dispatch({type: 'getSuggestions', payload: response.data})
        })

    }
};
