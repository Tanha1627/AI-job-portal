import React from 'react'
import { Badge } from './ui/badge'
import { Building2, MapPin } from 'lucide-react'

const LatestJobCards = () => {
  return (
    <div className="p-6 rounded-xl bg-white border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
     
      <div className="flex items-center justify-between mb-3">
        <div>
          <h1 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-[#6A38C2]" />
            Company Name
          </h1>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            <MapPin className="h-4 w-4 text-gray-400" /> Bangladesh
          </p>
        </div>
      </div>

     
      <div className="my-3">
        <h2 className="font-semibold text-xl text-[#6A38C2]">Frontend Developer</h2>
        <p className="text-sm text-gray-600 mt-1 leading-relaxed">
          Build modern, scalable web applications and deliver exceptional user experiences.
        </p>
      </div>

      
      <div className="flex flex-wrap gap-2 mt-4">
        <Badge className="text-blue-700 font-semibold border-blue-200 bg-blue-50 hover:bg-blue-100" variant="outline">
          12 Positions
        </Badge>
        <Badge className="text-[#F83002] font-semibold border-[#F83002]/20 bg-[#F83002]/10 hover:bg-[#F83002]/20" variant="outline">
          Part Time
        </Badge>
        <Badge className="text-[#7209B7] font-semibold border-[#7209B7]/20 bg-[#7209B7]/10 hover:bg-[#7209B7]/20" variant="outline">
          Remote
        </Badge>
      </div>
    </div>
  )
}

export default LatestJobCards
