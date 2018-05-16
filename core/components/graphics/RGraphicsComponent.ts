
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

        public renderables() : core.LIRenderable[] { return this.m_renderables; }


    }



}