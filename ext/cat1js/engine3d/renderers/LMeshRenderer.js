/// <reference path="../graphics/LMesh.ts" />
/// <reference path="../graphics/LModel.ts" />
/// <reference path="../../core/scene/LScene.ts" />
/// <reference path="../../core/assets/LAssetsManager.ts" />
var engine3d;
(function (engine3d) {
    var LMeshRenderer = /** @class */ (function () {
        function LMeshRenderer() {
            this.m_texturedMeshes = [];
            this.m_nonTexturedMeshes = [];
            this.m_isLightingEnabled = true;
        }
        LMeshRenderer.prototype.setLightingMode = function (lightingMode) {
            this.m_isLightingEnabled = lightingMode;
        };
        LMeshRenderer.prototype.isLightingEnabled = function () {
            return this.m_isLightingEnabled;
        };
        LMeshRenderer.prototype.begin = function (meshes) {
            var q;
            for (q = 0; q < meshes.length; q++) {
                var _material = meshes[q].getMaterial();
                if (_material.type() == engine3d.LMaterial3d.staticType() ||
                    _material.type() == engine3d.LPhongMaterial.staticType()) {
                    this.m_nonTexturedMeshes.push(meshes[q]);
                }
                else if (_material.type() == engine3d.LTexturedMaterial.staticType()) {
                    this.m_texturedMeshes.push(meshes[q]);
                }
            }
        };
        LMeshRenderer.prototype.render = function (scene) {
            if (this.m_isLightingEnabled) {
                this._renderWithLighting(scene);
            }
            else {
                this._renderNoLighting(scene);
            }
        };
        LMeshRenderer.prototype._renderWithLighting = function (scene) {
            // render non textured
            {
                var _shader = core.LAssetsManager.INSTANCE.getShader('phongLighting3d');
                _shader.bind();
                var _camera = scene.getCurrentCamera();
                _shader.setMatView(_camera.getViewMatrix());
                _shader.setMatProj(_camera.getProjectionMatrix());
                _shader.setViewPos(_camera.getPosition());
                var _lightsDirectional = scene.getLights(engine3d.LDirectionalLight.staticType());
                var _lightsPunctual = scene.getLights(engine3d.LPointLight.staticType());
                var q = void 0;
                for (q = 0; q < _lightsDirectional.length; q++) {
                    _shader.setLightDirectional(_lightsDirectional[q], q);
                }
                _shader.setNumDirectionalLights(_lightsDirectional.length);
                for (q = 0; q < _lightsPunctual.length; q++) {
                    _shader.setLightPoint(_lightsPunctual[q], q);
                }
                _shader.setNumPointLights(_lightsPunctual.length);
                for (q = 0; q < this.m_nonTexturedMeshes.length; q++) {
                    var _mesh = this.m_nonTexturedMeshes[q];
                    var _material = _mesh.getMaterial();
                    _shader.setMatModel(_mesh.getModelMatrix());
                    _shader.setMaterial(_material);
                    _mesh.render();
                }
                _shader.unbind();
            }
            // render textured
            {
                var _shader = core.LAssetsManager.INSTANCE.getShader('textureLighting3d');
                _shader.bind();
                var _camera = scene.getCurrentCamera();
                _shader.setMatView(_camera.getViewMatrix());
                _shader.setMatProj(_camera.getProjectionMatrix());
                _shader.setViewPos(_camera.getPosition());
                var _lightsDirectional = scene.getLights(engine3d.LDirectionalLight.staticType());
                var _lightsPunctual = scene.getLights(engine3d.LPointLight.staticType());
                var q = void 0;
                for (q = 0; q < _lightsDirectional.length; q++) {
                    _shader.setLightDirectional(_lightsDirectional[q], q);
                }
                _shader.setNumDirectionalLights(_lightsDirectional.length);
                for (q = 0; q < _lightsPunctual.length; q++) {
                    _shader.setLightPoint(_lightsPunctual[q], q);
                }
                _shader.setNumPointLights(_lightsPunctual.length);
                for (q = 0; q < this.m_texturedMeshes.length; q++) {
                    var _mesh = this.m_texturedMeshes[q];
                    var _material = _mesh.getMaterial();
                    _shader.setMatModel(_mesh.getModelMatrix());
                    _shader.setMaterial(_material);
                    _mesh.render();
                }
                _shader.unbind();
            }
        };
        LMeshRenderer.prototype._renderNoLighting = function (scene) {
            // render non textured
            {
                var _shader = core.LAssetsManager.INSTANCE.getShader('basic3d');
                _shader.bind();
                var _camera = scene.getCurrentCamera();
                _shader.setMatView(_camera.getViewMatrix());
                _shader.setMatProj(_camera.getProjectionMatrix());
                var q = void 0;
                for (q = 0; q < this.m_nonTexturedMeshes.length; q++) {
                    var _mesh = this.m_nonTexturedMeshes[q];
                    var _material = _mesh.getMaterial();
                    _shader.setMatModel(_mesh.getModelMatrix());
                    _shader.setColor(_material.color);
                    _mesh.render();
                }
                _shader.unbind();
            }
            // render textured
            {
                var _shader = core.LAssetsManager.INSTANCE.getShader('simpleTexture3d');
                _shader.bind();
                var _camera = scene.getCurrentCamera();
                _shader.setMatView(_camera.getViewMatrix());
                _shader.setMatProj(_camera.getProjectionMatrix());
                var q = void 0;
                for (q = 0; q < this.m_texturedMeshes.length; q++) {
                    var _mesh = this.m_texturedMeshes[q];
                    var _material = _mesh.getMaterial();
                    _shader.setMatModel(_mesh.getModelMatrix());
                    _shader.setTexture(_material.getTexture());
                    _mesh.render();
                }
                _shader.unbind();
            }
        };
        LMeshRenderer.prototype.end = function () {
            this.m_texturedMeshes = [];
            this.m_nonTexturedMeshes = [];
        };
        return LMeshRenderer;
    }());
    engine3d.LMeshRenderer = LMeshRenderer;
})(engine3d || (engine3d = {}));
