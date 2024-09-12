"use strict";

// Object for the funcitonalities
const validPositions = {
  array: [],
  add: (pos) => { this.array.push(pos) },
  clear: () => { this.array = []; },
  contains: (pos) => {
    const newArr = this.array.filter((p) => (p.x === pos.x && p.y === pos.y));
    return (newArr.length === 1);
  }
}


class Piece {
  constructor(type, defaultPos) {
    // Creates the HTML element
    const element = document.createElement('img');
    element.classList.add('piece');
    element.src = `pieces/${options.pieceSet}/${type}.svg`;
    element.style.width = `${squareSize}px`;
    element.style.height = `${squareSize}px`;
    const transitionSeconds = options.pieceAnimationSpeed / 1000;
    element.style.transition = `transform ${transitionSeconds}s, opacity ${transitionSeconds}s`;
    const handleClick = () => {
      if (actualStatus === STATUS.IDLE) this.showMovements();
    }
    element.addEventListener('click', handleClick);
    this.element = element;

    // Sets the other attributes
    this.type = type;
    this.setPosition((defaultPos) ? defaultPos : { x: 0, y: 0 });
    this.blocked = false;

    // Appends the element to the board
    PIECES_BOX.appendChild(element);
  }

  setPosition(newPosition, movementType = 'normal') {
    const prevPosition = this.position;
    this.position = newPosition;
    this.element.style.transform = `translate(${newPosition.x * squareSize}px, ${newPosition.y * squareSize}px)`;
    actualStatus = STATUS.IDLE;
    // Checks if the level has been beaten
    const finishPos = actualLevelData.finishPosition;
    if (newPosition.x == finishPos.x && newPosition.y == finishPos.y) game.winLevel();
    // If it's void, it falls
    if (movementType === 'push') {
      if (
        newPosition.x >= 0 &&
        newPosition.y >= 0 &&
        newPosition.x <= (board[0].length - 1) &&
        newPosition.y <= (board.length - 1)
      ) {
        const s = board[newPosition.y][newPosition.x];
        if (passableSquares.includes(s) || s === 6) return;
      }
      this.destroyPiece();
    }
    // If it's a horse, then checks if it has killed a piece
    if (this.type === PIECES.KNIGHT) {
      inBoardObjects.list.forEach(object => {
        object.checkCollision(newPosition);
      });
      inBoardPieces.list.forEach(piece => {
        if (piece == this) return;
        if (piece.position.x === newPosition.x && piece.position.y === newPosition.y) piece.destroyPiece();
      });
    }
    // Push
    if (prevPosition && movementType === 'normal') {
      const [trace, direction] = this.getPieceTraceAndDirection(prevPosition, newPosition);
      const pieceCache = [];
      for (let i = 0; i < trace.length; i++) {
        const pos = trace[i];
        const lastPos = trace[trace.length - 1];
        // Update objects
        inBoardObjects.list.forEach(object => {
          object.checkCollision(pos);
        });
        // Checks if a piece is pushed
        inBoardPieces.list.forEach(piece => {
          if (piece === this) return;
          if (pos.x === piece.position.x && pos.y === piece.position.y) {
            const pushedPieceNewPos = this.getMovementWithDirection(lastPos, direction);
            if (!pieceCache.includes(piece)) {
              trace.push(pushedPieceNewPos);
              pieceCache.push(piece);
            } else return;
            piece.setPosition(pushedPieceNewPos, 'push');
            inBoardObjects.list.forEach(obj => obj.checkCollision(pushedPieceNewPos));
          }
        });
      }
    }
  }

  showMovements() {
    if (this.blocked) return;
    actualStatus = STATUS.MOVING;
    const ctx = CANVAS_MASK.getContext('2d');
    CANVAS_MASK.width = BOARD_CANVAS.width;
    CANVAS_MASK.height = BOARD_CANVAS.height;
    CANVAS_MASK.style.width = `${BOARD_CANVAS.width}px`;
    CANVAS_MASK.style.height = `${BOARD_CANVAS.height}px`;
    
    validPositions.clear();
    PIECES_MOVEMENTS[this.type](this.position); // Fills the validPositions list

    // Click to move the piece
    const handleClick = (ev) => {
      const clickedPosition = { x: Math.floor(ev.layerX / squareSize), y: Math.floor(ev.layerY / squareSize) }
      if (clickedPosition.x == this.position.x && clickedPosition.y == this.position.y) return;
      if (!validPositions.contains(clickedPosition)) return;
      movements++; game.updateLevelUI();
      this.setPosition(clickedPosition);
      ctx.clearRect(0, 0, CANVAS_MASK.width, CANVAS_MASK.height);
      game.removeBoardEvents();
      this.element.removeEventListener('contextmenu', handleContextMenu);
    }
    // Right click to deselect the piece
    const handleContextMenu = (ev) => {
      ev.preventDefault();
      actualStatus = STATUS.IDLE;
      ctx.clearRect(0, 0, CANVAS_MASK.width, CANVAS_MASK.height);
      game.removeBoardEvents();
      this.element.removeEventListener('contextmenu', handleContextMenu);
    }

    game.addBoardEvent(handleClick);
    this.element.addEventListener('contextmenu', handleContextMenu);
  }

  destroyPiece() {
    this.element.style.opacity = '0';
    this.blocked = true;
    setTimeout(() => this.deletePiece(), 1000);
  }

  getPieceTraceAndDirection(prevPosition, newPosition) {
    const trace = [];
    trace.push(prevPosition);
    let direction;
    let checkX = prevPosition.x;
    let checkY = prevPosition.y;
    if (prevPosition.y === newPosition.y) {
      direction = (prevPosition.x < newPosition.x) ? 'right' : 'left'
      // Horizontal trace
      while (checkX !== newPosition.x) {
        if (checkX < newPosition.x) checkX++;
        else checkX--;
        trace.push({ x: checkX, y: newPosition.y });
      }
    }
    else if (prevPosition.x === newPosition.x) {
      direction = (prevPosition.y < newPosition.y) ? 'down' : 'up'
      // Vertical trace
      while (checkY !== newPosition.y) {
        if (checkY < newPosition.y) checkY++;
        else checkY--;
        trace.push({ x: newPosition.x, y: checkY });
      }
    }
    else if (this.type !== PIECES.KNIGHT) {
      // Diagonal trace
      const factorX = (newPosition.x > prevPosition.x);
      const factorY = (newPosition.y > prevPosition.y);
      direction = (factorX && factorY) ? 'bottom-right'
        : (factorX) ? 'top-right'
        : (factorY) ? 'bottom-left'
        : 'top-left'
      while (checkX !== newPosition.x && checkY !== newPosition.y) {
        checkX += (factorX) ? 1 : -1;
        checkY += (factorY) ? 1 : -1;
        trace.push({ x: checkX, y: checkY });
      }
    }
    return [trace, direction];
  }

  getMovementWithDirection(position, direction, val = 1) {
    switch (direction) {
      default: return { x: position.x, y: position.y }
      case 'left': return { x: position.x - val, y: position.y }
      case 'right': return { x: position.x + val, y: position.y }
      case 'down': return { x: position.x, y: position.y + val }
      case 'up': return { x: position.x, y: position.y - val }
      case 'top-left': return { x: position.x - val, y: position.y - val }
      case 'top-right': return { x: position.x + val, y: position.y - val }
      case 'bottom-left': return { x: position.x - val, y: position.y + val }
      case 'bottom-right': return { x: position.x + val, y: position.y + val }
    }
  }
  
  deletePiece() {
    const index = inBoardPieces.list.indexOf(this);
    if (index === -1) return;
    this.element.remove();
    inBoardPieces.list.splice(index, 1);
  }
}

const PIECES_MOVEMENTS = {
  'rook': (pos) => {
    discreteCheck((p) => p.y++, pos.x, pos.y);
    discreteCheck((p) => p.y--, pos.x, pos.y);
    discreteCheck((p) => p.x++, pos.x, pos.y);
    discreteCheck((p) => p.x--, pos.x, pos.y);
  },
  'bishop': (pos) => {
    discreteCheck((p) => {p.y++, p.x++}, pos.x, pos.y);
    discreteCheck((p) => {p.y--, p.x++}, pos.x, pos.y);
    discreteCheck((p) => {p.y++, p.x--}, pos.x, pos.y);
    discreteCheck((p) => {p.y--, p.x--}, pos.x, pos.y);
  },
  'queen': (pos) => {
    discreteCheck((p) => p.y++, pos.x, pos.y);
    discreteCheck((p) => p.y--, pos.x, pos.y);
    discreteCheck((p) => p.x++, pos.x, pos.y);
    discreteCheck((p) => p.x--, pos.x, pos.y);
    discreteCheck((p) => {p.y++, p.x++}, pos.x, pos.y);
    discreteCheck((p) => {p.y--, p.x++}, pos.x, pos.y);
    discreteCheck((p) => {p.y++, p.x--}, pos.x, pos.y);
    discreteCheck((p) => {p.y--, p.x--}, pos.x, pos.y);
  },
  'king': (pos) => {
    [-1, 0, 1].forEach(xPlus => {
      [-1, 0, 1].forEach(yPlus => {
        if (xPlus === 0 && yPlus === 0) return;
        const newPosition = { x: pos.x + xPlus, y: pos.y + yPlus};
        // todo create passable values
        if (board[newPosition.y][newPosition.x] !== 0 && board[newPosition.y][newPosition.x] !== 3) return;
        validPositions.add(newPosition);
        highlightSquare(newPosition);
      });
    });
  },
  'pawn': (pos) => {
    const pawnPassableSquares = [0, 3, 6];
    [1, 2].forEach((yPlus) => {
      const newPosition = { x: pos.x, y: pos.y - yPlus };
      if (!pawnPassableSquares.includes(board[newPosition.y][newPosition.x])) return;
      if (yPlus === 2 && !validPositions.contains({ x: pos.x , y: pos.y - 1})) return;
      validPositions.add(newPosition);
      highlightSquare(newPosition);
    })
  },
  'knight': (pos) => {
    const knightPassableSquares = [0, 3, 6];
    const knightPositions = [
      { x: 1, y: -2},
      { x: 2, y: -1},
      { x: 2, y: 1},
      { x: 1, y: 2},
      { x: -1, y: 2},
      { x: -2, y: 1},
      { x: -2, y: -1},
      { x: -1, y: -2}
    ];
    knightPositions.forEach(knightPos => {
      const checkPosition = { x: pos.x + knightPos.x, y: pos.y + knightPos.y };
      if (
        checkPosition.x < 0 ||
        checkPosition.y < 0 ||
        checkPosition.x > board[0].length - 1 ||
        checkPosition.y > board.length - 1
      ) return;
      if (!knightPassableSquares.includes(board[checkPosition.y][checkPosition.x])) return;
      validPositions.add(checkPosition);
      highlightSquare(checkPosition);
    });
  }
}

// MOVEMENT CHECKING FOR EVERY PIECE
function discreteCheck(change, x, y) {
  const checkPos = { x, y }
  let iterations = 0;
  while (true) {
    iterations++;
    if (iterations > 30) break; // To avoid infinite loops
    change(checkPos);
    // todo create passable values
    if (board[checkPos.y][checkPos.x] === 0 || board[checkPos.y][checkPos.x] === 3) {
      highlightSquare(checkPos);
      validPositions.add({...checkPos});
    }
    else break;
  }
}
function highlightSquare(position) {
  const ctx = CANVAS_MASK.getContext('2d');
  ctx.fillStyle = 'rgba(50, 255, 50, 0.5)';
  ctx.fillRect(position.x * squareSize, position.y * squareSize, squareSize, squareSize);
}