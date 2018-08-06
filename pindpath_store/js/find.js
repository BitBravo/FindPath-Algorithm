
var canvas = null;
var ctx = null;
var spritesheet = null;
var spritesheetLoaded = false;

try{
	console.log(walls)
}catch(e){
	var walls = {}
}
// the world grid: a 2d array of tiles
var world = [[]];

// size in the world in sprite tiles
var worldWidth = 154;
var worldHeight = 35;

// size of a tile in pixels
var tileWidth = 8;
var tileHeight = 15;

// start and end of path
var pathStart =  [55, 33]
var pathEnd = [];
var currentPath = [];

// ensure that concole.log doesn't cause errors
if (typeof console == "undefined") var console = { log: function() {} };

function onload()
{
	console.log('Page loaded.');
	canvas = document.getElementById('gridCanvas');
	canvas.width = worldWidth * tileWidth;
	canvas.height = worldHeight * tileHeight;
	canvas.addEventListener("click", canvasClick, false);
	if (!canvas) alert('Blah!');
	ctx = canvas.getContext("2d");
	spritesheet = new Image();
	spritesheet.src = 'data:image/png;base64,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';
	spritesheet.onload = loaded;
}

// the spritesheet is ready
function loaded()
{
	console.log('Spritesheet loaded.');
	spritesheetLoaded = true;
	createWorld();
}

// fill the world with walls
function createWorld()
{
	console.log('Creating world...');

	// create emptiness
	for (var x=0; x < worldWidth; x++)
	{
		world[x] = [];

		for (var y=0; y < worldHeight; y++)
		{
			world[x][y] = 0;
		}
	}
	Object.keys(walls).map(key=>{
		// for(var i=0; i<walls[key]['pos'].length; i++) {
		// 	let ax = walls[key]['pos'][i][0];
		// 	let ay = walls[key]['pos'][i][1];
		// 	world[ax][ay] = 1;
		// }	
		drawingShelves(walls[key], walls[key]['col'])
	});

	currentPath = [];
	redraw();
}

function redraw(newPath)
{
	if (!spritesheetLoaded) return;

	console.log('redrawing...');

	// Remove old path
	// for(var i = 0; i< currentPath.length; i++) {
	// 	ctx.fillStyle = '#ffffff';
	// 	ctx.fillRect(currentPath[i][0]* tileWidth, currentPath[i][1]*tileHeight, tileWidth,tileHeight);
	// }

	var spriteNum = 0;

	// clear the screen
	ctx.fillStyle = '#000000';
	ctx.lineWidth = 1;
    ctx.strokeStyle = '#000000';
	ctx.strokeRect(0, 0, canvas.width, canvas.height);
	
	// Draw all walls and empty squares
	let color
	for (var x=0; x < worldWidth; x++)
	{
		for (var y=0; y < worldHeight; y++)
		{
			ctx.strokeRect(x* tileWidth, y*tileHeight, tileWidth,tileHeight);

			// choose a sprite to draw
			switch(world[x][y])
			{
			case 1:
				spriteNum = 1;
				color = '#000000'
				break;
			default:
				spriteNum = 0;
				color = '#FFFFFF'
				break;
			}

			// if(spriteNum) {
			// 	ctx.fillStyle = color;
			// 	ctx.fillRect(x* tileWidth, y*tileHeight, tileWidth,tileHeight);
			// }
		}
	}

	// draw the path
	// var current;
	// var past, first;
	// for (rp=0; rp<newPath.length; rp++)
	// {	
	// 	switch(rp)
	// 	{
	// 	case 0:
	// 		last = [(newPath[rp][0]+newPath[rp+1][0])/2+0.5, (newPath[rp][1]+newPath[rp+1][1])/2+0.5]
	// 		current = last
	// 		ctx.fillStyle = 'red';	
	// 		ctx.fillRect(newPath[rp][0]* tileWidth, newPath[rp][1]*tileHeight, tileWidth,tileHeight);	
	// 		break;
	// 	case newPath.length-1:
	// 		// last = current
	// 		// current = [currentPath[rp][0]+0.5, currentPath[rp][1]+0.5]	
	// 		ctx.fillStyle = 'blue';	
	// 		ctx.fillRect(newPath[rp][0]* tileWidth, newPath[rp][1]*tileHeight, tileWidth,tileHeight);	
	// 		break;
	// 	default:
	// 		last = current
	// 		current = [(newPath[rp][0]+newPath[rp+1][0])/2+0.5, (newPath[rp][1]+newPath[rp+1][1])/2+0.5]
	// 		break;
	// 	}


	// 	ctx.beginPath();
	// 	ctx.moveTo(last[0]*tileWidth, last[1]*tileHeight)
	// 	ctx.lineTo(current[0]*tileWidth,current[1]*tileHeight);
	// 	ctx.lineWidth = 5;
	// 	ctx.strokeStyle = '#ff0000';
	// 	ctx.stroke();

	// 	currentPath = newPath
	// }		
}

function drawingShelves (shelve, color) {
	console.log(shelve)
  
	ctx.fillStyle = color || '#000000';
	for(var i = 0; i<shelve['pos'].length; i++) {
	  ctx.fillRect(
		shelve['pos'][i][0] * tileWidth,
		shelve['pos'][i][1] * tileHeight,
		tileWidth,
		tileHeight
	  );
  
	  // Drawing the grid in the removed square
	  if(color === '#ffffff') {
		ctx.strokeStyle = "#000000";
		ctx.strokeRect(shelve['pos'][i][0] * tileWidth, shelve['pos'][i][1] * tileHeight, tileWidth, tileHeight);
		ctx.stroke();
	  }
	}
	result();
}

// handle click events on the canvas
var walls = []
function canvasClick(e)
{
	var x;
	var y;

	// grab html page coords
	if (e.pageX != undefined && e.pageY != undefined)
	{
		x = e.pageX;
		y = e.pageY;
	}
	else
	{
		x = e.clientX + document.body.scrollLeft +
		document.documentElement.scrollLeft;
		y = e.clientY + document.body.scrollTop +
		document.documentElement.scrollTop;
	}

	// make them relative to the canvas only
	x -= canvas.offsetLeft;
	y -= canvas.offsetTop;

	// return tile x,y that we clicked
	var cell =
	[
	Math.floor(x/tileWidth),
	Math.floor(y/tileHeight)
	];

	// now we know while tile we clicked
	console.log('we clicked tile '+cell[0]+','+cell[1]);
	walls.push(cell)
	console.log(JSON.stringify(walls))

	pathStart = [2,2];
	pathEnd = cell;

	// calculate path
	const newCurrentPath = findPath(world,pathStart,pathEnd);
	redraw(newCurrentPath);
}


function findPath(world, pathStart, pathEnd)
{
	// shortcuts for speed
	var	abs = Math.abs;
	var	max = Math.max;
	var	pow = Math.pow;
	var	sqrt = Math.sqrt;


	var maxWalkableTileNum = 0;


	var worldWidth = world.length;
	var worldHeight = world[0].length;
	console.log(worldHeight,worldWidth)
	var worldSize =	worldWidth * worldHeight;


	var distanceFunction = ManhattanDistance;
	var findNeighbours = function(){}; // empty

	function ManhattanDistance(Point, Goal)
	{	
		return abs(Point.x - Goal.x) + abs(Point.y - Goal.y);
	}

	function DiagonalDistance(Point, Goal)
	{	
		return max(abs(Point.x - Goal.x), abs(Point.y - Goal.y));
	}

	function EuclideanDistance(Point, Goal)
	{	
		return sqrt(pow(Point.x - Goal.x, 2) + pow(Point.y - Goal.y, 2));
	}

	function Neighbours(x, y)
	{
		var	N = y - 1,
		S = y + 1,
		E = x + 1,
		W = x - 1,
		myN = N > -1 && canWalkHere(x, N),
		myS = S < worldHeight && canWalkHere(x, S),
		myE = E < worldWidth && canWalkHere(E, y),
		myW = W > -1 && canWalkHere(W, y),
		result = [];
		if(myN)
		result.push({x:x, y:N});
		if(myE)
		result.push({x:E, y:y});
		if(myS)
		result.push({x:x, y:S});
		if(myW)
		result.push({x:W, y:y});
		findNeighbours(myN, myS, myE, myW, N, S, E, W, result);
		return result;
	}

	function DiagonalNeighbours(myN, myS, myE, myW, N, S, E, W, result)
	{
		if(myN)
		{
			if(myE && canWalkHere(E, N))
			result.push({x:E, y:N});
			if(myW && canWalkHere(W, N))
			result.push({x:W, y:N});
		}
		if(myS)
		{
			if(myE && canWalkHere(E, S))
			result.push({x:E, y:S});
			if(myW && canWalkHere(W, S))
			result.push({x:W, y:S});
		}
	}

	function DiagonalNeighboursFree(myN, myS, myE, myW, N, S, E, W, result)
	{
		myN = N > -1;
		myS = S < worldHeight;
		myE = E < worldWidth;
		myW = W > -1;
		if(myE)
		{
			if(myN && canWalkHere(E, N))
			result.push({x:E, y:N});
			if(myS && canWalkHere(E, S))
			result.push({x:E, y:S});
		}
		if(myW)
		{
			if(myN && canWalkHere(W, N))
			result.push({x:W, y:N});
			if(myS && canWalkHere(W, S))
			result.push({x:W, y:S});
		}
	}

	// returns boolean value (world cell is available and open)
	function canWalkHere(x, y)
	{
		return ((world[x] != null) &&
			(world[x][y] != null) &&
			(world[x][y] <= maxWalkableTileNum));
	};

	function Node(Parent, Point)
	{
		var newNode = {
			// pointer to another Node object
			Parent:Parent,
			// array index of this Node in the world linear array
			value:Point.x + (Point.y * worldWidth),
			// the location coordinates of this Node
			x:Point.x,
			y:Point.y,
			// the heuristic estimated cost
			// of an entire path using this node
			f:0,
			// the distanceFunction cost to get
			// from the starting point to this node
			g:0
		};

		return newNode;
	}

	function calculatePath()
	{
		// create Nodes from the Start and End x,y coordinates
		var	mypathStart = Node(null, {x:pathStart[0], y:pathStart[1]});
		var mypathEnd = Node(null, {x:pathEnd[0], y:pathEnd[1]});
		// create an array that will contain all world cells
		var AStar = new Array(worldSize);
		// list of currently open Nodes
		var Open = [mypathStart];
		// list of closed Nodes
		var Closed = [];
		// list of the final output array
		var result = [];
		// reference to a Node (that is nearby)
		var myNeighbours;
		// reference to a Node (that we are considering now)
		var myNode;
		// reference to a Node (that starts a path in question)
		var myPath;
		// temp integer variables used in the calculations
		var length, max, min, i, j;
		// iterate through the open list until none are left
		while(length = Open.length)
		{
			max = worldSize;
			min = -1;
			for(i = 0; i < length; i++)
			{
				if(Open[i].f < max)
				{
					max = Open[i].f;
					min = i;
				}
			}
			// grab the next node and remove it from Open array
			myNode = Open.splice(min, 1)[0];
			// is it the destination node?
			if(myNode.value === mypathEnd.value)
			{
				myPath = Closed[Closed.push(myNode) - 1];
				do
				{
					result.push([myPath.x, myPath.y]);
				}
				while (myPath = myPath.Parent);
				// clear the working arrays
				AStar = Closed = Open = [];
				// we want to return start to finish
				result.reverse();
			}
			else // not the destination
			{
				// find which nearby nodes are walkable
				myNeighbours = Neighbours(myNode.x, myNode.y);
				// test each one that hasn't been tried already
				for(i = 0, j = myNeighbours.length; i < j; i++)
				{
					myPath = Node(myNode, myNeighbours[i]);
					if (!AStar[myPath.value])
					{
						// estimated cost of this particular route so far
						myPath.g = myNode.g + distanceFunction(myNeighbours[i], myNode);
						// estimated cost of entire guessed route to the destination
						myPath.f = myPath.g + distanceFunction(myNeighbours[i], mypathEnd);
						// remember this new path for testing above
						Open.push(myPath);
						// mark this node in the world graph as visited
						AStar[myPath.value] = true;
					}
				}
				// remember this route as having no more untested options
				Closed.push(myNode);
			}
		} // keep iterating until the Open list is empty
		return result;
	}

	return calculatePath();

} 

onload();
