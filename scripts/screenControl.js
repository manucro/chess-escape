"use strict";

// CONSTANTS
const GAME_TITLE = 'Chess Escape';
const CREDITS = 'Game made by Manuel Crocco';

const APP = document.getElementById('app');

const SCREENS = {
  TITLE: 'title',
  OPTIONS: 'options',
  LEVEL_SELECT: 'levelselect',
  LEVEL: 'level'
}

class Screen {
  constructor(screenType) {
    this.type = screenType;
    this.screenElements = {};

    function create(type, className, content = '') {
      const el = document.createElement(type);
      el.classList.add(className);
      el.innerText = content;
      return el;
    }

    // Main Title
    const titleScreen = create('div', 'title-screen');
    const titleElementBox = create('div', 'title-box');
    const titleAnimation = create('div', 'title-animation');
    const titleElement = create('h1', 'title', GAME_TITLE);
    titleElementBox.appendChild(titleAnimation);
    titleElementBox.appendChild(titleElement);
    const titleButtons = create('div', 'title-buttons');
    ['Play', 'Guide', 'Options'].forEach(buttonTitle => {
      const titleButton = create('button', 'title-button', buttonTitle);
      titleButton.type = 'button';
      titleButton.addEventListener('click', () => {
        this.changeScreen((buttonTitle === 'Play') ? SCREENS.LEVEL_SELECT : SCREENS.OPTIONS);
      });
      titleButtons.appendChild(titleButton);
    });
    const credits = create('footer', 'credits');
    credits.innerHTML = CREDITS;
    titleScreen.appendChild(titleElementBox);
    titleScreen.appendChild(titleButtons);
    titleScreen.appendChild(credits);
    Object.defineProperty(this.screenElements, SCREENS.TITLE, { value: titleScreen });

    // Options menu
    const optionsData = [
      ['Piece Set', Object.values(PIECE_SETS)],
      ['Piece Animation Speed', [250, 500, 1000, 1500]],
      ['Music', [true, false]],
      ['Optimized Mode', [true, false]]
    ]
    // todo improve
    function getOptionBoxInnerElement(value) {
      if (typeof value === 'string') {
        const optionBoxSprite = create('img', 'option-box-sprite');
        optionBoxSprite.src = `pieces/${value}/rook.svg`;
        return optionBoxSprite;
      } else if (typeof value === 'number') {
        const speedSpan = create('span', 'option-box-span', (value / 1000));
        return speedSpan;
      } else {
        const booleanSpan = create('span', 'option-box-span', (value) ? 'Yes' : 'No');
        return booleanSpan;
      }
    }
    const optionsBox = create('div', 'options-box');
    const optionsBackButton = create('button', 'back-button');
    optionsBackButton.type = 'button';
    optionsBackButton.addEventListener('click', () => this.changeScreen(SCREENS.TITLE));
    optionsBox.appendChild(optionsBackButton);
    const optionsTitle = create('h4', 'options-title', 'Options');
    const optionsElement = create('div', 'options');
    optionsData.forEach((optionData, i) => {
      const option = create('div', 'option');
      const optionTitle = create('div', 'option-title', optionData[0]);
      const optionBoxes = create('div', 'option-boxes')
      optionData[1].forEach(box => {
        const optionBox = create('div', 'option-box');
        optionBox.classList.add(Object.keys(options)[i]);
        optionBox.setAttribute('data-option-value', box);
        optionBox.appendChild(getOptionBoxInnerElement(box));
        optionBox.addEventListener('click', () => {
          options[Object.keys(options)[i]] = box;
          this.updateOptions();
        });
        optionBoxes.appendChild(optionBox);
      });
      option.appendChild(optionTitle);
      option.appendChild(optionBoxes);
      optionsElement.appendChild(option);
    });
    optionsBox.appendChild(optionsTitle);
    optionsBox.appendChild(optionsElement);
    Object.defineProperty(this.screenElements, SCREENS.OPTIONS, { value: optionsBox });

    // Level Select
    const levelSelect = create('div', 'level-select')
    const levelSelectBox = create('div', 'level-select-box');
    const levelSelectBackButton = create('button', 'back-button');
    levelSelectBackButton.type = 'button';
    levelSelectBackButton.addEventListener('click', () => this.changeScreen(SCREENS.TITLE));
    Object.keys(LEVELS).forEach((levelName, i) => {
      const levelElement = create('div', 'level');
      levelElement.innerText = i + 1;
      levelElement.addEventListener('click', () => {
        this.changeScreen(SCREENS.LEVEL);
        this.startLevel(levelName);
      });
      levelSelectBox.appendChild(levelElement);
    });
    levelSelect.appendChild(levelSelectBackButton);
    levelSelect.appendChild(levelSelectBox);
    Object.defineProperty(this.screenElements, SCREENS.LEVEL_SELECT, { value: levelSelect });

    // Level
    const levelElement = create('div', 'level-screen');
    // Back button
    const backButton = create('button', 'back-button');
    backButton.type = 'button';
    backButton.addEventListener('click', () => {
      this.cleanLevelValues();
      this.changeScreen(SCREENS.LEVEL_SELECT);
      document.removeEventListener('click', canvasMousePointer);
    });
    const backButtonSprite = create('div', 'back-button-sprite');
    backButton.appendChild(backButtonSprite);
    levelElement.appendChild(backButton);
    // Restart button
    const restartButton = create('button', 'restart-button', 'Restart');
    restartButton.type = 'button';
    restartButton.addEventListener('click', () => this.restartLevel());
    levelElement.appendChild(restartButton);
    // Level info
    const levelInfo = create('div', 'level-info');
    const levelNumberSpan = create('span', 'level-info-span', 'Level 0');
    levelNumberSpan.id = 'level-number';
    const movementsSpan = create('span', 'level-info-span', 'Movements: 0 / 0');
    movementsSpan.id = 'movements';
    levelInfo.appendChild(levelNumberSpan);
    levelInfo.appendChild(movementsSpan);
    // Board
    const boardBox = create('div', 'board-box');
    const boardElement = create('div', 'board');
    const appendBoardElement = (type, id) => {
      const el = document.createElement(type);
      el.id = id;
      boardElement.appendChild(el);
    }
    appendBoardElement('canvas', 'board-canvas');
    appendBoardElement('div', 'objects-box');
    appendBoardElement('canvas', 'canvas-mask');
    appendBoardElement('canvas', 'mouse-canvas');
    appendBoardElement('div', 'pieces-box');
    boardBox.appendChild(boardElement);
    levelElement.appendChild(levelInfo);
    levelElement.appendChild(boardBox);
    Object.defineProperty(this.screenElements, SCREENS.LEVEL, { value: levelElement });

    // Appends the screen type of the constructor
    APP.appendChild(this.screenElements[screenType]);
  }

  changeScreen(newScreen) {
    this.screenElements[this.type].remove();
    this.type = newScreen;
    APP.appendChild(this.screenElements[newScreen]);
    if (newScreen === SCREENS.LEVEL_SELECT) this.updateLevelSelect();
    if (newScreen === SCREENS.OPTIONS) this.updateOptions();
  }

  createModal(text, buttons, actions, video = null) {
    // todo not repeat this function, maybe make it global?
    function create(type, className, content = '') {
      const el = document.createElement(type);
      el.classList.add(className);
      el.innerText = content;
      return el;
    }
    // Modal
    const modal = create('div', 'modal');
    const modalBox = create('div', (video) ? 'modal-box-video' : 'modal-box');
    const modalText = create('div', 'modal-text', text);
    const modalButtons = create('div','modal-buttons');
    buttons.forEach((button, i) => {
      const modalButton = create('button', 'modal-button', button);
      modalButton.type = 'button';
      modalButton.addEventListener('click', actions[i]);
      modalButtons.appendChild(modalButton);
    });
    modalBox.appendChild(modalText);
    if (video) {
      const tutorial = create('video', 'modal-video');
      tutorial.src = video;
      tutorial.muted = 'true';
      tutorial.autoplay = 'true';
      tutorial.loop = 'true';
      modalBox.appendChild(tutorial);
    }
    modalBox.appendChild(modalButtons);
    modal.appendChild(modalBox);

    APP.appendChild(modal);
  }

  startLevel(level) {
    BOARD_ELEMENT = document.querySelector('.board');
    BOARD_CANVAS = document.getElementById('board-canvas');
    CANVAS_MASK = document.getElementById('canvas-mask');
    MOUSE_CANVAS = document.getElementById('mouse-canvas');
    OBJECTS_BOX = document.getElementById('objects-box');
    PIECES_BOX = document.getElementById('pieces-box');
    document.addEventListener('mousemove', canvasMousePointer);
    createLevel(LEVELS[level], Object.keys(LEVELS).indexOf(level));
    // Tutorial videos
    this.createLevelTutorial(level);
  }

  restartLevel() {
    // todo IMPROVE THIS HORRIBLE SYSTEM
    const levelPieces = LEVELS[actualLevelData.levelKey].pieces;
    const boardPieces = inBoardPieces.list;
    // Creates non-existent pieces
    const levelPiecesCopy = [...levelPieces];
    let boardPiecesCopy = [...boardPieces];
    for (let i = 0; i < levelPiecesCopy.length; i++) {
      for (let j in boardPiecesCopy) {
        const piece = boardPiecesCopy[j];
        if (piece.type === levelPiecesCopy[i][0]) {
          boardPiecesCopy.splice(j, 1);
          levelPiecesCopy.splice(i, 1);
          i--;
          break;
        }
      }
    }
    levelPiecesCopy.forEach(piece => {
      inBoardPieces.add(piece[0], piece[1]);
    })
    // Sets every piece position
    boardPiecesCopy = [...boardPieces];
    levelPieces.forEach(piece => {
      for (let i = 0; i < boardPiecesCopy.length; i++) {
        const boardPiece = boardPiecesCopy[i];
        // If the piece exists
        if (piece[0] === boardPiece.type) {
          boardPiece.setPosition(piece[1], 'reset');
          boardPiecesCopy.splice(i, 1);
          break;
        }
      }
    })
    // this.cleanLevelValues();
    movements = 0;
    // this.startLevel(actualLevelData.levelKey);
  }
  
  createLevelTutorial(level) {
    let modalValues;
    switch (level) {
      default: modalValues = null; break;
      case 'THREE': modalValues = ['You can push pieces by moving one towards another', '1']; break;
      case 'EIGHT': modalValues = ["You can't move over platforms, but you can push pieces onto them", '2']; break;
      case 'ELEVEN': modalValues = ['You can push two pieces at the same time', '3']; break;
      case 'TWENTY': modalValues = ['Pawns can pass through platforms', '4']; break;
    }
    if (modalValues) {
      this.createModal(
        modalValues[0],
        ['Continue'],
        [() => document.querySelector('.modal').remove()],
        `tutorials/${modalValues[1]}.mp4`
      )
    }
  }

  updateLevelSelect() {
    const levels = document.querySelector('.level-select-box').children;
    const levelsArray = Object.values(LEVELS);
    for (let i in levels) {
      if (typeof levels[i] !== 'object') return;
      if (levelsArray[i].locked) levels[i].classList.add('blocked');
      else levels[i].classList.remove('blocked');
    }
  }

  updateLevelUI() {
    const levelNumberElement = document.getElementById('level-number');
    levelNumberElement.innerText = `Level ${actualLevelData.levelNumber}`;
    const movementsElement = document.getElementById('movements');
    movementsElement.innerText = `Max movements: ${movements} / ${actualLevelData.movements}`;
  }

  updateOptions() {
    const optionKeys = Object.keys(options);
    optionKeys.forEach(key => {
      const optionBoxes = document.querySelectorAll(`.${key}`);
      optionBoxes.forEach(option => {
        const optionValue = option.getAttribute('data-option-value');
        if (optionValue === options[key].toString()) option.classList.add('option-box-selected');
        else option.classList.remove('option-box-selected');
      })
    })
  }

  // cleanLevelValues() {
  //   // const piecesBox = document.getElementById('pieces-box');
  //   // inBoardPieces.list.forEach(piece => piecesBox.removeChild(piece.element) );
  //   // const objectsBox = document.getElementById('objects-box');
  //   // inBoardObjects.list.forEach(object => objectsBox.removeChild(object.element) );
  //   inBoardPieces.list = [];
  //   inBoardObjects.list = [];
  //   movements = 0;
  // }

  winLevel() {
    actualLevel++;
    const levelKeys = Object.keys(LEVELS);
    const key = levelKeys[actualLevel];
    LEVELS[key].locked = false;
    this.createModal(
      'Level completed!',
      ['Go back', 'Continue'],
      [() => {
        this.cleanLevelValues();
        this.changeScreen(SCREENS.LEVEL_SELECT);
        document.removeEventListener('click', canvasMousePointer);
        document.querySelector('.modal').remove();
      }, () => {
        this.cleanLevelValues();
        this.startLevel(key);
        document.querySelector('.modal').remove();
      }]
    )
  }
}

const game = new Screen(SCREENS.TITLE);