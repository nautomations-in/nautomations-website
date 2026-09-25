// N Automations — app download link (GitHub Releases) + live download count
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
          if (!latest) latest = a; // newest release first
        });
      });
      if (latest && btn) btn.href = latest.browser_download_url;
      if (countEl) countEl.textContent = total.toLocaleString('en-IN');
    })
    .catch(function () { /* keep the direct link */ });
})();
