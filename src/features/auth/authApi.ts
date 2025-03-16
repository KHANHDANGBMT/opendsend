import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AuthState, User, View, login } from "./authSlice";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user: User;
  view: View;
  accesses: {
    store_id: string | null;
    user_id: number;
    role_id: number;
  }[];
  tokens: {
    accessToken: string;
    refreshToken: string;
    clientToken: string;
  };
}

export interface UserProfileResponse {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

// Define the base URL for the API
const BASE_URL = "https://stgapp-bwgkn3md.opensend.com";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      // Get tokens from auth state
      const state = getState() as { auth: AuthState };
      const { accessToken } = state.auth;

      // If we have tokens, add them to the headers
      if (accessToken) {
        headers.set("Access-Token", `Bearer ${accessToken}`);
      }

      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      // The response is already in the expected format, so we can pass it directly
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Dispatch login action from our auth slice with the response data
          dispatch(login(data));
        } catch (error) {
          // Error is handled by RTK Query automatically
        }
      },
    }),
    getUserProfile: builder.query<UserProfileResponse, void>({
      query: () => ({
        url: "/self/profile",
        method: "GET",
      }),
    }),
  }),
});

// Export hooks for using the API endpoints
export const { useLoginMutation, useGetUserProfileQuery } = authApi;
