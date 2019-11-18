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

module.exports = function(force) {
	var searchTiddler = $tw.wiki.getTiddlerText("$:/config/bimlas/highlight-searched-text/search-tiddler");
	var searchedText = $tw.wiki.getTiddlerText(searchTiddler);

	if((searchedText === previousSearchedText) && !force) return false;

	if(!markInstance) markInstance = new Mark(document.getElementsByClassName("tc-story-river")[0]);
	markInstance.unmark();
	if(searchedText !== "") markInstance.mark(searchedText);
	previousSearchedText = searchedText;
	return true;
};
