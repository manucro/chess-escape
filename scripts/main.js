"use strict";

// Enums and constants
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
  BUTTON: 'button',
  STAR: 'star'
}
const SCREENS = {
  TITLE: 'title',
  OPTIONS: 'options',
  LEVEL_SELECT: 'levelselect',
  LEVEL: 'level'
}
const STATUS = {
  IDLE: 'idle',
  MOVING: 'moving'
}
const PIECE_SETS = {
  MERIDA: 'merida',
  MAESTRO: 'maestro',
  CALIENTE: 'caliente',
  TATIANA: 'tatiana',
  MPCHESS: 'mpchess'
}
const AUDIO = {
  click: document.getElementById('SFXclick'),
  move: document.getElementById('SFXmove'),
  destroy: document.getElementById('SFXdestroy'),
  lock: document.getElementById('SFXlock'),
  button: document.getElementById('SFXbutton'),
  success: document.getElementById('SFXsuccess')
}
const APP = document.getElementById('app');
const passableSquares = [0, 3];
const notPassableSquares = [1, 2, 5, 6];
const LEVELS_PER_PAGE = 24;
const TRANSITION_TIME = 250; // for fade out and fade in
const imgLock = document.createElement('img');
imgLock.src = 'sources/keyhole-color.svg';
const KEYHOLE_IMAGE = imgLock;
const MUSIC = document.getElementById('music');

// Variables
let actualLevel = 0;
let actualLevelData = {};
let actualLevelSelectPage = 0;
let actualStatus = STATUS.IDLE;
let movements = 0;
let squareSize = 58;
let finishPosition = { x: 0, y: 0 }
let BOARD_ELEMENT, BOARD_CANVAS, CANVAS_MASK, MOUSE_CANVAS, OBJECTS_BOX, PIECES_BOX;

// Control Objects
const options = {
  pieceSet: PIECE_SETS.MERIDA,
  pieceAnimationSpeed: 500,
  music: true,
  soundEffects: true,
  optimizedMode: false
}
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

// GENERAL FUNCTIONS
// Starts the game
function gameStart() {
  game = new Screen(SCREENS.TITLE);
  const firstPart = document.getElementById('ld-part-1');
  firstPart.style.animation = '1s ease forwards scrollUp';
  const secondPart = document.getElementById('ld-part-2');
  secondPart.style.animation = '1s ease forwards scrollDown';
  document.querySelector('.loading-game-title').remove();
  document.querySelector('.loading-info').remove();
  setTimeout(() => {
    document.getElementById('loading-div').remove();
  }, 1000);
  this.remove();
}
const startButton = document.getElementById('start-button');
startButton.addEventListener('click', gameStart);

// Creates the board
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
      // todo improve this maybe?
      ctx.fillStyle = (passableSquares.includes(row[j])) ? (squareColor === 1) ? '#f0d9b5' : '#b58863' : 'black';
      ctx.fillRect(squareSize * j, squareSize * i, squareSize, squareSize);
      if (notPassableSquares.includes(row[j]) && row[j] !== 1) {
        switch (row[j]) {
          case 5:
            ctx.drawImage(KEYHOLE_IMAGE, squareSize * j + quarter, squareSize * i + quarter, squareSize - mid, squareSize - mid);
            break;
          case 2:
          case 6:
            ctx.fillStyle = (row[j] === 2) ? 'red' : '#f0d9b5';
            ctx.fillRect(squareSize * j + quarter, squareSize * i + quarter, squareSize - mid, squareSize - mid);
            break;
        }
      }
      squareColor *= -1;
    }
    if (row.length % 2 === 0) squareColor *= -1;
  }
  // Draws the ending
  const finishPosX = finishPosition.x * squareSize;
  const finishPosY = finishPosition.y * squareSize;
  const padding = 2;
  ctx.fillStyle = 'rgb(25, 25, 25)';
  ctx.fillRect(finishPosX, finishPosY, squareSize, squareSize);
  ctx.fillStyle = 'white';
  ctx.fillRect(finishPosX + mid, finishPosY + padding, squareSize / 2 - padding, squareSize / 2 - padding);
  ctx.fillRect(finishPosX + padding, finishPosY + mid, squareSize / 2 - padding, squareSize / 2 - padding);
}

// Mouse operations
let mousePosition = { x: 0, y: 0 };
const canvasMousePointer = (ev) => {
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
  ctx.fillStyle = 'rgba(0, 0, 0, 50%)';
  const border = squareSize / 6;
  const midBorder = border / 2;
  ctx.fillRect(xPos + midBorder, yPos + midBorder, squareSize - border, squareSize - border);
  ctx.clearRect(xPos + border, yPos + border, squareSize - border * 2, squareSize - border * 2);
  mousePosition = { x: xPos, y: yPos };
}