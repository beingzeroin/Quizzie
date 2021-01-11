function signup()
{ 
  //Email verification
  function IsEmail(email){
  var regex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
  if (!regex.test(email)) return false;
  else return true; }
  
  //Phone Number verfication
  function IsPhoneno(phoneno){
    var regex =  /^([7-9][0-9]{9})$/g;
    if (!regex.test(phoneno)) return false;
    else return true; }

  var emailid =String(document.getElementsByClassName("email")[0].value);
  var phoneno =String(document.getElementsByClassName("phone")[0].value);
  var password =String(document.getElementsByClassName("password")[0].value);
  var name =String(document.getElementsByClassName("name")[0].value);
 // alert(emailid+phoneno+password+name);
  var c=4;
  if(name=="")
  {document.getElementById("namealert").innerHTML=`Please Enter the name!`; c--;}
  else document.getElementById("namealert").innerHTML=``;
  if(emailid=="")
  {document.getElementById("emailalert").innerHTML=`Please Enter the email!`; c--;}
  else document.getElementById("emailalert").innerHTML=``;
  if(password=="")
  {document.getElementById("passwordalert").innerHTML=`Please Enter the Password!`; c--;}
  else document.getElementById("passwordalert").innerHTML=``;

  if(c==4)
  { if(!IsEmail(emailid))
    {document.getElementById("emailalert").innerHTML=`Invalid Email!`; c--;}
    else document.getElementById("emailalert").innerHTML=``;
    if(!IsPhoneno(phoneno) && phoneno!="")
    {document.getElementById("phonealert").innerHTML=`Invalid PhoneNo.`; c--;}
    else document.getElementById("phonealert").innerHTML=``;
  }

  //ajax call to create an instance to the user in database
  if(c==4)
  { $.ajax({
    type: "POST",
    url: "/api/user/signup",
    async: false,
    data: { email        : emailid,
            name         : name,
            mobileNumber : phoneno,
            password     : password }, 
    success: function (resultData) {
      alert(resultData.message);
      if (resultData.message == "Email already exists")
        document.getElementById("emailalert").innerHTML=`This email already has an account`;
      if (resultData.message == "user created"){alert("Sucessfully Created");
      window.location.href="http://localhost:3000/login";
    }
      }//sucess
      });   
  }

}//End of signup function 