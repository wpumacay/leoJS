/// <reference path="../../core/worlds/RWorld.ts" />
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
/// <reference path="RDHmodel.ts" />
/// <reference path="ui/RDHguiController.ts" />
/// <reference path="RManipulator.ts" />
var leojs;
(function (leojs) {
    var RDHWorld = /** @class */ (function (_super) {
        __extends(RDHWorld, _super);
        function RDHWorld(appWidth, appHeight) {
            var _this = _super.call(this, appWidth, appHeight) || this;
            _this.m_dhModel = null;
            _this.m_urdfModel = null;
            _this.m_uiController = null;
            _this.m_worldId = '';
            return _this;
        }
        RDHWorld.prototype.init = function () {
            // Override this - Initialize some needed stuff here
        };
        RDHWorld.prototype.getWorldId = function () {
            return this.m_worldId;
        };
        RDHWorld.prototype._drawFloorGrid = function () {
            var _gridRangeX = 10;
            var _divX = 5;
            var _stepX = _gridRangeX / _divX;
            var _gridRangeY = 10;
            var _divY = 5;
            var _stepY = _gridRangeY / _divY;
            // Draw lines parallel to x axis
            for (var q = -_divY; q <= _divY; q++) {
                var _p1 = new core.LVec3(-_gridRangeX, q * _stepY, 0);
                var _p2 = new core.LVec3(_gridRangeX, q * _stepY, 0);
                engine3d.DebugSystem.drawLine(_p1, _p2, core.LIGHT_GRAY);
            }
            // Draw lines parallel to y axis
            for (var q = -_divX; q <= _divX; q++) {
                var _p1 = new core.LVec3(q * _stepY, -_gridRangeY, 0);
                var _p2 = new core.LVec3(q * _stepY, _gridRangeY, 0);
                engine3d.DebugSystem.drawLine(_p1, _p2, core.LIGHT_GRAY);
            }
        };
        RDHWorld.prototype.update = function (dt) {
            _super.prototype.update.call(this, dt);
            this._drawFloorGrid();
            if (this.m_dhModel) {
                this.m_dhModel.update(dt);
            }
            if (this.m_urdfModel) {
                var _kinJoints = this.m_urdfModel.getJoints();
                for (var _jointId in _kinJoints) {
                    if (this.m_dhModel.doesJointExist(_jointId)) {
                        var _jointValue = this.m_dhModel.getJointValueById(_jointId);
                        _kinJoints[_jointId].setJointValue(_jointValue);
                    }
                }
            }
            if (this.m_uiController) {
                // Update visibility
                var _isDHmodelVisible = this.m_uiController.isDHmodelVisible();
                var _isURDFmodelVisible = this.m_uiController.isURDFmodelVisible();
                if (this.m_dhModel) {
                    this.m_dhModel.setModelVisibility(_isDHmodelVisible);
                }
                if (this.m_urdfModel) {
                    this.m_urdfModel.setVisibility(_isURDFmodelVisible);
                }
                this.m_uiController.update(dt);
            }
        };
        return RDHWorld;
    }(leojs.RWorld));
    leojs.RDHWorld = RDHWorld;
})(leojs || (leojs = {}));
