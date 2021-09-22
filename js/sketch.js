const EL = {};
const IMAGE_FILE = './assets/dolomita.jpg';
const INITIAL_DELTA = 4;

let oImage, sImage, mImage;
let mImageScale;
let currentWidth, currentHeight, currentDelta, currentDirection, currentFrameMod;
let autoPlay;


function preload() {
  oImage = loadImage(IMAGE_FILE);
  EL.container = document.getElementById('my-canvas-container');
  EL.menu = document.getElementById('my-menu-container');
  EL.buttonBack = document.getElementById('my-button-back');
  EL.buttonForward = document.getElementById('my-button-forward');
  EL.buttonPlay = document.getElementById('my-button-play');
  EL.buttonImage = document.getElementById('my-file-input');

  EL.buttonForward.addEventListener('click', () => {
    currentWidth = max(1, currentWidth - 10);
    sizeImage();
  });

  EL.buttonBack.addEventListener('click', () => {
    currentWidth = min(sImage.width, currentWidth + 10);
    sizeImage();
  });

  EL.buttonPlay.addEventListener('click', () => {
    const cVal = EL.buttonPlay.getAttribute('value');
    const nVal = cVal == 'PLAY' ? 'PAUSE' : 'PLAY';
    autoPlay = !autoPlay;
    EL.buttonPlay.setAttribute('value', nVal);
  });

  EL.buttonImage.addEventListener('change', (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (readerEvent) {
      const newImage = new Image();
      newImage.onload = function (imageEvent) {
        oImage.resize(newImage.width, newImage.height);
        oImage.drawingContext.drawImage(newImage, 0, 0, newImage.width, newImage.height,
                                        0, 0, oImage.width, oImage.height);
        sizeCanvas();
        currentWidth = width;

        if (event.target) event.target.value = '';
      }
      newImage.src = readerEvent.target.result;
    }
    reader.readAsDataURL(file);
  });
}

function sizeCanvas() {
  const maxWidth = windowWidth;
  const maxHeight = windowHeight - EL.menu.offsetHeight;
  const imageRatio = oImage.width / oImage.height;
  const canvasWidth = min(maxWidth, maxHeight * imageRatio);
  const canvasHeight = canvasWidth / imageRatio;
  resizeCanvas(canvasWidth, canvasHeight);
  EL.container.style.height = `${height}px`;
  sImage.resize(width, height);
  mImage.resize(width, height);
  sImage.copy(oImage, 0, 0, oImage.width, oImage.height, 0, 0, sImage.width, sImage.height);
}

function sizeImage() {
  const imageRatio = oImage.width / oImage.height;
  currentHeight = constrain(currentWidth / imageRatio, 1, sImage.height);
  mImage.copy(sImage, 0, 0, sImage.width, sImage.height, 0, 0, mImage.width, mImage.height);
  mImage.resize(currentWidth, currentHeight);
  mImage.resize(sImage.width, sImage.height);
}

function setup() {
  const mCanvas = createCanvas(0, 0);
  mImage = createImage(1, 1);
  sImage = createImage(1, 1);
  sizeCanvas();

  mCanvas.parent('my-canvas-container');
  mCanvas.id('my-canvas');
  mCanvas.elt.classList.add('main-canvas');
  smooth();
  currentWidth = width;
  currentDirection = -1;
  currentDelta = INITIAL_DELTA;
  currentFrameMod = 1;
  sizeImage();
  autoPlay = true;
}

function windowResized() {
  sizeCanvas();
  currentWidth = width;
  sizeImage();
}

function draw() {
  background(255);

  if (autoPlay && ((frameCount % currentFrameMod) == 0)) {
    currentWidth = currentWidth + currentDirection * currentDelta;
    currentDelta = (currentWidth > sImage.width / 2) ? INITIAL_DELTA : 1;
    currentFrameMod = (currentWidth < sImage.width / 4) ? 3 : 1;

    if ((currentWidth < 1) || (currentWidth > sImage.width)) {
      currentDirection = -currentDirection;
      currentWidth = constrain(currentWidth, 1, sImage.width);
    }
    sizeImage();
  }

  image(mImage, 0, 0);
}
