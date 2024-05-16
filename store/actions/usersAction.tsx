import axios from 'axios';
import { displayLoader, setLastActivityTime } from './commonAction';
import { environment as env } from '@/config/env';

export const FetchUsersAction = (searchText: string, location:string) => {//use this to make api call
    return async (dispatch: any) => {
        await axios.get(`${env.NEXT_PUBLIC_BASE_URL_API}/workdayid/${location.toLowerCase()}?search=${searchText}`, { headers: { "Authorization": `Bearer ${sessionStorage.getItem("tlslo_idToken")}` } })
            .then((allUsers) => {
                if(allUsers.data) {
                    dispatch(fetchUsersSuccess(allUsers?.data.data));
                    dispatch(setLastActivityTime(Date.now()))
                } else {
                    dispatch(fetchUsersSuccess(allUsers?.data?.message));
                }
            })
            .catch((err) => {
                dispatch(fetchUsersFailed(err));
            })
    }
}

export const fetchUsersSuccess = (users: any) => {
    return {
        type: 'FETCH_USERS_SUCCESS',
        users: users
    }
}

export const fetchUsersFailed = (error: any) => {
    return {
        type: 'FETCH_USERS_FAILED',
        error
    }
}

export const searchTextAction = (searchText: any) => {
    return (dispatch: any) => {
        dispatch(searchTextSuccess(searchText))
    }
}

export const searchTextSuccess = (searchText: any) => {
    return {
        type: 'SEARCH_TEXT_SUCCESS',
        searchText: searchText
    }
}

export const selectedUserAction = (newUser: Object) => {
    return (dispatch: any) => {
        dispatch(selectedUserSuccess(newUser))
    }
}

export const selectedUserSuccess = (newUser: Object) => {
    return {
        type: 'SELECTED_USERS_SUCCESS',
        newUser: newUser
    }
}

export const removeItemId = (id: any) => {
    return (dispatch: any) => {
        dispatch(removeItemIdSuccess(id))
    }
}

export const removeItemIdSuccess = (id: any) => {
    return {
        type: 'REMOVE_ITEM_ID',
        id: id
    }
}

export const removeUserAction = (id: string, location:string) => {
    return async (dispatch: any) => {
        dispatch(displayLoader(true));
        await axios.post(`${env.NEXT_PUBLIC_BASE_URL_API}/remove-team-member/${location.toLowerCase()}`,
            {
                "workdayId": id
            },
            { headers: { "Authorization": `Bearer ${sessionStorage.getItem("tlslo_idToken")}` } }
        )
            .then((response) => {
                dispatch(removeUserSuccess(id));
                dispatch(displayLoader(false));
                dispatch(setLastActivityTime(Date.now()))
            })
            .catch((err) => {
                dispatch(removeUserFailed(err));
                dispatch(displayLoader(false));
            })

    }
}

export const removeUserSuccess = (id: string) => {
    return {
        type: 'REMOVE_USER_SUCCESS',
        id: id
    }
}

export const removeUserFailed = (error: any) => {
    return {
        type: 'REMOVE_USER_FAILED',
        error
    }
}
