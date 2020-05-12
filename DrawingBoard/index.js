// Declare all variables 
let container,
    canvas,
    context,
    canvasWidth,
    canvasHeight,
    drawingAreaWidth,
    drawingAreaHeight,
    padding = {};

let pointX = [],
    pointY = [],
    pointSizes = [],
    pointColors = [],
    isPointDrag = [],
    isPaint = false;

let penSize


function clearCanvas() {
  context.clearRect(0, 0, canvasWidth, canvasHeight);
}

function prepareDrawingArea() {  
  context.beginPath();
  context.strokeStyle = '#ff0000';
  context.lineWidth = 1;
  context.rect(canvasWidth*.1, canvasHeight*.1, canvasWidth*.8, canvasHeight*.8);
  context.stroke();
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
    context.strokeStyle = 'blue';
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.lineWidth = 10;
    context.stroke();    
  }
  context.closePath();
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