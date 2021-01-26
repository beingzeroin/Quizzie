function signup() {
    //Email verification
    function IsEmail(email) {
        var regex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
        if (!regex.test(email)) return false;
        else return true;
    }

    //Phone Number verfication
    function IsPhoneno(phoneno) {
        var regex = /^([7-9][0-9]{9})$/g;
        if (!regex.test(phoneno)) return false;
        else return true;
    }

    var emailid = String(document.getElementsByClassName("email")[0].value);
    var phoneno = String(document.getElementsByClassName("phone")[0].value);
    var password = String(document.getElementsByClassName("password")[0].value);
    var name = String(document.getElementsByClassName("name")[0].value);
    var position = String(document.getElementsByClassName("position")[0].value);
    var code = String(document.getElementsByClassName("code")[0].value);
    //alert(String(window.location.href));
    var c = 6;
    if (code == "") {
        document.getElementById("codealert").innerHTML = `Enter secret code`;
        c--;
    } else document.getElementById("codealert").innerHTML = ``;
    if (position == "") {
        document.getElementById("positionalert").innerHTML = `Enter board position`;
        c--;
    } else document.getElementById("positionalert").innerHTML = ``;
    if (name == "") {
        document.getElementById("namealert").innerHTML = `Please Enter the name!`;
        c--;
    } else document.getElementById("namealert").innerHTML = ``;
    if (emailid == "") {
        document.getElementById("emailalert").innerHTML = `Please Enter the email!`;
        c--;
    } else document.getElementById("emailalert").innerHTML = ``;
    if (password == "") {
        document.getElementById("passwordalert").innerHTML = `Please Enter the Password!`;
        c--;
    } else document.getElementById("passwordalert").innerHTML = ``;
    if (!IsPhoneno(phoneno)) {
        document.getElementById("phonealert").innerHTML = `Invalid PhoneNo.`;
        c--;
    } else document.getElementById("phonealert").innerHTML = ``;

    if (c == 6) {
        if (!IsEmail(emailid)) {
            document.getElementById("emailalert").innerHTML = `Invalid Email!`;
            c--;
        } else document.getElementById("emailalert").innerHTML = ``;
        if (!IsPhoneno(phoneno)) {
            document.getElementById("phonealert").innerHTML = `Invalid PhoneNo.`;
            c--;
        } else document.getElementById("phonealert").innerHTML = ``;
    }

    //ajax call to create an instance to the user in database
    if (c == 6) {
        $.ajax({
            type: "POST",
            url: "/api/owner/signup",
            data: {
                email: emailid,
                name: name,
                mobileNumber: phoneno,
                password: password,
                boardPosition: position,
                signupCode: code
            },
            success: function(resultData) {

                window.location.href = '/ui/login/owner';
            }, //sucess
            error: function(error) {
                    var x = document.getElementById("snackbar");
                    x.innerHTML = `<i class="fa fa-exclamation-circle" aria-hidden="true"></i> ${error.responseJSON.message}`
                    x.className = "show";
                    setTimeout(function() { x.className = x.className.replace("show", ""); }, 3000);
                } //error
        });
    }

} //End of signup function