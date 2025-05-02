// Función para animar contadores
function animateCounter(element, targetValue) {
  if (!element) return;
  
  const duration = 2000; // Duración de la animación en ms
  const frameRate = 60; // Frames por segundo
  const frameDuration = 1000 / frameRate;
  const totalFrames = duration / frameDuration;
  
  let startValue = 0;
  let currentFrame = 0;
  let decimal = targetValue % 1 !== 0;
  let decimalPlaces = decimal ? 1 : 0;
  
  // Determinar decimales si es un número con decimales
  if (decimal) {
    const targetStr = targetValue.toString();
    if (targetStr.includes('.')) {
      decimalPlaces = targetStr.split('.')[1].length;
    }
  }
  
  const counterAnimation = setInterval(() => {
    currentFrame++;
    const progress = currentFrame / totalFrames;
    const currentValue = startValue + (targetValue - startValue) * easeOutQuad(progress);
    
    element.textContent = currentValue.toFixed(decimalPlaces);
    
    if (progress >= 1) {
      clearInterval(counterAnimation);
      element.textContent = targetValue.toFixed(decimalPlaces);
    }
  }, frameDuration);
}

// Función de easing para animación suave
function easeOutQuad(t) {
  return t * (2 - t);
}

// Función que verifica si el documento está listo
function documentReady(fn) {
  if (document.readyState !== 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

// Inicializar las barras de progreso
function initProgressBars() {
  console.log('Inicializando barras de progreso...');
  const progressBars = document.querySelectorAll('.progress-bar');
  
  progressBars.forEach(bar => {
    const targetProgress = bar.getAttribute('data-progress');
    if (targetProgress) {
      bar.style.width = '0%';
      setTimeout(() => {
        bar.style.width = `${targetProgress}%`;
      }, 300);
    }
  });
}

// Inicializar KPIs con contadores animados
function initKPIs() {
  console.log('Inicializando KPIs...');
  const kpiValues = document.querySelectorAll('.kpi-value');
  
  kpiValues.forEach(kpi => {
    const targetValue = parseFloat(kpi.getAttribute('data-value'));
    if (!isNaN(targetValue)) {
      animateCounter(kpi, targetValue);
    }
  });
  
  // Inicializar barras de progreso
  initProgressBars();
}

// Inicializar las gráficas con Chart.js
function initCharts() {
  console.log('Inicializando gráficas...');
  
  // Verificar si Chart.js está disponible
  if (!window.Chart) {
    console.warn('Chart.js no está disponible');
    return;
  }
  
  // Gráfica 1: Inversión por tipo de proyecto
  initInvestmentChart();
  
  // Gráfica 2: Proyectos por zona
  initProjectsChart();
  
  // Gráfica 3: Tendencia de inversión
  initTrendChart();
}

// Inicializar la gráfica de inversión
function initInvestmentChart() {
  const ctx = document.getElementById('investmentChart');
  if (!ctx) {
    console.warn('Elemento investmentChart no encontrado');
    return;
  }
  
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Residencial', 'Comercial', 'Industrial', 'Infraestructura', 'Espacios Públicos'],
      datasets: [{
        data: [42, 28, 15, 8, 7],
        backgroundColor: [
          '#4CAF50', // Verde
          '#2196F3', // Azul
          '#FF9800', // Naranja
          '#9C27B0', // Púrpura
          '#607D8B'  // Gris azulado
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'right',
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.label}: ${context.raw}%`;
            }
          }
        }
      }
    }
  });
  
  // Intentar iniciar gráfica alternativa si existe
  const ctx1 = document.getElementById('investmentChart1');
  if (ctx1) {
    new Chart(ctx1, {
      type: 'pie',
      data: {
        labels: ['Residencial', 'Comercial', 'Industrial', 'Infraestructura', 'Espacios Públicos'],
        datasets: [{
          data: [42, 28, 15, 8, 7],
          backgroundColor: [
            '#4CAF50', // Verde
            '#2196F3', // Azul
            '#FF9800', // Naranja
            '#9C27B0', // Púrpura
            '#607D8B'  // Gris azulado
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'right',
          }
        }
      }
    });
  }
}

// Inicializar la gráfica de proyectos por zona
function initProjectsChart() {
  const ctx = document.getElementById('projectsChart');
  if (!ctx) {
    console.warn('Elemento projectsChart no encontrado');
    return;
  }
  
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Norte', 'Centro', 'Sur', 'Este', 'Oeste'],
      datasets: [{
        label: 'Número de Proyectos',
        data: [24, 18, 15, 12, 9],
        backgroundColor: '#2196F3'
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0
          }
        }
      }
    }
  });
  
  // Intentar iniciar gráfica alternativa si existe
  const ctx1 = document.getElementById('projectsChart1');
  if (ctx1) {
    new Chart(ctx1, {
      type: 'bar',
      data: {
        labels: ['Norte', 'Centro', 'Sur', 'Este', 'Oeste'],
        datasets: [{
          label: 'Número de Proyectos',
          data: [24, 18, 15, 12, 9],
          backgroundColor: '#2196F3'
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0
            }
          }
        }
      }
    });
  }
}

// Inicializar la gráfica de tendencia
function initTrendChart() {
  const ctx = document.getElementById('trendChart');
  if (!ctx) {
    console.warn('Elemento trendChart no encontrado');
    return;
  }
  
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['2020', '2021', '2022', '2023', '2024', '2025'],
      datasets: [
        {
          label: 'Zona Norte',
          data: [120, 190, 300, 510, 600, 750],
          borderColor: '#4CAF50',
          tension: 0.4,
          fill: false
        },
        {
          label: 'Zona Centro',
          data: [100, 150, 250, 450, 520, 650],
          borderColor: '#2196F3',
          tension: 0.4,
          fill: false
        },
        {
          label: 'Zona Sur',
          data: [90, 130, 200, 300, 450, 580],
          borderColor: '#FF9800',
          tension: 0.4,
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Millones de pesos (MXN)'
          }
        }
      }
    }
  });
  
  // Intentar iniciar gráfica alternativa si existe
  const ctx1 = document.getElementById('trendChart1');
  if (ctx1) {
    new Chart(ctx1, {
      type: 'line',
      data: {
        labels: ['2020', '2021', '2022', '2023', '2024', '2025'],
        datasets: [
          {
            label: 'Zona Norte',
            data: [120, 190, 300, 510, 600, 750],
            borderColor: '#4CAF50',
            tension: 0.4,
            fill: false
          },
          {
            label: 'Zona Centro',
            data: [100, 150, 250, 450, 520, 650],
            borderColor: '#2196F3',
            tension: 0.4,
            fill: false
          },
          {
            label: 'Zona Sur',
            data: [90, 130, 200, 300, 450, 580],
            borderColor: '#FF9800',
            tension: 0.4,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Millones de pesos (MXN)'
            }
          }
        }
      }
    });
  }
}

// Función para efectos de fade-in en secciones
function initFadeInSections() {
  console.log('Inicializando efectos de fade-in...');
  const fadeInElements = document.querySelectorAll('.fade-in-section');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });
  
  fadeInElements.forEach(element => {
    observer.observe(element);
  });
}

// Inicializar tooltips
function initTooltips() {
  console.log('Inicializando tooltips...');
  const tooltips = document.querySelectorAll('[data-tooltip]');
  
  tooltips.forEach(tooltip => {
    tooltip.addEventListener('mouseenter', showTooltip);
    tooltip.addEventListener('mouseleave', hideTooltip);
  });
}

// Mostrar tooltip
function showTooltip(event) {
  const tooltipText = event.target.getAttribute('data-tooltip');
  if (!tooltipText) return;
  
  const tooltipElement = document.createElement('div');
  tooltipElement.className = 'tooltip';
  tooltipElement.textContent = tooltipText;
  
  document.body.appendChild(tooltipElement);
  
  const rect = event.target.getBoundingClientRect();
  tooltipElement.style.left = rect.left + (rect.width / 2) - (tooltipElement.offsetWidth / 2) + 'px';
  tooltipElement.style.top = rect.top - tooltipElement.offsetHeight - 10 + 'px';
  
  event.target.tooltipElement = tooltipElement;
}

// Ocultar tooltip
function hideTooltip(event) {
  if (event.target.tooltipElement) {
    event.target.tooltipElement.remove();
    event.target.tooltipElement = null;
  }
}

// Inicializar filtros de tarjetas
function initCardFilters() {
  console.log('Inicializando filtros de tarjetas...');
  const filterButtons = document.querySelectorAll('.filter-button');
  const cards = document.querySelectorAll('.filterable-card');
  
  if (filterButtons.length === 0 || cards.length === 0) return;
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remover clase activa de todos los botones
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      const filter = button.getAttribute('data-filter');
      
      // Filtrar tarjetas
      cards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.8)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

// Inicializar tarjetas con efecto flip
function initFlipCards() {
  console.log('Inicializando tarjetas con efecto flip...');
  const flipCards = document.querySelectorAll('.flip-card');
  
  flipCards.forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
    });
  });
}

// Botón de volver arriba
function initScrollToTop() {
  console.log('Inicializando botón de volver arriba...');
  const scrollBtn = document.createElement('button');
  scrollBtn.id = 'scrollToTop';
  scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
  scrollBtn.style.display = 'none';
  document.body.appendChild(scrollBtn);
  
  window.addEventListener('scroll', () => {
    if (document.body.scrollTop > 500 || document.documentElement.scrollTop > 500) {
      scrollBtn.style.display = 'block';
    } else {
      scrollBtn.style.display = 'none';
    }
  });
  
  scrollBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// Mostrar notificación
function showNotification(message, type = 'info') {
  console.log(`Mostrando notificación: ${message} (${type})`);
  const container = document.querySelector('.notification-container');
  if (!container) {
    const newContainer = document.createElement('div');
    newContainer.className = 'notification-container';
    document.body.appendChild(newContainer);
    setTimeout(() => showNotification(message, type), 100);
    return;
  }
  
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = message;
  
  container.appendChild(notification);
  
  // Eliminar después de 3 segundos
  setTimeout(() => {
    notification.classList.add('fade-out');
    setTimeout(() => {
      if (container.contains(notification)) {
        container.removeChild(notification);
      }
    }, 500);
  }, 3000);
}

// Escuchar eventos de cambio de filtro de proyectos
document.addEventListener('projectFilterChanged', function(event) {
  const filterType = event.detail.filterType;
  console.log(`Actualizando estadísticas para tipo: ${filterType}`);
  
  // Actualizar estadísticas según el tipo seleccionado
  updateStatistics(filterType);
});

// Actualizar estadísticas según el tipo de proyecto
function updateStatistics(type) {
  // Actualizar KPIs
  updateKPIsByType(type);
  
  // Actualizar gráficas
  updateChartsByType(type);
}

// Actualizar KPIs según el tipo de proyecto
function updateKPIsByType(type) {
  // Datos de KPI por tipo de proyecto
  const kpiData = {
    'all': {
      'proyectos': 45,
      'inversion': 435.0,
      'empleos': 1250,
      'crecimiento': 8.5
    },
    'residential': {
      'proyectos': 28,
      'inversion': 185.5,
      'empleos': 620,
      'crecimiento': 12.3
    },
    'commercial': {
      'proyectos': 12,
      'inversion': 140.0,
      'empleos': 350,
      'crecimiento': 7.8
    },
    'industrial': {
      'proyectos': 5,
      'inversion': 109.5,
      'empleos': 280,
      'crecimiento': 5.2
    }
  };
  
  // Obtener datos del tipo seleccionado
  const data = kpiData[type] || kpiData['all'];
  
  // Actualizar valores de KPI
  const kpiElements = {
    'proyectos': document.querySelector('[data-kpi="proyectos"] .kpi-value'),
    'inversion': document.querySelector('[data-kpi="inversion"] .kpi-value'),
    'empleos': document.querySelector('[data-kpi="empleos"] .kpi-value'),
    'crecimiento': document.querySelector('[data-kpi="crecimiento"] .kpi-value')
  };
  
  // Actualizar cada KPI si el elemento existe
  Object.keys(kpiElements).forEach(key => {
    const element = kpiElements[key];
    if (element && data[key] !== undefined) {
      // Guardar el valor original como atributo de datos
      element.dataset.value = data[key];
      // Animar el contador
      animateCounter(element, data[key]);
    }
  });
}

// Actualizar gráficas según el tipo de proyecto
function updateChartsByType(type) {
  // Si Chart.js no está disponible, salir
  if (!window.Chart) {
    console.warn('Chart.js no disponible para actualizar gráficas');
    return;
  }
  
  // Obtener instancias de gráficas
  const charts = {
    investment: Chart.getChart('investmentChart'),
    projects: Chart.getChart('projectsChart'),
    trend: Chart.getChart('trendChart')
  };
  
  // Datos filtrados por tipo
  if (type === 'all') {
    // Restaurar datos originales para todas las gráficas
    if (charts.investment) {
      charts.investment.data.datasets[0].data = [35, 25, 40];
      charts.investment.update();
    }
    
    if (charts.projects) {
      charts.projects.data.datasets[0].data = [12, 8, 14, 10];
      charts.projects.update();
    }
    
    if (charts.trend) {
      charts.trend.data.datasets[0].data = [30, 40, 45, 50, 55, 60, 70];
      charts.trend.update();
    }
  } else {
    // Actualizar datos según el tipo seleccionado
    const chartData = {
      'residential': {
        investment: [55, 15, 30],
        projects: [18, 4, 6, 0],
        trend: [20, 25, 35, 38, 40, 42, 45]
      },
      'commercial': {
        investment: [20, 60, 20],
        projects: [5, 12, 3, 5],
        trend: [15, 18, 22, 25, 30, 40, 45]
      },
      'industrial': {
        investment: [10, 15, 75],
        projects: [2, 3, 12, 3],
        trend: [10, 15, 18, 25, 35, 38, 40]
      }
    };
    
    const data = chartData[type];
    if (data) {
      // Actualizar cada gráfica con los datos filtrados
      if (charts.investment && data.investment) {
        charts.investment.data.datasets[0].data = data.investment;
        charts.investment.update();
      }
      
      if (charts.projects && data.projects) {
        charts.projects.data.datasets[0].data = data.projects;
        charts.projects.update();
      }
      
      if (charts.trend && data.trend) {
        charts.trend.data.datasets[0].data = data.trend;
        charts.trend.update();
      }
    }
  }
}

// Función para inicializar partículas en el hero
function initParticles() {
  const container = document.querySelector('.particles');
  if (!container) return;
  const count = 30;
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    const size = Math.random() * 8 + 4;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    particle.style.animationDelay = `${Math.random() * 5}s`;
    container.appendChild(particle);
  }
}

// Iniciar todas las funcionalidades cuando el documento esté listo
documentReady(function() {
  console.log('DOM cargado. Inicializando todas las funcionalidades...');
  initParticles();
  // Inicializar todas las funcionalidades principales
  setupIntersectionObservers();
  initScrollToTop();
  initFadeInSections();
  initCardFilters();
  initFlipCards();
  initKPIs();
  initTooltips();
  
  // Verificar si existe el elemento mapa e iniciarlo
  if (document.getElementById('map')) {
    console.log('Elemento mapa encontrado, inicializando...');
    if (typeof initMap === 'function') {
      try {
        initMap();
      } catch (e) {
        console.error('Error al inicializar el mapa:', e);
      }
    } else {
      console.warn('La función initMap no está definida');
    }
  } else {
    console.warn('No se encontró el elemento mapa en la página');
  }
  
  // Inicializar las gráficas con un pequeño delay para asegurar que los canvas estén renderizados
  setTimeout(initCharts, 500);
  
  // Hacer accesible globalmente la función de notificación
  window.showNotification = showNotification;

  // Toggle modules extra
  const toggleBtn = document.getElementById('toggleModules');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const moduleCards = document.querySelectorAll('.modules-section .module-card');
      moduleCards.forEach((card, idx) => {
        if (idx > 2) card.classList.toggle('hidden');
      });
      const anyHidden = Array.from(moduleCards).some((card, idx) => idx > 2 && card.classList.contains('hidden'));
      toggleBtn.textContent = anyHidden ? 'Ver más' : 'Ver menos';
    });
  }

  // Theme toggle functionality
  const themeToggleBtn = document.getElementById('themeToggle');
  const rootEl = document.documentElement;
  const savedTheme = localStorage.getItem('theme') || 'light';
  rootEl.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
  themeToggleBtn.addEventListener('click', () => {
    const newTheme = rootEl.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    rootEl.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
  });
  function updateThemeIcon(theme) {
    const icon = themeToggleBtn.querySelector('i');
    if (!icon) return;
    icon.classList.toggle('fa-moon', theme === 'light');
    icon.classList.toggle('fa-sun', theme === 'dark');
  }
});

// Configurar observadores de intersección para elementos que requieren animación
function setupIntersectionObservers() {
  console.log('Configurando observadores de intersección...');
  
  // Cargar Chart.js si no está disponible
  if(!window.Chart) {
    console.log('Cargando Chart.js...');
    const chartScript = document.createElement('script');
    chartScript.src = 'https://cdn.jsdelivr.net/npm/chart.js';
    chartScript.onload = function() {
      console.log('Chart.js cargado correctamente');
      // Inicializar gráficas después de cargar Chart.js
      setTimeout(initCharts, 100);
    };
    chartScript.onerror = function() {
      console.error('Error al cargar Chart.js');
    };
    document.head.appendChild(chartScript);
  }
}

