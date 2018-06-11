
/// <reference path="../RCommon.ts" />
/// <reference path="../../ext/cat1js/core/scene/LScene.ts" />
/// <reference path="../../ext/cat1js/engine3d/camera/LFixedPointCamera.ts" />
/// <reference path="../../ext/cat1js/engine3d/camera/LOrbitCamera.ts" />
/// <reference path="../../ext/cat1js/engine3d/lights/LDirectionalLight.ts" />
/// <reference path="../entities/REntity.ts" />


namespace leojs
{


    export class RWorld
    {

        protected m_entities : REntity[];
        protected m_scene : core.LScene;

        protected m_appWidth : number;
        protected m_appHeight : number;

        constructor( appWidth : number, appHeight : number )
        {
            this.m_appWidth = appWidth;
            this.m_appHeight = appHeight;

            this.m_scene = null;
            this.m_entities = [];

            this._initScene();
        }


        protected _initScene() : void
        {
            this.m_scene = new core.LScene( 'mainScene' );

            // let _camera = new engine3d.LFixedPointCamera( new core.LVec3( 5.0, 5.0, 5.0 ),
            //                                               new core.LVec3( 0.0, 0.0, 0.0 ),
            //                                               new core.LVec3( 0.0, 0.0, 1.0 ),
            //                                               this.m_appWidth, this.m_appHeight,
            //                                               1.0, 100.0,
            //                                               45.0, core.ProjectionMode.PERSPECTIVE,
            //                                               "mainCamera" );

            let _camera = new engine3d.LOrbitCamera( new core.LVec3( 5.0, 5.0, 5.0 ),
                                                     new core.LVec3( 0.0, 0.0, 0.0 ),
                                                     new core.LVec3( 0.0, 0.0, 1.0 ),
                                                     this.m_appWidth, this.m_appHeight,
                                                     1.0, 100.0,
                                                     45.0, core.ProjectionMode.PERSPECTIVE,
                                                     "mainCamera" );

            this.m_scene.addCamera( _camera );

            let _light : engine3d.LPointLight = new engine3d.LPointLight( new core.LVec3( 0.0, 0.0, 3.0 ),
                                                                          new core.LVec3( 0.5, 0.5, 0.5 ),
                                                                          new core.LVec3( 0.8, 0.8, 0.8 ),
                                                                          new core.LVec3( 0.85, 0.85, 0.85 ) );

            // let _light : engine3d.LDirectionalLight = new engine3d.LDirectionalLight( new core.LVec3( -1.0, -1.0, -1.0 ),
            //                                                                           new core.LVec3( 0.2, 0.2, 0.2 ),
            //                                                                           new core.LVec3( 0.8, 0.8, 0.8 ),
            //                                                                           new core.LVec3( 0.9, 0.9, 0.9 ) );

            this.m_scene.addLight( _light );
        }

        public scene() : core.LScene { return this.m_scene; }

        public resizeWorld( appWidth : number, appHeight : number ) : void
        {
            this.m_appWidth = appWidth;
            this.m_appHeight = appHeight;
        }

        public addEntity( entity : REntity ) : void
        {
            this.m_entities.push( entity );
            this._collectRenderables( entity );
        }
        protected _collectRenderables( entity : REntity ) : void
        {
            let _graphicsComponent : RGraphicsComponent = <RGraphicsComponent> entity.getComponent( RComponentType.GRAPHICS );

            let _renderables : core.LIRenderable[] = _graphicsComponent.renderables();

            for ( let _renderable of _renderables )
            {
                this.m_scene.addRenderable( _renderable );
            }
        }

        public update( dt : number ) : void
        {
            for ( let q = 0; q < this.m_entities.length; q++ )
            {
                if ( !this.m_entities[q] )
                {
                    continue;
                }

                if ( this.m_entities[q].deletionRequested )
                {
                    // TODO: Clear the null references from the entities list
                    this.m_entities[q].release();
                    this.m_entities.splice( q, 1 );
                    q--;
                }
                else
                {
                    this.m_entities[q].update( dt );
                }
            }
        }
    }


}