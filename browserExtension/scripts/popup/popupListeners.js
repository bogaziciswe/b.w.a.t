// Inform the background page that
// this tab should have a page-action
var cardsList = {};

chrome.runtime.sendMessage({
    from:    'content',
    subject: 'showPageAction'
});

// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function (msg, sender, response) {
    // First, validate the message's structure
    if ((msg.from === 'popup') && (msg.subject === 'DOMInfo')) {
        response(JSON.parse(cardsList, true ));
    }
});