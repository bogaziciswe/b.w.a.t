/**
 * Created by bogaziciswe574_group1 on 23/10/16.
 */

function processServiceRegisterResponse(serviceResponse) {
    if (serviceResponse.success) {
        window.location.href = "/html/index.html";
        chrome.browserAction.setPopup({popup: "/html/index.html"});
    } else {
        alert(serviceResponse.getErrorPrompt());
    }
}

document.addEventListener("click", function (e) {
    if (e.target.id == "registerButton") {
        registerUser($('#firstname').val(), $('#lastname').val(), $('#password').val(), $('#email').val(), processServiceRegisterResponse);
    }

});