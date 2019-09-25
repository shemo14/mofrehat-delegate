const INITIAL_STATE = { reportsReasons : [], setReport :null , loader : true };

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'getReportsReasons':{
            return {
                reportsReasons: action.payload.data,
                loader: action.payload.status == 200 ? false : true
            };
        }
        case 'setReport':{
            return {
                setReport: action.payload.msg,
                loader: action.payload.status == 200 ? false : true
            };
        }

        default:
            return state;
    }
};
