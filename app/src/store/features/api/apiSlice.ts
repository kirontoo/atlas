import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface APIResponse {
  status: string;
  data?: Record<string, unknown>;
  message: string;
}

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8080' }),
  endpoints: (builder) => ({
    getPing: builder.query<string, void>({
      query: () => '/ping',
      transformResponse: (response: { message: string }) => response.message,
    }),
    createUser: builder.mutation<APIResponse, { token: string; body: any }>({
      query: (data) => {
        const { token, body } = data;
        return {
          url: '/api/users',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: body,
        };
      },
      transformResponse: (response: { token: string; body: any }) => response.body,
    }),
  }),
});

export const { useGetPingQuery, useCreateUserMutation } = apiSlice;

export default apiSlice;
