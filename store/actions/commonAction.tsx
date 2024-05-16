import axios from 'axios';
import { Action, Dispatch } from 'redux';
import { fetchProductionLineMetricFailed, fetchProductionLineMetricSuccess } from './productionLineMetricAction';
import moment from 'moment';
import { toastError } from '@/utility/commonFunctions';
import { CONSTANTS } from '@/constants/constants';
import { fetchSiteMeticFailed, fetchSiteMeticSuccess } from './siteMetricAction';
import { environment as env } from '@/config/env';
import { fetchVehicleProgressTrackingFailed, fetchVehicleProgressTrackingSuccess } from './vehicleAccessTrackingBoardAction';

export const displayLoader = (displayLoader: boolean) => {
    return {
        type: 'DISPLAY_LOADER',
        displayLoader: displayLoader
    }
}

export const setLastRefreshed = (lastRefreshed: any) => {
    return {
        type: 'SET_LAST_REFRESHED',
        lastRefreshed: lastRefreshed,
    }
}

export const setLastVptbRefreshed = (lastRefreshed: any) => {
    return {
        type: 'SET_LAST_VPTB_REFRESHED',
        lastRefreshed: lastRefreshed,
    }
}

export const setLastActivityTime = (lastActivityTime: any) => {
    return {
        type: 'SET_LAST_ACTIVITY_TIME',
        lastActivityTime: lastActivityTime,
    }
}

/**
 * Function to Refresh both SiteMetrics and Production Line for LB
 * @param location Location
 * @param date Date
 * @param time Time
 * @param selectedFilterValue Today/Yesterday
 * @param shopName eg A1
 * @param choice TODAY/YESTERDAY
 * @param dispatch Redux Dispatch
 */

export const refreshAction = async (
    location: string,
    date: any,
    time: any,
    selectedFilterValue: string,
    shopName: any,
    choice: any,
    isVptb: boolean = false,
    dispatch: Dispatch<Action>
) => {
    // const clearScreen = () => {
    //     dispatch(fetchSiteMeticSuccess({}));
    //     dispatch(fetchProductionLineMetricSuccess({}));
    // };
    try {
        const currentDate = new Date();
        const currentDateString = currentDate.toISOString().slice(0, 10);
        const siteMetricsAPI = `${env.NEXT_PUBLIC_BASE_URL_API}/dashboard/manager/${location.toLowerCase()}?date=${date}&time=${time}&shift=${selectedFilterValue}`;
        const prdlnMetrics = `${env.NEXT_PUBLIC_BASE_URL_API}/dashboard/manager/shop-metrics/${location.toLowerCase()}?date=${date}&shop=${shopName}&choice=${choice}`;
        const vptbUrl = `${env.NEXT_PUBLIC_BASE_URL_API}/dashboard/manager/vehicle-progress-tracking-board/lb?/date=${currentDateString}`

        const axiosOptions = {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("tlslo_idToken")}`,
            },
        };
        dispatch(displayLoader(true));
        if (isVptb) {
            const [vptbData] = await axios.all([
                axios.get(vptbUrl, axiosOptions),
            ]);
            if (vptbData.status == 200) {
                dispatch(fetchVehicleProgressTrackingSuccess(vptbData.data ? JSON.parse(JSON.stringify(vptbData.data)) : vptbData.data))
                dispatch(setLastActivityTime(Date.now()));
                const lbTime = moment.tz('America/Los_Angeles').format('ddd MM/DD/YYYY LT');
                dispatch(setLastVptbRefreshed(lbTime));
            } else {
                toastError(CONSTANTS.REFRESH_ERROR);
                // clearScreen();
                dispatch(fetchVehicleProgressTrackingFailed({}))
            }
        } else {
            const [siteData, prodData] = await axios.all([
                axios.get(siteMetricsAPI, axiosOptions),
                axios.get(prdlnMetrics, axiosOptions),
            ]);
            if (siteData.status == 200 && prodData.status == 200) {
                dispatch(fetchSiteMeticSuccess(siteData?.data.data));
                dispatch(fetchProductionLineMetricSuccess(prodData?.data.data));
                dispatch(setLastActivityTime(Date.now()));
                const lbTime = moment.tz('America/Los_Angeles').format('ddd MM/DD/YYYY LT');
                dispatch(setLastRefreshed(lbTime));
            } else {
                toastError(CONSTANTS.REFRESH_ERROR);
                // clearScreen();
                dispatch(fetchSiteMeticFailed({}));
                dispatch(fetchProductionLineMetricFailed({}));
            }
        }
    } catch (err) {
        toastError(CONSTANTS.REFRESH_ERROR);
        // clearScreen();
        if (isVptb) {
            dispatch(fetchVehicleProgressTrackingFailed({}))
        }
        else {
            dispatch(fetchSiteMeticFailed(err));
            dispatch(fetchProductionLineMetricFailed(err));
        }
    } finally {
        dispatch(displayLoader(false));
    }
};