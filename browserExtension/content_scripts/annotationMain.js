//Definitions
var protocol = "http://";
var serverRootUrl = "46.196.100.145";
//var serverRootUrl = "192.168.0.103";
//var loginPostUri = ":8080/healthTracker/auth";
var loginPostUri = "/healthTracker/auth";
//var registerPostUri = ":8080/healthTracker//registerAuth";
var registerPostUri = "/healthTracker//registerAuth";
//var annotationStorePostUri = ":8080/healthTracker";
var annotationStorePostUri = "/healthTracker";

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
    startAnnotation(request.data);
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


function startAnnotationDrawing() {
    if ($('#selectionBox').length) {
        alert("Please select an area to annotate");
    } else {
        alert("Something is wrong with annotation selector");
    }
    // var html = document.documentElement;
    // html.className += " annotateClass";


    var mouse_down = false;

    var start_pos_x = 0;
    var start_pos_y = 0;
    var end_pos_x = 0;
    var end_pos_y = 0;

    $(function () {
        $('html').mousedown(function (e) {
            mouse_down = true;
            start_pos_x = e.pageX;
            start_pos_y = e.pageY;
        });

        $('html').mousemove(function (e) {
            end_pos_x = e.pageX;
            end_pos_y = e.pageY;

            if (mouse_down) {
                draw(start_pos_x, start_pos_y, end_pos_x, end_pos_y);
            }
        });

        $('html').mouseup(function (e) {
            end_pos_x = e.pageX;
            end_pos_y = e.pageY;

            if (mouse_down) {
                draw(start_pos_x, start_pos_y, end_pos_x, end_pos_y);
            }

            mouse_down = false;

            get_elements(start_pos_x, start_pos_y, end_pos_x, end_pos_y);
        });
    });
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
function startAnnotation(data) {

    if (!window.jQuery) {
        alert("JQ does NOT work");
    }
    startAnnotatorJS();

    //startAnnotationDrawing();

    function draw(x1, y1, x2, y2) {
        // console.log("Drawing top:" + x1 + ", left:" + x2 + ", width:" + (x2 - x1) + ", height:" + (y2 - y1));
        var canvas = document.getElementById('selectionBox');
        canvas.style = 'position: absolute; top: ' + y1 + 'px; left: ' + x1 + 'px; height: ' + (y2 - y1) + 'px; width: ' + (x2 - x1) + 'px; border: 1px solid blue;';
        // $('.selectionBox').css({
        //     'left': x1 + 'px',
        //     'top': y1 + 'px',
        //     'width': (x2 - x1) + 'px',
        //     'height': (y2 - y1) + 'px'
        // });
    }

    function get_elements(x1, y1, x2, y2) {
        // var element_list = '';
        //
        // $('#main *').each(function () {
        //     if (!($(this).attr('class') == 'selectionBox')) {
        //         var offset = $(this).offset();
        //
        //         var element_x1 = offset.left;
        //         var element_y1 = offset.top;
        //         var element_x2 = offset.left + $(this).width();
        //         var element_y2 = offset.top + $(this).height();
        //
        //         if (
        //             (
        //                 ((x1 >= element_x1 && x1 <= element_x2) && (y1 >= element_y1 && y1 <= element_y2)) ||
        //                 ((x2 >= element_x1 && x2 <= element_x2) && (y1 >= element_y1 && y1 <= element_y2)) ||
        //                 ((x2 >= element_x1 && x2 <= element_x2) && (y2 >= element_y1 && y2 <= element_y2)) ||
        //                 ((x1 >= element_x1 && x1 <= element_x2) && (y2 >= element_y1 && y2 <= element_y2))
        //             ) ||
        //             (
        //                 ((element_x1 >= x1 && element_x1 <= x2) && (element_y1 >= y1 && element_y1 <= y2)) ||
        //                 ((element_x2 >= x1 && element_x2 <= x2) && (element_y1 >= y1 && element_y1 <= y2)) ||
        //                 ((element_x2 >= x1 && element_x2 <= x2) && (element_y2 >= y1 && element_y2 <= y2)) ||
        //                 ((element_x1 >= x1 && element_x1 <= x2) && (element_y2 >= y1 && element_y2 <= y2))
        //             )
        //         ) {
        //             element_list += this.nodeName + ' -> ' + $(this).attr('class') + '<br />';
        //         }
        //     }
        // });
        //
        // $('.output').html(element_list);
        // return getElementsInRegion(x1,y1,x2-x1,y2-y1);
        function getElementsInRegion(x, y, width, height) {
            console.log("Selecting elements in region x,y:" + x + ", " + y + " , width:" + width + ", height:" + height);
            var elements = [],
                expando = +new Date,
                cx = x,
                cy = y,
                curEl;

            height = y + height;
            width = x + width;

            while ((cy += 5) < height) {
                cx = x;
                while (cx < width) {
                    curEl = document.elementFromPoint(cx, cy);
                    if (curEl && !curEl[expando]) {
                        curEl[expando] = new Number(0);
                        elements.push(curEl);
                        cx += curEl.offsetWidth;
                    } else {
                        cx += 5;
                    }
                }
            }

            return elements;

        }

        console.log("Getting elements...:" + getElementsInRegion(x1, y1, x2 - x1, y2 - y1));
    }


}

chrome.runtime.onMessage.addListener(processRequest);
