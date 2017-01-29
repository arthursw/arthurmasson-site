/// <reference path="../node_modules/@types/three/index.d.ts"/>
/// <reference path="../node_modules/@types/jquery/index.d.ts"/>
"use strict";
document.addEventListener("DOMContentLoaded", function (event) {
    var mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    function onDocumentMouseMove(event) {
        mouseX = event.clientX;
        mouseY = event.clientY;
        let xi = Math.round(mouseX - city.left);
        let yi = Math.round(mouseY - city.top);
        // console.log('xi: ' + xi + ', yi: ' + yi)
        // console.log('' + getCityAt(xi - 1, yi - 1) + ' ' + getCityAt(xi, yi - 1) + ' ' + getCityAt(xi + 1, yi - 1))
        // console.log('' + getCityAt(xi - 1, yi) + ' ' + getCityAt(xi, yi) + ' ' + getCityAt(xi + 1, yi))
        // console.log('' + getCityAt(xi - 1, yi + 1) + ' ' + getCityAt(xi, yi + 1) + ' ' + getCityAt(xi + 1, yi + 1))
    }
    let container = document.getElementById('threejs-canvas');
    let camera = null;
    let scene = null;
    // let sceneRTT: THREE.Scene = null;
    let rtTexture;
    let renderer = null;
    // let renderer: THREE.CanvasRenderer = null;
    let cityMap = [];
    $ = jQuery;
    let position = $(container).position();
    let cityWidth = container.clientWidth;
    let cityHeight = container.clientHeight;
    let city = {
        width: cityWidth,
        height: cityHeight,
        left: position.left,
        top: position.top,
        nActors: 100,
        lifetimeMax: 1000,
        angleVariation: 0,
        generationProbability: 10,
        map: new Float32Array(4 * cityWidth * cityHeight)
    };
    // let cityCanvas = document.createElement('canvas')
    // window.city = city;
    for (let x = 0; x < city.width; x++) {
        cityMap.push([]);
        for (let y = 0; y < city.height; y++) {
            cityMap[x].push(1);
        }
    }
    let OUT = -500;
    let actors = [];
    let nInitializedActors = 0;
    function getCityAt(x, y) {
        return city.map[4 * (x + (city.height - y) * city.width)];
        // return cityMap[x][y]
    }
    function vToString(v) {
        return 'x: ' + v.x + ', y: ' + v.y + ', z: ' + v.z;
    }
    // function setCityAt(x: number, y: number, v: number) {
    // 	city.map[4 * (x + (city.height - y) * city.width)] = v
    // }
    class Actor {
        constructor(vertices) {
            this.vertices = vertices;
            this.speed = 1;
            this.position = new THREE.Vector3(-OUT, -OUT, 0);
            this.previousPosition = new THREE.Vector3(-OUT, -OUT, 0);
            this.positionFloat = new THREE.Vector3(-OUT, -OUT, 0);
            this.vertices.push(this.position);
            this.vertices.push(this.previousPosition);
            // this.initialize(pos)
            this.initialized = false;
        }
        initialize(pos = null, angle = null, incrementNInitializedActors = true) {
            // if position is negative: intialize this position at a random actor position
            if (pos == null) {
                if (nInitializedActors > 0) {
                    let n = Math.floor(Math.random() * (nInitializedActors));
                    pos = actors[n].position.clone();
                }
                else {
                    pos = new THREE.Vector3(city.width / 2, city.height / 2, 0);
                }
            }
            this.position.x = pos.x;
            this.position.y = pos.y;
            this.positionFloat.x = pos.x;
            this.positionFloat.y = pos.y;
            this.previousPosition.x = this.position.x;
            this.previousPosition.y = this.position.y;
            this.angle = angle != null ? angle : Math.floor(Math.random() * 5) * 90;
            this.lifetime = angle != null ? 10000000000 : Math.random() * city.lifetimeMax;
            this.time = 0;
            this.initialized = true;
            // if(this == actors[0]) {
            // 	console.log('initialized: position: ' + vToString(this.position) + ' - angle: ' + this.angle + ' - lifetime: ' + this.lifetime)
            // }
            if (incrementNInitializedActors) {
                nInitializedActors++;
            }
        }
        update() {
            if (!this.initialized) {
                return;
            }
            this.previousPosition.x = this.position.x;
            this.previousPosition.y = this.position.y;
            this.positionFloat.x += this.speed * Math.cos(this.angle * Math.PI / 180);
            this.positionFloat.y += this.speed * Math.sin(this.angle * Math.PI / 180);
            this.position.x = Math.round(this.positionFloat.x);
            this.position.y = Math.round(this.positionFloat.y);
            let ix = this.position.x;
            let iy = this.position.y;
            // if(this == actors[0]) {
            // 	console.log('update: position: ' + vToString(this.position) + ' - city: ' + getCityAt(ix, iy) + ' - angle: ' + this.angle + ' - lifetime: ' + this.lifetime)
            // }
            if (ix < 0 || iy < 0 ||
                ix >= city.width - 1 || iy >= city.height - 1 ||
                Math.abs(getCityAt(ix, iy) - 1) > 0.1 || this.time > this.lifetime) {
                // if(this == actors[0]) {
                // 	console.log('reinitialize ix: ' + ix + ' iy:' + iy + ' city: ' + getCityAt(ix, iy) + ' - Math.abs(city - 1): ' + Math.abs(getCityAt(ix, iy) - 1) + ' lifetime: ' + this.lifetime + ', time: ' + this.time)
                // }
                this.initialize(null, null, false);
                return;
            }
            // setCityAt(ix, iy, 0)
            cityMap[ix][iy] = 0;
            this.angle += (Math.random() - 0.5) * city.angleVariation;
            this.time++;
            // if(this == actors[0]) {
            // 	console.log('updateEnd: angle:' + this.angle + ' - time: ' + this.time)
            // }
            if (Math.random() * 100 < city.generationProbability) {
                if (nInitializedActors < actors.length) {
                    actors[nInitializedActors].initialize(this.position);
                }
            }
        }
    }
    let line = null;
    function init() {
        // container = document.createElement( 'div' );
        // document.body.appendChild( container );
        // camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, - 500, 1000 );
        camera = new THREE.OrthographicCamera(0, city.width, 0, city.height, -500, 1000);
        camera.position.z = 100;
        scene = new THREE.Scene();
        // sceneRTT = new THREE.Scene();
        rtTexture = new THREE.WebGLRenderTarget(city.width, city.height, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter, format: THREE.RGBAFormat, type: THREE.FloatType });
        var material = new THREE.LineBasicMaterial({ color: 0x0000FF, linewidth: 0.1 });
        var geometry = new THREE.Geometry();
        // geometry.vertices.push(new THREE.Vector3(0, 0, 0))
        // geometry.vertices.push(new THREE.Vector3(100, 0, 0))
        // geometry.vertices.push(new THREE.Vector3(0, 100, 0))
        // geometry.vertices.push(new THREE.Vector3(100, 100, 0))
        for (let i = 0; i < city.nActors; i++) {
            actors.push(new Actor(geometry.vertices));
        }
        actors[0].initialize(new THREE.Vector3(20, 20, 0), 0);
        actors[1].initialize(new THREE.Vector3(city.width - 20, city.height - 20, 0), 2 * 90);
        actors[2].initialize(new THREE.Vector3(city.width - 20, 20, 0), 2 * 90);
        actors[3].initialize(new THREE.Vector3(20, city.height - 20, 0), 0);
        line = new THREE.LineSegments(geometry, material);
        scene.add(line);
        var vgeometry = new THREE.Geometry();
        for (let i = 0; i < city.width; i += 20) {
            vgeometry.vertices.push(new THREE.Vector3(i, -1, 0));
            vgeometry.vertices.push(new THREE.Vector3(i, city.height + 1, 0));
        }
        // var vline = new THREE.LineSegments( vgeometry, material );
        // scene.add( vline );
        // Lights
        var ambientLight = new THREE.AmbientLight(Math.random() * 0x10);
        scene.add(ambientLight);
        // var directionalLight = new THREE.DirectionalLight( Math.random() * 0xffffff );
        // directionalLight.position.x = Math.random() - 0.5;
        // directionalLight.position.y = Math.random() - 0.5;
        // directionalLight.position.z = Math.random() - 0.5;
        // directionalLight.position.normalize();
        // scene.add( directionalLight );
        renderer = new THREE.WebGLRenderer({ canvas: container, preserveDrawingBuffer: true });
        // renderer = new THREE.CanvasRenderer( { canvas: container, preserveDrawingBuffer: true } );
        // renderer.setViewport(0, 0, container.clientWidth, container.clientHeight);
        renderer.setSize(city.width, city.height);
        renderer.autoClear = false;
        renderer.autoClearColor = false;
        // renderer.setClearColor( 0xf5f5f5 );
        renderer.setClearColor(0xffffff);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.clearColor();
        renderer.clearTarget(rtTexture, true, true, true);
        renderer.readRenderTargetPixels(rtTexture, 0, 0, city.width, city.height, city.map);
        // stats = new Stats();
        // container.appendChild( stats.dom );
        // window.addEventListener( 'resize', onWindowResize, false );
        // function onWindowResize(){
        // 	camera.updateProjectionMatrix();
        // 	// city.width = container.clientWidth
        // 	// city.height = container.clientWidth
        // 	renderer.setSize(container.clientWidth, container.clientHeight);
        // }
    }
    //
    function animate() {
        requestAnimationFrame(animate);
        // stats.begin()
        render();
        // stats.end()
    }
    function render() {
        // particles.rotation.x += 0.0005;
        // particles.rotation.y += 0.001;
        // var timer = Date.now() * 0.001;
        // camera.position.x = Math.cos( timer ) * 200;
        // camera.position.z = Math.sin( timer ) * 200;
        for (let actor of actors) {
            actor.update();
        }
        line.geometry.verticesNeedUpdate = true;
        renderer.render(scene, camera);
        renderer.render(scene, camera, rtTexture);
        renderer.readRenderTargetPixels(rtTexture, 0, 0, city.width, city.height, city.map);
        // let read = new Float32Array( 4 )
        // renderer.readRenderTargetPixels( rtTexture, mouseX - city.left, city.height - (mouseY - city.top), 1, 1, read );
        // console.log('mx: ' + mouseX + ', my: ' + mouseY)
        // console.log('mxi: ' + (mouseX - city.left) + ', myi: ' + ((city.height - (mouseY - city.top))))
    }
    init();
    animate();
});
