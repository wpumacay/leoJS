/// <reference path="../RCommon.ts" />
/// <reference path="../entities/REntity.ts" />
var leojs;
(function (leojs) {
    /**
    * Simple types that the components can be part of
    */
    var RComponentType;
    (function (RComponentType) {
        RComponentType[RComponentType["NEUTRAL"] = 0] = "NEUTRAL";
        RComponentType[RComponentType["GRAPHICS"] = 1] = "GRAPHICS";
        RComponentType[RComponentType["PHYSICS"] = 2] = "PHYSICS";
    })(RComponentType = leojs.RComponentType || (leojs.RComponentType = {}));
    ;
    var RComponent = /** @class */ (function () {
        function RComponent(parent) {
            this.m_parent = parent;
            this.m_typeId = RComponentType.NEUTRAL;
            this.m_classId = RComponent.CLASS_ID;
        }
        RComponent.prototype.typeId = function () { return this.m_typeId; };
        RComponent.prototype.classId = function () { return this.m_classId; };
        RComponent.prototype.update = function (dt) {
            // Override this
        };
        RComponent.CLASS_ID = 'base';
        return RComponent;
    }());
    leojs.RComponent = RComponent;
})(leojs || (leojs = {}));
