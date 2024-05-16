
const initialState = {
    unitEle: [
        { name: 'vehicles', value: 'vehicles', label: 'Vehicles', isActive: true },
        { name: 'hours', value: 'hours', label: 'Hours', isActive: false },
    ]
};

const ProfileReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case 'FETCH_PROFILE_DATA_SUCCESS':
            return {
                ...state,
                profileData: action.profileData
            }
        case 'FETCH_PROFILE_DATA_FAILED':
            return {
                ...state,
                error: action.error
            }
        case 'SET_UNIT_ELE_BTN_SUCCESS':
            const updatedunitEle = (state.unitEle.length > 0) && state.unitEle.map((item: any) => {
                if (item.value === action.element) {
                    return { ...item, isActive: true }
                } else {
                    return { ...item, isActive: false }
                }
            })
            return {
                ...state,
                unitEle: updatedunitEle
            }

        default:
            return state;
    }
};

export default ProfileReducer;
