window.onload = function () {

    //console.log('Content script loaded and started');
    var json = [];

    readCredentials();
    function findAnnotation(startOffset, endOffset) {
        for (var i = 0; i < json.length; i++) {
            if (json[i].startOffset == startOffset && json[i].endOffset == endOffset) {
                return i;
            }
        }
        return null;
    }


    Annotator.Plugin.StoreLogger = function (element) {
        var singleAnnotation = {
            startOffset: 0,
            endOffset: 0,
            quote: '',
            comment: '',
            url: '',
            height: 0,
            width: 0,
            x: 0,
            y: 0

        };
        return {

            pluginInit: function () {
                this.annotator
                    .subscribe("annotationCreated", function (annotation) {
                        console.info("The annotation: %o has just been created!", JSON.stringify(annotation));
                        var current = $.extend(true, {}, singleAnnotation);
                        if (annotation.hasOwnProperty('src')) {
                            current.url = annotation.src;
                            current.height = annotation.shapes[0].height;
                            current.width = annotation.shapes[0].width;
                            current.x = annotation.shapes[0].x;
                            current.y = annotation.shapes[0].y;
                        }
                        else {
                            current.startOffset = annotation.ranges[0].startOffset;
                            current.endOffset = annotation.ranges[0].endOffset;
                            current.quote = annotation.quote;
                        }
                        current.comment = annotation.text;
                        json.push(current);
                        if (annotation.hasOwnProperty('src')) {
                            sendCreatedAnnnotation(current.comment, annotation.shapes[0], "");
                        }
                        else {
                            sendCreatedAnnnotation(current.comment, annotation.ranges[0], current.quote);
                        }
                        console.log(JSON.stringify(json));
                    })
                    .subscribe("annotationUpdated", function (annotation) {
                        console.info("The annotation: %o has just been updated!", annotation);
                        if (annotation.hasOwnProperty('src')) {

                        }
                        else {
                            var offset = findAnnotation(annotation.ranges[0].startOffset, annotation.ranges[0].endOffset);
                            if (offset !== null) {
                                json[offset].comment = annotation.text;
                            }
                        }
                        console.log(JSON.stringify(json));
                    })
                    .subscribe("annotationDeleted", function (annotation) {
                        console.info("The annotation: %o has just been deleted!", annotation);
                        var offset = findAnnotation(annotation.ranges[0].startOffset, annotation.ranges[0].endOffset);
                        if (offset !== null) {
                            json.splice(offset, 1);
                        }
                        console.log(JSON.stringify(json));
                    });
            }
        }
    };

    var contentAnnotatorBM;
    //console.log('test1');
    contentAnnotatorBM = $('body').annotator();
    contentAnnotatorBM.annotator('addPlugin', 'StoreLogger');
    contentAnnotatorBM.annotator('addPlugin', 'AnnotoriousImagePlugin');
    //console.log('test2');
    //console.log(contentAnnotatorBM);
    loadAnnotationsForPage(contentAnnotatorBM);
};