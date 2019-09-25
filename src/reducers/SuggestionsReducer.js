const INITIAL_STATE = { suggestions : null, loader : true };

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'getSuggestions':{
            return {
                suggestions: action.payload.msg,
                loader: action.payload.status == 200 ? false : true
            };
        }

        default:
            return state;
    }
};
