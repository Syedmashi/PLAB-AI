import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ScrollArea } from '../components/ui/scroll-area';
import { MOCK_CASES } from '../lib/mockData';
import { getCasesWithProgress, getRecentSessions, getUserStats } from '../lib/progress';
import { Stethoscope, LayoutDashboard, History, User, LogOut, Play, CheckCircle2, Clock, Zap, TrendingUp } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { signOutDemo } from '../lib/auth';

export default function Dashboard() {
  const navigate = useNavigate();
  const stats = getUserStats();
  const cases = getCasesWithProgress(MOCK_CASES);
  const recentSessions = getRecentSessions(3);

  return (
    <div className="min-h-dvh bg-[#020617] flex">
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
          <Link to="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5 text-white font-medium border border-white/10">
            <LayoutDashboard className="w-5 h-5 text-blue-400" /> Dashboard
          </Link>
          <Link to="/history" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors font-medium">
            <History className="w-5 h-5" /> History
          </Link>
          <Link to="/profile" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors font-medium">
            <User className="w-5 h-5" /> Profile
          </Link>
        </nav>

        <div className="p-4 border-t border-white/5">
          <Link to="/">
            <Button onClick={signOutDemo} variant="ghost" className="w-full justify-start text-slate-500 hover:text-rose-400 hover:bg-rose-500/10">
              <LogOut className="w-5 h-5 mr-3" /> Log Out
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-8 relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-5xl mx-auto relative z-10">
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
            <div>
              <h1 className="text-4xl font-bold text-white tracking-tight">Welcome back, <span className="gradient-text">Doctor</span></h1>
              <p className="text-slate-400 mt-1">Your AI patients are ready for consultation.</p>
            </div>
            <Button 
              onClick={() => navigate('/cases')}
              className="gradient-bg hover:opacity-90 text-white h-12 px-8 shadow-xl shadow-blue-500/20 transition-all hover:scale-105 active:scale-95 border-none font-bold"
            >
              <Play className="w-4 h-4 mr-2 fill-current" /> Start New Case
            </Button>
          </header>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { label: 'Sessions', value: stats.sessionsCompleted, icon: <CheckCircle2 className="w-5 h-5 text-blue-400" />, color: 'bg-blue-500/10' },
              { label: 'Accuracy', value: `${stats.accuracy}%`, icon: <TrendingUp className="w-5 h-5 text-emerald-400" />, color: 'bg-emerald-500/10' },
              { label: 'Streak', value: `${stats.streak} days`, icon: <Zap className="w-5 h-5 text-amber-400" />, color: 'bg-amber-500/10' },
              { label: 'Study Time', value: stats.totalTime, icon: <Clock className="w-5 h-5 text-purple-400" />, color: 'bg-purple-500/10' },
            ].map((stat, idx) => (
              <Card key={idx} className="glass border-white/10 shadow-lg">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className={`${stat.color} p-3 rounded-xl border border-white/5`}>
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {recentSessions.length > 0 && (
            <div className="mb-12 glass border border-white/10 rounded-3xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-white">Recent Completed Sessions</h2>
                <span className="text-xs text-slate-500 uppercase tracking-widest">Saved locally</span>
              </div>
              <div className="space-y-3">
                {recentSessions.map((session) => (
                  <div key={session.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/5 border border-white/5 rounded-2xl p-4">
                    <div>
                      <p className="text-white font-semibold">{session.caseTitle}</p>
                      <p className="text-xs text-slate-500">{new Date(session.completedAt).toLocaleString()}</p>
                    </div>
                    <Badge className="bg-blue-500/20 text-blue-400 border border-blue-500/20 w-fit">
                      {session.evaluation.accuracy ?? 0}% accuracy
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Cases */}
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Recent Cases</h2>
              <Button variant="link" onClick={() => navigate('/cases')} className="text-blue-400 font-semibold p-0 hover:text-blue-300">View All</Button>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {cases.map((c) => (
                <Card key={c.id} onClick={() => navigate(`/simulation?caseId=${c.id}`)} className="glass border-white/10 hover:border-blue-500/30 transition-all cursor-pointer group shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex items-start gap-5">
                        <div className="bg-white/5 p-4 rounded-2xl group-hover:bg-blue-500/10 transition-colors border border-white/5">
                          <Stethoscope className="w-6 h-6 text-slate-500 group-hover:text-blue-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">{c.title}</h3>
                          <p className="text-sm text-slate-400 mt-1">{c.category} • {c.patientName}, {c.patientAge}y {c.patientGender}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-8">
                        <div className="text-right hidden sm:block">
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Difficulty</p>
                          <Badge variant="outline" className={
                            c.difficulty === 'Easy' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' :
                            c.difficulty === 'Medium' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' :
                            'text-rose-400 bg-rose-500/10 border-rose-500/20'
                          }>
                            {c.difficulty}
                          </Badge>
                        </div>
                        
                        <div className="text-right hidden sm:block">
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Status</p>
                          <Badge className={
                            c.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' :
                            c.status === 'In Progress' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/20' :
                            'bg-white/5 text-slate-400 border border-white/10'
                          }>
                            {c.status}
                          </Badge>
                        </div>

                        {c.accuracy && (
                          <div className="text-right hidden sm:block min-w-[60px]">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Score</p>
                            <p className="text-lg font-bold text-white">{c.accuracy}%</p>
                          </div>
                        )}

                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Start ${c.title}`}
                          onClick={(event) => {
                            event.stopPropagation();
                            navigate(`/simulation?caseId=${c.id}`);
                          }}
                          className="rounded-full hover:bg-blue-500/10 hover:text-blue-400 w-12 h-12"
                        >
                          <Play className="w-5 h-5 fill-current" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
