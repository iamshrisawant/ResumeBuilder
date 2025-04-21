import { loadTemplate } from './templates.js';
import { refineSummary } from './ai.js';

import './chatbot.js';
document.addEventListener('DOMContentLoaded', () => {
  const fields = [
    'fullName', 'summary', 'skills', 'experience', 'education',
    'certifications', 'contactEmail', 'contactPhone', 'contactLinkedIn'
  ];
  const templateSelector = document.getElementById('templateSelector');

  // Resume input listeners
  fields.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', renderResume);
  });

  if (templateSelector) {
    templateSelector.addEventListener('change', renderResume);
  }

  const refineSummaryBtn = document.getElementById('refineSummaryBtn');

  if (refineSummaryBtn) {
    refineSummaryBtn.addEventListener('click', async () => {
      const summary = document.getElementById('summary').value;
      const role = document.getElementById('preferences')?.value || 'Software Engineer';
      const company = document.getElementById('targetCompany')?.value || 'Any Company';

      refineSummaryBtn.innerText = 'Refining... ✨';
      refineSummaryBtn.disabled = true;

      const refined = await refineSummary(summary, role, company);
      document.getElementById('summary').value = refined;

      refineSummaryBtn.innerText = 'Refine Summary ✨';
      refineSummaryBtn.disabled = false;
      renderResume();
    });
  }

  // Chatbot: Toggle open/close/refresh
  const chatbotBtn = document.querySelector('.chatbot-btn');
  const chatOverlay = document.querySelector('.chat-overlay');
  const closeBtn = document.querySelector('.close-btn');
  const refreshBtn = document.querySelector('.refresh-btn');
  const chatContent = document.querySelector('.chatbot-content');
  const chatInput = document.querySelector('.chatbot-input input');

  chatbotBtn?.addEventListener('click', () => {
    chatOverlay?.classList.add('active');
  });

  closeBtn?.addEventListener('click', () => {
    chatOverlay?.classList.remove('active');
  });

  refreshBtn?.addEventListener('click', () => {
    if (chatContent) chatContent.innerHTML = '';
    if (chatInput) chatInput.value = '';
  });

  renderResume(); // Initial resume render
});

// Render resume preview
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
