/// <reference path="..//lights/LLight3d.ts" />
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
    var LPointLight = /** @class */ (function (_super) {
        __extends(LPointLight, _super);
        function LPointLight(position, ambient, diffuse, specular) {
            var _this = _super.call(this, ambient, diffuse, specular) || this;
            _this.m_type = LPointLight.staticType();
            _this.m_position = position;
            return _this;
        }
        LPointLight.prototype.setPosition = function (position) { this.m_position = position; };
        LPointLight.prototype.getPosition = function () { return this.m_position; };
        LPointLight.staticType = function () { return 'point3d'; };
        return LPointLight;
    }(engine3d.LLight3d));
    engine3d.LPointLight = LPointLight;
})(engine3d || (engine3d = {}));
