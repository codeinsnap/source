const initialState = {
    displayLoader: false,
    lastRefreshed: "",
    lastActivityTime: "",
    lastVptbRefreshed: ""
};

const commonReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case 'DISPLAY_LOADER':
            return {
                ...state,
                displayLoader: action.displayLoader
            }
        case 'SET_LAST_REFRESHED':
            return {
                ...state,
                lastRefreshed: action.lastRefreshed
            }
        case 'SET_LAST_VPTB_REFRESHED':
            return {
                ...state,
                lastVptbRefreshed: action.lastRefreshed
            }
        case 'SET_LAST_ACTIVITY_TIME':
            return {
                ...state,
                lastActivityTime: action.lastActivityTime
            }
            
        default:
            return state
    }
};

export default commonReducer;
