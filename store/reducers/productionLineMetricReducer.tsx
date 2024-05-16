const initialState = {
    productionLineMetric: ''
};

const productionLineMetricReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case 'FETCH_PRODUCTION_LINE_METRIC_SUCCESS':
            return {
                ...state,
                productionLineMetric: action.productionLineMetric
            }
        case 'FETCH_PRODUCTION_LINE_METRIC_FAILED':
            return {
                ...state,
                error: action.error
            }
        default:
            return state;
    }
};

export default productionLineMetricReducer;