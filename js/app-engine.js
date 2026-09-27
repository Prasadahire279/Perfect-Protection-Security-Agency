/**
 * PERFECT PROTECTION SECURITY AGENCY - CORE BUSINESS LOGIC & STATE ENGINE
 * Final Year Project 2026 - Security & Housekeeping Staff Management System
 * 
 * Manages all CRUD workflows, request lifecycle transitions, staff assignments,
 * attendance tracking, analytics calculations, and LocalStorage synchronization.
 */

class PPSAEngine {
  constructor() {
    this.init();
  }

  init() {
    try {
      const existing = localStorage.getItem(PPSA_STORAGE_KEY);
      if (!existing) {
        this.saveStore(INITIAL_PPSA_DATA);
      }
    } catch (e) {
      console.warn('LocalStorage error, fallback to memory', e);
      this._memStore = JSON.parse(JSON.stringify(INITIAL_PPSA_DATA));
    }
  }

  getStore() {
    try {
      const data = localStorage.getItem(PPSA_STORAGE_KEY);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Error reading store', e);
    }
    return this._memStore || INITIAL_PPSA_DATA;
  }

  saveStore(data) {
    try {
      localStorage.setItem(PPSA_STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      this._memStore = data;
    }
  }

  resetDemoData() {
    this.saveStore(INITIAL_PPSA_DATA);
    this.showToast('System Reset', 'Demo data successfully reset to initial state.', 'success');
  }

  // --- ORGANIZATIONS ---
  getOrganizations(search = '', type = 'All') {
    const store = this.getStore();
    return store.organizations.filter(org => {
      const matchesSearch = !search || 
        org.name.toLowerCase().includes(search.toLowerCase()) ||
        org.id.toLowerCase().includes(search.toLowerCase()) ||
        org.contactPerson.toLowerCase().includes(search.toLowerCase());
      const matchesType = type === 'All' || org.type === type;
      return matchesSearch && matchesType;
    });
  }

  getOrganizationById(id) {
    const store = this.getStore();
    return store.organizations.find(o => o.id === id);
  }

  saveOrganization(orgData) {
    const store = this.getStore();
    if (orgData.id) {
      const idx = store.organizations.findIndex(o => o.id === orgData.id);
      if (idx !== -1) {
        store.organizations[idx] = { ...store.organizations[idx], ...orgData };
      }
    } else {
      const newId = `ORG-${1000 + store.organizations.length + 1}`;
      const newOrg = {
        id: newId,
        requiredStaff: parseInt(orgData.requiredStaff) || 0,
        assignedStaff: 0,
        status: 'Active',
        createdDate: new Date().toISOString().split('T')[0],
        ...orgData
      };
      store.organizations.unshift(newOrg);
      this.addNotification('New Organization Added', `Registered institution: ${newOrg.name}`, 'info');
    }
    this.saveStore(store);
    return true;
  }

  toggleOrganizationStatus(id) {
    const store = this.getStore();
    const org = store.organizations.find(o => o.id === id);
    if (org) {
      org.status = org.status === 'Active' ? 'Deactivated' : 'Active';
      this.saveStore(store);
      return org.status;
    }
    return null;
  }

  // --- SECURITY STAFF ---
  getSecurityStaff(search = '', status = 'All', shift = 'All') {
    const store = this.getStore();
    return store.securityStaff.filter(staff => {
      const matchesSearch = !search ||
        staff.name.toLowerCase().includes(search.toLowerCase()) ||
        staff.id.toLowerCase().includes(search.toLowerCase()) ||
        staff.phone.includes(search);
      const matchesStatus = status === 'All' || staff.status === status;
      const matchesShift = shift === 'All' || staff.shiftPreference === shift;
      return matchesSearch && matchesStatus && matchesShift;
    });
  }

  saveSecurityStaff(staffData) {
    const store = this.getStore();
    if (staffData.id) {
      const idx = store.securityStaff.findIndex(s => s.id === staffData.id);
      if (idx !== -1) {
        store.securityStaff[idx] = { ...store.securityStaff[idx], ...staffData };
      }
    } else {
      const nextNum = 100 + store.securityStaff.length + 1;
      const newStaff = {
        id: `SEC-${nextNum}`,
        badgeNumber: `PP-SG-${store.securityStaff.length + 1}`,
        assignedOrgId: null,
        assignedOrgName: 'Unassigned (Available)',
        status: 'Active',
        ...staffData
      };
      store.securityStaff.unshift(newStaff);
      this.addNotification('Security Staff Registered', `${newStaff.name} added as ${newStaff.designation}`, 'info');
    }
    this.saveStore(store);
    return true;
  }

  // --- HOUSEKEEPING STAFF ---
  getHousekeepingStaff(search = '', status = 'All', shift = 'All') {
    const store = this.getStore();
    return store.housekeepingStaff.filter(staff => {
      const matchesSearch = !search ||
        staff.name.toLowerCase().includes(search.toLowerCase()) ||
        staff.id.toLowerCase().includes(search.toLowerCase()) ||
        staff.phone.includes(search);
      const matchesStatus = status === 'All' || staff.status === status;
      const matchesShift = shift === 'All' || staff.shiftPreference === shift;
      return matchesSearch && matchesStatus && matchesShift;
    });
  }

  saveHousekeepingStaff(staffData) {
    const store = this.getStore();
    if (staffData.id) {
      const idx = store.housekeepingStaff.findIndex(s => s.id === staffData.id);
      if (idx !== -1) {
        store.housekeepingStaff[idx] = { ...store.housekeepingStaff[idx], ...staffData };
      }
    } else {
      const nextNum = 200 + store.housekeepingStaff.length + 1;
      const newStaff = {
        id: `HK-${nextNum}`,
        badgeNumber: `PP-HK-${store.housekeepingStaff.length + 1}`,
        assignedOrgId: null,
        assignedOrgName: 'Unassigned (Available)',
        status: 'Active',
        ...staffData
      };
      store.housekeepingStaff.unshift(newStaff);
      this.addNotification('Housekeeping Staff Registered', `${newStaff.name} added as ${newStaff.designation}`, 'info');
    }
    this.saveStore(store);
    return true;
  }

  getAllStaff() {
    const store = this.getStore();
    const sec = store.securityStaff.map(s => ({ ...s, staffCategory: 'Security' }));
    const hk = store.housekeepingStaff.map(s => ({ ...s, staffCategory: 'Housekeeping' }));
    return [...sec, ...hk];
  }

  // --- SERVICES ---
  getServices(category = 'All') {
    const store = this.getStore();
    if (category === 'All') return store.services;
    return store.services.filter(s => s.category.toLowerCase() === category.toLowerCase());
  }

  getServiceById(id) {
    const store = this.getStore();
    return store.services.find(s => s.id === id);
  }

  // --- SERVICE REQUESTS (Multi-step Booking Workflow) ---
  getRequests(statusFilter = 'All', search = '') {
    const store = this.getStore();
    return store.serviceRequests.filter(req => {
      const matchesStatus = statusFilter === 'All' || req.status === statusFilter;
      const matchesSearch = !search ||
        req.id.toLowerCase().includes(search.toLowerCase()) ||
        req.organizationName.toLowerCase().includes(search.toLowerCase()) ||
        req.serviceName.toLowerCase().includes(search.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }

  getRequestById(id) {
    const store = this.getStore();
    return store.serviceRequests.find(r => r.id === id);
  }

  createServiceRequest(formData) {
    const store = this.getStore();
    const randomIdSuffix = Math.floor(1000 + Math.random() * 9000);
    const newReqId = `REQ-2026-${randomIdSuffix}`;

    const secCount = parseInt(formData.securityGuards) || 0;
    const supCount = parseInt(formData.supervisors) || 0;
    const hkCount = parseInt(formData.housekeepingStaff) || 0;
    const totalStaff = secCount + supCount + hkCount;

    const newRequest = {
      id: newReqId,
      organizationName: formData.organizationName,
      organizationType: formData.organizationType,
      serviceId: formData.serviceId || 'SRV-101',
      serviceName: formData.serviceName || 'Custom Institution Staffing Package',
      securityGuards: secCount,
      supervisors: supCount,
      housekeepingStaff: hkCount,
      totalStaff: totalStaff,
      shift: formData.shift || 'Morning',
      startDate: formData.startDate,
      duration: formData.duration || '12 Months',
      workingDays: formData.workingDays || 'Monday to Saturday',
      contactPerson: formData.contactPerson,
      email: formData.email,
      phone: formData.phone,
      address: `${formData.address}, ${formData.city || ''} ${formData.pincode || ''}`.trim(),
      specialInstructions: formData.specialInstructions || 'Standard institutional guidelines apply.',
      status: 'Pending', // Pending -> Under Review -> Approved -> Staff Assigned -> Active -> Completed
      requestDate: new Date().toISOString().split('T')[0]
    };

    store.serviceRequests.unshift(newRequest);

    // Also check if organization already registered; if not, add it
    let org = store.organizations.find(o => o.name.toLowerCase() === formData.organizationName.toLowerCase());
    if (!org) {
      const newOrgId = `ORG-${1000 + store.organizations.length + 1}`;
      store.organizations.push({
        id: newOrgId,
        name: formData.organizationName,
        type: formData.organizationType,
        contactPerson: formData.contactPerson,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        city: formData.city || 'Capital City',
        state: formData.state || 'Maharashtra',
        pincode: formData.pincode || '400001',
        requiredStaff: totalStaff,
        assignedStaff: 0,
        status: 'Pending Assignment',
        createdDate: new Date().toISOString().split('T')[0]
      });
    }

    this.addNotification('New Service Request', `${newReqId} submitted by ${formData.organizationName} (${totalStaff} staff)`, 'info');
    this.saveStore(store);
    return newRequest;
  }

  updateRequestStatus(id, newStatus) {
    const store = this.getStore();
    const req = store.serviceRequests.find(r => r.id === id);
    if (req) {
      req.status = newStatus;
      this.addNotification('Request Status Updated', `${req.id} updated to "${newStatus}"`, 'warning');
      this.saveStore(store);
      return true;
    }
    return false;
  }

  // --- STAFF ASSIGNMENTS ---
  getAssignments(orgId = 'All') {
    const store = this.getStore();
    if (orgId === 'All') return store.assignments;
    return store.assignments.filter(a => a.organizationId === orgId);
  }

  createAssignment(data) {
    const store = this.getStore();
    const asgId = `ASG-2026-${300 + store.assignments.length + 1}`;
    
    // Find staff member
    let staffName = '';
    let designation = '';
    if (data.staffType === 'Security') {
      const s = store.securityStaff.find(item => item.id === data.staffId);
      if (s) {
        staffName = s.name;
        designation = s.designation;
        s.assignedOrgId = data.organizationId;
        s.assignedOrgName = data.organizationName;
      }
    } else {
      const s = store.housekeepingStaff.find(item => item.id === data.staffId);
      if (s) {
        staffName = s.name;
        designation = s.designation;
        s.assignedOrgId = data.organizationId;
        s.assignedOrgName = data.organizationName;
      }
    }

    // Update organization assigned count
    const org = store.organizations.find(o => o.id === data.organizationId || o.name === data.organizationName);
    if (org) {
      org.assignedStaff = (org.assignedStaff || 0) + 1;
      org.status = 'Active';
    }

    const newAssignment = {
      assignmentId: asgId,
      organizationId: data.organizationId || (org ? org.id : 'ORG-1001'),
      organizationName: data.organizationName,
      serviceName: data.serviceName || 'Institutional Staffing',
      staffId: data.staffId,
      staffName: staffName || data.staffName,
      staffType: data.staffType,
      designation: designation || 'Staff',
      shift: data.shift || 'Morning',
      startDate: data.startDate || new Date().toISOString().split('T')[0],
      status: 'Active',
      assignedDate: new Date().toISOString().split('T')[0]
    };

    store.assignments.unshift(newAssignment);
    this.addNotification('Staff Assigned Successfully', `${staffName} deployed to ${data.organizationName} (${asgId})`, 'success');
    this.saveStore(store);
    return newAssignment;
  }

  // --- ATTENDANCE MANAGEMENT ---
  getAttendanceRecords(date = '', orgName = 'All', staffType = 'All') {
    const store = this.getStore();
    return store.attendance.filter(att => {
      const matchesDate = !date || att.date === date;
      const matchesOrg = orgName === 'All' || att.organizationName === orgName;
      const matchesType = staffType === 'All' || att.staffType === staffType;
      return matchesDate && matchesOrg && matchesType;
    });
  }

  recordAttendance(recordData) {
    const store = this.getStore();
    const newAttId = `ATT-2026-${900 + store.attendance.length + 1}`;
    const newRecord = {
      id: newAttId,
      date: recordData.date || new Date().toISOString().split('T')[0],
      staffId: recordData.staffId,
      staffName: recordData.staffName,
      staffType: recordData.staffType,
      organizationName: recordData.organizationName,
      checkIn: recordData.checkIn || '08:00 AM',
      checkOut: recordData.checkOut || '04:00 PM',
      status: recordData.status || 'Present', // Present, Absent, Leave
      remarks: recordData.remarks || 'Standard shift log'
    };

    // Remove if already marked for same date & staff
    store.attendance = store.attendance.filter(
      a => !(a.date === newRecord.date && a.staffId === newRecord.staffId)
    );
    store.attendance.unshift(newRecord);
    this.saveStore(store);
    return newRecord;
  }

  // --- ENQUIRIES ---
  getEnquiries(status = 'All', search = '') {
    const store = this.getStore();
    return store.enquiries.filter(enq => {
      const matchesStatus = status === 'All' || enq.status === status;
      const matchesSearch = !search ||
        enq.customerName.toLowerCase().includes(search.toLowerCase()) ||
        enq.id.toLowerCase().includes(search.toLowerCase()) ||
        enq.service.toLowerCase().includes(search.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }

  saveEnquiry(formData) {
    const store = this.getStore();
    const enqId = `ENQ-2026-${500 + store.enquiries.length + 1}`;
    const newEnq = {
      id: enqId,
      customerName: formData.customerName,
      email: formData.email,
      phone: formData.phone,
      organization: formData.organization || 'General Institution Enquiry',
      service: formData.service || 'General Security Inquiry',
      message: formData.message,
      date: new Date().toISOString().split('T')[0],
      status: 'New',
      adminResponse: null
    };

    store.enquiries.unshift(newEnq);
    this.addNotification('New Customer Enquiry', `Received inquiry ${enqId} from ${formData.customerName}`, 'info');
    this.saveStore(store);
    return newEnq;
  }

  respondToEnquiry(id, responseText, newStatus = 'Responded') {
    const store = this.getStore();
    const enq = store.enquiries.find(e => e.id === id);
    if (enq) {
      enq.adminResponse = responseText;
      enq.status = newStatus;
      this.saveStore(store);
      return true;
    }
    return false;
  }

  // --- DASHBOARD ANALYTICS & KPIS ---
  getDashboardMetrics() {
    const store = this.getStore();

    const totalOrganizations = store.organizations.length;
    const totalSecurityStaff = store.securityStaff.length;
    const totalHousekeepingStaff = store.housekeepingStaff.length;
    const activeAssignments = store.assignments.filter(a => a.status === 'Active').length;
    const pendingRequests = store.serviceRequests.filter(r => r.status === 'Pending' || r.status === 'Under Review').length;
    const activeServices = store.services.filter(s => s.status === 'Active').length;
    
    // Today's Attendance breakdown
    const today = '2026-09-27';
    const todayRecords = store.attendance.filter(a => a.date === today);
    const presentCount = todayRecords.filter(a => a.status === 'Present').length;
    const absentCount = todayRecords.filter(a => a.status === 'Absent').length;
    const leaveCount = todayRecords.filter(a => a.status === 'Leave').length;
    const totalRecorded = todayRecords.length || 1;
    const presentPercentage = Math.round((presentCount / totalRecorded) * 100);

    const pendingEnquiries = store.enquiries.filter(e => e.status === 'New').length;

    // Request status breakdown counts
    const requestStatusCounts = {
      Pending: store.serviceRequests.filter(r => r.status === 'Pending').length,
      UnderReview: store.serviceRequests.filter(r => r.status === 'Under Review').length,
      Approved: store.serviceRequests.filter(r => r.status === 'Approved').length,
      StaffAssigned: store.serviceRequests.filter(r => r.status === 'Staff Assigned').length,
      Active: store.serviceRequests.filter(r => r.status === 'Active').length,
      Completed: store.serviceRequests.filter(r => r.status === 'Completed').length
    };

    return {
      totalOrganizations,
      totalSecurityStaff,
      totalHousekeepingStaff,
      activeAssignments,
      pendingRequests,
      activeServices,
      presentCount,
      absentCount,
      leaveCount,
      presentPercentage,
      pendingEnquiries,
      requestStatusCounts
    };
  }

  // --- NOTIFICATIONS ---
  getNotifications() {
    const store = this.getStore();
    return store.notifications || [];
  }

  addNotification(title, message, type = 'info') {
    const store = this.getStore();
    if (!store.notifications) store.notifications = [];
    store.notifications.unshift({
      id: `NOTIF-${Date.now()}`,
      title,
      message,
      time: 'Just now',
      type,
      read: false
    });
    this.saveStore(store);
  }

  // --- UI TOAST UTILITY ---
  showToast(title, message, type = 'info') {
    let container = document.getElementById('ppsaToastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'ppsaToastContainer';
      container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
      container.style.zIndex = '1100';
      document.body.appendChild(container);
    }

    const toastId = 'toast-' + Math.random().toString(36).substr(2, 9);
    const bgClass = type === 'success' ? 'bg-success text-white' :
                    type === 'danger' ? 'bg-danger text-white' :
                    type === 'warning' ? 'bg-warning text-dark' : 'bg-dark text-white';

    const icon = type === 'success' ? 'bi-check-circle-fill' :
                 type === 'danger' ? 'bi-exclamation-triangle-fill' :
                 type === 'warning' ? 'bi-exclamation-circle-fill' : 'bi-info-circle-fill';

    const html = `
      <div id="${toastId}" class="toast align-items-center ${bgClass} border-0 shadow-lg" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
          <div class="toast-body d-flex align-items-center gap-2">
            <i class="bi ${icon} fs-5"></i>
            <div>
              <strong>${title}</strong><br>
              <small>${message}</small>
            </div>
          </div>
          <button type="button" class="btn-close ${type === 'warning' ? '' : 'btn-close-white'} me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      </div>
    `;

    container.insertAdjacentHTML('beforeend', html);
    const toastEl = document.getElementById(toastId);
    if (window.bootstrap && bootstrap.Toast) {
      const bsToast = new bootstrap.Toast(toastEl, { delay: 4500 });
      bsToast.show();
      toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
    }
  }
}

// Global engine singleton
window.ppsaEngine = new PPSAEngine();
