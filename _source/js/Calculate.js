/**
 *	@author Benjamin Wegener <me@inselmensch.de>
 *	@description building an awesome calculator focused on design, simplicity and reusability
 */
var Calculate = function(){
	var options = arguments[0] || false;

	this.init(options);
};

Calculate.prototype = {
	constructor: Calculate,
	isActive: false,
	currentEntry: '',
	lastEntry: '',
	operand: '',
	options: {
		_parent: 'wrapper'
	},
	removeLast: function(){
		console.log('remove last entry');
	},
	createButton: function(){

	},
	buildInterface: function(){
		console.log('building interface');
	},
	showResult: function(){
		console.log('show result');
	},
	onKey: function(keyCode,keyPressed){
		
		switch(keyPressed)
		{
			case ',':

				break;
			case '=':
				this.showResult();
				break;
			default:
				console.log(keyPressed + " pressed");
				break;
		}
	},
	pow: function(){

	},
	init: function(options){
		this.isActive = true;
		var _this = this;
		for(key in options)
		{
			if(this.options[key]) this.options[key] = options[key];
		}

		this.buildInterface();
		window.onkeydown = function(e){
			e = e || window.event;
			var keyCode = e.which || e.keyCode;
			switch(keyCode)
			{
				case 8:
					if(_this.isActive)
					{
						_this.removeLast();
						e.preventDefault();
					}
					break;
				case 192:
					_this.pow();
					break;
			}
		};
		window.onkeypress = function(e){
			e = e || window.event;
			var keyCode = e.which || e.keyCode;
			var keyPressed = String.fromCharCode(keyCode);
			_this.onKey(keyCode,keyPressed);
		};
	}
}