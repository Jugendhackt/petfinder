var data = {}
var map = L.map('map');
console.log(map)
var url = 'http://{s}.tiles.mapbox.com/v3/pajowu.jg9he75o/{z}/{x}/{y}.png';
var copyright = 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade';
var tileLayer = new L.TileLayer(url, {
  maxZoom: 20,
  attribution: copyright
});
$("#registration_done").modal('hide');
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
            console.log(data);
            qrlink = "https://chart.googleapis.com/chart?cht=qr&chs=547x547&chl=http://petfinder.pajowu.de/static/pet.html%23" + data['id']
            $("#modal-body").html("<a href='http://petfinder.pajowu.de/petdelete?_id=" + data['id'] +"&token=" + data['token'] + "'>Über diesen Link können sie ihr Haustier aus der Datenbank löschen.</a><p>Diesen QR-Code können sie nun ausdrucken und an ihrem Haustier befestigen, er führt direkt zur Detail-Page ihres Haustieres:<img src='" + qrlink + "'>");
            $("#registration_done").modal('show');
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