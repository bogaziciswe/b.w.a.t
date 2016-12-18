//Definitions
var protocol = "http://";
//var serverRootUrl = "localhost:8080";
var serverRootUrl = "ec2-35-162-70-40.us-west-2.compute.amazonaws.com";
var loginPostUri = "/api/users/login";
var registerPostUri = "/api/users";
var getAnnotationBySourceUri = "/api/annotation/source";
var annotationStorePostUri = "/api/annotation";

//config
var allowHttpsProtocol = false; //SSL required

// Annotation List for update and delete operations
var annotationListOfPage = [];

function setCredentials(username, password) {
    //FIXME Storing user credentials locally is not secure.
    var credentials = {
        username: username,
        password: password
    };
    chrome.storage.sync.set(credentials, function () {
        console.log('Credentials are saved');
    });
}

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
        return "ErrorCode -> " + this.errMsg;
    }
}

function AnnotationListResponse(serverResponse, errorMsg) {
    this.errorMsg = errorMsg;
    if (this.errorMsg != null && this.errorMsg.length > 0) {
        this.success = false;
        this.annotations = null;
    } else {
        if (serverResponse != null && serverResponse.length > 0) {
            try {
                this.annotations = JSON.parse(serverResponse); // Parsing may fail.
                for (var i = 0; i < this.annotations.length; i++) {
                    var currentAnnotation = this.annotations[i];
                    this.annotations[i].getGeekString = function () {
                        return JSON.stringify(currentAnnotation);
                    }
                }
                this.success = true;
            } catch (err) {
                this.success = false;
                this.annotations = null;
                this.errorMsg = "Invalid JSON response from server.";
            }
        } else {
            this.success = false;
            this.annotations = null;
            this.errorMsg = "Empty server response, please try again later :)";
        }
    }
}

function getDummyAnnotationResponseString() {
    var dummyResponseString = "[{\"@context\":\"http://www.w3.org/ns/anno.jsonld\",\"id\":\"http://www.hurriyet.com.tr/trump-secimi-kazandi-diye-ulkeyi-terk-ediyor-40275330\",\"type\":\"Annotation\",\"body\":\"test\",\"target\":{\"selector\":[{\"type\":\"RangeSelector\",\"startSelector\":{\"type\":\"XPathSelector\",\"value\":\"/div[13]/div[6]/div[2]/div/div/div/div/div[3]/div/div/div[4]/div[2]/p[2]\"},\"endSelector\":{\"type\":\"XPathSelector\",\"value\":\"/div[13]/div[6]/div[2]/div/div/div/div/div[3]/div/div/div[4]/div[2]/p[2]\"}},{\"type\":\"DataPositionSelector\",\"start\":267,\"end\":283}]}},{\"@context\":\"http://www.w3.org/ns/anno.jsonld\",\"id\":\"http://www.hurriyet.com.tr/trump-secimi-kazandi-diye-ulkeyi-terk-ediyor-40275330\",\"type\":\"Annotation\",\"body\":\"test\",\"target\":{\"selector\":[{\"type\":\"RangeSelector\",\"startSelector\":{\"type\":\"XPathSelector\",\"value\":\"/div[13]/div[6]/div[2]/div/div/div/div/div[3]/div/div/div[4]/div[2]/p[2]\"},\"endSelector\":{\"type\":\"XPathSelector\",\"value\":\"/div[13]/div[6]/div[2]/div/div/div/div/div[3]/div/div/div[4]/div[2]/p[2]\"}},{\"type\":\"DataPositionSelector\",\"start\":267,\"end\":283}]}},{\"@context\":\"http://www.w3.org/ns/anno.jsonld\",\"id\":\"http://www.hurriyet.com.tr/trump-secimi-kazandi-diye-ulkeyi-terk-ediyor-40275330\",\"type\":\"Annotation\",\"body\":\"test\",\"target\":{\"selector\":[{\"type\":\"RangeSelector\",\"startSelector\":{\"type\":\"XPathSelector\",\"value\":\"/div[13]/div[6]/div[2]/div/div/div/div/div[3]/div/div/div[4]/div[2]/p[2]\"},\"endSelector\":{\"type\":\"XPathSelector\",\"value\":\"/div[13]/div[6]/div[2]/div/div/div/div/div[3]/div/div/div[4]/div[2]/p[2]\"}},{\"type\":\"DataPositionSelector\",\"start\":267,\"end\":283}]}},{\"@context\":\"http://www.w3.org/ns/anno.jsonld\",\"id\":\"http://www.hurriyet.com.tr/trump-secimi-kazandi-diye-ulkeyi-terk-ediyor-40275330\",\"type\":\"Annotation\",\"body\":\"test\",\"target\":{\"selector\":[{\"type\":\"RangeSelector\",\"startSelector\":{\"type\":\"XPathSelector\",\"value\":\"/div[13]/div[6]/div[2]/div/div/div/div/div[3]/div/div/div[4]/div[2]/p[2]\"},\"endSelector\":{\"type\":\"XPathSelector\",\"value\":\"/div[13]/div[6]/div[2]/div/div/div/div/div[3]/div/div/div[4]/div[2]/p[2]\"}},{\"type\":\"DataPositionSelector\",\"start\":267,\"end\":283}]}},{\"@context\":\"http://www.w3.org/ns/anno.jsonld\",\"id\":\"http://www.hurriyet.com.tr/trump-secimi-kazandi-diye-ulkeyi-terk-ediyor-40275330\",\"type\":\"Annotation\",\"body\":\"test\",\"target\":{\"selector\":[{\"type\":\"RangeSelector\",\"startSelector\":{\"type\":\"XPathSelector\",\"value\":\"/div[13]/div[6]/div[2]/div/div/div/div/div[3]/div/div/div[4]/div[2]/p[2]\"},\"endSelector\":{\"type\":\"XPathSelector\",\"value\":\"/div[13]/div[6]/div[2]/div/div/div/div/div[3]/div/div/div[4]/div[2]/p[2]\"}},{\"type\":\"DataPositionSelector\",\"start\":267,\"end\":283}]}},{\"@context\":\"http://www.w3.org/ns/anno.jsonld\",\"id\":\"http://www.hurriyet.com.tr/trump-secimi-kazandi-diye-ulkeyi-terk-ediyor-40275330\",\"type\":\"Annotation\",\"body\":\"test\",\"target\":{\"selector\":[{\"type\":\"RangeSelector\",\"startSelector\":{\"type\":\"XPathSelector\",\"value\":\"/div[13]/div[6]/div[2]/div/div/div/div/div[3]/div/div/div[4]/div[2]/p[2]\"},\"endSelector\":{\"type\":\"XPathSelector\",\"value\":\"/div[13]/div[6]/div[2]/div/div/div/div/div[3]/div/div/div[4]/div[2]/p[2]\"}},{\"type\":\"DataPositionSelector\",\"start\":267,\"end\":283}]}},{\"@context\":\"http://www.w3.org/ns/anno.jsonld\",\"id\":\"http://www.hurriyet.com.tr/trump-secimi-kazandi-diye-ulkeyi-terk-ediyor-40275330\",\"type\":\"Annotation\",\"body\":\"test\",\"target\":{\"selector\":[{\"type\":\"RangeSelector\",\"startSelector\":{\"type\":\"XPathSelector\",\"value\":\"/div[13]/div[6]/div[2]/div/div/div/div/div[3]/div/div/div[4]/div[2]/p[2]\"},\"endSelector\":{\"type\":\"XPathSelector\",\"value\":\"/div[13]/div[6]/div[2]/div/div/div/div/div[3]/div/div/div[4]/div[2]/p[2]\"}},{\"type\":\"DataPositionSelector\",\"start\":267,\"end\":283}]}},{\"@context\":\"http://www.w3.org/ns/anno.jsonld\",\"id\":\"http://www.hurriyet.com.tr/trump-secimi-kazandi-diye-ulkeyi-terk-ediyor-40275330\",\"type\":\"Annotation\",\"body\":\"test\",\"target\":{\"selector\":[{\"type\":\"RangeSelector\",\"startSelector\":{\"type\":\"XPathSelector\",\"value\":\"/div[13]/div[6]/div[2]/div/div/div/div/div[3]/div/div/div[4]/div[2]/p[2]\"},\"endSelector\":{\"type\":\"XPathSelector\",\"value\":\"/div[13]/div[6]/div[2]/div/div/div/div/div[3]/div/div/div[4]/div[2]/p[2]\"}},{\"type\":\"DataPositionSelector\",\"start\":267,\"end\":283}]}},{\"@context\":\"http://www.w3.org/ns/anno.jsonld\",\"id\":\"http://www.hurriyet.com.tr/trump-secimi-kazandi-diye-ulkeyi-terk-ediyor-40275330\",\"type\":\"Annotation\",\"body\":\"test\",\"target\":{\"selector\":[{\"type\":\"RangeSelector\",\"startSelector\":{\"type\":\"XPathSelector\",\"value\":\"/div[13]/div[6]/div[2]/div/div/div/div/div[3]/div/div/div[4]/div[2]/p[2]\"},\"endSelector\":{\"type\":\"XPathSelector\",\"value\":\"/div[13]/div[6]/div[2]/div/div/div/div/div[3]/div/div/div[4]/div[2]/p[2]\"}},{\"type\":\"DataPositionSelector\",\"start\":267,\"end\":283}]}},{\"@context\":\"http://www.w3.org/ns/anno.jsonld\",\"id\":\"http://www.hurriyet.com.tr/trump-secimi-kazandi-diye-ulkeyi-terk-ediyor-40275330\",\"type\":\"Annotation\",\"body\":\"test\",\"target\":{\"selector\":[{\"type\":\"RangeSelector\",\"startSelector\":{\"type\":\"XPathSelector\",\"value\":\"/div[13]/div[6]/div[2]/div/div/div/div/div[3]/div/div/div[4]/div[2]/p[2]\"},\"endSelector\":{\"type\":\"XPathSelector\",\"value\":\"/div[13]/div[6]/div[2]/div/div/div/div/div[3]/div/div/div[4]/div[2]/p[2]\"}},{\"type\":\"DataPositionSelector\",\"start\":267,\"end\":283}]}},{\"@context\":\"http://www.w3.org/ns/anno.jsonld\",\"id\":\"http://www.hurriyet.com.tr/trump-secimi-kazandi-diye-ulkeyi-terk-ediyor-40275330\",\"type\":\"Annotation\",\"body\":\"test\",\"target\":{\"selector\":[{\"type\":\"RangeSelector\",\"startSelector\":{\"type\":\"XPathSelector\",\"value\":\"/div[13]/div[6]/div[2]/div/div/div/div/div[3]/div/div/div[4]/div[2]/p[2]\"},\"endSelector\":{\"type\":\"XPathSelector\",\"value\":\"/div[13]/div[6]/div[2]/div/div/div/div/div[3]/div/div/div[4]/div[2]/p[2]\"}},{\"type\":\"DataPositionSelector\",\"start\":267,\"end\":283}]}}]";
    return dummyResponseString;
}

function testAnnotationListObjectCreation() {
    var annotationResponse = getAnnotationsForUrl("gokhanTest");
    console.log("error = " + annotationResponse.errorMsg);
    console.log("size = " + annotationResponse.annotations.length);
    console.log("3rd annotation = " + annotationResponse.annotations[3]);
    console.log("geekResponseOfSingleAnnotation = " + annotationResponse.annotations[3].getGeekString());
}

/**
 * Fetches annotations for current page.
 * Example usage:
 * getAnnotationsForCurrentUrl().then(function(response)){
 *    var annotationResponse = response;
 *    var errorMsg = annotationResponse.errorMsg;
 *    if(errorMsg == null ){
 *      // Your code goes here, successfully fetched annotations
 *    }else{
 *      // Something went wrong. check console.log() and see annotationResponse.errorMsg.
 *    }
 * }
 */
function getAnnotationsForCurrentUrl() {
    var fullUrl = window.location.href;
    var isHttps = fullUrl.startsWith("https");
    if (isHttps && allowHttpsProtocol) {
        console.log("Loading annotations for HTTPS protocol, page:" + fullUrl);
        return getAnnotationsForUrl(fullUrl); // if HTTPS protocol is enabled
    } else if (!isHttps) {
        console.log("Loading annotations for HTTP protocol, page:" + fullUrl);
        return getAnnotationsForUrl(fullUrl); // currently supporting HTTP
    } else {
        console.log("Disallowed protocol ( HTTPS ), no annotation can be loaded for url:" + fullUrl);
        return new Promise(function (resolve, reject) {
            reject(new AnnotationListResponse(JSON.stringify({}), null)); // default empty response
        });
    }
}

/**
 * Example usage:
 * getAnnotationsForUrl("http://www.hurriyet.com/test.html").then(function(response)){
 *    var annotationResponse = response;
 *    var errorMsg = annotationResponse.errorMsg;
 *    if(errorMsg == null ){
 *      // Your code goes here, successfully fetched annotations
 *    }else{
 *      // Something went wrong. check console.log() and see annotationResponse.errorMsg.
 *    }
 * }
 *
 * @param pageUrl
 */
function getAnnotationsForUrl(pageUrl) {
    return new Promise(function (resolve, reject) {
        try {
            var keys = ["username", "password"];

            function readStoredCredentials(items) {
                console.log("Making GET request to :" + protocol + serverRootUrl + getAnnotationBySourceUri + "?source=" + pageUrl);
                $.ajax
                ({
                    type: "GET",
                    url: protocol + serverRootUrl + getAnnotationBySourceUri + "?source=" + pageUrl,
                    dataType: 'json',
                    async: true,
                    beforeSend: function (xhr) {
                        userAuthToken = make_base_auth(items.username, items.password);
                        xhr.setRequestHeader('Authorization', userAuthToken);
                    },
                    success: function (data) {
                        //console.log("Get annotation by source response:" + JSON.stringify(data));
                        if (data.data && data.status == 'success') {
                            resolve(new AnnotationListResponse(JSON.stringify(data.data), null));
                        } else {
                            if (data.status) {
                                resolve(new AnnotationListResponse(null, data.status));
                            } else {
                                resolve(new AnnotationListResponse(null, "BWAT019 Failed to obtain valid response from server"));
                            }
                        }
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        console.log("Getting annotation by source failed, source:" + pageUrl + ", details:" + xhr.responseText);
                        try {
                            var errorMsg = JSON.parse(xhr.responseText);
                            if (errorMsg) {
                                resolve(new AnnotationListResponse(null, errorMsg.message));
                            } else {
                                resolve(new AnnotationListResponse(null, "BWAT020: Request failed while fetching annotations by source"));
                            }
                        } catch (err) {
                            resolve(new AnnotationListResponse(null, "BWAT021: " + thrownError));
                        }
                    }
                });
            }

            chrome.storage.sync.get(keys, readStoredCredentials);
        } catch (err) {
            resolve(new AnnotationListResponse(null, err.message));
        }
    });
}

function createFieldsForHighlighter(currentAnnotation) {
    if (!currentAnnotation.target.selector.hasOwnProperty('type')) {
        var range = {
            start: currentAnnotation.target.selector[0].startSelector.value,
            end: currentAnnotation.target.selector[0].endSelector.value,
            startOffset: currentAnnotation.target.selector[1].start,
            endOffset: currentAnnotation.target.selector[1].end
        };
        var ranges = [range];
        var text = currentAnnotation.body.value;
        var quote = '';
        if (currentAnnotation.target.selector[2] != null && currentAnnotation.target.selector[2].exact) {
            quote = currentAnnotation.target.selector[2].exact;
        }
        currentAnnotation.ranges = ranges;
        currentAnnotation.text = text;
        currentAnnotation.quote = quote;
    }
}

function loadAnnotationsForExtension() {
    getAnnotationsForCurrentUrl().then(function (response) {
        var annotationListResponse = response;
        if (annotationListResponse.success) { // success = true if server responds with a valid JSON with annotations in it.
            cardsList = JSON.stringify(annotationListResponse.annotations);
        }
    });

}

function loadAnnotationsForPage(contentAnnotatorBM) {
    getAnnotationsForCurrentUrl().then(function (response) {
        var annotationListResponse = response;

        if (annotationListResponse.success) { // success = true if server responds with a valid JSON with annotations in it.

            // Now we have responseObject , time to get annotationList.
            var annotationList = [];

            for (anno in annotationListResponse.annotations){
                annotationList.push(annotationListResponse.annotations[anno].annotation);
            }
            var stringified = JSON.stringify(annotationListResponse.annotations);
            cardsList = stringified;
            if (annotationList != null && annotationList.length > 0) {
                // Annotation List for update and delete operations
                annotationListOfPage = annotationList.slice(0);
                var annotationListLen = annotationList.length;
                if (annotationList != null && annotationList.length > 0) {

                    for (var i = 0; i < annotationList.length; i++) {
                        createFieldsForHighlighter(annotationList[i]);
                    }
                    contentAnnotatorBM.annotator("loadAnnotations", annotationList);
                    if (annotationList != null && annotationListLen > 0) {
                        console.log("Loaded " + annotationListLen + " annotations.")
                    } else {
                        console.log("No annotations to show.");
                    }
                }
            } else {
                console.log("No annotations to show.");
            }
        } else { // Any other errors cause success == false . Network error, empty response, timeout, invalid json etc...
            var errorMessage = annotationListResponse.errorMsg; // if something bad happened, brief details will be stored as errorMsg. Remember to check console.log as well.
            // TODO something to do with errorMessage, alert(errorMessage) may be.
            console.log("ERROR ENCOUNTERED WHILE FETCHING ANNOTATIONS:" + errorMessage);
        }
    }, function (rejection) {
        //console.log("Protocol rejected.");
    });
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

function readCredentials() {
    var keys = ["username", "password"];

    function storedCredentials(items) {
        //console.log("Stored Stuff : " + JSON.stringify(items));
    }

    chrome.storage.sync.get(keys, storedCredentials);
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
                console.log("Login response:" + JSON.stringify(data));
                if (data.data) {
                    var respData = data.data;
                    if (respData.enabled) {
                        setCredentials(username, password);
                        callback(new ServiceResponse(null, data));
                    } else {
                        callback(new ServiceResponse("BWAT012: User disabled.", null));
                    }
                } else {
                    callback(new ServiceResponse("BWAT011: Invalid server response", null));
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log("Login failed:" + xhr.responseText);
                try {
                    var errorMsg = JSON.parse(xhr.responseText);
                    if (errorMsg) {
                        callback(new ServiceResponse("BWAT014: " + errorMsg.message, null));
                    } else {
                        callback(new ServiceResponse("BWAT013: Login failed.", null));
                    }
                } catch (err) {
                    callback(new ServiceResponse("BWAT001: " + thrownError, null));
                }
            }
        });
    } catch (err) {
        callback(new ServiceResponse("BWAT002: " + err.message, null));
    }
}

function startAnnotatorJS() {
    //console.log("Processing annotation request");
    //if (!window.jQuery) {
    //    alert("JQ does NOT work!!");
    //}
    //console.log("Starting annotations...");
    //var app = new annotator.App();
    //app.include(annotator.ui.main);
    //app.include(annotator.storage.http, {
    //    prefix: protocol + "46.196.100.145" + "/healthTracker"
    //});
    //app.start().then(function () {
    //    app.annotations.load();
    //});
    //if (app != null) {
    //    alert("Please select something and click on annotate Icon");
    //} else {
    //    alert("Something is wrong with annotation selector");
    //}
}

$(document).ready(function () {
    function applyStorageParams(params) {
        if (params != null) {
            if (params.username) {
                var registerDiv = $('#registerDiv');
                if (registerDiv) {
                    registerDiv.show();
                    console.log("Showing registerDiv");
                }
                var navbarLink = $('#navbarLink');
                if (navbarLink) {
                    navbarLink.html("Logout");
                    navbarLink.attr("href", "#");
                    navbarLink.click(function () {
                        var credentialData = ["username", "password"];
                        chrome.storage.sync.remove(credentialData, logUserOut);
                    });
                }
                var navbarUsername = $('#navbarUsername');
                if (navbarUsername) {
                    navbarUsername.html(params.username);
                }
            }else{
                console.log("No client credentials have found - 2");
            }
        } else {
            console.log("No client credentials have found - 1");
        }
    }

    var storageParams = ["username", "password"];
    chrome.storage.sync.get(storageParams, applyStorageParams);
});

function logUserOut() {
    //reloading page with default html settings.
    window.location.href = "/html/index.html";
    chrome.browserAction.setPopup({popup: "/html/index.html"});
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
                if (data == null) {
                    callback(new ServiceResponse("BWAT009: " + "No response from server"), null);
                } else if (data.error) {
                    callback(new ServiceResponse("BWAT007: " + data.error.fieldErrors[0].message, null));
                } else if (data.data.enabled) {
                    console.log("Register success for username:" + mail);
                    setCredentials(mail, password);
                    callback(new ServiceResponse(null, data));
                } else {
                    console.log("Unknown problem, response:" + JSON.stringify(data));
                    callback(new ServiceResponse("BWAT008: server response can not be identified"), null)
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log("Error Response: " + xhr.responseText);
                try {
                    var errorMsg = JSON.parse(xhr.responseText);
                    if (errorMsg.error.fieldErrors[0].message != null && errorMsg.error.fieldErrors[0].message.length > 0) {
                        callback(new ServiceResponse("BWAT011: " + errorMsg.error.fieldErrors[0].message, null));
                    } else {
                        callback(new ServiceResponse("BWAT010: Failed to register. Please try again later.", null));
                    }
                } catch (err) {
                    callback(new ServiceResponse("BWAT003: Failed to register. Please try again later.", null));
                }
            }
        });
    } catch (err) {
        callback(new ServiceResponse("BWAT004: " + err.message, null));
    }
}

/*
 * post updated text annotation to the server
 * @param  {commentValue, xpathSelectorData, quote}
 * @return {}
 *
 * */
function sendCreatedAnnnotation(commentValue, xpathSelectorData, quote) {

    var tabUrl = window.location.href;
    try {

        // Todo: Defult public annotation
        if (xpathSelectorData.hasOwnProperty('type')) {
            var annotationPostData = {
                "annotation": {
                    "@context": "http://www.w3.org/ns/anno.jsonld",
                    "id": tabUrl,
                    "type": "Annotation",
                    "body": {
                        "type": "TextualBody",
                        "value": commentValue,
                        "format": "text/plain"
                    },
                    "target": {
                        "source": tabUrl,
                        "id": "http://example.com/image1#xywh=" + xpathSelectorData.geometry.x + "," + xpathSelectorData.geometry.y + "," + xpathSelectorData.geometry.width + "," + xpathSelectorData.geometry.height,
                        "type": "Image",
                        "format": "image/jpeg"
                    }
                },
                "publicAnnotation": true
            };
        }

        // Todo: Defult public annotation
        else {
            var annotationPostData = {
                "annotation": {
                    "@context": "http://www.w3.org/ns/anno.jsonld",
                    "id": tabUrl,
                    "type": "Annotation",
                    "body": {
                        "type": "TextualBody",
                        "value": commentValue,
                        "format": "text/plain"
                    },
                    "target": {
                        "source": tabUrl,
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
                            ,
                            {
                                "type": "TextQuoteSelector",
                                "exact": quote
                            }

                        ]
                    }
                },
                "publicAnnotation": true
            };
        }

        console.log(JSON.stringify(annotationPostData));
        $.ajax({
            type: "POST",
            url: protocol + serverRootUrl + annotationStorePostUri,
            dataType: 'json',
            contentType: "application/json; charset=utf8",
            async: true,
            data: JSON.stringify(annotationPostData),
            beforeSend: function (xhr) {
                userAuthToken = make_base_auth("abc@gmail.com", "123456");
                xhr.setRequestHeader('Authorization', userAuthToken);
            },
            success: function (data) {
                //callback(new ServiceResponse(null, data));
                console.log("Completed sending annotation:" + JSON.stringify(data) + " ---");
                annotationListOfPage.push(data);
                loadAnnotationsForExtension();
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //callback(new ServiceResponse("BWAT005 => " + thrownError, null));
                console.log(xhr.responseText);
            }
        });
    } catch (err) {
        callback(new ServiceResponse("BWAT006 => " + err.message, null));
    }
}

/*
 * post updated text annotation to the server
 * @param  {updatedAnnotation}
 * @return {}
 *
 * */
function sendUpdatedTextAnnnotation(updatedAnnotation) {

    var annotation = findAnnotationInList(updatedAnnotation.ranges[0].startOffset, updatedAnnotation.ranges[0].endOffset);

    try {
        var annotationPostData = {
            "annotation": {
                "@context": "http://www.w3.org/ns/anno.jsonld",
                "id": annotation.annotationId,
                "type": annotation.type,
                "body": {
                    "type": annotation.body.type,
                    "value": annotation.text,
                    "format": annotation.body.format
                },
                "target": {
                    "source": annotation.target.source,
                    "selector": [
                        {
                            "type": annotation.target.selector[0].type,
                            "startSelector": {
                                "type": annotation.target.selector[0].startSelector.type,
                                "value": annotation.target.selector[0].startSelector.value,
                            },
                            "endSelector": {
                                "type": annotation.target.selector[0].endSelector.type,
                                "value": annotation.target.selector[0].endSelector.value,
                            }
                        },
                        {
                            "type": annotation.target.selector[1].type,
                            "start": annotation.target.selector[1].start,
                            "end": annotation.target.selector[1].end,
                        }
                        ,
                        {
                            "type": annotation.target.selector[2].type,
                            "exact": annotation.target.selector[2].quote
                        }

                    ]
                }
            },
            "publicAnnotation": true
        };

        console.log(JSON.stringify(annotationPostData));
        
        $.ajax({
            type: "POST",
            url: protocol + serverRootUrl + "/api/annotation/" + annotation.id + "/update",
            dataType: 'json',
            contentType: "application/json; charset=utf8",
            async: true,
            data: JSON.stringify(annotationPostData),
            beforeSend: function (xhr) {
                userAuthToken = make_base_auth("abc@gmail.com", "123456");
                xhr.setRequestHeader('Authorization', userAuthToken);
            },
            success: function (data) {
                //callback(new ServiceResponse(null, data));
                console.log("Completed sending annotation:" + JSON.stringify(data) + " ---");
                loadAnnotationsForExtension();
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //callback(new ServiceResponse("BWAT005 => " + thrownError, null));
                console.log(xhr.responseText);
            }
        });


    } catch (err) {
        callback(new ServiceResponse("BWAT006 => " + err.message, null));
    }
}

/*
 * post deleted text annotation to the server
 * @param  {deletedAnnotation}
 * @return {}
 *
 * */
function sendDeletedTextAnnnotation(deletedAnnotation) {

    var annotation = findAnnotationInList(deletedAnnotation.ranges[0].startOffset, deletedAnnotation.ranges[0].endOffset);

     $.ajax({
         type: "GET",
         url: protocol + serverRootUrl + "/api/annotation/" + annotation.id + "/delete",
         dataType: 'json',
         async: true,
         beforeSend: function (xhr) {
         userAuthToken = make_base_auth("abc@gmail.com", "123456");
         xhr.setRequestHeader('Authorization', userAuthToken);
         },
         success: function (data) {
         //callback(new ServiceResponse(null, data));
         console.log("Completed sending annotation:" + JSON.stringify(data) + " ---");
             loadAnnotationsForExtension();
         },
         error: function (xhr, ajaxOptions, thrownError) {
         //callback(new ServiceResponse("BWAT005 => " + thrownError, null));
         console.log(xhr.responseText);
         }
     });
}

/*
 * find annotation from annotation list of the page for the update and delete operations
 * @param  {startOffset, endOffset}
 * @return {annotation}
 *
 * */
function findAnnotationInList(startOffset, endOffset) {
    for (var i = 0; i < annotationListOfPage.length; i++) {
        if (annotationListOfPage[i].target.selector[1].start == startOffset &&
            annotationListOfPage[i].target.selector[1].end == endOffset) {
            return annotationListOfPage[i];
        }
    }
    return null;
}

chrome.runtime.onMessage.addListener(processRequest);

