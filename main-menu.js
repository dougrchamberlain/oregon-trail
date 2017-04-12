let menuContent = '\n 1. travel the trail \n 2. learn about the trail \n 3. See the Oregon Top Ten \n 4. Turn Sound Off \n 5. Choose Management Options \n 6. End \nWhat is your choice?';

var Blessed = require('blessed');
function Menu(screen){

var menu = Blessed.box({
	parent: screen,
	top:1,
	left: 1,
	height: '99%',
	width: '99%',
	content: menuContent,
	tags: true,
	border: 'line',
        style: {
          fg: 'white',
          bg: 'black'
         }
	});



menu.key('escape', function(){
 screen.focus();
 screen.render();
});

menu.on('show',function(){
menu.focus();
});

//menu.key(4, moreInfoHandler);

return menu;
}

module.exports = Menu;
