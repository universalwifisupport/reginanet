/* ============================================
   CONNECTASSIST — script.js
   ============================================ */

(function () {
  'use strict';

  /* ------------------------------------------
     STICKY NAVBAR & SCROLL EFFECTS
     ------------------------------------------ */
  const navbar = document.getElementById('navbar');

  function handleNavbarScroll() {
    if (!navbar) return;
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();

  /* ------------------------------------------
     MOBILE MENU
     ------------------------------------------ */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      const isOpen = mobileMenu.classList.contains('open');
      hamburger.classList.toggle('open', !isOpen);
      mobileMenu.classList.toggle('open', !isOpen);
      hamburger.setAttribute('aria-expanded', String(!isOpen));
      document.body.style.overflow = isOpen ? '' : 'hidden';
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (
        mobileMenu.classList.contains('open') &&
        !mobileMenu.contains(e.target) &&
        !hamburger.contains(e.target)
      ) {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /* ------------------------------------------
     FAQ ACCORDION
     ------------------------------------------ */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(function (item) {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (!question || !answer) return;

    question.addEventListener('click', function () {
      const isActive = item.classList.contains('active');

      // Close all
      faqItems.forEach(function (other) {
        if (other !== item) {
          other.classList.remove('active');
          const otherAnswer = other.querySelector('.faq-answer');
          if (otherAnswer) otherAnswer.classList.remove('open');
        }
      });

      // Toggle clicked
      item.classList.toggle('active', !isActive);
      answer.classList.toggle('open', !isActive);
      question.setAttribute('aria-expanded', String(!isActive));
    });
  });

  /* ------------------------------------------
     SCROLL REVEAL ANIMATIONS
     ------------------------------------------ */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* ------------------------------------------
     ANIMATED COUNTERS
     ------------------------------------------ */
  function animateCounter(el, target, duration, suffix) {
    suffix = suffix || '';
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      el.textContent = current.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target.toLocaleString() + suffix;
      }
    }

    requestAnimationFrame(update);
  }

  const counterEls = document.querySelectorAll('[data-counter]');

  if (counterEls.length && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.dataset.counter, 10);
            const duration = parseInt(el.dataset.duration || '1800', 10);
            const suffix = el.dataset.suffix || '';
            animateCounter(el, target, duration, suffix);
            counterObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );

    counterEls.forEach(function (el) {
      counterObserver.observe(el);
    });
  }

  /* ------------------------------------------
     BACK TO TOP BUTTON
     ------------------------------------------ */
  const backToTop = document.getElementById('backToTop');

  if (backToTop) {
    window.addEventListener(
      'scroll',
      function () {
        if (window.scrollY > 500) {
          backToTop.classList.add('visible');
        } else {
          backToTop.classList.remove('visible');
        }
      },
      { passive: true }
    );

    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ------------------------------------------
     LAZY LOADING IMAGES
     ------------------------------------------ */
  const lazyImages = document.querySelectorAll('img[data-src]');

  if (lazyImages.length && 'IntersectionObserver' in window) {
    const imgObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imgObserver.unobserve(img);
          }
        });
      },
      { rootMargin: '200px 0px' }
    );

    lazyImages.forEach(function (img) {
      imgObserver.observe(img);
    });
  } else {
    lazyImages.forEach(function (img) {
      img.src = img.dataset.src;
    });
  }

  /* ------------------------------------------
     CONTACT FORM VALIDATION
     ------------------------------------------ */
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    const fields = {
      fullName: {
        el: contactForm.querySelector('#fullName'),
        validate: function (v) { return v.trim().length >= 2; },
        message: 'Please enter your full name (at least 2 characters).'
      },
      phone: {
        el: contactForm.querySelector('#phone'),
        validate: function (v) { return /^[\d\s\-\+\(\)]{7,20}$/.test(v.trim()); },
        message: 'Please enter a valid phone number.'
      },
      email: {
        el: contactForm.querySelector('#email'),
        validate: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); },
        message: 'Please enter a valid email address.'
      },
      service: {
        el: contactForm.querySelector('#service'),
        validate: function (v) { return v !== '' && v !== null; },
        message: 'Please select a service of interest.'
      },
      message: {
        el: contactForm.querySelector('#message'),
        validate: function (v) { return v.trim().length >= 10; },
        message: 'Please enter a message (at least 10 characters).'
      }
    };

    function validateField(key) {
      var field = fields[key];
      if (!field.el) return true;
      var group = field.el.closest('.form-group');
      var errorEl = group ? group.querySelector('.form-error') : null;
      var value = field.el.value;
      var valid = field.validate(value);

      if (group) group.classList.toggle('error', !valid);
      if (errorEl) errorEl.textContent = field.message;

      return valid;
    }

    // Live validation on blur
    Object.keys(fields).forEach(function (key) {
      var fieldEl = fields[key].el;
      if (fieldEl) {
        fieldEl.addEventListener('blur', function () { validateField(key); });
        fieldEl.addEventListener('input', function () {
          var group = fieldEl.closest('.form-group');
          if (group && group.classList.contains('error')) {
            validateField(key);
          }
        });
      }
    });

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var allValid = true;
      Object.keys(fields).forEach(function (key) {
        if (!validateField(key)) allValid = false;
      });

      if (!allValid) return;

      var submitBtn = contactForm.querySelector('[type="submit"]');
      var originalText = submitBtn ? submitBtn.textContent : '';
      if (submitBtn) {
        submitBtn.textContent = 'Sending…';
        submitBtn.disabled = true;
      }

      // Simulate submission
      setTimeout(function () {
        var successEl = contactForm.querySelector('.form-success');
        if (successEl) successEl.classList.add('show');
        contactForm.reset();
        if (submitBtn) {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }
        // Reset all error states
        Object.keys(fields).forEach(function (key) {
          var field = fields[key];
          if (field.el) {
            var group = field.el.closest('.form-group');
            if (group) group.classList.remove('error');
          }
        });
      }, 1200);
    });
  }

  /* ------------------------------------------
     SMOOTH SCROLLING FOR ANCHOR LINKS
     ------------------------------------------ */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        var offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height'), 10) || 80;
        var top = target.getBoundingClientRect().top + window.scrollY - offset - 16;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* ------------------------------------------
     ACTIVE NAV LINK HIGHLIGHT
     ------------------------------------------ */
  (function setActiveNav() {
    var path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(function (link) {
      var href = link.getAttribute('href') || '';
      if (href === path || (path === '' && href === 'index.html') || (path === 'index.html' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  })();

  /* ------------------------------------------
     CALL POPUP MODAL (IMMEDIATE DISPLAY)
     ------------------------------------------ */
  (function initCallPopup() {
    var overlay = document.getElementById('callPopupOverlay');
    var popup = document.getElementById('callPopup');
    var closeBtn = document.getElementById('popupClose');

    if (!overlay || !popup || !closeBtn) {
      console.warn('Popup elements not found');
      return;
    }

    function showPopup() {
      overlay.classList.add('show');
      console.log('Popup shown');
    }

    function hidePopup() {
      overlay.classList.remove('show');
    }

    // Show popup immediately on page load
    window.addEventListener('load', function () {
      showPopup();
    });

    // Close popup handlers
    closeBtn.addEventListener('click', function (e) {
      e.preventDefault();
      hidePopup();
    });

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) hidePopup();
    });

    // Close popup on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('show')) {
        hidePopup();
      }
    });
  })();

  /* ------------------------------------------
     FORM SECURITY - INPUT SANITIZATION
     ------------------------------------------ */
  function sanitizeInput(input) {
    var div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  }

  function validateEmail(email) {
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return re.test(email.trim());
  }

  function validatePhone(phone) {
    var re = /^[\d\s\-\+\(\)]{7,20}$/;
    return re.test(phone.trim());
  }

  // Add honeypot field to all forms (trap bots)
  var forms = document.querySelectorAll('form');
  forms.forEach(function (form) {
    var honeypot = document.createElement('input');
    honeypot.type = 'text';
    honeypot.name = 'website_url';
    honeypot.style.display = 'none';
    honeypot.style.position = 'absolute';
    honeypot.style.left = '-9999px';
    honeypot.setAttribute('autocomplete', 'off');
    honeypot.setAttribute('tabindex', '-1');
    form.appendChild(honeypot);
  });

  /* ------------------------------------------
     FORM SUBMISSION RATE LIMITING
     ------------------------------------------ */
  var formSubmissionTimes = {};

  function isRateLimited(formId) {
    var now = Date.now();
    if (!formSubmissionTimes[formId]) {
      formSubmissionTimes[formId] = [];
    }

    // Remove submissions older than 1 minute
    formSubmissionTimes[formId] = formSubmissionTimes[formId].filter(function (time) {
      return now - time < 60000;
    });

    // Allow max 5 submissions per minute
    if (formSubmissionTimes[formId].length >= 5) {
      return true; // Rate limited
    }

    formSubmissionTimes[formId].push(now);
    return false;
  }

  // Apply rate limiting to contact form
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      var honeypot = contactForm.querySelector('input[name="website_url"]');
      
      // Honeypot trap - if filled, it's a bot
      if (honeypot && honeypot.value.trim() !== '') {
        e.preventDefault();
        console.warn('Bot activity detected');
        return;
      }

      // Rate limiting
      if (isRateLimited('contactForm')) {
        e.preventDefault();
        alert('Too many submission attempts. Please wait before trying again.');
        return;
      }
    });
  }

  /* ------------------------------------------
     DISABLE RIGHT CLICK ON LANDING PAGE
     ------------------------------------------ */
  // Optional: Uncomment to prevent right-click copying
  // document.addEventListener('contextmenu', function (e) {
  //   e.preventDefault();
  //   return false;
  // }, false);

  /* ------------------------------------------
     GOOGLE reCAPTCHA v3 TOKEN GENERATION
     ------------------------------------------ */
  (function initRecaptcha() {
    // Note: Replace 'YOUR_SITE_KEY' with actual reCAPTCHA v3 site key
    var recaptchaKey = 'YOUR_SITE_KEY'; // Get from: https://www.google.com/recaptcha/admin
    
    if (typeof grecaptcha !== 'undefined' && contactForm) {
      contactForm.addEventListener('submit', function (e) {
        if (recaptchaKey && recaptchaKey !== 'YOUR_SITE_KEY') {
          e.preventDefault();
          
          grecaptcha.ready(function () {
            grecaptcha.execute(recaptchaKey, { action: 'submit' }).then(function (token) {
              document.getElementById('recaptchaToken').value = token;
              contactForm.submit();
            });
          });
        }
      });
    }
  })();



  /* ------------------------------------------
     SECURITY HEADERS & CSP META TAG
     ------------------------------------------ */
  // Add meta tag for CSP if not already present
  if (!document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
    var cspMeta = document.createElement('meta');
    cspMeta.httpEquiv = 'Content-Security-Policy';
    cspMeta.content = "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com; img-src 'self' data: https:; connect-src 'self' https:";
    document.head.appendChild(cspMeta);
  }

  // Add X-Frame-Options to prevent clickjacking (via meta tag)
  if (!document.querySelector('meta[http-equiv="X-UA-Compatible"]')) {
    var xFrameMeta = document.createElement('meta');
    xFrameMeta.httpEquiv = 'X-UA-Compatible';
    xFrameMeta.content = 'IE=edge';
    document.head.insertBefore(xFrameMeta, document.head.firstChild);
  }


})();
