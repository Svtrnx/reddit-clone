import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface User {
	id: number
	email: string
	username: string
	subscribed_subreddits: number[]
	created_at: string
	updated_at: string
}

interface UserState {
  user: User | null
  loading: boolean
}

const initialState: UserState = {
  user: null,
  loading: true,
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
  },
})

export const { setUser, setLoading } = userSlice.actions
export default userSlice.reducer

