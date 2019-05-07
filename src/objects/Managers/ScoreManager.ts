import { playsiveSDK }      from '../../playsive/playsiveSDK.js'

import PlayScene            from '../../scenes/PlayScene';

export class ScoreManager extends Phaser.GameObjects.GameObject {
    constructor(scene) {
        super(scene, '');
        this._scene         = scene;
        this._scene.UpdateGroup.add(this);
        this.create();
    }
//------------------------
    private _scene: PlayScene;
//------------------------
	private _bestScore				= localStorage.getItem('Best Score') === null ? 0 : localStorage.getItem('Best Score');
	public get BestScore() {
		return this._bestScore;
	}
	public set BestScore(val) {
		this._bestScore = val;
    }
    
	private _score					= 0;
	public get Score() {
		return this._score;
	}
	public set Score(val) {
		this._score = val;
    }
//------------------------    
	private _coins					= 0;
	public get Coins() {
		return this._coins;
	}
	public set Coins(val) {
		this._coins = val;
    }
    
	private _allCoins				= localStorage.getItem('Coins') === null ? 0 : parseInt(localStorage.getItem('Coins'));
	public get AllCoins() {
		return this._allCoins;
	}
	public set AllCoins(val) {
		this._allCoins = val;
    }
//------------------------
    public setupManagers() {
        
    }        

    public setNewAllCoins(val) {
        this._allCoins                  += val;
        localStorage.setItem('Coins', String(this._allCoins));

        return this._allCoins;
    }
    
    public recordScoreAndCoins() {
        playsiveSDK.postScore(this._score);

        if (this._score > this._bestScore) {
            this._bestScore 			= this._score;
            localStorage.setItem('Best Score', String(this._score));
        }
        this.setNewAllCoins(this._coins);
        this._coins                     = 0;
    }

    public create() {
        playsiveSDK.gameLoaded();
    }

    public update() {

    }
}