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
    // Get the text and strip it down to just content without extra symbols
    const response = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || 'Sorry, no useful response received.';

    // Strip unwanted special characters using regex
    const cleanedResponse = response.replace(/[^a-zA-Z0-9\s.,;!?()&'-]/g, '');

    return cleanedResponse;
  } catch (err) {
    console.error('Gemini API Error:', err);
    return 'Something went wrong. Please try again.';
  }
}

/**
 * Ask Gemini any question or prompt.
 * @param {string} userPrompt - Natural language input from user.
 * @returns {Promise<string>}
 */
async function getAIResponse(userPrompt) {
  const prompt = `You are a helpful AI assistant for resume building and career advice. Respond clearly and concisely to the following user input:\n\n"${userPrompt}"`;
  return await sendToGemini(prompt);
}

/**
 * Refines a specific resume section for a job and company.
 * @param {string} sectionText - Raw resume section.
 * @param {string} role - Target job title.
 * @param {string} company - Target company name.
 * @returns {Promise<string>}
 */
async function refineSection(sectionText, role, company) {
  const prompt = `
You are an expert resume writer. Please rewrite the following resume section to better suit a job application for the role of "${role}" at "${company}". 
Keep it professional, ATS-friendly, and results-oriented.

Section:
${sectionText}
  `.trim();

  const refinedContent = await sendToGemini(prompt);
  return refinedContent; // Return just the refined content
}

/**
 * Refines the full resume content.
 * @param {string} resumeText - Entire resume as a string.
 * @param {string} role - Target role.
 * @param {string} company - Target company.
 * @returns {Promise<string>}
 */
async function refineAll(resumeText, role, company) {
  const prompt = `
You are a career assistant AI specializing in resume writing. Improve and refine the following resume for a job as "${role}" at "${company}". 

Focus on:
- Clarity and conciseness
- Tailoring for the role
- Impactful language
- ATS compatibility

Resume:
${resumeText}
  `.trim();

  const refinedContent = await sendToGemini(prompt);
  return refinedContent; // Return just the refined content
}

export { getAIResponse, refineSection, refineAll };
