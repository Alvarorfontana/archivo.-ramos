type GeminiResult = { text: string; model: string };
export async function askGemini(prompt: string): Promise<GeminiResult> {
 const key = process.env.GEMINI_API_KEY;
 if (!key) throw new Error('GEMINI_API_KEY no está configurada en Vercel.');
 const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
 const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(key)}`, {
  method: 'POST', headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: prompt }] }], generationConfig: { temperature: 0.2, responseMimeType: 'application/json' } }, cache: 'no-store'
 });
 const payload = await response.json().catch(() => ({}));
 if (!response.ok) throw new Error(payload?.error?.message || `Gemini respondió HTTP ${response.status}`);
 const text = payload?.candidates?.[0]?.content?.parts?.map((p: {text?:string}) => p.text || '').join('') || '';
 if (!text) throw new Error('Gemini no devolvió contenido utilizable.');
 return { text, model };
}
