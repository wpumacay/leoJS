/// <reference path = "../../core/shader/LShader.ts" />
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
    var LShaderDebugDrawer3d = /** @class */ (function (_super) {
        __extends(LShaderDebugDrawer3d, _super);
        function LShaderDebugDrawer3d(obj) {
            var _this = _super.call(this, obj) || this;
            _this.bind();
            // Load uniforms
            _this.m_uView = gl.getUniformLocation(obj, "u_matView");
            _this.m_uProj = gl.getUniformLocation(obj, "u_matProj");
            _this.unbind();
            return _this;
        }
        LShaderDebugDrawer3d.prototype.setMatView = function (matView) {
            this._setMat4(this.m_uView, matView);
        };
        LShaderDebugDrawer3d.prototype.setMatProj = function (matProj) {
            this._setMat4(this.m_uProj, matProj);
        };
        return LShaderDebugDrawer3d;
    }(core.LShader));
    engine3d.LShaderDebugDrawer3d = LShaderDebugDrawer3d;
})(engine3d || (engine3d = {}));
