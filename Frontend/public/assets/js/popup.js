function mylogin() {
    document.getElementById("pop").innerHTML =  `
    <div id="myModal" class="modal">
    <div class="modal-content">
    
    <div style="background:azure"><h style="margin-left:1vw;font-size:120%"><b>Are you a student or an organizer?</b></h>
    <br />
    <br />
    <a href="/login"><button class="btn" type="button" style="color:white; margin-left:5em; margin-right:5em; background:dodgerblue">Student</button></a>
    <a href="/ui/login/organizer"><button class="btn" type="button" style="color:white;background:Red;">Organizer</button></a>
    <br />
    <br />
    </div>
    </div>`

var modal = document.getElementById("myModal");
modal.style.display = "block";
window.onclick = function(event) {if (event.target == modal) 
{modal.style.display = "none";
document.body.style.backgroundColor="azure";}}
document.body.style.backgroundColor="darkgray";

 }

 function mysignup() {
    document.getElementById("pop").innerHTML =  `
    <div id="myModal" class="modal">
    <div class="modal-content">
    
    <div style="background:azure"><h style="margin-left:3em;font-size:120%"><b>Are you a student or an organizer?</b></h>
    <br />
    <br />
    <a href="/signup"><button class="btn" type="button" style="color:white; margin-left:5em; margin-right:5em; background:dodgerblue">Student</button></a>
    <a href="/ui/signup/organizer"><button class="btn" type="button" style="color:white;background:Red;">Organizer</button></a>
    <br />
    <br />
    </div>
    </div>`

var modal = document.getElementById("myModal");
modal.style.display = "block";
window.onclick = function(event) {if (event.target == modal) 
{modal.style.display = "none";
 document.body.style.backgroundColor="azure";
}}
document.body.style.backgroundColor="darkgray";
 }


