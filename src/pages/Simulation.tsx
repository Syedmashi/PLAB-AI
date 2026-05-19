import * as React from 'react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { ScrollArea } from '../components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/dialog';
import { Progress } from '../components/ui/progress';
import { 
  Stethoscope, Send, User, ArrowLeft, Info, CheckCircle2, ShieldCheck,
  XCircle, AlertCircle, Clock, Zap, TrendingUp, Mic, MicOff, Volume2, 
  VolumeX, RefreshCw 
} from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Message, Case } from '../types';
import { MOCK_CASES } from '../lib/mockData';
import { recordSession } from '../lib/progress';

export default function Simulation() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const caseId = searchParams.get('caseId');
  const selectedCase = MOCK_CASES.find(c => c.id === caseId);
  const currentCase = selectedCase || MOCK_CASES[0];

  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showDiagnosisModal, setShowDiagnosisModal] = useState(false);
  const [diagnosisInput, setDiagnosisInput] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [evaluation, setEvaluation] = useState<any>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [aiNotice, setAiNotice] = useState<string | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);
  const sessionStartedAtRef = useRef(Date.now());

  // Load voices when they change
  useEffect(() => {
    const loadVoices = () => {
      voicesRef.current = window.speechSynthesis.getVoices();
    };
    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // Refs for stable access in event handlers
  const isSpeakingRef = useRef(false);
  const sessionStartedRef = useRef(false);
  const messagesRef = useRef<Message[]>([]);

  // Keep refs in sync
  useEffect(() => { isSpeakingRef.current = isSpeaking; }, [isSpeaking]);
  useEffect(() => { sessionStartedRef.current = sessionStarted; }, [sessionStarted]);
  useEffect(() => { messagesRef.current = messages; }, [messages]);

  const getFallbackPatientReply = useCallback((input?: string) => {
    const lower = (input || '').toLowerCase();
    if (!input) return `Hey doctor... I’m ${currentCase.patientName}. ${currentCase.complaint}. I’m quite worried about it.`;
    if (lower.includes('pain') || lower.includes('symptom') || lower.includes('tell me')) return currentCase.background.split('.')[0] + '.';
    if (lower.includes('worr') || lower.includes('concern')) return 'I’m worried this could be something serious, and I’d like to know what I should do next.';
    if (lower.includes('expect')) return 'I was hoping you could explain what might be causing this and whether I need urgent help.';
    return 'I see, doctor. Could you explain that a bit more simply for me?';
  }, [currentCase]);

  const getFallbackEvaluation = useCallback(() => {
    const transcript = messages.map((m) => m.content.toLowerCase()).join(' ');
    const diagnosis = diagnosisInput.toLowerCase();

    const matchedQuestions = (currentCase.keyQuestions || []).filter((question) => {
      const keywords = question.toLowerCase().split(/[^a-z0-9]+/).filter((word) => word.length > 5);
      return keywords.some((word) => transcript.includes(word));
    });
    const matchedSafety = (currentCase.redFlags || []).filter((point) => {
      const keywords = point.toLowerCase().split(/[^a-z0-9]+/).filter((word) => word.length > 5);
      return keywords.some((word) => transcript.includes(word) || diagnosis.includes(word));
    });
    const diagnosisWords = currentCase.diagnosis.toLowerCase().split(/[^a-z0-9]+/).filter((word) => word.length > 4);
    const diagnosisMatched = diagnosisWords.some((word) => diagnosis.includes(word));

    return {
      isCorrect: diagnosisMatched,
      accuracy: diagnosisMatched ? 70 : 40,
      communication: Math.min(85, 45 + messages.filter((m) => m.role === 'doctor').length * 5),
      safety: Math.min(90, 40 + matchedSafety.length * 15),
      time: 'Not measured',
      strengths: [
        'Completed the consultation and submitted a working diagnosis.',
        matchedQuestions.length > 0 ? 'Covered some relevant case-specific questions.' : 'Maintained a basic consultation flow.',
        matchedSafety.length > 0 ? 'Addressed at least one safety-relevant feature.' : 'Reached the feedback stage for review.',
      ],
      improvements: [
        'AI evaluation was unavailable, so this is a local fallback score rather than full examiner feedback.',
        ...(currentCase.keyQuestions || []).filter((question) => !matchedQuestions.includes(question)).slice(0, 2),
        ...(currentCase.expectedActions || []).slice(0, 1),
      ].slice(0, 4),
      missedQuestions: (currentCase.keyQuestions || []).filter((question) => !matchedQuestions.includes(question)).slice(0, 4),
      missedSafetyPoints: (currentCase.redFlags || []).filter((point) => !matchedSafety.includes(point)).slice(0, 4),
      criticalMistake: diagnosisMatched ? null : `The submitted diagnosis did not clearly match: ${currentCase.diagnosis}`,
    };
  }, [currentCase, diagnosisInput, messages]);

  const requestPatientReply = useCallback(async (input?: string) => {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mode: 'patient',
        caseData: currentCase,
        messages: messagesRef.current,
        input,
      }),
    });

    if (!response.ok) {
      throw new Error(`AI patient request failed (${response.status})`);
    }

    const data = await response.json();
    return data.text || '';
  }, [currentCase]);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        stopRecording();
        // Automatically send after voice input
        sendMessage(transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          alert("Microphone access is blocked. Please allow microphone permissions in your browser settings to use voice features.");
        }
        stopRecording();
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
        // If we were supposed to be recording but it ended (e.g. timeout), 
        // and the patient isn't speaking, restart it for a continuous experience
        if (!isSpeakingRef.current && sessionStartedRef.current && messagesRef.current.length > 0) {
          const lastMessage = messagesRef.current[messagesRef.current.length - 1];
          if (lastMessage.role === 'patient') {
            // Give a small delay before restarting to avoid rapid cycles
            setTimeout(() => {
              if (!isSpeakingRef.current) startRecording();
            }, 1000);
          }
        }
      };
    }
  }, []);

  const startRecording = useCallback(() => {
    if (recognitionRef.current) {
      try {
        // Prevent multiple starts
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        // Silently fail if already started
      }
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        setIsRecording(false);
      } catch (err) {
        // Silently fail
      }
    }
  }, []);

  const speak = useCallback((text: string) => {
    if (!speechEnabled || !window.speechSynthesis) return;
    
    // Stop any current speaking
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Attempt to find a high-quality "natural" voice
    const preferredVoices = voicesRef.current.filter(v => 
      v.name.includes('Google') || 
      v.name.includes('Natural') || 
      v.name.includes('Premium') ||
      v.lang.startsWith('en-GB') || // Better for PLAB (UK exam)
      v.lang.startsWith('en-US')
    );

    // Sort to prioritize "Google" or "Natural"
    preferredVoices.sort((a, b) => {
      const aScore = (a.name.includes('Google') ? 2 : 0) + (a.name.includes('Natural') ? 1 : 0);
      const bScore = (b.name.includes('Google') ? 2 : 0) + (b.name.includes('Natural') ? 1 : 0);
      return bScore - aScore;
    });

    if (preferredVoices.length > 0) {
      // Pick based on gender if possible, otherwise first quality one
      const genderMatch = preferredVoices.find(v => 
        currentCase.patientGender === 'Female' ? v.name.includes('Female') || v.name.includes('Zira') || v.name.includes('Google UK English Female') : v.name.includes('Male') || v.name.includes('David')
      );
      utterance.voice = genderMatch || preferredVoices[0];
    }

    utterance.rate = 0.95; // Slightly slower for clarity and naturalness
    utterance.pitch = 1.0;
    
    utterance.onstart = () => {
      setIsSpeaking(true);
      stopRecording(); // Don't listen while speaking
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      // Auto-start microphone after patient finishes speaking
      startRecording();
    };
    utterance.onerror = () => setIsSpeaking(false);
    
    synthesisRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [speechEnabled, startRecording, stopRecording]);

  // Initialize patient greeting
  useEffect(() => {
    let cancelled = false;

    const startGreeting = async () => {
      setIsTyping(true);
      const greetingId = 'greeting-initial';
      setMessages([{ id: greetingId, role: 'patient', content: '', timestamp: new Date() }]);

      try {
        const fullText = await requestPatientReply();
        if (cancelled) return;
        setMessages(prev => prev.map(m => m.id === greetingId ? { ...m, content: fullText } : m));
        speak(fullText);
        setSessionStarted(true);
      } catch (err) {
        console.error('Greeting error:', err);
        setAiNotice('AI patient service is unavailable, so this session is using local fallback responses.');
        const fallback = getFallbackPatientReply();
        if (cancelled) return;
        setMessages(prev => prev.map(m => m.id === greetingId ? { ...m, content: fallback } : m));
        setSessionStarted(true);
      } finally {
        if (!cancelled) setIsTyping(false);
      }
    };

    startGreeting();
    return () => { cancelled = true; };
  }, [currentCase, getFallbackPatientReply, requestPatientReply, speak]);


  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'doctor',
      content: content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    setIsTyping(true);
    
    // Placeholder for the patient's incoming message
    const patientMsgId = (Date.now() + 1).toString();
    const patientResponse: Message = {
      id: patientMsgId,
      role: 'patient',
      content: '',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, patientResponse]);

    try {
      const fullText = await requestPatientReply(content);
      setMessages(prev => prev.map(m => 
        m.id === patientMsgId ? { ...m, content: fullText } : m
      ));
      speak(fullText);
    } catch (error) {
      console.error("AI Error:", error);
      setAiNotice('AI patient service is unavailable, so this session is using local fallback responses.');
      const fallback = getFallbackPatientReply(content);
      setMessages(prev => prev.map(m => 
        m.id === patientMsgId ? { ...m, content: fallback } : m
      ));
    } finally {
      setIsTyping(false);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleSubmitDiagnosis = async () => {
    setShowDiagnosisModal(false);
    setIsTyping(true);

    // Stop all AI communication on submission
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    stopRecording();
    setSessionStarted(false); // Prevents the auto-restart loop in onend

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'evaluate',
          caseData: currentCase,
          messages,
          diagnosisInput,
        }),
      });

      if (!response.ok) throw new Error(`Evaluation request failed (${response.status})`);
      const result = await response.json();
      setEvaluation(result);
      recordSession({
        caseId: currentCase.id,
        caseTitle: currentCase.title,
        durationMs: Date.now() - sessionStartedAtRef.current,
        diagnosisInput,
        evaluation: result,
      });
      setShowFeedback(true);
    } catch (error) {
      console.error("Evaluation Error:", error);
      setAiNotice('AI examiner service is unavailable, so this score was generated by the local fallback evaluator.');
      const fallback = getFallbackEvaluation();
      setEvaluation(fallback);
      recordSession({
        caseId: currentCase.id,
        caseTitle: currentCase.title,
        durationMs: Date.now() - sessionStartedAtRef.current,
        diagnosisInput,
        evaluation: fallback,
      });
      setShowFeedback(true);
    } finally {
      setIsTyping(false);
    }
  };

  if (caseId && !selectedCase) {
    return (
      <div className="min-h-dvh bg-[#020617] flex items-center justify-center p-8">
        <Card className="glass border-white/10 shadow-2xl max-w-lg w-full">
          <CardContent className="p-10 text-center">
            <AlertCircle className="w-12 h-12 text-amber-400 mx-auto mb-5" />
            <h1 className="text-2xl font-bold text-white mb-3">Case not found</h1>
            <p className="text-slate-400 mb-8">The selected simulation link does not match an available case.</p>
            <Button onClick={() => navigate('/cases')} className="gradient-bg text-white border-none font-bold">
              Choose a Case
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showFeedback && evaluation) {
    return (
      <div className="min-h-dvh bg-[#020617] p-8 flex items-center justify-center overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-4xl w-full py-8"
        >
          <Card className="glass border-white/10 shadow-2xl overflow-hidden">
            <div className={`p-12 text-center relative ${evaluation.isCorrect ? 'bg-gradient-to-r from-emerald-600 to-teal-600' : 'bg-gradient-to-r from-rose-600 to-orange-600'}`}>
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.18),transparent_55%)] opacity-20 mix-blend-overlay" />
              <div className="relative z-10 text-white">
                <div className="w-24 h-24 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center mx-auto mb-6 border border-white/30 shadow-2xl">
                  {evaluation.isCorrect ? <CheckCircle2 className="w-12 h-12" /> : <XCircle className="w-12 h-12" />}
                </div>
                <h2 className="text-4xl font-bold mb-2">
                  {evaluation.isCorrect ? 'Accurate Diagnosis' : 'Incorrect Diagnosis'}
                </h2>
                <p className="opacity-90 text-lg">
                  The actual diagnosis was: <span className="font-bold">{currentCase.diagnosis}</span>
                </p>
              </div>
            </div>
            
            <CardContent className="p-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="text-center p-6 rounded-2xl bg-white/5 border border-white/5">
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Accuracy</p>
                  <p className={`text-4xl font-black ${evaluation.accuracy > 70 ? 'text-emerald-400' : 'text-rose-400'}`}>{evaluation.accuracy}%</p>
                </div>
                <div className="text-center p-6 rounded-2xl bg-white/5 border border-white/5">
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Communication</p>
                  <p className="text-4xl font-black text-blue-400">{evaluation.communication}%</p>
                </div>
                <div className="text-center p-6 rounded-2xl bg-white/5 border border-white/5">
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Safety</p>
                  <p className="text-4xl font-black text-purple-400">{evaluation.safety}%</p>
                </div>
              </div>

              {evaluation.criticalMistake && (
                <div className="mb-10 p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20">
                  <h3 className="text-rose-400 font-bold flex items-center gap-2 mb-2">
                    <AlertCircle className="w-5 h-5" /> Critical Observation
                  </h3>
                  <p className="text-slate-300 leading-relaxed italic">
                    "{evaluation.criticalMistake}"
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-400" /> Key Strengths
                  </h3>
                  <ul className="space-y-3">
                    {evaluation.strengths.map((s: string, i: number) => (
                      <li key={i} className="flex items-center gap-3 text-slate-300 bg-white/5 p-3 rounded-xl border border-white/5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> {s}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-400" /> Actionable Improvements
                  </h3>
                  <ul className="space-y-3">
                    {evaluation.improvements.map((s: string, i: number) => (
                      <li key={i} className="flex items-center gap-3 text-slate-300 bg-white/5 p-3 rounded-xl border border-white/5">
                        <ArrowLeft className="w-4 h-4 text-rose-400 rotate-180 shrink-0" /> {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {((evaluation.missedQuestions?.length || 0) > 0 || (evaluation.missedSafetyPoints?.length || 0) > 0) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-10">
                  {(evaluation.missedQuestions?.length || 0) > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Info className="w-5 h-5 text-amber-400" /> Missed Questions
                      </h3>
                      <ul className="space-y-3">
                        {evaluation.missedQuestions.map((item: string, i: number) => (
                          <li key={i} className="flex items-center gap-3 text-slate-300 bg-white/5 p-3 rounded-xl border border-white/5">
                            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" /> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {(evaluation.missedSafetyPoints?.length || 0) > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-rose-400" /> Missed Safety Points
                      </h3>
                      <ul className="space-y-3">
                        {evaluation.missedSafetyPoints.map((item: string, i: number) => (
                          <li key={i} className="flex items-center gap-3 text-slate-300 bg-white/5 p-3 rounded-xl border border-white/5">
                            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" /> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
                <Button onClick={() => navigate('/dashboard')} variant="outline" className="h-12 px-8 border-white/10 text-white hover:bg-white/5">
                  Back to Dashboard
                </Button>
                <Button onClick={() => window.location.reload()} className="h-12 px-8 gradient-bg text-white border-none font-bold">
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-dvh bg-[#020617] flex flex-col overflow-hidden">
      {/* Header */}
      <header className="h-16 bg-white/5 border-b border-white/5 flex items-center justify-between px-6 backdrop-blur-xl z-20 shrink-0">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/cases')} className="text-slate-400 hover:text-white hover:bg-white/5">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="h-8 w-px bg-white/5 mx-2" />
          <div className="hidden sm:block">
            <h2 className="text-sm font-bold text-white tracking-tight uppercase tracking-widest">{currentCase.title}</h2>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">In Consultation with {currentCase.patientName}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setSpeechEnabled(!speechEnabled)}
            className={`${speechEnabled ? 'text-blue-400' : 'text-slate-500'} hover:bg-white/5`}
          >
            {speechEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </Button>
          <Button 
            onClick={() => setShowDiagnosisModal(true)}
            className="gradient-bg hover:opacity-90 text-white h-10 px-6 shadow-lg shadow-blue-500/20 border-none font-bold text-sm"
          >
            Submit Diagnosis
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.18),transparent_55%)] opacity-10 pointer-events-none" />
        
        {/* Chat Area */}
        <div className="flex-1 flex flex-col relative z-10 min-w-0">
          {aiNotice && (
            <div className="mx-6 mt-4 rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
              {aiNotice}
            </div>
          )}
          <ScrollArea className="flex-1 p-6" ref={scrollRef}>
            <div className="max-w-3xl mx-auto space-y-8 pb-8">
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${m.role === 'doctor' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] sm:max-w-[80%] flex gap-4 ${m.role === 'doctor' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center border border-white/10 shadow-lg ${
                      m.role === 'doctor' ? 'bg-gradient-to-br from-blue-500 to-blue-600' : 'bg-white/5'
                    }`}>
                      {m.role === 'doctor' ? <User className="w-5 h-5 text-white" /> : <Stethoscope className="w-5 h-5 text-slate-400" />}
                    </div>
                    <div className={`space-y-1 ${m.role === 'doctor' ? 'text-right' : 'text-left'}`}>
                      <div className={`p-4 sm:p-5 rounded-[1.5rem] shadow-xl ${
                        m.role === 'doctor' 
                          ? 'bg-blue-600 text-white rounded-tr-none border-blue-500' 
                          : 'glass text-slate-200 rounded-tl-none border-white/10'
                      }`}>
                        <p className="text-sm leading-relaxed">{m.content}</p>
                      </div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">
                        {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="glass p-4 rounded-2xl border border-white/10 flex gap-1.5 shadow-lg">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="p-6 bg-white/5 border-t border-white/5 backdrop-blur-xl shrink-0">
            <div className="max-w-4xl mx-auto flex items-center gap-4">
              <div className="relative flex-1">
                <form onSubmit={handleManualSubmit}>
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={isRecording ? "Listening... Speak now doctor." : "Ask the patient a question..."}
                    className={`h-16 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:ring-blue-500 rounded-2xl pr-16 shadow-inner transition-all ${
                      isRecording ? 'border-blue-500/50 ring-1 ring-blue-500/20' : ''
                    }`}
                  />
                  <Button 
                    type="submit"
                    size="icon" 
                    className="absolute right-2 top-2 h-12 w-12 gradient-bg text-white rounded-xl shadow-lg border-none hover:scale-105 active:scale-95 transition-all"
                    disabled={!inputValue.trim() || isRecording}
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </form>
              </div>
            </div>
            
            <div className="flex justify-center items-center gap-4 mt-6">
              <div className="flex gap-1">
                <div className={`w-1 h-3 rounded-full transition-all duration-300 ${isSpeaking ? 'bg-blue-400 animate-bounce' : 'bg-white/10'}`} />
                <div className={`w-1 h-5 rounded-full transition-all duration-300 ${isSpeaking ? 'bg-blue-400 animate-bounce [animation-delay:0.1s]' : 'bg-white/10'}`} />
                <div className={`w-1 h-3 rounded-full transition-all duration-300 ${isSpeaking ? 'bg-blue-400 animate-bounce [animation-delay:0.2s]' : 'bg-white/10'}`} />
              </div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">
                {isRecording ? "Recording Audio..." : isSpeaking ? "Patient is speaking..." : "Use voice for a realistic simulation"}
              </p>
              <div className="flex gap-1">
                <div className={`w-1 h-3 rounded-full transition-all duration-300 ${isSpeaking ? 'bg-blue-400 animate-bounce' : 'bg-white/10'}`} />
                <div className={`w-1 h-5 rounded-full transition-all duration-300 ${isSpeaking ? 'bg-blue-400 animate-bounce [animation-delay:0.1s]' : 'bg-white/10'}`} />
                <div className={`w-1 h-3 rounded-full transition-all duration-300 ${isSpeaking ? 'bg-blue-400 animate-bounce [animation-delay:0.2s]' : 'bg-white/10'}`} />
              </div>
            </div>
          </div>
        </div>

        {/* Info Sidebar (Desktop) */}
        <aside className="w-80 bg-white/5 border-l border-white/5 hidden xl:flex flex-col backdrop-blur-xl z-20 shrink-0">
          <div className="p-8 border-b border-white/5">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-3xl mx-auto mb-6 flex items-center justify-center border border-white/10 shadow-2xl relative overflow-hidden group">
              <span className="text-3xl font-black text-white/80">
                {currentCase.patientName.split(' ').map((part) => part[0]).join('').slice(0, 2)}
              </span>
              <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-white tracking-tight">{currentCase.patientName}</h3>
              <p className="text-sm text-slate-400">{currentCase.patientAge} years • {currentCase.patientGender}</p>
              <Badge className={`mt-4 px-3 py-1 ${
                currentCase.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                currentCase.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                'bg-rose-500/10 text-rose-400 border-rose-500/20'
              }`}>
                {currentCase.difficulty} Level
              </Badge>
            </div>
          </div>
          
          <ScrollArea className="flex-1 p-8">
            <div className="space-y-10">
              <div>
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Initial Presentation</h4>
                <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                  <p className="text-sm text-slate-300 leading-relaxed italic">
                    "{currentCase.complaint}"
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Patient Profile</h4>
                <div className="space-y-3">
                  <div className="flex justify-between p-3 rounded-xl bg-white/5 border border-white/5 text-sm">
                    <span className="text-slate-500">Gender</span>
                    <span className="text-white font-medium">{currentCase.patientGender}</span>
                  </div>
                  <div className="flex justify-between p-3 rounded-xl bg-white/5 border border-white/5 text-sm">
                    <span className="text-slate-500">Age Group</span>
                    <span className="text-white font-medium">{currentCase.patientAge < 40 ? 'Adult' : 'Senior'}</span>
                  </div>
                  <div className="flex justify-between p-3 rounded-xl bg-white/5 border border-white/5 text-sm">
                    <span className="text-slate-500">Category</span>
                    <span className="text-white font-medium text-blue-400">{currentCase.category}</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/5">
                <Button className="w-full bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border-none h-10">
                  <RefreshCw className="w-4 h-4 mr-2" /> Reset Session
                </Button>
              </div>
            </div>
          </ScrollArea>
        </aside>
      </div>

      {/* Diagnosis Modal */}
      <Dialog open={showDiagnosisModal} onOpenChange={setShowDiagnosisModal}>
        <DialogContent className="glass border-white/10 sm:max-w-[500px] p-0 overflow-hidden shadow-2xl">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-center relative">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.18),transparent_55%)] opacity-20 mix-blend-overlay" />
            <div className="relative z-10 text-white">
              <h2 className="text-2xl font-bold mb-2">Final Diagnosis</h2>
              <p className="opacity-80 text-sm">Review your findings and provide a diagnosis.</p>
            </div>
          </div>
          <div className="p-8 space-y-6">
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Consultation Outcome</label>
              <textarea 
                value={diagnosisInput}
                onChange={(e) => setDiagnosisInput(e.target.value)}
                placeholder="What is your diagnosis and management plan?"
                className="w-full min-h-[120px] bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setShowDiagnosisModal(false)} className="flex-1 h-12 border-white/10 text-white hover:bg-white/5">
                Keep Investigating
              </Button>
              <Button 
                onClick={handleSubmitDiagnosis}
                className="flex-1 h-12 gradient-bg text-white border-none font-bold shadow-xl shadow-blue-500/20"
                disabled={!diagnosisInput.trim()}
              >
                Submit & Evaluate
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
