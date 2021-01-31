function verify() {
    var userType = location.href.split('/').slice(-1)[0];
    var sid = String(document.getElementsByClassName("sid")[0].value);
    //alert(String(window.location.href));
    var c = 1;
   
    if (sid == "") {
        document.getElementById("sidalert").innerHTML = `Please Enter the Verification Code!`;
        c--;
    } else document.getElementById("sidalert").innerHTML = ``;
   
    //ajax call to verify email of an instance of the user in database
    if (c == 1) {
        $.ajax({
            type: "PATCH",
            url: "/api/"+ userType +"/verifyEmail",
            async: false,
            data: {
            verificationKey: sid,
            },
            success: function(resultData) {
                //console.log(JSON.stringify(resultData))
                if (resultData.message == "User verified") {
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