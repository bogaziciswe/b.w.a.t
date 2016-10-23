
document.addEventListener("click", function(e) {

    if (e.target.id == "newAnnotationButton") {
        chrome.tabs.executeScript(null, {
            file: "/content_scripts/annotationMain.js"
        });

        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {data: 'testData'});
        });
    }

    if (e.target.id == "logoutButton") {
        window.location.href = "/login/login.html";
        chrome.browserAction.setPopup({popup: "/login/login.html"});
    }

});