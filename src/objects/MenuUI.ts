import { RoomManager } 		from '../objects/Managers/RoomManager'
import { ObjMapManager } 	from '../objects/Managers/ObjMapManager'
import { ScoreManager } 	from '../objects/Managers/ScoreManager'

import { RoomsEnum } 		from '../objects/Enums'
import PlayScene from '../scenes/PlayScene';

interface UI {
	menuStroke:			Phaser.GameObjects.Image,
	rewardUI,

	restart:           	Phaser.GameObjects.Image,
    //play:           	Phaser.GameObjects.Image,
    sound:          	Phaser.GameObjects.Image,
	music:          	Phaser.GameObjects.Image,
	shop:          		Phaser.GameObjects.Image,
	topCoin:          	Phaser.GameObjects.Image,
	blueCircle:         Phaser.GameObjects.Image,
	hand:          		Phaser.GameObjects.Sprite,

	topText:          	Phaser.GameObjects.Text,
	bestText:          	Phaser.GameObjects.Text,
	bestScoreText:      Phaser.GameObjects.Text,
	scoreText:          Phaser.GameObjects.Text,
	coinsText:          Phaser.GameObjects.Text,
}

interface TimeObject {
	hours:		number,
	minutes: 	number,
	seconds: 	number
};


export class MenuUI extends Phaser.GameObjects.GameObject {
    constructor(scene) {
        super(scene, '');
        this._scene         = scene;
		this._scene.UpdateGroup.add(this);

		this.create();
		
    }
//------------------------
    private _scene: PlayScene;
    private _SM: 	ScoreManager;
    private _OM: 	ObjMapManager;
	private _RM: 	RoomManager;
//------------------------
	private _ui;
	private _rewardTimeStamp		= JSON.parse(localStorage.getItem('RewardTimestamp')) ? JSON.parse(localStorage.getItem('RewardTimestamp')) : this.setRewardTimestamp();
	private	_getReward				= JSON.parse(localStorage.getItem('RewardAvailable')) ? JSON.parse(localStorage.getItem('RewardAvailable')) : false;
	private _timeStamp:TimeObject;

	private _styleTitle				= { font: '35px Orbitron-Bold', fill: "#eddf14" };
	private _tapToStart				= { font: '35px Orbitron-Bold', fill: "#ffffff" };
	private _styleScore 			= { font: '35px Orbitron-Bold', fill: "#ffffff"};
	private _styleReward			= { font: '25px Orbitron-Bold', fill: "#ffffff"};

	private oneTime = true;
	private checkEnter = true;

	private _MenuAnim    = false;
    public get MenuAnim() {
        return this._MenuAnim;
    }

//------------------------//------------------------//
//                       SETUP                      //
//------------------------//------------------------//
    public setupManagers() {
        this._OM = this._scene.ObjManager;
        this._RM = this._scene.RoomManager;
        this._SM = this._scene.ScoreManager;
	}
	
	private setupUI() {
        this._ui   = {
			menuStroke:			this.setupMenuStroke(true),
			rewardUI:			this.setupRewardUI(),

			
			//play:           	this.setupButton('PlayIcon', .4, 240, 450),
			//restart:           	this.setupButton('RestartIcon', .4, 240, 660),
			topCoin:          	this.setupButton('Coin', .2, 400, 30),

			shop:          		this.setupButton('ShopIcon', .37, 238, 820),
			//sound:          	this.setupButton(this._scene.Sound == 1 ? 'SoundOn' : 'SoundOff', .3, 300, 820),
			//music:          	this.setupButton(this._scene.Music == 1 ? 'MusicOn' : 'MusicOff', .25, 238, 820),
			hand: 				this._scene.add.sprite(360, 660, 'Hand1'),
			
			blueCircle:         this.setupButton('BlueCircle', .4, 217, 347).setDepth(0),	

			topText:          	this.setupText(this._styleTitle, 240, 	140, 	0xffffff, 	38, 15),
			tapToStart:         this.setupText(this._tapToStart, 240, 	580, 	0xffffff, 	25, 15),
			bestText:          	this.setupText(this._styleScore, 80, 	45, 	0xeddf14, 	20, 15),
			bestScoreText:      this.setupText(this._styleScore, 80, 	75, 	0xffffff, 	28, 15),
			scoreText:          this.setupText(this._styleScore, 240, 	60, 	0xffffff, 	48, 15),
			coinsText:          this.setupText(this._styleScore, 400, 	75, 	0xeddf14, 	28, 15),
		}
	}
	
	private setupButton(key, scale, x, y) {


		let spr								= this.setupSprite(x, y, key, 15, true, scale)

		spr.on('pointerdown', function(pointer) {
			//console.log("ASDASDAS");
	
			
			if (pointer.buttons === 1) {
                switch(spr.texture.key) {
					//case 'PlayIcon': 
					//case 'RestartIcon': 
						//if (this._RM.Room != RoomsEnum.Shop) {


						///	this._scene.Sound ? this._scene.sound.play('Button') : true;							
							//this._RM.loadGame(false);
							//this._RM.touchCheck();
						
						//}
						//break;
					case 'ShopIcon':
						if (this.Room != RoomsEnum.Shop) {
							this._scene.Sound ? this._scene.sound.play('Button') : true;
							this._RM.loadShop();
						}
						break;
					case 'MusicOn':
					case 'MusicOff':
						if (this._RM.Room != RoomsEnum.Shop) {
							if (this._scene.Music) {
								spr.setTexture('MusicOff');
								this._scene.Music	= 0;
							} else {
								spr.setTexture('MusicOn');
								this._scene.Music	= 1;
							}
							this._scene.Sound ? this._scene.sound.play('Button') : true;
							localStorage.setItem('Music', String(this._scene.Music));
						}
						break;
					case 'SoundOn':
					case 'SoundOff':
						if (this._RM.Room != RoomsEnum.Shop) {
							if (this._scene.Sound) {
								spr.setTexture('SoundOff');
								this._scene.Sound	= 0;
								this._scene.sound.play('Button') 
							} else {
								spr.setTexture('SoundOn');
								this._scene.Sound	= 1;
							}
							localStorage.setItem('Sound', String(this._scene.Sound));
						}
						break;
                }
			}
			
		}, this);

		return spr;
	}
	
	private setupSprite(x, y, key, depth, setInteractive: boolean, scale, scaleY?, tint?) {
		let spr;
		scaleY		 						= scaleY ? scaleY : scale; 
		spr 								= this._scene.add.image(x * this._scene.GameSpriteScale, y * this._scene.GameSpriteScale, key).setScale(scale * this._scene.GameSpriteScale, scaleY * this._scene.GameSpriteScale).setOrigin(.5).setTint(tint);
		spr.depth 							= depth;
		setInteractive ? spr.setInteractive() : true;

		return spr;
	}

	private setupText(style, x, y, tint, size, depth?) {
		let txt								= this._scene.add.text(x * this._scene.GameSpriteScale, y * this._scene.GameSpriteScale, "", style);
		
		txt.setDepth(depth);
		txt.setFontSize(size * this._scene.GameSpriteScale);
		txt.setTint(tint);
		txt.setOrigin(.5);

		return txt;
	}

	private setupMenuStroke(visible) {
		let spr								= this.setupSprite(240, 475, 'Board', 9, false, .72, .65, 0x282828)
		spr.alpha							= .5 * visible;

		return spr;
	}

	private setupTimer() {
		let timer = this._scene.time.addEvent({
			delay: 1000,
			callback: function() {
				this.timerCountSeconds()
			},
			callbackScope: this,
			loop: true
		});
	}

	private setRewardTimestamp() {
		let d 								= new Date();
		let timeStamp						= {
			hours: 		d.getHours() 	+ 0,
			minutes: 	d.getMinutes() 	+ 0,
			seconds: 	d.getSeconds() 	+ 0
		}
		
		return timeStamp;
	}

	private setupRewardUI() {
		let arr;
		let d 								= new Date();
		let timeLeftObj: TimeObject = {
			hours: 		0,
			minutes: 	5,
			seconds: 	49
		};

		let backSpr							= this.setupSprite(407, 662, 'RoundedRectangle', 16, true, .7, .7, 0x48abff);
		let prizeSpr						= this.setupSprite(408, 641, 'GiftBoxIcon', 17, false, .44);
		//prizeSpr.setAngle(30);
		let rewardTxt						= this.setupText(this._styleReward, 408, 682, 0xeddf14, 15, 17);
		let timeTxt							= this.setupText(this._styleReward, 408, 702, 0xffffff, 15, 17);
		let getRewardTxt					= this.setupText(this._styleReward, 408, 692, 0xeddf14, 13, 17);

		

		backSpr.on('pointerdown', function(pointer) {
			if (pointer.buttons === 1) {
				if (this._getReward) {
					this._rewardTimeStamp		= {
						hours: 		d.getHours() 	+ 0,
						minutes: 	d.getMinutes() 	+ 10,
						seconds: 	d.getSeconds() 	+ 15
					}

					this._timeStamp				= {
						hours:		this._rewardTimeStamp.hours 	- d.getHours(),
						minutes:	this._rewardTimeStamp.minutes 	- d.getMinutes(),
						seconds:	this._rewardTimeStamp.seconds 	- d.getSeconds()
					}

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

		arr									= {
			back:		backSpr,
			prize:		prizeSpr,
			getReward:	getRewardTxt,
			reward:		rewardTxt,
			time:		timeTxt,
			timeLeft:	timeLeftObj
		};

		let h 								= this._rewardTimeStamp.hours - d.getHours();
		let m 								= this._rewardTimeStamp.minutes - d.getMinutes();
		let s 								= this._rewardTimeStamp.seconds - d.getSeconds();

		if (h < 0) { 
			h				= 0;
			m				= 0;
			s				= 0;
		}

		this._timeStamp						= {
			hours:		h,
			minutes:	m,
			seconds:	s
		}

		return arr;
	}
//------------------------//------------------------//
//                     UPDATERS                     //
//------------------------//------------------------//

	private getRewardAnimation(spr, ts) {
		let isClicked						= false;
		let reward							= Phaser.Math.Between(10, 50);
		let rewardObject					= {
			back:		spr,
			sunburst: 	this.setupSprite(250, 450, 'Sunburst', 18, false, 1).setAlpha(0).setAngle(0),
			coin:		this.setupSprite(215, 450, 'Coin', 18, false, 0),
			reward:		this.setupText(this._styleReward, 215, 450, 0xffffff, 38, 18).setOrigin(0, .5).setScale(0).setText(String(reward))
		}

		this._getReward						= false;
		this.setupRewardTweens(rewardObject);

		spr.on('pointerdown', function(pointer) {
			if (pointer.buttons === 1) {
				if (!isClicked && spr.scaleX > 12) {
					isClicked				= true;
					this._SM.AllCoins		+= reward;
					this.resetRewardTweens(rewardObject);
					localStorage.setItem('RewardTimestamp', JSON.stringify(ts));
					localStorage.setItem('RewardAvailable', JSON.stringify(this._getReward));
				}
			}
		}, this);
	}

	private setupRewardTweens(obj) {
		let rewardUITween	= this._scene.add.tween({
			targets:    [this._ui.rewardUI.getReward, this._ui.rewardUI.prize],
			ease:       'Quad',
			duration:   200,
			alpha:     	0,
			onComplete: function() {
				rewardUITween.stop();
			}
		});

		let backTween		= this._scene.add.tween({
			targets:    [obj.back],
			ease:       'Quad',
			duration:   600,
			scaleX:     15 * this._scene.GameSpriteScale,
			scaleY:     15 * this._scene.GameSpriteScale,
			onComplete: function() {
				backTween.stop();
			}
		});

		let sunAlphaTween	= this._scene.add.tween({
			targets:    [obj.sunburst],
			ease:       'Quad',
			duration:   600,
			alpha:		.1,
			onComplete: function() {
				sunAlphaTween.stop();
			}
		});

		let sunRotTween		= this._scene.add.tween({
			targets:    [obj.sunburst],
			ease:       'Linear',
			duration:   35000,
			angle:		360,
			repeat:		-1,
			onComplete: function() {
				sunRotTween.resetTweenData(true);
			}
		});

		let rewardTween		= this._scene.add.tween({
			targets:    [obj.reward],
			ease:       'Bounce.easeOut',
			duration:  	800,
			scaleX:		.8 * this._scene.GameSpriteScale,
			scaleY:		.8 * this._scene.GameSpriteScale,
			x:			240 * this._scene.GameSpriteScale,
			onComplete: function() {
				rewardTween.stop();
			}
		});

		let coinTween		= this._scene.add.tween({
			targets:    [obj.coin],
			ease:       'Bounce.easeOut',
			duration:  	800,
			scaleX:		.2 * this._scene.GameSpriteScale,
			scaleY:		.2 * this._scene.GameSpriteScale,
			onComplete: function() {
				coinTween.stop();
			}
		});
	}

	private resetRewardTweens(obj) {
		let rewardUITween	= this._scene.add.tween({
			targets:    [this._ui.rewardUI.prize],
			ease:       'Quad',
			duration:   200,
			delay:		400,
			alpha:     	1,
			onComplete: function() {
				rewardUITween.stop();
			}
		});

		let backTween		= this._scene.add.tween({
			targets:    [obj.back],
			ease:       'Quad',
			duration:   600,
			scaleX:     .93 * this._scene.GameSpriteScale,
			scaleY:     .74 * this._scene.GameSpriteScale,
			onComplete: function() {
				backTween.stop();
			}
		});

		let sunAlphaTween	= this._scene.add.tween({
			targets:    [obj.sunburst],
			ease:       'Quad',
			duration:   600,
			alpha:		0,
			onComplete: function() {
				obj.sunburst.destroy();
				sunAlphaTween.stop();
			}
		});

		let sunRotTween		= this._scene.add.tween({
			targets:    [obj.sunburst],
			ease:       'Quad',
			duration:   600,
			alpha:		0,
			onComplete: function() {
				obj.sunburst.destroy();
				sunRotTween.stop();
			}
		});

		let rewardTween		= this._scene.add.tween({
			targets:    [obj.reward],
			ease:       'Quad',
			delay:		200,
			duration:  	500,
			x:			414 * this._scene.GameSpriteScale,
			y:			641 * this._scene.GameSpriteScale,
			scaleX:		0,
			scaleY:		0,
			angle:		45,
			alpha:		0,
			onComplete: function() {
				obj.reward.destroy();
				rewardTween.stop();
			}
		});

		let coinTween		= this._scene.add.tween({
			targets:    [obj.coin],
			ease:       'Quad',
			delay:		200,
			duration:  	500,
			x:			414 * this._scene.GameSpriteScale,
			y:			641 * this._scene.GameSpriteScale,
			scaleX:		0,
			scaleY:		0,
			angle:		45,
			alpha:		0,
			onComplete: function() {
				obj.coin.destroy();
				coinTween.stop();
			}
		});

		let rewTween		= this._scene.add.tween({
			targets:    [this._ui.rewardUI.reward, this._ui.rewardUI.time],
			ease:       'Quad',
			duration:   500,
			alpha:      1,
			onComplete: function() {
				rewTween.stop();
			}
		});

		let getRewTween		= this._scene.add.tween({
			targets:    [this._ui.rewardUI.getReward],
			ease:       'Quad',
			duration:   500,
			alpha:      0,
			onComplete: function() {
				getRewTween.stop();
			}
		});
	}

	private timerCountSeconds() {
		if (!this._getReward) {

			if (this._timeStamp.hours <= 0) {
				if (this._timeStamp.minutes <= 0) {
					if (this._timeStamp.seconds <= 0) {
						this.setGetRewardValues();
					}
				}
			}

			if (this._timeStamp.seconds <= 0) {
				this._timeStamp.seconds			= 59;
				this._timeStamp.minutes--;
			} else {
				this._timeStamp.seconds--;
			}

			if (this._timeStamp.minutes <= 0) {
				if (this._timeStamp.hours > 0) {
					this._timeStamp.minutes		= 59;
					this._timeStamp.hours--;
				} else {
					this._timeStamp.minutes		= 0;
				}
			}

		}
	}

	private setGetRewardValues() {
		let rewTween	= this._scene.add.tween({
			targets:    [this._ui.rewardUI.reward, this._ui.rewardUI.time],
			ease:       'Quad',
			duration:   500,
			alpha:      0,
			onComplete: function() {
				rewTween.stop();
			}
		});

		let getRewTween	= this._scene.add.tween({
			targets:    [this._ui.rewardUI.getReward],
			ease:       'Quad',
			duration:   500,
			alpha:      1,
			onComplete: function() {
				getRewTween.stop();
			}
		});

		this._timeStamp.hours				= 0;
		this._timeStamp.minutes				= 0;
		this._timeStamp.seconds				= 0;

		this._getReward						= true;
		localStorage.setItem('RewardAvailable', JSON.stringify(this._getReward));
	}

    private updateUI() {
		this._ui.topText.setText(this._RM.Room == RoomsEnum.Menu ? 'BALL LINE' : 'GAME OVER');
		this._ui.bestText.setText('Best');
		this._ui.tapToStart.setText('Tap To Start');
		
		if ( this._scene.input.activePointer.isDown ){

			var _x = this._scene.input.activePointer.x;
			var _y = this._scene.input.activePointer.y;
			if(_x > 75 && _x < 588 && _y>270 && _y <1150 && this.checkEnter){
				this._RM.touchCheck();
				this.checkEnter = false;

			}

		} 
		
		if(this.oneTime){
			this._scene.add.tween({
				targets: this._ui.blueCircle,
				scaleX:1.4,
				scaleY:1.4,
				duration: 1000,
				loop:-1,
				alpha: 0
			})
			this.oneTime = false;
		}
		

		

		this._ui.bestScoreText.setText(String(this._SM.BestScore));
		this._ui.scoreText.setText(String(this._SM.Score));
		this._ui.coinsText.setText(String(this._RM.Room == RoomsEnum.Game ? this._SM.Coins : this._SM.AllCoins));

		if (this._RM.Room == RoomsEnum.Menu) {
			//this._ui.restart.visible	= false;
			//this._ui.play.visible		= true;
		} else if (this._RM.Room == RoomsEnum.GameOver){
			//this._ui.play.visible		= false;
			//this._ui.restart.visible	= true;
			this._scene.scene.restart();
			this.oneTime = true;
			this.checkEnter = true;
			this._ui.menuStroke.alpha			= 0.5;
		}

		this.updateRewardTimer();
	}
	
	private updateRewardTimer() {
		let hours				= this._ui.rewardUI.timeLeft.hours;
		let minutes				= this._ui.rewardUI.timeLeft.minutes;
		let seconds				= this._ui.rewardUI.timeLeft.seconds;

		this._ui.rewardUI.timeLeft.hours 	= this._timeStamp.hours;
		this._ui.rewardUI.timeLeft.minutes 	= this._timeStamp.minutes;
		this._ui.rewardUI.timeLeft.seconds 	= this._timeStamp.seconds;

		this._ui.rewardUI.time.setText((hours >= 10 ? hours : '0' + hours) + ':' + (minutes >= 10 ? minutes : '0' + minutes) + ':' + (seconds >= 10 ? Math.floor(seconds) : '0' + Math.floor(seconds)));
	}   

    public setVisibleMenuUI(v) {


		if(v){
			this._ui.shop.alpha					= 1;
			this._ui.rewardUI.back.alpha		= 1;
			this._ui.rewardUI.prize.alpha		= 1;
			this._ui.rewardUI.reward.alpha		= 1;
			this._ui.rewardUI.time.alpha		= 1;	
			this._ui.topText.alpha				= 1;
			this._ui.tapToStart.alpha 			= 1;

			///////////////////////////////////////
			this._ui.topText.visible			= v;
			this._ui.menuStroke.visible			= v;
			this._ui.shop.visible				= v;
			this._ui.rewardUI.back.visible		= v;
			this._ui.rewardUI.prize.visible		= v;	
			this._ui.rewardUI.getReward.visible	= v;
			this._ui.rewardUI.reward.visible	= v;
			this._ui.rewardUI.time.visible		= v;
			this._ui.blueCircle.visible 		= v;
			this._ui.hand.visible 				= v;
			this._ui.hand.play('snooze').setScale(0.7).setDepth(1);

			
		}
		else{
			this._ui.blueCircle.visible  = v;
			let rewTween	= this._scene.add.tween({
				targets:    [this._ui.topText, this._ui.menuStroke,this._ui.shop,this._ui.rewardUI.back,this._ui.tapToStart,
							 this._ui.rewardUI.prize,this._ui.rewardUI.reward,this._ui.rewardUI.time,this._ui.hand,this._ui.blueCircle	
				],
				ease:       'Quad',
				duration:   1000,
				alpha:      0,
			});
		}
	
    }
//------------------------//------------------------//
//                   BASIC METHODS                  //
//------------------------//------------------------//

    public create() {
		this.setupUI();
		this.timerCountSeconds();
		this.setupTimer();

		this._scene.anims.create({
			key: 'snooze',
			frames: [
				{ key: 'Hand1'; },
				{ key: 'Hand2' },
				{ key: 'Hand2', duration: 650 }
			],
			frameRate: 8,
			repeat: -1
		});
	
	}


    public update() {
		this.updateUI();
		if(this._ui.topText.alpha === 0 && !this._MenuAnim)
		{
			this._MenuAnim = true;
		}
		
    }
}