const initialState = {
};

const ReasonCodesReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case 'FETCH_REASON_CODE_SUCCESS':
            return {
                ...state,
                reasonCodes: action.reasonCodes 
            }
        case 'FETCH_REASON_CODE_FAILED':
            return {
                ...state,
                error: action.error
            }
        default:
            return state;
    }
};

export default ReasonCodesReducer;