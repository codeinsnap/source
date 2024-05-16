import axios from 'axios';
import { displayLoader, setLastActivityTime, setLastRefreshed } from './commonAction';
import { environment as env } from '@/config/env';

export const fetchSiteMeticAction = (location: string, date: any, time?: any, selectedFilterValue?: string) => {//use this to make api call
    return async (dispatch: any) => {
        dispatch(displayLoader(true));
        await axios.get(`${env.NEXT_PUBLIC_BASE_URL_API}/dashboard/manager/${location.toLowerCase()}?date=${date}&time=${time}&shift=${selectedFilterValue}`, { headers: { "Authorization": `Bearer ${sessionStorage.getItem("tlslo_idToken")}` } })
            .then((response) => {
                dispatch(fetchSiteMeticSuccess(response?.data.data));
                dispatch(displayLoader(false));
                dispatch(setLastActivityTime(Date.now()))
            })
            .catch((err) => {
                dispatch(fetchSiteMeticFailed(err));
                dispatch(displayLoader(false));
            })
    }
}

export const fetchSiteMeticSuccess = (siteMetric: any) => {
    return {
        type: 'FETCH_SITE_METRIC_SUCCESS',
        siteMetric: siteMetric
    }
}

export const fetchSiteMeticFailed = (error: any) => {
    return {
        type: 'FETCH_SITE_METRIC_FAILED',
        error
    }
}

export const setDateFilterElebtn = (element: string) => {
    return (dispatch: any) => {
        dispatch(setDateFilterEleBtnSuccess(element))
    }
}

export const setDateFilterEleBtnSuccess = (element: string) => {
    return {
        type: 'SET_DATE_FILTER_ELE_BTN_SUCCESS',
        element: element,
    }
}

export const setDateFilterEleBtnPTManager = (element: string) => {
    return (dispatch: any) => {
        dispatch(setDateFilterEleBtnPTManagerSuccess(element))
    }
}

export const setDateFilterEleBtnPTManagerSuccess = (element: string) => {
    return {
        type: 'SET_DATE_FILTER_PT_Manager_ELE_BTN_SUCCESS',
        element: element,
    }
}

export const setManagerUnitToggleBtn = (element: string) => {
    return (dispatch: any) => {
        dispatch(setManagerUnitToggleSuccess(element))
    }
}

export const setManagerUnitToggleSuccess = (element: string) => {
    return {
        type: 'SET_MANAGER_UNIT_TOGGLE_SUCCESS',
        element: element,
    }
}
