"use strict";

let board;

function createLevel(level, index) {
  board = [];
  level.board.forEach(row => board.push([...row]));
  squareSize = (board.length > 9) ? 46 : 58;
  actualLevelData = {
    levelNumber: index + 1,
    levelKey: Object.keys(LEVELS)[index],
    movements: level.movements,
    finishPosition: level.finishPosition
  }
  game.updateLevelUI();
  level.pieces.forEach(piece => inBoardPieces.add(piece[0], piece[1]));
  level.objects.forEach(object => inBoardObjects.add(object[0], object[1]));
  finishPosition = { x: level.finishPosition.x, y: level.finishPosition.y };
  drawBoard();
}

const LEVELS = {
  'ONE': {
    'movements': 3,
    'board': [
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 0, 0, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1]
    ],
    'pieces': [
      [PIECES.ROOK, { x: 1, y: 5 }]
    ],
    'objects': [
      [OBJECTS.STAR, { x: 1, y: 2 }]
    ],
    'finishPosition': { x: 6, y: 1 }
  },
  'TWO': {
    'movements': 4,
    'board': [
      [1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    'pieces': [
      [PIECES.BISHOP, { x: 7, y: 5 }]
    ],
    'objects': [
      [OBJECTS.STAR, { x: 2, y: 2 }]
    ],
    'finishPosition': { x: 7, y: 3 }
  },
  'THREE': {
    'movements': 3,
    'board': [
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 0, 1, 1, 1],
      [1, 0, 0, 0, 1, 1, 1, 1],
      [1, 0, 0, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1]
    ],
    'pieces': [
      [PIECES.ROOK, { x: 1, y: 1 }],
      [PIECES.BISHOP, { x: 3, y: 1 }]
    ],
    'objects': [
      [OBJECTS.STAR, { x: 2, y: 4 }]
    ],
    'finishPosition': { x: 1, y: 4 }
  },
  'FOUR': {
    'movements': 3,
    'board': [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 1, 1, 0, 0, 1, 1],
      [1, 1, 1, 1, 1, 0, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 1, 1],
      [1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
      [1, 1, 0, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    'pieces': [
      [PIECES.BISHOP, { x: 1, y: 8 }],
      [PIECES.ROOK, { x: 1, y: 5 }]
    ],
    'objects': [
      [OBJECTS.STAR, { x: 8, y: 6 }]
    ],
    'finishPosition': { x: 2, y: 2 }
  },
  'FIVE': {
    'movements': 5,
    'board': [
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 1, 1, 1, 1],
      [1, 0, 1, 5, 1, 1, 1, 1],
      [1, 5, 1, 0, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 0, 1, 1, 0, 1],
      [1, 1, 1, 0, 1, 1, 0, 1],
      [1, 0, 0, 0, 1, 1, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1]
    ],
    'pieces': [
      [PIECES.ROOK, { x: 1, y: 4 }],
      [PIECES.ROOK, { x: 1, y: 7 }]
    ],
    'objects': [
      [OBJECTS.KEY, { x: 6, y: 7 }],
      [OBJECTS.STAR, { x: 1, y: 2 }]
    ],
    'finishPosition': { x: 1, y: 1 }
  },
  'SIX': {
    'movements': 6,
    'board': [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 0, 1, 1, 1, 0, 1, 1],
      [1, 1, 0, 1, 1, 1, 0, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 5, 1, 1, 1, 1, 1],
      [1, 1, 1, 0, 1, 0, 1, 1, 1, 1],
      [1, 1, 0, 1, 1, 1, 0, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    'pieces': [
      [PIECES.ROOK, { x: 1, y: 1 }],
      [PIECES.ROOK, { x: 7, y: 4 }],
      [PIECES.BISHOP, { x: 4, y: 4 }]
    ],
    'objects': [
      [OBJECTS.KEY, { x: 3, y: 2 }],
      [OBJECTS.STAR, { x: 5, y: 6 }]
    ],
    'finishPosition': { x: 8, y: 8 }
  },
  'SEVEN': {
    'movements': 5,
    'board': [
      [1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 1, 0, 0, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 1, 0, 1],
      [1, 0, 0, 0, 1, 0, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 1, 0, 1],
      [1, 1, 0, 0, 0, 0, 1, 0, 1],
      [1, 1, 0, 1, 1, 1, 5, 0, 1],
      [1, 0, 0, 0, 0, 0, 1, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    'pieces': [
      [PIECES.QUEEN, { x: 1, y: 1 }]
    ],
    'objects': [
      [OBJECTS.KEY, { x: 5, y: 3 }],
      [OBJECTS.STAR, { x: 1, y: 7 }]
    ],
    'finishPosition': { x: 7, y: 1 }
  },
  'EIGHT': {
    'movements': 3,
    'board': [
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 0, 0, 1, 0, 0, 1],
      [1, 1, 0, 0, 1, 0, 0, 1],
      [1, 0, 0, 0, 6, 0, 0, 1],
      [1, 1, 6, 1, 1, 0, 0, 1],
      [1, 1, 0, 0, 1, 0, 0, 1],
      [1, 1, 0, 0, 0, 1, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1]
    ],
    'pieces': [
      [PIECES.ROOK, { x: 2, y: 1 }],
      [PIECES.ROOK, { x: 1, y: 3 }],
      [PIECES.BISHOP, { x: 3, y: 2 }]
    ],
    'objects': [
      [OBJECTS.STAR, { x: 4, y: 6 }]
    ],
    'finishPosition': { x: 6, y: 1 }
  },
  'NINE': {
    'movements': 9,
    'board': [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 6, 1, 1, 1, 6, 1, 1, 1, 1],
      [1, 0, 1, 0, 0, 0, 0, 1, 1, 1],
      [1, 0, 1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 5, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 6, 1, 1],
      [1, 1, 1, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    'pieces': [
      [PIECES.ROOK, { x: 8, y: 2 }],
      [PIECES.BISHOP, { x: 3, y: 2 }],
      [PIECES.QUEEN, { x: 8, y: 5 }]
    ],
    'objects': [
      [OBJECTS.STAR, { x: 1, y: 5 }],
      [OBJECTS.KEY, { x: 1, y: 6 }]
    ],
    'finishPosition': { x: 5, y: 9 }
  },
  'TEN': {
    'movements': 7,
    'board': [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 6, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 1, 1, 1, 1, 1],
      [1, 1, 5, 0, 0, 1, 1, 1, 1, 1],
      [1, 6, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    'pieces': [
      [PIECES.ROOK, { x: 1, y: 4 }],
      [PIECES.BISHOP, { x: 2, y: 2 }],
      [PIECES.QUEEN, { x: 4, y: 4 }],
      [PIECES.ROOK, { x: 3, y: 6 }]
    ],
    'objects': [
      [OBJECTS.KEY, { x: 8, y: 4 }],
      [OBJECTS.STAR, { x: 0, y: 0 }]
    ],
    'finishPosition': { x: 1, y: 9 }
  },
  'ELEVEN': {
    'movements': 8,
    'board': [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 5, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 1, 1, 0, 1, 6, 1],
      [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 6, 0, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    'pieces': [
      [PIECES.ROOK, { x: 1, y: 8 }],
      [PIECES.QUEEN, { x: 3, y: 9 }],
      [PIECES.QUEEN, { x: 3, y: 7 }],
      [PIECES.BISHOP, { x: 1, y: 2 }]
    ],
    'objects': [
      [OBJECTS.KEY, { x: 2, y: 4 }],
      [OBJECTS.STAR, { x: 3, y: 6 }]
    ],
    'finishPosition': { x: 9, y: 9 }
  },
  'TWELVE': {
    'movements': 7,
    'board': [
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 1, 0, 0, 1],
      [1, 0, 0, 0, 1, 1, 0, 1],
      [1, 0, 1, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 0, 0, 0, 1],
      [1, 0, 0, 1, 1, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1]
    ],
    'pieces': [
      [PIECES.KING, { x: 1, y: 2 }]
    ],
    'objects': [
      [OBJECTS.STAR, { x: 2, y: 1 }]
    ],
    'finishPosition': { x: 5, y: 1 }
  },
  'THIRTEEN': {
    'movements': 8,
    'board': [
      [1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 0, 1, 1, 1],
      [1, 1, 1, 1, 0, 1, 1, 1, 1],
      [1, 1, 1, 0, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 1, 1],
      [1, 0, 0, 0, 0, 1, 1, 0, 1],
      [1, 0, 0, 1, 1, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    'pieces': [
      [PIECES.ROOK, { x: 1, y: 1 }],
      [PIECES.ROOK, { x: 1, y: 6 }],
      [PIECES.KING, { x: 2, y: 1 }]
    ],
    'objects': [
      [OBJECTS.STAR, { x: 7, y: 5 }]
    ],
    'finishPosition': { x: 7, y: 7 }
  },
  'FOURTEEN': {
    'movements': 10,
    'board': [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1],
      [1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1],
      [1, 0, 1, 0, 1, 1, 6, 1, 0, 0, 1],
      [1, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1],
      [1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1],
      [1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1],
      [1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    'pieces': [
      [PIECES.KING, { x: 1, y: 5 }],
      [PIECES.BISHOP, { x: 9, y: 7 }]
    ],
    'objects': [
      [OBJECTS.STAR, { x: 9, y: 3 }]
    ],
    'finishPosition': { x: 8, y: 5 }
  },
  'FIFTEEN': {
    'movements': 5,
    'board': [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1, 1, 0, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    'pieces': [
      [PIECES.BISHOP, { x: 1, y: 9 }],
      [PIECES.BISHOP, { x: 1, y: 1 }],
      [PIECES.KING, { x: 3, y: 8 }],
      [PIECES.ROOK, { x: 9, y: 9 }]
    ],
    'objects': [
      [OBJECTS.STAR, { x: 8, y: 2 }]
    ],
    'finishPosition': { x: 6, y: 2 }
  },
  'SIXTEEN': {
    'movements': 5,
    'board': [
      [1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 0, 0, 1],
      [1, 0, 0, 0, 2, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 6, 6, 1],
      [1, 0, 0, 0, 0, 2, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    'pieces': [
      [PIECES.QUEEN, { x: 1, y: 2 }],
      [PIECES.ROOK, { x: 1, y: 5 }]
    ],
    'objects': [
      [OBJECTS.BUTTON, { x: 4, y: 2 }],
      [OBJECTS.STAR, { x: 1, y: 7 }]
    ],
    'finishPosition': { x: 7, y: 7 }
  },
  'SEVENTEEN': {
    'movements': 7,
    'board': [
      [1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 1, 0, 0, 1],
      [1, 0, 0, 0, 0, 6, 0, 0, 1],
      [1, 0, 0, 0, 0, 6, 0, 0, 1],
      [1, 0, 0, 0, 0, 1, 0, 0, 1],
      [1, 0, 0, 0, 0, 1, 2, 2, 1],
      [1, 1, 2, 1, 1, 1, 0, 0, 1],
      [1, 0, 1, 1, 1, 1, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    'pieces': [
      [PIECES.KING, { x: 2, y: 5 }],
      [PIECES.ROOK, { x: 1, y: 1 }],
      [PIECES.QUEEN, { x: 1, y: 7 }]
    ],
    'objects': [
      [OBJECTS.BUTTON, { x: 3, y: 3 }],
      [OBJECTS.STAR, { x: 5, y: 4 }]
    ],
    'finishPosition': { x: 7, y: 7 }
  },
  'EIGHTEEN': {
    'movements': 8,
    'board': [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 1, 1, 1, 0, 2, 0, 2, 0, 1],
      [1, 1, 0, 1, 1, 0, 1, 1, 0, 0, 1],
      [1, 1, 1, 2, 1, 0, 1, 0, 1, 0, 1],
      [1, 1, 1, 1, 6, 0, 6, 1, 1, 0, 1],
      [1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1],
      [1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1],
      [1, 0, 0, 1, 0, 1, 1, 1, 0, 0, 1],
      [1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    'pieces': [
      [PIECES.QUEEN, { x: 1, y: 7 }],
      [PIECES.QUEEN, { x: 5, y: 1 }]
    ],
    'objects': [
      [OBJECTS.BUTTON, { x: 9, y: 5 }],
      [OBJECTS.STAR, { x: 7, y: 1 }]
    ],
    'finishPosition': { x: 1, y: 1 }
  },
  'NINETEEN': {
    'movements': 11,
    'board': [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1],
      [1, 0, 1, 0, 0, 0, 0, 1, 1, 0, 1],
      [1, 0, 5, 1, 1, 1, 1, 1, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 1, 1, 1, 0, 1, 1, 2, 1],
      [1, 0, 0, 0, 1, 0, 1, 1, 0, 0, 1],
      [1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    'pieces': [
      [PIECES.BISHOP, { x: 5, y: 1 }],
      [PIECES.ROOK, { x: 1, y: 7 }],
      [PIECES.ROOK, { x: 2, y: 5 }]
    ],
    'objects': [
      [OBJECTS.BUTTON, { x: 4, y: 8 }],
      [OBJECTS.KEY, { x: 9, y: 8 }],
      [OBJECTS.STAR, { x: 7, y: 8 }]
    ],
    'finishPosition': { x: 6, y: 3 }
  },
  'TWENTY': {
    'movements': 6,
    'board': [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 6, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 6, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 6, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    'pieces': [
      [PIECES.PAWN, { x: 4, y: 8 }],
      [PIECES.QUEEN, { x: 2, y: 4 }]
    ],
    'objects': [
      [OBJECTS.STAR, { x: 9, y: 1 }]
    ],
    'finishPosition': { x: 1, y: 1 }
  },
  'TWENTYONE': {
    'movements': 10,
    'board': [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 5, 0, 0, 0, 0, 0, 1, 1],
      [1, 0, 5, 0, 0, 0, 0, 0, 1, 1],
      [1, 0, 5, 0, 0, 0, 0, 0, 1, 1],
      [1, 0, 5, 0, 0, 0, 0, 0, 1, 1],
      [1, 1, 1, 1, 1, 1, 6, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 6, 1, 1, 6, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    'pieces': [
      [PIECES.PAWN, { x: 3, y: 8 }],
      [PIECES.ROOK, { x: 1, y: 6 }],
      [PIECES.BISHOP, { x: 6, y: 2 }]
    ],
    'objects': [
      [OBJECTS.KEY, { x: 3, y: 4 }],
      [OBJECTS.STAR, { x: 9, y: 2 }]
    ],
    'finishPosition': { x: 1, y: 1 }
  },
  'TWENTYTWO': {
    'movements': 8,
    'board': [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
      [1, 1, 1, 1, 1, 6, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1, 1, 2, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 1, 6, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 1, 6, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    'pieces': [
      [PIECES.PAWN, { x: 5, y: 4 }],
      [PIECES.QUEEN, { x: 2, y: 6 }],
      [PIECES.KING, { x: 4, y: 6 }],
      [PIECES.ROOK, { x: 3, y: 9 }]
    ],
    'objects': [
      [OBJECTS.BUTTON, { x: 2, y: 1 }],
      [OBJECTS.STAR, { x: 9, y: 5 }]
    ],
    'finishPosition': { x: 9, y: 1 }
  },
  'TWENTYTHREE': {
    'movements': 7,
    'board': [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 1, 0, 5, 0, 1],
      [1, 0, 1, 1, 0, 0, 1, 6, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
      [1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1],
      [1, 0, 1, 0, 2, 6, 0, 0, 0, 0, 1],
      [1, 0, 1, 0, 2, 6, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    'pieces': [
      [PIECES.PAWN, { x: 4, y: 2 }],
      [PIECES.PAWN, { x: 5, y: 2 }],
      [PIECES.QUEEN, { x: 1, y: 9 }],
      [PIECES.KING, { x: 9, y: 5 }],
      [PIECES.BISHOP, { x: 7, y: 7 }]
    ],
    'objects': [
      [OBJECTS.BUTTON, { x: 4, y: 5 }],
      [OBJECTS.KEY, { x: 3, y: 9 }],
      [OBJECTS.STAR, { x: 3, y: 8 }]
    ],
    'finishPosition': { x: 9, y: 1 }
  },
  'TWENTYFOUR': {
    'movements': 8,
    'board': [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 0, 5, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 1, 6, 1, 1],
      [1, 0, 0, 0, 2, 0, 0, 0, 0, 0, 1],
      [1, 1, 6, 1, 1, 0, 1, 1, 1, 1, 1],
      [1, 1, 6, 1, 1, 0, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1],
      [1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    'pieces': [
      [PIECES.PAWN, { x: 5, y: 7 }],
      [PIECES.PAWN, { x: 5, y: 8 }],
      [PIECES.PAWN, { x: 5, y: 9 }],
      [PIECES.ROOK, { x: 9, y: 9 }],
      [PIECES.ROOK, { x: 1, y: 1 }]
    ],
    'objects': [
      [OBJECTS.BUTTON, { x: 5, y: 1 }],
      [OBJECTS.KEY, { x: 9, y: 4 }],
      [OBJECTS.STAR, { x: 10, y: 4 }]
    ],
    'finishPosition': { x: 8, y: 1 }
  },
  'TWENTYFIVE': {
    'movements': 10,
    'board': [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 6, 0, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 6, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 6, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 6, 1, 1, 1, 0, 1],
      [1, 1, 1, 1, 1, 6, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 6, 0, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 6, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 6, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 6, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    'pieces': [
      [PIECES.QUEEN, { x: 1, y: 7 }],
      [PIECES.QUEEN, { x: 4, y: 9 }],
      [PIECES.PAWN, { x: 7, y: 7 }],
      [PIECES.BISHOP, { x: 3, y: 4 }],
      [PIECES.BISHOP, { x: 2, y: 1 }],
      [PIECES.ROOK, { x: 2, y: 8 }]
    ],
    'objects': [
      [OBJECTS.STAR, { x: 9, y: 0 }]
    ],
    'finishPosition': { x: 9, y: 1 }
  },
  'TWENTYSIX': {
    'movements': 12,
    'board': [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 1, 1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1, 1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1, 1, 1, 0, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 5, 1, 1],
      [1, 1, 0, 0, 0, 1, 1, 0, 1, 1],
      [1, 1, 0, 0, 0, 1, 0, 0, 0, 1],
      [1, 0, 1, 1, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    'pieces': [
      [PIECES.KNIGHT, { x: 1, y: 7 }]
    ],
    'objects': [
      [OBJECTS.KEY, { x: 3, y: 2 }],
      [OBJECTS.STAR, { x: 7, y: 6 }]
    ],
    'finishPosition': { x: 7, y: 3 }
  },
  'TWENTYSEVEN': {
    'movements': 10,
    'board': [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    'pieces': [
      [PIECES.KNIGHT, { x: 1, y: 8 }],
      [PIECES.ROOK, { x: 5, y: 6 }]
    ],
    'objects': [
      [OBJECTS.STAR, { x: 4, y: 8 }]
    ],
    'finishPosition': { x: 8, y: 8 }
  },
  'TWENTYEIGHT': {
    'movements': 11,
    'board': [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 1, 1, 0, 6, 6, 1],
      [1, 0, 0, 0, 0, 1, 1, 6, 6, 6, 1],
      [1, 0, 0, 0, 0, 1, 1, 6, 6, 6, 1],
      [1, 0, 0, 0, 0, 1, 1, 6, 6, 6, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
      [1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
      [1, 0, 0, 1, 0, 1, 1, 1, 1, 0, 1],
      [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    'pieces': [
      [PIECES.KNIGHT, { x: 1, y: 1 }],
      [PIECES.ROOK, { x: 4, y: 6 }]
    ],
    'objects': [
      [OBJECTS.STAR, { x: 2, y: 8 }]
    ],
    'finishPosition': { x: 7, y: 1 }
  },
  'TWENTYNINE': {
    'movements': 5,
    'board': [
      [1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 0, 0, 0, 0, 0, 1, 1],
      [1, 1, 1, 1, 1, 1, 0, 1, 1],
      [1, 1, 1, 1, 1, 1, 0, 1, 1],
      [1, 1, 1, 1, 1, 1, 0, 1, 1],
      [1, 1, 1, 1, 1, 1, 0, 1, 1],
      [1, 1, 1, 1, 1, 1, 0, 1, 1],
      [1, 1, 0, 0, 0, 0, 0, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    'pieces': [
      [PIECES.ROOK, { x: 2, y: 7 }],
      [PIECES.KING, { x: 6, y: 7 }]
    ],
    'objects': [
      [OBJECTS.STAR, { x: 7, y: 1 }]
    ],
    'finishPosition': { x: 2, y: 1 }
  },
  'THIRTY': {
    'movements': 9,
    'board': [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1],
      [1, 1, 0, 1, 1, 0, 0, 0, 0, 1, 1],
      [1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1],
      [1, 1, 1, 0, 1, 0, 0, 1, 1, 1, 1],
      [1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    'pieces': [
      [PIECES.KNIGHT, { x: 2, y: 2 }],
      [PIECES.KING, { x: 3, y: 4 }]
    ],
    'objects': [
      [OBJECTS.STAR, { x: 8, y: 7 }]
    ],
    'finishPosition': { x: 2, y: 7 }
  },
  'THIRTYONE': {
    'movements': 11,
    'board': [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 6, 6, 0, 6, 6, 0, 0, 1],
      [1, 0, 0, 1, 6, 6, 6, 1, 0, 0, 1],
      [1, 0, 0, 0, 1, 6, 1, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 6, 6, 6, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    'pieces': [
      [PIECES.QUEEN, { x: 1, y: 1 }],
      [PIECES.QUEEN, { x: 9, y: 1 }],
      [PIECES.PAWN, { x: 5, y: 9 }],
      [PIECES.KING, { x: 1, y: 9 }],
      [PIECES.KING, { x: 9, y: 9 }]
    ],
    'objects': [
      [OBJECTS.STAR, { x: 4, y: 1 }]
    ],
    'finishPosition': { x: 5, y: 1 }
  },
  'THIRTYTWO': {
    'movements': 10,
    'board': [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
      [1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1],
      [1, 1, 1, 0, 1, 5, 1, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    'pieces': [
      [PIECES.BISHOP, { x: 1, y: 1 }],
      [PIECES.BISHOP, { x: 7, y: 3 }],
      [PIECES.KNIGHT, { x: 7, y: 1 }],
      [PIECES.ROOK, { x: 9, y: 9 }],
      [PIECES.KING, { x: 5, y: 9 }]
    ],
    'objects': [
      [OBJECTS.KEY, { x: 6, y: 1 }],
      [OBJECTS.STAR, { x: 5, y: 10 }]
    ],
    'finishPosition': { x: 3, y: 8 }
  },
  'THIRTYTHREE': {
    'movements': 7,
    'board': [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    'pieces': [
      [PIECES.ROOK, { x: 2, y: 3 }],
      [PIECES.ROOK, { x: 4, y: 3 }],
      [PIECES.ROOK, { x: 6, y: 3 }],
      [PIECES.ROOK, { x: 7, y: 3 }]
    ],
    'objects': [
      [OBJECTS.STAR, { x: 4, y: 8 }]
    ],
    'finishPosition': { x: 8, y: 7 }
  },
  'THIRTYFOUR': {
    'movements': 8,
    'board': [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1],
      [1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
      [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1],
      [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1],
      [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    'pieces': [
      [PIECES.KNIGHT, { x: 8, y: 4 }],
      [PIECES.QUEEN, { x: 3, y: 1 }],
      [PIECES.QUEEN, { x: 1, y: 4 }],
    ],
    'objects': [
      [OBJECTS.STAR, { x: 9, y: 9 }]
    ],
    'finishPosition': { x: 5, y: 9 }
  },
  'THIRTYFIVE': {
    'movements': 9,
    'board': [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1],
      [1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1],
      [1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 2, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 2, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 2, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    'pieces': [
      [PIECES.KNIGHT, { x: 5, y: 5 }],
      [PIECES.QUEEN, { x: 3, y: 4 }],
      [PIECES.ROOK, { x: 3, y: 6 }],
      [PIECES.BISHOP, { x: 7, y: 4 }],
      [PIECES.KING, { x: 7, y: 6 }]
    ],
    'objects': [
      [OBJECTS.BUTTON, { x: 1, y: 1 }],
      [OBJECTS.STAR, { x: 5, y: 1 }]
    ],
    'finishPosition': { x: 9, y: 1 }
  },
  'THIRTYSIX': {
    'movements': 9,
    'board': [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1],
      [1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1],
      [1, 1, 1, 1, 1, 6, 1, 1, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1],
      [1, 0, 0, 0, 1, 1, 6, 0, 1, 0, 1],
      [1, 0, 0, 0, 1, 1, 0, 0, 1, 0, 1],
      [1, 0, 0, 0, 6, 1, 0, 0, 1, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    'pieces': [
      [PIECES.KNIGHT, { x: 3, y: 3 }],
      [PIECES.QUEEN, { x: 9, y: 1 }],
      [PIECES.BISHOP, { x: 9, y: 2 }]
    ],
    'objects': [
      [OBJECTS.STAR, { x: 6, y: 4 }]
    ],
    'finishPosition': { x: 2, y: 8 }
  },
  'THIRTYSEVEN': {
    'movements': 7,
    'board': [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    'pieces': [
      [PIECES.KNIGHT, { x: 1, y: 9 }],
      [PIECES.KING, { x: 2, y: 7 }],
      [PIECES.KING, { x: 3, y: 5 }],
      [PIECES.KING, { x: 5, y: 4 }],
      [PIECES.KING, { x: 1, y: 4 }],
      [PIECES.KING, { x: 2, y: 2 }],
      [PIECES.KING, { x: 6, y: 5 }],
      [PIECES.KING, { x: 8, y: 8 }],
      [PIECES.KING, { x: 5, y: 9 }],
      [PIECES.KING, { x: 4, y: 1 }],
      [PIECES.KING, { x: 4, y: 3 }],
      [PIECES.ROOK, { x: 9, y: 4 }]
    ],
    'objects': [
      [OBJECTS.STAR, { x: 9, y: 3 }]
    ],
    'finishPosition': { x: 8, y: 1 }
  },
  'THIRTYEIGHT': {
    'movements': 13,
    'board': [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
      [1, 6, 6, 6, 6, 6, 6, 6, 6, 6, 1],
      [1, 6, 6, 6, 6, 6, 6, 6, 6, 6, 1],
      [1, 6, 6, 6, 6, 6, 6, 6, 6, 6, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    'pieces': [
      [PIECES.KNIGHT, { x: 2, y: 2 }],
      [PIECES.PAWN, { x: 2, y: 8 }],
      [PIECES.PAWN, { x: 6, y: 8 }],
      [PIECES.QUEEN, { x: 4, y: 8 }]
    ],
    'objects': [
      [OBJECTS.STAR, { x: 7, y: 2 }]
    ],
    'finishPosition': { x: 8, y: 1 }
  },
  'THIRTYNINE': {
    'movements': 11,
    'board': [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1],
      [1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1],
      [1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1],
      [1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 1],
      [1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1],
      [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1],
      [1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1],
      [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    'pieces': [
      [PIECES.KNIGHT, { x: 3, y: 3 }],
      [PIECES.ROOK, { x: 6, y: 1 }]
    ],
    'objects': [
      [OBJECTS.STAR, { x: 7, y: 8 }]
    ],
    'finishPosition': { x: 7, y: 5 }
  },
  'FORTY': {
    'movements': 10,
    'board': [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1],
      [1, 1, 0, 1, 1, 1, 1, 1, 1, 6, 1],
      [1, 1, 0, 1, 1, 1, 1, 1, 1, 6, 1],
      [1, 0, 0, 0, 5, 5, 5, 0, 0, 0, 1],
      [1, 0, 0, 0, 5, 0, 5, 0, 0, 0, 1],
      [1, 6, 6, 6, 5, 5, 5, 6, 6, 6, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    'pieces': [
      [PIECES.QUEEN, { x: 5, y: 5 }],
      [PIECES.ROOK, { x: 5, y: 7 }],
      [PIECES.PAWN, { x: 2, y: 8 }],
      [PIECES.PAWN, { x: 8, y: 8 }]
    ],
    'objects': [
      [OBJECTS.KEY, { x: 4, y: 1 }],
      [OBJECTS.STAR, { x: 6, y: 1 }]
    ],
    'finishPosition': { x: 7, y: 1 }
  },
  'FORTYONE': {
    'movements': 8,
    'board': [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 1, 0, 0, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 1, 1, 0, 1],
      [1, 0, 0, 0, 2, 0, 0, 5, 0, 1],
      [1, 0, 0, 0, 0, 0, 2, 0, 0, 1],
      [1, 0, 6, 0, 1, 6, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 1, 0, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 1, 0, 0, 1],
      [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    'pieces': [
      [PIECES.BISHOP, { x: 1, y: 1 }],
      [PIECES.BISHOP, { x: 1, y: 7 }],
      [PIECES.BISHOP, { x: 6, y: 1 }],
      [PIECES.BISHOP, { x: 8, y: 3 }]
    ],
    'objects': [
      [OBJECTS.BUTTON, { x: 2, y: 6 }],
      [OBJECTS.KEY, { x: 5, y: 8 }],
      [OBJECTS.STAR, { x: 2, y: 0 }]
    ],
    'finishPosition': { x: 8, y: 2 }
  },
  'FORTYTWO': {
    'movements': 14,
    'board': [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 6, 6, 6, 6, 6, 6, 6, 6, 6, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1],
      [1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1],
      [1, 0, 0, 1, 1, 0, 1, 1, 0, 0, 1],
      [1, 0, 0, 1, 1, 6, 1, 1, 0, 0, 1],
      [1, 0, 0, 1, 1, 6, 1, 1, 0, 0, 1],
      [1, 0, 0, 1, 1, 6, 1, 1, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    'pieces': [
      [PIECES.PAWN, { x: 3, y: 3 }],
      [PIECES.PAWN, { x: 7, y: 3 }],
      [PIECES.QUEEN, { x: 8, y: 7 }],
      [PIECES.BISHOP, { x: 2, y: 5 }]
    ],
    'objects': [
      [OBJECTS.STAR, { x: 8, y: 0 }]
    ],
    'finishPosition': { x: 5, y: 6 }
  },
  'FORTYTHREE': {
    'movements': 16,
    'board': [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 2, 0, 0, 0, 0, 0, 2, 0, 1],
      [1, 0, 2, 0, 0, 0, 0, 0, 2, 0, 1],
      [1, 0, 2, 0, 0, 0, 0, 0, 2, 0, 1],
      [1, 0, 2, 0, 6, 6, 6, 0, 2, 0, 1],
      [1, 0, 2, 0, 6, 0, 6, 0, 2, 0, 1],
      [1, 0, 2, 0, 6, 6, 6, 0, 1, 0, 1],
      [1, 0, 2, 0, 0, 0, 0, 0, 1, 6, 1],
      [1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1],
      [1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    'pieces': [
      [PIECES.PAWN, { x: 2, y: 9 }],
      [PIECES.ROOK, { x: 3, y: 5 }],
      [PIECES.QUEEN, { x: 7, y: 5 }],
      [PIECES.BISHOP, { x: 9, y: 2 }]
    ],
    'objects': [
      [OBJECTS.BUTTON, { x: 5, y: 5 }],
      [OBJECTS.STAR, { x: 9, y: 10 }]
    ],
    'finishPosition': { x: 9, y: 9 }
  },
  'FORTYFOUR': {
    'movements': 16,
    'board': [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1],
      [1, 1, 2, 1, 1, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 1],
      [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 0, 1, 1, 1, 5, 1],
      [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1],
      [1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    'pieces': [
      [PIECES.ROOK, { x: 1, y: 9 }],
      [PIECES.KING, { x: 7, y: 5 }],
      [PIECES.KNIGHT, { x: 8, y: 1 }]
    ],
    'objects': [
      [OBJECTS.KEY, { x: 9, y: 1 }],
      [OBJECTS.BUTTON, { x: 8, y: 8 }],
      [OBJECTS.STAR, { x: 3, y: 10 }]
    ],
    'finishPosition': { x: 1, y: 1 }
  },
  'FORTYFIVE': {
    'movements': 16,
    'board': [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
      [1, 1, 1, 0, 0, 0, 0, 1, 1, 0, 1],
      [1, 1, 1, 1, 6, 6, 1, 1, 1, 1, 1],
      [1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1],
      [1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1],
      [1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    'pieces': [
      [PIECES.BISHOP, { x: 5, y: 1 }],
      [PIECES.BISHOP, { x: 9, y: 1 }],
      [PIECES.BISHOP, { x: 9, y: 3 }],
      [PIECES.QUEEN, { x: 3, y: 7 }],
      [PIECES.PAWN, { x: 4, y: 8 }],
      [PIECES.PAWN, { x: 5, y: 8 }],
      [PIECES.ROOK, { x: 6, y: 9 }],
      [PIECES.KING, { x: 5, y: 5 }]
    ],
    'objects': [
      [OBJECTS.STAR, { x: 2, y: 4 }]
    ],
    'finishPosition': { x: 1, y: 2 }
  }
}

// Sets the locked and start properties, that it's the same in all levels
for (let i in LEVELS) {
  const level = LEVELS[i];
  Object.defineProperty(level, 'locked', { value: (i !== 'ONE'), writable: true });
  Object.defineProperty(level, 'stars', { value: [false, false, false], writable: true });
}

const keys = Object.keys(LEVELS);
keys.forEach(key => {
  LEVELS[key].locked = false;
})