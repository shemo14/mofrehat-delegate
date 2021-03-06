const INITIAL_STATE = { myOrders : [],deleteOrder:null , acceptOrder:null , loader : true, notConfirmed: false };

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'getOrders':{
            return {
                myOrders: action.payload.data,
                loader: action.payload.status == 200 ? false : true
            };
        }
        case 'deleteOrder':{
            return {
                deleteOrder: action.payload.msg,
                loader: action.payload.status == 200 ? false : true
            };
        }
        case 'acceptOrder':{
            return {
                acceptOrder: action.payload.msg,
                loader: action.payload.status == 200 ? false : true
            };
        }
        case 'notConfirmed':{
            return ({ ...state, notConfirmed: true, myOrders: [] });
        }

        default:
            return state;
    }
};
