/// <reference path="../graphics/LIRenderable.ts"/>
/// <reference path="../camera/LBaseCamera.ts" />
/// <reference path="../lights/LBaseLight.ts" />
var core;
(function (core) {
    var LScene = /** @class */ (function () {
        function LScene(sceneId) {
            this.m_id = sceneId;
            this.m_renderables = [];
            this.m_cameras = {};
            this.m_currentCamera = null;
            this.m_lights = {};
            this.m_lights[engine3d.LDirectionalLight.staticType()] = [];
            this.m_lights[engine3d.LPointLight.staticType()] = [];
        }
        LScene.prototype.addRenderable = function (renderable) {
            this.m_renderables.push(renderable);
        };
        LScene.prototype.getRenderables = function () {
            return this.m_renderables;
        };
        LScene.prototype.addCamera = function (camera) {
            if (this.m_cameras[camera.getId()]) {
                console.warn('LScene> there is already a camera with id: ' + camera.getId());
                return;
            }
            if (!this.m_currentCamera) {
                this.m_currentCamera = camera;
            }
            this.m_cameras[camera.getId()] = camera;
        };
        LScene.prototype.changeToCamera = function (id) {
            if (!this.m_cameras[id]) {
                console.warn('LScene> there is no camera with id: ' + id);
                return;
            }
            this.m_currentCamera = this.m_cameras[id];
        };
        LScene.prototype.getCameraById = function (id) {
            if (!this.m_cameras[id]) {
                console.warn('LScene> there is no camera with id: ' + id);
                return null;
            }
            return this.m_cameras[id];
        };
        LScene.prototype.getCurrentCamera = function () {
            return this.m_currentCamera;
        };
        LScene.prototype.addLight = function (light) {
            this.m_lights[light.type()].push(light);
        };
        LScene.prototype.getLights = function (type) {
            return this.m_lights[type];
        };
        LScene.prototype.update = function (dt) {
            var _key;
            for (_key in this.m_cameras) {
                this.m_cameras[_key].update(dt);
            }
            var q;
            for (q = 0; q < this.m_renderables.length; q++) {
                this.m_renderables[q].update();
            }
        };
        LScene.prototype.onResize = function (appWidth, appHeight) {
            var _key;
            for (_key in this.m_cameras) {
                this.m_cameras[_key].onResize(appWidth, appHeight);
            }
        };
        LScene.prototype.id = function () { return this.m_id; };
        return LScene;
    }());
    core.LScene = LScene;
})(core || (core = {}));
