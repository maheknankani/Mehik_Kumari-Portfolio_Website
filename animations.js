// Advanced Portfolio Animations
document.addEventListener('DOMContentLoaded', function() {
    
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // Animate skill bars
                if (entry.target.classList.contains('skill')) {
                    const skillBar = entry.target.querySelector('.skill-level');
                    const percentage = skillBar.style.width;
                    skillBar.style.width = '0%';
                    setTimeout(() => {
                        skillBar.style.width = percentage;
                    }, 200);
                }
            }
        });
    }, observerOptions);

    // Observe all animated elements
    const animatedElements = document.querySelectorAll(
        '.fade-in, .fade-in-delayed, .fade-in-right, .slide-in-left, .slide-in-right, .slide-in-bottom, .skill, .project-card, .certificate-badge, .modern-project-card, .contact-info-card, .timeline-entry'
    );
    animatedElements.forEach(el => observer.observe(el));

    // Smooth scrolling for navigation links with fixed/sticky header offset
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const header = document.querySelector('header');
                const headerOffset = header ? header.offsetHeight + 20 : 90;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Mobile navigation toggle with hamburger animation
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navOverlay = document.querySelector('.nav-overlay');
    const themeToggle = document.querySelector('.theme-toggle');

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
        root.classList.toggle('theme-dark', isDark);
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

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('open');
            if (navOverlay) navOverlay.classList.toggle('active');
            document.body.classList.toggle('nav-open');
        });

        // Close nav when clicking overlay
        if (navOverlay) {
            navOverlay.addEventListener('click', () => {
                closeNav();
            });
        }

        // Close nav when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                closeNav();
            });
        });

        // Close nav on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('open')) {
                closeNav();
            }
        });

        function closeNav() {
            navToggle.classList.remove('active');
            navLinks.classList.remove('open');
            if (navOverlay) navOverlay.classList.remove('active');
            document.body.classList.remove('nav-open');
        }
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

body:not(.loaded) * {
    animation-play-state: paused !important;
}

body.loaded {
    animation: fadeIn 0.5s ease-in-out;
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

// ── Interactive Background Particle & Constellation Canvas ────────────────
(function () {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let animFrameId = null;

  const mouse = {
    x: null,
    y: null,
    radius: 170
  };

  // Track Mouse Position
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  function getThemeColors() {
    const isDark = document.body.classList.contains('theme-dark');
    return isDark ? {
      particleRGB: '147, 197, 253', // soft neon blue
      lineRGB: '96, 165, 250',      // sky blue lines
      mouseLineRGB: '56, 189, 248', // cyan mouse lines
      particleAlpha: 0.55,
      lineMaxAlpha: 0.22
    } : {
      particleRGB: '59, 130, 246',   // clean blue
      lineRGB: '147, 197, 253',     // soft pale blue lines
      mouseLineRGB: '56, 189, 248', // clean cyan mouse lines
      particleAlpha: 0.35,
      lineMaxAlpha: 0.12            // minimal, uncluttered lines on light background
    };
  }

  let theme = getThemeColors();

  // Watch for theme changes
  const themeObserver = new MutationObserver(() => {
    theme = getThemeColors();
  });
  themeObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });

  class Particle {
    constructor() {
      this.init();
    }

    init() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.radius = Math.random() * 2.5 + 2.0; // 2.0px to 4.5px dots
      this.vx = (Math.random() - 0.5) * 0.8;
      this.vy = (Math.random() - 0.5) * 0.8;
      this.baseAlpha = Math.random() * 0.4 + 0.6;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse repulsion / attraction interaction
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          this.x -= Math.cos(angle) * force * 1.5;
          this.y -= Math.sin(angle) * force * 1.5;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${theme.particleRGB}, ${this.baseAlpha * theme.particleAlpha})`;
      ctx.fill();
    }
  }

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initParticles();
  }

  function initParticles() {
    particles = [];
    const count = Math.min(Math.floor((width * height) / 14000), 85);
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function connectParticles() {
    const maxDist = 145;
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * theme.lineMaxAlpha;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.strokeStyle = `rgba(${theme.lineRGB}, ${alpha})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      }

      // Connect to mouse cursor
      if (mouse.x !== null && mouse.y !== null) {
        const dx = particles[a].x - mouse.x;
        const dy = particles[a].y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const alpha = (1 - dist / mouse.radius) * (theme.lineMaxAlpha * 1.6);
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(${theme.mouseLineRGB}, ${alpha})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    connectParticles();
    animFrameId = requestAnimationFrame(animate);
  }

  // Handle Resize with debounce
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resize, 150);
  });

  resize();
  animate();
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

// ── Subtle 3D Perspective Tilt on Cards (Desktop) ──────────────────────────
document.addEventListener('DOMContentLoaded', function () {
  if (window.innerWidth < 900) return;

  const tiltCards = document.querySelectorAll('.modern-project-card, .certificate-card, .highlight-item, .contact-info-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', function (e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (centerY - y) / 25;
      const rotateY = (x - centerX) / 25;

      this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', function () {
      this.style.transform = '';
    });
  });
});












