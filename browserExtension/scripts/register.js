/**
 * Created by bogaziciswe574_group1 on 23/10/16.
 */

function processServiceRegisterResponse(serviceResponse) {
    if (serviceResponse.success) {
        loginUser(serviceResponse.data.uname, serviceResponse.data.password, autoLoginAfterSuccessfullRegister);
        window.location.href = "/html/index.html";
        chrome.browserAction.setPopup({popup: "/html/index.html"});
    } else {
        alert(serviceResponse.getErrorPrompt());
    }
}

function autoLoginAfterSuccessfullRegister(data) {
    //alert(JSON.stringify(data));
}

document.addEventListener("click", function (e) {
    if (e.target.id == "registerButton") {
        registerUser($('#firstname').val(), $('#lastname').val(), $('#password').val(), $('#email').val(), processServiceRegisterResponse);
    }

});