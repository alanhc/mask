let data;
let table;
async function preload()
{
    data = loadJSON('search.json');
    table = loadTable('result.csv', 'csv', 'header');
    await getLocation();
}
async function setup()
{
    
    setMap();
    console.log(sessionStorage.myLatitude, sessionStorage.myLongitude)  
    
}
function draw()
{

}


