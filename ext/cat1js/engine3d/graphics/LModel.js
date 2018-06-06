/// <reference path="LMesh.ts" />
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
    engine3d.RENDERABLE_TYPE_MODEL = 'Model3d';
    var LModel = /** @class */ (function (_super) {
        __extends(LModel, _super);
        function LModel(geometry, material, compensationMat) {
            var _this = _super.call(this, geometry, material, compensationMat) || this;
            _this.m_type = engine3d.RENDERABLE_TYPE_MODEL;
            return _this;
        }
        LModel.prototype._updateModelMatrix = function () {
            _super.prototype._updateModelMatrix.call(this);
            core.mulMatMat44InPlace(this.m_calcMat, this.m_modelMatrix, this.m_modelCompensation);
            core.LMat4.copy(this.m_modelMatrix, this.m_calcMat);
        };
        return LModel;
    }(engine3d.LMesh));
    engine3d.LModel = LModel;
})(engine3d || (engine3d = {}));
