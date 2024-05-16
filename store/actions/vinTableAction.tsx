//Fetch Post
import axios from 'axios';
import { displayLoader, setLastActivityTime } from './commonAction';
import { environment as env } from '@/config/env';

interface ISaveAccessories {
    vin: string,
    shop: string,
    stall: number,
    startTime: string,
    endTime: any,
    workdayIds: [string],
    accessoriesList: [Object]
}

export const VinTableAction = (vin: string, shop: string, workdayIds: [], startTime: string, location:string) => {
    return async (dispatch: any) => {
        dispatch(displayLoader(true));
        await axios.post(
            `${env.NEXT_PUBLIC_BASE_URL_API}/accessories/${location.toLowerCase()}`,
            {
                "VIN": vin,
                "shop": shop,
                "workdayIds": workdayIds,
                "startTime": startTime
            },
            { headers: { "Authorization": `Bearer ${sessionStorage.getItem("tlslo_idToken")}` } }
        )
            .then((allVin) => {
                dispatch(fetchVinTableSuccess(allVin.data.data));
                dispatch(displayLoader(false));
                dispatch(setLastActivityTime(Date.now()))
            })
            .catch((err) => {
                dispatch(fetchVinTableFailed(err));
                dispatch(displayLoader(false));
            })

    }
}

export const fetchVinTableSuccess = (vin_table_data: any) => {
    return {
        type: 'FETCH_VIN_TABLE_SUCCESS',
        vin_table_data: vin_table_data
    }
}

export const fetchVinTableFailed = (error: any) => {
    return {
        type: 'FETCH_VIN_TABLE_FAILED',
        error
    }
}

export const clearAccessoriesList = () => {
    return {
        type: 'CLEAR_ACCESSORIES_LIST',
    }
}

export const saveAccessories = (payload: ISaveAccessories, location:any) => {
    return async (dispatch: any) => {
        dispatch(displayLoader(true));
        await axios.post(`${env.NEXT_PUBLIC_BASE_URL_API}/save-vin/${location.toLowerCase()}`, payload, { headers: { "Authorization": `Bearer ${sessionStorage.getItem("tlslo_idToken")}` } })
            .then((response) => {
                dispatch(saveAccessoriesSuccess(response));
                dispatch(displayLoader(false));
                dispatch(setLastActivityTime(Date.now()))
            })
            .catch((err) => {
                dispatch(saveAccessoriesFailed(err.code));
                dispatch(displayLoader(false));
            })

    }
}

export const saveAccessoriesSuccess = (response: any) => {
    return {
        type: 'SAVE_ACCESSORIES_SUCCESS',
        response: response
    }
}

export const saveAccessoriesFailed = (error: any) => {
    return {
        type: 'SAVE_ACCESSORIES_FAILED',
        error
    }
}

export const clearSaveAccessoriesStatus = () => {
    return {
        type: 'CLEAR_SAVE_ACCESSORIES_STATUS',
    }
}
