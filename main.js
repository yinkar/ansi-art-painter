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

const tools = {
  PENCIL: 0,
  ERASER: 1,
  COLOR_PICKER: 2
};

let currentTool = tools.PENCIL;

const colorPalette = document.querySelector(".color-palette");

const colorPaletteMagnifier = document.querySelector("#color-palette-magnifier");

const currentBgColorElement = document.querySelector(".current-bg-color");

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
  setCurrentColor(this.dataset.id);
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
  stringToFile(exportANSI(), 'ans', `art-${(+new Date()) % 1000}${Math.floor(Math.random() * 100)}.ans`);
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
const exportButton = document.querySelector("#export-button");
const importButton = document.querySelector("#import-button");
const saveButton = document.querySelector("#save-button");

clearButton.addEventListener("click", function() {
  if (!confirm('Are you sure?')) {
      return;
  }
  pixelMatrix = fillPixelMatrix();
});
exportButton.addEventListener("click", exportANSI);
importButton.addEventListener("click", importImage);
saveButton.addEventListener("click", saveANSI);

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

function changeTool() {
  toolsElements.forEach(e => {
      e.classList.remove('selected');
  });

  this.classList.add('selected');

  currentTool = tools[this.dataset.tool];
}

let cnv;

function importImage() {
  const imgurl = window.prompt('Enter image URL');
  const img = document.createElement('img');
  img.crossOrigin = "Anonymous";

  img.src = `https://corsproxy.io/?${imgurl}`;
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
      for (let i=0; i<dimensions.height; i++) {
          for (let j=0; j<dimensions.height; j++) {
              let cols = canvas.width;
              let offsetX = Math.floor(i*canvas.height/dimensions.height);
              let offsetY = Math.floor(j*canvas.width/dimensions.height);
              // call the method to get the r, g, b, a values for current pixel
              let c = extractPixelColor(cols, offsetY, offsetX);
              // build a colour string for 
              let colour = `rgb(${c.red}, ${c.green}, ${c.blue})` ;
              let hexCode = `#${[c.red, c.green, c.blue]
                  .map((x) => x.toString(16).padStart(2, "0"))
                  .join("")}`;
              pixelMatrix[j][i] = {bgColor:colors.indexOf(nearestColor(hexCode))};
          }    
      }
      
        
  };
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
colors.reduce((a,v,i,arr) =>
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

const sketch = function(p5) {
  p5.setup = function() {
    cnv = p5.createCanvas(512, 512);
    p5.background(25);
    
    pixelMatrix = fillPixelMatrix();
    
    document.body.classList.add('render');
  }
  
  p5.draw = function() {
    for (let i = 0; i < dimensions.height; i++) {
        for (let j = 0; j < dimensions.width; j++) {
            p5.stroke(100);
            if (pixelMatrix[i][j].bgColor !== 0) {
                p5.fill(p5.color(colors[pixelMatrix[i][j].bgColor]));
                  p5.rect(
                    j * cellSize.width + offset.width,
                    i * cellSize.height + offset.width,
                    cellSize.width,
                    cellSize.height
                );
            }
            else {
                p5.fill(110);
                p5.stroke(80);
                p5.rect(
                    j * cellSize.width + offset.width,
                    i * cellSize.height + offset.width,
                    cellSize.width,
                    cellSize.height
                );
                p5.noStroke();
                p5.fill(150);
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
  
    let positions = getCellPosition(
        p5.mouseX - offset.width,
        p5.mouseY - offset.height
    );
  
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
                        
                        toolsElements[0].click();
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
  }
  
  p5.keyPressed = function() {
    if (p5.keyCode === p5.CONTROL) {
        toolsElements[2].click();
    }
  }
  
  p5.keyReleased = function() {
    if (p5.keyCode === p5.CONTROL) {
        toolsElements[0].click();
    }
  }
}

new p5(sketch);