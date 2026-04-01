# 📌 Calorie Tracker App – Capstone Project Proposal

## 📖 Project Overview
**Calorie Tracker** is a full-stack web application that allows users to log daily food intake, track calorie consumption, and monitor their health progress. 

This project includes a role-based admin dashboard, enabling administrators to manage users and system data efficiently. The application is designed with a clean architecture, modern UI, and cloud deployment to demonstrate professional full-stack development skills.

### 🎯 Target Users
* 👤 **Regular Users:** Students, gym-goers, and individuals tracking daily nutrition and calorie intake.
* 👑 **Admin Users:** System administrators managing user data and overseeing application content.

### 🚀 Core Features (Base App)
* ✅ **User Authentication:** Secure registration and login system.
* ✅ **Food Management:** Add, edit, and delete food entries (Full CRUD).
* 📅 **Daily Tracking:** Monitor calorie consumption per day.
* 📊 **Personal Dashboard:** Visual summary of total calories and history.
* ☁️ **Cloud Deployment:** Fully hosted on a Google Cloud Platform (GCP) VM.

---

## 🧱 Capability Boxes Implementation (110 pts Pathway)

### 🔐 1. Authentication + Roles (10 pts)
* JWT-based authentication system.
* **Two Roles:** `User` (manage personal data) and `Admin` (manage system-wide data).
* Protected routes using custom Express middleware.

### 🛠 2. Admin Panel (10 pts)
* Dedicated dashboard interface for administrators.
* Capabilities: View all users, manage all food entries, and edit/delete any record in the system.

### 🗄 3. Database Design (10 pts)
* **Tech:** MongoDB Atlas with Mongoose.
* **Schemas:** * `User`: email, password, role.
    * `FoodEntry`: name, calories, date, category, userId.
* **Relationship:** One-to-Many (One user → many food entries).

### 🔎 4. Search / Filter System (10 pts)
* Search food entries by name.
* Dynamic filtering by **Date** and **Category** (Breakfast, Lunch, Dinner).

### 🎨 5. UI / UX Design (10 pts)
* Responsive layout using **Bootstrap**.
* Clean navigation, visual calorie cards, and validated forms.

### 🐞 6. Debug Case Study (10 pts)
* **Issue:** Food entries not displaying after login.
* **Cause:** JWT token not included in API request headers.
* **Fix:** Updated frontend to send the Bearer token in headers and verified via backend middleware.

### 📊 7. Monitoring / Logging (10 pts)
* Server logging using middleware (Morgan/Custom).
* Global error handling to return structured JSON error responses.

---

## 🛠 Tech Stack
* **Frontend:** React.js
* **Backend:** Node.js + Express
* **Database:** MongoDB Atlas
* **Cloud:** Google Cloud VM (Compute Engine)
* **Web Server:** Nginx (Reverse Proxy)
* **Process Manager:** PM2
* **Security:** JWT (JSON Web Tokens)

---

## 📚 Product Backlog

### 🧩 Epic 1: Authentication
* **[High]** User registration & Login.
* **[Medium]** Role-based access control (RBAC).

### 🧩 Epic 2: Food Tracking
* **[High]** Food entry CRUD (Add/Edit/Delete).
* **[High]** Daily calorie summation logic.

### 🧩 Epic 3: Admin Dashboard
* **[High]** Global User/Entry management UI.
* **[Medium]** Admin-only API endpoints.

### 🧩 Epic 4: Search & Filter
* **[High]** Keyword search for food items.
* **[Medium]** Date-range filtering.

### 🧩 Epic 5: Deployment & DevOps
* **[High]** GCP VM Instance & Firewall setup.
* **[Medium]** Nginx & PM2 configuration.

---

## 🗓 Milestones

| Milestone | Goal | Timeline |
| :--- | :--- | :--- |
| **M1: Auth & Setup** | Project init & JWT Login/Register | Weeks 1–2 |
| **M2: CRUD System** | Food entry system & DB integration | Weeks 3–4 |
| **M3: Admin Panel** | RBAC & Admin UI features | Weeks 5–6 |
| **M4: UI & Search** | Responsive design & dynamic filtering | Weeks 7–8 |
| **M5: Deployment** | Final GCP hosting & Nginx setup | Week 9 |

---

## ✅ Repo Setup Checklist
- [x] Instructor added as collaborator.
- [x] README.md updated with this proposal.
- [x] GitHub Project board populated with backlog issues.
- [x] Milestones configured in GitHub.

---

## ☁️ Deployment / DevOps Details

### **GCP & Networking**
* Create Compute Engine VM.
* Open Firewall ports: `80` (HTTP), `443` (HTTPS), and `3000` (API testing).

### **Production Environment**
* **PM2:** Ensures the Node.js API restarts automatically on crashes or server reboots.
* **Nginx:** Functions as a reverse proxy to direct traffic from port 80 to the application.
* **Environment Variables (`.env`):**
    * `MONGO_URI`
    * `JWT_SECRET`
    * `PORT`
