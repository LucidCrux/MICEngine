'use strict';

/**************************************************************
 * logger.js
 * 
 * Allows Logging of Engine events for debugging purposes
 * In the future, should also allow Logging of Game events
 *************************************************************/

mice.LOG_LENGTH = 100; // Maximum number of entries stored per log

/**************************************************************
 * Main Logger
 *************************************************************/

Logger = new function() {
	//enums
	// Log Levels, higher numbers should be less important.
	this.LOG = -1 // Default log level indicating output to a non-console log
	this.ERROR = 0; // mice.logLevel should never be set below 0, so always log errors.
	this.WARN = 1;
	this.INFO = 2;
	this.ALL  = 99; // even game logs are output to the console
	
	// Log collection
	var logs = {
			gameLog: {id: 'gameLog', entryList: []}
	};
	
	var toConsole = function(entry, type) {
		console[type](entry);
	};
	
	var toAlert = function(entry, type) {
		alert(type +': '+ entry);
	};
	
	// Create a new log
	this.addLog = function(name, listArray) {
		if(logs[name]) {
			Logger.log('The log "' + name + '" already exists.', this.ERROR);
			return;
		}
		
		logs[name] = {
				id: name,
				entryList: entryArray || [],
		}
		
		if(logs[name]) Logger.log('Log "' + name + '" created succesfully.', this.INFO);
	};
	
	// Create a new log entry
	this.log = function(entry, level, logTo) {
		if(mice.consoleLogLevel < 0) mice.consoleLogLevel = 0; // Always output errors
		
		level = level || this.LOG; // ERROR, WARN, INFO, LOG
		if(!mice.debug && !logTo && level > mice.consoleLogLevel) return; // Don't log if not set to show logs of that level
		entry = entry || '';
		logTo = logTo || 'gameLog';
		var stamp = '';
		if(mice.options.stamp == true)
			stamp = new Date().getTime();
		
		//Sets type to correspond with many console APIs
		var type = 'log';
		if(level == this.ERROR) type = 'error';
		else if(level == this.WARN) type == 'warn';
		else if(level == this.INFO) type == 'info';
		
		// Output to console if not a game log, or set to log all to console
		if(level >= this.ERROR || mice.logLevel == this.ALL)
			toConsole(entry, type);
		
		// Alert on Error
		if(level == this.ERROR)
			toAlert(entry, type);
		
		// Output to specified log
		if(level == this.LOG)
			addEntry(logTo, entry)
	};
	
	// Shorthand for logging to specific game logs
	this.logTo = function(logTo, log){
		this.log(log, this.LOG, logTo);
	}
	
	// Clears all logs
	this.clearLogs = function() {
		for(var log in logs)
			log.entryList = [];
	};
	
	this.clearLog = function(which) {
		logs[which].entryList = [];
	}
	
	var addEntry = function(log, entry) {
		// If log already includes max number of entries, remove the oldest one
		if(logs[log].length >= mice.LOG_LENGTH) logs[log].shift();
		
		logs[log].entryList.push(entry);
	}	
};