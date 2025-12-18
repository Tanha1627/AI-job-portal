// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// const JOB_API = "http://localhost:8087/api/v1/job";

// export const jobApi = createApi({
//      reducerPath: "jobApi",
//   tagTypes: ["Jobs", "SingleJob"],
//   baseQuery: fetchBaseQuery({
//     baseUrl: JOB_API,
//     credentials: "include",
//   }),
//   endpoints: (builder) => ({
//     // 🔹 Get all jobs
//     getAllJobs: builder.query({
//       query: () => ({
//         url: "/get",
//         method: "GET",
//       }),
//       providesTags: ["Jobs"],
//     }),

//      getJobById: builder.query({
//       query: (jobId) => ({
//         url: `/get/${jobId}`,
//         method: "GET",
//       }),
//       providesTags: ["SingleJob"],
//     }),

// })
// });
// export const {
//     useGetAllJobsQuery,
//     useGetJobByIdQuery,
// } = jobApi;