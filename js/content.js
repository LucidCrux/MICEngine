/**************************************************************
 * content.js
 * 
 * Contains functions and declarations related to content
 * which are not large enough to warrant their own file.
 *************************************************************/

MICEngine.initContent = function() {
	//types will track 'top level' types, things we use 'new' with
	//not classes used solely for inheritance
	Content.types = {};
	
	Content.TypeBase = Class.extend({
		id: 'typeBase', // Everything has an id
		toString: '', // Used for saving, may no longer be used
		fromString: '' // Used for loading, may no longer be used
	});
	
	/**************************************************************
	 * Content Types
	 * 
	 * This section should define types of content to include
	 * in the game which do not need their own files.
	 *************************************************************/
	
	Content.StatList = Content.TypeBase.extend({
		id: 'statList',
	})
	
	Content.types['StatList'] = Content.StatList;
	
	Content.Layout = Content.TypeBase.extend({
		id: 'layout',
	})
	
	Content.types['Layout'] = Content.Layout;
	
	Content.Buyable = Content.TypeBase.extend({
		id: 'buyable',
		name: 'buyable', // The buysables in-game name
		alias: 'buyable', // Used for simplifying code, can be used instead of name for lookup
		single: '', // The singular form of the objects name
		plural: '', // The plural form of the objects name
		buyableType: 'buyable', // Type of buyable object (boost, badge, character, etc)
		icon: 'default', // String snippit for building icon file name
		group: 'buyable', // Sub-group to which the buyable belongs, used for organization
		desc: '', // The text to display in descriptions of the object
		stats: null, // Replaces description text while in stat view
		
		init: function(args) {
			this._super(args);
			this.alias = args.alias || this.name;
			this.single = args.single || this.name;
			this.plural = args.plural || (this.name + 's');
			this.icon = args.icon || 'default_' + this.buyableType;
			this.group = args.group || this.buyableType;
		},
	})
	
	//SCB.initCharacters();
	//SCB.initBadges();
	SCB.initBoosts();
}

/**************************************************************
 * gameStats types
 *************************************************************/

SCB.initGameStats = function () {
	new Content.statList({
		id: 'game stats',
		name: 'game stats',
		
		saveCount:0,
		loadCount:0,
		restartCount: 0,
		playTime:0,
		lastCycleStart: 0,
		
		highestNP: 0,
		beachClicks: 0,
		
		ninjaStreak: 0,
		ninjaStealthStreak: 0,
	})
}