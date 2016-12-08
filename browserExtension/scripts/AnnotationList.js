

var jsonString = '[{"authorName":"sasi Beirkdar","target":"this text was selected","body":"some comment"},{"authorName":"john Smith", "target" :"some other text", "body":"I like this idea"}]';
var sarahSting = [];
//var myData = JSON.parse(jsonString);
// var cardsList  = document.getElementById('cards')
// for (i = 0; i < myData.length; i++)
//     {
//         var dt = myData[i];
//         //add main card
//         var newCard = document.createElement('div');
//         var cardAttr = document.createAttribute('class');
//         cardAttr.value = 'panel panel-default';
//         newCard.setAttributeNode(cardAttr);
//
//         //add panel body
//         var divBody = document.createElement('div');
//         var bodyAttr = document.createAttribute('class');
//         bodyAttr.value = 'panel-body';
//         divBody.setAttributeNode(bodyAttr);
//         newCard.appendChild(divBody);
//
//         //add author tag
//         var divAuthor = document.createElement('h5');
//         divAuthor.innerHTML = dt.authorName;
//         divBody.appendChild(divAuthor);
//
//         //add selected text tag
//         var divSelectedText = document.createElement('p');
//         divSelectedText.innerHTML = dt.target;
//         divBody.appendChild(divSelectedText);
//
//         //add Comment
//         var divComment = document.createElement('p');
//         divComment.innerHTML = dt.body;
//         divBody.appendChild(divComment);
//
//         cardsList.appendChild(newCard);
//     }


var myData = sarahSting;
var cardsList  = document.getElementById('cards')
for (i = 0; i < myData.length; i++)
{
    var dt = myData[i];
    //add main card
    var newCard = document.createElement('div');
    var cardAttr = document.createAttribute('class');
    cardAttr.value = 'panel panel-default';
    newCard.setAttributeNode(cardAttr);

    //add panel body
    var divBody = document.createElement('div');
    var bodyAttr = document.createAttribute('class');
    bodyAttr.value = 'panel-body';
    divBody.setAttributeNode(bodyAttr);
    newCard.appendChild(divBody);

    //add author tag
    var divAuthor = document.createElement('h5');
    divAuthor.innerHTML = "sarah";//dt.authorName;
    divBody.appendChild(divAuthor);

    //add selected text tag
    var divSelectedText = document.createElement('p');
    divSelectedText.innerHTML = dt.target.selector.exact;
    console.log("something")
    console.log(dt.target.selector.exact);
    divBody.appendChild(divSelectedText);

    //add Comment
    var divComment = document.createElement('p');
    divComment.innerHTML = dt.body.value;
    divBody.appendChild(divComment);

    cardsList.appendChild(newCard);
}