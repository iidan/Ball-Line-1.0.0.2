import { RoomManager } 		from '../objects/Managers/RoomManager'
import { ObjMapManager } 	from '../objects/Managers/ObjMapManager'
import { ScoreManager } 	from '../objects/Managers/ScoreManager'
import { MenuUI } 			from '../objects/MenuUI'

export default class PlayScene extends Phaser.Scene {
	_cursors: any;
	_editorKey: any;

	constructor() {
    	super({
			key: 'MainScene'
		});
	}

//------------------------
	private _debug					= false;
	public get Debug() {
		return this._debug;
	}
//------------------------
	private _ballsInComboArray		= [];
	public get BallsInComboArray() {
		return this._ballsInComboArray;
	}
	public set BallsInComboArray(val) {
		this._ballsInComboArray 	= val;
	}
//------------------------
	public Music					= localStorage.getItem('Music') === null ? 0 : parseInt(localStorage.getItem('Music'));
	public Sound					= localStorage.getItem('Sound') === null ? 0 : parseInt(localStorage.getItem('Sound'));

	public MusTrack					= null;
//------------------------
	public UpdateGroup;

	public PlayerBallPhysicsGroup;
	public EndOfPathPhysicsGroup;
	public BallsPhysicsGroup;
	public CoinsPhysicsGroup;
//------------------------
	public ComboEndedSide			= 0;
	public GameSpriteScale			= 1.5;
	public BallsAreStopped 			= false;
//------------------------
	private _roomManager			= null;
	public get RoomManager() {
		return this._roomManager;
	}
	private _objManager				= null;
	public get ObjManager() {
		return this._objManager;
	}
	private _scoreManager			= null;
	public get ScoreManager() {
		return this._scoreManager;
	}
	private _menuUI					= null;
	public get MenuUI() {
		return this._menuUI;
	}
//------------------------//------------------------//
//                 	   HELPERS                      //
//------------------------//------------------------//
	public XYtoVector2(x: number, y: number): Phaser.Math.Vector2 {
		return new Phaser.Math.Vector2(x, y);
	}

	public inWorldBounds(sprite: Phaser.GameObjects.Image): boolean {
		return (sprite.x > (-64 * this.GameSpriteScale) && sprite.x < (544 * this.GameSpriteScale) && sprite.y > (-64 * this.GameSpriteScale) && sprite.y < (964 * this.GameSpriteScale));
	}

	public computeBallRealPosition(tweenStart, nextTweenStart, tweenValue){
		let pathPoints		= this._objManager.PathObject.PathPoints;
		let tweenPos		= (tweenStart >= 0 && tweenStart < pathPoints.length) ? pathPoints[tweenStart] : pathPoints[0];
		let nextPos			= tweenPos;

        if (nextTweenStart >= 0) {
            if (nextTweenStart >= pathPoints.length) {
                nextPos   	= pathPoints[pathPoints.length - 1];
            } else {
                nextPos   	= pathPoints[nextTweenStart];
            }
		}
		
		return 	new Phaser.Math.Vector2(
					Phaser.Math.Interpolation.Linear([tweenPos.x, nextPos.x], tweenValue),
					Phaser.Math.Interpolation.Linear([tweenPos.y, nextPos.y], tweenValue)
				);
	}
//------------------------//------------------------//
//                 	     SETUP                      //
//------------------------//------------------------//
	private setupGroups() {
		this.PlayerBallPhysicsGroup			= this.physics.add.group();
		this.EndOfPathPhysicsGroup			= this.physics.add.group();
		this.BallsPhysicsGroup				= this.physics.add.group();
		this.CoinsPhysicsGroup				= this.physics.add.group();

		this.UpdateGroup 					= this.add.group();
		this.UpdateGroup.runChildUpdate 	= true;
	}

	private setupGameRules() {
		this.game.canvas.oncontextmenu 		= (e) => e.preventDefault();
		this.physics.world.setBounds(29 * this.GameSpriteScale, 97 * this.GameSpriteScale, 421 * this.GameSpriteScale, 745 * this.GameSpriteScale, true, true, true, true);
		this.cameras.main.setBounds(0, 0, 480 * this.GameSpriteScale, 900 * this.GameSpriteScale);
	}

	private setupManagers() {
		this._roomManager					= new RoomManager(this);
		this._objManager					= new ObjMapManager(this);
		this._scoreManager					= new ScoreManager(this);
		this._menuUI						= new MenuUI(this);

		this._roomManager.setupManagers();
		this._objManager.setupManagers();
		this._scoreManager.setupManagers();
		this._menuUI.setupManagers();
	}

	private setupGameEnvironment() {
		this.add.sprite(240 * this.GameSpriteScale, 470 * this.GameSpriteScale, 'Board').setScale(.8 * this.GameSpriteScale, .8 * this.GameSpriteScale).setOrigin(.5).setTint(0x282828).depth = 10;
		
		this.setupGroups();
		this.setupGameRules();
		this.setupManagers();

		this._cursors 						= this.input.keyboard.createCursorKeys();
		this._editorKey 					= this.input.keyboard.addKey('E');
	}
//------------------------//------------------------//
//                  BASIC METHODS                   //
//------------------------//------------------------//
	public create() {
		this.Music					= localStorage.getItem('Music') === null ? 0 : parseInt(localStorage.getItem('Music'));
		this.Sound					= localStorage.getItem('Sound') === null ? 0 : parseInt(localStorage.getItem('Sound'));
		this.setupGameEnvironment();
		this._roomManager.loadMenu();
	}

	public update() {
		if (Phaser.Input.Keyboard.JustDown(this._editorKey)) {
			this._roomManager.loadEditor();
		}
		if (this._roomManager.IsPlaying) {
			this._objManager.correctBallIDs();
		}
	}
}