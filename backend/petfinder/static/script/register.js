var data = {}
var map = L.map('map');
console.log(map)
var url = 'http://{s}.tiles.mapbox.com/v3/pajowu.jg9he75o/{z}/{x}/{y}.png';
var copyright = 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade';
var tileLayer = new L.TileLayer(url, {
  maxZoom: 20,
  attribution: copyright
});
var marker;
var startPosition = new L.LatLng(52.5306525,13.4135768);
map.setView(startPosition, 15)
.addLayer(tileLayer);
map.on('click', function(e) {        
    var clickLoc= e.latlng;
    data['lastseen'] = []
    data['lastseen'][0] = clickLoc['lng'];
    data['lastseen'][1] = clickLoc['lat'];
    if (marker == undefined){
        marker = L.marker(clickLoc).addTo(map);
        if("type" in data){
            marker.setIcon(L.icon({iconSize: [48,48],iconAnchor: [24,48],popupAnchor:[0,-48],iconUrl: "images/" + data['type']  +".svg"}));
        }
    } else {
        marker.setLatLng(clickLoc).update()
    }
    });
function register(){
    data['name'] = document.getElementById("aniname").value
    data['age'] = document.getElementById("aniage").value
    data['attributes'] = document.getElementById("aniatt").value
    console.log(data)
    $.ajax({
        type: 'POST',
        url: '/pets',
        data: JSON.stringify({"pet":data}),
        success: function(data) {
            data = JSON.parse(data)
            console.log(data)
        }});
}
function setAnimal(animtype){
    document.getElementById("animtypedrop").firstChild.data = animtype
    data['type'] = animtype
    if(marker != undefined){
        marker.setIcon(L.icon({iconSize: [48,48],iconAnchor: [24,48],popupAnchor:[0,-48],iconUrl: "images/" + animtype  +".svg"}))
    }
}
function markerclick(e) {console.log(e)}