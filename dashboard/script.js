// Global variables
let allLogs = [];
let charts = {};

// تحميل البيانات
async function loadLogs() {
  try {
    const response = await fetch('./logs.json?' + Date.now());
    const data = await response.json();
    
    allLogs = data.logs || [];
    updateStats(data.stats);
    updateLastUpdated(data.lastUpdated);
    renderTable(allLogs);
    updateCharts(allLogs);
    
  } catch (error) {
    console.error('Error loading logs:', error);
    document.getElementById('logTableBody').innerHTML = `
      <tr><td colspan="9" class="loading">❌ فشل في تحميل البيانات</td></tr>
    `;
  }
}

// تحديث الإحصائيات
function updateStats(stats) {
  if (!stats) return;
  
  document.getElementById('totalSuccess').textContent = stats.successful || 0;
  document.getElementById('totalFailed').textContent = stats.failed || 0;
  document.getElementById('avgQuality').textContent = Math.round(stats.avgQuality || 0) + '%';
  document.getElementById('totalLines').textContent = stats.totalLinesChanged || 0;
}

// تحديث وقت آخر تحديث
function updateLastUpdated(timestamp) {
  if (!timestamp) return;
  
  const date = new Date(timestamp);
  const formatted = date.toLocaleString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  document.getElementById('lastUpdated').textContent = `آخر تحديث: ${formatted}`;
}

// عرض الجدول
function renderTable(logs) {
  const tbody = document.getElementById('logTableBody');
  
  if (!logs || logs.length === 0) {
    tbody.innerHTML = '<tr><td colspan="9" class="loading">لا توجد بيانات</td></tr>';
    return;
  }
  
  tbody.innerHTML = logs.map((log, index) => {
    const date = new Date(log.date);
    const formattedDate = date.toLocaleString('ar-SA', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    const statusClass = log.status === 'success' ? 'status-success' : 'status-failed';
    const statusText = log.status === 'success' ? '✅ ناجح' : '❌ فاشل';
    
    return `
      <tr>
        <td>${log.id}</td>
        <td>${formattedDate}</td>
        <td class="${statusClass}">${statusText}</td>
        <td>${log.type || '-'}</td>
        <td>${log.duration || 0}</td>
        <td>${log.linesChanged || 0}</td>
        <td>${log.qualityScore || 0}%</td>
        <td>${log.branch || 'main'}</td>
        <td class="notes-cell" title="${log.notes || ''}">${log.notes || '-'}</td>
      </tr>
    `;
  }).join('');
}

// تحديث الرسوم البيانية
function updateCharts(logs) {
  if (!logs || logs.length === 0) return;
  
  // رسم بياني للجودة
  updateQualityChart(logs);
  
  // رسم بياني للمدة
  updateDurationChart(logs);
}

// رسم بياني للجودة
function updateQualityChart(logs) {
  const ctx = document.getElementById('qualityChart');
  if (!ctx) return;
  
  // تدمير الرسم القديم إذا كان موجوداً
  if (charts.quality) {
    charts.quality.destroy();
  }
  
  const recentLogs = logs.slice(0, 20).reverse();
  
  charts.quality = new Chart(ctx, {
    type: 'line',
    data: {
      labels: recentLogs.map((log, i) => `#${log.id}`),
      datasets: [{
        label: 'نسبة الجودة',
        data: recentLogs.map(log => log.qualityScore || 0),
        borderColor: '#00ffa6',
        backgroundColor: 'rgba(0, 255, 166, 0.1)',
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          labels: {
            color: '#e0e0e0'
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            color: '#888',
            callback: function(value) {
              return value + '%';
            }
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          }
        },
        x: {
          ticks: {
            color: '#888'
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          }
        }
      }
    }
  });
}

// رسم بياني للمدة
function updateDurationChart(logs) {
  const ctx = document.getElementById('durationChart');
  if (!ctx) return;
  
  // تدمير الرسم القديم إذا كان موجوداً
  if (charts.duration) {
    charts.duration.destroy();
  }
  
  const recentLogs = logs.slice(0, 20).reverse();
  
  charts.duration = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: recentLogs.map((log, i) => `#${log.id}`),
      datasets: [{
        label: 'المدة (ثانية)',
        data: recentLogs.map(log => log.duration || 0),
        backgroundColor: 'rgba(0, 212, 255, 0.6)',
        borderColor: '#00d4ff',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          labels: {
            color: '#e0e0e0'
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: '#888',
            callback: function(value) {
              return value + 'ث';
            }
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          }
        },
        x: {
          ticks: {
            color: '#888'
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          }
        }
      }
    }
  });
}

// البحث والتصفية
function setupFilters() {
  const searchInput = document.getElementById('searchInput');
  const filterStatus = document.getElementById('filterStatus');
  
  searchInput.addEventListener('input', filterLogs);
  filterStatus.addEventListener('change', filterLogs);
}

function filterLogs() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  const statusFilter = document.getElementById('filterStatus').value;
  
  let filtered = allLogs;
  
  // تصفية حسب الحالة
  if (statusFilter !== 'all') {
    filtered = filtered.filter(log => log.status === statusFilter);
  }
  
  // تصفية حسب البحث
  if (searchTerm) {
    filtered = filtered.filter(log => {
      return (
        (log.type || '').toLowerCase().includes(searchTerm) ||
        (log.notes || '').toLowerCase().includes(searchTerm) ||
        (log.branch || '').toLowerCase().includes(searchTerm) ||
        (log.id || '').toString().includes(searchTerm)
      );
    });
  }
  
  renderTable(filtered);
}

// تحميل البيانات عند بدء الصفحة
document.addEventListener('DOMContentLoaded', () => {
  loadLogs();
  setupFilters();
  
  // تحديث تلقائي كل 15 ثانية
  setInterval(loadLogs, 15000);
});
