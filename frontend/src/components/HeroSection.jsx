import React from 'react'
import { Button } from './ui/button'
import { Search } from 'lucide-react'

const HeroSection = () => {
  return (
    <section className="w-full h-screen bg-gradient-to-b from-white to-purple-50 py-20 text-center">
    <div className="flex flex-col items-center gap-6 px-130">
        <span className="px-5 py-2 rounded-full bg-purple-100 text-[#6A38C2] font-medium text-sm tracking-wide shadow-sm">
          🌟 No.1 Job Hunt Platform
        </span>

        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
          Search, Apply & <br />
          Get Your <span className="bg-gradient-to-r from-[#6A38C2] to-[#F83002] bg-clip-text text-transparent">Dream Job</span>
        </h1>

         <p className="text-gray-600 text-base md:text-lg max-w-2xl">
          Discover thousands of opportunities tailored just for you. Find your passion, and land your dream job today.
        </p>


         <div className="flex w-full md:w-[60%] lg:w-[45%] bg-white shadow-lg border border-gray-200 rounded-full overflow-hidden items-center mt-6 hover:shadow-xl transition-shadow duration-300">
          <input
            type="text"
            placeholder="Find your dream job..."
            className="flex-1 px-5 py-3 text-gray-700 outline-none"
          />
          <Button className="rounded-none rounded-r-full bg-gradient-to-r from-[#6A38C2] to-[#F83002] h-full px-6 flex items-center gap-2">
            <Search className="h-5 w-7" />
           
          </Button>
        </div>
      </div>

           {/* Decorative background elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-purple-100 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-[#F83002] rounded-full blur-3xl opacity-20"></div>

        
    </section>
  )
}

export default HeroSection
