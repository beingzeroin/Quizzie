if (usertype == "User") {
    $.ajax({
        url: "/api/user/",
        method: "GET",
        success: function(result) {
            let ans = JSON.stringify(result);
            ans = JSON.parse(ans);
            if ((ans.result1.quizzesEnrolled).length == 0) {
                document.getElementById("enrolledQuizzes").innerHTML = `<p>
            Sorry! No quizzes available  at the moment</p> `
            } else {
                let quizzesenrolled = ans.result1.quizzesEnrolled;
                let code = ``;
                for (let i = 0; i < quizzesenrolled.length; i++) {
                    code += `<div class="card mr-5 mt-5 d-flex justify-content-between" style="width: 15rem;display:inline-block !important;">
                <img src="/assets/img/icons/bzfavicon.png" class="card-img-top" alt="...">
                <div class="card-body">
                <div class="row">
                <div class="col-4 nopadding">
                <p  >${quizzesenrolled[i].quizId.quizName}</p>
                </div>
                <div class="col nopadding">
                <button  type="button" class="btn btn-light"style="float:right;background-color:white;border: none;" onClick="UnEnrollPopup('${(quizzesenrolled[i].quizId._id)}')"><i class="fa fa-info-circle fa-lg" aria-hidden="true"></i></button>
                <button type="button" class="btn btn-light" style="float:right;background-color:white;border: none;" onClick="startQuizPopup('${(quizzesenrolled[i].quizId._id)}','${quizzesenrolled[i].quizId.quizName}')"><i class="fa fa-play-circle fa-lg" aria-hidden="true"></i></button>       
                 </div>
                </div>
                 
                    </div>
              </div>`
                }

                document.getElementById("enrolledQuizzes").innerHTML = code
            }
        }
    })



    $.ajax({
        url: "/api/quiz/all",
        method: "GET",
        success: function(data) {
            // alert(data.message);
            let publicquizzes = data.result;
            if ((publicquizzes).length == 0) {
                document.getElementById("UpcomingQuizzes").innerHTML = `<p>
        Sorry! No public quizzes available  at the moment</p> `
            } else {
                let code = ``;
                // alert(JSON.stringify(data.result.find(item => item.quizName == "MCQ")))
                for (let i = 0; i < publicquizzes.length; i++) {
                    if (publicquizzes[i].usersEnrolled.find(item => item.userId == userid)) {

                    } else {
                        code += `<div class="card mr-5 mt-5 d-flex justify-content-between" style="width: 15rem;display:inline-block !important;">
            <img src="/assets/img/icons/bzfavicon.png" class="card-img-top" alt="...">
            <div class="card-body ">
                <div class="row">
                    <div class="col-8 nopadding">
                    <p ><b>${publicquizzes[i].quizName}</b></p>
                    <span style="font-size: small;">By :${publicquizzes[i].adminId.name}</span>
                    </div>
                    <div class="col nopadding">
                    `

                        code += `<button type="button" class="btn btn-light" style="float:right;background-color:white;border: none;" onClick="enrollQuizpopup('${(publicquizzes[i]._id)}','${publicquizzes[i].quizName}')"><i class="fas fa-check"></i></button>`

                        code += `</div>
                </div>
          
            </div>
      </div>`

                    }
                }
                document.getElementById("UpcomingQuizzes").innerHTML = code

            }

        }
    })
}

if (usertype == "Admin") {


    $.ajax({
        url: "/api/quiz/all",
        method: "GET",
        success: function(data) {
            // alert(data.message);
            let publicquizzes = data.result;
            if ((publicquizzes).length == 0) {
                document.getElementById("UpcomingQuizzes").innerHTML = `<p>
        Sorry! No public quizzes available  at the moment</p> `
            } else {
                let code = ``;
                // alert(JSON.stringify(data.result.find(item => item.quizName == "MCQ")))
                for (let i = 0; i < publicquizzes.length; i++) {
                    if (publicquizzes[i].usersEnrolled.find(item => item.userId == userid)) {

                    } else {
                        code += `<div class="card mr-5 mt-5 d-flex justify-content-between" style="width: 15rem;display:inline-block !important;">
            <img src="/assets/img/icons/bzfavicon.png" class="card-img-top" alt="...">
            <div class="card-body ">
                <div class="row">
                    <div class="col-8 nopadding">
                    <p ><b>${publicquizzes[i].quizName}</b></p>
                    <span style="font-size: small;">By :${publicquizzes[i].adminId.name}</span>
                    </div>
                    <div class="col nopadding">
                    `


                        code += `</div>
                </div>
          
            </div>
      </div>`

                    }
                }
                document.getElementById("UpcomingQuizzes").innerHTML = code

            }

        }
    })
}

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

    if (pageName == 'History') {
        var a = [{
                test: "Test1",
                score: 1
            },
            {
                test: "Test1",
                score: 2
            },
            {
                test: "Test3",
                score: 3
            },
            {
                test: "Test4",
                score: 4
            }
        ];
        var h = "";
        for (var i = 0; i < a.length; i++) {
            h += `<a href="results"><div class="test" ><div class="bar"><b class="para">` + a[i].test +
                `</b><p class="para">Score : ` + a[i].score +
                `</p></div><a href="/ui/result"><i class="fa fa-chevron-right fa-2x" aria-hidden="true" style="color:black;margin-top:.6em"></i></a></div></a>`;
        }
        document.getElementById("test").innerHTML = h;
        // tablinks[i].style.backgroundColor = "";
    }
    document.getElementById(pageName).style.display = "block";
    elmnt.style.borderBottom = "3px solid rgb(6, 184, 255)";
}

element = document.getElementById("0");

function showdata() {
    $.ajax({
        url: "/api/user/5f37bfefcdd70f3e64bede36",
        method: "GET",
        success: function(result) {
            document.getElementById("Profile").querySelectorAll(".details")[0].innerHTML = ` <
                                div class = "row" >
                                <
                                h4 > < label > name < /label> : ${result.name} </h
                            4 >
                                <
                                /div> <
                            div class = "row" >
                                <
                                h4 > < label > Email < /label> : ${result.email}</h
                            4 >
                                <
                                /div> <
                            div class = "row" >
                                <
                                h4 > < label > Phone Number < /label> : ${result.mobileNumber}</h
                            4 >
                                <
                                /div> <
                            div class = "row" >
                                <
                                h4 > < label > Quizzes Enrolled < /label> : 0</h
                            4 >
                                <
                                /div> <
                            div class = "row" >
                                <
                                h4 > < label > Quizzes Completed < /label> : 0</h
                            4 >
                                <
                                /div>
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

function privateQuiz() {
    var modal = document.getElementById("privateQuiz");
    modal.style.display = "block";
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

}

function UnEnrollPopup(quizid) {
    // alert(quizid)
    let modal = document.getElementById("unenrollpopup");
    let code = ``;

    $.ajax({
        url: "/api/quiz/" + quizid,
        method: "GET",
        success: function(data) {
            code += `
            <h5><b>Name: </b>${data.result.quizName}</h5>
            <h5><b>Date: </b>${new Date(Number(data.result.scheduledFor)).toDateString()}</h5>
            <h5><b>Time: </b>${new Date(Number(data.result.scheduledFor)).toLocaleTimeString()}</h5>
            `
            if (Date.now() >= Number(data.result.scheduledFor))
                code += `<p>Already Started!!</p>`
            else {
                code += `<p>Not Started!!</p>`
            }
            code += `<button type="button" class="btn btn-danger" onClick=unenroll('${quizid}')> <i class="fas fa-ban"></i> UnEnroll</button>`

            document.getElementById("displayunenrollpopup").innerHTML = code

        }
    })
    modal.style.display = "block";
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

function enrollQuizpopup(quizid, name) {
    // alert(quizid)
    let modal = document.getElementById("enrollpopup");
    let code = `<p style="text-align:center">Are you sure you want to join ${name}</p>`
    code += `<div class="text-center"><button type="button" class="btn btn-warning" onClick="enrollQuiz('${quizid}')">Yes</button>
    <button type="button"  class="btn btn-info closepopup">No</button></div>
    `
    document.getElementById("displayenrollpopup").innerHTML = code
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

function startQuizPopup(quizid, name) {
    // alert("hi")
    let modal = document.getElementById("quizpopup");
    let code = `<p style="text-align:center">Are you sure you want to start ${name}</p>`
    code += `<div class="text-center"><button type="button" class="btn btn-warning" onClick="startQuiz('${quizid}')">Yes</button>
    <button type="button"  class="btn btn-info closepopup">No</button></div>
    `
    document.getElementById("displayquizpopup").innerHTML = code

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

$("#enrollprivate").click(() => {
    let code = document.getElementById("code").value

    $.ajax({
        url: "/api/quiz/enrollPrivate",
        data: { quizCode: code },
        method: "PATCH",
        success: function(result) {
            location.reload()
        },
        error: function(error) {
            alert(JSON.stringify((error.responseText)))
            location.reload()

        }
    })
})

function startQuiz(quizid) {
    alert("hello")
}

function enrollQuiz(quizid) {
    // alert("hello")
    $.ajax({
        url: "/api/quiz/enroll",
        data: { quizId: quizid },
        method: "PATCH",
        success: function(result) {
            location.reload()
        }
    })

}

function unenroll(quizid) {
    $.ajax({
        url: "/api/quiz/unenroll",
        data: { quizId: quizid },
        method: "PATCH",
        success: function(result) {
            location.reload()
        }
    })

}