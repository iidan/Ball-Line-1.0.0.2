import PlayScene 			from '../scenes/PlayScene'

export class Path extends Phaser.GameObjects.GameObject {
	constructor(scene) {
        super(scene, '');
        this._scene = scene;
        this._scene.UpdateGroup.add(this);

        this.create();
    }
//------------------------
    private _scene: PlayScene;
//------------------------
    private _endOfPathSprite;
    public get EndOfPathSprite() {
        return this._endOfPathSprite;
    }

    private _path;
    public get Path() {
        return this._path;
    }
//------------------------
    private _pathPoints     = [];
    public get PathPoints() {
        return this._pathPoints;
    }
    public set PathPoints(arr: Array<Phaser.Math.Vector2>) {
        this._pathPoints = arr;
    }
//------------------------
    private _pathSprite;
    public get PathSprite() {
        return this._pathSprite;
    }
    public set PathSprite(arr) {
        this._pathSprite = arr;
    }

    private _curves         = [];
    public get CurvesArray() {
        return this._curves;
    }
    public set CurvesArray(val) {
        this._curves = val;
    }
    private _graphicsArray  = [];
    public get GraphicsArray() {
        return this._graphicsArray;
    }
//------------------------
    private _curvesNumber   = 0;
    public get CurvesNumber() {
        return this._curvesNumber;
    }

    private _levelNumber    = 1;
//------------------------//------------------------//
//              BEZIER CURVES CREATOR               //
//------------------------//------------------------//
    public addNewGraphics() {
        let g       = this._scene.add.graphics();
        g.depth     = 1;
        g.alpha     = .8;
        g.clear();

        this._graphicsArray.push(g);
        
        return g;
    }

    public createBezierCurve(p1, p2, p3, p4) {
        let curve                           = new Phaser.Curves.CubicBezier(p1, p2, p3, p4);
        this._curves[this._curvesNumber++]  = curve; 
        return curve;
    }

    public drawBezierCurve(curve, graphics) {
        graphics.clear();
        graphics.lineStyle(40 * this._scene.GameSpriteScale, 0x000000);

        curve.draw(graphics);
        curve.defaultDivisions      = 5;
        curve.arcLengthDivisions    = 5;
    }

    public deleteBezierCurve(array, graphics) {
        let q;
        this._curvesNumber == 1 ? q = 0 : q = 1;
        
        for(let i = q; i < array.length; i++) {
            array[i].visible = 0;
        }
        graphics.clear();
        this._graphicsArray.pop();
    }
//------------------------//------------------------//
//                  CURVES MANAGMENT                //
//------------------------//------------------------//
    public createSpriteFromCurveArray(graphicsArray, number): Phaser.GameObjects.Image {
        let img: Phaser.GameObjects.Image;

        this._levelNumber                           = number;

        graphicsArray.forEach(element => {
            element.generateTexture('Path' + String(number));
            element.destroy();
        });

        img                         = this._scene.add.image(240 * this._scene.GameSpriteScale, 450 * this._scene.GameSpriteScale, 'Path' + String(number));
        img.alpha                   = .25;

        return img;
    }

    public createPointsFromCurvesArray(curves, editor) {
        let array                   = [];
        let endPoint;

        curves.forEach(element => {
            if (editor === true) {
                array               = array.concat(element[0].data.curve.getDistancePoints(1));
            } else {
                array               = array.concat(element.getDistancePoints(1));
            }
        });

        endPoint                    = array[array.length - 16];
        this.createEndPoint(endPoint);
        return array;
    }

    private createEndPoint(endPoint) {
        if (this._endOfPathSprite == null) {
            this._endOfPathSprite       = this._scene.add.image(endPoint.x, endPoint.y, 'Player_Circle').setScale(.15 * this._scene.GameSpriteScale).setOrigin(.5);
            this.setupPhysics(this._endOfPathSprite, this._endOfPathSprite.width * .5);
        }
    }
    
    private setupPhysics(spr, realRadius) {
        this._scene.EndOfPathPhysicsGroup.add(spr);
        spr.body.setCircle(realRadius);
    }
//------------------------//------------------------//
//                  BASIC METHODS                   //
//------------------------//------------------------//
    public destroy() {
        this._endOfPathSprite                                           ? this._endOfPathSprite.destroy() : true;
        this._scene.textures.get('Path' + String(this._levelNumber))    ? this._scene.textures.remove('Path' + String(this._levelNumber)) : true;
        this._pathSprite                                                ? this._pathSprite.destroy() : true;
        this.active                 = false;
    }

	public create() {}
	public update() {}
}