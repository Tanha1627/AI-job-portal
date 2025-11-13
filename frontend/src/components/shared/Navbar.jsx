import React from 'react'
import { Link } from 'react-router-dom'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Avatar, AvatarImage } from '../ui/avatar'
import { useSelector } from 'react-redux'

const Navbar = () => {
  const {user} = useSelector(store=>store.auth)
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
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        {/* <AvatarFallback>CN</AvatarFallback> */}
      </Avatar>
      </PopoverTrigger>
      <PopoverContent className="w-88">
       <div className=''>
        <Avatar className='cursor-pointer'>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      </Avatar>
      <div>
      <h4 className='font-medium'>merstack</h4>
      <p className='text-sm text-muted-foreground'>lorem ipsum all I get is to do anything</p>
       </div>
       </div>
       <div className='flex flex-col  text-white'>
        <div className='flex w-fit items-center gap-2 cursor-pointer'>
        <Button className='text-white' variant="link"><Link to="/Profile">view profile</Link></Button>
        </div>
         <div className='flex w-fit items-center gap-2 cursor-pointer'>
                  <Button className='text-white' variant="link">Logout</Button>
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
