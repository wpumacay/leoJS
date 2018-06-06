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
    leojs.EF_BASE_DIM = 0.05;
    leojs.EF_ROOT_SIZE = 4;
    leojs.EF_GRIP_WIDTH = 4;
    leojs.EF_GRIP_HEIGHT = 2;
    leojs.EF_GRIP_DEPTH = 1;
    var RDHendEffectorComponent = /** @class */ (function (_super) {
        __extends(RDHendEffectorComponent, _super);
        function RDHendEffectorComponent(parent) {
            var _this = _super.call(this, parent) || this;
            _this.m_effRootMesh = null;
            _this.m_effLeftMesh = null;
            _this.m_effRighttMesh = null;
            _this.m_transformBase = new core.LMat4();
            _this.m_leftGripTotalTransform = new core.LMat4();
            _this.m_rightGripTotalTransform = new core.LMat4();
            var _leftGripOff = new core.LVec3(0, 0, 0);
            _leftGripOff.x = (-0.5 * leojs.EF_ROOT_SIZE - 0.5 * leojs.EF_GRIP_WIDTH) * leojs.EF_BASE_DIM;
            _leftGripOff.y = 0;
            _leftGripOff.z = (0.5 * leojs.EF_ROOT_SIZE - 0.5 * leojs.EF_GRIP_DEPTH) * leojs.EF_BASE_DIM;
            var _rightGripOff = new core.LVec3(0, 0, 0);
            _rightGripOff.x = (-0.5 * leojs.EF_ROOT_SIZE - 0.5 * leojs.EF_GRIP_WIDTH) * leojs.EF_BASE_DIM;
            _rightGripOff.y = 0;
            _rightGripOff.z = (-0.5 * leojs.EF_ROOT_SIZE + 0.5 * leojs.EF_GRIP_DEPTH) * leojs.EF_BASE_DIM;
            _this.m_leftGripTotalTransformToRoot = core.LMat4.translation(_leftGripOff);
            _this.m_rightGripTotalTransformToRoot = core.LMat4.translation(_rightGripOff);
            _this._initializeEndEffector();
            return _this;
        }
        RDHendEffectorComponent.prototype._initializeEndEffector = function () {
            this.m_effRootMesh = leojs.buildPrimitive({ 'shape': 'box',
                'width': leojs.EF_ROOT_SIZE * leojs.EF_BASE_DIM,
                'depth': leojs.EF_ROOT_SIZE * leojs.EF_BASE_DIM,
                'height': leojs.EF_ROOT_SIZE * leojs.EF_BASE_DIM }, { 'material': 'simple',
                'color': core.LIGHT_GRAY });
            this.m_effLeftMesh = leojs.buildPrimitive({ 'shape': 'box',
                'width': leojs.EF_GRIP_WIDTH * leojs.EF_BASE_DIM,
                'depth': leojs.EF_GRIP_DEPTH * leojs.EF_BASE_DIM,
                'height': leojs.EF_GRIP_HEIGHT * leojs.EF_BASE_DIM }, { 'material': 'simple',
                'color': core.LIGHT_GRAY });
            this.m_effRighttMesh = leojs.buildPrimitive({ 'shape': 'box',
                'width': leojs.EF_GRIP_WIDTH * leojs.EF_BASE_DIM,
                'depth': leojs.EF_GRIP_DEPTH * leojs.EF_BASE_DIM,
                'height': leojs.EF_GRIP_HEIGHT * leojs.EF_BASE_DIM }, { 'material': 'simple',
                'color': core.LIGHT_GRAY });
            this.m_renderables.push(this.m_effRootMesh);
            this.m_renderables.push(this.m_effLeftMesh);
            this.m_renderables.push(this.m_effRighttMesh);
        };
        RDHendEffectorComponent.prototype.update = function (dt) {
            //// Update root mesh ( same as parent's position - orientation )
            this.m_effRootMesh.setPos(this.m_parent.position);
            this.m_effRootMesh.setRotEuler(this.m_parent.rotation);
            //// Update left and right grip
            // Build the transform
            core.LMat4.fromPosEulerInPlace(this.m_transformBase, this.m_parent.position, this.m_parent.rotation);
            // Apply relative transform to left and right gripper parts
            this.m_leftGripTotalTransform = core.mulMatMat44(this.m_transformBase, this.m_leftGripTotalTransformToRoot);
            this.m_rightGripTotalTransform = core.mulMatMat44(this.m_transformBase, this.m_rightGripTotalTransformToRoot);
            // Set total transform
            this.m_effLeftMesh.setWorldTransform(this.m_leftGripTotalTransform);
            this.m_effRighttMesh.setWorldTransform(this.m_rightGripTotalTransform);
            // Update the renderables' model matrices
            _super.prototype.update.call(this, dt);
        };
        return RDHendEffectorComponent;
    }(leojs.RGraphicsComponent));
    leojs.RDHendEffectorComponent = RDHendEffectorComponent;
})(leojs || (leojs = {}));
