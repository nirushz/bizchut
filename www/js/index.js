/* Global Members */
let mainContainer = document.getElementById("main-container");
let hebrewDate = document.getElementById("hebrew-date");
let bodyContainer = document.getElementById("body-container");

let rightArrowPressedCounter = 0;
let postsByCategories = new Map();
let currentDay = new Date();

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
    //Don't increment when reaching the last post
    if (bodyContainer.firstElementChild && bodyContainer.firstElementChild.id != "endOfContent"){
        ++rightArrowPressedCounter;
        currentDay.setDate(currentDay.getDate() - 1);
        SetHebrowDate(currentDay);
    }
    console.log(rightArrowPressedCounter);
    leftArrow.style.border= "solid #FAB019";
    leftArrow.style.borderWidth= "0 2px 2px 0";
    buildBodyContainer();
}

/* Left Arrow*/
leftArrow = document.getElementById("left-arrow");
leftArrow.addEventListener("click",leftArrowClicked);
function leftArrowClicked(){
    --rightArrowPressedCounter;
    console.log(rightArrowPressedCounter);
    if (rightArrowPressedCounter < 0){
        rightArrowPressedCounter = 0;
        return;
    }
    if (rightArrowPressedCounter == 0){
        leftArrow.style.border= "solid #d4d1ca";
        leftArrow.style.borderWidth= "0 2px 2px 0";
    }
    currentDay.setDate(currentDay.getDate() + 1);
    SetHebrowDate(currentDay);
    buildBodyContainer();
}




/***** App Flow *****/

SetHebrowDate(currentDay);

function SetHebrowDate (currentDay) {
    try{
        //let todayHebroeDate = new Hebcal.HDate(Hebcal.HDate()).toString('h');
        let todayHebroeDate = new Hebcal.HDate(currentDay).toString('h');
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

//Insert the posts that was fetched into Map by categories
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

//Insert posts contents"
function buildBodyContainer(){
    //Remove old content if exists (usefull when pressing arrows)
        while (bodyContainer.firstChild) {
            bodyContainer.removeChild(bodyContainer.firstChild);
        }
   
    //Add new content
    postsByCategories.forEach((element, index) => {
        if (element[rightArrowPressedCounter] !== undefined && element[rightArrowPressedCounter] !== null){
            var elementContent = document.createElement('div');
            elementContent.innerHTML = `<div>
                                <div class='contentClass-collapsed'>
                                    <div class='postCategory'>מסלול לימוד ${getCategoryNameByID(element[rightArrowPressedCounter].categories[0])} </div>
                                    <div class='postTitle'>${element[rightArrowPressedCounter].title.rendered}</div>
                                    <div class='postContent'>${element[rightArrowPressedCounter].content.rendered}</div>
                                </div>
                                <div class='postReadMore'><span>>></span>המשך...</div>
                                <hr class='hr-content'>
                            <div>`;

            bodyContainer.appendChild(elementContent);
        }       
    });
    //attach click handler to "read more sections"
    Array.from(document.getElementsByClassName("postReadMore")).forEach(element =>{
        addEventListener("click", postReadMoreClickHandler, false);
    });

    //TODO:
    if(!bodyContainer.firstChild){
        bodyContainer.innerHTML = `<div id="endOfContent">תודה לרב גבריאל אלישע!<div>`
    }
}

function postReadMoreClickHandler(e){
    e.stopPropagation();
    if(e.target.className == "postReadMore"){
        let contentClass = e.target.parentElement.firstElementChild;
        if(contentClass.className == "contentClass-collapsed"){
            contentClass.className = "contentClass-extended";
            window.setTimeout(()=>{
                e.target.innerHTML = "סגירה<span><<</span>"
            },1000);  
        }
        else{
            contentClass.className = "contentClass-collapsed";
            window.setTimeout(()=>{
                e.target.innerHTML = "<span>>></span>המשך..."
            },800);
        }
    }
}

//var year = new Hebcal();
//var d = new Date()
//decrement date: d.setDate(d.getDate() - 1)
//var r = year.find(d)
//r[0].toString('h')