/**
 *	@author Benjamin Wegener <me@inselmensch.de>
 *	@description building an awesome calculator focused on design, simplicity and reusability
 */

/** USERSTORIES
 * [ ] <user> could press the <keys> on his <keyboard> to make his <input>
 * [ ] <user> could click on the <buttons> to make his <input>
 * [ ] <user> needs to enter some <digits> in order to press an <operand> key
 * [ ] whenever <user> presses <enter> or clicks the <equal button> he gets the results to the <display>
 */
var Calculate = function(){
	var options = arguments[0] || false;

	this.init(options);
};

Calculate.prototype = {
	constructor: Calculate,
	isActive: false,
	currentEntry: '',
	lastResult: '',
	operand: '',
	options: {
		_parent: 'wrapper'
	},
	createButton: function(symbol,callback){
		var btn = document.createElement('a');
			btn.href = 'javascript:void(0);';
			btn.onclick = callback || function(){
				if(console) console.log('no symbol specified');
			};

			btn.innerHTML = symbol;

		return btn;
	},
	buildInterface: function(){
		var _this = this;
		var wrapper = document.getElementById(this.options._parent);

		var display = document.createElement('DIV');
			display.id = 'calc-gui-display';

		var numPad = document.createElement('DIV');
			numPad.id = 'calc-gui-numpad';

			var nums = [7,8,9,4,5,6,1,2,3,',',0,'='];
			for(i in nums)
			{
				var num = nums[i];
				var btn = this.createButton(num,function(){
					_this.onKey(null,this.innerHTML);
				});
				numPad.appendChild(btn);
			}

		var operandsCol = document.createElement('DIV');
			operandsCol.id = 'calc-gui-operands';

			var operands = ['CLR','/','*','-','+','^'];
			for(i in operands)
			{
				var operand = operands[i];
				var btn = this.createButton(operand,function(){
					_this.onKey(null,this.innerHTML);
				});
				operandsCol.appendChild(btn);
			}

		// add elements to context
			wrapper.appendChild(display);
			wrapper.appendChild(numPad);
			wrapper.appendChild(operandsCol);
	},
	render: function(){
		var displayText = this.lastResult + ' ' + this.operand + ' ' + this.currentEntry;
		document.getElementById('calc-gui-display').innerHTML = displayText;
	},
	addDigit: function(digit){
		if('' == this.operand && '' != this.lastResult) this.lastResult = '';
		if('0' == this.currentEntry && '.' != digit) this.currentEntry = '';

		this.currentEntry += digit;
		this.render();
		return false;
	},
	setOperand: function(operand){
		if(this.operand && this.currentEntry) this.calc();
		if(this.currentEntry)
		{
			this.lastResult = this.currentEntry;
			this.currentEntry = '';
		}
		this.operand = operand;
	},
	onKey: function(keyCode,pressedKey){
		console.log(pressedKey);
		if((keyCode >= 48 && keyCode <= 57))
		{
			return this.addDigit(parseInt(keyCode)-48);
		}

		if('0' == pressedKey || (parseInt(pressedKey) > 0 && parseInt(pressedKey) <= 9))
		{
			return this.addDigit(parseInt(pressedKey));
		}

		switch(pressedKey)
		{
			case '=':
				this.calc();
				break;
			case 'CLR':
				this.lastResult = '';
				this.operand = '';
				this.currentEntry = '';
				break;
			case '+':
			case '*':
			case '/':
			case '^':
				this.setOperand(pressedKey);
				break;
			case '-':
				if(this.operand && '' == this.currentEntry)
				{
					this.currentEntry = '-';
				}
				else
				{
					this.setOperand('-');
				}
				break;
			case ',':
			case '.':
				if(this.currentEntry.slice(-1) != '.' && this.currentEntry.indexOf('.') < 0)
				{
					this.addDigit('.');
				}
				break;
		}
		this.render();
	},
	calc: function(){
		if(!this.operand) return;

		var value_A = this.lastResult.indexOf('.') >= 0 ? parseFloat(this.lastResult) : parseInt(this.lastResult);
		var value_B = this.currentEntry.indexOf('.') >= 0 ? parseFloat(this.currentEntry) : parseInt(this.currentEntry);

		switch(this.operand)
		{
			case '+':
				this.lastResult = value_A + value_B;
				break;
			case '-':
				this.lastResult = value_A - value_B;
				break;
			case '*':
				this.lastResult = value_A * value_B;
				break;
			case '/':
				this.lastResult = value_A / value_B;
				break;
			case '^':
				this.lastResult = Math.pow(value_A,value_B);
		}

		this.lastResult += '';
		this.currentEntry = '';
		this.operand = '';
	},
	backspace: function(){
		if('' != this.currentEntry)
		{
			this.currentEntry = this.currentEntry.substr(0,this.currentEntry.length-1);
		}
		else
		{
			if('' != this.operand)
			{
				this.operand = '';
			}
		}

		this.render();
	},
	init: function(options){
		var _this = this;
		this.isActive = true;

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
				case 13:
					if('' == _this.lastResult && '' != _this.currentEntry)
					{
						_this.lastResult = _this.currentEntry;
						_this.currentEntry = '';
					}
					else
					{
						_this.calc();
						_this.render();
					}
					break;
				case 8:
					if(_this.isActive)
					{
						_this.backspace();
						e.preventDefault();
					}
					break;
				case 192:
					_this.onKey(null,'^');
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