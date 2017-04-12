// 1. Be a banker from Boston
// 2. Be a carpenter from Ohio
// 3. Be a farmer from Illinois
// 4. Find out the differences between these choices

//What is your choice?

var Blessed = require('blessed');
function Menu(screen){

var button = Blessed.button({
 content: '{center}{bold}OK{/bold}',
 bottom: 0,
 height: 3,
 width: 10,
 border: 'line',
 tags: true
 
});

button.key('enter',function(){
 screen.title = 'confirmed';
});

var menu = Blessed.box({
	top:0,
	left: 0,
	height: '99%',
	width: '99%',
	content:
	'// 1. Be a banker from Boston {br}// 2. Be a carpenter from Ohio \n// 3. Be a farmer from Illinois // 4. Find out the differences between these choices //What is your choice?',
	tags: true,
	border: 'line'
	});

function bankerHandler(ch,key){
 screen.title = 'banker';
 menu.setContent('{left}You have chosen: {bold}BANKER{/bold}');
 menu.insertLine(1,'Do You want to continue as a banker?');
 menu.append(button);
 button.focus();
 screen.render();
 debugger;
}

function carpenterHandler(ch,key){
 screen.title = 'Carpenter';
 screen.render();
}

function farmerHandler(ch,key){
 screen.title = 'Farmer';
 screen.render();
}

menu.key([1], bankerHandler);
menu.key('2', carpenterHandler);
menu.key('3', farmerHandler);
//menu.key(4, moreInfoHandler);

return menu;
}

module.exports = Menu;
