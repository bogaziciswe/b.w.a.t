
document.addEventListener("click", function(e) {

    if (e.target.id == "newAnnotationButton") {
        chrome.tabs.executeScript(null, {
            file: "/scripts/annotationMain.js"
        });

        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {data: 'testData'});
        });
    }

    if (e.target.id == "logoutButton") {
        window.location.href = "/html/login.html";
        chrome.browserAction.setPopup({popup: "/html/login.html"});
    }

});