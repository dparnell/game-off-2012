// Code to create the maze

(function(global){
    var MAZE_WIDTH = 13;
    var MAZE_HEIGHT = 15;
    var CUBE_SIZE = 14;
    var CUBE_FUDGE = 1.03;
    var OFFSET_X_BY = 5;
    var OFFSET_Y_BY = 5;

    var THREE = null;
    var cubes = [];
    var scene;
    var cubeMaterial;

    function clearMaze() {
	// make sure there are no cubes left in the scene
	for(var cube in cubes) {
	    scene.remove(cube);
	}
	cubes = [];
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
    }

    global.init_maze = function(three, aScene) {
	if(THREE==null) {
	    THREE = three;
	    scene = aScene;
	    cubeMaterial = new THREE.MeshLambertMaterial( { color: 0x0066cc } );
	}

	return new Maze();
    }
})(window);