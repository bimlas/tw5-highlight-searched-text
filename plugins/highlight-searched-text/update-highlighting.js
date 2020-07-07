/*\
title: $:/plugins/bimlas/highlight-searched-text/update-highlighting.js
type: application/javascript
module-type: library

Update highlight of searched text (find in page)

\*/

var
	Mark = require("$:/plugins/bimlas/highlight-searched-text/mark.js"),
	markInstance;
	previousSearchedText = '';

module.exports = function(force = false, customSearchedText = null) {
	var searchTiddler = $tw.wiki.getTiddlerText("$:/config/bimlas/highlight-searched-text/search-tiddler");
	var searchedText = customSearchedText !== null ? customSearchedText : $tw.wiki.getTiddlerText(searchTiddler);
	var totalCounter = 0;

	if((searchedText === previousSearchedText) && !force) return false;

	if(!markInstance) markInstance = new Mark(document.getElementsByClassName("tc-story-river")[0]);
	markInstance.unmark();
	if(searchedText !== "") markInstance.mark(searchedText, {
		exclude: [
			".tc-tiddler-edit-frame *"
		],
		filter: function(node, term, count) {
			totalCounter = count + 1;
			return true;
		}
	});
	setCounterTiddler(totalCounter);
	previousSearchedText = searchedText;
	return true;
};

function setCounterTiddler(totalCounter) {
	var defaultFields = $tw.wiki.getCreationFields();
	var tiddlerFields = {
		title: "$:/temp/bimlas/highlight-searched-text/counter",
		text: "(" + totalCounter + ")"
	};
	$tw.wiki.addTiddler(new $tw.Tiddler(tiddlerFields, defaultFields));
}
