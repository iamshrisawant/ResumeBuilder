export function loadTemplate(templateName, data) {
  fetch(`templates/${templateName}.html`)
    .then(res => {
      if (!res.ok) throw new Error(`Failed to load template: ${templateName}`);
      return res.text();
    })
    .then(template => {
      const rendered = Mustache.render(template, data);
      document.getElementById('resumePreview').innerHTML = rendered;
    })
    .catch(err => console.error("Template loading error:", err));
}
