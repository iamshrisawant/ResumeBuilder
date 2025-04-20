function loadTemplate(templateName, data) {
  fetch(`templates/${templateName}.html`)
    .then(res => res.text())
    .then(template => {
      const rendered = Mustache.render(template, data);
      document.getElementById('resumePreview').innerHTML = rendered;
    })
    .catch(err => console.error("Template loading error:", err));
}
