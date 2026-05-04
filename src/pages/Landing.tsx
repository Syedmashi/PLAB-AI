import { motion } from 'motion/react';
import { Button } from '../components/ui/button';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { CheckCircle2, MessageSquare, Zap, ShieldCheck, ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#020617] selection:bg-blue-500/30 selection:text-white overflow-x-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32">
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-blue-400 text-xs font-semibold uppercase tracking-widest mb-8 backdrop-blur-md">
              <Zap className="w-3 h-3 animate-pulse" /> Next-Gen Medical AI
            </span>
            <h1 className="text-5xl md:text-8xl font-bold tracking-tight text-white mb-8 leading-[1.05]">
              The Future of <br />
              <span className="gradient-text">Clinical Mastery</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 mb-12 leading-relaxed">
              Experience hyper-realistic AI patient simulations designed for the modern doctor. Master your clinical reasoning with precision and confidence.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to="/auth">
                <Button size="lg" className="h-16 px-10 text-lg gradient-bg text-white shadow-2xl shadow-blue-500/20 transition-all hover:scale-105 active:scale-95 border-none font-bold">
                  Start Practicing Now <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="h-16 px-10 text-lg border-white/10 text-white hover:bg-white/5 backdrop-blur-md transition-all">
                View Demo Case
              </Button>
            </div>
            
            <div className="mt-24 flex flex-wrap items-center justify-center gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
              <div className="flex items-center gap-2 font-semibold text-white"><ShieldCheck className="w-5 h-5" /> GMC Standards</div>
              <div className="flex items-center gap-2 font-semibold text-white"><Star className="w-5 h-5" /> 4.9/5 Rating</div>
              <div className="flex items-center gap-2 font-semibold text-white"><CheckCircle2 className="w-5 h-5" /> PLAB 2 Focused</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Engineered for Excellence</h2>
            <p className="text-slate-400 max-w-xl mx-auto text-lg">A seamless workflow designed to accelerate your clinical growth.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Select Scenario",
                desc: "Choose from a curated library of complex clinical cases across all specialties.",
                icon: <Zap className="w-6 h-6 text-blue-400" />
              },
              {
                step: "02",
                title: "AI Interaction",
                desc: "Engage with our advanced LLM-powered patients that respond with clinical nuance.",
                icon: <MessageSquare className="w-6 h-6 text-purple-400" />
              },
              {
                step: "03",
                title: "Deep Analytics",
                desc: "Receive comprehensive feedback on your diagnostic path and communication style.",
                icon: <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -10 }}
                className="glass p-10 rounded-[2rem] transition-all group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-x-16 -translate-y-16 blur-2xl group-hover:bg-blue-500/10 transition-colors" />
                <div className="text-5xl font-black text-white/5 mb-6 group-hover:text-white/10 transition-colors">{item.step}</div>
                <div className="bg-white/5 w-14 h-14 rounded-2xl flex items-center justify-center mb-8 border border-white/10">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                <p className="text-slate-400 leading-relaxed text-lg">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="py-32 bg-white/[0.02] relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] -translate-x-1/2" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div>
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-10 leading-tight">Built for the <br /><span className="gradient-text">Modern Clinician</span></h2>
              <div className="space-y-10">
                {[
                  { title: "Hyper-Realistic AI", desc: "Our patients simulate real-world complexity, including emotional distress and subtle symptoms." },
                  { title: "Precision Feedback", desc: "AI-driven analysis of your history-taking, rapport building, and clinical reasoning." },
                  { title: "Adaptive Learning", desc: "The platform evolves with your performance, suggesting cases that target your weaknesses." }
                ].map((benefit, idx) => (
                  <div key={idx} className="flex gap-6 group">
                    <div className="mt-1 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-2 h-fit shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white mb-2">{benefit.title}</h4>
                      <p className="text-slate-400 text-lg leading-relaxed">{benefit.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-[2.5rem] opacity-20 blur-2xl group-hover:opacity-30 transition-opacity" />
              <div className="relative glass rounded-[2.5rem] overflow-hidden border-white/10">
                <img 
                  src="https://picsum.photos/seed/futuristic-med/1000/1000" 
                  alt="Medical Practice" 
                  className="w-full object-cover aspect-square opacity-80 group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Trusted by Innovators</h2>
            <p className="text-slate-400 text-lg">Join the elite circle of doctors mastering their craft.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Dr. Amara Chen", role: "PLAB 2 Candidate", text: "The AI patients are incredibly realistic. It's the closest thing to the real exam I've found." },
              { name: "Dr. James Wilson", role: "Foundation Year 1", text: "I passed my PLAB 2 on the first try thanks to the consistent practice I got here." },
              { name: "Dr. Priya Sharma", role: "PLAB 2 Candidate", text: "The feedback section is a game changer. It pointed out exactly where my history taking was weak." }
            ].map((t, idx) => (
              <div key={idx} className="glass p-10 rounded-[2rem] hover:bg-white/[0.05] transition-all">
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-blue-400 text-blue-400" />)}
                </div>
                <p className="text-slate-300 italic mb-8 text-lg leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white">
                    {t.name[4]}
                  </div>
                  <div>
                    <div className="font-bold text-white">{t.name}</div>
                    <div className="text-sm text-slate-500">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass rounded-[3rem] p-16 md:p-24 text-center relative overflow-hidden shadow-2xl border-white/10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-[120px]" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-[120px]" />
            
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 relative z-10 leading-tight">Elevate Your <br /><span className="gradient-text">Clinical Career</span></h2>
            <p className="text-slate-400 text-xl mb-12 max-w-xl mx-auto relative z-10 leading-relaxed">
              Join the next generation of doctors using AI to redefine medical excellence.
            </p>
            <Link to="/auth" className="relative z-10">
              <Button size="lg" className="h-16 px-12 text-xl gradient-bg text-white shadow-2xl shadow-blue-500/20 transition-all hover:scale-105 active:scale-95 border-none font-bold">
                Get Started for Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
