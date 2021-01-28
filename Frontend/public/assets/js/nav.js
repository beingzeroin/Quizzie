function navdisplay() {
    var page = location.href.split('/').slice(-2)[0];
    var checkowner = location.href.split('/').slice(-1)[0];
    if (page == "login" || page == "signup") {
        var h = `<button type="button" onclick='popup()' style="width=16%;height:35px;font-weight:bold;color:white;background:#2980B9 !important;border:none;border-radius:3px;">LOGIN</button>`;
        document.getElementById("btx").innerHTML = h;
    } else {
        var h = `<button type="button" onclick='logout()' style="height:35px;color:white;font-weight:bold;background:orange;border:none;border-radius:3px;font-size:80%">LOGOUT</button>`;
        document.getElementById("btx").innerHTML = h;
        if (localStorage.usertype == "Owner") { document.getElementById("username").innerHTML = `Welcome ${localStorage.username}`; } else { document.getElementById("username").innerHTML = `Welcome ${localStorage.username}
               <button  type="button" id="suggest" style="outline:none;background-color:white;border:none;font-size:150%;color:gold;"
                   onclick='suggest()'>
                <i class="fas fa-lightbulb"></i>
               </button>`; }
    }
}
navdisplay();

function logout() {
    localStorage.clear();
    window.location.href = "/";
}

function suggest() {
    console.log("suggesting");
    var dom = `
    <div sytle="background-color:white !important;align-items:center">
         <h2>Suggestion_Form</h2>
         <textarea id="sug" name="sugest" rows="8" cols="40" style="float:down !important;"> </textarea>
         <button type="submit" class="btn btn-primary" onclick="post()">Submit</button>
    </div>`


    document.getElementById("displaysuggestpopup").innerHTML = dom;
    var modal = document.getElementById("suggestpopup");
    //document.getElementById("suggest").style.background="azure";

    modal.style.display = "block";
    $(".closepopup").click(() => {
        modal.style.display = "none";
    })
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

}

function post() {
    var suggest = document.getElementById("sug").value;
    $.ajax({
        type: "POST",
        url: "/api/suggest/submit",
        data: {
            userType: localStorage.usertype,
            userId: localStorage.userid,
            userName: localStorage.username,
            description: suggest,
        },
        success: function(resultData) {
                if (resultData.message == "created") { console.log("Yes"); }
            } //sucess
    })
    var modal = document.getElementById("suggestpopup");
    modal.style.display = "none";

}