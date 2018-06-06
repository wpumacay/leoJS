/// <reference path="../RCommon.ts" />
/// <reference path="../../ext/cat1js/core/scene/LScene.ts" />
/// <reference path="../../ext/cat1js/engine3d/camera/LFixedPointCamera.ts" />
/// <reference path="../../ext/cat1js/engine3d/camera/LOrbitCamera.ts" />
/// <reference path="../../ext/cat1js/engine3d/lights/LDirectionalLight.ts" />
/// <reference path="../entities/REntity.ts" />
var leojs;
(function (leojs) {
    var RWorld = /** @class */ (function () {
        function RWorld(appWidth, appHeight) {
            this.m_appWidth = appWidth;
            this.m_appHeight = appHeight;
            this.m_scene = null;
            this.m_entities = [];
            this._initScene();
        }
        RWorld.prototype._initScene = function () {
            this.m_scene = new core.LScene('mainScene');
            // let _camera = new engine3d.LFixedPointCamera( new core.LVec3( 5.0, 5.0, 5.0 ),
            //                                               new core.LVec3( 0.0, 0.0, 0.0 ),
            //                                               new core.LVec3( 0.0, 0.0, 1.0 ),
            //                                               this.m_appWidth, this.m_appHeight,
            //                                               1.0, 100.0,
            //                                               45.0, core.ProjectionMode.PERSPECTIVE,
            //                                               "mainCamera" );
            var _camera = new engine3d.LOrbitCamera(new core.LVec3(5.0, 5.0, 5.0), new core.LVec3(0.0, 0.0, 0.0), new core.LVec3(0.0, 0.0, 1.0), this.m_appWidth, this.m_appHeight, 1.0, 100.0, 45.0, core.ProjectionMode.PERSPECTIVE, "mainCamera");
            this.m_scene.addCamera(_camera);
            var _light = new engine3d.LPointLight(new core.LVec3(0.0, 0.0, 3.0), new core.LVec3(0.5, 0.5, 0.5), new core.LVec3(0.8, 0.8, 0.8), new core.LVec3(0.85, 0.85, 0.85));
            // let _light : engine3d.LDirectionalLight = new engine3d.LDirectionalLight( new core.LVec3( -1.0, -1.0, -1.0 ),
            //                                                                           new core.LVec3( 0.2, 0.2, 0.2 ),
            //                                                                           new core.LVec3( 0.8, 0.8, 0.8 ),
            //                                                                           new core.LVec3( 0.9, 0.9, 0.9 ) );
            this.m_scene.addLight(_light);
        };
        RWorld.prototype.scene = function () { return this.m_scene; };
        RWorld.prototype.resizeWorld = function (appWidth, appHeight) {
            this.m_appWidth = appWidth;
            this.m_appHeight = appHeight;
        };
        RWorld.prototype.addEntity = function (entity) {
            this.m_entities.push(entity);
            this._collectRenderables(entity);
        };
        RWorld.prototype._collectRenderables = function (entity) {
            var _graphicsComponent = entity.getComponent(leojs.RComponentType.GRAPHICS);
            var _renderables = _graphicsComponent.renderables();
            for (var _i = 0, _renderables_1 = _renderables; _i < _renderables_1.length; _i++) {
                var _renderable = _renderables_1[_i];
                this.m_scene.addRenderable(_renderable);
            }
        };
        RWorld.prototype.update = function (dt) {
            for (var _i = 0, _a = this.m_entities; _i < _a.length; _i++) {
                var _entity = _a[_i];
                _entity.update(dt);
            }
        };
        return RWorld;
    }());
    leojs.RWorld = RWorld;
})(leojs || (leojs = {}));
