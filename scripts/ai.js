const GEMINI_API_KEY = "AIzaSyDPW0mBKJlSbgntNJN0G_4NiwoBl0MO9LE"; // ⚠️ Test key only

/** Helper: call Gemini and return the raw text */
async function fetchGeminiOutput(prompt) {
  const res = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" 
      + GEMINI_API_KEY,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    }
  );
  const json = await res.json();
  return json.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
}

/** Refine a single section into structured JSON and re‑inject */
async function refineSection(sectionId) {
  const raw = document.getElementById(sectionId).value;
  const context = {
    jobRole:       document.getElementById('jobRole').value,
    targetCompany: document.getElementById('targetCompany').value,
    preferences:   document.getElementById('preferences').value
  };

  // Build prompt and expected JSON schema per section
  let prompt = `You are a resume expert. Parse and refine the "${sectionId}" section below. `
             + `Return ONLY a JSON object with key "${sectionId}".\n\n`
             + `Context:\n`
             + `- Job Role: ${context.jobRole}\n`
             + `- Company: ${context.targetCompany}\n`
             + `- Preferences: ${context.preferences}\n\n`
             + `Input:\n${raw}\n\n`
             + `Schema examples:\n`;
  switch (sectionId) {
    case 'summary':
      prompt += `{"summary":"A concise 2-3 sentence summary."}`;
      break;
    case 'skills':
      prompt += `{"skills":["Skill A","Skill B","Skill C"]}`;
      break;
    case 'experience':
      prompt += `{"experience":[{"role":"…","company":"…","dates":"…","bullets":["…","…"]}]}`;
      break;
    case 'education':
      prompt += `{"education":[{"degree":"…","institution":"…","dates":"…","notes":"…"}]}`;
      break;
    default:
      alert("Unknown section: " + sectionId);
      return;
  }

  try {
    const rawJson = await fetchGeminiOutput(prompt);
    const obj = JSON.parse(rawJson);

    // Apply back into the form
    if (sectionId === 'summary') {
      document.getElementById('summary').value = obj.summary || raw;
    } else if (sectionId === 'skills') {
      document.getElementById('skills').value = (obj.skills||[]).join(', ');
    } else if (sectionId === 'experience') {
      document.getElementById('experience').value = (obj.experience||[])
        .map(e => `${e.role} — ${e.company} (${e.dates})\n• ${e.bullets.join("\n• ")}`)
        .join("\n\n");
    } else if (sectionId === 'education') {
      document.getElementById('education').value = (obj.education||[])
        .map(e => `${e.degree}, ${e.institution} (${e.dates})\n${e.notes||""}`)
        .join("\n\n");
    }

    renderResume();
  } catch (e) {
    console.error(e);
    alert("Failed to refine section. Ensure AI returned valid JSON.");
  }
}

/** Refine everything at once into structured JSON */
async function refineAll() {
  const raw = {
    summary:    document.getElementById('summary').value,
    skills:     document.getElementById('skills').value,
    experience: document.getElementById('experience').value,
    education:  document.getElementById('education').value
  };
  const context = {
    jobRole:       document.getElementById('jobRole').value,
    targetCompany: document.getElementById('targetCompany').value,
    preferences:   document.getElementById('preferences').value
  };

  const prompt = `
You are an expert resume parser and coach. Given these unstructured inputs, return valid JSON with:
  • "summary":  a polished 2–3 sentence summary.
  • "skills":   array of distinct skills.
  • "experience": [
        { "role":"…","company":"…","dates":"…","bullets":[…] }
     ]
  • "education": [
        { "degree":"…","institution":"…","dates":"…","notes":"…" }
     ]

Context:
- Job Role: ${context.jobRole}
- Company:  ${context.targetCompany}
- Prefs:    ${context.preferences}

Inputs:
SUMMARY:
${raw.summary}

SKILLS:
${raw.skills}

EXPERIENCE:
${raw.experience}

EDUCATION:
${raw.education}

**Return ONLY the JSON object.**`;

  try {
    const rawJson = await fetchGeminiOutput(prompt);
    const data = JSON.parse(rawJson);

    // Inject back
    document.getElementById('summary').value = data.summary || raw.summary;
    document.getElementById('skills').value  = (data.skills||[]).join(', ');
    document.getElementById('experience').value = (data.experience||[])
      .map(e => `${e.role} — ${e.company} (${e.dates})\n• ${e.bullets.join("\n• ")}`)
      .join("\n\n");
    document.getElementById('education').value = (data.education||[])
      .map(e => `${e.degree}, ${e.institution} (${e.dates})\n${e.notes||""}`)
      .join("\n\n");

    renderResume();
  } catch (e) {
    console.error(e);
    alert("Failed to refine all sections. Ensure AI returned valid JSON.");
  }
}
// Extract resume data from localStorage or global state if stored
const resumeData = {
  name: localStorage.getItem('name'),
  jobRole: localStorage.getItem('jobRole'),
  skills: JSON.parse(localStorage.getItem('skills') || '[]'),
  experience: localStorage.getItem('experience'),
  education: localStorage.getItem('education'),
};

/** Full-featured chatbot response */
async function getAIResponse(userInput) {
  const resumeContext = `
Name: ${resumeData.name || "N/A"}
Job Role: ${resumeData.jobRole || "N/A"}
Skills: ${resumeData.skills?.join(", ") || "N/A"}
Experience: ${resumeData.experience || "N/A"}
Education: ${resumeData.education || "N/A"}
`;

  const prompt = `
You are a helpful career assistant. A user is building their resume and may need advice.

Context:
${resumeContext}

User: "${userInput}"
Provide a brief, helpful response (2–4 sentences), offering:
- Resume suggestions if the user mentions CV/resume.
- Upskilling paths if they mention skills or growth.
- General help otherwise.

Your response:
`;

  return await fetchGeminiOutput(prompt);
}

