import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_URL }),
  endpoints: (builder) => ({
    login: builder.mutation<{ token: string; user: any }, { email: string; password: string }>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
    }),
    me: builder.query<{ user: any }, void>({
      query: () => "/auth/me",
    }),
  }),
});

export const { useLoginMutation, useMeQuery } = authApi;
