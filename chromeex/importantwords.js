var textGetter = (function() {
	return {
		getSelectedText : function() {
			if (window.getSelection) {
				return window.getSelection().toString();
			} else if (document.selection) {
				return document.selection.createRange().text;
			}
			return '';
		}
	};
}());

var impWordsPopup = (function() {
	return {
		mask : function() {
			var mask = $('<div id="backgroundMask"> </div>');
			mask.appendTo(document.body);
		},

		highlight : function(impwords) {
			var $body = $(document.body);
			for ( var i = 0; i < impwords.length; i++) {
				$body.highlight(impwords[i], "highlightedword");
			}
		},

		open : function(impwords) {
			var overlay = $('<div id="overlay"> </div>');
			overlay.appendTo(document.body);
			var wordsTable = $('<table width="100%" v-align="center">');
			wordsTable.appendTo(overlay);
			var numRows = (impwords.length) / 3;
			var nWord = 0;
			for ( var i = 0; i < numRows; i++) {
				var row = $('<tr>');
				row.appendTo(wordsTable);
				for ( var j = 0; j < 3; j++) {
					var column = $('<td>');
					column.text(impwords[nWord++]);
					column.appendTo(row);
				}
			}
		},

		createHighlighter : function() {
			$.fn.highlight = function(str, className) {
				var regex = new RegExp(str, "gi");
				$('*', 'body').andSelf().contents().filter(function() {
					return $(this).children().length == 0;
				}).filter(function() {
					// Only match when contains 'simple string' anywhere in the
					// text
					return regex.test($(this).text());
				}).each(
					function() {
						var $element = $(this);
						if(this.nodeType === 3){
							//we are at a text node
							//get the parent
							$element = $(this).parent();
						}
						var newNodeValue = ($element.text() || "").replace(regex,
								function(match) {
									return "<span class=\"" + className
											+ "\">" + match + "</span>";
								});
						$element.html(newNodeValue);
					});
			};
		}
	};
}());

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	console.log(sender.tab ? "from a content script:" + sender.tab.url
			: "from the extension");
	if (request.method == "getSelectedText") {
		sendResponse({
			selectedText : textGetter.getSelectedText()
		});
	}
	if (request.method == "importantWords") {
		console.log("important words" + request.importantWords);
		alert(request.importantWords);
		impWordsPopup.mask();
		impWordsPopup.createHighlighter();
		impWordsPopup.highlight(request.importantWords);
		// impWordsPopup.open(request.importantWords);
	}
});
