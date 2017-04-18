
/// <reference path="../lib/babylon.2.5.d.ts" />
/// <reference path="RRobot.ts"/>

class Game
{
    private m_canvas : HTMLCanvasElement;
    private m_engine : BABYLON.Engine;
    private m_scene  : BABYLON.Scene;
    private m_camera : BABYLON.FreeCamera;
    private m_light  : BABYLON.Light;

    private m_testRobot : RRobot;

    public static STR_DATA : StringDict<string> = {};
    public static DATA_FILES : Array<string> = [];
    public static FILES_TO_LOAD : number = 0;
    public static FILES_LOADED : number = 0;
    public static FILES_PATH : string = 'tools/';

    constructor( canvasElement : string )
    {
        this.m_canvas = <HTMLCanvasElement> document.getElementById( canvasElement );
        this.m_engine = new BABYLON.Engine( this.m_canvas, true );
    }

    public createScene() : void
    {
        this.m_scene = new BABYLON.Scene( this.m_engine );
        this.m_camera = new BABYLON.FreeCamera( 'camera1', 
                                                new BABYLON.Vector3( 0, 5, -10 ),
                                                this.m_scene );
        this.m_camera.setTarget( BABYLON.Vector3.Zero() );
        this.m_camera.attachControl( this.m_canvas, false );
        this.m_light = new BABYLON.HemisphericLight( 'light1',
                                                     new BABYLON.Vector3( 0, 1, 0 ),
                                                     this.m_scene );

        let ground = BABYLON.MeshBuilder.CreateGround( 'ground1',
                                                       { width: 6,
                                                         height: 6,
                                                         subdivisions: 2 },
                                                       this.m_scene );

        this.drawPrimitives();
        this.loadData();
    }

    public onDataLoaded() : void
    {
        this.m_testRobot = RRobot.fromString( Game.STR_DATA['simpleRobot'] );
    }

    private drawPrimitives() : void
    {

        /// var _box : BABYLON.Mesh = BABYLON.MeshBuilder.CreateBox( 'box1',
        ///                                                          { width: 2,
        ///                                                            height: 2,
        ///                                                            depth: 2 }, 
        ///                                                          this.m_scene );

        /// var _cylinder : BABYLON.Mesh = BABYLON.MeshBuilder.CreateCylinder( 'cylinder1',
        ///                                                                    {},
        ///                                                                    this.m_scene );
    }

    private loadData() : void
    {
        
        Game.DATA_FILES = [];
        Game.DATA_FILES.push( 'simpleRobot' );

        Game.STR_DATA = {};
        Game.FILES_TO_LOAD = Game.DATA_FILES.length;
        Game.FILES_LOADED = 0;
        
        var _q : number = 0;
        for ( _q = 0; _q < Game.DATA_FILES.length; _q++ )
        {
            var _self : Game = this;
            var xobj : XMLHttpRequest = new XMLHttpRequest();
            xobj.overrideMimeType( 'application/json' );
            xobj.open( 'GET', Game.FILES_PATH + Game.DATA_FILES[_q] + '.json', true );
            xobj.onreadystatechange = function () {
                if ( xobj.readyState === 4 && xobj.status === 200 )
                {
                    let _id : string = xobj.responseURL;
                    _id = _id.substr( _id.indexOf( Game.FILES_PATH ) + Game.FILES_PATH.length, Infinity );
                    _id = _id.replace( '.json', '' );
                    
                    Game.STR_DATA[_id] = xobj.responseText;
                    Game.FILES_LOADED++;

                    if ( Game.FILES_LOADED == Game.FILES_TO_LOAD )
                    {
                        _self.onDataLoaded();
                    }
                }
            };
            xobj.send( null );
           
        }

    }

    public animate() : void
    {
        this.m_engine.runRenderLoop( ()=> {
            this.m_scene.render();
        });
        
        window.addEventListener( 'resize', ()=> {
            this.m_engine.resize();
        });
    }

}



window.addEventListener( 'DOMContentLoaded', ()=> {
    
    let game = new Game( 'renderCanvas' );

    game.createScene();
    game.animate();

});
