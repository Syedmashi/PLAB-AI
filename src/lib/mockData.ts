import { Case, UserStats } from '../types';

export const MOCK_STATS: UserStats = {
  sessionsCompleted: 42,
  accuracy: 88,
  streak: 7,
  totalTime: '12h 30m'
};

export const MOCK_CASES: Case[] = [
  {
    id: '1',
    title: 'Chest Pain in 45yo Male',
    patientName: 'John Doe',
    patientAge: 45,
    patientGender: 'Male',
    complaint: 'Crushing chest pain for 2 hours',
    difficulty: 'Medium',
    category: 'Cardiology',
    status: 'Completed',
    accuracy: 92,
    diagnosis: 'Acute Myocardial Infarction',
    background: 'You have a crushing chest pain that started after dinner. It radiates to your left arm and jaw. You feel sweaty and nauseous. You have a history of hypertension and you are a heavy smoker. You are scared.'
  },
  {
    id: '2',
    title: 'Shortness of Breath',
    patientName: 'Sarah Smith',
    patientAge: 62,
    patientGender: 'Female',
    complaint: 'Difficulty breathing, worse at night',
    difficulty: 'Hard',
    category: 'Respiratory',
    status: 'In Progress',
    diagnosis: 'Congestive Heart Failure',
    background: 'You have been feeling increasingly short of breath over the last week. It is worse when you lie down (orthopnea) and you have to use three pillows to sleep. You have noticed swelling in your ankles. You have a history of a previous heart attack.'
  },
  {
    id: '3',
    title: 'Abdominal Pain',
    patientName: 'Michael Brown',
    patientAge: 28,
    patientGender: 'Male',
    complaint: 'Sharp pain in right lower quadrant',
    difficulty: 'Easy',
    category: 'Gastroenterology',
    status: 'Not Started',
    diagnosis: 'Acute Appendicitis',
    background: 'You have sharp pain in your right lower abdomen that started as a dull ache around your belly button. You have lost your appetite and feel slightly feverish. The pain is worse when you move or cough.'
  },
  {
    id: '4',
    title: 'Anxiety and Low Mood',
    patientName: 'Emma Wilson',
    patientAge: 34,
    patientGender: 'Female',
    complaint: 'Feeling "on edge" and low for 6 months',
    difficulty: 'Medium',
    category: 'Psychology',
    status: 'Not Started',
    diagnosis: 'Generalized Anxiety Disorder with Depression',
    background: 'You have been feeling constantly worried and restless for about six months. You have trouble sleeping and often wake up feeling unrefreshed. You have lost interest in your hobbies and feel sad most of the time. You are struggling to concentrate at your job and feel like you might get fired.'
  }
];
