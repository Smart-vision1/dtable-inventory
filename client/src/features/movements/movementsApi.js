import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const movementsApi = createApi({
  reducerPath: 'movementsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Movement', 'Product'],
  endpoints: (builder) => ({
    getMovements: builder.query({
      query: ({ page = 1, limit = 20, productId = '' } = {}) => ({
        url: '/movements',
        params: { page, limit, ...(productId && { productId }) },
      }),
      providesTags: ['Movement'],
    }),
    createMovement: builder.mutation({
      query: (movement) => ({
        url: '/movements',
        method: 'POST',
        body: movement,
      }),
      invalidatesTags: ['Movement', 'Product'],
    }),
  }),
});

export const { useGetMovementsQuery, useCreateMovementMutation } = movementsApi;
