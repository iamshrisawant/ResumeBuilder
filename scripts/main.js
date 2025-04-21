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

  renderResume(); // Initial resume render
});

function renderResume() {
  const data = {
    name: document.getElementById('fullName')?.value.trim() || '',
    summary: document.getElementById('summary')?.value.trim() || '',
    skills: (document.getElementById('skills')?.value || '')
      .split(',').map(s => s.trim()).filter(Boolean),
    experience: document.getElementById('experience')?.value.trim() || '',
    education: document.getElementById('education')?.value.trim() || '',
    certifications: (document.getElementById('certifications')?.value || '')
      .split('\n').map(c => c.trim()).filter(Boolean),
    contact: {
      email: document.getElementById('contactEmail')?.value.trim() || '',
      phone: document.getElementById('contactPhone')?.value.trim() || '',
      linkedin: document.getElementById('contactLinkedIn')?.value.trim() || ''
    }
  };

  const tmpl = document.getElementById('templateSelector')?.value || 'template1';
  loadTemplate(tmpl, data);
}
