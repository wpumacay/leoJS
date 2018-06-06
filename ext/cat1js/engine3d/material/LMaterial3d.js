/// <reference path="../../core/material/LBaseMaterial.ts" />
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
    var LMaterial3d = /** @class */ (function (_super) {
        __extends(LMaterial3d, _super);
        // TODO: Add 3d specific stuff (multitex? )
        function LMaterial3d(color) {
            var _this = _super.call(this, color) || this;
            _this.m_type = 'base3d';
            return _this;
        }
        LMaterial3d.staticType = function () { return 'base3d'; };
        return LMaterial3d;
    }(core.LBaseMaterial));
    engine3d.LMaterial3d = LMaterial3d;
})(engine3d || (engine3d = {}));
