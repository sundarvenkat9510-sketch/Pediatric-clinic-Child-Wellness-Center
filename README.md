# LittleCare – Pediatric Clinic & Child Wellness Center Website

**LittleCare** is a modern, responsive, healthcare frontend website and Parent Portal designed for a Pediatric Clinic & Child Wellness Center.

---

## 🌟 Key Features

### 1. Public Clinic Website
- **Home Page (`index.html`):** Welcoming hero section (*"Healthy Kids, Happy Futures"*), key pediatric services, *"Why Choose LittleCare?"* value pillars, featured doctors preview, parent testimonials, clinic hours, contact details, and emergency notices.
- **Services Page (`services.html`):** Detailed service catalog (Well-Child Visits, Childhood Vaccinations, Growth Monitoring, Nutrition Guidance, Newborn Care, and General Pediatric Consultations) with visit preparation FAQs.
- **Doctors Directory (`doctors.html`):** Interactive doctor directory with real-time search and specialty filtering (General Pediatrics, Allergy & Asthma, Developmental, Cardiology, Nutrition) and detailed Doctor Profile Modal.
- **About Us Page (`about.html`):** Clinic history, mission & vision, pediatric care values, and sensory-friendly environment showcase.
- **Contact Page (`contact.html`):** Clinic location, hours, validated contact form with feedback alerts, embedded map placeholder, and acute emergency notice.

### 2. Parent Authentication & Session
- **Login (`login.html`):** Demo parent authentication, show/hide password toggle, *"Fill Demo Credentials"* one-click quick tester, and forgot password modal.
- **Sign Up / Register (`register.html`):** New parent registration with validation for name, email format, phone, password security, terms agreement, and success alerts.
- **Client-Side Persistence:** Powered by browser `LocalStorage` with pre-seeded sample data.

### 3. Parent Dashboard System
- **Dashboard Overview (`dashboard.html`):**
  - Summary metric cards: Total Children, Upcoming Appointments, Pending Vaccinations, Latest Growth update.
  - Active child profile switcher dropdown in the top bar.
  - Spotlight cards for upcoming appointments and pending vaccine reminders.
  - Recent pediatric activity audit log.
- **My Children (`children.html`):**
  - Full CRUD management of child profiles (name, date of birth, gender, blood group, allergies, pediatrician, notes, avatar).
  - Dynamic age calculation (e.g., *"2 yrs 6 mos old"*).
  - Safety protection preventing deletion of the last remaining child profile.
- **Appointment Management (`appointments.html`):**
  - Interactive appointment booking with doctor selection, visit type, time slot, and date validation (past dates disabled).
  - Filter appointments by status: All, Upcoming, Completed, and Cancelled.
  - Cancel appointment confirmation.
- **Vaccination Schedule (`vaccinations.html`):**
  - CDC/AAP pediatric immunization schedule roadmap.
  - Visual completion progress bar.
  - Interactive *"Mark as Completed"* action with administration date and provider recording.
  - Filter by All, Completed, Upcoming, and Overdue.
  - Printable Immunization Card preview (`window.print()`).
- **Interactive Growth Charts (`growth-charts.html`):**
  - Powered by **Chart.js**.
  - **Height vs Age (cm)** compared against WHO 50th percentile reference median curve.
  - **Weight vs Age (kg)** compared against WHO 50th percentile reference median curve.
  - *"Log New Measurement"* form and historical measurement table with delete action.
- **Health Records (`health-records.html`):**
  - Categorized tabs: Visit Summaries with doctor findings and care instructions, Prescriptions & supplements, and Parent Home Observations notes.

---

## 🛠️ Technology Stack
- **HTML5:** Semantic, accessible multi-page structure.
- **CSS3:** Custom design system (`css/style.css`, `css/dashboard.css`, `css/responsive.css`) using Google Fonts (*Poppins* & *Nunito*), soft sky blue, mint green, and warm pastel palettes.
- **JavaScript (ES6):** Modular client-side logic (`main.js`, `auth.js`, `dashboard.js`, `children.js`, `appointments.js`, `vaccinations.js`, `growth-charts.js`).
- **Bootstrap 5.3.3 & Bootstrap Icons:** Mobile-first layout, cards, offcanvas navigation, and modal dialogues.
- **Chart.js 4.4.2 (CDN):** Responsive growth curves.
- **Browser LocalStorage:** Zero-dependency mock database with instant reset capability.

---

## 🚀 How to Run Locally

### Option 1: Live Server in VS Code (Recommended)
1. Open the project folder in **Visual Studio Code**:
   ```bash
   code "e:\Clinic Project"
   ```
2. If you don't already have it, install the **Live Server** extension by *Ritwick Dey* from the VS Code Marketplace.
3. Right-click on `index.html` in the file explorer and click **"Open with Live Server"**.
4. The website will launch automatically in your default browser at `http://127.0.0.1:5500/index.html`.

### Option 2: Direct Browser Launch
Simply double-click `index.html` (or drag and drop it into Chrome, Edge, Firefox, or Safari). All CDNs and relative paths will load immediately.

---

## 🔑 Demo Account Credentials
For quick evaluation of the Parent Dashboard:
- **Email:** `sarah.parent@example.com`
- **Password:** `LittleCare2026!` *(or click the **"Fill Demo Credentials"** button on `login.html`)*
- You can also register any new test email via `register.html`.

---

## 🔄 Resetting Demo Data
If you test adding or deleting child profiles or appointments and wish to restore the initial rich demo state:
- Click **"Reset Demo Data"** in the sidebar or footer of any page.
