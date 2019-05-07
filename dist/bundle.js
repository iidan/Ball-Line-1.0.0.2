webpackJsonp([0],{

/***/ 1387:
/*!*********************************!*\
  !*** ./src/scenes/PlayScene.ts ***!
  \*********************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var RoomManager_1 = __webpack_require__(/*! ../objects/Managers/RoomManager */ 1388);

var ObjMapManager_1 = __webpack_require__(/*! ../objects/Managers/ObjMapManager */ 1391);

var ScoreManager_1 = __webpack_require__(/*! ../objects/Managers/ScoreManager */ 1396);

var MenuUI_1 = __webpack_require__(/*! ../objects/MenuUI */ 1398);

var PlayScene =
/*#__PURE__*/
function (_Phaser$Scene) {
  _inherits(PlayScene, _Phaser$Scene);

  function PlayScene() {
    var _this;

    _classCallCheck(this, PlayScene);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(PlayScene).call(this, {
      key: 'MainScene'
    })); //------------------------

    _this._debug = false; //------------------------

    _this._ballsInComboArray = []; //------------------------

    _this.Music = localStorage.getItem('Music') === null ? 0 : parseInt(localStorage.getItem('Music'));
    _this.Sound = localStorage.getItem('Sound') === null ? 0 : parseInt(localStorage.getItem('Sound'));
    _this.MusTrack = null; //------------------------

    _this.ComboEndedSide = 0;
    _this.GameSpriteScale = 1.5;
    _this.BallsAreStopped = false; //------------------------

    _this._roomManager = null;
    _this._objManager = null;
    _this._scoreManager = null;
    _this._menuUI = null;
    return _this;
  }

  _createClass(PlayScene, [{
    key: "XYtoVector2",
    //------------------------//------------------------//
    //                 	   HELPERS                      //
    //------------------------//------------------------//
    value: function XYtoVector2(x, y) {
      return new Phaser.Math.Vector2(x, y);
    }
  }, {
    key: "inWorldBounds",
    value: function inWorldBounds(sprite) {
      return sprite.x > -64 * this.GameSpriteScale && sprite.x < 544 * this.GameSpriteScale && sprite.y > -64 * this.GameSpriteScale && sprite.y < 964 * this.GameSpriteScale;
    }
  }, {
    key: "computeBallRealPosition",
    value: function computeBallRealPosition(tweenStart, nextTweenStart, tweenValue) {
      var pathPoints = this._objManager.PathObject.PathPoints;
      var tweenPos = tweenStart >= 0 && tweenStart < pathPoints.length ? pathPoints[tweenStart] : pathPoints[0];
      var nextPos = tweenPos;

      if (nextTweenStart >= 0) {
        if (nextTweenStart >= pathPoints.length) {
          nextPos = pathPoints[pathPoints.length - 1];
        } else {
          nextPos = pathPoints[nextTweenStart];
        }
      }

      return new Phaser.Math.Vector2(Phaser.Math.Interpolation.Linear([tweenPos.x, nextPos.x], tweenValue), Phaser.Math.Interpolation.Linear([tweenPos.y, nextPos.y], tweenValue));
    } //------------------------//------------------------//
    //                 	     SETUP                      //
    //------------------------//------------------------//

  }, {
    key: "setupGroups",
    value: function setupGroups() {
      this.PlayerBallPhysicsGroup = this.physics.add.group();
      this.EndOfPathPhysicsGroup = this.physics.add.group();
      this.BallsPhysicsGroup = this.physics.add.group();
      this.CoinsPhysicsGroup = this.physics.add.group();
      this.UpdateGroup = this.add.group();
      this.UpdateGroup.runChildUpdate = true;
    }
  }, {
    key: "setupGameRules",
    value: function setupGameRules() {
      this.game.canvas.oncontextmenu = function (e) {
        return e.preventDefault();
      };

      this.physics.world.setBounds(29 * this.GameSpriteScale, 97 * this.GameSpriteScale, 421 * this.GameSpriteScale, 745 * this.GameSpriteScale, true, true, true, true);
      this.cameras.main.setBounds(0, 0, 480 * this.GameSpriteScale, 900 * this.GameSpriteScale);
    }
  }, {
    key: "setupManagers",
    value: function setupManagers() {
      this._roomManager = new RoomManager_1.RoomManager(this);
      this._objManager = new ObjMapManager_1.ObjMapManager(this);
      this._scoreManager = new ScoreManager_1.ScoreManager(this);
      this._menuUI = new MenuUI_1.MenuUI(this);

      this._roomManager.setupManagers();

      this._objManager.setupManagers();

      this._scoreManager.setupManagers();

      this._menuUI.setupManagers();
    }
  }, {
    key: "setupGameEnvironment",
    value: function setupGameEnvironment() {
      this.add.sprite(240 * this.GameSpriteScale, 470 * this.GameSpriteScale, 'Board').setScale(.8 * this.GameSpriteScale, .8 * this.GameSpriteScale).setOrigin(.5).setTint(0x282828).depth = 10;
      this.setupGroups();
      this.setupGameRules();
      this.setupManagers();
      this._cursors = this.input.keyboard.createCursorKeys();
      this._editorKey = this.input.keyboard.addKey('E');
    } //------------------------//------------------------//
    //                  BASIC METHODS                   //
    //------------------------//------------------------//

  }, {
    key: "create",
    value: function create() {
      this.Music = localStorage.getItem('Music') === null ? 0 : parseInt(localStorage.getItem('Music'));
      this.Sound = localStorage.getItem('Sound') === null ? 0 : parseInt(localStorage.getItem('Sound'));
      this.setupGameEnvironment();

      this._roomManager.loadMenu();
    }
  }, {
    key: "update",
    value: function update() {
      if (Phaser.Input.Keyboard.JustDown(this._editorKey)) {
        this._roomManager.loadEditor();
      }

      if (this._roomManager.IsPlaying) {
        this._objManager.correctBallIDs();
      }
    }
  }, {
    key: "Debug",
    get: function get() {
      return this._debug;
    }
  }, {
    key: "BallsInComboArray",
    get: function get() {
      return this._ballsInComboArray;
    },
    set: function set(val) {
      this._ballsInComboArray = val;
    }
  }, {
    key: "RoomManager",
    get: function get() {
      return this._roomManager;
    }
  }, {
    key: "ObjManager",
    get: function get() {
      return this._objManager;
    }
  }, {
    key: "ScoreManager",
    get: function get() {
      return this._scoreManager;
    }
  }, {
    key: "MenuUI",
    get: function get() {
      return this._menuUI;
    }
  }]);

  return PlayScene;
}(Phaser.Scene);

exports.default = PlayScene;

/***/ }),

/***/ 1388:
/*!*********************************************!*\
  !*** ./src/objects/Managers/RoomManager.ts ***!
  \*********************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Enums_1 = __webpack_require__(/*! ../../objects/Enums */ 237);

var EditorManager_1 = __webpack_require__(/*! ../../objects/Managers/EditorManager */ 1389);

var ShopManager_1 = __webpack_require__(/*! ../../objects/Managers/ShopManager */ 1390);

var RoomManager =
/*#__PURE__*/
function (_Phaser$GameObjects$G) {
  _inherits(RoomManager, _Phaser$GameObjects$G);

  function RoomManager(scene) {
    var _this;

    _classCallCheck(this, RoomManager);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(RoomManager).call(this, scene, '')); //------------------------

    _this._gameBackground = null;
    _this.Room = -1;
    _this._constBallsNumber = 10;
    _this._ballsNumber = _this._constBallsNumber;
    _this._constBallSpeed = .015;
    _this._preDefinedBallSpeed = _this._constBallSpeed;
    _this._ballSpeed = _this._preDefinedBallSpeed; //------------------------

    _this._levelNumber = 2;
    _this._mainLevelNumber = 1; //------------------------

    _this._isPlaying = false;
    _this._isGameOver = false;
    _this._menuAnim = false;
    _this.oneTimeEnter = true;
    _this._scene = scene;

    _this._scene.UpdateGroup.add(_assertThisInitialized(_this));

    _this.create();

    return _this;
  }

  _createClass(RoomManager, [{
    key: "setupBackground",
    //------------------------//------------------------//
    //                      SETUPS                      //
    //------------------------//------------------------//
    value: function setupBackground() {
      this._gameBackground = this._scene.add.sprite(200 * this._scene.GameSpriteScale, 0, 'Background_' + String(Phaser.Math.Between(1, 5))).setScale(.3 * this._scene.GameSpriteScale).setOrigin(.5, 0);
      this._gameBackground.depth = 0;
    }
  }, {
    key: "setupStartLevelValues",
    value: function setupStartLevelValues() {
      this._levelNumber = 3;
      this._isGameOver = false;
      this._SM.Score = 0;
      this._SM.Coins = 0;
      this._preDefinedBallSpeed = this._constBallSpeed;
      this._ballsNumber = this._constBallsNumber;
      this._ballSpeed = .75;
    }
  }, {
    key: "setupManagers",
    value: function setupManagers() {
      this._OM = this._scene.ObjManager;
      this._MU = this._scene.MenuUI;
      this._SM = this._scene.ScoreManager;
      this._Pl = this._scene.Player;
    } //------------------------//------------------------//
    //                    CHANGERS                      //
    //------------------------//------------------------//  

  }, {
    key: "changeBackground",
    value: function changeBackground() {
      this._gameBackground.setTexture('Background_' + String(Phaser.Math.Between(1, 5)));
    }
  }, {
    key: "controlBallSpeed",
    value: function controlBallSpeed() {
      if (this.Room == Enums_1.RoomsEnum.Game) {
        if (this.IsGameOver) {
          this._ballSpeed = .3;
        } else {
          if (this._ballSpeed > this._preDefinedBallSpeed) {
            this._ballSpeed += (this._preDefinedBallSpeed - this._ballSpeed) * .04;
          }
        }
      }
    }
  }, {
    key: "updateBallInfo",
    value: function updateBallInfo() {
      this._preDefinedBallSpeed += .005;
      this._ballSpeed = .75;
      this._ballsNumber += 10;
    } //------------------------//------------------------//
    //                  ROOMS MANAGMENT                 //
    //------------------------//------------------------//

  }, {
    key: "loadMenu",
    value: function loadMenu() {
      if (this.Room != Enums_1.RoomsEnum.Menu) {
        this.setupStartLevelValues();

        this._OM.loadLevel();

        this.Room = Enums_1.RoomsEnum.Menu;
        this._isPlaying = false;
        this._SM.Score = 0;

        this._MU.setVisibleMenuUI(true);
      }
    }
  }, {
    key: "loadMenu2",
    value: function loadMenu2() {
      if (this.Room != Enums_1.RoomsEnum.Menu) {
        this.Room = Enums_1.RoomsEnum.Menu; //this._isPlaying 				= false;

        this._SM.Score = 0; //this._MU.setVisibleMenuUI(true);
      }
    }
  }, {
    key: "touchCheck",
    value: function touchCheck() {
      this.loadGame(false); // this._isPlaying 				= true;
    }
  }, {
    key: "loadGame",
    value: function loadGame(background) {
      if (this.Room != Enums_1.RoomsEnum.Game) {
        this.Room = Enums_1.RoomsEnum.Game;
        this.setupStartLevelValues();
        this._isPlaying = true;

        this._OM.clearBallsAndCoins();

        this._OM.createBalls();

        this._OM.createCoin();

        this._MU.setVisibleMenuUI(false);

        this._scene.MusTrack = this._scene.Music ? this._scene.sound.add('Track1') : null;
        this._scene.MusTrack ? this._scene.MusTrack.play() : true;
        this._scene.MusTrack ? this._scene.MusTrack.setLoop(true) : true;
        background ? this.changeBackground() : true;
      }
    }
  }, {
    key: "loadShop",
    value: function loadShop() {
      if (this.Room != Enums_1.RoomsEnum.Shop) {
        this.Room = Enums_1.RoomsEnum.Shop;
        new ShopManager_1.ShopManager(this._scene);
      }
    }
  }, {
    key: "unLoadShop",
    value: function unLoadShop() {
      if (this.Room != Enums_1.RoomsEnum.Menu) {
        this.loadMenu2();
      }
    }
  }, {
    key: "loadGameOver",
    value: function loadGameOver() {
      if (this.Room != Enums_1.RoomsEnum.GameOver) {
        this.Room = Enums_1.RoomsEnum.GameOver;
        this._isPlaying = false;

        this._OM.PlayerObject.destroy();

        this._mainLevelNumber = 1;

        this._MU.setVisibleMenuUI(true);

        this._SM.recordScoreAndCoins();

        this._scene.MusTrack ? this._scene.MusTrack.stop() : true;
      }
    }
  }, {
    key: "loadEditor",
    value: function loadEditor() {
      if (this.Room != Enums_1.RoomsEnum.Editor) {
        this.Room = Enums_1.RoomsEnum.Editor;

        this._OM.clearBallsAndCoins();

        this._OM.clearLevel();

        this._MU.setVisibleMenuUI(false);

        new EditorManager_1.EditorManager(this._scene, this._OM.PathObject);
      }
    }
  }, {
    key: "transitionAnimationBetweenLevels",
    value: function transitionAnimationBetweenLevels() {
      var _this2 = this;

      var sprite2 = this._scene.add.sprite(240 * 1, 600 * 1, 'blackScreen').setScale(1, .8 * 1).setOrigin(.5).setTint(0x282828);

      var style = {
        font: "65px Orbitron-Bold",
        fill: "#ff0044",
        align: "center"
      };
      this._mainLevelNumber++;

      var textLevel = this._scene.add.text(220, 500, "Level " + this._mainLevelNumber, style);

      textLevel.depth = 25;
      textLevel.alpha = 0;
      sprite2.depth = 20;
      sprite2.alpha = 0;

      this._scene.add.tween({
        targets: [sprite2, textLevel],
        alpha: 1,
        duration: 1000,
        onComplete: function onComplete() {
          _this2.changeBackground();

          _this2.updateBallInfo();

          _this2._OM.loadLevel();

          _this2._OM.clearBallsAndCoins();

          _this2._OM.createCoin();

          _this2._OM.createBalls();

          _this2._scene.add.tween({
            targets: [sprite2, textLevel],
            alpha: 0,
            duration: 1800
          });
        }
      });
    }
  }, {
    key: "loadNewLevel",
    value: function loadNewLevel(callLevelNumber) {
      if (this._levelNumber == callLevelNumber) {
        this._levelNumber < 10 ? this._levelNumber += 1 : this._levelNumber = 1;
        this._SM.Coins += 10;
        this.transitionAnimationBetweenLevels();
      }
    } //------------------------//------------------------//
    //                  BASIC METHODS                   //
    //------------------------//------------------------//

  }, {
    key: "create",
    value: function create() {
      this.setupBackground();
    }
  }, {
    key: "update",
    value: function update() {
      this.controlBallSpeed();
    }
  }, {
    key: "BallsNumber",
    get: function get() {
      return this._ballsNumber;
    },
    set: function set(val) {
      this._ballsNumber = val;
    }
  }, {
    key: "BallSpeed",
    get: function get() {
      return this._ballSpeed;
    },
    set: function set(val) {
      this._ballSpeed = val;
    }
  }, {
    key: "LevelNumber",
    get: function get() {
      return this._levelNumber;
    }
  }, {
    key: "IsPlaying",
    get: function get() {
      return this._isPlaying;
    }
  }, {
    key: "IsGameOver",
    get: function get() {
      return this._isGameOver;
    },
    set: function set(val) {
      this._isGameOver = val;
    }
  }, {
    key: "getCheckMenuAnim",
    get: function get() {
      return this._menuAnim;
    }
  }]);

  return RoomManager;
}(Phaser.GameObjects.GameObject);

exports.RoomManager = RoomManager;

/***/ }),

/***/ 1389:
/*!***********************************************!*\
  !*** ./src/objects/Managers/EditorManager.ts ***!
  \***********************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var EditorManager =
/*#__PURE__*/
function (_Phaser$GameObjects$G) {
  _inherits(EditorManager, _Phaser$GameObjects$G);

  function EditorManager(scene, pathObject) {
    var _this;

    _classCallCheck(this, EditorManager);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(EditorManager).call(this, scene, ''));
    _this._type = 'Curves';
    _this._playerSpawn = null;
    _this._curves = [];
    _this._graphicsArray = [];
    _this._coinZones = [];
    _this._coinGraphicsArray = [];
    _this._scene = scene;
    _this._path = pathObject;
    _this._RM = scene.RoomManager;
    _this._OM = scene.ObjManager;
    _this._SM = scene.ScoreManager;
    _this._MU = scene.MenuUI;

    _this._scene.UpdateGroup.add(_assertThisInitialized(_this));

    _this.create();

    return _this;
  } //------------------------//------------------------//
  //                 	     SETUP                      //
  //------------------------//------------------------//


  _createClass(EditorManager, [{
    key: "setupUI",
    value: function setupUI() {
      this._buttons = {
        save: this.setupButton('Save', 90, 850),
        plus: this.setupButton('Plus', 190, 850),
        minus: this.setupButton('Minus', 290, 850),
        curve: this.setupButton('Curve', 390, 850)
      };
    }
  }, {
    key: "setupButton",
    value: function setupButton(key, x, y) {
      var spr = this._scene.add.image(x, y, key).setScale(1 * this._scene.GameSpriteScale).setOrigin(.5);

      spr.depth = 15;
      spr.setInteractive();
      spr.on('pointerdown', function (pointer) {
        if (pointer.buttons === 1) {
          switch (spr.texture.key) {
            case 'Save':
              this.saveLevel();
              break;

            case 'Plus':
              if (this._type == 'Curves') {
                this.addCurveTools();
              } else if (this._type == 'Coins') {
                this.addCoinTools();
              } else if (this._type == 'Player') {
                if (this._playerSpawn != null) {
                  this.deletePlayerSpawnPoint();
                }

                this._playerSpawn = this.createPlayerSpawnPoint();
              }

              break;

            case 'Minus':
              if (this._type == 'Curves') {
                this.deleteCurveTools();
              } else if (this._type == 'Coins') {
                this.deleteCoinTools();
              } else if (this._type == 'Player') {
                this.deletePlayerSpawnPoint();
              }

              break;

            case 'Curve':
              this._type = 'Coins';
              spr.setTexture('EditorCoin');
              spr.setScale(.5 * this._scene.GameSpriteScale);

              this._coinZones.forEach(function (element) {
                for (var i = 0; i < 2; i++) {
                  element[i].visible = true;
                }
              });

              this._curves.forEach(function (element) {
                for (var i = 0; i < 4; i++) {
                  element[i].visible = false;
                }
              });

              break;

            case 'EditorCoin':
              this._type = 'Player';
              spr.setTexture('EditorCube');
              spr.setScale(.6 * this._scene.GameSpriteScale);

              this._coinZones.forEach(function (element) {
                for (var i = 0; i < 2; i++) {
                  element[i].visible = false;
                }
              });

              break;

            case 'EditorCube':
              this._type = 'Curves';
              spr.setTexture('Curve');
              spr.setScale(1 * this._scene.GameSpriteScale);

              this._curves.forEach(function (element) {
                for (var i = 0; i < 4; i++) {
                  element[i].visible = true;
                }
              });

              break;
          }
        }
      }, this);
      return spr;
    } //------------------------//------------------------//
    //                  CURVES MANAGMENT                //
    //------------------------//------------------------//

  }, {
    key: "createBezierTools",
    value: function createBezierTools(previous) {
      var pointColors = ["0x00ff00", "0x008800", "0x888888", "0xffffff"];
      var pointsArray = [];

      for (var i = 0; i < 4; i++) {
        if (previous != null && i == 0) {
          pointsArray[i] = previous[3];
        } else {
          var draggablePoint = this.addNewBezierPoint(pointColors, i);
          pointsArray[i] = draggablePoint;
        }
      }

      var c = this._path.createBezierCurve(pointsArray[0], pointsArray[1], pointsArray[2], pointsArray[3]);

      var g = this._path.addNewGraphics();

      for (var i = 0; i < 4; i++) {
        if (previous != null && i == 0) {
          pointsArray[i].data = {
            curve: c,
            graphics: g,
            prevCurve: previous[3].data.curve,
            prevGraphics: previous[3].data.graphics
          };
        } else {
          pointsArray[i].data = {
            curve: c,
            graphics: g,
            prevCurve: null,
            prevGraphics: null
          };
        }
      }

      this._path.drawBezierCurve(c, g);

      this.setupBezierDrag(pointsArray);
      return pointsArray;
    }
  }, {
    key: "addCurveTools",
    value: function addCurveTools() {
      this._curves[this._curves.length] = this.createBezierTools(this._curves[this._curves.length - 1]);
    }
  }, {
    key: "deleteCurveTools",
    value: function deleteCurveTools() {
      var elem = this._curves[this._curves.length - 1];

      this._path.deleteBezierCurve(elem, elem[0].data.graphics);

      this._curves.pop();

      this._path._curvesNumber--;
    }
  }, {
    key: "addNewBezierPoint",
    value: function addNewBezierPoint(pointColors, i) {
      var lastPoint = this._curves[this._curves.length - 1] ? this._curves[this._curves.length - 1] : null;
      var point = lastPoint == null ? new Phaser.Math.Vector2(100, 100) : new Phaser.Math.Vector2(lastPoint[3].x, lastPoint[3].y);

      var draggablePoint = this._scene.add.image(point.x, point.y, 'EditorDragPoint').setScale(.05 * this._scene.GameSpriteScale).setOrigin(.5);

      draggablePoint.alpha = .8;
      draggablePoint.depth = 15;
      draggablePoint.setTint(pointColors[i]);
      draggablePoint.setInteractive();
      return draggablePoint;
    }
  }, {
    key: "setupBezierDrag",
    value: function setupBezierDrag(pointsArray) {
      this._scene.input.on("pointerdown", function (pointer, gObj) {
        if (this._type == 'Curves') {
          this._scene.input.setDraggable(pointsArray, true);
        } else {
          this._scene.input.setDraggable(pointsArray, false);
        }
      }, this);

      this._scene.input.on("drag", function (pointer, gObj, posX, posY) {
        if (this._type == 'Curves') {
          gObj.x = posX;
          gObj.y = posY;

          this._path.drawBezierCurve(gObj.data.curve, gObj.data.graphics);

          gObj.data.prevCurve != null ? this._path.drawBezierCurve(gObj.data.prevCurve, gObj.data.prevGraphics) : 1;
        }
      }, this);
    } //------------------------//------------------------//
    //                  PLAYER MANAGMENT                //
    //------------------------//------------------------//

  }, {
    key: "createPlayerSpawnPoint",
    value: function createPlayerSpawnPoint() {
      var spr = this._scene.add.image(100, 100, 'Player_Circle').setScale(.15 * this._scene.GameSpriteScale).setOrigin(.5);

      spr.depth = 15;
      spr.setInteractive({
        draggable: true
      });
      spr.on('drag', function (pointer, dragX, dragY) {
        if (pointer.buttons === 1) {
          if (this._type == 'Player') {
            spr.x = dragX;
            spr.y = dragY;
          }
        }
      }, this);
      return spr;
    }
  }, {
    key: "deletePlayerSpawnPoint",
    value: function deletePlayerSpawnPoint() {
      this._playerSpawn.destroy();
    } //------------------------//------------------------//
    //                  COINS MANAGMENT                 //
    //------------------------//------------------------//

  }, {
    key: "addNewGraphics",
    value: function addNewGraphics() {
      var g = this._scene.add.graphics();

      g.depth = 1;
      g.alpha = .2;
      g.clear();

      this._coinGraphicsArray.push(g);

      return g;
    }
  }, {
    key: "createCoinTools",
    value: function createCoinTools() {
      var pointColors = ["0x00ff00", "0x008800", "0x888888", "0xffffff"];
      var pointsArray = [];

      for (var i = 0; i < 2; i++) {
        var draggablePoint = this.addNewCoinPoint(pointColors, i);
        pointsArray[i] = draggablePoint;
      }

      var r = this.createCoinZone(pointsArray[0], pointsArray[1]);
      var g = this.addNewGraphics();

      for (var _i = 0; _i < 2; _i++) {
        pointsArray[_i].data = {
          rect: r,
          graphics: g
        };
      }

      this.drawCoinRect(r, g);
      this.setupCoinDrag(pointsArray);
      return pointsArray;
    }
  }, {
    key: "addCoinTools",
    value: function addCoinTools() {
      var len = this._coinZones.length;
      this._coinZones[len] = this.createCoinTools(); // console.log(this._coinZones);
    }
  }, {
    key: "deleteCoinTools",
    value: function deleteCoinTools() {
      var elem = this._coinZones[this._coinZones.length - 1];

      this._path.deleteCoinZone(elem, elem[0].data.graphics);

      this._coinZones.pop();
    }
  }, {
    key: "addNewCoinPoint",
    value: function addNewCoinPoint(pointColors, i) {
      var draggablePoint = this._scene.add.image(100, 100, 'Ball_3_a').setScale(.05 * this._scene.GameSpriteScale).setOrigin(.5);

      draggablePoint.alpha = .5;
      draggablePoint.depth = 15;
      draggablePoint.setTint(pointColors[i]);
      draggablePoint.setInteractive();
      return draggablePoint;
    }
  }, {
    key: "setupCoinDrag",
    value: function setupCoinDrag(pointsArray) {
      this._scene.input.on("pointerdown", function (pointer, gObj) {
        if (this._type == 'Coins') {
          this._scene.input.setDraggable(pointsArray, true);
        } else {
          this._scene.input.setDraggable(pointsArray, false);
        }
      }, this);

      this._scene.input.on("drag", function (pointer, gObj, posX, posY) {
        if (this._type == 'Coins') {
          gObj.x = posX;
          gObj.y = posY;
          pointsArray.forEach(function (element) {
            element.data.rect = Phaser.Geom.Rectangle.FromPoints(pointsArray, element.data.rect);
          });
          this.drawCoinRect(gObj.data.rect, gObj.data.graphics);
        }
      }, this);
    }
  }, {
    key: "createCoinZone",
    value: function createCoinZone(p1, p2) {
      var rect;
      var points = [new Phaser.Math.Vector2(p1.x, p1.y), new Phaser.Math.Vector2(p2.x, p2.y)];
      rect = Phaser.Geom.Rectangle.FromPoints(points, rect); // console.log(rect);

      this._coinZones.push(rect);

      return rect;
    }
  }, {
    key: "deleteCoinZone",
    value: function deleteCoinZone(array, graphics) {
      for (var i = 0; i < array.length; i++) {
        array[i].visible = 0;
        array[i].destroy();
      }

      graphics.clear();

      this._coinGraphicsArray.pop();
    }
  }, {
    key: "drawCoinRect",
    value: function drawCoinRect(rect, graphics) {
      graphics.clear();
      graphics.fillStyle(0xFF0000, 1);
      graphics.fillRectShape(rect);
    } //------------------------//------------------------//
    //                   SAVE & LOAD                    //
    //------------------------//------------------------//

  }, {
    key: "saveLevel",
    value: function saveLevel() {
      var level;
      var arrayCurves = [];
      var arrayCoins = [];

      for (var i = 0; i < this._path.CurvesArray.length; i++) {
        for (var j = 0; j < 4; j++) {
          var point = void 0;
          point = this._scene.XYtoVector2(this._path.CurvesArray[i][j].x, this._path.CurvesArray[i][j].y);
          arrayCurves[i * 4 + j] = point;
        }
      }

      for (var _i2 = 0; _i2 < this._coinZones.length; _i2++) {
        for (var _j = 0; _j < 2; _j++) {
          var _point = void 0;

          _point = this._scene.XYtoVector2(this._coinZones[_i2][_j].x, this._coinZones[_i2][_j].y);
          arrayCoins[_i2 * 2 + _j] = _point;
        }
      }

      level = {
        curves: this._path.CurvesArray.length,
        curvesArray: arrayCurves,
        coinZones: this._coinZones.length,
        coinZonesArray: arrayCoins,
        playerSpawn: new Phaser.Math.Vector2(this._playerSpawn.x, this._playerSpawn.y)
      };
      localStorage.setItem('level', JSON.stringify(level));
      console.log(localStorage.getItem('level'));
    } //------------------------//------------------------//
    //                  	EDITOR	                    //
    //------------------------//------------------------//

  }, {
    key: "editorManagment",
    value: function editorManagment() {
      if (Phaser.Input.Keyboard.JustDown(this._scene._cursors.space)) {
        this._path.EndOfPathSprite ? this._path.EndOfPathSprite.destroy() : true;
        this._path.PathPoints = this._path.createPointsFromCurvesArray(this._path.CurvesArray, true);

        this._OM.clearBallsAndCoins();

        this._OM.createBalls();
      }

      if (Phaser.Input.Keyboard.JustDown(this._scene._cursors.up)) {
        this._RM.BallSpeed += .025;
      }

      if (Phaser.Input.Keyboard.JustDown(this._scene._cursors.down)) {
        this._RM.BallSpeed = .015;
      }

      if (Phaser.Input.Keyboard.JustDown(this._scene._cursors.left)) {
        this._background.visible = false;
      }

      if (Phaser.Input.Keyboard.JustDown(this._scene._cursors.right)) {
        this._background.visible = true;
      }
    } //------------------------//------------------------//
    //                  BASIC METHODS                   //
    //------------------------//------------------------//

  }, {
    key: "create",
    value: function create() {
      this.setupUI();
      var rand = Phaser.Math.Between(1, 10);
      console.log('BACK' + rand);
      this._background = this._scene.add.sprite(20, 0, 'LevelBack_' + String(rand)).setOrigin(0, 0);
      this._background.depth = 0;
      this._curves = this._path.CurvesArray;
      this._graphicsArray = this._path.GraphicsArray;
    }
  }, {
    key: "update",
    value: function update() {
      this.editorManagment();
    }
  }]);

  return EditorManager;
}(Phaser.GameObjects.GameObject);

exports.EditorManager = EditorManager;

/***/ }),

/***/ 1390:
/*!*********************************************!*\
  !*** ./src/objects/Managers/ShopManager.ts ***!
  \*********************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var ShopManager =
/*#__PURE__*/
function (_Phaser$GameObjects$G) {
  _inherits(ShopManager, _Phaser$GameObjects$G);

  function ShopManager(scene) {
    var _this;

    _classCallCheck(this, ShopManager);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ShopManager).call(this, scene, '')); //------------------------   

    _this._unlock = _this.loadSkins();
    _this._styleText = {
      font: '35px Orbitron-Bold',
      fill: "#f9e83b"
    };
    _this._scene = scene;
    _this._RM = scene.RoomManager;
    _this._OM = scene.ObjManager;
    _this._SM = scene.ScoreManager;
    _this._MU = scene.MenuUI;

    _this._scene.UpdateGroup.add(_assertThisInitialized(_this));

    _this.create();

    return _this;
  } //------------------------//------------------------//
  //                 	     SETUP                      //
  //------------------------//------------------------//


  _createClass(ShopManager, [{
    key: "setupUI",
    value: function setupUI() {
      var ui = {
        background: this.setupBackground(),
        exit: this.setupButton('Exit', 40, 40),
        coins: this.setupCoins(),
        skins: this.setupSkins(),
        shop: this.setupText(240, 110, 24, 38, 'SHOP')
      };
      return ui;
    }
  }, {
    key: "setupBackground",
    value: function setupBackground() {
      var bckg = [];
      bckg[0] = this.setupSprite(240, 450, 'ShopBackground', 20, false, 1);
      bckg[1] = this.setupSprite(239, 77, 'ShopTop', 23, false, 1);
      return bckg;
    }
  }, {
    key: "setupCoins",
    value: function setupCoins() {
      var c = {
        sprite: null,
        text: null
      };
      var spr;
      var txt;
      spr = this.setupSprite(446, 33, 'Coin', 24, false, .18);
      spr.depth = 24;
      txt = this.setupText(386, 33, 24, 38, String(this._SM.AllCoins));
      c.sprite = spr;
      c.text = txt;
      return c;
    }
  }, {
    key: "setupText",
    value: function setupText(x, y, depth, size, text) {
      var txt;
      txt = this._scene.add.text(x * this._scene.GameSpriteScale, y * this._scene.GameSpriteScale, text, this._styleText);
      txt.depth = depth;
      txt.setFontSize(size * this._scene.GameSpriteScale);
      txt.setOrigin(.5);
      return txt;
    }
  }, {
    key: "setupSprite",
    value: function setupSprite(x, y, key, depth, setInteractive, scale, scaleY, tint) {
      var spr;
      scaleY = scaleY ? scaleY : scale;
      spr = this._scene.add.image(x * this._scene.GameSpriteScale, y * this._scene.GameSpriteScale, key).setScale(scale * this._scene.GameSpriteScale, scaleY * this._scene.GameSpriteScale).setOrigin(.5).setTint(tint);
      spr.depth = depth;
      setInteractive ? spr.setInteractive() : true;
      return spr;
    }
  }, {
    key: "setupButton",
    value: function setupButton(key, x, y) {
      var spr = this.setupSprite(x, y, key, 24, true, 1);
      spr.on('pointerdown', function (pointer) {
        if (pointer.buttons === 1) {
          this._scene.Sound ? this._scene.sound.play('Button') : true;
          this.destroy();
        }
      }, this);
      return spr;
    }
  }, {
    key: "setupSkins",
    value: function setupSkins() {
      var _this2 = this;

      var arr = [];
      var maxI = 3;
      var maxJ = 2;
      var winSel = this.setupSprite(140, 259, 'RoundedRectangle', 20, true, 1.2, 1.2, 0x28E975);
      winSel.setData('key', 'WinSel');

      for (var i = 0; i < maxI; i++) {
        var _loop = function _loop(j) {
          var window = [];
          var balls = [];
          var ballPos = [new Phaser.Math.Vector2(99, 224), new Phaser.Math.Vector2(142, 287), new Phaser.Math.Vector2(184, 224)];
          var xOff = j * 200;
          var yOff = i * 231;
          var skinID = i * 2 + j;
          var skinPrice = skinID * 150;

          var win = _this2.setupSprite(140 + xOff, 259 + yOff, 'RoundedRectangle', 21, true, 1.15, 1.15, 0x1f1f1f);

          win.setData('id', skinID);
          win.setInteractive();

          var winDark = _this2.setupSprite(140 + xOff, 259 + yOff, 'RoundedRectangle', 22, true, 1.15, 1.15, 0x000000);

          winDark.alpha = .8 * (1 - _this2._unlock[skinID]);
          winDark.setData('id', skinID);
          winDark.setData('price', skinPrice);

          var priceTxt = _this2.setupText(125 + xOff, 259 + yOff, 23, 24, skinPrice);

          priceTxt.alpha = 1 - _this2._unlock[skinID];

          var priceSpr = _this2.setupSprite(170 + xOff, 259 + yOff, 'Coin', 23, false, .15);

          priceSpr.alpha = 1 * (1 - _this2._unlock[skinID]);
          priceSpr.depth = 23;

          var lockSpr = _this2.setupSprite(210 + xOff, 325 + yOff, 'LockIcon', 23, false, .15);

          lockSpr.alpha = 1 * (1 - _this2._unlock[skinID]);
          win.on('pointerdown', function (pointer) {
            if (pointer.buttons === 1) {
              var id = win.getData('id');

              if (this._unlock[id]) {
                this.updateSelected(id, maxI);
                this._OM.BallType = id + 1;
              }
            }
          }, _this2);
          winDark.on('pointerdown', function (pointer) {
            if (pointer.buttons === 1) {
              var id = winDark.getData('id');

              if (!this._unlock[id]) {
                if (this._SM.AllCoins > winDark.getData('price')) {
                  this._scene.add.tween({
                    targets: [winDark, priceTxt, priceSpr, lockSpr],
                    ease: 'Quad',
                    duration: 500,
                    delay: 0,
                    angle: 0,
                    alpha: 0
                  });

                  this._unlock[id] = 1;
                  this._ui.coins.txt = this._SM.setNewAllCoins(-winDark.getData('price'));
                  localStorage.setItem('SkinUnlock' + id, '1');
                }
              }
            }
          }, _this2);

          for (var k = 0; k < 3; k++) {
            var c = String.fromCharCode(97 + k);
            var s = 'Ball_' + String(skinID + 1) + '_' + String(c);
            balls[k] = _this2.setupSprite(ballPos[k].x + xOff, ballPos[k].y + yOff, s, 21, false, .2);
          }

          window.push(win);
          window.push(winDark);
          window.push(priceTxt);
          window.push(priceSpr);
          window.push(lockSpr);
          balls.forEach(function (element) {
            window.push(element);
          });
          arr[skinID] = window;
        };

        for (var j = 0; j < maxJ; j++) {
          _loop(j);
        }

        arr[maxI * 2] = [winSel];
      }

      return arr;
    }
  }, {
    key: "loadSkins",
    value: function loadSkins() {
      var arr = [];

      for (var i = 0; i < 6; i++) {
        var t = parseInt(localStorage.getItem('SkinUnlock' + i));
        t ? arr[i] = t : arr[i] = 0;
      }

      return arr;
    }
  }, {
    key: "updateSelected",
    value: function updateSelected(id, height) {
      var _this3 = this;

      var yID = Math.floor(id / height);
      var xID = id - yID * height;
      var xOff = xID * 200;
      var yOff = yID * 231;

      this._ui.skins.forEach(function (element) {
        element.forEach(function (el) {
          if (el.getData('key') == 'WinSel') {
            el.x = (140 + xOff) * _this3._scene.GameSpriteScale;
            el.y = (259 + yOff) * _this3._scene.GameSpriteScale;
          }
        });
      });
    } //------------------------//------------------------//
    //                  BASIC METHODS                   //
    //------------------------//------------------------//

  }, {
    key: "destroy",
    value: function destroy() {
      this._ui.background.forEach(function (element) {
        element.destroy();
      });

      this._ui.skins.forEach(function (element) {
        element.forEach(function (el) {
          el.destroy();
        });
      });

      this._ui.shop.destroy();

      this._ui.exit.destroy();

      this._ui.coins.sprite.destroy();

      this._ui.coins.text.destroy();

      this._RM.unLoadShop();

      this.active = false;
    }
  }, {
    key: "create",
    value: function create() {
      this._ui = this.setupUI();
      this.updateSelected(this._OM.BallType - 1, 3);
    }
  }, {
    key: "update",
    value: function update() {}
  }]);

  return ShopManager;
}(Phaser.GameObjects.GameObject);

exports.ShopManager = ShopManager;

/***/ }),

/***/ 1391:
/*!***********************************************!*\
  !*** ./src/objects/Managers/ObjMapManager.ts ***!
  \***********************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Path_1 = __webpack_require__(/*! ../../objects/Path */ 1392);

var Ball_1 = __webpack_require__(/*! ../../objects/Ball */ 502);

var Coin_1 = __webpack_require__(/*! ../../objects/Coin */ 1393);

var Player_1 = __webpack_require__(/*! ../../objects/Player */ 1394);

var ObjMapManager =
/*#__PURE__*/
function (_Phaser$GameObjects$G) {
  _inherits(ObjMapManager, _Phaser$GameObjects$G);

  function ObjMapManager(scene) {
    var _this;

    _classCallCheck(this, ObjMapManager);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ObjMapManager).call(this, scene, '')); //------------------------

    _this._ballArray = [];
    _this._ballArrayLength = 0;
    _this._ballArrayPosition = 0;
    _this._ballType = 1;
    _this._pathSprites = []; //------------------------

    _this._playerObject = null;
    _this._coinZones = [];
    _this._scene = scene;

    _this._scene.UpdateGroup.add(_assertThisInitialized(_this));

    _this.create();

    return _this;
  }

  _createClass(ObjMapManager, [{
    key: "setupManagers",
    //------------------------//------------------------//
    //                      SETUP                   	//
    //------------------------//------------------------//	
    value: function setupManagers() {
      this._MU = this._scene.ObjManager;
      this._RM = this._scene.RoomManager;
      this._SM = this._scene.ScoreManager;
    } //------------------------//------------------------//
    //                     CHANGERS                   	//
    //------------------------//------------------------//	

  }, {
    key: "correctBallIDs",
    value: function correctBallIDs() {
      var inpArr = this._ballArray;
      var retArr = [];
      var n = 0;
      inpArr.forEach(function (element) {
        if (element != null && element != undefined) {
          retArr.push(element);
        }
      });
      retArr.sort(function (a, b) {
        var r = a.TweenStart - b.TweenStart;
        r == 0 ? r = a.TweenValue - b.TweenValue : true;
        return r;
      });
      retArr.forEach(function (element) {
        element.ID = n;
        element.IsMover = n == 0 ? true : false;
        n++;
      });
    } //------------------------//------------------------//
    //                  BALLS & COINS                   //
    //------------------------//------------------------//

  }, {
    key: "createCoin",
    value: function createCoin() {
      var coinPos = new Phaser.Geom.Point(0, 0);

      var rect = this._coinZones[Phaser.Math.Between(0, this._coinZones.length - 1)];

      coinPos = Phaser.Geom.Rectangle.Random(rect, coinPos);
      this._coinObject = new Coin_1.Coin(this._scene, coinPos.x, coinPos.y);
    }
  }, {
    key: "createBalls",
    value: function createBalls() {
      var ballsNumber = this._RM.BallsNumber;
      this._ballArrayPosition = 0;

      for (var i = ballsNumber - 1; i >= 0; i--) {
        this._ballArray[i] = new Ball_1.Ball(this._scene, this._ballType, Phaser.Math.Between(0, 2));
        this._ballArray[i].ID = i;
        this._ballArray[i].CountID = i;
        this._ballArray[i].TweenStart = (i - ballsNumber) * 32;

        if (this._ballArray[i].TweenStart >= 0) {
          this._ballArray[i].TweenPosition = this._path.PathPoints[this._ballArray[i].TweenStart];
        } else {
          this._ballArray[i].TweenPosition = this._path.PathPoints[0];
        }

        this._ballArrayPosition++;
      }

      for (var _i = 0; _i < ballsNumber; _i++) {
        this._ballArray[_i].PrevBall = this._ballArray[_i - 1];
        this._ballArray[_i].NextBall = this._ballArray[_i + 1];
      }

      this._ballArray[0]._isMover = true;
      this._ballArray[0].PrevBall = null;
      this._ballArray[ballsNumber - 1].NextBall = null;
      this.countBalls();
    }
  }, {
    key: "countBalls",
    value: function countBalls() {
      var counter = 0;

      this._ballArray.forEach(function (element) {
        if (element !== null) {
          counter++;
        }
      });

      this._ballArrayLength = counter;

      if (this._ballArrayLength === 0 && this._RM.IsPlaying) {
        if (!this._RM.IsGameOver) {
          this._RM.loadNewLevel(this._RM.LevelNumber);
        } else {
          this._RM.loadGameOver();
        }
      }
    }
  }, {
    key: "clearBallsAndCoins",
    value: function clearBallsAndCoins() {
      this._ballArray.forEach(function (element) {
        if (element != null) {
          element.destroy();
        }
      });

      this._ballArray = [];
      this._ballArrayLength = 0;
      this._coinObject ? this._coinObject.destroy() : true;
    } //------------------------//------------------------//
    //                  	LOAD MAP                    //
    //------------------------//------------------------//

  }, {
    key: "loadLevel",
    value: function loadLevel() {
      var level = this._scene.cache.json.get('Level' + this._RM.LevelNumber);

      var curvesArray = JSON.parse(JSON.stringify(level.curvesArray));
      var coinArray = JSON.parse(JSON.stringify(level.coinZonesArray));
      this.clearLevel();

      for (var i = 0; i < level.curves; i++) {
        var point = [];

        for (var j = 0; j < 4; j++) {
          point.push(curvesArray[i * 4 + j]);
          point[j].x *= this._scene.GameSpriteScale;
          point[j].y *= this._scene.GameSpriteScale;
        }

        var g = this._path.addNewGraphics();

        this._path.CurvesArray[i] = this._path.createBezierCurve(point[0], point[1], point[2], point[3]);

        this._path.drawBezierCurve(this._path.CurvesArray[i], g);
      }

      this._path.PathPoints = this._path.createPointsFromCurvesArray(this._path.CurvesArray, false);
      this._path.PathSprite = this._path.createSpriteFromCurveArray(this._path.GraphicsArray, this._RM.LevelNumber);

      for (var _i2 = 0; _i2 < level.coinZones; _i2++) {
        var _point = [];

        for (var _j = 0; _j < 2; _j++) {
          _point.push(coinArray[_i2 * 2 + _j]);

          _point[_j].x *= this._scene.GameSpriteScale;
          _point[_j].y *= this._scene.GameSpriteScale;
        }

        this._coinZones[_i2] = Phaser.Geom.Rectangle.FromPoints(_point, this._coinZones[_i2]);
      }

      this._playerObject ? this._playerObject.setPos(level.playerSpawn) : this._playerObject = new Player_1.Player(this._scene, this._ballType, level.playerSpawn.x * this._scene.GameSpriteScale, level.playerSpawn.y * this._scene.GameSpriteScale);
    }
  }, {
    key: "clearLevel",
    value: function clearLevel() {
      this._path ? this._path.destroy() : true;
      this._path = new Path_1.Path(this._scene);
      return this._path;
    }
  }, {
    key: "playerSetOFlocation",
    value: function playerSetOFlocation() {
      this._playerObject ? this._playerObject.setPos(0) : this._playerObject = new Player_1.Player(this._scene, this._ballType, 0, 0);
    } //------------------------//------------------------//
    //                  BASIC METHODS                   //
    //------------------------//------------------------//

  }, {
    key: "create",
    value: function create() {}
  }, {
    key: "update",
    value: function update() {}
  }, {
    key: "BallArray",
    get: function get() {
      return this._ballArray;
    }
  }, {
    key: "BallArrayLength",
    get: function get() {
      return this._ballArrayLength;
    }
  }, {
    key: "BallArrayPosition",
    get: function get() {
      return this._ballArrayPosition;
    },
    set: function set(val) {
      this._ballArrayPosition = val;
    }
  }, {
    key: "BallType",
    get: function get() {
      return this._ballType;
    },
    set: function set(val) {
      this._ballType = val;
    }
  }, {
    key: "PathObject",
    get: function get() {
      return this._path;
    }
  }, {
    key: "PathSprites",
    get: function get() {
      return this._pathSprites;
    }
  }, {
    key: "PlayerObject",
    get: function get() {
      return this._playerObject;
    },
    set: function set(val) {
      this._playerObject = val;
    }
  }]);

  return ObjMapManager;
}(Phaser.GameObjects.GameObject);

exports.ObjMapManager = ObjMapManager;

/***/ }),

/***/ 1392:
/*!*****************************!*\
  !*** ./src/objects/Path.ts ***!
  \*****************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Path =
/*#__PURE__*/
function (_Phaser$GameObjects$G) {
  _inherits(Path, _Phaser$GameObjects$G);

  function Path(scene) {
    var _this;

    _classCallCheck(this, Path);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Path).call(this, scene, '')); //------------------------

    _this._pathPoints = [];
    _this._curves = [];
    _this._graphicsArray = []; //------------------------

    _this._curvesNumber = 0;
    _this._levelNumber = 1;
    _this._scene = scene;

    _this._scene.UpdateGroup.add(_assertThisInitialized(_this));

    _this.create();

    return _this;
  }

  _createClass(Path, [{
    key: "addNewGraphics",
    //------------------------//------------------------//
    //              BEZIER CURVES CREATOR               //
    //------------------------//------------------------//
    value: function addNewGraphics() {
      var g = this._scene.add.graphics();

      g.depth = 1;
      g.alpha = .8;
      g.clear();

      this._graphicsArray.push(g);

      return g;
    }
  }, {
    key: "createBezierCurve",
    value: function createBezierCurve(p1, p2, p3, p4) {
      var curve = new Phaser.Curves.CubicBezier(p1, p2, p3, p4);
      this._curves[this._curvesNumber++] = curve;
      return curve;
    }
  }, {
    key: "drawBezierCurve",
    value: function drawBezierCurve(curve, graphics) {
      graphics.clear();
      graphics.lineStyle(40 * this._scene.GameSpriteScale, 0x000000);
      curve.draw(graphics);
      curve.defaultDivisions = 5;
      curve.arcLengthDivisions = 5;
    }
  }, {
    key: "deleteBezierCurve",
    value: function deleteBezierCurve(array, graphics) {
      var q;
      this._curvesNumber == 1 ? q = 0 : q = 1;

      for (var i = q; i < array.length; i++) {
        array[i].visible = 0;
      }

      graphics.clear();

      this._graphicsArray.pop();
    } //------------------------//------------------------//
    //                  CURVES MANAGMENT                //
    //------------------------//------------------------//

  }, {
    key: "createSpriteFromCurveArray",
    value: function createSpriteFromCurveArray(graphicsArray, number) {
      var img;
      this._levelNumber = number;
      graphicsArray.forEach(function (element) {
        element.generateTexture('Path' + String(number));
        element.destroy();
      });
      img = this._scene.add.image(240 * this._scene.GameSpriteScale, 450 * this._scene.GameSpriteScale, 'Path' + String(number));
      img.alpha = .25;
      return img;
    }
  }, {
    key: "createPointsFromCurvesArray",
    value: function createPointsFromCurvesArray(curves, editor) {
      var array = [];
      var endPoint;
      curves.forEach(function (element) {
        if (editor === true) {
          array = array.concat(element[0].data.curve.getDistancePoints(1));
        } else {
          array = array.concat(element.getDistancePoints(1));
        }
      });
      endPoint = array[array.length - 16];
      this.createEndPoint(endPoint);
      return array;
    }
  }, {
    key: "createEndPoint",
    value: function createEndPoint(endPoint) {
      if (this._endOfPathSprite == null) {
        this._endOfPathSprite = this._scene.add.image(endPoint.x, endPoint.y, 'Player_Circle').setScale(.15 * this._scene.GameSpriteScale).setOrigin(.5);
        this.setupPhysics(this._endOfPathSprite, this._endOfPathSprite.width * .5);
      }
    }
  }, {
    key: "setupPhysics",
    value: function setupPhysics(spr, realRadius) {
      this._scene.EndOfPathPhysicsGroup.add(spr);

      spr.body.setCircle(realRadius);
    } //------------------------//------------------------//
    //                  BASIC METHODS                   //
    //------------------------//------------------------//

  }, {
    key: "destroy",
    value: function destroy() {
      this._endOfPathSprite ? this._endOfPathSprite.destroy() : true;
      this._scene.textures.get('Path' + String(this._levelNumber)) ? this._scene.textures.remove('Path' + String(this._levelNumber)) : true;
      this._pathSprite ? this._pathSprite.destroy() : true;
      this.active = false;
    }
  }, {
    key: "create",
    value: function create() {}
  }, {
    key: "update",
    value: function update() {}
  }, {
    key: "EndOfPathSprite",
    get: function get() {
      return this._endOfPathSprite;
    }
  }, {
    key: "Path",
    get: function get() {
      return this._path;
    }
  }, {
    key: "PathPoints",
    get: function get() {
      return this._pathPoints;
    },
    set: function set(arr) {
      this._pathPoints = arr;
    }
  }, {
    key: "PathSprite",
    get: function get() {
      return this._pathSprite;
    },
    set: function set(arr) {
      this._pathSprite = arr;
    }
  }, {
    key: "CurvesArray",
    get: function get() {
      return this._curves;
    },
    set: function set(val) {
      this._curves = val;
    }
  }, {
    key: "GraphicsArray",
    get: function get() {
      return this._graphicsArray;
    }
  }, {
    key: "CurvesNumber",
    get: function get() {
      return this._curvesNumber;
    }
  }]);

  return Path;
}(Phaser.GameObjects.GameObject);

exports.Path = Path;

/***/ }),

/***/ 1393:
/*!*****************************!*\
  !*** ./src/objects/Coin.ts ***!
  \*****************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Coin =
/*#__PURE__*/
function (_Phaser$GameObjects$G) {
  _inherits(Coin, _Phaser$GameObjects$G);

  function Coin(scene, x, y) {
    var _this;

    _classCallCheck(this, Coin);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Coin).call(this, scene, ''));
    _this._isActive = true;
    _this._isDestroyed = false; //------------------------

    _this._scale = 0;
    _this._scene = scene;
    _this._x = x;
    _this._y = y;
    _this._RM = scene.RoomManager;
    _this._OM = scene.ObjManager;
    _this._SM = scene.ScoreManager;
    _this._MU = scene.MenuUI;

    _this._scene.UpdateGroup.add(_assertThisInitialized(_this));

    _this.create();

    return _this;
  }

  _createClass(Coin, [{
    key: "defineManagers",
    //------------------------//------------------------//
    //                  SETUP & DESTROY                 //
    //------------------------//------------------------//
    value: function defineManagers() {
      this._RM = this._scene.RoomManager;
      this._OM = this._scene.ObjManager;
      this._SM = this._scene.ScoreManager;
      this._MU = this._scene.MenuUI;
    }
  }, {
    key: "setupSprite",
    value: function setupSprite() {
      var spr = this._scene.physics.add.image(this._x, this._y, 'Coin').setScale(this._scale * this._scene.GameSpriteScale).setOrigin(.5);

      spr.depth = 5;
      spr.alpha = 0;
      spr.angle = 180;
      this.setupPhysics(spr);
      return spr;
    }
  }, {
    key: "setupPhysics",
    value: function setupPhysics(spr) {
      this._scene.physics.world.enableBody(spr);

      this._scene.CoinsPhysicsGroup.add(spr);

      spr.body.setCircle(spr.width * .5, 0, 0);
    }
  }, {
    key: "destroy",
    value: function destroy(create) {
      if (!this._isDestroyed) {
        if (create) {
          this._OM.createCoin();
        }

        this._isDestroyed = true;

        this._sprite.destroy();
      }
    } //------------------------//------------------------//
    //                    COLLISION                     //
    //------------------------//------------------------//

  }, {
    key: "collideWithBall",
    value: function collideWithBall() {
      this._scene.Sound ? this._scene.sound.play('Coin') : true;

      if (this._isActive) {
        this._SM.Coins++;
        this._isActive = false;
      }

      this.animationManagment(.5, 0, 150, true);
    }
  }, {
    key: "animationManagment",
    value: function animationManagment(finalScale, finalAlpha, duration, destroy) {
      var _this2 = this;

      this._scene.add.tween({
        targets: [this._sprite],
        ease: 'Quad',
        duration: duration,
        delay: 0,
        scaleX: finalScale * this._scene.GameSpriteScale,
        scaleY: finalScale * this._scene.GameSpriteScale,
        angle: 0,
        alpha: finalAlpha,
        onComplete: function onComplete() {
          destroy ? _this2.destroy(true) : true;
        }
      });
      /*
      this._scene.add.tween({
          targets: this._sprite,
          angle: -1,
          duration: 2000,
          yoyo: -1,
          loop:-1
      })
        */

    } //------------------------//------------------------//
    //                  BASIC METHODS                   //
    //------------------------//------------------------//

  }, {
    key: "create",
    value: function create() {
      this._sprite = this.setupSprite();

      this._scene.physics.add.overlap(this._sprite, this._scene.PlayerBallPhysicsGroup, this.collideWithBall.bind(this));

      this.defineManagers();
      this.animationManagment(.2, 1, 750, false);
    }
  }, {
    key: "update",
    value: function update() {
      if (this._RM.IsGameOver) {
        this.animationManagment(.5, 0, 150, true);
      }
    }
  }, {
    key: "Sprite",
    get: function get() {
      return this._sprite;
    }
  }, {
    key: "IsActive",
    get: function get() {
      return this._isActive;
    }
  }, {
    key: "IsDestroyed",
    get: function get() {
      return this._isDestroyed;
    }
  }, {
    key: "X",
    get: function get() {
      return this._x;
    }
  }, {
    key: "Y",
    get: function get() {
      return this._y;
    }
  }]);

  return Coin;
}(Phaser.GameObjects.GameObject);

exports.Coin = Coin;

/***/ }),

/***/ 1394:
/*!*******************************!*\
  !*** ./src/objects/Player.ts ***!
  \*******************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Player_Ball_1 = __webpack_require__(/*! ../objects/Player_Ball */ 1395);

var Enums_1 = __webpack_require__(/*! ./Enums */ 237);

var Player =
/*#__PURE__*/
function (_Phaser$GameObjects$G) {
  _inherits(Player, _Phaser$GameObjects$G);

  function Player(scene, type, x, y) {
    var _this;

    _classCallCheck(this, Player);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Player).call(this, scene, ''));
    _this._graphics = [];
    _this._ball = null;
    _this.spriteYpos = 357;
    _this.getAngle = 0;
    _this.checkIfShoot = false; //------------------------

    _this._isDestroyed = false;
    _this._scene = scene;
    _this._type = type;
    _this._x = x;
    _this._y = y;
    _this._RM = scene.RoomManager;
    _this._OM = scene.ObjManager;
    _this._SM = scene.ScoreManager;
    _this._MU = scene.MenuUI;

    _this._scene.UpdateGroup.add(_assertThisInitialized(_this));

    _this.create();

    return _this;
  }

  _createClass(Player, [{
    key: "defineManagers",
    //------------------------//------------------------//
    //                  SETUP & DESTROY                 //
    //------------------------//------------------------//
    value: function defineManagers() {
      this._RM = this._scene.RoomManager;
      this._OM = this._scene.ObjManager;
      this._SM = this._scene.ScoreManager;
      this._MU = this._scene.MenuUI;
    }
  }, {
    key: "setupParticles",
    value: function setupParticles() {
      var p = this._scene.add.particles('CannonShape', new Function('return ' + this._scene.cache.text.get('CannonEffect'))()); //


      p.active = true;
      p.depth = 4;
      this._particlesEmitter = p;
    }
  }, {
    key: "setupSprite",
    value: function setupSprite(key, depth) {
      var spr = this._scene.physics.add.image(this._x, this._y, key).setScale(.3 * this._scene.GameSpriteScale).setOrigin(.5, .55);

      spr.depth = depth;
      return spr;
    }
  }, {
    key: "setPos",
    value: function setPos(vector2) {
      this._x = vector2.x * this._scene.GameSpriteScale;
      this._y = vector2.y * this._scene.GameSpriteScale;
      this._sprite.x = this._x;
      this._sprite.y = this._y;
      this._spriteBack.x = this._x;
      this._spriteBack.y = this._y;

      if (this._ball) {
        this._ball.Sprite.x = this._x;
        this._ball.Sprite.y = this._y;
      }

      this.spriteYpos = 357;
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this._OM.PlayerObject = null;
      this._isDestroyed = true;
      this._ball ? this._ball.destroy(false) : true;

      this._graphics.forEach(function (element) {
        element.clear();
      });

      this._sprite.destroy();

      this._spriteBack.destroy();
    } //------------------------//------------------------//
    //                  USER INTERACTION                //
    //------------------------//------------------------//

  }, {
    key: "calculatePointerAngle",
    value: function calculatePointerAngle() {
      var cursor = this._scene.input.activePointer;
      var pointerRotation = Phaser.Math.Angle.Between(this._x, this._y, cursor.x + this._scene.cameras.main.scrollX, cursor.y + this._scene.cameras.main.scrollY);
      var realPointerAngle = Phaser.Math.RadToDeg(pointerRotation) + 90;
      this.getAngle = realPointerAngle;
      return realPointerAngle;
    }
  }, {
    key: "shootBall",
    value: function shootBall(angle) {
      this._ball.Sprite.angle = angle;
      this._sprite.an;

      this._scene.input.on('pointerup', function (pointer) {
        if (!this._isDestroyed) {
          if (this._RM.IsPlaying && !this._RM.IsGameOver) {
            if (this._ball != null && this._ball.Scale > .01 * this._scene.GameSpriteScale) {
              var vec2 = this.vectorFromAngle(Phaser.Math.DegToRad(this._ball.Sprite.angle - 90), 100);
              this.animationCannon(vec2);

              this._particlesEmitter.emitParticleAt(this._sprite.x + vec2.x, this._sprite.y + vec2.y, 15);

              this._ball.shoot(Phaser.Math.DegToRad(this._ball.Sprite.angle - 90));

              this._ball = null;
              this.checkIfShoot = true;
            }
          }
        }
      }, this);
    }
  }, {
    key: "rotateCannon",
    value: function rotateCannon(angle) {
      this.trajectoryCalculation(this._scene.input.activePointer);
      this._sprite.angle = angle;
      this._spriteBack.angle = angle;
    }
  }, {
    key: "createNewBall",
    value: function createNewBall() {
      this._ball = this._ball === null ? new Player_Ball_1.Player_Ball(this._scene, this._type, this._x, this._y) : null;
    }
  }, {
    key: "trajectoryCalculation",
    value: function trajectoryCalculation(cursor) {
      var newAngle = null;
      var isIntersect = false;
      var worldBounds = [29 * this._scene.GameSpriteScale, 97 * this._scene.GameSpriteScale, 450 * this._scene.GameSpriteScale, 845 * this._scene.GameSpriteScale];
      var angle = Math.atan2(cursor.y - this.Y, cursor.x - this.X);
      var angleVector = this.vectorFromAngle(angle, 800 * this._scene.GameSpriteScale);
      var insecPoint = [new Phaser.Geom.Point(0, 0), new Phaser.Geom.Point(0, 0)];
      var playerLines = [new Phaser.Geom.Line(0, 0, 0, 0), new Phaser.Geom.Line(0, 0, 0, 0)];
      var playerDebugLines = [new Phaser.Geom.Line(this.X, this.Y, this.X + angleVector.x, this.Y + angleVector.y), new Phaser.Geom.Line(0, 0, 0, 0)];
      var wallLines = [new Phaser.Geom.Line(worldBounds[2], worldBounds[1], worldBounds[2], worldBounds[3]), new Phaser.Geom.Line(worldBounds[0], worldBounds[1], worldBounds[0], worldBounds[3]), new Phaser.Geom.Line(worldBounds[0], worldBounds[1], worldBounds[2], worldBounds[1]), new Phaser.Geom.Line(worldBounds[0], worldBounds[3], worldBounds[2], worldBounds[3])]; //  LOGIC
      //  --------LINE 1 INTERSECTIONS

      isIntersect = this.checkForBallsIntersection(playerDebugLines[0], insecPoint[0]);

      if (!isIntersect) {
        wallLines.forEach(function (element) {
          Phaser.Geom.Intersects.LineToLine(playerDebugLines[0], element, insecPoint[0]);
        });
      } else {
        isIntersect = false;
      } //  --------LINE 2 ANGLE


      newAngle = this.getBounceAngle(insecPoint[0], worldBounds, angle);
      angleVector = this.vectorFromAngle(newAngle, 800 * this._scene.GameSpriteScale);
      playerDebugLines[1] = new Phaser.Geom.Line(insecPoint[0].x, insecPoint[0].y, insecPoint[0].x + angleVector.x, insecPoint[0].y + angleVector.y); //  --------LINE 2 INTERSECTIONS

      wallLines.forEach(function (element) {
        Phaser.Geom.Intersects.LineToLine(playerDebugLines[1], element, insecPoint[1]);
      });
      isIntersect = this.checkForBallsIntersection(playerDebugLines[1], insecPoint[1]); //  --------PREPARE LINES & DOTS

      playerLines[0] = new Phaser.Geom.Line(this.X, this.Y, insecPoint[0].x, insecPoint[0].y);

      if (!isIntersect) {
        insecPoint[1] = new Phaser.Geom.Point(playerDebugLines[1].x2, playerDebugLines[1].y2);
      }

      if (newAngle != null) {
        playerLines[1] = new Phaser.Geom.Line(insecPoint[0].x, insecPoint[0].y, insecPoint[1].x, insecPoint[1].y);
      }

      this.drawDottedLine(playerLines[0], playerLines[1], 20 * this._scene.GameSpriteScale, 3 * this._scene.GameSpriteScale);
    }
  }, {
    key: "checkForBallsIntersection",
    value: function checkForBallsIntersection(playerLine, intersectionPoint) {
      var isIntersect = false;
      var pointOffset = 17 * this._scene.GameSpriteScale;

      this._OM.BallArray.some(function (element) {
        if (element !== null) {
          var xPos = element.Sprite.x;
          var yPos = element.Sprite.y;
          var line = new Phaser.Geom.Line(xPos, yPos - pointOffset, xPos, yPos + pointOffset);
          var line2 = new Phaser.Geom.Line(xPos - pointOffset, yPos, xPos + pointOffset, yPos);
          isIntersect = Phaser.Geom.Intersects.LineToLine(playerLine, line, intersectionPoint);

          if (!isIntersect) {
            isIntersect = Phaser.Geom.Intersects.LineToLine(playerLine, line2, intersectionPoint);
            if (isIntersect) return true;
          } else {
            return true;
          }
        }
      });

      return isIntersect;
    }
  }, {
    key: "getBounceAngle",
    value: function getBounceAngle(point, rect, angle) {
      var newAngle = null;

      if (point.y < rect[1] + 2 || point.y > rect[3] - 2) {
        newAngle = Phaser.Math.DegToRad(Math.floor(360 - Phaser.Math.RadToDeg(angle)));
      } else if (point.x < rect[0] + 2 || point.x > rect[2] - 2) {
        newAngle = Phaser.Math.DegToRad(Math.floor(180 - Phaser.Math.RadToDeg(angle)));
      }

      return newAngle;
    }
  }, {
    key: "vectorFromAngle",
    value: function vectorFromAngle(rotation, length) {
      return new Phaser.Math.Vector2(Math.cos(rotation) * length, Math.sin(rotation) * length);
    }
  }, {
    key: "drawDottedLine",
    value: function drawDottedLine(arr1, arr2, dist, size) {
      var _this2 = this;

      var pointsLine = [[], []];
      var j = 0;
      Phaser.Geom.Line.GetPoints(arr1, 0, dist, pointsLine[0]);
      Phaser.Geom.Line.GetPoints(arr2, 0, dist, pointsLine[1]);
      pointsLine.forEach(function (element) {
        _this2._graphics[j].clear();

        _this2._graphics[j].fillStyle(0xFFFFFF, 1);

        element.forEach(function (element) {
          _this2._graphics[j].fillPoint(element.x, element.y, size);
        });
        j++;
      });
    } //------------------------//------------------------//
    //                  BASIC METHODS                   //
    //------------------------//------------------------//

  }, {
    key: "create",
    value: function create() {
      this._sprite = this.setupSprite('Player_Cannon', 3);
      this._spriteBack = this.setupSprite('Player_CannonBack', 2);
      this._graphics[0] = this._scene.add.graphics();
      this._graphics[0].depth = 1;
      this._graphics[1] = this._scene.add.graphics();
      this._graphics[1].depth = 4;
      this.defineManagers();
      this.createNewBall();
      this.setupParticles();
    } // cannon tween animation: shake on shot.

  }, {
    key: "animationCannon",
    value: function animationCannon(angle) {
      this._scene.add.tween({
        targets: [this._sprite, this.SpriteBack],
        scaleX: '+=.2',
        scaleY: '+=.2',
        x: this._sprite.x + angle.x,
        y: this._sprite.y + angle.y,
        duration: 50,
        yoyo: true
      });
    }
  }, {
    key: "update",
    value: function update() {
      if (!this._isDestroyed) {
        if (this._RM.IsPlaying && !this._RM.IsGameOver && this._RM.Room !== Enums_1.RoomsEnum.GameOver && this._MU.MenuAnim) {
          var ang = this.calculatePointerAngle();
          this.rotateCannon(ang);
          this._ball != null ? this.shootBall(ang) : true;
        }
      }
    }
  }, {
    key: "SpriteBack",
    get: function get() {
      return this._spriteBack;
    }
  }, {
    key: "Sprite",
    get: function get() {
      return this._sprite;
    }
  }, {
    key: "ParticlesEmitter",
    get: function get() {
      return this._particlesEmitter;
    }
  }, {
    key: "IsDestroyed",
    get: function get() {
      return this._isDestroyed;
    }
  }, {
    key: "X",
    get: function get() {
      return this._x;
    }
  }, {
    key: "Y",
    get: function get() {
      return this._y;
    }
  }]);

  return Player;
}(Phaser.GameObjects.GameObject);

exports.Player = Player;

/***/ }),

/***/ 1395:
/*!************************************!*\
  !*** ./src/objects/Player_Ball.ts ***!
  \************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Ball_1 = __webpack_require__(/*! ../objects/Ball */ 502);

var Player_Ball =
/*#__PURE__*/
function (_Phaser$GameObjects$G) {
  _inherits(Player_Ball, _Phaser$GameObjects$G);

  function Player_Ball(scene, type, x, y) {
    var _this;

    _classCallCheck(this, Player_Ball);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Player_Ball).call(this, scene, ''));
    _this._type = 0;
    _this._moveValue = 0;
    _this._ballsThatMoveArray = []; //------------------------

    _this._isBomb = Phaser.Math.Between(0, 100) < 4 ? true : false;
    _this._index = Phaser.Math.Between(0, 2); //------------------------    

    _this._x = -1;
    _this._y = -1;
    _this._scale = 0; //------------------------

    _this._isDestroyed = false;
    _this._destroyCallTries = [0, 0]; //------------------------

    _this._dontCollide = false;
    _this._nextBallObject = null;
    _this._moveBalls = false;
    _this._ballSubstitution = null;
    _this._scene = scene;
    _this._type = type;
    _this._x = x;
    _this._y = y;
    _this._RM = scene.RoomManager;
    _this._OM = scene.ObjManager;
    _this._SM = scene.ScoreManager;
    _this._MU = scene.MenuUI;

    _this._scene.UpdateGroup.add(_assertThisInitialized(_this));

    _this.create();

    return _this;
  }

  _createClass(Player_Ball, [{
    key: "defineManagers",
    //------------------------//------------------------//
    //                  SETUP & DESTROY                 //
    //------------------------//------------------------//
    value: function defineManagers() {
      this._RM = this._scene.RoomManager;
      this._OM = this._scene.ObjManager;
      this._SM = this._scene.ScoreManager;
      this._MU = this._scene.MenuUI;
    }
  }, {
    key: "setupSprite",
    value: function setupSprite() {
      var spr;
      var c;
      var s;
      var offsetY;

      if (!this._isBomb) {
        c = String.fromCharCode(97 + this._index);
        s = 'Ball_' + String(this._type) + '_' + String(c);
        spr = this._scene.add.image(this._x, this._y, String(s)).setScale(0).setOrigin(.5);
        offsetY = spr.height * .35 * .5;
      } else {
        spr = this._scene.add.image(this._x, this._y, 'Bomb').setScale(0).setOrigin(.5, .64);
        offsetY = spr.height * .4 * .5;
      }

      spr.depth = 2;
      this.setupPhysics(spr, spr.width * .15, offsetY);
      return spr;
    }
  }, {
    key: "setupPhysics",
    value: function setupPhysics(spr, realRadius, offsetY) {
      this._scene.PlayerBallPhysicsGroup.add(spr);

      spr.body.setCircle(realRadius, realRadius * 2.5, offsetY * 2.5);
      spr.body.bounce.set(1);
      spr.body.setCollideWorldBounds(true);
      spr.body.onWorldBounds = true;
      spr.body.world.on('worldbounds', function (body) {
        body.setCollideWorldBounds(false);
      }, this);
      spr.body.data = {
        object: this
      };

      this._scene.physics.add.overlap(spr, this._scene.BallsPhysicsGroup, this.collideWithBall.bind(this));
    }
  }, {
    key: "setupBallSubstitution",
    value: function setupBallSubstitution(ballConfig) {
      var ball = new Ball_1.Ball(this._scene, this._type, this._index);
      ball.Sprite.alpha = 0;
      ball.Sprite.angle = ballConfig.Angle;
      ball.TweenPosition = ballConfig.TweenPos;
      ball.TweenStart = ballConfig.TweenStart;
      ball.TweenValue = ballConfig.TweenValue;
      ball.ID = ballConfig.ID;
      ball.CountID = ballConfig.CountID;
      ball.PrevBall = ballConfig.PrevBall;
      ball.NextBall = ballConfig.NextBall;
      return ball;
    }
  }, {
    key: "setupComboCheck",
    value: function setupComboCheck(ball) {
      this._scene.BallsInComboArray = [ball];
      ball.IsCheckedForCombo = true;
      ball.checkForCombo(true, -1);
      ball.checkForCombo(false, -1);
    }
  }, {
    key: "animationManagment",
    value: function animationManagment(finalScale) {
      if (this._scale < finalScale) {
        this._scale += (finalScale - this._scale) * .1;

        this._sprite.setScale(this._scale);
      }
    }
  }, {
    key: "destroy",
    value: function destroy(fromInserting) {
      if (!this._isDestroyed) {
        if (fromInserting) {
          this._scene.BallsAreStopped = false;
          this._moveBalls = false;
          this.setupComboCheck(this._ballSubstitution);

          this._OM.BallArray.forEach(function (element) {
            if (element != null) {
              element.MoveForwards = false;
            }
          });
        }

        this._OM.PlayerObject ? this._OM.PlayerObject.createNewBall() : true;
        this._isDestroyed = true;

        this._sprite.destroy();
      }
    } //------------------------//------------------------//
    //                  BALLS INTERACTION               //
    //------------------------//------------------------//
    // speed of the ball

  }, {
    key: "shoot",
    value: function shoot(direction) {
      this._scene.physics.velocityFromRotation(direction, 1000 * this._scene.GameSpriteScale, this._sprite.body.velocity);
    }
  }, {
    key: "collideWithBall",
    value: function collideWithBall(self, other) {
      var selfObject = self.body.data.object;
      var otherObject = other.body.data.object;
      var ballConfig;

      if (!selfObject.DontCollide) {
        if (!selfObject.IsBomb) {
          var obj;
          var objIncr;
          var ball = null;
          var ballArray = this._OM.BallArray;
          var nbObj = null;
          var prevSet = null;
          var nextSet = null;
          var pathPoints = this._OM.PathObject.PathPoints;
          var p1 = 16 * this._scene.GameSpriteScale;
          var p2 = p1 + 32 * this._scene.GameSpriteScale;
          var prevPoint1 = otherObject.TweenStart - p1 > 0 ? otherObject.TweenStart - p1 : 0;
          var prevPoint2 = otherObject.TweenStart - p2 > 0 ? otherObject.TweenStart - p2 : 0;
          var nextPoint1 = otherObject.TweenStart + p1 < pathPoints.length ? otherObject.TweenStart + p1 : pathPoints.length - 1;
          var nextPoint2 = otherObject.TweenStart + p2 < pathPoints.length ? otherObject.TweenStart + p2 : pathPoints.length - 1;

          var prev = this._scene.computeBallRealPosition(prevPoint2, prevPoint1, otherObject.TweenValue);

          var next = this._scene.computeBallRealPosition(nextPoint1, nextPoint2, otherObject.TweenValue);

          var dp_arr = [prev.x, prev.y, selfObject.Sprite.x, selfObject.Sprite.y];
          var dn_arr = [next.x, next.y, selfObject.Sprite.x, selfObject.Sprite.y];
          var dist_prev = Phaser.Math.Distance.Between(dp_arr[0], dp_arr[1], dp_arr[2], dp_arr[3]);
          var dist_next = Phaser.Math.Distance.Between(dn_arr[0], dn_arr[1], dn_arr[2], dn_arr[3]);

          if (dist_next < dist_prev) {
            nbObj = otherObject.NextBall;
            prevSet = otherObject;
            nextSet = nbObj;
            obj = nbObj ? nbObj : otherObject;
            objIncr = nbObj ? 0 : 1;
          } else {
            nbObj = otherObject.PrevBall;
            prevSet = nbObj;
            nextSet = otherObject;
            obj = nbObj ? nbObj : otherObject;
            objIncr = nbObj ? 1 : 0;
          }

          ballConfig = {
            Angle: this._sprite.angle,
            TweenPos: this._OM.PathObject.PathPoints[obj.TweenStart],
            TweenStart: prevSet ? prevSet.TweenStart : otherObject.TweenStart,
            TweenValue: prevSet ? prevSet.TweenValue : otherObject.TweenValue,
            ID: obj.ID + objIncr,
            CountID: ballArray.length,
            PrevBall: prevSet,
            NextBall: nextSet
          };
          ball = this.setupBallSubstitution(ballConfig);
          ballArray[ball.CountID] = ball;
          prevSet ? prevSet.NextBall = ball : true;
          nextSet ? nextSet.PrevBall = ball : true;

          if (nextSet) {
            if (nextSet.IsMover) {
              ball.IsMover = true;
              ball.TweenStart = nextSet.TweenStart - 32;
              nextSet.IsMover = false;
              nextSet.MoveForwards = true;
            }
          }

          this._scene.Sound ? this._scene.sound.play('Tick') : true;
          this._OM.BallArray[this._OM.BallArrayPosition++] = ball;
          ball.IsMover ? this._scene.BallsAreStopped = true : this.findMover(prevSet);
          selfObject.BallSubstitution = ball;
          selfObject.NextBallObject = nextSet;
          selfObject.MoveBalls = true;
          selfObject.DontCollide = true;
        } else {
          this._scene.Sound ? this._scene.sound.play('Explosion') : true;
          this._scene.BallsInComboArray = [otherObject];
          otherObject.IsCheckedForCombo = true;
          otherObject.checkForCombo(true, 1);
          otherObject.checkForCombo(false, 1);
          selfObject.destroy();
        }
      }
    }
  }, {
    key: "findMover",
    value: function findMover(prev) {
      if (prev !== null) {
        if (prev.IsMover) {
          this._scene.BallsAreStopped = true;
          return true;
        } else {
          var b = this.findMover(prev.PrevBall);

          if (!b) {
            prev.IsMover = true;
            this._scene.BallsAreStopped = true;
          }
        }
      } else {
        return false;
      }
    }
  }, {
    key: "moveToBallPos",
    value: function moveToBallPos(ball) {
      var _this2 = this;

      var ballNextPos;

      if (ball) {
        ballNextPos = this._scene.computeBallRealPosition(ball.TweenStart, ball.TweenStart + 32 * this._scene.GameSpriteScale, ball.TweenValue);
      } else {
        ballNextPos = null;
      }

      if (ballNextPos != null) {
        this._sprite.body ? this._sprite.body.setVelocity(.4) : true;

        this._scene.add.tween({
          targets: [this._sprite],
          ease: 'Quad',
          duration: 80,
          delay: 0,
          x: ballNextPos.x,
          y: ballNextPos.y,
          onComplete: function onComplete() {
            _this2.tryToCallDestroy(1);
          }
        });
      }
    }
  }, {
    key: "moveAllBalls",
    value: function moveAllBalls(value, ball, step) {
      if (!this._destroyCallTries[0]) {
        if (ball) {
          ball.BallInsertAnimation = 2;
          ball.MoveForwards = true;
          ball.MFStep = step;
        }

        value += step;
        value < 1 ? this._moveValue = value : this.lastAllBallsMove(ball);
      }
    }
  }, {
    key: "tryToCallDestroy",
    value: function tryToCallDestroy(index) {
      var destroyCalls;
      this._destroyCallTries[index] = 1;
      destroyCalls = this._destroyCallTries[0] + this._destroyCallTries[1];

      if (destroyCalls > 0) {
        this._ballSubstitution.Sprite.alpha = 1;

        if (destroyCalls > 1) {
          this.destroy(true);
        }
      }
    }
  }, {
    key: "lastAllBallsMove",
    value: function lastAllBallsMove(ball) {
      this.tryToCallDestroy(0);
      ball ? ball.BallInsertAnimation = 0 : true;

      this._OM.BallArray.forEach(function (element) {
        if (element != null) {
          element.BallInsertAnimation = 0;
        }
      });
    } //------------------------//------------------------//
    //                  BASIC METHODS                   //
    //------------------------//------------------------//

  }, {
    key: "create",
    value: function create() {
      this._sprite = this.setupSprite();
      this.defineManagers();
    }
  }, {
    key: "update",
    value: function update() {
      if (!this._scene.inWorldBounds(this._sprite) || this._RM.IsGameOver) {
        this.destroy(false);
      } else {
        this.animationManagment(.220 * this._scene.GameSpriteScale);

        if (this._moveBalls) {
          this.moveAllBalls(this._moveValue, this._ballSubstitution, .15);
          this.moveToBallPos(this._ballSubstitution);
        }
      }
    }
  }, {
    key: "IsBomb",
    get: function get() {
      return this._isBomb;
    }
  }, {
    key: "SpriteIndex",
    get: function get() {
      return this._index;
    }
  }, {
    key: "X",
    get: function get() {
      return this._x;
    }
  }, {
    key: "Y",
    get: function get() {
      return this._y;
    }
  }, {
    key: "Sprite",
    get: function get() {
      return this._sprite;
    }
  }, {
    key: "Scale",
    get: function get() {
      return this._scale;
    }
  }, {
    key: "DontCollide",
    get: function get() {
      return this._dontCollide;
    },
    set: function set(val) {
      this._dontCollide = val;
    }
  }, {
    key: "NextBallObject",
    get: function get() {
      return this._nextBallObject;
    },
    set: function set(val) {
      this._nextBallObject = val;
    }
  }, {
    key: "MoveBalls",
    get: function get() {
      return this._moveBalls;
    },
    set: function set(val) {
      this._moveBalls = val;
    }
  }, {
    key: "BallSubstitution",
    get: function get() {
      return this._ballSubstitution;
    },
    set: function set(val) {
      this._ballSubstitution = val;
    }
  }]);

  return Player_Ball;
}(Phaser.GameObjects.GameObject);

exports.Player_Ball = Player_Ball;

/***/ }),

/***/ 1396:
/*!**********************************************!*\
  !*** ./src/objects/Managers/ScoreManager.ts ***!
  \**********************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var playsiveSDK_js_1 = __webpack_require__(/*! ../../playsive/playsiveSDK.js */ 1397);

var ScoreManager =
/*#__PURE__*/
function (_Phaser$GameObjects$G) {
  _inherits(ScoreManager, _Phaser$GameObjects$G);

  function ScoreManager(scene) {
    var _this;

    _classCallCheck(this, ScoreManager);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ScoreManager).call(this, scene, '')); //------------------------

    _this._bestScore = localStorage.getItem('Best Score') === null ? 0 : localStorage.getItem('Best Score');
    _this._score = 0; //------------------------    

    _this._coins = 0;
    _this._allCoins = localStorage.getItem('Coins') === null ? 0 : parseInt(localStorage.getItem('Coins'));
    _this._scene = scene;

    _this._scene.UpdateGroup.add(_assertThisInitialized(_this));

    _this.create();

    return _this;
  }

  _createClass(ScoreManager, [{
    key: "setupManagers",
    //------------------------
    value: function setupManagers() {}
  }, {
    key: "setNewAllCoins",
    value: function setNewAllCoins(val) {
      this._allCoins += val;
      localStorage.setItem('Coins', String(this._allCoins));
      return this._allCoins;
    }
  }, {
    key: "recordScoreAndCoins",
    value: function recordScoreAndCoins() {
      playsiveSDK_js_1.playsiveSDK.postScore(this._score);

      if (this._score > this._bestScore) {
        this._bestScore = this._score;
        localStorage.setItem('Best Score', String(this._score));
      }

      this.setNewAllCoins(this._coins);
      this._coins = 0;
    }
  }, {
    key: "create",
    value: function create() {
      playsiveSDK_js_1.playsiveSDK.gameLoaded();
    }
  }, {
    key: "update",
    value: function update() {}
  }, {
    key: "BestScore",
    get: function get() {
      return this._bestScore;
    },
    set: function set(val) {
      this._bestScore = val;
    }
  }, {
    key: "Score",
    get: function get() {
      return this._score;
    },
    set: function set(val) {
      this._score = val;
    }
  }, {
    key: "Coins",
    get: function get() {
      return this._coins;
    },
    set: function set(val) {
      this._coins = val;
    }
  }, {
    key: "AllCoins",
    get: function get() {
      return this._allCoins;
    },
    set: function set(val) {
      this._allCoins = val;
    }
  }]);

  return ScoreManager;
}(Phaser.GameObjects.GameObject);

exports.ScoreManager = ScoreManager;

/***/ }),

/***/ 1397:
/*!*************************************!*\
  !*** ./src/playsive/playsiveSDK.js ***!
  \*************************************/
/*! exports provided: playsiveSDK */
/*! all exports used */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "playsiveSDK", function() { return playsiveSDK; });
//////////////////////////////////////
// implementation of the multiplayer
// version 1.004 last update date: 23/5/2018
// written by jacob sobolev
//////////////////////////////////////

var PlaysiveSDK = function (debugMode) {
    this.debugMode = debugMode;
    this.userInfoData = undefined;
    this.bestScoreData = undefined;
    this.savedGameData = undefined;
};

//////////////////////////////////////
// Utils
//////////////////////////////////////

PlaysiveSDK.prototype.logger = function (message) {
    if (this.debugMode) {
        console.log("PlaysiveSDK Debug - " + message);
    }
};

PlaysiveSDK.prototype.postToParent = function (postData) {
    if (postData != undefined) {
        if (typeof (postData) != "object") {
            parent.postMessage(postData, "*");
        } else if (typeof (postData) == "object") {
            parent.postMessage(JSON.stringify(postData), "*");
        } else {
            this.logger("Error posting to parent");
        }
    } else {
        this.logger("Error posting to parent");
    }
};

//////////////////////////////////////
// Actions - General
//////////////////////////////////////
// The action post message to the parent, which is the mobile activity ontop
// some of the actions are posting data to update the platfom or the ui
// some of the actions wait for data to get back from the activity

PlaysiveSDK.prototype.gameLoaded = function () {
    //post action game loaded to the platfrom (the game finished loading)
    this.postToParent("gameLoaded");
    this.logger("Action Event (Game Loaded)");
};

PlaysiveSDK.prototype.loadingProgressUpdate = function (progress) {
    //post action of updating the loading progress (the game still being loaded)
    var progressToSend = progress.toFixed(0);
    var postData = {
        "type": "progress",
        "data": progressToSend
    };
    this.postToParent(postData);
    this.logger("Action Event (Loading Progress Update: " + progressToSend + ")");
};

PlaysiveSDK.prototype.postScore = function (score) {
    //post action of the score, this is done by game over state in the game
    //this will end the game and will raise the ui of the parent activity 
    this.postToParent(score);
    this.logger("Action Event (Post Score: " + score + ")");
};

PlaysiveSDK.prototype.getUserInfo = function () {
    //post action that tells the activity to send it the user inforamtion, 
    //and the callback function which will recive it
    var postData = {
        "type": "get_user_info",
        "data": "playsiveSDK.onUserInfoReceived"
    };
    this.postToParent(postData);
    this.logger("Action Event (Get user info: )");
};

PlaysiveSDK.prototype.saveGameData = function (gameData) {
    //post action that saves a data to the server
    //for the current game and the current user
    //can be primitive like int,string,float
    //can be complex object like {"coins": 1500, "rachedLevel": 15}
    var dataToSend = JSON.stringify(gameData);
    if (gameData != undefined) {
        var postData = {
            "type": "save_game_data",
            "data": dataToSend
        };
        this.postToParent(postData);
    }
    this.logger("Action Event (Save game data: " + dataToSend + ")");
};

PlaysiveSDK.prototype.getSavedGameData = function () {
    //post action that tells the activity to send the saved game data
    //for the current game and the current user
    //and the callback function which will recive it
    var postData = {
        "type": "get_game_data",
        "data": "playsiveSDK.onSavedGameDataReceived"
    };
    this.postToParent(postData);
    this.logger("Action Event (Get game data)");
};

PlaysiveSDK.prototype.getBestScore = function () {
    //post action that tells the activity to send it's the best score
    //for the current game and the current user
    //and the callback function which will recive it
    var postData = {
        "type": "get_best_score",
        "data": "playsiveSDK.onBestScoreReceived"
    };
    this.postToParent(postData);
    this.logger("Action Event (Get user best score)");
};

//////////////////////////////////////
// callbacks
//////////////////////////////////////
// callback for actions that need to get information from the platform
// the call back assignes the data so it can be access

PlaysiveSDK.prototype.onUserInfoReceived = function (data) {
    this.userInfoData = data;
    this.logger("Function Callback (onUserInfoReceived: " + data + ")");
    // code what you want to do with the data
};

PlaysiveSDK.prototype.onBestScoreReceived = function (data) {
    if (data !== null && data !== undefined && data > 0){
        this.bestScoreData = data;
        this.logger("Function Callback (onBestScoreReceived: " + data + ")");
    }
    else{
        this.bestScoreData = 0;
        this.logger("Function Callback (onBestScoreReceived: " + data + ", converted to: "+ this.onBestScoreReceived +")"); 
    }
    
    // code what you want to do with the data
};

PlaysiveSDK.prototype.onSavedGameDataReceived = function (data) {
    this.savedGameData = data;
    this.logger("Function Callback (onSavedGameDataReceived: " + data + ")");
    // code what you want to do with the data
};


var playsiveSDK     = new PlaysiveSDK(true);




//profile data exmaple

// {
// 	"status": "success",
// 	"data": {
// 		"userData": {
// 			"following_count": "66",
// 			"follower_count": "80",
// 			"level": "14",
// 			"waittime": "2",
// 			"xp": "190820",
// 			"diamonds": "-2504",
// 			"unlockedgamepercentage": "99",
// 			"minimumexperienceforcurrentlevel": "159923",
// 			"minimumexperiencefornextlevel": "213253",
// 			"diamondcost": "70",
// 			"firstname": "Tft",
// 			"lastname": "Device",
// 			"profilepic": "https://graph.facebook.com/255560104853709/picture?height=250&width=250&migration_overrides=%7Boctober_2012%3Atrue%7D",
// 			"isdeveloper": true
// 		},
// 		"games": []
// 	},
// 	"err

/***/ }),

/***/ 1398:
/*!*******************************!*\
  !*** ./src/objects/MenuUI.ts ***!
  \*******************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Enums_1 = __webpack_require__(/*! ../objects/Enums */ 237);

;

var MenuUI =
/*#__PURE__*/
function (_Phaser$GameObjects$G) {
  _inherits(MenuUI, _Phaser$GameObjects$G);

  function MenuUI(scene) {
    var _this;

    _classCallCheck(this, MenuUI);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(MenuUI).call(this, scene, ''));
    _this._rewardTimeStamp = JSON.parse(localStorage.getItem('RewardTimestamp')) ? JSON.parse(localStorage.getItem('RewardTimestamp')) : _this.setRewardTimestamp();
    _this._getReward = JSON.parse(localStorage.getItem('RewardAvailable')) ? JSON.parse(localStorage.getItem('RewardAvailable')) : false;
    _this._styleTitle = {
      font: '35px Orbitron-Bold',
      fill: "#eddf14"
    };
    _this._tapToStart = {
      font: '35px Orbitron-Bold',
      fill: "#ffffff"
    };
    _this._styleScore = {
      font: '35px Orbitron-Bold',
      fill: "#ffffff"
    };
    _this._styleReward = {
      font: '25px Orbitron-Bold',
      fill: "#ffffff"
    };
    _this.oneTime = true;
    _this.checkEnter = true;
    _this._MenuAnim = false;
    _this._scene = scene;

    _this._scene.UpdateGroup.add(_assertThisInitialized(_this));

    _this.create();

    return _this;
  }

  _createClass(MenuUI, [{
    key: "setupManagers",
    //------------------------//------------------------//
    //                       SETUP                      //
    //------------------------//------------------------//
    value: function setupManagers() {
      this._OM = this._scene.ObjManager;
      this._RM = this._scene.RoomManager;
      this._SM = this._scene.ScoreManager;
    }
  }, {
    key: "setupUI",
    value: function setupUI() {
      this._ui = {
        menuStroke: this.setupMenuStroke(true),
        rewardUI: this.setupRewardUI(),
        //play:           	this.setupButton('PlayIcon', .4, 240, 450),
        //restart:           	this.setupButton('RestartIcon', .4, 240, 660),
        topCoin: this.setupButton('Coin', .2, 400, 30),
        shop: this.setupButton('ShopIcon', .37, 238, 820),
        //sound:          	this.setupButton(this._scene.Sound == 1 ? 'SoundOn' : 'SoundOff', .3, 300, 820),
        //music:          	this.setupButton(this._scene.Music == 1 ? 'MusicOn' : 'MusicOff', .25, 238, 820),
        hand: this._scene.add.sprite(360, 660, 'Hand1'),
        blueCircle: this.setupButton('BlueCircle', .4, 217, 347).setDepth(0),
        topText: this.setupText(this._styleTitle, 240, 140, 0xffffff, 38, 15),
        tapToStart: this.setupText(this._tapToStart, 240, 580, 0xffffff, 25, 15),
        bestText: this.setupText(this._styleScore, 80, 45, 0xeddf14, 20, 15),
        bestScoreText: this.setupText(this._styleScore, 80, 75, 0xffffff, 28, 15),
        scoreText: this.setupText(this._styleScore, 240, 60, 0xffffff, 48, 15),
        coinsText: this.setupText(this._styleScore, 400, 75, 0xeddf14, 28, 15)
      };
    }
  }, {
    key: "setupButton",
    value: function setupButton(key, scale, x, y) {
      var spr = this.setupSprite(x, y, key, 15, true, scale);
      spr.on('pointerdown', function (pointer) {
        //console.log("ASDASDAS");
        if (pointer.buttons === 1) {
          switch (spr.texture.key) {
            //case 'PlayIcon': 
            //case 'RestartIcon': 
            //if (this._RM.Room != RoomsEnum.Shop) {
            ///	this._scene.Sound ? this._scene.sound.play('Button') : true;							
            //this._RM.loadGame(false);
            //this._RM.touchCheck();
            //}
            //break;
            case 'ShopIcon':
              if (this.Room != Enums_1.RoomsEnum.Shop) {
                this._scene.Sound ? this._scene.sound.play('Button') : true;

                this._RM.loadShop();
              }

              break;

            case 'MusicOn':
            case 'MusicOff':
              if (this._RM.Room != Enums_1.RoomsEnum.Shop) {
                if (this._scene.Music) {
                  spr.setTexture('MusicOff');
                  this._scene.Music = 0;
                } else {
                  spr.setTexture('MusicOn');
                  this._scene.Music = 1;
                }

                this._scene.Sound ? this._scene.sound.play('Button') : true;
                localStorage.setItem('Music', String(this._scene.Music));
              }

              break;

            case 'SoundOn':
            case 'SoundOff':
              if (this._RM.Room != Enums_1.RoomsEnum.Shop) {
                if (this._scene.Sound) {
                  spr.setTexture('SoundOff');
                  this._scene.Sound = 0;

                  this._scene.sound.play('Button');
                } else {
                  spr.setTexture('SoundOn');
                  this._scene.Sound = 1;
                }

                localStorage.setItem('Sound', String(this._scene.Sound));
              }

              break;
          }
        }
      }, this);
      return spr;
    }
  }, {
    key: "setupSprite",
    value: function setupSprite(x, y, key, depth, setInteractive, scale, scaleY, tint) {
      var spr;
      scaleY = scaleY ? scaleY : scale;
      spr = this._scene.add.image(x * this._scene.GameSpriteScale, y * this._scene.GameSpriteScale, key).setScale(scale * this._scene.GameSpriteScale, scaleY * this._scene.GameSpriteScale).setOrigin(.5).setTint(tint);
      spr.depth = depth;
      setInteractive ? spr.setInteractive() : true;
      return spr;
    }
  }, {
    key: "setupText",
    value: function setupText(style, x, y, tint, size, depth) {
      var txt = this._scene.add.text(x * this._scene.GameSpriteScale, y * this._scene.GameSpriteScale, "", style);

      txt.setDepth(depth);
      txt.setFontSize(size * this._scene.GameSpriteScale);
      txt.setTint(tint);
      txt.setOrigin(.5);
      return txt;
    }
  }, {
    key: "setupMenuStroke",
    value: function setupMenuStroke(visible) {
      var spr = this.setupSprite(240, 475, 'Board', 9, false, .72, .65, 0x282828);
      spr.alpha = .5 * visible;
      return spr;
    }
  }, {
    key: "setupTimer",
    value: function setupTimer() {
      var timer = this._scene.time.addEvent({
        delay: 1000,
        callback: function callback() {
          this.timerCountSeconds();
        },
        callbackScope: this,
        loop: true
      });
    }
  }, {
    key: "setRewardTimestamp",
    value: function setRewardTimestamp() {
      var d = new Date();
      var timeStamp = {
        hours: d.getHours() + 0,
        minutes: d.getMinutes() + 0,
        seconds: d.getSeconds() + 0
      };
      return timeStamp;
    }
  }, {
    key: "setupRewardUI",
    value: function setupRewardUI() {
      var arr;
      var d = new Date();
      var timeLeftObj = {
        hours: 0,
        minutes: 5,
        seconds: 49
      };
      var backSpr = this.setupSprite(407, 662, 'RoundedRectangle', 16, true, .7, .7, 0x48abff);
      var prizeSpr = this.setupSprite(408, 641, 'GiftBoxIcon', 17, false, .44); //prizeSpr.setAngle(30);

      var rewardTxt = this.setupText(this._styleReward, 408, 682, 0xeddf14, 15, 17);
      var timeTxt = this.setupText(this._styleReward, 408, 702, 0xffffff, 15, 17);
      var getRewardTxt = this.setupText(this._styleReward, 408, 692, 0xeddf14, 13, 17);
      backSpr.on('pointerdown', function (pointer) {
        if (pointer.buttons === 1) {
          if (this._getReward) {
            this._rewardTimeStamp = {
              hours: d.getHours() + 0,
              minutes: d.getMinutes() + 10,
              seconds: d.getSeconds() + 15
            };
            this._timeStamp = {
              hours: this._rewardTimeStamp.hours - d.getHours(),
              minutes: this._rewardTimeStamp.minutes - d.getMinutes(),
              seconds: this._rewardTimeStamp.seconds - d.getSeconds()
            };
            this.getRewardAnimation(backSpr, this._rewardTimeStamp);
          }
        }
      }, this);
      rewardTxt.setText('REWARD IN');
      timeTxt.setText('04:32:49');
      getRewardTxt.setText('GET REWARD');

      if (this._getReward) {
        rewardTxt.setAlpha(0);
        timeTxt.setAlpha(0);
        getRewardTxt.setAlpha(1);
        /*
        this._scene.add.tween({
            targets: prizeSpr,
            angle: -30,
            duration: 1000,
            yoyo: -1,
            loop:-1,
            onComplete: function() {
                if(this._getReward === false){
                    stop();
                  }
            }
        })
        */
      } else {
        rewardTxt.setAlpha(1);
        timeTxt.setAlpha(1);
        getRewardTxt.setAlpha(0);
      }

      arr = {
        back: backSpr,
        prize: prizeSpr,
        getReward: getRewardTxt,
        reward: rewardTxt,
        time: timeTxt,
        timeLeft: timeLeftObj
      };
      var h = this._rewardTimeStamp.hours - d.getHours();
      var m = this._rewardTimeStamp.minutes - d.getMinutes();
      var s = this._rewardTimeStamp.seconds - d.getSeconds();

      if (h < 0) {
        h = 0;
        m = 0;
        s = 0;
      }

      this._timeStamp = {
        hours: h,
        minutes: m,
        seconds: s
      };
      return arr;
    } //------------------------//------------------------//
    //                     UPDATERS                     //
    //------------------------//------------------------//

  }, {
    key: "getRewardAnimation",
    value: function getRewardAnimation(spr, ts) {
      var isClicked = false;
      var reward = Phaser.Math.Between(10, 50);
      var rewardObject = {
        back: spr,
        sunburst: this.setupSprite(250, 450, 'Sunburst', 18, false, 1).setAlpha(0).setAngle(0),
        coin: this.setupSprite(215, 450, 'Coin', 18, false, 0),
        reward: this.setupText(this._styleReward, 215, 450, 0xffffff, 38, 18).setOrigin(0, .5).setScale(0).setText(String(reward))
      };
      this._getReward = false;
      this.setupRewardTweens(rewardObject);
      spr.on('pointerdown', function (pointer) {
        if (pointer.buttons === 1) {
          if (!isClicked && spr.scaleX > 12) {
            isClicked = true;
            this._SM.AllCoins += reward;
            this.resetRewardTweens(rewardObject);
            localStorage.setItem('RewardTimestamp', JSON.stringify(ts));
            localStorage.setItem('RewardAvailable', JSON.stringify(this._getReward));
          }
        }
      }, this);
    }
  }, {
    key: "setupRewardTweens",
    value: function setupRewardTweens(obj) {
      var rewardUITween = this._scene.add.tween({
        targets: [this._ui.rewardUI.getReward, this._ui.rewardUI.prize],
        ease: 'Quad',
        duration: 200,
        alpha: 0,
        onComplete: function onComplete() {
          rewardUITween.stop();
        }
      });

      var backTween = this._scene.add.tween({
        targets: [obj.back],
        ease: 'Quad',
        duration: 600,
        scaleX: 15 * this._scene.GameSpriteScale,
        scaleY: 15 * this._scene.GameSpriteScale,
        onComplete: function onComplete() {
          backTween.stop();
        }
      });

      var sunAlphaTween = this._scene.add.tween({
        targets: [obj.sunburst],
        ease: 'Quad',
        duration: 600,
        alpha: .1,
        onComplete: function onComplete() {
          sunAlphaTween.stop();
        }
      });

      var sunRotTween = this._scene.add.tween({
        targets: [obj.sunburst],
        ease: 'Linear',
        duration: 35000,
        angle: 360,
        repeat: -1,
        onComplete: function onComplete() {
          sunRotTween.resetTweenData(true);
        }
      });

      var rewardTween = this._scene.add.tween({
        targets: [obj.reward],
        ease: 'Bounce.easeOut',
        duration: 800,
        scaleX: .8 * this._scene.GameSpriteScale,
        scaleY: .8 * this._scene.GameSpriteScale,
        x: 240 * this._scene.GameSpriteScale,
        onComplete: function onComplete() {
          rewardTween.stop();
        }
      });

      var coinTween = this._scene.add.tween({
        targets: [obj.coin],
        ease: 'Bounce.easeOut',
        duration: 800,
        scaleX: .2 * this._scene.GameSpriteScale,
        scaleY: .2 * this._scene.GameSpriteScale,
        onComplete: function onComplete() {
          coinTween.stop();
        }
      });
    }
  }, {
    key: "resetRewardTweens",
    value: function resetRewardTweens(obj) {
      var rewardUITween = this._scene.add.tween({
        targets: [this._ui.rewardUI.prize],
        ease: 'Quad',
        duration: 200,
        delay: 400,
        alpha: 1,
        onComplete: function onComplete() {
          rewardUITween.stop();
        }
      });

      var backTween = this._scene.add.tween({
        targets: [obj.back],
        ease: 'Quad',
        duration: 600,
        scaleX: .93 * this._scene.GameSpriteScale,
        scaleY: .74 * this._scene.GameSpriteScale,
        onComplete: function onComplete() {
          backTween.stop();
        }
      });

      var sunAlphaTween = this._scene.add.tween({
        targets: [obj.sunburst],
        ease: 'Quad',
        duration: 600,
        alpha: 0,
        onComplete: function onComplete() {
          obj.sunburst.destroy();
          sunAlphaTween.stop();
        }
      });

      var sunRotTween = this._scene.add.tween({
        targets: [obj.sunburst],
        ease: 'Quad',
        duration: 600,
        alpha: 0,
        onComplete: function onComplete() {
          obj.sunburst.destroy();
          sunRotTween.stop();
        }
      });

      var rewardTween = this._scene.add.tween({
        targets: [obj.reward],
        ease: 'Quad',
        delay: 200,
        duration: 500,
        x: 414 * this._scene.GameSpriteScale,
        y: 641 * this._scene.GameSpriteScale,
        scaleX: 0,
        scaleY: 0,
        angle: 45,
        alpha: 0,
        onComplete: function onComplete() {
          obj.reward.destroy();
          rewardTween.stop();
        }
      });

      var coinTween = this._scene.add.tween({
        targets: [obj.coin],
        ease: 'Quad',
        delay: 200,
        duration: 500,
        x: 414 * this._scene.GameSpriteScale,
        y: 641 * this._scene.GameSpriteScale,
        scaleX: 0,
        scaleY: 0,
        angle: 45,
        alpha: 0,
        onComplete: function onComplete() {
          obj.coin.destroy();
          coinTween.stop();
        }
      });

      var rewTween = this._scene.add.tween({
        targets: [this._ui.rewardUI.reward, this._ui.rewardUI.time],
        ease: 'Quad',
        duration: 500,
        alpha: 1,
        onComplete: function onComplete() {
          rewTween.stop();
        }
      });

      var getRewTween = this._scene.add.tween({
        targets: [this._ui.rewardUI.getReward],
        ease: 'Quad',
        duration: 500,
        alpha: 0,
        onComplete: function onComplete() {
          getRewTween.stop();
        }
      });
    }
  }, {
    key: "timerCountSeconds",
    value: function timerCountSeconds() {
      if (!this._getReward) {
        if (this._timeStamp.hours <= 0) {
          if (this._timeStamp.minutes <= 0) {
            if (this._timeStamp.seconds <= 0) {
              this.setGetRewardValues();
            }
          }
        }

        if (this._timeStamp.seconds <= 0) {
          this._timeStamp.seconds = 59;
          this._timeStamp.minutes--;
        } else {
          this._timeStamp.seconds--;
        }

        if (this._timeStamp.minutes <= 0) {
          if (this._timeStamp.hours > 0) {
            this._timeStamp.minutes = 59;
            this._timeStamp.hours--;
          } else {
            this._timeStamp.minutes = 0;
          }
        }
      }
    }
  }, {
    key: "setGetRewardValues",
    value: function setGetRewardValues() {
      var rewTween = this._scene.add.tween({
        targets: [this._ui.rewardUI.reward, this._ui.rewardUI.time],
        ease: 'Quad',
        duration: 500,
        alpha: 0,
        onComplete: function onComplete() {
          rewTween.stop();
        }
      });

      var getRewTween = this._scene.add.tween({
        targets: [this._ui.rewardUI.getReward],
        ease: 'Quad',
        duration: 500,
        alpha: 1,
        onComplete: function onComplete() {
          getRewTween.stop();
        }
      });

      this._timeStamp.hours = 0;
      this._timeStamp.minutes = 0;
      this._timeStamp.seconds = 0;
      this._getReward = true;
      localStorage.setItem('RewardAvailable', JSON.stringify(this._getReward));
    }
  }, {
    key: "updateUI",
    value: function updateUI() {
      this._ui.topText.setText(this._RM.Room == Enums_1.RoomsEnum.Menu ? 'BALL LINE' : 'GAME OVER');

      this._ui.bestText.setText('Best');

      this._ui.tapToStart.setText('Tap To Start');

      if (this._scene.input.activePointer.isDown) {
        var _x = this._scene.input.activePointer.x;
        var _y = this._scene.input.activePointer.y;

        if (_x > 75 && _x < 588 && _y > 270 && _y < 1150 && this.checkEnter) {
          this._RM.touchCheck();

          this.checkEnter = false;
        }
      }

      if (this.oneTime) {
        this._scene.add.tween({
          targets: this._ui.blueCircle,
          scaleX: 1.4,
          scaleY: 1.4,
          duration: 1000,
          loop: -1,
          alpha: 0
        });

        this.oneTime = false;
      }

      this._ui.bestScoreText.setText(String(this._SM.BestScore));

      this._ui.scoreText.setText(String(this._SM.Score));

      this._ui.coinsText.setText(String(this._RM.Room == Enums_1.RoomsEnum.Game ? this._SM.Coins : this._SM.AllCoins));

      if (this._RM.Room == Enums_1.RoomsEnum.Menu) {//this._ui.restart.visible	= false;
        //this._ui.play.visible		= true;
      } else if (this._RM.Room == Enums_1.RoomsEnum.GameOver) {
        //this._ui.play.visible		= false;
        //this._ui.restart.visible	= true;
        this._scene.scene.restart();

        this.oneTime = true;
        this.checkEnter = true;
        this._ui.menuStroke.alpha = 0.5;
      }

      this.updateRewardTimer();
    }
  }, {
    key: "updateRewardTimer",
    value: function updateRewardTimer() {
      var hours = this._ui.rewardUI.timeLeft.hours;
      var minutes = this._ui.rewardUI.timeLeft.minutes;
      var seconds = this._ui.rewardUI.timeLeft.seconds;
      this._ui.rewardUI.timeLeft.hours = this._timeStamp.hours;
      this._ui.rewardUI.timeLeft.minutes = this._timeStamp.minutes;
      this._ui.rewardUI.timeLeft.seconds = this._timeStamp.seconds;

      this._ui.rewardUI.time.setText((hours >= 10 ? hours : '0' + hours) + ':' + (minutes >= 10 ? minutes : '0' + minutes) + ':' + (seconds >= 10 ? Math.floor(seconds) : '0' + Math.floor(seconds)));
    }
  }, {
    key: "setVisibleMenuUI",
    value: function setVisibleMenuUI(v) {
      if (v) {
        this._ui.shop.alpha = 1;
        this._ui.rewardUI.back.alpha = 1;
        this._ui.rewardUI.prize.alpha = 1;
        this._ui.rewardUI.reward.alpha = 1;
        this._ui.rewardUI.time.alpha = 1;
        this._ui.topText.alpha = 1;
        this._ui.tapToStart.alpha = 1; ///////////////////////////////////////

        this._ui.topText.visible = v;
        this._ui.menuStroke.visible = v;
        this._ui.shop.visible = v;
        this._ui.rewardUI.back.visible = v;
        this._ui.rewardUI.prize.visible = v;
        this._ui.rewardUI.getReward.visible = v;
        this._ui.rewardUI.reward.visible = v;
        this._ui.rewardUI.time.visible = v;
        this._ui.blueCircle.visible = v;
        this._ui.hand.visible = v;

        this._ui.hand.play('snooze').setScale(0.7).setDepth(1);
      } else {
        this._ui.blueCircle.visible = v;

        var rewTween = this._scene.add.tween({
          targets: [this._ui.topText, this._ui.menuStroke, this._ui.shop, this._ui.rewardUI.back, this._ui.tapToStart, this._ui.rewardUI.prize, this._ui.rewardUI.reward, this._ui.rewardUI.time, this._ui.hand, this._ui.blueCircle],
          ease: 'Quad',
          duration: 1000,
          alpha: 0
        });
      }
    } //------------------------//------------------------//
    //                   BASIC METHODS                  //
    //------------------------//------------------------//

  }, {
    key: "create",
    value: function create() {
      this.setupUI();
      this.timerCountSeconds();
      this.setupTimer();

      this._scene.anims.create({
        key: 'snooze',
        frames: [{
          key: 'Hand1'
        }, {
          key: 'Hand2'
        }, {
          key: 'Hand2',
          duration: 650
        }],
        frameRate: 8,
        repeat: -1
      });
    }
  }, {
    key: "update",
    value: function update() {
      this.updateUI();

      if (this._ui.topText.alpha === 0 && !this._MenuAnim) {
        this._MenuAnim = true;
      }
    }
  }, {
    key: "MenuAnim",
    get: function get() {
      return this._MenuAnim;
    }
  }]);

  return MenuUI;
}(Phaser.GameObjects.GameObject);

exports.MenuUI = MenuUI;

/***/ }),

/***/ 1399:
/*!*********************************!*\
  !*** ./src/scenes/Preloader.ts ***!
  \*********************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Preloader =
/*#__PURE__*/
function (_Phaser$Scene) {
  _inherits(Preloader, _Phaser$Scene);

  function Preloader() {
    _classCallCheck(this, Preloader);

    return _possibleConstructorReturn(this, _getPrototypeOf(Preloader).call(this, {
      key: 'Preloader'
    }));
  }

  _createClass(Preloader, [{
    key: "preload",
    value: function preload() {
      // EDITOR
      this.load.image('Save', './assets/sprites/Editor/save.png');
      this.load.image('Load', './assets/sprites/Editor/load.png');
      this.load.image('Minus', './assets/sprites/Editor/minus.png');
      this.load.image('Plus', './assets/sprites/Editor/plus.png');
      this.load.image('Curve', './assets/sprites/Editor/curve.png'); // MENU

      this.load.image('RoundedRectangle', './assets/sprites/Menu/rounded.png');
      this.load.image('MenuCircle', './assets/sprites/Menu/circle.png');
      this.load.image('GiftBoxIcon', './assets/sprites/Menu/giftbox.png');
      this.load.image('Sunburst', './assets/sprites/Menu/sunburst.png');
      this.load.image('ShopIcon', './assets/sprites/Menu/cube.png');
      this.load.image('MusicOff', './assets/sprites/Menu/music_off.png');
      this.load.image('MusicOn', './assets/sprites/Menu/music_on.png');
      this.load.image('SoundOff', './assets/sprites/Menu/sound_off.png');
      this.load.image('SoundOn', './assets/sprites/Menu/sound_on.png');
      this.load.image('PlayIcon', './assets/sprites/Menu/play.png');
      this.load.image('RestartIcon', './assets/sprites/Menu/restart.png');
      this.load.image('LockIcon', './assets/sprites/Menu/lock.png');
      this.load.image('UnlockIcon', './assets/sprites/Menu/unlock.png');
      this.load.image('BlueCircle', './assets/sprites/Menu/blueCircle.png'); //this.load.spritesheet('Hand', './assets/sprites/Menu/hands.png' ,);
      // this.load.multiatlas('Hand', './assets/sprites/Menu/hands2.json', '/assets/sprites/Menu');
      //this.load.spritesheet('Hand', './assets/sprites/Menu/hands.png', {frameWidth: 271, frameHeight: 468});

      this.load.image('Hand1', './assets/sprites/Menu/hand1.png');
      this.load.image('Hand2', './assets/sprites/Menu/hand2.png');
      this.load.image('Hand3', './assets/sprites/Menu/hand3.png'); // SHOP

      this.load.image('ShopTop', './assets/sprites/Shop/backTop.png');
      this.load.image('ShopBackground', './assets/sprites/Shop/back.png');
      this.load.image('Exit', './assets/sprites/Shop/exit.png'); // GAME

      this.load.image('Board', './assets/sprites/Menu/Board.png');
      this.load.image('Player_Circle', './assets/sprites/circle.png');
      this.load.image('Player_Cannon', './assets/sprites/Balls/cannon.png');
      this.load.image('Player_CannonBack', './assets/sprites/Balls/cannon_back.png');
      this.load.image('ShopBack', './assets/BACK.png');
      this.load.image('Bomb', './assets/sprites/Balls/bomb.png');
      this.load.image('Coin', './assets/sprites/Balls/coin.png'); // Loading Balls

      for (var i = 1; i <= 6; i++) {
        for (var j = 0; j < 3; j++) {
          var c = String.fromCharCode(97 + j);
          this.load.image('Ball_' + String(i) + '_' + String(c), './assets/sprites/Balls/' + String(i) + String(c) + '.png');
        }
      } // Loading Backgrounds


      for (var _i = 1; _i <= 5; _i++) {
        this.load.image('Background_' + String(_i), './assets/sprites/Backgrounds/bg' + String(_i) + '.png');
      } // Loading Particles


      this.load.atlas('ComboShape', 'assets/particles/Combo/shapes.png', 'assets/particles/Combo/shapes.json');
      this.load.atlas('CannonShape', 'assets/particles/Cannon/shapes.png', 'assets/particles/Cannon/shapes.json');
      this.load.text('ComboEffect', 'assets/particles/Combo/combo.json');
      this.load.text('CannonEffect', 'assets/particles/Cannon/cannon.json');
      this.load.image('blackScreen', './assets/sprites/Backgrounds/blackScreen.png');
      this.load.image('spark1', './assets/sprites/Balls/blue.png');
      this.load.image('spark2', './assets/sprites/Balls/green.png');
      this.load.image('spark3', './assets/sprites/Balls/purpule2.png'); // Loading Music

      this.load.audio('Track1', './assets/sounds/song.mp3'); // Loading Sounds

      this.load.audio('Button', './assets/sounds/button.mp3');
      this.load.audio('Tick', './assets/sounds/tick.mp3');
      this.load.audio('Score', './assets/sounds/score.mp3');
      this.load.audio('Coin', './assets/sounds/fcoin.mp3');
      this.load.audio('Explosion', './assets/sounds/explosion.mp3');
      this.load.audio('Failed', './assets/sounds/failed.mp3'); // Loading Editor Things

      for (var _i2 = 1; _i2 <= 10; _i2++) {
        this.load.image('LevelBack_' + String(_i2), './assets/sprites/levels/Level ' + String(_i2) + '.png');
      }

      this.load.image('EditorDragPoint', './assets/sprites/dot.png');
      this.load.image('EditorCoin', './assets/sprites/Editor/coin.png');
      this.load.image('EditorCube', './assets/sprites/Editor/cube.png'); // Loading Levels

      for (var _i3 = 1; _i3 <= 10; _i3++) {
        this.load.json('Level' + String(_i3), './assets/levels/level' + String(_i3) + '.json');
      }

      this.load.once('complete', function () {
        this.scene.start('MainScene');
      }, this);
    }
  }]);

  return Preloader;
}(Phaser.Scene);

exports.default = Preloader; // this.level = JSON.parse(this.game.cache.getText('Level1'));

/***/ }),

/***/ 237:
/*!******************************!*\
  !*** ./src/objects/Enums.ts ***!
  \******************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var RoomsEnum;

(function (RoomsEnum) {
  RoomsEnum[RoomsEnum["Menu"] = 0] = "Menu";
  RoomsEnum[RoomsEnum["Game"] = 1] = "Game";
  RoomsEnum[RoomsEnum["Shop"] = 2] = "Shop";
  RoomsEnum[RoomsEnum["GameOver"] = 3] = "GameOver";
  RoomsEnum[RoomsEnum["Editor"] = 4] = "Editor";
})(RoomsEnum = exports.RoomsEnum || (exports.RoomsEnum = {}));

/***/ }),

/***/ 502:
/*!*****************************!*\
  !*** ./src/objects/Ball.ts ***!
  \*****************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Enums_1 = __webpack_require__(/*! ./Enums */ 237);

var Ball =
/*#__PURE__*/
function (_Phaser$GameObjects$G) {
  _inherits(Ball, _Phaser$GameObjects$G);

  function Ball(scene, type, index) {
    var _this;

    _classCallCheck(this, Ball);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Ball).call(this, scene, '')); //------------------------   

    _this._index = -1;
    _this._isCheckedForCombo = false;
    _this._isDestroying = false; //------------------------ 

    _this._tweenValue = 0; //------------------------

    _this._ballInsertAnimation = 0;
    _this._id = -1;
    _this._countID = -1; //------------------------

    _this._tweenStart = -1; //------------------------

    _this._next = null; //------------------------

    _this._prev = null; //------------------------

    _this._isMover = false;
    _this._isMoving = false;
    _this.MoveBackwards = false;
    _this.MoveForwards = false;
    _this.MFStep = 0; //------------------------

    _this.overlapCollider = null;
    _this._isAlive = true;
    _this._scene = scene;
    _this._type = type;
    _this._index = index;
    _this._RM = scene.RoomManager;
    _this._OM = scene.ObjManager;
    _this._SM = scene.ScoreManager;
    _this._MU = scene.MenuUI;

    _this._scene.UpdateGroup.add(_assertThisInitialized(_this));

    _this.create();

    return _this;
  }

  _createClass(Ball, [{
    key: "defineManagers",
    //------------------------//------------------------//
    //                  SETUP & DESTROY                 //
    //------------------------//------------------------//
    value: function defineManagers() {
      this._RM = this._scene.RoomManager;
      this._OM = this._scene.ObjManager;
      this._SM = this._scene.ScoreManager;
      this._MU = this._scene.MenuUI;
    }
  }, {
    key: "setupParticles",
    value: function setupParticles() {
      var p = this._scene.add.particles('ComboShape', new Function('return ' + this._scene.cache.text.get('ComboEffect'))()); //


      p.active = true;
      p.depth = 8;
      this._particlesEmitter = p;
    }
  }, {
    key: "setupSprite",
    value: function setupSprite() {
      var c = String.fromCharCode(97 + this._index);

      var spr = this._scene.add.image(0, 0, 'Ball_' + String(this._type) + '_' + String(c)).setScale(.220 * this._scene.GameSpriteScale).setOrigin(.5);

      var realRadius = spr.width * .5;
      spr.depth = 6;
      spr.angle = Phaser.Math.Between(0, 360);
      this.setupPhysics(spr, realRadius);
      return spr;
    }
  }, {
    key: "setupPhysics",
    value: function setupPhysics(spr, realRadius) {
      this._scene.BallsPhysicsGroup.add(spr);

      spr.body.setCircle(realRadius, 0, 0);
      spr.body.data = {
        object: this
      };
    }
  }, {
    key: "setupDebugEnvironment",
    value: function setupDebugEnvironment() {
      this.graphics = this._scene.add.graphics();
      this.graphics.depth = 15;
      this.line = new Phaser.Geom.Line(0, 0, 0, 0);
      this.line2 = new Phaser.Geom.Line(0, 0, 0, 0);
      var text = "0";
      var style = {
        font: "15px Arial",
        fill: "#000000",
        align: "center"
      };
      this._idtext = this._scene.add.text(this.Sprite.x, this.Sprite.y, text, style);
      this._idtext.depth = 16;
      this._idtext.visible = false;
    }
  }, {
    key: "animationManagment",
    value: function animationManagment(finalScale, finalAlpha, duration, destroy) {
      var _this2 = this;

      this._scene.add.tween({
        targets: [this._sprite],
        ease: 'Quad',
        duration: duration,
        delay: 0,
        scaleX: finalScale * this._scene.GameSpriteScale,
        scaleY: finalScale * this._scene.GameSpriteScale,
        angle: 0,
        alpha: finalAlpha,
        onComplete: function onComplete() {
          destroy ? _this2.destroy() : true;
        }
      });
    }
  }, {
    key: "destroy",
    value: function destroy() {
      if (this._isAlive) {
        this._isAlive = false;
        this._OM.BallArray[this.CountID] = null;
        this._next && this._isMover ? this._next._isMover = true : 1;

        if (this._prev) {
          this._prev.NextBall = null;
          this._prev = null;
        }

        if (this._next) {
          this._next.PrevBall = null;
          this._next = null;
        }

        this._OM.countBalls();

        this._sprite.destroy();
      }
    } //------------------------//------------------------//
    //                      MOVEMENT                    //
    //------------------------//------------------------//

  }, {
    key: "movement",
    value: function movement() {
      var posFin;
      this.tweenMovementControl(this._scene.BallsAreStopped);
      posFin = this._scene.computeBallRealPosition(this._tweenStart, this._tweenStart + 32 * this._scene.GameSpriteScale, this._tweenValue);
      this._sprite.x = posFin.x;
      this._sprite.y = posFin.y;
    }
  }, {
    key: "tweenMovementControl",
    value: function tweenMovementControl(stopped) {
      var nextTS = this._tweenStart + 32 * this._scene.GameSpriteScale;
      var prevTS = this._tweenStart - 32 * this._scene.GameSpriteScale;

      if (this._tweenValue < 1) {
        if (this._ballInsertAnimation != 2) {
          if (this._isMover) {
            if (!stopped) {
              this._tweenValue += this._RM.BallSpeed;
              this._isMoving = true;
            }
          } else if (this._prev && !this.MoveBackwards && !this.MoveForwards) {
            if (!stopped) {
              if (this._prev.IsMoving) {
                if (!this._prev.BallInsertAnimation) {
                  this._tweenValue = this._prev.TweenValue;
                  this._tweenStart = this._prev.TweenStart + 32 * this._scene.GameSpriteScale;
                }

                this._isMoving = true;
              }
            }
          } else {
            if (this.MoveBackwards) {
              this._tweenValue -= this._RM.BallSpeed * 4;
              this._next ? this._next.MoveBackwards = true : true;

              if (this._tweenValue <= 0) {
                this.setPrevPosition(prevTS);
              }

              this._isMoving = false;
            } else if (this.MoveForwards) {
              // this.Sprite.tint        = 0xff0000;
              this._tweenValue += this.MFStep;
              this._next ? this._next.MoveForwards = true : true;
              this._next ? this._next.MFStep = this.MFStep : true;
              this._isMoving = true;
            }
          }
        } else {
          if (this.MoveForwards) {
            // this.Sprite.tint        = 0xff0000;
            this._tweenValue += this.MFStep;
            this._next ? this._next.MoveForwards = true : true;
            this._next ? this._next.MFStep = this.MFStep : true;
          }
        }
      } else {
        this.setNewPosition(nextTS);
      }
    }
  }, {
    key: "setNewPosition",
    value: function setNewPosition(nextTS) {
      var pointsArray = this._OM.PathObject.PathPoints;

      if (this._tweenValue >= 1) {
        this._tweenValue = this._tweenValue - 1;

        if (nextTS >= this._pointsArrayLength - 32 * this._scene.GameSpriteScale || nextTS < 0) {
          var value = nextTS < 0 ? 0 : this._tweenStart;
          this._tweenPosition = pointsArray[value];

          if (nextTS < 0) {
            this._tweenStart += 32 * this._scene.GameSpriteScale;
          } else {
            this._tweenValue = 1;
          }
        } else {
          this._tweenStart += 32 * this._scene.GameSpriteScale;
          this._tweenPosition = pointsArray[this._tweenStart];
        }
      }
    }
  }, {
    key: "setPrevPosition",
    value: function setPrevPosition(prevTS) {
      var pointsArray = this._OM.PathObject.PathPoints;

      if (this._tweenValue <= 0) {
        this._tweenValue = this._tweenValue + 1;
        this._tweenStart -= 32 * this._scene.GameSpriteScale;
        this._tweenPosition = pointsArray[this._tweenStart];
      }
    }
  }, {
    key: "moveAllNextBalls",
    value: function moveAllNextBalls(value, step, bIA) {
      this._ballInsertAnimation = bIA;

      if (bIA == 2) {
        this._tweenValue += step;
      }

      this._next ? this._next.moveAllNextBalls(value, step, 1) : 1;
    } //------------------------//------------------------//
    //                     COLLISION                    //
    //------------------------//------------------------//

  }, {
    key: "checkForCombo",
    value: function checkForCombo(toNext, leftToExplode) {
      var cmpObj = toNext ? this._next : this._prev;

      if (leftToExplode !== -1) {
        if (cmpObj !== null) {
          if (this._scene.BallsInComboArray.length < 6) {
            cmpObj.IsCheckedForCombo = true;

            this._scene.BallsInComboArray.push(cmpObj);

            cmpObj.checkForCombo(toNext, 1);
            return;
          }
        }

        this.callComboEnd(true);
      } else {
        if (cmpObj !== null) {
          if (!cmpObj.IsCheckedForCombo) {
            if (cmpObj.SpriteIndex === this._index) {
              cmpObj.IsCheckedForCombo = true;

              this._scene.BallsInComboArray.push(cmpObj);

              cmpObj.checkForCombo(toNext, -1);
              return;
            }
          }
        }

        this.callComboEnd(false);
      }
    }
  }, {
    key: "callComboEnd",
    value: function callComboEnd(isBomb) {
      var _this3 = this;

      var retArr = this._scene.BallsInComboArray;
      this._scene.ComboEndedSide++;
      if (this._scene.ComboEndedSide < 2) return;
      this._scene.ComboEndedSide = 0;
      retArr.forEach(function (element) {
        element.IsCheckedForCombo = false;
      });
      if (!(retArr.length >= 3 || isBomb)) return;
      this._scene.Sound ? this._scene.sound.play('Score') : true;
      this._SM.Score += retArr.length;
      retArr.sort(function (a, b) {
        return a.ID - b.ID;
      });

      if (retArr[retArr.length - 1].NextBall) {
        if (!retArr[0].IsMover) {
          retArr[retArr.length - 1].NextBall.MoveBackwards = true;
        }
      }
      /*
      retArr.forEach(element => {
          let e                       = element.ParticlesEmitter.createEmitter({
              "active":true,
              "visible":true,
              "collideBottom":true,
              "collideLeft":true,
              "collideRight":true,
              "collideTop":true,
              "on":false,
              "particleBringToTop":true,
              "radial":true,
              "frame":{"frames":["symbol_01"],"cycle":false,"quantity":0},
              "frequency":0,
              "gravityX":0,
              "gravityY":0,
              "maxParticles":10,
              "timeScale":1,
              "blendMode":0,
              "accelerationX":0,
              "accelerationY":0,
              "alpha":{"start":1,"end":0,"ease":"Circ.easeIn"},
              "angle":{"ease":"Sine.easeIn","min":0,"max":360},
              "bounce":0,
              "delay":0,
              "lifespan":{"ease":"Quart.easeOut","min":500,"max":1000},
              "maxVelocityX":10000,
              "maxVelocityY":10000,
              "moveToX":0,
              "moveToY":0,
              "quantity":4,
              "rotate":{"ease":"Quad.easeIn","min":0,"max":360},
              "scale":{"start":0,"end":4 * this._scene.GameSpriteScale,"ease":"Quad.easeOut"},
              "speed":{"ease":"Linear","min":3,"max":100},
              "tint": 0xF2D02A
          });
          
          //e.emitParticleAt(element.Sprite.x, element.Sprite.y, 125);
          */


      var color;
      var temp = String(this._type) + String.fromCharCode(97 + this._index);

      if (temp === "1b" || temp === "4c" || temp === "6a") {
        color = 0x713E98;
      } else if (temp === "1c" || temp === "3b" || temp === "5a") {
        color = 0x29B35A;
      } else if (temp === "2b" || temp === "3a" || temp === "6c") {
        color = 0xEF4923;
      } else if (temp === "2c" || temp === "4a" || temp === "6b") {
        color = 0xF061A4;
      } else if (temp === "2a" || temp === "4b" || temp === "5c") {
        color = 0xF6891E;
      }

      retArr.forEach(function (element) {
        var emitter = _this3._scene.add.particles('spark1').createEmitter({
          blendMode: 'SCREEN',
          scale: {
            start: 0.35,
            end: 0
          },
          speed: {
            min: -100,
            max: 100
          },
          quantity: 4,
          lifespan: {
            "ease": "Quart.easeOut",
            "min": 500,
            "max": 1000
          },
          active: true,
          visible: true,
          collideBottom: true,
          collideLeft: true,
          collideRight: true,
          collideTop: true,
          on: false,
          particleBringToTop: true,
          angle: {
            min: 0,
            max: 360
          },
          // gravityY: 800,
          tint: color
        });

        emitter.emitParticleAt(element.Sprite.x, element.Sprite.y, 150);
        element.animationManagment(1, 0, 100, true); ////////////////shake camera on combo//////////////////
        //  var tempvalue = 10;
        //   var min = -2;
        //  var max = 2;
        //  this._scene.cameras.main.x+= Math.floor(Math.random() * (max - min + 1)) + min;
        // this._scene.cameras.main.y+= Math.floor(Math.random() * (max - min + 1)) + min;
        ///////////////////////////////////////////////
      });
    }
  }, {
    key: "collideWithOtherChain",
    value: function collideWithOtherChain(self, other) {
      var selfObject = self.body.data.object;
      var otherObject = other.body.data.object;

      if (otherObject.ID === selfObject.ID + 1) {
        if (otherObject.PrevBall === null && selfObject.NextBall === null) {
          otherObject.PrevBall = selfObject;
          selfObject.NextBall = otherObject;

          this._OM.BallArray.forEach(function (element) {
            if (element != null) {
              element.MoveBackwards = false;
            }
          });

          if (otherObject.SpriteIndex == selfObject.SpriteIndex) {
            this._scene.BallsInComboArray = [selfObject];
            selfObject.IsCheckedForCombo = true;
            selfObject.checkForCombo(true, -1);
            selfObject.checkForCombo(false, -1);
          }
        }
      }
    }
  }, {
    key: "collideWithEndOfPath",
    value: function collideWithEndOfPath(self, other) {
      var selfObject = self.body.data.object;

      if (!selfObject._isDestroying && selfObject._RM.IsPlaying) {
        selfObject._isDestroying = true;

        if (!selfObject._RM.IsGameOver) {
          selfObject._RM.IsGameOver = true;
          this._scene.BallsAreStopped = false;
          selfObject._scene.Sound ? selfObject._scene.sound.play('Failed') : true;

          this._scene.cameras.main.shake(500);
        }
      }
    } //------------------------//------------------------//
    //                       DEBUG                      //
    //------------------------//------------------------//

  }, {
    key: "drawID",
    value: function drawID() {
      this._idtext.visible = this._isAlive ? true : false;
      this._idtext.text = "" + this.ID;
      this._idtext.x = this.Sprite.x;
      this._idtext.y = this.Sprite.y;

      this._idtext.setOrigin(.5);
    }
  }, {
    key: "drawLines",
    value: function drawLines(line1, line2) {
      this.lineManagment(line1, line2);
      this.graphics.clear();
      this.graphics.lineStyle(5, 0xFF00000, 1.0);
      this._prev != null ? this.graphics.strokeLineShape(line1) : 1;
      this.graphics.lineStyle(5, 0x00FF00, 1.0);
      this._next != null ? this.graphics.strokeLineShape(line2) : 1;
    }
  }, {
    key: "lineManagment",
    value: function lineManagment(l, l2) {
      var p, n;
      p = this._prev ? this._prev : this;
      n = this._next ? this._next : this;
      l.x1 = this._sprite.x;
      l.y1 = this._sprite.y;
      l.x2 = p._sprite.x;
      l.y2 = p._sprite.y - 10;
      l2.x1 = this._sprite.x;
      l2.y1 = this._sprite.y;
      l2.x2 = n._sprite.x;
      l2.y2 = n._sprite.y + 10;
    }
  }, {
    key: "debugUpdate",
    value: function debugUpdate() {
      if (this._scene.Debug) {
        this.drawLines(this.line, this.line2);
        this.drawID();
      }
    } //------------------------//------------------------//
    //                  BASIC METHODS                   //
    //------------------------//------------------------//

  }, {
    key: "create",
    value: function create() {
      this._sprite = this.setupSprite();
      this._pointsArrayLength = this._OM.PathObject.PathPoints.length;
      this.defineManagers();
      this.setupDebugEnvironment();
      this.setupParticles();
    }
  }, {
    key: "update",
    value: function update() {
      if (this._isAlive) {
        if (this._RM.IsPlaying || this._RM.Room === Enums_1.RoomsEnum.Editor) {
          if (this._sprite) {
            if (this._isDestroying) {
              this.animationManagment(0, 0, 100, true);
            }

            this.movement();
            this.ballsBehaviour();
          }
        }
      }

      this.debugUpdate();
    }
  }, {
    key: "ballsBehaviour",
    value: function ballsBehaviour() {
      this._scene.physics.overlap(this._sprite, this._scene.EndOfPathPhysicsGroup, this.collideWithEndOfPath.bind(this));

      if (this._next === null || this._prev === null) {
        this._scene.Debug ? this._sprite.setTint(0x717171) : 1;
        this.overlapCollider = this._scene.physics.overlap(this._sprite, this._scene.BallsPhysicsGroup, this.collideWithOtherChain.bind(this));
      } else {
        if (this.overlapCollider !== null) {
          this._scene.Debug ? this._sprite.setTint(0xFFFFFF) : 1;

          this._scene.physics.world.removeCollider(this.overlapCollider);
        }
      }

      if (this._next) {
        if (this._id < this._next.ID) {
          if (this._prev === this._next) {
            this._prev = null;
            this._next.NextBall = null;
          }
        }
      }

      if (this._prev) {
        if (this._id > this._prev.ID) {
          if (this._prev === this._next) {
            this._next = null;
            this._prev.PrevBall = null;
          }
        }
      }
    }
  }, {
    key: "SpriteIndex",
    get: function get() {
      return this._index;
    }
  }, {
    key: "IsCheckedForCombo",
    get: function get() {
      return this._isCheckedForCombo;
    },
    set: function set(val) {
      this._isCheckedForCombo = val;
    }
  }, {
    key: "TweenValue",
    get: function get() {
      return this._tweenValue;
    },
    set: function set(val) {
      this._tweenValue = val;
    }
  }, {
    key: "BallInsertAnimation",
    get: function get() {
      return this._ballInsertAnimation;
    },
    set: function set(val) {
      this._ballInsertAnimation = val;
    }
  }, {
    key: "ID",
    get: function get() {
      return this._id;
    },
    set: function set(val) {
      this._id = val;
    }
  }, {
    key: "CountID",
    get: function get() {
      return this._countID;
    },
    set: function set(val) {
      this._countID = val;
    }
  }, {
    key: "TweenStart",
    get: function get() {
      return this._tweenStart;
    },
    set: function set(val) {
      this._tweenStart = val;
    }
  }, {
    key: "TweenPosition",
    get: function get() {
      return this._tweenPosition;
    },
    set: function set(val) {
      this._tweenPosition = val;
    }
  }, {
    key: "NextBall",
    get: function get() {
      return this._next;
    },
    set: function set(val) {
      this._next = val;
    }
  }, {
    key: "PrevBall",
    get: function get() {
      return this._prev;
    },
    set: function set(val) {
      this._prev = val;
    }
  }, {
    key: "IsMover",
    get: function get() {
      return this._isMover;
    },
    set: function set(val) {
      this._isMover = val;
    }
  }, {
    key: "IsMoving",
    get: function get() {
      return this._isMoving;
    },
    set: function set(val) {
      this._isMoving = val;
    }
  }, {
    key: "Sprite",
    get: function get() {
      return this._sprite;
    }
  }, {
    key: "ParticlesEmitter",
    get: function get() {
      return this._particlesEmitter;
    }
  }]);

  return Ball;
}(Phaser.GameObjects.GameObject);

exports.Ball = Ball;

/***/ }),

/***/ 503:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! D:\phaser\Ball Line\ball-line-source-code.1.0.0.5.1\src\main.ts */504);


/***/ }),

/***/ 504:
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var __importDefault = void 0 && (void 0).__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

__webpack_require__(/*! phaser */ 238);

var PlayScene_1 = __importDefault(__webpack_require__(/*! ./scenes/PlayScene */ 1387));

var Preloader_1 = __importDefault(__webpack_require__(/*! ./scenes/Preloader */ 1399)); // main painle changes


var config = {
  type: Phaser.AUTO,
  resolution: 1,
  antialias: true,
  backgroundColor: "#282828",
  render: {
    pixelArt: false
  },
  scene: [Preloader_1.default, PlayScene_1.default],
  scale: {
    parent: 'content',
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 480 * 1.5,
    height: 900 * 1.5
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
        y: 0
      },
      debug: false // change if you need

    }
  }
};
new Phaser.Game(config);

/***/ })

},[503]);
//# sourceMappingURL=bundle.js.map