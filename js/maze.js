// Code to create the maze

(function(global){
    var MAZE_WIDTH = 13;
    var MAZE_HEIGHT = 15;
    var CUBE_SIZE = 14;
    var CUBE_FUDGE = 1.03;
    var OFFSET_X_BY = 5;
    var OFFSET_Y_BY = 5;

    var MAZE_SPEED = 10;

    var THREE = null;
    var cubes = [];
    var walls = [];
    var scene;
    var cubeMaterial;

    var box;

    function clearMaze() {
	// make sure there are no cubes left in the scene
	for(var cube in cubes) {
	    scene.remove(cube);
	}
	cubes = [];
    }

    function mazeBuilder() {
	var x = 0;
	var y = 0;
	var direction = 0;
	var distance = Math.floor(Math.random()*10)+1;
	var todo = [];

	function lookAhead(dir, dist) {
	    if(dir==0) {
		if(y+dist<MAZE_HEIGHT) {
		    return cubes[x+(y+dist)*MAZE_WIDTH];
		}
	    }
	    if(dir==1) {
		if(x+dist<MAZE_WIDTH) {
		    return cubes[(x+dist)+y*MAZE_WIDTH];
		}
	    }
	    if(dir==2) {
		if(y-dist>=0) {
		    return cubes[x+(y-dist)*MAZE_WIDTH];
		}
	    }
	    if(dir==3) {
		if(x-dist>=0) {
		    return cubes[(x-dist)+y*MAZE_WIDTH];
		}
	    }

	    return false;
	}
	
	function neighbourCount() {
	    var result = 0;

	    if(x>0) {
		if(cubes[(x-1)+y*MAZE_WIDTH]) {
		    result++;
		}
	    } else {
		result++;
	    }
	    if(x<MAZE_WIDTH-1) {
		if(cubes[(x+1)+y*MAZE_WIDTH]) {
		    result++;
		}
	    } else {
		result++;
	    }
	    if(y>0) {
		if(cubes[x+(y-1)*MAZE_WIDTH]) {
		    result++;
		}
	    } else {
		result++;
	    }
	    if(y<MAZE_HEIGHT-1) {
		if(cubes[x+(y+1)*MAZE_WIDTH]) {
		    result++;
		}
	    } else {
		result++;
	    }
	    return result;
	}

	var builder = function() {
//	    console.info({'x':x,'y':y,'direction':direction,'distance':distance});

	    if(neighbourCount()<2) {
		distance = 0;
	    }

	    if(distance>0) {
		var cube = cubes[x+y*MAZE_WIDTH];
		scene.remove(cube);
		cubes[x+y*MAZE_WIDTH] = null;

		if(direction==0) {
		    y = y + 1;
		} else if(direction==1) {
		    x = x + 1;
		} else if(direction==2) {
		    y = y - 1;
		} else {
		    x = x - 1;
		}

		if(x<0) {
		    x = 0;
		    distance = 0;
		} else if(x==MAZE_WIDTH) {
		    x = MAZE_WIDTH-1;
		    distance = 0;
		} else if(y<0) {
		    y = 0;
		    distance = 0;
		} else if(y==MAZE_HEIGHT) {
		    y = MAZE_HEIGHT-1;
		    distance = 0;
		} else {
		    distance--;
		    if(distance>0) {
//			todo.push({'x': x, 'y': y});
			global.setTimeout(builder, MAZE_SPEED);
		    }
		}
	    }

	    if(distance<=0) {
		var new_dir = (direction + 1) & 3;
		var found = false;
		var counter = 4;
		while(counter>0 && !found) {
		    found = lookAhead(new_dir, 1) && lookAhead(new_dir, 2);

		    if(!found) {
			new_dir = (new_dir+1) & 3;
		    }

		    counter--;
		}

		if(found) {
		    todo.push({'x': x, 'y': y});
		    direction = new_dir;
		    distance = Math.floor(Math.random()*10)+1;
		    global.setTimeout(builder, MAZE_SPEED);
		} else {
  		    if(todo.length>0) {
			var p = todo.pop();
			x = p.x;
			y = p.y;

			console.info(p);
			global.setTimeout(builder, MAZE_SPEED);
		    } else {
			console.error(todo);
			scene.remove(box);
		    }

		}
	    }

	    box.position.x = (x-MAZE_WIDTH/2) * CUBE_SIZE * CUBE_FUDGE + OFFSET_X_BY;
	    box.position.y = (y-MAZE_HEIGHT/2) * CUBE_SIZE * CUBE_FUDGE + OFFSET_Y_BY;
	    box.position.z = 0;
	}

	return builder;
    }

    function Maze() {
	clearMaze();

	// fill the maze
	for(var i=0; i<MAZE_HEIGHT; i++) {
	    for(var j=0; j<MAZE_WIDTH; j++) {
		var cube = new THREE.Mesh(
		    new THREE.CubeGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE),
		    cubeMaterial
		);

		cube.position.x = (j-MAZE_WIDTH/2) * CUBE_SIZE * CUBE_FUDGE + OFFSET_X_BY;
		cube.position.y = (i-MAZE_HEIGHT/2) * CUBE_SIZE * CUBE_FUDGE + OFFSET_Y_BY;
		cube.position.z = 0;

		cubes.push(cube);
		scene.add(cube);
	    }
	}

	scene.add(box);
	
	global.setTimeout(mazeBuilder(), MAZE_SPEED);
    }

    Maze.prototype.clearMaze = clearMaze;

    global.init_maze = function(three, aScene) {
	if(THREE==null) {
	    THREE = three;
	    scene = aScene;
	    cubeMaterial = new THREE.MeshLambertMaterial( { color: 0x0066cc } );

	    // add the top wall
	    walls[0] = new THREE.Mesh(new THREE.CubeGeometry(CUBE_SIZE * MAZE_WIDTH * CUBE_FUDGE, CUBE_SIZE, CUBE_SIZE), cubeMaterial);
	    walls[0].position = new THREE.Vector3(-OFFSET_X_BY/2, MAZE_HEIGHT/2 * CUBE_SIZE * CUBE_FUDGE + OFFSET_Y_BY, 0);
	    scene.add(walls[0]);
	    // add the right wall
	    walls[1] = new THREE.Mesh(new THREE.CubeGeometry(CUBE_SIZE, CUBE_SIZE * MAZE_HEIGHT * CUBE_FUDGE, CUBE_SIZE), cubeMaterial);
	    walls[1].position = new THREE.Vector3(MAZE_WIDTH/2 * CUBE_SIZE * CUBE_FUDGE + OFFSET_X_BY, -OFFSET_Y_BY/2,  0);
	    scene.add(walls[1]);
	    // add the bottom wall
	    walls[2] = new THREE.Mesh(new THREE.CubeGeometry(CUBE_SIZE * MAZE_WIDTH * CUBE_FUDGE, CUBE_SIZE, CUBE_SIZE), cubeMaterial);
	    walls[2].position = new THREE.Vector3(-OFFSET_X_BY/2, -(MAZE_HEIGHT/2+1) * CUBE_SIZE * CUBE_FUDGE + OFFSET_Y_BY, 0);
	    scene.add(walls[2]);
	    // add the left wall
	    walls[3] = new THREE.Mesh(new THREE.CubeGeometry(CUBE_SIZE, CUBE_SIZE * MAZE_HEIGHT * CUBE_FUDGE, CUBE_SIZE), cubeMaterial);
	    walls[3].position = new THREE.Vector3(-(MAZE_WIDTH/2+1) * CUBE_SIZE * CUBE_FUDGE + OFFSET_X_BY, -OFFSET_Y_BY/2,  0);
	    scene.add(walls[3]);

	    box = new THREE.Mesh(
		new THREE.CubeGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE),
		new THREE.MeshLambertMaterial( { color: 0xcc6600 } )
	    );

	}

	return new Maze();
    }
})(window);