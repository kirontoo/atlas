import { configureStore } from '@reduxjs/toolkit';

import apiSlice from './features/api/apiSlice';
import rootReducer from './reducer';

const Store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export default Store;
