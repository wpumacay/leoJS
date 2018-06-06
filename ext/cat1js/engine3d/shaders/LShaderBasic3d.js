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
    var LShaderBasic3d = /** @class */ (function (_super) {
        __extends(LShaderBasic3d, _super);
        function LShaderBasic3d(obj) {
            var _this = _super.call(this, obj) || this;
            _this.bind();
            // Load uniforms
            _this.m_uModel = gl.getUniformLocation(obj, "u_matModel");
            _this.m_uView = gl.getUniformLocation(obj, "u_matView");
            _this.m_uProj = gl.getUniformLocation(obj, "u_matProj");
            _this.m_uColor = gl.getUniformLocation(obj, "u_color");
            _this.unbind();
            return _this;
        }
        LShaderBasic3d.prototype.setMatModel = function (matModel) {
            this._setMat4(this.m_uModel, matModel);
        };
        LShaderBasic3d.prototype.setMatView = function (matView) {
            this._setMat4(this.m_uView, matView);
        };
        LShaderBasic3d.prototype.setMatProj = function (matProj) {
            this._setMat4(this.m_uProj, matProj);
        };
        LShaderBasic3d.prototype.setColor = function (vecColor) {
            this._setVec3(this.m_uColor, vecColor);
        };
        return LShaderBasic3d;
    }(core.LShader));
    engine3d.LShaderBasic3d = LShaderBasic3d;
})(engine3d || (engine3d = {}));
