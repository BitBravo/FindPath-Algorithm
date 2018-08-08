// Walls
let walls = []

// Multi Target Count
let multiTargetCount = 3;

// start and end of path
let startPoint = [55, 33]

// size in the world in sprite tiles
let worldWidth = 154;
let worldHeight = 35;

// size of a square in pixels
let tileWidth = 8;
let tileHeight = 15;

let shelvesNameArray = [];

let canvas = null;
let ctx = null;

let bgImg = null;
let bgImgLoaded = false;

let world = [[]];

if (typeof console == "undefined") var console = { log: function() {} };

function onload()
{
	console.log('Page loaded.');
	canvas = document.getElementById('gridCanvas');
	canvas.width = worldWidth * tileWidth;
	canvas.height = worldHeight * tileHeight;
	if (!canvas) alert('Blah!');
	ctx = canvas.getContext("2d");

	bgImg = new Image();
	bgImg.src = './findPatch/img/bg.png';
	bgImg.onload = loaded;
}

// the spritesheet is ready
function loaded()
{
	console.log('Spritesheet loaded.');
	bgImgLoaded = true;
	createWorld();
}

// Create the worlds
function createWorld()
{
	ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
	console.log('Creating world...');

	ctx.lineWidth = 1;
	ctx.strokeStyle = "#000000";
	ctx.strokeRect(0, 0, canvas.width, canvas.height);

	for (var x=0; x < worldWidth; x++)
	{
		world[x] = [];

		for (var y=0; y < worldHeight; y++)
		{
			world[x][y] = 0;
		}
	}
	
	Object.keys(walls).map(key=>{
		let cX, xY;
		for(var i =0; i<walls[key]['pos'].length; i++) {
			cX = walls[key]['pos'][i][0];
			cY = walls[key]['pos'][i][1];
			world[cX][cY] = 1;
		}
		drawingShelves(walls[key], walls[key]['col'])
	});
}

function drawingShelves (shelve, color) {
  
	ctx.fillStyle = color || '#000000';
	for(var i = 0; i<shelve['pos'].length; i++) {
	  ctx.fillRect(
		shelve['pos'][i][0] * tileWidth,
		shelve['pos'][i][1] * tileHeight,
		tileWidth,
		tileHeight
	  );

	// Drawing the grid in the removed square
	//   if(color === '#ffffff') {
	// 	ctx.strokeStyle = "#000000";
	// 	ctx.strokeRect(shelve['pos'][i][0] * tileWidth, shelve['pos'][i][1] * tileHeight, tileWidth, tileHeight);
	// 	ctx.stroke();
	//   }
	}
}

// Check if search value matches with the shelve's name
function searchCheck(searchValue) {
	const shelveIndex = String(shelvesNameArray).toLowerCase().split(",").indexOf(searchValue)
	if(shelveIndex<0) {
		return alert('Please input correct search value!')
	} else {
		return shelvesNameArray[shelveIndex]
	}
}

// Get endPoints (shelve's position) as much as we set the multi count
function getEndPoints(shelveName) {
	return walls[shelveName]['end']? walls[shelveName]['end'].slice(0, multiTargetCount) : []
}

// Get the shortest path from start point to end point
function findPath(world, pathStart, pathEnd)
{
	var	abs = Math.abs;
	var	max = Math.max;
	var	pow = Math.pow;
	var	sqrt = Math.sqrt;
	
	var maxWalkableTileNum = 0;
	
	var worldWidth = world.length;
	var worldHeight = world[0].length;
	var worldSize =	worldWidth * worldHeight;
	
	
	var distanceFunction = ManhattanDistance;
	var findNeighbours = function(){};
	
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
	
	function canWalkHere(x, y)
	{
		return ((world[x] != null) &&
		(world[x][y] != null) &&
		(world[x][y] <= maxWalkableTileNum));
	};
	
	function Node(Parent, Point)
	{
		var newNode = {
			Parent:Parent,
			value:Point.x + (Point.y * worldWidth),
			x:Point.x,
			y:Point.y,
			f:0,
			g:0
		};
		
		return newNode;
	}
	
	function calculatePath()
	{
		var	mypathStart = Node(null, {x:pathStart[0], y:pathStart[1]});
		var mypathEnd = Node(null, {x:pathEnd[0], y:pathEnd[1]});
		var AStar = new Array(worldSize);
		var Open = [mypathStart];
		var Closed = [];

		var result = [];
		var myNeighbours;
		var myNode;
		var myPath;
		var length, max, min, i, j;

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

			myNode = Open.splice(min, 1)[0];

			if(myNode.value === mypathEnd.value)
			{
				myPath = Closed[Closed.push(myNode) - 1];
				do
				{
					result.push([myPath.x, myPath.y]);
				}
				while (myPath = myPath.Parent);
				AStar = Closed = Open = [];
				result.reverse();
			}
			else 
			{
				myNeighbours = Neighbours(myNode.x, myNode.y);
				for(i = 0, j = myNeighbours.length; i < j; i++)
				{
					myPath = Node(myNode, myNeighbours[i]);
					if (!AStar[myPath.value])
					{
						myPath.g = myNode.g + distanceFunction(myNeighbours[i], myNode);
						myPath.f = myPath.g + distanceFunction(myNeighbours[i], mypathEnd);
						Open.push(myPath);
						AStar[myPath.value] = true;
					}
				}
				Closed.push(myNode);
			}
		} 
		return result;
	}
	
	return calculatePath();

} 

// Draw the path
function drawingPath (path) {
	var current, last;
	for (rp=0; rp<path.length; rp++)
	{	
		switch(rp)
		{
		case 0:
			last = [(path[rp][0]+path[rp+1][0])/2+0.5, (path[rp][1]+path[rp+1][1])/2+0.5]
			current = last
			ctx.fillStyle = 'red';	
			ctx.fillRect(path[rp][0]* tileWidth, path[rp][1]*tileHeight, tileWidth,tileHeight);	
			break;
		case path.length-1:
			ctx.fillStyle = 'blue';	
			ctx.fillRect(path[rp][0]* tileWidth, path[rp][1]*tileHeight, tileWidth,tileHeight);	
			break;
		default:
			last = current
			current = [(path[rp][0]+path[rp+1][0])/2+0.5, (path[rp][1]+path[rp+1][1])/2+0.5]
			break;
		}

		ctx.beginPath();
		ctx.moveTo(last[0]*tileWidth, last[1]*tileHeight)
		ctx.lineTo(current[0]*tileWidth,current[1]*tileHeight);
		ctx.lineWidth = 2;
		ctx.strokeStyle = '#ff0000';
		ctx.stroke();
	}

}

// Start this Algorithm
function startFindPath (searchValue) {
	createWorld();
	const shelvesName = searchCheck(searchValue);
	const endPoints = shelvesName? getEndPoints(shelvesName) : [];
	for(var i=0; i< endPoints.length; i++) {
		const currentPaths = findPath(world, startPoint, endPoints[i]);
		drawingPath(currentPaths);
	}
}

// Set the config
function setConfig(config) {
	multiTargetCount = config.multiTargetCount || multiTargetCount;
	startPoint = config.startPoint || startPoint;
	worldWidth = config.areaSize[0] || worldWidth;
	worldHeight = config.areaSize[1] || worldHeight;
	tileWidth = config.tileSize.titleWidth || tileWidth;
	tileHeight = config.tileSize.tileHeight || tileHeight;
	walls = config.wall || walls;
    shelvesNameArray = Object.keys(walls) || [];

}

onload();
