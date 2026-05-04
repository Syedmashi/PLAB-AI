import { Stethoscope, Github, Twitter, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#020617] border-t border-white/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-1.5 rounded-lg">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white">PLAB<span className="gradient-text">AI</span></span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              The premium clinical simulation platform for doctors. Master your PLAB exam with realistic AI patient interactions.
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Product</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">Features</a></li>
              <li><a href="#" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">Case Library</a></li>
              <li><a href="#" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">Pricing</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">About Us</a></li>
              <li><a href="#" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">Careers</a></li>
              <li><a href="#" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} PLAB AI. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-slate-500 hover:text-blue-400 transition-colors"><Twitter className="w-5 h-5" /></a>
            <a href="#" className="text-slate-500 hover:text-blue-400 transition-colors"><Linkedin className="w-5 h-5" /></a>
            <a href="#" className="text-slate-500 hover:text-blue-400 transition-colors"><Github className="w-5 h-5" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
