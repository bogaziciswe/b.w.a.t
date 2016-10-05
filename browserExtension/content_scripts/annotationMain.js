function processRequest(request, sender, sendResponse) {
    preProcess();
    startAnnotation(request.data);
    chrome.runtime.onMessage.removeListener(processRequest);
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


function startAnnotation(data) {

    if (!window.jQuery) {
        alert("JQ does NOT work");
    }
    //

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
