export default class Preloader extends Phaser.Scene  {
	constructor() {
    	super({
			key: 'Preloader'
		});
	}

    preload() {
        // EDITOR
        this.load.image('Save',             './assets/sprites/Editor/save.png');
        this.load.image('Load',             './assets/sprites/Editor/load.png');
        this.load.image('Minus',            './assets/sprites/Editor/minus.png');
        this.load.image('Plus',             './assets/sprites/Editor/plus.png');
        this.load.image('Curve',            './assets/sprites/Editor/curve.png');

        // MENU
        this.load.image('RoundedRectangle', './assets/sprites/Menu/rounded.png');
        this.load.image('MenuCircle',       './assets/sprites/Menu/circle.png');

        this.load.image('GiftBoxIcon',      './assets/sprites/Menu/giftbox.png');
        this.load.image('Sunburst',         './assets/sprites/Menu/sunburst.png');

        this.load.image('ShopIcon',         './assets/sprites/Menu/cube.png');

        this.load.image('MusicOff',         './assets/sprites/Menu/music_off.png');
        this.load.image('MusicOn',          './assets/sprites/Menu/music_on.png');

        this.load.image('SoundOff',         './assets/sprites/Menu/sound_off.png');
        this.load.image('SoundOn',          './assets/sprites/Menu/sound_on.png');

        this.load.image('PlayIcon',         './assets/sprites/Menu/play.png');
        this.load.image('RestartIcon',      './assets/sprites/Menu/restart.png');
        
        this.load.image('LockIcon',         './assets/sprites/Menu/lock.png');
        this.load.image('UnlockIcon',       './assets/sprites/Menu/unlock.png');

        this.load.image('BlueCircle',         './assets/sprites/Menu/blueCircle.png');

        //this.load.spritesheet('Hand', './assets/sprites/Menu/hands.png' ,);
       // this.load.multiatlas('Hand', './assets/sprites/Menu/hands2.json', '/assets/sprites/Menu');
        //this.load.spritesheet('Hand', './assets/sprites/Menu/hands.png', {frameWidth: 271, frameHeight: 468});

        this.load.image('Hand1',         './assets/sprites/Menu/hand1.png');
        this.load.image('Hand2',         './assets/sprites/Menu/hand2.png');
        this.load.image('Hand3',         './assets/sprites/Menu/hand3.png');




        // SHOP
        this.load.image('ShopTop',          './assets/sprites/Shop/backTop.png');
        this.load.image('ShopBackground',   './assets/sprites/Shop/back.png');
        this.load.image('Exit',             './assets/sprites/Shop/exit.png');
        
        // GAME
        this.load.image('Board',            './assets/sprites/Menu/Board.png');
        this.load.image('Player_Circle',    './assets/sprites/circle.png');
        this.load.image('Player_Cannon',    './assets/sprites/Balls/cannon.png');
        this.load.image('Player_CannonBack','./assets/sprites/Balls/cannon_back.png');
        this.load.image('ShopBack',         './assets/BACK.png');

        this.load.image('Bomb',             './assets/sprites/Balls/bomb.png');
        this.load.image('Coin',             './assets/sprites/Balls/coin.png');

        // Loading Balls
        for(let i = 1; i <= 6; i++) {
            for(let j = 0; j < 3; j++) {
                let c = String.fromCharCode(97 + j);
                this.load.image('Ball_' + String(i) + '_' + String(c), './assets/sprites/Balls/' + String(i) + String(c) + '.png');
            }
        }


        // Loading Backgrounds
        for(let i = 1; i <= 5; i++) {
            this.load.image('Background_' + String(i), './assets/sprites/Backgrounds/bg' + String(i) +'.png');
        }
        // Loading Particles
        this.load.atlas('ComboShape',       'assets/particles/Combo/shapes.png', 'assets/particles/Combo/shapes.json');
        this.load.atlas('CannonShape',      'assets/particles/Cannon/shapes.png', 'assets/particles/Cannon/shapes.json');
        this.load.text('ComboEffect',       'assets/particles/Combo/combo.json');
        this.load.text('CannonEffect',      'assets/particles/Cannon/cannon.json');
        this.load.image('blackScreen', './assets/sprites/Backgrounds/blackScreen.png');
        this.load.image('spark1',             './assets/sprites/Balls/blue.png');
        this.load.image('spark2',             './assets/sprites/Balls/green.png');
        this.load.image('spark3',             './assets/sprites/Balls/purpule2.png');


        // Loading Music
        this.load.audio('Track1',           './assets/sounds/song.mp3');

        // Loading Sounds
        this.load.audio('Button',           './assets/sounds/button.mp3');
        this.load.audio('Tick',             './assets/sounds/tick.mp3');
        this.load.audio('Score',            './assets/sounds/score.mp3');
        this.load.audio('Coin',             './assets/sounds/fcoin.mp3');
        this.load.audio('Explosion',        './assets/sounds/explosion.mp3');
        this.load.audio('Failed',           './assets/sounds/failed.mp3');

        // Loading Editor Things
        for(let i = 1; i <= 10; i++) {
            this.load.image('LevelBack_' + String(i), './assets/sprites/levels/Level ' + String(i) +'.png');
        }
        this.load.image('EditorDragPoint',  './assets/sprites/dot.png');
        this.load.image('EditorCoin',       './assets/sprites/Editor/coin.png');
        this.load.image('EditorCube',       './assets/sprites/Editor/cube.png');

        // Loading Levels
        for(let i = 1; i <= 10; i++) {
            this.load.json('Level' + String(i), './assets/levels/level' + String(i) + '.json');
        }

        this.load.once('complete', function(){
            this.scene.start('MainScene');
        }, this);
    }
}

// this.level = JSON.parse(this.game.cache.getText('Level1'));