function navdisplay()
{  
    if( (window.location.href == "http://localhost:3000/ui/login/user") ||
        (window.location.href == "http://localhost:3000/ui/signup/user") ||
        (window.location.href == "http://localhost:3000/ui/login/organizer") ||
        (window.location.href == "http://localhost:3000/ui/signup/organizer") ) ;
    else {
            document.getElementById(b.username).innerHTML=`Welcome ${user.name}`;
         }
}
navdisplay();