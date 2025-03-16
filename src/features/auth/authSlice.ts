import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface User {
  id: string
  email: string
  first_name?: string
  last_name?: string
  phone_number?: string | null
  status?: string
  date_joined?: string
  password_last_changed?: string
  url?: string | null
  last_active?: string
  terms_accepted?: boolean
  otp?: string | null
  user_group?: string
  view?: {
    type: string
  }
  accesses?: {
    store_id: string | null
    user_id?: number
    role_id?: number
  }[]
  store?: {
    onboarding_procedure: {
      onboarding_status: string
    }
  }
}

export interface ViewToggles {
  id: number
  role_id: number
  view_type: string
  [key: string]: boolean | number | string | null
}

export interface View {
  type: string
  access: null
  accesses: {
    store_id: string | null
    user_id: number
    role_id: number
  }[]
  viewToggles: ViewToggles
}

export interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  user: User | null
  view: View | null
  accesses: {
    store_id: string | null
    user_id: number
    role_id: number
  }[] | null
  isAuthenticated: boolean
}

interface LoginResponse {
  message: string
  user: User
  view: View
  accesses: {
    store_id: string | null
    user_id: number
    role_id: number
  }[]
  tokens: {
    accessToken: string
    refreshToken: string
  }
}

const initialState: AuthState = {
  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : null,
  view: localStorage.getItem('view') ? JSON.parse(localStorage.getItem('view') || '{}') : null,
  accesses: localStorage.getItem('accesses') ? JSON.parse(localStorage.getItem('accesses') || '[]') : null,
  isAuthenticated: Boolean(localStorage.getItem('accessToken') && localStorage.getItem('refreshToken'))
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<LoginResponse>) => {
      const { user, view, accesses, tokens } = action.payload
      
      // Save tokens and user data to state
      state.accessToken = tokens.accessToken
      state.refreshToken = tokens.refreshToken
      state.user = user
      state.view = view
      state.accesses = accesses
      state.isAuthenticated = true
      
      // Save data to localStorage for persistence
      localStorage.setItem('accessToken', tokens.accessToken)
      localStorage.setItem('refreshToken', tokens.refreshToken)
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('view', JSON.stringify(view))
      localStorage.setItem('accesses', JSON.stringify(accesses))
    },
    updateUserStore: (state, action: PayloadAction<User['store']>) => {
      if (state.user) {
        state.user.store = action.payload
        localStorage.setItem('user', JSON.stringify(state.user))
      }
    },
    logout: (state) => {
      // Clear state
      state.accessToken = null
      state.refreshToken = null
      state.user = null
      state.view = null
      state.accesses = null
      state.isAuthenticated = false
      
      // Clear localStorage
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
      localStorage.removeItem('view')
      localStorage.removeItem('accesses')
    }
  }
})

export const { login, logout, updateUserStore } = authSlice.actions
export default authSlice.reducer 