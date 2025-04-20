document.addEventListener('DOMContentLoaded', () => {
  const fields = ['fullName', 'summary', 'skills', 'experience', 'education'];
  const templateSelector = document.getElementById('templateSelector');

  fields.forEach(field => {
    document.getElementById(field).addEventListener('input', renderResume);
  });

  templateSelector.addEventListener('change', renderResume);

  renderResume(); // Initial render
});

function renderResume() {
  const data = {
    name:    document.getElementById('fullName').value,
    jobRole: document.getElementById('jobRole').value,
    summary: document.getElementById('summary').value,
    skills:  document.getElementById('skills').value.split(',').map(s => s.trim()).filter(Boolean),
    experience: (typeof window.aiExperience === 'object')
      ? window.aiExperience
      : document.getElementById('experience').value
          .split('\n\n')
          .map(block => {
            // Naïve: first line is header, following bullets; can refine
            const [ header, ...bullets ] = block.split('\n');
            return {
              role: header,
              company: '', dates: '',
              bullets: bullets.map(b=> b.replace(/^•\s*/,''))
            };
          }),
    education: (typeof window.aiEducation === 'object')
      ? window.aiEducation
      : document.getElementById('education').value
          .split('\n\n')
          .map(block => {
            const [ header, ...notes ] = block.split('\n');
            return { degree: header, institution:'', dates:'', notes: notes.join(' ') };
          })
  };

  loadTemplate(document.getElementById('templateSelector').value, data);
}

