//Definitions
var protocol = "http://";
var serverRootUrl = "ec2-35-162-70-40.us-west-2.compute.amazonaws.com";
var loginPostUri = "/api/users/login";
var registerPostUri = "/api/users";
var annotationStorePostUri = "/api/annotation";

//old address 
//var protocol = "http://";
//var serverRootUrl = "46.196.100.145";
//var serverRootUrl = "192.168.0.103";
//var loginPostUri = ":8080/healthTracker/auth";
//var loginPostUri = "/healthTracker/auth";
//var registerPostUri = ":8080/healthTracker//registerAuth";
//var registerPostUri = "/healthTracker//registerAuth";
//var annotationStorePostUri = ":8080/healthTracker";
//var annotationStorePostUri = "/healthTracker";

/**
 * Hardcoded annotation store options
 * create - /annotations -
 *
 *
 * @author Gokhanozg
 */

var userAuthToken = "DEFAULT"; // leave this as DEFAULT


function processRequest(request, sender, sendResponse) {

    console.log("Processing request");
    //preProcess();

    startAnnotatorJS();

    chrome.runtime.onMessage.removeListener(processRequest);
}

function ServiceResponse(errorMessage, data) {
    this.errMsg = errorMessage;
    if (this.errMsg != null && this.errMsg.length > 0) {
        this.success = false;
        this.data = null;
    } else {
        this.success = true;
        this.data = data;
    }
    this.getErrorPrompt = function () {
        return "Failed to process your request:" + this.errMsg;
    }
}


function preProcess() {
    // while (document.body.firstChild) {
    //     document.body.firstChild.remove();
    // }
    var canvas = document.createElement("canvas");
    canvas.class = 'selectionBox';
    canvas.id = 'selectionBox';
    canvas.style = 'position: absolute; top: 0; left: 0; height: 0; width: 0; border: 1px solid red;';
    document.body.appendChild(canvas);
    // var selectDiv = document.createElement("div");
    // selectDiv.class = 'selectionBox';
    // selectDiv.style = 'position: absolute; top: 0; left: 0; height: 300; width: 300; border: 1px solid red;';
    // document.body.appendChild(selectDiv);
}

function make_base_auth(user, password) {
    var tok = user + ':' + password;
    var hash = btoa(tok);
    return "Basic " + hash;
}

function loginUser(username, password, callback) {
    try {
        $.ajax
        ({
            type: "GET",
            url: protocol + serverRootUrl + loginPostUri,
            dataType: 'json',
            async: false,
            data: '{}',
            beforeSend: function (xhr) {
                userAuthToken = make_base_auth(username, password);
                xhr.setRequestHeader('Authorization', userAuthToken);
            },
            success: function (data) {
                callback(new ServiceResponse(null, data));
            },
            error: function (xhr, ajaxOptions, thrownError) {
                callback(new ServiceResponse("BWAT001 => " + thrownError, null));
                console.log(xhr.responseText);
            }
        });
    } catch (err) {
        callback(new ServiceResponse("BWAT002 => " + err.message, null));
    }
}

function startAnnotatorJS() {
    console.log("Processing annotation request");
    if (!window.jQuery) {
        alert("JQ does NOT work!!");
    }
    console.log("Starting annotations...");
    var app = new annotator.App();
    app.include(annotator.ui.main);
    app.include(annotator.storage.http, {
        prefix: protocol + "46.196.100.145" + "/healthTracker"
    });
    app.start().then(function () {
        app.annotations.load();
    });
    if (app != null) {
        alert("Please select something and click on annotate Icon");
    } else {
        alert("Something is wrong with annotation selector");
    }

}

function registerUser(name, lName, pw, mail, callback) {
    try {
        var userPostData = {
            firstName: name,
            lastName: lName,
            mail: mail,
            password: "**********"
        };
        console.log(JSON.stringify(userPostData));
        userPostData.password = pw;
        $.ajax
        ({
            type: "POST",
            url: protocol + serverRootUrl + registerPostUri,
            dataType: 'json',
            contentType: "application/json; charset=utf8",
            async: false,
            data: JSON.stringify(userPostData),
            beforeSend: function (xhr) {
                //userAuthToken = make_base_auth(userPostData.email, userPostData.password);
                //xhr.setRequestHeader('Authorization', userAuthToken);
            },
            success: function (data) {
                callback(new ServiceResponse(null, data));
            },
            error: function (xhr, ajaxOptions, thrownError) {
                callback(new ServiceResponse("BWAT003 => " + thrownError, null));
                console.log(xhr.responseText);
            }
        });
    } catch (err) {
        callback(new ServiceResponse("BWAT004 => " + err.message, null));
    }
}


function sendCreatedAnnnotation(commentValue, xpathSelectorData) {

    var tabUrl = window.location.href;

    try {
        var annotationPostData = {
            "@context": "http://www.w3.org/ns/anno.jsonld",
            "id": tabUrl,
            "type": "Annotation",
            "body": commentValue,
            "target": {
                "source": "http://example.org/page1.html",
                "selector": [
                    {
                    "type": "RangeSelector",
                    "startSelector": {
                        "type": "XPathSelector",
                        "value": xpathSelectorData.start
                    },
                    "endSelector": {
                        "type": "XPathSelector",
                        "value": xpathSelectorData.end
                    }
                    },
                    {
                        "type": "DataPositionSelector",
                        "start": xpathSelectorData.startOffset,
                        "end": xpathSelectorData.endOffset
                    }
                ]
            }
        };
        console.log(JSON.stringify(annotationPostData));
        $.ajax
        ({
            type: "POST",
            url: protocol + serverRootUrl + annotationStorePostUri,
            dataType: 'json',
            contentType: "application/json; charset=utf8",
            async: false,
            data: JSON.stringify(annotationPostData),
            beforeSend: function (xhr) {
                userAuthToken = make_base_auth("abc@gmail.com", "123456");
                xhr.setRequestHeader('Authorization', userAuthToken);
            },
            success: function (data) {
                callback(new ServiceResponse(null, data));
            },
            error: function (xhr, ajaxOptions, thrownError) {
                callback(new ServiceResponse("BWAT003 => " + thrownError, null));
                console.log(xhr.responseText);
            }
        });
    } catch (err) {
        callback(new ServiceResponse("BWAT004 => " + err.message, null));
    }
}


chrome.runtime.onMessage.addListener(processRequest);

