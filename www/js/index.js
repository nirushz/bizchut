
/* Global Members */
let mainContainer = document.getElementById("main-container");
let hebrewDate = document.getElementById("hebrew-date");
let bodyContainer = document.getElementById("body-container");

let rightArrowPressedCounter = 0;
let postsByCategories = new Map();

/* Loader - showed at start - when loading the content*/
let loader = document.getElementById("loader");
loader.addEventListener("animationstart", loaderAnimationStart, false);
function loaderAnimationStart(){
    mainContainer.style.display = "block"
}

/* Right Arrow*/
rightArrow = document.getElementById("right-arrow");
rightArrow.addEventListener("click",rightArrowClicked);
function rightArrowClicked(){
    ++rightArrowPressedCounter;
    leftArrow.style.display = "block";
}

/* Left Arrow*/
leftArrow = document.getElementById("left-arrow");
leftArrow.addEventListener("click",leftArrowClicked);
function leftArrowClicked(){
    --rightArrowPressedCounter;
    if (rightArrowPressedCounter == 0){
        leftArrow.style.display = "none";
    }
}



/***** App Flow *****/

SetHebrowDate();

function SetHebrowDate () {
    try{
        let todayHebroeDate = new Hebcal.HDate(Hebcal.HDate()).toString('h');
        console.log(todayHebroeDate);
        hebrewDate.innerHTML = todayHebroeDate;
        
    }
    catch(e){
        alert("Error in SetHebrowDate:" + e);
    }
    
}

//TODO: get the categories to fetch from settins/local storage
function getCategoriesToFetch(){
    return [2,3,4];
}

let shouldLoadDataToday = true; //TODO: check local storage for today data
let postsData;

if (shouldLoadDataToday){
    mainContainer.style.display = "none"
    loader.style.height = screen.height + "px";

    //TODO: get the categories to fetch from settins/local storage
    let categoriesToFetch = getCategoriesToFetch();
    fetchPosts(categoriesToFetch) 
}

function getCategoriesToFetch(){
    return [2,3,4];
}

async function fetchPosts (categoriesToFetch) {
    try{
        let response = await fetch(`https://bizchut-nashim.com/wp-json/wp/v2/posts/?categories=${categoriesToFetch}`);
        // only proceed once promise is resolved
        postsData = await response.json();
        loadDataCompleted();
    }
    catch(e){
        alert("Error in fetchPosts func:" + e);
    }
    
}


function loadDataCompleted(){
    console.log(postsData);
    postsData.map((post) =>{
        console.log(post);
        let arr = [];
        if(postsByCategories.has(post.categories[0])){
            arr = postsByCategories.get(post.categories[0]);  
        }

        arr.push(post);
        postsByCategories.set(post.categories[0], arr);
        
    });
    loader.className +=" slide-down fadeOut"
    
    //TODO: Save data to local storage or DB with today's time stamp, so in 
    //next time we won't use fetch to bring data
    localStorage.setItem("loadDataCompleted-time", new Date().getTime().toString())
    localStorage.setItem("postsData",JSON.stringify(postsData));
    buildBodyContainer()
}

function buildBodyContainer(){
    postsByCategories.forEach((element, index) => {
        var el = document.createElement('div');
        el.innerHTML = `<div>
                            <div class='contentClass-collapsed'>
                                <div class='postCategory'>מסלול לימוד ${getCategoryNameByID(element[rightArrowPressedCounter].categories[0])} </div>
                                <div class='postTitle'>${element[rightArrowPressedCounter].title.rendered}</div>
                                <div class='postContent'>${element[rightArrowPressedCounter].content.rendered}</div>
                            </div>
                            <div class='postReadMore'><span>>></span>המשך...</div>
                            <hr class='hr-content'>
                        <div>`;

        
        bodyContainer.appendChild(el);
        console.log(index);
    });

    Array.from(document.getElementsByClassName("postReadMore")).forEach(element =>{
        addEventListener("click", postReadMoreHandler, false);
    });
}

function postReadMoreHandler(e){
    e.stopPropagation();
    console.log(e);
    
    if(e.target.className == "postReadMore"){
        let contentClass = e.target.parentElement.firstElementChild;
        if(contentClass.className == "contentClass-collapsed"){
            contentClass.className = "contentClass-extended";
        }
        else{
            contentClass.className = "contentClass-collapsed";
        }
    }
}
