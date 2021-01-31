function login() {
    //Email verification
    function IsEmail(email) {
        var regex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
        if (!regex.test(email)) return false;
        else return true;
    }

    var emailid = String(document.getElementsByClassName("email")[0].value);
    var password = String(document.getElementsByClassName("password")[0].value);
    // alert(emailid+phoneno+password+name);
    var c = 2;
    if (emailid == "") {
        document.getElementById("emailalert").innerHTML = `Please Enter the email!`;
        c--;
    } else document.getElementById("emailalert").innerHTML = ``;
    if (password == "") {
        document.getElementById("passwordalert").innerHTML = `Please Enter the Password!`;
        c--;
    } else document.getElementById("passwordalert").innerHTML = ``;

    if (c == 2) {
        if (!IsEmail(emailid)) {
            document.getElementById("emailalert").innerHTML = `Invalid Email!`;
            c--;
        } else document.getElementById("emailalert").innerHTML = ``;
    }

    //ajax call to create an instance to the user in database
    if (c == 2) {
        $.ajax({
            type: "POST",
            url: "/api/user/login",
            data: {
                email: emailid,
                password: password
            },
            success: function(resultData) {
                console.log(resultData);
                if (resultData.message == "Auth successful") {
                    localStorage.token = resultData.token;
                    localStorage.userid = resultData.userDetails.userId
                    localStorage.username = resultData.userDetails.name
                    localStorage.usertype = resultData.userDetails.userType
                    window.location.href = '/ui/dashboard';
                }
            }, //sucess
            error: function(error) {
                    if (error.responseJSON.message == "Unauthorized access") {
                        location.href = "/"
                    } else {
                        var x = document.getElementById("snackbar");
                        x.innerHTML = `<i class="fa fa-exclamation-circle" aria-hidden="true"></i> ${error.responseJSON.message}`
                        x.className = "show";
                        setTimeout(function() { x.className = x.className.replace("show", ""); }, 3000);
                    }
                } //error
        });
    }

} //End of login function