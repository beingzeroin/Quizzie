function navdisplay()
{   var page =location.href.split('/').slice(-2)[0];
    if(page=="login" || page=="signup")
    {var h=`<button type="button" onclick='popup()' style="width=16%;height:35px;font-weight:bold;color:white;background:#2980B9 !important;border:none;border-radius:3px;">LOGIN</button>`;
     document.getElementById("btx").innerHTML=h;
    } 
    else  
    {var h=`<button type="button" onclick='logout()' style="height:35px;color:white;font-weight:bold;background:orange;border:none;border-radius:3px;font-size:80%">LOGOUT</button>`;
     document.getElementById("btx").innerHTML=h;
     document.getElementById("username").innerHTML=`Welcome ${localStorage.username}`; }
}
navdisplay();

function logout()
{   localStorage.clear();
    window.location.href ="/";
}