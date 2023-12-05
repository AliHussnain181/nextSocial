import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

interface adminType {
  users: any[];
  posts: string [];
  loading: boolean;
  error: string | null;
}

const initialState: adminType = {
  users: [],
  posts:[],
  loading: false,
  error: null,
};
export const usersData = createAsyncThunk("admin/usersDate", async () => {
  let res = await axios.get("api/admin/users");
  return res.data;
});

export const postsData = createAsyncThunk("admin/postsDate", async () => {
  let res = await axios.get("api/admin/posts");
  return res.data;
});

export const deleteUser = createAsyncThunk("admin/deleteUser", async (e:any) => {  
  let res = await axios.delete(`api/admin/${e}`);
  return res.data;
});

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(usersData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(usersData.fulfilled, (state, action:PayloadAction<any>) => {
        state.users = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(usersData.rejected, (state, action) => {
        state.loading = true;
        state.error = action.error.message || null;
      })
      .addCase(postsData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postsData.fulfilled, (state, action:PayloadAction<any>) => {
        state.posts = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(postsData.rejected, (state, action) => {
        state.loading = true;
        state.error = action.error.message || null;
      })
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = true;
        state.error = action.error.message || null;
      });
  },
});

export default adminSlice.reducer