import { Stethoscope } from 'lucide-react';

const footerSections = [
  { title: 'Product', items: ['Features', 'Case Library', 'Pricing'] },
  { title: 'Company', items: ['About Us', 'Careers', 'Contact'] },
  { title: 'Legal', items: ['Privacy Policy', 'Terms of Service'] },
];

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
              Clinical simulation practice for PLAB 2-style consultations, with realistic AI patient interactions and feedback.
            </p>
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">{section.title}</h4>
              <ul className="space-y-2">
                {section.items.map((item) => (
                  <li key={item}>
                    <span className="text-sm text-slate-500 cursor-not-allowed" title="Coming soon">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} PLAB AI. Prototype build.
          </p>
          <p className="text-xs text-slate-600">
            Public links and legal pages are not connected yet.
          </p>
        </div>
      </div>
    </footer>
  );
}
