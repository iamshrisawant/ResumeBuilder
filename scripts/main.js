import { loadTemplate } from './templates.js';
import { refineSection, refineAll } from './ai.js';

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

      const refined = await refineAll(resumeText, role, company);

      document.getElementById('summary').value = refined;

      refineAllBtn.innerText = 'Refine All 🚀';
      refineAllBtn.disabled = false;
      renderResume();
    });
  }

  renderResume(); // Initial draw
});

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
