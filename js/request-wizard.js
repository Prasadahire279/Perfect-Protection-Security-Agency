/**
 * PERFECT PROTECTION SECURITY AGENCY - MULTI-STEP REQUEST SERVICE WIZARD
 * Final Year Project 2026 - Security & Housekeeping Staff Management System
 * 
 * Interactive 5-step wizard managing form state, multi-step transitions,
 * real-time validation, automatic total staff calculations, review summary,
 * and dispatching new requests to LocalStorage store.
 */

document.addEventListener('DOMContentLoaded', () => {
  let currentStep = 1;
  const totalSteps = 5;

  // DOM Elements
  const form = document.getElementById('requestStaffWizardForm');
  const btnNext = document.getElementById('wizardNextBtn');
  const btnPrev = document.getElementById('wizardPrevBtn');
  const btnSubmit = document.getElementById('wizardSubmitBtn');

  // Input counters for dynamic calculation
  const secGuardsInput = document.getElementById('reqSecGuards');
  const supervisorsInput = document.getElementById('reqSupervisors');
  const hkStaffInput = document.getElementById('reqHkStaff');
  const totalStaffBadge = document.getElementById('totalStaffDisplay');

  function calculateTotalStaff() {
    const sec = parseInt(secGuardsInput?.value || 0, 10);
    const sup = parseInt(supervisorsInput?.value || 0, 10);
    const hk = parseInt(hkStaffInput?.value || 0, 10);
    const total = sec + sup + hk;
    if (totalStaffBadge) {
      totalStaffBadge.textContent = total;
    }
    return total;
  }

  [secGuardsInput, supervisorsInput, hkStaffInput].forEach(inp => {
    if (inp) inp.addEventListener('input', calculateTotalStaff);
  });

  // Wizard Navigation
  window.goToWizardStep = function(step) {
    if (step < 1 || step > totalSteps) return;

    // Validate if moving forward
    if (step > currentStep && !validateCurrentStep(currentStep)) {
      return;
    }

    // Hide all step panes
    document.querySelectorAll('.wizard-step-pane').forEach(pane => {
      pane.classList.remove('active');
    });

    // Show target step pane
    const targetPane = document.getElementById(`wizardStep${step}`);
    if (targetPane) targetPane.classList.add('active');

    // Update progress node indicators
    document.querySelectorAll('.wizard-step-node').forEach(node => {
      const nodeStep = parseInt(node.getAttribute('data-step'), 10);
      node.classList.remove('active', 'completed');
      if (nodeStep === step) {
        node.classList.add('active');
      } else if (nodeStep < step) {
        node.classList.add('completed');
      }
    });

    currentStep = step;

    // Update buttons
    if (btnPrev) btnPrev.style.display = (step === 1 || step === 5) ? 'none' : 'inline-flex';
    if (btnNext) btnNext.style.display = (step >= 4) ? 'none' : 'inline-flex';
    if (btnSubmit) btnSubmit.style.display = (step === 4) ? 'inline-flex' : 'none';

    // When reaching review step 4, populate summary
    if (step === 4) {
      populateReviewSummary();
    }

    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  function validateCurrentStep(step) {
    let isValid = true;

    // Helper: mark invalid
    const setInvalid = (elId, errorMsg) => {
      const el = document.getElementById(elId);
      if (!el) return;
      el.classList.add('is-invalid');
      let fb = el.parentElement.querySelector('.invalid-feedback');
      if (fb) fb.textContent = errorMsg;
      isValid = false;
    };

    const setValid = (elId) => {
      const el = document.getElementById(elId);
      if (el) el.classList.remove('is-invalid');
    };

    if (step === 1) {
      const orgName = document.getElementById('reqOrgName')?.value.trim();
      const orgType = document.getElementById('reqOrgType')?.value;
      const contactPerson = document.getElementById('reqContactPerson')?.value.trim();
      const email = document.getElementById('reqEmail')?.value.trim();
      const phone = document.getElementById('reqPhone')?.value.trim();
      const address = document.getElementById('reqAddress')?.value.trim();

      if (!orgName) setInvalid('reqOrgName', 'Organization name is required');
      else setValid('reqOrgName');

      if (!orgType) setInvalid('reqOrgType', 'Please select organization type');
      else setValid('reqOrgType');

      if (!contactPerson) setInvalid('reqContactPerson', 'Contact person name is required');
      else setValid('reqContactPerson');

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) setInvalid('reqEmail', 'Please enter a valid email address');
      else setValid('reqEmail');

      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phone || !phoneRegex.test(phone.replace(/\D/g, ''))) {
        setInvalid('reqPhone', 'Please enter a valid 10-digit mobile number');
      } else setValid('reqPhone');

      if (!address) setInvalid('reqAddress', 'Please provide physical address');
      else setValid('reqAddress');
    }

    if (step === 2) {
      const serviceId = document.getElementById('reqServiceId')?.value;
      const shift = document.getElementById('reqShift')?.value;
      const startDate = document.getElementById('reqStartDate')?.value;

      if (!serviceId) setInvalid('reqServiceId', 'Please choose primary service');
      else setValid('reqServiceId');

      if (!shift) setInvalid('reqShift', 'Please select work shift');
      else setValid('reqShift');

      if (!startDate) {
        setInvalid('reqStartDate', 'Deployment start date is required');
      } else {
        const selected = new Date(startDate);
        const today = new Date();
        today.setHours(0,0,0,0);
        if (selected < today) {
          setInvalid('reqStartDate', 'Start date cannot be in the past');
        } else {
          setValid('reqStartDate');
        }
      }
    }

    if (step === 3) {
      const total = calculateTotalStaff();
      const errBox = document.getElementById('staffRequirementError');
      if (total < 1) {
        if (errBox) errBox.style.display = 'block';
        isValid = false;
      } else {
        if (errBox) errBox.style.display = 'none';
      }
    }

    return isValid;
  }

  function populateReviewSummary() {
    const orgName = document.getElementById('reqOrgName')?.value || 'N/A';
    const orgType = document.getElementById('reqOrgType')?.value || 'N/A';
    const contact = document.getElementById('reqContactPerson')?.value || 'N/A';
    const email = document.getElementById('reqEmail')?.value || 'N/A';
    const phone = document.getElementById('reqPhone')?.value || 'N/A';
    const address = document.getElementById('reqAddress')?.value || 'N/A';

    const serviceSelect = document.getElementById('reqServiceId');
    const serviceName = serviceSelect?.options[serviceSelect.selectedIndex]?.text || 'Security & Housekeeping';
    const shift = document.getElementById('reqShift')?.value || 'Morning';
    const startDate = document.getElementById('reqStartDate')?.value || 'Immediate';
    const duration = document.getElementById('reqDuration')?.value || '12 Months';
    const workingDays = document.getElementById('reqWorkingDays')?.value || 'Monday to Saturday';

    const sec = parseInt(document.getElementById('reqSecGuards')?.value || 0);
    const sup = parseInt(document.getElementById('reqSupervisors')?.value || 0);
    const hk = parseInt(document.getElementById('reqHkStaff')?.value || 0);
    const total = sec + sup + hk;

    const special = document.getElementById('reqSpecialNotes')?.value || 'Standard institutional guidelines';

    // Fill Review DOM
    const setTxt = (id, txt) => {
      const el = document.getElementById(id);
      if (el) el.textContent = txt;
    };

    setTxt('revOrgName', orgName);
    setTxt('revOrgType', orgType);
    setTxt('revContact', `${contact} (${phone} | ${email})`);
    setTxt('revAddress', address);
    setTxt('revService', serviceName);
    setTxt('revShift', shift);
    setTxt('revStartDate', startDate);
    setTxt('revDuration', duration);
    setTxt('revWorkingDays', workingDays);
    setTxt('revStaffBreakdown', `${sec} Guards, ${sup} Supervisors, ${hk} Housekeeping Staff (Total: ${total} Personnel)`);
    setTxt('revNotes', special);
  }

  // Handle Submit
  if (btnSubmit) {
    btnSubmit.addEventListener('click', (e) => {
      e.preventDefault();

      const serviceSelect = document.getElementById('reqServiceId');

      const formData = {
        organizationName: document.getElementById('reqOrgName')?.value,
        organizationType: document.getElementById('reqOrgType')?.value,
        contactPerson: document.getElementById('reqContactPerson')?.value,
        email: document.getElementById('reqEmail')?.value,
        phone: document.getElementById('reqPhone')?.value,
        address: document.getElementById('reqAddress')?.value,
        city: document.getElementById('reqCity')?.value || 'Capital City',
        pincode: document.getElementById('reqPincode')?.value || '400001',
        serviceId: serviceSelect?.value,
        serviceName: serviceSelect?.options[serviceSelect.selectedIndex]?.text.split(' - ')[0],
        shift: document.getElementById('reqShift')?.value,
        startDate: document.getElementById('reqStartDate')?.value,
        duration: document.getElementById('reqDuration')?.value,
        workingDays: document.getElementById('reqWorkingDays')?.value,
        securityGuards: document.getElementById('reqSecGuards')?.value,
        supervisors: document.getElementById('reqSupervisors')?.value,
        housekeepingStaff: document.getElementById('reqHkStaff')?.value,
        specialInstructions: document.getElementById('reqSpecialNotes')?.value
      };

      // Dispatch to PPSA Engine
      const createdRequest = window.ppsaEngine.createServiceRequest(formData);

      // Populate Success Screen (Step 5)
      const setTxt = (id, txt) => {
        const el = document.getElementById(id);
        if (el) el.textContent = txt;
      };

      setTxt('successRequestId', createdRequest.id);
      setTxt('successOrgName', createdRequest.organizationName);
      setTxt('successService', createdRequest.serviceName);
      setTxt('successStaffCount', `${createdRequest.totalStaff} Personnel`);
      setTxt('successDate', createdRequest.requestDate);

      // Update Track button URL
      const trackBtn = document.getElementById('btnTrackSubmittedRequest');
      if (trackBtn) {
        trackBtn.href = `track-request.html?id=${createdRequest.id}`;
      }

      // Transition to Step 5
      window.goToWizardStep(5);
      window.ppsaEngine.showToast('Request Created', `Request ${createdRequest.id} has been registered!`, 'success');
    });
  }

  if (btnNext) {
    btnNext.addEventListener('click', () => {
      window.goToWizardStep(currentStep + 1);
    });
  }

  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      window.goToWizardStep(currentStep - 1);
    });
  }

  // Pre-fill service if passed via URL parameter e.g. request-service.html?service=SRV-101
  const urlParams = new URLSearchParams(window.location.search);
  const preService = urlParams.get('service');
  if (preService && document.getElementById('reqServiceId')) {
    document.getElementById('reqServiceId').value = preService;
  }
});
