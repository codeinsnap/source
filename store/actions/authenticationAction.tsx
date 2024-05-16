import axios from 'axios';
import { displayLoader, setLastActivityTime } from './commonAction';
import { environment as env } from '@/config/env';

export const logoutAction = (location: string) => {//use this to make api call
    return async (dispatch: any) => {
        await axios.post(`${env.NEXT_PUBLIC_BASE_URL_API}/logout-user/${location?.toLowerCase()}`, {}, { headers: { "Authorization": `Bearer ${sessionStorage.getItem("tlslo_idToken")}` } })
            .then((response) => {
                console.log(response.data);
                dispatch(logoutSuccess(response?.data));
                dispatch(displayLoader(false))
            })
            .catch((err) => {
                dispatch(logoutFailed(err));
                dispatch(displayLoader(false))
            })

    }
}

export const logoutSuccess = (users: any) => {
    return {
        type: 'LOGOUT_SUCCESS',
    }
}

export const logoutFailed = (error: any) => {
    return {
        type: 'LOGOUT_FAILED',
        error
    }
}

export const checkRole = () => {//use this to make api call
    return async (dispatch: any) => {
        // dispatch(displayLoader(true));
        await axios.post(`${env.NEXT_PUBLIC_BASE_URL_API}/check-role`, {}, { headers: { "Authorization": `Bearer ${sessionStorage.getItem("tlslo_idToken")}` } })
            .then((response) => {
                dispatch(checkRoleSuccess(response?.data));
                dispatch(displayLoader(false));
                dispatch(setLastActivityTime(Date.now()))
            })
            .catch((err) => {
                dispatch(checkRoleFailed(err));
                dispatch(displayLoader(false));
            })
    }
}

export const checkRoleSuccess = (role: any) => {
    return {
        type: 'CHECK_ROLE_SUCCESS',
        role: role?.data,
        message: role?.message
    }
}

export const checkRoleFailed = (error: any) => {
    return {
        type: 'CHECK_ROLE_FAILED',
        error
    }
}

