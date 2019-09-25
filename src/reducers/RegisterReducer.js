const INITIAL_STATE = { register : [] , loader : true };

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'register':{
            return {
                register: action.payload.data,
                loader: action.payload.status == 200 ? false : true
            };
        }

        default:
            return state;
    }
};
