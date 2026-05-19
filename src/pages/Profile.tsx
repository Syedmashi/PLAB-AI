import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { getPerformanceSummary, getRecentSessions, getUserStats } from '../lib/progress';
import { Link } from 'react-router-dom';
import { Stethoscope, User, LayoutDashboard, History, LogOut, TrendingUp, Clock } from 'lucide-react';
import { Progress } from '../components/ui/progress';
import { signOutDemo } from '../lib/auth';

export default function Profile() {
  const stats = getUserStats();
  const performance = getPerformanceSummary();
  const recentSessions = getRecentSessions(5);
  const hasSessions = recentSessions.length > 0;

  return (
    <div className="min-h-screen bg-[#020617] flex">
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
          <Link to="/history" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors font-medium">
            <History className="w-5 h-5" /> History
          </Link>
          <Link to="/profile" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5 text-white font-medium border border-white/10">
            <User className="w-5 h-5 text-blue-400" /> Profile
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

      <main className="flex-1 lg:ml-64 p-8 relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto relative z-10">
          <header className="mb-12">
            <h1 className="text-4xl font-bold text-white tracking-tight">Your <span className="gradient-text">Profile</span></h1>
            <p className="text-slate-400 mt-1">Track local prototype progress from completed consultations.</p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-8">
              <Card className="glass border-white/10 shadow-xl overflow-hidden">
                <div className="h-24 bg-gradient-to-r from-blue-600 to-purple-600 relative" />
                <CardContent className="p-8 -mt-12 relative z-10 text-center">
                  <div className="w-24 h-24 rounded-3xl bg-[#020617] p-1 mx-auto mb-4 shadow-2xl">
                    <div className="w-full h-full rounded-[1.25rem] bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white border border-white/10 shadow-inner">
                      DR
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white">Demo Doctor</h3>
                  <p className="text-slate-400 text-sm mb-6">Prototype profile</p>
                  <Button variant="outline" disabled className="w-full border-white/10 text-white hover:bg-white/5 disabled:opacity-60 disabled:cursor-not-allowed">Production Profile Coming Soon</Button>
                </CardContent>
              </Card>

              <Card className="glass border-white/10 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-white">Account Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-sm text-slate-400">Mode</span>
                    <span className="text-sm font-bold text-white">Local prototype</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-sm text-slate-400">Completed Sessions</span>
                    <span className="text-sm font-bold text-white">{stats.sessionsCompleted}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-sm text-slate-400">Study Time</span>
                    <span className="text-sm font-bold text-blue-400">{stats.totalTime}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2 space-y-8">
              <Card className="glass border-white/10 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-white">Performance Analytics</CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-10">
                    {[
                      { label: 'Diagnostic Accuracy', value: performance.accuracy },
                      { label: 'Communication', value: performance.communication },
                      { label: 'Patient Safety', value: performance.safety },
                    ].map((metric) => (
                      <div className="space-y-3" key={metric.label}>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400 font-medium">{metric.label}</span>
                          <span className="text-white font-bold">{hasSessions ? `${metric.value}%` : '—'}</span>
                        </div>
                        <Progress value={hasSessions ? metric.value : 0} className="h-2 bg-white/5" />
                      </div>
                    ))}
                  </div>

                  <div className="p-6 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                    <div className="flex gap-4">
                      <div className="bg-blue-500/20 p-3 rounded-xl h-fit">
                        <TrendingUp className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white mb-1">Performance Insight</h4>
                        <p className="text-sm text-slate-300 leading-relaxed">
                          {hasSessions
                            ? `You have completed ${stats.sessionsCompleted} local session${stats.sessionsCompleted === 1 ? '' : 's'}. Keep practising to make the trend data more reliable.`
                            : 'Complete a simulated consultation to unlock local performance analytics.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass border-white/10 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-white">Recent Session History</CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  {recentSessions.length === 0 ? (
                    <div className="text-center py-10 text-slate-400">
                      <Clock className="w-8 h-8 mx-auto mb-3 text-slate-600" />
                      No completed sessions yet.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentSessions.map((session) => (
                        <div key={session.id} className="bg-white/5 border border-white/5 rounded-2xl p-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                              <p className="text-white font-semibold">{session.caseTitle}</p>
                              <p className="text-xs text-slate-500">{new Date(session.completedAt).toLocaleString()}</p>
                            </div>
                            <div className="text-sm text-slate-300">
                              Accuracy: <span className="font-bold text-blue-400">{session.evaluation.accuracy ?? 0}%</span>
                            </div>
                          </div>
                          {session.evaluation.criticalMistake && (
                            <p className="mt-3 text-sm text-rose-300">Critical note: {session.evaluation.criticalMistake}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
