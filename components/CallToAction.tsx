'use client'

import helixImage from '@/assets/images/helix2.png'
import emojiStarImage from '@/assets/images/emojistar.png'
import Image from 'next/image';
import {motion} from 'framer-motion'


export const CallToAction = () => {


  return (
    <div className="bg-black text-white py-[72px] sm:py-32 text-center overflow-hidden ">
      <div className="container max-w-xl relative">

        <motion.div  initial={{translateY: 0}}
          animate={{translateY: [0, -60, 0]}}
          transition={{
            duration: 5,
            ease: "linear",
            repeat: Infinity,
          }} >
          <Image src={helixImage} alt='' 
          className="absolute top-6 left-[calc(100%+36px)] " />
        </motion.div>

        <motion.div drag initial={{translateY: 0}}
          animate={{translateY: [0, 60, 0]}}
          transition={{
            duration: 5,
            ease: "linear",
            repeat: Infinity,
          }} >
          <Image src={emojiStarImage} alt='' 
          className="absolute -top-[120px] right-[calc(100%+24px)]" />
        </motion.div>
        
        <h2 className="font-bold text-5xl sm:text-6xl tracking-tighter">Get Instant Access</h2>

        <p className="text-xl text-white/70 mt-5">
          Celebrate the joy of accomplishment with an app designed 
          to track your progress and motivate your efforts.
        </p>

        <form action="" className="mt-10 flex flex-col gap-2.5 max-w-sm mx-auto sm:flex-row">
          <input type="email" placeholder="your@email.com" 
          className="h-12 bg-white/20 rounded-lg px-5 font-medium placeholder:text-[#9ca3af] sm:flex-1" />
          
          <button className="bg-white text-black h-12 rounded-lg font-semibold px-5">Get Access</button>
        </form>
      </div>
    </div>
  );
};
