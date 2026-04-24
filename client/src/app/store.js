import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import productsReducer from '../features/products/productsSlice';
import { authApi } from '../features/auth/authApi';
import { productsApi } from '../features/products/productsApi';
import { movementsApi } from '../features/movements/movementsApi';
import { dashboardApi } from '../features/dashboard/dashboardApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    [authApi.reducerPath]: authApi.reducer,
    [productsApi.reducerPath]: productsApi.reducer,
    [movementsApi.reducerPath]: movementsApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      productsApi.middleware,
      movementsApi.middleware,
      dashboardApi.middleware
    ),
});
