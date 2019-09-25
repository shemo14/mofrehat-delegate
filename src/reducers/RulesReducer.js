const INITIAL_STATE = { rules : null, loader : true };

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'getRules':
            return { rules: action.payload.data.roles, loader: action.payload.status == 200 ? false : true };
        default:
            return state;
    }
};
