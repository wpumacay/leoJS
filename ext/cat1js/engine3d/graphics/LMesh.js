/// <reference path="../../core/graphics/LBaseMesh.ts"/>
/// <reference path="../geometry/LGeometry3d.ts" />
/// <reference path="../material/LMaterial3d.ts" />
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
var engine3d;
(function (engine3d) {
    engine3d.RENDERABLE_TYPE_MESH_3D = 'Mesh3d';
    var LMesh = /** @class */ (function (_super) {
        __extends(LMesh, _super);
        function LMesh(geometry, material, modelCompensation) {
            var _this = _super.call(this) || this;
            _this.m_type = engine3d.RENDERABLE_TYPE_MESH_3D;
            _this.m_isWireframe = false;
            _this.m_pos = new core.LVec3(0, 0, 0);
            _this.m_scale = new core.LVec3(1, 1, 1);
            _this.m_rotEuler = new core.LVec3(0, 0, 0);
            _this.m_rotMat = new core.LMat4();
            _this.m_geometry = geometry;
            _this.m_material = material;
            _this.m_calcMat = new core.LMat4();
            _this.m_modelCompensation = (modelCompensation) ?
                modelCompensation :
                new core.LMat4();
            _this.m_modelMatrix = new core.LMat4();
            _this._updateModelMatrix();
            return _this;
        }
        LMesh.prototype.release = function () {
            this.m_pos = null;
            this.m_scale = null;
            this.m_rotEuler = null;
            this.m_rotMat = null;
            if (this.m_geometry) {
                this.m_geometry.release();
                this.m_geometry = null;
            }
            if (this.m_material) {
                this.m_material.release();
                this.m_material = null;
            }
            this.m_calcMat = null;
            this.m_modelCompensation = null;
            this.m_modelMatrix = null;
            _super.prototype.release.call(this);
        };
        LMesh.prototype.setRotEuler = function (euler) {
            core.LVec3.copy(this.m_rotEuler, euler);
            // Update rotation matrix
            core.LMat4.fromEulerInPlace(this.m_rotMat, this.m_rotEuler);
        };
        LMesh.prototype.setRotEulerX = function (eulerX) {
            this.m_rotEuler.x = eulerX;
            // Update rotation matrix
            core.LMat4.fromEulerInPlace(this.m_rotMat, this.m_rotEuler);
        };
        LMesh.prototype.setRotEulerY = function (eulerY) {
            this.m_rotEuler.y = eulerY;
            // Update rotation matrix
            core.LMat4.fromEulerInPlace(this.m_rotMat, this.m_rotEuler);
        };
        LMesh.prototype.setRotEulerZ = function (eulerZ) {
            this.m_rotEuler.z = eulerZ;
            // Update rotation matrix
            core.LMat4.fromEulerInPlace(this.m_rotMat, this.m_rotEuler);
        };
        LMesh.prototype.getRotEuler = function () { return this.m_rotEuler; };
        LMesh.prototype.getRotEulerX = function () { return this.m_rotEuler.x; };
        LMesh.prototype.getRotEulerY = function () { return this.m_rotEuler.y; };
        LMesh.prototype.getRotEulerZ = function () { return this.m_rotEuler.z; };
        LMesh.prototype.setRotMat = function (mat) {
            core.LMat4.extractRotationInPlace(this.m_rotMat, mat);
            // Update euler angles
            core.LMat4.extractEulerFromRotationInPlace(this.m_rotEuler, this.m_rotMat);
        };
        LMesh.prototype.getRotMat = function () { return this.m_rotMat; };
        LMesh.prototype.setPos = function (pos) { core.LVec3.copy(this.m_pos, pos); };
        LMesh.prototype.setPosX = function (x) { this.m_pos.x = x; };
        LMesh.prototype.setPosY = function (y) { this.m_pos.y = y; };
        LMesh.prototype.setPosZ = function (z) { this.m_pos.z = z; };
        LMesh.prototype.getPos = function () { return this.m_pos; };
        LMesh.prototype.getPosX = function () { return this.m_pos.x; };
        LMesh.prototype.getPosY = function () { return this.m_pos.y; };
        LMesh.prototype.getPosZ = function () { return this.m_pos.z; };
        LMesh.prototype.setScale = function (scale) {
            core.LVec3.copy(this.m_scale, scale);
        };
        LMesh.prototype.getScale = function () { return this.m_scale; };
        LMesh.prototype.setWorldTransform = function (mat) {
            core.LMat4.extractRotationInPlace(this.m_rotMat, mat);
            core.LMat4.extractEulerFromRotationInPlace(this.m_rotEuler, this.m_rotMat);
            core.LMat4.extractPositionInPlace(this.m_pos, mat);
            core.LMat4.copy(this.m_modelMatrix, mat);
        };
        LMesh.prototype._updateModelMatrix = function () {
            core.LMat4.fromPosRotScaleInPlace(this.m_modelMatrix, this.m_pos, this.m_rotMat, this.m_scale);
        };
        LMesh.prototype.getModelMatrix = function () { return this.m_modelMatrix; };
        LMesh.prototype.update = function () {
            this._updateModelMatrix();
        };
        return LMesh;
    }(core.LBaseMesh));
    engine3d.LMesh = LMesh;
})(engine3d || (engine3d = {}));
