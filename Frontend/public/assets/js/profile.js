$.ajaxSetup({
    headers: { 'token': localStorage.token }
});
if (!localStorage.token) location.href = '/';

var userType = location.href.split('/').slice(-2)[0];
var userId = location.href.split('/').slice(-1)[0];

if(userType == "Admin")
{ $.ajax({
    type: "GET",
    url: "/api/admin/" + userId,
    headers: { 'token': localStorage.token },
    success: function(result) {
            //console.log(JSON.stringify(result));
    var code= `<div class = "row">
                     <h4> <label style="color:#2980B9"> UserType </label> : ${userType} </h4>
             </div>
             <div class = "row">
                     <h4> <label style="color:#2980B9"> UserId </label> : ${userId} </h4>
                </div>
             <div class = "row">
                 <h4> <label style="color:#2980B9"> Username </label> : ${result.name} </h4>
            </div>
             <div class = "row">
                 <h4> <label style="color:#2980B9"> Email </label> : ${result.email}</h4>
            </div>`;
        code+=`<div class = "row">
                 <h4> <label style="color:#2980B9"> Phone Number </label> :`;
                      if(result.mobileNumber) code+=` ${result.mobileNumber}</h4>`;
                      else code+=` Not Given</h4>`;
        code+=`</div>`;

        code+=`<div class = "row">
                 <h4> <label style="color:#2980B9"> Quizzes</label> :  ${(result.quizzes).length}</h4>
            </div>`;
            document.getElementById("profile").innerHTML=code;
        } //success
        ,
    error: function(err) {
        if (err.responseJSON.message == "Unauthorized access") {
            location.href = "/ui/dashboard"
        }
    }
});

}
else
{ $.ajax({
    type: "GET",
    url: "/api/user/" + userId,
    headers: { 'token': localStorage.token },
    success: function(result) {
            //console.log(JSON.stringify(result));
    var code= `<div class = "row">
                     <h4> <label style="color:#2980B9"> UserType </label> : ${userType} </h4>
             </div>
             <div class = "row">
                     <h4> <label style="color:#2980B9"> UserId </label> : ${userId} </h4>
                </div>
             <div class = "row">
                 <h4> <label style="color:#2980B9"> Username </label> : ${result.name} </h4>
            </div>
             <div class = "row">
                 <h4> <label style="color:#2980B9"> Email </label> : ${result.email}</h4>
            </div>`;
        code+=`<div class = "row">
                 <h4> <label style="color:#2980B9"> Phone Number </label> :`;
                      if(result.mobileNumber) code+=` ${result.mobileNumber}</h4>`;
                      else code+=` Not Given</h4>`;
        code+=`</div>`;

        code+=`<div class = "row">
                 <h4> <label style="color:#2980B9"> Quizzes Enrolled </label> :  ${(result.quizzesEnrolled).length}</h4>
            </div>`;
            document.getElementById("profile").innerHTML=code;
        } //success
        ,
    error: function(err) {
        if (err.responseJSON.message == "Unauthorized access") {
            location.href = "/ui/dashboard"
        }
    }
});

}