/// <reference path="../node_modules/@types/jquery/index.d.ts"/>
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    clone() {
        return new Point(this.x, this.y);
    }
}
document.addEventListener("DOMContentLoaded", function (event) {
    let canvas = document.getElementById('canvas');
    canvas.width = canvas.clientWidth * window.devicePixelRatio;
    canvas.height = canvas.clientHeight * window.devicePixelRatio;
    let context = canvas.getContext('2d');
    $ = jQuery;
    let position = $(canvas).position();
    let cityWidth = canvas.width;
    let cityHeight = canvas.height;
    let city = {
        width: cityWidth,
        height: cityHeight,
        left: position.left,
        top: position.top,
        nActors: 100,
        lifetimeMax: 1000,
        angleVariation: 0,
        generationProbability: 10,
    };
    let OUT = -500;
    let actors = [];
    let nInitializedActors = 0;
    function getCityAt(x, y) {
        return context.getImageData(x, y, 1, 1).data[3];
        // return context.getImageData(0, 0, city.width, city.height).data[4 * (x + y * city.width)]
        // return city.map[4 * (x + (city.height - y) * city.width)]
        // return city.map != null ? city.map.data[4 * (x + y * city.width)] : 0
        // return cityMap[x][y]
        //
        // let data = context.getImageData(x-1, y-1, 2, 2).data;
        // let average = 0;
        // for(let i=0 ; i<4 ; i++) {
        // 	average += data[i*4];
        // }
        // average /= 4;
        // return average > 120 ? 1 : 0;
    }
    function vToString(v) {
        return 'x: ' + v.x + ', y: ' + v.y;
    }
    class Actor {
        constructor() {
            this.speed = 10;
            this.reset();
        }
        reset() {
            this.position = new Point(-OUT, -OUT);
            this.previousPosition = new Point(-OUT, -OUT);
            this.positionFloat = new Point(-OUT, -OUT);
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
                    pos = new Point(city.width / 2, city.height / 2);
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
            if (ix < 0 || iy < 0 ||
                ix >= city.width - 1 || iy >= city.height - 1 ||
                getCityAt(ix, iy) > 0 || this.time > this.lifetime) {
                this.initialize(null, null, false);
                return;
            }
            this.draw();
            this.angle += (Math.random() - 0.5) * city.angleVariation;
            this.time++;
            if (Math.random() * 100 < city.generationProbability) {
                if (nInitializedActors < actors.length) {
                    actors[nInitializedActors].initialize(this.position);
                }
            }
        }
        draw() {
            context.beginPath();
            context.moveTo(this.previousPosition.x, this.previousPosition.y);
            context.lineTo(this.position.x, this.position.y);
            context.closePath();
            context.stroke();
        }
    }
    for (let i = 0; i < city.nActors; i++) {
        actors.push(new Actor());
    }
    function init() {
        for (let i = 0; i < city.nActors; i++) {
            actors[i].reset();
        }
        nInitializedActors = 0;
        console.log("ch: " + canvas.clientHeight);
        canvas.width = canvas.clientWidth * window.devicePixelRatio;
        canvas.height = canvas.clientHeight * window.devicePixelRatio;
        context.translate(0.5, 0.5);
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.strokeStyle = "black";
        context.lineWidth = 1;
        context.lineCap = 'square';
        city.width = canvas.width;
        city.height = canvas.height;
        actors[0].initialize(new Point(20, 20), 0);
        actors[1].initialize(new Point(city.width - 20, city.height - 20), 2 * 90);
        // actors[2].initialize(new Point(city.width-20, 20), 2*90);
        // actors[3].initialize(new Point(20, city.height-20), 0);
    }
    function animate() {
        requestAnimationFrame(animate);
        for (let actor of actors) {
            actor.update();
        }
    }
    init();
    animate();
    function resize() {
        init();
    }
    window.onresize = resize;
});
