import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Separator } from '../components/ui/separator';
import { MOCK_STATS } from '../lib/mockData';
import { useNavigate, Link } from 'react-router-dom';
import { Stethoscope, User, LayoutDashboard, History, LogOut, TrendingUp } from 'lucide-react';
import { Progress } from '../components/ui/progress';

export default function Profile() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#020617] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white/5 border-r border-white/5 hidden lg:flex flex-col fixed h-full backdrop-blur-xl">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-1.5 rounded-lg shadow-lg shadow-blue-500/20">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">PLAB<span className="gradient-text">AI</span></span>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          <Link to="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors font-medium">
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </Link>
          <Link to="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors font-medium">
            <History className="w-5 h-5" /> History
          </Link>
          <Link to="/profile" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5 text-white font-medium border border-white/10">
            <User className="w-5 h-5 text-blue-400" /> Profile
          </Link>
        </nav>

        <div className="p-4 border-t border-white/5">
          <Link to="/">
            <Button variant="ghost" className="w-full justify-start text-slate-500 hover:text-rose-400 hover:bg-rose-500/10">
              <LogOut className="w-5 h-5 mr-3" /> Log Out
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-8 relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto relative z-10">
          <header className="mb-12">
            <h1 className="text-4xl font-bold text-white tracking-tight">Your <span className="gradient-text">Profile</span></h1>
            <p className="text-slate-400 mt-1">Manage your account and track your clinical progress.</p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: User Info */}
            <div className="lg:col-span-1 space-y-8">
              <Card className="glass border-white/10 shadow-xl overflow-hidden">
                <div className="h-24 bg-gradient-to-r from-blue-600 to-purple-600 relative">
                  <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
                </div>
                <CardContent className="p-8 -mt-12 relative z-10 text-center">
                  <div className="w-24 h-24 rounded-3xl bg-[#020617] p-1 mx-auto mb-4 shadow-2xl">
                    <div className="w-full h-full rounded-[1.25rem] bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white border border-white/10 shadow-inner">
                      SM
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white">Dr. Syed Mashi</h3>
                  <p className="text-slate-400 text-sm mb-6">syedmashi43@gmail.com</p>
                  <Button variant="outline" className="w-full border-white/10 text-white hover:bg-white/5">Edit Profile</Button>
                </CardContent>
              </Card>

              <Card className="glass border-white/10 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-white">Account Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-sm text-slate-400">Member Since</span>
                    <span className="text-sm font-bold text-white">April 2024</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-sm text-slate-400">Total Cases</span>
                    <span className="text-sm font-bold text-white">42</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-sm text-slate-400">Global Rank</span>
                    <span className="text-sm font-bold text-blue-400">#124</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Performance */}
            <div className="lg:col-span-2 space-y-8">
              <Card className="glass border-white/10 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-white">Performance Analytics</CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid grid-cols-2 gap-8 mb-10">
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400 font-medium">Diagnostic Accuracy</span>
                        <span className="text-white font-bold">92%</span>
                      </div>
                      <Progress value={92} className="h-2 bg-white/5" />
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400 font-medium">Communication Score</span>
                        <span className="text-white font-bold">88%</span>
                      </div>
                      <Progress value={88} className="h-2 bg-white/5" />
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400 font-medium">Patient Safety</span>
                        <span className="text-white font-bold">95%</span>
                      </div>
                      <Progress value={95} className="h-2 bg-white/5" />
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400 font-medium">Time Efficiency</span>
                        <span className="text-white font-bold">84%</span>
                      </div>
                      <Progress value={84} className="h-2 bg-white/5" />
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                    <div className="flex gap-4">
                      <div className="bg-blue-500/20 p-3 rounded-xl h-fit">
                        <TrendingUp className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white mb-1">Performance Insight</h4>
                        <p className="text-sm text-slate-300 leading-relaxed">
                          Your diagnostic accuracy has improved by 12% over the last 7 days. You are particularly strong in Cardiology and Emergency Medicine cases.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass border-white/10 shadow-xl">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-xl font-bold text-white">Specialty Mastery</CardTitle>
                  <Button variant="link" className="text-blue-400 font-semibold p-0 h-auto">View Details</Button>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="space-y-6">
                    {[
                      { name: 'Cardiology', level: 95, color: 'bg-rose-500' },
                      { name: 'Respiratory', level: 82, color: 'bg-blue-500' },
                      { name: 'Neurology', level: 78, color: 'bg-purple-500' },
                      { name: 'Pediatrics', level: 64, color: 'bg-amber-500' },
                    ].map((specialty, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-white font-bold">{specialty.name}</span>
                          <span className="text-slate-400">{specialty.level}% Mastery</span>
                        </div>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${specialty.color} shadow-[0_0_10px_rgba(255,255,255,0.2)]`} 
                            style={{ width: `${specialty.level}%` }} 
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
