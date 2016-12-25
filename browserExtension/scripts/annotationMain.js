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

/**
 * Stores user credentials
 * @param {string} username
 * @param {string} password
 * @return {null}
 */
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

/**
 * Hardcoded annotation store options
 * create - /annotations -
 *
 *
 * @author Gokhanozg
 */

var userAuthToken = "DEFAULT"; // leave this as DEFAULT


/**
 * Processes service response
 * @param {string} errorMessage
 * @param {string} data
 * @return {string} response
 */
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


/**
 * Processes Annotation List Response
 * Depending on the response returns error code or JSON of Annotation
 * @param {string} serverResponse
 * @param {string} data
 * @return {string} response
 */
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

/**
 * Returns dummy annotation string
 * @return {string} Dummy response string
 */
function getDummyAnnotationResponseString() {
    var dummyResponseString = "[{\"@context\":\"http://www.w3.org/ns/anno.jsonld\",\"id\":\"http://www.hurriyet.com.tr/trump-secimi-kazandi-diye-ulkeyi-terk-ediyor-40275330\",\"type\":\"Annotation\",\"body\":\"test\",\"target\":{\"selector\":[{\"type\":\"RangeSelector\",\"startSelector\":{\"type\":\"XPathSelector\",\"value\":\"/div[13]/div[6]/div[2]/div/div/div/div/div[3]/div/div/div[4]/div[2]/p[2]\"},\"endSelector\":{\"type\":\"XPathSelector\",\"value\":\"/div[13]/div[6]/div[2]/div/div/div/div/div[3]/div/div/div[4]/div[2]/p[2]\"}},{\"type\":\"DataPositionSelector\",\"start\":267,\"end\":283}]}},{\"@context\":\"http://www.w3.org/ns/anno.jsonld\",\"id\":\"http://www.hurriyet.com.tr/trump-secimi-kazandi-diye-ulkeyi-terk-ediyor-40275330\",\"type\":\"Annotation\",\"body\":\"test\",\"target\":{\"selector\":[{\"type\":\"RangeSelector\",\"startSelector\":{\"type\":\"XPathSelector\",\"value\":\"/div[13]/div[6]/div[2]/div/div/div/div/div[3]/div/div/div[4]/div[2]/p[2]\"},\"endSelector\":{\"type\":\"XPathSelector\",\"value\":\"/div[13]/div[6]/div[2]/div/div/div/div/div[3]/div/div/div[4]/div[2]/p[2]\"}},{\"type\":\"DataPositionSelector\",\"start\":267,\"end\":283}]}},{\"@context\":\"http://www.w3.org/ns/anno.jsonld\",\"id\":\"http://www.hurriyet.com.tr/trump-secimi-kazandi-diye-ulkeyi-terk-ediyor-40275330\",\"type\":\"Annotation\",\"body\":\"test\",\"target\":{\"selector\":[{\"type\":\"RangeSelector\",\"startSelector\":{\"type\":\"XPathSelector\",\"value\":\"/div[13]/div[6]/div[2]/div/div/div/div/div[3]/div/div/div[4]/div[2]/p[2]\"},\"endSelector\":{\"type\":\"XPathSelector\",\"value\":\"/div[13]/div[6]/div[2]/div/div/div/div/div[3]/div/div/div[4]/div[2]/p[2]\"}},{\"type\":\"DataPositionSelector\",\"start\":267,\"end\":283}]}},{\"@context\":\"http://www.w3.org/ns/anno.jsonld\",\"id\":\"http://www.hurriyet.com.tr/trump-secimi-kazandi-diye-ulkeyi-terk-ediyor-40275330\",\"type\":\"Annotation\",\"body\":\"test\",\"target\":{\"selector\":[{\"type\":\"RangeSelector\",\"startSelector\":{\"type\":\"XPathSelector\",\"value\":\"/div[13]/div[6]/div[2]/div/div/div/div/div[3]/div/div/div[4]/div[2]/p[2]\"},\"endSelector\":{\"type\":\"XPathSelector\",\"value\":\"/div[13]/div[6]/div[2]/div/div/div/div/div[3]/div/div/div[4]/div[2]/p[2]\"}},{\"type\":\"DataPositionSelector\",\"start\":267,\"end\":283}]}},{\"@context\":\"http://www.w3.org/ns/anno.jsonld\",\"id\":\"http://www.hurriyet.com.tr/trump-secimi-kazandi-diye-ulkeyi-terk-ediyor-40275330\",\"type\":\"Annotation\",\"body\":\"test\",\"target\":{\"selector\":[{\"type\":\"RangeSelector\",\"startSelector\":{\"type\":\"XPathSelector\",\"value\":\"/div[13]/div[6]/div[2]/div/div/div/div/div[3]/div/div/div[4]/div[2]/p[2]\"},\"endSelector\":{\"type\":\"XPathSelector\",\"value\":\"/div[13]/div[6]/div[2]/div/div/div/div/div[3]/div/div/div[4]/div[2]/p[2]\"}},{\"type\":\"DataPositionSelector\",\"start\":267,\"end\":283}]}},{\"@context\":\"http://www.w3.org/ns/anno.jsonld\",\"id\":\"http://www.hurriyet.com.tr/trump-secimi-kazandi-diye-ulkeyi-terk-ediyor-40275330\",\"type\":\"Annotation\",\"body\":\"test\",\"target\":{\"selector\":[{\"type\":\"RangeSelector\",\"startSelector\":{\"type\":\"XPathSelector\",\"value\":\"/div[13]/div[6]/div[2]/div/div/div/div/div[3]/div/div/div[4]/div[2]/p[2]\"},\"endSelector\":{\"type\":\"XPathSelector\",\"value\":\"/div[13]/div[6]/div[2]/div/div/div/div/div[3]/div/div/div[4]/div[2]/p[2]\"}},{\"type\":\"DataPositionSelector\",\"start\":267,\"end\":283}]}},{\"@context\":\"http://www.w3.org/ns/anno.jsonld\",\"id\":\"http://www.hurriyet.com.tr/trump-secimi-kazandi-diye-ulkeyi-terk-ediyor-40275330\",\"type\":\"Annotation\",\"body\":\"test\",\"target\":{\"selector\":[{\"type\":\"RangeSelector\",\"startSelector\":{\"type\":\"XPathSelector\",\"value\":\"/div[13]/div[6]/div[2]/div/div/div/div/div[3]/div/div/div[4]/div[2]/p[2]\"},\"endSelector\":{\"type\":\"XPathSelector\",\"value\":\"/div[13]/div[6]/div[2]/div/div/div/div/div[3]/div/div/div[4]/div[2]/p[2]\"}},{\"type\":\"DataPositionSelector\",\"start\":267,\"end\":283}]}},{\"@context\":\"http://www.w3.org/ns/anno.jsonld\",\"id\":\"http://www.hurriyet.com.tr/trump-secimi-kazandi-diye-ulkeyi-terk-ediyor-40275330\",\"type\":\"Annotation\",\"body\":\"test\",\"target\":{\"selector\":[{\"type\":\"RangeSelector\",\"startSelector\":{\"type\":\"XPathSelector\",\"value\":\"/div[13]/div[6]/div[2]/div/div/div/div/div[3]/div/div/div[4]/div[2]/p[2]\"},\"endSelector\":{\"type\":\"XPathSelector\",\"value\":\"/div[13]/div[6]/div[2]/div/div/div/div/div[3]/div/div/div[4]/div[2]/p[2]\"}},{\"type\":\"DataPositionSelector\",\"start\":267,\"end\":283}]}},{\"@context\":\"http://www.w3.org/ns/anno.jsonld\",\"id\":\"http://www.hurriyet.com.tr/trump-secimi-kazandi-diye-ulkeyi-terk-ediyor-40275330\",\"type\":\"Annotation\",\"body\":\"test\",\"target\":{\"selector\":[{\"type\":\"RangeSelector\",\"startSelector\":{\"type\":\"XPathSelector\",\"value\":\"/div[13]/div[6]/div[2]/div/div/div/div/div[3]/div/div/div[4]/div[2]/p[2]\"},\"endSelector\":{\"type\":\"XPathSelector\",\"value\":\"/div[13]/div[6]/div[2]/div/div/div/div/div[3]/div/div/div[4]/div[2]/p[2]\"}},{\"type\":\"DataPositionSelector\",\"start\":267,\"end\":283}]}},{\"@context\":\"http://www.w3.org/ns/anno.jsonld\",\"id\":\"http://www.hurriyet.com.tr/trump-secimi-kazandi-diye-ulkeyi-terk-ediyor-40275330\",\"type\":\"Annotation\",\"body\":\"test\",\"target\":{\"selector\":[{\"type\":\"RangeSelector\",\"startSelector\":{\"type\":\"XPathSelector\",\"value\":\"/div[13]/div[6]/div[2]/div/div/div/div/div[3]/div/div/div[4]/div[2]/p[2]\"},\"endSelector\":{\"type\":\"XPathSelector\",\"value\":\"/div[13]/div[6]/div[2]/div/div/div/div/div[3]/div/div/div[4]/div[2]/p[2]\"}},{\"type\":\"DataPositionSelector\",\"start\":267,\"end\":283}]}},{\"@context\":\"http://www.w3.org/ns/anno.jsonld\",\"id\":\"http://www.hurriyet.com.tr/trump-secimi-kazandi-diye-ulkeyi-terk-ediyor-40275330\",\"type\":\"Annotation\",\"body\":\"test\",\"target\":{\"selector\":[{\"type\":\"RangeSelector\",\"startSelector\":{\"type\":\"XPathSelector\",\"value\":\"/div[13]/div[6]/div[2]/div/div/div/div/div[3]/div/div/div[4]/div[2]/p[2]\"},\"endSelector\":{\"type\":\"XPathSelector\",\"value\":\"/div[13]/div[6]/div[2]/div/div/div/div/div[3]/div/div/div[4]/div[2]/p[2]\"}},{\"type\":\"DataPositionSelector\",\"start\":267,\"end\":283}]}}]";
    return dummyResponseString;
}

/**
 * Test method for Annotation List Object Creation
 */
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

/**
 * Creates specifier fields in given Annotation for highlighter
 * @param {string} currentAnnotation - The annotation specifier fields to be set
 */
function createFieldsForHighlighter(currentAnnotation) {
    if (currentAnnotation.target.hasOwnProperty('selector'))  {
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

    else if (currentAnnotation.target.hasOwnProperty('id')) {
        var xywh = currentAnnotation.target.id.split('=');
        var xywharray = xywh[1].split(',');
        var shapes = [];
        shapes[0] = {
            type: "rect",
            geometry:
            {
                x: parseInt(xywharray[0]),
                y: parseInt(xywharray[1]),
                width: parseInt(xywharray[2]),
                height: parseInt(xywharray[3])
            }
        };

        var src = xywh[0].split('#');
        currentAnnotation["text"] = currentAnnotation.body.value;
        currentAnnotation["src"] = src[0];
        currentAnnotation["ranges"] = [];
        currentAnnotation["quote"] = "asd";
        currentAnnotation["shapes"] = shapes;
        currentAnnotation["highlights"] = [];
    }

}


/**
 * Loads annotations for the current URL
 */
function loadAnnotationsForExtension() {
    getAnnotationsForCurrentUrl().then(function (response) {
        var annotationListResponse = response;
        if (annotationListResponse.success) { // success = true if server responds with a valid JSON with annotations in it.
            cardsList = JSON.stringify(annotationListResponse.annotations);
        }
    });

}


/**
 * Loads annotations for the current URL on to given object
 * @param {string} contentAnnotatorBM
 */
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

/**
 * Creates and returns hash value for user and password tuple
 * @param {string} user - Username as string
 * @param {string} password - Password as string
 * @return {string} hash of username and string
 */
function make_base_auth(user, password) {
    var tok = user + ':' + password;
    var hash = btoa(tok);
    return "Basic " + hash;
}


/**
 * Gets username and string from browsers storage in to storedCredentials object
 */
function readCredentials() {
    var keys = ["username", "password"];

    function storedCredentials(items) {
        //console.log("Stored Stuff : " + JSON.stringify(items));
    }

    chrome.storage.sync.get(keys, storedCredentials);
}


/**
 * Logs user in with given parameters
 * @param {string} username - Username as string
 * @param {string} password - Password as string
 * @param {string} callback
 */
function loginUser(username, password, callback) {
    try {
        $.ajax({
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

/**
 * Entrance point
 */
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


/**
 * Logs current logged in user out
 */
function logUserOut() {
    //reloading page with default html settings.
    window.location.href = "/html/index.html";
    chrome.browserAction.setPopup({popup: "/html/index.html"});
}



/**
 * Registers user in with given parameters
 * @param {string} name - name as string
 * @param {string} lName - surname as string
 * @param {string} pw - password as string
 * @param {string} mail - E-mail as string
 * @param {string} callback
 */
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
        $.ajax({
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
                    data.uname = mail;
                    data.password = pw;
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

/**
 * Sends annotations to server
 * @param  {commentValue} - Comments to be send
 * @param  {xpathSelectorData} - Selector data
 * @param  {quote} - Quote to be made
 * @return {}
 *
 */
function sendCreatedAnnnotation(commentValue, xpathSelectorData, quote, current, motivation) {

    var keys = ["username", "password"];

    function readStoredCredentials(items) {

        console.log("motivation is: " + motivation);

        var tabUrl = window.location.href;
        try {

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
                            "id": current.url + "#xywh=" + xpathSelectorData.geometry.x + "," + xpathSelectorData.geometry.y + "," + xpathSelectorData.geometry.width + "," + xpathSelectorData.geometry.height,
                            "type": "Image",
                            "format": "image/jpeg"
                        }
                    },
                    "publicAnnotation": true,
                    "motivation": motivation,
                };
            }

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
                    "publicAnnotation": true,
                    "motivation": motivation,
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
                    userAuthToken = make_base_auth(items.username, items.password);
                    xhr.setRequestHeader('Authorization', userAuthToken);
                },
                success: function (data) {
                    //callback(new ServiceResponse(null, data));
                    console.log("Completed sending annotation:" + JSON.stringify(data) + " ---");
                    annotationListOfPage.push(data.data);
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
    chrome.storage.sync.get(keys, readStoredCredentials);
}

/**
 * post updated text annotation to the server
 * @param  {updatedAnnotation} - Annotation to be updated
 * @return {}
 *
 * */
function sendUpdatedTextAnnnotation(updatedAnnotation) {

    var keys = ["username", "password"];

    function readStoredCredentials(items) {

        var annotation = findAnnotationInList(updatedAnnotation.ranges[0].startOffset, updatedAnnotation.ranges[0].endOffset);
        var idForReqArray = annotation.id.split('//');
        var idForReq = idForReqArray[1].split('/');

        try {
            var annotationPostData = {
                "annotation": {
                    "@context": "http://www.w3.org/ns/anno.jsonld",
                    "id": annotation.id,
                    "type": annotation.type,
                    "body": {
                        "type": annotation.body.type,
                        "value": updatedAnnotation.text,
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
                url: protocol + serverRootUrl + "/api/annotation/" + idForReq[1] + "/update",
                dataType: 'json',
                contentType: "application/json; charset=utf8",
                async: true,
                data: JSON.stringify(annotationPostData),
                beforeSend: function (xhr) {
                    userAuthToken = make_base_auth(items.username, items.password);
                    xhr.setRequestHeader('Authorization', userAuthToken);
                },
                success: function (data) {
                    //callback(new ServiceResponse(null, data));
                    console.log("Completed updated annotation:" + JSON.stringify(data) + " ---");
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
    chrome.storage.sync.get(keys, readStoredCredentials);
}

/**
 * post deleted text annotation to the server
 * @param  {deletedAnnotation}
 * @return {}
 *
 * */
function sendDeletedTextAnnnotation(deletedAnnotation) {

    var keys = ["username", "password"];

    function readStoredCredentials(items) {
        var annotation = findAnnotationInList(deletedAnnotation.ranges[0].startOffset, deletedAnnotation.ranges[0].endOffset);
        var idForReqArray = annotation.id.split('//');
        var idForReq = idForReqArray[1].split('/');

        $.ajax({
            type: "GET",
            url: protocol + serverRootUrl + "/api/annotation/" + idForReq[1] + "/delete",
            dataType: 'json',
            async: true,
            beforeSend: function (xhr) {
                userAuthToken = make_base_auth(items.username, items.password);
                xhr.setRequestHeader('Authorization', userAuthToken);
            },
            success: function (data) {
                //callback(new ServiceResponse(null, data));
                console.log("Completed deleted annotation:" + JSON.stringify(data) + " ---");
                loadAnnotationsForExtension();
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //callback(new ServiceResponse("BWAT005 => " + thrownError, null));
                console.log(xhr.responseText);
            }
        });
    }
    chrome.storage.sync.get(keys, readStoredCredentials);
}

/**
 * post updated image annotation to the server
 * @param  {updatedAnnotation} - Annotation to be updated
 * @return {}
 *
 * */
function sendUpdatedImageAnnnotation(updatedAnnotation) {

    var keys = ["username", "password"];

    function readStoredCredentials(items) {
        var annotation = findImageAnnotationInList(updatedAnnotation);
        var idForReqArray = annotation.id.split('//');
        var idForReq = idForReqArray[1].split('/');

        try {
            var annotationPostData = {
                "annotation": {
                    "@context": "http://www.w3.org/ns/anno.jsonld",
                    "id": annotation.id,
                    "type": annotation.type,
                    "body": {
                        "type": annotation.body.type,
                        "value": updatedAnnotation.text,
                        "format": annotation.body.format
                    },
                    "target": {
                        "source": annotation.target.source,
                        "id": annotation.target.id,
                        "type": annotation.target.type,
                        "format": annotation.target.format
                    }
                },
                "publicAnnotation": true
            };

            console.log(JSON.stringify(annotationPostData));

            $.ajax({
                type: "POST",
                url: protocol + serverRootUrl + "/api/annotation/" + idForReq[1] + "/update",
                dataType: 'json',
                contentType: "application/json; charset=utf8",
                async: true,
                data: JSON.stringify(annotationPostData),
                beforeSend: function (xhr) {
                    userAuthToken = make_base_auth(items.username, items.password);
                    xhr.setRequestHeader('Authorization', userAuthToken);
                },
                success: function (data) {
                    //callback(new ServiceResponse(null, data));
                    console.log("Completed updated annotation:" + JSON.stringify(data) + " ---");
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
    chrome.storage.sync.get(keys, readStoredCredentials);
}

/**
 * post deleted image annotation to the server
 * @param  {deletedAnnotation}
 * @return {}
 *
 * */
function sendDeletedImageAnnnotation(deletedAnnotation) {

    var keys = ["username", "password"];

    function readStoredCredentials(items) {
        var annotation = findImageAnnotationInList(deletedAnnotation);
        var idForReqArray = annotation.id.split('//');
        var idForReq = idForReqArray[1].split('/');

        $.ajax({
            type: "GET",
            url: protocol + serverRootUrl + "/api/annotation/" + idForReq[1] + "/delete",
            dataType: 'json',
            async: true,
            beforeSend: function (xhr) {
                userAuthToken = make_base_auth(items.username, items.password);
                xhr.setRequestHeader('Authorization', userAuthToken);
            },
            success: function (data) {
                //callback(new ServiceResponse(null, data));
                console.log("Completed deleted annotation:" + JSON.stringify(data) + " ---");
                loadAnnotationsForExtension();
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //callback(new ServiceResponse("BWAT005 => " + thrownError, null));
                console.log(xhr.responseText);
            }
        });
    }
    chrome.storage.sync.get(keys, readStoredCredentials);
}

/**
 * find annotation from annotation list of the page for the update and delete operations
 * @param  {startOffset, endOffset}
 * @return {annotation}
 *
 * */
function findAnnotationInList(startOffset, endOffset) {
    for (var i = 0; i < annotationListOfPage.length; i++) {
        if(annotationListOfPage[i].target.hasOwnProperty('selector')){
            if (annotationListOfPage[i].target.selector[1].start == startOffset &&
                annotationListOfPage[i].target.selector[1].end == endOffset) {
                return annotationListOfPage[i];
            }
        }
    }
    return null;
}

/**
 * find image annotation from annotation list of the page for the update and delete operations
 * @param  {deletedAnnotation}
 * @return {annotation}
 *
 * */
function findImageAnnotationInList(deletedAnnotation) {
    for (var i = 0; i < annotationListOfPage.length; i++) {
        if(annotationListOfPage[i].target.hasOwnProperty('id')){
            var srcArray = annotationListOfPage[i].target.id.split('#');
            var xywh = annotationListOfPage[i].target.id.split('=');
            var xywharray = xywh[1].split(',');
            var src = srcArray[0];

            if (src == deletedAnnotation.src && parseInt(xywharray[0]) == deletedAnnotation.shapes[0].geometry.x &&
                parseInt(xywharray[1]) == deletedAnnotation.shapes[0].geometry.y &&
                parseInt(xywharray[2]) == deletedAnnotation.shapes[0].geometry.width &&
                parseInt(xywharray[3]) == deletedAnnotation.shapes[0].geometry.height) {
                return annotationListOfPage[i];
            }
        }
    }
    return null;
}
