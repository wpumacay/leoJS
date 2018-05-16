
/// <reference path="../../../ext/cat1js/engine3d/graphics/LMesh.ts" />
/// <reference path="RGraphicsComponent.ts" />
/// <reference path="RGraphicsFactory.ts" />


namespace leojs
{

    export const RF_BASE_DIM : number = 1.0;
    export const RF_SPHERE_RADIUS : number = 0.25;
    export const RF_ARROW_LENGTH : number = 2.0;
    export const RF_AXIS_X_INDX : number = 0;
    export const RF_AXIS_Y_INDX : number = 1;
    export const RF_AXIS_Z_INDX : number = 2;
    export const RF_CENTER_INDX : number = 3;

    export class RReferenceFrameComponent extends RGraphicsComponent
    {

        private m_posXYZ : core.LVec3;
        private m_rotEuler : core.LVec3;
        //private m_rotQuaternion : core.LQuaternion;// TODO: Implement quaternions
        private m_rotMat : core.LMat4;
        private m_frameMatrix : core.LMat4;

        private m_axisX : core.LVec3;
        private m_axisY : core.LVec3;
        private m_axisZ : core.LVec3;

        private m_rotArrowX : core.LMat4;
        private m_rotArrowY : core.LMat4;
        private m_rotArrowZ : core.LMat4;

        /**
        * @constructor
        * @param {REntity} parent entity this component belongs to
        * @param {core.LVec3} pos frame's position
        * @param {core.LVec3} euler frame's Tait-Bryan zyx angles
        */
        constructor( parent : REntity,
                     pos : core.LVec3 = core.ORIGIN,
                     euler : core.LVec3 = core.ZERO )
        {
            super( parent );
            
            this.m_posXYZ = pos.clone();
            this.m_rotEuler = euler.clone();
            this.m_rotMat = core.LMat4.fromEuler( euler );
            this.m_frameMatrix = core.LMat4.fromPosEuler( this.m_posXYZ, 
                                                          this.m_rotEuler );

            this.m_axisX = new core.LVec3( 0, 0, 0 );
            this.m_axisY = new core.LVec3( 0, 0, 0 );
            this.m_axisZ = new core.LVec3( 0, 0, 0 );
            this.m_rotArrowX = new core.LMat4();
            this.m_rotArrowY = new core.LMat4();
            this.m_rotArrowZ = new core.LMat4();
            this._updateAxes();

            this._initGraphics();
            this._updateGraphicsPosition();
            this._updateGraphicsOrientation();
        }

        private _initGraphics() : void
        {
            // Axes made by arrows, ...
            // and origin is just a small sphere

            // cylinder parts
            let _axisX, _axisY, _axisZ : engine3d.LMesh;

            _axisX = buildPrimitive( { 'shape' : 'arrow', 'length' : RF_ARROW_LENGTH * RF_BASE_DIM },
                                     { 'material' : 'simple', 'color' : core.RED } );
            _axisY = buildPrimitive( { 'shape' : 'arrow', 'length' : RF_ARROW_LENGTH * RF_BASE_DIM },
                                     { 'material' : 'simple', 'color' : core.BLUE } );
            _axisZ = buildPrimitive( { 'shape' : 'arrow', 'length' : RF_ARROW_LENGTH * RF_BASE_DIM },
                                     { 'material' : 'simple', 'color' : core.GREEN } );

            this.m_renderables.push( _axisX );
            this.m_renderables.push( _axisY );
            this.m_renderables.push( _axisZ );

            // Center
            let _center : engine3d.LMesh;

            _center = buildPrimitive( { 'shape' : 'sphere', 'radius' : RF_SPHERE_RADIUS * RF_BASE_DIM },
                                      { 'material' : 'simple', 
                                        'color': core.GRAY } );

            this.m_renderables.push( _center );
        }

        private _updateGraphicsPosition() : void
        {
            // Update meshes
            ( <engine3d.LMesh> this.m_renderables[RF_CENTER_INDX] ).setPos( this.m_posXYZ );

            ( <engine3d.LMesh> this.m_renderables[RF_AXIS_X_INDX] ).setPos( this.m_posXYZ );
            ( <engine3d.LMesh> this.m_renderables[RF_AXIS_Y_INDX] ).setPos( this.m_posXYZ );
            ( <engine3d.LMesh> this.m_renderables[RF_AXIS_Z_INDX] ).setPos( this.m_posXYZ );
        }

        private _updateGraphicsOrientation() : void
        {
            ( <engine3d.LMesh> this.m_renderables[RF_AXIS_X_INDX] ).setRotMat( this.m_rotArrowX );
            ( <engine3d.LMesh> this.m_renderables[RF_AXIS_Y_INDX] ).setRotMat( this.m_rotArrowY );
            ( <engine3d.LMesh> this.m_renderables[RF_AXIS_Z_INDX] ).setRotMat( this.m_rotArrowZ );
        }

        private _updateAxes() : void
        {
            core.LMat4.extractColumnInPlace( this.m_axisX, this.m_frameMatrix, 0 );
            core.LMat4.extractColumnInPlace( this.m_axisY, this.m_frameMatrix, 1 );
            core.LMat4.extractColumnInPlace( this.m_axisZ, this.m_frameMatrix, 2 );

            // Update the rotation matrices for the arrows
            core.mulMatMat44InPlace( this.m_rotArrowX, this.m_rotMat, core.ROT_Z_NEG_90 );
            core.LMat4.copy( this.m_rotArrowY, this.m_rotMat ); // just copy for Y
            core.mulMatMat44InPlace( this.m_rotArrowZ, this.m_rotMat, core.ROT_X_90 );
        }

        public setPosition( pos : core.LVec3 ) : void
        {
            core.LVec3.copy( this.m_posXYZ, pos );
            core.LMat4.fromPosEulerInPlace( this.m_frameMatrix,
                                            this.m_posXYZ, this.m_rotEuler );
            // this._updateAxes();// not necessary
            this._updateGraphicsPosition();
        }
        public setOrientation( euler : core.LVec3 ) : void
        {
            core.LVec3.copy( this.m_rotEuler, euler );
            core.LMat4.fromEulerInPlace( this.m_rotMat, euler );
            core.LMat4.fromPosEulerInPlace( this.m_frameMatrix,
                                            this.m_posXYZ, this.m_rotEuler );
            this._updateAxes();
            this._updateGraphicsPosition();
            this._updateGraphicsOrientation();
        }
        public setFrameMatrix( mat : core.LMat4 ) : void
        {
            core.LMat4.copy( this.m_frameMatrix, mat );
            core.LMat4.extractColumnInPlace( this.m_posXYZ, this.m_frameMatrix, 3 );
            core.LMat4.extractEulerFromRotationInPlace( this.m_rotEuler, this.m_frameMatrix );
            core.LMat4.extractRotationInPlace( this.m_rotMat, this.m_frameMatrix );

            this._updateAxes();
            this._updateGraphicsPosition();
            this._updateGraphicsOrientation();
        }

        public getFrameMatrix() : core.LMat4 { return this.m_frameMatrix; }

        public update( dt : number ) : void
        {
            this.setOrientation( core.LVec3.plus( this.m_rotEuler, new core.LVec3( 0, dt * 0.1, 0 ) ) );
        }
    }



}