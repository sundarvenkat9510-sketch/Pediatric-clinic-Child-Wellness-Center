/**
 * LittleCare Parent Dashboard
 * Vaccination Schedule Tracker & Immunization Records
 */

let currentVacFilter = 'All';

document.addEventListener('DOMContentLoaded', () => {
  renderVaccinationList();

  // Mark administered form submit
  const markForm = document.getElementById('markVaccineForm');
  if (markForm) {
    markForm.addEventListener('submit', handleSaveAdministeredVaccine);
  }
});

function renderVaccinationList() {
  const container = document.getElementById('vaccineListContainer');
  if (!container) return;

  const db = getDB();
  const activeChildId = db.currentUser.activeChildId;
  const activeChild = db.children.find(c => c.id === activeChildId) || db.children[0];

  const childNameEl = document.getElementById('vaccineActiveChildName');
  if (childNameEl && activeChild) {
    childNameEl.textContent = activeChild.name;
  }

  const allVaccines = db.vaccinations || [];
  // Filter for active child
  let childVaccines = allVaccines.filter(v => !activeChildId || v.childId === activeChildId);

  // Apply status filter
  if (currentVacFilter === 'Completed') {
    childVaccines = childVaccines.filter(v => v.status === 'Completed');
  } else if (currentVacFilter === 'Upcoming') {
    childVaccines = childVaccines.filter(v => v.status === 'Upcoming');
  } else if (currentVacFilter === 'Overdue') {
    childVaccines = childVaccines.filter(v => v.status === 'Overdue');
  }

  // Summary counts
  const total = allVaccines.filter(v => !activeChildId || v.childId === activeChildId).length;
  const completed = allVaccines.filter(v => (!activeChildId || v.childId === activeChildId) && v.status === 'Completed').length;
  const percentComplete = total > 0 ? Math.round((completed / total) * 100) : 0;

  const progressEl = document.getElementById('vaccineProgressBar');
  const progressTextEl = document.getElementById('vaccineProgressText');
  if (progressEl) {
    progressEl.style.width = percentComplete + '%';
    progressEl.setAttribute('aria-valuenow', percentComplete);
  }
  if (progressTextEl) {
    progressTextEl.textContent = `${completed} of ${total} vaccines completed (${percentComplete}%)`;
  }

  if (childVaccines.length === 0) {
    container.innerHTML = `
      <div class="card-custom p-5 text-center">
        <i class="bi bi-shield-check text-muted" style="font-size: 3rem;"></i>
        <h5 class="fw-bold mt-3">No Records Found</h5>
        <p class="text-muted">No vaccines found matching "${currentVacFilter}".</p>
      </div>
    `;
    return;
  }

  container.innerHTML = childVaccines.map(vac => {
    const isCompleted = vac.status === 'Completed';
    let statusBadge = `<span class="badge badge-status-completed px-3 py-1" style="border-radius: 9999px;"><i class="bi bi-check-circle-fill me-1"></i>Completed</span>`;
    let cardClass = 'is-completed';

    if (vac.status === 'Upcoming') {
      statusBadge = `<span class="badge badge-status-confirmed px-3 py-1" style="border-radius: 9999px;"><i class="bi bi-clock me-1"></i>Upcoming</span>`;
      cardClass = 'is-upcoming';
    } else if (vac.status === 'Overdue') {
      statusBadge = `<span class="badge badge-status-overdue px-3 py-1" style="border-radius: 9999px;"><i class="bi bi-exclamation-triangle-fill me-1"></i>Overdue</span>`;
      cardClass = 'is-overdue';
    }

    return `
      <div class="vaccine-item-card ${cardClass}">
        <div class="d-flex align-items-center gap-3">
          <div class="p-2 rounded-circle ${isCompleted ? 'bg-soft-mint text-mint' : 'bg-soft-primary text-primary'} d-flex align-items-center justify-content-center" style="width: 48px; height: 48px; flex-shrink: 0;">
            <i class="bi ${isCompleted ? 'bi-shield-fill-check' : 'bi-bandaid'} fs-4"></i>
          </div>
          <div>
            <div class="d-flex flex-wrap align-items-center gap-2 mb-1">
              <span class="badge bg-soft-primary text-primary fw-bold" style="font-size: 0.75rem;">${vac.ageGroup}</span>
              ${statusBadge}
            </div>
            <h5 class="fw-bold mb-1">${vac.name}</h5>
            <p class="text-muted mb-0" style="font-size: 0.85rem;">
              Protects against: <strong>${vac.protectsAgainst}</strong>
            </p>
            ${isCompleted ? `
              <small class="text-success fw-semibold mt-1 d-block" style="font-size: 0.8rem;">
                <i class="bi bi-check-lg me-1"></i>Administered on: ${vac.administeredDate || vac.dueDate} • By: ${vac.administeredBy || 'LittleCare Clinic'}
              </small>
            ` : `
              <small class="text-muted mt-1 d-block" style="font-size: 0.8rem;">
                <i class="bi bi-calendar-event me-1"></i>Recommended Due Date: <strong>${vac.dueDate}</strong>
              </small>
            `}
          </div>
        </div>

        <div class="action-box d-flex align-items-center gap-2 mt-2 mt-md-0">
          ${isCompleted ? `
            <button class="btn btn-sm btn-outline-secondary" onclick="toggleVaccineStatus('${vac.id}', 'Upcoming')">
              <i class="bi bi-arrow-counterclockwise me-1"></i> Mark Pending
            </button>
          ` : `
            <button class="btn btn-sm btn-mint" onclick="openMarkCompletedModal('${vac.id}')">
              <i class="bi bi-check-lg me-1"></i> Mark Done
            </button>
            <a href="appointments.html" class="btn btn-sm btn-outline-primary">
              <i class="bi bi-calendar-plus me-1"></i> Book Shot
            </a>
          `}
        </div>
      </div>
    `;
  }).join('');
}

function setVaccineFilter(filter, event) {
  if (event) event.preventDefault();
  currentVacFilter = filter;
  document.querySelectorAll('.vac-filter-btn').forEach(btn => {
    btn.classList.remove('active', 'btn-primary');
    btn.classList.add('btn-outline-secondary');
  });
  if (event && event.target) {
    event.target.classList.add('active', 'btn-primary');
    event.target.classList.remove('btn-outline-secondary');
  }
  renderVaccinationList();
}

function openMarkCompletedModal(vacId) {
  const db = getDB();
  const vac = db.vaccinations.find(v => v.id === vacId);
  if (!vac) return;

  document.getElementById('markVacId').value = vac.id;
  document.getElementById('markVacName').textContent = vac.name;
  document.getElementById('markVacDate').value = new Date().toISOString().split('T')[0];
  document.getElementById('markVacDoctor').value = "Dr. Sophia Martinez";

  const modalEl = document.getElementById('markVaccineModal');
  if (modalEl && window.bootstrap) {
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
  }
}

function handleSaveAdministeredVaccine(event) {
  event.preventDefault();
  const vacId = document.getElementById('markVacId').value;
  const adminDate = document.getElementById('markVacDate').value;
  const adminDoctor = document.getElementById('markVacDoctor').value;

  const db = getDB();
  const vac = db.vaccinations.find(v => v.id === vacId);
  if (!vac) return;

  vac.status = 'Completed';
  vac.administeredDate = adminDate;
  vac.administeredBy = adminDoctor;

  saveDB(db);

  const modalEl = document.getElementById('markVaccineModal');
  if (modalEl && window.bootstrap) {
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();
  }

  showToast(`${vac.name} recorded as administered!`, 'success');
  renderVaccinationList();
}

function toggleVaccineStatus(vacId, newStatus) {
  const db = getDB();
  const vac = db.vaccinations.find(v => v.id === vacId);
  if (!vac) return;

  vac.status = newStatus;
  if (newStatus === 'Upcoming') {
    vac.administeredDate = '';
    vac.administeredBy = '';
  }
  saveDB(db);
  showToast(`Updated status for ${vac.name}.`, 'primary');
  renderVaccinationList();
}

function printImmunizationRecord() {
  window.print();
}
