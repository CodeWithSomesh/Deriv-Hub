import { MenuIcon } from './Icons';

const Navbar = () => {
  return (
    <div className="bg-black border-b border-white/10">
      <div className="px-6 max-w-6xl mx-auto">
        <div className="py-4 flex items-center justify-between">
          <div className="relative">
            <div className="absolute w-full top-2 bottom-0 bg-[#FF444F] opacity-20 blur-md rounded-full" />
            <span className="relative text-xl font-bold text-white">Deriv<span className="text-[#FF444F]">Hub</span></span>
          </div>

          <div className="border border-white/30 h-10 w-10 inline-flex items-center justify-center rounded-lg sm:hidden">
            <MenuIcon className="text-white" />
          </div>

          <nav className="hidden sm:flex gap-6 items-center">
            <a href="#features" className="text-white/60 hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="text-white/60 hover:text-white transition-colors">How It Works</a>
            <a href="#faq" className="text-white/60 hover:text-white transition-colors">FAQ</a>
            <a href="#" className="text-white/60 hover:text-white transition-colors">Help</a>
            <a href='/dashboard' className="bg-[#FF444F] hover:bg-[#E63946] text-white py-2 px-4 rounded-lg font-semibold transition-colors">
              Go To Dashboard
            </a>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
