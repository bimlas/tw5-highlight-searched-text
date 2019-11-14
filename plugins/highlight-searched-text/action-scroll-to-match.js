/*\
title: $:/plugins/bimlas/highlight-searched-text/action-scroll-to-match.js
type: application/javascript
module-type: widget

Action widget to scroll to the next match in story river.

\*/
(function() {

	/*jslint node: false, browser: true */
	/*global $tw: true */
	"use strict";

	var Widget = require("$:/core/modules/widgets/widget.js").widget;
	var updateHighlighting = require('$:/plugins/bimlas/highlight-searched-text/update-highlighting.js');

	var ScrollToMatch = function(parseTreeNode,options) {
		var self = this;
		this.initialise(parseTreeNode,options);
	};

	/*
	Inherit from the base widget class
	*/
	ScrollToMatch.prototype = new Widget();

	/*
	Render this widget into the DOM
	*/
	ScrollToMatch.prototype.render = function(parent,nextSibling) {
		this.computeAttributes();
		this.execute();
	};

	/*
	Compute the internal state of the widget
	*/
	ScrollToMatch.prototype.execute = function() {
		this.actionDirection = this.getAttribute("$direction");
	};

	/*
	Refresh the widget by ensuring our attributes are up to date
	*/
	ScrollToMatch.prototype.refresh = function(changedTiddlers) {
		var changedAttributes = this.computeAttributes();
		if(changedAttributes["$direction"]) {
			this.refreshSelf();
			return true;
		}
		return this.refreshChildren(changedTiddlers);
	};

	/*
	Invoke the action associated with this widget
	*/
	ScrollToMatch.prototype.invokeAction = function(triggeringWidget,event) {
		var isHighlightingUpdated = updateHighlighting();
		var allMatches = $tw.pageContainer.querySelectorAll('mark');
		if(allMatches.length === 0) return true;
		if(isHighlightingUpdated && resultsAreFoundOnTheCurrentScreen()) return true;

		var targetMatch = this.actionDirection === "previous"
			? findBackwardFromThePreviousHalfScreen()
			: findForwardFromTheNextHalfScreen();

		$tw.pageScroller.scrollIntoView(targetMatch, function() {
			return alignBoundingBoxToMiddleOfTheScreen(targetMatch.getBoundingClientRect());
		});
		return true; // Action was invoked

		function resultsAreFoundOnTheCurrentScreen() {
			return Array.from(allMatches).reduce(function(accumulator,match) {
				return accumulator || (getPositionOfElementRelativeToScreen(match) === 0);
			}, false);
		}

		function findBackwardFromThePreviousHalfScreen() {
			for(var index = allMatches.length-1; index >= 0; index--) {
				if(getPositionOfElementRelativeToScreen(allMatches[index]) < 0) {
					return allMatches[index];
				}
			}
			return allMatches[allMatches.length-1];
		}

		function findForwardFromTheNextHalfScreen() {
			for(var index = 0; index < allMatches.length; index++) {
				if(getPositionOfElementRelativeToScreen(allMatches[index]) > 0) {
					return allMatches[index];
				}
			}
			return allMatches[0];
		}

		function alignBoundingBoxToMiddleOfTheScreen(boundingBox) {
			boundingBox.y -= window.innerHeight / 2;
			return boundingBox;
		}

		function getPositionOfElementRelativeToScreen(elem) {
			var elementYOffset = elem.getBoundingClientRect().y;
			if (elementYOffset < 0) return -1;
			if (elementYOffset > window.innerHeight - 30 /* height of the toolbar */) return 1;
			return 0;
		}
	};

	exports["action-scroll-to-match"] = ScrollToMatch;

})();
