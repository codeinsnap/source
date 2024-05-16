const initialState = {
    vehilceTimeSheet: {},
    isLoading: false,
    errors: {},
    vehicleFilterData: []
};

const VehicleReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case 'FETCH_VEHICLE_PROGRESS_BOARD_SUCCESS':
            return {
                ...state,
                errors: {},
                vehilceTimeSheet: action.vehicleProgressTracking,
            }
        case 'FETCH_VEHICLE_PROGRESS_BOARD_FAILED':
            return {
                ...state,
                errors: action.error
            }
        case 'FETCH_VEHICLE_TRACKING_FILTER_SUCCESS':
            return {
                ...state,
                errors: {},
                vehicleFilterData: action.vehicleFilterData,
            }
        case 'FETCH_VEHICLE_TRACKING_FILTER_FAILED':
            return {
                ...state,
                errors: action.error
            }
        default:
            return state;
    }
};

export default VehicleReducer;
