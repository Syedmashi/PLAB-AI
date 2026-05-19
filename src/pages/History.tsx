import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { getRecentSessions } from '../lib/progress';
import { Link } from 'react-router-dom';
import { Stethoscope, User, LayoutDashboard, History as HistoryIcon, LogOut, Clock, ArrowLeft } from 'lucide-react';
import { signOutDemo } from '../lib/auth';

export default function History() {
  const sessions = getRecentSessions(100);

  return (
    <div className="min-h-dvh bg-[#020617] flex">
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
          <Link to="/history" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5 text-white font-medium border border-white/10">
            <HistoryIcon className="w-5 h-5 text-blue-400" /> History
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

      <main className="flex-1 lg:ml-64 p-8 relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-5xl mx-auto relative z-10">
          <Link to="/dashboard">
            <Button variant="ghost" className="text-slate-400 hover:text-white mb-6 p-0">
              <ArrowLeft className="w-5 h-5 mr-2" /> Back to Dashboard
            </Button>
          </Link>

          <header className="mb-12">
            <h1 className="text-4xl font-bold text-white tracking-tight">Session <span className="gradient-text">History</span></h1>
            <p className="text-slate-400 mt-1">Completed consultations saved locally in this browser.</p>
          </header>

          <Card className="glass border-white/10 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white">Completed Sessions</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              {sessions.length === 0 ? (
                <div className="text-center py-16">
                  <Clock className="w-10 h-10 mx-auto mb-4 text-slate-600" />
                  <h2 className="text-xl font-bold text-white mb-2">No completed sessions yet</h2>
                  <p className="text-slate-400 mb-6">Finish a simulation and submit a diagnosis to create your first history record.</p>
                  <Link to="/cases">
                    <Button className="gradient-bg text-white border-none font-bold">Start a Case</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {sessions.map((session) => (
                    <div key={session.id} className="bg-white/5 border border-white/5 rounded-2xl p-5">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-bold text-white">{session.caseTitle}</h3>
                          <p className="text-xs text-slate-500 mt-1">{new Date(session.completedAt).toLocaleString()}</p>
                          <p className="text-sm text-slate-400 mt-3">Submitted diagnosis: {session.diagnosisInput || 'Not provided'}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Badge className="bg-blue-500/20 text-blue-400 border border-blue-500/20">Accuracy {session.evaluation.accuracy ?? 0}%</Badge>
                          <Badge className="bg-purple-500/20 text-purple-400 border border-purple-500/20">Safety {session.evaluation.safety ?? 0}%</Badge>
                          <Badge className="bg-white/5 text-slate-300 border border-white/10">{Math.round(session.durationMs / 60000)}m</Badge>
                        </div>
                      </div>
                      {session.evaluation.criticalMistake && (
                        <p className="mt-4 text-sm text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-xl p-3">
                          Critical note: {session.evaluation.criticalMistake}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
