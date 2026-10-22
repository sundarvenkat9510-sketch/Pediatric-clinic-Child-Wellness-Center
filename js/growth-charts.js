/**
 * LittleCare Parent Dashboard
 * Growth Charts & Physical Development Tracking (Chart.js)
 */

let heightChartInstance = null;
let weightChartInstance = null;

// WHO Reference Median values for 0 - 36 months (Reference line)
const WHO_HEIGHT_MEDIAN = [
  { age: 0, cm: 50.0 },
  { age: 3, cm: 61.4 },
  { age: 6, cm: 67.6 },
  { age: 9, cm: 72.0 },
  { age: 12, cm: 75.7 },
  { age: 18, cm: 82.3 },
  { age: 24, cm: 87.8 },
  { age: 36, cm: 96.1 }
];

const WHO_WEIGHT_MEDIAN = [
  { age: 0, kg: 3.3 },
  { age: 3, kg: 6.4 },
  { age: 6, kg: 7.9 },
  { age: 9, kg: 8.9 },
  { age: 12, kg: 9.6 },
  { age: 18, kg: 10.9 },
  { age: 24, kg: 12.2 },
  { age: 36, kg: 14.3 }
];

document.addEventListener('DOMContentLoaded', () => {
  renderGrowthDashboard();

  // Log measurement form
  const logForm = document.getElementById('logGrowthForm');
  if (logForm) {
    logForm.addEventListener('submit', handleLogMeasurement);
    // Default measurement date to today
    const dateInput = document.getElementById('growthDate');
    if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];
  }
});

function renderGrowthDashboard() {
  const db = getDB();
  const activeChildId = db.currentUser.activeChildId;
  const activeChild = db.children.find(c => c.id === activeChildId) || db.children[0];

  const childNameEl = document.getElementById('growthActiveChildName');
  if (childNameEl && activeChild) {
    childNameEl.textContent = activeChild.name;
  }

  // Get child's measurements sorted by age
  const records = (db.growthRecords || [])
    .filter(r => !activeChildId || r.childId === activeChildId)
    .sort((a, b) => a.ageMonths - b.ageMonths);

  // Render Charts
  renderHeightChart(records, activeChild ? activeChild.name : 'Child');
  renderWeightChart(records, activeChild ? activeChild.name : 'Child');

  // Render Table
  renderMeasurementTable(records);
}

// Render Height vs Age Chart
function renderHeightChart(records, childName) {
  const canvas = document.getElementById('heightChartCanvas');
  if (!canvas || !window.Chart) return;

  if (heightChartInstance) {
    heightChartInstance.destroy();
  }

  // Prepare datasets
  const whoLabels = WHO_HEIGHT_MEDIAN.map(d => `${d.age}m`);
  const whoData = WHO_HEIGHT_MEDIAN.map(d => d.cm);

  // Map child records onto nearest WHO age or continuous points
  const childPoints = records.map(r => ({ x: `${r.ageMonths}m`, y: r.heightCm }));

  heightChartInstance = new Chart(canvas, {
    type: 'line',
    data: {
      labels: whoLabels,
      datasets: [
        {
          label: `${childName} (Actual)`,
          data: childPoints,
          borderColor: '#2B7FFF',
          backgroundColor: 'rgba(43, 127, 255, 0.15)',
          borderWidth: 3,
          pointBackgroundColor: '#2B7FFF',
          pointRadius: 6,
          pointHoverRadius: 8,
          fill: true,
          tension: 0.3
        },
        {
          label: 'WHO Standard (50th Percentile)',
          data: whoData,
          borderColor: '#CBD5E1',
          borderDash: [5, 5],
          borderWidth: 2,
          pointRadius: 0,
          fill: false,
          tension: 0.3
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { position: 'top' },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.dataset.label}: ${context.raw?.y || context.raw} cm`;
            }
          }
        }
      },
      scales: {
        y: {
          title: { display: true, text: 'Height (cm)' },
          min: 40,
          max: 110
        },
        x: {
          title: { display: true, text: 'Age (Months)' }
        }
      }
    }
  });
}

// Render Weight vs Age Chart
function renderWeightChart(records, childName) {
  const canvas = document.getElementById('weightChartCanvas');
  if (!canvas || !window.Chart) return;

  if (weightChartInstance) {
    weightChartInstance.destroy();
  }

  const whoLabels = WHO_WEIGHT_MEDIAN.map(d => `${d.age}m`);
  const whoData = WHO_WEIGHT_MEDIAN.map(d => d.kg);
  const childPoints = records.map(r => ({ x: `${r.ageMonths}m`, y: r.weightKg }));

  weightChartInstance = new Chart(canvas, {
    type: 'line',
    data: {
      labels: whoLabels,
      datasets: [
        {
          label: `${childName} (Actual)`,
          data: childPoints,
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.15)',
          borderWidth: 3,
          pointBackgroundColor: '#10B981',
          pointRadius: 6,
          pointHoverRadius: 8,
          fill: true,
          tension: 0.3
        },
        {
          label: 'WHO Standard (50th Percentile)',
          data: whoData,
          borderColor: '#CBD5E1',
          borderDash: [5, 5],
          borderWidth: 2,
          pointRadius: 0,
          fill: false,
          tension: 0.3
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { position: 'top' },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.dataset.label}: ${context.raw?.y || context.raw} kg`;
            }
          }
        }
      },
      scales: {
        y: {
          title: { display: true, text: 'Weight (kg)' },
          min: 2,
          max: 18
        },
        x: {
          title: { display: true, text: 'Age (Months)' }
        }
      }
    }
  });
}

// Render Measurement Table
function renderMeasurementTable(records) {
  const tbody = document.getElementById('growthTableBody');
  if (!tbody) return;

  // Show newest on top in table
  const sortedDesc = [...records].reverse();

  if (sortedDesc.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center py-4 text-muted">
          No growth measurements logged yet. Click "Log New Measurement" to record height & weight.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = sortedDesc.map(r => `
    <tr>
      <td class="fw-bold">${r.date}</td>
      <td><span class="badge bg-soft-primary text-primary">${r.ageMonths} months</span></td>
      <td><strong>${r.heightCm}</strong> cm</td>
      <td><strong>${r.weightKg}</strong> kg</td>
      <td>${r.headCircumferenceCm ? `${r.headCircumferenceCm} cm` : '—'}</td>
      <td><small class="text-muted">${r.notes || 'Routine check'}</small></td>
      <td class="text-end">
        <button class="btn btn-sm btn-outline-danger py-0 px-2" onclick="deleteMeasurement('${r.id}')" title="Delete">
          <i class="bi bi-trash"></i>
        </button>
      </td>
    </tr>
  `).join('');
}

// Log new measurement
function handleLogMeasurement(event) {
  event.preventDefault();
  const db = getDB();
  const activeChildId = db.currentUser.activeChildId || db.children[0]?.id;

  const date = document.getElementById('growthDate').value;
  const ageMonths = parseInt(document.getElementById('growthAgeMonths').value, 10);
  const heightCm = parseFloat(document.getElementById('growthHeight').value);
  const weightKg = parseFloat(document.getElementById('growthWeight').value);
  const headCircumference = document.getElementById('growthHeadCircumference').value;
  const notes = document.getElementById('growthNotes').value.trim();

  if (!date || isNaN(ageMonths) || isNaN(heightCm) || isNaN(weightKg)) {
    alert("Please fill in valid date, age, height, and weight values.");
    return;
  }

  const newRecord = {
    id: 'gr-' + Date.now(),
    childId: activeChildId,
    date: date,
    ageMonths: ageMonths,
    heightCm: heightCm,
    weightKg: weightKg,
    headCircumferenceCm: headCircumference ? parseFloat(headCircumference) : null,
    percentile: "Logged Entry",
    notes: notes || "Parent logged entry"
  };

  db.growthRecords.push(newRecord);
  saveDB(db);

  const modalEl = document.getElementById('logGrowthModal');
  if (modalEl && window.bootstrap) {
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();
  }

  showToast('Growth measurement added and charts updated!', 'success');
  renderGrowthDashboard();
  document.getElementById('logGrowthForm').reset();
}

function deleteMeasurement(recordId) {
  if (confirm("Delete this growth record?")) {
    const db = getDB();
    db.growthRecords = db.growthRecords.filter(r => r.id !== recordId);
    saveDB(db);
    showToast('Measurement deleted.', 'warning');
    renderGrowthDashboard();
  }
}
