

/// <reference path="../../core/entities/REntity.ts" />
/// <reference path="../../core/components/graphics/RReferenceFrameComponent.ts" />
/// <reference path="../../core/components/graphics/RMesh3dComponent.ts" />
/// <reference path="../../ext/cat1js/engine3d/debug/LDebugSystem.ts" />

/// <reference path="RDHcommon.ts" />
/// <reference path="RDHWorld.ts" />
/// <reference path="components/RDHendEffectorComponent.ts" />
/// <reference path="components/RDHjointRevoluteComponent.ts" />
/// <reference path="components/RDHjointPrismaticComponent.ts" />

namespace leojs
{

    export abstract class RDHmodel
    {

        protected m_dhTable : RDHtable;
        protected m_frames : REntity[];
        protected m_base : REntity;
        protected m_joints : REntity[];
        protected m_endEffector : REntity;
        protected m_endEffectorTotalTransform : core.LMat4;
        protected m_endEffectorCompensation : core.LMat4;

        protected m_world : RDHWorld;

        protected m_time : number;

        protected m_xyzMinEstimate : core.LVec3;
        protected m_xyzMaxEstimate : core.LVec3;

        protected m_xyzZeroPosition : core.LVec3;
        protected m_rpyZeroPosition : core.LVec3;

        protected m_visibility : boolean;

        constructor( world : RDHWorld )
        {
            this.m_dhTable = new RDHtable();
            this.m_frames = [];
            this.m_joints = [];

            this.m_world = world;
            this.m_time = 0.0;

            this.m_xyzMinEstimate = new core.LVec3( 0, 0, 0 );
            this.m_xyzMaxEstimate = new core.LVec3( 0, 0, 0 );
            this.m_xyzZeroPosition = new core.LVec3( 0, 0, 0 );
            this.m_rpyZeroPosition = new core.LVec3( 0, 0, 0 );

            this.m_visibility = true;

            this.m_endEffectorTotalTransform = new core.LMat4();
            this.m_endEffectorCompensation = new core.LMat4();
        }

        public init() : void
        {
            this._buildDHrepresentation();
            this._buildModel();
            this._computeEndEffectorOffset();
            this._computeMinMaxEstimates();
            this._computeXYZzeroPosition();
        }

        public release() : void
        {
            if ( this.m_dhTable )
            {
                this.m_dhTable.release();
                this.m_dhTable = null;
            }

            // The World is in charge of removing the entities
            // Just remove the references here

            if ( this.m_frames )
            {
                for ( let q = 0; q < this.m_frames.length; q++ )
                {
                    this.m_frames[q].deletionRequested = true;
                    this.m_frames[q] = null;
                }
                this.m_frames = null;
            }

            if ( this.m_joints )
            {
                for ( let q = 0; q < this.m_joints.length; q++ )
                {
                    this.m_joints[q].deletionRequested = true;
                    this.m_joints[q] = null;
                }
                this.m_joints = null;
            }

            if ( this.m_endEffector )
            {
                this.m_endEffector.deletionRequested = true;
                this.m_endEffector = null;
            }

            if ( this.m_base )
            {
                this.m_base.deletionRequested = true;
                this.m_base = null;
            }
            
            this.m_endEffectorCompensation = null;
            this.m_endEffectorTotalTransform = null;
            this.m_world = null;

            this.m_xyzMinEstimate = null;
            this.m_xyzMaxEstimate = null;
            this.m_xyzZeroPosition = null;
            this.m_rpyZeroPosition = null;
        }

        protected abstract _buildDHrepresentation() : void;
        protected abstract _computeMinMaxEstimates() : void;

        public xyzMinEstimate() : core.LVec3 { return this.m_xyzMinEstimate; }
        public xyzMaxEstimate() : core.LVec3 { return this.m_xyzMaxEstimate; }
        public xyzZeroPosition() : core.LVec3 { return this.m_xyzZeroPosition; }
        public rpyZeroPosition() : core.LVec3 { return this.m_rpyZeroPosition; }

        private _computeXYZzeroPosition() : void
        {
            // Initialize transform with default zero joint values
            this.m_dhTable.update( 0 );
            // Get the zero position from this initial configuration
            // Update end effector
            core.mulMatMat44InPlace( this.m_endEffectorTotalTransform,
                                     this.m_dhTable.getFullTransform(),
                                     this.m_endEffectorCompensation );
            core.LMat4.extractPositionInPlace( this.m_xyzZeroPosition, this.m_endEffectorTotalTransform );
            core.LMat4.extractEulerFromRotationInPlace( this.m_rpyZeroPosition, this.m_endEffectorTotalTransform );
        }

        protected abstract _computeEndEffectorOffset() : void;

        private _buildModel() : void
        {
            let _baseMesh : engine3d.LMesh = buildPrimitive( { 'shape' : 'box',
                                                               'width' : 0.25, 
                                                               'depth' : 0.5,
                                                               'height' : 0.25 },
                                                              { 'material' : 'simple',
                                                                'color' : core.GRAY } );
            this.m_base = new REntity();
            this.m_base.addComponent( new RMesh3dComponent( this.m_base, _baseMesh ) );
            this.m_world.addEntity( this.m_base );

            this.m_endEffector = new REntity();
            this.m_endEffector.addComponent( new RDHendEffectorComponent( this.m_endEffector ) );
            this.m_world.addEntity( this.m_endEffector );

            let _entries : RDHentry[] = this.m_dhTable.entries();

            for ( let q = 0; q < _entries.length; q++ )
            {    
                // Build frame entity to track the link's pos and rot
                let _frameEntity : REntity = new REntity();
                let _frameGraphicsComponent = new RReferenceFrameComponent( _frameEntity );
                _frameEntity.addComponent( _frameGraphicsComponent );

                this.m_world.addEntity( _frameEntity );
                this.m_frames.push( _frameEntity );

                // Build the joint for visualization purposes
                let _jType : JointType = _entries[q].getJointType();
                let _jointEntity : REntity = this._buildJoint( _jType );

                this.m_world.addEntity( _jointEntity );
                this.m_joints.push( _jointEntity );
            }

            this._updateModel();
        }

        private _buildJoint( type : JointType ) : REntity
        {
            let _jointEntity : REntity = new REntity();


            if ( type == JointType.PRISMATIC )
            {
                _jointEntity.addComponent( new RDHjointPrismaticComponent( _jointEntity ) );
            }
            else if ( type == JointType.REVOLUTE )
            {
                _jointEntity.addComponent( new RDHjointRevoluteComponent( _jointEntity ) );
            }

            return _jointEntity;
        }

        private _updateModel() : void
        {
            let _entries : RDHentry[] = this.m_dhTable.entries();

            if ( _entries.length > 0 )
            {
                if ( this.m_visibility )
                {
                    engine3d.DebugSystem.drawLine( this.m_base.position,
                                                   this.m_frames[0].position,
                                                   core.CYAN );
                }
            }


            for ( let q = 0; q < _entries.length; q++ )
            {
                let _frameEntity : REntity = this.m_frames[q];
                let _jointEntity : REntity = this.m_joints[q];
                let _transform : core.LMat4 = this.m_dhTable.getTransformInRange( 0, q );

                core.LMat4.extractPositionInPlace( _frameEntity.position,
                                                   _transform );
                core.LMat4.extractEulerFromRotationInPlace( _frameEntity.rotation,
                                                            _transform );

                if ( q < ( _entries.length - 1 ) )
                {
                    if ( this.m_visibility )
                    {
                        engine3d.DebugSystem.drawLine( this.m_frames[ q ].position,
                                                       this.m_frames[ q + 1 ].position,
                                                       core.CYAN );
                    }
                }

                core.LMat4.extractPositionInPlace( _jointEntity.position,
                                                   _transform );
                core.LMat4.extractEulerFromRotationInPlace( _jointEntity.rotation,
                                                            _transform );

                if ( _entries[q].getJointType() == JointType.REVOLUTE )
                {
                    let _revJointComp = <RDHjointRevoluteComponent> _jointEntity.getComponent( RComponentType.GRAPHICS );
                    _revJointComp.setJointValue( this.m_dhTable.getJointValue( q ) );
                }
                else if ( _entries[q].getJointType() == JointType.PRISMATIC )
                {
                    let _priJointComp = <RDHjointPrismaticComponent> _jointEntity.getComponent( RComponentType.GRAPHICS );
                    _priJointComp.setJointValue( this.m_dhTable.getJointValue( q ) );
                }
            }

            // Update end effector
            core.mulMatMat44InPlace( this.m_endEffectorTotalTransform,
                                     this.m_dhTable.getFullTransform(),
                                     this.m_endEffectorCompensation );

            core.LMat4.extractPositionInPlace( this.m_endEffector.position,
                                               this.m_endEffectorTotalTransform );
            core.LMat4.extractEulerFromRotationInPlace( this.m_endEffector.rotation,
                                                        this.m_endEffectorTotalTransform );
        }

        public forward( jointValues : number[] ) : core.LVec3
        {
            // Check if the right number of joints has been provided
            if ( jointValues.length == this.m_dhTable.numJoints() )
            {
                for ( let q = 0; q < this.m_dhTable.numJoints(); q++ )
                {
                    this.m_dhTable.setJointValue( jointValues[q], q );
                }
            }
            else
            {
                console.warn( 'RDHmodel> wrong number of joints sent for forward kinematics' );
            }

            this.m_dhTable.update( 0 );

            return this.m_dhTable.getEndEffectorXYZ().clone();
        }

        public abstract inverse( xyz : core.LVec3, rpy : core.LVec3 ) : number[];
        public abstract isInWorkspace( xyz : core.LVec3 ) : boolean;
        public abstract includeInvKinEndEffectorOrientation() : boolean;

        public update( dt : number ) : void
        {
            this.m_time += dt * 0.001;

            // this.m_dhTable.setJointValue( this.m_dhTable.getJointValue( 0 ) + dt * 0.00025, 0 );
            // this.m_dhTable.setJointValue( this.m_dhTable.getJointValue( 1 ) + dt * 0.00025, 1 );
            // this.m_dhTable.setJointValue( 2.5 * ( Math.sin( this.m_time * 0.5 ) + 1 ) , 2 );

            // Update internal states of the robot representation
            this.m_dhTable.update( dt );
            // Update model of the robot using the before updated representation
            this._updateModel();
        }

        public getDHtable() : RDHtable { return this.m_dhTable; }

        public getJointValueById( jointId : string ) : number
        {
            return this.m_dhTable.getJointValueById( jointId );
        }
        public doesJointExist( jointId : string ) : boolean
        {
            return this.m_dhTable.doesJointExist( jointId );
        }

        public getEndEffectorXYZ() : core.LVec3
        {
            let _pos : core.LVec3 = new core.LVec3( 0, 0, 0 );

            core.LMat4.extractPositionInPlace( _pos,
                                               this.m_endEffectorTotalTransform );

            return _pos;
        }

        public getEndEffectorRPY() : core.LVec3
        {
            let _rpy : core.LVec3 = new core.LVec3( 0 ,0, 0 );

            core.LMat4.extractEulerFromRotationInPlace( _rpy,
                                                        this.m_endEffectorTotalTransform );

            return _rpy;
        }

        public setModelVisibility( visible : boolean ) : void
        {
            this.m_visibility = visible;

            for ( let _frame of this.m_frames )
            {
                _frame.setVisibility( visible );
            }

            for ( let _joint of this.m_joints )
            {
                _joint.setVisibility( visible );
            }

            if ( this.m_endEffector )
            {
                this.m_endEffector.setVisibility( visible );
            }

            if ( this.m_base )
            {
                this.m_base.setVisibility( visible );
            }
        }

    }



}