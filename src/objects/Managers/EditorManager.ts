import { RoomManager } 		from '../../objects/Managers/RoomManager'
import { ObjMapManager } 	from '../../objects/Managers/ObjMapManager'
import { ScoreManager } 	from '../../objects/Managers/ScoreManager'
import { MenuUI } 			from '../../objects/MenuUI'

import PlayScene from "../../scenes/PlayScene";

interface Level {
	curves:         number,
    curvesArray:    Array<Phaser.Math.Vector2>,
    coinZones:      number,
    coinZonesArray: Array<Phaser.Geom.Rectangle>,
    playerSpawn:    Phaser.Math.Vector2
}

interface Buttons {
	save:           Phaser.GameObjects.Image,
    plus:           Phaser.GameObjects.Image,
    minus:          Phaser.GameObjects.Image,
    curve:          Phaser.GameObjects.Image
}

export class EditorManager extends Phaser.GameObjects.GameObject {
	constructor(scene, pathObject) {
        super(scene, '');
        this._scene         = scene;
        this._path          = pathObject;

        this._RM	        = scene.RoomManager;
        this._OM	        = scene.ObjManager;
        this._SM	        = scene.ScoreManager;
        this._MU	        = scene.MenuUI;

        this._scene.UpdateGroup.add(this);
        this.create();
    }

//------------------------
    private _scene: PlayScene;
    private _type                           = 'Curves';

    private _buttons: Buttons;
    private _background;
    private _path;

    private _playerSpawn                    = null;

    private _curves                         = [];
    private _graphicsArray                  = [];

    private _coinZones                      = [];
    private _coinGraphicsArray              = [];
//------------------------
    private _RM: RoomManager;
    private _OM: ObjMapManager;
    private _SM: ScoreManager;
    private _MU: MenuUI;
//------------------------//------------------------//
//                 	     SETUP                      //
//------------------------//------------------------//
    private setupUI() {
        this._buttons   = {
            save:   this.setupButton('Save', 90, 850),
            plus:   this.setupButton('Plus', 190, 850),
            minus:  this.setupButton('Minus', 290, 850),
            curve:  this.setupButton('Curve', 390, 850)
        };
    }

    
	private setupButton(key, x, y) {
		let spr 							= this._scene.add.image(x, y, key).setScale(1 * this._scene.GameSpriteScale).setOrigin(.5);
		spr.depth 							= 15;
		spr.setInteractive();

		spr.on('pointerdown', function(pointer) {
			if (pointer.buttons === 1) {
                switch(spr.texture.key) {
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

                        this._coinZones.forEach(element => {
                            for(let i = 0; i < 2; i++) {
                                element[i].visible = true;
                            }
                        });
                        
                        this._curves.forEach(element => {
                            for(let i = 0; i < 4; i++) {
                                element[i].visible = false;
                            }
                        });
                        break;
                    case 'EditorCoin': 
                        this._type = 'Player';
                        spr.setTexture('EditorCube');
                        spr.setScale(.6 * this._scene.GameSpriteScale);
                        
                        this._coinZones.forEach(element => {
                            for(let i = 0; i < 2; i++) {
                                element[i].visible = false;
                            }
                        });
                        break;
                    case 'EditorCube': 
                        this._type = 'Curves';
                        spr.setTexture('Curve');
                        spr.setScale(1 * this._scene.GameSpriteScale);

                        this._curves.forEach(element => {
                            for(let i = 0; i < 4; i++) {
                                element[i].visible = true;
                            }
                        });
                        break;
                }
			}
		}, this);

		return spr;
    }
//------------------------//------------------------//
//                  CURVES MANAGMENT                //
//------------------------//------------------------//
    private createBezierTools(previous) {
        let pointColors = ["0x00ff00", "0x008800", "0x888888", "0xffffff"];
        let pointsArray = [];

        for(var i = 0; i < 4; i++){
            if (previous != null && i == 0) {
                pointsArray[i]      = previous[3];
            } else {
                var draggablePoint  = this.addNewBezierPoint(pointColors, i);
                pointsArray[i]      = draggablePoint;
            }
        }

        let c                       = this._path.createBezierCurve(pointsArray[0], pointsArray[1], pointsArray[2], pointsArray[3]);
        let g                       = this._path.addNewGraphics();

        for(var i = 0; i < 4; i++){
            if (previous != null && i == 0) {
                pointsArray[i].data = {
                    curve:          c,
                    graphics:       g,
                    prevCurve:      previous[3].data.curve,
                    prevGraphics:   previous[3].data.graphics
                };
            } else {
                pointsArray[i].data = {
                    curve:          c,
                    graphics:       g,
                    prevCurve:      null,
                    prevGraphics:   null
                };
            }
        }
        this._path.drawBezierCurve(c, g);
        this.setupBezierDrag(pointsArray);

        return pointsArray;
    }

    private addCurveTools() {
        this._curves[this._curves.length]   = this.createBezierTools(this._curves[this._curves.length - 1]);
    }

    private deleteCurveTools() {
        let elem                            = this._curves[this._curves.length - 1];
        this._path.deleteBezierCurve(elem, elem[0].data.graphics);

        this._curves.pop();
        this._path._curvesNumber--;
    }

    private addNewBezierPoint(pointColors, i) {
        let lastPoint                       = this._curves[this._curves.length - 1] ? this._curves[this._curves.length - 1] : null;
        let point                           = (lastPoint == null)                   ? new Phaser.Math.Vector2(100, 100)     : new Phaser.Math.Vector2(lastPoint[3].x, lastPoint[3].y)
        let draggablePoint                  = this._scene.add.image(point.x, point.y , 'EditorDragPoint').setScale(.05 * this._scene.GameSpriteScale).setOrigin(.5);

        draggablePoint.alpha                = .8;
        draggablePoint.depth                = 15;
        draggablePoint.setTint(pointColors[i]);
        draggablePoint.setInteractive();

        return draggablePoint;
    }

    private setupBezierDrag(pointsArray) {
        this._scene.input.on("pointerdown", function (pointer, gObj) {
            if (this._type == 'Curves') {
                this._scene.input.setDraggable(pointsArray, true);
            } else {
                this._scene.input.setDraggable(pointsArray, false);
            }
        }, this);

        this._scene.input.on("drag", function (pointer, gObj, posX, posY) {
            if (this._type == 'Curves') {
                gObj.x                      = posX;
                gObj.y                      = posY;
                this._path.drawBezierCurve(gObj.data.curve, gObj.data.graphics);
                (gObj.data.prevCurve != null) ? (this._path.drawBezierCurve(gObj.data.prevCurve, gObj.data.prevGraphics)) : 1;
            }
        }, this);
    }
//------------------------//------------------------//
//                  PLAYER MANAGMENT                //
//------------------------//------------------------//
    private createPlayerSpawnPoint() {
        let spr                             = this._scene.add.image(100, 100, 'Player_Circle').setScale(.15 * this._scene.GameSpriteScale).setOrigin(.5);
        spr.depth 							= 15;
        spr.setInteractive({ draggable: true });
        
        spr.on('drag', function(pointer, dragX, dragY){
            if (pointer.buttons === 1) {
                if (this._type == 'Player') {
                    spr.x                   = dragX;
                    spr.y                   = dragY;
                }
            }
        }, this);

        return spr;
    }

    private deletePlayerSpawnPoint() {
        this._playerSpawn.destroy();
    }
//------------------------//------------------------//
//                  COINS MANAGMENT                 //
//------------------------//------------------------//
    private addNewGraphics() {
        let g                               = this._scene.add.graphics();
        g.depth                             = 1;
        g.alpha                             = .2;
        g.clear();

        this._coinGraphicsArray.push(g);
        
        return g;
    }

    private createCoinTools() {
        let pointColors                     = ["0x00ff00", "0x008800", "0x888888", "0xffffff"];
        let pointsArray                     = [];

        for(let i = 0; i < 2; i++) {
            let draggablePoint              = this.addNewCoinPoint(pointColors, i);
            pointsArray[i]                  = draggablePoint;
        }

        let r                               = this.createCoinZone(pointsArray[0], pointsArray[1]);
        let g                               = this.addNewGraphics();

        for(let i = 0; i < 2; i++) {
            pointsArray[i].data = {
                rect:           r,
                graphics:       g,
            };
        }

        this.drawCoinRect(r, g);
        this.setupCoinDrag(pointsArray);

        return pointsArray;
    }

    private addCoinTools() {
        let len                             = this._coinZones.length;
        this._coinZones[len]                = this.createCoinTools();

        // console.log(this._coinZones);
    }

    private deleteCoinTools() {
        let elem                            = this._coinZones[this._coinZones.length - 1];
        this._path.deleteCoinZone(elem, elem[0].data.graphics);

        this._coinZones.pop();
    }

    private addNewCoinPoint(pointColors, i) {
        let draggablePoint                  = this._scene.add.image(100, 100 , 'Ball_3_a').setScale(.05 * this._scene.GameSpriteScale).setOrigin(.5);

        draggablePoint.alpha                = .5;
        draggablePoint.depth                = 15;
        draggablePoint.setTint(pointColors[i]);
        draggablePoint.setInteractive();

        return draggablePoint;
    }

    private setupCoinDrag(pointsArray) {
        this._scene.input.on("pointerdown", function (pointer, gObj) {
            if (this._type == 'Coins') {
                this._scene.input.setDraggable(pointsArray, true);
            } else {
                this._scene.input.setDraggable(pointsArray, false);
            }
        }, this);

        this._scene.input.on("drag", function (pointer, gObj, posX, posY){
            if (this._type == 'Coins') {
                gObj.x                      = posX;
                gObj.y                      = posY;
                pointsArray.forEach(element => {
                    element.data.rect       = Phaser.Geom.Rectangle.FromPoints(pointsArray, element.data.rect);
                });
                this.drawCoinRect(gObj.data.rect, gObj.data.graphics);
            }
        }, this);
    }

    private createCoinZone(p1, p2) {
        let rect;
        let points                          = [
            new Phaser.Math.Vector2(p1.x, p1.y), 
            new Phaser.Math.Vector2(p2.x, p2.y)
        ];
        rect                                = Phaser.Geom.Rectangle.FromPoints(points, rect);
        // console.log(rect);
        this._coinZones.push(rect); 
        return rect;
    }
    
    private deleteCoinZone(array, graphics) {
        for(let i = 0; i < array.length; i++) {
            array[i].visible = 0;
            array[i].destroy();
        }
        graphics.clear();
        this._coinGraphicsArray.pop();
    }

    private drawCoinRect(rect, graphics) {
        graphics.clear();

        graphics.fillStyle(0xFF0000, 1);
        graphics.fillRectShape(rect);
    }
//------------------------//------------------------//
//                   SAVE & LOAD                    //
//------------------------//------------------------//
    private saveLevel() {
		let level: Level;
        let arrayCurves                     = [];
        let arrayCoins                      = [];

		for(let i = 0; i < this._path.CurvesArray.length; i++) {
			for(let j = 0; j < 4; j++) {
				let point;
				point 				        = this._scene.XYtoVector2(this._path.CurvesArray[i][j].x, this._path.CurvesArray[i][j].y);
				arrayCurves[(i * 4) + j] 	= point;
			}
        }
        
        for(let i = 0; i < this._coinZones.length; i++) {
			for(let j = 0; j < 2; j++) {
				let point;
				point 				        = this._scene.XYtoVector2(this._coinZones[i][j].x, this._coinZones[i][j].y);
				arrayCoins[(i * 2) + j] 	= point;
			}
		}


		level = {
			curves:         this._path.CurvesArray.length,
            curvesArray:    arrayCurves,
            coinZones:      this._coinZones.length,
            coinZonesArray: arrayCoins,
            playerSpawn:    new Phaser.Math.Vector2(this._playerSpawn.x, this._playerSpawn.y)
        };

        localStorage.setItem('level', JSON.stringify(level));
		console.log(localStorage.getItem('level'));
    }

//------------------------//------------------------//
//                  	EDITOR	                    //
//------------------------//------------------------//
    private editorManagment() {
        if (Phaser.Input.Keyboard.JustDown(this._scene._cursors.space)) {
            this._path.EndOfPathSprite ? this._path.EndOfPathSprite.destroy() : true;
            this._path.PathPoints 		= this._path.createPointsFromCurvesArray(this._path.CurvesArray, true);
            this._OM.clearBallsAndCoins();
			this._OM.createBalls();
        }

        if (Phaser.Input.Keyboard.JustDown(this._scene._cursors.up)) {
            this._RM.BallSpeed 	    += .025;
        }
        if (Phaser.Input.Keyboard.JustDown(this._scene._cursors.down)) {
            this._RM.BallSpeed 	    = .015;
        }

        if (Phaser.Input.Keyboard.JustDown(this._scene._cursors.left)) {
            this._background.visible    = false;
        }
        if (Phaser.Input.Keyboard.JustDown(this._scene._cursors.right)) {
            this._background.visible    = true;
        }
    }    
//------------------------//------------------------//
//                  BASIC METHODS                   //
//------------------------//------------------------//
    public create() {
        this.setupUI();

        let rand                        = Phaser.Math.Between(1, 10);
        console.log('BACK' + rand);

        this._background 			    = this._scene.add.sprite(20, 0, 'LevelBack_' + String(rand)).setOrigin(0, 0);
        this._background.depth 		    = 0;
        
        this._curves                    = this._path.CurvesArray;
        this._graphicsArray             = this._path.GraphicsArray;
    }

    public update() {
        this.editorManagment();
    }

}