// N Automations — app downloads (GitHub Releases) + live download count
(function () {
  var REPO = 'nautomations-in/nautomations-website';
  var PREFIX = 'pdf-tools-';
  var btn = document.getElementById('pdfDownloadBtn');
  var countEl = document.getElementById('pdfDownloadCount');
  if (!btn && !countEl) return;
  fetch('https://api.github.com/repos/' + REPO + '/releases?per_page=100', { headers: { Accept: 'application/vnd.github+json' } })
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (releases) {
      var total = 0, latest = null;
      releases.forEach(function (rel) {
        if (rel.draft || rel.tag_name.indexOf(PREFIX) !== 0) return;
        rel.assets.forEach(function (a) {
          if (!/\.exe$/i.test(a.name)) return;
          total += a.download_count;
          if (!latest) latest = a; // releases are returned newest first
        });
      });
      if (latest && btn) btn.href = latest.browser_download_url;
      if (!latest && btn) {
        btn.textContent = 'Request the Installer';
        btn.href = 'https://wa.me/919666936366?text=Hi%2C%20please%20share%20the%20N%20Automations%20PDF%20Tools%20installer';
        btn.target = '_blank';
        btn.rel = 'noopener';
      }
      if (countEl) countEl.textContent = total.toLocaleString('en-IN');
    })
    .catch(function () { /* keep the direct link; count stays as a dash */ });
})();
