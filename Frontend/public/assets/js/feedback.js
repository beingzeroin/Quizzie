$.ajaxSetup({
    headers: { 'token': localStorage.token }
});
if (!localStorage.token) location.href = '/';

function submit() {
    var feed = document.getElementById("feedback").value;
    var quizId = location.href.split('/').slice(-1)[0];

    $.ajax({
        type: "POST",
        url: "/api/feedback/submit",
        data: {
            quizId: quizId,
            userId: localStorage.userid,
            userName: localStorage.username,
            description: feed
        },
        success: function(resultData) {
                if (resultData.message == "created") {
                    window.location.href = "/ui/result/" + quizId

                }
            } //sucess
    })
}

function getStyle(x, styleProp) {
    if (x.currentStyle)
        var y = x.currentStyle[styleProp];
    else if (window.getComputedStyle)
        var y = document.defaultView.getComputedStyle(x, null).getPropertyValue(styleProp);
    return y;
}