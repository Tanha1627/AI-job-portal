
// import { createSlice } from "@reduxjs/toolkit";


// const initialState ={
//     user:null,
//     isAuthenticated:false
// }


// const  authSlice = createSlice({
//     name:"authSlice",
//     initialState,
//     reducers:{
//         userLoggedIn:(state,action)=>{
//          state.user = action.payload.user;
//          state.isAuthenticated = true;
//         },
//         userLoggedOut:(state)=>{
//             state.user= null;
//             state.isAuthenticated=false;
//         },
//     },

    
// });


// export const {userLoggedIn, userLoggedOut} = authSlice.actions;

// export default authSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name:"auth",
    initialState:{
        loading:false,
        user:null
    },
    reducers:{
        // actions
        setLoading:(state, action) => {
            state.loading = action.payload;
        },
        setUser:(state, action) => {
            state.user = action.payload;
        }
    }
});
export const {setLoading, setUser} = authSlice.actions;
export default authSlice.reducer;