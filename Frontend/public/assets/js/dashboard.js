function openPage(pageName, elmnt, id) {
    var i, tabcontent, tablinks;
    if (id == 1) {
        document.getElementById("2").style.borderBottomColor = "white";
        document.getElementById("0").style.borderBottomColor = "white";
    } else if (id == 2) {
        document.getElementById("1").style.borderBottomColor = "white";
        document.getElementById("0").style.borderBottomColor = "white";
    } else {
        document.getElementById("1").style.borderBottomColor = "white";
        document.getElementById("2").style.borderBottomColor = "white";
    }
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tabs");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].style.backgroundColor = "";
    } 
    document.getElementById(pageName).style.display = "block";
    elmnt.style.borderBottom = "3px solid rgb(6, 184, 255)";
}

let element = document.getElementById("0");

function showdata() {
    $.ajax({
        url: "/api/user/5f37bfefcdd70f3e64bede36",
        method: "GET",
        success: function(result) {
            document.getElementById("Profile").querySelectorAll(".details")[0].innerHTML = `
            <div class="row">
            <h4><label> name </label> : ${result.name} </h4>
            </div>
            <div class="row">
            <h4><label>Email</label> : ${result.email}</h4>
            </div>
            <div class="row">
            <h4><label>Phone Number</label> : ${result.mobileNumber}</h4>
            </div>
            <div class="row">
            <h4><label>Quizzes Enrolled</label> : 0</h4>
            </div>
            <div class="row">
            <h4><label>Quizzes Completed</label> : 0</h4>
            </div>
            `;

        },
        error: function(err) {
            console.log(err);
        }
    });
}
if (typeof(element) != 'undefined' && element != null) {
    element.click();
    // showdata();
}