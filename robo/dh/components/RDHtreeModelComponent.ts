
/// <reference path="../../../ext/cat1js/engine3d/graphics/LModel.ts" />
/// <reference path="../../../core/components/graphics/RGraphicsComponent.ts" />
/// <reference path="../../../core/components/graphics/RGraphicsFactory.ts" />
/// <reference path="../RKinTree.ts" />



namespace leojs
{


    export class RDHtreeModelComponent extends RGraphicsComponent
    {
        private m_meshes : { [id:string] : engine3d.LMesh };
        private m_kinTree : RKinTree;

        constructor( parent : REntity,
                     kinTree : RKinTree )
        {
            super( parent );

            this.m_meshes = {};
            this.m_kinTree = kinTree;

            this._init();
        }

        private _init() : void
        {
            this._initializeLinks();
        }

        private _initializeLinks()
        {
            // Generate links from kintree nodes' geometry
            let _nodes = this.m_kinTree.nodes();
            for ( let _nodeId in _nodes )
            {
                let _node = _nodes[ _nodeId ];
                let _geometry = _node.getGeometry();

                this.m_meshes[ _nodeId ] = this._createLinkFromGeometry( _geometry );
            }
        }
        private _createLinkFromGeometry( geometry : RKinNodeGeometry ) : engine3d.LMesh
        {


            return null;
        }

        public update( dt : number ) : void
        {
            super.update( dt );

            // update transform from kintree
            let _nodes = this.m_kinTree.nodes();
            for ( let _nodeId in _nodes )
            {
                let _node = _nodes[ _nodeId ];
                this.m_meshes[ _nodeId ].setWorldTransform( _node.getWorldTransform() );
            }
        }

    }


}