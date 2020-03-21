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
    //table.getString(i,j);
    let d=3;
    let sh_y = d*1/110.574;
    let sh_x = d*1/(111.320*Math.cos(sh_y));
    let ly = Number(sessionStorage.myLatitude) - sh_y;
    let lx = Number(sessionStorage.myLongitude) - sh_x;
    let ry = Number(sessionStorage.myLatitude) + sh_y;
    let rx = Number(sessionStorage.myLongitude) + sh_x;
    console.log("left ",ly,lx,"\n");
    console.log("right ",ry,rx,"\n");
    
   
    //醫事機構代碼 醫事機構名稱 TGOS X TGOS Y 成人口罩剩餘數 兒童口罩剩餘數
    //0          1          2      3      4            5
    for (let i=0; i<table.getRowCount(); i++) {

        let name = table.getString(i,1);
        let y = table.getString(i,3);
        let x = table.getString(i,2);
        let mask_adult = Number(table.getString(i,4));
        let mask_chiid = Number(table.getString(i,5));
        let color="";

        if ( ly<y && y<ry && lx<x && x<rx 
        ) {
            d_y = Math.abs(y-sessionStorage.myLatitude);
            d_x = Math.abs(x-sessionStorage.myLongitude);
            
            var msg="<b>"+name+"</b><br>"+"成人:"+mask_adult+"<br>小孩:"+mask_chiid+"";
            
            if (mask_adult==0) color = 'Gray';
            else if (mask_adult<10) color = 'Red';
            else if (mask_adult<100) color = 'Orange';
            else color = 'Green';

            var circle = L.circle([y, x], {
                color: color,
                fillColor: color,
                fillOpacity: 0.5,
                radius: 50
            }).addTo(map);
            circle.bindPopup(msg).openPopup();
            count++;
            if (count>500) break;
        }
    }
    
    

    map.setView([sessionStorage.myLatitude,sessionStorage.myLongitude], 
        15);
    
}
