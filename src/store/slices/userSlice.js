import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "userSlice",
    initialState:{
        isLoggedIn:false,
        user:null
    },
    reducers:{
        setUser:(state,action)=>{
            state.user=action.payload
            state.isLoggedIn = true
        },
        clearUser:(state)=>{
            state.isLoggedIn= false,
            state.user =null
            localStorage.removeItem("token")
        },
        updateProfile:(state,action)=>{
            const {profilePic , bio,name}=action.payload
            state.user.profilePic = profilePic
            state.user.bio = bio
            state.user.name = name
        }
    }
})

export const {setUser, clearUser,updateProfile} = userSlice.actions
export default userSlice.reducer