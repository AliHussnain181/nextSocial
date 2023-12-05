import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface User {
    user: any[] | string;
    userp: any[]
    isAuthenticated: boolean;
    loading: boolean;
    error: string | any;
    userValue: string[]
}

const initialState: User = {
    user: [],
    userp:[],
    isAuthenticated: false,
    loading: false,
    error: null,
    userValue: []
};

export const registerAsync = createAsyncThunk("user/registerAsync", async (userData: FormData) => {
    let res = await axios.post('/api/auth/register', userData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    })
    return res.data
});

export const loginAsync = createAsyncThunk("user/loginAsync", async (userData:string | any) => {
    let res = await axios.post('/api/auth/login', userData)
    return res.data
});
export const Logout = createAsyncThunk("user/Logout", async () => {
    const res = await axios.get("/api/auth/logout"); // Corrected the URL
    return res.data;
  });

  export const getMe = createAsyncThunk("user/getMe", async () => {
    const res = await axios.get("/api/auth/me"); // Corrected the URL
    return res.data;
  });
  
  export const userSearch = createAsyncThunk("user/userSearch", async (keyword:string) => {
    const res = await axios.get(`/api/post/usersearch?keyword=${keyword}`); // Corrected the URL
    return res.data;
  });

  export const fetchAddFriend = createAsyncThunk(
    "user/fetchAddFriend",
    async (e: any) => {            
      const res = await axios.post("/api/post/addfriendreq", e);
      return res.data;
    }
  );

  export const removeFriendReq = createAsyncThunk(
    "user/removeFriendReq",
    async (e: any) => {            
      const res = await axios.post("/api/post/friendreqrem", e);
      return res.data;
    }
  );
  

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearLoading: (state) => {
            state.loading = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerAsync.pending, (state) => {
                state.loading = true;
                state.isAuthenticated = false;
                state.error = null;
            })
            .addCase(registerAsync.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(registerAsync.rejected, (state, action) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.error = action.error.message || null;
            })
            .addCase(loginAsync.pending, (state) => {
                state.loading = true;
                state.isAuthenticated = false;
                state.error = null;
            })
            .addCase(loginAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(loginAsync.rejected, (state, action) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.error = action.error.message ;                
            })
            .addCase(Logout.pending, (state) => {
                state.loading = true;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(Logout.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = false;
                state.error = null;
            })
            .addCase(Logout.rejected, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.error = action.error.message || null;
            })
            .addCase(getMe.pending, (state) => {
                state.loading = true;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(getMe.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.userp = action.payload
                state.error = null;
            })
            .addCase(getMe.rejected, (state, action) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.error = action.error.message || null;
            })
            .addCase(userSearch.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(userSearch.fulfilled, (state, action) => {
                state.loading = false;
                state.userValue = action.payload
                state.error = null;
            })
            .addCase(userSearch.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || null;
            })
            .addCase(fetchAddFriend.pending, (state) => {
                state.loading = true;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(fetchAddFriend.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(fetchAddFriend.rejected, (state, action) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.error = action.error.message || null;
            })
            .addCase(removeFriendReq.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeFriendReq.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(removeFriendReq.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || null;
            })
            
    },
});

export default userSlice.reducer;
export const { clearError, clearLoading } = userSlice.actions;
