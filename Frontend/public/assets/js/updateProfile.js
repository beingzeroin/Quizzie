function showdata() {
    $.ajax({
        url: "/api/user/5f37bfefcdd70f3e64bede36",
        method: "GET",
        success: function(result) {
            this.details = result;
            document.getElementById("1").value = result.name;
            document.getElementById("2").value = result.mobileNumber;

        },
        error: function(err) {
            console.log(err);
        }
    });
}
//  showdata();