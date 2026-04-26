# 📌 Calorie Tracker App – Capstone Project Proposal

## 📖 Project Overview
**Calorie Tracker** is a full-stack web application that allows users to log daily food intake, track calorie consumption, and monitor their health progress. 

This project includes a role-based admin dashboard, enabling administrators to manage users and system data efficiently. The application is designed with a clean monolithic architecture, modern UI, and cloud deployment to demonstrate professional full-stack development skills.

### 👥 Team Members
* **Nhu Tran** * **Thuan Nguyen**

### 🎯 Target Users
* 👤 **Regular Users:** Students, gym-goers, and individuals tracking calorie intake.
* 👑 **Admin Users:** System administrators managing user data and overseeing application content.

### 🚀 Core Features (Base App)
* ✅ **User Authentication:** Secure registration and login system.
* ✅ **Food Management:** Add, edit, and delete food entries (Full CRUD).
* 📅 **Daily Tracking:** Monitor calorie consumption per day.
* 📊 **Personal Dashboard:** Visual summary of total calories and history.
* ☁️ **Cloud Deployment:** Fully hosted on a Google Cloud Platform (GCP) VM.

---

## 🧱 Capability Boxes Implementation

| Capability Box                  | What We Did                                                                 | Evidence                                                                 | Notes |
|--------------------------------|-----------------------------------------------------------------------------|--------------------------------------------------------------------------|-------|
| **🔐 1. Authentication + Roles** | Built secure JWT registration, login, and role-based access (user/admin) with protected routes using custom middleware. | [Issue #1](https://github.com/Kise1205/final-project/issues/1)<br>[Issue #2](https://github.com/Kise1205/final-project/issues/2)<br>[Issue #3](https://github.com/Kise1205/final-project/issues/3)<br>[Issue #7](https://github.com/Kise1205/final-project/issues/7) | Learned to correctly split "Bearer " from the token string before verifying. |
| **🛠 2. Admin Panel**            | Created admin dashboard to view all users and manage (delete) any food entry in the system. | [Issue #8](https://github.com/Kise1205/final-project/issues/8)<br>[Issue #9](https://github.com/Kise1205/final-project/issues/9) | Only users with role = "admin" can access. Normal users are blocked by `isAdmin` middleware. |
| **🗄 3. Database Design**        | Used MongoDB Atlas + Mongoose with User and FoodEntry schemas (One-to-Many relationship). | [Schemas in app.mjs](https://github.com/Kise1205/final-project/blob/dev3/app.mjs#L45-L75)<br>[Issue #4](https://github.com/Kise1205/final-project/issues/4)<br>[Issue #5](https://github.com/Kise1205/final-project/issues/5)<br>[Issue #6](https://github.com/Kise1205/final-project/issues/6) | Clean design supports daily calorie tracking perfectly. |
| **🔎 4. Search / Filter System** | Users can search food by name. | [Issue #10](https://github.com/Kise1205/final-project/issues/10)<br>[Issue #11](https://github.com/Kise1205/final-project/issues/11)<br>[Issue #12](https://github.com/Kise1205/final-project/issues/12) | Used MongoDB `$regex` for search and date range query for filtering. |
| **🎨 5. UI / UX Design**         | Responsive Bootstrap 5 interface with modern cards, hover effects, clean layout, and emojis. | [calorie-crud.html](https://github.com/Kise1205/final-project/blob/dev3/public/calorie-crud.html)<br>[style.css](https://github.com/Kise1205/final-project/blob/dev3/public/css/style.css) | Improved UX after first version to make it more professional and user-friendly. |
| **🐞 6. Debug Case Study**       | Food entries were not showing after login. Root cause: frontend did not send JWT token in Authorization header. Fixed with Axios interceptor + middleware update. | [Issue #3](https://github.com/Kise1205/final-project/issues/3) (Auth Middleware)<br>[calorie-crud.js](https://github.com/Kise1205/final-project/blob/dev3/public/calorie-crud.js#L15-L25) | **Biggest lesson**: Always check the Network tab in browser DevTools when API calls fail. |
| **📊 7. Monitoring / Logging**   | Added global request logging middleware and global error handler for clean JSON responses. | [Logging middleware](https://github.com/Kise1205/final-project/blob/dev3/app.mjs#L120-L125)<br>[Global error handler](https://github.com/Kise1205/final-project/blob/dev3/app.mjs#L320-L330) | Helps us see what is happening on the server and debug production issues quickly. |

---

## 📊 Value Proposition

- Before: people had to guess calories or write everything on paper.
- After: they can log a meal in 10 seconds and see the total instantly. Much faster and more useful.

---

## 🚀 Sprint 99 (Future Work)

**Milestone:** [Sprint 99](https://github.com/Kise1205/final-project/milestone/6)

### What we would build next:
- **New Features:** Interactive calorie charts, daily reminders
- **Improvements:** Better validation, rate limiting, dark mode
- **Known Limitations:** Admin edit user info, password reset

**Why these?**  
These would make our Calorie Tracker more complete and professional for real users.

---
## 🛠 Tech Stack
* **Frontend:** JavaScript, HTML5, CSS3, Bootstrap 5
* **Backend:** Node.js + Express
* **Database:** MongoDB Atlas
* **Cloud:** Google Cloud VM (Compute Engine)
* **Web Server:** Nginx (Reverse Proxy)
* **Process Manager:** PM2
* **Security:** JWT (JSON Web Tokens), bcryptjs

---

## 🌐 Deployment & Access

### Google Cloud Platform (GCP) Information
- **Instance Name:** finalproject 
- **External IP:** `34.125.190.255`

### SSH Access Configuration
The VM instance has been configured for remote access using the `student-key` as requested. 
- **SSH Command:** ```bash
  ssh -i ~/.ssh/student-key student-key@34.125.190.255
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
- [x] Group member added as collaborator.
- [x] README.md updated with this proposal.
- [x] GitHub Project board populated with backlog issues.
- [x] Milestones configured in GitHub.

---

## ☁️ Deployment / DevOps Details

### **GCP & Networking**
* Create Compute Engine VM.
* Open Firewall ports: `80` (HTTP) and `5000` (API testing).

### **Production Environment**
* **PM2:** Ensures the Node.js API restarts automatically on crashes or server reboots.
* **Nginx:** Functions as a reverse proxy to direct traffic from port 80 to the application.
* **Environment Variables (`.env`):**
    * `MONGO_URI`
    * `JWT_SECRET`
    * `PORT`
