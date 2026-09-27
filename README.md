# PERFECT PROTECTION SECURITY AGENCY
## Security & Housekeeping Staff Management System
### Final Year College Project (Academic Year 2026)

A professional, enterprise-grade web application built for **Perfect Protection Security Agency**, an authorized workforce staffing organization providing **disciplined security personnel and clinical-grade housekeeping staff to government schools, government offices, educational universities, hospitals, commercial organizations, and industrial plants**.

---

## 🌟 Key System Modules & Highlights

1. **Enterprise Design System:**
   - Palette: Deep Corporate Navy (`#0A192F`), Slate Cool Gray, Subtle Brass/Gold (`#D97706` / `#F59E0B`), Clean White Cards with soft elevation.
   - Typography: Plus Jakarta Sans & Outfit.
   - Fully responsive on Desktop, Tablet, and Mobile devices.

2. **Public Institutional Portal:**
   - **Home Page (`index.html`):** Hero section with institutional trust indicators (PSARA, Police Verified, 24/7 Command), live active deployment ticker, services highlight, sectors served, and sticky header navigation.
   - **About Us (`about.html`):** Mission, Vision, Core Values, statutory labor compliance (EPF, ESIC, Minimum Wages).
   - **Services Catalogue (`services.html`):** Interactive category filter (Security vs Housekeeping) featuring 8 specialized packages.
   - **Service Details (`service-details.html`):** Two-column operational specifications with duty responsibilities, shifts, and direct staffing requisition triggers.
   - **Industries Served (`industries.html`):** Dedicated solutions for Government Schools, Administrative Offices, Hospitals, Colleges, and Industrial Plants.
   - **How It Works (`how-it-works.html`):** 4-Step horizontal/vertical responsive process timeline.
   - **Contact & Inquiries (`contact.html`):** Headquarters details, 24/7 emergency hotline, and interactive enquiry form with auto-generated Enquiry ID (`ENQ-2026-XXXX`).

3. **Multi-Step Staff Requisition Engine (`request-service.html`):**
   - **Step 1:** Organization credentials, contact nodal person, address, and institutional category.
   - **Step 2:** Service package selection, shift timing, start date (with past-date validation), and duration.
   - **Step 3:** Workforce breakdown (Security Guards, Supervisors, Housekeepers) with real-time live total staff calculation.
   - **Step 4:** Comprehensive review summary with direct edit triggers.
   - **Step 5:** Success confirmation displaying the generated Request ID (`REQ-2026-XXXX`), summary card, and direct tracking link.

4. **Live Request Tracking Engine (`track-request.html`):**
   - Interactive 6-stage visual timeline stepper:
     $$\text{Submitted} \longrightarrow \text{Under Review} \longrightarrow \text{Approved} \longrightarrow \text{Staff Assigned} \longrightarrow \text{Service Active} \longrightarrow \text{Completed}$$
   - Dynamic lookup by Request ID.
   - Previews allocated guards and housekeeping personnel once assigned.

5. **Customer & Institutional Portal (`customer/`):**
   - **Dashboard (`dashboard.html`):** Metric cards (Active, Pending, Approved, Completed), Recent requests, Recent enquiries, Quick actions.
   - **My Requests (`my-requests.html`):** Filterable requisition history with tracking shortcuts.
   - **My Enquiries (`my-enquiries.html`):** Support tickets with agency officer responses.
   - **Profile (`profile.html`):** Institutional nodal officer profile manager.

6. **Admin Operations Command Center (`admin/`):**
   - **Executive Dashboard (`dashboard.html`):**
     * **8 Real-time KPI Cards:** Total Organizations, Security Staff, Housekeeping Staff, Active Deployments, Pending Requests, Active Services, Today's Attendance %, Pending Enquiries.
     * **4 Chart.js Analytical Charts:** Staff Distribution Donut, Request Status Funnel, Today's Attendance Overview, Service Demand Polar Chart.
     * **Live Alerts & Notification Drawer.**
   - **Organization Management (`organizations.html`):** Full CRUD, search, sector filters, staff deployment ratio, and activate/deactivate modals.
   - **Security Staff Roster (`security-staff.html`):** Uniformed personnel management with badge numbers, photo avatars, qualifications, skills, shifts, and assignment status.
   - **Housekeeping Staff Roster (`housekeeping-staff.html`):** Logically separated sanitation roster for cleaning supervisors, ward cleaners, and facility handymen.
   - **Services Catalogue Management (`services.html`):** Service catalog oversight.
   - **Service Request Workflow (`requests.html`):** Advanced lifecycle actions (Under Review $\to$ Approve $\to$ Assign $\to$ Activate $\to$ Complete).
   - **Staff Assignment Engine (`assignments.html`):** Deploy specific available staff to client organizations, automatically generating Assignment ID (`ASG-2026-XXXX`).
   - **Daily Attendance Sheet (`attendance.html`):** Shift logger with date picker, organization filter, Present/Absent/Leave markers, and check-in/out logs.
   - **Enquiries Management (`enquiries.html`):** Review inquiries and compose replies.
   - **Master Reporting Suite (`reports.html`):** Staff Report, Attendance Report, Request Pipeline Report, and Client Coverage Report with **Print**, **PDF Export**, and **Dynamic CSV Export**.
   - **System Settings (`settings.html`):** Operational shift configurations and **Viva Demonstration Data Reset**.

7. **Backend & Database Readiness:**
   - `database/schema.sql`: Complete MySQL 8.x DDL script with foreign keys, indexes, and initial realistic seed data.
   - `database/README.md`: Comprehensive Java Spring Boot 3.x controller/service/repository architecture and examiner viva cheat sheet.

---

## 🎯 Final-Year Project Demonstration Flow (For Viva)

Examiners can be shown this exact 20-step end-to-end workflow:

1. **Open Public Site:** Open `index.html` $\to$ Showcase institutional branding, trust badges, and live ticker.
2. **Review Services:** Navigate to `services.html` $\to$ Filter by "Security" and "Housekeeping". Click "View Details" to see `service-details.html`.
3. **Initiate Request:** Click "Request Staff" $\to$ Opens `request-service.html`.
4. **Fill Step 1:** Enter Institution Name (e.g., `Government Model High School`), type `Government School`, contact person, email, and phone.
5. **Fill Step 2:** Choose `School Security Guard Service`, shift `Morning`, and start date.
6. **Fill Step 3:** Enter `3` Security Guards, `0` Supervisors, `2` Housekeepers. Note the live total updates to **5 Personnel**.
7. **Step 4 Review:** Inspect the structured review summary and click "Submit Request".
8. **Step 5 Confirmation:** Receive the generated Request ID (e.g., `REQ-2026-XXXX`). Click "Track Request Status".
9. **Live Tracker (`track-request.html`):** See status at **Submitted** stage on the visual stepper.
10. **Admin Login:** Go to `login.html`, toggle to "Administrator", and click Sign In.
11. **Admin Dashboard (`admin/dashboard.html`):** Point out the 8 KPI cards, Chart.js graphs, and the newly submitted request in the recent table.
12. **Manage Request (`admin/requests.html`):** Click "Manage / Action" on the new request.
13. **Advance Workflow:** Click "Mark Under Review", then click "Approve Request".
14. **Assign Staff (`admin/assignments.html`):** Allocate available Security Guard (e.g., `Dinesh Choudhary`) and Housekeeping staff. Click "Assign Staff Member".
15. **Verify Assignment ID:** System issues `ASG-2026-XXXX` and updates the active roster.
16. **Log Attendance (`admin/attendance.html`):** Pick today's date, select the assigned guard, mark **Present**, and click "Save Attendance Entry".
17. **Check Live Updates:** Return to `admin/dashboard.html` to show updated KPI statistics.
18. **Verify Customer Tracking:** Refresh `track-request.html` $\to$ Stepper has now advanced to **Staff Assigned / Active**, displaying the assigned guard's card!
19. **Export Reports (`admin/reports.html`):** Demonstrate generating the Workforce Report and downloading the CSV export.
20. **Reset Demo:** Navigate to `admin/settings.html` and click "Reset Demo Data Store" for the next demonstration.

---

## 💻 Tech Stack Summary

| Layer | Technologies |
|:---|:---|
| **Frontend** | HTML5, CSS3, JavaScript (ES6+), Bootstrap 5.3.2, Bootstrap Icons 1.11.3, Chart.js 4.4.1 |
| **Backend Architecture** | Java 17/21, Spring Boot 3.x, Spring Data JPA, Spring Security |
| **Database** | MySQL 8.x Relational Database |
| **Design Standard** | Enterprise SaaS / Government Contract Professional Interface |

---

## 📂 Project Directory Structure

```
final year project2026/
├── index.html                   # Public Homepage & Showcase
├── about.html                   # About Organization & Compliance
├── services.html                # Services Catalogue with Category Filters
├── service-details.html         # Detailed 2-Column Service Specification
├── industries.html              # Institutions & Industries Served
├── how-it-works.html            # 4-Step Process Timeline
├── request-service.html         # Multi-Step Request Wizard (Step 1 to 5)
├── track-request.html           # Live 6-Stage Request Tracker
├── contact.html                 # Contact Headquarters & Enquiry Form
├── login.html                   # Role-Aware Portal Login (Customer & Admin)
├── register.html                # Customer Institution Registration
├── css/
│   ├── style.css                # Custom Corporate Navy & Gold Design System
│   ├── admin.css                # Enterprise Admin Dashboard & Table Styling
│   └── responsive.css           # Tablet/Mobile Breakpoints & Print Rules
├── js/
│   ├── app-data.js              # Realistic Initial Seed Data Store
│   ├── app-engine.js            # Business Logic, State Transitions & Storage
│   ├── main.js                  # Public UI Handlers & Enquiry Processing
│   ├── request-wizard.js        # Multi-Step Request Wizard Controller
│   └── admin.js                 # Admin Analytics, CRUD, Assignments & Reports
├── customer/
│   ├── dashboard.html           # Customer Overview & Quick Actions
│   ├── my-requests.html         # Customer Requisitions Roster
│   ├── my-enquiries.html        # Customer Support Inquiries
│   └── profile.html             # Nodal Officer & Institution Profile
├── admin/
│   ├── dashboard.html           # Executive Command Dashboard (8 KPIs + 4 Charts)
│   ├── organizations.html       # Client Institutions Management
│   ├── security-staff.html      # Security Staff Roster & Enrolment
│   ├── housekeeping-staff.html  # Housekeeping Staff Roster & Enrolment
│   ├── services.html            # Service Catalogue Management
│   ├── requests.html            # Service Request Workflow Controller
│   ├── assignments.html         # Staff Assignment & Deployment Engine
│   ├── attendance.html          # Daily Staff Attendance Logger
│   ├── enquiries.html           # Customer Enquiries & Reply Composer
│   ├── reports.html             # Master Reports Suite (Print / CSV / PDF)
│   └── settings.html            # System Configuration & Demo Reset
├── database/
│   ├── schema.sql               # MySQL 8.x DDL & Seed Script
│   └── README.md                # Java Spring Boot Backend Architecture Guide
└── README.md                    # Project Documentation
```

---

© 2026 **Perfect Protection Security Agency**. All Rights Reserved. (Final Year Engineering / MCA Project)
