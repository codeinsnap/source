import axios from 'axios';
import { displayLoader, setLastActivityTime } from './commonAction';
import { environment as env } from '@/config/env';

export const fetchProfileDetailsAction = (
    persona: string,
    location: string,
    VIN: string,
    startTime: string,
    workdayIds: []
) => {
    return async (dispatch: any) => {
        dispatch(displayLoader(true));
        await axios.post(
            `${env.NEXT_PUBLIC_BASE_URL_API}/dashboard/${location.toLowerCase()}`,
            {
                "persona": persona,
                "location": location,
                "vin": VIN,
                "startTime": startTime,
                "workdayIds": workdayIds
            },
            { headers: { "Authorization": `Bearer ${sessionStorage.getItem("tlslo_idToken")}` } }
        )
            .then((profileResponse) => {
                dispatch(fetchProfileDetailsSuccess(profileResponse?.data?.data));
                dispatch(displayLoader(false));
                dispatch(setLastActivityTime(Date.now()))
            })
            .catch((err) => {
                dispatch(fetchProfileDetailsFailed(err));
                dispatch(displayLoader(false));
            })
    }
}

export const fetchProfileDetailsSuccess = (profileData: any) => {
    return {
        type: 'FETCH_PROFILE_DATA_SUCCESS',
        profileData: profileData,
    }
}

export const fetchProfileDetailsFailed = (error: any) => {
    return {
        type: 'FETCH_PROFILE_DATA_FAILED',
        error
    }
}

export const setunitEleBtn = (element: string) => {
    return (dispatch: any) => {
        dispatch(setunitEleBtnSuccess(element))
    }
}

export const setunitEleBtnSuccess = (element: string) => {
    return {
        type: 'SET_UNIT_ELE_BTN_SUCCESS',
        element: element,
    }
}
