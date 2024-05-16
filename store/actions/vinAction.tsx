//Fetch Post
import axios from 'axios';
import { Moment } from 'moment';
import { displayLoader, setLastActivityTime } from './commonAction';
import { environment as env } from '@/config/env';

export const VinScanAction = (scanNextVINId: string, workdayIds: Object, stall: string, shop: string, startTime: any, location:string) => {
    return async (dispatch: any) => {
        dispatch(displayLoader(true));
        await axios.post(`${env.NEXT_PUBLIC_BASE_URL_API}/scan-vin/${location.toLowerCase()}`,
            {
                "workdaysID": workdayIds,
                "startTime": startTime,
                "shop": shop,
                "stall": stall,
                "vin": scanNextVINId
            },
            { headers: { "Authorization": `Bearer ${sessionStorage.getItem("tlslo_idToken")}` } }
        )
            .then((allVin) => {
                dispatch(checkVINStatusSuccess(allVin?.data));
                dispatch(displayLoader(false));
                dispatch(setLastActivityTime(Date.now()))
            })
            .catch((err) => {
                dispatch(checkVINStatusFailed(err?.response?.data));
                dispatch(displayLoader(false));
            })

    }
}

export const checkVINStatusSuccess = (vinStatus: any) => {
    return {
        type: 'CHECK_VIN_STATUS_SUCCESS',
        vinStatus: vinStatus
    }
}

export const checkVINStatusFailed = (error: any) => {
    return {
        type: 'CHECK_VIN_STATUS_FAILED',
        error
    }
}

export const clearVinStatus = () => {
    return {
        type: 'CLEAR_VIN_STATUS',
    }
}

export const scanNextVINIdAction = (vinId: any) => {
    return (dispatch: any) => {
        dispatch(scanNextVINIdSuccess(vinId))
    }
}

export const scanNextVINIdSuccess = (vinId: any) => {
    return {
        type: 'SCAN_NEXT_VIN_ID_SUCCESS',
        vinId: vinId
    }
}

export const setElementAction = (element: string) => {
    return (dispatch: any) => {
        dispatch(setElementSuccess(element))
    }
}

export const setElementSuccess = (element: string) => {
    return {
        type: 'SET_ELEMENT_SUCCESS',
        element: element,
    }
}

export const setStartTime = (startTime: any) => {
    return {
        type: 'SET_START_TIME',
        startTime: startTime,
    }
}

export const clearStartTime = () => {
    return {
        type: 'CLEAR_START_TIME',
    }
}