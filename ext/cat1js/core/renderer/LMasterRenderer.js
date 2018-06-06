/// <reference path="../math/LMath.ts" />
/// <reference path="../scene/LScene.ts" />
/// <reference path="../../engine3d/renderers/LMeshRenderer.ts" />
var core;
(function (core) {
    var LMasterRenderer = /** @class */ (function () {
        function LMasterRenderer() {
            this.m_meshes = [];
            this.m_meshRenderer = new engine3d.LMeshRenderer();
        }
        LMasterRenderer.prototype.begin = function (scene) {
            //// Collect renderables and organize the render tree
            var _renderables = scene.getRenderables();
            var q;
            // Collect meshes
            for (q = 0; q < _renderables.length; q++) {
                if (!_renderables[q].isVisible()) {
                    continue;
                }
                if (_renderables[q].type() == engine3d.RENDERABLE_TYPE_MESH_3D ||
                    _renderables[q].type() == engine3d.RENDERABLE_TYPE_MODEL) {
                    this.m_meshes.push(_renderables[q]);
                }
            }
            this.m_meshRenderer.begin(this.m_meshes);
        };
        LMasterRenderer.prototype.render = function (scene) {
            // render meshes
            this.m_meshRenderer.render(scene);
        };
        LMasterRenderer.prototype.end = function () {
            this.m_meshes = [];
            this.m_meshRenderer.end();
        };
        return LMasterRenderer;
    }());
    core.LMasterRenderer = LMasterRenderer;
})(core || (core = {}));
