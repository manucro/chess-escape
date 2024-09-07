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

    const titleScreen = this.createTitleScreen();
    Object.defineProperty(this.screenElements, SCREENS.TITLE, { value: titleScreen });
    const optionsBox = this.createOptions();
    Object.defineProperty(this.screenElements, SCREENS.OPTIONS, { value: optionsBox });
    const levelSelect = this.createLevelSelect();
    Object.defineProperty(this.screenElements, SCREENS.LEVEL_SELECT, { value: levelSelect, writable: true });
    const levelElement = this.createLevelScreen();
    Object.defineProperty(this.screenElements, SCREENS.LEVEL, { value: levelElement });

    APP.appendChild(this.screenElements[screenType]);
  }

  getCreateElementFunction() {
    return (type, className, content = '') => {
      const el = document.createElement(type);
      el.classList.add(className);
      el.innerText = content;
      return el;
    }
  }

  createTitleScreen() {
    const create = this.getCreateElementFunction();
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
    return titleScreen;
  }
  
  createOptions() {
    const create = this.getCreateElementFunction();
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
    const optionsBackButton = this.createBackButton(() => this.changeScreen(SCREENS.TITLE));
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
    return optionsBox;
  }

  createLevelSelect() {
    const create = this.getCreateElementFunction();
    const levelSelect = create('div', 'level-select')
    const levelSelectBox = create('div', 'level-select-box');
    const levelSelectBackButton = this.createBackButton(() => this.changeScreen(SCREENS.TITLE));
    const levelKeys = Object.keys(LEVELS);
    
    const prevPageButtton = create('button', 'change-page-button');
    const prevPageSprite = create('div', 'page-sprite');
    prevPageSprite.classList.add('prev-page-sprite');
    prevPageButtton.appendChild(prevPageSprite);
    prevPageButtton.type = 'button';
    if (actualLevelSelectPage <= 0) prevPageButtton.classList.add('page-button-blocked');
    else prevPageButtton.addEventListener('click', () => {
      actualLevelSelectPage--;
      this.screenElements[SCREENS.LEVEL_SELECT].remove();
      const newLevelSelect = this.createLevelSelect();
      this.screenElements[SCREENS.LEVEL_SELECT] = newLevelSelect;
      APP.appendChild(newLevelSelect);
      this.updateLevelSelect();
    });
    levelSelectBox.appendChild(prevPageButtton);

    for (let i = 0; i < LEVELS_PER_PAGE; i++) {
      const numberIndex = i + (actualLevelSelectPage * LEVELS_PER_PAGE);
      const levelName = levelKeys[numberIndex];
      if (levelName === undefined) break;
      const levelElement = create('div', 'level');
      levelElement.id = `l${numberIndex + 1}`;
      levelElement.innerText = numberIndex + 1;
      levelElement.addEventListener('click', () => {
        this.changeScreen(SCREENS.LEVEL);
        this.startLevel(levelName);
      });
      levelSelectBox.appendChild(levelElement);
    };

    const nextPageButtton = create('button', 'change-page-button');
    const nextPageSprite = create('div', 'page-sprite');
    nextPageSprite.classList.add('next-page-sprite');
    nextPageButtton.appendChild(nextPageSprite);
    nextPageButtton.type = 'button';
    if (actualLevelSelectPage >= Math.floor(levelKeys.length / LEVELS_PER_PAGE)) nextPageButtton.classList.add('page-button-blocked');
    else nextPageButtton.addEventListener('click', () => {
      actualLevelSelectPage++;
      this.screenElements[SCREENS.LEVEL_SELECT].remove();
      const newLevelSelect = this.createLevelSelect();
      this.screenElements[SCREENS.LEVEL_SELECT] = newLevelSelect;
      APP.appendChild(newLevelSelect);
      this.updateLevelSelect();
    });
    levelSelectBox.appendChild(nextPageButtton);

    levelSelect.appendChild(levelSelectBackButton);
    levelSelect.appendChild(levelSelectBox);
    return levelSelect;
  }
  
  createLevelScreen() {
    const create = this.getCreateElementFunction();
    const levelElement = create('div', 'level-screen');
    const levelBackButton = this.createBackButton(() => {
      this.cleanLevelValues();
      this.changeScreen(SCREENS.LEVEL_SELECT);
      document.removeEventListener('click', canvasMousePointer);
    });
    levelElement.appendChild(levelBackButton);
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
    return levelElement;
  }

  createModal(text, buttons, actions, video = null) {
    const create = this.getCreateElementFunction();
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
    return modal;
  }

  changeScreen(newScreen) {
    this.screenElements[this.type].remove();
    this.type = newScreen;
    APP.appendChild(this.screenElements[newScreen]);
    if (newScreen === SCREENS.LEVEL_SELECT) this.updateLevelSelect();
    if (newScreen === SCREENS.OPTIONS) this.updateOptions();
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
    });
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
    movements = 0;
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
      const modal = this.createModal(
        modalValues[0],
        ['Continue'],
        [() => document.querySelector('.modal').remove()],
        `tutorials/${modalValues[1]}.mp4`
      );
      APP.appendChild(modal);
    }
  }

  createBackButton(func) {
    function create(type, className, content = '') {
      const el = document.createElement(type);
      el.classList.add(className);
      el.innerText = content;
      return el;
    }
    const backButton = create('button', 'back-button');
    backButton.type = 'button';
    backButton.addEventListener('click', func);
    const backButtonSprite = create('div', 'back-button-sprite');
    backButton.appendChild(backButtonSprite);
    return backButton;
  }

  updateLevelSelect() {
    const levelKeys = Object.values(LEVELS);
    for (let i = 0; i < LEVELS_PER_PAGE; i++) {
      const numberIndex = i + (actualLevelSelectPage * LEVELS_PER_PAGE);
      const level = document.getElementById(`l${numberIndex + 1}`);
      if (level === null) break;
      if (levelKeys[numberIndex].locked) level.classList.add('blocked');
      else level.classList.remove('blocked');
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

  cleanLevelValues() {
    inBoardPieces.list = [];
    inBoardObjects.list = [];
    actualStatus = STATUS.IDLE;
    movements = 0;
    // Removes all pieces and object images
    const images = document.querySelectorAll('.piece');
    images.forEach(image => image.parentNode.removeChild(image));
    const objects = document.querySelectorAll('.object');
    objects.forEach(obj => obj.parentNode.removeChild(obj));
    // Clones the board so the event listeners are deleted
    const oldElement = document.querySelector('.board');
    const newElement = oldElement.cloneNode(true);
    oldElement.parentNode.replaceChild(newElement, oldElement);
  }

  winLevel() {
    actualLevel++;
    const levelKeys = Object.keys(LEVELS);
    const key = levelKeys[actualLevel];
    LEVELS[key].locked = false;
    const modal = this.createModal(
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
    );
    APP.appendChild(modal);
  }
}

const game = new Screen(SCREENS.TITLE);