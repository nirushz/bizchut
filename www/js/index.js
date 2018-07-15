
let mainContainer = document.getElementById("main-container");
let loader = document.getElementById("loader");
loader.addEventListener("animationstart", loaderAnimationStart, false);
//loader.addEventListener("animationend", ()=>{console.log("animationend")}, false);

let shouldLoadDataToday = true; //TODO: check local storage for today data


if (shouldLoadDataToday){
    mainContainer.style.display = "none"
    loader.style.height = screen.height + "px";
}

setTimeout(loadDataCompleted, 2000);

function loadDataCompleted(){
    console.log("loadDataCompleted");
    loader.className +=" slide-down"
    document.getElementById("logo-background-img").className = "fadeOut";
}

function loaderAnimationStart(){
    mainContainer.style.display = "block"
}