import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { Stethoscope } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-1.5 rounded-lg shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">PLAB<span className="gradient-text">AI</span></span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link to="/#how-it-works" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">How it works</Link>
            <Link to="/#benefits" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Benefits</Link>
            <Link to="/#testimonials" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Testimonials</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/auth">
              <Button variant="ghost" className="text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5">Log in</Button>
            </Link>
            <Link to="/auth">
              <Button className="gradient-bg hover:opacity-90 text-white shadow-lg shadow-blue-500/20 transition-all hover:scale-105 active:scale-95 border-none">
                Start Practicing
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
