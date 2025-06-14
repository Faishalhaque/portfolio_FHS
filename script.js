// Initialize AOS animations
document.addEventListener('DOMContentLoaded', () => {
  AOS.init({
    duration: 800,
    once: true,
    easing: 'ease-in-out',
    offset: 100
  });

  // Initialize circular progress animations
  initCircularProgress();
});

// 3D Cursor Effect
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');
const interactiveElements = document.querySelectorAll('a, button, .interactive, .project-card, .goku');

if (cursor && cursorFollower) {
  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    
    gsap.to(cursorFollower, {
      x: e.clientX,
      y: e.clientY,
      duration: 0.6,
      ease: "power2.out"
    });
  });

  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('cursor-active');
      cursorFollower.classList.add('cursor-follower-active');
      
      if (el.classList.contains('btn')) {
        cursorFollower.style.backgroundColor = 'var(--bg)';
      }
    });
    
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('cursor-active');
      cursorFollower.classList.remove('cursor-follower-active');
      cursorFollower.style.backgroundColor = '';
    });
  });
}

// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.innerHTML = navLinks.classList.contains('active') 
      ? '<i class="fas fa-times"></i>' 
      : '<i class="fas fa-bars"></i>';
  });

  // Close mobile menu when clicking a link
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      hamburger.innerHTML = '<i class="fas fa-bars"></i>';
    });
  });
}

// Smooth scroll for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 70,
        behavior: 'smooth'
      });
    }
  });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
});

// Back to top button
const backToTopButton = document.querySelector('.back-to-top');
if (backToTopButton) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopButton.classList.add('active');
    } else {
      backToTopButton.classList.remove('active');
    }
  });
}

// Theme toggle functionality
const themeToggle = document.querySelector('.theme-toggle');
if (themeToggle) {
  const currentTheme = localStorage.getItem('theme');

  if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'light') {
      themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
  }

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme === 'light') {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
      themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
      themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
  });
}

// Circular progress animation
function initCircularProgress() {
  const circularProgressElements = document.querySelectorAll('.circular-progress');
  
  circularProgressElements.forEach(element => {
    const progressValue = element.querySelector('.progress-value');
    const progressEndValue = parseInt(element.getAttribute('data-value'));
    let progressStartValue = 0;
    const speed = 20;
    
    const progress = setInterval(() => {
      progressStartValue++;
      progressValue.textContent = `${progressStartValue}%`;
      element.style.background = `conic-gradient(var(--accent) ${progressStartValue * 3.6}deg, var(--card) 0deg)`;
      
      if (progressStartValue >= progressEndValue) {
        clearInterval(progress);
      }
    }, speed);
  });
}

// ===== Enhanced Goku Character Interactions =====
const goku = document.getElementById('goku-character');
const gokuMini = document.getElementById('goku-mini');
const gokuBtn = document.getElementById('goku-toggle-btn');
const floatToggle = document.getElementById('float-toggle');
const animateToggle = document.getElementById('animate-toggle');
const combatToggle = document.getElementById('combat-toggle');
const statusIndicator = document.querySelector('.character-status');

// Character States
let isFloating = true;
let isAnimating = true;
let isCombat = false;
let animationId;
let idleTimeout;

// Initialize Character
function initGoku() {
  if (!goku) return;

  goku.classList.add('idle');
  animateGoku();
  
  // Mini Goku Toggle
  if (gokuBtn && gokuMini) {
    gokuBtn.addEventListener('click', toggleMiniGoku);
  }
  
  // Character Controls
  if (floatToggle) {
    floatToggle.addEventListener('click', toggleFloat);
  }
  
  if (animateToggle) {
    animateToggle.addEventListener('click', toggleAnimation);
  }
  
  if (combatToggle) {
    combatToggle.addEventListener('click', toggleCombat);
  }
  
  // Interactions
  goku.addEventListener('mousedown', powerUp);
  goku.addEventListener('mouseup', powerDown);
  
  if (gokuMini) {
    setupDragAndDrop();
  }
}

// Control Functions
function toggleFloat() {
  isFloating = !isFloating;
  goku.classList.toggle('floating', isFloating);
  if (floatToggle) {
    floatToggle.textContent = isFloating ? 'Stop Float' : 'Start Float';
  }
  updateStatus();
}

function toggleAnimation() {
  isAnimating = !isAnimating;
  if (animateToggle) {
    animateToggle.textContent = isAnimating ? 'Stop Animation' : 'Start Animation';
  }
  updateStatus();
  if (isAnimating) {
    animateGoku();
  } else {
    cancelAnimationFrame(animationId);
    goku.style.transform = '';
  }
}

function toggleCombat() {
  isCombat = !isCombat;
  goku.classList.toggle('combat', isCombat);
  if (combatToggle) {
    combatToggle.textContent = isCombat ? 'Normal Mode' : 'Combat Mode';
  }
  updateStatus();
}

function toggleMiniGoku() {
  gokuMini.classList.toggle('goku-hidden');
  if (!gokuMini.classList.contains('goku-hidden')) {
    gsap.from(gokuMini, {
      scale: 0.5,
      opacity: 0,
      duration: 0.5,
      ease: "back.out(1.7)"
    });
  }
}

// Animation Functions
function animateGoku() {
  if (!isAnimating) return;
  
  let angle = 0;
  const duration = 2000;
  const startTime = performance.now();
  
  function animate(time) {
    const elapsed = time - startTime;
    const progress = (elapsed % duration) / duration;
    
    angle = progress * Math.PI * 2;
    const scale = 1 + Math.sin(angle) * 0.1;
    const rotate = Math.sin(angle) * 10;
    const translateY = Math.sin(angle * 2) * 10;
    
    goku.style.transform = `rotate(${rotate}deg) scale(${scale}) translateY(${translateY}px)`;
    
    if (isAnimating) {
      animationId = requestAnimationFrame(animate);
    }
  }
  
  animationId = requestAnimationFrame(animate);
}

// Helper Functions
function updateStatus() {
  if (!statusIndicator) return;
  
  let status = '';
  if (!isAnimating) status = 'Static';
  else if (isCombat) status = 'Combat Mode!';
  else status = isFloating ? 'Floating' : 'Grounded';
  
  statusIndicator.textContent = status;
}

function powerUp() {
  goku.classList.add('power-up');
  if (statusIndicator) {
    statusIndicator.textContent = 'Powering Up!';
  }
}

function powerDown() {
  goku.classList.remove('power-up');
  updateStatus();
}

function setupDragAndDrop() {
  let isDragging = false;
  let offsetX, offsetY;

  gokuMini.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - gokuMini.getBoundingClientRect().left;
    offsetY = e.clientY - gokuMini.getBoundingClientRect().top;
    gokuMini.style.cursor = 'grabbing';
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    
    gokuMini.style.left = `${e.clientX - offsetX}px`;
    gokuMini.style.top = `${e.clientY - offsetY}px`;
    gokuMini.style.right = 'auto';
    gokuMini.style.bottom = 'auto';
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
    gokuMini.style.cursor = 'grab';
  });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initGoku);