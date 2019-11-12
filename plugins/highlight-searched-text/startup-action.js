/*\
title: $:/plugins/bimlas/highlight-searched-text/startup-action.js
type: application/javascript
module-type: startup

Add event listeners to highlight searched text

\*/

(function() {

	/*jslint node: false, browser: true */
	/*global $tw: true */
	"use strict";

	// Export name and synchronous status
	exports.name = "highlightsearch";
	exports.platforms = ["browser"];
	exports.after = ["story"];
	exports.synchronous = true;

	exports.startup = function() {
		$tw.wiki.addEventListener("change",function(changedTiddlers) {
			if(Object.keys(changedTiddlers).reduce(function(accumulator,current) {
				return accumulator && (!(searchTextBecameEmpty(current) || searchPopupBecameHidden(current,changedTiddlers[current])))
			},true))
				return;
			updateHighlighting();
		});
		$tw.hooks.addHook("th-navigating",function(event) {
			// TODO: It should update highlight only if navigated from search results - how to check this?
			setTimeout(updateHighlighting,$tw.wiki.getTiddlerText("$:/config/AnimationDuration"));
			return (event);
		});
	};

	function searchPopupBecameHidden(title,value) {
		return title.startsWith("$:/state/popup/search-dropdown") && value.deleted
	}

	function searchTextBecameEmpty(title) {
		return title === "$:/temp/search" && $tw.wiki.getTiddlerText("$:/temp/search") === ""
	}

	var
		Mark = require("$:/plugins/bimlas/highlight-searched-text/mark.js"),
		markInstance;

	function updateHighlighting() {
		var searchedText = $tw.wiki.getTiddlerText("$:/temp/search");
		if(!markInstance) markInstance = new Mark(document.getElementsByClassName("tc-story-river")[0])
		markInstance.unmark();
		if(searchedText !== "") markInstance.mark(searchedText);
	}
})();
