import axios from 'axios';
import { displayLoader, setLastActivityTime } from './commonAction';
import { environment as env } from '@/config/env';

export const fetchProductionLineMetricAction = (date:any,shopName:any, choice:any, location: string) => {//use this to make api call
    return async (dispatch: any) => {
        dispatch(displayLoader(true));
        await axios.get(`${env.NEXT_PUBLIC_BASE_URL_API}/dashboard/manager/shop-metrics/${location.toLowerCase()}?date=${date}&shop=${shopName}&choice=${choice}`, { headers: { "Authorization": `Bearer ${sessionStorage.getItem("tlslo_idToken")}` } })
            .then((response) => {
                dispatch(fetchProductionLineMetricSuccess(response?.data.data));
                dispatch(displayLoader(false));
                dispatch(setLastActivityTime(Date.now()))
            })
            .catch((err) => {
                dispatch(fetchProductionLineMetricFailed(err));
                dispatch(displayLoader(false));
            })
    }
}

export const fetchProductionLineMetricSuccess = (productionLineMetric: any) => {
    return {
        type: 'FETCH_PRODUCTION_LINE_METRIC_SUCCESS',
        productionLineMetric: productionLineMetric
    }
}

export const fetchProductionLineMetricFailed = (error: any) => {
    return {
        type: 'FETCH_PRODUCTION_LINE_METRIC_FAILED',
        error
    }
}

