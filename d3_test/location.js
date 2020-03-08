var x = document.getElementById("demo");
let myLatitude;
let myLongitude;

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position)=>{
            myLatitude = position.coords.latitude;
            myLongitude = position.coords.longitude;
            x.innerHTML =
                "Latitude: " +
                myLatitude +
                "<br>Longitude: " +
                myLongitude;
            return position;
        });
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function setMap()
{
    var map = L.map("mapid");

    // 設定經緯度座標
    map.setView(new L.LatLng(myLatitude, myLongitude), 12);
    
    // 設定圖資來源
    var osmUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
    var osm = new L.TileLayer(osmUrl, { minZoom: 8, maxZoom: 16 });
    map.addLayer(osm);
}
