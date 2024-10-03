import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"
import { jwtDecode } from "jwt-decode"

const BASE_URL = 'https://4c79e452-10fb-4c28-ab13-5b262cc34213-00-1m5x7gy5ljilt.pike.replit.dev'

// action/message fetchPostsByUser
export const fetchPostsByUser = createAsyncThunk(
    "posts/fetchByUser",
    async (userId) => {
        const response = await fetch(`${BASE_URL}/posts/user/${userId}`)
        return response.json() // this is the action in the addCase
        // return [{id: 1, content: "when is lunch"}]
    }
)

// action/message savePost
export const savePost = createAsyncThunk(
    "posts/savePost",
    async (postContent) => {
        //Get stored JWT Token
        const token = localStorage.getItem("authToken");
        // const token = '3lk21jj213lkj123lkjlkj21.2l1k3jl1k2j3kl12j3.1k2l3j1l2k3

        //Decode the token to fetch user id
        const decode = jwtDecode(token);
        // const decodedToken = {id: 6, username: 'haris@haris.com'}
        const userId = decode.id // May change depending on how the server encode the token
        // const userId = 6

        //Prepare data to be sent
        const data = {
            title: "Post Title",  //Add functionality to set this properly
            // content: 'backend and front end is amazing', 
            // user_id: 6,
            content: postContent,
            user_id: userId,
        };

        const response = await axios.post(`${BASE_URL}/posts`, data)
        return response.data
    }
)


const postsSlice = createSlice({
    name: "posts",
    initialState: { posts: [], loading: true },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchPostsByUser.fulfilled, (state, action) => {
            state.posts = action.payload
            state.loading = false
        }),
            builder.addCase(savePost.fulfilled, (state, action) => {
                state.posts = [action.payload, ...state.posts];
            });
    },
});


export default postsSlice.reducer