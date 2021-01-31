$.ajaxSetup({
    headers: { 'token': localStorage.token }
});

let userquiz = `<button class="btn btn-success" type="button" onclick="privateQuiz()" style="margin-top:-10%"> <i class="fa fa-check" aria-hidden="true"></i> JOIN A QUIZ</button>
<div class="modal" id="privateQuiz">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <h5 style="text-align:center"><b>JOIN A PRIVATE QUIZ</b></h5>
            <p style="text-align:center">Enter private code of quiz you want to join</p>
            <div class="input-group"><input class="form-control mb-4" id="code" style="border-color:rgba(0, 0, 0, 0.54) !important" type="text" placeholder="ENTER QUIZ CODE" aria-label="ENTER QUIZ CODE" aria-describedby="addon-wrapping" /></div><button class="btn btn-success"  onClick=enrollprivate() type="button">JOIN QUIZ</button>
        </div>
    </div>
</div>`
let createquiz = `<a href="/ui/quiz/createQuiz"><button type="button"class="button btn" style="margin-top:-10%;background-color:#FF0000;color:white;"><i class="fa fa-plus" aria-hidden="true"> </i> CREATE A QUIZ</button></a>`
let enrolledQuizzes = `<h3 style="padding-top:3%;color:#066EF7;">Enrolled Quizzes</h3>
<hr style="height:2px;width:100%;background-color:#066EF7;overflow:hidden;position:relative;" />
<div class="enrolled-list root1">
    <div id="enrolledQuizzes" style="display: inline !important;"></div>
    <div class="modal" id="quizpopup">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div id="displayquizpopup"></div>
            </div>
        </div>
    </div>
    <div class="modal" id="unenrollpopup">
        <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <h5 style="text-align:center">QUIZ INFO</h5>
            <div id="displayunenrollpopup" style="text-align:center"></div>
            </div>
        </div>
    </div>
</div>`


if (!localStorage.token)
    location.href = '/'


if (localStorage.usertype == "Owner")
    location.href = '/'
if (localStorage.usertype == "User") {

    $(document).ready(function() {
        window.history.forward();

        function noBack() {
            window.history.forward();
        }
    });

    $.ajax({
        url: "/api/user/",
        method: "GET",
        success: function(result) {

            document.getElementsByClassName('history')[0].style.display = "block";
            document.getElementById("userQuiz").innerHTML = userquiz
            document.getElementById("enrolledquiz").innerHTML = enrolledQuizzes
            let ans = JSON.stringify(result);
            let userdata = `<h4><label> name </label> : ${result.result1.name}<div class="row"></div>
            </h4>
            <h4><label>Email</label> : ${result.result1.email}</h4>`
            if (result.result1.mobileNumber) {
                userdata += `
            
                <div class="row"></div>
                <h4><label>Phone Number</label> :${result.result1.mobileNumber}</h4>`
            }

            userdata += `
            <div class="row"></div>
            <h4><label>Quizzes Enrolled</label> : ${(result.result1.quizzesEnrolled).length} </h4>
            <div class="row"></div>
            <h4><label>Quizzes Completed</label> : ${(result.result1.quizzesGiven).length}</h4>`
            document.getElementById("userdata").innerHTML = userdata
            ans = JSON.parse(ans);
            if ((ans.result1.quizzesEnrolled).length == 0) {
                document.getElementById("enrolledQuizzes").innerHTML = `<p>
            Sorry! No quizzes available  at the moment</p> `
            } else {
                let quizzesenrolled = ans.result1.quizzesEnrolled;
                console.log( quizzesenrolled);
                let code = ``;
                for (let i = 0; i < quizzesenrolled.length; i++) {
                    code += `<div class="card mr-5 mt-5 d-flex justify-content-between" style="width: 15rem;display:inline-block !important;">`
                    console.log( quizzesenrolled[i].quizId.topicName)
                    if( quizzesenrolled[i].quizId.topicName==undefined ||  quizzesenrolled[i].quizId.topicName=="None")
                    code+=`<img src="/assets/img/icons/bzfavicon.png" class="card-img-top" alt="...">`
                    else
                    code+=`<img src="/assets/img/icons/${quizzesenrolled[i].quizId.topicName}.png" class="card-img-top" alt="...">`        
               code+=`<div class="card-body">
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
        },
        error: function(err) {
            if (err.responseJSON.message == "Unauthorized access") {
                location.href = "/"
            }
        }
    })



    $.ajax({
        url: "/api/quiz/all",
        method: "GET",
        success: function(data) {
            // alert(data.message);
            //console.log(data);
            let publicquizzes = data.result;
            if ((publicquizzes).length == 0) {
                document.getElementById("UpcomingQuizzes").innerHTML = `<p>
        Sorry! No public quizzes available  at the moment</p> `
            } else {
                let publicQuizzes = []
                let code = ``;
                // alert(JSON.stringify(data.result.find(item => item.quizName == "MCQ")))
                for (let i = 0; i < publicquizzes.length; i++) {
                    if (publicquizzes[i].usersEnrolled.find(item => item.userId == localStorage.userid)) {

                    } else {
                        code= `<div class="card mr-5 mt-5 d-flex justify-content-between" style="width: 15rem;display:inline-block !important;">`
                        console.log(publicquizzes[i].topicName);
            if(publicquizzes[i].topicName==undefined || publicquizzes[i].topicName=="None")
            code+=`<img src="/assets/img/icons/bzfavicon.png" class="card-img-top" alt="...">`
            else
            code+=`<img src="/assets/img/icons/${publicquizzes[i].topicName}.png" class="card-img-top" alt="...">`

            code+=`<div class="card-body ">
            <div class="chip">
            <i class='far fa-clock' style='font-size:20px'></i> Remaining
            </div>
                <div class="row">
                    <div class="col-8 nopadding">
                    <p ><b>${publicquizzes[i].quizName}</b></p>
                    <span style="font-size:small;">By :${publicquizzes[i].adminId.name}</span>
                    </div>
                    <div class="col nopadding">
                    `

                        code += `<button type="button" class="btntick"style="float:right;border: none;" onClick="enrollQuizpopup('${(publicquizzes[i]._id)}','${publicquizzes[i].quizName}')">Enroll</button>`
                        code += `</div>
                </div>
          
            </div>
      </div>`
                        publicQuizzes.push(code);
                    }
                }
                let len = parseInt((publicQuizzes.length + 8) / 9);
                $('#show_paginator').twbsPagination({
                    totalPages: len,
                    visiblePages: 5,
                    next: 'Next',
                    prev: 'Prev',
                    onPageClick: function(event, page) {
                        let index = (page - 1) * 9;
                        let ans = ``;
                        for (let i = index; i < index + 9 && i < publicQuizzes.length; i++) {
                            ans += publicQuizzes[i];
                        }
                        document.getElementById("UpcomingQuizzes").innerHTML = ans

                    }
                });
                timer(publicquizzes);
            }

        },
        error: function(err) {
            if (err.responseJSON.message == "Unauthorized access") {
                location.href = "/"
            }
        }
    })
}

function secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? "hr, " : "hrs, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? "min, " : "mins, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? "sec" : "secs") : "";
    return hDisplay + mDisplay + sDisplay;
}
setInterval(timer, 1000);
var result, flag = 0;

function timer(res) {
    if (flag == 0) result = res;
    var c = 0;
    for (var i = 0; i < result.length; i++) {
        if (result[i].usersEnrolled.find(item => item.userId == localStorage.userid)) {} else {
            var sec = Math.round(new Date() / 1000);
            var quiztime = Number(result[i].scheduledFor) / 1000;
            var dtitle = secondsToHms(quiztime - sec);
            document.getElementsByClassName("chip")[c].innerHTML = `<i class='far fa-clock' style='font-size:20px'></i> ${dtitle}`;
            c++;
        }
    }
    flag = 1;

}

if (localStorage.usertype == "Admin") {
    let code1 = ``
    $.ajax({
        url: "/api/admin/",
        method: "GET",
        success: function(result) {
            let yourQuizzes = result.result1.quizzes;
            //console.log(yourQuizzes);
            for (let i = 0; i < yourQuizzes.length; i++) {
                code1 += `<div class="card mr-5 mt-5 d-flex justify-content-between" style="width: 15rem;display:inline-block !important;">`
                if(yourQuizzes[i].quizId.topicName==undefined || yourQuizzes[i].quizId.topicName=="None")
                code1+=`<img src="/assets/img/icons/bzfavicon.png" class="card-img-top" alt="...">`
                else
                code1+=`<img src="/assets/img/icons/${yourQuizzes[i].quizId.topicName}.png" class="card-img-top" alt="...">`
                code1+=`<div class="card-body ">
                    <div class="row">
                        <div class="col-8 nopadding">
                        <p ><b>${yourQuizzes[i].quizId.quizName}</b></p>
                        <span style="font-size: small;">By :You</span>
                        </div>
                        <div class="col nopadding">
                        `

                code1 += `<button type="button" class="btn btn-light" style="float:right;background-color:white;border: none;" onClick=editquizpage('${yourQuizzes[i].quizId._id}')><i class="fa fa-cog" aria-hidden="true"></i>
                </button>`

                code1 += `</div>
                    </div>
              
                </div>
          </div>`
            }
            document.getElementById("displayyourquizzes").innerHTML = code1
            document.getElementsByClassName('yourquizzes')[0].style.display = "block";
            document.getElementById("userQuiz").innerHTML = createquiz
            let userdata = `<h4><label> name </label> : ${result.result1.name}<div class="row"></div>
            </h4>
            <h4><label>Email</label> : ${result.result1.email}</h4>`
            if (result.result1.mobileNumber) {
                userdata += `
                <div class="row"></div>
                <h4><label>Phone Number</label> : ${result.result1.mobileNumber} </h4>`
            }


            document.getElementById("userdata").innerHTML = userdata
        },
        error: function(err) {
            if (err.responseJSON.message == "Unauthorized access") {
                location.href = "/"
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
                    if (publicquizzes[i].usersEnrolled.find(item => item.userId == localStorage.userid)) {

                    } else {
                        code += `<div class="card mr-5 mt-5 d-flex justify-content-between" style="width: 15rem;display:inline-block !important;">`
                        if(publicquizzes[i].topicName==undefined || publicquizzes[i].topicName=="None")
                        code+=`<img src="/assets/img/icons/bzfavicon.png" class="card-img-top" alt="...">`
                        else
                        code+=`<img src="/assets/img/icons/${publicquizzes[i].topicName}.png" class="card-img-top" alt="...">`
code+=`<div class="card-body ">
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

        },
        error: function(err) {
            if (err.responseJSON.message == "Unauthorized access") {
                location.href = "/"
            }
        }
    })
}

function openPage(pageName, elmnt, id) {
    var i, tabcontent, tablinks;
    if (id == 1) {
        document.getElementById("2").style.borderBottomColor = "white";
        document.getElementById("0").style.borderBottomColor = "white";
        document.getElementById("3").style.borderBottomColor = "white";
    } else if (id == 2) {
        document.getElementById("1").style.borderBottomColor = "white";
        document.getElementById("0").style.borderBottomColor = "white";
        document.getElementById("3").style.borderBottomColor = "white";

    } else if (id == 3) {
        document.getElementById("1").style.borderBottomColor = "white";
        document.getElementById("2").style.borderBottomColor = "white";
        document.getElementById("0").style.borderBottomColor = "white";

    } else {
        document.getElementById("1").style.borderBottomColor = "white";
        document.getElementById("2").style.borderBottomColor = "white";
        document.getElementById("3").style.borderBottomColor = "white";
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
        $.ajax({
            type: "GET",
            url: "/api/user/quiz/check",
            success: function(resultData) {
                var r = resultData.result;
                var h = "";
                for (var i = 0; i < r.length; i++) {
                    h += `<a href="/ui/result/${(r[i].quizId)._id}">
                     <button type="button" class="tester">
                            <div class="bar" style="width:15%">
                             <b class="para" style="font-size:100%"> ${(r[i].quizId).quizName} </b>
                             <p class="para">Score : ${r[i].marks} </p>
                            </div>
                           <a href="/ui/result/${(r[i].quizId)._id}"> <i class="fa fa-chevron-right fa-2x" id="icon" aria-hidden="true"></i> </a>
                     </button> </a>`;
                }
                document.getElementById("test").innerHTML = h;
            },
            error: function(err) {
                if (err.responseJSON.message == "Unauthorized access") {
                    location.href = "/"
                }
            }
        });
    }
    document.getElementById(pageName).style.display = "block";
    elmnt.style.borderBottom = "3px solid #2980b9";
   

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
            if (err.responseJSON.message == "Unauthorized access") {
                location.href = "/"
            }
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

        },
        error: function(err) {
            if (err.responseJSON.message == "Unauthorized access") {
                location.href = "/"
            }
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

function startQuiz(quizid) {
    $.ajax({
        url: "/api/quiz/start",
        data: { quizId: quizid },
        method: "PATCH",
        success: function(result) {
            // var strJSON = encodeURIComponent(JSON.stringify(result));

            location.href = '/ui/quiz/start?quizid=' + quizid;
        },
        error: function(error) {
            if (error.responseJSON.message == "Unauthorized access") {
                location.href = "/"
            } else {
                // alert(err.responseJSON.message)
                //quizstart
                var x = document.getElementById("snackbar");
                x.innerHTML = `<i class="fa fa-exclamation-circle" aria-hidden="true"></i> ${error.responseJSON.message}`
                x.className = "show";
                setTimeout(function() { x.className = x.className.replace("show", ""); }, 3000);
            }
        }
    })


}

function enrollQuiz(quizid) {
    // alert("hello")
    $.ajax({
        url: "/api/quiz/enroll",
        data: { quizId: quizid },
        method: "PATCH",
        success: function(result) {
            location.reload()
        },
        error: function(err) {
            if (err.responseJSON.message == "Unauthorized access") {
                location.href = "/"
            }
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
        },
        error: function(err) {
            if (err.responseJSON.message == "Unauthorized access") {
                location.href = "/"
            }
        }
    })

}

function enrollprivate() {
    let code = document.getElementById("code").value
        // alert('code')

    $.ajax({
        url: "/api/quiz/enrollPrivate",
        data: { quizCode: code },
        method: "PATCH",
        success: function(result) {
            location.reload()
        },
        error: function(error) {
            if (error.responseJSON.message == "Unauthorized access") {
                location.href = "/"
            } else {
                var x = document.getElementById("snackbar");
                if (error.responseJSON.message === "Invalid Code")
                    x.innerHTML = `<i class="fa fa-exclamation-circle" aria-hidden="true"></i> this quiz code doesnot exists!`
                else
                    x.innerHTML = `<i class="fa fa-exclamation-circle" aria-hidden="true"></i> ${error.responseJSON.message}`
                x.className = "show";
                setTimeout(function() { x.className = x.className.replace("show", ""); }, 3000);
                document.getElementById("code").value = ''
                    // alert(error.responseJSON.message)
                    ////invalid code
            }
        }
    })
}

function editquizpage(quizid) {
    window.location.href = '/ui/quiz/editQuiz/' + quizid
}