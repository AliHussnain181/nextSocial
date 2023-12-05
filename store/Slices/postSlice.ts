import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Define a type for your post state
interface PostState {
  posts: any[];
  post: any;
  comment: any []
  ownPost: any [],
  profileValue: any [],
  friends: any [],
  updatePost: any ,
  loading: boolean;
  error: string | null;
}

// Define an initial state
const initialState: PostState = {
  posts: [],
  comment:[],
  ownPost:[],
  profileValue:[],
  updatePost:{},
  friends:[],
  post: null, // Changed from an array to a single post object
  loading: false,
  error: null,
};

// Create an async thunk for creating a post
export const createPost = createAsyncThunk(
  "post/createPost",
  async (e: any) => {
    const res = await axios.post("/api/post/createpost", e, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  }
);

export const createComment = createAsyncThunk(
  "post/createComment",
  async (e: any) => {
    const res = await axios.post("/api/post/comment", e);
    return res.data;
  }
);

export const fetchPosts = createAsyncThunk("post/fetchPosts", async () => {
  const res = await axios.get("/api/post/createpost"); // Corrected the URL
  return res.data;
});

export const fetchOwnPosts = createAsyncThunk("post/fetchOwnPosts", async () => {
  const res = await axios.get("/api/post/ownpost"); // Corrected the URL
  return res.data;
});

export const fetchLikes = createAsyncThunk(
  "post/fetchLikes",
  async (e: any) => {    
    const res = await axios.post("/api/post/like", e);
    return res.data;
  }
);

export const userProfileData = createAsyncThunk(
  "post/userProfileData",
  async (e: any) => {      
    const res = await axios.get(`/api/post/userprofile/${e}`);
    return res.data;
  }
);

export const fetchFriendReq = createAsyncThunk("post/fetchFriendReq", async () => {
  const res = await axios.get("/api/post/friends"); // Corrected the URL
  return res.data;
});

export const acceptFriendReq = createAsyncThunk(
  "post/acceptFriendReq",
  async (e: any) => {    
    const res = await axios.put("/api/post/acceptfriendreq", e);
    return res.data;
  }
);

export const deleteFriendReq = createAsyncThunk(
  "post/deleteFriendReq",
  async (e: any) => {    
    const res = await axios.post("/api/post/acceptfriendreq", e);
    return res.data;
  }
);
export const deletePost = createAsyncThunk("post/deletePost", async (e: any) => {  
  const res = await axios.delete(`/api/post/upde/${e}`)
  return res.data
})

export const searchPost = createAsyncThunk("post/searchPost", async (v:string) => {  
  const res = await axios.get(`/api/post/searchpost/${v}`); // Corrected the URL
  return res.data;
});

export const UpdatePost = createAsyncThunk("post/UpdatePost", async ({ formData, postId }:any) => { 
  const res = await axios.put(`/api/post/upde/${postId}`, formData); // Corrected the URL
  return res.data
});



// Create a slice
const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {}, // You can add additional reducers here if needed
  extraReducers: (builder) => {
    builder
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        state.post = action.payload; // Changed from state.post = action.payload;
        state.error = null;
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
        state.error = null;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      .addCase(fetchOwnPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOwnPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.ownPost = action.payload;
        state.error = null;
      })
      .addCase(fetchOwnPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      .addCase(createComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(createComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      .addCase(fetchLikes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLikes.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchLikes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      .addCase(userProfileData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userProfileData.fulfilled, (state, action) => {
        state.loading = false;
        state.profileValue = action.payload;
        state.error = null;
      })
      .addCase(userProfileData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      .addCase(fetchFriendReq.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFriendReq.fulfilled, (state, action) => {
        state.loading = false;
        state.friends = action.payload;
        state.error = null;
      })
      .addCase(fetchFriendReq.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      .addCase(acceptFriendReq.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(acceptFriendReq.fulfilled, (state, action) => {
        state.loading = false;
        state.friends = action.payload;
        state.error = null;
      })
      .addCase(acceptFriendReq.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      .addCase(deleteFriendReq.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFriendReq.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteFriendReq.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      .addCase(deletePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePost.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      .addCase(searchPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchPost.fulfilled, (state,action) => {
        state.loading = false;
        state.updatePost = action.payload
        state.error = null;
      })
      .addCase(searchPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      .addCase(UpdatePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(UpdatePost.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(UpdatePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      
  },
});

export default postSlice.reducer;
