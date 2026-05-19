import * as React from 'react';
import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Stethoscope, Chrome, Mail, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { signInDemo } from '../lib/auth';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signInDemo();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

      <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-slate-500 hover:text-white transition-colors z-10">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <div className="flex justify-center mb-10">
          <div className="flex items-center gap-3 group">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2.5 rounded-xl shadow-lg shadow-blue-500/20 group-hover:rotate-12 transition-transform">
              <Stethoscope className="w-8 h-8 text-white" />
            </div>
            <span className="text-3xl font-bold tracking-tight text-white">PLAB<span className="gradient-text">AI</span></span>
          </div>
        </div>

        <Card className="glass border-white/10 shadow-2xl">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-3xl font-bold text-white">{isLogin ? 'Welcome back' : 'Create an account'}</CardTitle>
            <CardDescription className="text-slate-400">
              {isLogin ? 'Demo mode: enter any email and password to explore the prototype' : 'Demo mode: create a local prototype account'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-3">
              <Button type="button" variant="outline" disabled className="w-full h-12 font-medium border-white/10 text-white hover:bg-white/5 backdrop-blur-md disabled:opacity-60 disabled:cursor-not-allowed">
                <Chrome className="w-5 h-5 mr-3" /> Google sign-in coming soon
              </Button>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/5" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#0b0f1a] px-3 text-slate-500 font-medium tracking-widest">Or continue with email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Input type="email" placeholder="name@example.com" className="h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:ring-blue-500 rounded-xl" required />
              </div>
              <div className="space-y-2">
                <Input type="password" placeholder="••••••••" className="h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:ring-blue-500 rounded-xl" required />
              </div>
              <Button type="submit" className="w-full h-12 gradient-bg text-white font-bold transition-all shadow-xl shadow-blue-500/20 border-none hover:opacity-90">
                {isLogin ? 'Log In' : 'Sign Up'}
              </Button>
            </form>

            <div className="text-center mt-6">
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-slate-400 hover:text-white font-medium transition-colors"
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
              </button>
            </div>
          </CardContent>
        </Card>
        
        <p className="text-center text-xs text-slate-500 mt-10 px-8 leading-relaxed">
          Prototype access only. Do not enter a real password until production authentication is connected.
        </p>
      </motion.div>
    </div>
  );
}
