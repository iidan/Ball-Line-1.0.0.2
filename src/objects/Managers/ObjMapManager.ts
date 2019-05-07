import { RoomManager } 		from '../../objects/Managers/RoomManager'
import { ScoreManager } 	from '../../objects/Managers/ScoreManager'
import { MenuUI } 			from '../../objects/MenuUI'

import { Path }             from '../../objects/Path'
import { Ball }             from '../../objects/Ball'
import { Coin }             from '../../objects/Coin'
import { Player } 			from '../../objects/Player'

import PlayScene 			from '../../scenes/PlayScene'

export class ObjMapManager extends Phaser.GameObjects.GameObject {
    constructor(scene) {
        super(scene, '');
        this._scene         = scene;
        this._scene.UpdateGroup.add(this);
        this.create();
    }

//------------------------
    private _scene: PlayScene;
    private _SM: ScoreManager;
    private _RM: RoomManager;
    private _MU: MenuUI;
//------------------------
	private _ballArray 				= [];
	public get BallArray() {
		return this._ballArray;
	}

	private _ballArrayLength 		= 0;
	public get BallArrayLength() {
        return this._ballArrayLength;
    }
    
	private _ballArrayPosition 		= 0;
	public get BallArrayPosition() {
		return this._ballArrayPosition;
	}
	public set BallArrayPosition(val) {
		this._ballArrayPosition = val;
    }
    
    private _ballType				= 1;
	public get BallType() {
		return this._ballType;
	}
	public set BallType(val) {
		this._ballType = val;
	}
//------------------------
    private _path;
    public get PathObject() {
        return this._path;
    }

    private _pathSprites			= [];
    public get PathSprites() {
        return this._pathSprites;
    }
//------------------------
    private _playerObject		    = null;
    public get PlayerObject() {
        return this._playerObject;
	}
	public set PlayerObject(val) {
        this._playerObject = val;
    }

    private _coinObject;
    private _coinZones				= [];
//------------------------//------------------------//
//                      SETUP                   	//
//------------------------//------------------------//	
    public setupManagers() {
        this._MU = this._scene.ObjManager;
        this._RM = this._scene.RoomManager;
        this._SM = this._scene.ScoreManager;
    }   
//------------------------//------------------------//
//                     CHANGERS                   	//
//------------------------//------------------------//	
	public correctBallIDs() {
		let inpArr	= this._ballArray;
		let retArr	= [];
		let n		= 0;

		inpArr.forEach(element => {
			if (element != null && element != undefined) {
				retArr.push(element);
			}
		});

		retArr.sort((a, b) => {
			let r = a.TweenStart - b.TweenStart;
			r == 0 ? r = a.TweenValue - b.TweenValue : true;
			return r;
		});

		retArr.forEach(element => {
			element.ID 		= n;
			element.IsMover = (n == 0) ? true : false; 
			n++;
		});
	}
//------------------------//------------------------//
//                  BALLS & COINS                   //
//------------------------//------------------------//
	public createCoin(): void {
		let coinPos										= new Phaser.Geom.Point(0, 0);
		let rect 										= this._coinZones[Phaser.Math.Between(0, this._coinZones.length - 1)];

		coinPos											= Phaser.Geom.Rectangle.Random(rect, coinPos);
		this._coinObject								= new Coin(this._scene, coinPos.x, coinPos.y);
	}

	public createBalls(): void {
        let ballsNumber                                 = this._RM.BallsNumber;

		this._ballArrayPosition							= 0;
		for(let i = ballsNumber - 1; i >= 0; i--) {
			this._ballArray[i]							= new Ball(this._scene, this._ballType, Phaser.Math.Between(0, 2));
			this._ballArray[i].ID						= i;
			this._ballArray[i].CountID					= i;
			this._ballArray[i].TweenStart				= (i - ballsNumber) * 32;

			if (this._ballArray[i].TweenStart >= 0) {
				this._ballArray[i].TweenPosition		= this._path.PathPoints[this._ballArray[i].TweenStart];
			} else {
				this._ballArray[i].TweenPosition		= this._path.PathPoints[0];
			}
			this._ballArrayPosition++;
		}
		for(let i = 0; i < ballsNumber; i++) {
			this._ballArray[i].PrevBall 				= this._ballArray[i - 1];
			this._ballArray[i].NextBall 				= this._ballArray[i + 1];
		}
		
		this._ballArray[0]._isMover						= true;
		this._ballArray[0].PrevBall						= null;
		this._ballArray[ballsNumber - 1].NextBall = null;

		this.countBalls();
	}

	public countBalls(): void {
		let counter 									= 0;
		this._ballArray.forEach(element => {
			if (element !== null) {
				counter++;
			}
		});

		this._ballArrayLength 							= counter;

		if (this._ballArrayLength === 0 && this._RM.IsPlaying) {
			if (!this._RM.IsGameOver) {
				this._RM.loadNewLevel(this._RM.LevelNumber);
			} else {
				this._RM.loadGameOver();
			}
		}
	}

	public clearBallsAndCoins(): void {
		this._ballArray.forEach(element => {
			if (element != null) {
				element.destroy();
			}
		});
		this._ballArray 								= [];
		this._ballArrayLength							= 0;

		this._coinObject ? this._coinObject.destroy() : true;
	}
//------------------------//------------------------//
//                  	LOAD MAP                    //
//------------------------//------------------------//
	public loadLevel(): void {
		let level 						= this._scene.cache.json.get('Level' + this._RM.LevelNumber);
		let curvesArray					= JSON.parse(JSON.stringify(level.curvesArray));
		let coinArray					= JSON.parse(JSON.stringify(level.coinZonesArray));

		this.clearLevel();

        for(let i = 0; i < level.curves; i++) {
			let point 					= [];
			
			for(let j = 0; j < 4; j++) {
				point.push(curvesArray[(i * 4) + j]);
				point[j].x				*= this._scene.GameSpriteScale;
				point[j].y				*= this._scene.GameSpriteScale;
			}

			let g 						= this._path.addNewGraphics();
			this._path.CurvesArray[i] 	= this._path.createBezierCurve(point[0], point[1], point[2], point[3]);
			this._path.drawBezierCurve(this._path.CurvesArray[i], g);
		}
		this._path.PathPoints 			= this._path.createPointsFromCurvesArray(this._path.CurvesArray, false);
		this._path.PathSprite 			= this._path.createSpriteFromCurveArray(this._path.GraphicsArray, this._RM.LevelNumber);

		for(let i = 0; i < level.coinZones; i++) {
			let point 					= [];

			for(let j = 0; j < 2; j++) {
				point.push(coinArray[(i * 2) + j]);
				point[j].x				*= this._scene.GameSpriteScale;
				point[j].y				*= this._scene.GameSpriteScale;
			}
			this._coinZones[i]			= Phaser.Geom.Rectangle.FromPoints(point, this._coinZones[i]);
		}
		this._playerObject ? this._playerObject.setPos(level.playerSpawn) : this._playerObject = new Player(this._scene, this._ballType, level.playerSpawn.x * this._scene.GameSpriteScale, level.playerSpawn.y * this._scene.GameSpriteScale);
	}

	public clearLevel() {
		this._path ? this._path.destroy() : true;
		this._path						= new Path(this._scene);
		return this._path;
	}

	public playerSetOFlocation(){
		this._playerObject ? this._playerObject.setPos(0) : this._playerObject = new Player(this._scene, this._ballType, 0, 0);
	}
//------------------------//------------------------//
//                  BASIC METHODS                   //
//------------------------//------------------------//
    public create() {

    }

    public update() {

    }
}