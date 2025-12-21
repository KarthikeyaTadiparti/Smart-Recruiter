import { combineReducers, Reducer, UnknownAction } from "@reduxjs/toolkit";
import authSlice from './auth-reducer'
import jobSlice from './job-reducer'
import interviewSlice from './interview-reducer'
import feedbackSlice from './feedback-reducer'
export interface RootState {
    auth: ReturnType<typeof authSlice>
    job: ReturnType<typeof jobSlice>
    interview: ReturnType<typeof interviewSlice>
    feedback : ReturnType<typeof feedbackSlice> 
}

const reducers = combineReducers({
    auth: authSlice,
    job: jobSlice,
    interview : interviewSlice,
    feedback : feedbackSlice
})

const rootReducer: Reducer<RootState, UnknownAction> = (state, action) => {
    if (action.type === 'userLogout/fulfilled') {
        return reducers(undefined, action)
    }

    return reducers(state, action)
}

export default rootReducer