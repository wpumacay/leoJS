/// <reference path="../../core/lights/LBaseLight.ts" />
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
    var LLight3d = /** @class */ (function (_super) {
        __extends(LLight3d, _super);
        function LLight3d(ambient, diffuse, specular) {
            var _this = _super.call(this, ambient) || this;
            _this.m_type = LLight3d.staticType();
            _this.ambient = ambient;
            _this.diffuse = diffuse;
            _this.specular = specular;
            _this.strength = 1.0;
            return _this;
        }
        LLight3d.staticType = function () { return 'baseLight3d'; };
        return LLight3d;
    }(core.LBaseLight));
    engine3d.LLight3d = LLight3d;
})(engine3d || (engine3d = {}));
