import { createSlice } from '@reduxjs/toolkit';

import type { User } from '../../../types';
import { AdminUser, MemberUser, OwnerUser } from './MockUserData';

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
  user: User | null;
}

const initialState: IAuthState = {
  loading: false,
  token: token,
  user: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    logout,
    login,
    loginAsAdmin,
    loginAsOwner,
  },
});

export function logout() {
  return {
    type: 'user/logout',
    ...initialState,
  };
}

export function loginAsAdmin() {
  return {
    type: 'user/login',
    loading: false,
    token: 'logged in',
    user: AdminUser,
  };
}

export function loginAsOwner() {
  return {
    type: 'user/login',
    loading: false,
    token: 'logged in',
    user: OwnerUser,
  };
}

export function login() {
  return {
    type: 'user/login',
    loading: false,
    token: 'logged in',
    user: MemberUser,
  };
}

export default userSlice.reducer;
