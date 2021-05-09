mapboxgl.accessToken = 'pk.eyJ1IjoibmVpbHdpY2siLCJhIjoiY2trend6anJtMGw3OTJxcDVobjAzMXF0NyJ9.GdU99dksEsLt6TlpXlODVQ';
var map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/neilwick/cknkdys7t0g6m17o64ppw9dia', // style URL
    center: [-75, 45], // starting position [lng, lat]
    zoom: 15 // starting zoom
});

let getHydrants = async () => {
    let req = await fetch("/api/hydrantsx");
    let data = await req.text();
    let parsed = new window.DOMParser().parseFromString(data, 'text/xml');

    let hydrants = parsed.querySelectorAll("GEOM");

    hydrants.forEach((el) => {
        let loc = el.innerHTML;
        loc = loc.substring(7, loc.length - 1).split(' ');

        var marker = new mapboxgl.Marker()
            .setLngLat([loc[0], loc[1]])
            .addTo(map);
    });

}

window.onload = async () => {
    // getHydrants();
    let location = false;
    let tracker;
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((p) => {
            console.log(p.coords);
            location = true;
            map.setCenter({ lon: p.coords.longitude, lat: p.coords.latitude });
        });
    }

    if (!location) {
        // geolocation not available
        if ('geolocation' in navigator) {
            let allowGeo = await navigator.permissions.query({ name: 'geolocation' });
            if (allowGeo.state == "prompt") {
                allowGeo.onchange = (e) => {
                    if (e.target.state == "granted") {

                        //console.log(e);
                        navigator.geolocation.getCurrentPosition((p) => {
                            console.log(p.coords);
                            location = true;
                            map.setCenter({ lon: p.coords.longitude, lat: p.coords.latitude });
                            var marker = new mapboxgl.Marker()
                                .setLngLat([p.coords.longitude, p.coords.latitude])
                                .addTo(map);
                            var popup = new mapboxgl.Popup({ offset: 40 })
                                .setLngLat([p.coords.longitude, p.coords.latitude])
                                .setHTML('<a href="#" id="user" title="Recentre here">Your location</a>')
                                .addTo(map);
                            document.getElementById("user").addEventListener("click", function () {
                                map.setCenter({ lon: p.coords.longitude, lat: p.coords.latitude });
                            });
                        });

                    }
                };
            }
        }
        getServerGeo();
    };

};

let getServerGeo = async function () {
    var loc = await fetch("/api/geo");
    var jData = await loc.json();

    console.log(jData);
    map.setCenter({ lon: jData.longitude, lat: jData.latitude });

    var marker = new mapboxgl.Marker()
        .setLngLat([jData.longitude, jData.latitude])
        .addTo(map);

    var popup = new mapboxgl.Popup({ offset: 40 })
        .setLngLat([jData.longitude, jData.latitude])
        .setHTML('<a href="#" id="server" title="Recentre here">Your ISP server</a>')
        .addTo(map);
    document.getElementById("server").addEventListener("click", function () {
        map.setCenter({ lon: jData.longitude, lat: jData.latitude });
    });

}