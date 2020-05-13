// Declare all variables 
let container,
    canvas,
    context,
    canvasWidth,
    canvasHeight,
    padding = {},
    drawingAreaX,
    drawingAreaY,
    drawingAreaWidth,
    drawingAreaHeight,
    colorPalleteX,
    colorPalleteY,
    colorPalleteWidth,
    colorPalleteHeight,
    sizeSelectorX,
    sizeSelectorY,
    sizeSelectorWidth,
    sizeSelectorHeight,
    eraserPickerX,
    eraserPickerY,
    eraserPickerWidth,
    eraserPickerHeight,
    markerToolX,
    markerToolY,
    markerToolWidth,
    markerToolHeight,
    toolsStrokeStyle = 'grey',
    pointSize = 'normal',
    pointColor = 'black',
    pointTool = 'marker';

let pointX = [],
    pointY = [],
    pointSizes = [],
    pointColors = [],
    isPointDrag = [],
    isPaint = false;

const penSize = {small: 2, normal: 5, medium: 8, big: 10, large: 12},
      colors = {red:'#ff4040', orange:'#407294', yellow:'#ffd700', 
                green:'#37c8ae', blue:'#b72d5b', indigo:'#4837bc', 
                violet:'#777777', purple:'#c2cc3b', grey:'#ff00ff', 
                skyblue:'#ff7373', wine:'#133337'};

// To reset the canvas
function clearCanvas() {
  context.clearRect(0, 0, canvasWidth, canvasHeight);
}

// Design the tools for the drawing
function drawingTools(){
  // Color Pallete
  /** Begin by draing a  rectangle
   * then draw 12 circles inside with different color  
   */
  // Shapes
  let drawArc = (midX, midY, r, color, context, isFill) => {
    context.beginPath();
    if(isFill){      
      context.fillStyle = color;
      context.arc(midX, midY, r, 0, 1.75*Math.PI);
      context.fill();
    }else{      
      context.strokeStyle = color;
      context.arc(midX, midY, r, 0, 1.75*Math.PI);
      context.stroke();
    }
    context.closePath();
  }

  // Tools
  let drawColorPallete = () => {
    colorPalleteX = drawingAreaX + drawingAreaWidth/4;
    colorPalleteY = drawingAreaY + drawingAreaHeight;
    colorPalleteWidth = drawingAreaWidth/2;
    colorPalleteHeight = canvasHeight - colorPalleteY;
    context.beginPath();
    context.lineWidth = 1;
    context.rect(colorPalleteX, colorPalleteY, colorPalleteWidth, colorPalleteHeight);
    context.stroke();

    // Draw the circles to indicate the colors 
    let colorGradient = (x0, y0, r0, color) => { 
      let fillGrad = context.createRadialGradient(x0, y0, r0, x0+5, y0-15, r0+5);
      fillGrad.addColorStop(0, color);
      fillGrad.addColorStop(1, 'white');

      return fillGrad;
    };
    /* Bug here: needs fixing */
    let arcX = colorPalleteX, // - (index * colorPalleteWidth/11),
        arcY = colorPalleteY + colorPalleteHeight/2,
        arcRadius = colorPalleteHeight/6;
    for(let key of Object.keys(colors)){  
      arcX += colorPalleteWidth/11;
      grad = colorGradient(arcX, arcY, arcRadius, colors[key]);
      drawArc(arcX, arcY, arcRadius, grad, context, true);
    }

  },

  // Size Selector
  drawSizeSelector = () => {
    sizeSelectorX = drawingAreaX + drawingAreaWidth;
    sizeSelectorY = drawingAreaY + drawingAreaHeight * 2/3;
    sizeSelectorWidth = (canvasWidth - sizeSelectorX) * .55;
    sizeSelectorHeight = drawingAreaHeight/3;

    context.beginPath();
    context.rect(sizeSelectorX, sizeSelectorY, sizeSelectorWidth, sizeSelectorHeight*.90);
    context.lineWidth = 2;
    context.strokeStyle = toolsStrokeStyle;
    context.stroke();
    // context.closePath();
    let arcX = sizeSelectorX + sizeSelectorWidth/2,
        arcY = sizeSelectorY;
    for (let key of Object.keys(penSize)) {
      // console.log(key);
      // arcY += sizeSelectorHeight*(.1*count/2);
      arcY += sizeSelectorHeight*(penSize[key]/37);
      if(!(key === 'large'))
        drawArc(arcX, arcY, penSize[key], 'grey', context, false);
    }
  },
  // Eraser
  drawEraserPicker = () => {
    eraserPickerX = drawingAreaX + drawingAreaWidth;
    eraserPickerY = drawingAreaY + drawingAreaHeight * 1/3;
    eraserPickerWidth = (canvasWidth - eraserPickerX) * .60;
    eraserPickerHeight = drawingAreaHeight/3;

    // console.log(canvasWidth +"---"+ eraserPickerX);

    context.beginPath();
    context.moveTo(eraserPickerX, eraserPickerY+padding.top);
    context.lineTo(eraserPickerX + eraserPickerWidth*.6, eraserPickerY + padding.top);
    context.lineTo(eraserPickerX + eraserPickerWidth*.9, eraserPickerY + eraserPickerHeight*.45);
    context.lineTo(eraserPickerX + eraserPickerWidth*.9, eraserPickerY + eraserPickerHeight*.7);
    context.lineTo(eraserPickerX, eraserPickerY + eraserPickerHeight*.7);
    context.lineTo(eraserPickerX, eraserPickerY + eraserPickerHeight*.45);
    context.lineTo(eraserPickerX + eraserPickerWidth*.9, eraserPickerY + eraserPickerHeight*.45);
    // context.closePath();
    context.strokeStyle = toolsStrokeStyle;
    context.lineWidth = 2;
    context.stroke();
  },

  drawMarkerTool = () => {
    markerToolX = drawingAreaX + drawingAreaWidth;
    markerToolY = drawingAreaY;
    markerToolWidth = (canvasWidth - markerToolX) * .55;
    markerToolHeight = drawingAreaHeight/3;
    // context.beginPath();
    context.strokeStyle = toolsStrokeStyle;
    context.strokeRect(markerToolX*1.01, markerToolY + markerToolHeight*.5, markerToolWidth *.7, markerToolHeight * .5)
    context.beginPath();
    context.moveTo(markerToolX*1.01, markerToolY + markerToolHeight*.5);
    context.lineTo(markerToolX*1.01, markerToolY + markerToolHeight*.3);
    context.lineTo(markerToolX*1.01 + markerToolWidth*.3, markerToolY + markerToolHeight*.1);
    context.lineTo(markerToolX*1.01 + markerToolWidth*.4, markerToolY + markerToolHeight*.1);
    context.lineTo(markerToolX*1.01 + markerToolWidth*.7, markerToolY + markerToolHeight*.3);
    context.lineTo(markerToolX*1.01 + markerToolWidth*.7, markerToolY + markerToolHeight*.5);
    context.closePath()
    context.fillStyle = toolsStrokeStyle;
    context.fill()
  }

  drawColorPallete();
  drawSizeSelector();
  drawEraserPicker();
  drawMarkerTool();
}
// Create the only area drawing is allowed 
function prepareDrawingArea() {  
  // Layout co-ordinates
  drawingAreaX = canvasWidth*.1;
  drawingAreaY = canvasHeight*.1;
  drawingAreaWidth = canvasWidth*.75;
  drawingAreaHeight = canvasHeight*.8;
  drawingTools();
  // Print the DrawArea
  context.save();
  context.beginPath();
  context.strokeStyle = '#ffffff';
  context.shadowOffsetX = 2;
  context.shadowOffsetY = -1;
  context.shadowBlur = 5;
  context.shadowColor = 'grey';
  context.lineWidth = 1;
  context.fillStyle = '#ffffff'
  context.rect(drawingAreaX, drawingAreaY, drawingAreaWidth, drawingAreaHeight);  
  context.stroke();
  context.fill();
  context.clip();
}

// Draw on the canvas
function draw() {
  clearCanvas();

  // Create the drawing area
  prepareDrawingArea()

  context.beginPath();
  for (let i = 0; i < pointX.length; i++) {
    if(isPointDrag[i]){      
      context.moveTo(pointX[i-1], pointY[i-1]);
    }else{      
      context.moveTo(pointX[i] -1, pointY[i]);
    }
    context.lineTo(pointX[i], pointY[i]);
    context.strokeStyle = pointColors[i];
    context.shadowColor = 'white';
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.lineWidth = pointSizes;
    context.stroke();    
  }
  context.closePath();

  context.restore();
}

// Update graphics base on screensize
function update(){
  // Collect the new client width set new value for the point
  for(let i = 0; i < pointX.length; i++){    
    pointX[i] = pointX[i]*container.clientWidth/canvasWidth;
    pointY[i] = pointY[i]*(container.clientWidth*.7)/canvasHeight;
  }
  padding.left = padding.right = padding.left*container.clientWidth/canvasWidth;
  canvasWidth = container.clientWidth;
  canvasHeight = canvasWidth*.7;

  canvas.width = canvasWidth - padding.left - padding.right;
  canvas.height = canvasHeight;
  // Points updated now redraw
  draw();
}

// Record the points for later use
function addPoint(x, y, isDrag) {
  pointX.push(x);
  pointY.push(y);
  pointColors.push(pointColor);
  pointSizes.push(pointSize)
  isPointDrag.push(isDrag);  
}

// Drawing Board events
function  drawingBoardEvents() {
  // Create events
  let press = (e)=>{
    // Get the coordinates and store to points array
    // Store up the coordinates to point
    // Call the draw function and pass the points
    let mouseX = e.pageX - container.offsetLeft - 15,
        mouseY = e.pageY - container.offsetTop;

    /** There is a need to handle when the user press either sides of the
     * drawing area where we shall be positioning the drawing tools.
     * This will best be handled by the onMousePress event
     */
    //=======================================================================
    let calcPensizeMidpoint = (size) => {
      return (sizeSelectorHeight * size/37)+size;
    };
    if (mouseX < drawingAreaX) { // Left side of the drawing area
      console.log('do some magik on the left');
    } else if (mouseX > drawingAreaX + drawingAreaWidth) { // Right side of the drawing area

      if(mouseY > markerToolY && mouseY < markerToolY+markerToolHeight){
        pointTool = 'marker';
        console.log('Marker selected');
      } else if(mouseY > eraserPickerY && mouseY < eraserPickerY + eraserPickerHeight){
        pointTool = 'eraser';
        console.log('Eraser selected')
      } else if(mouseY > sizeSelectorY){
        if (mouseY < sizeSelectorY + calcPensizeMidpoint(penSize.small)) {
          pointSize = 'small';
        } else if(mouseY < sizeSelectorY + calcPensizeMidpoint(penSize.small+penSize.normal)){
          pointSize = 'normal';
        } else if (mouseY < sizeSelectorY + calcPensizeMidpoint(penSize.small + penSize.normal + penSize.medium)){
          pointSize = 'medium';
        } else if (mouseY < sizeSelectorY + calcPensizeMidpoint(penSize.small + penSize.normal + penSize.medium + penSize.big)) {
          pointSize = 'big';
        } else {
          console.log('Pensize '+ penSize.large + ' out of range');
        }
      }

    } else if (mouseY > drawingAreaY + drawingAreaHeight) { // Bottom side of the drawing area
      if(mouseX > colorPalleteX){
        let colorWidth = colorPalleteWidth/11;
        if (mouseX < colorPalleteX + colorWidth) {
          pointColor = colors.red;
          console.log('first color');
        } else if (mouseX < colorPalleteX + colorWidth*2) {
          pointColor = colors.orange;
          console.log('second color')
        } else if (mouseX < colorPalleteX + colorWidth*3) {
          pointColor = colors.yellow;
          console.log('third color')
        } else if (mouseX < colorPalleteX + colorWidth*4) {
          pointColor = colors.green;
          console.log('fourth color')
        } else if (mouseX < colorPalleteX + colorWidth*5) {
          pointColor = colors.blue;
          console.log('fifth color')
        } else if (mouseX < colorPalleteX + colorWidth*6) {
          pointColor = colors.indigo;
          console.log('sixth color')
        } else if (mouseX < colorPalleteX + colorWidth*7) {
          pointColor = colors.violet;
          console.log('seventh color')
        } else if (mouseX < colorPalleteX + colorWidth*8) {
          pointColor = colors.purple;
          console.log('eighth color')
        } else if (mouseX < colorPalleteX + colorWidth*9) {
          pointColor = colors.grey;
          console.log('nineth color')
        } else if (mouseX < colorPalleteX + colorWidth*10) {
          pointColor = colors.wine;
          console.log('tenth color')
        } else if (mouseX < colorPalleteX + colorWidth*11) {
          pointColor = colors.skyblue;
          console.log('eleventh color')
        }
      }
    }

    //=======================================================================
    isPaint = true;
    addPoint(mouseX, mouseY, false);
    draw();
  }, 
  drag = (e)=>{
    let mouseX = e.pageX - container.offsetLeft -15,
        mouseY = e.pageY - container.offsetTop;
    if(isPaint){
      addPoint(mouseX, mouseY, true);
      draw();
    }
    e.preventDefault();
  }, 
  release = (e)=>{
    isPaint = false;
    draw();
  }, 
  cancel = (e)=>{
    isPaint = false;
  };

  // Register the events
  canvas.addEventListener('mousedown', press, false);
  canvas.addEventListener('mousemove', drag, false);
  canvas.addEventListener('mouseup', release, false);
  canvas.addEventListener('mouseout', cancel, false);
}
// Prepare the drawing board
function initialize() {
  // container
  container = document.getElementById('container');
  padding = {top: 15, bottom: 15, left: 15, right: 15};
  // Canvas
  canvas = document.querySelector('canvas');
  canvasWidth = container.clientWidth;
  canvasHeight = canvasWidth * 0.7;
  canvas.width = canvasWidth - padding.left - padding.right;
  canvas.height = canvasHeight;
  // context
  context = canvas.getContext('2d');  
  prepareDrawingArea();
  // Fire Mouse and Drag events
  drawingBoardEvents();

}

window.addEventListener('resize', update);
initialize();