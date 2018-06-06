/// <reference path = "../../core/shader/LShader.ts" />
/// <reference path = "../../core/data/LTexture.ts" />
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
    var LShaderSimpleTexture = /** @class */ (function (_super) {
        __extends(LShaderSimpleTexture, _super);
        function LShaderSimpleTexture(obj) {
            var _this = _super.call(this, obj) || this;
            _this.bind();
            // Load uniforms
            _this.m_uModel = gl.getUniformLocation(obj, "u_matModel");
            _this.m_uView = gl.getUniformLocation(obj, "u_matView");
            _this.m_uProj = gl.getUniformLocation(obj, "u_matProj");
            _this.m_uTexture = gl.getUniformLocation(obj, "u_texture");
            _this.unbind();
            return _this;
        }
        LShaderSimpleTexture.prototype.setMatModel = function (matModel) {
            this._setMat4(this.m_uModel, matModel);
        };
        LShaderSimpleTexture.prototype.setMatView = function (matView) {
            this._setMat4(this.m_uView, matView);
        };
        LShaderSimpleTexture.prototype.setMatProj = function (matProj) {
            this._setMat4(this.m_uProj, matProj);
        };
        LShaderSimpleTexture.prototype.setTexture = function (texture) {
            this._setInt(this.m_uTexture, texture.getTextureIndx());
        };
        return LShaderSimpleTexture;
    }(core.LShader));
    engine3d.LShaderSimpleTexture = LShaderSimpleTexture;
})(engine3d || (engine3d = {}));
