/* eslint-disable no-unused-vars */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from 'firebase/auth';

export enum UserActions {
  LOGIN = 'user/login',
  LOGOUT = 'user/logout',
  START_LOADING = 'user/start-loading',
  END_LOADING = 'user/stop-loading',
}

interface IAuthState {
  loading: boolean;
  user: User | null;
}

const initialState: IAuthState = {
  loading: false,
  user: null,
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
        type: UserActions.LOGOUT,
        ...initialState,
      };
    },

    loginAsAdmin() {
      return {
        type: UserActions.LOGIN,
        loading: false,
        token: 'logged in',
        user: null,
      };
    },

    loginAsOwner() {
      return {
        type: 'user/login',
        loading: false,
        token: 'logged in',
        user: null,
      };
    },

    login(state: IAuthState, action: PayloadAction<User>) {
      return {
        type: UserActions.LOGIN,
        loading: false,
        token: 'logged in',
        user: action.payload,
      };
    },
  },
});

export const selectUser = (state: IAuthState) => state.user;

export const { startLoading, endLoading, login, loginAsOwner, loginAsAdmin, logout } =
  userSlice.actions;

export default userSlice.reducer;
