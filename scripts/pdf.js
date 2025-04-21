function downloadPDF() {
  const element = document.getElementById('resumePreview');

  if (!element || !element.innerHTML.trim()) {
    alert("Please generate your resume before downloading.");
    return;
  }

  // Backup styles
  const original = {
    width: element.style.width,
    minHeight: element.style.minHeight,
    margin: element.style.margin,
    background: element.style.backgroundColor
  };

  // Set exact A4 PDF size
  element.style.width = '794px'; // A4 width at 96 DPI
  element.style.minHeight = '1122px';
  element.style.margin = '0 auto';
  element.style.backgroundColor = '#fff';

  // Allow browser to apply styles
  setTimeout(() => {
    html2pdf()
      .set({
        margin: 0,
        filename: 'My_Resume.pdf',
        image: { type: 'jpeg', quality: 1 },
        html2canvas: {
          scale: 2, // Higher scale for sharper PDF
          useCORS: true,
          scrollY: 0,
          windowWidth: 794,
          x: 0, // Ensure left alignment
          y: 0  // Ensure top alignment
        },
        jsPDF: {
          unit: 'pt',
          format: 'a4',
          orientation: 'portrait'
        }
      })
      .from(element)
      .save()
      .then(() => {
        // Restore original styles
        element.style.width = original.width;
        element.style.minHeight = original.minHeight;
        element.style.margin = original.margin;
        element.style.backgroundColor = original.background;
      });
  }, 100);
}
