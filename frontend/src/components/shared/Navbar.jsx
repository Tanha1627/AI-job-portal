import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Avatar, AvatarImage } from '../ui/avatar'
import { useDispatch, useSelector } from 'react-redux'
import { USER_API_END_POINT } from '@/utils/constant'
import Defi from './judyhopps.jpg';
import { toast } from 'sonner'

import axios from 'axios'
import { setUser } from '@/redux/authSlice'



const Navbar = () => {
  const {user} = useSelector(store=>store.auth)
   const dispatch = useDispatch();
    const navigate = useNavigate();
  const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
            if (res.data.success) {
                dispatch(setUser(null));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            
        }
    }
  return (
     <nav className="fixed top-0 left-0 w-full z-50 bg-transparent backdrop-blur-md">
                <div className="w-full flex items-center justify-between px-6 lg:px-12 py-4">
        
            <h1 className='text-xl font-bold'>
          Job<span className='text-[#F83002]'>Portal</span>
        </h1>
         
         
       <div className='flex items-center gap-10'>
        
            <ul className="flex items-center  space-x-9 text-gray-800 font-medium list-none m-0 p-0">
          <li></li>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/jobs">Jobs</Link></li>
          <li>Browse</li>
        </ul>

        {
          !user ? (
            <div>
            <Link to="/login"> <Button variant="outline" className='text-white hover:text-white'>Login</Button></Link>
             <Link to="/signup"><Button className='hover:tex-white'>Signup</Button>
                </Link>
            </div>
          ):(
             <Popover>
          <PopoverTrigger asChild>
         <Avatar className='cursor-pointer'>
        <AvatarImage src={user?.profile?.profilePhoto || Defi} alt="@shadcn" />
        {/* <AvatarFallback>CN</AvatarFallback> */}
      </Avatar>
      </PopoverTrigger>
      <PopoverContent className="w-88">
       <div className=''>
        <Avatar className='cursor-pointer'>
        <AvatarImage src={user?.profile?.profilePhoto || Defi}  alt="@shadcn" />
      </Avatar>
      <div>
      <h4 className='font-medium'>{user?.fullname}</h4>
      <p className='text-sm text-muted-foreground'>{user?.profile?.bio}</p>
       </div>
       </div>
       <div className='flex flex-col  text-white'>
        <div className='flex w-fit items-center gap-2 cursor-pointer'>
        <Button className='text-white' variant="link"><Link to="/Profile">view profile</Link></Button>
        </div>
         <div className='flex w-fit items-center gap-2 cursor-pointer'>
                  <Button onClick={logoutHandler} className='text-white' variant="link">Logout</Button>
         </div>

       </div>
      </PopoverContent>
        </Popover>
          )
        }
        
       </div>
         
         </div>
     
    </nav>
  )
}

export default Navbar

//<Link>Browse</Link>
