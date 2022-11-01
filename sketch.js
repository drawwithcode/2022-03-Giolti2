const ANGLE_JITTER = 5;
const X_JITTER = 0.2;
const Y_JITTER = 0.2;

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
		
		scale(-1, 1)
		image(this.img, -videoHeight * 0.5, -videoHeight * 0.5);

		pop()
	}
}

const FLASH_DURATION = 400;

class FLash{
	constructor() {
		this.time = 0;
	}
}

const videoWidth = 640;
const videoHeight = 360;

let capture;

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
}

function smile() {
	if (capture.loadedmetadata) {
		let img = capture.get(videoWidth * 7 / 32, 0, videoWidth * 18 / 32, videoHeight);
		photos.push(new Photo(img))
	}
}