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
		//never really used
		init: function (args) {
			//load all passed properties into the thing
			console.log('run typeBase init');
			for(var property in args){
				this[property] = args[property];
			}
			
			//All content types MUST have: init method, id, toString method, fromString method
			if(!args.init || !args.id || !args.toString || args.fromString){
				alert('ERROR: Object types must specify an id, and toString and fromString methods. Game may be unstable.')
			}
		},
		
		//Youri: replacing by MICEngine.State.track
		track: [], //list of object properties tracked for save/load
		
		//assign any properties left over from overwritten init functions
		assignExtraProperties: function(args){
			for(var property in args) {
				if(!this[property])	this[property] = args[property];
			}
		}
	});
	
	/**************************************************************
	 * Content Types
	 * 
	 * This section should define types of content to include
	 * in the game which do not need their own files.
	 *************************************************************/
	
	Content.StatList = Content.TypeBase.extend({
		init: function(args) {			
			console.log('running statList init');
			Content.types[this.id] = this;
		},
		
		id: 'statList',
		toString: '',
		fromString: '',
	})
	
	Content.types['StatList'] = Content.StatList;
	
	Content.Layout = Content.TypeBase.extend({
		init: function(args) {
		},
		
		id: 'layout',
		toString: '',
		fromString: '',
	})
	
	Content.types['Layout'] = Content.Layout;
	
	Content.Buyable = Content.TypeBase.extend({
		init: function(args) {
			this.id = args.id;
			this.name = args.name; //the buyables in game name
			this.alias = args.alias || this.name; //used for simplifying code, can be used instead of name for lookup
			this.buyableType = args.buyableType || 'buyable'; //type of buyable object (boost, badge, character, etc)
			this.icon = args.icon || 'default_' + this.buyableType; //string snippit for building icon file name
			this.group = args.group || this.buyableType; //sub-group to which the buyable belongs, used to organize boosts, badges 
			this.desc = args.desc; //the text to display for a buyable
			this.stats = args.stats || null; //the text to display for a buyable when in stats mode
			
		},
		
		id: 'buyable',
		toString: '',
		fromString: '',
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
		name: 'game stats',
		id: 0,
		
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