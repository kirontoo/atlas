import { createSlice } from '@reduxjs/toolkit';

/*
 * Features:
 * user log in
 * user log out
 * user register
 */

export const TOKEN_KEY = 'user_token';
const token = localStorage.getItem(TOKEN_KEY) ?? null;

interface IAuthState {
  loading: boolean;
  token: string | null;
}

const initialState: IAuthState = {
  loading: false,
  token: token,
};

const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    logout,
    login,
  },
});

export function logout() {
  return {
    type: 'user/logout',
    ...initialState,
  };
}

export function login() {
  return {
    type: 'user/login',
    loading: false,
    token: 'logged in',
  };
}

export default userSlice.reducer;
