# Perfect Protection Security Agency — Java & MySQL Architecture Guide

## Final Year Project 2026: Security & Housekeeping Staff Management System

This document outlines the **Java Backend Architecture** and **MySQL Database Integration** designed to support the **Perfect Protection Security Agency** web platform.

---

## 1. Enterprise Architecture Overview

The system follows a standard **Enterprise N-Tier Layered Architecture**:

```
+-----------------------------------------------------------+
|              Presentation Layer (HTML5/CSS3/BS5/JS)       |
|   (Public Portal, Multi-Step Wizard, Customer & Admin)    |
+-----------------------------+-----------------------------+
                              | JSON / REST APIs
+-----------------------------v-----------------------------+
|              REST Controller Layer (Spring Boot 3.x)       |
|   (@RestController, RequestMapping, DTO Validation)       |
+-----------------------------+-----------------------------+
                              |
+-----------------------------v-----------------------------+
|               Service Business Logic Layer                |
|   (Request Lifecycle, Assignment Engine, Attendance Rules)|
+-----------------------------+-----------------------------+
                              |
+-----------------------------v-----------------------------+
|           Data Access Layer (Spring Data JPA / DAO)       |
|      (JpaRepository, Hibernate ORM, Native Queries)       |
+-----------------------------+-----------------------------+
                              | JDBC Pool (HikariCP)
+-----------------------------v-----------------------------+
|               Relational Database (MySQL 8.x)             |
|   (Tables, Foreign Keys, Triggers, Indexes, Audit Logs)   |
+-----------------------------------------------------------+
```

---

## 2. Technology Stack Specifications

* **Backend Language:** Java 17 LTS / Java 21 LTS
* **Framework:** Spring Boot 3.2.x (Spring Web, Spring Data JPA, Spring Security, Spring Validation)
* **Database:** MySQL 8.0+
* **ORM:** Hibernate 6.x
* **Security:** Spring Security 6 with BCrypt password hashing & JWT authentication tokens
* **Build Tool:** Maven / Gradle

---

## 3. Database Entity Mappings (Java JPA Entities)

### A. Organization Entity (`Organization.java`)
```java
package com.perfectprotection.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "organizations")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Organization {
    @Id
    @Column(name = "org_id", length = 20)
    private String orgId; // e.g. ORG-1001

    @Column(name = "org_name", nullable = false, length = 200)
    private String orgName;

    @Enumerated(EnumType.STRING)
    @Column(name = "org_type", nullable = false)
    private OrganizationType orgType; // Government School, Government Office, Hospital, etc.

    @Column(name = "contact_person", nullable = false)
    private String contactPerson;

    @Column(nullable = false, length = 20)
    private String phone;

    @Column(nullable = false, length = 150)
    private String email;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String address;

    @Column(name = "required_staff")
    private Integer requiredStaff = 4;

    @Column(name = "assigned_staff")
    private Integer assignedStaff = 0;

    @Enumerated(EnumType.STRING)
    private Status status = Status.Active;

    @Column(name = "created_date", nullable = false)
    private LocalDate createdDate;
}
```

### B. Service Request Entity (`ServiceRequest.java`)
```java
package com.perfectprotection.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "service_requests")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class ServiceRequest {
    @Id
    @Column(name = "request_id", length = 25)
    private String requestId; // e.g. REQ-2026-1001

    @Column(name = "org_name", nullable = false)
    private String orgName;

    @Column(name = "service_name", nullable = false)
    private String serviceName;

    @Column(name = "security_guards")
    private Integer securityGuards = 0;

    @Column(name = "supervisors")
    private Integer supervisors = 0;

    @Column(name = "housekeeping_staff")
    private Integer housekeepingStaff = 0;

    @Column(name = "total_staff", nullable = false)
    private Integer totalStaff;

    @Column(nullable = false)
    private String shift; // Morning, Evening, Night, Full Day, Rotational

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(length = 50)
    private String duration; // 12 Months, 24 Months

    @Enumerated(EnumType.STRING)
    private RequestStatus status = RequestStatus.PENDING; 
    // PENDING -> UNDER_REVIEW -> APPROVED -> STAFF_ASSIGNED -> ACTIVE -> COMPLETED

    @Column(name = "request_date", nullable = false)
    private LocalDate requestDate;
}
```

---

## 4. RESTful API Endpoint Definitions

| HTTP Method | API Endpoint | Description | Role Required |
|:---|:---|:---|:---|
| **POST** | `/api/v1/auth/login` | Authenticate user & return JWT token | Public |
| **POST** | `/api/v1/requests` | Submit multi-step staff requisition | Customer / Public |
| **GET** | `/api/v1/requests/{id}` | Track request lifecycle status | Public / Customer |
| **GET** | `/api/v1/requests` | Get all requests (with filter parameters) | Admin |
| **PUT** | `/api/v1/requests/{id}/status` | Advance request status (Review/Approve) | Admin |
| **POST** | `/api/v1/assignments` | Assign security/housekeeping staff to org | Admin |
| **GET** | `/api/v1/attendance` | Retrieve daily attendance by date/org | Admin / Staff |
| **POST** | `/api/v1/attendance` | Record daily shift check-in / check-out | Admin / Supervisor |
| **GET** | `/api/v1/analytics/kpis` | Get dashboard metrics and chart values | Admin |
| **POST** | `/api/v1/enquiries` | Submit public contact message / quotation | Public |

---

## 5. MySQL Configuration (`application.properties`)

```properties
# Server Configuration
server.port=8080
server.servlet.context-path=/

# MySQL DataSource
spring.datasource.url=jdbc:mysql://localhost:3306/perfect_protection_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=root1234
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# Connection Pool (HikariCP)
spring.datasource.hikari.maximum-pool-size=15
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.idle-timeout=30000

# JPA / Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

# JWT Secret
jwt.secret=9a6747f6f12c4506da808026cb9f7f092b3c5253001f109b226ce91509264d3b
jwt.expiration.ms=86400000
```

---

## 6. Viva Examination Q&A Cheat Sheet

1. **Q: How does the system handle security staff vs housekeeping staff logically?**  
   *A:* They are stored with designated attributes (`security_staff` and `housekeeping_staff` or differentiated by category), ensuring security qualifications (PSARA, firearms/CCTV) are kept distinct from cleaning certifications (biohazard, NABH sanitation), while allowing both to be assigned to the same organization request.

2. **Q: How is attendance integrity maintained?**  
   *A:* A unique constraint `(shift_date, staff_id)` prevents duplicate daily attendance logging for the same personnel, recording precise check-in and checkout timestamps along with supervisor verification remarks.

3. **Q: What is the request workflow from customer to active deployment?**  
   *A:* `Pending` (submitted by client) $\to$ `Under Review` (site audit) $\to$ `Approved` (terms agreed) $\to$ `Staff Assigned` (personnel mapped with `ASG-2026-XXXX`) $\to$ `Active` (service commenced on premise) $\to$ `Completed` (contract tenure concluded).
