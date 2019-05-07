import { RoomManager } 		from '../../objects/Managers/RoomManager'
import { ObjMapManager } 	from '../../objects/Managers/ObjMapManager'
import { ScoreManager } 	from '../../objects/Managers/ScoreManager'
import { MenuUI } 			from '../../objects/MenuUI'

import PlayScene 			from '../../scenes/PlayScene'

interface Coins {
    sprite:         Phaser.GameObjects.Image,
    text:           Phaser.GameObjects.Text
}

interface UI {
    background:     Array<Phaser.GameObjects.Image>,
	exit:           Phaser.GameObjects.Image,
    coins:          Coins,
    skins:          Array<Array<Phaser.GameObjects.Image>>,
    shop:           Phaser.GameObjects.Text,
}

export class ShopManager extends Phaser.GameObjects.GameObject {
	constructor(scene) {
        super(scene, '');
        this._scene         = scene;

        this._RM	        = scene.RoomManager;
        this._OM	        = scene.ObjManager;
        this._SM	        = scene.ScoreManager;
        this._MU	        = scene.MenuUI;

        this._scene.UpdateGroup.add(this);
        this.create();
    }
//------------------------   
    private _scene: PlayScene;
    private _ui: UI;
//------------------------   
    private _unlock                         = this.loadSkins();
    private _styleText 						= { font: '35px Orbitron-Bold', fill: "#f9e83b"};
//------------------------   
    private _RM: RoomManager;
    private _OM: ObjMapManager;
    private _SM: ScoreManager;
    private _MU: MenuUI;
//------------------------//------------------------//
//                 	     SETUP                      //
//------------------------//------------------------//
    private setupUI() {
        let ui: UI   = {
            background: this.setupBackground(),
            exit:       this.setupButton('Exit', 40, 40),
            coins:      this.setupCoins(),
            skins:      this.setupSkins(),
            shop:       this.setupText(240, 110, 24, 38, 'SHOP')
        };
        return ui;
    }

    private setupBackground() {
        let bckg:   Array<Phaser.GameObjects.Image> = [];

        bckg[0] 							= this.setupSprite(240, 450, 'ShopBackground', 20, false, 1);
        bckg[1] 							= this.setupSprite(239, 77, 'ShopTop', 23, false, 1);

        return bckg;
    }

    private setupCoins() {
        let c:      Coins                   = { sprite: null, text: null };
        let spr:    Phaser.GameObjects.Image;
        let txt:    Phaser.GameObjects.Text;

        spr 							    = this.setupSprite(446, 33, 'Coin', 24, false, .18);
        spr.depth                           = 24;

        txt                                 = this.setupText(386, 33, 24, 38, String(this._SM.AllCoins)) 

        c.sprite                            = spr;
        c.text                              = txt;

        return c;
    }

    private setupText(x, y, depth, size, text) {
        let txt:    Phaser.GameObjects.Text;

        txt							        = this._scene.add.text(x * this._scene.GameSpriteScale, y * this._scene.GameSpriteScale, text, this._styleText);
        txt.depth						    = depth;
        txt.setFontSize(size * this._scene.GameSpriteScale);
        txt.setOrigin(.5);

        return txt;
    }

    private setupSprite(x, y, key, depth, setInteractive: boolean, scale, scaleY?, tint?) {
		let spr;
		scaleY		 						= scaleY ? scaleY : scale; 
		spr 								= this._scene.add.image(x * this._scene.GameSpriteScale, y * this._scene.GameSpriteScale, key).setScale(scale * this._scene.GameSpriteScale, scaleY * this._scene.GameSpriteScale).setOrigin(.5).setTint(tint);
		spr.depth 							= depth;
		setInteractive ? spr.setInteractive() : true;

		return spr;
	}
    
	private setupButton(key, x, y): Phaser.GameObjects.Image {
		let spr 							= this.setupSprite(x, y, key, 24, true, 1);
    
		spr.on('pointerdown', function(pointer) {
			if (pointer.buttons === 1) {
                this._scene.Sound ? this._scene.sound.play('Button') : true;
                this.destroy();
            }
        },this)

        return spr;
    }

    private setupSkins() {
        let arr:    Array<Array<Phaser.GameObjects.Image>> = [];
        let maxI                            = 3;
        let maxJ                            = 2;

        let winSel 							= this.setupSprite(140, 259, 'RoundedRectangle', 20, true, 1.2, 1.2, 0x28E975);
        winSel.setData('key', 'WinSel');

        for (let i = 0; i < maxI; i++) {
            for (let j = 0; j < maxJ; j++) {
                let window                          = [];
                let balls                           = [];
                let ballPos                         = [new Phaser.Math.Vector2(99, 224), new Phaser.Math.Vector2(142, 287), new Phaser.Math.Vector2(184, 224)];

                let xOff                            = (j * 200);
                let yOff                            = (i * 231);

                let skinID                          = (i * 2) + j;
                let skinPrice                       = (skinID) * 150;

                let win 							= this.setupSprite(140 + xOff, 259 + yOff, 'RoundedRectangle', 21, true, 1.15, 1.15, 0x1f1f1f);
                win.setData('id', skinID);
                win.setInteractive();

                let winDark 						= this.setupSprite(140 + xOff, 259 + yOff, 'RoundedRectangle', 22, true, 1.15, 1.15, 0x000000);
                winDark.alpha 						= .8 * (1 - this._unlock[skinID]);
                winDark.setData('id', skinID);
                winDark.setData('price', skinPrice);

                let priceTxt                        = this.setupText(125 + xOff, 259 + yOff, 23, 24, skinPrice);
                priceTxt.alpha 						= (1 - this._unlock[skinID]);

                let priceSpr 						= this.setupSprite(170 + xOff, 259 + yOff, 'Coin', 23, false, .15);
                priceSpr.alpha 						= 1 * (1 - this._unlock[skinID]);
                priceSpr.depth 						= 23;
                
                let lockSpr 						= this.setupSprite(210 + xOff, 325 + yOff, 'LockIcon', 23, false, .15);
                lockSpr.alpha 						= 1 * (1 - this._unlock[skinID]);

                win.on('pointerdown', function(pointer) {
                    if (pointer.buttons === 1) {
                        let id = win.getData('id');
                        if (this._unlock[id]) {
                            this.updateSelected(id, maxI);
                            this._OM.BallType = id + 1;
                        }
                    }
                }, this)

                winDark.on('pointerdown', function(pointer) {
                    if (pointer.buttons === 1) {
                        let id = winDark.getData('id');
                        if (!this._unlock[id]){
                            if (this._SM.AllCoins > winDark.getData('price')) {
                                this._scene.add.tween({
                                    targets:    [winDark, priceTxt, priceSpr, lockSpr],
                                    ease:       'Quad',
                                    duration:   500,
                                    delay:      0,
                                    angle:      0,
                                    alpha:      0,
                                });
                                
                                this._unlock[id]    = 1;
                                this._ui.coins.txt  = this._SM.setNewAllCoins(-winDark.getData('price'));
                                localStorage.setItem('SkinUnlock' + id, '1');
                            }
                        }
                    }
                }, this)

                for (let k = 0; k < 3; k++) {
                    let c                           = String.fromCharCode(97 + k);
                    let s                           = 'Ball_' + String(skinID + 1) + '_' + String(c);

                    balls[k] 						= this.setupSprite(ballPos[k].x + xOff, ballPos[k].y + yOff, s, 21, false, .2);
                }

                window.push(win);
                window.push(winDark);
                window.push(priceTxt);
                window.push(priceSpr);
                window.push(lockSpr);
                balls.forEach(element => {
                    window.push(element);
                });
                
                arr[skinID]                    = window;
            }
            arr[(maxI * 2)] = [winSel];
        }

        return arr;
    }

    private loadSkins() {
        let arr = [];
        for (let i = 0; i < 6; i++) {
            let t = parseInt(localStorage.getItem('SkinUnlock' + i));
            t ? arr[i] = t : arr[i] = 0;
        }
        return arr;
    }

    private updateSelected(id, height) {
        let yID                             = Math.floor(id / height);
        let xID                             = id - (yID * height);

        let xOff                            = (xID * 200);
        let yOff                            = (yID * 231);

        this._ui.skins.forEach(element => {
            element.forEach(el => {
                if (el.getData('key') == 'WinSel') {
                    el.x                            = (140 + xOff) * this._scene.GameSpriteScale;
                    el.y                            = (259 + yOff) * this._scene.GameSpriteScale;
                }
            });
        });
    }
//------------------------//------------------------//
//                  BASIC METHODS                   //
//------------------------//------------------------//
    public destroy() {
        this._ui.background.forEach(element => {
            element.destroy();
        });
        this._ui.skins.forEach(element => {
            element.forEach(el => {
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

    public create() {
        this._ui = this.setupUI();
        this.updateSelected(this._OM.BallType - 1, 3);
    }

    public update() {

    }

}