/// <reference path="../math/LMath.ts" />
/// <reference path="../data/LVertexBuffer.ts" />
/// <reference path="../data/LIndexBuffer.ts" />
/// <reference path="../material/LBaseMaterial.ts" />
/// <reference path="../geometry/LBaseGeometry.ts"/>
/// <reference path="LIRenderable.ts"/>
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
var core;
(function (core) {
    var LBaseMesh = /** @class */ (function (_super) {
        __extends(LBaseMesh, _super);
        function LBaseMesh() {
            var _this = _super.call(this) || this;
            _this.m_type = 'baseMesh';
            _this.m_geometry = null;
            _this.m_material = null;
            return _this;
        }
        LBaseMesh.prototype.update = function () {
            // Override this
        };
        LBaseMesh.prototype.render = function () {
            if (this.m_geometry == null) {
                return;
            }
            this.m_material.bind();
            this.m_geometry.bind();
            gl.drawElements(gl.TRIANGLES, this.m_geometry.getIndexCount(), gl.UNSIGNED_SHORT, 0);
            this.m_geometry.unbind();
            this.m_material.unbind();
        };
        LBaseMesh.prototype.getGeometry = function () { return this.m_geometry; };
        LBaseMesh.prototype.getMaterial = function () { return this.m_material; };
        return LBaseMesh;
    }(core.LIRenderable));
    core.LBaseMesh = LBaseMesh;
})(core || (core = {}));
