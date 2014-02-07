'use strict';

/**************************************************************
 * logger.js
 * 
 * Allows Logging of Engine events for debugging purposes
 * In the future, should also allow Logging of Game events
 *************************************************************/


/**************************************************************
 * Main Logger
 *************************************************************/

mice.Logger = new function() {
	// Log collection
	var logs = [];
	
	var toConsole = function(log, type) {
		console[type](log);
	};
	
	var toAlert = function(log, type) {
		alert(type +': '+ log);
	};
	
	// Create a new Log
	this.Log = function(log, type) {
		log = log || '';
		type = type || 'log'; // error, warn, log :: As per function names for Console API
		
		// Currently just log to console, later add other options and allow Game to choose
		toConsole(log, type);
	};
	
	// Clears logs array
	this.ClearLog = function() {
		log = [];
	};
};
