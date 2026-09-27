/**
 * PERFECT PROTECTION SECURITY AGENCY - ADMIN & CUSTOMER ENTERPRISE ENGINE
 * Final Year Project 2026 - Security & Housekeeping Staff Management System
 * 
 * Provides interactive charts, data table rendering, CRUD operations,
 * request lifecycle transitions, assignment engine, daily attendance logger,
 * and reporting export functionality.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Mobile / Tablet Sidebar Toggle
  const toggleBtn = document.getElementById('sidebarToggleBtn');
  const sidebar = document.querySelector('.admin-sidebar');
  let backdrop = document.querySelector('.sidebar-backdrop');

  if (toggleBtn && sidebar) {
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'sidebar-backdrop';
      document.body.appendChild(backdrop);
    }

    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('show-sidebar');
      backdrop.classList.toggle('show');
    });

    backdrop.addEventListener('click', () => {
      sidebar.classList.remove('show-sidebar');
      backdrop.classList.remove('show');
    });
  }

  // Populate Notifications Dropdown
  const notifDropdownList = document.getElementById('notifDropdownList');
  const notifBadgeCount = document.getElementById('notifBadgeCount');
  if (notifDropdownList && window.ppsaEngine) {
    const notifs = window.ppsaEngine.getNotifications();
    const unread = notifs.filter(n => !n.read).length;
    if (notifBadgeCount) notifBadgeCount.textContent = unread || notifs.length;

    notifDropdownList.innerHTML = notifs.map(n => `
      <li class="dropdown-item py-2 border-bottom">
        <div class="d-flex align-items-center justify-content-between mb-1">
          <strong class="text-navy" style="font-size: 0.85rem;">${n.title}</strong>
          <small class="text-muted" style="font-size: 0.72rem;">${n.time}</small>
        </div>
        <p class="text-secondary mb-0" style="font-size: 0.8rem; line-height: 1.3;">${n.message}</p>
      </li>
    `).join('');
  }

  // Active link highlighter in sidebar
  const adminPath = window.location.pathname.split('/').pop() || 'dashboard.html';
  document.querySelectorAll('.sidebar-nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === adminPath) {
      link.classList.add('active');
    }
  });

  // --- INITIALIZE PAGE MODULES BASED ON CURRENT SCREEN ---
  if (document.getElementById('adminDashboardMetrics')) {
    initDashboardPage();
  } else if (document.getElementById('orgManagementTable')) {
    initOrganizationsPage();
  } else if (document.getElementById('secStaffTable')) {
    initSecurityStaffPage();
  } else if (document.getElementById('hkStaffTable')) {
    initHousekeepingStaffPage();
  } else if (document.getElementById('servicesManagementTable')) {
    initServicesPage();
  } else if (document.getElementById('requestsManagementTable')) {
    initRequestsPage();
  } else if (document.getElementById('assignmentsManagementTable')) {
    initAssignmentsPage();
  } else if (document.getElementById('attendanceManagementTable')) {
    initAttendancePage();
  } else if (document.getElementById('enquiriesManagementTable')) {
    initEnquiriesPage();
  } else if (document.getElementById('reportsMasterWrapper')) {
    initReportsPage();
  } else if (document.getElementById('customerDashboardWrapper')) {
    initCustomerDashboardPage();
  }
});

// ==========================================================================
// 1. ADMIN DASHBOARD PAGE
// ==========================================================================
function initDashboardPage() {
  const kpis = window.ppsaEngine.getDashboardMetrics();

  // Populate Metric Cards
  const setEl = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  setEl('kpiTotalOrgs', kpis.totalOrganizations);
  setEl('kpiSecStaff', kpis.totalSecurityStaff);
  setEl('kpiHkStaff', kpis.totalHousekeepingStaff);
  setEl('kpiActiveAssignments', kpis.activeAssignments);
  setEl('kpiPendingRequests', kpis.pendingRequests);
  setEl('kpiActiveServices', kpis.activeServices);
  setEl('kpiAttendanceToday', `${kpis.presentPercentage}%`);
  setEl('kpiPendingEnquiries', kpis.pendingEnquiries);

  // Render Charts if Chart.js is loaded
  if (window.Chart) {
    // 1. Staff Distribution Donut
    const ctxStaff = document.getElementById('chartStaffDistribution');
    if (ctxStaff) {
      new Chart(ctxStaff, {
        type: 'doughnut',
        data: {
          labels: ['Security Guards & Officers', 'Housekeeping & Sanitation'],
          datasets: [{
            data: [kpis.totalSecurityStaff, kpis.totalHousekeepingStaff],
            backgroundColor: ['#0A192F', '#059669'],
            borderColor: '#FFFFFF',
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' }
          }
        }
      });
    }

    // 2. Request Status Breakdown
    const ctxStatus = document.getElementById('chartRequestStatus');
    if (ctxStatus) {
      new Chart(ctxStatus, {
        type: 'bar',
        data: {
          labels: ['Pending', 'Under Review', 'Approved', 'Staff Assigned', 'Active', 'Completed'],
          datasets: [{
            label: 'Requests',
            data: [
              kpis.requestStatusCounts.Pending,
              kpis.requestStatusCounts.UnderReview,
              kpis.requestStatusCounts.Approved,
              kpis.requestStatusCounts.StaffAssigned,
              kpis.requestStatusCounts.Active,
              kpis.requestStatusCounts.Completed
            ],
            backgroundColor: ['#F59E0B', '#3B82F6', '#6366F1', '#8B5CF6', '#10B981', '#64748B'],
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: { beginAtZero: true, ticks: { stepSize: 1 } }
          }
        }
      });
    }

    // 3. Today's Attendance Overview
    const ctxAtt = document.getElementById('chartAttendanceOverview');
    if (ctxAtt) {
      new Chart(ctxAtt, {
        type: 'doughnut',
        data: {
          labels: ['Present', 'Absent', 'On Leave'],
          datasets: [{
            data: [kpis.presentCount, kpis.absentCount, kpis.leaveCount],
            backgroundColor: ['#10B981', '#EF4444', '#F59E0B'],
            borderColor: '#FFFFFF',
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' }
          }
        }
      });
    }

    // 4. Service Demand Breakdown
    const ctxDemand = document.getElementById('chartServiceDemand');
    if (ctxDemand) {
      new Chart(ctxDemand, {
        type: 'polarArea',
        data: {
          labels: ['School Security', 'Govt Office Security', 'Hospital Security', 'Factory Security', 'Deep Cleaning', 'Sanitation'],
          datasets: [{
            data: [4, 6, 8, 5, 4, 6],
            backgroundColor: [
              'rgba(10, 25, 47, 0.75)',
              'rgba(245, 158, 11, 0.75)',
              'rgba(5, 150, 105, 0.75)',
              'rgba(2, 132, 199, 0.75)',
              'rgba(147, 51, 234, 0.75)',
              'rgba(225, 29, 72, 0.75)'
            ]
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' }
          }
        }
      });
    }
  }

  // Populate Recent Requests Table on Dashboard
  const recentTable = document.getElementById('dashboardRecentRequestsTable');
  if (recentTable) {
    const reqs = window.ppsaEngine.getRequests().slice(0, 5);
    recentTable.innerHTML = reqs.map(r => `
      <tr>
        <td><strong class="text-navy">${r.id}</strong></td>
        <td>
          <div class="fw-bold">${r.organizationName}</div>
          <small class="text-muted">${r.organizationType}</small>
        </td>
        <td>${r.serviceName}</td>
        <td><span class="badge bg-light text-dark border">${r.totalStaff} Staff</span></td>
        <td>${r.shift}</td>
        <td><span class="badge-status status-${r.status.toLowerCase().replace(/\s+/g, '-')}">${r.status}</span></td>
        <td>
          <a href="requests.html?id=${r.id}" class="btn btn-sm btn-outline-secondary">View</a>
        </td>
      </tr>
    `).join('');
  }
}

// ==========================================================================
// 2. ORGANIZATIONS MANAGEMENT PAGE
// ==========================================================================
function initOrganizationsPage() {
  const tableBody = document.querySelector('#orgManagementTable tbody');
  const searchInput = document.getElementById('searchOrgInput');
  const typeFilter = document.getElementById('filterOrgType');

  function renderOrgs() {
    if (!tableBody) return;
    const query = searchInput ? searchInput.value.trim() : '';
    const type = typeFilter ? typeFilter.value : 'All';
    const orgs = window.ppsaEngine.getOrganizations(query, type);

    if (orgs.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="8" class="text-center py-5">
            <div class="empty-state">
              <div class="empty-state-icon"><i class="bi bi-buildings"></i></div>
              <div class="empty-state-title">No Organizations Found</div>
              <div class="empty-state-text">No registered institutional clients match your search query.</div>
              <button class="btn btn-agency-primary btn-sm" data-bs-toggle="modal" data-bs-target="#addOrgModal">
                <i class="bi bi-plus-circle me-1"></i> Register New Organization
              </button>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = orgs.map(o => `
      <tr>
        <td><strong class="text-navy">${o.id}</strong></td>
        <td>
          <div class="fw-bold text-navy">${o.name}</div>
          <small class="text-muted"><i class="bi bi-geo-alt me-1"></i>${o.city}, ${o.state}</small>
        </td>
        <td><span class="badge bg-light text-dark border">${o.type}</span></td>
        <td>
          <div>${o.contactPerson}</div>
          <small class="text-muted">${o.phone}</small>
        </td>
        <td>
          <span class="fw-bold text-navy">${o.assignedStaff}</span> / 
          <span class="text-muted">${o.requiredStaff} Staff</span>
        </td>
        <td>
          <span class="badge-status ${o.status === 'Active' ? 'status-active' : 'status-rejected'}">
            ${o.status}
          </span>
        </td>
        <td>
          <div class="btn-group">
            <button class="btn-action" title="View Details" onclick="viewOrgDetails('${o.id}')">
              <i class="bi bi-eye"></i>
            </button>
            <button class="btn-action action-danger" title="Toggle Status" onclick="toggleOrgStatus('${o.id}')">
              <i class="bi bi-power"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  if (searchInput) searchInput.addEventListener('input', renderOrgs);
  if (typeFilter) typeFilter.addEventListener('change', renderOrgs);

  // Form submission for Add Organization
  const addOrgForm = document.getElementById('addOrgForm');
  if (addOrgForm) {
    addOrgForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const orgData = {
        name: document.getElementById('newOrgName').value,
        type: document.getElementById('newOrgType').value,
        contactPerson: document.getElementById('newOrgContact').value,
        email: document.getElementById('newOrgEmail').value,
        phone: document.getElementById('newOrgPhone').value,
        address: document.getElementById('newOrgAddress').value,
        city: document.getElementById('newOrgCity').value || 'Capital City',
        state: document.getElementById('newOrgState').value || 'Maharashtra',
        pincode: document.getElementById('newOrgPincode').value || '400001',
        requiredStaff: document.getElementById('newOrgRequiredStaff').value || 4
      };

      window.ppsaEngine.saveOrganization(orgData);
      window.ppsaEngine.showToast('Organization Added', `${orgData.name} registered successfully.`, 'success');

      const modalEl = document.getElementById('addOrgModal');
      if (modalEl && window.bootstrap) {
        bootstrap.Modal.getInstance(modalEl).hide();
      }
      addOrgForm.reset();
      renderOrgs();
    });
  }

  // Global actions attached to window
  window.viewOrgDetails = function(orgId) {
    const org = window.ppsaEngine.getOrganizationById(orgId);
    if (!org) return;

    const setTxt = (id, txt) => {
      const el = document.getElementById(id);
      if (el) el.textContent = txt;
    };

    setTxt('modalOrgId', org.id);
    setTxt('modalOrgName', org.name);
    setTxt('modalOrgType', org.type);
    setTxt('modalOrgContact', org.contactPerson);
    setTxt('modalOrgPhone', org.phone);
    setTxt('modalOrgEmail', org.email);
    setTxt('modalOrgAddress', `${org.address}, ${org.city}, ${org.state} - ${org.pincode}`);
    setTxt('modalOrgStaffRatio', `${org.assignedStaff} Assigned / ${org.requiredStaff} Required`);
    setTxt('modalOrgStatus', org.status);

    const modalEl = document.getElementById('viewOrgDetailsModal');
    if (modalEl && window.bootstrap) {
      new bootstrap.Modal(modalEl).show();
    }
  };

  window.toggleOrgStatus = function(orgId) {
    const newStatus = window.ppsaEngine.toggleOrganizationStatus(orgId);
    window.ppsaEngine.showToast('Status Updated', `Organization ${orgId} is now ${newStatus}.`, 'info');
    renderOrgs();
  };

  renderOrgs();
}

// ==========================================================================
// 3. SECURITY STAFF MANAGEMENT PAGE
// ==========================================================================
function initSecurityStaffPage() {
  const tableBody = document.querySelector('#secStaffTable tbody');
  const searchInput = document.getElementById('searchSecStaff');
  const statusFilter = document.getElementById('filterSecStatus');
  const shiftFilter = document.getElementById('filterSecShift');

  function renderStaff() {
    if (!tableBody) return;
    const q = searchInput ? searchInput.value.trim() : '';
    const st = statusFilter ? statusFilter.value : 'All';
    const sh = shiftFilter ? shiftFilter.value : 'All';
    const staffList = window.ppsaEngine.getSecurityStaff(q, st, sh);

    if (staffList.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="8" class="text-center py-5">
            <div class="empty-state">
              <div class="empty-state-icon"><i class="bi bi-shield-x"></i></div>
              <div class="empty-state-title">No Security Staff Found</div>
              <div class="empty-state-text">No security personnel match your current filters.</div>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = staffList.map(s => `
      <tr>
        <td>
          <div class="staff-avatar-cell">
            <div class="staff-avatar-badge">
              <i class="bi bi-shield-shaded"></i>
            </div>
            <div>
              <div class="fw-bold text-navy">${s.name}</div>
              <small class="text-muted">${s.id} • ${s.badgeNumber}</small>
            </div>
          </div>
        </td>
        <td><span class="badge bg-light text-navy border fw-bold">${s.designation}</span></td>
        <td>
          <div>${s.phone}</div>
          <small class="text-muted">${s.experience} Exp</small>
        </td>
        <td>
          <div class="text-truncate" style="max-width: 180px;">${s.assignedOrgName}</div>
        </td>
        <td><span class="badge bg-secondary-subtle text-secondary">${s.shiftPreference}</span></td>
        <td>
          <span class="badge-status ${s.status === 'Active' ? 'status-active' : 'status-rejected'}">
            ${s.status}
          </span>
        </td>
        <td>
          <div class="btn-group">
            <button class="btn-action" title="View Profile" onclick="viewStaffProfile('${s.id}', 'Security')">
              <i class="bi bi-person-badge"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  if (searchInput) searchInput.addEventListener('input', renderStaff);
  if (statusFilter) statusFilter.addEventListener('change', renderStaff);
  if (shiftFilter) shiftFilter.addEventListener('change', renderStaff);

  // Form submission for Add Security Staff
  const addSecForm = document.getElementById('addSecStaffForm');
  if (addSecForm) {
    addSecForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const staffData = {
        name: document.getElementById('secStaffName').value,
        phone: document.getElementById('secStaffPhone').value,
        address: document.getElementById('secStaffAddress').value,
        designation: document.getElementById('secStaffDesignation').value,
        experience: document.getElementById('secStaffExperience').value + ' Years',
        qualification: document.getElementById('secStaffQualification').value,
        skills: document.getElementById('secStaffSkills').value,
        shiftPreference: document.getElementById('secStaffShift').value,
        joiningDate: new Date().toISOString().split('T')[0]
      };

      window.ppsaEngine.saveSecurityStaff(staffData);
      window.ppsaEngine.showToast('Security Staff Added', `${staffData.name} enrolled into guard roster.`, 'success');

      const modalEl = document.getElementById('addSecStaffModal');
      if (modalEl && window.bootstrap) {
        bootstrap.Modal.getInstance(modalEl).hide();
      }
      addSecForm.reset();
      renderStaff();
    });
  }

  window.viewStaffProfile = function(staffId, type) {
    const list = type === 'Security' ? window.ppsaEngine.getSecurityStaff() : window.ppsaEngine.getHousekeepingStaff();
    const staff = list.find(s => s.id === staffId);
    if (!staff) return;

    alert(`Staff Profile: ${staff.name} (${staff.id})\nDesignation: ${staff.designation}\nPhone: ${staff.phone}\nExperience: ${staff.experience}\nAssigned To: ${staff.assignedOrgName}\nQualifications: ${staff.qualification}\nSkills: ${staff.skills}`);
  };

  renderStaff();
}

// ==========================================================================
// 4. HOUSEKEEPING STAFF MANAGEMENT PAGE
// ==========================================================================
function initHousekeepingStaffPage() {
  const tableBody = document.querySelector('#hkStaffTable tbody');
  const searchInput = document.getElementById('searchHkStaff');
  const statusFilter = document.getElementById('filterHkStatus');
  const shiftFilter = document.getElementById('filterHkShift');

  function renderStaff() {
    if (!tableBody) return;
    const q = searchInput ? searchInput.value.trim() : '';
    const st = statusFilter ? statusFilter.value : 'All';
    const sh = shiftFilter ? shiftFilter.value : 'All';
    const staffList = window.ppsaEngine.getHousekeepingStaff(q, st, sh);

    if (staffList.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="8" class="text-center py-5">
            <div class="empty-state">
              <div class="empty-state-icon"><i class="bi bi-stars"></i></div>
              <div class="empty-state-title">No Housekeeping Staff Found</div>
              <div class="empty-state-text">No housekeeping or sanitation workers match your current filters.</div>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = staffList.map(s => `
      <tr>
        <td>
          <div class="staff-avatar-cell">
            <div class="staff-avatar-badge housekeeping">
              <i class="bi bi-brush"></i>
            </div>
            <div>
              <div class="fw-bold text-navy">${s.name}</div>
              <small class="text-muted">${s.id} • ${s.badgeNumber}</small>
            </div>
          </div>
        </td>
        <td><span class="badge bg-light text-success border fw-bold">${s.designation}</span></td>
        <td>
          <div>${s.phone}</div>
          <small class="text-muted">${s.experience} Exp</small>
        </td>
        <td>
          <div class="text-truncate" style="max-width: 180px;">${s.assignedOrgName}</div>
        </td>
        <td><span class="badge bg-secondary-subtle text-secondary">${s.shiftPreference}</span></td>
        <td>
          <span class="badge-status ${s.status === 'Active' ? 'status-active' : 'status-rejected'}">
            ${s.status}
          </span>
        </td>
        <td>
          <div class="btn-group">
            <button class="btn-action" title="View Profile" onclick="viewStaffProfile('${s.id}', 'Housekeeping')">
              <i class="bi bi-person-badge"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  if (searchInput) searchInput.addEventListener('input', renderStaff);
  if (statusFilter) statusFilter.addEventListener('change', renderStaff);
  if (shiftFilter) shiftFilter.addEventListener('change', renderStaff);

  const addHkForm = document.getElementById('addHkStaffForm');
  if (addHkForm) {
    addHkForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const staffData = {
        name: document.getElementById('hkStaffName').value,
        phone: document.getElementById('hkStaffPhone').value,
        address: document.getElementById('hkStaffAddress').value,
        designation: document.getElementById('hkStaffDesignation').value,
        experience: document.getElementById('hkStaffExperience').value + ' Years',
        qualification: document.getElementById('hkStaffQualification').value,
        skills: document.getElementById('hkStaffSkills').value,
        shiftPreference: document.getElementById('hkStaffShift').value,
        joiningDate: new Date().toISOString().split('T')[0]
      };

      window.ppsaEngine.saveHousekeepingStaff(staffData);
      window.ppsaEngine.showToast('Housekeeping Staff Added', `${staffData.name} enrolled into sanitation roster.`, 'success');

      const modalEl = document.getElementById('addHkStaffModal');
      if (modalEl && window.bootstrap) {
        bootstrap.Modal.getInstance(modalEl).hide();
      }
      addHkForm.reset();
      renderStaff();
    });
  }

  renderStaff();
}

// ==========================================================================
// 5. SERVICES MANAGEMENT PAGE
// ==========================================================================
function initServicesPage() {
  const tableBody = document.querySelector('#servicesManagementTable tbody');
  const catFilter = document.getElementById('filterServiceCategory');

  function renderServices() {
    if (!tableBody) return;
    const cat = catFilter ? catFilter.value : 'All';
    const services = window.ppsaEngine.getServices(cat);

    tableBody.innerHTML = services.map(s => `
      <tr>
        <td><strong class="text-navy">${s.id}</strong></td>
        <td>
          <div class="fw-bold text-navy">${s.name}</div>
          <small class="text-muted text-truncate d-block" style="max-width: 280px;">${s.description}</small>
        </td>
        <td>
          <span class="service-type-badge ${s.category === 'Security' ? 'badge-security' : 'badge-housekeeping'}">
            ${s.category}
          </span>
        </td>
        <td>${s.availableShifts}</td>
        <td><span class="badge bg-light text-dark border">Min ${s.minimumStaff} Staff</span></td>
        <td><span class="badge-status status-active">${s.status}</span></td>
      </tr>
    `).join('');
  }

  if (catFilter) catFilter.addEventListener('change', renderServices);
  renderServices();
}

// ==========================================================================
// 6. SERVICE REQUESTS MANAGEMENT (FULL WORKFLOW)
// ==========================================================================
function initRequestsPage() {
  const tableBody = document.querySelector('#requestsManagementTable tbody');
  const statusFilter = document.getElementById('filterRequestStatus');
  const searchInput = document.getElementById('searchRequestInput');

  function renderRequests() {
    if (!tableBody) return;
    const st = statusFilter ? statusFilter.value : 'All';
    const q = searchInput ? searchInput.value.trim() : '';
    const reqs = window.ppsaEngine.getRequests(st, q);

    if (reqs.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="9" class="text-center py-5">
            <div class="empty-state">
              <div class="empty-state-icon"><i class="bi bi-inbox"></i></div>
              <div class="empty-state-title">No Service Requests Found</div>
              <div class="empty-state-text">No booking requests match your selected criteria.</div>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = reqs.map(r => `
      <tr>
        <td><strong class="text-navy">${r.id}</strong></td>
        <td>
          <div class="fw-bold text-navy">${r.organizationName}</div>
          <small class="text-muted">${r.organizationType} • ${r.contactPerson}</small>
        </td>
        <td>${r.serviceName}</td>
        <td>
          <span class="badge bg-light text-navy border">
            ${r.securityGuards} Sec / ${r.housekeepingStaff} HK (Total: ${r.totalStaff})
          </span>
        </td>
        <td>${r.shift}</td>
        <td>${r.startDate}</td>
        <td>
          <span class="badge-status status-${r.status.toLowerCase().replace(/\s+/g, '-')}">
            ${r.status}
          </span>
        </td>
        <td>
          <div class="btn-group">
            <button class="btn btn-sm btn-outline-primary" onclick="viewRequestWorkflow('${r.id}')">
              Manage / Action
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  if (statusFilter) statusFilter.addEventListener('change', renderRequests);
  if (searchInput) searchInput.addEventListener('input', renderRequests);

  window.viewRequestWorkflow = function(reqId) {
    const req = window.ppsaEngine.getRequestById(reqId);
    if (!req) return;

    const setTxt = (id, txt) => {
      const el = document.getElementById(id);
      if (el) el.textContent = txt;
    };

    setTxt('reqModalId', req.id);
    setTxt('reqModalOrg', req.organizationName);
    setTxt('reqModalService', req.serviceName);
    setTxt('reqModalContact', `${req.contactPerson} (${req.phone} | ${req.email})`);
    setTxt('reqModalAddress', req.address);
    setTxt('reqModalStaff', `${req.securityGuards} Guards, ${req.supervisors} Supervisors, ${req.housekeepingStaff} Housekeeping (Total: ${req.totalStaff})`);
    setTxt('reqModalShift', req.shift);
    setTxt('reqModalStartDate', req.startDate);
    setTxt('reqModalDuration', req.duration);
    setTxt('reqModalNotes', req.specialInstructions);
    setTxt('reqModalCurrentStatus', req.status);

    // Dynamic Workflow Action Buttons based on current state
    const actionBtnsContainer = document.getElementById('reqWorkflowActionButtons');
    if (actionBtnsContainer) {
      let buttonsHtml = '';

      if (req.status === 'Pending') {
        buttonsHtml = `
          <button class="btn btn-warning" onclick="transitionRequest('${req.id}', 'Under Review')">
            <i class="bi bi-search me-1"></i> Mark Under Review
          </button>
          <button class="btn btn-danger" onclick="transitionRequest('${req.id}', 'Rejected')">
            <i class="bi bi-x-circle me-1"></i> Reject
          </button>
        `;
      } else if (req.status === 'Under Review') {
        buttonsHtml = `
          <button class="btn btn-success" onclick="transitionRequest('${req.id}', 'Approved')">
            <i class="bi bi-check-circle me-1"></i> Approve Request
          </button>
          <button class="btn btn-danger" onclick="transitionRequest('${req.id}', 'Rejected')">
            <i class="bi bi-x-circle me-1"></i> Reject
          </button>
        `;
      } else if (req.status === 'Approved') {
        buttonsHtml = `
          <a href="assignments.html?reqId=${req.id}&org=${encodeURIComponent(req.organizationName)}" class="btn btn-agency-gold">
            <i class="bi bi-person-check-fill me-1"></i> Assign Staff Now
          </a>
          <button class="btn btn-primary" onclick="transitionRequest('${req.id}', 'Active')">
            <i class="bi bi-play-circle me-1"></i> Mark Service Active
          </button>
        `;
      } else if (req.status === 'Staff Assigned') {
        buttonsHtml = `
          <button class="btn btn-success" onclick="transitionRequest('${req.id}', 'Active')">
            <i class="bi bi-play-circle me-1"></i> Activate Service Deployment
          </button>
        `;
      } else if (req.status === 'Active') {
        buttonsHtml = `
          <button class="btn btn-secondary" onclick="transitionRequest('${req.id}', 'Completed')">
            <i class="bi bi-flag-fill me-1"></i> Mark Service Completed
          </button>
        `;
      } else {
        buttonsHtml = `<span class="badge bg-secondary">Workflow Finalized (${req.status})</span>`;
      }

      actionBtnsContainer.innerHTML = buttonsHtml;
    }

    const modalEl = document.getElementById('requestWorkflowModal');
    if (modalEl && window.bootstrap) {
      new bootstrap.Modal(modalEl).show();
    }
  };

  window.transitionRequest = function(reqId, newStatus) {
    window.ppsaEngine.updateRequestStatus(reqId, newStatus);
    window.ppsaEngine.showToast('Workflow Transition', `Request ${reqId} transitioned to "${newStatus}"`, 'success');

    const modalEl = document.getElementById('requestWorkflowModal');
    if (modalEl && window.bootstrap) {
      bootstrap.Modal.getInstance(modalEl).hide();
    }
    renderRequests();
  };

  renderRequests();
}

// ==========================================================================
// 7. STAFF ASSIGNMENT ENGINE
// ==========================================================================
function initAssignmentsPage() {
  const tableBody = document.querySelector('#assignmentsManagementTable tbody');
  const orgSelect = document.getElementById('asgOrgSelect');
  const staffTypeSelect = document.getElementById('asgStaffTypeSelect');
  const staffMemberSelect = document.getElementById('asgStaffMemberSelect');

  // Populate Org Dropdown
  if (orgSelect) {
    const orgs = window.ppsaEngine.getOrganizations();
    orgSelect.innerHTML = '<option value="">-- Choose Institution --</option>' +
      orgs.map(o => `<option value="${o.id}" data-name="${o.name}">${o.name} (${o.type})</option>`).join('');
  }

  // Populate Staff Member Dropdown when staff type changes
  function updateStaffMembers() {
    if (!staffMemberSelect) return;
    const type = staffTypeSelect ? staffTypeSelect.value : 'Security';
    const list = type === 'Security' ? window.ppsaEngine.getSecurityStaff() : window.ppsaEngine.getHousekeepingStaff();

    // Show available or all staff with unassigned prioritized
    staffMemberSelect.innerHTML = '<option value="">-- Select Personnel to Deploy --</option>' +
      list.map(s => `
        <option value="${s.id}" data-name="${s.name}" data-desig="${s.designation}">
          ${s.name} (${s.id}) - ${s.designation} [${s.assignedOrgId ? 'Currently Assigned' : 'AVAILABLE'}]
        </option>
      `).join('');
  }

  if (staffTypeSelect) {
    staffTypeSelect.addEventListener('change', updateStaffMembers);
    updateStaffMembers();
  }

  function renderAssignments() {
    if (!tableBody) return;
    const asgs = window.ppsaEngine.getAssignments();

    if (asgs.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="8" class="text-center py-5">
            <div class="empty-state">
              <div class="empty-state-icon"><i class="bi bi-person-x"></i></div>
              <div class="empty-state-title">No Staff Assignments Found</div>
              <div class="empty-state-text">No personnel currently deployed to organizations.</div>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = asgs.map(a => `
      <tr>
        <td><strong class="text-navy">${a.assignmentId}</strong></td>
        <td>
          <div class="fw-bold text-navy">${a.organizationName}</div>
          <small class="text-muted">${a.serviceName}</small>
        </td>
        <td>
          <div class="fw-bold">${a.staffName}</div>
          <small class="text-muted">${a.staffId} • ${a.designation}</small>
        </td>
        <td>
          <span class="service-type-badge ${a.staffType === 'Security' ? 'badge-security' : 'badge-housekeeping'}">
            ${a.staffType}
          </span>
        </td>
        <td>${a.shift}</td>
        <td>${a.startDate}</td>
        <td><span class="badge-status status-active">${a.status}</span></td>
      </tr>
    `).join('');
  }

  // Handle Assignment Submission
  const asgForm = document.getElementById('createAssignmentForm');
  if (asgForm) {
    asgForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const orgOpt = orgSelect.options[orgSelect.selectedIndex];
      const staffOpt = staffMemberSelect.options[staffMemberSelect.selectedIndex];

      if (!orgSelect.value || !staffMemberSelect.value) {
        window.ppsaEngine.showToast('Validation Error', 'Please select both organization and staff member.', 'danger');
        return;
      }

      const asgData = {
        organizationId: orgSelect.value,
        organizationName: orgOpt.getAttribute('data-name'),
        serviceName: document.getElementById('asgServiceName')?.value || 'Institutional Staffing',
        staffType: staffTypeSelect.value,
        staffId: staffMemberSelect.value,
        staffName: staffOpt.getAttribute('data-name'),
        shift: document.getElementById('asgShiftSelect')?.value || 'Morning',
        startDate: document.getElementById('asgStartDate')?.value || new Date().toISOString().split('T')[0]
      };

      const newAsg = window.ppsaEngine.createAssignment(asgData);

      // Also check if URL had reqId to mark request as 'Staff Assigned'
      const urlParams = new URLSearchParams(window.location.search);
      const linkedReqId = urlParams.get('reqId');
      if (linkedReqId) {
        window.ppsaEngine.updateRequestStatus(linkedReqId, 'Staff Assigned');
      }

      window.ppsaEngine.showToast('Staff Assigned', `Generated ${newAsg.assignmentId} for ${newAsg.staffName}`, 'success');

      asgForm.reset();
      updateStaffMembers();
      renderAssignments();
    });
  }

  renderAssignments();
}

// ==========================================================================
// 8. ATTENDANCE MANAGEMENT
// ==========================================================================
function initAttendancePage() {
  const tableBody = document.querySelector('#attendanceManagementTable tbody');
  const dateInput = document.getElementById('attDateFilter');
  const orgFilter = document.getElementById('attOrgFilter');
  const staffTypeFilter = document.getElementById('attStaffTypeFilter');

  // Pre-fill date with 2026-09-27
  if (dateInput && !dateInput.value) {
    dateInput.value = '2026-09-27';
  }

  // Populate Org filter
  if (orgFilter) {
    const orgs = window.ppsaEngine.getOrganizations();
    orgFilter.innerHTML = '<option value="All">All Organizations</option>' +
      orgs.map(o => `<option value="${o.name}">${o.name}</option>`).join('');
  }

  function renderAttendance() {
    if (!tableBody) return;
    const date = dateInput ? dateInput.value : '2026-09-27';
    const org = orgFilter ? orgFilter.value : 'All';
    const type = staffTypeFilter ? staffTypeFilter.value : 'All';

    const records = window.ppsaEngine.getAttendanceRecords(date, org, type);

    if (records.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="8" class="text-center py-5">
            <div class="empty-state">
              <div class="empty-state-icon"><i class="bi bi-calendar-x"></i></div>
              <div class="empty-state-title">No Attendance Logs Found</div>
              <div class="empty-state-text">No attendance entries recorded for the selected date and filters.</div>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = records.map(r => `
      <tr>
        <td><strong>${r.date}</strong></td>
        <td>
          <div class="fw-bold text-navy">${r.staffName}</div>
          <small class="text-muted">${r.staffId}</small>
        </td>
        <td>
          <span class="service-type-badge ${r.staffType === 'Security' ? 'badge-security' : 'badge-housekeeping'}">
            ${r.staffType}
          </span>
        </td>
        <td>${r.organizationName}</td>
        <td><span class="badge bg-light text-dark border">${r.checkIn}</span></td>
        <td><span class="badge bg-light text-dark border">${r.checkOut}</span></td>
        <td>
          <span class="badge-status ${
            r.status === 'Present' ? 'status-active' :
            r.status === 'Absent' ? 'status-rejected' : 'status-pending'
          }">
            ${r.status}
          </span>
        </td>
        <td><small class="text-muted">${r.remarks || '-'}</small></td>
      </tr>
    `).join('');
  }

  if (dateInput) dateInput.addEventListener('change', renderAttendance);
  if (orgFilter) orgFilter.addEventListener('change', renderAttendance);
  if (staffTypeFilter) staffTypeFilter.addEventListener('change', renderAttendance);

  // Quick Attendance Logger Modal Form
  const attLogForm = document.getElementById('recordAttendanceForm');
  if (attLogForm) {
    // Populate staff in modal
    const attStaffSelect = document.getElementById('attStaffSelect');
    if (attStaffSelect) {
      const allStaff = window.ppsaEngine.getAllStaff();
      attStaffSelect.innerHTML = '<option value="">-- Select Staff Member --</option>' +
        allStaff.map(s => `
          <option value="${s.id}" data-name="${s.name}" data-type="${s.staffCategory}" data-org="${s.assignedOrgName}">
            ${s.name} (${s.id}) - ${s.staffCategory} [${s.assignedOrgName}]
          </option>
        `).join('');
    }

    attLogForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const staffOpt = attStaffSelect.options[attStaffSelect.selectedIndex];

      const record = {
        date: document.getElementById('attRecordDate').value || '2026-09-27',
        staffId: attStaffSelect.value,
        staffName: staffOpt.getAttribute('data-name'),
        staffType: staffOpt.getAttribute('data-type'),
        organizationName: staffOpt.getAttribute('data-org'),
        checkIn: document.getElementById('attCheckIn').value || '08:00 AM',
        checkOut: document.getElementById('attCheckOut').value || '04:00 PM',
        status: document.getElementById('attStatusSelect').value,
        remarks: document.getElementById('attRemarks').value || 'Recorded by supervisor'
      };

      window.ppsaEngine.recordAttendance(record);
      window.ppsaEngine.showToast('Attendance Logged', `Marked ${record.staffName} as ${record.status}`, 'success');

      const modalEl = document.getElementById('recordAttendanceModal');
      if (modalEl && window.bootstrap) {
        bootstrap.Modal.getInstance(modalEl).hide();
      }
      attLogForm.reset();
      renderAttendance();
    });
  }

  renderAttendance();
}

// ==========================================================================
// 9. ENQUIRIES MANAGEMENT
// ==========================================================================
function initEnquiriesPage() {
  const tableBody = document.querySelector('#enquiriesManagementTable tbody');
  const statusFilter = document.getElementById('filterEnquiryStatus');
  const searchInput = document.getElementById('searchEnquiryInput');

  function renderEnquiries() {
    if (!tableBody) return;
    const st = statusFilter ? statusFilter.value : 'All';
    const q = searchInput ? searchInput.value.trim() : '';
    const enquiries = window.ppsaEngine.getEnquiries(st, q);

    if (enquiries.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="8" class="text-center py-5">
            <div class="empty-state">
              <div class="empty-state-icon"><i class="bi bi-chat-square-dots"></i></div>
              <div class="empty-state-title">No Enquiries Found</div>
              <div class="empty-state-text">No customer enquiries match your filters.</div>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = enquiries.map(e => `
      <tr>
        <td><strong class="text-navy">${e.id}</strong></td>
        <td>
          <div class="fw-bold text-navy">${e.customerName}</div>
          <small class="text-muted">${e.organization}</small>
        </td>
        <td>
          <div>${e.email}</div>
          <small class="text-muted">${e.phone}</small>
        </td>
        <td><span class="badge bg-light text-dark border">${e.service}</span></td>
        <td><div class="text-truncate" style="max-width: 200px;">${e.message}</div></td>
        <td>${e.date}</td>
        <td>
          <span class="badge-status ${
            e.status === 'New' ? 'status-pending' :
            e.status === 'In Progress' ? 'status-approved' : 'status-active'
          }">
            ${e.status}
          </span>
        </td>
        <td>
          <button class="btn btn-sm btn-outline-primary" onclick="openEnquiryModal('${e.id}')">
            View / Respond
          </button>
        </td>
      </tr>
    `).join('');
  }

  if (statusFilter) statusFilter.addEventListener('change', renderEnquiries);
  if (searchInput) searchInput.addEventListener('input', renderEnquiries);

  window.openEnquiryModal = function(enqId) {
    const enq = window.ppsaEngine.getEnquiries().find(item => item.id === enqId);
    if (!enq) return;

    const setTxt = (id, txt) => {
      const el = document.getElementById(id);
      if (el) el.textContent = txt;
    };

    setTxt('enqModalId', enq.id);
    setTxt('enqModalCustomer', `${enq.customerName} (${enq.organization})`);
    setTxt('enqModalContact', `${enq.email} | ${enq.phone}`);
    setTxt('enqModalService', enq.service);
    setTxt('enqModalDate', enq.date);
    setTxt('enqModalMessage', enq.message);

    const replyBox = document.getElementById('enqReplyText');
    if (replyBox) replyBox.value = enq.adminResponse || '';

    const modalEl = document.getElementById('enquiryModal');
    if (modalEl && window.bootstrap) {
      new bootstrap.Modal(modalEl).show();
    }
  };

  // Reply form submit
  const replyForm = document.getElementById('enquiryReplyForm');
  if (replyForm) {
    replyForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const enqId = document.getElementById('enqModalId')?.textContent;
      const reply = document.getElementById('enqReplyText')?.value.trim();
      const status = document.getElementById('enqStatusSelect')?.value || 'Responded';

      if (!reply) {
        window.ppsaEngine.showToast('Validation Error', 'Please type a response message.', 'danger');
        return;
      }

      window.ppsaEngine.respondToEnquiry(enqId, reply, status);
      window.ppsaEngine.showToast('Response Sent', `Enquiry ${enqId} marked as ${status}.`, 'success');

      const modalEl = document.getElementById('enquiryModal');
      if (modalEl && window.bootstrap) {
        bootstrap.Modal.getInstance(modalEl).hide();
      }
      renderEnquiries();
    });
  }

  renderEnquiries();
}

// ==========================================================================
// 10. COMPREHENSIVE REPORTS SUITE
// ==========================================================================
function initReportsPage() {
  const reportTypeSelect = document.getElementById('reportTypeSelect');
  const reportTableHead = document.querySelector('#reportsMasterTable thead');
  const reportTableBody = document.querySelector('#reportsMasterTable tbody');
  const reportTitleDisplay = document.getElementById('reportTitleDisplay');

  function generateReport() {
    const type = reportTypeSelect ? reportTypeSelect.value : 'staff';

    if (type === 'staff') {
      reportTitleDisplay.textContent = 'Workforce & Staff Deployment Master Report';
      reportTableHead.innerHTML = `
        <tr>
          <th>Staff ID</th>
          <th>Name</th>
          <th>Category</th>
          <th>Designation</th>
          <th>Experience</th>
          <th>Assigned Organization</th>
          <th>Shift</th>
          <th>Status</th>
        </tr>
      `;
      const allStaff = window.ppsaEngine.getAllStaff();
      reportTableBody.innerHTML = allStaff.map(s => `
        <tr>
          <td><strong>${s.id}</strong></td>
          <td>${s.name}</td>
          <td>${s.staffCategory}</td>
          <td>${s.designation}</td>
          <td>${s.experience}</td>
          <td>${s.assignedOrgName}</td>
          <td>${s.shiftPreference}</td>
          <td><span class="badge bg-light text-dark border">${s.status}</span></td>
        </tr>
      `).join('');
    } else if (type === 'attendance') {
      reportTitleDisplay.textContent = 'Daily Staff Attendance Log Report';
      reportTableHead.innerHTML = `
        <tr>
          <th>Date</th>
          <th>Staff ID</th>
          <th>Staff Name</th>
          <th>Type</th>
          <th>Institution / Organization</th>
          <th>Check In</th>
          <th>Check Out</th>
          <th>Status</th>
        </tr>
      `;
      const att = window.ppsaEngine.getAttendanceRecords();
      reportTableBody.innerHTML = att.map(a => `
        <tr>
          <td>${a.date}</td>
          <td><strong>${a.staffId}</strong></td>
          <td>${a.staffName}</td>
          <td>${a.staffType}</td>
          <td>${a.organizationName}</td>
          <td>${a.checkIn}</td>
          <td>${a.checkOut}</td>
          <td><span class="badge bg-light text-dark border">${a.status}</span></td>
        </tr>
      `).join('');
    } else if (type === 'requests') {
      reportTitleDisplay.textContent = 'Service Booking Requests Pipeline Report';
      reportTableHead.innerHTML = `
        <tr>
          <th>Request ID</th>
          <th>Organization</th>
          <th>Service Name</th>
          <th>Required Staff</th>
          <th>Shift</th>
          <th>Start Date</th>
          <th>Duration</th>
          <th>Status</th>
        </tr>
      `;
      const reqs = window.ppsaEngine.getRequests();
      reportTableBody.innerHTML = reqs.map(r => `
        <tr>
          <td><strong>${r.id}</strong></td>
          <td>${r.organizationName}</td>
          <td>${r.serviceName}</td>
          <td>${r.totalStaff} Personnel</td>
          <td>${r.shift}</td>
          <td>${r.startDate}</td>
          <td>${r.duration}</td>
          <td><span class="badge bg-light text-dark border">${r.status}</span></td>
        </tr>
      `).join('');
    } else if (type === 'organizations') {
      reportTitleDisplay.textContent = 'Institutional Client Coverage Report';
      reportTableHead.innerHTML = `
        <tr>
          <th>Org ID</th>
          <th>Organization Name</th>
          <th>Type</th>
          <th>Contact Person</th>
          <th>Phone</th>
          <th>Required</th>
          <th>Assigned</th>
          <th>Status</th>
        </tr>
      `;
      const orgs = window.ppsaEngine.getOrganizations();
      reportTableBody.innerHTML = orgs.map(o => `
        <tr>
          <td><strong>${o.id}</strong></td>
          <td>${o.name}</td>
          <td>${o.type}</td>
          <td>${o.contactPerson}</td>
          <td>${o.phone}</td>
          <td>${o.requiredStaff}</td>
          <td>${o.assignedStaff}</td>
          <td><span class="badge bg-light text-dark border">${o.status}</span></td>
        </tr>
      `).join('');
    }
  }

  if (reportTypeSelect) {
    reportTypeSelect.addEventListener('change', generateReport);
  }

  // Export CSV
  const btnExportCsv = document.getElementById('btnExportCsv');
  if (btnExportCsv) {
    btnExportCsv.addEventListener('click', () => {
      const table = document.getElementById('reportsMasterTable');
      let csv = [];
      for (let row of table.rows) {
        let cols = Array.from(row.cells).map(cell => `"${cell.innerText.replace(/"/g, '""')}"`);
        csv.push(cols.join(','));
      }
      const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('href', url);
      a.setAttribute('download', `PPSA_Report_${reportTypeSelect.value}_2026.csv`);
      a.click();
      window.ppsaEngine.showToast('Export Complete', 'Report CSV downloaded successfully.', 'success');
    });
  }

  // Export PDF / Print
  const btnPrintReport = document.getElementById('btnPrintReport');
  if (btnPrintReport) {
    btnPrintReport.addEventListener('click', () => {
      window.print();
    });
  }

  generateReport();
}

// ==========================================================================
// 11. CUSTOMER DASHBOARD
// ==========================================================================
function initCustomerDashboardPage() {
  const reqs = window.ppsaEngine.getRequests();
  // Filter for demo customer organization: Government Higher Secondary School
  const myOrgName = 'Government Higher Secondary School';
  const myRequests = reqs.filter(r => r.organizationName.includes('School') || r.organizationName.includes('Government'));

  const activeCount = myRequests.filter(r => r.status === 'Active' || r.status === 'Staff Assigned').length;
  const pendingCount = myRequests.filter(r => r.status === 'Pending' || r.status === 'Under Review').length;
  const approvedCount = myRequests.filter(r => r.status === 'Approved').length;
  const completedCount = myRequests.filter(r => r.status === 'Completed').length;

  const setEl = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  setEl('custActiveReqs', activeCount);
  setEl('custPendingReqs', pendingCount);
  setEl('custApprovedReqs', approvedCount);
  setEl('custCompletedReqs', completedCount);

  // Render Recent Requests
  const table = document.getElementById('customerRecentRequestsTable');
  if (table) {
    table.innerHTML = myRequests.map(r => `
      <tr>
        <td><strong class="text-navy">${r.id}</strong></td>
        <td>${r.serviceName}</td>
        <td><span class="badge bg-light text-dark border">${r.totalStaff} Personnel</span></td>
        <td>${r.shift}</td>
        <td>${r.requestDate}</td>
        <td>
          <span class="badge-status status-${r.status.toLowerCase().replace(/\s+/g, '-')}">
            ${r.status}
          </span>
        </td>
        <td>
          <a href="../track-request.html?id=${r.id}" class="btn btn-sm btn-outline-primary">
            <i class="bi bi-clock-history me-1"></i> Track
          </a>
        </td>
      </tr>
    `).join('');
  }

  // Render Recent Enquiries
  const enqTable = document.getElementById('customerRecentEnquiriesTable');
  if (enqTable) {
    const enqs = window.ppsaEngine.getEnquiries();
    enqTable.innerHTML = enqs.map(e => `
      <tr>
        <td><strong>${e.id}</strong></td>
        <td>${e.service}</td>
        <td>${e.date}</td>
        <td>
          <span class="badge-status ${e.status === 'Responded' ? 'status-active' : 'status-pending'}">
            ${e.status}
          </span>
        </td>
      </tr>
    `).join('');
  }
}
