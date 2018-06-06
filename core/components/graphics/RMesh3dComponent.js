/// <reference path="../../../ext/cat1js/engine3d/graphics/LMesh.ts" />
/// <reference path="RGraphicsComponent.ts" />
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
    var RMesh3dComponent = /** @class */ (function (_super) {
        __extends(RMesh3dComponent, _super);
        function RMesh3dComponent(parent, mesh3d) {
            var _this = _super.call(this, parent) || this;
            if (mesh3d) {
                _this.m_renderables.push(mesh3d);
            }
            return _this;
        }
        RMesh3dComponent.prototype.appendMesh = function (mesh) { this.m_renderables.push(mesh); };
        RMesh3dComponent.prototype.getMesh = function (indx) { return this.m_renderables[indx]; };
        RMesh3dComponent.prototype.update = function (dt) {
            for (var q = 0; q < this.m_renderables.length; q++) {
                var _mesh = this.m_renderables[q];
                _mesh.setPos(this.m_parent.position);
                _mesh.setRotEuler(this.m_parent.rotation);
            }
            _super.prototype.update.call(this, dt);
        };
        return RMesh3dComponent;
    }(leojs.RGraphicsComponent));
    leojs.RMesh3dComponent = RMesh3dComponent;
})(leojs || (leojs = {}));
