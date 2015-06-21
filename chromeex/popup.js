var highlightImportantWords = (function() {
	_sendRequestToGetSelectedText = function() {
		var request = {
			method : "getSelectedText"
		};
		_sendMessageToPage(request, _processSelectedText);
	};
	_sendMessageToPage = function(request, callback) {
		chrome.tabs.query({
			active : true,
			currentWindow : true
		}, function(tabs) {
			chrome.tabs.sendMessage(tabs[0].id, request, callback);
		});
	};
	_processSelectedText = function(response) {
		alert(response.selectedText);
		var _text = response.selectedText;
		var words = _text.split(' ');
		var request = {
			method : "importantWords",
			importantWords : words
		};
		_sendMessageToPage(request, null);
	};
	_highlightImportantWords = function() {

	};
	return {
		getSelectedTextFromBrowser : function(response) {
			return _sendRequestToGetSelectedText();
		}
	};
}());

document.addEventListener('DOMContentLoaded', function() {
	document.getElementById('highlightImportantWords').addEventListener(
			'click', highlightImportantWords.getSelectedTextFromBrowser);
});