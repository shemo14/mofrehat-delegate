const INITIAL_STATE = { finishOrder : null, loader : true };

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'finishOrder':{
            return {
                finishOrder: action.payload.msg,
                loader: action.payload.status == 200 ? false : true
            };
        }

        default:
            return state;
    }
};
