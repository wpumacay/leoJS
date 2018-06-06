/// <reference path="RComponent.ts" />
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
var leojs;
(function (leojs) {
    var RTestComponent = /** @class */ (function (_super) {
        __extends(RTestComponent, _super);
        function RTestComponent(parent) {
            var _this = _super.call(this, parent) || this;
            _this.m_typeId = leojs.RComponentType.NEUTRAL;
            _this.m_classId = RTestComponent.CLASS_ID;
            return _this;
        }
        RTestComponent.prototype.update = function (dt) {
            // Do some testing here :D
        };
        RTestComponent.CLASS_ID = 'test';
        return RTestComponent;
    }(leojs.RComponent));
    leojs.RTestComponent = RTestComponent;
})(leojs || (leojs = {}));
