/// <reference path="../ext/cat1js/core/LApplication.ts" />
/// <reference path="../ext/cat1js/engine3d/debug/LDebugSystem.ts" />
/// <reference path="../ext/cat1js/LAssets.ts" />
/// <reference path="../RAssets.ts" />
/// <reference path="RCommon.ts" />
/// <reference path="worlds/RWorld.ts" />
/// <reference path="entities/RTestEntity.ts" />
/// <reference path="../robo/dh/RDHWorldDemo.ts" />
/// <reference path="../robo/dh/RDHWorldPlayground.ts" />
var leojs;
(function (leojs) {
    var RApp = /** @class */ (function () {
        function RApp(canvas, glContext) {
            RApp.INSTANCE = this;
            this.m_canvas = canvas;
            this.m_gl = glContext;
            this.m_world = null;
        }
        RApp.prototype.initializeApp = function () {
            var _textures = leojs.Textures.concat(assets.Textures);
            var _shaders = leojs.Shaders.concat(assets.Shaders);
            var _models = leojs.Models.concat(assets.Models);
            var _textAssets = leojs.TextAssets.concat(assets.TextAssets);
            var _appData = new core.LApplicationData(_textures, _shaders, _models, _textAssets);
            this.m_gApp = new core.LApplication(this.m_canvas, this.m_gl, _appData, this._onInit, this._onUpdate);
            this.m_gApp.addUserResizeCallback(this._onResize);
        };
        RApp.prototype._onInit = function () {
            RApp.INSTANCE._init();
        };
        RApp.prototype._onUpdate = function (dt) {
            RApp.INSTANCE._update(dt);
        };
        RApp.prototype._onResize = function (appWidth, appHeight) {
            RApp.INSTANCE._resizeApp(appWidth, appHeight);
        };
        RApp.prototype._update = function (dt) {
            if (this.m_world) {
                this.m_world.update(dt);
            }
            engine3d.DebugSystem.drawLine(core.ORIGIN, new core.LVec3(3, 0, 0), core.RED);
            engine3d.DebugSystem.drawLine(core.ORIGIN, new core.LVec3(0, 3, 0), core.GREEN);
            engine3d.DebugSystem.drawLine(core.ORIGIN, new core.LVec3(0, 0, 3), core.BLUE);
        };
        RApp.prototype._resizeApp = function (appWidth, appHeight) {
            if (this.m_world) {
                this.m_world.resizeWorld(appWidth, appHeight);
            }
        };
        RApp.prototype.world = function () { return this.m_world; };
        RApp.INSTANCE = null;
        return RApp;
    }());
    leojs.RApp = RApp;
})(leojs || (leojs = {}));
