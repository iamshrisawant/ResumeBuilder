import { loadTemplate } from './templates.js';
import { refineSummary } from './ai.js';

document.addEventListener('DOMContentLoaded', () => {
  const fields = [
    'fullName', 'summary', 'skills', 'experience',
    'education', 'certifications', 'contactEmail',
    'contactPhone', 'contactLinkedIn'
  ];

  fields.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', renderResume);
  });

  const templateSelector = document.getElementById('templateSelector');
  if (templateSelector) {
    templateSelector.addEventListener('change', renderResume);
  }

  const refineSummaryBtn = document.getElementById('refineSummaryBtn');
  if (refineSummaryBtn) {
    refineSummaryBtn.addEventListener('click', async () => {
      const summary = document.getElementById('summary')?.value || '';
      const role = document.getElementById('preferences')?.value || 'Software Engineer';
      const company = document.getElementById('targetCompany')?.value || 'Any Company';

      refineSummaryBtn.textContent = 'Refining...';
      refineSummaryBtn.disabled = true;

      const refined = await refineSummary(summary, role, company);
      document.getElementById('summary').value = refined;

      refineSummaryBtn.textContent = 'Refine Summary ✨';
      refineSummaryBtn.disabled = false;

      renderResume();
    });
  }

  renderResume(); // Initial render
});

function renderResume() {
  const data = {
    name: document.getElementById('fullName')?.value || '',
    summary: document.getElementById('summary')?.value || '',
    skills: document.getElementById('skills')?.value.split(',').map(s => s.trim()),
    experience: document.getElementById('experience')?.value || '',
    education: document.getElementById('education')?.value || '',
    certifications: document.getElementById('certifications')?.value.split('\n'),
    contact: {
      email: document.getElementById('contactEmail')?.value || '',
      phone: document.getElementById('contactPhone')?.value || '',
      linkedin: document.getElementById('contactLinkedIn')?.value || ''
    }
  };

  const templateName = document.getElementById('templateSelector')?.value || 'template1';
  loadTemplate(templateName, data);
}
