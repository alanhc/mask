let data;
let table;
function preload()
{
    data = loadJSON('search.json');
    table = loadTable('result.csv', 'csv', 'header');
}
async function setup()
{
    await getLocation();
    setMap();
    console.log(sessionStorage.myLatitude, sessionStorage.myLongitude)  
    
}
function draw()
{

}


