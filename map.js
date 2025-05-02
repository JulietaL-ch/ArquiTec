// Variables globales para el mapa
let map;
let projectLayers = {
  'all': new ol.layer.Vector({
    source: new ol.source.Vector(),
    style: createProjectStyle
  }),
  'residential': new ol.layer.Vector({
    source: new ol.source.Vector(),
    style: createProjectStyle
  }),
  'commercial': new ol.layer.Vector({
    source: new ol.source.Vector(),
    style: createProjectStyle
  }),
  'industrial': new ol.layer.Vector({
    source: new ol.source.Vector(),
    style: createProjectStyle
  })
};

// Inicializar el mapa
function initMap() {
  // Verificar si el elemento del mapa existe
  const mapElement = document.getElementById('map');
  if (!mapElement) {
    console.error('Elemento del mapa no encontrado');
    return;
  }

  // Coordenadas de Hermosillo, Sonora
  const hermosillo = [-110.9580, 29.0747];

  // Crear el mapa con OpenLayers
  map = new ol.Map({
    target: 'map',
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      }),
      // Añadir capas de proyectos
      projectLayers.all,
      projectLayers.residential,
      projectLayers.commercial,
      projectLayers.industrial
    ],
    view: new ol.View({
      center: ol.proj.fromLonLat(hermosillo),
      zoom: 13
    })
  });

  // Hacer el mapa accesible globalmente
  window.map = map;

  // Cargar proyectos de ejemplo (esto se reemplazaría con datos reales)
  loadSampleProjects();

  // Filtrar inicialmente para mostrar todos los proyectos
  filterMapByType('all');

  // Configurar manejo de clics en el mapa
  map.on('click', function(evt) {
    const feature = map.forEachFeatureAtPixel(evt.pixel, function(feature) {
      return feature;
    });

    if (feature) {
      const projectData = feature.get('projectData');
      if (projectData) {
        showProjectDetails(projectData);
      }
    }
  });

  // Inicializar controles del mapa
  initMapControls();

  console.log('Mapa inicializado correctamente');
}

// Inicializar controles personalizados del mapa
function initMapControls() {
  // Botón de zoom in
  document.getElementById('zoomIn').addEventListener('click', function() {
    const view = map.getView();
    const zoom = view.getZoom();
    view.animate({
      zoom: zoom + 1,
      duration: 250
    });
  });

  // Botón de zoom out
  document.getElementById('zoomOut').addEventListener('click', function() {
    const view = map.getView();
    const zoom = view.getZoom();
    view.animate({
      zoom: zoom - 1,
      duration: 250
    });
  });

  // Botón de localización
  document.getElementById('locateMe').addEventListener('click', function() {
    if (navigator.geolocation) {
      // Mostrar notificación
      showNotification('Obteniendo tu ubicación...');
      
      navigator.geolocation.getCurrentPosition(
        function(position) {
          const coords = [position.coords.longitude, position.coords.latitude];
          const location = ol.proj.fromLonLat(coords);
          
          // Animar la vista
          map.getView().animate({
            center: location,
            zoom: 15,
            duration: 1000
          });
          
          // Mostrar un marcador de ubicación
          showUserLocation(coords);
          
          // Notificar éxito
          showNotification('Ubicación encontrada');
        },
        function(error) {
          console.error('Error al obtener la ubicación', error);
          showNotification('No se pudo obtener tu ubicación', 'error');
        }
      );
    } else {
      showNotification('Tu navegador no soporta geolocalización', 'error');
    }
  });

  // Botón para alternar filtros
  document.getElementById('toggleFilters').addEventListener('click', function() {
    const filters = document.querySelector('.map-filters');
    filters.style.display = filters.style.display === 'none' ? 'block' : 'none';
  });

  // Configurar botones de filtro
  const filterButtons = document.querySelectorAll('.project-filter button');
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Actualizar botón activo
      filterButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      
      // Aplicar filtro
      const filter = this.getAttribute('data-project-type');
      filterMapByType(filter);
    });
  });
}

// Mostrar la ubicación del usuario en el mapa
function showUserLocation(coords) {
  // Eliminar marcador anterior si existe
  const sources = map.getLayers().getArray();
  const userSource = sources.find(layer => layer.get('name') === 'userLocation');
  
  if (userSource) {
    map.removeLayer(userSource);
  }
  
  // Crear nuevo marcador
  const iconFeature = new ol.Feature({
    geometry: new ol.Point(ol.proj.fromLonLat(coords)),
    name: 'Mi ubicación'
  });
  
  const iconStyle = new ol.style.Style({
    image: new ol.style.Circle({
      radius: 8,
      fill: new ol.style.Fill({
        color: '#3366ff'
      }),
      stroke: new ol.style.Stroke({
        color: '#ffffff',
        width: 2
      })
    })
  });
  
  iconFeature.setStyle(iconStyle);
  
  const vectorSource = new ol.source.Vector({
    features: [iconFeature]
  });
  
  const vectorLayer = new ol.layer.Vector({
    source: vectorSource,
    name: 'userLocation'
  });
  
  map.addLayer(vectorLayer);
}

// Crear estilo para los marcadores de proyectos
function createProjectStyle(feature) {
  const projectType = feature.get('projectData')?.type || 'unknown';
  let color = '#3388ff'; // color por defecto

  switch (projectType) {
    case 'residential':
      color = '#4CAF50'; // verde
      break;
    case 'commercial':
      color = '#2196F3'; // azul
      break;
    case 'industrial':
      color = '#FF9800'; // naranja
      break;
  }

  return new ol.style.Style({
    image: new ol.style.Circle({
      radius: 8,
      fill: new ol.style.Fill({
        color: color
      }),
      stroke: new ol.style.Stroke({
        color: '#fff',
        width: 2
      })
    })
  });
}

// Cargar proyectos de ejemplo
function loadSampleProjects() {
  const sampleProjects = [
    {
      id: 1,
      name: 'Residencial Las Palmas',
      type: 'residential',
      description: 'Complejo habitacional con 50 unidades en zona norte de Hermosillo',
      location: [-110.9680, 29.0947], // Coordenadas [lon, lat] en Hermosillo
      budget: '$25,000,000',
      startDate: '2025-01-15',
      endDate: '2026-06-30',
      status: 'En progreso',
      image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80'
    },
    {
      id: 2,
      name: 'Centro Comercial Galerías',
      type: 'commercial',
      description: 'Centro comercial con 120 locales y área de comida en zona centro',
      location: [-110.9580, 29.0847],
      budget: '$80,000,000',
      startDate: '2024-10-01',
      endDate: '2026-12-31',
      status: 'En diseño',
      image: 'https://images.unsplash.com/photo-1519340241574-2cec6aef0c01?w=800&q=80'
    },
    {
      id: 3,
      name: 'Parque Industrial Hermosillo',
      type: 'industrial',
      description: 'Complejo industrial con 15 naves y oficinas en zona sur',
      location: [-110.9480, 29.0547],
      budget: '$150,000,000',
      startDate: '2025-03-01',
      endDate: '2027-12-31',
      status: 'Planificación',
      image: 'https://images.unsplash.com/photo-1565636252988-f92c1704e43d?w=800&q=80'
    },
    {
      id: 4,
      name: 'Conjunto Residencial Montecarlo',
      type: 'residential',
      description: 'Desarrollo de casas unifamiliares con áreas verdes',
      location: [-110.9780, 29.0687],
      budget: '$35,000,000',
      startDate: '2025-04-15',
      endDate: '2026-10-30',
      status: 'En progreso',
      image: 'https://images.unsplash.com/photo-1575517111839-3a3843ee7f5d?w=800&q=80'
    },
    {
      id: 5,
      name: 'Plaza Comercial Río Sonora',
      type: 'commercial',
      description: 'Plaza con tiendas departamentales y entretenimiento',
      location: [-110.9380, 29.0747],
      budget: '$60,000,000',
      startDate: '2025-02-01',
      endDate: '2026-08-31',
      status: 'En diseño',
      image: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=800&q=80'
    },
    {
      id: 6,
      name: 'Parque Logístico Aeropuerto',
      type: 'industrial',
      description: 'Complejo de bodegas y distribución cerca del aeropuerto',
      location: [-110.9280, 29.0647],
      budget: '$85,000,000',
      startDate: '2025-05-01',
      endDate: '2026-11-30',
      status: 'Planificación',
      image: 'https://images.unsplash.com/photo-1586528116493-7f9759f966ce?w=800&q=80'
    }
  ];

  // Agregar cada proyecto a su capa correspondiente
  sampleProjects.forEach(project => {
    addProjectToLayer(project);
  });
}

// Añadir un proyecto a su capa correspondiente
function addProjectToLayer(project) {
  const coords = ol.proj.fromLonLat(project.location);
  
  const feature = new ol.Feature({
    geometry: new ol.Point(coords),
    projectData: project
  });

  // Añadir a la capa específica por tipo
  projectLayers[project.type].getSource().addFeature(feature);
  
  // También añadir a la capa 'all' para mostrar todos los proyectos
  const featureClone = feature.clone();
  projectLayers['all'].getSource().addFeature(featureClone);
}

// Mostrar detalles del proyecto al hacer clic
function showProjectDetails(project) {
  // Verificar si existe un modal o crearlo
  let modal = document.getElementById('projectModal');
  
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'projectModal';
    modal.className = 'project-modal';
    document.body.appendChild(modal);
  }
  
  // Formatear el contenido del modal
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-modal">&times;</span>
      <h2>${project.name}</h2>
      ${project.image ? `<img src="${project.image}" alt="${project.name}" style="width:100%; height:200px; object-fit:cover; border-radius:var(--border-radius-md); margin-bottom:var(--spacing-md);">` : ''}
      <p><strong>Tipo:</strong> ${formatType(project.type)}</p>
      <p><strong>Descripción:</strong> ${project.description}</p>
      <p><strong>Presupuesto:</strong> ${project.budget}</p>
      <p><strong>Fecha de inicio:</strong> ${formatDate(project.startDate)}</p>
      <p><strong>Fecha de finalización:</strong> ${formatDate(project.endDate)}</p>
      <p><strong>Estado:</strong> <span class="status-badge status-${project.status.toLowerCase().replace(/\s+/g, '-')}">${project.status}</span></p>
      <div class="project-actions">
        <button class="btn btn-primary">Ver detalles completos</button>
        <button class="btn btn-secondary">Compartir proyecto</button>
      </div>
    </div>
  `;
  
  // Mostrar el modal
  modal.style.display = 'block';
  
  // Configurar el cierre del modal
  const closeBtn = modal.querySelector('.close-modal');
  if (closeBtn) {
    closeBtn.addEventListener('click', function() {
      modal.style.display = 'none';
    });
  }
  
  // Cerrar el modal al hacer clic fuera de él
  window.addEventListener('click', function(event) {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });
}

// Filtrar proyectos por tipo
function filterMapByType(type) {
  // Ocultar todas las capas primero
  Object.keys(projectLayers).forEach(layerType => {
    projectLayers[layerType].setVisible(false);
  });
  
  // Mostrar la capa seleccionada
  if (type && projectLayers[type]) {
    projectLayers[type].setVisible(true);
    console.log(`Mostrando proyectos de tipo: ${type}`);
    showNotification(`Mostrando proyectos ${formatType(type)}`);
    
    // Actualizar estadísticas basadas en el filtro seleccionado
    updateStatisticsByType(type);
  } else {
    // Si el tipo no existe, mostrar todos
    projectLayers['all'].setVisible(true);
    console.log('Mostrando todos los proyectos');
    showNotification('Mostrando todos los proyectos');
    
    // Actualizar estadísticas para mostrar todos los datos
    updateStatisticsByType('all');
  }
}

// Actualizar estadísticas según el tipo de proyecto seleccionado
function updateStatisticsByType(type) {
  // Emitir un evento personalizado para notificar a script.js
  const event = new CustomEvent('projectFilterChanged', { 
    detail: { filterType: type } 
  });
  document.dispatchEvent(event);
  
  // Destacar visualmente la sección de estadísticas
  const kpiSection = document.getElementById('kpis');
  if (kpiSection) {
    kpiSection.classList.add('highlight-section');
    setTimeout(() => {
      kpiSection.classList.remove('highlight-section');
    }, 1500);
    
    // Hacer scroll suave a la sección de estadísticas
    kpiSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// Formatear tipo de proyecto para visualización
function formatType(type) {
  const typeMap = {
    'residential': 'Residencial',
    'commercial': 'Comercial',
    'industrial': 'Industrial',
    'all': 'Todos'
  };
  
  return typeMap[type] || type;
}

// Formatear fecha para visualización
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

// Mostrar notificación temporal
function showNotification(message, type = 'info') {
  // Verificar si la función existe en script.js
  if (typeof window.showNotification === 'function') {
    window.showNotification(message, type);
    return;
  }
  
  // Función de respaldo si no existe en script.js
  const container = document.querySelector('.notification-container');
  if (!container) return;
  
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = message;
  
  container.appendChild(notification);
  
  // Eliminar después de 3 segundos
  setTimeout(() => {
    notification.classList.add('fade-out');
    setTimeout(() => {
      container.removeChild(notification);
    }, 500);
  }, 3000);
}

// Función para exportar datos de proyectos a CSV
function exportProjectsToCSV() {
  // Obtener datos de proyectos
  const projects = getSampleProjects();
  
  // Crear cabeceras de CSV
  const headers = ['Nombre', 'Tipo', 'Ubicación', 'Inversión', 'Estado', 'Fecha Inicio', 'Fecha Fin'];
  
  // Crear filas de datos
  const rows = projects.map(project => [
    project.name,
    project.type,
    `${project.coordinates[1]}, ${project.coordinates[0]}`, // Lat, Long
    `$${project.investment} MDP`,
    project.status,
    project.startDate || 'N/A',
    project.endDate || 'N/A'
  ]);
  
  // Combinar cabeceras y filas
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  // Crear archivo para descargar
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  // Crear elemento de descarga
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `proyectos_arquitectonicos_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.display = 'none';
  
  // Añadir a documento y descargar
  document.body.appendChild(link);
  link.click();
  
  // Limpiar
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  
  // Mostrar notificación
  showNotification('Datos de proyectos exportados correctamente', 'success');
}

// Función para exportar datos de proyectos a JSON
function exportProjectsToJSON() {
  // Obtener datos de proyectos
  const projects = getSampleProjects();
  
  // Convertir a string JSON
  const jsonContent = JSON.stringify(projects, null, 2);
  
  // Crear archivo para descargar
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  // Crear elemento de descarga
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `proyectos_arquitectonicos_${new Date().toISOString().split('T')[0]}.json`);
  link.style.display = 'none';
  
  // Añadir a documento y descargar
  document.body.appendChild(link);
  link.click();
  
  // Limpiar
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  
  // Mostrar notificación
  showNotification('Datos de proyectos exportados correctamente en formato JSON', 'success');
}

// Función para obtener los proyectos de muestra
function getSampleProjects() {
  // Esta función es necesaria para las funciones de exportación
  return [
    {
      id: 1,
      name: 'Residencial Las Palmas',
      type: 'residential',
      description: 'Complejo habitacional con 50 unidades en zona norte de Hermosillo',
      coordinates: [-110.9680, 29.0947],
      investment: 25.5,
      startDate: '2025-01-15',
      endDate: '2026-06-30',
      status: 'En progreso'
    },
    {
      id: 2,
      name: 'Centro Comercial Galerías',
      type: 'commercial',
      description: 'Centro comercial con 120 locales y área de comida en zona centro',
      coordinates: [-110.9580, 29.0847],
      investment: 80.2,
      startDate: '2024-10-01',
      endDate: '2026-12-31',
      status: 'En diseño'
    },
    {
      id: 3,
      name: 'Parque Industrial Hermosillo',
      type: 'industrial',
      description: 'Complejo industrial con 15 naves y oficinas en zona sur',
      coordinates: [-110.9480, 29.0547],
      investment: 150.8,
      startDate: '2025-03-01',
      endDate: '2027-12-31',
      status: 'Planificación'
    },
    {
      id: 4,
      name: 'Conjunto Residencial Montecarlo',
      type: 'residential',
      description: 'Desarrollo de casas unifamiliares con áreas verdes',
      coordinates: [-110.9780, 29.0687],
      investment: 35.3,
      startDate: '2025-04-15',
      endDate: '2026-10-30',
      status: 'En progreso'
    },
    {
      id: 5,
      name: 'Plaza Comercial Río Sonora',
      type: 'commercial',
      description: 'Plaza con tiendas departamentales y entretenimiento',
      coordinates: [-110.9380, 29.0747],
      investment: 60.5,
      startDate: '2025-02-01',
      endDate: '2026-08-31',
      status: 'En diseño'
    },
    {
      id: 6,
      name: 'Parque Logístico Aeropuerto',
      type: 'industrial',
      description: 'Complejo de bodegas y distribución cerca del aeropuerto',
      coordinates: [-110.9280, 29.0647],
      investment: 85.2,
      startDate: '2025-05-01',
      endDate: '2026-11-30',
      status: 'Planificación'
    }
  ];
}

// Inicializar el mapa cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('map')) {
    initMap();
  }
});