-- =============================================================================
-- PERFECT PROTECTION SECURITY AGENCY - DATABASE SCHEMA
-- Final Year College Project 2026 - Security & Housekeeping Staff Management System
-- Database: MySQL 8.x
-- =============================================================================

DROP DATABASE IF EXISTS perfect_protection_db;
CREATE DATABASE perfect_protection_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE perfect_protection_db;

-- 1. USERS & AUTHENTICATION TABLE
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(20),
    role ENUM('ADMIN', 'STAFF', 'CUSTOMER') NOT NULL DEFAULT 'CUSTOMER',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. ORGANIZATIONS / CLIENT INSTITUTIONS TABLE
CREATE TABLE organizations (
    org_id VARCHAR(20) PRIMARY KEY, -- e.g. ORG-1001
    user_id INT NULL,
    org_name VARCHAR(200) NOT NULL,
    org_type ENUM(
        'Government School',
        'Government Office',
        'College',
        'Hospital',
        'Factory',
        'Commercial Organization',
        'Other'
    ) NOT NULL,
    contact_person VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(150) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) DEFAULT 'Capital City',
    state VARCHAR(100) DEFAULT 'Maharashtra',
    pincode VARCHAR(10) DEFAULT '400001',
    required_staff INT NOT NULL DEFAULT 4,
    assigned_staff INT NOT NULL DEFAULT 0,
    status ENUM('Active', 'Pending Assignment', 'Deactivated') DEFAULT 'Active',
    created_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 3. SERVICES CATALOGUE TABLE
CREATE TABLE services (
    service_id VARCHAR(20) PRIMARY KEY, -- e.g. SRV-101
    service_name VARCHAR(150) NOT NULL,
    category ENUM('Security', 'Housekeeping') NOT NULL,
    description TEXT NOT NULL,
    responsibilities TEXT NOT NULL,
    available_shifts VARCHAR(150) NOT NULL,
    minimum_staff INT DEFAULT 2,
    duration_options VARCHAR(150),
    availability VARCHAR(50) DEFAULT 'Available Immediate',
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 4. SECURITY STAFF ROSTER TABLE
CREATE TABLE security_staff (
    staff_id VARCHAR(20) PRIMARY KEY, -- e.g. SEC-101
    badge_number VARCHAR(50) NOT NULL UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address TEXT,
    designation ENUM(
        'Security Guard',
        'Senior Security Guard',
        'Supervisor',
        'Security Officer'
    ) NOT NULL,
    joining_date DATE NOT NULL,
    experience_years INT DEFAULT 1,
    qualification VARCHAR(200),
    skills TEXT,
    shift_preference ENUM('Morning', 'Evening', 'Night', 'Rotational') DEFAULT 'Morning',
    assigned_org_id VARCHAR(20) NULL,
    status ENUM('Active', 'Inactive', 'On Leave') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_org_id) REFERENCES organizations(org_id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 5. HOUSEKEEPING STAFF ROSTER TABLE
CREATE TABLE housekeeping_staff (
    staff_id VARCHAR(20) PRIMARY KEY, -- e.g. HK-201
    badge_number VARCHAR(50) NOT NULL UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address TEXT,
    designation ENUM(
        'Housekeeping Staff',
        'Cleaning Supervisor',
        'Facility Support Staff',
        'Sanitation Staff'
    ) NOT NULL,
    joining_date DATE NOT NULL,
    experience_years INT DEFAULT 1,
    qualification VARCHAR(200),
    skills TEXT,
    shift_preference ENUM('Morning', 'Evening', 'Full Day') DEFAULT 'Morning',
    assigned_org_id VARCHAR(20) NULL,
    status ENUM('Active', 'Inactive', 'On Leave') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_org_id) REFERENCES organizations(org_id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 6. SERVICE REQUESTS (BOOKINGS) TABLE
CREATE TABLE service_requests (
    request_id VARCHAR(25) PRIMARY KEY, -- e.g. REQ-2026-1001
    org_name VARCHAR(200) NOT NULL,
    org_type VARCHAR(100) NOT NULL,
    service_id VARCHAR(20) NOT NULL,
    service_name VARCHAR(150) NOT NULL,
    security_guards INT DEFAULT 0,
    supervisors INT DEFAULT 0,
    housekeeping_staff INT DEFAULT 0,
    total_staff INT NOT NULL,
    shift ENUM('Morning', 'Evening', 'Night', 'Full Day', 'Rotational') NOT NULL,
    start_date DATE NOT NULL,
    duration VARCHAR(50) DEFAULT '12 Months',
    working_days VARCHAR(100) DEFAULT 'Monday to Saturday',
    contact_person VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    special_instructions TEXT,
    status ENUM(
        'Pending',
        'Under Review',
        'Approved',
        'Staff Assigned',
        'Active',
        'Completed',
        'Rejected'
    ) DEFAULT 'Pending',
    request_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (service_id) REFERENCES services(service_id)
) ENGINE=InnoDB;

-- 7. STAFF ASSIGNMENTS TABLE
CREATE TABLE staff_assignments (
    assignment_id VARCHAR(25) PRIMARY KEY, -- e.g. ASG-2026-301
    request_id VARCHAR(25) NULL,
    org_id VARCHAR(20) NOT NULL,
    org_name VARCHAR(200) NOT NULL,
    service_name VARCHAR(150) NOT NULL,
    staff_type ENUM('Security', 'Housekeeping') NOT NULL,
    staff_id VARCHAR(20) NOT NULL,
    staff_name VARCHAR(150) NOT NULL,
    designation VARCHAR(100) NOT NULL,
    shift VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    status ENUM('Active', 'Relieved', 'Transferred') DEFAULT 'Active',
    assigned_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (org_id) REFERENCES organizations(org_id),
    FOREIGN KEY (request_id) REFERENCES service_requests(request_id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 8. STAFF DAILY ATTENDANCE TABLE
CREATE TABLE staff_attendance (
    attendance_id VARCHAR(25) PRIMARY KEY, -- e.g. ATT-2026-901
    shift_date DATE NOT NULL,
    staff_id VARCHAR(20) NOT NULL,
    staff_name VARCHAR(150) NOT NULL,
    staff_type ENUM('Security', 'Housekeeping') NOT NULL,
    org_name VARCHAR(200) NOT NULL,
    check_in VARCHAR(20) DEFAULT '--:--',
    check_out VARCHAR(20) DEFAULT '--:--',
    status ENUM('Present', 'Absent', 'Leave') NOT NULL DEFAULT 'Present',
    remarks TEXT,
    logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_daily_staff (shift_date, staff_id)
) ENGINE=InnoDB;

-- 9. CUSTOMER ENQUIRIES TABLE
CREATE TABLE customer_enquiries (
    enquiry_id VARCHAR(25) PRIMARY KEY, -- e.g. ENQ-2026-501
    customer_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    organization VARCHAR(200) DEFAULT 'General Institution Enquiry',
    service VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    enquiry_date DATE NOT NULL,
    status ENUM('New', 'In Progress', 'Responded', 'Closed') DEFAULT 'New',
    admin_response TEXT NULL,
    responded_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- =============================================================================
-- SAMPLE REALISTIC SEED DATA (Aligned with Frontend Demo Dataset)
-- =============================================================================

INSERT INTO users (username, email, password_hash, full_name, phone, role) VALUES
('admin', 'admin@perfectprotection.agency', '$2a$12$e8YQz.EXAMPLEHASH_FOR_BCRYPT_SECURE', 'Chief Operations Officer', '9890011223', 'ADMIN'),
('principal.ghss', 'principal.ghss@gov.in', '$2a$12$e8YQz.EXAMPLEHASH_FOR_BCRYPT_SECURE', 'Dr. Rajesh Sen', '9876543210', 'CUSTOMER');

INSERT INTO organizations (org_id, org_name, org_type, contact_person, phone, email, address, city, state, pincode, required_staff, assigned_staff, status, created_date) VALUES
('ORG-1001', 'Government Higher Secondary School', 'Government School', 'Dr. Rajesh Sen (Principal)', '9876543210', 'principal.ghss@gov.in', 'Sector 4, Civil Lines', 'Capital City', 'Maharashtra', '400001', 4, 4, 'Active', '2026-08-15'),
('ORG-1002', 'District Collectorate & Revenue Complex', 'Government Office', 'Vinod Meena (Admin Officer)', '9822012345', 'collectorate.admin@gov.in', 'Collectorate Road, Civil Administrative Zone', 'Capital City', 'Maharashtra', '400002', 8, 8, 'Active', '2026-08-20'),
('ORG-1003', 'Civil General District Hospital', 'Hospital', 'Dr. Meenakshi Iyer (Medical Supt.)', '9845098765', 'civilhosp.admin@healthgov.in', 'Main Health City Complex, MG Road', 'Capital City', 'Maharashtra', '400008', 12, 10, 'Active', '2026-09-01'),
('ORG-1004', 'State Institute of Technology & Engineering', 'College', 'Prof. Anil Kulkarni (Dean Facilities)', '9811223344', 'dean.site@edu.ac.in', 'University Ring Road Campus', 'Capital City', 'Maharashtra', '400015', 6, 6, 'Active', '2026-09-05'),
('ORG-1005', 'Precision Auto-Tech Industrial Plant', 'Factory', 'Harish Rao (Plant Security Head)', '9870192837', 'h.rao@precisionautotech.com', 'MIDC Industrial Sector, Plot 42-A', 'Capital City', 'Maharashtra', '400065', 10, 6, 'Active', '2026-09-12'),
('ORG-1006', 'Municipal Corporation Head Office', 'Government Office', 'Sunita Patil (Deputy Commissioner)', '9833445566', 'mc.headoffice@gov.in', 'Central Civic Tower, Ambedkar Chowk', 'Capital City', 'Maharashtra', '400001', 5, 0, 'Pending Assignment', '2026-09-26');

INSERT INTO services (service_id, service_name, category, description, responsibilities, available_shifts, minimum_staff, duration_options, availability, status) VALUES
('SRV-101', 'School Security Guard Service', 'Security', 'Disciplined uniformed security staff trained for school main-gate vigilance, student entry/exit logging, visitor screening and boundary protection.', 'Gate access control, student safety vigil, visitor pass verification.', 'Morning, Full Day', 2, '6 Months to 3 Years', 'Available Immediate', 'Active'),
('SRV-102', 'Government Office Security', 'Security', 'Institutional security team for government administrative complexes, ministry offices, collectorates and municipal boards.', 'File movement registry, vehicle screening, official record room security.', 'Morning, Full Day, Rotational', 4, 'Annual Government Tender', 'Available Immediate', 'Active'),
('SRV-103', 'Hospital & Healthcare Security', 'Security', 'Specialized 24/7 security for emergency wards, casualty zones, ICU corridors, and doctor protection squads.', 'Emergency ward conflict de-escalation, visitor pass checks, parking regulation.', '24/7 Rotational (3 Shifts)', 6, '12 Months to 36 Months', 'Available Immediate', 'Active'),
('SRV-104', 'Factory & Industrial Security', 'Security', 'Tough industrial security personnel skilled in material inward/outward registers, weighbridge checking, and raw material theft prevention.', 'Truck inspection, employee biometric oversight, inventory security.', 'Rotational, 12-Hour Shifts', 4, '12 Months Contract', 'Available Immediate', 'Active'),
('SRV-201', 'Institutional Housekeeping & Cleaning', 'Housekeeping', 'Comprehensive mechanized floor scrubbing, dusting, restroom sanitization and environmental upkeep for schools & campuses.', 'Classroom daily cleaning, drinking water cooler sanitization, waste segregation.', 'Morning, Evening', 2, 'Annual Contract', 'Available Immediate', 'Active'),
('SRV-202', 'Government Office Deep Cleaning & Support', 'Housekeeping', 'Professional cleaning of administrative desks, conference rooms, record storage halls, and high-footfall public lobbies.', 'Morning pre-office cleaning, sanitized restrooms, waste paper disposal.', 'Morning, Evening, Full Day', 3, 'Contract Basis', 'Available Immediate', 'Active'),
('SRV-203', 'Hospital Clinical Sanitation & Waste Management', 'Housekeeping', 'Infection control hygiene squad trained in NABH healthcare protocols, yellow/red/blue bag bio-medical disposal.', 'OT sterilizing support, patient bed sanitization, biohazard disinfection fogging.', 'Round the Clock (3 Shifts)', 6, '12 to 24 Months', 'Available Immediate', 'Active'),
('SRV-204', 'Facility Support & Maintenance Assistance', 'Housekeeping', 'Handyman support, campus gardening, water pump operation, furniture shifting and general institution utility care.', 'Utility upkeep, light repairs, furniture arrangement, recycling transport.', 'General Full Day (9 AM - 6 PM)', 2, 'Annual Basis', 'Available Immediate', 'Active');

INSERT INTO security_staff (staff_id, badge_number, full_name, phone, address, designation, joining_date, experience_years, qualification, skills, shift_preference, assigned_org_id, status) VALUES
('SEC-101', 'PP-SG-01', 'Ramesh Kumar', '9876012345', 'B-14 Shanti Nagar, Capital City', 'Senior Security Guard', '2023-03-15', 6, 'Ex-Military (8 Yrs) / 12th', 'Armed Security, Perimeter Vigil, CCTV Monitoring', 'Morning', 'ORG-1001', 'Active'),
('SEC-102', 'PP-SS-01', 'Mahendra Pratap Singh', '9876023456', '45 Defense Enclave, Capital City', 'Supervisor', '2022-01-10', 9, 'BA / NCC "C" Certificate', 'Workforce Roster, Crisis Response, Fire Drill Coordination', 'Morning', 'ORG-1002', 'Active'),
('SEC-103', 'PP-SG-02', 'Vikram Jadhav', '9876034567', 'Plot 88 Shivaji Park, Capital City', 'Security Guard', '2024-04-12', 4, '10th Standard / Certified Guard', 'Access Control, Metal Detector Operation, Night Patrol', 'Night', 'ORG-1003', 'Active'),
('SEC-104', 'PP-SO-01', 'Ajay Verma', '9876045678', '22 Guru Gobind Society, Capital City', 'Security Officer', '2021-08-01', 8, 'Diploma Industrial Safety', 'VIP Protocol, Emergency Evacuation, Incident Logging', 'Rotational', 'ORG-1002', 'Active');

INSERT INTO housekeeping_staff (staff_id, badge_number, full_name, phone, address, designation, joining_date, experience_years, qualification, skills, shift_preference, assigned_org_id, status) VALUES
('HK-201', 'PP-HS-01', 'Sunita Sharma', '9867011223', 'H-33 Vikas Nagar, Capital City', 'Cleaning Supervisor', '2022-05-10', 7, '10th Standard / Housekeeping Cert', 'Chemical Dilution Protocol, Sanitization Audit', 'Morning', 'ORG-1003', 'Active'),
('HK-202', 'PP-HK-01', 'Rekha Devi', '9867022334', '89 Valmiki Basti, Capital City', 'Sanitation Staff', '2023-09-14', 4, '8th Standard', 'Bio-Medical Waste Segregation, Disinfection Fogging', 'Morning', 'ORG-1003', 'Active'),
('HK-203', 'PP-HK-02', 'Govind Narang', '9867033445', '12 Railway Line Colony, Capital City', 'Housekeeping Staff', '2023-02-18', 5, '10th Standard', 'Mechanized Floor Scrubbing, Glass Facade Cleaning', 'Evening', 'ORG-1002', 'Active'),
('HK-204', 'PP-HK-03', 'Anita Kamble', '9867044556', '44 Samata Nagar, Capital City', 'Housekeeping Staff', '2024-01-08', 3, '8th Standard', 'Classroom Sanitization, Restroom Hygiene', 'Morning', 'ORG-1001', 'Active');

INSERT INTO service_requests (request_id, org_name, org_type, service_id, service_name, security_guards, supervisors, housekeeping_staff, total_staff, shift, start_date, duration, working_days, contact_person, email, phone, address, special_instructions, status, request_date) VALUES
('REQ-2026-1001', 'Government Higher Secondary School', 'Government School', 'SRV-101', 'School Security Guard Service', 2, 0, 2, 4, 'Morning', '2026-10-01', '12 Months', 'Monday to Saturday', 'Dr. Rajesh Sen', 'principal.ghss@gov.in', '9876543210', 'Sector 4, Civil Lines, Capital City', 'Staff must arrive at 07:30 AM before school bell.', 'Staff Assigned', '2026-09-20'),
('REQ-2026-1002', 'District Collectorate & Revenue Complex', 'Government Office', 'SRV-102', 'Government Office Security', 4, 1, 3, 8, 'Full Day', '2026-10-05', '24 Months', 'All 7 Days', 'Vinod Meena', 'collectorate.admin@gov.in', '9822012345', 'Collectorate Road, Civil Administrative Zone', 'Official gate pass register mandatory for all visitors.', 'Active', '2026-09-22'),
('REQ-2026-1003', 'Civil General District Hospital', 'Hospital', 'SRV-103', 'Hospital & Healthcare Security', 6, 2, 4, 12, 'Rotational', '2026-10-10', '12 Months', '24/7 Continuous', 'Dr. Meenakshi Iyer', 'civilhosp.admin@healthgov.in', '9845098765', 'Main Health City Complex, MG Road', 'Emergency OPD requires strict 24-hr guard deployment.', 'Approved', '2026-09-24'),
('REQ-2026-1004', 'Municipal Corporation Head Office', 'Government Office', 'SRV-202', 'Government Office Deep Cleaning & Support', 2, 0, 3, 5, 'Morning', '2026-10-15', '6 Months', 'Monday to Friday', 'Sunita Patil', 'mc.headoffice@gov.in', '9833445566', 'Central Civic Tower, Ambedkar Chowk', 'Special care needed for council meeting halls.', 'Pending', '2026-09-26');

INSERT INTO staff_assignments (assignment_id, request_id, org_id, org_name, service_name, staff_type, staff_id, staff_name, designation, shift, start_date, status, assigned_date) VALUES
('ASG-2026-301', 'REQ-2026-1001', 'ORG-1001', 'Government Higher Secondary School', 'School Security Guard Service', 'Security', 'SEC-101', 'Ramesh Kumar', 'Senior Security Guard', 'Morning', '2026-10-01', 'Active', '2026-09-25'),
('ASG-2026-302', 'REQ-2026-1001', 'ORG-1001', 'Government Higher Secondary School', 'Institutional Housekeeping & Cleaning', 'Housekeeping', 'HK-204', 'Anita Kamble', 'School Cleaning Staff', 'Morning', '2026-10-01', 'Active', '2026-09-25');

INSERT INTO staff_attendance (attendance_id, shift_date, staff_id, staff_name, staff_type, org_name, check_in, check_out, status, remarks) VALUES
('ATT-2026-901', '2026-09-27', 'SEC-101', 'Ramesh Kumar', 'Security', 'Government Higher Secondary School', '07:25 AM', '03:30 PM', 'Present', 'On time, immaculate uniform'),
('ATT-2026-902', '2026-09-27', 'SEC-102', 'Mahendra Pratap Singh', 'Security', 'District Collectorate & Revenue Complex', '07:45 AM', '04:00 PM', 'Present', 'Conducted shift briefing'),
('ATT-2026-905', '2026-09-27', 'HK-201', 'Sunita Sharma', 'Housekeeping', 'Civil General District Hospital', '06:55 AM', '03:15 PM', 'Present', 'OT sanitation completed');

INSERT INTO customer_enquiries (enquiry_id, customer_name, email, phone, organization, service, message, enquiry_date, status, admin_response, responded_at) VALUES
('ENQ-2026-501', 'Dr. Rajesh Sen', 'principal.ghss@gov.in', '9876543210', 'Government Higher Secondary School', 'School Security', 'Need additional 2 night security guards during upcoming board exams.', '2026-09-25', 'Responded', 'We have reserved 2 certified guards for your night examination schedule.', '2026-09-25 15:30:00'),
('ENQ-2026-502', 'Sunita Patil', 'mc.headoffice@gov.in', '9833445566', 'Municipal Corporation Head Office', 'Government Office Deep Cleaning', 'Request quotation for mechanized floor scrubbers alongside staff.', '2026-09-27', 'New', NULL, NULL);
