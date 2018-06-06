/// <reference path="../math/LMath.ts" />
var core;
(function (core) {
    var LBaseLight = /** @class */ (function () {
        function LBaseLight(color) {
            this.color = color;
            this.m_type = 'base';
        }
        LBaseLight.prototype.type = function () {
            return this.m_type;
        };
        return LBaseLight;
    }());
    core.LBaseLight = LBaseLight;
})(core || (core = {}));
