/// <reference path="REntity.ts" />
/// <reference path="../components/graphics/RReferenceFrameComponent.ts" />
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
    var RTestEntity = /** @class */ (function (_super) {
        __extends(RTestEntity, _super);
        function RTestEntity() {
            var _this = _super.call(this) || this;
            _this.addComponent(new leojs.RReferenceFrameComponent(_this));
            return _this;
        }
        RTestEntity.prototype.update = function (dt) {
            _super.prototype.update.call(this, dt);
            // Do some testing here :D
            this.rotation.x += dt * 0.001;
            this.rotation.y += dt * 0.001;
            this.rotation.z += dt * 0.001;
        };
        return RTestEntity;
    }(leojs.REntity));
    leojs.RTestEntity = RTestEntity;
})(leojs || (leojs = {}));
