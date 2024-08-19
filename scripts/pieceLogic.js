"use strict";

// Objects for the funcitonalities
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
    element.src = `pieces/${type}.svg`;
    element.style.width = `${squareSize}px`;
    element.style.height = `${squareSize}px`;
    const handleClick = () => {
      if (actualStatus === STATUS.IDLE) this.showMovements();
    }
    element.addEventListener('click', handleClick);
    this.element = element;

    // Sets the other attributes
    this.type = type;
    this.setPosition((defaultPos) ? defaultPos : { x: 0, y: 0 });

    // Appends the element to the board
    BOARD_ELEMENT.appendChild(element);
  }

  setPosition(newPosition, movementType = 'normal') {
    const prevPosition = this.position;
    this.position = newPosition;
    this.element.style.transform = `translate(${newPosition.x * squareSize}px, ${newPosition.y * squareSize}px)`;
    actualStatus = STATUS.IDLE;
    // Push
    if (prevPosition && movementType === 'normal') {
      const [trace, direction] = this.getPieceTraceAndDirection(prevPosition, newPosition);
      // Update objects
      inBoardObjects.list.forEach(object => {
        trace.forEach(pos => object.checkCollision(pos));
      });
      // todo improve this
      let piecesPushed = 0;
      inBoardPieces.list.forEach((piece) => {
        if (piece === this) return;
        trace.forEach((tracePos) => {
          if (tracePos.x === piece.position.x && tracePos.y === piece.position.y) {
            piecesPushed++;
            const pushedPieceNewPos = this.getMovementWithDirection(newPosition, direction, piecesPushed);
            piece.setPosition(pushedPieceNewPos, 'push');
          }
        })
      })
    }
  }

  showMovements() {
    actualStatus = STATUS.MOVING;
    const ctx = CANVAS_MASK.getContext('2d');
    CANVAS_MASK.width = BOARD_CANVAS.width;
    CANVAS_MASK.height = BOARD_CANVAS.height;
    
    validPositions.clear();
    PIECES_MOVEMENTS[this.type](this.position);

    const handleClick = (ev) => {
      const clickedPosition = { x: Math.floor(ev.layerX / squareSize), y: Math.floor(ev.layerY / squareSize) }
      if (clickedPosition.x == this.position.x && clickedPosition.y == this.position.y) return;
      if (!validPositions.contains(clickedPosition)) return;
      this.setPosition(clickedPosition);
      ctx.clearRect(0, 0, CANVAS_MASK.width, CANVAS_MASK.height);
      BOARD_ELEMENT.removeEventListener('click', handleClick);
    }
    BOARD_ELEMENT.addEventListener('click', handleClick);
  }

  getPieceTraceAndDirection(prevPosition, newPosition) {
    const trace = [];
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
    else {
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
    const ctx = CANVAS_MASK.getContext('2d');
    ctx.fillStyle = 'red'
    if (board[checkPos.y][checkPos.x] === 0) {
      const quarter = squareSize / 4;
      const mid = squareSize / 2;
      ctx.beginPath();
      ctx.arc(
        squareSize * checkPos.x + mid,
        squareSize * checkPos.y + mid,
        quarter / 2, 0, 2 * Math.PI);
      ctx.fill();
      validPositions.add({...checkPos});
    }
    else break;
  }
}