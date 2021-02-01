function reset() {

    var userType = location.href.split('/').slice(-1)[0];
    var sid = String(document.getElementsByClassName("sid")[0].value);
    var password = String(document.getElementsByClassName("password")[0].value);
    //alert(String(window.location.href));
    var c = 2;
   
    if (sid == "") {
        document.getElementById("sidalert").innerHTML = `Please Enter the Your Verification Key!`;
        c--;
    } else document.getElementById("sidalert").innerHTML = ``;
    if (password == "") {
        document.getElementById("passwordalert").innerHTML = `Please Enter the Password!`;
        c--;
    } else document.getElementById("passwordalert").innerHTML = ``;

   
   
    //ajax call to verify email of an instance of the user in database
    if (c == 2) {
        $.ajax({
            type: "POST",
            url: "/api/"+ userType +"/resetpass",
            async: false,
            data: {
            resetKey: sid,
            newPassword: password
            },
            success: function(resultData) {
                //console.log(JSON.stringify(resultData))
                if (resultData.message == "Password updated") {
                    
                    var x = document.getElementById("snackbar");
                    x.style.backgroundColor="green";
                    x.innerHTML = `${resultData.message}`
                    x.className = "show";
                    setTimeout(function() { x.className = x.className.replace("show", ""); }, 5000);
                    if(userType=="user")
                    window.location.href = '/ui/login/user';
                    else window.location.href = '/ui/login/organizer';
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