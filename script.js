/* ==========================================================================
   ADITYA KUMAR VERMA - PORTFOLIO INTERACTION ENGINE
   Fusing: Sujal Chaudhary (Paper Editorial & Doodle & SFX)
         + Garvit Patwa (Cosmic Starfield & Theme Engine & Typewriter)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. WEB AUDIO API SOUND EFFECTS ENGINE (Sujal Style)
  // ==========================================
  class SoundFXEngine {
    constructor() {
      this.enabled = true;
      this.audioCtx = null;
      this.init();
    }

    init() {
      const saved = localStorage.getItem('aditya_portfolio_sfx');
      if (saved !== null) {
        this.enabled = saved === 'true';
      }
      this.updateUI();
    }

    getAudioContext() {
      if (!this.audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.audioCtx = new AudioContext();
        }
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      return this.audioCtx;
    }

    playClick() {
      if (!this.enabled) return;
      try {
        const ctx = this.getAudioContext();
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.04);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.04);
      } catch (e) {
        // Audio policy fallback
      }
    }

    playStamp() {
      if (!this.enabled) return;
      try {
        const ctx = this.getAudioContext();
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(240, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(90, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.18, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      } catch (e) {
        // Audio policy fallback
      }
    }

    toggle() {
      this.enabled = !this.enabled;
      localStorage.setItem('aditya_portfolio_sfx', this.enabled);
      this.updateUI();
      if (this.enabled) {
        this.playClick();
      }
    }

    updateUI() {
      const toggleBtn = document.getElementById('sfx-toggle');
      const icon = document.getElementById('sfx-icon');
      if (toggleBtn && icon) {
        if (this.enabled) {
          toggleBtn.classList.remove('muted');
          icon.className = 'fas fa-volume-high';
          toggleBtn.title = 'Sound On (Click to Mute)';
        } else {
          toggleBtn.classList.add('muted');
          icon.className = 'fas fa-volume-xmark';
          toggleBtn.title = 'Sound Muted (Click to Enable)';
        }
      }
    }
  }

  const sfx = new SoundFXEngine();
  const sfxToggleBtn = document.getElementById('sfx-toggle');
  if (sfxToggleBtn) {
    sfxToggleBtn.addEventListener('click', () => sfx.toggle());
  }

  // Attach sound to interactive buttons
  document.querySelectorAll('.btn, .nav-link, .filter-btn, .social-chip, .link-btn').forEach(elem => {
    elem.addEventListener('click', () => {
      if (elem.classList.contains('stamp-hover')) {
        sfx.playStamp();
      } else {
        sfx.playClick();
      }
    });
  });


  // ==========================================
  // 2. DUAL THEME ENGINE (Paper Editorial vs Cosmic Space)
  // ==========================================
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeText = document.getElementById('theme-text');
  const htmlRoot = document.documentElement;

  function initTheme() {
    const savedTheme = localStorage.getItem('aditya_portfolio_theme') || 'paper';
    applyTheme(savedTheme);
  }

  function applyTheme(theme) {
    htmlRoot.setAttribute('data-theme', theme);
    localStorage.setItem('aditya_portfolio_theme', theme);
    if (themeText) {
      themeText.textContent = theme === 'cosmic' ? 'Cosmic' : 'Paper';
    }
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      sfx.playStamp();
      const current = htmlRoot.getAttribute('data-theme') || 'paper';
      const next = current === 'paper' ? 'cosmic' : 'paper';
      applyTheme(next);
    });
  }

  initTheme();


  // ==========================================
  // 3. COSMOS / CONSTELLATION CANVAS (Garvit Style)
  // ==========================================
  const cosmosCanvas = document.getElementById('cosmos-bg');
  if (cosmosCanvas) {
    const ctx = cosmosCanvas.getContext('2d');
    let width = (cosmosCanvas.width = window.innerWidth);
    let height = (cosmosCanvas.height = window.innerHeight);

    let particles = [];
    const PARTICLE_COUNT = Math.min(Math.floor(window.innerWidth / 15), 75);
    const mouse = { x: -1000, y: -1000, radius: 120 };

    window.addEventListener('resize', () => {
      width = cosmosCanvas.width = window.innerWidth;
      height = cosmosCanvas.height = window.innerHeight;
      initParticles();
    });

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = -1000;
      mouse.y = -1000;
    });

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * 2 + 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx = -this.vx;
        if (this.y < 0 || this.y > height) this.vy = -this.vy;

        // Mouse gentle interaction
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const angle = Math.atan2(dy, dx);
          this.x -= Math.cos(angle) * 0.8;
          this.y -= Math.sin(angle) * 0.8;
        }
      }

      draw(isCosmic) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = isCosmic ? 'rgba(56, 189, 248, 0.7)' : 'rgba(24, 24, 27, 0.2)';
        ctx.fill();
      }
    }

    function initParticles() {
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
      }
    }

    initParticles();

    function renderCosmos() {
      ctx.clearRect(0, 0, width, height);
      const isCosmic = htmlRoot.getAttribute('data-theme') === 'cosmic';

      // Connect constellation lines in cosmic mode or subtle lines in paper mode
      const maxDistance = isCosmic ? 130 : 90;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * (isCosmic ? 0.25 : 0.08);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = isCosmic ? `rgba(125, 211, 252, ${alpha})` : `rgba(24, 24, 27, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      particles.forEach((p) => {
        p.update();
        p.draw(isCosmic);
      });

      requestAnimationFrame(renderCosmos);
    }

    renderCosmos();
  }


  // ==========================================
  // 4. INTERACTIVE DOODLE TOOL (Sujal Style)
  // ==========================================
  const doodleCanvas = document.getElementById('doodle-canvas');
  const doodleToggleBtn = document.getElementById('doodle-toggle-btn');
  const doodleSubtools = document.getElementById('doodle-subtools');
  const doodleClearBtn = document.getElementById('doodle-clear-btn');
  const colorDots = document.querySelectorAll('.color-dot');

  if (doodleCanvas && doodleToggleBtn) {
    const dCtx = doodleCanvas.getContext('2d');
    let isDrawing = false;
    let doodleActive = false;
    let strokeColor = '#2563eb';
    let lineWidth = 3;

    function resizeDoodle() {
      const tempImage = dCtx.getImageData(0, 0, doodleCanvas.width, doodleCanvas.height);
      doodleCanvas.width = window.innerWidth;
      doodleCanvas.height = window.innerHeight;
      dCtx.putImageData(tempImage, 0, 0);
    }

    doodleCanvas.width = window.innerWidth;
    doodleCanvas.height = window.innerHeight;
    window.addEventListener('resize', resizeDoodle);

    doodleToggleBtn.addEventListener('click', () => {
      sfx.playClick();
      doodleActive = !doodleActive;
      doodleToggleBtn.classList.toggle('active', doodleActive);
      doodleCanvas.classList.toggle('active', doodleActive);
      if (doodleSubtools) doodleSubtools.classList.toggle('show', doodleActive);
    });

    colorDots.forEach((dot) => {
      dot.addEventListener('click', () => {
        sfx.playClick();
        colorDots.forEach((d) => d.classList.remove('active'));
        dot.classList.add('active');
        strokeColor = dot.getAttribute('data-color') || '#2563eb';
      });
    });

    if (doodleClearBtn) {
      doodleClearBtn.addEventListener('click', () => {
        sfx.playStamp();
        dCtx.clearRect(0, 0, doodleCanvas.width, doodleCanvas.height);
      });
    }

    function startDraw(e) {
      if (!doodleActive) return;
      if (e.cancelable && e.type && e.type.startsWith('touch')) {
        e.preventDefault();
      }
      isDrawing = true;
      const x = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
      const y = e.clientY !== undefined ? e.clientY : (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
      dCtx.beginPath();
      dCtx.moveTo(x, y);
    }

    function draw(e) {
      if (!isDrawing || !doodleActive) return;
      if (e.cancelable && e.type && e.type.startsWith('touch')) {
        e.preventDefault();
      }
      const x = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
      const y = e.clientY !== undefined ? e.clientY : (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
      dCtx.lineTo(x, y);
      dCtx.strokeStyle = strokeColor;
      dCtx.lineWidth = lineWidth;
      dCtx.lineCap = 'round';
      dCtx.lineJoin = 'round';
      dCtx.stroke();
    }

    function stopDraw() {
      if (!isDrawing) return;
      isDrawing = false;
      dCtx.closePath();
    }

    doodleCanvas.addEventListener('mousedown', startDraw);
    doodleCanvas.addEventListener('mousemove', draw);
    window.addEventListener('mouseup', stopDraw);

    doodleCanvas.addEventListener('touchstart', startDraw, { passive: false });
    doodleCanvas.addEventListener('touchmove', draw, { passive: false });
    window.addEventListener('touchend', stopDraw);
  }


  // ==========================================
  // 5. TYPEWRITER EFFECT (Garvit Style)
  // ==========================================
  const typewriterElem = document.getElementById('typewriter');
  if (typewriterElem) {
    const phrases = [
      'B.Tech (EIE) 4th Year @ Bundelkhand University, Jhansi',
      'Full Stack Web Developer • Next.js 14 & React.js',
      'Architected BU Result Hub (150+ Students Indexed)',
      'Automated Scrapers with Python & BeautifulSoup',
      'SQLite, MySQL & RESTful API Pipeline Engineering'
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 55;

    function typeLoop() {
      const currentPhrase = phrases[phraseIndex];

      if (isDeleting) {
        typewriterElem.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 30;
      } else {
        typewriterElem.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 65;
      }

      if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        typingSpeed = 1800; // Pause at full phrase
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typingSpeed = 400; // Pause before new phrase
      }

      setTimeout(typeLoop, typingSpeed);
    }

    typeLoop();
  }


  // ==========================================
  // 6. PROJECT CATEGORY FILTERING TABS
  // ==========================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      sfx.playClick();
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const categories = card.getAttribute('data-category') || '';
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });


  // ==========================================
  // 7. INTERACTIVE CONTACT FORM
  // ==========================================
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  const submitBtn = document.getElementById('form-submit-btn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      sfx.playStamp();

      const name = document.getElementById('user-name').value.trim();
      const email = document.getElementById('user-email').value.trim();
      const subject = document.getElementById('user-subject').value.trim();
      const message = document.getElementById('user-message').value.trim();

      if (!name || !email || !message) {
        if (formStatus) {
          formStatus.className = 'form-status-msg error';
          formStatus.textContent = 'Please complete all required fields.';
        }
        return;
      }

      // Visual submission progress
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Sending...</span>';
      }

      setTimeout(() => {
        if (formStatus) {
          formStatus.className = 'form-status-msg success';
          formStatus.innerHTML = `✓ Thank you, <strong>${name}</strong>! Your message is registered. Opening email client to send directly...`;
        }

        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<i class="fas fa-check"></i> <span>Message Ready!</span>';
        }

        // Trigger mailto fallback so the email actually reaches Aditya
        const mailtoUrl = `mailto:adityakverma945085@gmail.com?subject=${encodeURIComponent(
          subject || 'Portfolio Inquiry from ' + name
        )}&body=${encodeURIComponent(
          `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
        )}`;

        window.location.href = mailtoUrl;
        contactForm.reset();
      }, 800);
    });
  }


  // ==========================================
  // 8. MOBILE NAVIGATION DRAWER (Enhanced UX)
  // ==========================================
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.getElementById('nav-links');

  function closeMobileNav() {
    if (navLinks && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      if (mobileMenuBtn) {
        mobileMenuBtn.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      }
      document.body.classList.remove('menu-locked');
    }
  }

  function openMobileNav() {
    if (navLinks) {
      navLinks.classList.add('open');
      if (mobileMenuBtn) {
        mobileMenuBtn.classList.add('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'true');
      }
      document.body.classList.add('menu-locked');
    }
  }

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      sfx.playClick();
      if (navLinks.classList.contains('open')) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });

    // Close menu when any nav link is clicked
    document.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        closeMobileNav();
      });
    });

    // Close when tapping outside the menu on mobile
    document.addEventListener('click', (e) => {
      if (navLinks.classList.contains('open') && !navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        closeMobileNav();
      }
    });

    // Close on Escape key for accessibility
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        closeMobileNav();
      }
    });
  }

  // Active navigation link on scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset + 120;

    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop;
      const sectionId = current.getAttribute('id');
      const navItem = document.querySelector(`.nav-links a[href*="${sectionId}"]`);

      if (navItem) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navItem.classList.add('active');
        } else {
          navItem.classList.remove('active');
        }
      }
    });
  }, { passive: true });


  // ==========================================
  // 9. FLOATING BACK-TO-TOP BUTTON (User-Friendly Navigation)
  // ==========================================
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 380) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
      sfx.playClick();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

});
