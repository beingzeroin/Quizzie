
$.ajaxSetup({
    headers: { 'token': localStorage.token }
  });
  
  if (!localStorage.token)
      location.href = '/'
  
function IsPhoneno(phoneno) {
    var regex = /^([7-9][0-9]{9})$/g;
    if (!regex.test(phoneno)) return false;
    else return true;
}

function updatedata(data) {
    if (localStorage.usertype == "User") {
        $.ajax({
            url: "/api/user/updateProfile",
            data: data,
            method: "PATCH",
            success: function(result) {
                console.log(result);
                location.href = "/ui/dashboard";
            },
            error: function(err) {
                console.log(err);
            }
        });
    } else if (localStorage.usertype == "Admin") {
        $.ajax({
            url: "/api/admin/updateProfile",
            data: data,
            method: "PATCH",
            success: function(result) {
                console.log(result);
                location.href = "/ui/dashboard";
            },
            error: function(err) {
                console.log(err);
            }
        });
    }
}

function validate() {
    var name = document.getElementById("1").value;
    var mobile = document.getElementById("2").value;
    var check = true;
    let c = 0;
    let d = 0;
    let e = 0;
    let f = 0;
    if (name === '') {
        check = false;
        c = 1;
    }
    if (mobile == '') {
        d = 1;
        check = false;
    }
    if (!IsPhoneno(mobile)) {
        f = 1;
        check = false;
    }
    if (mobile && mobile.length != 10) {
        e = 1;
        check = false;
    }
    if (c == 1 && d == 1) {
        document.getElementById("nameerror").innerHTML = "Please Enter Name";
        document.getElementById("phoneerror").innerHTML = "Please Enter Mobile Number";
    } else {
        if (c == 0 && d == 0) {
            document.getElementById("nameerror").innerHTML = "";
            if (e == 1) {
                document.getElementById("phoneerror").innerHTML = "Please Enter 10 digits Mobile Number";
            } else if (f == 1) {
                document.getElementById("phoneerror").innerHTML = "Please Enter Valid  Mobile Number";
            } else
                document.getElementById("phoneerror").innerHTML = '';
        } else if (c == 1 && d == 0) {
            document.getElementById("nameerror").innerHTML = "Please Enter Name";
            if (e == 1) {
                document.getElementById("phoneerror").innerHTML = "Please Enter 10 digits Mobile Number";
            } else if (f == 1) {
                document.getElementById("phoneerror").innerHTML = "Please Enter Valid  Mobile Number";
            } else
                document.getElementById("phoneerror").innerHTML = '';
        } else if (c == 0 && d == 1) {
            document.getElementById("nameerror").innerHTML = "";
            document.getElementById("phoneerror").innerHTML = "Please Enter Mobile Number";
        }
    }
    if (check) {
        updatedata({ "name": name, "mobileNumber": mobile });
    }
}
$(document).ready(function(){
    if(localStorage.usertype=="Admin")
    {
        $.ajax({
            url: "/api/admin/"+localStorage.userid,
            method: "GET",
            success: function(result) {
                console.log(result);
                $("#1").val(result.name);
                try{
                    $("#2").val(result.mobileNumber);
                }
                catch(e)
                {
                    $("#2").val('');
                }
                
                
            },
            error: function(err) {
                console.log(err);
            }
        }); 
    }
    else
    {
        $.ajax({
            url: "/api/user/"+localStorage.userid,
            method: "GET",
            success: function(result) {
                console.log(result);
                $("#1").val(result.name);
                try{
                    $("#2").val(result.mobileNumber);
                }
                catch(e)
                {
                    $("#2").val('');
                }
                
                
            },
            error: function(err) {
                console.log(err);
            }
        }); 
    }
});