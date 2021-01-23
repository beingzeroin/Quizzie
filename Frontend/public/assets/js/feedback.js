$.ajaxSetup({
    headers: { 'token': localStorage.token }
});
if (!localStorage.token) location.href = '/';

// window.history.pushState(null, "", window.location.href);
// window.onpopstate = function() {
//     window.history.pushState(null, "", window.location.href);
// };

var c = 0;
$('#rating-form').on('change', '[name="rating"]', function() {
    c = $('[name="rating"]:checked').val();
    console.log(c);
});

function submit() {
    var feed = document.getElementById("feedback").value;
    var quizId = location.href.split('/').slice(-1)[0];
    if (feed == '') {
        var x = document.getElementById("snackbar");
        x.innerHTML = `<i class="fa fa-exclamation-circle" aria-hidden="true"></i> Please give feedback`
        x.className = "show";
        setTimeout(function() { x.className = x.className.replace("show", ""); }, 3000);
    } else if (!c || c == 0) {
        var x = document.getElementById("snackbar");
        x.innerHTML = `<i class="fa fa-exclamation-circle" aria-hidden="true"></i> Please give valid rating`
        x.className = "show";
        setTimeout(function() { x.className = x.className.replace("show", ""); }, 3000);
    } else {

        $.ajax({
            type: "POST",
            url: "/api/feedback/submit",
            data: {
                quizId: quizId,
                userId: localStorage.userid,
                userName: localStorage.username,
                description: feed,
                rating: c
            },
            success: function(resultData) {
                    if (resultData.message == "created") {
                        window.location.href = '/ui/result/' + quizId
                    }
                } //sucess
        })
    }
}