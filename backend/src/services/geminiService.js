import { GoogleGenAI } from '@google/genai';
import { getGeminiApiKey } from '../config/secretManager.js';
import { db } from '../config/firebase.js';

async function getClient() {
  const apiKey = await getGeminiApiKey();
  return new GoogleGenAI({ apiKey });
}

async function getUserCustomInstructions(uid) {
  try {
    const doc = await db.collection('users').doc(uid).collection('settings').doc('profile').get();
    if (!doc.exists) return '';
    
    const data = doc.data();
    const parts = [];
    if (data.careerGoal) parts.push(`Career Goal: ${data.careerGoal}`);
    if (data.experienceLevel) parts.push(`Experience Level: ${data.experienceLevel}`);
    if (data.explanationStyle) parts.push(`Preferred Style: ${data.explanationStyle}`);
    if (data.customInstructions) parts.push(`Custom Rules: ${data.customInstructions}`);
    
    return parts.length > 0 ? `\nUser Persona & Context:\n${parts.join('\n')}` : '';
  } catch (e) {
    console.error('Error fetching custom instructions:', e.message);
    return '';
  }
}

export async function generateChatResponse(uid, history, userPrompt) {
  const ai = await getClient();
  const customInstructions = await getUserCustomInstructions(uid);

  const systemInstruction = `You are AI Career & Project Copilot, an expert advisor for tech careers and software projects. Provide actionable, concise, and professional guidance.${customInstructions}`;

  const contents = [
    ...history.map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }]
    })),
    { role: 'user', parts: [{ text: userPrompt }] }
  ];

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents,
    config: { systemInstruction }
  });

  return response.text;
}

export async function generateStructuredPlan(uid, prompt, systemContext) {
  const ai = await getClient();
  const customInstructions = await getUserCustomInstructions(uid);
  
  const systemInstruction = `${systemContext}\nOutput strictly valid markdown with formatted headings, bullet points, and code snippets where appropriate.${customInstructions}`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    config: { systemInstruction }
  });

  return response.text;
}
