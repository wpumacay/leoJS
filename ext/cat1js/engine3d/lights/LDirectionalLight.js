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
    var LDirectionalLight = /** @class */ (function (_super) {
        __extends(LDirectionalLight, _super);
        function LDirectionalLight(direction, ambient, diffuse, specular) {
            var _this = _super.call(this, ambient, diffuse, specular) || this;
            _this.m_type = LDirectionalLight.staticType();
            _this.m_direction = direction;
            return _this;
        }
        LDirectionalLight.prototype.setDirection = function (direction) { this.m_direction = direction; };
        LDirectionalLight.prototype.getDirection = function () { return this.m_direction; };
        LDirectionalLight.staticType = function () { return 'directional3d'; };
        return LDirectionalLight;
    }(engine3d.LLight3d));
    engine3d.LDirectionalLight = LDirectionalLight;
})(engine3d || (engine3d = {}));
