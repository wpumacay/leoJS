/// <reference path="LMaterial3d.ts" />
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
    var LPhongMaterial = /** @class */ (function (_super) {
        __extends(LPhongMaterial, _super);
        function LPhongMaterial(ambient, diffuse, specular, shininess) {
            var _this = _super.call(this, ambient) || this;
            _this.m_type = LPhongMaterial.staticType();
            _this.ambient = ambient;
            _this.diffuse = diffuse;
            _this.specular = specular;
            _this.shininess = shininess;
            return _this;
        }
        LPhongMaterial.prototype.release = function () {
            this.ambient = null;
            this.diffuse = null;
            this.specular = null;
            _super.prototype.release.call(this);
        };
        LPhongMaterial.staticType = function () { return 'phongMaterial3d'; };
        return LPhongMaterial;
    }(engine3d.LMaterial3d));
    engine3d.LPhongMaterial = LPhongMaterial;
})(engine3d || (engine3d = {}));
