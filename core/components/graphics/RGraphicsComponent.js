/// <reference path="../../../ext/cat1js/core/graphics/LIRenderable.ts" />
/// <reference path="../RComponent.ts" />
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
    var RGraphicsComponent = /** @class */ (function (_super) {
        __extends(RGraphicsComponent, _super);
        function RGraphicsComponent(parent) {
            var _this = _super.call(this, parent) || this;
            _this.m_typeId = leojs.RComponentType.GRAPHICS;
            _this.m_classId = RGraphicsComponent.CLASS_ID;
            _this.m_renderables = [];
            return _this;
        }
        RGraphicsComponent.prototype.renderables = function () { return this.m_renderables; };
        RGraphicsComponent.prototype.update = function (dt) {
            for (var _i = 0, _a = this.m_renderables; _i < _a.length; _i++) {
                var _renderable = _a[_i];
                _renderable.update();
            }
        };
        RGraphicsComponent.prototype.setVisibility = function (visible) {
            for (var _i = 0, _a = this.m_renderables; _i < _a.length; _i++) {
                var _renderable = _a[_i];
                _renderable.setVisibility(visible);
            }
        };
        RGraphicsComponent.CLASS_ID = 'graphicsBase';
        return RGraphicsComponent;
    }(leojs.RComponent));
    leojs.RGraphicsComponent = RGraphicsComponent;
})(leojs || (leojs = {}));
