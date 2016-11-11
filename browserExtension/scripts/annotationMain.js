//Definitions
var protocol = "http://";
//var serverRootUrl = "localhost:8080";
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
 * var annotationResponse = getAnnotationsForUrl("http://www.hurriyet.com/test.html");
 * var errorMsg = annotationResponse.errorMsg;
 * if(errorMsg == null ){
 *   // Your code goes here, succesfully fetched annotations
 * }else{
 *  // Something went wrong. check console.log() and see annotationResponse.errorMsg.
 * }
 * @param pageUrl
 */
function getAnnotationsForUrl(pageUrl) {
    //TODO get annotations from server with pageUrl.
    var testResponseString = getDummyAnnotationResponseString();
    var resp;
    try {
        resp = new AnnotationListResponse(testResponseString, null);
    } catch (err) {
        resp = new AnnotationListResponse(null, err.message);
    }
    return resp;
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
            "body": {
                "type": "TextualBody",
                "value": "commentValue",
                "format": "text/plain"
            },
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
            async: true,
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

