var x = document.getElementById("demo");


function getLocation(callback) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position)=>{
            
            sessionStorage.myLatitude = position.coords.latitude;
            sessionStorage.myLongitude = position.coords.longitude;
            x.innerHTML =
                "Latitude: " +
                sessionStorage.myLatitude +
                "<br>Longitude: " +
                sessionStorage.myLongitude;
            
        });
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function setMap()
{
    
    // 設定經緯度座標
   
    var map = L.map('mapid').setView([sessionStorage.myLatitude,sessionStorage.myLongitude], 
        15);
    // 設定圖資來源
    //var osmUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
    //var osm = new L.TileLayer(osmUrl, { minZoom: 8, maxZoom: 16 });
    //map.addLayer(osm);
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 20,
        minZoom:5,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoiYWxhbmhjIiwiYSI6ImNrN2lncHlqdTBpZHMzbHBoazNsNmwzZW4ifQ.5KGKQCEMSx5FYHzo6Fy87Q'
    }).addTo(map);

    let count=0;
    for (i in data) {
        //var marker = L.marker([, ]]).addTo(map);
        var msg="<b>"+data[i]['醫事機構名稱']+"</b><br>"+"成人:"+String(data[i]['成人口罩剩餘數'])+"<br>小孩:"+String(data[i]['兒童口罩剩餘數'])+"";
        let color;
        if (data[i]['成人口罩剩餘數']==0) color = 'gray';
        else if (data[i]['成人口罩剩餘數']<10) color = 'red';
        else if (data[i]['成人口罩剩餘數']<100) color = 'yello';
        else color = 'green';
        var circle = L.circle([data[i]['TGOS Y'], data[i]['TGOS X']], {
            color: color,
        //    fillColor: '#f03',
            fillOpacity: 0.5,
            radius: 50
        }).addTo(map);
        circle.bindPopup(msg).openPopup();

        count++;
        if (count>500) break;
    }
    map.setView([sessionStorage.myLatitude,sessionStorage.myLongitude], 
        15);
    
}
