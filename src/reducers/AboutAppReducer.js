const INITIAL_STATE = { aboutApp : null, loader : true };

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'getAboutApp':
            return { aboutApp: action.payload.data.about, loader: action.payload.status == 200 ? false : true };
        default:
            return state;
    }
};
