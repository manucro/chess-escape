"use strict";

let board = DEFAULT_BOARD;

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
    'objects': [],
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
    'objects': [],
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
    'objects': [],
    'finishPosition': { x: 1, y: 4 }
  },
  'FOUR': {
    'movements': 3,
    'board': [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 1, 1, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 0, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 0, 1, 1, 1, 1, 1, 1],
      [1, 1, 0, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    'pieces': [
      [PIECES.BISHOP, { x: 1, y: 8 }],
      [PIECES.ROOK, { x: 1, y: 5 }]
    ],
    'objects': [],
    'finishPosition': { x: 2, y: 2 }
  },
  'FIVE': {
    'movements': 5,
    'board': [
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 1, 1, 1, 1],
      [1, 1, 1, 5, 1, 1, 1, 1],
      [1, 1, 1, 0, 1, 1, 1, 1],
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
      [OBJECTS.KEY, { x: 6, y: 7 }]
    ],
    'finishPosition': { x: 1, y: 1 }
  },
  'SIX': {
    'movements': 6,
    'board': [
      [1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 0, 1, 1, 0, 1, 1],
      [1, 1, 0, 1, 1, 0, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 0, 1, 1, 1, 1, 1],
      [1, 1, 5, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    'pieces': [
      [PIECES.ROOK, { x: 1, y: 1 }],
      [PIECES.ROOK, { x: 7, y: 4 }],
      [PIECES.BISHOP, { x: 4, y: 4 }]
    ],
    'objects': [
      [OBJECTS.KEY, { x: 3, y: 2 }]
    ],
    'finishPosition': { x: 7, y: 7 }
  },
}

function createLevel(level) {
  board = level.board;
  level.pieces.forEach(piece => {
    inBoardPieces.add(piece[0], piece[1]);
  });
  level.objects.forEach(object => {
    inBoardObjects.add(object[0], object[1]);
  });
  finishPosition = { x: level.finishPosition.x, y: level.finishPosition.y };
  drawBoard();
}