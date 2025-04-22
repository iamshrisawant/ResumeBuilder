import { loadTemplate } from './templates.js';
import { refineSummary } from './ai.js';
import './chatbot.js';

import { auth } from './firebase.js';
import { signOut } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';

document.addEventListener('DOMContentLoaded', () => {
  const fields = [
    'fullName', 'summary', 'skills', 'experience', 'education',
    'certifications', 'contactEmail', 'contactPhone', 'contactLinkedIn'
  ];

  const templateSelector = document.getElementById('templateSelector');
  const refineBtn = document.getElementById('refineBtn');
  const downloadBtn      = document.getElementById('downloadPdfBtn');  // ← added
  const logoutBtn = document.getElementById('logoutBtn');



  // Resume input listeners
  fields.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', renderResume);
  });

  if (templateSelector) {
    templateSelector.addEventListener('change', renderResume);
  }

  if (refineBtn) {
    refineBtn.addEventListener('click', async () => {
      const summaryField = document.getElementById('summary');
      const targetCompany = document.getElementById('targetCompany')?.value.trim();
      const preferences = document.getElementById('preferences')?.value.trim();

      const currentSummary = summaryField?.value.trim();
      const role = preferences || 'desired role';
      const company = targetCompany || 'a company';

      if (!currentSummary) {
        alert('Please enter a summary to refine.');
        return;
      }

      try {
        const refined = await refineSummary(currentSummary, role, company);
        summaryField.value = refined;
        renderResume();
      } catch (err) {
        console.error('Refinement failed:', err);
        alert('Failed to refine summary. Please try again later.');
      }
    });
  }

  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      if (typeof downloadPDF === 'function') {
        window.downloadPDF();
      } else {
        console.error('downloadPDF() is not defined.');
      }
    });
  }

  // After wiring up refineBtn and downloadBtn, add:
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      try {
        await signOut(auth);
        window.location.href = 'index.html';
      } catch (err) {
        console.error('Logout error:', err);
        alert('Logout failed. Please try again.');
      }
    });
  }

  renderResume(); // Initial render
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

// Go to index.html when logo is clicked
function goToHome() {
  window.location.href = "index.html";
}

// Handle logout and redirect to index.html
document.getElementById("logoutBtn").addEventListener("click", () => {
  // Assuming Firebase Auth is used
  if (firebase && firebase.auth) {
    firebase.auth().signOut().then(() => {
      console.log("User signed out");
      window.location.href = "index.html";
    }).catch((error) => {
      console.error("Logout error:", error);
    });
  } else {
    // Fallback redirect
    window.location.href = "index.html";
  }
});
