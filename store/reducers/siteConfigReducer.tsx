
const initialState = {
    site_config_table_data: [],
    dictionary: [],
    history: [],
    payload: [],
    maxStallId: '',
    saveSiteConfigStatus: {},
    siteConfigTabs: [
        { name: 'configuration_line', value: 'configuration_line', label: 'Configuration Line', isActive: true },
        { name: 'history', value: 'history', label: 'History', isActive: false },
    ],
    effectiveDateTimeInputs: {
        effectiveDate: '',
        effectiveHours: '',
        effectiveMinutes: ''
    },
    newProductionLineInputs: {
        shop: '',
        shop_name: '',
        location: '',
        isFQA: '',
        // conveyorLine: ''
    },
    newStallInputs: {
        shop: '',
        stall_id: '',
        location_stall: ''
    },
    deleteLineInputs: {
        productionLine: ''
    },
    showSettingsModal: false,
    showSettingsPageConfirmModal: false,
    showNewLineModal: false,
    showNewStallModal: false,
    showDeleteLineModal: false,
    isPast: false,
    effectiveDateTimeError: false,
    lineError: false,
    stallError: false,
    deleteLineError: false,
    shopInactiveError: false,
};

const siteConfigReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case 'FETCH_SITE_CONFIG_TABLE_DATA_SUCCESS':
            return {
                ...state,
                site_config_table_data: action.data.site_config,
                dictionary: action.data.dictionary,
                history: action.data.history,
                maxStallId: action.data.maxStallId
            }
        case 'FETCH_SITE_CONFIG_TABLE_DATA_FAILED':
            return {
                ...state,
                error: action.error
            }
        case 'DELETE_ENTRY_FROM_PAYLOAD':
            let newPayload = state?.payload.splice(action.index, 1);
            return {
                ...state,
                payload: newPayload
            }
        case 'UPDATE_SETTINGS_TABLE_PAYLOAD':
            return {
                ...state,
                payload: action.payload
            }
        case 'SORTED_DATA':
            return {
                ...state,
                site_config_table_data: [...action.sortedData]
            }
        case 'SAVE_SITE_CONFIG_SUCCESS':
            return {
                ...state,
                saveSiteConfigStatus: {
                    message: action.response.message,
                    data: action.response.data,
                    type: action.response.type,
                }
            }
        case 'SAVE_SITE_CONFIG_FAILED':
            return {
                ...state,
                saveSiteConfigStatus: {
                    data: action.error?.data,
                    message: action.error?.message,
                    type: action.error?.type,
                }
            }
        case 'CLEAR_SAVE_SITE_CONFIG_STATUS':
            return {
                ...state,
                saveSiteConfigStatus: {}
            }
        case 'CLEAR_SAVE_SITE_CONFIG_PAYLOAD':
            return {
                ...state,
                payload: []
            }
        case 'CLEAR_SITE_CONFIG_TABLE_DATA':
            return {
                ...state,
                site_config_table_data: [],
                dictionary: [],
                history: [],
                payload: [],
                saveSiteConfigStatus: {},
                effectiveDateTimeInputs: {
                    effectiveDate: '',
                    effectiveHours: '',
                    effectiveMinutes: ''
                },
                newProductionLineInputs: {
                    shop: '',
                    shop_name: '',
                    location: '',
                    isFQA: '',
                    // conveyorLine: ''
                },
                newStallInputs: {
                    shop: '',
                    stall_id: '',
                    location_stall: ''
                },
                deleteLineInputs: {
                    productionLine: ''
                },
                showSettingsModal: false,
                showSettingsPageConfirmModal: false,
                showNewLineModal: false,
                showNewStallModal: false,
                showDeleteLineModal: false,
                isPast: false,
                effectiveDateTimeError: false,
                lineError: false,
                stallError: false,
                deleteLineError: false,
                shopInactiveError: false
            }
        case 'SET_SITE_CONFIG_TAB_SUCCESS':
            const updatedsiteConfigTabs = (state.siteConfigTabs.length > 0) && state.siteConfigTabs.map((item: any) => {
                if (item.value === action.element) {
                    return { ...item, isActive: true }
                } else {
                    return { ...item, isActive: false }
                }
            })
            return {
                ...state,
                siteConfigTabs: updatedsiteConfigTabs
            }
        case 'UPDATE_EFFECTIVE_DATE_TIME_FORM_VALUES':
            return {
                ...state,
                effectiveDateTimeInputs: { ...state.effectiveDateTimeInputs, [action.payload.name]: action.payload.value }
            }
        case 'UPDATE_NEW_PRODUCTION_NEW_LINE_FORM_VALUES':
            if (action.payload.name === 'location' && action.payload.value === 'PQA Stalls' && action.isOpsBuildingSelected) {
                return {
                    ...state,
                    newProductionLineInputs: { ...state.newProductionLineInputs, isFQA: '' }
                }
            }
            else if (action.payload.name === 'location' && action.payload.value === 'PQA Conveyors' && action.isOpsBuildingSelected) {
                return {
                    ...state,
                    newProductionLineInputs: { ...state.newProductionLineInputs, isFQA: '' }
                }
            } else {
                return {
                    ...state,
                    newProductionLineInputs: { ...state.newProductionLineInputs, [action.payload.name]: action.payload.value }
                }
            }
        case 'UPDATE_NEW_STALL_FORM_VALUES':
            return {
                ...state,
                newStallInputs: { ...state.newStallInputs, [action.payload.name]: action.payload.value }
            }
        case 'UPDATE_DELETE_LINE_FORM_VALUES':
            return {
                ...state,
                deleteLineInputs: { ...state.deleteLineInputs, [action.payload.name]: action.payload.value }
            }
        case 'CLEAR_EFFECTIVE_DATE_TIME_FORM_VALUES':
            return {
                ...state,
                effectiveDateTimeInputs: {
                    effectiveDate: '',
                    effectiveHours: '',
                    effectiveMinutes: ''
                },
            }
        case 'CLEAR_NEW_PRODUCTION_LINE_FORM_VALUES':
            return {
                ...state,
                newProductionLineInputs: {
                    shop: '',
                    shop_name: '',
                    location: '',
                    isFQA: '',
                    // conveyorLine: ''
                },
            }
        case 'CLEAR_NEW_STALL_FORM_VALUES':
            return {
                ...state,
                newStallInputs: {
                    shop: '',
                    stall_id: '',
                    location_stall: ''
                },
            }
        case 'CLEAR_DELETE_LINE_FORM_VALUES':
            return {
                ...state,
                deleteLineInputs: {
                    productionLine: ''
                }
            }
        case 'SET_SHOW_SETTINGS_MODAL':
            return {
                ...state,
                showSettingsModal: action.showSettingsModal
            }
        case 'SET_SHOW_SETTINGS_PAGE_CONFIRM_MODAL':
            return {
                ...state,
                showSettingsPageConfirmModal: action.showSettingsPageConfirmModal
            }
        case 'SET_SHOW_NEW_LINE_MODAL':
            return {
                ...state,
                showNewLineModal: action.showNewLineModal
            }
        case 'SET_SHOW_NEW_STALL_MODAL':
            return {
                ...state,
                showNewStallModal: action.showNewStallModal
            }

        case 'SET_SHOW_DELETE_LINE_MODAL':
            return {
                ...state,
                showDeleteLineModal: action.showDeleteLineModal
            }
        case 'SET_IS_PAST':
            return {
                ...state,
                isPast: action.isPast
            }
        case 'SET_EFFECTIVE_ERRORS':
            return {
                ...state,
                effectiveDateTimeError: action.effectiveDateTimeError
            }
        case 'SET_LINE_ERRORS':
            return {
                ...state,
                lineError: action.lineError
            }

        case 'SET_STALL_ERRORS':
            return {
                ...state,
                stallError: action.stallError
            }
        case 'SET_DELETE_LINE_ERRORS':
            return {
                ...state,
                deleteLineError: action.deleteLineError
            }
        case 'SET_SHOW_SHOP_INACTIVE_ERROR_MESSAGE':
            return {
                ...state,
                shopInactiveError: action.shopInactiveError
            }
        default:
            return state;
    }
};

export default siteConfigReducer;
