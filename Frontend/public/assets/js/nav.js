function navdisplay()
{   var page =location.href.split('/').slice(-2)[0];
    if(page=="login" || page=="signup")
    {var h=`<button type="button" onclick='popup()' style="width=15%;height:35px;color:white;background:dodgerblue;border:none;border-radius:3px;">Login</button>`;
     document.getElementById("btx").innerHTML=h;
    } 
    else  
    {var h=`<button type="button" onclick='logout()' style="height:35px;color:white;background:orange;border:none;border-radius:3px;">Logout</button>`;
     document.getElementById("btx").innerHTML=h;
     document.getElementById("username").innerHTML=`Welcome ${localStorage.username}`; }
}
navdisplay();

function logout()
{   localStorage.clear();
    window.location.href ="/";
}