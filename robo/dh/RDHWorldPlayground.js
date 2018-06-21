/// <reference path="RDHWorld.ts" />
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
    var RDHWorldPlayground = /** @class */ (function (_super) {
        __extends(RDHWorldPlayground, _super);
        function RDHWorldPlayground(appWidth, appHeight) {
            var _this = _super.call(this, appWidth, appHeight) || this;
            _this.m_worldId = 'PLAYGROUND';
            return _this;
        }
        RDHWorldPlayground.prototype.reset = function () {
            // Release all resources that are going to be created by the user's code
            if (this.m_dhModel) {
                this.m_dhModel.release();
                this.m_dhModel = null;
            }
            if (this.m_urdfModel) {
                this.m_urdfModel.deletionRequested = true;
                this.m_urdfModel = null;
            }
            if (this.m_uiController) {
                this.m_uiController.release();
                this.m_uiController = null;
            }
        };
        /**
        *    Rebuild models in playground
        *
        *    @method rebuild
        *    @param {Array<Dictionary>} userDHtable DH table
        *    @param {string?} userURDFfileId urdfFile of the  manipulator. Empty for none
        */
        RDHWorldPlayground.prototype.rebuild = function (userDHtable, userURDFfileId) {
            // Clean previous resources
            this.reset();
            // Build new model
            this._buildModel(userDHtable);
            this._buildUI();
            if (userURDFfileId && userURDFfileId != '') {
                var _urdfData = core.LAssetsManager.INSTANCE.getTextAsset(userURDFfileId);
                this.m_urdfModel = new leojs.RManipulator(_urdfData);
                this.addEntity(this.m_urdfModel);
            }
        };
        RDHWorldPlayground.prototype._buildModel = function (userDHtable) {
            this.m_dhModel = new leojs.RDHrobot(this, userDHtable);
            this.m_dhModel.init();
        };
        RDHWorldPlayground.prototype._buildUI = function () {
            if (this.m_dhModel) {
                this.m_uiController = new leojs.RDHguiController(this.m_dhModel);
            }
        };
        return RDHWorldPlayground;
    }(leojs.RDHWorld));
    leojs.RDHWorldPlayground = RDHWorldPlayground;
})(leojs || (leojs = {}));
