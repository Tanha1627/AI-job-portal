// store/slices/companyJobSlice.js
import { createSlice } from "@reduxjs/toolkit";

const companyJobSlice = createSlice({
  name: "companyJob",
  initialState: {
    jobs: [],       // all jobs for a specific company
    loading: false,
    error: null,
    singleJob1:null,
  },
  reducers: {
    setCompanyJobs: (state, action) => {
      state.jobs = action.payload;
    },
    // clearCompanyJobs: (state) => {
    //   state.jobs = [];
    // },
    setSingleJob:(state,action)=>{
            state.singleJob1 = action.payload;
        },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});
export const {
  setCompanyJobs,
  clearCompanyJobs,
  setSingleJob,
  clearSingleJob,
  setLoading,
  setError,
} = companyJobSlice.actions;

// ✅ Export reducer
export default companyJobSlice.reducer;
