"use strict"
// Load Main page
// I check to never call it with empty so I added any char
searchResponseByName("r")

// Global var 
let  mainMeals = []
// Loading Screen
let loading = (t)=>{
    
    $("#main").html(`
    <div id="loading" class="bg-transparent">
    <div class="loader"></div>
    </div>
    `);

    $("#loading").fadeOut(t);

}

$("document").ready(function(){
    $(".loader").fadeOut(500,function(){
        $("#loading").remove();
        $("body").css({overflowY: 'auto'});
    })
});

// **************************************************
// toogle open 

// At first close it
let openBoxOff = $("#menu").offset().left;
if(openBoxOff == 0){
    // opened
    $("#menu").animate({left:`-${$(".menu-content").innerWidth()}`},500);
}

// Handle menu animations
$("#open-icon").click(function(){
    openBoxOff = $("#menu").offset().left;
    if(openBoxOff == 0 ){
        // opened
        closeMenu()
    }else{
        // closed
        openMenu();

    }
});
let closeMenu = function(){
        $("#menu").animate({left:`-${$(".menu-content").innerWidth()}`},500);
        $("#open-icon").html("<i class='fa-solid fa-bars fs-2'></i>");
        $("#menu ul").animate({top:"50%",opacity:"0"},50);
        $("#menu ul li").css({top:"25%"});
}
let openMenu = function(){
    $("#menu ul").css({top:0,opacity:1});
    $("#open-icon").html("<i class='fa-solid fa-x fs-2'></i>");
    $("#menu").animate({left:0},500);
    $("#search").animate({top:"0"},200,()=>{
        $("#categories").animate({top:"0"},180,()=>{
            $("#area").animate({top:"0"},150,()=>{
                $("#ingredients").animate({top:"0"},100,()=>{
                    $("#contact-us").animate({top:"0"},50,()=>{
                    });
                });
            });
        });
    });
}

// ******************************************************
// switch on links to fire function 
$(".menu-content ul li").click(function(e){
    
    switch(`${$(e.target).attr("id")}`){
        case "search":
            getSearch();
            break;
        case "categories":
            getCategories();
            break;
        case "area":
            getArea();
            break;
        case "ingredients":
            getIngredients();
            break;
        case "contact-us":
            getContact();
            break;
        default:
            console.log("nothing called"); 
            break;
        }
            
});
                        
// All links functions 
let getSearch = ()=>{
    closeMenu()
    loadSearchPage();
};
let getCategories = ()=>{
    closeMenu()
    loadCategoriesPage();
}
let getArea = ()=>{
    closeMenu();
    loadAreasPage();
};
let getIngredients = ()=>{
    closeMenu();
    loadIngPage();
};
let getContact = ()=>{
    closeMenu();
    loadContactPage();
};
// ******************************************************

function loadSearchPage(){
    $("#main").html(`
    <div class="d-flex w-100 flex-column">
    <div id="searchDiv" class="d-flex w-100 py-4 justify-sm-content-center">
    <input class="form-control m-2" type="search"  id="searchName" placeholder="Search By Name">
    <input class="form-control m-2" type="search"  id="searchChar" placeholder="Search By First letter">
    </div>
    <h5 id="Not-found"></h5>
    </div>
    <div id="searchData" class="container"></div>
    <div id="searchLoading" class="container">
    </div>
    `);

    addEventsSearch();
}

// Onclick method for the 2 input fields 
let addEventsSearch = ()=>{
    document.querySelector("#searchName").addEventListener('input' , function(){
        $("#searchLoading").html(`
        <div id="loading" class="bg-transparent">
        <div class="loader"></div>
        </div>
        `);
        searchResponseByName(this.value);
    
    });
    document.querySelector("#searchChar").addEventListener('input' , function(){
        this.value = (this.value).substring(0, 1);
        $("#searchLoading").html(`
        <div id="loading" class="bg-transparent">
        <div class="loader"></div>
        </div>
        `);
        searchResponseByLetter(this.value);
    });
}

async function searchResponseByName(val){

    $("#searchLoading").html(`
        <div id="loading" class="bg-transparent">
            <div class="loader"></div>
        </div>
        `);
    let key = val;
    if(isNaN(key)){
        $("#Not-found").html("");
        $("#loading").fadeOut(700);
        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${val}`);
        response = await response.json();
        
        if(response.meals != null ){
            UpdateSearchUi(response.meals);
        }else{
        $("#searchData").html(" ");

        }
    }else{
        $("#Not-found").html(`Nothing found named ${val}`);
    }
    
}
async function searchResponseByLetter(val){
    $("#searchLoading").html(`
        <div id="loading" class="bg-transparent">
            <div class="loader"></div>
        </div>
        `);

    let key = val;

    if(isNaN(key)){
        $("#Not-found").html("");
        $("#loading").fadeOut(700);
        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${val}`);
        response = await response.json();
        
        if(response.meals != null ){
            UpdateSearchUi(response.meals);
        }else{
        $("#searchData").html(" ");
        }
        
    }else{
        $("#Not-found").html(`Nothing found starts with ${val}`);
    }
    
}

function UpdateSearchUi(meals){
    // Update Ui

    // Update main meals list we have every time we get new fetch
    mainMeals = meals;

    meals = meals.slice(0,20);
    if(meals != null){
        $("#Not-found").html("");
        let batch = ``;
        for(let i=0; i<meals.length; i++) {
            batch += `
        <div class="col-6 col-md-3">
            <div class="img-item-title">
            <img src='${meals[`${i}`].strMealThumb}' class='image-fluid'>
                <div class="img-item-overlay">
                    <h2>${meals[`${i}`].strMeal}</h2>
                </div>
            </div>
        </div>`;
        }
        $("#searchData").html(`<div class="row gx-4 gy-4 p-3">
        ` + batch + `</div>`);

        addEventsToMeals(meals);
        }
        else{
            $("#searchData").html(" ");
            $("#Not-found").html(`Nothing found Named ${document.querySelector("#searchName").value}`);
        }
}

let addEventsToMeals = (meals) => {
    // add on click for meals in ui 
    // get meal id from mainMeals array
    // locate in array 
    // display details page 
    let arr = $(".img-item-title");
    for(let i = 0; i < 20; i++) {
        arr.eq(i).click(()=>{
            getMealDetails(meals[i]);
        })
    }
    
}

// Load single meal
let getMealDetails = (meal) => {
    $("#main").html(`
    <div id="loading" class="bg-transparent">
    <div class="loader"></div>
    </div>
    `);

    $("#loading").fadeOut(300);

    let strTags = ``;
    if(meal.strTags != null){
        let tags = meal.strTags.split(",");
        for(let i = 0; i < tags.length;i++){
            strTags+=`
            <li class="alert alert-danger m-2 p-1">${tags[i]}</li>
            `;
        }
    }

    
    let batchINg = ``;
    for(let i = 1; i <=20;i++){

        if (meal[`strIngredient${i}`]) {
            batchINg += `<li class="alert alert-info m-2 px-2 py-2">${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}</li>`
        }
        else{
            break;
        }
    }


    $("#main").html(`
    <div class="meal">
    <div class="meal-img">
        <img src="${meal.strMealThumb}" alt="">
        <h1 class="fs-1 px-4 py-2 fw-bolder">${meal.strMeal}</h1>
    </div>
    <div class="meal-data">
        <h2>Instructions</h2>
        <p class="meal-desc">
        ${meal.strInstructions}
        </p>
        <h3>Area : <span class="meal-area">${meal.strArea}</span></h3>
        <h3>Category : <span class="meal-category">${meal.strCategory}</span></h3>
        <h3>Recipes :
        </h3>  <ul class="list-unstyled d-flex g-3 flex-wrap">`+  batchINg
        +`</ul>
        <h3>Tags :</h3>
        <ul class="list-unstyled d-flex g-3 flex-wrap">
        `+strTags +
            `</ul>
        <div class="d-flex p-1">
            <a target="_blank" href="${meal.strSource}" class="btn btn-success mx-1">Source</a>
            <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
        </div>
    </div>
</div>

    `);
}




// Categories Page

let addEventsToCategories = (catg) => { 
    let arr = $(".img-item-title");
    for(let i = 0; i < arr.length; i++) {
        arr.eq(i).click(()=>{
            // load single category page
            loadSingleCategory(catg[i]);
        })
    }
}

let loadCategoriesPage = async ()=>{
    
    loading(600);

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`);
    
    response = await response.json();

    if(response.categories != null ){
        let cats = response.categories;
        let batch = ``;
        for(let i=0; i<cats.length; i++) {
            batch += `
        <div class="col-6 col-md-3">
            <div class="img-item-title">
            <img src='${cats[`${i}`].strCategoryThumb}' class='image-fluid'>
                <div class="img-item-overlay">
                    <h2>${cats[`${i}`].strCategory}</h2>
                    <p> ${(cats[`${i}`].strCategoryDescription).substring(0,150)}</p>
                </div>
            </div>
        </div>`;
        }
        $("#main").html(`<div class="row gx-4 gy-4 px-2 py-5">
        ` + batch + `</div>`);

        addEventsToCategories(cats);

    }else{
    $("#main").html("Nothing loaded! check connection ");
    }
}

let loadSingleCategory = async (category) => {
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category.strCategory}`);
    response = await response.json();
    let singleCat = response.meals.slice(0,20);
    if(singleCat != null ){
        let batch = ``;
        for(let i=0; i<singleCat.length; i++) {
            batch += `
        <div class="col-6 col-md-3">
            <div class="img-item-title">
            <img src='${singleCat[`${i}`].strMealThumb}' class='image-fluid'>
                <div class="img-item-overlay">
                    <h2>${singleCat[`${i}`].strMeal}</h2>
                </div>
            </div>
        </div>`;
        }
        $("main").html(`<div class="row gx-4 gy-4 p-5">
        ` + batch + `</div>`);

        addEventsToMeals(singleCat);

    }else{
    $("#main").html("Nothing loaded! check connection ");
    }

}



// Areas page

let addEventsToAreas = (areas) => { 
    let arr = $(".img-item-area");
    for(let i = 0; i < arr.length; i++) {
        arr.eq(i).click(()=>{
            // load single area page
            loadSingleArea(areas[i]);
        })
    }
}

let loadAreasPage = async ()=>{
    
    loading(600);

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`);    
    response = await response.json();
    if(response.meals != null ){
        let areas = (response.meals).slice(0,20);
        let batch = ``;
        for(let i=0; i<areas.length; i++) {
            batch += `
            <div class="col-6 col-md-3">
            <div class="img-item-area">
                <i class="fa-solid fa-house-laptop fa-4x"></i>
                <h2> ${areas[`${i}`].strArea}</h2>
            </div>
        </div>`;
        }
        $("#main").html(`<div class="row gx-4 gy-4 px-2 py-5">
        ` + batch + `</div>`);

        addEventsToAreas(areas);

    }else{
    $("#main").html("Nothing loaded! check connection ");
    }
}

let loadSingleArea = async (area) => {
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area.strArea}`);
    response = await response.json();
    let singleArea = response.meals.slice(0,20);
    if(singleArea != null ){
        let batch = ``;
        for(let i=0; i<singleArea.length; i++) {
            batch += `
        <div class="col-6 col-md-3">
            <div class="img-item-title">
            <img src='${singleArea[`${i}`].strMealThumb}' class='image-fluid'>
                <div class="img-item-overlay">
                    <h2>${singleArea[`${i}`].strMeal}</h2>
                </div>
            </div>
        </div>`;
        }
        $("main").html(`<div class="row gx-4 gy-4 p-5">
        ` + batch + `</div>`);

        addEventsToMeals(singleArea);

    }else{
    $("#main").html("Nothing loaded! check connection ");
    }

}

// Ingredients page

let addEventsToIng = (ing) => { 
    let arr = $(".img-item-area");
    for(let i = 0; i < arr.length; i++) {
        arr.eq(i).click(()=>{
            // load single area page
            loadSingleIng(ing[i]);
        })
    }
}

let loadIngPage = async ()=>{   

    loading(600);

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`);    
    response = await response.json();
    if(response.meals != null ){

        let ingredients = (response.meals).slice(0,20);

        let batch = ``;
        for(let i=0; i<ingredients.length; i++) {
            batch += `
            <div class="col-6 col-md-3">
            <div class="img-item-area text-center">
            <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                <h2> ${ingredients[`${i}`].strIngredient}</h2>
                <p> ${(ingredients[`${i}`].strDescription).substring(0,100)}</p>
            </div>
        </div>`;
        }
        $("#main").html(`<div class="row gx-4 gy-4 px-2 py-5">
        ` + batch + `</div>`);

        addEventsToIng(ingredients);

    }else{
    $("#main").html("Nothing loaded! check connection ");
    }
}

let loadSingleIng = async (ing) => {
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ing.strIngredient}`);
    response = await response.json();
    // console.log(response);
    let SingleIngredient = response.meals.slice(0,20);
    if(SingleIngredient != null ){
        let batch = ``;
        for(let i=0; i<SingleIngredient.length; i++) {
            batch += `
        <div class="col-6 col-md-3">
            <div class="img-item-title">
            <img src='${SingleIngredient[`${i}`].strMealThumb}' class='image-fluid'>
                <div class="img-item-overlay">
                    <h2>${SingleIngredient[`${i}`].strMeal}</h2>
                </div>
            </div>
        </div>`;
        }
        $("main").html(`<div class="row gx-4 gy-4 p-5">
        ` + batch + `</div>`);

        addEventsToMeals(SingleIngredient);

    }else{
    $("#main").html("Nothing loaded! check connection ");
    }

}



// Contact Page Loading with validation 
let loadContactPage = ()=>{
    $("#main").html(`
    <div id="custom-card">
    <div class="card-2 pt-3">
            <h1>Contact Us</h1>
            <p class="text-muted">Welcome to the site , sign up here easily.</p>
            <div class="inputs">
                <input placeholder="Enter your Name"  oninput="ValidateName();ValidateVals();" class="form-control" type="text" name="userName" id="userName">
                <p class="userNameErr text-danger"> </p>
                <input placeholder="Enter your Email" oninput="ValidateEmail();ValidateVals();" class="form-control" type="email" name="userEmail" id="userEmail" >
                <p class="userEmailErr text-danger"> </p>
                <input placeholder="Enter your Phone" oninput="ValidatePhone();ValidateVals();" class="form-control" type="tel" name="userPhone" id="userPhone" >
                <p class="userPhoneErr text-danger"> </p>

                <input placeholder="Enter your Age" class="form-control" type="text" name="userAge" id="userAge">
                
                <input placeholder="Enter your Password" oninput="ValidatePassword();ValidateVals();" class="form-control" type="password" name="userPassword" id="userPassword" >
                <p class="userPasswordErr text-danger"> </p>
                <input placeholder="Re-enter your Password" oninput="ValidaterePassword();ValidateVals();" class="form-control" type="password" name="rePassword" id="rePassword" >
                <p class="rePasswordErr text-danger"> </p>
            </div>
            <button id="btnSubmit" >Submit</button> 
            <p class="globalErr text-danger"></p>
    </div>
</div>
    `);

    //selectors to get vals to validate
    loadContactData()


}

// Conatact us logic

let userName;let userEmail;let userAge;   let userPhone ;  let userPassword;let rePassword;

let userNameErr;let userEmailErr;   let userPasswordErr;let rePasswordErr ; let userPhoneErr;   let globalErr ;     

let loadContactData = ()=>{
    // Get inputs data from user
    userName   = document.querySelector("#userName");
    userEmail   = document.querySelector("#userEmail");
    userAge   = document.querySelector("#userAge");
    userPhone   = document.querySelector("#userPhone");
    userPassword= document.querySelector("#userPassword");
    rePassword  = document.querySelector("#rePassword");


    // Submit checks
    let btnSubmit      = document.querySelector("#btnSubmit");
        btnSubmit.disabled = true;
    // Submit
    btnSubmit.addEventListener("click",()=>{
        if (ValidateVals()){
            loadOnSubmit(userName.value);
        }

    });

    // Errors Handler p
    userNameErr    = document.querySelector(".userNameErr");
    userEmailErr   = document.querySelector(".userEmailErr");
    userPasswordErr= document.querySelector(".userPasswordErr");
    rePasswordErr  = document.querySelector(".rePasswordErr");
    userPhoneErr   = document.querySelector(".userPhoneErr");
    globalErr      = document.querySelector(".globalErr");

    


}



// Realtime Validation 
// Name
let ValidateName = function(){
    try{ globalErr.innerHTML= ""; }catch(e) {}
    if(!(/^[a-zA-Z0-9]{4,}$/.test(userName.value)) ){
        userNameErr.innerHTML= `<i class="fa-solid fa-circle-exclamation p-2"></i>Please Enter Valid Name more than 4 chars `;
        return false;
    }else{
        if(userName.value == ""){
            userNameErr.innerHTML= "";
            return false;
        }else{
            userNameErr.innerHTML= "";
            return true;
        }
    }
}

// Email
let ValidateEmail = function(){
    try{ globalErr.innerHTML= ""; }catch(e){}
    
    if(!(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(userEmail.value))){
        userEmailErr.innerHTML= `<i class="fa-solid fa-circle-exclamation p-2"></i>Please Enter Valid email,must have @ and ex:.com `;
        return false;
    }else{
        if(userEmail.value === ""){
            userEmailErr.innerHTML= "";
            return false;
        }else{
            userEmailErr.innerHTML= "";
            return true;
        }
    }
}

// phone

let ValidatePhone = function(){
    try{globalErr.innerHTML= "";}catch(e){}

    if(!(/^01[0-2]\d{8}$/.test(userPhone.value))){
        userPhone.value = (userPhone.value).substring(0,11);
        userPhoneErr.innerHTML= `<i class="fa-solid fa-circle-exclamation p-2"></i>Please Enter Valid phone number 011,012,015 (11 chars)`;
        return false;
    }else{
        if(userPhone.value === ""){
            userPhoneErr.innerHTML= "";
            return false;
        }else{
            userPhoneErr.innerHTML= "";
            return true;
        }
        
    }
}

// password
var ValidatePassword = function (){
    try{ globalErr.innerHTML= ""; }catch(e){}

    ValidaterePassword(userPassword.value,rePassword.value);
    
    if(!(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(userPassword.value))){
        userPasswordErr.innerHTML= `<i class="fa-solid fa-circle-exclamation p-2"></i>Please Enter Valid password start with capital letter and more than 8 chars,number and must have a special character.`;
        return false;
    }else{
        if(userPassword.value === ""){
            userPasswordErr.innerHTML= "";
            return false;
        }else{
            userPasswordErr.innerHTML= "";
            return true;
        }
        
    }

}

// Password match
var ValidaterePassword = function (){
    try{ globalErr.innerHTML= ""; }catch(e){}
    if(userPassword.value != rePassword.value){
        rePasswordErr.innerHTML= `<i class="fa-solid fa-circle-exclamation p-2"></i> Password not matched`;   
        return false;
        
    }  else{
        if(rePassword.value != ''){
            rePasswordErr.innerHTML= `<i class="fa-solid fa-circle-check p-2 text-success"></i> <span class="text-success" >Password matched</span>`;
            return true;
        }
        else{
            rePasswordErr.innerHTML= `<i class="fa-solid fa-circle-exclamation p-2"></i> Password not matched`;   
            return false;
        }
            
        
    }
    
}



// Validate on register
let ValidateVals = function(){
    // Check if all is not null or empty 
    // All func validations return true
    // if all not empty ru n btn disable

    let c1 = (/^[a-zA-Z0-9]{4,}$/.test(userName.value))  & (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(userEmail.value))& (/^01[0-2]\d{8}$/.test(userPhone.value)) & (/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(userPassword.value)) & (userPassword.value == rePassword.value);
    let c2 = (userName.value != null ) && (userEmail.value != null ) && (userPhone.value != null ) && (userAge.value != null) && (userPassword.value != null) && (rePassword.value != null);
    
    if(c1 ){
        if(c2){
        btnSubmit.disabled = false;
        btnSubmit.style.border = '1px solid red';
        globalErr.innerHTML= `<i class="fa-solid fa-circle-check p-2 text-success"></i> <span class="text-success" >All set ready to submit</span>`;
        return true;
    }}else{
        btnSubmit.disabled = true;
        btnSubmit.style.border = 'none';
        return false;
    }
    
}

let loadOnSubmit = (name)=>{
    $("#main").html(`
    <div id="loading" class="bg-transparent">
    <div class="loader"></div>
    </div>
    `);

    $("#loading").fadeOut(200);
    $("#main").html(`
    <div id="custom-card">
    <div class="card-2 mt-3 bg-white opacity-75 p-5 rounded rounded-2">
            <h1 class="text-dark">Thanks ${name} </h1>
            <p class="text-muted">your response submitted successfuly.</p>
            
            <button id="btnContact" class="btn btn-warning">Conatct Us</button> 
    </div>
</div>
    `);
    $("#btnContact").click(()=>{
        loadContactPage();
    })

}

