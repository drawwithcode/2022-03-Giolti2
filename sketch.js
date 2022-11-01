const ANGLE_JITTER = 10;
const X_JITTER = 0.3;
const Y_JITTER = 0.2;

let dragPhoto;
let dragOffX;
let dragOffY;

class Photo{
	constructor(img) {
		this.img = img;
		this.angle = random(-ANGLE_JITTER, ANGLE_JITTER)
		this.x = width * (0.5 + random(-X_JITTER, X_JITTER))
		this.y = height * (0.5 + random(-Y_JITTER, Y_JITTER))
	}

	draw() {
		push()

		noStroke();

		//draw the white part of the polaroid
		fill(255);

		translate(this.x, this.y);
		rotate(this.angle);

		rect(-videoHeight * 0.55, -videoHeight * 0.55, videoHeight * 1.1, videoHeight * 1.25);

		push()
		scale(-1, 1)
		image(this.img, -videoHeight * 0.5, -videoHeight * 0.5);
		pop()

		noFill()
		stroke(255, 0, 0)

		circle(0, 0, videoHeight*1.1)

		pop()
	}

	mouseOn() {
		return dist(mouseX, mouseY, this.x, this.y) < videoHeight * 0.55
	}
}

const FLASH_DURATION = 400;

class Flash{
	constructor() {
		this.time = 0;
		this.startTime = 0;
	}

	start() {
		this.time = FLASH_DURATION;
		this.startTime = millis();
	}

	update() {
		push()

		noStroke()

		let alpha = 1 - (millis() - this.startTime) / FLASH_DURATION;

		fill(color(255, 255, 255, alpha * 255))

		rect(0, 0, width, height)

		pop()
	}
}

const videoWidth = 640;
const videoHeight = 360;

let capture;

let flash = new Flash();

let photos = [];

function preload() {
	// put preload code here
}

function setup() {
	createCanvas(windowWidth, windowHeight);

	angleMode(DEGREES)

	select("#smile").elt.addEventListener("click", smile)

	let constraints = {
		video: {
			mandatory: {
				maxWidth: videoWidth,
				maxHeight: videoHeight
		 	}
		},
	audio: false
	};

	capture = createCapture(constraints)
	capture.hide();
	// put setup code here
}

function draw() {
	// put drawing code here
	background(53, 101, 57)

	photos.forEach(function (photo) {
		photo.draw();
	})

	flash.update();
}

function mousePressed() {
	for (let i = photos.length - 1; i >= 0; i--){
		if (photos[i].mouseOn()) {
			dragPhoto = photos.splice(i, 1)[0];
			dragOffX = dragPhoto.x - mouseX;
			dragOffY = dragPhoto.y - mouseY;
			photos.push(dragPhoto);

			break;
		}
	}
}

function mouseDragged() {
	if (dragPhoto) {
		dragPhoto.x = mouseX + dragOffX;
		dragPhoto.y = mouseY + dragOffY;
	}
}

function mouseReleased() {
	dragPhoto = null;
	dragOffX = 0;
	dragOffY = 0;
}

function smile() {
	if (capture.loadedmetadata) {
		flash.start();
		setTimeout(function () {
			let img = capture.get(videoWidth * 7 / 32, 0, videoWidth * 18 / 32, videoHeight);
			photos.push(new Photo(img))
		}, 100)
	}
}