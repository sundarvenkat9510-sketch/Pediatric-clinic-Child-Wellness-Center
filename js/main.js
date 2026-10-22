/**
 * LittleCare Pediatric Clinic & Child Wellness Center
 * Global Utilities, Mock Data Seeding & Event Handlers
 */

const STORAGE_KEY = 'littlecare_db';

// Default initial dataset for demonstration
const DEFAULT_SEED_DATA = {
  currentUser: {
    id: "parent-1",
    name: "Sarah Jenkins",
    email: "sarah.parent@example.com",
    phone: "+1 (555) 234-5678",
    avatar: "assets/images/parent-avatar.svg",
    activeChildId: "child-1"
  },
  children: [
    {
      id: "child-1",
      parentId: "parent-1",
      name: "Leo Jenkins",
      dob: "2024-04-12",
      gender: "Boy",
      bloodGroup: "O+",
      allergies: "Seasonal pollen (mild)",
      avatar: "assets/images/boy-avatar.svg",
      pediatrician: "Dr. Sophia Martinez",
      notes: "Enjoys dinosaur stickers after checkups. Mild eczema in winter."
    },
    {
      id: "child-2",
      parentId: "parent-1",
      name: "Maya Jenkins",
      dob: "2025-10-15",
      gender: "Girl",
      bloodGroup: "A+",
      allergies: "None reported",
      avatar: "assets/images/girl-avatar.svg",
      pediatrician: "Dr. Ethan Hayes",
      notes: "Transitioning to solid purees. Sleeping 10 hours overnight."
    }
  ],
  doctors: [
    {
      id: "doc-1",
      name: "Dr. Sophia Martinez",
      title: "MD, FAAP – Lead Pediatrician",
      specialty: "General Pediatrics & Newborn Care",
      experience: "14 Years",
      rating: 4.9,
      reviews: 138,
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=500&q=80",
      days: "Mon, Tue, Thu",
      hours: "09:00 AM – 02:00 PM",
      bio: "Dr. Sophia Martinez is a board-certified pediatrician with over 14 years of dedicated experience supporting families from the first newborn smile through adolescent growth.",
      education: "Harvard Medical School, Boston Children's Hospital Residency",
      room: "Clinic Room 204"
    },
    {
      id: "doc-2",
      name: "Dr. Ethan Hayes",
      title: "MD, FAAP – Pediatric Pulmonologist",
      specialty: "Pediatric Allergy & Asthma",
      experience: "11 Years",
      rating: 4.8,
      reviews: 95,
      image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=500&q=80",
      days: "Tue, Wed, Fri",
      hours: "10:00 AM – 04:30 PM",
      bio: "Specializing in childhood asthma management, food sensitivities, environmental allergies, and proactive respiratory health.",
      education: "Johns Hopkins School of Medicine",
      room: "Clinic Room 102"
    },
    {
      id: "doc-3",
      name: "Dr. Priya Patel",
      title: "MD, DCH – Developmental Specialist",
      specialty: "Growth & Child Behavioral Wellness",
      experience: "9 Years",
      rating: 4.9,
      reviews: 114,
      image: "https://images.unsplash.com/photo-1594824813576-96b610c85c3b?auto=format&fit=crop&w=500&q=80",
      days: "Mon, Wed, Sat",
      hours: "08:30 AM – 01:30 PM",
      bio: "Expert in neurodevelopmental milestone screening, speech and motor delays, sleep coaching, and constructive behavioral guidance.",
      education: "Stanford University School of Medicine",
      room: "Clinic Room 305"
    },
    {
      id: "doc-4",
      name: "Dr. Marcus Vance",
      title: "MD, FAAP – Pediatric Cardiologist",
      specialty: "Pediatric Cardiology & Sports Medicine",
      experience: "16 Years",
      rating: 5.0,
      reviews: 152,
      image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=500&q=80",
      days: "Mon, Thu, Fri",
      hours: "01:00 PM – 05:30 PM",
      bio: "Dedicated to congenital heart screening, athletic physical clearance, murmur evaluations, and cardiovascular wellness for young champions.",
      education: "Columbia University Vagelos College of Physicians and Surgeons",
      room: "Clinic Room 210"
    },
    {
      id: "doc-5",
      name: "Dr. Claire Chen",
      title: "MD, MS – Pediatric Nutritionist",
      specialty: "Infant Feeding & Child Nutrition",
      experience: "8 Years",
      rating: 4.8,
      reviews: 82,
      image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=500&q=80",
      days: "Wed, Thu, Sat",
      hours: "09:30 AM – 03:00 PM",
      bio: "Passionate about infant lactation transitions, introducing solids safely, toddler picky eating challenges, and pediatric nutrient rebalancing.",
      education: "UCLA David Geffen School of Medicine",
      room: "Clinic Room 108"
    }
  ],
  appointments: [
    {
      id: "apt-1",
      childId: "child-1",
      childName: "Leo Jenkins",
      doctorId: "doc-1",
      doctorName: "Dr. Sophia Martinez",
      service: "Well-Child Visit & Developmental Checkup",
      date: "2026-11-05",
      time: "10:00 AM",
      room: "Clinic Room 204",
      status: "Confirmed",
      notes: "Annual toddler 2.5-year wellness review and speech milestones."
    },
    {
      id: "apt-2",
      childId: "child-2",
      childName: "Maya Jenkins",
      doctorId: "doc-2",
      doctorName: "Dr. Ethan Hayes",
      service: "Childhood Vaccinations & Infant Checkup",
      date: "2026-11-12",
      time: "11:30 AM",
      room: "Clinic Room 102",
      status: "Confirmed",
      notes: "Scheduled for 12-month booster vaccines and weight check."
    },
    {
      id: "apt-3",
      childId: "child-1",
      childName: "Leo Jenkins",
      doctorId: "doc-3",
      doctorName: "Dr. Priya Patel",
      service: "Mild Cold & Cough Consultation",
      date: "2026-09-18",
      time: "02:00 PM",
      room: "Clinic Room 305",
      status: "Completed",
      notes: "Clear lungs, viral upper respiratory cold. Prescribed saline drops & hydration."
    }
  ],
  vaccinations: [
    {
      id: "vac-1",
      childId: "child-1",
      childName: "Leo Jenkins",
      name: "Hepatitis B (HepB) - Dose 1",
      protectsAgainst: "Hepatitis B viral liver infection",
      ageGroup: "At Birth",
      dueDate: "2024-04-12",
      status: "Completed",
      administeredDate: "2024-04-12",
      administeredBy: "Dr. Sophia Martinez"
    },
    {
      id: "vac-2",
      childId: "child-1",
      childName: "Leo Jenkins",
      name: "DTaP, IPV, Hib, PCV - 6 Weeks",
      protectsAgainst: "Diphtheria, Tetanus, Pertussis, Polio, Hib, Pneumococcal",
      ageGroup: "6 Weeks",
      dueDate: "2024-05-25",
      status: "Completed",
      administeredDate: "2024-05-26",
      administeredBy: "Dr. Sophia Martinez"
    },
    {
      id: "vac-3",
      childId: "child-1",
      childName: "Leo Jenkins",
      name: "MMR & Varicella (Dose 1)",
      protectsAgainst: "Measles, Mumps, Rubella & Chickenpox",
      ageGroup: "12 - 15 Months",
      dueDate: "2025-05-10",
      status: "Completed",
      administeredDate: "2025-05-12",
      administeredBy: "Dr. Sophia Martinez"
    },
    {
      id: "vac-4",
      childId: "child-1",
      childName: "Leo Jenkins",
      name: "Annual Influenza Vaccine",
      protectsAgainst: "Seasonal Flu strains",
      ageGroup: "2 - 3 Years",
      dueDate: "2026-11-10",
      status: "Upcoming",
      administeredDate: "",
      administeredBy: ""
    },
    {
      id: "vac-5",
      childId: "child-2",
      childName: "Maya Jenkins",
      name: "Hepatitis B (HepB) - Dose 1",
      protectsAgainst: "Hepatitis B viral liver infection",
      ageGroup: "At Birth",
      dueDate: "2025-10-15",
      status: "Completed",
      administeredDate: "2025-10-15",
      administeredBy: "Dr. Ethan Hayes"
    },
    {
      id: "vac-6",
      childId: "child-2",
      childName: "Maya Jenkins",
      name: "DTaP, IPV, PCV, Hib - 6 Weeks",
      protectsAgainst: "Diphtheria, Tetanus, Whooping Cough, Polio",
      ageGroup: "6 Weeks",
      dueDate: "2025-11-28",
      status: "Completed",
      administeredDate: "2025-11-29",
      administeredBy: "Dr. Ethan Hayes"
    },
    {
      id: "vac-7",
      childId: "child-2",
      childName: "Maya Jenkins",
      name: "MMR Dose 1 (Measles, Mumps, Rubella)",
      protectsAgainst: "Measles, Mumps, Rubella",
      ageGroup: "12 Months",
      dueDate: "2026-10-25",
      status: "Upcoming",
      administeredDate: "",
      administeredBy: ""
    }
  ],
  growthRecords: [
    {
      id: "gr-1",
      childId: "child-1",
      date: "2024-04-12",
      ageMonths: 0,
      heightCm: 50.2,
      weightKg: 3.4,
      headCircumferenceCm: 35.0,
      percentile: "50th Percentile",
      notes: "Birth measurements. Healthy full term delivery."
    },
    {
      id: "gr-2",
      childId: "child-1",
      date: "2024-10-15",
      ageMonths: 6,
      heightCm: 67.5,
      weightKg: 7.9,
      headCircumferenceCm: 43.2,
      percentile: "55th Percentile",
      notes: "6-month checkup. Smiling, sitting with support."
    },
    {
      id: "gr-3",
      childId: "child-1",
      date: "2025-04-20",
      ageMonths: 12,
      heightCm: 76.0,
      weightKg: 10.1,
      headCircumferenceCm: 46.1,
      percentile: "52nd Percentile",
      notes: "1st Birthday checkup! Cruising along furniture, babbling happily."
    },
    {
      id: "gr-4",
      childId: "child-1",
      date: "2025-10-22",
      ageMonths: 18,
      heightCm: 82.5,
      weightKg: 11.4,
      headCircumferenceCm: 47.8,
      percentile: "54th Percentile",
      notes: "Walking steadily, 15+ words, great motor coordination."
    },
    {
      id: "gr-5",
      childId: "child-1",
      date: "2026-04-18",
      ageMonths: 24,
      heightCm: 87.2,
      weightKg: 12.6,
      headCircumferenceCm: 48.6,
      percentile: "55th Percentile",
      notes: "2-year wellness check. Speaking 2-word phrases. Active and thriving."
    },
    {
      id: "gr-6",
      childId: "child-2",
      date: "2025-10-15",
      ageMonths: 0,
      heightCm: 49.5,
      weightKg: 3.2,
      headCircumferenceCm: 34.5,
      percentile: "48th Percentile",
      notes: "Birth entry. Thriving infant."
    },
    {
      id: "gr-7",
      childId: "child-2",
      date: "2026-04-20",
      ageMonths: 6,
      heightCm: 65.8,
      weightKg: 7.4,
      headCircumferenceCm: 42.5,
      percentile: "50th Percentile",
      notes: "6-month well-child visit. Rolling over both ways."
    }
  ],
  healthRecords: [
    {
      id: "hr-1",
      childId: "child-1",
      date: "2026-09-18",
      type: "Illness Visit",
      doctor: "Dr. Priya Patel",
      diagnosis: "Mild Viral Upper Respiratory Tract Infection",
      findings: "Temperature: 99.4°F, Throat mildly erythematous, clear chest.",
      instructions: "Keep hydrated, saline nasal drops 3x/day, cool-mist humidifier.",
      prescriptions: "Infant Paracetamol 120mg as needed for fever."
    },
    {
      id: "hr-2",
      childId: "child-1",
      date: "2026-04-18",
      type: "Well-Child Exam",
      doctor: "Dr. Sophia Martinez",
      diagnosis: "24-Month Pediatric Milestone Assessment",
      findings: "Normal cardiopulmonary examination. Excellent cognitive and physical growth.",
      instructions: "Continue balanced whole foods diet, encourage outdoor play, limit screen time.",
      prescriptions: "Multivitamin with Vitamin D drops 400 IU daily."
    },
    {
      id: "hr-3",
      childId: "child-2",
      date: "2026-04-20",
      type: "Well-Child Exam",
      doctor: "Dr. Ethan Hayes",
      diagnosis: "6-Month Infant Wellness & Nutrition Consult",
      findings: "Weight & height tracking right on 50th percentile. Good eye contact & muscle tone.",
      instructions: "Begin single-grain cereal and soft vegetable purees (sweet potato, avocado).",
      prescriptions: "Vitamin D3 drops 400 IU/day."
    }
  ],
  parentNotes: [
    {
      id: "pn-1",
      childId: "child-1",
      date: "2026-10-10",
      title: "Mild cough after playground",
      content: "Coughed for 10 minutes after running. Settled quickly after drinking warm water. Monitor during soccer."
    },
    {
      id: "pn-2",
      childId: "child-2",
      date: "2026-10-18",
      title: "First avocado tasting",
      content: "Loved mashed avocado with breast milk. No rash or digestive upset observed after 48 hours."
    }
  ]
};

// Database helper functions
function getDB() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SEED_DATA));
    return JSON.parse(JSON.stringify(DEFAULT_SEED_DATA));
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error("Error parsing database, resetting to seed data:", e);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SEED_DATA));
    return JSON.parse(JSON.stringify(DEFAULT_SEED_DATA));
  }
}

function saveDB(db) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

function resetDemoData() {
  if (confirm("Reset all demo data back to default sample records? Any custom children or bookings will be restored to initial sample state.")) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SEED_DATA));
    showToast("Demo data successfully reset to initial defaults!", "success");
    setTimeout(() => {
      window.location.reload();
    }, 800);
  }
}

// Toast Notification System
function showToast(message, type = 'primary') {
  let toastContainer = document.getElementById('toastContainer');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toastContainer';
    toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
    toastContainer.style.zIndex = '9999';
    document.body.appendChild(toastContainer);
  }

  const icons = {
    success: 'bi-check-circle-fill text-success',
    danger: 'bi-exclamation-triangle-fill text-danger',
    warning: 'bi-exclamation-circle-fill text-warning',
    primary: 'bi-info-circle-fill text-primary'
  };

  const toastId = 'toast_' + Date.now();
  const toastHtml = `
    <div id="${toastId}" class="toast align-items-center border-0 shadow-lg" role="alert" aria-live="assertive" aria-atomic="true" style="border-radius: 1rem; background: #FFFFFF;">
      <div class="d-flex align-items-center p-3">
        <i class="bi ${icons[type] || icons.primary} fs-4 me-3"></i>
        <div class="toast-body p-0 text-dark fw-semibold" style="font-size: 0.925rem;">
          ${message}
        </div>
        <button type="button" class="btn-close ms-auto me-1" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    </div>
  `;

  toastContainer.insertAdjacentHTML('beforeend', toastHtml);
  const toastEl = document.getElementById(toastId);
  if (window.bootstrap && window.bootstrap.Toast) {
    const bsToast = new bootstrap.Toast(toastEl, { delay: 4000 });
    bsToast.show();
    toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
  } else {
    setTimeout(() => toastEl.remove(), 4000);
  }
}

// Age calculator from DOB
function calculateAgeString(dobString) {
  if (!dobString) return "N/A";
  const dob = new Date(dobString);
  const now = new Date();
  
  let months = (now.getFullYear() - dob.getFullYear()) * 12 + (now.getMonth() - dob.getMonth());
  if (now.getDate() < dob.getDate()) months--;
  
  if (months < 0) return "Newborn";
  if (months < 1) {
    const diffDays = Math.floor((now - dob) / (1000 * 60 * 60 * 24));
    return `${Math.max(1, diffDays)} days old`;
  }
  if (months < 24) {
    return `${months} mos old`;
  }
  const years = Math.floor(months / 12);
  const remMonths = months % 12;
  return remMonths > 0 ? `${years} yrs ${remMonths} mos` : `${years} yrs old`;
}

// Global DOM Ready Handlers
document.addEventListener('DOMContentLoaded', () => {
  // Ensure DB initialized
  getDB();

  // Highlight active link in navbar
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-custom .nav-link, .sidebar-nav .nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // Back to Top button
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    });
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Ensure navbar action buttons (Dashboard, Parent Login, Sign Up) in their proper positions
  const navDashboardBtn = document.getElementById('navDashboardBtn');
  const navAuthBtn = document.getElementById('navAuthBtn');
  const navSignUpBtn = document.getElementById('navSignUpBtn');

  if (navDashboardBtn) {
    navDashboardBtn.classList.remove('d-none');
    navDashboardBtn.href = 'dashboard.html';
  }

  if (navAuthBtn) {
    navAuthBtn.classList.remove('d-none');
    navAuthBtn.innerHTML = `<i class="bi bi-box-arrow-in-right me-1"></i> Parent Login`;
    navAuthBtn.href = 'login.html';
  }

  if (navSignUpBtn) {
    navSignUpBtn.classList.remove('d-none');
    navSignUpBtn.innerHTML = `<i class="bi bi-person-plus me-1"></i> Sign Up`;
    navSignUpBtn.href = 'register.html';
  }

  // Prevent browser caret cursor from appearing on non-editable elements when clicked across all pages
  document.addEventListener('click', (e) => {
    if (!e.target.closest('input, textarea, select, [contenteditable="true"]')) {
      if (window.getSelection) {
        window.getSelection().removeAllRanges();
      }
    }
  });
});
