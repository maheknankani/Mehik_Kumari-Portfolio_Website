// Advanced Portfolio Animations
document.addEventListener('DOMContentLoaded', function() {


    // ── Dynamic Navbar Background Transition (> 50px) ─────────────────
    const headerEl = document.querySelector('header');
    function handleNavbarScroll() {
        if (!headerEl) return;
        if (window.scrollY > 50) {
            headerEl.classList.add('scrolled');
        } else {
            headerEl.classList.remove('scrolled');
        }
    }
    window.addEventListener('scroll', handleNavbarScroll, { passive: true });
    handleNavbarScroll();

    // ── Splash Overlay Crossfade & Unmount Handler ───────────────────────
    const splashOverlay = document.getElementById('splash-overlay');
    if (splashOverlay) {
        let splashAlreadySeen = false;
        try {
            splashAlreadySeen = !!sessionStorage.getItem('splashShown');
        } catch(e) {}

        if (splashAlreadySeen) {
            splashOverlay.remove();
            document.documentElement.classList.remove('show-splash-overlay');
        } else {
            setTimeout(() => {
                splashOverlay.classList.add('fade-out');
                document.documentElement.classList.remove('show-splash-overlay');
                try {
                    sessionStorage.setItem('splashShown', 'true');
                } catch(e) {}
                setTimeout(() => {
                    splashOverlay.remove();
                }, 850);
            }, 3000);
        }
    }

    // ── Scroll Animations (Once Only + Staggered Cascade) ────────────────
    const sectionObserverOptions = {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate', 'is-visible');
                
                // Animate skill bars
                if (entry.target.classList.contains('skill')) {
                    const skillBar = entry.target.querySelector('.skill-level');
                    if (skillBar) {
                        const percentage = skillBar.style.width;
                        skillBar.style.width = '0%';
                        setTimeout(() => {
                            skillBar.style.width = percentage;
                        }, 200);
                    }
                }

                // Cascade child cards with ~0.1s stagger delay
                const childCards = entry.target.querySelectorAll(
                    '.project-card, .modern-project-card, .skill-card, .edu-card, .certificate-badge, .timeline-entry, .contact-info-card, .skill, .stagger-child'
                );
                childCards.forEach((child, index) => {
                    child.style.transitionDelay = `${(index * 0.1).toFixed(2)}s`;
                    child.classList.add('animate', 'is-visible');
                });

                // Unobserve after trigger so animation runs once only
                observer.unobserve(entry.target);
            }
        });
    }, sectionObserverOptions);

    const sectionsToObserve = document.querySelectorAll(
        '#about, #skills, #experience, #projects, #contact, section, .reveal-on-scroll, .fade-in, .fade-in-delayed, .fade-in-right, .slide-in-left, .slide-in-right, .slide-in-bottom, .skill, .project-card, .edu-card, .certificate-badge, .modern-project-card, .contact-info-card, .timeline-entry'
    );
    sectionsToObserve.forEach(sec => sectionObserver.observe(sec));

    // ── Back to Top Button (Show > 300px, Smooth Scroll) ─────────────────
    const backToTopBtns = document.querySelectorAll('#back-to-top, #backToTop, .back-to-top, .back-to-top-btn');
    if (backToTopBtns.length) {
        function handleBackToTopVisibility() {
            backToTopBtns.forEach(btn => {
                if (window.scrollY > 300) {
                    btn.classList.add('show');
                } else {
                    btn.classList.remove('show');
                }
            });
        }
        window.addEventListener('scroll', handleBackToTopVisibility, { passive: true });
        handleBackToTopVisibility();

        backToTopBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        });
    }

    // Mobile navigation toggle with hamburger animation
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navOverlay = document.querySelector('.nav-overlay');
    const themeToggle = document.querySelector('.theme-toggle');

    function closeNav() {
        if (navToggle) navToggle.classList.remove('active');
        if (navLinks) navLinks.classList.remove('open');
        if (navOverlay) navOverlay.classList.remove('active');
        document.body.classList.remove('nav-open');
        document.body.style.overflow = '';
    }

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            const isOpen = navLinks.classList.contains('open');
            if (isOpen) {
                closeNav();
            } else {
                navToggle.classList.add('active');
                navLinks.classList.add('open');
                if (navOverlay) navOverlay.classList.add('active');
                document.body.classList.add('nav-open');
            }
        });

        // Close nav when clicking outside the menu drawer or toggle button
        document.addEventListener('click', (e) => {
            if (navLinks && navLinks.classList.contains('open')) {
                if (!navLinks.contains(e.target) && (!navToggle || !navToggle.contains(e.target))) {
                    closeNav();
                }
            }
        });

        // Close nav on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('open')) {
                closeNav();
            }
        });

        // Close nav on window resize above mobile breakpoint (900px)
        window.addEventListener('resize', () => {
            if (window.innerWidth > 900 && navLinks.classList.contains('open')) {
                closeNav();
            }
        });
    }

    // Unified link click handler for mobile menu links, sidebar nav, and in-page anchor links
    document.querySelectorAll('.nav-links a, .sidebar-nav a, a[href*="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const rawHref = this.getAttribute('href');
            if (!rawHref || rawHref === '#') return;

            // 1. Instantly close drawer and un-freeze body scroll
            closeNav();

            // 2. Parse target section ID for in-page smooth scrolling
            let targetId = '';
            if (rawHref.startsWith('#')) {
                targetId = rawHref;
            } else if (rawHref.includes('#')) {
                const parts = rawHref.split('#');
                const targetPage = parts[0];
                const hash = '#' + parts[1];
                const currentPage = window.location.pathname.split('/').pop() || 'index.html';
                
                if (targetPage === currentPage ||
                    (currentPage === 'index.html' && targetPage === 'home.html') ||
                    (currentPage === 'home.html' && targetPage === 'index.html') ||
                    targetPage === '') {
                    targetId = hash;
                }
            }

            if (targetId) {
                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    // Wait 25ms for body overflow:hidden to unfreeze before executing scrollTo
                    setTimeout(() => {
                        const header = document.querySelector('header');
                        const headerOffset = header ? header.offsetHeight + 20 : 90;
                        const elementPosition = target.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });
                    }, 25);
                    return;
                }
            }

            // 3. For cross-page navigation links (e.g., projects.html, contact.html, about.html)
            if (!rawHref.startsWith('#')) {
                if (this.getAttribute('target') === '_blank') return;
                e.preventDefault();
                setTimeout(() => {
                    window.location.href = rawHref;
                }, 25);
            }
        });
    });

    const themeStorageKey = 'portfolio-theme';
    const root = document.body;

    function readStoredTheme() {
        try {
            return localStorage.getItem(themeStorageKey);
        } catch (error) {
            return null;
        }
    }

    function storeTheme(theme) {
        try {
            localStorage.setItem(themeStorageKey, theme);
        } catch (error) {
            // Ignore storage failures and keep the in-memory theme only.
        }
    }

    function setTheme(theme) {
        const isDark = theme === 'dark';
        if (document.body) document.body.classList.toggle('theme-dark', isDark);
        if (document.documentElement) document.documentElement.classList.toggle('theme-dark', isDark);
        storeTheme(theme);

        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            if (icon) {
                icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
            }
            themeToggle.setAttribute('aria-pressed', String(isDark));
            themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
        }

        document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
    }

    const savedTheme = readStoredTheme();
    setTheme(savedTheme ? savedTheme : 'dark');

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const nextTheme = root.classList.contains('theme-dark') ? 'light' : 'dark';
            setTheme(nextTheme);
        });
    }

    // ── Starting Load Animation for Hero Name ─────────────────
    const nameEl = document.getElementById('hero-name-animated') || document.querySelector('.hero-text h1 span');
    if (nameEl) {
        const targetName = nameEl.textContent.trim() || "Mahek Nankani";
        nameEl.textContent = "";
        nameEl.classList.add('name-typing-active');

        let charIdx = 0;
        function typeName() {
            if (charIdx < targetName.length) {
                nameEl.textContent += targetName.charAt(charIdx);
                charIdx++;
                setTimeout(typeName, 100);
            } else {
                nameEl.classList.remove('name-typing-active');
                nameEl.classList.add('name-shimmer-active');
            }
        }
        setTimeout(typeName, 250);
    }

    // Dynamic Typing animation for hero specialization text
    const typewriterEl = document.getElementById('hero-typewriter') || document.querySelector('.hero-typewriter-text');
    if (typewriterEl) {
        const phrases = [
            "MERN Stack",
            "UI/UX Design",
            "Full-Stack Web Dev",
            "React & React Native"
        ];
        let phraseIdx = 0;
        let charIdx = 0;
        let isDeleting = false;
        let typingSpeed = 90;

        function typeLoop() {
            const currentPhrase = phrases[phraseIdx];

            if (isDeleting) {
                typewriterEl.textContent = currentPhrase.substring(0, charIdx - 1);
                charIdx--;
                typingSpeed = 45;
            } else {
                typewriterEl.textContent = currentPhrase.substring(0, charIdx + 1);
                charIdx++;
                typingSpeed = 90;
            }

            if (!isDeleting && charIdx === currentPhrase.length) {
                isDeleting = true;
                typingSpeed = 1800; // Pause at full word
            } else if (isDeleting && charIdx === 0) {
                isDeleting = false;
                phraseIdx = (phraseIdx + 1) % phrases.length;
                typingSpeed = 400; // Pause before typing next
            }

            setTimeout(typeLoop, typingSpeed);
        }

        setTimeout(typeLoop, 800);
    }

    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        const heroImage = document.querySelector('.profile-img');
        
        if (hero && heroImage) {
            const rate = scrolled * -0.5;
            heroImage.style.transform = `translateY(${rate}px)`;
        }
    });

    // Add stagger delays to elements
    const staggerElements = document.querySelectorAll('.project-card, .skill, .timeline-entry, .certificate-badge');
    staggerElements.forEach((el, index) => {
        el.style.animationDelay = `${index * 0.1}s`;
    });

    // Button ripple effect
    document.querySelectorAll('.btn-filled, .btn-outline, .btn-primary').forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Navigation active section highlighting
    const navLinksList = document.querySelectorAll('.sidebar-nav a, .nav-links a');
    const sections = document.querySelectorAll('section[id]');
    
    function updateActiveSection() {
        let current = '';
        const header = document.querySelector('header');
        const headerOffset = header ? header.offsetHeight + 40 : 120;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.pageYOffset >= sectionTop - headerOffset) {
                current = section.getAttribute('id');
            }
        });
        
        navLinksList.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.includes('#')) {
                const targetHash = href.substring(href.indexOf('#'));
                if (targetHash === `#${current}`) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            }
        });
    }
    
    // Update active section on scroll
    window.addEventListener('scroll', updateActiveSection);
    
    // Update active section on load
    updateActiveSection();
    
    // Back to Top Button Functionality
    const backToTopButton = document.getElementById('backToTop');
    
    if (backToTopButton) {
        // Show/hide back to top button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        });
        
        // Smooth scroll to top when clicked
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        // Add ripple effect on click
        backToTopButton.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    }
    
    // Add loading animation
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
    });
});

// CSS for ripple effect (add to style.css)
const rippleCSS = `
.btn-filled, .btn-outline, .btn-primary {
    position: relative;
    overflow: hidden;
}

.ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.6);
    transform: scale(0);
    animation: ripple-animation 0.6s linear;
    pointer-events: none;
}

@keyframes ripple-animation {
    to {
        transform: scale(4);
        opacity: 0;
    }
}
`;

// Inject ripple CSS
const style = document.createElement('style');
style.textContent = rippleCSS;
document.head.appendChild(style);


// ── Skill card scroll animation ──────────────────────────
(function () {
  const skillCards = document.querySelectorAll('.skill-card');
  if (!skillCards.length) return;

  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const card = entry.target;
      const delay = parseInt(card.dataset.delay) || 0;

      setTimeout(() => {
        card.classList.add('visible');
        card.querySelectorAll('.bar-fill').forEach(bar => {
          setTimeout(() => { bar.style.width = bar.dataset.width + '%'; }, 150);
        });
      }, delay);

      cardObserver.unobserve(card);
    });
  }, { threshold: 0.15 });

  skillCards.forEach(card => cardObserver.observe(card));
})();
// ── Interactive Background 3D Perspective Plexus Canvas ────────────────
(function () {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let time = 0;
  let isTabVisible = true;

  document.addEventListener('visibilitychange', function() {
    isTabVisible = document.visibilityState === 'visible';
  });

  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function animatePlexus() {
    if (!isTabVisible) {
      requestAnimationFrame(animatePlexus);
      return;
    }
    ctx.clearRect(0, 0, width, height);
    time += 0.009;

    const cols = 32;
    const rows = 24;
    const spacingX = width / 13;
    const spacingZ = 45;
    const fov = 380;

    const grid = [];

    for (let r = 0; r < rows; r++) {
      grid[r] = [];
      const z = (rows - r) * spacingZ;
      const scale = fov / (fov + z);

      for (let c = 0; c < cols; c++) {
        const x = (c - cols / 2) * spacingX;
        const wave = Math.sin(x * 0.003 + time * 1.4) * 65 + Math.cos(z * 0.008 + time * 1.1) * 55;
        const y = 100 + wave;

        const projX = width / 2 + x * scale;
        const projY = height / 2 + y * scale + (r * 11);
        const alpha = Math.max(0.12, Math.min(0.9, (1 - z / 1200)));

        grid[r][c] = { x: projX, y: projY, z: z, alpha: alpha };
      }
    }

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const p = grid[r][c];

        if (c < cols - 1) {
          const pRight = grid[r][c + 1];
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(pRight.x, pRight.y);
          ctx.strokeStyle = `rgba(59, 130, 246, ${p.alpha * 0.85})`;
          ctx.lineWidth = 1.05 * (fov / (fov + p.z));
          ctx.stroke();
        }

        if (r < rows - 1) {
          const pDown = grid[r + 1][c];
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(pDown.x, pDown.y);
          ctx.strokeStyle = `rgba(139, 92, 246, ${p.alpha * 0.75})`;
          ctx.lineWidth = 1.05 * (fov / (fov + p.z));
          ctx.stroke();
        }

        if (r % 2 === 0 && c % 2 === 0) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, Math.max(1.5, 2.5 * (fov / (fov + p.z))), 0, Math.PI * 2);
          ctx.fillStyle = p.alpha > 0.35 ? '#38bdf8' : '#60a5fa';
          ctx.shadowBlur = p.alpha > 0.35 ? 12 : 5;
          ctx.shadowColor = '#38bdf8';
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }
    }

    requestAnimationFrame(animatePlexus);
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
  animatePlexus();
})();
// ── Interactive Skills Category Filter & Meter Animate ────────────────────
document.addEventListener('DOMContentLoaded', function () {
  const tabBtns = document.querySelectorAll('.skills-tab-btn');
  const skillCards = document.querySelectorAll('.modern-skill-card');

  function animateMeters() {
    skillCards.forEach(card => {
      if (card.style.display !== 'none') {
        const fill = card.querySelector('.skill-meter-fill');
        if (fill) {
          const targetWidth = fill.dataset.width || '80%';
          fill.style.width = '0%';
          setTimeout(() => {
            fill.style.width = targetWidth;
          }, 100);
        }
      }
    });
  }

  if (tabBtns.length && skillCards.length) {
    tabBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        tabBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        const filter = this.dataset.filter;

        skillCards.forEach(card => {
          const category = card.dataset.category;
          if (filter === 'all' || category === filter) {
            card.style.display = 'flex';
            card.style.opacity = '0';
            card.style.transform = 'translateY(10px)';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 50);
          } else {
            card.style.display = 'none';
          }
        });

        animateMeters();
      });
    });
  }

  // Observer to trigger meter animation on scroll into view
  const skillsSection = document.getElementById('skills');
  if (skillsSection) {
    const skillsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateMeters();
          skillsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    skillsObserver.observe(skillsSection);
  }
});

// ── Interactive Projects Category Filter Handler ──────────────────────────
document.addEventListener('DOMContentLoaded', function () {
  const projectBtns = document.querySelectorAll('.projects-tab-btn');
  const projectCards = document.querySelectorAll('.modern-project-card');

  if (projectBtns.length && projectCards.length) {
    projectBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        projectBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        const filter = this.dataset.filter;

        projectCards.forEach(card => {
          const category = card.dataset.category;
          if (filter === 'all' || category === filter) {
            card.style.display = 'flex';
            card.style.opacity = '0';
            card.style.transform = 'translateY(15px)';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 50);
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }
});

// ── Formspree Official AJAX Contact Form Integration (mygeeqe) ─────────────
document.addEventListener('DOMContentLoaded', function () {
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('.btn-contact-submit');
      const nameInput = contactForm.querySelector('#contact-name');
      const emailInput = contactForm.querySelector('#contact-email');
      const subjectInput = contactForm.querySelector('#contact-subject');
      const messageInput = contactForm.querySelector('#contact-message');

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const subject = subjectInput ? subjectInput.value.trim() : 'Portfolio Contact Message';
      const message = messageInput ? messageInput.value.trim() : '';

      if (!name || !email || !message) {
        contactForm.classList.add('shake-anim');
        setTimeout(() => contactForm.classList.remove('shake-anim'), 600);
        return;
      }

      const originalHTML = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
      }

      const FORMSPREE_ENDPOINT = 'https://formspree.io/f/myegeeqe';
      const dataPayload = {
        name: name,
        email: email,
        subject: subject,
        message: message
      };

      try {
        const response = await fetch(FORMSPREE_ENDPOINT, {
          method: 'POST',
          body: JSON.stringify(dataPayload),
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        const data = await response.json();

        if (response.ok) {
          if (submitBtn) {
            submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> Message sent successfully!';
            submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
          }
          contactForm.reset();
        } else {
          let errorText = 'Submission failed';
          if (data && data.errors && data.errors.length > 0) {
            errorText = data.errors.map(err => err.message || `${err.field} is invalid`).join(', ');
          } else if (data && data.error) {
            errorText = data.error;
          }
          if (submitBtn) {
            submitBtn.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${errorText}`;
            submitBtn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
          }
        }
      } catch (err) {
        console.error('Formspree submit error:', err);
        if (submitBtn) {
          submitBtn.innerHTML = '<i class="fas fa-exclamation-circle"></i> Network error. Please try again.';
          submitBtn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
        }
      } finally {
        if (submitBtn) {
          setTimeout(() => {
            submitBtn.innerHTML = originalHTML;
            submitBtn.style.background = '';
            submitBtn.disabled = false;
          }, 5500);
        }
      }
    });
  }
});

// ── Upgraded Interactive 3D Perspective Tilt on Project Cards ───────────────
(function init3DTiltCards() {
  function attachTilt() {
    if (window.innerWidth < 768) return;

    const cards = document.querySelectorAll(
      '.project-card, .modern-project-card, .certificate-card, .edu-card, .highlight-item, .contact-info-card'
    );

    cards.forEach(card => {
      if (card.dataset.tiltInitialized) return;
      card.dataset.tiltInitialized = 'true';

      card.style.transformStyle = 'preserve-3d';
      card.style.willChange = 'transform';

      card.addEventListener('mousemove', function (e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Max tilt angles: 12deg X and Y
        const rotateX = (((centerY - y) / centerY) * 12).toFixed(2);
        const rotateY = (((x - centerX) / centerX) * 12).toFixed(2);

        this.style.setProperty('--mouse-x', `${x.toFixed(1)}px`);
        this.style.setProperty('--mouse-y', `${y.toFixed(1)}px`);

        this.style.transition = 'transform 0.12s ease-out, box-shadow 0.3s ease, border-color 0.3s ease';
        this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03) translateY(-6px)`;
        this.style.borderColor = 'rgba(56, 189, 248, 0.55)';
        this.style.boxShadow = '0 20px 50px rgba(0, 0, 0, 0.5), 0 0 45px rgba(56, 189, 248, 0.38), 0 0 25px rgba(139, 92, 246, 0.28)';
      });

      card.addEventListener('mouseleave', function () {
        this.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.6s ease, border-color 0.6s ease';
        this.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1) translateY(0)';
        this.style.borderColor = '';
        this.style.boxShadow = '';
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachTilt);
  } else {
    attachTilt();
  }

  // Re-attach when dynamic categories or projects filter buttons are clicked
  document.addEventListener('click', function (e) {
    if (e.target.closest('.filter-btn, .project-filter-btn, .category-btn, .tab-btn, .skills-tab-btn')) {
      setTimeout(attachTilt, 200);
    }
  });
})();

// ── Interactive Skills Category Filter Tabs & Animated Meters ───────────────
(function initSkillsFilter() {
  function setupSkills() {
    const tabs = document.querySelectorAll('.skills-tab-btn');
    const cards = document.querySelectorAll('.modern-skill-card');
    const meters = document.querySelectorAll('.skill-meter-fill');

    // 1. Animate meter fills immediately on load
    meters.forEach(meter => {
      const targetWidth = meter.dataset.width || '85%';
      setTimeout(() => {
        meter.style.width = targetWidth;
      }, 150);
    });

    if (!tabs.length || !cards.length) return;

    tabs.forEach(tab => {
      tab.addEventListener('click', function () {
        const filter = this.dataset.filter || 'all';

        // Update active tab button styling
        tabs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');

        // Filter and animate skill cards
        cards.forEach((card, idx) => {
          const category = card.dataset.category || '';
          const matches = filter === 'all' || category === filter;

          if (matches) {
            card.style.display = 'flex';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'scale(1) translateY(0)';
            }, idx * 40);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.92) translateY(10px)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 250);
          }
        });
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupSkills);
  } else {
    setupSkills();
  }
})();












