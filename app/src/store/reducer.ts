import { combineReducers } from 'redux';

import { apiSlice } from './features/api/apiSlice';
import projectReducer, { ProjectState } from './features/projects';
import userReducer, { IAuthState } from './features/user/userSlice';

export interface RootState {
  user: IAuthState;
  projects: ProjectState;
}

const rootReducer = combineReducers({
  user: userReducer,
  projects: projectReducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
});

export default rootReducer;
