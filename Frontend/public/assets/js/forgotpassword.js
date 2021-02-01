function send() {

    function IsEmail(email) {
        var regex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
        if (!regex.test(email)) return false;
        else return true;
    }
    var userType = location.href.split('/').slice(-1)[0];
    var emailid = String(document.getElementsByClassName("emailid")[0].value);
    //alert(String(window.location.href));
    var c = 1;
   
    if (emailid == "") {
        document.getElementById("emailidalert").innerHTML = `Please Enter the Yuor E-mail id!`;
        c--;
    } else document.getElementById("emailalert").innerHTML = ``;

    if (c == 1) {
        if (!IsEmail(emailid)) {
            document.getElementById("emailalert").innerHTML = `Invalid Email!`;
            c--;
        } else document.getElementById("emailalert").innerHTML = ``;
    }
   
    //ajax call to verify email of an instance of the user in database
    if (c == 1) {
        $.ajax({
            type: "POST",
            url: "/api/"+ userType +"/forgot",
            async: false,
            data: {
            email: emailid,
            },
            success: function(resultData) {
                //console.log(JSON.stringify(resultData))
                if (resultData.message == "Password reset key sent to email") {
                    
                    var x = document.getElementById("snackbar");
                    x.style.backgroundColor="green";
                    x.innerHTML = `${resultData.message}`
                    x.className = "show";
                    setTimeout(function() { x.className = x.className.replace("show", ""); }, 5000);
                    if(userType=="user")
                    window.location.href = '/ui/resetpassword/user';
                    else window.location.href = '/ui/resetpassword/organizer';
                }
            }, //sucess
            error: function(resultData) {
                    if (resultData.responseJSON.message == "Unauthorized access") {
                        location.href = "/"
                    } else {
                        var x = document.getElementById("snackbar");

                        x.innerHTML = `<i class="fa fa-exclamation-circle" aria-hidden="true"></i> ${resultData.responseJSON.message}`
                        x.className = "show";
                        setTimeout(function() { x.className = x.className.replace("show", ""); }, 3000);
                    }
                } //error
        });
    }

} //End of signup function