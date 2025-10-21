async function loadLogs() {
  try {
    const res = await fetch(`./logs.json?${Date.now()}`);
    const data = await res.json();
    const tbody = document.querySelector('#logTable tbody');
    tbody.innerHTML = '';
    data.forEach(log => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${log.id}</td><td>${new Date(log.date).toLocaleString()}</td><td class="${log.status === 'success' ? 'status-success' : 'status-fail'}">${log.status}</td><td>${log.type}</td><td>${log.duration}s</td><td>${log.linesChanged}</td><td>${log.qualityScore}%</td><td>${log.notes || ''}</td>`;
      tbody.appendChild(tr);
    });
  } catch (e) {
    console.error('load logs failed', e);
  }
}
loadLogs();
setInterval(loadLogs, 15000);
