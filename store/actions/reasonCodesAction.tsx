import axios from 'axios';
import { setLastActivityTime } from './commonAction';
import { environment as env } from '@/config/env';

export const fetchReasonCodesAction = () => {
    return async (dispatch: any) => {
        await axios.get(`${env.NEXT_PUBLIC_BASE_URL_API}/reason-codes`, { headers: { "Authorization": `Bearer ${sessionStorage.getItem("tlslo_idToken")}` } })
            .then((reasonCodesResponse) => {
                dispatch(fetchReasonCodesSuccess(reasonCodesResponse?.data?.data));
                dispatch(setLastActivityTime(Date.now()))
            })
            .catch((err) => {
                dispatch(fetchReasonCodesFailed(err));
            })
    }
}

export const fetchReasonCodesSuccess = (reasonCodes: any) => {
    return {
        type: 'FETCH_REASON_CODE_SUCCESS',
        reasonCodes: reasonCodes,
    }
}

export const fetchReasonCodesFailed = (error: any) => {
    return {
        type: 'FETCH_REASON_CODE_FAILED',
        error
    }
}