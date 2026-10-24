/**
 * GAVINDER SINGH — PORTFOLIO RUNTIME ENGINE (v4.0)
 * Modern, High-Performance, Framework-Free JavaScript
 * 
 * Features:
 * - Unified Obsidian & Mint Emerald Theme Design System
 * - Mobile Navigation Drawer
 * - Interactive AI Architecture & Latency Playground (Voice, RAG, LoRA)
 * - Project Category Filter Engine
 * - Bilingual Bio Switcher (English / French)
 * - Clipboard Copy with Animated Toasts
 * - Context-Aware Contact Form Submission with Web3Forms AJAX
 * - Smooth Scroll Active Section Spy
 */

(function () {
  'use strict';

  // ─── 1. MOBILE NAVIGATION DRAWER ──────────────────────────────────────────
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenuIcon = document.getElementById('mobileMenuIcon');
  const navMenu = document.getElementById('navMenu');

  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      mobileMenuBtn.setAttribute('aria-expanded', isOpen);
      if (mobileMenuIcon) {
        if (isOpen) {
          mobileMenuIcon.classList.remove('fa-bars');
          mobileMenuIcon.classList.add('fa-xmark');
        } else {
          mobileMenuIcon.classList.remove('fa-xmark');
          mobileMenuIcon.classList.add('fa-bars');
        }
      }
    });

    // Close menu when clicking on any nav link
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        if (mobileMenuIcon) {
          mobileMenuIcon.classList.remove('fa-xmark');
          mobileMenuIcon.classList.add('fa-bars');
        }
      });
    });
  }

  // ─── 2. 3D FLIP SHOWCASE CARD CONTROLLER ─────────────────────────────────
  const profileFlipCard = document.getElementById('profileFlipCard');
  if (profileFlipCard) {
    profileFlipCard.addEventListener('click', (e) => {
      // Don't toggle flip if user clicked directly on action links/buttons
      if (e.target.closest('a') || e.target.closest('button')) {
        return;
      }
      profileFlipCard.classList.toggle('is-flipped');
    });

    // Keyboard accessibility: flip on Enter or Space
    profileFlipCard.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        if (!e.target.closest('a') && !e.target.closest('button')) {
          e.preventDefault();
          profileFlipCard.classList.toggle('is-flipped');
        }
      }
    });
  }

  // ─── 3. CLIPBOARD COPY WITH ANIMATED TOAST ────────────────────────────────
  const toastNotification = document.getElementById('toastNotification');
  const toastMessage = document.getElementById('toastMessage');
  let toastTimer = null;

  function showToast(message) {
    if (!toastNotification || !toastMessage) return;
    toastMessage.textContent = message;
    toastNotification.classList.add('show');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastNotification.classList.remove('show');
    }, 3200);
  }

  function copyTextToClipboard(text, successMsg) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(successMsg || 'Copied to clipboard!');
      }).catch(() => {
        fallbackCopy(text, successMsg);
      });
    } else {
      fallbackCopy(text, successMsg);
    }
  }

  function fallbackCopy(text, successMsg) {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    try {
      document.execCommand('copy');
      showToast(successMsg || 'Copied to clipboard!');
    } catch (err) {
      showToast('Please copy manually: ' + text);
    }
    document.body.removeChild(tempInput);
  }

  // Bind all copy triggers dynamically
  const copyButtons = document.querySelectorAll('#copyEmailBtnChannel, [data-copy-email]');
  copyButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = btn.getAttribute('data-email') || 'gavindersingh164@gmail.com';
      copyTextToClipboard(email, 'Email copied: ' + email);
    });
  });

  // ─── 7. CONTACT FORM DUAL INQUIRY SEGMENT SWITCHER ────────────────────────
  const btnTypeFreelance = document.getElementById('btnTypeFreelance');
  const btnTypeRecruiter = document.getElementById('btnTypeRecruiter');
  const formSubject = document.getElementById('formSubject');
  const userMessage = document.getElementById('userMessage');

  if (btnTypeFreelance && btnTypeRecruiter) {
    btnTypeFreelance.addEventListener('click', () => {
      btnTypeFreelance.classList.add('active');
      btnTypeFreelance.setAttribute('aria-selected', 'true');
      btnTypeRecruiter.classList.remove('active');
      btnTypeRecruiter.setAttribute('aria-selected', 'false');

      if (formSubject) formSubject.value = 'New Freelance AI Project Inquiry (Gavinder Portfolio)';
      if (userMessage) userMessage.placeholder = 'Briefly describe what you\'re looking to build (e.g. voice agent, RAG, custom fine-tuning), target timeline, or current bottlenecks...';
    });

    btnTypeRecruiter.addEventListener('click', () => {
      btnTypeRecruiter.classList.add('active');
      btnTypeRecruiter.setAttribute('aria-selected', 'true');
      btnTypeFreelance.classList.remove('active');
      btnTypeFreelance.setAttribute('aria-selected', 'false');

      if (formSubject) formSubject.value = 'Recruiter / Full-Time Role Inquiry for Gavinder Singh';
      if (userMessage) userMessage.placeholder = 'Tell me about the role, team, technology stack, and compensation/location details...';
    });
  }

  // ─── 8. CONTACT FORM AJAX SUBMISSION (Web3Forms) ──────────────────────────
  const inquiryForm = document.getElementById('inquiryForm');
  const btnSubmitForm = document.getElementById('btnSubmitForm');
  const btnSubmitText = document.getElementById('btnSubmitText');
  const formStatusMsg = document.getElementById('formStatusMsg');

  if (inquiryForm) {
    inquiryForm.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!inquiryForm.checkValidity()) {
        inquiryForm.reportValidity();
        return;
      }

      if (btnSubmitForm) btnSubmitForm.disabled = true;
      if (btnSubmitText) btnSubmitText.textContent = 'Sending Message...';
      if (formStatusMsg) {
        formStatusMsg.className = 'form-status-msg';
        formStatusMsg.textContent = 'Transmitting inquiry to Gavinder\'s inbox...';
      }

      const formData = new FormData(inquiryForm);
      const jsonObject = {};
      formData.forEach((value, key) => {
        jsonObject[key] = value;
      });

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(jsonObject)
      })
        .then(async (response) => {
          const json = await response.json();
          if (response.status === 200) {
            if (formStatusMsg) {
              formStatusMsg.className = 'form-status-msg success';
              formStatusMsg.textContent = '✓ Message received! Gavinder will reply within 24 hours.';
            }
            inquiryForm.reset();
            showToast('Message sent successfully!');
          } else {
            throw new Error(json.message || 'Error submitting form.');
          }
        })
        .catch((error) => {
          if (formStatusMsg) {
            formStatusMsg.className = 'form-status-msg error';
            formStatusMsg.textContent = 'Submission error. Please email directly at gavindersingh164@gmail.com';
          }
        })
        .finally(() => {
          if (btnSubmitForm) btnSubmitForm.disabled = false;
          if (btnSubmitText) btnSubmitText.textContent = 'Send Message';
        });
    });
  }

  // ─── 9. SCROLL SPY FOR NAVIGATION LINKS ───────────────────────────────────
  const sections = document.querySelectorAll('section[id], header[id]');
  const desktopNavLinks = document.querySelectorAll('.nav-menu .nav-link');

  function onScrollSpy() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    sections.forEach((section) => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 140;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        desktopNavLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', onScrollSpy, { passive: true });

  // ─── 10. STAGGERED SCROLL REVEAL & CASCADE MOTION ENGINE ──────────────────
  function initScrollRevealMotion() {
    // 1. Enable reveal CSS classes on document
    document.documentElement.classList.add('js-reveal-ready');

    // 2. Identify Section Headers
    const sectionHeaders = document.querySelectorAll('.section-header');
    sectionHeaders.forEach((header) => {
      header.classList.add('reveal-on-scroll');
    });

    // 3. Configure Stagger Groups and their Children
    const groupsConfig = [
      { container: '.services-grid', child: '.service-card' },
      { container: '.projects-grid', child: '.project-card' },
      { container: '.experience-timeline', child: '.experience-card' },
      { container: '.stack-grid', child: '.stack-card' },
      { container: '.about-clean-card', child: '.about-clean-body, .about-clean-action' },
      { container: '.contact-hub-wrapper', child: '.contact-channels, .contact-form-card' }
    ];

    groupsConfig.forEach(({ container, child }) => {
      const parent = document.querySelector(container);
      if (parent) {
        parent.classList.add('stagger-group');
        const children = parent.querySelectorAll(child);
        children.forEach((el, index) => {
          el.classList.add('reveal-child');
          if (index >= 8) {
            el.style.transitionDelay = `${0.08 + index * 0.12}s`;
          }
        });
      }
    });

    // 4. Setup IntersectionObserver
    const observerOptions = {
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px'
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe all headers and stagger containers
    document.querySelectorAll('.reveal-on-scroll, .stagger-group').forEach((el) => {
      revealObserver.observe(el);
    });

    // 5. Smooth Nav Link Click Handler
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (!targetId || targetId === '#' || targetId.length <= 1) return;

        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          const targetOffset = targetEl.getBoundingClientRect().top + window.pageYOffset - 80;
          window.scrollTo({
            top: targetOffset,
            behavior: 'smooth'
          });
          if (history.pushState) {
            history.pushState(null, null, targetId);
          }
        }
      });
    });
  }

  // Initialize immediately or on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollRevealMotion);
  } else {
    initScrollRevealMotion();
  }
})();
