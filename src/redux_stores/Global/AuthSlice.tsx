import { User } from "@/types/authApi"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { fetchPermissions } from "@/scripts/ApiFetchers"

interface AuthState {
  isAuthenticated: boolean
  authInfo: User | null
  token: string
}

const initialState: AuthState = {
  isAuthenticated: false,
  authInfo: null,
  token: "",
}

export const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<User | null>) => {
      if (action.payload) {
        state.isAuthenticated = true
        state.authInfo = action.payload
      } else {
        state.isAuthenticated = false
        state.authInfo = null
      }
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload
    },
  },
})

export const { setAuth, setToken } = AuthSlice.actions
