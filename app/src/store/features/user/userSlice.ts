/* eslint-disable no-unused-vars */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from 'firebase/auth';

import { RootState } from '../../reducer';

export enum UserActions {
  LOGIN = 'user/login',
  LOGOUT = 'user/logout',
  START_LOADING = 'user/start-loading',
  END_LOADING = 'user/stop-loading',
}

export interface IAuthState {
  loading: boolean;
  user: User | null | object;
  isAuthenticated: boolean;
}

const initialState: IAuthState = {
  loading: false,
  user: null,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    startLoading(state: IAuthState) {
      return {
        type: UserActions.START_LOADING,
        ...state,
        loading: true,
      };
    },
    endLoading(state: IAuthState) {
      return {
        type: UserActions.END_LOADING,
        ...state,
        loading: false,
      };
    },
    logout() {
      return {
        ...initialState,
        type: UserActions.LOGOUT,
        isAuthenticated: false,
      };
    },

    loginAsAdmin(state: IAuthState) {
      return {
        ...state,
        type: UserActions.LOGIN,
        loading: false,
        user: null,
      };
    },

    loginAsOwner(state: IAuthState) {
      return {
        ...state,
        type: 'user/login',
        loading: false,
        user: null,
      };
    },

    login(state: IAuthState, action: PayloadAction<User | object>) {
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
      };
    },
  },
});

export const selectUser = (state: RootState) => (state.user ? state.user.user : null);
export const selectAuthenticated = (state: RootState) => state.user.isAuthenticated;

export const { startLoading, endLoading, login, loginAsOwner, loginAsAdmin, logout } =
  userSlice.actions;

export default userSlice.reducer;
