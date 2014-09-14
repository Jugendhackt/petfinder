var petLayer;
var map = L.map('map');
console.log(map)
var url = 'http://{s}.tiles.mapbox.com/v3/pajowu.jg9he75o/{z}/{x}/{y}.png';
var copyright = 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade';
var tileLayer = new L.TileLayer(url, {
  maxZoom: 20,
  attribution: copyright
});
var startPosition = new L.LatLng(52.5306525,13.4135768);
map.on('load', function(e) {
  requestUpdatedPets(e.target.getBounds());
});
map.setView(startPosition, 15)
.addLayer(tileLayer);
map.on('moveend', function(e) {
  requestUpdatedPets(e.target.getBounds());
});
function requestUpdatedPets(bounds) {
  $.ajax({
    type: 'GET',
    url: '/pets?bbox=' + bounds._southWest.lng + ',' + bounds._southWest.lat + ',' + bounds._northEast.lng + ',' + bounds._northEast.lat,
    success: function(result) {
      parseResponsePets(result)
    },
    error: function(req, status, error) {
      alert('Unable to get cadastral data:' + error);
    }
  });
}

function parseResponsePets(data) {
    /*if (petLayer != undefined) {
        map.removeLayer(petLayer);
    }

    var count = data.rows.length;

    for (var i = 0; i < count; i++) {
        data.rows[i]["type"] = "Feature";
    }
    var featureCollection = {
        type: "FeatureCollection",
        features: data.rows
    };
    console.log(featureCollection)
    for (i in featureCollection.features) {
        portals.push(featureCollection.features[i])
        console.log(i)
    }
    console.log(portals)
    featureCollection.features = portals
    */
    //console.log(data);
    L.geoJson(data, {
      onEachFeature: function (feature, layer) {
        console.log(feature)
        animals = ["Katze","Hund","Vogel","Hase"]
        type = feature.properties.type;
        if(not type in animals) {
          type = "undef"
        }
        layer.setIcon(L.icon({iconSize: [48,48],iconAnchor: [24,48],popupAnchor:[0,-48],iconUrl: "images/" + type  +".svg"}))
        //layer.bindPopup("<p><img width=100% src='" + feature.value.image + "'>" + feature.value.title + "<a href=https://ingress.com/intel?ll=" + feature.value.latE6/1E6 + "," + feature.value.lngE6/1E6 + "&z=17&pll=" + feature.value.latE6/1E6 + "," + feature.value.lngE6/1E6 +">Open Portal on Intel</a></p>");
        popupsting = "<p>Name: " + feature.properties.name + "</p>";
        if('type' in feature.properties){
          popupsting += "<p>Tierart: " + feature.properties.type + "</p>"
        }
        layer.bindPopup(popupsting)
        }
      })
    .addTo(map);
  }

  function createGeoJsonLayer() {
    var layer = new L.GeoJSON();
    layer.on('featureparse', function(e) {
      e.layer.setStyle({
        color: '#003300',
        weight: 2,
        fill: true,
        fillColor: '#009933'
      });
    });
    return layer;
  }