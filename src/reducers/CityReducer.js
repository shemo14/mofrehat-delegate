const INITIAL_STATE = { cities : [], loader : true };

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'getCities':{
            return {
                cities: action.payload.data,
                loader: action.payload.status == 200 ? false : true
            };
        }
        default:
            return state;
    }
};
