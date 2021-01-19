alert(JSON.stringify(data))
localStorage.token = data.token;
localStorage.userid = data.userId
localStorage.username = data.name
localStorage.usertype = data.userType
window.href = '/ui/dashboard'