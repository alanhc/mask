let data;
function preload()
{
    data = loadJSON('search.json');
}
function setup()
{
    main()
    
}
function draw()
{

}

async function main()
{  
    await getLocation();
    await setMap();
    
    console.log(sessionStorage.myLatitude, sessionStorage.myLongitude)
    
}
