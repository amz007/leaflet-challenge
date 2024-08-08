// Initialize the map
var map = L.map('map').setView([37.77, -122.42], 5);

// Add a tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
}).addTo(map);

// Function to get color based on depth
function getColor(depth) {
    return depth > 90 ? '#800026' :
        depth > 70 ? '#BD0026' :
            depth > 50 ? '#E31A1C' :
                depth > 30 ? '#FC4E2A' :
                    depth > 10 ? '#FD8D3C' :
                        '#FFEDA0';
}

// Load GeoJSON data and add to map
d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson').then(function (data) {
    L.geoJSON(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                radius: feature.properties.mag * 2,
                fillColor: getColor(feature.geometry.coordinates[2]), // Depth
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            }).bindPopup(
                "Magnitude: " + feature.properties.mag + "<br>" +
                "Location: " + feature.properties.place + "<br>" +
                "Depth: " + feature.geometry.coordinates[2] + " km<br>" +
                "Time: " + new Date(feature.properties.time)
            );
        }
    }).addTo(map);
});

// Add legend to map
var legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'legend'),
        grades = [-10, 10, 30, 50, 70, 90],
        labels = [];

    div.innerHTML += '<b>Depth Legend (km)</b><br>';
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(map);
