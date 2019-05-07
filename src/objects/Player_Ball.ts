import { RoomManager } 		from '../objects/Managers/RoomManager'
import { ObjMapManager } 	from '../objects/Managers/ObjMapManager'
import { ScoreManager } 	from '../objects/Managers/ScoreManager'
import { MenuUI } 			from '../objects/MenuUI'

import { Ball }         from '../objects/Ball'

import PlayScene 		from '../scenes/PlayScene'

interface BallObject {
    Angle:      number,
    TweenPos:   Phaser.Math.Vector2,
    TweenStart: number,
    TweenValue: number,
    ID:         number,
    CountID:    number,
    PrevBall:   Phaser.GameObjects.GameObject,
    NextBall:   Phaser.GameObjects.GameObject
}

export class Player_Ball extends Phaser.GameObjects.GameObject {
	constructor(scene, type, x, y) {
        super(scene, '');
        this._scene         = scene;
        this._type          = type;

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
    private _type: number           = 0;
    private _moveValue: number      = 0;
    private _ballsThatMoveArray     = [];
//------------------------
    private _isBomb: boolean        = (Phaser.Math.Between(0, 100) < 4) ? true : false;
    public get IsBomb() {
        return this._isBomb;
    }

    private _index: number          = Phaser.Math.Between(0, 2);
    public get SpriteIndex() {
        return this._index;
    }
//------------------------    
    private _x: number              = -1;
    public get X() {
        return this._x;
    }
    private _y: number              = -1;
    public get Y() {
        return this._y;
    }
//------------------------
    private _sprite;
    public get Sprite() {
        return this._sprite;
    }
    private _scale: number          = 0;
    public get Scale() {
        return this._scale;
    }
//------------------------
    private _isDestroyed: boolean   = false;

    private _destroyCallTries       = [0, 0];
//------------------------
    private _dontCollide: boolean   = false;
    public get DontCollide() {
        return this._dontCollide;
    }
    public set DontCollide(val) {
        this._dontCollide = val;
    }

    private _nextBallObject         = null;
    public get NextBallObject() {
        return this._nextBallObject;
    }
    public set NextBallObject(val) {
        this._nextBallObject = val;
    }

    private _moveBalls: boolean     = false;
    public get MoveBalls() {
        return this._moveBalls;
    }
    public set MoveBalls(val) {
        this._moveBalls = val;
    }

    private _ballSubstitution       = null;
    public get BallSubstitution() {
        return this._ballSubstitution;
    }
    public set BallSubstitution(val) {
        this._ballSubstitution = val;
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

    private setupSprite() {
        let spr     : Phaser.GameObjects.Image;
        let c       : String;
        let s       : String;
        let offsetY : number;

        if (!this._isBomb) {
            c               = String.fromCharCode(97 + this._index);
            s               = 'Ball_' + String(this._type) + '_' + String(c);

            spr             = this._scene.add.image(this._x, this._y, String(s)).setScale(0).setOrigin(.5);
            offsetY         = (spr.height * .35) * .5;
        } else {
            spr             = this._scene.add.image(this._x, this._y, 'Bomb').setScale(0).setOrigin(.5, .64);
            offsetY         = (spr.height * .4) * .5;
        }

        spr.depth           = 2;
        this.setupPhysics(spr, (spr.width * .15), offsetY);

        return spr;
    }

    private setupPhysics(spr, realRadius, offsetY) {
        this._scene.PlayerBallPhysicsGroup.add(spr);

        spr.body.setCircle(realRadius, realRadius * 2.5, offsetY * 2.5);
        spr.body.bounce.set(1);

        spr.body.setCollideWorldBounds(true);
        spr.body.onWorldBounds = true;
        spr.body.world.on('worldbounds', function(body) {
            body.setCollideWorldBounds(false);
        }, this)

        spr.body.data = {
            object: this
        }

        this._scene.physics.add.overlap(spr, this._scene.BallsPhysicsGroup, this.collideWithBall.bind(this));
    }

    private setupBallSubstitution(ballConfig: BallObject): Phaser.GameObjects.GameObject {
        let ball                                    = new Ball(this._scene, this._type, this._index);
        
        ball.Sprite.alpha                           = 0;
        ball.Sprite.angle                           = ballConfig.Angle;
        
        ball.TweenPosition                          = ballConfig.TweenPos;
        ball.TweenStart                             = ballConfig.TweenStart;
        ball.TweenValue                             = ballConfig.TweenValue;
        ball.ID                                     = ballConfig.ID;
        ball.CountID                                = ballConfig.CountID;

        ball.PrevBall                               = ballConfig.PrevBall;
        ball.NextBall                               = ballConfig.NextBall;

        return ball;
    }

    private setupComboCheck(ball) {
        this._scene.BallsInComboArray               = [ball];
        ball.IsCheckedForCombo                      = true;
        ball.checkForCombo(true, -1);
        ball.checkForCombo(false, -1);
    }

    private animationManagment(finalScale): void {
        if (this._scale < finalScale) {
            this._scale                             += (finalScale - this._scale) * .1;
            this._sprite.setScale(this._scale);
        }
    }

    public destroy(fromInserting): void {
        if (!this._isDestroyed) {
            if (fromInserting) {
                this._scene.BallsAreStopped         = false;
                this._moveBalls                     = false;
                this.setupComboCheck(this._ballSubstitution);

                this._OM.BallArray.forEach(element => {
                    if (element != null) {
                        element.MoveForwards = false;
                    }
                });
            }
            this._OM.PlayerObject     ? this._OM.PlayerObject.createNewBall()   : true;
            this._isDestroyed                       = true;
            this._sprite.destroy();
        }
    }
//------------------------//------------------------//
//                  BALLS INTERACTION               //
//------------------------//------------------------//

    // speed of the ball
    public shoot(direction) {
        this._scene.physics.velocityFromRotation(direction, 1000 * this._scene.GameSpriteScale, this._sprite.body.velocity);
    }

    private collideWithBall(self, other) {
        let selfObject                      = self.body.data.object;
        let otherObject                     = other.body.data.object;
        let ballConfig:     BallObject;

        if (!selfObject.DontCollide){
            if (!selfObject.IsBomb) {
                let obj;
                let objIncr;

                let ball                    = null;
                let ballArray               = this._OM.BallArray;
                let nbObj                   = null;
                let prevSet                 = null;
                let nextSet                 = null;
    
                let pathPoints              = this._OM.PathObject.PathPoints;

                let p1                      = (16 * this._scene.GameSpriteScale);
                let p2                      = p1 + (32 * this._scene.GameSpriteScale);
    
                let prevPoint1              = ((otherObject.TweenStart - p1) > 0) ? (otherObject.TweenStart - p1) : 0;
                let prevPoint2              = ((otherObject.TweenStart - p2) > 0) ? (otherObject.TweenStart - p2) : 0;
    
                let nextPoint1              = ((otherObject.TweenStart + p1) < pathPoints.length) ? (otherObject.TweenStart + p1) : (pathPoints.length - 1);
                let nextPoint2              = ((otherObject.TweenStart + p2) < pathPoints.length) ? (otherObject.TweenStart + p2) : (pathPoints.length - 1);
    
                let prev                    = this._scene.computeBallRealPosition(prevPoint2, prevPoint1, otherObject.TweenValue);
                let next                    = this._scene.computeBallRealPosition(nextPoint1, nextPoint2, otherObject.TweenValue);
    
                let dp_arr                  = [prev.x, prev.y, selfObject.Sprite.x, selfObject.Sprite.y];
                let dn_arr                  = [next.x, next.y, selfObject.Sprite.x, selfObject.Sprite.y];
        
                let dist_prev               = Phaser.Math.Distance.Between(dp_arr[0], dp_arr[1], dp_arr[2], dp_arr[3]);
                let dist_next               = Phaser.Math.Distance.Between(dn_arr[0], dn_arr[1], dn_arr[2], dn_arr[3]);
    
                if (dist_next < dist_prev) {
                    nbObj                   = otherObject.NextBall;
                    prevSet                 = otherObject;
                    nextSet                 = nbObj;
    
                    obj                     = nbObj ? nbObj : otherObject;
                    objIncr                 = nbObj ? 0     : 1;
                } else {
                    nbObj                   = otherObject.PrevBall;
                    prevSet                 = nbObj;
                    nextSet                 = otherObject;
    
                    obj                     = nbObj ? nbObj : otherObject;
                    objIncr                 = nbObj ? 1     : 0;
                }

                ballConfig                  = {
                    Angle:      this._sprite.angle,
                    TweenPos:   this._OM.PathObject.PathPoints[obj.TweenStart],
                    TweenStart: prevSet ? prevSet.TweenStart : otherObject.TweenStart,
                    TweenValue: prevSet ? prevSet.TweenValue : otherObject.TweenValue,
                    ID:         obj.ID + objIncr,
                    CountID:    ballArray.length,
                    PrevBall:   prevSet,
                    NextBall:   nextSet
                }

                ball                        = this.setupBallSubstitution(ballConfig);
                ballArray[ball.CountID]     = ball;

                prevSet ? prevSet.NextBall  = ball : true;
                nextSet ? nextSet.PrevBall  = ball : true;
    
                if (nextSet) {
                    if (nextSet.IsMover) {
                        ball.IsMover        = true;
                        ball.TweenStart     = nextSet.TweenStart - 32;
                        nextSet.IsMover     = false;
                        nextSet.MoveForwards= true;
                    }
                }
    
                this._scene.Sound ? this._scene.sound.play('Tick') : true;
                this._OM.BallArray[this._OM.BallArrayPosition++] = ball;
                ball.IsMover ? this._scene.BallsAreStopped = true : this.findMover(prevSet);
    
                selfObject.BallSubstitution = ball;
                selfObject.NextBallObject   = nextSet;
                selfObject.MoveBalls        = true;
                selfObject.DontCollide      = true;
            } else {
                this._scene.Sound ? this._scene.sound.play('Explosion') : true;
                this._scene.BallsInComboArray = [otherObject];

                otherObject.IsCheckedForCombo = true;
                otherObject.checkForCombo(true, 1);
                otherObject.checkForCombo(false, 1);
                selfObject.destroy();
            }
        }
    }

    private findMover(prev): boolean {
        if (prev !== null) {
            if (prev.IsMover) {
                this._scene.BallsAreStopped             = true;
                return true;
            } else {
                let b = this.findMover(prev.PrevBall);
                if (!b) {
                    prev.IsMover = true;
                    this._scene.BallsAreStopped             = true;
                }
            }
        } else {
            return false;
        }
    }
    
    private moveToBallPos(ball): void {
        let ballNextPos: Phaser.Math.Vector2;

        if (ball) {
            ballNextPos                                 = this._scene.computeBallRealPosition(ball.TweenStart, ball.TweenStart + (32 * this._scene.GameSpriteScale), ball.TweenValue);
        } else {
            ballNextPos                                 = null;
        }

        if (ballNextPos != null) {
            this._sprite.body ? this._sprite.body.setVelocity(.4) : true;

            this._scene.add.tween({
                targets:    [this._sprite],
                ease:       'Quad',
                duration:   80,
                delay:      0,
                x:          ballNextPos.x,
                y:          ballNextPos.y,
                onComplete: () => {
                    this.tryToCallDestroy(1);
                }
            });
        }
    }

    public moveAllBalls(value, ball, step): void {
        if (!this._destroyCallTries[0]) {
            if (ball) {
                ball.BallInsertAnimation                = 2;
                ball.MoveForwards                       = true;
                ball.MFStep                             = step;
            }
            value                                       += step;
            (value < 1) ? (this._moveValue = value) : this.lastAllBallsMove(ball);
        }
    }

    private tryToCallDestroy(index): void {
        let destroyCalls    : number;

        this._destroyCallTries[index]               = 1;
        destroyCalls                                = this._destroyCallTries[0] + this._destroyCallTries[1];

        if (destroyCalls > 0) {
            this._ballSubstitution.Sprite.alpha     = 1;
            if (destroyCalls > 1) {
                this.destroy(true);
            }
        }
    }

    private lastAllBallsMove(ball): void {
        this.tryToCallDestroy(0);
        ball ? ball.BallInsertAnimation = 0 : true;
        this._OM.BallArray.forEach(element => {
            if (element != null) {
                element.BallInsertAnimation         = 0;
            }
        });
    }
//------------------------//------------------------//
//                  BASIC METHODS                   //
//------------------------//------------------------//
    public create(): void {
        this._sprite                                = this.setupSprite();
        this.defineManagers();
    }

    public update(): void {
        if (!this._scene.inWorldBounds(this._sprite) || this._RM.IsGameOver) {
            this.destroy(false);
        } else {
            this.animationManagment(.220 * this._scene.GameSpriteScale);
            if (this._moveBalls) {
                this.moveAllBalls(this._moveValue, this._ballSubstitution, .15);
                this.moveToBallPos(this._ballSubstitution);
            }
        }
    }

}