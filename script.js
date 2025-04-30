document.addEventListener('DOMContentLoaded', () => {
  // Inicializar mapa con OpenLayers centrado en Hermosillo
  const map = new ol.Map({
    target: 'map',
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      })
    ],
    view: new ol.View({
      center: ol.proj.fromLonLat([-110.9580, 29.0747]), // Hermosillo
      zoom: 13
    })
  });
});