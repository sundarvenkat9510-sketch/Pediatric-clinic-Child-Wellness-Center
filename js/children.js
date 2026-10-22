/**
 * LittleCare Parent Dashboard
 * My Children Management (CRUD operations in LocalStorage)
 */

document.addEventListener('DOMContentLoaded', () => {
  renderChildrenList();

  // Bind Add Child Form
  const addChildForm = document.getElementById('addChildForm');
  if (addChildForm) {
    addChildForm.addEventListener('submit', handleAddChild);
  }

  // Bind Edit Child Form
  const editChildForm = document.getElementById('editChildForm');
  if (editChildForm) {
    editChildForm.addEventListener('submit', handleEditChild);
  }
});

// Render the grid of child profile cards
function renderChildrenList() {
  const container = document.getElementById('childrenGridContainer');
  if (!container) return;

  const db = getDB();
  const children = db.children || [];
  const activeChildId = db.currentUser.activeChildId;

  if (children.length === 0) {
    container.innerHTML = `
      <div class="col-12 text-center py-5">
        <i class="bi bi-people text-muted" style="font-size: 3rem;"></i>
        <h5 class="fw-bold mt-3">No Child Profiles Added</h5>
        <p class="text-muted">Add your child's profile to track growth, schedule vaccinations, and book clinic visits.</p>
        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addChildModal">
          <i class="bi bi-plus-lg me-1"></i> Add First Child
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = children.map(child => {
    const isActive = child.id === activeChildId;
    return `
      <div class="col-lg-6 mb-4">
        <div class="child-card ${isActive ? 'border-primary' : ''}">
          ${isActive ? `
            <div class="position-absolute top-0 end-0 m-3">
              <span class="badge bg-primary px-3 py-1" style="border-radius: 9999px;">
                <i class="bi bi-check-circle-fill me-1"></i> Active Profile
              </span>
            </div>
          ` : ''}
          <div class="child-card-header">
            <img src="${child.avatar}" class="child-card-avatar" alt="${child.name}">
            <div>
              <h4 class="fw-bold mb-1">${child.name}</h4>
              <p class="text-muted mb-1" style="font-size: 0.85rem;">
                <span class="fw-bold text-dark">${calculateAgeString(child.dob)}</span> • Born ${child.dob}
              </p>
              <div class="d-flex align-items-center gap-2 mt-2">
                ${!isActive ? `
                  <button class="btn btn-sm btn-outline-primary" onclick="switchActiveChild('${child.id}')">
                    <i class="bi bi-person-check me-1"></i> Set as Active
                  </button>
                ` : ''}
                <button class="btn btn-sm btn-outline-secondary" onclick="openEditChildModal('${child.id}')">
                  <i class="bi bi-pencil me-1"></i> Edit
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteChildPrompt('${child.id}')">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </div>
          </div>
          <div class="child-details-grid">
            <div class="child-detail-item">
              <span class="label">Gender</span>
              <span class="val">${child.gender || 'Not specified'}</span>
            </div>
            <div class="child-detail-item">
              <span class="label">Blood Group</span>
              <span class="val">${child.bloodGroup || 'O+'}</span>
            </div>
            <div class="child-detail-item">
              <span class="label">Pediatrician</span>
              <span class="val">${child.pediatrician || 'Dr. Sophia Martinez'}</span>
            </div>
            <div class="child-detail-item">
              <span class="label">Allergies</span>
              <span class="val text-danger">${child.allergies || 'None'}</span>
            </div>
          </div>
          <div class="p-3 bg-white d-flex align-items-center justify-content-between">
            <small class="text-muted text-truncate me-2" style="max-width: 60%; font-size: 0.775rem;">
              <i class="bi bi-journal-text me-1"></i> ${child.notes || 'No notes added'}
            </small>
            <div class="d-flex gap-2">
              <a href="growth-charts.html" class="btn btn-sm btn-soft-primary" title="Growth Charts">
                <i class="bi bi-graph-up"></i>
              </a>
              <a href="vaccinations.html" class="btn btn-sm btn-soft-mint" title="Vaccines">
                <i class="bi bi-shield-check"></i>
              </a>
              <a href="appointments.html" class="btn btn-sm btn-primary" title="Book Visit">
                <i class="bi bi-calendar-plus"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Add Child Form Handler
function handleAddChild(event) {
  event.preventDefault();
  const name = document.getElementById('addChildName').value.trim();
  const dob = document.getElementById('addChildDob').value;
  const gender = document.getElementById('addChildGender').value;
  const bloodGroup = document.getElementById('addChildBlood').value;
  const allergies = document.getElementById('addChildAllergies').value.trim() || 'None reported';
  const pediatrician = document.getElementById('addChildDoctor').value;
  const notes = document.getElementById('addChildNotes').value.trim();
  const avatar = document.getElementById('addChildAvatar').value;

  if (!name || !dob) {
    alert("Please provide the child's name and date of birth.");
    return;
  }

  // Prevent future DOB
  if (new Date(dob) > new Date()) {
    alert("Date of birth cannot be in the future.");
    return;
  }

  const db = getDB();
  const newChildId = 'child-' + Date.now();

  const newChild = {
    id: newChildId,
    parentId: db.currentUser.id,
    name: name,
    dob: dob,
    gender: gender,
    bloodGroup: bloodGroup,
    allergies: allergies,
    avatar: avatar || (gender === 'Girl' ? 'assets/images/girl-avatar.svg' : 'assets/images/boy-avatar.svg'),
    pediatrician: pediatrician,
    notes: notes || "Newly added profile"
  };

  db.children.push(newChild);
  db.currentUser.activeChildId = newChildId;
  saveDB(db);

  // Close modal
  const modalEl = document.getElementById('addChildModal');
  if (modalEl && window.bootstrap) {
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();
  }

  showToast(`Profile for ${name} created successfully!`, 'success');
  renderChildrenList();
  renderChildSwitcher(db);
  document.getElementById('addChildForm').reset();
}

// Open and Pre-fill Edit Child Modal
function openEditChildModal(childId) {
  const db = getDB();
  const child = db.children.find(c => c.id === childId);
  if (!child) return;

  document.getElementById('editChildId').value = child.id;
  document.getElementById('editChildName').value = child.name;
  document.getElementById('editChildDob').value = child.dob;
  document.getElementById('editChildGender').value = child.gender || 'Boy';
  document.getElementById('editChildBlood').value = child.bloodGroup || 'O+';
  document.getElementById('editChildAllergies').value = child.allergies || '';
  document.getElementById('editChildDoctor').value = child.pediatrician || 'Dr. Sophia Martinez';
  document.getElementById('editChildNotes').value = child.notes || '';
  document.getElementById('editChildAvatar').value = child.avatar;

  const modalEl = document.getElementById('editChildModal');
  if (modalEl && window.bootstrap) {
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
  }
}

// Handle Edit Child Submission
function handleEditChild(event) {
  event.preventDefault();
  const childId = document.getElementById('editChildId').value;
  const name = document.getElementById('editChildName').value.trim();
  const dob = document.getElementById('editChildDob').value;
  const gender = document.getElementById('editChildGender').value;
  const bloodGroup = document.getElementById('editChildBlood').value;
  const allergies = document.getElementById('editChildAllergies').value.trim() || 'None reported';
  const pediatrician = document.getElementById('editChildDoctor').value;
  const notes = document.getElementById('editChildNotes').value.trim();
  const avatar = document.getElementById('editChildAvatar').value;

  const db = getDB();
  const childIndex = db.children.findIndex(c => c.id === childId);

  if (childIndex === -1) return;

  db.children[childIndex] = {
    ...db.children[childIndex],
    name,
    dob,
    gender,
    bloodGroup,
    allergies,
    pediatrician,
    notes,
    avatar
  };

  saveDB(db);

  const modalEl = document.getElementById('editChildModal');
  if (modalEl && window.bootstrap) {
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();
  }

  showToast(`Updated details for ${name}!`, 'success');
  renderChildrenList();
  renderChildSwitcher(db);
}

// Delete Child Prompt
function deleteChildPrompt(childId) {
  const db = getDB();
  if (db.children.length <= 1) {
    alert("You must keep at least one child profile in the parent dashboard.");
    return;
  }

  const child = db.children.find(c => c.id === childId);
  if (!child) return;

  if (confirm(`Are you sure you want to remove the profile for ${child.name}? This will remove associated sample records.`)) {
    db.children = db.children.filter(c => c.id !== childId);
    if (db.currentUser.activeChildId === childId) {
      db.currentUser.activeChildId = db.children[0].id;
    }
    saveDB(db);
    showToast(`Removed profile for ${child.name}.`, 'warning');
    renderChildrenList();
    renderChildSwitcher(db);
  }
}
