
var globalInfo;
function setDOMInfo(info) {
    console.log(info);
    globalInfo = info;

    var myData = info;
    var cardsList  = document.getElementById('cards');
    $('#cards').empty();
    if(myData == undefined) {
        return;
    }

    for (var i = 0; i < myData.length; i++)
    {
        var dt = myData[i];
        //add main card
        var newCard = document.createElement('div');
        var cardAttr = document.createAttribute('class');
        cardAttr.value = 'panel panel-default';
        newCard.setAttributeNode(cardAttr);

        //add date
        var spanDate = document.createElement('span');
        //var date = new Date(dt.annotation.created);
        //var day = date.getDate();
        //var month = date.getMonth() +1;
        //var year = date.getFullYear();
        //var convertedDate =day+'/'+month+'/'+year;
        var dateArr = dt.annotation.created.split('T');
        var convertedDate = dateArr[0];
        spanDate.innerHTML = convertedDate;
        var spanAttr = document.createAttribute('class');
        spanAttr.value = 'pull-right';
        spanDate.setAttributeNode(spanAttr);
        newCard.appendChild(spanDate);

        //add panel body
        var divBody = document.createElement('div');
        var bodyAttr = document.createAttribute('class');
        bodyAttr.value = 'panel-body';
        divBody.setAttributeNode(bodyAttr);
        newCard.appendChild(divBody);

        //add author tag
        var divAuthor = document.createElement('h5');
        divAuthor.innerHTML = "<b>Author: </b>" + dt.user.firstName + " " + dt.user.lastName;//dt.authorName;
        divBody.appendChild(divAuthor);

        //add selected text tag
        var divSelectedText = document.createElement('p');
        divSelectedText.innerHTML = "<b>Annotation:</b> "+dt.annotation.target.selector[2].exact;
        console.log("something");
        console.log(dt.annotation.target.selector[2].exact);
        divBody.appendChild(divSelectedText);

        //add Comment
        var divComment = document.createElement('p');
        divComment.innerHTML = "<b>Comment:</b> "+ dt.annotation.body.value;
        divBody.appendChild(divComment);

        //add Comment
        var divMotivation = document.createElement('p');
      var motivationString = "";
        if (dt.motivation == "")
        {
motivationString = "Comment";}
            else{
            motivationString = dt.motivation;
        }
        divMotivation.innerHTML = "<b>Motivation:</b> "+ motivationString;
        divBody.appendChild(divMotivation);

        cardsList.appendChild(newCard);
    }
}

function setGeekMode(info) {
    console.log(info);
    var myData = info;

    var cardsList  = document.getElementById('cards');
    $('#cards').empty();
    if(myData == undefined) {
        return;
    }

    for (var i = 0; i < myData.length; i++)
    {
        var dt = myData[i];
        //add main card
        var newCard = document.createElement('div');
        var cardAttr = document.createAttribute('class');
        cardAttr.value = 'panel panel-default';
        newCard.setAttributeNode(cardAttr);

        //data
        var jsonSpan =  document.createElement('span');
        var data = JSON.stringify(dt.annotation);
        var geekString = data.replace('{','{"@context":"http://www.w3.org/ns/anno.jsonld",');
        var zz = geekString.replace(/\,/g, ',<br>');
        jsonSpan.innerHTML = zz;
        newCard.appendChild(jsonSpan);

        cardsList.appendChild(newCard);
    }
}

function geekModeFun(el)
{
    if ( el.value === "Geek Mode" )
    {  el.value = "User Mode";
         setGeekMode(globalInfo);
    }
    else {
        el.value = "Geek Mode";
        setDOMInfo(globalInfo);
    }
}

document.addEventListener("click", function (e) {

    if (e.target.id == "geekModeLink") {
        geekModeFun(e.target);
    }


});

// Once the DOM is ready...
window.addEventListener('DOMContentLoaded', function () {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function (tabs) {
        chrome.tabs.sendMessage(
            tabs[0].id,
            {from: 'popup', subject: 'DOMInfo'},
            // ...also specifying a callback to be called
            //    from the receiving end (content script)
            setDOMInfo);
    });
});