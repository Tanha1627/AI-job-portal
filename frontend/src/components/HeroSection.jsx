import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Search, Briefcase, Users, Building2, TrendingUp, Star, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentWord, setCurrentWord] = useState(0);
  
  const rotatingWords = ['Dream Job', 'Career', 'Future', 'Success'];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % rotatingWords.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { icon: Briefcase, value: '50K+', label: 'Active Jobs' },
    { icon: Building2, value: '12K+', label: 'Companies' },
    { icon: Users, value: '3M+', label: 'Job Seekers' },
    { icon: TrendingUp, value: '95%', label: 'Success Rate' },
  ];

  const floatingLogos = [
    { name: 'Google', color: '#4285F4', top: '15%', left: '8%', delay: 0 },
    { name: 'Meta', color: '#0668E1', top: '25%', right: '10%', delay: 0.5 },
    { name: 'Apple', color: '#555555', top: '60%', left: '5%', delay: 1 },
    { name: 'Netflix', color: '#E50914', top: '70%', right: '8%', delay: 1.5 },
    { name: 'Spotify', color: '#1DB954', top: '40%', left: '12%', delay: 2 },
    { name: 'Amazon', color: '#FF9900', top: '50%', right: '12%', delay: 2.5 },
  ];
//relative w-full min-h-screen
  return (
    <section className=" w-full min-h-screen bg-gradient-to-br from-white via-purple-50/50 to-orange-50/50  ">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large gradient orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-purple-400/30 to-purple-600/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-gradient-to-tl from-orange-400/25 to-orange-500/15 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-200/20 to-orange-200/200 rounded-full blur-3xl"
        />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(106,56,194,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(106,56,194,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400/40 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Floating company logos */}
      {floatingLogos.map((logo, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            y: [0, -15, 0],
          }}
          transition={{
            opacity: { delay: logo.delay + 0.5, duration: 0.5 },
            scale: { delay: logo.delay + 0.5, duration: 0.5 },
            y: { delay: logo.delay + 1, duration: 3, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute hidden lg:flex items-center justify-center w-14 h-14 bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100"
          style={{ top: logo.top, left: logo.left, right: logo.right }}
        >
          <span className="text-xs font-bold" style={{ color: logo.color }}>{logo.name.charAt(0)}</span>
        </motion.div>
      ))}

      {/* Main content */}
      <div className="relative z-5 flex items-center justify-center h-screen px-125">
        <div className="w-full max-w-screen  text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-10 py-2.5 rounded-full bg-gradient-to-r from-purple-100 to-orange-100 text-[#6A38C2] font-semibold text-sm tracking-wide shadow-sm border border-purple-200/50 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-orange-500" />
              No.1 Job Hunt Platform
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            </span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight"
          >
            <span className="text-gray-900">Search, Apply &</span>
            <br />
            <span className="text-gray-900">Get Your </span>
            <span className="relative inline-block">
              <motion.span
                key={currentWord}
                initial={{ opacity: 0, y: 20, rotateX: -90 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                exit={{ opacity: 0, y: -20, rotateX: 90 }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-r from-[#6A38C2] via-[#8B5CF6] to-[#F83002] bg-clip-text text-transparent"
              >
                {rotatingWords[currentWord]}
              </motion.span>
              <motion.span
                className="absolute -bottom-2 left-0 right-0 h-1.5 bg-gradient-to-r from-[#6A38C2] to-[#F83002] rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              />
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-4 text-gray-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed"
          >
            Discover thousands of opportunities tailored just for you. 
            <span className="text-[#6A38C2] font-medium"> Find your passion</span>, and land your dream job today.
          </motion.p>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="mt-6 w-full max-w-2xl "
          >
            <div className="relative group">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#6A38C2] to-[#F83002] rounded-full opacity-20 group-hover:opacity-40 blur-lg transition-all duration-500" />
              
              <div className="relative flex items-center bg-white rounded-full shadow-xl shadow-purple-500/10 border border-gray-200/80 overflow-hidden">
                <div className="flex items-center pl-6 pr-3 text-gray-400">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Job title, keywords, or company..."
                  className="flex-1 py-4 px-2 text-gray-700 placeholder-gray-400 outline-none bg-transparent text-base"
                />
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button className="m-1.5 px-8 py-6 rounded-full bg-gradient-to-r from-[#6A38C2] to-[#F83002] hover:from-[#5a2ea8] hover:to-[#d62a02] text-white font-semibold shadow-lg shadow-purple-500/25 transition-all duration-300">
                    <Search className="w-5 h-5 mr-2" />
                    Search
                  </Button>
                </motion.div>
              </div>
            </div>

            {/* Popular searches */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm"
            >
              <span className="text-gray-500">Popular:</span>
              {['Software Engineer', 'Product Manager', 'Designer', 'Data Scientist'].map((term, i) => (
                <motion.button
                  key={term}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-1.5 rounded-full bg-white/80 hover:bg-purple-50 text-gray-600 hover:text-[#6A38C2] border border-gray-200 hover:border-purple-300 transition-all duration-200 shadow-sm"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 + i * 0.1 }}
                >
                  {term}
                </motion.button>
              ))}
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-3xl mx-auto"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="group relative p-5 bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200/60 shadow-lg shadow-gray-100/50 hover:shadow-xl hover:shadow-purple-100/50 hover:border-purple-200 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-orange-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                  <div className="flex items-center justify-center mb-2">
                    <div className="p-2 bg-gradient-to-br from-purple-100 to-orange-100 rounded-xl group-hover:from-purple-200 group-hover:to-orange-200 transition-colors duration-300">
                      <stat.icon className="w-5 h-5 text-[#6A38C2]" />
                    </div>
                  </div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.2 + index * 0.1, type: "spring" }}
                    className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#6A38C2] to-[#F83002] bg-clip-text text-transparent"
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-xs md:text-sm text-gray-500 font-medium mt-1">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Trusted by section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="mt-12"
          >
            <p className="text-sm text-gray-400 mb-6 tracking-wide uppercase">Trusted by leading companies</p>
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-60 hover:opacity-80 transition-opacity duration-300">
              {['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Netflix'].map((company, i) => (
                <motion.div
                  key={company}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5 + i * 0.1 }}
                  className="text-gray-400 font-bold text-lg md:text-xl tracking-tight hover:text-gray-600 transition-colors cursor-pointer"
                >
                  {company}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-gray-400"
        >
          <span className="text-xs tracking-wider">Scroll to explore</span>
          <div className="w-6 h-10 rounded-full border-2 border-gray-300 flex items-start justify-center p-1">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-3 bg-gradient-to-b from-[#6A38C2] to-[#F83002] rounded-full"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;































// import React from 'react'
// import { Button } from './ui/button'
// import { Search } from 'lucide-react'

// const HeroSection = () => {
//   return (
//     <section className="w-full h-screen bg-gradient-to-b from-white to-purple-50 py-20 text-center">
//     <div className="flex flex-col items-center gap-6 px-130">
//         <span className="px-5 py-2 rounded-full bg-purple-100 text-[#6A38C2] font-medium text-sm tracking-wide shadow-sm">
//           🌟 No.1 Job Hunt Platform
//         </span>

//         <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
//           Search, Apply & <br />
//           Get Your <span className="bg-gradient-to-r from-[#6A38C2] to-[#F83002] bg-clip-text text-transparent">Dream Job</span>
//         </h1>

//          <p className="text-gray-600 text-base md:text-lg max-w-2xl">
//           Discover thousands of opportunities tailored just for you. Find your passion, and land your dream job today.
//         </p>


//          <div className="flex w-full md:w-[60%] lg:w-[45%] bg-white shadow-lg border border-gray-200 rounded-full overflow-hidden items-center mt-6 hover:shadow-xl transition-shadow duration-300">
//           <input
//             type="text"
//             placeholder="Find your dream job..."
//             className="flex-1 px-5 py-3 text-gray-700 outline-none"
//           />
//           <Button className="rounded-none rounded-r-full bg-gradient-to-r from-[#6A38C2] to-[#F83002] h-full px-6 flex items-center gap-2">
//             <Search className="h-5 w-7" />
           
//           </Button>
//         </div>
//       </div>

//            {/* Decorative background elements */}
//       <div className="absolute top-10 left-10 w-32 h-32 bg-purple-100 rounded-full blur-3xl opacity-30"></div>
//       <div className="absolute bottom-10 right-10 w-40 h-40 bg-[#F83002] rounded-full blur-3xl opacity-20"></div>

        
//     </section>
//   )
// }

// export default HeroSection
