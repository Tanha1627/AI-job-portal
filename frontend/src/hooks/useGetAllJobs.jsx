import { setAllJobs } from '@/redux/jobSlice'
import { JOB_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const useGetAllJobs = () => {
    const dispatch = useDispatch();
     const { allJobs } = useSelector(store => store.job)
    const {searchedQuery} = useSelector(store=>store.job);
//     const jobState = useSelector(store => store.job);
// console.log("JOB STATE IN HOOK:", jobState);

    useEffect(()=>{
            if (allJobs.length > 0) return;
        const fetchAllJobs = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get`,
                    {withCredentials:true});
                 console.log('Jobs API Response:', res.data); // Debug log
                
                
                if(res.data.success){
                    dispatch(setAllJobs(res.data.jobs));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllJobs();
    },[dispatch, allJobs.length])
}

export default useGetAllJobs