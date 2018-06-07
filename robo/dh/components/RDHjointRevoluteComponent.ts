
/// <reference path="../../../ext/cat1js/engine3d/graphics/LMesh.ts" />
/// <reference path="../../../core/components/graphics/RGraphicsComponent.ts" />
/// <reference path="../../../core/components/graphics/RGraphicsFactory.ts" />


namespace leojs
{


    export class RDHjointRevoluteComponent extends RGraphicsComponent
    {

        private m_jointMeshRef : engine3d.LMesh;
        private m_jointRotMatBase : core.LMat4;
        private m_jointRotMatTotal : core.LMat4;
        private m_jointValue : number;

        constructor( parent : REntity )
        {
            super( parent );

            this.m_jointMeshRef = null;
            this.m_jointValue = 0.0;
            this.m_jointRotMatBase = new core.LMat4();
            this.m_jointRotMatTotal = new core.LMat4();

            this._initializeRevoluteJoint();
        }

        public release() : void
        {
            this.m_jointMeshRef = null;
            this.m_jointRotMatBase = null;
            this.m_jointRotMatTotal = null;

            super.release();
        }

        private _initializeRevoluteJoint() : void
        {
            this.m_jointMeshRef = buildPrimitive( { 'shape' : 'cylinder',
                                                    'radius' : 0.1,
                                                    'height' : 0.2 },
                                                  { 'material' : 'simple',
                                                    'color' : core.LIGHT_GRAY } );

            this.m_renderables.push( this.m_jointMeshRef );
        }

        public setJointValue( jointValue : number ) : void
        {
            this.m_jointValue = jointValue;
        }

        public update( dt : number ) : void
        {
            // Update the joint mesh position using only the parent's position
            this.m_jointMeshRef.setPos( this.m_parent.position );
            // Update the joint mesh according to the joint value
            core.LMat4.fromEulerInPlace( this.m_jointRotMatBase, this.m_parent.rotation );
            core.mulMatMat44InPlace( this.m_jointRotMatTotal, this.m_jointRotMatBase, core.ROT_X_90 );
            this.m_jointMeshRef.setRotMat( this.m_jointRotMatTotal );

            // Update the renderables' model matrices
            super.update( dt );
        }

    }




}