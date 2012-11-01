// Application code here

$(document).ready(function() {
    // set the scene size
    var WIDTH = 900;
    var HEIGHT = 600;

    // set some camera attributes
    var VIEW_ANGLE = 45,
    ASPECT = WIDTH / HEIGHT,
    NEAR = 0.1,
    FAR = 10000;

    // get the DOM element to attach to
    // - assume we've got jQuery to hand
    var $container = $('.app');

    // create a WebGL renderer, camera
    // and a scene
    var renderer = new THREE.WebGLRenderer();
    var camera = new THREE.PerspectiveCamera(  VIEW_ANGLE,
                                               ASPECT,
                                               NEAR,
                                               FAR  );
    var scene = new THREE.Scene();

    // the camera starts at 0,0,0 so pull it back
    camera.position.z = 300;

    // start the renderer
    renderer.setSize(WIDTH, HEIGHT);

    // attach the render-supplied DOM element
    $container.append(renderer.domElement);

    // create the sphere's material
    var sphereMaterial = new THREE.MeshLambertMaterial(
        {
            color: 0xCC0000
        });

    // set up the sphere vars
    var radius = 50, segments = 16, rings = 16;

    // create a new mesh with sphere geometry -
    // we will cover the sphereMaterial next!
    var sphere = new THREE.Mesh(
        new THREE.SphereGeometry(radius, segments, rings),
        sphereMaterial);

    // add the sphere to the scene
    scene.add(sphere);


    var CUBE_SIZE = 20;
    var cubeMaterial = new THREE.MeshPhongMaterial(
        {
            color: 0x0000CC
        });
    cubeMaterial = new THREE.MeshBasicMaterial( { color: 0x2233cc, opacity: 0.5, combine: THREE.MixOperation, reflectivity: 0.75, transparent: true } );

    var cube = new THREE.Mesh(
	new THREE.CubeGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE),
	cubeMaterial
    );
    scene.add(cube);

    var cube2 = new THREE.Mesh(
	new THREE.CubeGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE),
	cubeMaterial
    );
    scene.add(cube2);

    var cube3 = new THREE.Mesh(
	new THREE.CubeGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE),
	cubeMaterial
    );
    scene.add(cube3);

    // and the camera
    scene.add(camera);

    // create a point light
    var pointLight = new THREE.PointLight( 0xFFFFFF );

    // set its position
    pointLight.position.x = 10;
    pointLight.position.y = 50;
    pointLight.position.z = 130;

    // add to the scene
    scene.add(pointLight);

    var th = 0;

    function tick() {
	requestAnimationFrame(tick)
	th += 0.05;

	cube.position = new THREE.Vector3(radius * 2 * Math.sin(th), 0, radius * 2 * Math.cos(th));
	cube2.position = new THREE.Vector3(radius * 2 * Math.sin(th), radius * 2 * Math.cos(-th), 0);
	cube3.position = new THREE.Vector3(0, radius * 2 * Math.sin(th), radius * 2 * Math.cos(-th));

	// draw!
	renderer.render(scene, camera);

    }

    tick();

});