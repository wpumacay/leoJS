
/// <reference path="../../../ext/cat1js/engine3d/graphics/LMesh.ts" />
/// <reference path="../../../core/components/graphics/RGraphicsComponent.ts" />
/// <reference path="../../../core/components/graphics/RGraphicsFactory.ts" />


namespace leojs
{


    export class RDHjointPrismaticComponent extends RGraphicsComponent
    {

        private m_jointFixedMeshRef : engine3d.LMesh;
        private m_jointMovingMeshRef : engine3d.LMesh;
        private m_jointTransformBase : core.LMat4;
        private m_jointTransformTotal : core.LMat4;
        private m_jointValue : number;

        constructor( parent : REntity )
        {
            super( parent );

            this.m_jointFixedMeshRef = null;
            this.m_jointMovingMeshRef = null;
            this.m_jointTransformBase = new core.LMat4();
            this.m_jointTransformTotal = new core.LMat4();
            this.m_jointValue = 0.0;

            this._initializePrismaticJoint();
        }

        public release() : void
        {
            this.m_jointFixedMeshRef = null;
            this.m_jointMovingMeshRef = null;
            this.m_jointTransformBase = null;
            this.m_jointTransformTotal = null;

            super.release();
        }

        private _initializePrismaticJoint() : void
        {
            this.m_jointFixedMeshRef = buildPrimitive( { 'shape' : 'box',
                                                         'width' : 0.1,
                                                         'depth' : 0.1,
                                                         'height' : 0.1 },
                                                       { 'material' : 'simple',
                                                         'color' : core.LIGHT_GRAY } );

            this.m_jointMovingMeshRef = buildPrimitive( { 'shape' : 'box',
                                                          'width' : 0.05,
                                                          'depth' : 0.15,
                                                          'height' : 0.05 },
                                                        { 'material' : 'simple',
                                                          'color' : core.LIGHT_GRAY } );

            this.m_renderables.push( this.m_jointFixedMeshRef );
            this.m_renderables.push( this.m_jointMovingMeshRef );
        }

        public setJointValue( jointValue : number ) : void
        {
            this.m_jointValue = jointValue;
        }

        public update( dt : number ) : void
        {    
            //// Update moving mesh ( same as parent's position - orientation )
            this.m_jointMovingMeshRef.setPos( this.m_parent.position );
            this.m_jointMovingMeshRef.setRotEuler( this.m_parent.rotation );

            //// Update fixed mesh ( Dz * Tparent )
            // Build the transform
            core.LMat4.fromPosEulerInPlace( this.m_jointTransformBase,
                                            this.m_parent.position,
                                            this.m_parent.rotation );
            // Apply translation
            this.m_jointTransformTotal = core.mulMatMat44( this.m_jointTransformBase,
                                                           core.LMat4.translation( new core.LVec3( 0, 0, this.m_jointValue ) ) );

            // Set total transform
            this.m_jointFixedMeshRef.setWorldTransform( this.m_jointTransformTotal );

            // Update the renderables' model matrices
            super.update( dt );
        }

    }




}