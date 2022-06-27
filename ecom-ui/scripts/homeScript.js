let inventory = null;

$( document ).ready(function() {
    loggedInHandler();
    const promise1 = new Promise((resolve,reject)=>{
        $.getJSON('assets/json/inventory.json', function(data){
            inventory = data;
            resolve();
        }).fail(()=>{
            $('#myModal').modal('show'); 
            reject();
        })
    }); 
    promise1.then(()=>{
        filterHandler();
    });


    $(".carousel").on("mouseenter",function() {
        console.log("enter");
        $(this).carousel('cycle');
      }).on("mouseleave", function() {
        console.log("leave")
        $(this).carousel('pause');
    });

      
});

function categoryHandler(categoryRadio){
    let filters = JSON.parse(sessionStorage.getItem('filters'));
    if(!filters){
        let emptyFilters = getEmptyFilters();
        emptyFilters.category = categoryRadio.value;
        sessionStorage.setItem('filters', JSON.stringify(emptyFilters));
    }
    else{
        filters.category = categoryRadio.value;
        sessionStorage.setItem('filters',JSON.stringify(filters));
    }
    filterHandler();
}

function priceHandler(){
    let val = $('#priceSlider').val();
    $('#price').html(val);
    val = Number(val);
    let filters = JSON.parse(sessionStorage.getItem('filters'));
    if(!filters){
        let emptyFilters = getEmptyFilters();
        emptyFilters.maxprice = val;
        sessionStorage.setItem('filters', JSON.stringify(emptyFilters));
    }
    else{
        filters.maxprice = val;
        sessionStorage.setItem('filters',JSON.stringify(filters));
    }
    filterHandler();
}

function ratingHandler(val){
    $('#rating').html(val);
    let filters = JSON.parse(sessionStorage.getItem('filters'));
    if(!filters){
        let emptyFilters = getEmptyFilters();
        emptyFilters.rating = val;
        sessionStorage.setItem('filters',JSON.stringify(emptyFilters));
    }
    else{
        filters.rating = val;
        sessionStorage.setItem('filters',JSON.stringify(filters));

    }
    filterHandler();
}

function getEmptyFilters(){
    let filters = {
        "category" : null,
        "maxprice" : null,
        "rating" : null,
    }
    return filters;
}

function filterHandler(){
    // DISPLAY     
    let filters = sessionStorage.getItem('filters');
    let filteredList = [];
    if(!filters){
        filteredList = inventory;
    }
    else{
        let fil = JSON.parse(filters);

        if(fil.maxprice != null) $('#price').html(fil.maxprice);
        if(fil.rating != null) $('#rating').html(fil.rating);
        inventory.forEach(element => {
            if( (fil.category == null || fil.category == element.category) && (fil.maxprice == null || fil.maxprice >= element.price) && (fil.rating == null || fil.rating <= element.rating)){
                filteredList.push(element);
            }
        });
    }

   

    console.log(filteredList);
    // $('.inventory').html("");
    // let cardTop = "<div class=' bg-light'>";
    // let imgTop = "<img class='img-responsive' src='";
    // let imgBottom = "' />"
    // let cardBottom = "</div>"

    // filteredList.forEach((element)=>{
    //     $('.inventory').append(cardTop);
    // });
    // $('.inventory').html(JSON.stringify(filteredList));
    


}

function loggedInHandler(){  
    let userID = localStorage.getItem('userID');

    if(userID){
        $.getJSON('assets/json/users.json', function(data) {
            data.forEach(element => {
                if(element.userID == JSON.parse(userID)){
                    sessionStorage.setItem('cart', JSON.stringify(element.cart));
                }
            });    
        }).fail(()=>{
            console.log("unable to load cart.");
        });

        //navbar icons
        $('#nav-cart-btn').attr("style", "display:block");
        $('#nav-upload-btn').attr("style", "display:block");
        $('#nav-profile-btn').attr("style", "display:block");
        $('#nav-logout-btn').attr("style", "display:block");
        $('#nav-login-btn').attr("style", "display:none");
    }
    else{
        $('#nav-cart-btn').attr("style", "display:block");
        $('#nav-upload-btn').attr("style", "display:block");
        $('#nav-profile-btn').attr("style", "display:none");
        $('#nav-logout-btn').attr("style", "display:none");
        $('#nav-login-btn').attr("style", "display:block");
    }
}

function logout(){
    localStorage.removeItem('userID');
    sessionStorage.removeItem('filters');
    sessionStorage.removeItem('cart');
    location.reload();
}

function login(){
    window.location.href = "/index.html";
}


