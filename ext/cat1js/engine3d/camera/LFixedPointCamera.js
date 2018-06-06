/// <reference path="../../core/camera/LBaseCamera.ts" />
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
    var LFixedPointCamera = /** @class */ (function (_super) {
        __extends(LFixedPointCamera, _super);
        function LFixedPointCamera(pos, targetPoint, worldUp, width, height, zNear, zFar, fov, projMode, id) {
            var _this = _super.call(this, pos, worldUp, width, height, zNear, zFar, fov, projMode, LFixedPointCamera.GetStaticType(), id) || this;
            _this.m_targetPoint = targetPoint;
            _this._updateSystem();
            return _this;
        }
        LFixedPointCamera.prototype.setTargetPoint = function (targetPoint) {
            this.m_targetPoint = targetPoint;
            this._updateSystem();
        };
        LFixedPointCamera.prototype._updateSystem = function () {
            this.m_front = core.LVec3.normalize(core.LVec3.minus(this.m_pos, this.m_targetPoint));
            this.m_right = core.LVec3.normalize(core.LVec3.cross(this.m_worldUp, this.m_front));
            this.m_up = core.LVec3.normalize(core.LVec3.cross(this.m_front, this.m_right));
            this._buildViewMatrix();
        };
        LFixedPointCamera.GetStaticType = function () {
            return "FixedPoint3d";
        };
        return LFixedPointCamera;
    }(core.LBaseCamera));
    engine3d.LFixedPointCamera = LFixedPointCamera;
})(engine3d || (engine3d = {}));
