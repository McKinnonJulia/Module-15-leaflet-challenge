

//Initalize map and set view to global 
var map=L.map('map').setView([37.8,-96],4);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom:19,
}).addTo(map);

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(data) {
    console.log(data); // Check the data structure in the console
    // Add logic to create GeoJSON layer here
}).catch(function(error) {
    console.error("Error fetching the GeoJSON data: ", error);
})

//Use Fetch API to get GeoJSON data from the USGS
fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson')
    .then(response=>response.json())
    .then(data => {
        createMarkers(data.features);
    });

//Create function and markers of earthquake magnitude and depth
function createMarkers(earthquakes){
    earthquakes.forEach(eq => {
        var magnitude = eq.properties.mag;
        var depth = eq.geometry.coordinates[2];
        var coords = [eq.geometry.coordinates[1], eq.geometry.coordinates[0]];

        //marker size and color based off mag/depth
        var markerSize = magnitude * 2.5 //adjust 
        var markerColor = depth > 50 ? 'black' : (depth > 20 ? 'red' : 'white');
        

        var circle = L.circleMarker(coords, {
            radius: markerSize, 
            fillColor: markerColor, 
            color: markerColor, 
            weight: 1.25, 
            opacity: 1.25, 
            fillOpacity: .7
        }).addTo(map);

        //Add popup with additional info
        circle.bindPopup(`Magnitude: ${magnitude}<br>Depth: ${depth} km`);
    });

    createLegend(); 
}
function createLegend() {
    var legend = L.control({position: 'bottomright' });

    legend.onAdd = function () {
        var div = L.DomUtil.create('div', 'legend');
        div.innerHTML += '<h4> Depth Legend</h4>';
        div.innerHTML += '<i style="background: black"></i> > 50 km<br';
        div.innerHTML += '<i style="background: red"></i> > 20-50 km<br';
        div.innerHTML += '<i style="background: white"></i> > 50 km<br';
        return div;
    };

    legend.addTo(map);
}