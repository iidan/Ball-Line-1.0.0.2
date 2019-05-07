import { RoomManager } 		from '../objects/Managers/RoomManager'
import { ObjMapManager } 	from '../objects/Managers/ObjMapManager'
import { ScoreManager } 	from '../objects/Managers/ScoreManager'
import { MenuUI } 			from '../objects/MenuUI'

import { Player_Ball } from '../objects/Player_Ball'
import PlayScene 	   from '../scenes/PlayScene'
import { RoomsEnum } from './Enums';

export class Player extends Phaser.GameObjects.GameObject {
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
    private _type;
    private _graphics       = [];
    private _ball           = null;
//------------------------
    private _spriteBack;
    public get SpriteBack() {
        return this._spriteBack;
    }
//------------------------
    private _sprite;
    public get Sprite() {
        return this._sprite;
    }

    private spriteYpos = 357;
    private getAngle = 0;
    private checkIfShoot  = false;

//------------------------
    private _particlesEmitter;
    public get ParticlesEmitter() {
        return this._particlesEmitter;
    }
//------------------------
    private _isDestroyed    = false;
    public get IsDestroyed() {
        return this._isDestroyed;
    }
//------------------------
    private _x;
    public get X() {
        return this._x;
    }
    private _y;
    public get Y() {
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
        this._RM	                    = this._scene.RoomManager;
        this._OM	                    = this._scene.ObjManager;
        this._SM	                    = this._scene.ScoreManager;
        this._MU	                    = this._scene.MenuUI;
    }
    
    private setupParticles() {
        let p                           = this._scene.add.particles('CannonShape',  new Function('return ' + this._scene.cache.text.get('CannonEffect')) ()); //
        p.active                        = true;
        p.depth                         = 4;
                
        this._particlesEmitter = p;
    }

    private setupSprite(key, depth) {
        let spr                         = this._scene.physics.add.image(this._x, this._y, key).setScale(.3 * this._scene.GameSpriteScale).setOrigin(.5, .55);
        spr.depth                       = depth;

        return spr;
    }

    public setPos(vector2) {
        this._x                         = vector2.x * this._scene.GameSpriteScale;                     
        this._y                         = vector2.y * this._scene.GameSpriteScale;

        this._sprite.x                  = this._x;
        this._sprite.y                  = this._y;

        this._spriteBack.x              = this._x;
        this._spriteBack.y              = this._y;

        if (this._ball) {
            this._ball.Sprite.x         = this._x;
            this._ball.Sprite.y         = this._y;
        }
        this.spriteYpos = 357;
    }

    public destroy() {
        this._OM.PlayerObject           = null;
        this._isDestroyed               = true;

        this._ball ? this._ball.destroy(false) : true;
        this._graphics.forEach(element => {
            element.clear();
        });

        this._sprite.destroy();
        this._spriteBack.destroy();
    }
//------------------------//------------------------//
//                  USER INTERACTION                //
//------------------------//------------------------//
    private calculatePointerAngle() {
        let cursor                  = this._scene.input.activePointer;
        let pointerRotation         = Phaser.Math.Angle.Between(this._x, this._y, cursor.x + this._scene.cameras.main.scrollX, cursor.y + this._scene.cameras.main.scrollY);
        let realPointerAngle        = Phaser.Math.RadToDeg(pointerRotation) + 90;
        this.getAngle = realPointerAngle;
        return realPointerAngle;
    }


    private shootBall(angle) {
        this._ball.Sprite.angle         = angle;
        this._sprite.an

        this._scene.input.on('pointerup', function(pointer) {
            if (!this._isDestroyed) {
                if (this._RM.IsPlaying && !this._RM.IsGameOver) {
                    if (this._ball != null && this._ball.Scale > .01 * this._scene.GameSpriteScale) {   
                        let vec2    = this.vectorFromAngle(Phaser.Math.DegToRad(this._ball.Sprite.angle - 90), 100);
                        this.animationCannon(vec2);       
                        this._particlesEmitter.emitParticleAt(this._sprite.x + vec2.x, this._sprite.y + vec2.y, 15);
                        this._ball.shoot(Phaser.Math.DegToRad(this._ball.Sprite.angle - 90));
                        this._ball  = null;
                        this.checkIfShoot = true;
                    }
                }
            }
        }, this);
    }
    
    private rotateCannon(angle) {
        this.trajectoryCalculation(this._scene.input.activePointer);
        this._sprite.angle              = angle;
        this._spriteBack.angle          = angle;

    }

    private createNewBall() {
        this._ball                  = (this._ball === null) ? (new Player_Ball(this._scene, this._type, this._x, this._y)) : null;
    }

    private trajectoryCalculation(cursor): void {
        let newAngle        = null;
        let isIntersect     = false;

        let worldBounds     = [29 * this._scene.GameSpriteScale, 97 * this._scene.GameSpriteScale, 450 * this._scene.GameSpriteScale, 845 * this._scene.GameSpriteScale];
        let angle           = Math.atan2(cursor.y - this.Y, cursor.x - this.X);
        let angleVector     = this.vectorFromAngle(angle, 800 * this._scene.GameSpriteScale);

        let insecPoint      = [
            new Phaser.Geom.Point(0, 0),
            new Phaser.Geom.Point(0, 0)
        ]

        let playerLines     = [
            new Phaser.Geom.Line(0, 0, 0, 0),
            new Phaser.Geom.Line(0, 0, 0, 0)
        ]

        let playerDebugLines= [
            new Phaser.Geom.Line(this.X, this.Y, this.X + angleVector.x, this.Y + angleVector.y),
            new Phaser.Geom.Line(0, 0, 0, 0)
        ]

        let wallLines       = [
            new Phaser.Geom.Line(worldBounds[2], worldBounds[1], worldBounds[2], worldBounds[3]),
            new Phaser.Geom.Line(worldBounds[0], worldBounds[1], worldBounds[0], worldBounds[3]),
            new Phaser.Geom.Line(worldBounds[0], worldBounds[1], worldBounds[2], worldBounds[1]),
            new Phaser.Geom.Line(worldBounds[0], worldBounds[3], worldBounds[2], worldBounds[3])
        ]

        //  LOGIC
        //  --------LINE 1 INTERSECTIONS
        isIntersect             = this.checkForBallsIntersection(playerDebugLines[0], insecPoint[0]);
        
        if (!isIntersect) {
            wallLines.forEach(element => {
                Phaser.Geom.Intersects.LineToLine(playerDebugLines[0], element, insecPoint[0]);
            });
        } else {
            isIntersect         = false;
        }

        //  --------LINE 2 ANGLE
        newAngle                = this.getBounceAngle(insecPoint[0], worldBounds, angle);
        angleVector             = this.vectorFromAngle(newAngle, 800 * this._scene.GameSpriteScale);
        playerDebugLines[1]     = new Phaser.Geom.Line(insecPoint[0].x, insecPoint[0].y, insecPoint[0].x + angleVector.x, insecPoint[0].y + angleVector.y)
        
        //  --------LINE 2 INTERSECTIONS
        wallLines.forEach(element => {
            Phaser.Geom.Intersects.LineToLine(playerDebugLines[1], element, insecPoint[1]);
        });
        isIntersect             = this.checkForBallsIntersection(playerDebugLines[1], insecPoint[1]);

        //  --------PREPARE LINES & DOTS
        playerLines[0]          = new Phaser.Geom.Line(this.X, this.Y, insecPoint[0].x, insecPoint[0].y);
        if (!isIntersect) {
            insecPoint[1]       = new Phaser.Geom.Point(playerDebugLines[1].x2, playerDebugLines[1].y2)
        }
        if (newAngle != null) {
            playerLines[1]      = new Phaser.Geom.Line(insecPoint[0].x, insecPoint[0].y, insecPoint[1].x, insecPoint[1].y)
        }

        this.drawDottedLine(playerLines[0], playerLines[1], 20 * this._scene.GameSpriteScale, 3 * this._scene.GameSpriteScale);
    }

    private checkForBallsIntersection(playerLine, intersectionPoint): boolean {
        let isIntersect: boolean    = false;
        let pointOffset: number     = 17 * this._scene.GameSpriteScale;

        this._OM.BallArray.some(function(element) {
            if (element !== null) {
                let xPos            = element.Sprite.x;
                let yPos            = element.Sprite.y;

                let line            = new Phaser.Geom.Line(xPos,                yPos - pointOffset, xPos,               yPos + pointOffset);
                let line2           = new Phaser.Geom.Line(xPos - pointOffset,  yPos,               xPos + pointOffset, yPos);
    
                isIntersect         = Phaser.Geom.Intersects.LineToLine(playerLine, line, intersectionPoint);
                if (!isIntersect) {
                    isIntersect     = Phaser.Geom.Intersects.LineToLine(playerLine, line2, intersectionPoint);
                    if (isIntersect) return true;
                } else {
                    return true;
                }
            }
        });

        return isIntersect;
    }

    private getBounceAngle(point, rect, angle): number {
        let newAngle            = null;

        if (point.y < rect[1] + 2        || point.y > rect[3] - 2) {
            newAngle            = Phaser.Math.DegToRad(Math.floor(360 - Phaser.Math.RadToDeg(angle)));
        } else if (point.x < rect[0] + 2 || point.x > rect[2] - 2) {
            newAngle            = Phaser.Math.DegToRad(Math.floor(180 - Phaser.Math.RadToDeg(angle)));
        }

        return newAngle;
    }

    private vectorFromAngle(rotation, length): Phaser.Math.Vector2 {
        return new Phaser.Math.Vector2(Math.cos(rotation) * length, Math.sin(rotation) * length);
    }

    private drawDottedLine(arr1, arr2, dist, size) {
        let pointsLine          = [[], []];
        let j                   = 0;

        Phaser.Geom.Line.GetPoints(arr1, 0, dist, pointsLine[0]);
        Phaser.Geom.Line.GetPoints(arr2, 0, dist, pointsLine[1]);

        pointsLine.forEach(element => {
            this._graphics[j].clear();
            this._graphics[j].fillStyle(0xFFFFFF, 1)
            element.forEach(element => {
                this._graphics[j].fillPoint(element.x, element.y, size);
            });
            j++;
        });
    }
//------------------------//------------------------//
//                  BASIC METHODS                   //
//------------------------//------------------------//
    public create() {
        this._sprite                    = this.setupSprite('Player_Cannon', 3);
        this._spriteBack                = this.setupSprite('Player_CannonBack', 2);

        this._graphics[0]               = this._scene.add.graphics();
        this._graphics[0].depth         = 1;
        this._graphics[1]               = this._scene.add.graphics();
        this._graphics[1].depth         = 4;

        this.defineManagers();
        this.createNewBall();
        this.setupParticles();
    }

    // cannon tween animation: shake on shot.
    private animationCannon(angle): void {//aa
        this._scene.add.tween({
            targets: [this._sprite,this.SpriteBack],
            scaleX: '+=.2',
            scaleY: '+=.2',
            x: this._sprite.x + angle.x,
            y: this._sprite.y + angle.y,
            duration: 50,
            yoyo: true,
        });
    }

    public update() {
        if (!this._isDestroyed) {

            if (this._RM.IsPlaying && !this._RM.IsGameOver && this._RM.Room !== RoomsEnum.GameOver && this._MU.MenuAnim) {

                    let ang                 = this.calculatePointerAngle();
                    this.rotateCannon(ang);
                    (this._ball != null) ? this.shootBall(ang) : true;
                  
                    

            }
        }
    }


}
