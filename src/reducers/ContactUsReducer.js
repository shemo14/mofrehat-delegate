const INITIAL_STATE = { phone : null , mail : null , socials : [], loader : true };

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'getContactUs':{
            return {
                phone: action.payload.data.info.phone,
                mail: action.payload.data.info.email,
                socials: action.payload.data.socials,
                loader: action.payload.status == 200 ? false : true
            };
        }

        default:
            return state;
    }
};
