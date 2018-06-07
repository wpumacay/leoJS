
/// <reference path="../../../ext/cat1js/engine3d/graphics/LModel.ts" />
/// <reference path="../../../core/components/graphics/RGraphicsComponent.ts" />
/// <reference path="../../../core/components/graphics/RGraphicsFactory.ts" />
/// <reference path="../RKinTree.ts" />



namespace leojs
{


    export class RDHtreeModelComponent extends RGraphicsComponent
    {
        private m_meshes : { [id:string] : engine3d.LMesh };
        private m_kinTreeRef : RKinTree;

        constructor( parent : REntity,
                     kinTree : RKinTree )
        {
            super( parent );

            this.m_meshes = {};
            this.m_kinTreeRef = kinTree;

            this._init();
        }

        public release() : void
        {
            if ( this.m_meshes )
            {
                for ( let key in this.m_meshes )
                {
                    this.m_meshes[key] = null;
                }
                this.m_meshes = null;
            }
            
            this.m_kinTreeRef = null;

            super.release();
        }

        private _init() : void
        {
            this._initializeLinks();
        }

        private _initializeLinks()
        {
            // Generate links from kintree nodes' geometry
            let _nodes = this.m_kinTreeRef.nodes();
            for ( let _nodeId in _nodes )
            {
                let _node = _nodes[ _nodeId ];
                let _geometry = _node.getGeometry();

                let _mesh = this._createLinkFromGeometry( _geometry );
                if ( _mesh )
                {
                    this.m_meshes[ _nodeId ] = _mesh;
                    this.m_renderables.push( this.m_meshes[ _nodeId ] );
                }
            }
        }
        private _createLinkFromGeometry( geometry : RKinNodeGeometry ) : engine3d.LMesh
        {
            let _mesh : engine3d.LMesh = null;

            let _material = { 'material' : 'phong',
                              'ambient' : new core.LVec3( 1.0, 0.5, 0.31 ),
                              'diffuse' : new core.LVec3( 1.0, 0.5, 0.31 ),
                              'specular' : new core.LVec3( 0.5, 0.5, 0.5 ),
                              'shininess' : 32 };
            let _geometry = {};

            if ( geometry.type == RKinGeometryTypeBox )
            {
                _geometry = { 'shape' : 'box', 
                              'width' : geometry.b_width,
                              'height' : geometry.b_height,
                              'depth' : geometry.b_depth };

                _mesh = buildPrimitive( _geometry, 
                                        _material );
            }
            else if ( geometry.type == RKinGeometryTypeCylinder )
            {
                _geometry = { 'shape' : 'cylinder',
                              'radius' : geometry.c_radius,
                              'height' : geometry.c_length };

                _mesh = buildPrimitive( _geometry, 
                                        _material );
            }
            else if ( geometry.type == RKinGeometryTypeSphere )
            {
                _geometry = { 'shape' : 'sphere',
                              'radius' : geometry.s_radius };

                _mesh = buildPrimitive( _geometry, 
                                        _material );
            }
            else if ( geometry.type == RKinGeometryTypeMesh )
            {
                let _modelConstructionInfo = core.LAssetsManager.INSTANCE.getModel( geometry.m_meshId );
                let _modelGeometry = new engine3d.LGeometry3d( 
                                            _modelConstructionInfo.geometryInfo.vertices,
                                            _modelConstructionInfo.geometryInfo.normals,
                                            _modelConstructionInfo.geometryInfo.texCoords,
                                            _modelConstructionInfo.geometryInfo.indices );
                let _modelMaterial = new engine3d.LPhongMaterial( _material['ambient'],
                                                                  _material['diffuse'],
                                                                  _material['specular'],
                                                                  _material['shininess'] );
                _mesh = new engine3d.LModel( _modelGeometry,
                                             _modelMaterial,
                                             _modelConstructionInfo.correctionMat );
            }

            return _mesh;
        }

        public update( dt : number ) : void
        {
            super.update( dt );

            // update transform from kintree
            let _nodes = this.m_kinTreeRef.nodes();
            for ( let _nodeId in _nodes )
            {
                let _node = _nodes[ _nodeId ];
                if ( this.m_meshes[ _nodeId ] )
                {
                    this.m_meshes[ _nodeId ].setWorldTransform( _node.getWorldTransform() );
                }
            }
        }

    }


}