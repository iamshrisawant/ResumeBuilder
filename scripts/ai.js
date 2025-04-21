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
 * Refines a specific resume section for a job and company.
 * @param {string} sectionText - Raw resume section.
 * @param {string} role - Target job title.
 * @param {string} company - Target company name.
 * @returns {Promise<string>}
 */
async function refineSection(sectionText, role, company) {
  const prompt = `
Please refine the following resume section for a "${role}" position at "${company}". The content should be professional, concise, and tailored to the job. Focus on ATS compatibility and impactful language. Avoid unnecessary details and explanations.

Section:
${sectionText}
  `.trim();

  return await sendToGemini(prompt);
}

/**
 * Refines the full resume content and returns a labeled block for parsing.
 * @param {string} resumeText - Entire resume as a string.
 * @param {string} role - Target role.
 * @param {string} company - Target company.
 * @returns {Promise<string>} Labeled resume text
 */
async function refineAll(resumeText, role, company) {
  const prompt = `
Refine the following resume for the role of "${role}" at "${company}". Make it concise, impactful, ATS-optimized, and highly tailored to the position.

⚠️ Please format your response **exactly** using these labels:
Summary:
Skills:
Experience:
Education:
Certifications:
Email:
Phone:
LinkedIn:

Resume:
${resumeText}

Each section should start with its label on a new line followed by the content. Keep skills comma-separated. Keep other sections as plain text. Do not include explanations or commentary.
  `.trim();

  return await sendToGemini(prompt);
}

export { refineSection, refineAll };
