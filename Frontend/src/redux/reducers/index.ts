import { combineReducers, Reducer, UnknownAction } from "@reduxjs/toolkit";
import authSlice from './auth-reducer'
// import interviewReducer from './interview-reducer'
export interface RootState {
    auth: ReturnType<typeof authSlice>
    // interview: ReturnType<typeof interviewReducer>
}

const reducers = combineReducers({
    auth: authSlice,
    // interview: interviewReducer
})

const rootReducer: Reducer<RootState, UnknownAction> = (state, action) => {
    if (action.type === 'userLogout/fulfilled') {
        return reducers(undefined, action)
    }

    return reducers(state, action)
}

export default rootReducer