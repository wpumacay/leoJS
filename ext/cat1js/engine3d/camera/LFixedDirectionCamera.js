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
    var LFixedDirectionCamera = /** @class */ (function (_super) {
        __extends(LFixedDirectionCamera, _super);
        function LFixedDirectionCamera(pos, targetDir, worldUp, width, height, zNear, zFar, fov, projMode, id) {
            var _this = _super.call(this, pos, worldUp, width, height, zNear, zFar, fov, projMode, LFixedDirectionCamera.GetStaticType(), id) || this;
            _this.m_targetDir = targetDir;
            _this._updateSystem();
            return _this;
        }
        LFixedDirectionCamera.prototype.setTargetDir = function (targetDir) {
            this.m_targetDir = targetDir;
            this._updateSystem();
        };
        LFixedDirectionCamera.prototype._updateSystem = function () {
            this.m_front = core.LVec3.normalize(core.LVec3.flip(this.m_targetDir));
            this.m_right = core.LVec3.normalize(core.LVec3.cross(this.m_worldUp, this.m_front));
            this.m_up = core.LVec3.normalize(core.LVec3.cross(this.m_front, this.m_right));
            this._buildViewMatrix();
        };
        LFixedDirectionCamera.GetStaticType = function () {
            return "FixedDirection3d";
        };
        return LFixedDirectionCamera;
    }(core.LBaseCamera));
    engine3d.LFixedDirectionCamera = LFixedDirectionCamera;
})(engine3d || (engine3d = {}));
