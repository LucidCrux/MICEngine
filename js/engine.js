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

var MICEngine = {}; // Molpy Inspired Cyclic Engine
var mice = MICEngine; // Shorthand
var Content = {}; // Holds all Content
var Logger = {};
var Game = {}; // Game object. Be sure to define this in your game file ( mice.Game = YourGameObj; ) see SCB.js!!!!

MICEngine.init = function() {
	// CONSTANTS
	mice.FPS = 30; // Used for repaint
	mice.VERSION = 0.1;
	mice.CYCLES_PER_HOUR = 60; // Must be integer factor of 3600
	mice.TICKS_PER_CYCLE = 60; // Updates per cycle
	
	// Calculated
	if (3600 % mice.CYCLES_PER_HOUR != 0) {
		Logger.log('Invalid cycles per hour set: engine.js > MICEngine.init()', logger.ERROR);
		return;
	};
	mice.HOURS_PER_CYCLE = (1 / mice.CYCLES_PER_HOUR == 1) ? 1 : 0; // Whole hours per cycle
	mice.MINS_PER_CYCLE = (mice.HOURS_PER_CYCLE == 1) ? 0 : Math.floor((60 / mice.CYCLES_PER_HOUR)); // Whole minutes per cycle - hours
	mice.SECS_PER_CYCLE = (mice.HOURS_PER_CYCLE == 1) ? 0 : Math.floor((60 % mice.CYCLES_PER_HOUR)); // Whole seconds per cycle - hours and minutes
	mice.TICK_LENGTH = ((mice.HOURS_PER_CYCLE * 3600) + (mice.MINS_PER_CYCLE * 60) + mice.SECS_PER_CYCLE) * 1000 / mice.TICKS_PER_CYCLE; // Milliseconds per game tick
	
	// Engine Variables
	mice.debug = false;
	mice.consoleLogLevel = Logger.WARN; // Determines what gets sent to the console, includes those below :: ALL, INFO, WARN, ERROR
	mice.tickCount = 0; // Tick number of current cycle
	mice.time = new Date().getTime();
	mice.cycleNum = 1; // Cycle number the game is currently on
	mice.cycleStartTime = mice.getCycleStart(1); // The time the current cycle started
	
	mice.autoSaveTicks = 0; // Number of ticks since last save
	mice.doSave = false; // Auto save this tick?
	
	mice.options = {
			autoSave: true,
			autoSaveDelay: 30, // In ticks
			euroNumbers: false
			};
	
	// Each object included has it's onCycle or onTick method called per cycle or tick
	mice.callPerCycle = [mice.Game];
	mice.callPerTick = [mice.Game];
	
	// Start loading stuff
	mice.initContent();
	//mice.ProfileManager.init();
	//mice.LayoutManager.init();
	//mice.Game.init();
	
	mice.syncTickCount();
	
	mice.loaded = true;
}


/**************************************************************
 * Engine Classes
 *************************************************************/


/**************************************************************
 * Cycle Functions
 * 
 * Functions relating to time progression, game ticks, and
 * new cycles.
 * !! Contains the main game logic loops. !!
 *************************************************************/

MICEngine.update = function(numTicks) {
	mice.onTick(numTicks);
	mice.tickCount += numTicks;
	var numCycles = Math.floor(mice.tickCount / mice.TICKS_PER_CYCLE);
	mice.tickCount -= numCycles * mice.TICKS_PER_CYCLE;
	if (numCycles >= 1) {
		mice.onCycle(numCycles);
	}
	
	// SAVE LAST!
	if (mice.doSave) {
		mice.ProfileManager.save();
		mice.autoSaveTicks = 0;
		mice.doSave = false;
	}
}

MICEngine.onTick = function(numTicks) {
	mice.autoSaveTicks += numTicks;
	if (mice.options.autoSave && mice.options.autoSaveDelay < mice.autoSaveTicks)
		mice.doSave = true;
	
	// Call object tick methods
	for (var obj in mice.callPerTick)
		mice.callPerTick[obj].onTick(numTicks);
}

MICEngine.onCycle = function(numCycles) {
	mice.cycleNum += numCycles;
	
	// Call object cycle methods
	for (var obj in mice.callPerCycle)
		mice.callPerCycle[obj].onCycle(numCycles);
}


/* GameLoop runs on a timer to refresh display and trigger game ticks as necessary */
MICEngine.elapsed = 0;
MICEngine.gameLoop = function() {
	var oldTime = mice.time;
	mice.time = new Date().getTime();
	mice.elapsed += (mice.time - oldTime);
	var tickLag = Math.floor(mice.elapsed / mice.TICK_LENGTH); // Number of ticks since last loop
	mice.elapsed -= (tickLag * mice.TICK_LENGTH);
	//mice.elapsed = Math.min(mice.elapsed, (mice.TICK_LENGTH * 5)); //limit lag to 5 ticks
	
	try {
		mice.update(tickLag);
	} catch(e) {
		Logger.log('Game tick error:\n' + e + '\n\n' + e.stack, logger.ERROR);
		throw e;
		return;
	}
	try {
		mice.draw();
	} catch(e) {
		Logger.log('Error drawing game:\n' + e + '\n\n' + e.stack, logger.ERROR);
		throw e;
		return;
	}
	
	setTimeout(mice.gameLoop, (1000 / mice.FPS));
}

// Set the cycle start time based on cycle length
MICEngine.getCycleStart = function(cycleFactor){
	var time = new Date();
	if (mice.HOURS_PER_CYCLE != 1) {
		if (mice.MINS_PER_CYCLE != 0) // Don't divide by 0
			time.setMinutes(Math.floor(time.getMinutes() / mice.MINS_PER_CYCLE) * mice.MINS_PER_CYCLE);
		else
			time.setMinutes(0);
		
		if (mice.SECS_PER_CYCLE != 0) // Don't divide by 0
			time.setSeconds(Math.floor(time.getSeconds() / mice.SECS_PER_CYCLE) * mice.SECS_PER_CYCLE, 0);
		else
			time.setSeconds(0, 0);
	} else
		time.setMinutes(0, 0, 0)
	
	return time;
}

// Updates the tick count to match system time
MICEngine.syncTickCount = function() {
	var timeDif = mice.time - mice.cycleStartTime.getTime();
	mice.tickCount = Math.floor(timeDif / mice.TICK_LENGTH);
}


/**************************************************************
 * Drawing and Layout Functions
 * 
 * Functions relating to the display of the game.
 *************************************************************/

MICEngine.draw = function() {
	g('onlydiv').innerHTML = 'Cycle: ' + mice.cycleNum + '<br>'
	                       + 'Tick Number: ' + mice.tickCount;
}


/**************************************************************
 * Other functions
 * Probably should change regroup these later
 *************************************************************/


/**************************************************************
 * Misc Functions
 * 
 * This section contains functions outside the scope of the
 * engine itself. This includes jQuery additions and
 * document level functions.
 *************************************************************/

function g(id) {
	return document.getElementById(id);
}

function addCSSRule(sheet, selector, rules, index) {
	if (sheet.insertRule)
		sheet.insertRule(selector + '{' + rules + '}', index);
	else
		sheet.addRule(selector, rules, index);
}

/*
jQuery.fn.canColorBorder = function() {
	return this.each(function() {
		var borderColorButton = $("<div class='ui-border-color-button'></div>");
		borderColorButton.click(MICEngine.CycleBorderClick);
		$(this).append(borderColorButton);
	});
}
*/


/**************************************************************
 * Start
 *************************************************************/

window.onload = function() {
	MICEngine.init();
	if (mice.loaded) {
		Logger.log('MICE loaded.', Logger.INFO);
		mice.gameLoop(); // Start the game
	} else
		Logger.log('Failed to load MICEngine.', logger.ERROR);
};
