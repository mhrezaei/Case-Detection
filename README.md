
# 🏥 Organ Donation Manager PWA

This project is a **Progressive Web App (PWA)** designed to accelerate, streamline, and automate the process of identifying and managing brain-dead cases for organ donation. This intelligent system empowers inspectors and medical staff to monitor patient statuses with high precision and speed, ensuring timely actions in critical situations.

---

## 🚀 About the Project

In the organ donation process, time is gold. This system is designed with a **Mobile-First** approach, allowing inspectors to register and track patient information anytime, anywhere (even inside Intensive Care Units) using their smartphones.

### ✨ Key Features

*   **Smart Case Management:** Accurate registration of patient data, Glasgow Coma Scale (GCS) tracking, and monitoring the workflow from "Probable Brain Death" to "Consent" or "Donation".
*   **Geolocation & GPS:** Automatic detection of the inspector's presence in hospitals and filtering the case list based on proximity to the user's current location.
*   **Offline Support (PWA):** Designed to function reliably in hospital environments with unstable internet connections.
*   **Detailed Audit Log:** A comprehensive timeline recording every change made to a case, including the exact time, the user responsible, and the location (Who, When, Where, What).
*   **Role-Based Access Control:** Distinct panels for System Admins, Inspectors, and Medical Staff.
*   **Management Dashboard:** Visualization of vital statistics and status distribution via interactive charts.
*   **Native Localization:** Fully Right-To-Left (RTL) design, utilizing "Vazirmatn" font, and automatic formatting of numbers and dates to Persian standards.

---

## 🛠 Tech Stack

This project is built using the most modern web development tools:

*   **Core:** React 19 + TypeScript (For type safety and high performance).
*   **Build Tool:** Vite (For lightning-fast builds).
*   **Styling:** Tailwind CSS (Modern, responsive design).
*   **Maps:** Leaflet (Lightweight interactive maps).
*   **Charts:** Recharts.
*   **Icons:** Lucide React.
*   **State Management:** Context API + useReducer (Clean architecture without heavy dependencies).

---

## 📱 Main Application Modules

1.  **Dashboard:** Overview of statistics, Smart Attendance Widget (GPS-based), and status charts.
2.  **New Case:** Smart registration form with geolocation capture, cascading hospital/ward selection, and validation.
3.  **Case List & Details:** Advanced filtering, sorting, edit capabilities, change logs/timeline, and file attachments (medical documents).
4.  **Hospital Management:** CRUD operations for medical centers, including map location setting and personnel management.
5.  **User Management:** Admin panel to approve new inspectors, assign roles, and edit personnel information.

---

## 🔧 Installation & Setup

To run the project locally, execute the following commands:

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Then open your browser and navigate to the address shown (usually `http://localhost:5173`).

### Test Credentials (Dev Mode)
In development mode, you can use any mobile number to log in. Use the following OTP codes to simulate different user states:
*   `12345`: Login as **Active Admin**.
*   `11111`: Login as **Pending User**.
*   `00000`: Simulate **Unregistered User** flow.

---

## 🤝 Architecture & Development

The project follows a modular architecture:
*   **Services:** Located in `services/`, currently utilizing mock data for development (Decoupled logic).
*   **Components:** Reusable UI elements located in `components/`.
*   **State:** Global application state is managed in `context/AppContext.tsx`.

---

<div align="center">
  <p>Powered by <a href="https://www.quarkino.com" target="_blank"><b>Quarkino</b></a></p>
  <p>All rights reserved.</p>
</div>
