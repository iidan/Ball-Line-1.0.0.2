import { RoomManager } 		from '../objects/Managers/RoomManager'
import { ObjMapManager } 	from '../objects/Managers/ObjMapManager'
import { ScoreManager } 	from '../objects/Managers/ScoreManager'
import { MenuUI } 			from '../objects/MenuUI'

import PlayScene 			from '../scenes/PlayScene'
import { RoomsEnum } from './Enums';

export class Ball extends Phaser.GameObjects.GameObject {
	constructor(scene, type, index) {
        super(scene, '');
        this._scene         = scene;
        this._type          = type;

        this._index         = index;

        this._RM	        = scene.RoomManager;
        this._OM	        = scene.ObjManager;
        this._SM	        = scene.ScoreManager;
        this._MU	        = scene.MenuUI;

        this._scene.UpdateGroup.add(this);

        this.create();
    }
//------------------------   
    private _scene: PlayScene;
    private _type;
    public blessed;
//------------------------   
    private _index              = -1;
    public get SpriteIndex() {
        return this._index;
    }

    private _isCheckedForCombo  = false;
    public get IsCheckedForCombo() {
        return this._isCheckedForCombo;
    }
    public set IsCheckedForCombo(val) {
        this._isCheckedForCombo = val;
    }

    private _isDestroying       = false;
//------------------------ 
    private _tweenValue         = 0;
    public get TweenValue() {
        return this._tweenValue;
    }
    public set TweenValue(val) {
        this._tweenValue = val;
    }
//------------------------
    private _ballInsertAnimation: number = 0;
    public get BallInsertAnimation() {
        return this._ballInsertAnimation;
    }
    public set BallInsertAnimation(val) {
        this._ballInsertAnimation = val;
    }
//------------------------
    private _idtext;
    private _id                 = -1;
    public get ID() {
        return this._id;
    }
    public set ID(val) {
        this._id = val;
    }

    private _countID            = -1;
    public get CountID() {
        return this._countID;
    }
    public set CountID(val) {
        this._countID = val;
    }
//------------------------
    private _pointsArrayLength;
//------------------------
    private _tweenStart         = -1;
    public get TweenStart() {
        return this._tweenStart;
    }
    public set TweenStart(val) {
        this._tweenStart = val;
    }
//------------------------   
    private _tweenPosition;
    public get TweenPosition() {
        return this._tweenPosition;
    }
    public set TweenPosition(val) {
        this._tweenPosition = val;
    }
//------------------------
    private _next               = null;
    public get NextBall() {
        return this._next;
    }
    public set NextBall(val) {
        this._next = val;
    }
//------------------------
    private _prev               = null;
    public get PrevBall() {
        return this._prev;
    }
    public set PrevBall(val) {
        this._prev = val;
    }
//------------------------
    private _isMover            = false;
    public get IsMover() {
        return this._isMover;
    }
    public set IsMover(val) {
        this._isMover = val;
    }

    private _isMoving            = false;
    public get IsMoving() {
        return this._isMoving;
    }
    public set IsMoving(val) {
        this._isMoving = val;
    }

    public MoveBackwards         = false;
    public MoveForwards          = false;
    public MFStep                = 0;
//------------------------
    private _sprite;
    public get Sprite() {
        return this._sprite;
    }
//------------------------
    private _particlesEmitter;
    public get ParticlesEmitter() {
        return this._particlesEmitter;
    }
//------------------------
    private _RM: RoomManager;
    private _OM: ObjMapManager;
    private _SM: ScoreManager;
    private _MU: MenuUI;
//------------------------
    private line;
    private line2;
    private graphics;
//------------------------
    private overlapCollider     = null;
    private _isAlive            = true;
//------------------------//------------------------//
//                  SETUP & DESTROY                 //
//------------------------//------------------------//
    private defineManagers() {
        this._RM	                = this._scene.RoomManager;
        this._OM	                = this._scene.ObjManager;
        this._SM	                = this._scene.ScoreManager;
        this._MU	                = this._scene.MenuUI;
    }

    private setupParticles() {
        let p                       = this._scene.add.particles('ComboShape',  new Function('return ' + this._scene.cache.text.get('ComboEffect')) ()); //
        p.active                    = true;
        p.depth                     = 8;
                
        this._particlesEmitter = p;
    }

    private setupSprite() {
        let c                       = String.fromCharCode(97 + this._index);
        let spr                     = this._scene.add.image(0, 0, 'Ball_' + String(this._type) + '_' + String(c)).setScale(.220 * this._scene.GameSpriteScale).setOrigin(.5);
        let realRadius              = spr.width * .5;
        
        spr.depth                   = 6;
        spr.angle                   = Phaser.Math.Between(0, 360);

        this.setupPhysics(spr, realRadius);

        return spr;
    }

    private setupPhysics(spr, realRadius) {
        this._scene.BallsPhysicsGroup.add(spr);

        spr.body.setCircle(realRadius, 0, 0);
        spr.body.data = {
            object: this
        }
    }

    private setupDebugEnvironment() {
        this.graphics               = this._scene.add.graphics();
        this.graphics.depth         = 15;
        this.line                   = new Phaser.Geom.Line(0, 0, 0, 0);
        this.line2                  = new Phaser.Geom.Line(0, 0, 0, 0);

        let text 					= "0";
		let style 					= { font: "15px Arial", fill: "#000000", align: "center" };
	
        this._idtext 				= this._scene.add.text(this.Sprite.x, this.Sprite.y, text, style);
        this._idtext.depth          = 16;
        this._idtext.visible        = false;
    }

    private animationManagment(finalScale, finalAlpha, duration, destroy): void {
        this._scene.add.tween({
            targets:    [this._sprite],
            ease:       'Quad',
            duration:   duration,
            delay:      0,
            scaleX:      finalScale * this._scene.GameSpriteScale,
            scaleY:      finalScale * this._scene.GameSpriteScale,
            angle:      0,
            alpha:      finalAlpha,
            onComplete: () => {
                destroy ? this.destroy() : true;
            }
        });
    }

    public destroy() {
        if (this._isAlive) {
            this._isAlive                       = false;
            this._OM.BallArray[this.CountID]    = null;
            (this._next && this._isMover) ? (this._next._isMover = true) : 1;

            if (this._prev) {
                this._prev.NextBall             = null
                this._prev                      = null;
            }
            if (this._next) {
                this._next.PrevBall             = null
                this._next                      = null;
            }
            
            this._OM.countBalls();
            this._sprite.destroy();
        }

    }
//------------------------//------------------------//
//                      MOVEMENT                    //
//------------------------//------------------------//
    public movement() {
        let posFin;
        this.tweenMovementControl(this._scene.BallsAreStopped);

        posFin              = this._scene.computeBallRealPosition(this._tweenStart, this._tweenStart + (32 * this._scene.GameSpriteScale), this._tweenValue);

        this._sprite.x      = posFin.x;
        this._sprite.y      = posFin.y;
    }

    private tweenMovementControl(stopped) {
        let nextTS                                  = this._tweenStart + (32 * this._scene.GameSpriteScale);
        let prevTS                                  = this._tweenStart - (32 * this._scene.GameSpriteScale);
    
        if (this._tweenValue < 1) {
            if (this._ballInsertAnimation != 2) {
                if (this._isMover) {
                    if (!stopped) {
                        this._tweenValue            += this._RM.BallSpeed;
                        this._isMoving              = true;
                    }
                } else if (this._prev && !this.MoveBackwards && !this.MoveForwards) {
                    if (!stopped) {
                        if (this._prev.IsMoving) {
                            if (!this._prev.BallInsertAnimation) {
                                this._tweenValue            = this._prev.TweenValue;
                                this._tweenStart            = this._prev.TweenStart + (32 * this._scene.GameSpriteScale);
                            }
                            this._isMoving          = true;
                        }
                    }
                } else {
                    if (this.MoveBackwards) { 
                        this._tweenValue        -= this._RM.BallSpeed * 4;
                        this._next ? this._next.MoveBackwards = true : true;
                        if (this._tweenValue <= 0) {
                            this.setPrevPosition(prevTS);
                        }
                        this._isMoving              = false;
                    } else if (this.MoveForwards) {
                        // this.Sprite.tint        = 0xff0000;
                        this._tweenValue        += this.MFStep;
                        this._next ? this._next.MoveForwards = true : true;
                        this._next ? this._next.MFStep = this.MFStep : true;
                        this._isMoving              = true;
                    }
                    
                }
            } else {
                if (this.MoveForwards) {
                    // this.Sprite.tint        = 0xff0000;
                    this._tweenValue        += this.MFStep;
                    this._next ? this._next.MoveForwards = true : true;
                    this._next ? this._next.MFStep = this.MFStep : true;
                }
            }
        } else {
            this.setNewPosition(nextTS);
        }
    }

    private setNewPosition(nextTS?) {
        let pointsArray                 = this._OM.PathObject.PathPoints;

        if (this._tweenValue >= 1) {
            this._tweenValue            = this._tweenValue - 1;
            if ( (nextTS >= this._pointsArrayLength - (32 * this._scene.GameSpriteScale)) || (nextTS < 0) ) {
                let value               = (nextTS < 0) ? 0 : this._tweenStart;
                this._tweenPosition     = pointsArray[value];
                if (nextTS < 0) {
                    this._tweenStart    += (32 * this._scene.GameSpriteScale);
                } else {
                    this._tweenValue    = 1;
                }
            } else {
                this._tweenStart        += (32 * this._scene.GameSpriteScale);
                this._tweenPosition     = pointsArray[this._tweenStart];
            }
        }
    }

    private setPrevPosition(prevTS?) {
        let pointsArray                 = this._OM.PathObject.PathPoints;

        if (this._tweenValue <= 0) {
            this._tweenValue            = this._tweenValue + 1;
            this._tweenStart            -= (32 * this._scene.GameSpriteScale);
            this._tweenPosition         = pointsArray[this._tweenStart];
        }
    }

    public moveAllNextBalls(value, step, bIA) {
        this._ballInsertAnimation       = bIA;
        if (bIA == 2) {
            this._tweenValue            += step;
        }
        this._next      ? this._next.moveAllNextBalls(value, step, 1)   : 1;
    }
//------------------------//------------------------//
//                     COLLISION                    //
//------------------------//------------------------//
    public checkForCombo(toNext, leftToExplode) {
        let cmpObj              = toNext ? this._next : this._prev;

        if (leftToExplode !== -1) {

            if (cmpObj !== null) {
                if (this._scene.BallsInComboArray.length < 6) {
                    cmpObj.IsCheckedForCombo    = true;
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

    private callComboEnd(isBomb): void {
        let retArr                          = this._scene.BallsInComboArray;
        this._scene.ComboEndedSide++;
        if (this._scene.ComboEndedSide < 2) return;

            this._scene.ComboEndedSide      = 0;
            retArr.forEach(element => {
                element.IsCheckedForCombo   = false;
            });

        if (!(retArr.length >= 3 || isBomb)) return;

            this._scene.Sound ? this._scene.sound.play('Score') : true;
            
            this._SM.Score                  += retArr.length;
            retArr.sort((a, b) => {
                return a.ID - b.ID;
            });

            if (retArr[retArr.length - 1].NextBall) {
                if (!retArr[0].IsMover) {
                    retArr[retArr.length - 1].NextBall.MoveBackwards    = true;
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
               var color ;
               var temp = String(this._type)+ String.fromCharCode(97 + this._index);

                if(temp === "1b" || temp === "4c" || temp === "6a"){color = 0x713E98;}
                else if(temp === "1c" || temp === "3b" || temp === "5a"){color = 0x29B35A;}
                else if(temp === "2b" || temp === "3a" || temp === "6c"){color = 0xEF4923}
                else if(temp === "2c" || temp === "4a" || temp === "6b"){color = 0xF061A4}
                else if(temp === "2a" || temp === "4b" || temp === "5c"){color = 0xF6891E}
               retArr.forEach(element => {
                var emitter = this._scene.add.particles('spark1').createEmitter({
                        blendMode: 'SCREEN',
                        scale: { start: 0.35, end: 0 },
                        speed: { min: -100, max: 100 },
                        quantity: 4,
                        lifespan:{"ease":"Quart.easeOut","min":500,"max":1000},
                        active:true,
                        visible:true,
                        collideBottom:true,
                        collideLeft:true,
                        collideRight:true,
                        collideTop:true,
                        on:false,
                        particleBringToTop:true,
                        angle: { min: 0, max: 360 },
                       // gravityY: 800,
                        tint: color
                });
                
                emitter.emitParticleAt(element.Sprite.x, element.Sprite.y, 150);
                element.animationManagment(1, 0, 100, true); 
                ////////////////shake camera on combo//////////////////
              //  var tempvalue = 10;
             //   var min = -2;
              //  var max = 2;
              //  this._scene.cameras.main.x+= Math.floor(Math.random() * (max - min + 1)) + min;
               // this._scene.cameras.main.y+= Math.floor(Math.random() * (max - min + 1)) + min;
                ///////////////////////////////////////////////
            });
    }

    private collideWithOtherChain(self, other) {
        let selfObject  = self.body.data.object;
        let otherObject = other.body.data.object;

        if (otherObject.ID === selfObject.ID + 1) {
            if (otherObject.PrevBall === null && selfObject.NextBall === null) {
                otherObject.PrevBall  = selfObject;
                selfObject.NextBall   = otherObject;

                this._OM.BallArray.forEach(element => {
                    if (element != null) {
                        element.MoveBackwards = false;
                    }
                });

                if (otherObject.SpriteIndex == selfObject.SpriteIndex) {
                    this._scene.BallsInComboArray               = [selfObject];
                    selfObject.IsCheckedForCombo                = true;
                    selfObject.checkForCombo(true, -1);
                    selfObject.checkForCombo(false, -1);
                }
            }
        }
    }

    private collideWithEndOfPath(self, other) {
        let selfObject  = self.body.data.object;

        if (!selfObject._isDestroying && selfObject._RM.IsPlaying) {
            selfObject._isDestroying          = true;
            if (!selfObject._RM.IsGameOver) {
                selfObject._RM.IsGameOver     = true;
                this._scene.BallsAreStopped   = false;
                selfObject._scene.Sound ? selfObject._scene.sound.play('Failed') : true;
                this._scene.cameras.main.shake(500);

            }
        }
    }
//------------------------//------------------------//
//                       DEBUG                      //
//------------------------//------------------------//
    private drawID() {
        this._idtext.visible        = this._isAlive ? true : false;
        this._idtext.text			= "" + this.ID;
        this._idtext.x              = this.Sprite.x;
        this._idtext.y              = this.Sprite.y;
        this._idtext.setOrigin(.5);
    }

    public drawLines(line1, line2) {
        this.lineManagment(line1, line2);

        this.graphics.clear();
        this.graphics.lineStyle(5, 0xFF00000, 1.0);
        this._prev != null ? this.graphics.strokeLineShape(line1) : 1;
        this.graphics.lineStyle(5, 0x00FF00, 1.0);
        this._next != null ? this.graphics.strokeLineShape(line2) : 1;
    }

    private lineManagment(l: Phaser.Geom.Line, l2: Phaser.Geom.Line) {
        let p, n;

        p = (this._prev ? this._prev : this);
        n = (this._next ? this._next : this);

        l.x1    = this._sprite.x;
        l.y1    = this._sprite.y;
        l.x2    = p._sprite.x;
        l.y2    = p._sprite.y - 10;

        l2.x1   = this._sprite.x;
        l2.y1   = this._sprite.y;
        l2.x2   = n._sprite.x;
        l2.y2   = n._sprite.y + 10;
    }

    private debugUpdate() {
        if (this._scene.Debug) {
            this.drawLines(this.line, this.line2);
            this.drawID();
        }
    }
//------------------------//------------------------//
//                  BASIC METHODS                   //
//------------------------//------------------------//
    public create() {
        this._sprite                = this.setupSprite();
        this._pointsArrayLength     = this._OM.PathObject.PathPoints.length;
        this.defineManagers();
        this.setupDebugEnvironment();
        this.setupParticles();
    }

	public update() {
        if (this._isAlive){
            if (this._RM.IsPlaying || this._RM.Room === RoomsEnum.Editor){
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

    private ballsBehaviour() {
        this._scene.physics.overlap(this._sprite, this._scene.EndOfPathPhysicsGroup, this.collideWithEndOfPath.bind(this));
        if (this._next === null || this._prev === null) {
            this._scene.Debug ? this._sprite.setTint(0x717171) : 1;
            this.overlapCollider    = this._scene.physics.overlap(this._sprite, this._scene.BallsPhysicsGroup, this.collideWithOtherChain.bind(this));
        } else {
            if (this.overlapCollider !== null) {
                this._scene.Debug ? this._sprite.setTint(0xFFFFFF) : 1;
                this._scene.physics.world.removeCollider(this.overlapCollider);
            }
        }

        if (this._next) {
            if (this._id < this._next.ID) {
                if (this._prev === this._next) {
                    this._prev          = null;
                    this._next.NextBall = null;
                }
            }
        }
        if (this._prev) {
            if (this._id > this._prev.ID) {
                if (this._prev === this._next) {
                    this._next          = null;
                    this._prev.PrevBall = null;
                }
            }
        }
    }
}