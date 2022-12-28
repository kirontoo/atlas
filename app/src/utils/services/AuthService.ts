/*
 * AuthService will be the middleman between our UI and our Redux store.
 * This will allow us to reuse common authentication functionality accross
 * our code base without having to repeat ourselves.
 *
 */

import {
  browserLocalPersistence,
  browserSessionPersistence,
  setPersistence,
  signInWithEmailAndPassword,
  User,
} from 'firebase/auth';

import store from '../../store';
import {
  login as storeLogin,
  logout as storeLogout,
} from '../../store/features/user/userSlice';
import { auth } from '../firebase';

export interface LoginCredentials {
  email: string;
  password: string;
}

export const LOCAL_STORAGE_USER = 'ATLAS-AUTH-USER';

export const getLocalStorageUser = (): User | null =>
  JSON.parse(localStorage.getItem('authUser') || '{}') as User;

export const setLocalStorageUser = (user: User) =>
  localStorage.setItem(LOCAL_STORAGE_USER, JSON.stringify(user));

export const removeLocalStorageUser = () => localStorage.removeItem(LOCAL_STORAGE_USER);

export async function loginToFirebase(
  userCred: LoginCredentials,
  persistence: boolean,
): Promise<User> {
  let { email, password } = userCred;
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  await setPersistence(
    auth,
    persistence ? browserLocalPersistence : browserSessionPersistence,
  );

  setLoggedInUser(user);

  return user;
}

export function setLoggedInUser(user: User) {
  // update our redux store state
  store.dispatch(storeLogin(user.toJSON()));
  // update local storage
  setLocalStorageUser(user);
}

export function setLoggedOutUser() {
  store.dispatch(storeLogout());
  removeLocalStorageUser();
}

export function signupTofirebase() {}

export function signoutOfFirebase() {}
