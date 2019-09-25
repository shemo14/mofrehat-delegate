const INITIAL_STATE = { newOrder : null, loader : true };

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'getNewOrder':{
            return {
                newOrder: action.payload.data,
                loader: action.payload.status == 200 ? false : true
            };
        }

        default:
            return state;
    }
};
