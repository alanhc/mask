let data;
let table;
function preload()
{
    //data = loadJSON('search.json');
    table = loadTable('result.csv', 'csv', 'header');
    
    getLocation();
    
}
async function setup()
{
    
    setMap();
    console.log(sessionStorage.myLatitude, sessionStorage.myLongitude)  
    
}
function draw()
{
    if (frameCount%(60*60)==0) {
        table = loadTable('result.csv', 'csv', 'header');
        console.log(sessionStorage.myLatitude, sessionStorage.myLongitude)  
    }
}


