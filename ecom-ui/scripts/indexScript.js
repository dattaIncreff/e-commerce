$( document ).ready(function() {
    let userID = localStorage.getItem('userID');
    if(userID){
        $('.already-logged-in-container').attr("style", "display:block");
        $('.sign-in-container').attr("style", "display:none");
    }
    else{
        $('.already-logged-in-container').attr("style", "display:none");
        $('.sign-in-container').attr("style", "display:block");
    }

});

function home(){
    window.location.href = "/home.html";
}


function logout(){
    localStorage.removeItem('userID');
    sessionStorage.removeItem('cart');
    location.reload();
}

function signIn(){
    let emailElement = $('#email');
    let passElement = $('#pass');

    let email =  emailElement.val().toLowerCase();
    let pass = passElement.val();

    if(isEmail(email)){
        if(pass != ""){
            let user = null;
            const promise1 = new Promise((resolve, reject) => {
                $.getJSON('assets/json/users.json', function(data) {
                    data.forEach(element => {
                        if(element.email == email && element.pass != pass) resolve(2);
                        if(element.email == email && element.pass == pass){
                            user = element;
                            resolve(1);
                        }
                    });
                    resolve(0);       
                }).fail(()=>{
                    $('#myModal').modal('show'); 
                });
            });
            promise1.then((value)=>{
                if(value == 0){
                    let toolTipText = "Invalid email-ID";
                    showToolTip(emailElement, toolTipText);
                    
                }
                else if(value == 2) {
                    let toolTipText = "Invalid password";
                    showToolTip(passElement, toolTipText);
                }
                else if(value == 1){
                    localStorage.setItem("userID", JSON.stringify(user.userID));
                    window.location = "/home.html";
                    console.log("user found");
                }
            });
        }
        else{

            let toolTipText = "Invalid Password";
            showToolTip(passElement, toolTipText);
        }
    }
    else{
        let toolTipText = "Invalid email-ID";
        showToolTip(emailElement, toolTipText);
    }
}

function eye(){
    let eyeElement = $('#eye');
    if(eyeElement.hasClass('bi-eye')){
        replaceClass("eye", 'bi-eye', 'bi-eye-slash');
        $('#pass').attr("type", "text");
    }
    else{
        replaceClass("eye", 'bi-eye-slash', 'bi-eye');
        $('#pass').attr("type", "password");

    }
}

function showToolTip(el, text){

    //clear all timeouts
    let timeoutPromise = new Promise((resolve,reject)=>{
        var id = window.setTimeout(function() {}, 0);
        while (id--) {
            window.clearTimeout(id); // will do nothing if no timeout with id is present
        }
        resolve(1);
    });
    timeoutPromise.then(()=>{
        console.log("hehe");
        el.attr('title', text);

        el.tooltip('enable');
        el.tooltip('show');
                        
        let tooltipTimeout = null;
    
        tooltipTimeout = setTimeout(function(){
            el.tooltip('hide');
            el.tooltip('disable');
            clearTimeout(tooltipTimeout);
        }, 2000);
    });
    

}

function hideModal(){
    $('#myModal').modal('hide'); 
}

function isEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}


function replaceClass(id, oldClass, newClass) {
    var elem = $(`#${id}`);
    if (elem.hasClass(oldClass)) {
        elem.removeClass(oldClass);
    }
    elem.addClass(newClass);
}
 