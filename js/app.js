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


    var stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';

    document.body.appendChild(stats.domElement);

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
    var sphereMaterial = new THREE.MeshPhongMaterial(
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
//    scene.add(sphere);

    init_maze(THREE, scene);
    
    // create a point light
    var pointLight = new THREE.PointLight( 0xFFFFFF );
    //pointLight.tick = function() { this.position = new THREE.Vector3(130*Math.sin(-th/10), 130*Math.cos(th), 130) }
    pointLight.position.x = 0;
    pointLight.position.y = 0;
    pointLight.position.z = 130;

    // add to the scene
    scene.add(pointLight);

    var th = 0;

    function tick() {
	requestAnimationFrame(tick)
	th += 0.05;
	
	$.each(scene.children, function(i, obj) {
	    if(obj.tick) {
		obj.tick();
	    }
	});
	// draw!
	renderer.render(scene, camera);

	stats.update();
    }

    tick();

});