//import * as mapboxgl from 'mapbox-gl';
//const mapboxgl = require('mapbox-gl');

let locations = document.querySelector('#map').dataset.locations;
locations = JSON.parse(locations);


mapboxgl.accessToken = 'pk.eyJ1IjoibWFuaXNoNTU1IiwiYSI6ImNsMGRzOGk1NzBjNXQzZW82NjlqempoY2UifQ.-OpeVb5QS6vM_ivF84bpUw';

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/manish555/cl0dv3e7h000714p734fhfzdm',
    scrollZoom:false
    //center:[-118.11,34.11],
    //zoom:10
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach(loc => {

    //marker
    const elem = document.createElement('div');
    elem.className = 'marker';

    //add marker
    new mapboxgl.Marker({
        element: elem,
        anchor: 'bottom'
    }).setLngLat(loc.coordinates).addTo(map);

    //app popuop
    new mapboxgl.Popup({
        className:'mapboxgl-popup'
    })
        .setLngLat(loc.coordinates)
        .setHTML(`<p>${loc.day}: ${loc.description}</p>`)
        .addTo(map);
    //extend map bound to include the current location
    bounds.extend(loc.coordinates);
});

map.fitBounds(bounds, {
    padding: {
        top: 200,
        bottom: 200,
        left: 100,
        right: 100
    }
})
