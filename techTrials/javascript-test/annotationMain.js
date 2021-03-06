//Definitions
var protocol = "http://";
var serverRootUrl = "localhost:8080";
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
    preProcess();
    if (!window.jQuery) {
        alert("JQ does NOT work");
    }
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
            type: "POST",
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

function registerUser(name, lName, pw, mail, callback) {
    try {
        var userPostData = {
            firstName: name,
            lastName: lName,
            email: mail,
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
                userAuthToken = make_base_auth(userPostData.email, userPostData.password);
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

function startAnnotatorJS() {
    var app = new annotator.App();
    app.include(annotator.ui.main);
    app.include(annotator.storage.http, {
        prefix: protocol + serverRootUrl + annotationStorePostUri
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

//chrome.runtime.onMessage.addListener(processRequest);
