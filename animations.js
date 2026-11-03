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
                    '.project-card, .modern-project-card, .skill-card, .modern-skill-card, .edu-card, .certificate-badge, .timeline-entry, .contact-info-card, .skill, .stagger-child'
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
        '#about, #skills, #experience, #projects, #contact, section, .section-header-wrapper, .about-modern-wrapper, .skills-category-group, .education-grid, .work-experience-timeline, .certificates-list, .contact-modern-grid, .reveal-on-scroll, .fade-in, .fade-in-delayed, .fade-in-right, .slide-in-left, .slide-in-right, .slide-in-bottom, .skill, .project-card, .edu-card, .certificate-badge, .modern-project-card, .contact-info-card, .timeline-entry'
    );
    sectionsToObserve.forEach(sec => sectionObserver.observe(sec));

    // Immediate reveal for above-the-fold hero content (no waiting for scroll)
    document.querySelectorAll('.hero, .hero-content, .hero-text, .hero-visual, header, .hero-greeting-tag, .hero-role, .hero-specialization, .hero-desc, .hero-buttons, .hero-stats').forEach(el => {
        el.classList.add('animate', 'is-visible');
    });

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
        const targetName = nameEl.textContent.trim() || "Mehik Kumari";
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

    // ── 3. Hero Carousel Transition (Smooth vertical slide & fade carousel) ───
    const carouselEl = document.getElementById('hero-typewriter') || document.querySelector('.hero-specialization-anim');
    if (carouselEl) {
        const phrases = [
            "MERN Stack Development",
            "UI/UX Design & Prototyping",
            "Full-Stack Web Dev",
            "React & React Native Apps",
            "Modern Interactive Interfaces"
        ];
        let currentIdx = 0;
        carouselEl.textContent = phrases[0];

        function rotateHeroCarousel() {
            carouselEl.classList.add('hero-carousel-slide-out');
            
            setTimeout(() => {
                currentIdx = (currentIdx + 1) % phrases.length;
                carouselEl.textContent = phrases[currentIdx];
                carouselEl.classList.remove('hero-carousel-slide-out');
                carouselEl.classList.add('hero-carousel-slide-in-prep');
                
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        carouselEl.classList.remove('hero-carousel-slide-in-prep');
                        carouselEl.classList.add('hero-carousel-slide-in');
                        
                        setTimeout(() => {
                            carouselEl.classList.remove('hero-carousel-slide-in');
                        }, 500);
                    });
                });
            }, 460);
        }

        setInterval(rotateHeroCarousel, 3000);
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
      if (!card.classList.contains('is-hidden') && card.style.display !== 'none') {
        const fill = card.querySelector('.skill-meter-fill');
        if (fill) {
          const targetWidth = fill.dataset.width || fill.getAttribute('data-width') || '85%';
          fill.style.width = '0%';
          setTimeout(() => {
            fill.style.width = targetWidth;
          }, 80);
        }
      }
    });
  }

  // Initial meter animation
  setTimeout(animateMeters, 200);

  if (tabBtns.length && skillCards.length) {
    tabBtns.forEach(btn => {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        tabBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        const filter = this.dataset.filter || this.getAttribute('data-filter') || 'all';

        skillCards.forEach(card => {
          const category = card.dataset.category || card.getAttribute('data-category') || '';
          if (filter === 'all' || category === filter || category.split(/\s+/).includes(filter)) {
            card.classList.remove('is-hidden');
            card.classList.add('animate', 'is-visible');
            card.style.display = 'flex';
            card.style.opacity = '0';
            card.style.transform = 'translateY(12px)';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 40);
          } else {
            card.classList.add('is-hidden');
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

// ── 2. Interactive Projects Category Filter with Staggered Reveal ────────
document.addEventListener('DOMContentLoaded', function () {
  const projectBtns = document.querySelectorAll('.projects-tab-btn:not(.btn-search-trigger)');
  const projectCards = document.querySelectorAll('.modern-project-card');

  if (projectBtns.length && projectCards.length) {
    projectBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        projectBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        const filter = this.dataset.filter;
        let visibleIdx = 0;

        projectCards.forEach(card => {
          const category = card.dataset.category || '';
          if (filter === 'all' || category === filter || category.split(/\s+/).includes(filter)) {
            card.style.display = 'flex';
            card.style.opacity = '0';
            card.style.transform = 'translateY(24px)';
            const delay = visibleIdx * 65;
            visibleIdx++;
            setTimeout(() => {
              card.style.transition = 'opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1), transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, delay + 20);
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

// ── 8. Slide-in Modal (Search & Project Quick View) ─────────────────────
(function initSlideInModal() {
  function setupModal() {
    const modal = document.getElementById('slide-in-modal');
    if (!modal) return;

    const backdrop = document.getElementById('modalBackdrop');
    const closeBtn = document.getElementById('modalCloseBtn');
    const searchInput = document.getElementById('projectSearchInput');
    const dynamicContent = document.getElementById('modalDynamicContent');
    const openSearchBtn = document.getElementById('openProjectSearch');

    function getProjectsData() {
      const cards = document.querySelectorAll('.modern-project-card');
      const data = [];
      cards.forEach((card, index) => {
        const title = card.querySelector('h3')?.textContent?.trim() || `Project ${index + 1}`;
        const desc = card.querySelector('p')?.textContent?.trim() || '';
        const img = card.querySelector('.project-card-img')?.src || '';
        const badge = card.querySelector('.project-category-badge')?.outerHTML || '';
        const pills = Array.from(card.querySelectorAll('.tech-pill')).map(p => p.outerHTML).join(' ');
        const link = card.querySelector('.btn-project-link:not(.disabled-link), .overlay-btn:not(.overlay-btn-quickview)')?.href || '';

        data.push({ index, title, desc, img, badge, pills, link, category: card.dataset.category || '' });
      });
      return data;
    }

    function renderSearchResults(query = '') {
      if (!dynamicContent) return;
      const projects = getProjectsData();
      const q = query.toLowerCase().trim();
      const filtered = projects.filter(p => 
        !q || 
        p.title.toLowerCase().includes(q) || 
        p.desc.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q) ||
        p.pills.toLowerCase().includes(q)
      );

      if (filtered.length === 0) {
        dynamicContent.innerHTML = `
          <div style="text-align: center; padding: 2.5rem 1rem; color: #94a3b8;">
            <i class="fas fa-search" style="font-size: 2.5rem; margin-bottom: 0.8rem; opacity: 0.4;"></i>
            <p style="font-size: 1rem;">No projects found matching "${query}".</p>
          </div>
        `;
        return;
      }

      dynamicContent.innerHTML = `
        <div class="modal-results-list">
          ${filtered.map(p => `
            <div class="modal-result-item" data-project-idx="${p.index}">
              <img src="${p.img}" alt="${p.title}" class="modal-result-thumb">
              <div class="modal-result-info" style="flex: 1;">
                <h4>${p.title}</h4>
                <p>${p.desc}</p>
                <div style="margin-top: 0.35rem; display: flex; flex-wrap: wrap; gap: 4px;">
                  ${p.pills}
                </div>
              </div>
              <button class="btn-outline btn-small" style="padding: 0.4rem 0.75rem; font-size: 0.75rem; border-radius: 8px;">
                View <i class="fas fa-chevron-right"></i>
              </button>
            </div>
          `).join('')}
        </div>
      `;

      dynamicContent.querySelectorAll('.modal-result-item').forEach(item => {
        item.addEventListener('click', () => {
          const idx = parseInt(item.dataset.projectIdx, 10);
          renderQuickView(projects[idx]);
        });
      });
    }

    function renderQuickView(p) {
      if (!p || !dynamicContent) return;
      dynamicContent.innerHTML = `
        <div class="modal-quickview-content">
          <button id="modalBackToSearch" class="btn-outline btn-small" style="align-self: flex-start; padding: 0.35rem 0.75rem; font-size: 0.8rem; margin-bottom: 0.5rem; border-radius: 8px;">
            <i class="fas fa-arrow-left"></i> Back to search
          </button>
          <div style="position: relative; overflow: hidden; border-radius: 14px;">
            <img src="${p.img}" alt="${p.title}" class="modal-quickview-img">
            <div style="position: absolute; top: 12px; left: 12px;">${p.badge}</div>
          </div>
          <div>
            <h3 style="font-size: 1.4rem; color: #fff; margin-bottom: 0.5rem;">${p.title}</h3>
            <p style="color: #cbd5e1; line-height: 1.6; font-size: 0.95rem; margin-bottom: 1rem;">${p.desc}</p>
            <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 1.25rem;">
              ${p.pills}
            </div>
            <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
              ${p.link ? `<a href="${p.link}" target="_blank" rel="noopener noreferrer" class="btn-filled hero-btn-main" style="padding: 0.6rem 1.2rem; font-size: 0.85rem;"><i class="fas fa-external-link-alt"></i> Open Project</a>` : ''}
              <button id="modalCloseViewBtn" class="btn-outline" style="padding: 0.6rem 1.2rem; font-size: 0.85rem; border-radius: 8px;">Close</button>
            </div>
          </div>
        </div>
      `;

      const backBtn = document.getElementById('modalBackToSearch');
      if (backBtn) {
        backBtn.addEventListener('click', () => {
          renderSearchResults(searchInput ? searchInput.value : '');
        });
      }
      const closeViewBtn = document.getElementById('modalCloseViewBtn');
      if (closeViewBtn) {
        closeViewBtn.addEventListener('click', closeModal);
      }
    }

    function openModal(initialProjectIdx = null) {
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      if (initialProjectIdx !== null) {
        const projects = getProjectsData();
        renderQuickView(projects[initialProjectIdx]);
      } else {
        if (searchInput) searchInput.value = '';
        renderSearchResults('');
        if (searchInput) setTimeout(() => searchInput.focus(), 150);
      }
    }

    function closeModal() {
      modal.classList.add('closing');
      setTimeout(() => {
        modal.classList.remove('open', 'closing');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }, 280);
    }

    if (openSearchBtn) openSearchBtn.addEventListener('click', () => openModal());
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (backdrop) backdrop.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('open')) {
        closeModal();
      }
    });

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        renderSearchResults(e.target.value);
      });
    }

    } if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupModal);
  } else {
    setupModal();
  }
})();

// ── ADVANCED ENGINES: HERO SLIDER, PARALLAX BACKGROUND & 3D TILT/FLIP ─────

// 1. ANIMATED HERO SLIDER CONTROLLER
(function initHeroSlider() {
  const sliderWrapper = document.getElementById('heroSlidesWrapper');
  if (!sliderWrapper) return;

  const slides = sliderWrapper.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-slider-dot');
  const prevBtn = document.getElementById('heroSliderPrev');
  const nextBtn = document.getElementById('heroSliderNext');
  const progressBar = document.getElementById('heroSliderTimerProgress');
  const heroBadges = document.querySelectorAll('.hero-badge');

  if (!slides.length) return;

  let currentSlide = 0;
  let slideInterval = null;
  const slideDuration = 5500; // 5.5s per slide
  let progressStart = 0;
  let progressRaf = null;

  const badgePresets = [
    [
      { html: '<span class="badge-dot badge-dot-green"></span> Open to Work' },
      { html: '<i class="fas fa-map-marker-alt badge-icon-loc"></i> Karachi, PK' },
      { html: '<i class="fas fa-briefcase"></i> Available for Opportunities' }
    ],
    [
      { html: '<span class="badge-dot badge-dot-green"></span> Full-Stack Development' },
      { html: '<i class="fab fa-react"></i> Frontend' },
      { html: '<i class="fas fa-server"></i> Backend & APIs' }
    ],
    [
      { html: '<span class="badge-dot badge-dot-green"></span> MERN Stack' },
      { html: '<i class="fab fa-react"></i> React.js' },
      { html: '<i class="fab fa-node-js badge-icon-mern"></i> Node.js' }
    ],
    [
      { html: '<span class="badge-dot badge-dot-green"></span> Mobile Apps' },
      { html: '<i class="fab fa-react" style="color:#61dafb;"></i> React Native' },
      { html: '<i class="fab fa-android" style="color:#22c55e;"></i> Android &amp; iOS' }
    ],
    [
      { html: '<span class="badge-dot badge-dot-green"></span> Available for UI/UX' },
      { html: '<i class="fab fa-figma" style="color:#a855f7;"></i> Figma' },
      { html: '<i class="fas fa-layer-group" style="color:#38bdf8;"></i> Design Systems' }
    ]
  ];

  function updateHeroBadges(index) {
    if (!heroBadges.length || !badgePresets[index]) return;
    heroBadges.forEach((badge, bIdx) => {
      if (badgePresets[index][bIdx]) {
        badge.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        badge.style.opacity = '0';
        badge.style.transform = 'translateY(6px)';
        setTimeout(() => {
          badge.innerHTML = badgePresets[index][bIdx].html;
          badge.style.opacity = '1';
          badge.style.transform = 'translateY(0)';
        }, 300);
      }
    });
  }

  function goToSlide(newIdx, direction = 'next') {
    if (newIdx === currentSlide) return;
    const oldSlide = slides[currentSlide];
    const targetSlide = slides[newIdx];

    oldSlide.classList.remove('active');
    oldSlide.classList.add(direction === 'next' ? 'slide-out-left' : 'slide-out-right');

    setTimeout(() => {
      oldSlide.classList.remove('slide-out-left', 'slide-out-right');
    }, 550);

    targetSlide.classList.add('active');

    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === newIdx);
    });

    currentSlide = newIdx;
    updateHeroBadges(newIdx);
    resetTimer();
  }

  function nextSlide() {
    const next = (currentSlide + 1) % slides.length;
    goToSlide(next, 'next');
  }

  function prevSlide() {
    const prev = (currentSlide - 1 + slides.length) % slides.length;
    goToSlide(prev, 'prev');
  }

  function updateProgress() {
    const elapsed = Date.now() - progressStart;
    const percent = Math.min((elapsed / slideDuration) * 100, 100);
    if (progressBar) progressBar.style.width = percent + '%';

    if (elapsed < slideDuration) {
      progressRaf = requestAnimationFrame(updateProgress);
    }
  }

  function resetTimer() {
    if (slideInterval) clearInterval(slideInterval);
    if (progressRaf) cancelAnimationFrame(progressRaf);
    if (progressBar) progressBar.style.width = '0%';
    progressStart = Date.now();
    updateProgress();
    slideInterval = setInterval(nextSlide, slideDuration);
  }

  dots.forEach(dot => {
    dot.addEventListener('click', function () {
      const target = parseInt(this.dataset.slideTarget, 10);
      goToSlide(target, target > currentSlide ? 'next' : 'prev');
    });
  });

  if (nextBtn) nextBtn.addEventListener('click', nextSlide);
  if (prevBtn) prevBtn.addEventListener('click', prevSlide);

  // Pause on hover
  sliderWrapper.addEventListener('mouseenter', () => {
    if (slideInterval) clearInterval(slideInterval);
    if (progressRaf) cancelAnimationFrame(progressRaf);
  });
  sliderWrapper.addEventListener('mouseleave', resetTimer);

  resetTimer();
})();

// 2. INTERACTIVE PARALLAX BACKGROUND (Mouse & Scroll Multi-layer)
(function initParallaxBackground() {
  const canvas = document.getElementById('bg-canvas');
  const glowLeft = document.querySelector('.ambient-glow-left');
  const glowRight = document.querySelector('.ambient-glow-right');
  const heroVisual = document.querySelector('.hero-visual');

  let mouseX = 0, mouseY = 0;
  let targetMouseX = 0, targetMouseY = 0;
  let isTicking = false;

  window.addEventListener('mousemove', (e) => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    targetMouseX = (e.clientX - centerX) / centerX;
    targetMouseY = (e.clientY - centerY) / centerY;

    if (!isTicking) {
      requestAnimationFrame(updateMouseParallax);
      isTicking = true;
    }
  }, { passive: true });

  function updateMouseParallax() {
    mouseX += (targetMouseX - mouseX) * 0.08;
    mouseY += (targetMouseY - mouseY) * 0.08;

    if (canvas) {
      canvas.style.transform = `translate3d(${(mouseX * -14).toFixed(1)}px, ${(mouseY * -14).toFixed(1)}px, 0)`;
    }
    if (glowLeft) {
      glowLeft.style.transform = `translate3d(${(mouseX * 28).toFixed(1)}px, ${(mouseY * 24).toFixed(1)}px, 0)`;
    }
    if (glowRight) {
      glowRight.style.transform = `translate3d(${(mouseX * -32).toFixed(1)}px, ${(mouseY * -28).toFixed(1)}px, 0)`;
    }
    if (heroVisual && window.scrollY < 600) {
      heroVisual.style.transform = `translate3d(${(mouseX * 12).toFixed(1)}px, ${(mouseY * 12).toFixed(1)}px, 0)`;
    }

    if (Math.abs(targetMouseX - mouseX) > 0.001 || Math.abs(targetMouseY - mouseY) > 0.001) {
      requestAnimationFrame(updateMouseParallax);
    } else {
      isTicking = false;
    }
  }

  // Scroll parallax
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    if (canvas) {
      canvas.style.top = `${(scrollY * 0.2).toFixed(1)}px`;
    }
    if (glowLeft) {
      glowLeft.style.top = `${(15 + scrollY * 0.03).toFixed(1)}%`;
    }
    if (glowRight) {
      glowRight.style.bottom = `${(20 - scrollY * 0.03).toFixed(1)}%`;
    }
  }, { passive: true });
})();

// 3. 3D TILT & FLIP CARD CONTROLLER
(function initTiltAndFlipCards() {
  const projectFeatures = {
    'CareerMap': ['Career assessment and personalized career recommendations', 'University and program search with filters', 'Mentor chat, marketplace and payment workflow'],
    'Bookworm Mobile App': ['JWT authentication and personalized reading library', 'Cloudinary eBook uploads and in-app PDF reader', 'Page progress tracking, reviews and social feed'],
    'E-Commerce App': ['React Native product browsing and catalog screens', 'Shopping cart and checkout user flows', 'Mobile-first navigation and responsive layouts'],
    'Home Service App UI/UX': ['Service discovery and booking screen designs', 'Consistent visual identity, icons and typography', 'Mobile interface flows and reusable design elements'],
    'Weather Prediction System': ['Weather classification with MLP, KNN and Decision Tree', 'Model comparison and prediction workflow', 'Weather forecasting for multiple cities'],
    'Savor 3D Website': ['Responsive restaurant menu and landing experience', 'Interactive 3D visual elements', 'React, Vite and Tailwind CSS frontend'],
    'Brewly & Co.': ['Coffee catalog, customization and filtering', 'Shopping cart, wishlist and subscription flow', 'Admin management and test-mode Stripe checkout'],
    'Interactive Chatbot': ['Interactive conversational chat interface', 'Responsive message input and chat history display', 'User-focused chatbot interaction design'],
    'Dynamic Age Calculator': ['Date-of-birth input and age calculation', 'Live results and input validation', 'Responsive, accessible calculator interface']
  };
  function setupCards() {
    const cards = document.querySelectorAll('.modern-project-card');

    cards.forEach(card => {
      // 1. Wrap card contents into inner, front and back if not wrapped
      if (!card.querySelector('.project-card-inner')) {
        const frontContent = card.innerHTML;
        const title = card.querySelector('h3')?.textContent?.trim() || 'Project Details';
        const desc = card.querySelector('p')?.textContent?.trim() || '';
        const pills = Array.from(card.querySelectorAll('.tech-pill')).map(p => p.outerHTML).join(' ');
        const link = card.querySelector('.btn-project-link:not(.disabled-link), .overlay-btn:not(.overlay-btn-quickview)')?.href || '';

        card.innerHTML = `
          <div class="project-card-inner">
            <div class="project-card-front">
              ${frontContent}
            </div>
            <div class="project-card-back">
              <div class="project-card-back-header">
                <h4><i class="fas fa-layer-group" style="color:#38bdf8; margin-right:6px;"></i> ${title}</h4>
                <button class="btn-flip-back" type="button" aria-label="Flip Back" title="Flip Back"><i class="fas fa-undo"></i></button>
              </div>
              <div class="project-card-back-body">
                <p>${desc}</p>
                <div style="margin: 0.85rem 0;">
                  <strong style="font-size:0.8rem; color:#94a3b8; text-transform:uppercase; letter-spacing:0.05em;">Key Features:</strong>
                  <ul class="project-back-features">
                    ${(projectFeatures[title] || ['Project-specific features and implementation details']).map(feature => `<li><i class="fas fa-check-circle" aria-hidden="true"></i><span>${feature}</span></li>`).join('')}
                  </ul>
                </div>
                <div style="display:flex; flex-wrap:wrap; gap:5px; margin-bottom:1rem;">
                  ${pills}
                </div>
              </div>
              <div style="display:flex; gap:0.5rem; justify-content:space-between; align-items:center;">
                ${link ? `<a href="${link}" target="_blank" rel="noopener noreferrer" class="btn-filled hero-btn-main" style="padding:0.45rem 0.9rem; font-size:0.78rem;"><i class="fas fa-external-link-alt"></i> Live Demo</a>` : '<span style="font-size:0.75rem; color:#64748b;">Internal System</span>'}
                <button class="btn-flip-back" type="button" aria-label="Flip Back" title="Flip Back"><i class="fas fa-sync-alt"></i></button>
              </div>
            </div>
          </div>
        `;
      }

      // 2. 3D Tilt on hover (when not flipped)
      card.addEventListener('mousemove', function (e) {
        if (card.classList.contains('is-flipped') || window.innerWidth < 768) return;
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (((centerY - y) / centerY) * 11).toFixed(2);
        const rotateY = (((x - centerX) / centerX) * 11).toFixed(2);

        this.style.transform = `perspective(1100px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.025, 1.025, 1.025) translateY(-6px)`;
      });

      card.addEventListener('mouseleave', function () {
        if (card.classList.contains('is-flipped')) return;
        this.style.transform = 'perspective(1100px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1) translateY(0)';
      });
    });

    // 3. Flip button trigger
    document.addEventListener('click', function (e) {
      const flipBtn = e.target.closest('.btn-flip-card');
      if (flipBtn) {
        e.preventDefault();
        e.stopPropagation();
        const card = flipBtn.closest('.modern-project-card');
        if (card) {
          card.classList.toggle('is-flipped');
        }
        return;
      }

      const backBtn = e.target.closest('.btn-flip-back');
      if (backBtn) {
        e.preventDefault();
        e.stopPropagation();
        const card = backBtn.closest('.modern-project-card');
        if (card) {
          card.classList.remove('is-flipped');
          card.style.transform = 'perspective(1100px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1) translateY(0)';
        }
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupCards);
  } else {
    setupCards();
  }
})();
