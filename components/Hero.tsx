"use client"

import Image from 'next/image'
import { ArrowWIcon } from './Icons'
import cursorImage from '@/assets/images/cursor.png'
import messageImage from '@/assets/images/message.png'
import { motion } from 'framer-motion'

const Hero = () => {
  return (
    <div className='bg-black mx-auto text-white bg-[linear-gradient(to_bottom,#000,#200D42_34%,#4F21A1_65%,#A46EDB_82%)] py-[72px] sm:py-24 relative overflow-clip'>
      <div className="absolute h-[375px] w-[750px] sm:w-[1536px] sm:h-[768px] lg:w-[2400px] lg:h-[1200px] rounded-[100%] bg-black left-1/2 -translate-x-1/2 border border-[#B48CDE] bg-[radial-gradient(closest-side,#000_82%,#9560EB)] top-[calc(100%-96px)] sm:top-[calc(100%-120px)]"></div>

      <div className='container relative'>
        <div className='flex items-center justify-center'>
          <a href="#" className='inline-flex gap-3 border py-1 px-2 rounded-lg border-white/30'>
            <span className='bg-[linear-gradient(to_right,#F87AFF,#FB93D0,#FFDD99,#C3F0B2,#2FD8FE)] text-transparent bg-clip-text [-webkit-background-clip:text]'>Version 2.0 is here</span>
            <span className='inline-flex items-center gap-1'>
              <span>Read More</span>
              <ArrowWIcon />
            </span>
          </a>
        </div>
        
        <div className="flex justify-center mt-8">
          <div className='inline-flex relative'>
            <h1 className='text-7xl sm:text-9xl font-bold tracking-tighter text-center inline-flex'>
              One Task 
              <br /> At A Time
            </h1>

            <motion.div drag //dragSnapToOrigin 
            className='absolute right-[530px] top-[108px] hidden sm:inline'>
              <Image src={cursorImage} alt="" height="200" width="200" 
              className='max-w-none' draggable="false"  />
            </motion.div>

            <motion.div drag //dragSnapToOrigin
            className='absolute left-[550px] top-[56px] hidden sm:inline' >
              <Image src={messageImage} alt="" height="200" width="200" 
              className='max-w-none' draggable="false" />
            </motion.div>
          </div>
        </div>

        <p className='text-center text-xl mt-8 max-w-md mx-auto'>
          Celebrate the joy of accomplishment with an
          app designed to track your progress, motivate
          your efforts, and celebrate your successes.
        </p>

        <div className='flex justify-center mt-8'>
          <button className='bg-white font-semibold text-black py-3 px-5 rounded-lg'>
            Get For Free
          </button>
        </div>
      </div>
    </div>
  )
}

export default Hero