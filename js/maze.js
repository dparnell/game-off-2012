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
    var to_remove = [];

    var box;

    function clearMaze() {
        // make sure there are no cubes left in the scene
        for(var cube in cubes) {
            scene.remove(cube);
        }
        cubes = [];
    }

    // very simple "maze" builder.  Need a better one as the mazes it makes are not very good
    function build_maze(x,y,d) {
        var dx, dy;
        var nx, ny;

        if(d==0) {
            dx = 0;
            dy = 1;
        } else if(d==1) {
            dx = 1;
            dy = 0;
        } else if(d==2) {
            dx = 0;
            dy = -1;
        } else if(d==3) {
            dx = -1;
            dy = 0;
        }

        if(cubes[(x+dx)+(y+dy)*MAZE_WIDTH]) {
            var distance = (Math.floor(Math.random()*5)+1)*2;
            while(distance>0) {
                box.position.x = (x-MAZE_WIDTH/2) * CUBE_SIZE * CUBE_FUDGE + OFFSET_X_BY;
                box.position.y = (y-MAZE_HEIGHT/2) * CUBE_SIZE * CUBE_FUDGE + OFFSET_Y_BY;
                box.position.z = 0;

                var cube = cubes[x+y*MAZE_WIDTH];
                if(cube) {
                    to_remove.push(cube);
                    cubes[x+y*MAZE_WIDTH] = null;
                }

                nx = x + dx;
                ny = y + dy;
                if(nx>=0 && nx<MAZE_WIDTH && ny>=0 && ny<MAZE_HEIGHT) {
                    x = nx;
                    y = ny;
                } else {
                    break;
                }
                distance--;
            }

            build_maze(x,y,(d+1)&3);
            build_maze(x,y,(d+2)&3);
            build_maze(x,y,(d+3)&3);
        }
    }

    var remove_interval;
    function remove_slowly() {
        var cube = to_remove.shift();

        if(to_remove.length == 0) {
            global.clearInterval(remove_interval);
            scene.remove(box);
        } else {
            scene.remove(cube);
            box.position = cube.position;
        }
    }

    function Maze() {
        clearMaze();

        // fill the maze
        for(var i=0; i<MAZE_HEIGHT; i++) {
            for(var j=0; j<MAZE_WIDTH; j++) {
                var cube = new THREE.Mesh(new THREE.CubeGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE), cubeMaterial);

                cube.position.x = (j-MAZE_WIDTH/2) * CUBE_SIZE * CUBE_FUDGE + OFFSET_X_BY;
                cube.position.y = (i-MAZE_HEIGHT/2) * CUBE_SIZE * CUBE_FUDGE + OFFSET_Y_BY;
                cube.position.z = 0;

                cubes.push(cube);
                scene.add(cube);
            }
        }

        scene.add(box);


        build_maze(0,0,0);
        remove_interval = global.setInterval(remove_slowly, MAZE_SPEED);
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