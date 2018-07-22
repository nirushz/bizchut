
let mainContainer = document.getElementById("main-container");
let loader = document.getElementById("loader");
loader.addEventListener("animationstart", loaderAnimationStart, false);


let shouldLoadDataToday = true; //TODO: check local storage for today data
let postsData;

if (shouldLoadDataToday){
    mainContainer.style.display = "none"
    loader.style.height = screen.height + "px";

    //TODO: get the categories to fetch from settins/local storage
    let categoriesToFetch = [2,3,4];
    fetchData(categoriesToFetch)
    
}


async function fetchData (categoriesToFetch) {
    try{
        // await response of fetch call
        let response = await fetch(`https://bizchut-nashim.com/wp-json/wp/v2/posts/?categories=${categoriesToFetch}`);
        // only proceed once promise is resolved
        postsData = await response.json();
        
    }
    catch(e){
        alert("fetchData func:" + e);
    }
    loadDataCompleted();
}


//setTimeout(loadDataCompleted, 2000);

function loadDataCompleted(){
    console.log(postsData);
    loader.className +=" slide-down fadeOut"
    //document.getElementById("loader").className = "fadeOut";
    localStorage.setItem("loadDataCompleted-time", new Date().getTime().toString())
}

function loaderAnimationStart(){
    mainContainer.style.display = "block"
}