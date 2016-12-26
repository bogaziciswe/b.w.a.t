window.onload = function () {

    var json = [];

    readCredentials();

    /**
     * create annotator plugin for crud operations
     * @param  {element}
     * @return {plugin}
     *
     * */
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
                        var current = $.extend(true, {}, singleAnnotation);
                        var motivation = window.prompt("Could you define your motivation for this annotation?", "Stating my opinion");
                        //current.motivation = motivation;
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
                        json.push(annotation);
                        if (annotation.hasOwnProperty('src')) {
                            sendCreatedAnnnotation(current.comment, annotation.shapes[0], "", current, motivation);
                        }
                        else {
                            sendCreatedAnnnotation(current.comment, annotation.ranges[0], current.quote, current, motivation);
                        }
                    })
                    .subscribe("annotationUpdated", function (annotation) {
                        if (annotation.hasOwnProperty('src')) {
                            sendUpdatedImageAnnnotation(annotation);
                        }
                        else {
                            sendUpdatedTextAnnnotation(annotation);
                        }
                    })
                    .subscribe("annotationDeleted", function (annotation) {
                        if (annotation.hasOwnProperty('src')) {
                            sendDeletedImageAnnnotation(annotation);
                        }
                        else {
                            sendDeletedTextAnnnotation(annotation);
                        }
                    });
            }
        }
    };

    // New Plugin created for text and image annotation
    var contentAnnotatorBM;
    contentAnnotatorBM = $('body').annotator();
    contentAnnotatorBM.annotator('addPlugin', 'StoreLogger');
    contentAnnotatorBM.annotator('addPlugin', 'AnnotoriousImagePlugin');
    loadAnnotationsForPage(contentAnnotatorBM);
};