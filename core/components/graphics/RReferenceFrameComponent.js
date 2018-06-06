/// <reference path="../../../ext/cat1js/engine3d/graphics/LMesh.ts" />
/// <reference path="RGraphicsComponent.ts" />
/// <reference path="RGraphicsFactory.ts" />
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var leojs;
(function (leojs) {
    leojs.RF_BASE_DIM = 0.25;
    leojs.RF_SPHERE_RADIUS = 0.25;
    leojs.RF_ARROW_LENGTH = 2.0;
    leojs.RF_AXIS_X_INDX = 0;
    leojs.RF_AXIS_Y_INDX = 1;
    leojs.RF_AXIS_Z_INDX = 2;
    leojs.RF_CENTER_INDX = 3;
    var RReferenceFrameComponent = /** @class */ (function (_super) {
        __extends(RReferenceFrameComponent, _super);
        /**
        * @constructor
        * @param {REntity} parent entity this component belongs to
        * @param {core.LVec3} pos frame's position
        * @param {core.LVec3} euler frame's Tait-Bryan zyx angles
        */
        function RReferenceFrameComponent(parent, pos, euler) {
            if (pos === void 0) { pos = core.ORIGIN; }
            if (euler === void 0) { euler = core.ZERO; }
            var _this = _super.call(this, parent) || this;
            _this.m_posXYZ = pos.clone();
            _this.m_rotEuler = euler.clone();
            _this.m_rotMat = core.LMat4.fromEuler(euler);
            _this.m_frameMatrix = core.LMat4.fromPosEuler(_this.m_posXYZ, _this.m_rotEuler);
            _this.m_axisX = new core.LVec3(0, 0, 0);
            _this.m_axisY = new core.LVec3(0, 0, 0);
            _this.m_axisZ = new core.LVec3(0, 0, 0);
            _this.m_rotArrowX = new core.LMat4();
            _this.m_rotArrowY = new core.LMat4();
            _this.m_rotArrowZ = new core.LMat4();
            _this._updateAxes();
            _this._initGraphics();
            _this._updateGraphicsPosition();
            _this._updateGraphicsOrientation();
            return _this;
        }
        RReferenceFrameComponent.prototype._initGraphics = function () {
            // Axes made by arrows, ...
            // and origin is just a small sphere
            // cylinder parts
            var _axisX, _axisY, _axisZ;
            _axisX = leojs.buildPrimitive({ 'shape': 'arrow', 'length': leojs.RF_ARROW_LENGTH * leojs.RF_BASE_DIM }, { 'material': 'simple', 'color': core.RED });
            _axisY = leojs.buildPrimitive({ 'shape': 'arrow', 'length': leojs.RF_ARROW_LENGTH * leojs.RF_BASE_DIM }, { 'material': 'simple', 'color': core.GREEN });
            _axisZ = leojs.buildPrimitive({ 'shape': 'arrow', 'length': leojs.RF_ARROW_LENGTH * leojs.RF_BASE_DIM }, { 'material': 'simple', 'color': core.BLUE });
            this.m_renderables.push(_axisX);
            this.m_renderables.push(_axisY);
            this.m_renderables.push(_axisZ);
            // Center
            var _center;
            _center = leojs.buildPrimitive({ 'shape': 'sphere', 'radius': leojs.RF_SPHERE_RADIUS * leojs.RF_BASE_DIM }, { 'material': 'simple',
                'color': core.GRAY });
            this.m_renderables.push(_center);
        };
        RReferenceFrameComponent.prototype._updateGraphicsPosition = function () {
            // Update meshes
            this.m_renderables[leojs.RF_CENTER_INDX].setPos(this.m_posXYZ);
            this.m_renderables[leojs.RF_AXIS_X_INDX].setPos(this.m_posXYZ);
            this.m_renderables[leojs.RF_AXIS_Y_INDX].setPos(this.m_posXYZ);
            this.m_renderables[leojs.RF_AXIS_Z_INDX].setPos(this.m_posXYZ);
        };
        RReferenceFrameComponent.prototype._updateGraphicsOrientation = function () {
            this.m_renderables[leojs.RF_AXIS_X_INDX].setRotMat(this.m_rotArrowX);
            this.m_renderables[leojs.RF_AXIS_Y_INDX].setRotMat(this.m_rotArrowY);
            this.m_renderables[leojs.RF_AXIS_Z_INDX].setRotMat(this.m_rotArrowZ);
        };
        RReferenceFrameComponent.prototype._updateAxes = function () {
            core.LMat4.extractColumnInPlace(this.m_axisX, this.m_frameMatrix, 0);
            core.LMat4.extractColumnInPlace(this.m_axisY, this.m_frameMatrix, 1);
            core.LMat4.extractColumnInPlace(this.m_axisZ, this.m_frameMatrix, 2);
            // Update the rotation matrices for the arrows
            // First, we transform the arrow to its corresponding zero-orientation, and then ...
            // to the orientation of the reference frame
            core.mulMatMat44InPlace(this.m_rotArrowX, this.m_rotMat, core.ROT_Z_NEG_90);
            core.LMat4.copy(this.m_rotArrowY, this.m_rotMat); // just copy for Y
            core.mulMatMat44InPlace(this.m_rotArrowZ, this.m_rotMat, core.ROT_X_90);
        };
        RReferenceFrameComponent.prototype.setPosition = function (pos) {
            core.LVec3.copy(this.m_posXYZ, pos);
            core.LMat4.fromPosEulerInPlace(this.m_frameMatrix, this.m_posXYZ, this.m_rotEuler);
            // this._updateAxes();// not necessary
            this._updateGraphicsPosition();
        };
        RReferenceFrameComponent.prototype.setOrientation = function (euler) {
            core.LVec3.copy(this.m_rotEuler, euler);
            core.LMat4.fromEulerInPlace(this.m_rotMat, euler);
            core.LMat4.fromPosEulerInPlace(this.m_frameMatrix, this.m_posXYZ, this.m_rotEuler);
            this._updateAxes();
            // this._updateGraphicsPosition();
            this._updateGraphicsOrientation();
        };
        RReferenceFrameComponent.prototype.setFrameMatrix = function (mat) {
            core.LMat4.copy(this.m_frameMatrix, mat);
            core.LMat4.extractColumnInPlace(this.m_posXYZ, this.m_frameMatrix, 3);
            core.LMat4.extractEulerFromRotationInPlace(this.m_rotEuler, this.m_frameMatrix);
            core.LMat4.extractRotationInPlace(this.m_rotMat, this.m_frameMatrix);
            this._updateAxes();
            this._updateGraphicsPosition();
            this._updateGraphicsOrientation();
        };
        RReferenceFrameComponent.prototype.getFrameMatrix = function () { return this.m_frameMatrix; };
        RReferenceFrameComponent.prototype.update = function (dt) {
            this.setPosition(this.m_parent.position);
            this.setOrientation(this.m_parent.rotation);
            // this.setOrientation( core.LVec3.plus( this.m_rotEuler, 
            //                                       new core.LVec3( dt * 0.001, dt * 0.001, dt * 0.001 ) ) );
            _super.prototype.update.call(this, dt);
        };
        return RReferenceFrameComponent;
    }(leojs.RGraphicsComponent));
    leojs.RReferenceFrameComponent = RReferenceFrameComponent;
})(leojs || (leojs = {}));
