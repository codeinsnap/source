
const initialState = {
    vin_table_data: [],
    saveAccessoriesStatus: {}
};

const VinTableReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case 'FETCH_VIN_TABLE_SUCCESS':
            return {
                ...state,
                vin_table_data: action.vin_table_data
            }
        case 'FETCH_VIN_TABLE_FAILED':
            return {
                ...state,
                error: action.err
            }
        case 'CLEAR_ACCESSORIES_LIST':
            return {
                ...state,
                vin_table_data: []
            }
        case 'SAVE_ACCESSORIES_SUCCESS':
            return {
                ...state,
                saveAccessoriesStatus: {
                    message: action.response.message,
                    data: action.response.data,
                    status: action.response.status,
                }   
            }
        case 'SAVE_ACCESSORIES_FAILED':
            return {
                ...state,
                saveAccessoriesStatus: {
                    error: action.error
                } 
            }
        case 'CLEAR_SAVE_ACCESSORIES_STATUS':
            return {
                ...state,
                saveAccessoriesStatus: {}
            }
        default:
            return state;
    }
};

export default VinTableReducer;
