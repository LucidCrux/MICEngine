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
var MICEngine = {}; //Molpy Inspired Cyclic Engine
var mice = MICEngine; //shorthand
var Content = {}; //Holds all Content
var logger = {}; //shorthand for mice logger -maybe-
var SCB = {}; //game object, in this case SCB (SandCastle Builder), !!!! replace with your game object !!!!

// Youri: [TEMP] Required to prevent error
SCB.onTick = function() { return; };
SCB.onCycle = function() { return; };

MICEngine.init = function(){
	
	//CONSTANTS
	mice.FPS = 30; //used for repaint
	mice.VERSION = 0.1;
	mice.CYCLES_PER_HOUR = 1; //must be integer factor of 3600
	mice.TICKS_PER_CYCLE = 1000; //updates per cycle
	
	//Calculated
	if(3600 % mice.CYCLES_PER_HOUR != 0){
		mice.Logger.Log('Invalid cycles per hour set: engine.js > MICEngine.init()', 'error');
		return;
	};
	mice.HOURS_PER_CYCLE = (1 / mice.CYCLES_PER_HOUR == 1) ? 1 : 0; //whole hours per cycle
	mice.MINS_PER_CYCLE = (mice.HOURS_PER_CYCLE == 1) ? 0 : Math.floor((60 / mice.CYCLES_PER_HOUR)); //whole minutes per cycle - hours
	mice.SECS_PER_CYCLE = (mice.HOURS_PER_CYCLE == 1) ? 0 : Math.floor((60 % mice.CYCLES_PER_HOUR)); //seconds per cycle - hours and minutes
	mice.TICK_LENGTH = ((mice.HOURS_PER_CYCLE * 3600) + (mice.MINS_PER_CYCLE * 60) + mice.SECS_PER_CYCLE) * 1000 / mice.TICKS_PER_CYCLE; //milliseconds per game tick
	
	//Engine Variables
	mice.tickCount = 0; //tick number of current cycle
	mice.time = new Date().getTime();
	mice.cycleNum = 1; //cycle number the game is currently on
	mice.cycleStartTime = mice.getCycleStart(1); //the time the current cycle started
	
	mice.autoSaveTicks = 0; //number of ticks since last save
	mice.doSave = false; //auto save this tick?
	
	//allows for the possibility of "save slots"
	//would be nice to add a way to autoload last used profile
	mice.profile = new mice.Profile({name: 'default'}); 
	
	mice.options = mice.profile.options;
	
	//each object included has it's onCycle or onTick method called per cycle or tick
	mice.callPerCycle = [SCB];
	mice.callPerTick = [SCB];
	
	//start loading stuff
	mice.initContent();
	//SCB.init(); //!!!! replace with your game initialization !!!!
	
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
 * !!!! Contains the main game logic loops. !!!!
 *************************************************************/

MICEngine.tick = function() {
	mice.onTick();
	mice.tickCount++;
	if(mice.tickCount >= mice.TICKS_PER_CYCLE) {
		mice.tickCount = 1;
		mice.Logger.Log('Cycle '+ mice.cycleNum +' finished');
		mice.onCycle();
	}
	
	//SAVE LAST!
	if(mice.doSave) {
		mice.save();
		mice.autoSaveTicks = 0;
		mice.doSave = false;
	}
}

MICEngine.onTick = function() {
	mice.autoSaveTicks++;
	if(mice.options.autoSave && mice.options.autoSaveDelay < mice.autoSaveTicks)
		mice.doSave = true;
	
	//call object tick methods
	for(var obj in mice.callPerTick) {
		mice.callPerTick[obj].onTick();
	}
}

MICEngine.onCycle = function() {
	mice.cycleNum++;
	
	//call object cycle methods
	for(var obj in mice.callPerCycle) {
		mice.callPerCycle[obj].onCycle();
	}
}


// gameLoop runs on a timer to refresh display and trigger game ticks as necessary
MICEngine.elapsed = 0;
MICEngine.gameLoop = function() {
	var oldTime = mice.time;
	mice.time = new Date().getTime();
	mice.elapsed += (mice.time - oldTime);
	mice.elapsed = Math.min(mice.elapsed, (mice.TICK_LENGTH * 5)); //limit lag to 5 ticks
	
	//trigger ticks until catching up to the current tick
	while(mice.elapsed > mice.TICK_LENGTH){
		try{
			mice.tick();
		} catch (e) {
			mice.Logger.Log('Game tick error:\n' + e + '\n\n' + e.stack, 'error');
			throw e;
			return;
		}
		mice.elapsed -= mice.TICK_LENGTH;
	}
	try{
		mice.draw();
	} catch(e) {
		mice.Logger.Log('Error drawing game:\n' + e + '\n\n' + e.stack, 'error');
		throw e;
		return;
	}
	
	setTimeout(mice.gameLoop, (1000 / mice.FPS));
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
 * Drawing and Layout Functions
 * 
 * Functions relating to the display of the game.
 *************************************************************/

MICEngine.draw = function() {
	g('onlydiv').innerHTML = mice.tickCount;
}

/**************************************************************
 * Other functions
 * Probably should change regroup these later
 *************************************************************/

// Youri: Replacing by MICEngine.State.Save
MICEngine.save = function() {
	
}

// Youri: Replacing by MICEngine.State.Load
MICEngine.load = function(profile) {
	
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
		mice.Logger.Log('MICE loaded.');
		mice.gameLoop(); //start the game
	} else {
		mice.Logger.Log('Failed to load MICEngine.', 'error');
	}
};
