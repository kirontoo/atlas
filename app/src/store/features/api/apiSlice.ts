import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8080' }),
  endpoints: (builder) => ({
    getPing: builder.query<string, void>({
      query: () => '/ping',
      transformResponse: (response: { message: string }) => response.message,
    }),
  }),
});

export const { useGetPingQuery } = apiSlice;

export default apiSlice;
