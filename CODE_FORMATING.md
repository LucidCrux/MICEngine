This is just some guidelines we'd like to follow in order to keep code formating
relatively consistent and readable. No one is going to kill you if you mess up,
but it is nice to keep things looking consistent throughout.

1. Operators and Keywords are spaced out.

	Examples:
	````
		Bad: if(a+b==c){return;}
		Good: if (a + b == c) { return; }
	````

2. Capitalization:
	- High order Objects (similar to classic classes) get capitalized.
	- Variables serving as constants are ALL_CAPS with underscore spacing
	- Everything else is camelCase
	
	Examples:
	````
		Bad: Book.page = {
				pageNumber: 0,
				font: 'arial',
				};
		Good: Book.Page = {
				pageNumber: 0,
				font: 'arial',
				};
		
		Bad: Book.CreateBlankPage = function() {}
		Good: Book.createBlankPage = function() {}
		
		Bad: var maxPagesPerBook = 100; // This is a constant variable, do not change in code!
		Good: var MAX_PAGES_PER_BOOK = 100;
	````
		
3. Comments:
	- Use block javaDoc style comments for large blocks or code sections.
		(The extra space for * lines is not mandatory, just done automatically by some editors.)
	- Leave a space after double slash for in-line comments, capitalize them, use [brackets] for special distinctions
	
	Examples:
	````
		Bad: //++++++++++
			// Section for Math stuff
			//===================================
			(or similar)
		Good:/********************************
			 * Section for Math Stuff
			 ********************************/
		
		Bad: //this variable is temporary for testing reason
		Good: // [TEMP] Variable for testing purposes only
	````
		
4. Leave a blank line at the end of all documents.
