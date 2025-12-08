import React, { useEffect } from 'react'
// import Navbar from './shared/Navbar'
import HeroSection from './HeroSection'
import LatestJobs from './LatestJobs'
import useGetAllJobs from '@/hooks/useGetAllJobs'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'


const Home = () => {
  useGetAllJobs();

   const { user } = useSelector(store => store.auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (user?.role === 'recruiter') {
      navigate("/admin/companies");
    }
  }, []);
  return (
    <div>
      <HeroSection/>
      <LatestJobs/>
    </div>
  )
}

export default Home
