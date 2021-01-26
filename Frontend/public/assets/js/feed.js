$.ajaxSetup({
    headers: { 'token': localStorage.token }
});
if (!localStorage.token) location.href = '/';

function show() {
    var quizId = location.href.split('/').slice(-1)[0];
    $.ajax({
        type: "GET",
        url: "/api/feedback/" + quizId,
        success: function(resultData) {
                var r = resultData.result1;
                $.ajax({
                    type: "GET",
                    url: "/api/quiz/" + quizId,
                    success: function(res) {
                            var quizName = res.result.quizName;
                            document.getElementsByClassName("name")[0].innerHTML = `Quiz: ${quizName}`;
                        } //success
                }); //inner ajax
                let feedbacks = [];
                var h = "";
                for (var i = 0; i < r.length; i++) {
                    h = `<div class="container">
                          <button type="button" id="feed" class="btn">
                            Username : ${r[i].userName} </br>
                            Userid   : ${r[i].userId}   </br>
                            FeedBack : ${r[i].description} </br>
                            Rating   : ${r[i].rating}
                           </button>
                           </div>`;
                    feedbacks.push(h);
                }
                let len = parseInt((feedbacks.length + 9) / 10);
                $('#show_paginator').twbsPagination({
                    totalPages: len,
                    visiblePages: 5,
                    next: 'Next',
                    prev: 'Prev',
                    onPageClick: function(event, page) {
                        let index = (page - 1) * 10;
                        let ans = ``;
                        for (let i = index; i < index + 10 && i < feedbacks.length; i++) {
                            ans += feedbacks[i];
                        }
                        document.getElementById("Feedback").innerHTML = ans;
                    }
                });

            } //sucess
    });
}
show();