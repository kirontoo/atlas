import { combineReducers } from 'redux';

import { apiSlice } from './features/api/apiSlice';
import userReducer, { IAuthState } from './features/user/userSlice';

export interface RootState {
  user: IAuthState;
}

const rootReducer = combineReducers({
  user: userReducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
});

export default rootReducer;
