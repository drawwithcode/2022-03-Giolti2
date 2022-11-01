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

	//draws the polaroid with the saved image
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

		/* noFill()
		stroke(255, 0, 0)

		circle(0, 0, videoHeight*1.1) */

		pop()
	}

	//basic collision checker, could improve to check the rectangle shape
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

	//saves the time it was started
	start() {
		this.time = FLASH_DURATION;
		this.startTime = millis();
	}

	//fills the canvas white based on time since start
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

let flash = new Flash();
let photos = [];

let capture;
let click;
let c;

function preload() {
	click = loadSound("./SOUND/click.wav");
}

function setup() {
	c = createCanvas(windowWidth, windowHeight);

	angleMode(DEGREES)

	select("#smile").elt.addEventListener("click", smile);
	select("#save").elt.addEventListener("click", savePicture);
	select("#reset").elt.addEventListener("click", resetPictures);

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
}

function draw() {
	background(222, 184, 135);

	photos.forEach(function (photo) {
		photo.draw();
	})

	flash.update();
}

function mousePressed() {
	//reverse array cycling since the items are drawn with last on top
	for (let i = photos.length - 1; i >= 0; i--){
		if (photos[i].mouseOn()) {
			//takes out the clicked instance on top
			dragPhoto = photos.splice(i, 1)[0];
			dragOffX = dragPhoto.x - mouseX;
			dragOffY = dragPhoto.y - mouseY;

			//puts the clicked instance on top of everything else
			photos.push(dragPhoto);

			//breaks the cycle to stop at first instance found
			break;
		}
	}
}

//updates the held photo's position on drag
function mouseDragged() {
	if (dragPhoto) {
		dragPhoto.x = mouseX + dragOffX;
		dragPhoto.y = mouseY + dragOffY;
	}
}

//resets the held photo state
function mouseReleased() {
	dragPhoto = null;
	dragOffX = 0;
	dragOffY = 0;
}

//starts the flash and the sound
function smile() {
	if (capture.loadedmetadata) {
		flash.start();
		click.play();

		//waits a moment to shoot the picture, so the screen is flashing white
		setTimeout(function () {
			let img = capture.get(videoWidth * 7 / 32, 0, videoWidth * 18 / 32, videoHeight);
			photos.push(new Photo(img))
		}, 100)
	}
}

//redundant explanation
function savePicture() {
	console.log("saved!")
	saveCanvas(c, "myCanvas", "png")
}

//redundant explanation #2
function resetPictures() {
	photos = []
}