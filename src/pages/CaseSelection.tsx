import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { MOCK_CASES } from '../lib/mockData';
import { getCasesWithProgress } from '../lib/progress';
import { Stethoscope, ArrowLeft, Play, Info, Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const ALL_CATEGORIES = 'All categories';

export default function CaseSelection() {
  const navigate = useNavigate();
  const cases = getCasesWithProgress(MOCK_CASES);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(ALL_CATEGORIES);

  const categories = useMemo(() => [ALL_CATEGORIES, ...Array.from(new Set(cases.map((c) => c.category)))], [cases]);
  const filteredCases = cases.filter((caseItem) => {
    const haystack = `${caseItem.title} ${caseItem.category} ${caseItem.complaint} ${caseItem.patientName}`.toLowerCase();
    const matchesSearch = haystack.includes(search.trim().toLowerCase());
    const matchesCategory = category === ALL_CATEGORIES || caseItem.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-dvh bg-[#020617] p-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <Link to="/dashboard">
              <Button variant="ghost" className="text-slate-400 hover:text-white mb-4 p-0">
                <ArrowLeft className="w-5 h-5 mr-2" /> Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-4xl font-bold text-white tracking-tight">Select a <span className="gradient-text">Clinical Case</span></h1>
            <p className="text-slate-400 mt-1">Choose a PLAB 2-style scenario to start your training session.</p>
          </div>
        </header>

        <div className="glass border-white/10 rounded-3xl p-4 mb-10 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by case, specialty, complaint, or patient..."
              className="h-12 pl-12 bg-white/5 border-white/10 text-white placeholder:text-slate-500 rounded-2xl"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((item) => (
              <Button
                key={item}
                type="button"
                variant={item === category ? 'default' : 'outline'}
                onClick={() => setCategory(item)}
                className={item === category
                  ? 'gradient-bg border-none text-white rounded-2xl'
                  : 'border-white/10 text-slate-300 hover:bg-white/5 rounded-2xl'}
              >
                {item}
              </Button>
            ))}
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between text-sm text-slate-500">
          <span>{filteredCases.length} of {cases.length} cases shown</span>
          <span>Progress is saved locally in this browser</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCases.map((c, idx) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(idx * 0.05, 0.25) }}
            >
              <Card className="glass border-white/10 hover:border-blue-500/30 transition-all group h-full flex flex-col shadow-lg">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start mb-4 gap-3">
                    <div className="bg-white/5 p-3 rounded-xl group-hover:bg-blue-500/10 transition-colors border border-white/5">
                      <Stethoscope className="w-6 h-6 text-slate-500 group-hover:text-blue-400" />
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <Badge variant="outline" className={
                        c.difficulty === 'Easy' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' :
                        c.difficulty === 'Medium' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' :
                        'text-rose-400 bg-rose-500/10 border-rose-500/20'
                      }>
                        {c.difficulty}
                      </Badge>
                      {c.status === 'Completed' && (
                        <Badge className="bg-blue-500/20 text-blue-400 border border-blue-500/20">
                          {c.accuracy ?? 0}% last score
                        </Badge>
                      )}
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{c.title}</CardTitle>
                  <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">{c.category}</p>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="flex-1 space-y-4 mb-6">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Patient</p>
                      <p className="text-sm text-slate-300">{c.patientName}, {c.patientAge}y {c.patientGender}</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Presentation</p>
                      <p className="text-sm text-slate-300 italic">"{c.complaint}"</p>
                    </div>
                  </div>
                  <Button 
                    onClick={() => navigate(`/simulation?caseId=${c.id}`)}
                    className="w-full h-11 gradient-bg text-white border-none font-bold shadow-lg shadow-blue-500/10 group-hover:opacity-90"
                  >
                    <Play className="w-4 h-4 mr-2" /> {c.status === 'Completed' ? 'Practise Again' : 'Start Simulation'}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {filteredCases.length === 0 && (
            <Card className="glass border-white/10 flex items-center justify-center min-h-[300px] md:col-span-2 lg:col-span-3">
              <div className="text-center p-8">
                <div className="bg-white/5 p-4 rounded-full w-fit mx-auto mb-4 border border-white/5">
                  <Info className="w-6 h-6 text-slate-500" />
                </div>
                <p className="text-slate-300 font-medium mb-2">No matching cases found</p>
                <p className="text-slate-500 text-sm">Try a different search term or category.</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
