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

    // Strip unwanted special characters using regex, while keeping necessary punctuation
    const cleanedResponse = response.replace(/[^\w\s.,;!?&'()-]/g, '');

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
Please rewrite the following resume section to be more professional and suitable for a "${role}" position at "${company}". The refined content should be clear, concise, and tailored for the job role without any extra symbols or unrelated text. Focus on ATS compatibility and impactful language.

Section:
${sectionText}
  `.trim();

  const refinedContent = await sendToGemini(prompt);
  return refinedContent; // Return just the refined content, no extra symbols
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
Please refine the following resume for the position of "${role}" at "${company}". 
Focus on making it professional, concise, and tailored for the role. Avoid any unnecessary symbols or extra information. Ensure the language is impactful and ATS-friendly.

Resume:
${resumeText}
  `.trim();

  const refinedContent = await sendToGemini(prompt);
  return refinedContent; // Return just the refined content, no extra symbols
}

export { getAIResponse, refineSection, refineAll };
