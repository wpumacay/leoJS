/// <reference path="../../core/RApp.ts" />
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
    var RDHApplicationMode;
    (function (RDHApplicationMode) {
        RDHApplicationMode[RDHApplicationMode["DEMO"] = 0] = "DEMO";
        RDHApplicationMode[RDHApplicationMode["PLAYGROUND"] = 1] = "PLAYGROUND";
    })(RDHApplicationMode = leojs.RDHApplicationMode || (leojs.RDHApplicationMode = {}));
    var RDHApp = /** @class */ (function (_super) {
        __extends(RDHApp, _super);
        function RDHApp(canvas, glContext, appMode) {
            var _this = _super.call(this, canvas, glContext) || this;
            _this.m_appMode = appMode;
            return _this;
        }
        RDHApp.prototype._init = function () {
            if (this.m_appMode == RDHApplicationMode.DEMO) {
                this.m_world = new leojs.RDHWorldDemo(this.m_gApp.width(), this.m_gApp.height(), leojs.RobotId.KUKA_KR210);
            }
            else {
                this.m_world = new leojs.RDHWorldPlayground(this.m_gApp.width(), this.m_gApp.height());
            }
            this.m_world.init();
            this.m_gApp.addScene(this.m_world.scene());
        };
        return RDHApp;
    }(leojs.RApp));
    leojs.RDHApp = RDHApp;
})(leojs || (leojs = {}));
