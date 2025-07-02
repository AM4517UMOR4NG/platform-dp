// ================================
// GLOBAL VARIABLES & CONSTANTS
// ================================

const app = {
  theme: localStorage.getItem('theme') || 'light',
  charts: {},
  counters: {},
  notifications: []
};

// ================================
// INITIALIZATION
// ================================

document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
});

function initializeApp() {
  // Show loading screen
  showLoadingScreen();
  
  // Initialize components
  setTimeout(() => {
    initializeTheme();
    initializeSidebar();
    initializeCharts();
    initializeCounters();
    initializeSearch();
    initializeNotifications();
    hideLoadingScreen();
    
    // Show welcome notification
    showNotification('Welcome to Analytics Pro!', 'success');
  }, 1500);
}

// ================================
// LOADING SCREEN
// ================================

function showLoadingScreen() {
  const loadingScreen = document.getElementById('loading-screen');
  loadingScreen.style.display = 'flex';
}

function hideLoadingScreen() {
  const loadingScreen = document.getElementById('loading-screen');
  loadingScreen.classList.add('hidden');
  
  setTimeout(() => {
    loadingScreen.style.display = 'none';
  }, 500);
}

// ================================
// THEME MANAGEMENT
// ================================

function initializeTheme() {
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;
  
  // Set initial theme
  body.setAttribute('data-theme', app.theme);
  
  // Theme toggle event
  themeToggle.addEventListener('click', function() {
    app.theme = app.theme === 'light' ? 'dark' : 'light';
    body.setAttribute('data-theme', app.theme);
    localStorage.setItem('theme', app.theme);
    
    // Update charts with new theme
    updateChartsTheme();
    
    // Show notification
    const themeName = app.theme === 'light' ? 'Light' : 'Dark';
    showNotification(`Switched to ${themeName} mode`, 'info');
  });
}

// ================================
// SIDEBAR MANAGEMENT
// ================================

function initializeSidebar() {
  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('sidebar');
  const navLinks = document.querySelectorAll('.nav-link');
  
  // Sidebar toggle for mobile
  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', function() {
      sidebar.classList.toggle('open');
    });
  }
  
  // Navigation links
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Remove active class from all links
      navLinks.forEach(l => l.classList.remove('active'));
      
      // Add active class to clicked link
      this.classList.add('active');
      
      // Update page title
      const section = this.getAttribute('data-section');
      updatePageTitle(section);
      
      // Show notification
      showNotification(`Navigated to ${section}`, 'info');
    });
  });
}

function updatePageTitle(section) {
  const pageTitle = document.querySelector('.page-title');
  const pageSubtitle = document.querySelector('.page-subtitle');
  
  const titles = {
    dashboard: {
      title: 'Dashboard Overview',
      subtitle: "Welcome back! Here's what's happening."
    },
    analytics: {
      title: 'Analytics Center',
      subtitle: 'Deep dive into your data insights.'
    },
    reports: {
      title: 'Reports & Insights',
      subtitle: 'Generate comprehensive reports.'
    },
    users: {
      title: 'User Management',
      subtitle: 'Manage your application users.'
    },
    settings: {
      title: 'Settings & Configuration',
      subtitle: 'Customize your dashboard experience.'
    }
  };
  
  if (titles[section]) {
    pageTitle.textContent = titles[section].title;
    pageSubtitle.textContent = titles[section].subtitle;
  }
}

// ================================
// CHART INITIALIZATION
// ================================

function initializeCharts() {
  initializeRevenueChart();
  initializeTrafficChart();
}

function initializeRevenueChart() {
  const ctx = document.getElementById('revenueChart').getContext('2d');
  
  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, 'rgba(59, 130, 246, 0.3)');
  gradient.addColorStop(1, 'rgba(59, 130, 246, 0.05)');
  
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
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(30, 41, 59, 0.9)',
          titleColor: '#f1f5f9',
          bodyColor: '#cbd5e1',
          borderColor: '#3b82f6',
          borderWidth: 1,
          cornerRadius: 8,
          displayColors: false,
          callbacks: {
            label: function(context) {
              return `Revenue: $${context.parsed.y.toLocaleString()}`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: '#64748b'
          }
        },
        y: {
          grid: {
            color: 'rgba(100, 116, 139, 0.1)'
          },
          ticks: {
            color: '#64748b',
            callback: function(value) {
              return '$' + value.toLocaleString();
            }
          }
        }
      },
      interaction: {
        intersect: false,
        mode: 'index'
      }
    }
  });
}

function initializeTrafficChart() {
  const ctx = document.getElementById('trafficChart').getContext('2d');
  
  app.charts.traffic = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Direct', 'Social Media', 'Email', 'Search', 'Referrals'],
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
        hoverBorderWidth: 4,
        hoverBorderColor: '#ffffff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '60%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 20,
            usePointStyle: true,
            pointStyle: 'circle',
            color: '#64748b',
            font: {
              size: 12
            }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(30, 41, 59, 0.9)',
          titleColor: '#f1f5f9',
          bodyColor: '#cbd5e1',
          borderColor: '#3b82f6',
          borderWidth: 1,
          cornerRadius: 8,
          callbacks: {
            label: function(context) {
              return `${context.label}: ${context.parsed}%`;
            }
          }
        }
      }
    }
  });
}

function updateChartsTheme() {
  const isDark = app.theme === 'dark';
  const textColor = isDark ? '#cbd5e1' : '#64748b';
  const gridColor = isDark ? 'rgba(203, 213, 225, 0.1)' : 'rgba(100, 116, 139, 0.1)';
  
  // Update revenue chart
  if (app.charts.revenue) {
    app.charts.revenue.options.scales.x.ticks.color = textColor;
    app.charts.revenue.options.scales.y.ticks.color = textColor;
    app.charts.revenue.options.scales.y.grid.color = gridColor;
    app.charts.revenue.options.plugins.legend.labels.color = textColor;
    app.charts.revenue.update();
  }
  
  // Update traffic chart
  if (app.charts.traffic) {
    app.charts.traffic.options.plugins.legend.labels.color = textColor;
    app.charts.traffic.update();
  }
}

// ================================
// COUNTER ANIMATIONS
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
  const increment = target / 100;
  const duration = 2000;
  const stepTime = duration / 100;
  
  const timer = setInterval(() => {
    current += increment;
    
    if (current >= target) {
      current = target;
      clearInterval(timer);
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

// ================================
// SEARCH FUNCTIONALITY
// ================================

function initializeSearch() {
  const searchInput = document.querySelector('.search-input');
  
  if (searchInput) {
    searchInput.addEventListener('input', function(e) {
      const query = e.target.value.toLowerCase();
      
      if (query.length > 2) {
        // Simulate search
        setTimeout(() => {
          showNotification(`Searching for "${query}"...`, 'info');
        }, 300);
      }
    });
    
    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        const query = e.target.value;
        if (query.trim()) {
          showNotification(`Search completed for "${query}"`, 'success');
          // Here you would typically perform the actual search
        }
      }
    });
  }
}

// ================================
// NOTIFICATION SYSTEM
// ================================

function initializeNotifications() {
  const notificationBtn = document.querySelector('.notification-btn');
  
  if (notificationBtn) {
    notificationBtn.addEventListener('click', function() {
      showNotificationCenter();
    });
  }
  
  // Initialize quick actions
  initializeQuickActions();
}

function showNotification(message, type = 'info', duration = 4000) {
  const toastContainer = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const icon = getNotificationIcon(type);
  toast.innerHTML = `
    <i class="ph ${icon}"></i>
    <span>${message}</span>
  `;
  
  toastContainer.appendChild(toast);
  
  // Auto remove
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease forwards';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, duration);
  
  // Manual close on click
  toast.addEventListener('click', () => {
    toast.style.animation = 'slideOut 0.3s ease forwards';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  });
}

function getNotificationIcon(type) {
  const icons = {
    success: 'ph-check-circle',
    error: 'ph-x-circle',
    warning: 'ph-warning-circle',
    info: 'ph-info'
  };
  return icons[type] || icons.info;
}

function showNotificationCenter() {
  showNotification('Notification center opened', 'info');
  // Here you would typically show a dropdown or modal with all notifications
}

// ================================
// QUICK ACTIONS
// ================================

function initializeQuickActions() {
  const actionBtns = document.querySelectorAll('.action-btn');
  
  actionBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const action = this.querySelector('span').textContent;
      handleQuickAction(action);
    });
  });
}

function handleQuickAction(action) {
  const actions = {
    'Add User': () => {
      showNotification('User creation form opened', 'info');
      // Here you would open a modal or navigate to add user page
    },
    'Export Data': () => {
      showNotification('Data export started...', 'info');
      // Simulate export process
      setTimeout(() => {
        showNotification('Data exported successfully!', 'success');
      }, 2000);
    },
    'Settings': () => {
      showNotification('Opening settings...', 'info');
      // Here you would navigate to settings page
    },
    'Help': () => {
      showNotification('Help center opened', 'info');
      // Here you would show help documentation
    }
  };
  
  if (actions[action]) {
    actions[action]();
  }
}

// ================================
// UTILITY FUNCTIONS
// ================================

// Debounce function for performance optimization
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Format number with commas
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Generate random data for demo purposes
function generateRandomData(length, min, max) {
  return Array.from({ length }, () => 
    Math.floor(Math.random() * (max - min + 1)) + min
  );
}

// Update chart data (for real-time simulation)
function updateChartData() {
  if (app.charts.revenue) {
    const newData = generateRandomData(7, 10000, 35000);
    app.charts.revenue.data.datasets[0].data = newData;
    app.charts.revenue.update('none');
  }
}

// ================================
// REAL-TIME SIMULATION
// ================================

// Simulate real-time data updates
setInterval(() => {
  // Randomly update some statistics
  if (Math.random() > 0.7) {
    const statValues = document.querySelectorAll('.stat-value');
    const randomStat = statValues[Math.floor(Math.random() * statValues.length)];
    
    if (randomStat) {
      const currentValue = parseInt(randomStat.getAttribute('data-count'));
      const newValue = currentValue + Math.floor(Math.random() * 100) - 50;
      
      if (newValue > 0) {
        randomStat.setAttribute('data-count', newValue);
        animateCounter(randomStat, newValue, 
          randomStat.textContent.includes('$'),
          randomStat.textContent.includes('%')
        );
      }
    }
  }
}, 10000); // Update every 10 seconds

// ================================
// PWA SUPPORT
// ================================

// Service Worker registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js')
      .then(function(registration) {
        console.log('ServiceWorker registration successful');
        showNotification('App is ready for offline use!', 'success');
      })
      .catch(function(err) {
        console.log('ServiceWorker registration failed: ', err);
      });
  });
}

// Add to homescreen prompt
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  
  // Show install notification
  setTimeout(() => {
    showInstallPrompt();
  }, 30000); // Show after 30 seconds
});

function showInstallPrompt() {
  if (deferredPrompt) {
    showNotification('Install this app for better experience!', 'info', 8000);
  }
}

// ================================
// KEYBOARD SHORTCUTS
// ================================

document.addEventListener('keydown', function(e) {
  // Ctrl/Cmd + K for search
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
      searchInput.focus();
      showNotification('Search activated', 'info');
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
    toasts.forEach(toast => toast.click());
  }
});

// ================================
// PERFORMANCE MONITORING
// ================================

// Monitor page load performance
window.addEventListener('load', function() {
  const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
  console.log(`Page loaded in ${loadTime}ms`);
  
  if (loadTime > 3000) {
    showNotification('Slow connection detected', 'warning');
  }
});

// Memory usage monitoring (if supported)
if (performance.memory) {
  setInterval(() => {
    const memoryInfo = performance.memory;
    const usedMB = Math.round(memoryInfo.usedJSHeapSize / 1048576);
    
    if (usedMB > 100) {
      console.warn(`High memory usage: ${usedMB}MB`);
    }
  }, 60000); // Check every minute
}

// ================================
// EXPORT FOR TESTING
// ================================

// Export functions for testing purposes
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    app,
    showNotification,
    formatNumber,
    generateRandomData
  };
}