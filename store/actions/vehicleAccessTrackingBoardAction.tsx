import axios from 'axios';
import { displayLoader, setLastActivityTime } from './commonAction';
import { environment as env } from '@/config/env';

//use this to make api call for the Vehicles

const currentDate = new Date();
const currentDateString = currentDate.toISOString().slice(0, 10);

export const fetchVehicleProgressTrackingAction = (shop?: string) => {
    return async (dispatch: any) => {
        const url = shop ? `${env.NEXT_PUBLIC_BASE_URL_API}/dashboard/manager/vehicle-progress-tracking-board/lb?shop=${shop}` : `${env.NEXT_PUBLIC_BASE_URL_API}/dashboard/manager/vehicle-progress-tracking-board/lb?/date=${currentDateString}`
        dispatch(displayLoader(true));
        await axios.get(url, { headers: { "Authorization": `Bearer ${sessionStorage.getItem("tlslo_idToken")}` } })
            .then((response) => {
                dispatch(displayLoader(false))
                dispatch(fetchVehicleProgressTrackingSuccess(response.data ? JSON.parse(JSON.stringify(response.data)) : response.data))
            })
            .catch((err) => {
               dispatch(displayLoader(false))
               dispatch(fetchVehicleProgressTrackingFailed(err))
            })
    }
}

export const fetchVehiceTrackingBoardFilterAction = (date: string) => {
    return async (dispatch: any) => {
        dispatch(displayLoader(true));
        await axios.get(`${env.NEXT_PUBLIC_BASE_URL_API}/dashboard/manager/vehicle-progress-tracking-board/lb/filter?date=${date}`, { headers: { "Authorization": `Bearer ${sessionStorage.getItem("tlslo_idToken")}` } })
            .then((response) => {
                dispatch(displayLoader(false))
                dispatch(fetchVehiceTrackingBoardFilterSuccess(response.data))
            })
            .catch((err) => {
               dispatch(displayLoader(false))
               dispatch(fetchVehiceTrackingBoardFilterFailed(err))
            })
    }
}

export const fetchVehicleProgressTrackingSuccess = (vehicleData: any) => {
    return {
        type: 'FETCH_VEHICLE_PROGRESS_BOARD_SUCCESS',
        vehicleProgressTracking: vehicleData.data
    }
}

export const fetchVehicleProgressTrackingFailed = (error: any) => {
    return {
        type: 'FETCH_VEHICLE_PROGRESS_BOARD_FAILED',
        error
    }
}

export const fetchVehiceTrackingBoardFilterSuccess = (filterData: any) => {
    return {
        type: 'FETCH_VEHICLE_TRACKING_FILTER_SUCCESS',
        vehicleFilterData: filterData.data
    }
}

export const fetchVehiceTrackingBoardFilterFailed = (error: any) => {
    return {
        type: 'FETCH_VEHICLE_TRACKING_FILTER_FAILED',
        error
    }
}

