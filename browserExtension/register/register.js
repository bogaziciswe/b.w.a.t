/**
 * Created by bogaziciswe574_group1 on 23/10/16.
 */

document.addEventListener("click", function(e) {
    if (e.target.id == "registerButton") {
        window.location.href = "/popup/annotationLanding.html";
        chrome.browserAction.setPopup({popup: "/popup/annotationLanding.html"});
    }

});