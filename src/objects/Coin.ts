import { RoomManager } 		from '../objects/Managers/RoomManager'
import { ObjMapManager } 	from '../objects/Managers/ObjMapManager'
import { ScoreManager } 	from '../objects/Managers/ScoreManager'
import { MenuUI } 			from '../objects/MenuUI'

import PlayScene 			from '../scenes/PlayScene'

export class Coin extends Phaser.GameObjects.GameObject {
	constructor(scene, x, y) {
        super(scene, '');
        this._scene         = scene;

        this._x             = x;
        this._y             = y;

        this._RM	        = scene.RoomManager;
        this._OM	        = scene.ObjManager;
        this._SM	        = scene.ScoreManager;
        this._MU	        = scene.MenuUI;

        this._scene.UpdateGroup.add(this);

        this.create();
    }
//------------------------
    private _scene: PlayScene;
//------------------------
    private _sprite: Phaser.GameObjects.Image;
    public get Sprite(): Phaser.GameObjects.Image {
        return this._sprite;
    }

    private _isActive: boolean       = true;
    public get IsActive(): boolean {
        return this._isActive;
    }

    private _isDestroyed: boolean    = false;
    public get IsDestroyed(): boolean {
        return this._isDestroyed;
    }
//------------------------
    private _scale: number  = 0;

    private _x: number;
    public get X(): number {
        return this._x;
    }
    private _y: number;
    public get Y(): number {
        return this._y;
    }

//------------------------
    private _RM: RoomManager;
    private _OM: ObjMapManager;
    private _SM: ScoreManager;
    private _MU: MenuUI;
//------------------------//------------------------//
//                  SETUP & DESTROY                 //
//------------------------//------------------------//
    private defineManagers() {
        this._RM	                = this._scene.RoomManager;
        this._OM	                = this._scene.ObjManager;
        this._SM	                = this._scene.ScoreManager;
        this._MU	                = this._scene.MenuUI;
    }

    private setupSprite(): Phaser.GameObjects.Image {
        let spr                     = this._scene.physics.add.image(this._x, this._y, 'Coin').setScale(this._scale * this._scene.GameSpriteScale).setOrigin(.5);
        spr.depth                   = 5;
        spr.alpha                   = 0;
        spr.angle                   = 180;
        this.setupPhysics(spr);

        return spr;
    }

    private setupPhysics(spr): void {
        this._scene.physics.world.enableBody(spr);
        this._scene.CoinsPhysicsGroup.add(spr);
        spr.body.setCircle(spr.width * .5, 0, 0);
    }

    public destroy(create?: boolean): void {
        if (!this._isDestroyed) {
            if (create) {
                this._OM.createCoin();
            }
            this._isDestroyed           = true;
            this._sprite.destroy();
        }
    }
//------------------------//------------------------//
//                    COLLISION                     //
//------------------------//------------------------//
    private collideWithBall(): void {
        this._scene.Sound ? this._scene.sound.play('Coin') : true;
        if (this._isActive) {
            this._SM.Coins++;
            this._isActive              = false;
        }
        this.animationManagment(.5, 0, 150, true);
    }

    private animationManagment(finalScale, finalAlpha, duration, destroy): void {
        this._scene.add.tween({
            targets:    [this._sprite],
            ease:       'Quad',
            duration:   duration,
            delay:      0,
            scaleX:     finalScale * this._scene.GameSpriteScale,
            scaleY:     finalScale * this._scene.GameSpriteScale,
            angle:      0,
            alpha:      finalAlpha,
            onComplete: () => {
                destroy ? this.destroy(true) : true;
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
    }
//------------------------//------------------------//
//                  BASIC METHODS                   //
//------------------------//------------------------//
    public create(): void {
        this._sprite                = this.setupSprite();
        this._scene.physics.add.overlap(this._sprite, this._scene.PlayerBallPhysicsGroup, this.collideWithBall.bind(this));
        this.defineManagers();
        this.animationManagment(.2, 1, 750, false);
    }

    public update(): void {
        if (this._RM.IsGameOver) {
            this.animationManagment(.5, 0, 150, true);
        }
    }

}