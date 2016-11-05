/**
 * Created by bogaziciswe574_group1 on 23/10/16.
 */
function processServiceLoginResponse(serviceResponse) {
    if (serviceResponse.success) {
        alert(JSON.stringify(serviceResponse.data));
        //window.location.href = "/popup/annotationLanding.html";
        //chrome.browserAction.setPopup({popup: "/popup/annotationLanding.html"});
    } else {
        alert(serviceResponse.getErrorPrompt());
    }
}

document.addEventListener("click", function (e) {
    if (e.target.id == "loginButton") {
        var username = $('#username').val();
        var password = $('#password').val();
        loginUser(username, password, processServiceLoginResponse);
    }

    if (e.target.id == "registerButton") {
        window.location.href = "/html/register.html";
        chrome.browserAction.setPopup({popup: "/html/register.html"});
    }
});