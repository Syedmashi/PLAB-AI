export interface Case {
  id: string;
  title: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  complaint: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  status: 'Not Started' | 'In Progress' | 'Completed';
  accuracy?: number;
  diagnosis: string;
  background: string;
  patientAffect?: string;
  keyQuestions?: string[];
  redFlags?: string[];
  expectedActions?: string[];
}

export interface Message {
  id: string;
  role: 'doctor' | 'patient';
  content: string;
  timestamp: Date;
}

export interface UserStats {
  sessionsCompleted: number;
  accuracy: number;
  streak: number;
  totalTime: string;
}
