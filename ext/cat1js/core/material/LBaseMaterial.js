/// <reference path="../math/LMath.ts" />
var core;
(function (core) {
    var LBaseMaterial = /** @class */ (function () {
        function LBaseMaterial(color) {
            this.color = color;
            this.m_type = 'base';
        }
        LBaseMaterial.prototype.release = function () {
            this.color = null;
        };
        LBaseMaterial.prototype.bind = function () {
            // Override this
        };
        LBaseMaterial.prototype.unbind = function () {
            // Override this
        };
        LBaseMaterial.prototype.type = function () { return this.m_type; };
        return LBaseMaterial;
    }());
    core.LBaseMaterial = LBaseMaterial;
})(core || (core = {}));
