/// <reference path="../../core/camera/LBaseCamera.ts" />
/// <reference path="../../core/LInputHandler.ts" />
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
    // TODO: Generalize the implementation to allow for any up vector. FOr ...
    // now, I'm using Z+ as up vector, as the meshes assume it in that way
    var OrbitCameraState;
    (function (OrbitCameraState) {
        OrbitCameraState[OrbitCameraState["IDLE"] = 0] = "IDLE";
        OrbitCameraState[OrbitCameraState["DRAGGING"] = 1] = "DRAGGING";
        OrbitCameraState[OrbitCameraState["MOVING_TARGET"] = 2] = "MOVING_TARGET";
    })(OrbitCameraState = engine3d.OrbitCameraState || (engine3d.OrbitCameraState = {}));
    var LOrbitCamera = /** @class */ (function (_super) {
        __extends(LOrbitCamera, _super);
        function LOrbitCamera(pos, targetPoint, worldUp, width, height, zNear, zFar, fov, projMode, id) {
            var _this = _super.call(this, pos, worldUp, width, height, zNear, zFar, fov, projMode, LOrbitCamera.GetStaticType(), id) || this;
            _this.m_r = new core.LVec3(0, 0, 0);
            _this.m_targetPoint = targetPoint.clone();
            _this.m_startTargetPoint = targetPoint.clone();
            _this.m_camState = OrbitCameraState.IDLE;
            _this.m_mouseCurrentXY = new core.LVec2(0, 0);
            _this.m_mouseStartXY = new core.LVec2(0, 0);
            _this._computeSphericalsFromPosition();
            _this._updateSystem();
            return _this;
        }
        LOrbitCamera.prototype._computeSphericalsFromPosition = function () {
            this.m_r.x = this.m_pos.x - this.m_targetPoint.x;
            this.m_r.y = this.m_pos.y - this.m_targetPoint.y;
            this.m_r.z = this.m_pos.z - this.m_targetPoint.z;
            this.m_rho0 = this.m_rho = this.m_r.length();
            this.m_phi0 = this.m_phi = Math.acos(this.m_r.z / this.m_rho);
            this.m_theta0 = this.m_theta = Math.atan2(this.m_r.y, this.m_r.x);
        };
        LOrbitCamera.prototype._computePositionFromSphericals = function () {
            var _sphi = Math.sin(this.m_phi);
            var _cphi = Math.cos(this.m_phi);
            var _stheta = Math.sin(this.m_theta);
            var _ctheta = Math.cos(this.m_theta);
            this.m_r.x = this.m_rho * _sphi * _ctheta;
            this.m_r.y = this.m_rho * _sphi * _stheta;
            this.m_r.z = this.m_rho * _cphi;
            this.m_pos.x = this.m_targetPoint.x + this.m_r.x;
            this.m_pos.y = this.m_targetPoint.y + this.m_r.y;
            this.m_pos.z = this.m_targetPoint.z + this.m_r.z;
        };
        LOrbitCamera.prototype.setTargetPoint = function (targetPoint) {
            this.m_targetPoint = targetPoint;
            this._updateSystem();
        };
        LOrbitCamera.prototype.getTargetPoint = function () {
            return this.m_targetPoint;
        };
        LOrbitCamera.prototype.rho = function () { return this.m_rho; };
        LOrbitCamera.prototype.phi = function () { return this.m_phi; };
        LOrbitCamera.prototype.theta = function () { return this.m_theta; };
        LOrbitCamera.prototype._updateSystem = function () {
            this._computePositionFromSphericals();
            this.m_front = core.LVec3.normalize(core.LVec3.minus(this.m_pos, this.m_targetPoint));
            this.m_right = core.LVec3.normalize(core.LVec3.cross(this.m_worldUp, this.m_front));
            this.m_up = core.LVec3.normalize(core.LVec3.cross(this.m_front, this.m_right));
            this._buildViewMatrix();
        };
        LOrbitCamera.GetStaticType = function () {
            return "Orbit3d";
        };
        LOrbitCamera.prototype.update = function (dt) {
            if (this.m_camState == OrbitCameraState.IDLE) {
                if (core.LInputHandler.isMouseButtonDown(core.MOUSE_LEFT)) {
                    this.m_camState = OrbitCameraState.DRAGGING;
                    this.m_mouseStartXY = core.LInputHandler.cursorXY();
                    this.m_mouseCurrentXY = core.LInputHandler.cursorXY();
                    this.m_phi0 = this.m_phi;
                    this.m_theta0 = this.m_theta;
                }
                else if (core.LInputHandler.isMouseButtonDown(core.MOUSE_WHEEL)) {
                    this.m_camState = OrbitCameraState.MOVING_TARGET;
                    this.m_mouseStartXY = core.LInputHandler.cursorXY();
                    this.m_mouseCurrentXY = core.LInputHandler.cursorXY();
                    core.LVec3.copy(this.m_startTargetPoint, this.m_targetPoint);
                }
            }
            else if (this.m_camState == OrbitCameraState.DRAGGING) {
                this.m_mouseCurrentXY = core.LInputHandler.cursorXY();
                var _dx = this.m_mouseCurrentXY.x - this.m_mouseStartXY.x;
                var _dy = this.m_mouseCurrentXY.y - this.m_mouseStartXY.y;
                var _dtheta = (-_dx / this.m_viewportWidth) * 2 * Math.PI;
                var _dphi = (-_dy / this.m_viewportHeight) * Math.PI;
                this.m_theta = this.m_theta0 + _dtheta;
                this.m_phi = this.m_phi0 + _dphi;
                if (core.LInputHandler.isMouseButtonUp(core.MOUSE_LEFT)) {
                    this.m_camState = OrbitCameraState.IDLE;
                }
            }
            else if (this.m_camState == OrbitCameraState.MOVING_TARGET) {
                this.m_mouseCurrentXY = core.LInputHandler.cursorXY();
                // Update target position
                var _dx = -(this.m_mouseCurrentXY.x - this.m_mouseStartXY.x);
                var _dy = (this.m_mouseCurrentXY.y - this.m_mouseStartXY.y);
                this.m_targetPoint.x = this.m_startTargetPoint.x + (this.m_right.x * _dx + this.m_up.x * _dy) * 0.01;
                this.m_targetPoint.y = this.m_startTargetPoint.y + (this.m_right.y * _dx + this.m_up.y * _dy) * 0.01;
                this.m_targetPoint.z = this.m_startTargetPoint.z;
                this._computePositionFromSphericals();
                if (core.LInputHandler.isMouseButtonUp(core.MOUSE_WHEEL)) {
                    this.m_camState = OrbitCameraState.IDLE;
                }
            }
            var _wheel = core.LInputHandler.wheelAcumValue();
            var _drho = -_wheel * 0.25;
            this.m_rho = this.m_rho0 + _drho;
            this._updateSystem();
        };
        return LOrbitCamera;
    }(core.LBaseCamera));
    engine3d.LOrbitCamera = LOrbitCamera;
})(engine3d || (engine3d = {}));
