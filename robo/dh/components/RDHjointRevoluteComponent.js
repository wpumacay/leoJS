/// <reference path="../../../ext/cat1js/engine3d/graphics/LMesh.ts" />
/// <reference path="../../../core/components/graphics/RGraphicsComponent.ts" />
/// <reference path="../../../core/components/graphics/RGraphicsFactory.ts" />
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
    var RDHjointRevoluteComponent = /** @class */ (function (_super) {
        __extends(RDHjointRevoluteComponent, _super);
        function RDHjointRevoluteComponent(parent) {
            var _this = _super.call(this, parent) || this;
            _this.m_jointMeshRef = null;
            _this.m_jointValue = 0.0;
            _this.m_jointRotMatBase = new core.LMat4();
            _this.m_jointRotMatTotal = new core.LMat4();
            _this._initializeRevoluteJoint();
            return _this;
        }
        RDHjointRevoluteComponent.prototype._initializeRevoluteJoint = function () {
            this.m_jointMeshRef = leojs.buildPrimitive({ 'shape': 'cylinder',
                'radius': 0.1,
                'height': 0.2 }, { 'material': 'simple',
                'color': core.LIGHT_GRAY });
            this.m_renderables.push(this.m_jointMeshRef);
        };
        RDHjointRevoluteComponent.prototype.setJointValue = function (jointValue) {
            this.m_jointValue = jointValue;
        };
        RDHjointRevoluteComponent.prototype.update = function (dt) {
            // Update the joint mesh position using only the parent's position
            this.m_jointMeshRef.setPos(this.m_parent.position);
            // Update the joint mesh according to the joint value
            core.LMat4.fromEulerInPlace(this.m_jointRotMatBase, this.m_parent.rotation);
            core.mulMatMat44InPlace(this.m_jointRotMatTotal, this.m_jointRotMatBase, core.ROT_X_90);
            this.m_jointMeshRef.setRotMat(this.m_jointRotMatTotal);
            // Update the renderables' model matrices
            _super.prototype.update.call(this, dt);
        };
        return RDHjointRevoluteComponent;
    }(leojs.RGraphicsComponent));
    leojs.RDHjointRevoluteComponent = RDHjointRevoluteComponent;
})(leojs || (leojs = {}));
