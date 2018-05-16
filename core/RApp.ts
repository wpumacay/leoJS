
/// <reference path="../ext/cat1js/core/LApplication.ts" />
/// <reference path="../ext/cat1js/LAssets.ts" />
/// <reference path="../RAssets.ts" />
/// <reference path="RCommon.ts" />
/// <reference path="worlds/RWorld.ts" />
/// <reference path="entities/RTestEntity.ts" />

namespace leojs
{


    export class RApp
    {

        public static INSTANCE : RApp = null;

        protected m_gApp : core.LApplication;
        protected m_canvas : HTMLCanvasElement;
        protected m_gl : WebGLRenderingContext;

        protected m_world : RWorld;

        constructor( canvas : HTMLCanvasElement,
                     glContext : WebGLRenderingContext )
        {
            RApp.INSTANCE = this;

            this.m_canvas = canvas;
            this.m_gl = glContext;

            this.m_world = null;

            this.m_testEntity = null;

            this._initializeGraphicsApp();
        }

        protected _initializeGraphicsApp() : void
        {

            let _textures : core.LTextureAssetInfo[] = leojs.Textures.concat( assets.Textures );
            let _shaders : core.LShaderAssetInfo[] = leojs.Shaders.concat( assets.Shaders );

            let _appData : core.LApplicationData = new core.LApplicationData( _textures, _shaders );
            this.m_gApp = new core.LApplication( this.m_canvas,  this.m_gl, 
                                                 _appData, this._onInit, this._onUpdate );
            this.m_gApp.addUserResizeCallback( this._onResize );
        }

        public _onInit() : void 
        { 
            RApp.INSTANCE.init(); 
        }
        public _onUpdate( dt : number ) : void 
        { 
            RApp.INSTANCE.update( dt ); 
        }
        public _onResize( appWidth : number, appHeight : number ) : void
        {
            RApp.INSTANCE.resizeApp( appWidth, appHeight );
        }


        public init() : void
        {
            // Initialize stuff here
            this.m_world = new RWorld( this.m_gApp.width(), this.m_gApp.height() );
            this.m_gApp.addScene( this.m_world.scene() );

            this.m_testEntity = new RTestEntity();
            this.m_world.addEntity( this.m_testEntity );
        }

        public update( dt : number ) : void
        {
            this.m_world.update( dt );
        }

        public resizeApp( appWidth : number, appHeight : number ) : void
        {
            if ( this.m_world )
            {
                this.m_world.resizeWorld( appWidth, appHeight );
            }
        }

        private m_testEntity : RTestEntity;

    }




}
