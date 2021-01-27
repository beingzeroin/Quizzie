$.ajaxSetup({
    headers: { 'token': localStorage.token }
});

if (!localStorage.token)
    location.href = '/'

if (!localStorage.token)
    location.href = '/'
if (localStorage.usertype != "Owner")
    location.href = '/'

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

element = document.getElementById("0");
if (typeof(element) != 'undefined' && element != null) {
    element.click();
    // showdata();
}

$.ajax({
    url: "/api/owner/allQuizzes",
    method: "GET",
    success: function(result) {
        // alert(JSON.stringify(result))
        let code = `<div class="list-group">`
        result = result.result;
        for (let i = 0; i < result.length; i++) {
            code += `<a class="list-group-item list-group-item-action" href="/ui/quiz/owner/${result[i]._id}" style="border:0 !important">
        <div class="row">
            <div class="col-11">
                <p id="quizname" style="color:black;">${result[i].quizName}</p>
                <p id="author">By:${result[i].adminId.name}</p>
            </div>
            <div class="col-1"><span class="iconify" data-icon="ion-ios-arrow-forward" data-inline="false" data-width="30" data-height="30" style="margin-top:5px;padding:0% !important"></span></div>
        </div>
    </a>`
        }
        code += `</div>`
        $("#allquizzes").html(code);
    },
    error: function(err) {
        if (err.responseJSON.message == "Unauthorized access") {
            location.href = "/"
        }
    }
})

$.ajax({
    url: "/api/owner/allUsers",
    method: "GET",
    success: function(result) {
        // alert(JSON.stringify(result))
        let code = `<div class="list-group">`
        result = result.result;
        // result[i]._id
        for (let i = 0; i < result.length; i++) {
            code += `<a class="list-group-item list-group-item-action" href="#" style="border:0 !important">
        <div class="row">
            <div class="col-11">
                <p id="quizname" style="color:black;">${result[i].email}</p>
                <p id="author">${result[i].name}</p>
            </div>
            <div class="col-1"><span class="iconify" data-icon="ion-ios-arrow-forward" data-inline="false" data-width="30" data-height="30" style="margin-top:5px;padding:0% !important"></span></div>
        </div>
    </a>`
        }
        code += `</div>`
        $("#allUsers").html(code);
    },
    error: function(err) {
        if (err.responseJSON.message == "Unauthorized access") {
            location.href = "/"
        }
    }
})

$.ajax({
    url: "/api/owner/allAdmins",
    method: "GET",
    success: function(result) {
        // alert(JSON.stringify(result))
        let code = `<div class="list-group">`
        result = result.result;
        // result[i]._id
        for (let i = 0; i < result.length; i++) {
            code += `<a class="list-group-item list-group-item-action" href="#" style="border:0 !important">
        <div class="row">
            <div class="col-11">
                <p id="quizname" style="color:black;">${result[i].email}</p>
                <p id="author">By:${result[i].name}</p>
            </div>
            <div class="col-1"><span class="iconify" data-icon="ion-ios-arrow-forward" data-inline="false" data-width="30" data-height="30" style="margin-top:5px;padding:0% !important"></span></div>
        </div>
    </a>`
        }
        code += `</div>`
        $("#allAdmins").html(code);
    },
    error: function(err) {
        if (err.responseJSON.message == "Unauthorized access") {
            location.href = "/"
        }
    }
})