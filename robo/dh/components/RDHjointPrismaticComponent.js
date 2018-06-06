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
    var RDHjointPrismaticComponent = /** @class */ (function (_super) {
        __extends(RDHjointPrismaticComponent, _super);
        function RDHjointPrismaticComponent(parent) {
            var _this = _super.call(this, parent) || this;
            _this.m_jointFixedMeshRef = null;
            _this.m_jointMovingMeshRef = null;
            _this.m_jointTransformBase = new core.LMat4();
            _this.m_jointTransformTotal = new core.LMat4();
            _this.m_jointValue = 0.0;
            _this._initializePrismaticJoint();
            return _this;
        }
        RDHjointPrismaticComponent.prototype._initializePrismaticJoint = function () {
            this.m_jointFixedMeshRef = leojs.buildPrimitive({ 'shape': 'box',
                'width': 0.1,
                'depth': 0.1,
                'height': 0.1 }, { 'material': 'simple',
                'color': core.LIGHT_GRAY });
            this.m_jointMovingMeshRef = leojs.buildPrimitive({ 'shape': 'box',
                'width': 0.05,
                'depth': 0.15,
                'height': 0.05 }, { 'material': 'simple',
                'color': core.LIGHT_GRAY });
            this.m_renderables.push(this.m_jointFixedMeshRef);
            this.m_renderables.push(this.m_jointMovingMeshRef);
        };
        RDHjointPrismaticComponent.prototype.setJointValue = function (jointValue) {
            this.m_jointValue = jointValue;
        };
        RDHjointPrismaticComponent.prototype.update = function (dt) {
            //// Update moving mesh ( same as parent's position - orientation )
            this.m_jointMovingMeshRef.setPos(this.m_parent.position);
            this.m_jointMovingMeshRef.setRotEuler(this.m_parent.rotation);
            //// Update fixed mesh ( Dz * Tparent )
            // Build the transform
            core.LMat4.fromPosEulerInPlace(this.m_jointTransformBase, this.m_parent.position, this.m_parent.rotation);
            // Apply translation
            this.m_jointTransformTotal = core.mulMatMat44(this.m_jointTransformBase, core.LMat4.translation(new core.LVec3(0, 0, this.m_jointValue)));
            // Set total transform
            this.m_jointFixedMeshRef.setWorldTransform(this.m_jointTransformTotal);
            // Update the renderables' model matrices
            _super.prototype.update.call(this, dt);
        };
        return RDHjointPrismaticComponent;
    }(leojs.RGraphicsComponent));
    leojs.RDHjointPrismaticComponent = RDHjointPrismaticComponent;
})(leojs || (leojs = {}));
