import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserCredential } from 'firebase/auth';

/*
 * Features:
 * user log in
 * user log out
 * user register
 */

export const TOKEN_KEY = 'user_token';
// const token = localStorage.getItem(TOKEN_KEY) ?? null;

export enum UserActions {
  LOGIN = 'user/login',
  LOGOUT = 'user/logout',
}

interface IAuthState {
  loading: boolean;
  token: string | null;
  user: UserCredential | null;
}

const initialState: IAuthState = {
  loading: false,
  token: null,
  user: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
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

    login(state, action: PayloadAction<UserCredential>) {
      return {
        type: UserActions.LOGIN,
        loading: false,
        token: 'logged in',
        user: action.payload,
      };
    },
  },
});

export const { login, loginAsOwner, loginAsAdmin, logout } = userSlice.actions;
export default userSlice.reducer;
