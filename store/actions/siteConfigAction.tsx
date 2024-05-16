import axios from 'axios';
import { displayLoader, setLastActivityTime } from './commonAction';
import { environment as env } from '@/config/env';

export const FetchSiteConfigTableDataAction = (location: string, current_time: any) => {//use this to make api call
    return async (dispatch: any) => {
        dispatch(displayLoader(true));
        await axios.get(`${env.NEXT_PUBLIC_BASE_URL_API}/dashboard/manager/site-configuration/${location.toLowerCase()}?current_time=${current_time}`, { headers: { "Authorization": `Bearer ${sessionStorage.getItem("tlslo_idToken")}` } })
            .then((response) => {
                if (response.data) {
                    dispatch(FetchSiteConfigTableDataSuccess(response?.data.data));
                    dispatch(setLastActivityTime(Date.now()))
                } else {
                    dispatch(FetchSiteConfigTableDataFailed(response?.data.data));
                    dispatch(displayLoader(false));
                }
            })
            .catch((err) => {
                dispatch(FetchSiteConfigTableDataFailed(err));
                dispatch(displayLoader(false));
            })
    }
}

export const FetchSiteConfigTableDataSuccess = (data: any) => {
    return {
        type: 'FETCH_SITE_CONFIG_TABLE_DATA_SUCCESS',
        data: data
    }
}

export const FetchSiteConfigTableDataFailed = (error: any) => {
    return {
        type: 'FETCH_SITE_CONFIG_TABLE_DATA_FAILED',
        error
    }
}

export const deleteEntryAction = (index: any) => {
    return {
        type: 'DELETE_ENTRY_FROM_PAYLOAD',
        index: index
    }
}

export const updateSettingsTablePayloadAction = (payload: any) => {
    return {
        type: 'UPDATE_SETTINGS_TABLE_PAYLOAD',
        payload: payload
    }
}

export const setSortedData = (sortedData: any[]) => {
    return {
        type: 'SORTED_DATA',
        sortedData: sortedData,
    }
}

export const setSiteConfigTab = (element: string) => {
    return (dispatch: any) => {
        dispatch(setSiteConfigTabSuccess(element))
    }
}

export const setSiteConfigTabSuccess = (element: string) => {
    return {
        type: 'SET_SITE_CONFIG_TAB_SUCCESS',
        element: element,
    }
}

export const saveSiteConfig = (location: string, payload: any) => {
    return async (dispatch: any) => {
        dispatch(displayLoader(true));
        await axios.post(`${env.NEXT_PUBLIC_BASE_URL_API}/dashboard/manager/site-configuration/${location.toLowerCase()}`, payload, { headers: { "Authorization": `Bearer ${sessionStorage.getItem("tlslo_idToken")}` } })
            .then((response) => {
                dispatch(saveSiteConfigSuccess(response));
                dispatch(displayLoader(false));
                dispatch(setLastActivityTime(Date.now()))
            })
            .catch((err) => {
                dispatch(saveSiteConfigFailed(err.response?.data));
                dispatch(displayLoader(false));
            })

    }
}

export const saveSiteConfigSuccess = (response: any) => {
    return {
        type: 'SAVE_SITE_CONFIG_SUCCESS',
        response: response
    }
}

export const saveSiteConfigFailed = (error: any) => {
    return {
        type: 'SAVE_SITE_CONFIG_FAILED',
        error
    }
}

export const clearSaveSiteConfigStatus = () => {
    return {
        type: 'CLEAR_SAVE_SITE_CONFIG_STATUS',
    }
}
export const clearSaveSiteConfigPayload = () => {
    return {
        type: 'CLEAR_SAVE_SITE_CONFIG_PAYLOAD',
    }
}

export const clearSiteConfigTableData = () => {
    return {
        type: 'CLEAR_SITE_CONFIG_TABLE_DATA',
    }
}

// EffectiveDateTime and Setting Modal
export const updateEffectiveDateTimeFormValues = ({ name, value }:any) => {
    return {
        type: 'UPDATE_EFFECTIVE_DATE_TIME_FORM_VALUES',
        payload: {
            name,
            value
        }
    }
}

export const clearEffectiveDateTimeFormValues = () => {
    return {
        type: 'CLEAR_EFFECTIVE_DATE_TIME_FORM_VALUES',
    }
}

export const setIsPast = (isPast:boolean) => {
    return {
        type: 'SET_IS_PAST',
        isPast
    }
}

export const setShowSettingsModal = (showSettingsModal:boolean) => {
    return {
        type: 'SET_SHOW_SETTINGS_MODAL',
        showSettingsModal
    }
}
export const setShowSettingsPageConfirmModal = (showSettingsPageConfirmModal:boolean) => {
    return {
        type: 'SET_SHOW_SETTINGS_PAGE_CONFIRM_MODAL',
        showSettingsPageConfirmModal
    }
}

export const setEffectiveErrors = (effectiveDateTimeError:boolean) => {
    return {
        type: 'SET_EFFECTIVE_ERRORS',
        effectiveDateTimeError
    }
}


// Add New Production Line
export const updateNewProductionLineFormValues = ({ name, value }:any, isOpsBuildingSelected:any) => {
    return {
        type: 'UPDATE_NEW_PRODUCTION_NEW_LINE_FORM_VALUES',
        payload: {
            name,
            value
        },
        isOpsBuildingSelected
    }
}

export const clearNewProductionLineFormValues = () => {
    return {
        type: 'CLEAR_NEW_PRODUCTION_LINE_FORM_VALUES',
    }
}

export const setShowNewLineModal = (showNewLineModal:boolean) => {
    return {
        type: 'SET_SHOW_NEW_LINE_MODAL',
        showNewLineModal
    }
}

export const setLineErrors = (lineError:boolean) => {
    return {
        type: 'SET_LINE_ERRORS',
        lineError
    }
}

// Add New Stall 
export const updateNewStallFormValues = ({ name, value }:any) => {
    return {
        type: 'UPDATE_NEW_STALL_FORM_VALUES',
        payload: {
            name,
            value
        }
    }
}

export const clearNewStallFormValues = () => {
    return {
        type: 'CLEAR_NEW_STALL_FORM_VALUES',
    }
}


export const setShowNewStallModal = (showNewStallModal:boolean) => {
    return {
        type: 'SET_SHOW_NEW_STALL_MODAL',
        showNewStallModal
    }
}

export const setStallErrors = (stallError:boolean) => {
    return {
        type: 'SET_STALL_ERRORS',
        stallError
    }
}

// Delete Line 
export const updateDeleteLineFormValues = ({ name, value }:any) => {
    return {
        type: 'UPDATE_DELETE_LINE_FORM_VALUES',
        payload: {
            name,
            value
        }
    }
}

export const clearDeleteLineFormValues = () => {
    return {
        type: 'CLEAR_DELETE_LINE_FORM_VALUES',
    }
}

export const setShowDeleteLineModal = (showDeleteLineModal:boolean) => {
    return {
        type: 'SET_SHOW_DELETE_LINE_MODAL',
        showDeleteLineModal
    }
}

export const setDeleteLineErrors = (deleteLineError:boolean) => {
    return {
        type: 'SET_DELETE_LINE_ERRORS',
        deleteLineError
    }
}

// showShopInactiveErrorMessage
export const setShowShopInactiveErrorMessage = (shopInactiveError:boolean) => {
    return {
        type: 'SET_SHOW_SHOP_INACTIVE_ERROR_MESSAGE',
        shopInactiveError
    }
}









