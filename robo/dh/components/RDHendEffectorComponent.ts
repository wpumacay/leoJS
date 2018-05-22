
/// <reference path="../../../ext/cat1js/engine3d/graphics/LMesh.ts" />
/// <reference path="../../../core/components/graphics/RGraphicsComponent.ts" />
/// <reference path="../../../core/components/graphics/RGraphicsFactory.ts" />



namespace leojs
{

    export const EF_BASE_DIM : number = 0.05;
    export const EF_ROOT_SIZE : number = 4;
    export const EF_GRIP_WIDTH : number = 4;
    export const EF_GRIP_HEIGHT : number = 2;
    export const EF_GRIP_DEPTH : number = 1;

    export class RDHendEffectorComponent extends RGraphicsComponent
    {

        private m_effRootMesh : engine3d.LMesh;
        private m_effLeftMesh : engine3d.LMesh;
        private m_effRighttMesh : engine3d.LMesh;

        private m_transformBase : core.LMat4;
        private m_leftGripTotalTransform : core.LMat4;
        private m_rightGripTotalTransform : core.LMat4;

        private m_leftGripTotalTransformToRoot : core.LMat4;
        private m_rightGripTotalTransformToRoot : core.LMat4;

        constructor( parent : REntity )
        {
            super( parent );

            this.m_effRootMesh = null;
            this.m_effLeftMesh = null;
            this.m_effRighttMesh = null;

            this.m_transformBase = new core.LMat4();
            this.m_leftGripTotalTransform = new core.LMat4();
            this.m_rightGripTotalTransform = new core.LMat4();

            let _leftGripOff : core.LVec3 = new core.LVec3( 0, 0, 0 );
            _leftGripOff.x = ( -0.5 * EF_ROOT_SIZE - 0.5 * EF_GRIP_WIDTH ) * EF_BASE_DIM;
            _leftGripOff.y = 0;
            _leftGripOff.z = ( 0.5 * EF_ROOT_SIZE - 0.5 * EF_GRIP_DEPTH ) * EF_BASE_DIM;

            let _rightGripOff : core.LVec3 = new core.LVec3( 0, 0, 0 );
            _rightGripOff.x = ( -0.5 * EF_ROOT_SIZE - 0.5 * EF_GRIP_WIDTH ) * EF_BASE_DIM;
            _rightGripOff.y = 0;
            _rightGripOff.z = ( -0.5 * EF_ROOT_SIZE + 0.5 * EF_GRIP_DEPTH ) * EF_BASE_DIM;

            this.m_leftGripTotalTransformToRoot = core.LMat4.translation( _leftGripOff );
            this.m_rightGripTotalTransformToRoot = core.LMat4.translation( _rightGripOff );

            this._initializeEndEffector();
        }

        private _initializeEndEffector() : void
        {
            this.m_effRootMesh = buildPrimitive( { 'shape' : 'box',
                                                   'width' : EF_ROOT_SIZE * EF_BASE_DIM,
                                                   'depth' : EF_ROOT_SIZE * EF_BASE_DIM,
                                                   'height' : EF_ROOT_SIZE * EF_BASE_DIM },
                                                 { 'material' : 'simple',
                                                   'color' : core.LIGHT_GRAY } );

            this.m_effLeftMesh = buildPrimitive( { 'shape' : 'box',
                                                   'width' : EF_GRIP_WIDTH * EF_BASE_DIM,
                                                   'depth' : EF_GRIP_DEPTH * EF_BASE_DIM,
                                                   'height' : EF_GRIP_HEIGHT * EF_BASE_DIM },
                                                 { 'material' : 'simple',
                                                   'color' : core.LIGHT_GRAY } );

            this.m_effRighttMesh = buildPrimitive( { 'shape' : 'box',
                                                     'width' : EF_GRIP_WIDTH * EF_BASE_DIM,
                                                     'depth' : EF_GRIP_DEPTH * EF_BASE_DIM,
                                                     'height' : EF_GRIP_HEIGHT * EF_BASE_DIM },
                                                   { 'material' : 'simple',
                                                     'color' : core.LIGHT_GRAY } );

            this.m_renderables.push( this.m_effRootMesh );
            this.m_renderables.push( this.m_effLeftMesh );
            this.m_renderables.push( this.m_effRighttMesh );
        }

        public update( dt : number ) : void
        {    
            //// Update root mesh ( same as parent's position - orientation )
            this.m_effRootMesh.setPos( this.m_parent.position );
            this.m_effRootMesh.setRotEuler( this.m_parent.rotation );

            //// Update left and right grip
            // Build the transform
            core.LMat4.fromPosEulerInPlace( this.m_transformBase,
                                            this.m_parent.position,
                                            this.m_parent.rotation );

            this.m_transformBase = core.mulMatMat44( this.m_transformBase,
                                                     core.ROT_Y_90 );

            // Apply relative transform to left and right gripper parts
            this.m_leftGripTotalTransform = core.mulMatMat44( this.m_transformBase,
                                                              this.m_leftGripTotalTransformToRoot );
            this.m_rightGripTotalTransform = core.mulMatMat44( this.m_transformBase,
                                                               this.m_rightGripTotalTransformToRoot );
            // Set total transform
            this.m_effLeftMesh.setWorldTransform( this.m_leftGripTotalTransform );
            this.m_effRighttMesh.setWorldTransform( this.m_rightGripTotalTransform );

            // Update the renderables' model matrices
            super.update( dt );
        }

    }




}