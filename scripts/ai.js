const GEMINI_API_KEY = 'AIzaSyDPW0mBKJlSbgntNJN0G_4NiwoBl0MO9LE';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

/**
 * Calls Gemini API and returns clean text.
 * @param {string} prompt
 * @returns {Promise<string>}
 */
async function sendToGemini(prompt) {
  try {
    const res = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });

    const data = await res.json();
    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return cleanAIResponse(raw);
  } catch (err) {
    console.error('Gemini API Error:', err);
    return 'Sorry, something went wrong.';
  }
}

/**
 * Cleans markdown and special characters often returned by AI.
 * @param {string} text
 * @returns {string}
 */
function cleanAIResponse(text) {
  return text
    .replace(/[\*\_\#\-\>]/g, '') // Remove markdown and bullets
    .replace(/\n+/g, ' ')             // Remove excessive newlines
    .trim();
}

/**
 * Refines a resume summary for a specific company/role.
 * @param {string} summaryText
 * @param {string} role
 * @param {string} company
 * @returns {Promise<string>}
 */
async function refineSummary(summaryText, role, company) {
  const prompt = `
You are a resume assistant. Improve the following resume summary for a job application targeting the role of "${role}" at "${company}".
Focus on clarity, conciseness, and professional impact. Ensure it's well-structured and suitable to be inserted directly into a resume without additional formatting or symbols.

Here is the original summary:
"""
${summaryText}
"""

Return only the improved summary text.
  `.trim();

  return await sendToGemini(prompt);
}

/**
 * Handles general chatbot queries.
 * @param {string} message
 * @returns {Promise<string>}
 */
async function getAIResponse(message) {
  const prompt = `You are a helpful and knowledgeable resume assistant. Answer the following question clearly and concisely:

${message}`;
  return await sendToGemini(prompt);
}

export { refineSummary, getAIResponse };