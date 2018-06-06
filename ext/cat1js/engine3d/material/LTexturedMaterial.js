/// <reference path="LMaterial3d.ts" />
/// <reference path="../../core/data/LTexture.ts" />
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
    var LTexturedMaterial = /** @class */ (function (_super) {
        __extends(LTexturedMaterial, _super);
        function LTexturedMaterial(diffuseMap, specular, shininess) {
            var _this = _super.call(this, new core.LVec3(0, 0, 0)) || this;
            _this.m_type = LTexturedMaterial.staticType();
            _this.m_diffuseMap = diffuseMap;
            _this.specular = specular;
            _this.shininess = shininess;
            return _this;
        }
        LTexturedMaterial.prototype.bind = function () {
            this.m_diffuseMap.bind();
        };
        LTexturedMaterial.prototype.getTexture = function () { return this.m_diffuseMap; };
        LTexturedMaterial.prototype.unbind = function () {
            // this.m_diffuseMap.unbind();
        };
        LTexturedMaterial.staticType = function () { return 'texturedMaterial3d'; };
        return LTexturedMaterial;
    }(engine3d.LMaterial3d));
    engine3d.LTexturedMaterial = LTexturedMaterial;
})(engine3d || (engine3d = {}));
