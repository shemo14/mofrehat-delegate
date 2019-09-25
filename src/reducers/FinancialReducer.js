const INITIAL_STATE = { financial : [], loader : true };

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'getFinancial':{
            return {
                financial: action.payload.data,
                loader: action.payload.status == 200 ? false : true
            };
        }

        default:
            return state;
    }
};
