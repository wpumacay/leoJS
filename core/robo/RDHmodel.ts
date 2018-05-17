

/// <reference path="RDHcommon.ts" />
/// <reference path="../entities/REntity.ts" />
/// <reference path="../components/graphics/RReferenceFrameComponent.ts" />
/// <reference path="../components/graphics/RMesh3dComponent.ts" />
/// <reference path="../../ext/cat1js/engine3d/debug/LDebugSystem.ts" />
/// <reference path="../worlds/RDHWorld.ts" />

namespace leojs
{

    export class RDHmodel
    {

        private m_dhTable : RDHtable;
        private m_frames : REntity[];
        private m_base : REntity;
        private m_joints : REntity[];

        private m_world : RDHWorld;

        constructor( world : RDHWorld,
                     dhTable : RDHtable )
        {
            this.m_dhTable = dhTable;
            this.m_frames = [];

            this.m_world = world;

            this._buildModel();
        }

        private _buildModel() : void
        {
            let _baseMesh : engine3d.LMesh = buildPrimitive( { 'shape' : 'box',
                                                               'width' : 1.0, 
                                                               'depth' : 2.0,
                                                               'height' : 1.0 },
                                                              { 'material' : 'simple',
                                                                'color' : core.GRAY } );
            this.m_base = new REntity();
            this.m_base.addComponent( new RMesh3dComponent( this.m_base, _baseMesh ) );
            this.m_world.addEntity( this.m_base );

            let _entries : RDHentry[] = this.m_dhTable.entries();

            for ( let q = 0; q < _entries.length; q++ )
            {
                let _frameEntity : REntity = new REntity();
                let _frameGraphicsComponent = new RReferenceFrameComponent( _frameEntity );
                _frameEntity.addComponent( _frameGraphicsComponent );

                this.m_world.addEntity( _frameEntity );

                this.m_frames.push( _frameEntity );
            }

            this._updateModel();
        }

        private _buildJoint( type : JointType ) : REntity
        {
            let _jointEntity : REntity = new REntity();

            let _mesh : engine3d.LMesh = null;

            if ( type == JointType.PRISMATIC )
            {
                _mesh = buildPrimitive( { 'shape' : 'box',
                                          'width' : 0.5,
                                          'depth' : 1.0,
                                          'height' : 0.5 },
                                         { 'material' : 'simple',
                                           'color' : core.LIGHT_GRAY } );
            }
            else if ( type == JointType.REVOLUTE )
            {
                _mesh = buildPrimitive( { 'shape' : 'cylinder',
                                          'radius' : 0.5,
                                          'height' : 1.0 },
                                         { 'material' : 'simple',
                                           'color' : core.LIGHT_GRAY } );
            }

            _jointEntity.addComponent( new RMesh3dComponent( _jointEntity, _mesh ) );

            return _jointEntity;
        }

        private _updateModel() : void
        {
            let _entries : RDHentry[] = this.m_dhTable.entries();

            if ( _entries.length > 0 )
            {
                engine3d.DebugSystem.drawLine( this.m_base.position,
                                               this.m_frames[0].position,
                                               core.CYAN );
            }


            for ( let q = 0; q < _entries.length; q++ )
            {
                let _frameEntity : REntity = this.m_frames[q];
                let _transform : core.LMat4 = this.m_dhTable.getTransformInRange( 0, q );

                core.LMat4.extractPositionInPlace( _frameEntity.position,
                                                   _transform );
                core.LMat4.extractEulerFromRotationInPlace( _frameEntity.rotation,
                                                            _transform );

                _frameEntity.rotation.x *= -1;
                _frameEntity.rotation.y *= -1;
                _frameEntity.rotation.z *= -1;

                if ( q < ( _entries.length - 1 ) )
                {
                    engine3d.DebugSystem.drawLine( this.m_frames[ q ].position,
                                                   this.m_frames[ q + 1 ].position,
                                                   core.CYAN );
                }
            }
        }

        public update( dt : number ) : void
        {
            this.m_dhTable.setJointValue( this.m_dhTable.getJointValue( 0 ) + dt * 0.00025, 0 );
            this.m_dhTable.setJointValue( this.m_dhTable.getJointValue( 1 ) + dt * 0.00025, 1 );
            // this.m_dhTable.setJointValue( this.m_dhTable.getJointValue( 2 ) + dt * 0.00025, 2 );

            this._updateModel();
        }

    }



}