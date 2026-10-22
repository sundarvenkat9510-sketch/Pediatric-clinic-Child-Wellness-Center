/**
 * LittleCare Pediatric Clinic
 * Demo Authentication & Session Management (LocalStorage)
 */

// Route Guard: Ensure parent is logged in on dashboard pages
function requireAuth() {
  const db = getDB();
  if (!db.currentUser) {
    window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.pathname.split('/').pop());
  }
}

// Route Guard: Optional redirect helper (allows parent to view and test login/register anytime)
function redirectIfAuth() {
  // Retain access so demo forms are always viewable
}

// Show / Hide Password Toggler
function togglePasswordVisibility(inputId, iconId) {
  const input = document.getElementById(inputId);
  const icon = document.getElementById(iconId);
  if (!input || !icon) return;

  if (input.type === 'password') {
    input.type = 'text';
    icon.classList.remove('bi-eye');
    icon.classList.add('bi-eye-slash');
  } else {
    input.type = 'password';
    icon.classList.remove('bi-eye-slash');
    icon.classList.add('bi-eye');
  }
}

// Fill Demo Credentials for instant testing
function fillDemoCredentials() {
  const emailInput = document.getElementById('loginEmail');
  const passInput = document.getElementById('loginPassword');
  if (emailInput && passInput) {
    emailInput.value = 'sarah.parent@example.com';
    passInput.value = 'LittleCare2026!';
    showToast('Demo credentials auto-filled. Click "Login" to continue!', 'primary');
  }
}

// Handle Login Form Submission
function handleLogin(event) {
  event.preventDefault();
  const emailInput = document.getElementById('loginEmail');
  const passInput = document.getElementById('loginPassword');
  const errorAlert = document.getElementById('loginErrorAlert');

  if (errorAlert) errorAlert.classList.add('d-none');

  const email = emailInput.value.trim().toLowerCase();
  const password = passInput.value.trim();

  // Basic validation
  if (!email || !password) {
    showLoginError('Please enter both email and password.');
    return;
  }

  if (password.length < 6) {
    showLoginError('Password must be at least 6 characters long.');
    return;
  }

  const db = getDB();

  // Demo check - allows standard demo or creates new session for any entered test email
  const parentName = email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  db.currentUser = {
    id: db.currentUser?.id || "parent-1",
    name: db.currentUser?.email.toLowerCase() === email ? db.currentUser.name : (parentName || "Sarah Jenkins"),
    email: email,
    phone: db.currentUser?.phone || "+1 (555) 234-5678",
    avatar: db.currentUser?.avatar || "assets/images/parent-avatar.svg",
    activeChildId: db.currentUser?.activeChildId || (db.children[0]?.id || "child-1")
  };

  saveDB(db);

  showToast(`Welcome back, ${db.currentUser.name}! Redirecting to dashboard...`, 'success');

  const urlParams = new URLSearchParams(window.location.search);
  const redirectTarget = urlParams.get('redirect') || 'dashboard.html';

  setTimeout(() => {
    window.location.href = redirectTarget;
  }, 900);
}

function showLoginError(msg) {
  const errorAlert = document.getElementById('loginErrorAlert');
  if (errorAlert) {
    errorAlert.textContent = msg;
    errorAlert.classList.remove('d-none');
  } else {
    showToast(msg, 'danger');
  }
}

// Validate email format
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Validate phone format
function isValidPhone(phone) {
  // Allow international/standard formats with at least 8 digits
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 8 && digits.length <= 15;
}

// Set field error state with message
function setFieldError(fieldId, errorId, message) {
  const field = document.getElementById(fieldId);
  const errorEl = document.getElementById(errorId);
  if (field) field.classList.add('is-invalid');
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.classList.remove('d-none');
  }
}

// Clear all field error states
function clearFieldErrors() {
  document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
  document.querySelectorAll('.invalid-feedback').forEach(el => el.textContent = '');
  const globalError = document.getElementById('regErrorAlert');
  if (globalError) globalError.classList.add('d-none');
}

// Handle Registration Form Submission
function handleRegister(event) {
  event.preventDefault();
  clearFieldErrors();

  const nameInput = document.getElementById('regName');
  const emailInput = document.getElementById('regEmail');
  const phoneInput = document.getElementById('regPhone');
  const passInput = document.getElementById('regPassword');
  const confirmPassInput = document.getElementById('regConfirmPassword');
  const termsCheckbox = document.getElementById('regTerms');

  const name = nameInput?.value.trim() || '';
  const email = emailInput?.value.trim().toLowerCase() || '';
  const phone = phoneInput?.value.trim() || '';
  const password = passInput?.value || '';
  const confirmPassword = confirmPassInput?.value || '';
  const termsAccepted = termsCheckbox?.checked || false;

  let hasError = false;

  // 1. Validate Full Name
  if (!name) {
    setFieldError('regName', 'regNameFeedback', 'Please enter your full name.');
    hasError = true;
  } else if (name.length < 2) {
    setFieldError('regName', 'regNameFeedback', 'Name must be at least 2 characters.');
    hasError = true;
  }

  // 2. Validate Email
  if (!email) {
    setFieldError('regEmail', 'regEmailFeedback', 'Email address is required.');
    hasError = true;
  } else if (!isValidEmail(email)) {
    setFieldError('regEmail', 'regEmailFeedback', 'Please enter a valid email address (e.g., name@example.com).');
    hasError = true;
  }

  // 3. Validate Phone Number
  if (!phone) {
    setFieldError('regPhone', 'regPhoneFeedback', 'Phone number is required.');
    hasError = true;
  } else if (!isValidPhone(phone)) {
    setFieldError('regPhone', 'regPhoneFeedback', 'Please enter a valid phone number (minimum 8 digits).');
    hasError = true;
  }

  // 4. Validate Password
  if (!password) {
    setFieldError('regPassword', 'regPasswordFeedback', 'Please create a password.');
    hasError = true;
  } else if (password.length < 6) {
    setFieldError('regPassword', 'regPasswordFeedback', 'Password must be at least 6 characters long.');
    hasError = true;
  } else if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
    setFieldError('regPassword', 'regPasswordFeedback', 'Password should contain at least one letter and one number.');
    hasError = true;
  }

  // 5. Validate Password Match
  if (!confirmPassword) {
    setFieldError('regConfirmPassword', 'regConfirmPasswordFeedback', 'Please confirm your password.');
    hasError = true;
  } else if (password !== confirmPassword) {
    setFieldError('regConfirmPassword', 'regConfirmPasswordFeedback', 'Passwords do not match. Please verify.');
    hasError = true;
  }

  // 6. Validate Terms Acceptance
  if (!termsAccepted) {
    const termsFeedback = document.getElementById('regTermsFeedback');
    if (termsFeedback) termsFeedback.textContent = 'You must accept the Terms & Conditions and Privacy Policy.';
    if (termsCheckbox) termsCheckbox.classList.add('is-invalid');
    hasError = true;
  }

  if (hasError) {
    const errorAlert = document.getElementById('regErrorAlert');
    if (errorAlert) {
      errorAlert.textContent = 'Please correct the highlighted fields above.';
      errorAlert.classList.remove('d-none');
    }
    return;
  }

  // Form is valid: Process demo registration
  const db = getDB();
  const parentId = 'parent-' + Date.now();
  const firstChildId = 'child-' + Date.now();

  // Create initial demo child profile
  const defaultChild = {
    id: firstChildId,
    parentId: parentId,
    name: "My Child",
    dob: "2024-06-15",
    gender: "Boy",
    bloodGroup: "O+",
    allergies: "None reported",
    avatar: "assets/images/boy-avatar.svg",
    pediatrician: "Dr. Sophia Martinez",
    notes: "Newly created family profile. Update details anytime."
  };
  db.children.unshift(defaultChild);

  // Store demo parent session (without plain-text password)
  db.currentUser = {
    id: parentId,
    name: name,
    email: email,
    phone: phone,
    avatar: "assets/images/parent-avatar.svg",
    activeChildId: firstChildId,
    isDemoAccount: true,
    createdAt: new Date().toISOString()
  };

  saveDB(db);

  // Show Success Message
  const successAlert = document.getElementById('regSuccessAlert');
  if (successAlert) {
    successAlert.innerHTML = `
      <i class="bi bi-check-circle-fill me-2 fs-5"></i>
      <div>
        <strong>Registration Successful!</strong> Welcome to LittleCare, <strong>${name}</strong>. Redirecting you to your parent dashboard...
      </div>
    `;
    successAlert.classList.remove('d-none');
    successAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  const submitBtn = document.getElementById('regSubmitBtn');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Creating Account...`;
  }

  showToast(`Welcome to LittleCare, ${name}! Setting up your dashboard...`, 'success');

  setTimeout(() => {
    window.location.href = 'dashboard.html';
  }, 1200);
}

function showRegError(msg) {
  const errorAlert = document.getElementById('regErrorAlert');
  if (errorAlert) {
    errorAlert.textContent = msg;
    errorAlert.classList.remove('d-none');
  } else {
    showToast(msg, 'danger');
  }
}

// Handle Forgot Password Modal Request
function handleForgotPassword(event) {
  event.preventDefault();
  const resetEmail = document.getElementById('resetEmail')?.value.trim();
  if (!resetEmail) {
    alert("Please enter your registered email address.");
    return;
  }

  const modalEl = document.getElementById('forgotPasswordModal');
  if (modalEl && window.bootstrap) {
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();
  }

  showToast(`Demo password reset link has been dispatched to ${resetEmail}. Check your inbox!`, 'primary');
}

// User Logout
function handleLogout() {
  if (confirm("Are you sure you want to sign out of LittleCare?")) {
    const db = getDB();
    db.currentUser = null;
    saveDB(db);
    showToast("Signed out successfully. See you soon!", "primary");
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 600);
  }
}
