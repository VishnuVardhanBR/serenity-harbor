import React from 'react'
import { MdFeaturedPlayList } from "react-icons/md";
import DetailsCard from './DetailsCard';

const Features = () => {
    const featureheading = ["Feature 1", "Feature 2", "Feature 3", "Feature 4", "Feature 5"]
    const features=["A fast and lightweight chat application to help mental health patients", "A fast and lightweight chat application to help mental health patients", "A fast and lightweight chat application to help mental health patients", "A fast and lightweight chat application to help mental health patients", "A fast and lightweight chat application to help mental health patients"]
    const logos = [MdFeaturedPlayList, MdFeaturedPlayList, MdFeaturedPlayList, MdFeaturedPlayList, MdFeaturedPlayList]
  return (
      <div className='bg-gray-200 w-full flex flex-col gap-10 pt-10 pb-10 justify-center items-center '>
          <p className="text-3xl font-bold ">
              Features
            </p>
          <div className='w-[70%] grid grid-cols-3 gap-10'>
          {featureheading.map((item, index) => { 
              return (
                  <DetailsCard key={index} title={item} description={features[index]} logo={logos[index]} />
              )
          })}
              </div>
    </div>
  )
}

export default Features
