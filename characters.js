/**************************************************************
 * characters.js
 * 
 * Contains everything to do with character type content.
 *************************************************************/

SCB.initCharacters = function () {
	//create the 'character' type
	Content.character = Content.buyable.extend({
		//characters are not yet used so init is not really implemented
		init: function(args) {
			return this._super(args);
		},
		
		id: character,
		toString: '',
		fromString: '',
		
		name: 'new character',
		tier: 0,
		health: 1,
		attack: 1,
		cooldown: 100,
		space: 1,
		intel: 1
	});
	
	Content.types['character'] = Content.character;
	
	/**************************************************************
	 * Character Definitions
	 *************************************************************/
	
	new Content.character({
		name: 'Dragling',
		//no more stats since they match default
	})
}