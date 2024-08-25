"use strict";

// Constants
const BOARD_ELEMENT = document.querySelector('.board');
const BOARD_CANVAS = document.getElementById('board-canvas');
const CANVAS_MASK = document.getElementById('canvas-mask');
const MOUSE_CANVAS = document.getElementById('mouse-canvas');
const OBJECTS_BOX = document.getElementById('objects-box');
const PIECES_BOX = document.getElementById('pieces-box');
const squareSize = 58;
const PIECES = {
  PAWN: 'pawn',
  ROOK: 'rook',
  KNIGHT: 'knight',
  BISHOP: 'bishop',
  QUEEN: 'queen',
  KING: 'king'
}
const OBJECTS = {
  KEY: 'key',
  BUTTON: 'button'
}
const STATUS = {
  IDLE: 'idle',
  MOVING: 'moving'
}
const DEFAULT_BOARD = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1],
  [1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1],
  [1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
]

// Control Objects
// (it may seem more efficient to create these two objects with a class, but I did it this way to make the code easier to understand)
const inBoardPieces = {
  list: [],
  add: function (type, position) {
    const newPiece = new Piece(type, position);
    this.list.push(newPiece);
  } 
}
const inBoardObjects = {
  list: [],
  add: function (type, position) {
    const newObject = new BoardObject(type, position);
    this.list.push(newObject);
  }
}

// Control Variables
let actualStatus = STATUS.IDLE;
let finishPosition = { x: 0, y: 0 }

// GENERAL FUNCTIONS
// Create the board
function drawBoard() {
  // Set the board dimensions
  const boardWidth = board[0].length * squareSize;
  const boardHeight = board.length * squareSize;
  BOARD_ELEMENT.style.width = `${boardWidth}px`;
  BOARD_ELEMENT.style.heigth = `${boardHeight}px`;
  BOARD_CANVAS.width = boardWidth;
  BOARD_CANVAS.height = boardHeight;
  // Draw the squares
  let squareColor = 1;
  const mid = squareSize / 2;
  const quarter = squareSize / 4;
  const ctx = BOARD_CANVAS.getContext('2d');
  for (let i in board) {
    const row = board[i];
    for (let j in row) {
      // todo improve value checking
      ctx.fillStyle = (row[j] === 0 || row[j] === 3) ? (squareColor === 1) ? '#f0d9b5' : '#b58863' : 'black';
      ctx.fillRect(squareSize * j, squareSize * i, squareSize, squareSize);
      if (row[j] === 5 || row[j] === 6 || row[j] === 2) {
        ctx.fillStyle = (row[j] === 5) ? 'yellow' : (row[j] === 2) ? 'red' : '#f0d9b5';
        ctx.fillRect(squareSize * j + quarter, squareSize * i + quarter, squareSize - mid, squareSize - mid);
      }
      squareColor *= -1;
    }
    if (row.length % 2 === 0) squareColor *= -1;
  }
  // Draws the ending
  ctx.fillStyle = 'red';
  ctx.fillRect(finishPosition.x * squareSize, finishPosition.y * squareSize, squareSize, squareSize);
}

// Mouse operations
let mousePosition = { x: 0, y: 0 };
document.addEventListener('mousemove', (ev) => {
  // Gets the mouse position in canvas
  const mouseCanvasPos = MOUSE_CANVAS.getBoundingClientRect();
  const excedentX = mouseCanvasPos.x % squareSize;
  const excedentY = mouseCanvasPos.y % squareSize;
  const xPos = ev.clientX - mouseCanvasPos.x - ((ev.clientX - excedentX) % squareSize);
  const yPos = ev.clientY - mouseCanvasPos.y - ((ev.clientY - excedentY) % squareSize);
  if (mousePosition.x == xPos && mousePosition.y == yPos) return; // Improves performance
  // Draws the mouse square in canvas
  MOUSE_CANVAS.width = BOARD_CANVAS.width;
  MOUSE_CANVAS.height = BOARD_CANVAS.height;
  const ctx = MOUSE_CANVAS.getContext('2d');
  ctx.fillStyle = 'black';
  const border = squareSize / 6;
  const midBorder = border / 2;
  ctx.fillRect(xPos + midBorder, yPos + midBorder, squareSize - border, squareSize - border);
  ctx.clearRect(xPos + border, yPos + border, squareSize - border * 2, squareSize - border * 2);
  mousePosition = { x: xPos, y: yPos };
})