import { combineReducers, Reducer, UnknownAction } from "@reduxjs/toolkit";
import authSlice from './auth-reducer'
import interviewSlice from './interview-reducer'
export interface RootState {
    auth: ReturnType<typeof authSlice>
    interview: ReturnType<typeof interviewSlice>
}

const reducers = combineReducers({
    auth: authSlice,
    interview: interviewSlice
})

const rootReducer: Reducer<RootState, UnknownAction> = (state, action) => {
    if (action.type === 'userLogout/fulfilled') {
        return reducers(undefined, action)
    }

    return reducers(state, action)
}

export default rootReducer