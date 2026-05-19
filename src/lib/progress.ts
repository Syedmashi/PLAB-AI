import { Case, UserStats } from '../types';

const STORAGE_KEY = 'plab-ai-progress-v1';

export type SessionRecord = {
  id: string;
  caseId: string;
  caseTitle: string;
  completedAt: string;
  durationMs: number;
  diagnosisInput: string;
  evaluation: {
    isCorrect?: boolean;
    accuracy?: number;
    communication?: number;
    safety?: number;
    criticalMistake?: string | null;
  };
};

type ProgressState = {
  sessions: SessionRecord[];
};

const EMPTY_PROGRESS: ProgressState = { sessions: [] };

function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function getProgress(): ProgressState {
  if (!canUseStorage()) return EMPTY_PROGRESS;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_PROGRESS;
    const parsed = JSON.parse(raw) as ProgressState;
    return { sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [] };
  } catch {
    return EMPTY_PROGRESS;
  }
}

function saveProgress(progress: ProgressState) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function recordSession(record: Omit<SessionRecord, 'id' | 'completedAt'>) {
  const progress = getProgress();
  const nextRecord: SessionRecord = {
    ...record,
    id: `${record.caseId}-${Date.now()}`,
    completedAt: new Date().toISOString(),
  };

  saveProgress({ sessions: [nextRecord, ...progress.sessions].slice(0, 100) });
  return nextRecord;
}

function formatDuration(totalMs: number) {
  const totalMinutes = Math.max(0, Math.round(totalMs / 60000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
}

function calculateStreak(sessions: SessionRecord[]) {
  const days = new Set(
    sessions.map((session) => new Date(session.completedAt).toISOString().slice(0, 10)),
  );

  let streak = 0;
  const cursor = new Date();

  while (days.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

export function getUserStats(): UserStats {
  const { sessions } = getProgress();
  const sessionsWithAccuracy = sessions.filter((session) => typeof session.evaluation.accuracy === 'number');
  const averageAccuracy = sessionsWithAccuracy.length
    ? Math.round(
        sessionsWithAccuracy.reduce((sum, session) => sum + (session.evaluation.accuracy || 0), 0) /
          sessionsWithAccuracy.length,
      )
    : 0;

  return {
    sessionsCompleted: sessions.length,
    accuracy: averageAccuracy,
    streak: calculateStreak(sessions),
    totalTime: formatDuration(sessions.reduce((sum, session) => sum + session.durationMs, 0)),
  };
}

export function getCasesWithProgress(cases: Case[]): Case[] {
  const { sessions } = getProgress();

  return cases.map((caseItem) => {
    const latest = sessions.find((session) => session.caseId === caseItem.id);
    if (!latest) return caseItem;

    return {
      ...caseItem,
      status: 'Completed',
      accuracy: latest.evaluation.accuracy,
    };
  });
}

export function getRecentSessions(limit = 5) {
  return getProgress().sessions.slice(0, limit);
}

function averageMetric(sessions: SessionRecord[], metric: 'accuracy' | 'communication' | 'safety') {
  const scored = sessions.filter((session) => typeof session.evaluation[metric] === 'number');
  if (!scored.length) return 0;
  return Math.round(scored.reduce((sum, session) => sum + (session.evaluation[metric] || 0), 0) / scored.length);
}

export function getPerformanceSummary() {
  const { sessions } = getProgress();
  return {
    accuracy: averageMetric(sessions, 'accuracy'),
    communication: averageMetric(sessions, 'communication'),
    safety: averageMetric(sessions, 'safety'),
  };
}
