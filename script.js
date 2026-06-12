// ===== THEME TOGGLE =====
const html = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('.theme-icon');

const savedTheme = localStorage.getItem('theme') || 'dark';
applyTheme(savedTheme);

function applyTheme(theme) {
  if (theme === 'light') {
    html.classList.remove('dark');
    html.classList.add('light');
    themeIcon.textContent = '🌙';
    themeToggle.title = 'Switch to Dark Mode';
  } else {
    html.classList.remove('light');
    html.classList.add('dark');
    themeIcon.textContent = '☀️';
    themeToggle.title = 'Switch to Light Mode';
  }
  localStorage.setItem('theme', theme);
}

themeToggle.addEventListener('click', () => {
  const current = html.classList.contains('light') ? 'light' : 'dark';
  applyTheme(current === 'dark' ? 'light' : 'dark');
});

// ===== NAVBAR: Active link + scroll shadow =====
const navbar = document.getElementById('navbar');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);

  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 100) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}, { passive: true });

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  // Animate hamburger bars
  const bars = hamburger.querySelectorAll('span');
  if (mobileMenu.classList.contains('open')) {
    bars[0].style.transform = 'translateY(7px) rotate(45deg)';
    bars[1].style.opacity = '0';
    bars[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    bars[0].style.transform = '';
    bars[1].style.opacity = '';
    bars[2].style.transform = '';
  }
});

mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    const bars = hamburger.querySelectorAll('span');
    bars[0].style.transform = '';
    bars[1].style.opacity = '';
    bars[2].style.transform = '';
  });
});

// ===== SCROLL REVEAL ANIMATION =====
const revealElements = document.querySelectorAll(
  '.skill-card, .tech-category-group, .project-card, .timeline-item, .contact-item, .about-card, .about-text, .stat-item, .tech-pill'
);

revealElements.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const siblings = Array.from(entry.target.parentElement.children).filter(
        c => c.classList.contains('reveal')
      );
      const index = siblings.indexOf(entry.target);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, index * 70);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

revealElements.forEach(el => revealObserver.observe(el));

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===== 3D TILT EFFECT ON CARDS =====
const tiltCards = document.querySelectorAll('.tilt-card');

tiltCards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;

    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px) scale(1.01)`;
    card.style.transition = 'transform 0.1s ease';

    // Shine effect
    const shine = card.querySelector('.card-shine');
    if (shine) {
      shine.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.06) 0%, transparent 60%)`;
    }
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
  });

  // Add shine overlay
  const shine = document.createElement('div');
  shine.className = 'card-shine';
  shine.style.cssText = 'position:absolute;inset:0;border-radius:inherit;pointer-events:none;z-index:10;transition:background 0.1s;';
  card.style.position = 'relative';
  card.appendChild(shine);
});

// ===== TYPEWRITER EFFECT =====
const typewriterTarget = document.getElementById('typewriter-target');
if (typewriterTarget) {
  const words = ['Digital Solutions', 'Web Applications', 'HRMS Systems', 'REST APIs', 'Clean Code'];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let isPausing = false;

  function typewrite() {
    if (isPausing) return;

    const currentWord = words[wordIndex];

    if (isDeleting) {
      typewriterTarget.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typewriterTarget.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
    }

    let delay = isDeleting ? 60 : 100;

    if (!isDeleting && charIndex === currentWord.length) {
      delay = 2200;
      isPausing = true;
      setTimeout(() => {
        isDeleting = true;
        isPausing = false;
        typewrite();
      }, delay);
      return;
    }

    if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      delay = 400;
    }

    setTimeout(typewrite, delay);
  }

  // Start typewriter after initial load animation
  setTimeout(() => {
    typewriterTarget.textContent = words[0];
    charIndex = words[0].length;
    setTimeout(typewrite, 2500);
  }, 800);

  // Add blinking cursor
  const cursor = document.createElement('span');
  cursor.textContent = '|';
  cursor.style.cssText = `
    display: inline-block;
    margin-left: 2px;
    animation: cursorBlink 1s step-end infinite;
    background: linear-gradient(135deg, #60a5fa, #a78bfa);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-weight: 300;
  `;

  const style = document.createElement('style');
  style.textContent = `
    @keyframes cursorBlink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }
  `;
  document.head.appendChild(style);
  typewriterTarget.parentNode.insertBefore(cursor, typewriterTarget.nextSibling);
}

// ===== MOUSE CURSOR GLOW TRAIL (dark mode only) =====
let mouseGlow = null;

function createMouseGlow() {
  if (mouseGlow) return;
  mouseGlow = document.createElement('div');
  mouseGlow.style.cssText = `
    position: fixed;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
    background: radial-gradient(circle, rgba(96,165,250,0.04) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: left 0.15s ease, top 0.15s ease;
    mix-blend-mode: screen;
  `;
  document.body.appendChild(mouseGlow);
}

function removeMouseGlow() {
  if (mouseGlow) {
    mouseGlow.remove();
    mouseGlow = null;
  }
}

function updateMouseGlow(e) {
  if (!mouseGlow) return;
  mouseGlow.style.left = e.clientX + 'px';
  mouseGlow.style.top = e.clientY + 'px';
}

// Initialize based on theme
function syncMouseGlow() {
  if (html.classList.contains('dark')) {
    createMouseGlow();
    window.addEventListener('mousemove', updateMouseGlow, { passive: true });
  } else {
    removeMouseGlow();
    window.removeEventListener('mousemove', updateMouseGlow);
  }
}

syncMouseGlow();

// Re-sync when theme changes
themeToggle.addEventListener('click', () => {
  setTimeout(syncMouseGlow, 50);
});

// ===== HERO PARALLAX =====
const hero = document.getElementById('hero');
const orb1 = hero?.querySelector('.hero-orb-1');
const orb2 = hero?.querySelector('.hero-orb-2');
const orb3 = hero?.querySelector('.hero-orb-3');

if (hero) {
  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.width / 2) / rect.width;
    const y = (e.clientY - rect.height / 2) / rect.height;

    if (orb1) orb1.style.transform = `translate(${x * 30}px, ${y * 20}px) scale(1.1)`;
    if (orb2) orb2.style.transform = `translate(${x * -20}px, ${y * -15}px) scale(1.08)`;
    if (orb3) orb3.style.transform = `translate(${x * 15}px, ${y * 10}px) scale(1.05)`;
  }, { passive: true });

  hero.addEventListener('mouseleave', () => {
    if (orb1) orb1.style.transform = '';
    if (orb2) orb2.style.transform = '';
    if (orb3) orb3.style.transform = '';
  });
}

// ===== SPARKLE EFFECT ON BUTTONS =====
function createSparkle(x, y, container) {
  const sparkleCount = 8;
  for (let i = 0; i < sparkleCount; i++) {
    const sparkle = document.createElement('span');
    const angle = (i / sparkleCount) * Math.PI * 2;
    const distance = 30 + Math.random() * 30;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance;
    const size = 3 + Math.random() * 4;
    const colors = ['#60a5fa', '#a78bfa', '#f472b6', '#34d399', '#fbbf24'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    sparkle.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: ${color};
      pointer-events: none;
      z-index: 9998;
      box-shadow: 0 0 ${size * 2}px ${color};
      animation: sparkleAnim 0.7s ease-out forwards;
      --tx: ${tx}px;
      --ty: ${ty}px;
    `;
    document.body.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 700);
  }
}

const sparkleStyle = document.createElement('style');
sparkleStyle.textContent = `
  @keyframes sparkleAnim {
    0% { transform: translate(0, 0) scale(1); opacity: 1; }
    100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
  }
`;
document.head.appendChild(sparkleStyle);

document.querySelectorAll('.btn-primary, .btn-resume').forEach(btn => {
  btn.addEventListener('click', (e) => {
    createSparkle(e.clientX, e.clientY);
  });
});

// ===== COUNTER ANIMATION for hero stats =====
function animateCounter(el, target, suffix = '') {
  const isNum = !isNaN(parseInt(target));
  if (!isNum) return;

  const num = parseInt(target);
  let start = 0;
  const duration = 1200;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * num) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const strong = entry.target.querySelector('strong');
      if (strong) {
        const text = strong.textContent;
        if (text === '3+') animateCounter(strong, 3, '+');
      }
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-item').forEach(el => statsObserver.observe(el));
