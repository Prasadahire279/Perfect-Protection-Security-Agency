/**
 * PERFECT PROTECTION SECURITY AGENCY - PUBLIC WEBSITE SCRIPTS
 * Final Year Project 2026 - Security & Housekeeping Staff Management System
 */

document.addEventListener('DOMContentLoaded', () => {
  // Sticky Navbar on Scroll
  const navbar = document.querySelector('.agency-navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        navbar.classList.add('is-sticky');
      } else {
        navbar.classList.remove('is-sticky');
      }
    });
  }

  // Highlight active navigation link
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // Handle Contact Enquiry Form on contact.html
  const enquiryForm = document.getElementById('agencyContactForm');
  if (enquiryForm) {
    enquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('contactName')?.value.trim();
      const email = document.getElementById('contactEmail')?.value.trim();
      const phone = document.getElementById('contactPhone')?.value.trim();
      const organization = document.getElementById('contactOrg')?.value.trim() || 'General Public';
      const service = document.getElementById('contactService')?.value || 'General Security Inquiry';
      const message = document.getElementById('contactMessage')?.value.trim();

      if (!name || !email || !phone || !message) {
        window.ppsaEngine.showToast('Validation Error', 'Please fill in all required enquiry fields.', 'danger');
        return;
      }

      const enq = window.ppsaEngine.saveEnquiry({
        customerName: name,
        email,
        phone,
        organization,
        service,
        message
      });

      // Show success modal or alert
      const successModalEl = document.getElementById('enquirySuccessModal');
      if (successModalEl && window.bootstrap) {
        const enqIdSpan = document.getElementById('enquiryIdDisplay');
        if (enqIdSpan) enqIdSpan.textContent = enq.id;
        const modal = new bootstrap.Modal(successModalEl);
        modal.show();
      } else {
        window.ppsaEngine.showToast('Enquiry Submitted', `Your Enquiry ID: ${enq.id}. Our officer will contact you within 24 hours.`, 'success');
      }

      enquiryForm.reset();
    });
  }

  // Quick Tracker Search on track-request.html or index.html
  const quickTrackForm = document.getElementById('quickTrackForm');
  if (quickTrackForm) {
    quickTrackForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const reqId = document.getElementById('quickTrackInput')?.value.trim();
      if (reqId) {
        window.location.href = `track-request.html?id=${encodeURIComponent(reqId)}`;
      }
    });
  }
});
