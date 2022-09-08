import { combineReducers } from 'redux';

import { apiSlice } from './features/api/apiSlice';
import userReducer from './features/user/userSlice';

const rootReducer = combineReducers({
  user: userReducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
});

export default rootReducer;
