import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { AuthState } from '../auth/authSlice'

export interface StoreInfo {
  id: string
  name: string
  onboarding_procedure: {
    onboarding_status: string
  }
}

const BASE_URL = 'https://stgapp-bwgkn3md.opensend.com'

export const storeApi = createApi({
  reducerPath: 'storeApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      // Get tokens from auth state
      const state = getState() as { auth: AuthState }
      const { accessToken, refreshToken } = state.auth
      
      // If we have tokens, add them to the headers
      if (accessToken) {
        headers.set('Access-Token', `Bearer ${accessToken}`)
      }
      if (refreshToken) {
        headers.set('Client-Token', refreshToken)
      }
      
      return headers
    },
  }),
  endpoints: (builder) => ({
    getStoreInfo: builder.query<StoreInfo, string>({
      query: (storeId) => ({
        url: `/store/${storeId}`,
        method: 'GET',
      }),
    }),
  }),
})

export const { useGetStoreInfoQuery } = storeApi 