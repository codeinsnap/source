export const updateTabAction = (path: string, persona: string) => {
    return (dispatch: any) => {
        dispatch(updateTabSuccess(path, persona))
    }
}

export const updateTabSuccess = (path: string, persona: string) => {
    return {
        type: 'UPDATE_TAB_SUCCESS',
        path: path,
        persona: persona
    }
}
