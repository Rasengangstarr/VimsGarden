var worldString = "";
var world = [];

const worldSizeX = 30;
const worldSizeY = 10;

const refreshRate = 1000;

var plantAudio = new Audio('plant.mp3');

var mode = 0;

var cX = 0;
var cY = 0;

var bar = document.getElementById('statusbar');
var elem = document.getElementById('playfield');

// UTILS FROM https://stackoverflow.com/questions/35969656/how-can-i-generate-the-opposite-color-according-to-current-color

function invertColor(hex) {
    if (hex.indexOf('#') === 0) {
        hex = hex.slice(1);
    }
    // convert 3-digit hex to 6-digits.
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if(hex.length !== 6) {
        throw new Error('Invalid HEX color.');
    }
    // invert color components
    var r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16),
        g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16),
        b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16);
    // pad each with zeros and return
    return '#' + padZero(r) + padZero(g) + padZero(b);
}

function padZero(str, len) {
    len = len || 2;
    var zeros = new Array(len).join('0');
    return (zeros + str).slice(-len);
}

// !UTILS

window.onload = function init()
{
	for (let y = 0; y < worldSizeY; y++)
    {
        world.push([]);
		for (let x = 0; x < worldSizeX; x++)
        {
            world[y].push({
                character : '_',
                fColor : '#000000',
                bColor : '#ffffff'
            });
        }
    }

	world[0][0] = {
		character : '_',
		fColor : '#ffffff',
		bColor : '#000000'
	};
    let intervalId = window.setInterval(drawWorldToScreen, refreshRate);
}



function drawWorldToScreen()
{
    let playfield = world.reduce(function (field, line){
        return field + line.reduce(function (l, c){
            return l+'<span style="color: ' + c.fColor + '; background-color: '+c.bColor+';">'+c.character+'</span>';
        }, "") + "<br>";
            
    }, '');
    elem.innerHTML = playfield; 


    if (mode == 0)
    {
        bar.innerHTML = "<h2> NORMAL </h2>"; 
    }
    else if (mode == 1)
    {
        bar.innerHTML = "<h2> INSERT </h2>";
    }
}



window.addEventListener("keydown", function(evt) {
    switch (event.key)
    {
        case "Escape":
            if (mode == 1)
            {
                mode = 0;
                
            }
            break;
    };
});
    
window.onkeypress = function(evt) {
    
    evt = evt || window.event;
    var charCode = evt.keyCode || evt.which;
    var charStr = String.fromCharCode(charCode);

    console.log(evt.keyCode);
   		
	//de-invert the previous cursor character
	world[cY][cX].fColor = invertColor(world[cY][cX].fColor);
	world[cY][cX].bColor = invertColor(world[cY][cX].bColor);

    if (mode == 0)
    { 
        if (charStr == 'h' && cX > 0)
        {
           cX -= 1; 
        }
        else if (charStr == 'l' && cX < worldSizeX - 1)
        {
            cX += 1;
        }
        else if (charStr == 'j' && cY < worldSizeY - 1)
        {
            cY += 1
        }
        else if (charStr == 'k' && cY > 0)
        {
            cY -= 1
        }
        else if (charStr == 'i')
        {
            mode = 1;
        }
    }
    else if (mode == 1)
    {
        if (evt.keyCode == 27)
        {
            mode = 0;
        }
        if (charStr == 's')
        {
            if (world[cY][cX].character == "_")
            {
                plantSeed();
                plantAudio.play();
                drawWorldToScreen();
            }
        }
    }

	//invert the new cursor character
	world[cY][cX].fColor = invertColor(world[cY][cX].fColor);
	world[cY][cX].bColor = invertColor(world[cY][cX].bColor);

    drawWorldToScreen();
			
};

function plantSeed()
{
    world[cY][cX] = 
        {
            character : ".",
            fColor : "#ff0000",
            bColor : "#ffffff"
        };
}
