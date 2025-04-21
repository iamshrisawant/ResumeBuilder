import { loadTemplate } from './templates.js';
import { refineSection, refineAll, getAIResponse } from './ai.js';

document.addEventListener('DOMContentLoaded', () => {
  const fields = [
    'fullName', 'summary', 'skills', 'experience', 'education',
    'certifications',
    'contactEmail', 'contactPhone', 'contactLinkedIn'
  ];
  const templateSelector = document.getElementById('templateSelector');

  fields.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', renderResume);
  });

  if (templateSelector) {
    templateSelector.addEventListener('change', renderResume);
  }

  const refineSummaryBtn = document.getElementById('refineSummaryBtn');
  const refineAllBtn = document.getElementById('refineAllBtn');

  // Refine Summary Button Event
  if (refineSummaryBtn) {
    refineSummaryBtn.addEventListener('click', async () => {
      const summary = document.getElementById('summary').value;
      const role = document.getElementById('preferences')?.value || 'Software Engineer';
      const company = document.getElementById('targetCompany')?.value || 'Any Company';

      refineSummaryBtn.innerText = 'Refining... ✨';
      refineSummaryBtn.disabled = true;

      const refined = await refineSection(summary, role, company);
      document.getElementById('summary').value = refined;

      refineSummaryBtn.innerText = 'Refine Summary ✨';
      refineSummaryBtn.disabled = false;
      renderResume();
    });
  }

  // Refine All Button Event
  if (refineAllBtn) {
    refineAllBtn.addEventListener('click', async () => {
      const resumeText = `
Name: ${document.getElementById('fullName').value}
Summary: ${document.getElementById('summary').value}
Skills: ${document.getElementById('skills').value}
Experience: ${document.getElementById('experience').value}
Education: ${document.getElementById('education').value}
Certifications: ${document.getElementById('certifications')?.value || ''}
Email: ${document.getElementById('contactEmail').value}
Phone: ${document.getElementById('contactPhone').value}
LinkedIn: ${document.getElementById('contactLinkedIn').value}
      `.trim();

      const role = document.getElementById('preferences')?.value || 'Software Engineer';
      const company = document.getElementById('targetCompany')?.value || 'Any Company';

      refineAllBtn.innerText = 'Refining... 🚀';
      refineAllBtn.disabled = true;

      const refinedText = await refineAll(resumeText, role, company);
      const refined = parseRefinedText(refinedText);

      document.getElementById('summary').value = refined.summary;
      document.getElementById('skills').value = refined.skills;
      document.getElementById('experience').value = refined.experience;
      document.getElementById('education').value = refined.education;
      document.getElementById('certifications').value = refined.certifications;
      document.getElementById('contactEmail').value = refined.contactEmail;
      document.getElementById('contactPhone').value = refined.contactPhone;
      document.getElementById('contactLinkedIn').value = refined.contactLinkedIn;

      refineAllBtn.innerText = 'Refine All 🚀';
      refineAllBtn.disabled = false;
      renderResume();
    });
  }

  // Get AI response for extra help (optional)
  const chatInput = document.querySelector('.chatbot-input input');
  const sendBtn = document.querySelector('.send-btn');
  
  if (sendBtn && chatInput) {
    sendBtn.addEventListener('click', async () => {
      const userPrompt = chatInput.value;
      if (userPrompt.trim()) {
        sendBtn.innerText = 'Thinking...';
        sendBtn.disabled = true;
        
        const response = await getAIResponse(userPrompt);
        document.querySelector('.chatbot-content').innerHTML += `<div class="chat-response">${response}</div>`;
        chatInput.value = '';  // Clear input after response
        
        sendBtn.innerText = '➤';
        sendBtn.disabled = false;
      }
    });
  }

  renderResume(); // Initial render
});

// 🔍 Parse labeled refined response
function parseRefinedText(refinedText) {
  const sections = {
    summary: '',
    skills: '',
    experience: '',
    education: '',
    certifications: '',
    contactEmail: '',
    contactPhone: '',
    contactLinkedIn: ''
  };

  const sectionRegex = /^(Summary|Skills|Experience|Education|Certifications|Email|Phone|LinkedIn):([\s\S]*?)(?=^\w+:|\s*$)/gm;

  let match;
  while ((match = sectionRegex.exec(refinedText)) !== null) {
    const key = match[1].toLowerCase();
    const value = match[2].trim();

    switch (key) {
      case 'email':
      case 'phone':
      case 'linkedin':
        sections[`contact${key.charAt(0).toUpperCase() + key.slice(1)}`] = value;
        break;
      case 'skills':
        sections.skills = value.split(',').map(s => s.trim()).filter(Boolean).join(', ');
        break;
      case 'certifications':
        sections.certifications = value.split('\n').map(c => c.trim()).join('\n');
        break;
      default:
        sections[key] = value;
    }
  }

  return sections;
}

function renderResume() {
  const data = {
    name:           document.getElementById('fullName')?.value.trim() || '',
    summary:        document.getElementById('summary')?.value.trim() || '',
    skills:         (document.getElementById('skills')?.value || '')
                      .split(',').map(s => s.trim()).filter(Boolean),
    experience:     document.getElementById('experience')?.value.trim() || '',
    education:      document.getElementById('education')?.value.trim() || '',
    certifications: (document.getElementById('certifications')?.value || '')
                      .split('\n').map(c => c.trim()).filter(Boolean),
    contact: {
      email:    document.getElementById('contactEmail')?.value.trim() || '',
      phone:    document.getElementById('contactPhone')?.value.trim() || '',
      linkedin: document.getElementById('contactLinkedIn')?.value.trim() || ''
    }
  };

  const tmpl = document.getElementById('templateSelector')?.value || 'template1';
  loadTemplate(tmpl, data);
}
