import { loadTemplate } from './templates.js';
import { refineSummary } from './ai.js';

document.addEventListener('DOMContentLoaded', () => {
  const fields = [
    'fullName', 'summary', 'skills', 'experience', 'education',
    'certifications', 'contactEmail', 'contactPhone', 'contactLinkedIn'
  ];
  const templateSelector = document.getElementById('templateSelector');

  // Add event listeners for fields to update resume on input
  fields.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', renderResume);
  });

  if (templateSelector) {
    templateSelector.addEventListener('change', renderResume);
  }

  const refineSummaryBtn = document.getElementById('refineSummaryBtn');
  
  // Refine Summary Button Event
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

  renderResume(); // Initial render of the resume preview
});

// Render the resume preview with the updated data
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
  loadTemplate(tmpl, data);  // Load the selected template and pass the resume data
}
