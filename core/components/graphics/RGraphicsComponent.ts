
/// <reference path="../../../ext/cat1js/core/graphics/LIRenderable.ts" />
/// <reference path="../RComponent.ts" />


namespace leojs
{

    export class RGraphicsComponent extends RComponent
    {

        public static CLASS_ID : string = 'graphicsBase';

        protected m_renderables : core.LIRenderable[];

        constructor( parent : REntity )
        {
            super( parent );

            this.m_typeId = RComponentType.GRAPHICS;
            this.m_classId = RGraphicsComponent.CLASS_ID;

            this.m_renderables = [];
        }

        public release() : void
        {
            for ( let q = 0; q < this.m_renderables.length; q++ )
            {
                this.m_renderables[q].release();
            }

            super.release();
        }

        public renderables() : core.LIRenderable[] { return this.m_renderables; }
        public update( dt : number )
        {
            for ( let _renderable of this.m_renderables )
            {
                _renderable.update();
            }
        }

        public setVisibility( visible : boolean ) : void
        {
            for ( let _renderable of this.m_renderables )
            {
                _renderable.setVisibility( visible );
            }
        }

    }



}