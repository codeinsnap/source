import { displayLoader } from "./commonAction"

export const resetAction = () => {
    return (dispatch: any) => {
        dispatch(resetSuccess())
        dispatch(displayLoader(false))
    }
}
export const resetSuccess = () => {
    return {
        type: 'RESET',
    }
}
