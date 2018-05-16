
/// <reference path="../../../ext/cat1js/engine3d/graphics/LMesh.ts" />
/// <reference path="RGraphicsComponent.ts" />


namespace leojs
{


    export class RMesh3dComponent extends RGraphicsComponent
    {

        constructor( parent : REntity, mesh3d : engine3d.LMesh )
        {
            super( parent );

            this.m_renderables.push( mesh3d );
        }

        
    }



}