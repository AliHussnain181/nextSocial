import { configureStore } from "@reduxjs/toolkit"
import userReducer from "./Slices/userSlice"
import postReducer from "./Slices/postSlice"
import adminReducer from "./Slices/adminSlice";


export const store = configureStore({
  reducer: {
    user: userReducer,
    post: postReducer,
    admin: adminReducer,
  },
});

export type AppDispatch = typeof store.dispatch;