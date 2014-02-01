'use strict';

/**************************************************************
 * engine.js
 * 
 * Contains the declarations and functions directly related
 * to the game engine object.
 *************************************************************/

/**************************************************************
 * Engine Initialization
 *************************************************************/
var MICEngine = {}; //Molpy Inspired Cycling Engine
var mice = MICEngine; //shorthand
var Content = {}; //Holds all Content
var logger = {}; //shorthand for mice logger -maybe-
var SCB = {}; //game object, in this case SCB(SandCastle Builder)

MICEngine.init = function(){
	
	//CONSTANTS
	mice.FPS = 30; //used for repaint
	mice.VERSION = 0.1;
	mice.CYCLES_PER_HOUR = 1; //must be integer factor of 3600
	mice.TICKS_PER_CYCLE = 1000; //updates per cycle
	
	//Calculated
	if(3600 % mice.CYCLES_PER_HOUR != 0){
		alert('Error: Invalid cycles per hour set.');
	};
	mice.HOURS_PER_CYCLE = (1 / mice.CYCLES_PER_HOUR == 1) ? 1 : 0; //whole hours per cycle
	mice.MINS_PER_CYCLE = (mice.HOURS_PER_CYCLE == 1) ? 0 : Math.floor((60 / mice.CYCLES_PER_HOUR)); //whole minutes per cycle - hours
	mice.SECS_PER_CYCLE = (mice.HOURS_PER_CYCLE == 1) ? 0 : Math.floor((60 % mice.CYCLES_PER_HOUR)); //seconds per cycle - hours and minutes
	mice.TICK_LENGTH = ((mice.HOURS_PER_CYCLE * 3600) + (mice.MINS_PER_CYCLE * 60) + mice.SECS_PER_CYCLE) * 1000 / mice.TICKS_PER_CYCLE; //milliseconds per game tick
	
	//Engine Variables
	mice.ticks = 0; //number of ticks since last update
	mice.time = new Date().getTime();
	mice.cycleNum = 1; //cycle number the game is currently on
	mice.cycleStartTime = mice.getCycleStart(1); //the time the current cycle started
	
	//allows for the possibility of "save slots"
	//would be nice to add a way to autoload last used profile
	mice.profile = new mice.Profile({name: 'default'}); 
	
	mice.options = mice.profile.options;
	
	//each object included has it's onCycle or onTick method called per cycle or tick
	mice.callPerCycle = {};
	mice.callPerTick = {};
	
	//start loading stuff
	mice.initContent();
	
	mice.loaded = true;
}

/**************************************************************
 * Engine Classes
 *************************************************************/

MICEngine.Profile = Class.extend({
	init: function(args) {
		this.name = args.name || 'default';
		this.created = new Date();
		this.lastPlayed = this.created;
		
		for(var property in args) {
			if(!this[property]) this[property] = args[property];
		}
	},
	
	name: '', //the name of the profile
	created: 0, //date profile was created
	lastPlayed: 0, //last time the profile was used
	options: {}, //holds engine option settings
	
})

MICEngine.Logger = Class.extend({
	init: function(args){
		
	}
})


/**************************************************************
 * Cycle Functions
 *************************************************************/

MICEngine.onNewCycle = function() {
	
}

MICEngine.onTick = function() {
	
}

//set the cycle start time based on cycle length
MICEngine.getCycleStart = function(cycleFactor){
	var time = new Date();
	if(mice.HOURS_PER_CYCLE != 1) {
		if(mice.MINS_PER_CYCLE != 0) //don't divide by 0
			time.setMinutes(Math.floor(time.getMinutes() / mice.MINS_PER_CYCLE) * mice.MINS_PER_CYCLE);
		else
			time.setMinutes(0);
		
		if(mice.SECS_PER_CYCLE != 0) //don't divide by 0
			time.setSeconds(Math.floor(time.getSeconds() / mice.SECS_PER_CYCLE) * mice.SECS_PER_CYCLE, 0);
		else
			time.setSeconds(0, 0);
	} else {
		time.setMinutes(0, 0, 0)
	}
	
	return time;
}


/**************************************************************
 * Helper Functions
 * 
 * This section contains helper functions outside
 * the scope of the engine itself.
 *************************************************************/

function g(id) {return document.getElementById(id);}

function addCSSRule(sheet, selector, rules, index) {
	if(sheet.insertRule) {
		sheet.insertRule(selector + '{' + rules + '}', index);
	}
	else {
		sheet.addRule(selector, rules, index);
	}
}

/*jQuery.fn.canColorBorder = function() {
	return this.each(function() {
		var borderColorButton = $("<div class='ui-border-color-button'></div>");
		borderColorButton.click(MICEngine.CycleBorderClick);
		$(this).append(borderColorButton);
	});
}*/

/**************************************************************
 * Start
 *************************************************************/
window.onload = function() {
	MICEngine.init();
	if(mice.loaded) {
		alert('MICE loaded.');
		//do stuff
	} else {
		alert('Error: Failed to load MICEngine.');
	}
};
