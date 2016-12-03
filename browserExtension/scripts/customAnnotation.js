window.onload = function () {

    console.log('Content script loaded and started');
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
            width:0,
            x:0,
            y:0

        };
        return {

            pluginInit: function () {
                this.annotator
                    .subscribe("annotationCreated", function (annotation) {
                        console.info("The annotation: %o has just been created!", annotation);
                        var current = $.extend(true, {}, singleAnnotation);
                        if (annotation.hasOwnProperty('src')){
                            current.url = annotation.src;
                            current.height = annotation.shapes[0].height;
                            current.width = annotation.shapes[0].width;
                            current.x = annotation.shapes[0].x;
                            current.y = annotation.shapes[0].y;
                        }
                        else{
                            current.startOffset = annotation.ranges[0].startOffset;
                            current.endOffset = annotation.ranges[0].endOffset;
                            current.quote = annotation.quote;
                        }
                        current.comment = annotation.text;
                        json.push(current);
                        if (annotation.hasOwnProperty('src')) {
                            sendCreatedAnnnotation(current.comment, annotation.shapes[0],"");
                        }
                        else{
                            sendCreatedAnnnotation(current.comment, annotation.ranges[0], current.quote);
                        }
                        console.log(JSON.stringify(json));
                    })
                    .subscribe("annotationUpdated", function (annotation) {
                        console.info("The annotation: %o has just been updated!", annotation);
                        if (annotation.hasOwnProperty('src')){

                        }
                        else{
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
    console.log('test1');
    contentAnnotatorBM = $('body').annotator();
    contentAnnotatorBM.annotator('addPlugin', 'StoreLogger');
    contentAnnotatorBM.annotator('addPlugin', 'AnnotoriousImagePlugin');
    console.log('test2');
    console.log(contentAnnotatorBM);
    testGettingAnnotationsForUrl();
    function testGettingAnnotationsForUrl() {
        // Example usage of getting Annotations for current url.
        getAnnotationsForCurrentUrl().then(function (response) {
            var annotationListResponse = response;

            if (annotationListResponse.success) { // success = true if server responds with a valid JSON with annotations in it.

                // Now we have responseObject , time to get annotationList.
                var annotationList = annotationListResponse.annotations;
                console.log("AnnotationList:" + JSON.stringify(annotationList));
                for (var i = 0; i < annotationList.length; i++) {

                    var currentAnnotation = annotationList[i];
                    //Every annotation object corresponds what we have as JSON-LD.
                    console.log("body = " + currentAnnotation.body);
                    console.log("target object = " + currentAnnotation.target);
                    console.log("type = " + currentAnnotation.type); // we reach each root variables like this.

                    //for sub types ( for instance selector )
                    console.log("selector object = " + currentAnnotation.target.selector);
                    console.log("selector[1].start = " + currentAnnotation.target.selector[1].start);
                    console.log("selector[0].startSelector.value = " + currentAnnotation.target.selector[0].startSelector.value); // anything relating to our JSON works.

                    //for geekModeString

                    console.log("geek String:" + currentAnnotation.getGeekString());

                    break; // don't want to flood console : )
                }

            } else { // Any other errors cause success == false . Network error, empty response, timeout, invalid json etc...
                var errorMessage = annotationListResponse.errorMsg; // if something bad happened, brief details will be stored as errorMsg. Remember to check console.log as well.
                // TODO something to do with errorMessage, alert(errorMessage) may be.
                console.log("ERROR ENCOUNTERED WHILE FETCHING ANNOTATIONS:" + errorMessage);
            }
        });
        //var url = "http://example.org/ebook1";
        //getAnnotationsForUrl(url).then(function(response){
        //
        //});
    }
};