/// <reference path="../../core/entities/REntity.ts" />
/// <reference path="../../core/components/RComponent.ts" />
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
/// <reference path="components/RDHtreeModelComponent.ts" />
/// <reference path="RKinTree.ts" />
/// <reference path="RUrdfModelParser.ts" />
var leojs;
(function (leojs) {
    var RManipulator = /** @class */ (function (_super) {
        __extends(RManipulator, _super);
        function RManipulator(urdfStr) {
            var _this = _super.call(this) || this;
            _this.m_kinTree = null;
            _this.m_treeModelRef = null;
            _this._initKinTree(urdfStr);
            _this._initTreeModel();
            return _this;
        }
        RManipulator.prototype.release = function () {
            if (this.m_kinTree) {
                this.m_kinTree.release();
                this.m_kinTree = null;
            }
            this.m_treeModelRef = null;
            _super.prototype.release.call(this);
        };
        RManipulator.prototype._initKinTree = function (urdfStr) {
            // Build kintree from urdf
            var _parser = new leojs.RUrdfModelParser();
            this.m_kinTree = _parser.parse(urdfStr);
        };
        RManipulator.prototype._initTreeModel = function () {
            if (this.m_kinTree) {
                this.m_treeModelRef = new leojs.RDHtreeModelComponent(this, this.m_kinTree);
                this.addComponent(this.m_treeModelRef);
            }
            else {
                console.warn('RManipulator> there is no kintree to create manipulator, ' +
                    ' maybe could not parse the urdf file correctly');
            }
        };
        RManipulator.prototype.update = function (dt) {
            if (this.m_kinTree) {
                this.m_kinTree.update();
            }
            _super.prototype.update.call(this, dt);
        };
        RManipulator.prototype.getJoints = function () { return this.m_kinTree.joints(); };
        RManipulator.prototype.getNodes = function () { return this.m_kinTree.nodes(); };
        return RManipulator;
    }(leojs.REntity));
    leojs.RManipulator = RManipulator;
})(leojs || (leojs = {}));
