/**
 * LittleCare Parent Dashboard
 * Appointment Booking & Management
 */

let currentFilter = 'All';

document.addEventListener('DOMContentLoaded', () => {
  initAppointmentForm();
  renderAppointmentsList();

  // Check URL params (e.g., booking from doctors page ?doctor=doc-1)
  const urlParams = new URLSearchParams(window.location.search);
  const docParam = urlParams.get('doctor');
  if (docParam) {
    const docSelect = document.getElementById('bookDoctor');
    if (docSelect) {
      docSelect.value = docParam;
    }
    const bookModal = document.getElementById('bookAppointmentModal');
    if (bookModal && window.bootstrap) {
      const modal = new bootstrap.Modal(bookModal);
      modal.show();
    }
  }

  // Appointment Form Submit
  const bookForm = document.getElementById('bookAppointmentForm');
  if (bookForm) {
    bookForm.addEventListener('submit', handleBookAppointment);
  }
});

// Initialize form selects, date restrictions & doctor options
function initAppointmentForm() {
  const db = getDB();

  // Populate Children
  const childSelect = document.getElementById('bookChild');
  if (childSelect) {
    childSelect.innerHTML = (db.children || []).map(c => `
      <option value="${c.id}" ${c.id === db.currentUser.activeChildId ? 'selected' : ''}>
        ${c.name} (${calculateAgeString(c.dob)})
      </option>
    `).join('');
  }

  // Populate Doctors
  const docSelect = document.getElementById('bookDoctor');
  if (docSelect) {
    docSelect.innerHTML = (db.doctors || []).map(d => `
      <option value="${d.id}">${d.name} – ${d.specialty}</option>
    `).join('');
  }

  // Date restriction: min date = today
  const dateInput = document.getElementById('bookDate');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    // Default to tomorrow or next business day
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    dateInput.value = tomorrow.toISOString().split('T')[0];
  }
}

// Render appointments table and cards
function renderAppointmentsList() {
  const container = document.getElementById('appointmentsListContainer');
  if (!container) return;

  const db = getDB();
  const allAppointments = db.appointments || [];

  let filtered = allAppointments;
  if (currentFilter === 'Upcoming') {
    filtered = allAppointments.filter(a => a.status === 'Confirmed' || a.status === 'Pending');
  } else if (currentFilter === 'Completed') {
    filtered = allAppointments.filter(a => a.status === 'Completed');
  } else if (currentFilter === 'Cancelled') {
    filtered = allAppointments.filter(a => a.status === 'Cancelled');
  }

  // Sort descending by date
  filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="card-custom p-5 text-center">
        <i class="bi bi-calendar2-x text-muted" style="font-size: 3rem;"></i>
        <h5 class="fw-bold mt-3">No Appointments Found</h5>
        <p class="text-muted">There are no appointments matching the "${currentFilter}" filter.</p>
        <div>
          <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#bookAppointmentModal">
            <i class="bi bi-plus-circle me-1"></i> Book New Appointment
          </button>
        </div>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(apt => {
    let badgeClass = 'badge-status-pending';
    if (apt.status === 'Confirmed') badgeClass = 'badge-status-confirmed';
    if (apt.status === 'Completed') badgeClass = 'badge-status-completed';
    if (apt.status === 'Cancelled') badgeClass = 'badge-status-cancelled';

    const isActionable = apt.status === 'Confirmed' || apt.status === 'Pending';

    return `
      <div class="card-custom p-4 mb-3">
        <div class="d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div class="d-flex align-items-center gap-3">
            <div class="bg-soft-primary p-3 rounded-4 text-center" style="min-width: 72px;">
              <span class="d-block fw-bold fs-4 text-primary line-height-1">${apt.date.split('-')[2]}</span>
              <span class="text-uppercase fw-bold text-muted small">${getMonthAbbr(apt.date)} ${apt.date.split('-')[0]}</span>
            </div>
            <div>
              <div class="d-flex align-items-center gap-2 mb-1">
                <span class="badge ${badgeClass} px-3 py-1" style="border-radius: 9999px;">
                  ${apt.status}
                </span>
                <span class="text-muted" style="font-size: 0.825rem;"><i class="bi bi-clock me-1"></i>${apt.time}</span>
              </div>
              <h5 class="fw-bold mb-1">${apt.service}</h5>
              <div class="d-flex flex-wrap align-items-center gap-3 text-muted" style="font-size: 0.875rem;">
                <span><i class="bi bi-person-fill text-primary me-1"></i>Patient: <strong>${apt.childName}</strong></span>
                <span>•</span>
                <span><i class="bi bi-hospital text-info me-1"></i>Doctor: <strong>${apt.doctorName}</strong></span>
                <span>•</span>
                <span><i class="bi bi-geo-alt me-1"></i>${apt.room || 'Suite 201'}</span>
              </div>
            </div>
          </div>
          
          <div class="d-flex align-items-center gap-2">
            ${isActionable ? `
              <button class="btn btn-sm btn-outline-danger" onclick="cancelAppointmentPrompt('${apt.id}')">
                <i class="bi bi-x-circle me-1"></i> Cancel Visit
              </button>
              <button class="btn btn-sm btn-outline-primary" onclick="simulateCalendarAdd('${apt.id}')">
                <i class="bi bi-calendar-plus me-1"></i> Add to Calendar
              </button>
            ` : ''}
            ${apt.status === 'Cancelled' ? `
              <button class="btn btn-sm btn-primary" onclick="rebookAppointment('${apt.doctorId}', '${apt.childId}', '${apt.service}')">
                <i class="bi bi-arrow-repeat me-1"></i> Rebook
              </button>
            ` : ''}
            ${apt.status === 'Completed' ? `
              <a href="health-records.html" class="btn btn-sm btn-outline-secondary">
                <i class="bi bi-file-earmark-medical me-1"></i> View Summary
              </a>
            ` : ''}
          </div>
        </div>
        ${apt.notes ? `
          <div class="mt-3 pt-3 border-top text-muted" style="font-size: 0.85rem;">
            <strong>Reason / Notes:</strong> ${apt.notes}
          </div>
        ` : ''}
      </div>
    `;
  }).join('');
}

// Filter button clicks
function setAppointmentFilter(filter, event) {
  if (event) event.preventDefault();
  currentFilter = filter;
  document.querySelectorAll('.apt-filter-btn').forEach(btn => {
    btn.classList.remove('active', 'btn-primary');
    btn.classList.add('btn-outline-secondary');
  });
  if (event && event.target) {
    event.target.classList.add('active', 'btn-primary');
    event.target.classList.remove('btn-outline-secondary');
  }
  renderAppointmentsList();
}

// Handle New Appointment Booking
function handleBookAppointment(event) {
  event.preventDefault();
  const db = getDB();

  const childId = document.getElementById('bookChild').value;
  const doctorId = document.getElementById('bookDoctor').value;
  const service = document.getElementById('bookService').value;
  const date = document.getElementById('bookDate').value;
  const time = document.getElementById('bookTime').value;
  const notes = document.getElementById('bookNotes').value.trim();

  // Validate date is not past
  const chosenDate = new Date(date + 'T00:00:00');
  const today = new Date();
  today.setHours(0,0,0,0);

  if (chosenDate < today) {
    alert("Please select a date in the future or today.");
    return;
  }

  const child = db.children.find(c => c.id === childId) || db.children[0];
  const doctor = db.doctors.find(d => d.id === doctorId) || db.doctors[0];

  const newAppointment = {
    id: 'apt-' + Date.now(),
    childId: child.id,
    childName: child.name,
    doctorId: doctor.id,
    doctorName: doctor.name,
    service: service,
    date: date,
    time: time,
    room: doctor.room || "Room 201",
    status: "Confirmed",
    notes: notes || "Parent booked via online portal"
  };

  db.appointments.unshift(newAppointment);
  saveDB(db);

  // Close modal
  const modalEl = document.getElementById('bookAppointmentModal');
  if (modalEl && window.bootstrap) {
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();
  }

  showToast(`Appointment confirmed for ${child.name} with ${doctor.name} on ${date}!`, 'success');
  renderAppointmentsList();
  document.getElementById('bookAppointmentForm').reset();
}

// Cancel appointment prompt
function cancelAppointmentPrompt(aptId) {
  const db = getDB();
  const apt = db.appointments.find(a => a.id === aptId);
  if (!apt) return;

  if (confirm(`Are you sure you want to cancel the appointment for ${apt.childName} on ${apt.date}?`)) {
    apt.status = 'Cancelled';
    saveDB(db);
    showToast(`Appointment has been cancelled.`, 'warning');
    renderAppointmentsList();
  }
}

// Simulate calendar export
function simulateCalendarAdd(aptId) {
  const db = getDB();
  const apt = db.appointments.find(a => a.id === aptId);
  showToast(`Event "${apt ? apt.service : 'Doctor Visit'}" ready for calendar export. (Demo downloaded)`, 'primary');
}

// Rebook cancelled appointment
function rebookAppointment(doctorId, childId, service) {
  initAppointmentForm();
  if (doctorId) document.getElementById('bookDoctor').value = doctorId;
  if (childId) document.getElementById('bookChild').value = childId;
  if (service) document.getElementById('bookService').value = service;

  const modalEl = document.getElementById('bookAppointmentModal');
  if (modalEl && window.bootstrap) {
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
  }
}
