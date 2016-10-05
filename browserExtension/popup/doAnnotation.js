




document.addEventListener("click", function(e) {




    chrome.tabs.executeScript(null, {
        file: "/content_scripts/annotationMain.js"
    });

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {data: 'testData'});
    });

});
