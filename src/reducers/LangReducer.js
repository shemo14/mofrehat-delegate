const INITIAL_STATE = { lang: 'ar' };

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'chooseLang':
            return { lang: action.payload };
        default:
            return state;
    }
};
