const initialState = {
    unitEle: [
        { name: "today", value: "today", label: "Today", isActive: true },
        { name: "yesterday", value: "yesterday", label: "Yesterday", isActive: false },
    ],
    managerToggleEle: [
        { name: 'vehicles', value: 'vehicles', label: 'Vehicles', isActive: true },
        { name: 'hours', value: 'hours', label: 'Hours', isActive: false },
    ],
    unitElePrincetonManager: [
        { name: "shift1", value: "1", label: "Shift1", isActive: true },
        { name: "shift2", value: "2", label: "Shift2", isActive: false },
        { name: "today", value: "today", label: "Today", isActive: false },
        { name: "yesterday", value: "yesterday", label: "Yesterday", isActive: false },
    ],
    siteMetric: {}
};

const siteMetricReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case 'FETCH_SITE_METRIC_SUCCESS':
            return {
                ...state,
                siteMetric: action.siteMetric
            }
        case 'FETCH_SITE_METRIC_FAILED':
            return {
                ...state,
                error: action.error
            }
        case 'SET_DATE_FILTER_ELE_BTN_SUCCESS':
            const updatedunitEle = (state.unitEle.length > 0) && state.unitEle.map((item: any) => {
                if (item.value === action.element) {
                    return { ...item, isActive: true }
                } else {
                    return { ...item, isActive: false }
                }
            })
            return {
                ...state,
                unitEle: updatedunitEle
            }
        case 'SET_DATE_FILTER_PT_Manager_ELE_BTN_SUCCESS':
            const updatedUnitElePrincetonManager = (state.unitElePrincetonManager.length > 0) && state.unitElePrincetonManager.map((item: any) => {
                if (item.value === action.element) {
                    return { ...item, isActive: true }
                } else {
                    return { ...item, isActive: false }
                }
            })
            return {
                ...state,
                unitElePrincetonManager: updatedUnitElePrincetonManager
            }
        case 'SET_MANAGER_UNIT_TOGGLE_SUCCESS':
            const updatedManagerToggleEle = (state.managerToggleEle.length > 0) && state.managerToggleEle.map((item: any) => {
                if (item.value === action.element) {
                    return { ...item, isActive: true }
                } else {
                    return { ...item, isActive: false }
                }
            })
            return {
                ...state,
                managerToggleEle: updatedManagerToggleEle
            }
        default:
            return state;
    }
};

export default siteMetricReducer;