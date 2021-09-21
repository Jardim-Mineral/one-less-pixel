const IMAGE_FILE = './assets/dolomita.jpg';
let oImage, sImage, mImage;
let mImageScale;
let currentWidth, currentHeight;

const EL = {};

function preload() {
  oImage = loadImage(IMAGE_FILE);
  EL.container = document.getElementById('my-canvas-container');
  EL.menu = document.getElementById('my-menu-container');
  EL.buttonBack = document.getElementById('my-button-back');
  EL.buttonForward = document.getElementById('my-button-forward');

  EL.buttonForward.addEventListener('click', () => {
    currentWidth = max(1, currentWidth - 10);
    sizeImage();
  });

  EL.buttonBack.addEventListener('click', () => {
    currentWidth = min(sImage.width, currentWidth + 10);
    sizeImage();
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
  sizeImage();
}

function windowResized() {
  sizeCanvas();
  currentWidth = width;
  sizeImage();
}

function draw() {
  background(255);
  image(mImage, 0, 0);
}