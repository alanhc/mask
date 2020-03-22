let data;
let table;
function preload()
{
    data = loadJSON('search.json');
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

}


