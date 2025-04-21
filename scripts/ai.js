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
 * Fetch the resume data from builder.html input fields and construct the resume content.
 * @returns {object} - An object containing resume data.
 */
function getResumeData() {
  return {
    fullName: document.getElementById('fullName').value,
    summary: document.getElementById('summary').value,
    skills: document.getElementById('skills').value,
    experience: document.getElementById('experience').value,
    education: document.getElementById('education').value,
    certifications: document.getElementById('certifications').value,
    contactEmail: document.getElementById('contactEmail').value,
    contactPhone: document.getElementById('contactPhone').value,
    contactLinkedIn: document.getElementById('contactLinkedIn').value,
  };
}

/**
 * Constructs a prompt for the AI chatbot using the resume data.
 * @returns {string} - The constructed prompt.
 */
function constructResumePrompt() {
  const resumeData = getResumeData();
  return `
    I am creating a resume for the position of a software developer. Here is the information:

    Full Name: ${resumeData.fullName}
    Professional Summary: ${resumeData.summary}
    Skills: ${resumeData.skills}
    Experience: ${resumeData.experience}
    Education: ${resumeData.education}
    Certifications: ${resumeData.certifications}
    Contact Info: Email - ${resumeData.contactEmail}, Phone - ${resumeData.contactPhone}, LinkedIn - ${resumeData.contactLinkedIn}

    Can you help me optimize this for a software developer position at a leading tech company?
  `;
}

export { sendToGemini, constructResumePrompt };
