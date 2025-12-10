// store/slices/companyJobSlice.js
import { createSlice } from "@reduxjs/toolkit";

const companyJobSlice = createSlice({
  name: "companyJob",
  initialState: {
    jobs: [],       // all jobs for a specific company
    loading: false,
    error: null,
  },
  reducers: {
    setCompanyJobs: (state, action) => {
      state.jobs = action.payload;
    },
    // clearCompanyJobs: (state) => {
    //   state.jobs = [];
    // },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setCompanyJobs, setLoading, setError } = companyJobSlice.actions;
export default companyJobSlice.reducer;

// clearCompanyJobs, 