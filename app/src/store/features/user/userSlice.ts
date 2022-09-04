import { createSlice } from '@reduxjs/toolkit';

/*
 * Features:
 * user log in
 * user log out
 * user register
 */

export const TOKEN_KEY = 'user_token';
const token = localStorage.getItem(TOKEN_KEY) ?? null;

const initialState = {
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

export function logout(state) {
  return {
    ...state,
    type: 'user/logout',
    loading: false,
    token: null,
  };
}

export function login(state) {
  return {
    ...state,
    type: 'user/login',
    loading: false,
    token: 'logged in',
  };
}

export default userSlice.reducer;
