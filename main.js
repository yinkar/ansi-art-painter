const colors = [
    "#000000",
    "#800000",
    "#008000",
    "#808000",
    "#000080",
    "#800080",
    "#008080",
    "#c0c0c0",
    "#808080",
    "#ff0000",
    "#00ff00",
    "#ffff00",
    "#0000ff",
    "#ff00ff",
    "#00ffff",
    "#ffffff",
    "#000000",
    "#00005f",
    "#000087",
    "#0000af",
    "#0000d7",
    "#0000ff",
    "#005f00",
    "#005f5f",
    "#005f87",
    "#005faf",
    "#005fd7",
    "#005fff",
    "#008700",
    "#00875f",
    "#008787",
    "#0087af",
    "#0087d7",
    "#0087ff",
    "#00af00",
    "#00af5f",
    "#00af87",
    "#00afaf",
    "#00afd7",
    "#00afff",
    "#00d700",
    "#00d75f",
    "#00d787",
    "#00d7af",
    "#00d7d7",
    "#00d7ff",
    "#00ff00",
    "#00ff5f",
    "#00ff87",
    "#00ffaf",
    "#00ffd7",
    "#00ffff",
    "#5f0000",
    "#5f005f",
    "#5f0087",
    "#5f00af",
    "#5f00d7",
    "#5f00ff",
    "#5f5f00",
    "#5f5f5f",
    "#5f5f87",
    "#5f5faf",
    "#5f5fd7",
    "#5f5fff",
    "#5f8700",
    "#5f875f",
    "#5f8787",
    "#5f87af",
    "#5f87d7",
    "#5f87ff",
    "#5faf00",
    "#5faf5f",
    "#5faf87",
    "#5fafaf",
    "#5fafd7",
    "#5fafff",
    "#5fd700",
    "#5fd75f",
    "#5fd787",
    "#5fd7af",
    "#5fd7d7",
    "#5fd7ff",
    "#5fff00",
    "#5fff5f",
    "#5fff87",
    "#5fffaf",
    "#5fffd7",
    "#5fffff",
    "#870000",
    "#87005f",
    "#870087",
    "#8700af",
    "#8700d7",
    "#8700ff",
    "#875f00",
    "#875f5f",
    "#875f87",
    "#875faf",
    "#875fd7",
    "#875fff",
    "#878700",
    "#87875f",
    "#878787",
    "#8787af",
    "#8787d7",
    "#8787ff",
    "#87af00",
    "#87af5f",
    "#87af87",
    "#87afaf",
    "#87afd7",
    "#87afff",
    "#87d700",
    "#87d75f",
    "#87d787",
    "#87d7af",
    "#87d7d7",
    "#87d7ff",
    "#87ff00",
    "#87ff5f",
    "#87ff87",
    "#87ffaf",
    "#87ffd7",
    "#87ffff",
    "#af0000",
    "#af005f",
    "#af0087",
    "#af00af",
    "#af00d7",
    "#af00ff",
    "#af5f00",
    "#af5f5f",
    "#af5f87",
    "#af5faf",
    "#af5fd7",
    "#af5fff",
    "#af8700",
    "#af875f",
    "#af8787",
    "#af87af",
    "#af87d7",
    "#af87ff",
    "#afaf00",
    "#afaf5f",
    "#afaf87",
    "#afafaf",
    "#afafd7",
    "#afafff",
    "#afd700",
    "#afd75f",
    "#afd787",
    "#afd7af",
    "#afd7d7",
    "#afd7ff",
    "#afff00",
    "#afff5f",
    "#afff87",
    "#afffaf",
    "#afffd7",
    "#afffff",
    "#d70000",
    "#d7005f",
    "#d70087",
    "#d700af",
    "#d700d7",
    "#d700ff",
    "#d75f00",
    "#d75f5f",
    "#d75f87",
    "#d75faf",
    "#d75fd7",
    "#d75fff",
    "#d78700",
    "#d7875f",
    "#d78787",
    "#d787af",
    "#d787d7",
    "#d787ff",
    "#d7af00",
    "#d7af5f",
    "#d7af87",
    "#d7afaf",
    "#d7afd7",
    "#d7afff",
    "#d7d700",
    "#d7d75f",
    "#d7d787",
    "#d7d7af",
    "#d7d7d7",
    "#d7d7ff",
    "#d7ff00",
    "#d7ff5f",
    "#d7ff87",
    "#d7ffaf",
    "#d7ffd7",
    "#d7ffff",
    "#ff0000",
    "#ff005f",
    "#ff0087",
    "#ff00af",
    "#ff00d7",
    "#ff00ff",
    "#ff5f00",
    "#ff5f5f",
    "#ff5f87",
    "#ff5faf",
    "#ff5fd7",
    "#ff5fff",
    "#ff8700",
    "#ff875f",
    "#ff8787",
    "#ff87af",
    "#ff87d7",
    "#ff87ff",
    "#ffaf00",
    "#ffaf5f",
    "#ffaf87",
    "#ffafaf",
    "#ffafd7",
    "#ffafff",
    "#ffd700",
    "#ffd75f",
    "#ffd787",
    "#ffd7af",
    "#ffd7d7",
    "#ffd7ff",
    "#ffff00",
    "#ffff5f",
    "#ffff87",
    "#ffffaf",
    "#ffffd7",
    "#ffffff",
    "#080808",
    "#121212",
    "#1c1c1c",
    "#262626",
    "#303030",
    "#3a3a3a",
    "#444444",
    "#4e4e4e",
    "#585858",
    "#606060",
    "#666666",
    "#767676",
    "#808080",
    "#8a8a8a",
    "#949494",
    "#9e9e9e",
    "#a8a8a8",
    "#b2b2b2",
    "#bcbcbc",
    "#c6c6c6",
    "#d0d0d0",
    "#dadada",
    "#e4e4e4",
    "#eeeeee",
];

const colorTypes = {
    BG: 48,
    FG: 38,
};

const currentColorType = colorTypes.BG;

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

const currentBgColorElement = document.querySelector(".current-bg-color");

for (let i = 0, l = colors.length; i < l; i++) {
    const cpCell = document.createElement("div");
    cpCell.classList.add("cp-cell");
    cpCell.style.backgroundColor = colors[i];
    cpCell.dataset.id = i;
    cpCell.addEventListener("click", colorCellEvent);

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

function changeTool() {
    toolsElements.forEach(e => {
        e.classList.remove('selected');
    });

    this.classList.add('selected');

    currentTool = tools[this.dataset.tool];
}

let cnv;

function setup() {
    cnv = createCanvas(512, 512);
    background(25);
    
    pixelMatrix = fillPixelMatrix();

    document.oncontextmenu = function() {
        if (
            mouseX  < width && mouseY < height &&
            mouseX > cnv.position().x - width / 2 && mouseY > cnv.position().y
        ) {
            return false;
        }
    }

    document.body.classList.add('render');
}

function importImage() {
    let imgurl = window.prompt('Enter image URL');
    img = document.createElement('img');
    img.crossOrigin = "Anonymous";

    img.src = imgurl;
    img.onload = function () {
        canvas = document.createElement("canvas");
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
                //call the method to get the r,g,b,a values for current pixel
                let c = extractPixelColor(cols, offsetY, offsetX);
                //build a colour string for 
                let colour = `rgb(${c.red}, ${c.green}, ${c.blue})` ;
                let hexCode = `#${[c.red, c.green, c.blue]
                    .map((x) => x.toString(16).padStart(2, "0"))
                    .join("")}`;
                pixelMatrix[j][i] = {bgColor:colors.indexOf(nearestColor(hexCode))};
            }    
        }
        
          
    };
}

//cols: Width of the image representing total number of columns
//x: Row position of this pixel
//y: Column position of this pixel
const extractPixelColor = (cols, x, y) => {
    //To get the exact pixel, the logic is to multiply total columns in this image with the row position of this pixel and then add the column position of this pixed
    let pixel = cols * x + y;
    //To get the array position in the entire image data array, simply multiply your pixel position by 4 (since each pixel will have its own r,g,b,a in that order)
    let position = pixel * 4;
    //the rgba value of current pixel will be the following
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


function draw() {
    for (let i = 0; i < dimensions.height; i++) {
        for (let j = 0; j < dimensions.width; j++) {
            stroke(100);
            if (pixelMatrix[i][j].bgColor !== 0) {
                fill(color(colors[pixelMatrix[i][j].bgColor]));
                rect(
                    j * cellSize.width + offset.width,
                    i * cellSize.height + offset.width,
                    cellSize.width,
                    cellSize.height
                );
            }
            else {
                fill(50);
                stroke(100);
                rect(
                    j * cellSize.width + offset.width,
                    i * cellSize.height + offset.width,
                    cellSize.width,
                    cellSize.height
                );
                noStroke();
                fill(75);
                rect(
                    j * cellSize.width + offset.width + 1,
                    i * cellSize.height + offset.width + 1,
                    cellSize.width / 2 - 1,
                    cellSize.height / 2 - 1
                );
                rect(
                    j * cellSize.width + offset.width + cellSize.width / 2 + 1,
                    i * cellSize.height + offset.width + cellSize.height / 2 + 1,
                    cellSize.width / 2 - 1,
                    cellSize.height / 2 - 1
                );
            }
        }
    }

    let positions = getCellPosition(
        mouseX - offset.width,
        mouseY - offset.height
    );

    if (
        positions.y >= 0 &&
        positions.y < dimensions.height &&
        positions.x >= 0 &&
        positions.x < dimensions.width
    ) {
        cursor(HAND);

        if (mouseIsPressed) {
            if (mouseButton === LEFT) {
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
        cursor(ARROW);
    }
}

function getCellPosition(x, y) {
    return {
        x: parseInt(x / cellSize.width),
        y: parseInt(y / cellSize.height),
    };
}

function setCurrentBgElement() {
    currentBgColorElement.style.backgroundColor = colors[currentColor.id];
}

function keyPressed() {
    if (keyCode === CONTROL) {
        toolsElements[2].click();
    }
}

function keyReleased() {
    if (keyCode === CONTROL) {
        toolsElements[0].click();
    }
}
