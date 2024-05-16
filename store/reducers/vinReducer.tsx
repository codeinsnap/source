
const initialState = {
    vinStatus: '',
    scanNextVINId: '',
    element: 'scan_input',
    startTime: ''
};

const VinReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case 'CHECK_VIN_STATUS_SUCCESS':
            return {
                ...state,
                vinStatus: action.vinStatus,
            }
        case 'CHECK_VIN_STATUS_FAILED':
            return {
                ...state,
                vinStatus: action.error
            }
        case 'CLEAR_VIN_STATUS': 
            return {
                ...state,
                vinStatus: ''
            }
        case 'SCAN_NEXT_VIN_ID_SUCCESS':
            return {
                ...state,
                scanNextVINId: action.vinId
            }
        case 'scan_Next_VIN_Id_Failed':
            return {
                ...state,
                scanNextVINId: ''
            }
        case 'SET_ELEMENT_SUCCESS':
            return {
                ...state,
                element: action.element
            }
        case 'SET_START_TIME':
            return {
                ...state,
                startTime: action.startTime
            }
        case 'CLEAR_START_TIME':
            return {
                ...state,
                startTime: ''
            }
        default:
            return state;
    }
};

export default VinReducer;
