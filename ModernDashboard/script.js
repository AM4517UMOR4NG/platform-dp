// ================================
// ENHANCED 3D ANALYTICS DASHBOARD
// ================================

const app = {
  theme: localStorage.getItem('theme') || 'light',
  charts: {},
  counters: {},
  notifications: [],
  particles: [],
  animations: {
    isReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    mouse: { x: 0, y: 0 },
    tilt: { x: 0, y: 0 },
    raf: null
  }
};

// ================================
// ENHANCED INITIALIZATION
// ================================

document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
});

function initializeApp() {
  showLoadingScreen();
  
  setTimeout(() => {
    initializeTheme();
    initializeSidebar();
    initializeCharts();
    initializeCounters();
    initializeSearch();
    initializeNotifications();
    initialize3DEffects();
    initializeParticleSystem();
    initializeScrollAnimations();
    initializeMouseTracking();
    initializeKeyboardShortcuts();
    hideLoadingScreen();
    
    showNotification('🚀 Welcome to Analytics Pro Dashboard!', 'success');
  }, 2000);
}

// ================================
// 3D EFFECTS SYSTEM
// ================================

function initialize3DEffects() {
  if (app.animations.isReducedMotion) return;
  
  const cards = document.querySelectorAll('.stat-card, .chart-card, .activity-card, .quick-actions-card');
  
  cards.forEach(card => {
    card.addEventListener('mouseenter', (e) => handleCardHover(e, true));
    card.addEventListener('mouseleave', (e) => handleCardHover(e, false));
    card.addEventListener('mousemove', (e) => handleCardMouseMove(e));
  });
  
  // Add 3D tilt effect to action buttons
  const actionBtns = document.querySelectorAll('.action-btn');
  actionBtns.forEach(btn => {
    btn.addEventListener('mouseenter', (e) => handle3DTilt(e, true));
    btn.addEventListener('mouseleave', (e) => handle3DTilt(e, false));
    btn.addEventListener('mousemove', (e) => handle3DMouseMove(e));
  });
}

function handleCardHover(event, isEntering) {
  const card = event.currentTarget;
  
  if (isEntering) {
    card.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    card.style.transform = 'translateY(-15px) translateZ(30px) rotateX(5deg)';
    card.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.15), 0 15px 30px rgba(0, 0, 0, 0.1)';
    
    // Add floating animation to icons
    const icon = card.querySelector('.stat-icon, .activity-icon');
    if (icon) {
      icon.style.transform = 'translateZ(20px) rotateY(360deg) scale(1.2)';
      icon.style.animation = 'iconFloat 2s ease-in-out infinite';
    }
  } else {
    card.style.transform = 'translateY(0) translateZ(0) rotateX(0deg)';
    card.style.boxShadow = '';
    
    const icon = card.querySelector('.stat-icon, .activity-icon');
    if (icon) {
      icon.style.transform = '';
      icon.style.animation = '';
    }
  }
}

function handleCardMouseMove(event) {
  const card = event.currentTarget;
  const rect = card.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  
  const rotateX = (y - centerY) / 10;
  const rotateY = (centerX - x) / 10;
  
  card.style.transform = `
    translateY(-15px) 
    translateZ(30px) 
    rotateX(${rotateX}deg) 
    rotateY(${rotateY}deg)
    perspective(1000px)
  `;
}

function handle3DTilt(event, isEntering) {
  const element = event.currentTarget;
  
  if (isEntering) {
    element.style.transition = 'all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
  } else {
    element.style.transform = '';
  }
}

function handle3DMouseMove(event) {
  const element = event.currentTarget;
  const rect = element.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  
  const rotateX = (y - centerY) / 8;
  const rotateY = (centerX - x) / 8;
  
  element.style.transform = `
    translateY(-10px) 
    translateZ(15px) 
    rotateX(${rotateX}deg) 
    rotateY(${rotateY}deg)
    scale(1.05)
  `;
}

// ================================
// PARTICLE SYSTEM
// ================================

function initializeParticleSystem() {
  if (app.animations.isReducedMotion) return;
  
  const particleContainer = createParticleContainer();
  document.body.appendChild(particleContainer);
  
  for (let i = 0; i < 20; i++) {
    createParticle(particleContainer);
  }
  
  animateParticles();
}

function createParticleContainer() {
  const container = document.createElement('div');
  container.className = 'floating-particles';
  container.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    overflow: hidden;
    z-index: 1;
  `;
  return container;
}

function createParticle(container) {
  const particle = document.createElement('div');
  particle.className = 'particle';
  
  const size = Math.random() * 4 + 2;
  const x = Math.random() * window.innerWidth;
  const y = window.innerHeight + 10;
  const hue = Math.random() * 360;
  
  particle.style.cssText = `
    position: absolute;
    width: ${size}px;
    height: ${size}px;
    background: hsl(${hue}, 70%, 60%);
    border-radius: 50%;
    left: ${x}px;
    top: ${y}px;
    opacity: 0;
  `;
  
  container.appendChild(particle);
  
  app.particles.push({
    element: particle,
    x: x,
    y: y,
    size: size,
    speed: Math.random() * 3 + 1,
    opacity: 0,
    hue: hue
  });
}

function animateParticles() {
  app.particles.forEach((particle, index) => {
    particle.y -= particle.speed;
    particle.x += Math.sin(particle.y * 0.01) * 2;
    particle.opacity = Math.min(particle.opacity + 0.01, 0.6);
    
    if (particle.y < -10) {
      particle.y = window.innerHeight + 10;
      particle.x = Math.random() * window.innerWidth;
      particle.opacity = 0;
    }
    
    particle.element.style.transform = `translateX(${particle.x}px) translateY(${particle.y}px)`;
    particle.element.style.opacity = particle.opacity;
  });
  
  requestAnimationFrame(animateParticles);
}

// ================================
// MOUSE TRACKING SYSTEM
// ================================

function initializeMouseTracking() {
  let ticking = false;
  
  document.addEventListener('mousemove', (e) => {
    app.animations.mouse.x = e.clientX;
    app.animations.mouse.y = e.clientY;
    
    if (!ticking) {
      requestAnimationFrame(updateMouseEffects);
      ticking = true;
    }
  });
}

function updateMouseEffects() {
  const mouseX = app.animations.mouse.x;
  const mouseY = app.animations.mouse.y;
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  
  // Update parallax effect for background elements
  const parallaxElements = document.querySelectorAll('.chart-card, .stat-card');
  parallaxElements.forEach((element, index) => {
    const speed = (index + 1) * 0.5;
    const x = (mouseX - centerX) * speed / 100;
    const y = (mouseY - centerY) * speed / 100;
    
    element.style.transform += ` translate3d(${x}px, ${y}px, 0px)`;
  });
  
  ticking = false;
}

// ================================
// SCROLL ANIMATIONS
// ================================

function initializeScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        animateElement(entry.target);
      }
    });
  }, observerOptions);
  
  // Observe all animatable elements
  const elements = document.querySelectorAll('.stat-card, .chart-card, .activity-item, .action-btn');
  elements.forEach(el => {
    el.classList.add('animate-on-scroll');
    observer.observe(el);
  });
}

function animateElement(element) {
  const delay = Math.random() * 200;
  
  setTimeout(() => {
    element.style.transition = 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    element.style.transform = 'translateY(0) translateZ(0) rotateX(0deg)';
    element.style.opacity = '1';
  }, delay);
}

// ================================
// ENHANCED LOADING SCREEN
// ================================

function showLoadingScreen() {
  const loadingScreen = document.getElementById('loading-screen');
  const loadingText = loadingScreen.querySelector('.loading-text');
  
  loadingScreen.style.display = 'flex';
  
  // Animate loading text
  const messages = [
    'Initializing 3D Engine...',
    'Loading Analytics Data...',
    'Preparing Dashboard...',
    'Almost Ready!'
  ];
  
  let messageIndex = 0;
  const messageInterval = setInterval(() => {
    loadingText.textContent = messages[messageIndex];
    messageIndex = (messageIndex + 1) % messages.length;
  }, 500);
  
  // Store interval for cleanup
  loadingScreen.messageInterval = messageInterval;
}

function hideLoadingScreen() {
  const loadingScreen = document.getElementById('loading-screen');
  
  // Clear message interval
  if (loadingScreen.messageInterval) {
    clearInterval(loadingScreen.messageInterval);
  }
  
  loadingScreen.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
  loadingScreen.style.transform = 'scale(1.1)';
  loadingScreen.style.opacity = '0';
  
  setTimeout(() => {
    loadingScreen.style.display = 'none';
    loadingScreen.style.transform = '';
    
    // Trigger entrance animations
    triggerEntranceAnimations();
  }, 800);
}

function triggerEntranceAnimations() {
  const elements = document.querySelectorAll('.sidebar, .main-content');
  
  elements.forEach((element, index) => {
    setTimeout(() => {
      element.style.animation = `slideIn3D 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards`;
    }, index * 200);
  });
}

// ================================
// ENHANCED THEME SYSTEM
// ================================

function initializeTheme() {
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;
  
  body.setAttribute('data-theme', app.theme);
  
  themeToggle.addEventListener('click', function() {
    // Add rotation animation
    this.style.animation = 'themeToggleRotate 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
    
    setTimeout(() => {
      app.theme = app.theme === 'light' ? 'dark' : 'light';
      body.setAttribute('data-theme', app.theme);
      localStorage.setItem('theme', app.theme);
      
      updateChartsTheme();
      updateParticleColors();
      
      const themeName = app.theme === 'light' ? '☀️ Light' : '🌙 Dark';
      showNotification(`Switched to ${themeName} mode`, 'info');
      
      this.style.animation = '';
    }, 300);
  });
}

function updateParticleColors() {
  app.particles.forEach(particle => {
    const isDark = app.theme === 'dark';
    const hue = isDark ? particle.hue + 180 : particle.hue;
    particle.element.style.background = `hsl(${hue}, 70%, ${isDark ? 40 : 60}%)`;
  });
}

// ================================
// ENHANCED SIDEBAR
// ================================

function initializeSidebar() {
  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('sidebar');
  const navLinks = document.querySelectorAll('.nav-link');
  
  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', function() {
      sidebar.classList.toggle('open');
      
      // Add 3D flip animation
      this.style.transform = 'rotateY(180deg) scale(1.1)';
      setTimeout(() => {
        this.style.transform = '';
      }, 300);
    });
  }
  
  navLinks.forEach((link, index) => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Remove active class from all links
      navLinks.forEach(l => l.classList.remove('active'));
      
      // Add active class with animation
      this.classList.add('active');
      
      // Ripple effect
      createRippleEffect(this, e);
      
      const section = this.getAttribute('data-section');
      updatePageTitle(section);
      
      showNotification(`📊 Navigated to ${section}`, 'info');
    });
    
    // Stagger entrance animations
    setTimeout(() => {
      link.style.animation = `slideInLeft 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards`;
    }, index * 100);
  });
}

function createRippleEffect(element, event) {
  const ripple = document.createElement('div');
  const rect = element.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;
  
  ripple.style.cssText = `
    position: absolute;
    width: ${size}px;
    height: ${size}px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    left: ${x}px;
    top: ${y}px;
    transform: scale(0);
    animation: ripple 0.6s ease-out;
    pointer-events: none;
  `;
  
  element.style.position = 'relative';
  element.style.overflow = 'hidden';
  element.appendChild(ripple);
  
  setTimeout(() => {
    ripple.remove();
  }, 600);
}

function updatePageTitle(section) {
  const pageTitle = document.querySelector('.page-title');
  const pageSubtitle = document.querySelector('.page-subtitle');
  
  const titles = {
    dashboard: {
      title: '📊 Dashboard Overview',
      subtitle: "Welcome back! Here's what's happening."
    },
    analytics: {
      title: '📈 Analytics Center',
      subtitle: 'Deep dive into your data insights.'
    },
    reports: {
      title: '📋 Reports & Insights',
      subtitle: 'Generate comprehensive reports.'
    },
    users: {
      title: '👥 User Management',
      subtitle: 'Manage your application users.'
    },
    settings: {
      title: '⚙️ Settings & Configuration',
      subtitle: 'Customize your dashboard experience.'
    }
  };
  
  if (titles[section]) {
    // Animate title change
    pageTitle.style.transform = 'translateY(-20px)';
    pageTitle.style.opacity = '0';
    
    setTimeout(() => {
      pageTitle.textContent = titles[section].title;
      pageSubtitle.textContent = titles[section].subtitle;
      
      pageTitle.style.transform = 'translateY(0)';
      pageTitle.style.opacity = '1';
    }, 200);
  }
}

// ================================
// ENHANCED CHART SYSTEM
// ================================

function initializeCharts() {
  initializeRevenueChart();
  initializeTrafficChart();
}

function initializeRevenueChart() {
  const ctx = document.getElementById('revenueChart').getContext('2d');
  
  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, 'rgba(59, 130, 246, 0.4)');
  gradient.addColorStop(0.5, 'rgba(139, 92, 246, 0.2)');
  gradient.addColorStop(1, 'rgba(16, 185, 129, 0.1)');
  
  app.charts.revenue = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      datasets: [{
        label: 'Revenue',
        data: [12000, 19000, 15000, 25000, 22000, 30000, 28000],
        backgroundColor: gradient,
        borderColor: '#3b82f6',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 3,
        pointRadius: 8,
        pointHoverRadius: 12,
        pointHoverBackgroundColor: '#8b5cf6',
        pointHoverBorderWidth: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: 'index'
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(30, 41, 59, 0.95)',
          titleColor: '#f1f5f9',
          bodyColor: '#cbd5e1',
          borderColor: '#3b82f6',
          borderWidth: 2,
          cornerRadius: 12,
          displayColors: false,
          padding: 12,
          callbacks: {
            label: function(context) {
              return `💰 Revenue: $${context.parsed.y.toLocaleString()}`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: '#64748b', font: { weight: '500' } }
        },
        y: {
          grid: { color: 'rgba(100, 116, 139, 0.1)' },
          ticks: {
            color: '#64748b',
            font: { weight: '500' },
            callback: function(value) {
              return '$' + value.toLocaleString();
            }
          }
        }
      },
      animation: {
        duration: 2000,
        easing: 'easeInOutQuart',
        onComplete: function() {
          // Add floating animation to chart points
          animateChartPoints(ctx);
        }
      }
    }
  });
}

function animateChartPoints(ctx) {
  const chart = Chart.getChart(ctx);
  if (!chart) return;
  
  const points = chart.getDatasetMeta(0).data;
  points.forEach((point, index) => {
    setTimeout(() => {
      point.element.animate([
        { transform: 'scale(1) translateY(0px)' },
        { transform: 'scale(1.2) translateY(-5px)' },
        { transform: 'scale(1) translateY(0px)' }
      ], {
        duration: 800,
        easing: 'ease-in-out'
      });
    }, index * 100);
  });
}

function initializeTrafficChart() {
  const ctx = document.getElementById('trafficChart').getContext('2d');
  
  app.charts.traffic = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['🌐 Direct', '📱 Social Media', '📧 Email', '🔍 Search', '🔗 Referrals'],
      datasets: [{
        data: [35, 25, 20, 15, 5],
        backgroundColor: [
          '#3b82f6',
          '#10b981',
          '#8b5cf6',
          '#f59e0b',
          '#ef4444'
        ],
        borderWidth: 0,
        hoverBorderWidth: 6,
        hoverBorderColor: '#ffffff',
        hoverOffset: 15
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '65%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 25,
            usePointStyle: true,
            pointStyle: 'circle',
            color: '#64748b',
            font: { size: 13, weight: '500' }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(30, 41, 59, 0.95)',
          titleColor: '#f1f5f9',
          bodyColor: '#cbd5e1',
          borderColor: '#3b82f6',
          borderWidth: 2,
          cornerRadius: 12,
          padding: 12,
          callbacks: {
            label: function(context) {
              return `${context.label}: ${context.parsed}%`;
            }
          }
        }
      },
      animation: {
        duration: 2000,
        easing: 'easeInOutQuart'
      }
    }
  });
}

// ================================
// ENHANCED NOTIFICATION SYSTEM
// ================================

function showNotification(message, type = 'info', duration = 5000) {
  const toastContainer = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const icon = getNotificationIcon(type);
  toast.innerHTML = `
    <i class="ph ${icon}"></i>
    <span>${message}</span>
    <button class="toast-close">×</button>
  `;
  
  // Add 3D entrance animation
  toast.style.transform = 'translateX(400px) translateZ(-100px) rotateY(90deg)';
  toast.style.opacity = '0';
  
  toastContainer.appendChild(toast);
  
  // Trigger entrance animation
  requestAnimationFrame(() => {
    toast.style.transition = 'all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
    toast.style.transform = 'translateX(0) translateZ(0) rotateY(0deg)';
    toast.style.opacity = '1';
  });
  
  // Auto remove
  const timeoutId = setTimeout(() => {
    removeToast(toast);
  }, duration);
  
  // Close button functionality
  const closeBtn = toast.querySelector('.toast-close');
  closeBtn.addEventListener('click', () => {
    clearTimeout(timeoutId);
    removeToast(toast);
  });
  
  // Click to close
  toast.addEventListener('click', () => {
    clearTimeout(timeoutId);
    removeToast(toast);
  });
}

function removeToast(toast) {
  toast.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
  toast.style.transform = 'translateX(400px) translateZ(-100px) rotateY(-90deg)';
  toast.style.opacity = '0';
  
  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  }, 400);
}

function getNotificationIcon(type) {
  const icons = {
    success: 'ph-check-circle-fill',
    error: 'ph-x-circle-fill',
    warning: 'ph-warning-circle-fill',
    info: 'ph-info-fill'
  };
  return icons[type] || icons.info;
}

// ================================
// ENHANCED KEYBOARD SHORTCUTS
// ================================

function initializeKeyboardShortcuts() {
  document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K for search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      const searchInput = document.querySelector('.search-input');
      if (searchInput) {
        searchInput.focus();
        searchInput.style.animation = 'searchFocus 0.6s ease';
        showNotification('🔍 Search activated', 'info');
      }
    }
    
    // Ctrl/Cmd + D for theme toggle
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
      e.preventDefault();
      document.getElementById('themeToggle').click();
    }
    
    // Escape to close modals/notifications
    if (e.key === 'Escape') {
      const toasts = document.querySelectorAll('.toast');
      toasts.forEach(toast => removeToast(toast));
    }
    
    // Space for dashboard refresh
    if (e.key === ' ' && e.target === document.body) {
      e.preventDefault();
      refreshDashboard();
    }
  });
}

function refreshDashboard() {
  showNotification('🔄 Refreshing dashboard...', 'info');
  
  // Animate refresh
  const content = document.querySelector('.content');
  content.style.animation = 'refreshSpin 1s ease-in-out';
  
  setTimeout(() => {
    updateCounters();
    updateChartData();
    content.style.animation = '';
    showNotification('✅ Dashboard refreshed!', 'success');
  }, 1000);
}

// ================================
// ENHANCED COUNTER ANIMATIONS
// ================================

function initializeCounters() {
  const counters = document.querySelectorAll('[data-count]');
  
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-count'));
    const isMonetary = counter.textContent.includes('$');
    const isPercentage = counter.textContent.includes('%');
    
    animateCounter(counter, target, isMonetary, isPercentage);
  });
}

function animateCounter(element, target, isMonetary = false, isPercentage = false) {
  let current = 0;
  const increment = target / 120;
  const duration = 2500;
  const stepTime = duration / 120;
  
  // Add number flip effect
  element.style.fontFeatureSettings = '"tnum"';
  element.style.fontVariantNumeric = 'tabular-nums';
  
  const timer = setInterval(() => {
    current += increment;
    
    if (current >= target) {
      current = target;
      clearInterval(timer);
      
      // Add completion effect
      element.style.animation = 'counterComplete 0.6s ease';
    }
    
    let displayValue = Math.floor(current);
    
    if (isMonetary) {
      displayValue = '$' + displayValue.toLocaleString();
    } else if (isPercentage) {
      displayValue = displayValue + '%';
    } else {
      displayValue = displayValue.toLocaleString();
    }
    
    element.textContent = displayValue;
  }, stepTime);
}

function updateCounters() {
  const counters = document.querySelectorAll('[data-count]');
  
  counters.forEach(counter => {
    const currentValue = parseInt(counter.getAttribute('data-count'));
    const variance = Math.floor(Math.random() * 200) - 100; // ±100
    const newValue = Math.max(0, currentValue + variance);
    
    counter.setAttribute('data-count', newValue);
    
    const isMonetary = counter.textContent.includes('$');
    const isPercentage = counter.textContent.includes('%');
    
    animateCounter(counter, newValue, isMonetary, isPercentage);
  });
}

// ================================
// CSS ANIMATIONS (Added to DOM)
// ================================

function addEnhancedAnimations() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn3D {
      from {
        transform: translateX(-100px) translateZ(-100px) rotateY(-30deg);
        opacity: 0;
      }
      to {
        transform: translateX(0) translateZ(0) rotateY(0deg);
        opacity: 1;
      }
    }
    
    @keyframes slideInLeft {
      from {
        transform: translateX(-50px) translateZ(-20px);
        opacity: 0;
      }
      to {
        transform: translateX(0) translateZ(0);
        opacity: 1;
      }
    }
    
    @keyframes themeToggleRotate {
      0% { transform: rotateY(0deg) scale(1); }
      50% { transform: rotateY(180deg) scale(1.2); }
      100% { transform: rotateY(360deg) scale(1); }
    }
    
    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
    
    @keyframes iconFloat {
      0%, 100% { transform: translateZ(20px) translateY(0px); }
      50% { transform: translateZ(25px) translateY(-5px); }
    }
    
    @keyframes counterComplete {
      0% { transform: scale(1); }
      50% { transform: scale(1.1); text-shadow: 0 0 20px currentColor; }
      100% { transform: scale(1); text-shadow: none; }
    }
    
    @keyframes searchFocus {
      0% { transform: scale(1); box-shadow: none; }
      50% { transform: scale(1.05); box-shadow: 0 0 30px rgba(59, 130, 246, 0.5); }
      100% { transform: scale(1); box-shadow: 0 0 30px rgba(59, 130, 246, 0.3); }
    }
    
    @keyframes refreshSpin {
      0% { transform: rotateY(0deg); }
      50% { transform: rotateY(180deg) scale(0.95); }
      100% { transform: rotateY(360deg); }
    }
    
    .animate-on-scroll {
      opacity: 0;
      transform: translateY(30px) translateZ(-20px);
    }
    
    .animate-in {
      opacity: 1;
      transform: translateY(0) translateZ(0);
    }
    
    .toast-close {
      background: none;
      border: none;
      color: currentColor;
      font-size: 18px;
      cursor: pointer;
      padding: 0 4px;
      opacity: 0.7;
      transition: opacity 0.2s ease;
    }
    
    .toast-close:hover {
      opacity: 1;
    }
  `;
  
  document.head.appendChild(style);
}

// ================================
// PERFORMANCE MONITORING
// ================================

function initializePerformanceMonitoring() {
  // Monitor FPS
  let lastTime = performance.now();
  let frameCount = 0;
  
  function measureFPS() {
    frameCount++;
    const currentTime = performance.now();
    
    if (currentTime - lastTime >= 1000) {
      const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
      
      if (fps < 30) {
        console.warn('Low FPS detected:', fps);
        // Reduce animations if needed
        if (fps < 20) {
          app.animations.isReducedMotion = true;
        }
      }
      
      frameCount = 0;
      lastTime = currentTime;
    }
    
    requestAnimationFrame(measureFPS);
  }
  
  measureFPS();
}

// ================================
// INITIALIZATION
// ================================

// Add animations to DOM
document.addEventListener('DOMContentLoaded', () => {
  addEnhancedAnimations();
  initializePerformanceMonitoring();
});

// Initialize search functionality
function initializeSearch() {
  const searchInput = document.querySelector('.search-input');
  
  if (searchInput) {
    let searchTimeout;
    
    searchInput.addEventListener('input', function(e) {
      const query = e.target.value.toLowerCase();
      
      clearTimeout(searchTimeout);
      
      if (query.length > 2) {
        searchTimeout = setTimeout(() => {
          showNotification(`🔍 Searching for "${query}"...`, 'info');
          performSearch(query);
        }, 300);
      }
    });
    
    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        const query = e.target.value;
        if (query.trim()) {
          showNotification(`✅ Search completed for "${query}"`, 'success');
          performSearch(query);
        }
      }
    });
  }
}

function performSearch(query) {
  // Simulate search with visual feedback
  const searchContainer = document.querySelector('.search-container');
  searchContainer.style.animation = 'searchPulse 0.8s ease';
  
  setTimeout(() => {
    searchContainer.style.animation = '';
  }, 800);
}

// Initialize notifications
function initializeNotifications() {
  const notificationBtn = document.querySelector('.notification-btn');
  
  if (notificationBtn) {
    notificationBtn.addEventListener('click', function() {
      this.style.animation = 'bounce 0.6s ease';
      showNotificationCenter();
      
      setTimeout(() => {
        this.style.animation = '';
      }, 600);
    });
  }
  
  initializeQuickActions();
}

function showNotificationCenter() {
  showNotification('🔔 Notification center opened', 'info');
}

// Initialize quick actions
function initializeQuickActions() {
  const actionBtns = document.querySelectorAll('.action-btn');
  
  actionBtns.forEach((btn, index) => {
    btn.addEventListener('click', function() {
      const action = this.querySelector('span').textContent;
      handleQuickAction(action);
    });
    
    // Stagger entrance animations
    setTimeout(() => {
      btn.style.animation = `slideInUp 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards`;
    }, index * 150);
  });
}

function handleQuickAction(action) {
  const actions = {
    'Add User': () => {
      showNotification('👤 User creation form opened', 'info');
    },
    'Export Data': () => {
      showNotification('📊 Data export started...', 'info');
      setTimeout(() => {
        showNotification('✅ Data exported successfully!', 'success');
      }, 2000);
    },
    'Settings': () => {
      showNotification('⚙️ Opening settings...', 'info');
    },
    'Help': () => {
      showNotification('❓ Help center opened', 'info');
    }
  };
  
  if (actions[action]) {
    actions[action]();
  }
}

// Update chart theme
function updateChartsTheme() {
  const isDark = app.theme === 'dark';
  const textColor = isDark ? '#cbd5e1' : '#64748b';
  const gridColor = isDark ? 'rgba(203, 213, 225, 0.1)' : 'rgba(100, 116, 139, 0.1)';
  
  if (app.charts.revenue) {
    app.charts.revenue.options.scales.x.ticks.color = textColor;
    app.charts.revenue.options.scales.y.ticks.color = textColor;
    app.charts.revenue.options.scales.y.grid.color = gridColor;
    app.charts.revenue.update('none');
  }
  
  if (app.charts.traffic) {
    app.charts.traffic.options.plugins.legend.labels.color = textColor;
    app.charts.traffic.update('none');
  }
}

// Update chart data for real-time simulation
function updateChartData() {
  if (app.charts.revenue) {
    const newData = Array.from({ length: 7 }, () => 
      Math.floor(Math.random() * 25000) + 10000
    );
    
    app.charts.revenue.data.datasets[0].data = newData;
    app.charts.revenue.update('active');
  }
}

// Real-time data simulation
setInterval(() => {
  if (Math.random() > 0.8) {
    updateChartData();
    
    if (Math.random() > 0.5) {
      const messages = [
        '📈 Revenue updated',
        '👥 New user registered',
        '🛒 Order completed',
        '📊 Analytics refreshed'
      ];
      
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      showNotification(randomMessage, 'info', 3000);
    }
  }
}, 15000);

// PWA Support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js')
      .then(function(registration) {
        console.log('ServiceWorker registration successful');
        showNotification('🚀 App is ready for offline use!', 'success');
      })
      .catch(function(err) {
        console.log('ServiceWorker registration failed: ', err);
      });
  });
}