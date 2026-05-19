import { motion } from 'motion/react';
import { Button } from '../components/ui/button';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { CheckCircle2, MessageSquare, Zap, ShieldCheck, ArrowRight, Star, Stethoscope } from 'lucide-react';
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
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.18),transparent_55%)] opacity-20 mix-blend-overlay" />
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
              Practise PLAB 2-style consultations with AI patient scenarios, structured history-taking, and feedback focused on clinical reasoning, communication, and safety.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to="/auth">
                <Button size="lg" className="h-16 px-10 text-lg gradient-bg text-white shadow-2xl shadow-blue-500/20 transition-all hover:scale-105 active:scale-95 border-none font-bold">
                  Start Practicing Now <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/simulation?caseId=acs-telephone">
                <Button size="lg" variant="outline" className="h-16 px-10 text-lg border-white/10 text-white hover:bg-white/5 backdrop-blur-md transition-all">
                  View Demo Case
                </Button>
              </Link>
            </div>
            
            <div className="mt-24 flex flex-wrap items-center justify-center gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
              <div className="flex items-center gap-2 font-semibold text-white"><ShieldCheck className="w-5 h-5" /> Patient Safety Focus</div>
              <div className="flex items-center gap-2 font-semibold text-white"><Star className="w-5 h-5" /> Prototype Build</div>
              <div className="flex items-center gap-2 font-semibold text-white"><CheckCircle2 className="w-5 h-5" /> PLAB 2-Style Practice</div>
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
                desc: "Choose from the initial case library, including chest pain, headache, and counselling scenarios extracted from the provided PLAB material.",
                icon: <Zap className="w-6 h-6 text-blue-400" />
              },
              {
                step: "02",
                title: "AI Interaction",
                desc: "Engage with LLM-powered patients that stay in role and reveal details as you ask relevant questions.",
                icon: <MessageSquare className="w-6 h-6 text-purple-400" />
              },
              {
                step: "03",
                title: "Deep Analytics",
                desc: "Receive structured feedback on diagnosis, communication, patient safety, missed questions, and missed safety points.",
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
                  { title: "Role-Based AI Patients", desc: "Patients answer in simple language and avoid revealing the diagnosis unless the doctor earns it through the consultation." },
                  { title: "Structured Feedback", desc: "AI-driven review of your history-taking, rapport building, clinical reasoning, and patient safety." },
                  { title: "Domain-Grounded Cases", desc: "Initial cases are aligned with the provided PLAB notes, including ACS, pericarditis, carbon monoxide headache, migraine, and obesity counselling." }
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
              <div className="relative glass rounded-[2.5rem] overflow-hidden border-white/10 aspect-square flex items-center justify-center bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.35),transparent_35%),radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.32),transparent_35%)]">
                <div className="absolute inset-8 rounded-[2rem] border border-white/10 bg-white/[0.03] backdrop-blur-sm" />
                <div className="relative z-10 text-center p-10">
                  <Stethoscope className="w-20 h-20 mx-auto mb-6 text-blue-300" />
                  <p className="text-2xl font-bold text-white mb-3">AI Patient Practice</p>
                  <p className="text-slate-300">Structured PLAB 2-style consultations with safety-focused feedback.</p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Case Focus */}
      <section id="testimonials" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">What the prototype covers now</h2>
            <p className="text-slate-400 text-lg">No fake testimonials — just the current clinical focus areas available in this build.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Emergency chest pain", text: "Telephone ACS safety, immediate escalation, aspirin advice, and ambulance counselling." },
              { title: "Headache red flags", text: "Carbon monoxide exposure, migraine pattern recognition, and safety-netting." },
              { title: "Counselling stations", text: "Sensitive obesity counselling with ICE, shared decision-making, and holistic risk assessment." }
            ].map((item, idx) => (
              <div key={idx} className="glass p-10 rounded-[2rem] hover:bg-white/[0.05] transition-all">
                <div className="flex gap-1 mb-6">
                  {[...Array(3)].map((_, i) => <Star key={i} className="w-4 h-4 fill-blue-400 text-blue-400" />)}
                </div>
                <h3 className="font-bold text-white text-xl mb-4">{item.title}</h3>
                <p className="text-slate-300 text-lg leading-relaxed">{item.text}</p>
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
              Start with the demo cases, then expand the case library and production auth when ready.
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
