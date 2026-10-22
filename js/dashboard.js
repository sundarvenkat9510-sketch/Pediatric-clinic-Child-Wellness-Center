/**
 * LittleCare Parent Dashboard
 * Overview Logic, Layout Injections & Child Switcher
 */

document.addEventListener('DOMContentLoaded', () => {
  // Check authorization
  requireAuth();

  const db = getDB();
  const currentUser = db.currentUser;

  // Initialize shared dashboard navigation and topbar
  initDashboardLayout(db, currentUser);

  // If on overview page, render overview widgets
  if (document.getElementById('overviewMetricsRow')) {
    renderOverviewStats(db);
    renderOverviewUpcoming(db);
    renderOverviewVaccines(db);
    renderRecentActivities(db);
  }
});

// Initialize layout elements shared across all dashboard sub-pages
function initDashboardLayout(db, currentUser) {
  // Set current user details in topbar and sidebar
  const sidebarUserName = document.getElementById('sidebarUserName');
  const sidebarUserEmail = document.getElementById('sidebarUserEmail');
  const sidebarUserAvatar = document.getElementById('sidebarUserAvatar');
  const topbarUserAvatar = document.getElementById('topbarUserAvatar');
  const welcomeParentName = document.getElementById('welcomeParentName');

  if (sidebarUserName) sidebarUserName.textContent = currentUser.name || "Parent";
  if (sidebarUserEmail) sidebarUserEmail.textContent = currentUser.email || "";
  if (sidebarUserAvatar && currentUser.avatar) sidebarUserAvatar.src = currentUser.avatar;
  if (topbarUserAvatar && currentUser.avatar) topbarUserAvatar.src = currentUser.avatar;
  if (welcomeParentName) welcomeParentName.textContent = currentUser.name ? currentUser.name.split(' ')[0] : 'Parent';

  // Setup Child Switcher Dropdown
  renderChildSwitcher(db);

  // Setup Mobile Sidebar Toggle
  const toggleBtn = document.getElementById('sidebarToggleBtn');
  const sidebar = document.getElementById('dashboardSidebar');
  const backdrop = document.getElementById('sidebarBackdrop');

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('show');
      if (backdrop) backdrop.classList.toggle('show');
    });
  }

  if (backdrop && sidebar) {
    backdrop.addEventListener('click', () => {
      sidebar.classList.remove('show');
      backdrop.classList.remove('show');
    });
  }
}

// Render active child switcher dropdown in topbar
function renderChildSwitcher(db) {
  const container = document.getElementById('topbarChildSwitcher');
  if (!container) return;

  const children = db.children || [];
  let activeChild = children.find(c => c.id === db.currentUser.activeChildId) || children[0];

  if (!activeChild && children.length > 0) {
    activeChild = children[0];
    db.currentUser.activeChildId = activeChild.id;
    saveDB(db);
  }

  if (!activeChild) {
    container.innerHTML = `
      <a href="children.html" class="btn btn-sm btn-outline-primary">
        <i class="bi bi-plus-circle me-1"></i> Add Child Profile
      </a>
    `;
    return;
  }

  const dropdownItems = children.map(child => `
    <li>
      <a class="dropdown-item d-flex align-items-center gap-2 py-2 ${child.id === activeChild.id ? 'active' : ''}" 
         href="#" onclick="switchActiveChild('${child.id}', event)">
        <img src="${child.avatar}" class="rounded-circle" width="24" height="24" alt="${child.name}">
        <div>
          <span class="d-block fw-bold" style="font-size: 0.85rem;">${child.name}</span>
          <small class="text-muted" style="font-size: 0.725rem;">${calculateAgeString(child.dob)}</small>
        </div>
      </a>
    </li>
  `).join('');

  container.innerHTML = `
    <div class="dropdown">
      <div class="child-selector-pill" data-bs-toggle="dropdown" aria-expanded="false" role="button">
        <img src="${activeChild.avatar}" class="child-pill-avatar" alt="${activeChild.name}">
        <span class="child-pill-label">${activeChild.name}</span>
        <i class="bi bi-chevron-down text-primary ms-1" style="font-size: 0.75rem;"></i>
      </div>
      <ul class="dropdown-menu dropdown-menu-end shadow-md border-0 p-2" style="border-radius: 1rem; min-width: 220px;">
        <li class="dropdown-header text-uppercase text-muted fw-bold" style="font-size: 0.7rem; letter-spacing: 0.5px;">Switch Child Profile</li>
        ${dropdownItems}
        <li><hr class="dropdown-divider my-2"></li>
        <li>
          <a class="dropdown-item d-flex align-items-center gap-2 text-primary fw-bold py-2" href="children.html">
            <i class="bi bi-gear-fill"></i> Manage Children
          </a>
        </li>
      </ul>
    </div>
  `;
}

// Switch Active Child
function switchActiveChild(childId, event) {
  if (event) event.preventDefault();
  const db = getDB();
  db.currentUser.activeChildId = childId;
  saveDB(db);

  const selectedChild = db.children.find(c => c.id === childId);
  showToast(`Switched active profile to ${selectedChild ? selectedChild.name : 'child'}!`, 'primary');

  setTimeout(() => {
    window.location.reload();
  }, 400);
}

// Render Overview Metric Stat Cards
function renderOverviewStats(db) {
  const children = db.children || [];
  const activeChildId = db.currentUser.activeChildId;
  const activeChild = children.find(c => c.id === activeChildId) || children[0];

  // 1. Total Children Count
  const totalChildrenEl = document.getElementById('statTotalChildren');
  if (totalChildrenEl) totalChildrenEl.textContent = children.length;

  // 2. Upcoming Appointments
  const upcomingApts = db.appointments.filter(a => a.status === 'Confirmed' || a.status === 'Pending');
  const upcomingCountEl = document.getElementById('statUpcomingApts');
  const upcomingSubEl = document.getElementById('statUpcomingSub');
  if (upcomingCountEl) upcomingCountEl.textContent = upcomingApts.length;
  if (upcomingSubEl) {
    if (upcomingApts.length > 0) {
      upcomingSubEl.textContent = `Next: ${upcomingApts[0].date} (${upcomingApts[0].childName})`;
    } else {
      upcomingSubEl.textContent = 'No upcoming visits';
    }
  }

  // 3. Pending Vaccinations for Active Child
  const pendingVaccines = db.vaccinations.filter(v => 
    (!activeChildId || v.childId === activeChildId) && 
    (v.status === 'Upcoming' || v.status === 'Overdue')
  );
  const pendingVacCountEl = document.getElementById('statPendingVaccines');
  const pendingVacSubEl = document.getElementById('statPendingVacSub');
  if (pendingVacCountEl) pendingVacCountEl.textContent = pendingVaccines.length;
  if (pendingVacSubEl) {
    pendingVacSubEl.textContent = pendingVaccines.length > 0 
      ? `Next: ${pendingVaccines[0].name.split('-')[0]}` 
      : 'All current shots complete';
  }

  // 4. Latest Growth Update for Active Child
  const childGrowth = db.growthRecords
    .filter(g => !activeChildId || g.childId === activeChildId)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  
  const latestGrowthEl = document.getElementById('statLatestGrowth');
  const latestGrowthSubEl = document.getElementById('statLatestGrowthSub');
  if (latestGrowthEl) {
    if (childGrowth.length > 0) {
      latestGrowthEl.textContent = `${childGrowth[0].weightKg} kg / ${childGrowth[0].heightCm} cm`;
      if (latestGrowthSubEl) latestGrowthSubEl.textContent = `Logged on ${childGrowth[0].date}`;
    } else {
      latestGrowthEl.textContent = 'None yet';
      if (latestGrowthSubEl) latestGrowthSubEl.textContent = 'Log first measurement';
    }
  }

  // Active child name indicator in welcome banner
  const activeChildNameEl = document.getElementById('welcomeActiveChildName');
  if (activeChildNameEl && activeChild) {
    activeChildNameEl.textContent = activeChild.name;
  }
}

// Render Upcoming Appointments Spotlight in Overview
function renderOverviewUpcoming(db) {
  const container = document.getElementById('overviewUpcomingContainer');
  if (!container) return;

  const upcoming = db.appointments
    .filter(a => a.status === 'Confirmed' || a.status === 'Pending')
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  if (upcoming.length === 0) {
    container.innerHTML = `
      <div class="text-center py-4">
        <i class="bi bi-calendar-check text-muted" style="font-size: 2.5rem;"></i>
        <p class="mt-2 text-muted mb-3">No upcoming appointments scheduled.</p>
        <a href="appointments.html" class="btn btn-sm btn-primary">
          <i class="bi bi-plus-circle me-1"></i> Book an Appointment
        </a>
      </div>
    `;
    return;
  }

  const itemsHtml = upcoming.slice(0, 3).map(apt => `
    <div class="p-3 mb-2 rounded-3 border bg-light d-flex flex-wrap align-items-center justify-content-between gap-3">
      <div class="d-flex align-items-center gap-3">
        <div class="bg-white p-2 rounded-3 border text-center" style="min-width: 58px;">
          <span class="d-block fw-bold text-primary" style="font-size: 1.1rem; line-height: 1;">${apt.date.split('-')[2]}</span>
          <small class="text-uppercase fw-bold text-muted" style="font-size: 0.675rem;">${getMonthAbbr(apt.date)}</small>
        </div>
        <div>
          <h6 class="fw-bold mb-1">${apt.service}</h6>
          <div class="d-flex flex-wrap align-items-center gap-2 text-muted" style="font-size: 0.8rem;">
            <span><i class="bi bi-person me-1"></i>${apt.childName}</span>
            <span>•</span>
            <span><i class="bi bi-hospital me-1"></i>${apt.doctorName}</span>
            <span>•</span>
            <span><i class="bi bi-clock me-1"></i>${apt.time}</span>
          </div>
        </div>
      </div>
      <div class="d-flex align-items-center gap-2">
        <span class="badge ${apt.status === 'Confirmed' ? 'badge-status-confirmed' : 'badge-status-pending'} px-2 py-1" style="border-radius: 9999px;">
          ${apt.status}
        </span>
        <a href="appointments.html" class="btn btn-sm btn-outline-secondary py-1 px-2" style="font-size: 0.775rem;">Manage</a>
      </div>
    </div>
  `).join('');

  container.innerHTML = itemsHtml;
}

function getMonthAbbr(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleString('default', { month: 'short' });
}

// Render Overview Pending Vaccines Banner
function renderOverviewVaccines(db) {
  const container = document.getElementById('overviewVaccineAlert');
  if (!container) return;

  const activeChildId = db.currentUser.activeChildId;
  const activeChild = db.children.find(c => c.id === activeChildId) || db.children[0];

  const pending = db.vaccinations.filter(v => 
    (!activeChildId || v.childId === activeChildId) && 
    (v.status === 'Upcoming' || v.status === 'Overdue')
  );

  if (pending.length === 0) {
    container.innerHTML = `
      <div class="alert alert-success d-flex align-items-center gap-3 border-0 rounded-4 p-3 mb-0">
        <i class="bi bi-shield-check fs-2 text-success"></i>
        <div>
          <h6 class="fw-bold mb-1">Great Job! Vaccinations Up to Date</h6>
          <p class="mb-0 text-muted" style="font-size: 0.85rem;">${activeChild ? activeChild.name : 'Your child'} is completely up to date with the recommended pediatric immunizations.</p>
        </div>
      </div>
    `;
    return;
  }

  const nextVac = pending[0];
  container.innerHTML = `
    <div class="alert alert-warning d-flex flex-wrap align-items-center justify-content-between gap-3 border-0 rounded-4 p-3 mb-0" style="background-color: #FFFBEB;">
      <div class="d-flex align-items-center gap-3">
        <div class="p-2 rounded-circle bg-warning text-white d-flex align-items-center justify-content-center" style="width: 44px; height: 44px;">
          <i class="bi bi-bandaid fs-5"></i>
        </div>
        <div>
          <h6 class="fw-bold text-dark mb-1">Upcoming Vaccine: ${nextVac.name}</h6>
          <p class="mb-0 text-muted" style="font-size: 0.85rem;">Recommended for ${activeChild ? activeChild.name : 'your child'} (${nextVac.ageGroup}) • Due: ${nextVac.dueDate}</p>
        </div>
      </div>
      <div>
        <a href="vaccinations.html" class="btn btn-sm btn-primary">View Full Schedule</a>
      </div>
    </div>
  `;
}

// Render Recent Activities Timeline in Overview
function renderRecentActivities(db) {
  const container = document.getElementById('overviewActivitiesList');
  if (!container) return;

  const activities = [
    {
      icon: "bi-check2-circle text-success",
      title: "6-Week Immunization DTaP booster marked completed",
      date: "Oct 18, 2026",
      child: "Maya Jenkins"
    },
    {
      icon: "bi-calendar-event text-primary",
      title: "Appointment booked with Dr. Sophia Martinez",
      date: "Oct 14, 2026",
      child: "Leo Jenkins"
    },
    {
      icon: "bi-graph-up-arrow text-info",
      title: "Growth entry logged: 12.6 kg, 87.2 cm",
      date: "Oct 10, 2026",
      child: "Leo Jenkins"
    },
    {
      icon: "bi-file-medical text-warning",
      title: "Visit summary recorded by Dr. Priya Patel",
      date: "Sep 18, 2026",
      child: "Leo Jenkins"
    }
  ];

  container.innerHTML = activities.map(act => `
    <div class="d-flex align-items-start gap-3 py-2 border-bottom">
      <i class="bi ${act.icon} fs-5 mt-1"></i>
      <div class="flex-grow-1">
        <p class="fw-bold mb-0 text-dark" style="font-size: 0.875rem;">${act.title}</p>
        <small class="text-muted" style="font-size: 0.775rem;">Child: ${act.child} • ${act.date}</small>
      </div>
    </div>
  `).join('');
}
