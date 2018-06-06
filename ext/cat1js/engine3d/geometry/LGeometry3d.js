/// <reference path="../../core/geometry/LBaseGeometry.ts" />
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
    var LGeometry3d = /** @class */ (function (_super) {
        __extends(LGeometry3d, _super);
        function LGeometry3d(vertices, normals, texCoords, indices) {
            var _this = _super.call(this) || this;
            // Create vbos
            // Layout : 
            // attribute 0 -> vertices - here
            // attribute 1 -> normals - here
            // attribute 2 -> texture coords - here, but can be changed ( values )
            // console.log( vertices );
            _this.addVbo(3, core.LVec3.arrayToBuffer(vertices), 0);
            _this.addVbo(3, core.LVec3.arrayToBuffer(normals), 1);
            _this.addVbo(2, core.LVec2.arrayToBuffer(texCoords), 2);
            // Create ibo
            _this.setIbo(indices.length * 3, core.LInd3.arrayToBuffer(indices));
            return _this;
        }
        return LGeometry3d;
    }(core.LBaseGeometry));
    engine3d.LGeometry3d = LGeometry3d;
})(engine3d || (engine3d = {}));
