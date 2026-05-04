import * as React from 'react';
import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { ScrollArea } from '../components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Separator } from '../components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/dialog';
import { Progress } from '../components/ui/progress';
import { 
  Stethoscope, Send, User, ArrowLeft, Info, CheckCircle2, 
  XCircle, AlertCircle, Clock, Zap, TrendingUp, Mic, MicOff, Volume2, 
  VolumeX, RefreshCw 
} from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Message, Case } from '../types';
import { MOCK_CASES } from '../lib/mockData';
import { GoogleGenAI } from "@google/genai";

export default function Simulation() {
  // Initialize Gemini lazily to avoid top-level crash if API key is missing
  const ai = useMemo(() => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_gemini_api_key_here') return null;
    try {
      return new GoogleGenAI({ apiKey });
    } catch {
      return null;
    }
  }, []);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const caseId = searchParams.get('caseId');
  const currentCase = MOCK_CASES.find(c => c.id === caseId) || MOCK_CASES[0];

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
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  const chatRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);

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

  // Initialize Chat Session
  useEffect(() => {
    if (!ai) return;

    const systemPrompt = `You are roleplaying a patient for a PLAB medical exam simulation. 
    Patient Name: ${currentCase.patientName}
    Age: ${currentCase.patientAge}
    Gender: ${currentCase.patientGender}
    Background: ${currentCase.background}
    Diagnosis (SECRET - DO NOT REVEAL): ${currentCase.diagnosis}

    Rules:
    1. Stay in character. Respond briefly and realistically like a worried patient.
    2. Use simple language, not medical jargon.
    3. Use natural conversational patterns: use ellipses for pauses, occasional fillers like "um" or "well", and express emotion (worry, pain, relief).
    4. Do NOT reveal your diagnosis. Let the doctor investigate.
    5. If asked about symptoms not in your background, improvise realistically based on the diagnosis: ${currentCase.diagnosis}.
    6. Do not talk about being an AI.
    7. Initiate the conversation by saying something like "Hey doctor! [complaint]" when you first start.`;

    chatRef.current = ai.chats.create({
      model: "gemini-flash-latest",
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      }
    });

    // Start proactive greeting
    const startGreeting = async () => {
      setIsTyping(true);
      try {
        const result = await chatRef.current.sendMessageStream({ message: "Start the simulation. Greet the doctor with 'Hey doctor!' and explain your main worry briefly." });
        
        const greetingId = 'greeting-initial';
        const initialGreeting: Message = {
          id: greetingId,
          role: 'patient',
          content: '',
          timestamp: new Date()
        };
        setMessages([initialGreeting]);

        let fullText = '';
        for await (const chunk of result) {
          const chunkText = chunk.text || "";
          fullText += chunkText;
          setMessages(prev => prev.map(m => 
            m.id === greetingId ? { ...m, content: fullText } : m
          ));
        }

        speak(fullText);
        setSessionStarted(true);
      } catch (err) {
        console.error("Greeting error:", err);
      } finally {
        setIsTyping(false);
      }
    };

    startGreeting();
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

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || !chatRef.current) return;

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
      const result = await chatRef.current.sendMessageStream({ message: content });
      let fullText = '';
      
      for await (const chunk of result) {
        const chunkText = chunk.text || "";
        fullText += chunkText;
        
        setMessages(prev => prev.map(m => 
          m.id === patientMsgId ? { ...m, content: fullText } : m
        ));
      }
      
      speak(fullText);
    } catch (error) {
      console.error("AI Error:", error);
      // Remove the empty message if there's an error
      setMessages(prev => prev.filter(m => m.id !== patientMsgId));
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
      const chatHistory = messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n');
      const evaluationPrompt = `As a Senior Medical Evaluator for the PLAB exam, assess this consultation.
      
      Scenario: ${currentCase.title}
      Actual Diagnosis: ${currentCase.diagnosis}
      Doctor's Diagnosis: ${diagnosisInput}
      
      Consultation Transcript:
      ${chatHistory}
      
      Task:
      1. Determine if the doctor's diagnosis is correct.
      2. Rate Accuracy, Communication, and Patient Safety (0-100%).
      3. Provide 3 specific strengths.
      4. Provide 3 specific areas for improvement, especially highlighting where the doctor might have missed a key sign or misinterpreted something.
      5. State clearly at what point they got it wrong if the diagnosis is incorrect.
      
      Return the evaluation in JSON format with these exact keys:
      {
        "isCorrect": boolean,
        "accuracy": number,
        "communication": number,
        "safety": number,
        "time": string,
        "strengths": string[],
        "improvements": string[],
        "criticalMistake": string | null
      }`;

      const response = await ai.models.generateContent({
        model: "gemini-flash-latest",
        contents: [{ role: 'user', parts: [{ text: evaluationPrompt }] }],
        config: {
          responseMimeType: "application/json",
        }
      });

      const result = JSON.parse(response.text || "{}");
      setEvaluation(result);
      setShowFeedback(true);
    } catch (error) {
      console.error("Evaluation Error:", error);
    } finally {
      setIsTyping(false);
    }
  };

  if (showFeedback && evaluation) {
    return (
      <div className="min-h-screen bg-[#020617] p-8 flex items-center justify-center overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-4xl w-full py-8"
        >
          <Card className="glass border-white/10 shadow-2xl overflow-hidden">
            <div className={`p-12 text-center relative ${evaluation.isCorrect ? 'bg-gradient-to-r from-emerald-600 to-teal-600' : 'bg-gradient-to-r from-rose-600 to-orange-600'}`}>
              <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
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
    <div className="h-screen bg-[#020617] flex flex-col overflow-hidden">
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
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none" />
        
        {/* Chat Area */}
        <div className="flex-1 flex flex-col relative z-10 min-w-0">
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
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl mx-auto mb-6 flex items-center justify-center border border-white/10 shadow-2xl relative overflow-hidden group">
              <img 
                src={`https://picsum.photos/seed/${currentCase.patientName}/200/200`} 
                alt="Patient" 
                className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
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
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
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
