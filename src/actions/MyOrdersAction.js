import axios from "axios";
import CONST from "../consts";
import Reactotron from '../../ReactotronConfig';


export const getOrders = (lang ,type , token, props) => {
    return (dispatch) => {
		axios({
			url: CONST.url + 'delegateActiveChecked',
			headers: token != null ? {Authorization: token} : null,
			method: 'POST',
			data: { lang }
		}).then(response => {
			if (response.data.status == 200){
				getOrdersItems(lang, type ,token , dispatch)
			}else{
				notConfirmed(props, dispatch)
			}
		})
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

const notConfirmed = (props, dispatch) => {
	// props.navigation.navigate('notConfirmed');
	dispatch({type: 'notConfirmed'})
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

