import './style.css';
import colors from './colors.json';
import p5 from 'p5';

const colorTypes = {
  BG: 48,
  FG: 38,
};

const colorTemplates = {
  bgColorTemplate: `[${colorTypes.BG};5;{color}m{character}[m`,
  fgColorTemplate: `[${colorTypes.FG};5;{color}}m{character}[m`,
};

let currentCharacter = " ";

const currentColor = {
  id: 255,
  hex: colors[255],
  ansi: generateColor(255),
};

const dimensions = {
  width: 16,
  height: 16,
};

const offset = {
  width: 0,
  height: 0,
};

const cellSize = {
  width: 32,
  height: 32,
};

const undoLimit = 20;

const tools = {
  PENCIL: 0,
  BUCKET: 1,
  ERASER: 2,
  COLOR_PICKER: 3,
};

let currentTool = tools.PENCIL;
let lastTool = tools.PENCIL;

const colorPalette = document.querySelector(".color-palette");
const colorPaletteMagnifier = document.querySelector("#color-palette-magnifier");
const currentBgColorElement = document.querySelector(".current-bg-color");

let takingPhoto = false;

const randomName = () => `${(+new Date()) % 1000}${Math.floor(Math.random() * 100)}`;

const undoStack = [];
const redoStack = [];

for (let i = 0, l = colors.length; i < l; i++) {
  const cpCell = document.createElement("div");
  cpCell.classList.add("color-palette-cell");
  cpCell.style.backgroundColor = colors[i];
  cpCell.dataset.id = i;
  cpCell.addEventListener("click", colorCellEvent);

  cpCell.addEventListener('mouseenter', e => {
    colorPaletteMagnifier.style.backgroundColor = colors[i];
  });

  colorPalette.appendChild(cpCell);
}

function setCurrentColor(colorId) {
  currentColor.id = colorId;
  currentColor.hex = colors[colorId];
  currentColor.ansi = generateColor(colorId);

  setCurrentBgElement();
}

function colorCellEvent() {
  setCurrentColor(parseInt(this.dataset.id));
}

function generateColor(id) {
  return colorTemplates.bgColorTemplate
    .replace("{color}", id)
    .replace("{character}", currentCharacter);
}

let pixelMatrix = [];

setCurrentBgElement();

const outputElement = document.querySelector("textarea#output");

let data = [];

function exportANSI(e) {
  let output = "";

  for (let i = 0; i < dimensions.height; i++) {
    for (let j = 0; j < dimensions.width; j++) {
      if (pixelMatrix[i][j].bgColor !== 0) {
        output += generateColor(pixelMatrix[i][j].bgColor).repeat(2);
      }
      else {
        output += " ".repeat(2);
      }
    }
    output += "\n";
  }

  outputElement.value = output;

  return output;
}

function saveANSI() {
  stringToFile(exportANSI(), 'ans', `${randomName()}-art.ans`);
}

function stringToFile(content, type, name) {
  const blob = new Blob([content], {
    type: type
  });
  const link = document.createElement('a');
  link.download = name;
  link.href = URL.createObjectURL(blob);
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function fillPixelMatrix() {
  let tempMatrix = [];

  for (let i = 0; i < dimensions.height; i++) {
    tempMatrix.push([]);

    for (let j = 0; j < dimensions.height; j++) {
      tempMatrix[i].push({
        bgColor: 0,
      });
    }
  }

  return tempMatrix;
}

const clearButton = document.querySelector("#clear-button");
const importButton = document.querySelector("#import-button");
const exportButton = document.querySelector("#export-button");
const saveButton = document.querySelector("#save-button");
const saveAsImageButton = document.querySelector("#save-as-image-button");
const otherButton = document.querySelector("#other-button");
const flipHorizontallyButton = document.querySelector("#flip-horizontally-button");
const flipVerticallyButton = document.querySelector("#flip-vertically-button");
const rotateRightButton = document.querySelector("#rotate-right-button");
const rotateLeftButton = document.querySelector("#rotate-left-button");

const undoButton = document.querySelector("#undo-button");
const redoButton = document.querySelector("#redo-button");

const otherButtons = document.querySelector(".other-buttons");

clearButton.addEventListener("click", clear);
importButton.addEventListener("click", importImage);
exportButton.addEventListener("click", exportANSI);
saveButton.addEventListener("click", saveANSI);
saveAsImageButton.addEventListener("click", saveAsImage, false);
otherButton.addEventListener("click", () => {
  otherButtons.dataset.open = (
    otherButtons.dataset.open === 'true' ? false : true
  );
});
flipHorizontallyButton.addEventListener("click", flipHorizontally);
flipVerticallyButton.addEventListener("click", flipVertically);
rotateRightButton.addEventListener("click", () => {
    appendUndo();
    rotateRight();
  }
);
rotateLeftButton.addEventListener("click", () => {
    appendUndo();
    [ 1, 2, 3 ].forEach(() => rotateRight());
  }
);

undoButton.addEventListener('click', undo);
redoButton.addEventListener('click', redo);

const toolsElements = document.querySelectorAll('.tool-button');

toolsElements.forEach(e => {
  e.addEventListener('click', changeTool);
});

colorPalette.addEventListener('mouseenter', e => {
  colorPaletteMagnifier.style.display = 'block';
});

colorPalette.addEventListener('mouseleave', e => {
  colorPaletteMagnifier.style.display = 'none';
});

document.addEventListener('mousemove', e => {
  colorPaletteMagnifier.style.left = `${e.clientX + 10}px`;
  colorPaletteMagnifier.style.top = `${e.clientY + 10}px`;
});

document.addEventListener('contextmenu', e => {
  if (e.target.nodeName !== 'TEXTAREA') {
    e.preventDefault();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.panel').style.display = 'block';
});

function changeTool() {
  lastTool = currentTool;
  toolsElements.forEach(e => {
    e.classList.remove('selected');
  });

  this.classList.add('selected');

  currentTool = tools[this.dataset.tool];
}

function clear() {
  if (!confirm('Whole drawing will be deleted! Are you sure?')) {
    return;
  }
  pixelMatrix = fillPixelMatrix();

  cacheMatrix();
  appendUndo();
}

let cnv;

async function importImage() {
  const imgUrl = window.prompt('Enter image URL');
  const img = document.createElement('img');
  img.crossOrigin = "Anonymous";

  await fetch(`https://api.allorigins.win/get?url=${imgUrl}`).then(r => r.json()).then(d => img.src = d.contents);

  img.onload = function () {
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    let ctx = canvas.getContext(
      "2d"
    );
    ctx.drawImage(img, 0, 0);

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    data = imgData.data;
    for (let i = 0; i < dimensions.height; i++) {
      for (let j = 0; j < dimensions.height; j++) {
        let cols = canvas.width;
        let offsetX = Math.floor(i * canvas.height / dimensions.height);
        let offsetY = Math.floor(j * canvas.width / dimensions.height);
        // call the method to get the r, g, b, a values for current pixel
        let c = extractPixelColor(cols, offsetY, offsetX);
        // build a colour string for 
        let colour = `rgb(${c.red}, ${c.green}, ${c.blue})`;
        let hexCode = `#${[c.red, c.green, c.blue]
          .map((x) => x.toString(16).padStart(2, "0"))
          .join("")}`;
        pixelMatrix[j][i] = { bgColor: colors.indexOf(nearestColor(hexCode)) };
      }
    }
  };
  appendUndo();
}

// cols: Width of the image representing total number of columns
// x: Row position of this pixel
// y: Column position of this pixel
const extractPixelColor = (cols, x, y) => {
  // To get the exact pixel, the logic is to multiply total columns in this image with the row position of this pixel and then add the column position of this pixel
  let pixel = cols * x + y;
  // To get the array position in the entire image data array, simply multiply your pixel position by 4 (since each pixel will have its own r, g, b, a in that order)
  let position = pixel * 4;
  // the rgba value of current pixel will be the following
  return {
    red: data[position],
    green: data[position + 1],
    blue: data[position + 2],
    alpha: data[position + 3],
  };
};

const hexToRgb = hex => hex.slice(1).replace(/^(.)(.)(.)$/gi, "$1$1$2$2$3$3").match(/.{2}/g).map(c => parseInt(c, 16));
const distance = (a, b) => Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2) + Math.pow(a[2] - b[2], 2));
const nearestColor = colorHex =>
  colors.reduce((a, v, i, arr) =>
    a = distance(hexToRgb(colorHex), hexToRgb(v)) < a[0] ? [distance(hexToRgb(colorHex), hexToRgb(v)), v] : a, [Number.POSITIVE_INFINITY, colors[0]])[1];

function getCellPosition(x, y) {
  return {
    x: parseInt(x / cellSize.width),
    y: parseInt(y / cellSize.height),
  };
}

function setCurrentBgElement() {
  currentBgColorElement.style.backgroundColor = colors[currentColor.id];
}

function cacheMatrix() {
  window.localStorage.setItem('cache', JSON.stringify(pixelMatrix));
}

function saveAsImage() {
  takingPhoto = true;
  
  setTimeout(() => {
    const downloader = document.querySelector('#downloader');
    downloader.href = document.querySelector('canvas.p5Canvas').toDataURL();
    downloader.download = `${randomName()}-art.png`;
    downloader.click();

    setTimeout(() => {
      takingPhoto = false;
    }, 1000)
  }, 500);
}

function flipHorizontally() {
  pixelMatrix = pixelMatrix.map(k => k.reverse());
  appendUndo();
}

function flipVertically() {
  pixelMatrix = pixelMatrix.reverse();
  appendUndo();
}

function rotateRight() {
  const transposedMatrix = pixelMatrix[0].map((_, i) => pixelMatrix.map(row => row[i]));
  const rotatedMatrix = transposedMatrix.map(row => row.reverse());

  pixelMatrix = rotatedMatrix;
}

function undo() {
  if (undoStack.length > 0) {
    redoStack.push(JSON.stringify(pixelMatrix));
    pixelMatrix = JSON.parse(undoStack.pop());
  }
  checkUndoRedoButtons();
}

function redo() {
  if (redoStack.length > 0) {
    undoStack.push(JSON.stringify(pixelMatrix));
    pixelMatrix = JSON.parse(redoStack.pop());
  }
  checkUndoRedoButtons();
}

function checkUndoRedoButtons() {
  if (undoStack.length > 0) {
    undoButton.classList.remove('disabled');
  }
  else {
    undoButton.classList.add('disabled');
  }

  if (redoStack.length > 0) {
    redoButton.classList.remove('disabled');
  }
  else {
    redoButton.classList.add('disabled');
  }
}

function appendUndo() {
  undoStack.push(JSON.stringify(pixelMatrix));
  clearRedo();

  if (undoStack.length > undoLimit) {
    undoStack.shift();
  }
  checkUndoRedoButtons();
}

function clearRedo() {
  redoStack.length = 0;
}

window.addEventListener('keydown', function(e) {
  if (e.ctrlKey && e.code === 'KeyZ') {
    undo();
  }
  else if (e.ctrlKey && e.code === 'KeyY') {
    redo();
  }
});

const sketch = function (p5) {
  const getPositions = () => getCellPosition(
    p5.mouseX - offset.width,
    p5.mouseY - offset.height
  );

  const isOnCanvas = () => p5.mouseX < p5.width && p5.mouseX > 0 && p5.mouseY < p5.height && p5.mouseY > 0;

  p5.setup = function () {
    cnv = p5.createCanvas(512, 512);
    p5.background(25);

    pixelMatrix = fillPixelMatrix();

    if (window.localStorage.getItem('cache') !== null) {
      pixelMatrix = JSON.parse(window.localStorage.getItem('cache'));
    }

    document.body.classList.add('render');
  };

  p5.draw = function () {
    for (let i = 0; i < dimensions.height; i++) {
      for (let j = 0; j < dimensions.width; j++) {
        if (takingPhoto) {
          p5.noStroke();
        }
        else {
          p5.stroke(100);
        }

        if (pixelMatrix[i][j].bgColor !== 0) {
          p5.fill(p5.color(colors[pixelMatrix[i][j].bgColor]));
          p5.rect(
            j * cellSize.width + offset.width,
            i * cellSize.height + offset.width,
            cellSize.width,
            cellSize.height
          );
        }
        else if (takingPhoto) {
          p5.noStroke();
          p5.drawingContext.clearRect(
            j * cellSize.width + offset.width,
            i * cellSize.height + offset.width,
            cellSize.width,
            cellSize.height
          );
        }
        else {
          // Empty cell
          p5.fill(160);
          p5.stroke(120);
          p5.rect(
            j * cellSize.width + offset.width,
            i * cellSize.height + offset.width,
            cellSize.width,
            cellSize.height
          );
          p5.noStroke();
          p5.fill(210);
          p5.rect(
            j * cellSize.width + offset.width + 1,
            i * cellSize.height + offset.width + 1,
            cellSize.width / 2 - 1,
            cellSize.height / 2 - 1
          );
          p5.rect(
            j * cellSize.width + offset.width + cellSize.width / 2 + 1,
            i * cellSize.height + offset.width + cellSize.height / 2 + 1,
            cellSize.width / 2 - 1,
            cellSize.height / 2 - 1
          );
        }
      }
    }

    const positions = getPositions();

    if (
      positions.y >= 0 &&
      positions.y < dimensions.height &&
      positions.x >= 0 &&
      positions.x < dimensions.width
    ) {
      p5.cursor(p5.HAND);

      if (p5.mouseIsPressed) {
        if (p5.mouseButton === p5.LEFT) {
          switch (currentTool) {
            case tools.PENCIL:
              pixelMatrix[positions.y][positions.x].bgColor = currentColor.id;
              break;
            case tools.ERASER:
              pixelMatrix[positions.y][positions.x].bgColor = 0;
              break;
            case tools.COLOR_PICKER:
              setCurrentColor(pixelMatrix[positions.y][positions.x].bgColor);

              toolsElements[tools.PENCIL].click();
              break;
          }
        }
        else {
          pixelMatrix[positions.y][positions.x].bgColor = 0;
        }
      }
    } else {
      p5.cursor(p5.ARROW);
    }

    if (p5.frameCount % 300 === 0) {
      cacheMatrix();
    }
  };

  p5.keyPressed = function () {
    if (p5.keyCode === p5.ALT) {
      lastTool = currentTool;
      toolsElements[tools.COLOR_PICKER].click();
    }
  };

  p5.keyReleased = function () {
    if (p5.keyCode === p5.ALT) {
      toolsElements[tools.PENCIL].click();
    }
  };

  p5.mouseClicked = function () {
    const positions = getPositions();

    if (p5.mouseButton === p5.LEFT && currentTool === tools.BUCKET) {
      const floodFill = (x, y, targetColor, newColor) => {
        if (parseInt(targetColor) === parseInt(newColor)) return;
        else if (pixelMatrix[y] === undefined) return;
        else if (pixelMatrix[y][x] === undefined) return;
        else if (parseInt(pixelMatrix[y][x].bgColor) !== parseInt(targetColor)) return;
        else {
          pixelMatrix[y][x].bgColor = newColor;

          floodFill(x, y - 1, targetColor, newColor);
          floodFill(x, y + 1, targetColor, newColor);
          floodFill(x - 1, y, targetColor, newColor);
          floodFill(x + 1, y, targetColor, newColor);
          return;
        }
      };

      if (pixelMatrix[positions.y] === undefined) return;
      else if (pixelMatrix[positions.y][positions.x] === undefined) return;

      floodFill(positions.x, positions.y, pixelMatrix[positions.y][positions.x].bgColor, currentColor.id);
    }
  };

  p5.mousePressed = function() {
    if (isOnCanvas()) {
      appendUndo();
    }
  };

  p5.mouseReleased = function() {
    checkUndoRedoButtons();
  };
}

new p5(sketch);