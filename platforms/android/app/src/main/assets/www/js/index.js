/* Global Members */
let mainContainer = document.getElementById("main-container");
let loader = document.getElementById("loader");
let hebrewDate = document.getElementById("hebrew-date");
let bodyContainer = document.getElementById("body-container");
let fetchNumber = localStorage.getItem("fetchNumber") || 1; //Page number to fetch
let rightArrowPressedCounter = 0;
let postsByCategories = new Map();
let currentDay = new Date();
let shouldRemoveLoader = false;

/* Loader - showed at start - when loading the content*/
loader.style.height = screen.height + "px";
mainContainer.style.display = "none";


let randomPitgam = Math.floor(Math.random() * 21);  //0-20
document.getElementById("phrase-content").innerText = pitgamim[randomPitgam].pitgam;
document.getElementById("phrase-author").innerText = pitgamim[randomPitgam].author;


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
    leftArrow.style.borderWidth= "0 3px 3px 0";
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
        leftArrow.style.borderWidth= "0 3px 3px 0";
    }
    currentDay.setDate(currentDay.getDate() + 1);
    SetHebrowDate(currentDay);
    buildBodyContainer();
}


/***** App Flow *****/

let intervalID = window.setInterval(()=>{
    if(shouldRemoveLoader){
        loader.className +=" slide-up fadeOut";
        //removes "spin360" class in order to stop spininig.
        document.getElementById("logo-background-img").className = ""; 
        window.clearInterval(intervalID);
    }
}, 6500);

SetHebrowDate (currentDay);

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


//Check if the updated data is allready in local storage or we should fetch it
const lastLoadDataCompletedTime = localStorage.getItem("lastLoadDataCompletedTime");
let postsData;
let shouldLoadDataToday = true; 
if (lastLoadDataCompletedTime){
    let lastLoadDataCompletedTimeDateObj = new Date(Number.parseInt(lastLoadDataCompletedTime));
    let today = new Date();

    if(lastLoadDataCompletedTimeDateObj.getDate() == today.getDate() && 
       lastLoadDataCompletedTimeDateObj.getMonth() == today.getMonth()){
        shouldRemoveLoader = true;
        shouldLoadDataToday = false;
        postsByCategories = objToMap(JSON.parse(localStorage.getItem("postsByCategories")));
        buildBodyContainer()
    }
    //else...Add whats down...
}


//TODO: get the categories to fetch from settins/local storage
function getCategoriesToFetch(){
    return [2,3];
}

if (shouldLoadDataToday){
    //mainContainer.style.display = "none";
    //loader.style.height = screen.height + "px";

    //When starting a new day we want to clean up
    fetchNumber = 1;
    postsByCategories = new Map();


    //TODO: get the categories to fetch from settins/local storage
    let categoriesToFetch = getCategoriesToFetch();
    fetchPosts(categoriesToFetch);
}


async function fetchPosts (categoriesToFetch) {
    try{
        let url = `https://bizchut-nashim.com/wp-json/wp/v2/posts/?categories=${categoriesToFetch}&per_page=100&page=${fetchNumber}`;
        let props = {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, cors, *same-origin
            //cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            //credentials: 'same-origin', // include, *same-origin, omit
            /*
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': '"GET,HEAD,OPTIONS,POST,PUT',
                'Access-Control-Allow-Credentials': 'true',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            */
            //redirect: 'follow', // manual, *follow, error
            //referrer: 'no-referrer', // no-referrer, *client
        }

        let response = await fetch(url, props);

        // only proceed once promise is resolved
        if (response.ok){
            postsData = await response.json();
            ++fetchNumber;
            console.log(postsData);
            setPostsByCategories();
            shouldRemoveLoader = true;
            //loader.className +=" slide-up fadeOut";
            
            buildBodyContainer();
        }
        else{ //No more posts
            bodyContainer.innerHTML = endOfContentDiv;
        }
    }
    catch(e){
        window.clearInterval(intervalID);
        alert("Error in fetchPosts func:" + e);

    } 
}

//Insert the posts that was fetched into Map by categories
function setPostsByCategories(){
    postsData.map((post) =>{
        console.log(post);
        let arr = [];
        if(postsByCategories.has(post.categories[0])){
            arr = postsByCategories.get(post.categories[0]);  
        }

        arr.push(post);
        postsByCategories.set(post.categories[0], arr);  
    });

    //Save data to local storage with today's time stamp, so in next time we won't use fetch to bring data
    localStorage.setItem("lastLoadDataCompletedTime", new Date().getTime().toString())
    localStorage.setItem("postsByCategories",JSON.stringify(mapToObj(postsByCategories)));
    localStorage.setItem("fetchNumber",fetchNumber);
}


//Show posts contents
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
    //attach click handler to "read more" sections
    Array.from(document.getElementsByClassName("postReadMore")).forEach(element =>{
        addEventListener("click", postReadMoreClickHandler, false);
    });

    //When out of posts go and fetch some more data
    if(!bodyContainer.firstChild){
        let categoriesToFetch = getCategoriesToFetch();
        fetchPosts(categoriesToFetch);
    }
}

function postReadMoreClickHandler(e){
    e.stopPropagation();
    if(e.target.className == "postReadMore"){
        let contentClass = e.target.parentElement.firstElementChild;
        if(contentClass.className == "contentClass-collapsed"){
            contentClass.className = "contentClass-extended";
            window.setTimeout(()=>{
                e.target.innerHTML = "סגירה<span><<</span>";
            },1000);  
        }
        else{
            contentClass.className = "contentClass-collapsed";
            window.setTimeout(()=>{
                e.target.innerHTML = "<span>>></span>המשך...";
            },800);
        }
    }
}

window.setTimeout(() => {

    window.pushNotification.registration((token) => {
        console.log(token);
      })

    // Catch notification if app launched after user touched on message
    window.pushNotification.tapped((payload) => {
        console.log(payload);
    })
} 

, 5000);
/*
TODO:
1. fetch before getting to "no posts"
2. test real user (new posts every day...)
*/

/*TODO:
1. more pitgamin
2. להסיר טוענים בשבילך
3.לסדר את התודה לרב גבריאל 
4. להוסיף עוד תוכן הלכה
5. עמוד אודות שיכיל גם מה עוד מתוכנן לגרסה הבאה
*/
