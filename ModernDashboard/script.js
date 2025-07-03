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
  initializeCustomPage();
  initializeElegant3DTilt();
  initializeWeatherWidget();
  initializeDashboardParallax();
  initializeAnalyticsCharts();
  initializeReportsTable();
  initializeUsersList();
  initializeSettingsSwitch();
  initializeCustomPageLocalStorage();
  initializeSectionFadeIn();
  advancedWeatherWidget();
  advancedLiveStats();
  advancedProgressBar();
  advancedNewsFeed();
  advancedParallaxHero();
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
      
      // Hide all content sections
      document.querySelectorAll('.content').forEach(sec => sec.style.display = 'none');
      
      // Show selected section
      const section = this.getAttribute('data-section');
      const sectionEl = document.getElementById(section);
      if(sectionEl) sectionEl.style.display = '';
      
      // Update page title
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

// ================================
// CUSTOM PAGE CRUD & 3D TILT EFFECT
// ================================

function initializeCustomPage() {
  const form = document.getElementById('customForm');
  const input = document.getElementById('customInput');
  const list = document.getElementById('customList');
  const info = document.getElementById('customInfo');
  let items = [];
  
  function render() {
    list.innerHTML = '';
    if (items.length === 0) {
      info.textContent = 'Belum ada catatan.';
      return;
    }
    info.textContent = '';
    items.forEach((item, idx) => {
      const li = document.createElement('li');
      li.className = 'custom-item';
      li.innerHTML = `
        <span class="item-text">${item}</span>
        <button class="edit-btn action-btn" title="Edit"><i class="ph ph-pencil"></i></button>
        <button class="delete-btn action-btn" title="Hapus"><i class="ph ph-trash"></i></button>
      `;
      // Edit
      li.querySelector('.edit-btn').onclick = () => {
        const newValue = prompt('Edit catatan:', item);
        if (newValue && newValue.trim()) {
          items[idx] = newValue.trim();
          render();
        }
      };
      // Delete
      li.querySelector('.delete-btn').onclick = () => {
        if (confirm('Hapus catatan ini?')) {
          items.splice(idx, 1);
          render();
        }
      };
      list.appendChild(li);
    });
  }
  if (form) {
    form.onsubmit = function(e) {
      e.preventDefault();
      if (input.value.trim()) {
        items.push(input.value.trim());
        input.value = '';
        render();
      }
    };
  }
  render();
}

function initializeElegant3DTilt() {
  // Elemen yang ingin diberi efek tilt
  const tiltSelectors = ['.stat-card', '.chart-card', '.activity-card', '.quick-actions-card', '.action-btn'];
  tiltSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(card => {
      card.addEventListener('mousemove', function(e) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * 8;
        const rotateY = ((x - centerX) / centerX) * -8;
        card.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.04)`;
        card.style.boxShadow = `0 ${8 + Math.abs(rotateX)}px ${32 + Math.abs(rotateY)}px 0 rgba(59,130,246,0.18), 0 2px 8px 0 rgba(0,0,0,0.08)`;
      });
      card.addEventListener('mouseleave', function() {
        card.style.transform = '';
        card.style.boxShadow = '';
      });
    });
  });
}

// ================================
// DASHBOARD WIDGET CUACA & PARALLAX
// ================================
function initializeWeatherWidget() {
  const tempEl = document.getElementById('weatherTemp');
  const descEl = document.getElementById('weatherDesc');
  const locEl = document.getElementById('weatherLoc');
  // Use Open-Meteo API (no key) for Jakarta
  fetch('https://api.open-meteo.com/v1/forecast?latitude=-6.2&longitude=106.8&current_weather=true')
    .then(res => res.json())
    .then(data => {
      if (data.current_weather) {
        tempEl.textContent = data.current_weather.temperature + '°C';
        locEl.textContent = 'Jakarta';
        descEl.textContent = weatherCodeToDesc(data.current_weather.weathercode);
        document.querySelector('.widget-weather .stat-icon i').className = weatherCodeToIcon(data.current_weather.weathercode);
      } else {
        fallbackWeather();
      }
    })
    .catch(fallbackWeather);
  function fallbackWeather() {
    tempEl.textContent = '28°C';
    locEl.textContent = 'Jakarta';
    descEl.textContent = 'Cerah';
    document.querySelector('.widget-weather .stat-icon i').className = 'ph ph-sun';
  }
  function weatherCodeToDesc(code) {
    const map = {0:'Cerah', 1:'Cerah', 2:'Sedikit Berawan', 3:'Berawan', 45:'Berkabut', 48:'Berkabut', 51:'Gerimis', 61:'Hujan', 71:'Salju', 80:'Hujan Lokal', 95:'Badai Petir'};
    return map[code] || 'Cerah';
  }
  function weatherCodeToIcon(code) {
    if ([0,1].includes(code)) return 'ph ph-sun';
    if ([2,3].includes(code)) return 'ph ph-cloud-sun';
    if ([45,48].includes(code)) return 'ph ph-cloud-fog';
    if ([51,61,80].includes(code)) return 'ph ph-cloud-rain';
    if ([71].includes(code)) return 'ph ph-cloud-snow';
    if ([95].includes(code)) return 'ph ph-cloud-lightning';
    return 'ph ph-sun';
  }
}

function initializeDashboardParallax() {
  const widgets = document.querySelectorAll('.stat-card');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    widgets.forEach((el, i) => {
      el.style.transform += ` translateY(${scrollY * 0.05 * (i+1)}px)`;
    });
  });
}

// ================================
// ANALYTICS CHARTS INTERAKTIF
// ================================
function initializeAnalyticsCharts() {
  if (window.Chart) {
    // Monthly Visitors
    const ctx1 = document.getElementById('visitorsChart');
    if (ctx1) {
      new Chart(ctx1, {
        type: 'bar',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
          datasets: [{
            label: 'Visitors',
            data: [1200, 1900, 1500, 2500, 2200, 3000, 2800],
            backgroundColor: '#3b82f6',
            borderRadius: 8
          }]
        },
        options: {responsive:true, plugins:{legend:{display:false}}}
      });
    }
    // Device Usage
    const ctx2 = document.getElementById('deviceChart');
    if (ctx2) {
      new Chart(ctx2, {
        type: 'pie',
        data: {
          labels: ['Mobile', 'Desktop', 'Tablet'],
          datasets: [{
            data: [60, 30, 10],
            backgroundColor: ['#3b82f6','#10b981','#f59e0b']
          }]
        },
        options: {responsive:true, plugins:{legend:{position:'bottom'}}}
      });
    }
  }
}

// ================================
// REPORTS TABLE DUMMY & SORT/SEARCH
// ================================
function initializeReportsTable() {
  const data = [
    {name:'Laporan Penjualan',date:'2024-05-01',status:'Selesai'},
    {name:'Laporan User',date:'2024-05-02',status:'Draft'},
    {name:'Laporan Keuangan',date:'2024-05-03',status:'Selesai'},
    {name:'Laporan Inventaris',date:'2024-05-04',status:'Selesai'},
    {name:'Laporan Aktivitas',date:'2024-05-05',status:'Draft'}
  ];
  const tbody = document.getElementById('reportsTableBody');
  const search = document.getElementById('reportSearch');
  function renderTable(filter='') {
    tbody.innerHTML = '';
    data.filter(row => row.name.toLowerCase().includes(filter.toLowerCase())).forEach(row => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${row.name}</td><td>${row.date}</td><td>${row.status}</td><td><button class='action-btn'><i class='ph ph-download'></i></button></td>`;
      tbody.appendChild(tr);
    });
  }
  if (search) {
    search.oninput = e => renderTable(e.target.value);
  }
  renderTable();
}

// ================================
// USERS LIST DUMMY & SEARCH
// ================================
function initializeUsersList() {
  const users = [
    {name:'Alogo Situmorang',role:'Admin',avatar:'https://randomuser.me/api/portraits/men/1.jpg'},
    {name:'Jane Doe',role:'User',avatar:'https://randomuser.me/api/portraits/women/2.jpg'},
    {name:'John Smith',role:'Moderator',avatar:'https://randomuser.me/api/portraits/men/3.jpg'},
    {name:'Lisa Black',role:'User',avatar:'https://randomuser.me/api/portraits/women/4.jpg'}
  ];
  const list = document.getElementById('usersList');
  const search = document.getElementById('userSearch');
  function renderUsers(filter='') {
    list.innerHTML = '';
    users.filter(u => u.name.toLowerCase().includes(filter.toLowerCase())).forEach(u => {
      const card = document.createElement('div');
      card.className = 'user-card stat-card';
      card.innerHTML = `<img src='${u.avatar}' class='user-avatar' style='width:48px;height:48px;border-radius:50%;margin-right:16px;'><div><div style='font-weight:600'>${u.name}</div><div style='font-size:13px;color:var(--text-muted)'>${u.role}</div></div>`;
      list.appendChild(card);
    });
  }
  if (search) {
    search.oninput = e => renderUsers(e.target.value);
  }
  renderUsers();
}

// ================================
// SETTINGS SWITCH
// ================================
function initializeSettingsSwitch() {
  const darkSwitch = document.getElementById('darkModeSwitch');
  const notifSwitch = document.getElementById('notifSwitch');
  const animSwitch = document.getElementById('animSwitch');
  if (darkSwitch) {
    darkSwitch.checked = document.body.getAttribute('data-theme') === 'dark';
    darkSwitch.onchange = () => {
      document.getElementById('themeToggle').click();
    };
  }
  if (notifSwitch) {
    notifSwitch.onchange = () => showNotification('Notifikasi ' + (notifSwitch.checked?'diaktifkan':'dimatikan'), 'info');
  }
  if (animSwitch) {
    animSwitch.onchange = () => {
      document.body.classList.toggle('no-anim', !animSwitch.checked);
      showNotification('Animasi ' + (animSwitch.checked?'diaktifkan':'dimatikan'), 'info');
    };
  }
}

// ================================
// CREATE PAGE: LOCALSTORAGE & DRAG
// ================================
function initializeCustomPageLocalStorage() {
  const form = document.getElementById('customForm');
  const input = document.getElementById('customInput');
  const list = document.getElementById('customList');
  const info = document.getElementById('customInfo');
  let items = JSON.parse(localStorage.getItem('customItems')||'[]');
  function save() { localStorage.setItem('customItems', JSON.stringify(items)); }
  function render() {
    list.innerHTML = '';
    if (items.length === 0) {
      info.textContent = 'Belum ada catatan.';
      return;
    }
    info.textContent = '';
    items.forEach((item, idx) => {
      const li = document.createElement('li');
      li.className = 'custom-item';
      li.draggable = true;
      li.innerHTML = `
        <span class="item-text">${item}</span>
        <button class="edit-btn action-btn" title="Edit"><i class="ph ph-pencil"></i></button>
        <button class="delete-btn action-btn" title="Hapus"><i class="ph ph-trash"></i></button>
      `;
      li.querySelector('.edit-btn').onclick = () => {
        const newValue = prompt('Edit catatan:', item);
        if (newValue && newValue.trim()) {
          items[idx] = newValue.trim();
          save();
          render();
        }
      };
      li.querySelector('.delete-btn').onclick = () => {
        if (confirm('Hapus catatan ini?')) {
          items.splice(idx, 1);
          save();
          render();
        }
      };
      // Drag & drop
      li.ondragstart = e => { e.dataTransfer.setData('idx', idx); };
      li.ondragover = e => { e.preventDefault(); li.style.background='#e0e7ef'; };
      li.ondragleave = e => { li.style.background=''; };
      li.ondrop = e => {
        e.preventDefault();
        const from = +e.dataTransfer.getData('idx');
        const to = idx;
        if (from!==to) {
          const moved = items.splice(from,1)[0];
          items.splice(to,0,moved);
          save();
          render();
        }
      };
      li.onmouseup = () => { li.style.background=''; };
      list.appendChild(li);
    });
  }
  if (form) {
    form.onsubmit = function(e) {
      e.preventDefault();
      if (input.value.trim()) {
        items.push(input.value.trim());
        input.value = '';
        save();
        render();
      }
    };
  }
  render();
}

// ================================
// GLOBAL ANIMASI MASUK
// ================================
function initializeSectionFadeIn() {
  document.querySelectorAll('.fade-in').forEach(el => {
    el.style.opacity = 0;
    el.style.transform = 'translateY(30px)';
    setTimeout(() => {
      el.style.transition = 'all 0.7s cubic-bezier(.22,1,.36,1)';
      el.style.opacity = 1;
      el.style.transform = 'none';
    }, 300);
  });
}

// ================================
// ADVANCED DASHBOARD INTERACTIVITY
// ================================
function advancedWeatherWidget() {
  const tempEl = document.getElementById('weatherTemp');
  const descEl = document.getElementById('weatherDesc');
  const locEl = document.getElementById('weatherLoc');
  // Use Open-Meteo API (no key) for Jakarta
  fetch('https://api.open-meteo.com/v1/forecast?latitude=-6.2&longitude=106.8&current_weather=true')
    .then(res => res.json())
    .then(data => {
      if (data.current_weather) {
        tempEl.textContent = data.current_weather.temperature + '°C';
        locEl.textContent = 'Jakarta';
        descEl.textContent = weatherCodeToDesc(data.current_weather.weathercode);
        document.querySelector('.widget-weather .stat-icon i').className = weatherCodeToIcon(data.current_weather.weathercode);
      } else {
        fallbackWeather();
      }
    })
    .catch(fallbackWeather);
  function fallbackWeather() {
    tempEl.textContent = '28°C';
    locEl.textContent = 'Jakarta';
    descEl.textContent = 'Cerah';
    document.querySelector('.widget-weather .stat-icon i').className = 'ph ph-sun';
  }
  function weatherCodeToDesc(code) {
    const map = {0:'Cerah', 1:'Cerah', 2:'Sedikit Berawan', 3:'Berawan', 45:'Berkabut', 48:'Berkabut', 51:'Gerimis', 61:'Hujan', 71:'Salju', 80:'Hujan Lokal', 95:'Badai Petir'};
    return map[code] || 'Cerah';
  }
  function weatherCodeToIcon(code) {
    if ([0,1].includes(code)) return 'ph ph-sun';
    if ([2,3].includes(code)) return 'ph ph-cloud-sun';
    if ([45,48].includes(code)) return 'ph ph-cloud-fog';
    if ([51,61,80].includes(code)) return 'ph ph-cloud-rain';
    if ([71].includes(code)) return 'ph ph-cloud-snow';
    if ([95].includes(code)) return 'ph ph-cloud-lightning';
    return 'ph ph-sun';
  }
}

function advancedLiveStats() {
  const userEl = document.getElementById('liveUserCount');
  const userChangeEl = document.getElementById('liveUserChange');
  const revEl = document.getElementById('liveRevenueCount');
  const revChangeEl = document.getElementById('liveRevenueChange');
  let users = 12000 + Math.floor(Math.random()*1000);
  let revenue = 50000 + Math.floor(Math.random()*5000);
  function update() {
    const newUsers = users + Math.floor(Math.random()*20-10);
    const newRevenue = revenue + Math.floor(Math.random()*200-100);
    const userDiff = newUsers-users;
    const revDiff = newRevenue-revenue;
    users = newUsers; revenue = newRevenue;
    animateNumber(userEl, users);
    animateNumber(revEl, revenue, true);
    userChangeEl.textContent = (userDiff>=0?'+':'')+userDiff;
    revChangeEl.textContent = (revDiff>=0?'+':'')+revDiff;
  }
  setInterval(update, 2000);
  update();
  function animateNumber(el, val, money) {
    let start = parseInt(el.textContent.replace(/\D/g,''))||0;
    let end = val;
    let step = (end-start)/20;
    let i=0;
    function tick() {
      i++;
      let v = Math.round(start+step*i);
      if ((step>0 && v>=end) || (step<0 && v<=end) || i>=20) v=end;
      el.textContent = money?'$'+v.toLocaleString():v.toLocaleString();
      if (v!==end) requestAnimationFrame(tick);
    }
    tick();
  }
}

function advancedProgressBar() {
  const bar = document.getElementById('goalProgressBar');
  const text = document.getElementById('goalProgressText');
  let percent = 0;
  function animateTo(target) {
    let start = percent;
    let step = (target-start)/30;
    let i=0;
    function tick() {
      i++;
      percent = Math.round(start+step*i);
      if ((step>0 && percent>=target) || (step<0 && percent<=target) || i>=30) percent=target;
      bar.style.width = percent+'%';
      text.textContent = percent+'%';
      if (percent!==target) requestAnimationFrame(tick);
    }
    tick();
  }
  setInterval(()=>animateTo(60+Math.floor(Math.random()*40)), 4000);
  animateTo(70);
}

function advancedNewsFeed() {
  const list = document.getElementById('newsList');
  // Use dummy news for demo
  const news = [
    {title:'Dashboard v2.0 Released!', url:'#'},
    {title:'Analytics: New Chart Types Added', url:'#'},
    {title:'User Management Improved', url:'#'},
    {title:'Dark Mode Now Default', url:'#'},
    {title:'Export to PDF/Excel Available', url:'#'}
  ];
  list.innerHTML = '';
  news.forEach(n => {
    const li = document.createElement('li');
    li.textContent = n.title;
    li.onclick = ()=>window.open(n.url,'_blank');
    list.appendChild(li);
  });
}

function advancedParallaxHero() {
  const hero = document.querySelector('.parallax-hero');
  if (!hero) return;
  hero.onmousemove = e => {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX-rect.left)/rect.width-0.5;
    const y = (e.clientY-rect.top)/rect.height-0.5;
    hero.querySelectorAll('h2, p').forEach(el => {
      el.style.transform = `rotateY(${x*10}deg) rotateX(${-y*10}deg) scale(1.04)`;
    });
  };
  hero.onmouseleave = () => {
    hero.querySelectorAll('h2, p').forEach(el => {
      el.style.transform = '';
    });
  };
}