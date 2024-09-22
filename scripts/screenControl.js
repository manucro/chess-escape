"use strict";

// Constants
const GAME_TITLE = 'Chess Escape';
const CREDITS = 'Game made by&nbsp;';

// Game controller
let game; // It turns into a Screen object when you initialize the game

// Tutorials
class Tutorial {
  constructor(level, header, videoId) {
    this.level = level;
    this.header = header;
    this.videoId = videoId;
    this.seen = false;
  }
}
const TUTORIALS = [
  new Tutorial('ONE', 'Move pieces by clicking them. Deselect with right click', '1'),
  new Tutorial('THREE', 'You can push pieces by moving one towards another', '2'),
  new Tutorial('EIGHT', "You can't move over platforms, but you can push pieces onto them", '3'),
  new Tutorial('ELEVEN', 'You can push two pieces at the same time', '4'),
  new Tutorial('THIRTEEN', "The king can't die. If he does, then the level resets", '5'),
  new Tutorial('TWENTY', 'Pawns can pass through platforms', '6'),
  new Tutorial('TWENTYEIGHT', 'Knights can crush other pieces. Be careful', '7')
]

class Screen {
  constructor(screenType) {
    this.type = screenType;
    this.screenElements = {};

    // Screens
    const titleScreen = this.createTitleScreen();
    Object.defineProperty(this.screenElements, SCREENS.TITLE, { value: titleScreen });
    const optionsBox = this.createOptions();
    Object.defineProperty(this.screenElements, SCREENS.OPTIONS, { value: optionsBox });
    const levelSelect = this.createLevelSelect();
    Object.defineProperty(this.screenElements, SCREENS.LEVEL_SELECT, { value: levelSelect, writable: true });
    const levelElement = this.createLevelScreen();
    Object.defineProperty(this.screenElements, SCREENS.LEVEL, { value: levelElement });

    // Board events
    this.boardEvents = [];

    APP.appendChild(this.screenElements[screenType]);
    MUSIC.play();
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
        if (options.soundEffects) AUDIO.click.play();
        this.changeScreen((buttonTitle === 'Play') ? SCREENS.LEVEL_SELECT : SCREENS.OPTIONS);
      });
      titleButtons.appendChild(titleButton);
    });
    const credits = create('footer', 'credits');
    credits.innerHTML = CREDITS;
    const authorLink = create('a', 'credits-author', 'Manuel Crocco');
    authorLink.target = '_blank';
    authorLink.href = 'https://github.com/manucro';
    credits.appendChild(authorLink);
    titleScreen.appendChild(titleElementBox);
    titleScreen.appendChild(titleButtons);
    titleScreen.appendChild(credits);
    return titleScreen;
  }

  createOptions() {
    const create = this.getCreateElementFunction();
    const optionsData = [
      ['Piece Set', Object.values(PIECE_SETS)],
      ['Piece Animation Speed', [0, 250, 500, 1000]],
      ['Music', [true, false]],
      ['Sound Effects', [true, false]],
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
    const optionsBackButton = this.createBackButton(() => {
      if (options.soundEffects) AUDIO.click.play();
      this.changeScreen(SCREENS.TITLE);
    });
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
          if (options.soundEffects) AUDIO.click.play();
          if (i === 2) (box) ? MUSIC.play() : MUSIC.pause() // If the option is the music, play if the user selects Yes or stop it if the user selects No
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
    const levelSelectBackButton = this.createBackButton(() => {
      if (options.soundEffects) AUDIO.click.play();
      this.changeScreen(SCREENS.TITLE);
    });
    const levelKeys = Object.keys(LEVELS);

    const prevPageButtton = create('button', 'change-page-button');
    const prevPageSprite = create('div', 'page-sprite');
    prevPageSprite.classList.add('prev-page-sprite');
    prevPageButtton.appendChild(prevPageSprite);
    prevPageButtton.type = 'button';
    if (actualLevelSelectPage <= 0) prevPageButtton.classList.add('page-button-blocked');
    else prevPageButtton.addEventListener('click', () => {
      if (options.soundEffects) AUDIO.click.play();
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
      const stars = create('div', 'stars-container');
      for (let j = 0; j < STARS_PER_LEVEL; j++) {
        const star = create('div', 'level-select-star');
        star.classList.add(`star${j}`);
        stars.appendChild(star);
      }
      levelElement.appendChild(stars);
      levelElement.addEventListener('click', () => {
        if (!LEVELS[levelName].locked) {
          if (options.soundEffects) AUDIO.click.play();
          this.changeScreen(SCREENS.LEVEL, () => this.startLevel(levelName));
        }
      });
      levelSelectBox.appendChild(levelElement);
    }

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
      if (options.soundEffects) AUDIO.click.play();
      this.cleanLevelValues();
      this.changeScreen(SCREENS.LEVEL_SELECT);
      document.removeEventListener('click', canvasMousePointer);
    });
    levelElement.appendChild(levelBackButton);
    // Restart button
    const restartButton = create('button', 'restart-button', 'Restart');
    restartButton.type = 'button';
    restartButton.addEventListener('click', () => { if (options.soundEffects) AUDIO.click.play() });
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

  createModal(elements, buttons, actions, video = null) {
    const create = this.getCreateElementFunction();
    const modal = create('div', 'modal');
    const modalBox = create('div', (video) ? 'modal-box-video' : 'modal-box');
    elements.forEach(element => {
      const el = create('div', element[0], element[1]);
      modalBox.appendChild(el);
    });
    const modalButtons = create('div', 'modal-buttons');
    buttons.forEach((button, i) => {
      const modalButton = create('button', 'modal-button', button);
      modalButton.type = 'button';
      modalButton.addEventListener('click', () => { if (options.soundEffects) AUDIO.click.play(); });
      modalButton.addEventListener('click', actions[i]);
      modalButtons.appendChild(modalButton);
    });
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

  changeScreen(newScreen, extraAction = null) {
    const change = () => {
      this.screenElements[this.type].remove();
      this.type = newScreen;
      APP.appendChild(this.screenElements[newScreen]);
      if (extraAction) extraAction();
      if (newScreen === SCREENS.LEVEL_SELECT) this.updateLevelSelect();
      if (newScreen === SCREENS.OPTIONS) this.updateOptions();
    }
    this.transitionIfNotOptimized(change);
  }

  transitionIfNotOptimized(action) {
    if (options.optimizedMode) action();
    else {
      APP.style.animation = `${TRANSITION_TIME / 1000}s ease forwards fade-out`;
      setTimeout(() => {
        action();
        APP.style.animation = `${TRANSITION_TIME / 1000}s ease forwards fade-in`;
        setTimeout(() => APP.style.animation = 'none', TRANSITION_TIME);
      }, TRANSITION_TIME);
    }
  }

  resetLevelReferences() {
    BOARD_ELEMENT = document.querySelector('.board');
    BOARD_CANVAS = document.getElementById('board-canvas');
    CANVAS_MASK = document.getElementById('canvas-mask');
    MOUSE_CANVAS = document.getElementById('mouse-canvas');
    OBJECTS_BOX = document.getElementById('objects-box');
    PIECES_BOX = document.getElementById('pieces-box');
  }

  startLevel(level) {
    this.resetLevelReferences();
    document.addEventListener('mousemove', canvasMousePointer);
    createLevel(LEVELS[level], Object.keys(LEVELS).indexOf(level));
    // Tutorial videos
    this.createLevelTutorial(level);
  }

  restartLevel() {
    // Reset the pieces
    const levelPieces = LEVELS[actualLevelData.levelKey].pieces;
    const boardPieces = inBoardPieces.list;
    const unrestartedBoardPieces = [...boardPieces];
    levelPieces.forEach((piece) => {
      // Checks if the piece already exists
      let existentPiece;
      for (let i = 0; i < unrestartedBoardPieces.length; i++) {
        const boardPiece = unrestartedBoardPieces[i];
        if (boardPiece.type !== piece[0]) continue;
        unrestartedBoardPieces.splice(i, 1);
        existentPiece = boardPiece;
        break;
      }
      if (existentPiece) {
        // If it exists, move it
        if (existentPiece.blocked) {
          existentPiece.deletePiece();
          inBoardPieces.add(piece[0], piece[1]);
        }
        existentPiece.setPosition(piece[1], 'reset');
      } else inBoardPieces.add(piece[0], piece[1]); // If it doesn't exist, create it
    });
    // Reset the board
    board = [];
    const level = LEVELS[actualLevelData.levelKey];
    level.board.forEach(row => board.push([...row]));
    drawBoard();
    this.removeBoardEvents();
    CANVAS_MASK.getContext('2d').clearRect(0, 0, CANVAS_MASK.width, CANVAS_MASK.height);
    // Reset the objects
    inBoardObjects.list.forEach(obj => obj.element.remove());
    inBoardObjects.list = [];
    const levelObjects = LEVELS[actualLevelData.levelKey].objects;
    levelObjects.forEach(obj => inBoardObjects.add(obj[0], obj[1]));
    // Reset the movements
    movements = 0;
    this.updateLevelUI();
  }

  addBoardEvent(func) {
    BOARD_ELEMENT.addEventListener('click', func);
    this.boardEvents.push(func);
  }

  removeBoardEvents() {
    this.boardEvents.forEach(ev => BOARD_ELEMENT.removeEventListener('click', ev));
    this.boardEvents = [];
  }

  createLevelTutorial(level) {
    let modalValues, tutorial;
    for (let i in TUTORIALS) {
      tutorial = TUTORIALS[i];
      if (level !== tutorial.level) continue;
      if (tutorial.seen) break;
      modalValues = [tutorial.header, tutorial.videoId];
      break;
    }
    if (modalValues) {
      const modal = this.createModal(
        [['modal-text', modalValues[0]]],
        ['Continue'],
        [() => document.querySelector('.modal').remove()],
        `tutorials/${modalValues[1]}.mp4`
      );
      APP.appendChild(modal);
      tutorial.seen = true;
    }
  }

  createBackButton(func) {
    const create = this.getCreateElementFunction();
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
      else {
        level.classList.remove('blocked');
        for (let j = 0; j < STARS_PER_LEVEL; j++) {
          const star = document.querySelector(`#l${numberIndex + 1} .star${j}`);
          if (levelKeys[numberIndex].stars[j]) star.classList.add('star-obtained');
        }
      }
    }
  }

  updateLevelUI() {
    const levelNumberElement = document.getElementById('level-number');
    levelNumberElement.innerText = `Level ${actualLevelData.levelNumber}`;
    const movementsElement = document.getElementById('movements');
    movementsElement.innerText = `Movements: ${movements} / ${actualLevelData.movements}`;
  }

  updateOptions() {
    const optionKeys = Object.keys(options);
    optionKeys.forEach(key => {
      const optionBoxes = document.querySelectorAll(`.${key}`);
      optionBoxes.forEach(option => {
        const optionValue = option.getAttribute('data-option-value');
        if (optionValue === options[key].toString()) option.classList.add('option-box-selected');
        else option.classList.remove('option-box-selected');
      });
    });
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
    // Removes the events
    this.removeBoardEvents();
  }

  winLevel() {
    if (options.soundEffects) AUDIO.success.play();
    const levelKeys = Object.keys(LEVELS);
    const actualLevelIndex = actualLevelData.levelNumber - 1;
    // Stars
    LEVELS[levelKeys[actualLevelIndex]].stars[0] = true;
    if (movements <= actualLevelData.movements) LEVELS[levelKeys[actualLevelIndex]].stars[1] = true;
    const starList = inBoardObjects.list.filter((obj) => obj.type === 'star');
    if (starList.length === 0) LEVELS[levelKeys[actualLevelIndex]].stars[2] = true;
    // Unlocks a new level if it's the last level
    if (actualLevel + 1 === actualLevelData.levelNumber) {
      actualLevel++;
      LEVELS[levelKeys[actualLevel]].locked = false;
    }
    // Creates the modal
    const modal = this.createModal(
      [
        ['modal-span', `Level ${actualLevelData.levelNumber}`],
        ['modal-text', 'Level completed!'],
        ['modal-span', `${movements} / ${actualLevelData.movements}`]
      ],
      ['Level Select', 'Retry', 'Next'],
      [() => {
        this.transitionIfNotOptimized(() => {
          this.cleanLevelValues();
          this.changeScreen(SCREENS.LEVEL_SELECT);
          document.removeEventListener('click', canvasMousePointer);
          document.querySelector('.modal').remove();
        });
      }, () => {
        this.cleanLevelValues();
        this.startLevel(actualLevelData.levelKey);
        document.querySelector('.modal').remove();
      }, () => {
        this.transitionIfNotOptimized(() => {
          this.cleanLevelValues();
          this.startLevel(levelKeys[actualLevel]);
          document.querySelector('.modal').remove();
        });
      }]
    );
    APP.appendChild(modal);
  }
}