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
            console.log(action.payload)
        },
        clearUser:(state)=>{
            state.isLoggedIn= false,
            state.user =null
            localStorage.removeItem("token")
        }
    }
})

export const {setUser, clearUser} = userSlice.actions
export default userSlice.reducer