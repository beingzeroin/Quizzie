function mylogin() {
    document.getElementsByClassName("modal")[0].innerHTML = `
    <div id="myModal" class="modal-dialog.modal-dialog-centered">
    <div id="content" class="modal-content" style="background:azure">
    <div><b class="dia">Are you a student or an organizer?
    </b><br/>
    <a href="/ui/login/user"><button class="btns" type="button" style="color:#2980B9; margin-right:6%;">STUDENT</button></a>
    <a href="/ui/login/organizer"><button class="btno" type="button" style="color:#F50057;">ORGANIZER</button></a>
    </div>
    </div>`

    var modal = document.getElementsByClassName("modal")[0];
    modal.style.display = "block";
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
            document.body.style.backgroundColor = "#f8f9fa";
        }
    }
    document.body.style.backgroundColor = "lightgrey";

}

function mysignup() {
    document.getElementsByClassName("modal")[0].innerHTML = `
    <div id="myModal" class="modal-dialog.modal-dialog-centered">
    <div id="content" class="modal-content" style="background:azure">
    <div><b class="dia">Are you a student or an organizer?
    </b><br/>
    <a href="/ui/signup/user"><button class="btns" type="button" style="color:#2980B9; margin-right:6%;">STUDENT</button></a>
    <a href="/ui/signup/organizer"><button class="btno" type="button" style="color:#F50057;">ORGANIZER</button></a>
    </div>
    </div>`

    var modal =document.getElementsByClassName("modal")[0];
    modal.style.display = "block";
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
            document.body.style.backgroundColor = "#f8f9fa";
        }
    }
    document.body.style.backgroundColor = "lightgrey";
}