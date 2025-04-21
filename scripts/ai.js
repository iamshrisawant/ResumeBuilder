const GEMINI_API_KEY = 'AIzaSyDPW0mBKJlSbgntNJN0G_4NiwoBl0MO9LE';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

/**
 * Internal function to call Gemini API.
 * @param {string} prompt - The prompt to send.
 * @returns {Promise<string>} - Gemini's response.
 */
async function sendToGemini(prompt) {
  try {
    const res = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await res.json();
    const response = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || 'Sorry, no useful response received.';
    return response;
  } catch (err) {
    console.error('Gemini API Error:', err);
    return 'Something went wrong. Please try again.';
  }
}

/**
 * Refines the summary for a specific job and company.
 * @param {string} summaryText - Raw resume summary.
 * @param {string} role - Target job title.
 * @param {string} company - Target company name.
 * @returns {Promise<string>}
 */
async function refineSummary(summaryText, role, company) {
  const prompt = `
Please refine the following resume summary for a "${role}" position at "${company}". The content should be professional, concise, and tailored to the job. Focus on ATS compatibility, impactful language, and brevity. Only provide the refined summary text without any extra advice, explanations, or special formatting.

Summary:
${summaryText}
  `.trim();

  const refinedResponse = await sendToGemini(prompt);

  const cleanedResponse = refinedResponse
    .replace(/[\*\*\*\s*]-*[^A-Za-z0-9, ]*/g, '')
    .replace(/(?:\n|\r|\s\s+)/g, '')
    .trim();

  return cleanedResponse;
}

/**
 * Generic AI response used by chatbot.
 * @param {string} message - User's chatbot prompt.
 * @returns {Promise<string>}
 */
async function getAIResponse(message) {
  return await sendToGemini(message);
}

export { refineSummary, getAIResponse };
