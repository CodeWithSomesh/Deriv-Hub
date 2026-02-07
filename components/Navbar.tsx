import Image from 'next/image';
import logoImage from '@/assets/images/logosaas.png';
import { MenuIcon } from './Icons';


const Navbar = () => {
  return (
    <div className='bg-black'>
      <div className="px-6">
        <div className="py-4 flex items-center justify-between">
          <div className='relative'>
            <div className='absolute w-full top-2 bottom-0 bg-[linear-gradient(to_right,#f87bff,#fb92cf,#ffdd9b,#c2f0b1,#2fd8fe)] blur-md'></div>
            <Image src={logoImage} alt="Saas logo" className="h-12 w-12 relative" />
          </div>

          <div className="border border-white border-opacity-30 h-10 w-10 inline-flex items-center justify-center rounded-lg sm:hidden">
            <MenuIcon className="text-white" />
          </div>

          <nav className="hidden sm:flex gap-6 items-center">
            <a href="#" className='text-opacity-60 hover:text-opacity-100 text-white'>About</a>
            <a href="#" className='text-opacity-60 hover:text-opacity-100 text-white'>Features</a>
            <a href="#" className='text-opacity-60 hover:text-opacity-100 text-white'>Updates</a>
            <a href="#" className='text-opacity-60 hover:text-opacity-100 text-white'>Help</a>
            <a href="#" className='text-opacity-60 hover:text-opacity-100 text-white'>Customers</a>
            <button className='bg-white py-2 px-4 rounded-lg font-semibold'>Get for free</button>
          </nav>
        </div>
      </div>
    </div>
  )
}

export default Navbar