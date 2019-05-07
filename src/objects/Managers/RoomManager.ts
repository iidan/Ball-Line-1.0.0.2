import { RoomsEnum } from '../../objects/Enums';
import { EditorManager } from '../../objects/Managers/EditorManager';
import { ObjMapManager } from '../../objects/Managers/ObjMapManager';
import { ScoreManager } from '../../objects/Managers/ScoreManager';
import { ShopManager } from '../../objects/Managers/ShopManager';
import { MenuUI } from '../../objects/MenuUI';
import { Time, Tweens } from 'phaser';
import { Player } from '../Player';



export class RoomManager extends Phaser.GameObjects.GameObject {
	constructor(scene) {
        super(scene, '');
        this._scene         = scene;
        this._scene.UpdateGroup.add(this);
        this.create();
    }
//------------------------
    private _scene;
    private _SM: ScoreManager;
    private _OM: ObjMapManager;
    private _MU: MenuUI;
    private _Pl: Player;
//------------------------
    private _gameBackground	= null;
	public Room						=  -1;

	private readonly _constBallsNumber  = 10;
    private _ballsNumber 			    = this._constBallsNumber;
    public get BallsNumber() {
		return this._ballsNumber;
	}
	public set BallsNumber(val) {
		this._ballsNumber 		= val;
	}

    private readonly _constBallSpeed    = .015;
	private _preDefinedBallSpeed 	    = this._constBallSpeed;

	private _ballSpeed				    = this._preDefinedBallSpeed;
	public get BallSpeed() {
		return this._ballSpeed;
	}
	public set BallSpeed(val) {
		this._ballSpeed 		= val;
	}
//------------------------
    private _levelNumber			    = 2;
    private _mainLevelNumber = 1;
	public get LevelNumber() {
		return this._levelNumber;
    }
//------------------------
	private _isPlaying				    = false;
	public get IsPlaying() {
		return this._isPlaying;
    }
    
	private _isGameOver				    = false;
	public get IsGameOver() {
		return this._isGameOver;
	}
	public set IsGameOver(val) {
		this._isGameOver 	= val;
    }

    private _menuAnim				    = false;
    private oneTimeEnter				    = true;

	public get getCheckMenuAnim() {
		return this._menuAnim;
    }
//------------------------//------------------------//
//                      SETUPS                      //
//------------------------//------------------------//
	private setupBackground() {
		this._gameBackground 				= this._scene.add.sprite(200 * this._scene.GameSpriteScale, 0, 'Background_' + String(Phaser.Math.Between(1, 5))).setScale(.3 * this._scene.GameSpriteScale).setOrigin(.5, 0);
		this._gameBackground.depth 			= 0;
    }
    
    private setupStartLevelValues() {
		this._levelNumber		            = 3;
		this._isGameOver		            = false;

		this._SM.Score			            = 0;
		this._SM.Coins			            = 0;

		this._preDefinedBallSpeed			= this._constBallSpeed;
		this._ballsNumber					= this._constBallsNumber;
		this._ballSpeed						= .75;
    }
    
    public setupManagers() {
        this._OM = this._scene.ObjManager;
        this._MU = this._scene.MenuUI;
        this._SM = this._scene.ScoreManager;

        this._Pl = this._scene.Player;
    }
//------------------------//------------------------//
//                    CHANGERS                      //
//------------------------//------------------------//  
    private changeBackground() {
		this._gameBackground.setTexture('Background_' + String(Phaser.Math.Between(1, 5)) );
    }

    private controlBallSpeed() {
		if (this.Room == RoomsEnum.Game) {
			if (this.IsGameOver) {
				this._ballSpeed					= .3;
			} else {
				if (this._ballSpeed	> this._preDefinedBallSpeed) {
					this._ballSpeed				+= (this._preDefinedBallSpeed - this._ballSpeed) * .04;
				}
			}
		}
    }

    private updateBallInfo() {
        this._preDefinedBallSpeed		+= .005;
        this._ballSpeed					= .75;
        this._ballsNumber				+= 10;
    }
//------------------------//------------------------//
//                  ROOMS MANAGMENT                 //
//------------------------//------------------------//
    private loadMenu() {
        if (this.Room != RoomsEnum.Menu) {

            this.setupStartLevelValues();

            this._OM.loadLevel();
            this.Room 						= RoomsEnum.Menu;
            this._isPlaying 				= false;

            this._SM.Score                  = 0;
            this._MU.setVisibleMenuUI(true);
            
        }
    }

    private loadMenu2() {
        if (this.Room != RoomsEnum.Menu) {
            
            this.Room 						= RoomsEnum.Menu;
            //this._isPlaying 				= false;

            this._SM.Score                  = 0;
            //this._MU.setVisibleMenuUI(true);
            
        }
    }

    public touchCheck(){
        this.loadGame(false);
       // this._isPlaying 				= true;
    }

    public loadGame(background) {
        if (this.Room != RoomsEnum.Game) {
            this.Room 						= RoomsEnum.Game;
            this.setupStartLevelValues();

            
            this._isPlaying 				= true;
    
            this._OM.clearBallsAndCoins();
            this._OM.createBalls();

            this._OM.createCoin();
            this._MU.setVisibleMenuUI(false);

            this._scene.MusTrack            = this._scene.Music ? this._scene.sound.add('Track1') : null;
            this._scene.MusTrack ? this._scene.MusTrack.play()          : true;
            this._scene.MusTrack ? this._scene.MusTrack.setLoop(true)   : true;

            background ? this.changeBackground() : true;
        }

    }

    private loadShop() {
        if (this.Room != RoomsEnum.Shop) {
            this.Room 						= RoomsEnum.Shop;
            new ShopManager(this._scene);
        }
    }

    public unLoadShop() {
        if (this.Room != RoomsEnum.Menu) {
            this.loadMenu2();
        }
    }

    public loadGameOver() {
        if (this.Room != RoomsEnum.GameOver) {
            this.Room 						= RoomsEnum.GameOver;
            this._isPlaying 				= false;
            this._OM.PlayerObject.destroy();
            this._mainLevelNumber = 1;
            this._MU.setVisibleMenuUI(true);
            this._SM.recordScoreAndCoins();

            this._scene.MusTrack ? this._scene.MusTrack.stop() : true;
        }
    }

    private loadEditor() {
        if (this.Room != RoomsEnum.Editor) {
            this.Room 						= RoomsEnum.Editor;

            this._OM.clearBallsAndCoins();
            this._OM.clearLevel();

            this._MU.setVisibleMenuUI(false);

            new EditorManager(this._scene, this._OM.PathObject);
        }
    }

    public transitionAnimationBetweenLevels(): void {

        var sprite2 = this._scene.add.sprite(240 * 1, 600 * 1, 'blackScreen').setScale(1, .8 * 1).setOrigin(.5).setTint(0x282828);
        var style = { font: "65px Orbitron-Bold", fill: "#ff0044", align: "center" };  
        this._mainLevelNumber ++;  
        var textLevel = this._scene.add.text(220, 500, "Level " + (this._mainLevelNumber), style);

        textLevel.depth = 25;
        textLevel.alpha = 0;
        sprite2.depth = 20;
        sprite2.alpha = 0;

        this._scene.add.tween({
            targets: [sprite2,textLevel],
            alpha: 1,
            duration: 1000,
            onComplete: () => {
                
                this.changeBackground();
                this.updateBallInfo();
  
                this._OM.loadLevel()
                this._OM.clearBallsAndCoins();
                this._OM.createCoin();
                this._OM.createBalls();

                this._scene.add.tween({
                    targets: [sprite2,textLevel],
                    alpha: 0,
                    duration: 1800,
        
                })
            }           
        })
    }
  


    public loadNewLevel(callLevelNumber) {
        if (this._levelNumber == callLevelNumber) {
            this._levelNumber < 10 ? this._levelNumber += 1 : this._levelNumber = 1;
            this._SM.Coins += 10;
            this.transitionAnimationBetweenLevels();
        }
    }

//------------------------//------------------------//
//                  BASIC METHODS                   //
//------------------------//------------------------//
    public create() {
        this.setupBackground();
    }

    public update() {
        this.controlBallSpeed();

    }
}