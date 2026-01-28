import { combineReducers, Reducer, UnknownAction } from "@reduxjs/toolkit";
import authSlice from './auth-reducer'
import jobSlice from './job-reducer'
import interviewSlice from './interview-reducer'
import applicationSlice from './application-reducer'
export interface RootState {
    auth: ReturnType<typeof authSlice>
    job: ReturnType<typeof jobSlice>
    interview: ReturnType<typeof interviewSlice>
    application : ReturnType<typeof applicationSlice> 
}

const reducers = combineReducers({
    auth: authSlice,
    job: jobSlice,
    interview : interviewSlice,
    application : applicationSlice
})

const rootReducer: Reducer<RootState, UnknownAction> = (state, action) => {
    if (action.type === 'userLogout/fulfilled') {
        return reducers(undefined, action)
    }

    return reducers(state, action)
}

export default rootReducer