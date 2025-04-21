const GEMINI_API_KEY = 'AIzaSyDPW0mBKJlSbgntNJN0G_4NiwoBl0MO9LE'; // Replace with your actual key
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
 * Refines the summary for a specific job and company. Strips additional commentary and special symbols to return only the core summary content.
 * @param {string} summaryText - Raw resume summary.
 * @param {string} role - Target job title.
 * @param {string} company - Target company name.
 * @returns {Promise<string>}
 */
async function refineSummary(summaryText, role, company) {
  const prompt = `
You are a resume optimization engine.

Refine the following resume summary for a "${role}" position at "${company}". Your output must be concise, formal, and directly usable in a resume. Do not include any preamble, bullet points, formatting, or advice. Only return the rewritten professional summary text.

Input Summary:
${summaryText}
`.trim();

  // Send prompt to Gemini and return its refined response
  const refinedResponse = await sendToGemini(prompt);

  // Cleanup the response: remove any special symbols or commentary
  const cleanedResponse = refinedResponse
    .replace(/[\*\*\*\s*]-*[^A-Za-z0-9, ]*/g, '')  // Strip special symbols, markdown, etc.
    .replace(/(?:\n|\r|\s\s+)/g, ' ') // Remove excessive whitespace and new lines
    .trim(); // Trim leading/trailing spaces

  return cleanedResponse; // Return only the cleaned summary
}

export { refineSummary };
