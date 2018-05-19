
/// <reference path="../../../ext/cat1js/engine3d/graphics/LMesh.ts" />
/// <reference path="RGraphicsComponent.ts" />


namespace leojs
{


    export class RMesh3dComponent extends RGraphicsComponent
    {

        constructor( parent : REntity, mesh3d : engine3d.LMesh )
        {
            super( parent );

            if ( mesh3d )
            {
                this.m_renderables.push( mesh3d );
            }
        }

        public appendMesh( mesh : engine3d.LMesh ) : void { this.m_renderables.push( mesh ); }
        public getMesh( indx : number ) : engine3d.LMesh { return <engine3d.LMesh> this.m_renderables[ indx ]; }
        
        public update( dt : number ) : void
        {
            for ( let q = 0; q < this.m_renderables.length; q++ )
            {
                let _mesh : engine3d.LMesh = <engine3d.LMesh> this.m_renderables[q];

                _mesh.setPos( this.m_parent.position );
                _mesh.setRotEuler( this.m_parent.rotation );
            }

            super.update( dt );
        }
    }



}