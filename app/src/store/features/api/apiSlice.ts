import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const APIBaseURL = import.meta.env.DEV
  ? 'http://localhost:8080'
  : import.meta.env.BASE_URL;

interface APIResponse<T> {
  status: string;
  data: T;
  message: string;
}

interface UserResponse {
  username: string;
  email: string;
  role?: number;
  firstName: string;
  lastName: string;
}

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: APIBaseURL }),
  endpoints: (builder) => ({
    getPing: builder.query<string, void>({
      query: () => '/ping',
      transformResponse: (response: { message: string }) => response.message,
    }),
    createUser: builder.mutation<APIResponse<UserResponse>, any>({
      query: (data) => {
        return {
          url: '/api/users',
          method: 'POST',
          body: data,
        };
      },
      transformResponse: (response: { data: APIResponse<UserResponse> }) => response.data,
    }),
    updateUser: builder.mutation<APIResponse<UserResponse>, { token: string; body: any }>(
      {
        query: ({ token, body }) => {
          return {
            url: '/api/users',
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: body,
          };
        },
      },
    ),
  }),
});

export const { useGetPingQuery, useCreateUserMutation } = apiSlice;

export default apiSlice;
