let numCols, numRows;
let squareSize = 60;
let margin = 2;
let potPosY = [];
let grid1 = [];

function setup() {
  createCanvas(900, 600);
  numCols = width / (squareSize + margin) * 1.5;
  numRows = height / (squareSize + margin) + 2;

  for (let i = 0; i < numCols; i++) {
    potPosY[i] = [];
    grid1[i] = [];
  }

  // Initialize the grid
  let noiseOffsetX = random(10);
  let noiseOffsetY = random(10);
  for (let j = 0; j < numRows; j++) {
    let widthProgress = 0;
    for (let i = 0; i < numCols; i++) {
      // Use 2D noise to determine the size of each square
      let noiseValue = 3*noise(noiseOffsetX + i * 1, noiseOffsetY + j * 0.15);
      let newSize = map(noiseValue, 0, 1, squareSize * 0.025, squareSize * 1);
      widthProgress += newSize + margin / 2;
      potPosY[i][j] = widthProgress - newSize / 2;
      let x = potPosY[i][j] + i * margin + margin * 4 / 3;
      let y = j * (squareSize + margin) + margin * 4 / 3;

      // Randomly decide whether to create a square
      if (random(1) > 0.0) {
        grid1[i][j] = new Square(x, y, newSize, squareSize);
      }
    }
  }
}

function draw() {
  background(225, 225, 255);

  // Display the grid
  for (let i = 0; i < numCols; i++) {
    for (let j = 0; j < numRows; j++) {
      if (grid1[i][j] != null) {
        grid1[i][j].display(mouseX, mouseY);
      }
    }
  }
}

class Square {
  constructor(x, y, sizeX, sizeY) {
    this.x = x;
    this.y = y;
    this.sizeX = sizeX;
    this.sizeY = sizeY;
  }

  display(_sourceX, _sourceY) {
    ellipseMode(CENTER);

    // Number of opposite rectangles
    let numOpposites = 24; // Adjust as needed

    let distanceScale = map(dist(0, 0, _sourceX - this.x, _sourceY - this.y), 0, width, 0.1, 0.8); // Adjust this distance as needed
    let distance = 5 * distanceScale;
    for (let i = 0; i < numOpposites; i++) {
      // Calculate the position of the opposite rectangle at an increasing distance
      let scaleFactor = (i + 1) * distance / dist(0, 0, _sourceX - this.x, _sourceY - this.y);
      let oppositeX = this.x - (_sourceX - this.x) * scaleFactor;
      let oppositeY = this.y - (_sourceY - this.y) * scaleFactor;

      fill(0, 0, 80, map(i, 0, numOpposites - 1, 32, 0)); // Gradually decrease transparency
      ellipse(oppositeX, oppositeY, this.sizeX + i * (1 - distanceScale), this.sizeY + i * (1 - distanceScale));
    }

    // MAIN OBJECT
    fill(0, 0, 160, 100);
    noStroke();
    ellipse(this.x, this.y, this.sizeX, this.sizeY);

    // LIGHT ON OBJECT
    let scaleFactorS = distance / dist(0, 0, _sourceX - this.x, _sourceY - this.y);
    let spotX = this.x + (_sourceX - this.x) * scaleFactorS * 4.5;
    let spotY = this.y + (_sourceY - this.y) * scaleFactorS * 4.5;
    let colIntensity = this.sizeX/this.sizeY*455 + 155*(1-distanceScale)
    fill(colIntensity, colIntensity, 255, 355*(1-distanceScale));
    noStroke();
    ellipse(spotX, spotY, this.sizeX * (1 - distanceScale) / 1.6 + this.sizeX / this.sizeY, this.sizeY * (1 - distanceScale)/1.6 + this.sizeX / this.sizeY);
  }
}

function mousePressed() {
  save("LightStudy_JamieRobinson.png");
}
