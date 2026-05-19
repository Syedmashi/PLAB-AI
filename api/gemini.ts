import { GoogleGenAI } from '@google/genai';

const MODEL = 'gemini-2.5-flash';
const MAX_MESSAGES = 40;
const MAX_MESSAGE_CHARS = 2000;
const MAX_DIAGNOSIS_CHARS = 2000;

type ChatMessage = {
  role: 'doctor' | 'patient';
  content: string;
};

function parseJsonResponse(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('AI response did not contain JSON.');
    return JSON.parse(match[0]);
  }
}

function sanitizeMessages(messages: ChatMessage[] = []) {
  return messages
    .filter((message) => message && (message.role === 'doctor' || message.role === 'patient'))
    .slice(-MAX_MESSAGES)
    .map((message) => ({
      role: message.role,
      content: String(message.content || '').slice(0, MAX_MESSAGE_CHARS),
    }));
}

function sanitizeInput(input?: string) {
  return String(input || '').slice(0, MAX_MESSAGE_CHARS);
}

function buildPatientPrompt(caseData: any, messages: ChatMessage[], input?: string) {
  const transcript = sanitizeMessages(messages)
    .slice(-16)
    .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
    .join('\n');

  return `You are roleplaying a patient in a PLAB 2 consultation station.

PATIENT CARD
Name: ${caseData.patientName}
Age: ${caseData.patientAge}
Gender: ${caseData.patientGender}
Opening complaint: ${caseData.complaint}
Background / hidden patient facts: ${caseData.background}
Secret diagnosis: ${caseData.diagnosis}
Patient affect: ${caseData.patientAffect || 'worried but cooperative'}

PLAB 2 BEHAVIOUR RULES
- Stay fully in character as the patient, not as an examiner or AI.
- Use simple patient language. Do not use medical jargon unless the doctor says it first.
- Do not reveal the diagnosis or management plan.
- Answer only what the doctor asked. Do not volunteer all hidden facts at once.
- If the doctor asks open questions, give realistic details from the case.
- If the doctor shows empathy, respond naturally.
- If asked about ICE, answer ideas, concerns, and expectations realistically.
- If symptoms suggest an emergency, sound worried and accept urgent advice only after the doctor explains clearly.
- Keep replies concise: normally 1-3 sentences.

CASE-SPECIFIC MARKING FOCUS
Key questions expected: ${(caseData.keyQuestions || []).join('; ')}
Red flags / safety points: ${(caseData.redFlags || []).join('; ')}
Expected actions/management: ${(caseData.expectedActions || []).join('; ')}

Conversation so far:
${transcript || '(No conversation yet)'}

Doctor's latest message:
${sanitizeInput(input) || 'Start the station. Greet the doctor briefly with your opening complaint.'}

Reply as the patient only.`;
}

function buildEvaluationPrompt(caseData: any, messages: ChatMessage[], diagnosisInput: string) {
  const transcript = sanitizeMessages(messages).map((m) => `${m.role.toUpperCase()}: ${m.content}`).join('\n');
  const safeDiagnosisInput = String(diagnosisInput || '').slice(0, MAX_DIAGNOSIS_CHARS);

  return `You are a strict but fair PLAB 2 examiner. Evaluate this consultation using PLAB-style domains: data gathering, interpersonal skills, clinical management, and patient safety.

SCENARIO
Title: ${caseData.title}
Actual diagnosis: ${caseData.diagnosis}
Candidate diagnosis/plan: ${safeDiagnosisInput}

EXPECTED CASE CONTENT
Key questions expected: ${(caseData.keyQuestions || []).join('; ')}
Red flags / safety points: ${(caseData.redFlags || []).join('; ')}
Expected actions/management: ${(caseData.expectedActions || []).join('; ')}

TRANSCRIPT
${transcript}

Return only valid JSON with these keys:
{
  "isCorrect": boolean,
  "accuracy": number,
  "communication": number,
  "safety": number,
  "time": string,
  "strengths": string[],
  "improvements": string[],
  "missedQuestions": string[],
  "missedSafetyPoints": string[],
  "criticalMistake": string | null
}

Scoring guidance:
- accuracy: diagnosis + relevant differentials + clinical reasoning.
- communication: structure, empathy, ICE, summarising, signposting, shared decision-making.
- safety: red flags, urgent escalation, safety netting, appropriate management.
- Be specific. Do not invent transcript events that did not happen.`;
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { mode, caseData, messages = [], input, diagnosisInput } = body || {};

    if (!caseData || typeof caseData !== 'object' || !mode) {
      return res.status(400).json({ error: 'Missing mode or caseData.' });
    }

    const ai = new GoogleGenAI({ apiKey });

    if (mode === 'evaluate') {
      const response = await ai.models.generateContent({
        model: MODEL,
        contents: buildEvaluationPrompt(caseData, sanitizeMessages(messages), diagnosisInput || ''),
        config: { responseMimeType: 'application/json', temperature: 0.2 },
      });

      const text = response.text || '{}';
      return res.status(200).json(parseJsonResponse(text));
    }

    if (mode === 'patient') {
      const response = await ai.models.generateContent({
        model: MODEL,
        contents: buildPatientPrompt(caseData, sanitizeMessages(messages), input),
        config: { temperature: 0.7 },
      });

      return res.status(200).json({ text: response.text || '' });
    }

    return res.status(400).json({ error: 'Unsupported mode.' });
  } catch (error: any) {
    console.error('Gemini API route error:', error);
    return res.status(500).json({ error: error?.message || 'AI request failed.' });
  }
}
