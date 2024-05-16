
const initialState = {
    users: [],
    searchText: "",
    selectedUsers: [],
    removeId: "",
    removeUserError: ""
};

const UsersReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case 'FETCH_USERS_SUCCESS':
            return {
                ...state,
                users: action.users,
            }
        case 'FETCH_USERS_FAILED':
            return {
                ...state,
                users: [],
            }
        case 'SEARCH_TEXT_SUCCESS':
            return {
                ...state,
                searchText: action.searchText
            }
        case 'SELECTED_USERS_SUCCESS':
            let newUserArr: any = [...state.selectedUsers, action.newUser];
            return {
                ...state,
                selectedUsers: newUserArr
            }
        case 'REMOVE_ITEM_ID':
            return {
                ...state,
                removeId: action.id
            }
        case 'REMOVE_USER_SUCCESS':
            let arr = state.selectedUsers.filter((item: any) => item.code !== action.id)
            return {
                ...state,
                selectedUsers: arr
            }
        case 'REMOVE_USER_FAILED':
            return {
                ...state,
                removeUserError: action.error
            }
        default:
            return state;
    }
};

export default UsersReducer;
