import React from 'react'
import LatestJobCards from './LatestJobCards'
import { useSelector } from 'react-redux'

const LatestJobs = () => {
  const { allJobs } = useSelector(store => store.job);

  return (
    <section className="max-w-7xl mx-auto my-90 px-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
          <span className="bg-gradient-to-r from-[#6A38C2] to-[#F83002] bg-clip-text text-transparent">
            Latest & Top
          </span>{' '}
          Job Openings
        </h1>
        <p className="text-gray-500 text-base mt-3 max-w-2xl mx-auto">
          Explore trending opportunities across industries — find your next big role today.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        {allJobs.slice(0, 6).map((item, index) => (
          <LatestJobCards key={index} job={item} />
        ))}
      </div>
    </section>
  )
}

export default LatestJobs


