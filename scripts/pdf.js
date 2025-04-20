document.getElementById("download-btn").addEventListener("click", () => {
  const element = document.getElementById("resume-preview");
  html2pdf().from(element).save("resume.pdf");
});
function downloadPDF() {
  const element = document.getElementById('resumePreview');
  const opt = {
    margin:       0.5,
    filename:     'My_Resume.pdf',
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2 },
    jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(element).save();
}
