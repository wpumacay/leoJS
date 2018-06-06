/// <reference path="../math/LMath.ts" />
/// <reference path="../../Globals.ts" />
var core;
(function (core) {
    var ProjectionMode;
    (function (ProjectionMode) {
        ProjectionMode[ProjectionMode["PERSPECTIVE"] = 0] = "PERSPECTIVE";
        ProjectionMode[ProjectionMode["ORTHOGRAPHIC"] = 1] = "ORTHOGRAPHIC";
    })(ProjectionMode = core.ProjectionMode || (core.ProjectionMode = {}));
    var LBaseCamera = /** @class */ (function () {
        function LBaseCamera(pos, worldUp, width, height, zNear, zFar, fov, projMode, type, id) {
            this.m_pos = pos;
            this.m_worldUp = worldUp;
            this.m_front = new core.LVec3(0, 0, 0);
            this.m_up = new core.LVec3(0, 0, 0);
            this.m_right = new core.LVec3(0, 0, 0);
            this.m_viewportWidth = width;
            this.m_viewportHeight = height;
            this.m_fov = fov;
            this.m_aspectRatio = width / height;
            this.m_zNear = zNear;
            this.m_zFar = zFar;
            this.m_type = type;
            this.m_id = id;
            this.m_viewMat = new core.LMat4();
            this.m_projMat = null;
            this.setProjMode(projMode);
        }
        LBaseCamera.prototype._updateSystem = function () {
            // Override this
        };
        LBaseCamera.prototype.update = function (dt) {
            // Override this
        };
        LBaseCamera.prototype.setProjMode = function (projMode) {
            if (projMode == ProjectionMode.ORTHOGRAPHIC) {
                this.m_projMat = core.LMat4.ortho(this.m_viewportWidth, this.m_viewportHeight, this.m_zNear, this.m_zFar);
            }
            else {
                this.m_projMat = core.LMat4.perspective(this.m_fov, this.m_aspectRatio, this.m_zNear, this.m_zFar);
            }
        };
        /**
        *   Build the view matrix based on "calculated" ...
        *   ( should calculate yourself in each camera implementation ) ...
        *   camera vectors ( right-x, up-y, front-z )
        *
        *   @method _buildViewMatrix
        */
        LBaseCamera.prototype._buildViewMatrix = function () {
            // View matrix is ...
            /*
            *  |                |
            *  |     R^T   -R'p |
            *  |                |
            *  | 0   0   0   1  |
            */
            // Also, it's column major, so must keep layout ...
            // [ c1x c1y c1z c1w, c2x c2y c2z c2w, ... ]
            this.m_viewMat.buff[0] = this.m_right.x;
            this.m_viewMat.buff[1] = this.m_up.x;
            this.m_viewMat.buff[2] = this.m_front.x;
            this.m_viewMat.buff[3] = 0;
            this.m_viewMat.buff[4] = this.m_right.y;
            this.m_viewMat.buff[5] = this.m_up.y;
            this.m_viewMat.buff[6] = this.m_front.y;
            this.m_viewMat.buff[7] = 0;
            this.m_viewMat.buff[8] = this.m_right.z;
            this.m_viewMat.buff[9] = this.m_up.z;
            this.m_viewMat.buff[10] = this.m_front.z;
            this.m_viewMat.buff[11] = 0;
            this.m_viewMat.buff[12] = -core.LVec3.dot(this.m_right, this.m_pos);
            this.m_viewMat.buff[13] = -core.LVec3.dot(this.m_up, this.m_pos);
            this.m_viewMat.buff[14] = -core.LVec3.dot(this.m_front, this.m_pos);
            this.m_viewMat.buff[15] = 1;
        };
        LBaseCamera.prototype.getStaticType = function () { return "Base"; };
        LBaseCamera.prototype.getType = function () { return this.m_type; };
        LBaseCamera.prototype.getId = function () { return this.m_id; };
        LBaseCamera.prototype.setPosition = function (pos) {
            this.m_pos = pos;
            this._updateSystem();
        };
        LBaseCamera.prototype.getPosition = function () { return this.m_pos; };
        LBaseCamera.prototype.getFov = function () { return this.m_fov; };
        LBaseCamera.prototype.getZNear = function () { return this.m_zNear; };
        LBaseCamera.prototype.getZFar = function () { return this.m_zFar; };
        LBaseCamera.prototype.getViewMatrix = function () { return this.m_viewMat; };
        LBaseCamera.prototype.getProjectionMatrix = function () { return this.m_projMat; };
        LBaseCamera.prototype.onResize = function (appWidth, appHeight) {
            this.m_viewportWidth = appWidth;
            this.m_viewportHeight = appHeight;
            this.m_aspectRatio = this.m_viewportWidth / this.m_viewportHeight;
            this.setProjMode(this.m_projMode);
        };
        return LBaseCamera;
    }());
    core.LBaseCamera = LBaseCamera;
})(core || (core = {}));
