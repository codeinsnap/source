
const initialState = {
    userRole: "",
    message: ""
};

const AuthenticationReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case 'LOGOUT_SUCCESS':
            return {
                ...state
            }
        case 'CHECK_ROLE_SUCCESS':
            return {
                ...state,
                userRole: action.role,
                message: action.message
            }
        default:
            return state
    }
};

export default AuthenticationReducer;
