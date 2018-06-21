/// <reference path="../../../ext/cat1js/engine3d/graphics/LModel.ts" />
/// <reference path="../../../core/components/graphics/RGraphicsComponent.ts" />
/// <reference path="../../../core/components/graphics/RGraphicsFactory.ts" />
/// <reference path="../RKinTree.ts" />
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
    var RDHtreeModelComponent = /** @class */ (function (_super) {
        __extends(RDHtreeModelComponent, _super);
        function RDHtreeModelComponent(parent, kinTree) {
            var _this = _super.call(this, parent) || this;
            _this.m_meshes = {};
            _this.m_kinTreeRef = kinTree;
            _this._init();
            return _this;
        }
        RDHtreeModelComponent.prototype.release = function () {
            if (this.m_meshes) {
                for (var key in this.m_meshes) {
                    this.m_meshes[key] = null;
                }
                this.m_meshes = null;
            }
            this.m_kinTreeRef = null;
            _super.prototype.release.call(this);
        };
        RDHtreeModelComponent.prototype._init = function () {
            this._initializeLinks();
        };
        RDHtreeModelComponent.prototype._initializeLinks = function () {
            // Generate links from kintree nodes' geometry
            var _nodes = this.m_kinTreeRef.nodes();
            for (var _nodeId in _nodes) {
                var _node = _nodes[_nodeId];
                var _geometry = _node.getGeometry();
                var _mesh = this._createLinkFromGeometry(_geometry);
                if (_mesh) {
                    this.m_meshes[_nodeId] = _mesh;
                    this.m_renderables.push(this.m_meshes[_nodeId]);
                }
            }
        };
        RDHtreeModelComponent.prototype._createLinkFromGeometry = function (geometry) {
            var _mesh = null;
            var _material = { 'material': 'phong',
                'ambient': new core.LVec3(1.0, 0.5, 0.31),
                'diffuse': new core.LVec3(1.0, 0.5, 0.31),
                'specular': new core.LVec3(0.5, 0.5, 0.5),
                'shininess': 32 };
            var _geometry = {};
            if (geometry.type == leojs.RKinGeometryTypeBox) {
                _geometry = { 'shape': 'box',
                    'width': geometry.b_width,
                    'height': geometry.b_height,
                    'depth': geometry.b_depth };
                _mesh = leojs.buildPrimitive(_geometry, _material);
            }
            else if (geometry.type == leojs.RKinGeometryTypeCylinder) {
                _geometry = { 'shape': 'cylinder',
                    'radius': geometry.c_radius,
                    'height': geometry.c_length };
                _mesh = leojs.buildPrimitive(_geometry, _material);
            }
            else if (geometry.type == leojs.RKinGeometryTypeSphere) {
                _geometry = { 'shape': 'sphere',
                    'radius': geometry.s_radius };
                _mesh = leojs.buildPrimitive(_geometry, _material);
            }
            else if (geometry.type == leojs.RKinGeometryTypeMesh) {
                var _modelConstructionInfo = core.LAssetsManager.INSTANCE.getModel(geometry.m_meshId);
                var _modelGeometry = new engine3d.LGeometry3d(_modelConstructionInfo.geometryInfo.vertices, _modelConstructionInfo.geometryInfo.normals, _modelConstructionInfo.geometryInfo.texCoords, _modelConstructionInfo.geometryInfo.indices);
                var _modelMaterial = new engine3d.LPhongMaterial(_material['ambient'], _material['diffuse'], _material['specular'], _material['shininess']);
                _mesh = new engine3d.LModel(_modelGeometry, _modelMaterial, _modelConstructionInfo.correctionMat);
            }
            return _mesh;
        };
        RDHtreeModelComponent.prototype.update = function (dt) {
            _super.prototype.update.call(this, dt);
            // update transform from kintree
            var _nodes = this.m_kinTreeRef.nodes();
            for (var _nodeId in _nodes) {
                var _node = _nodes[_nodeId];
                if (this.m_meshes[_nodeId]) {
                    this.m_meshes[_nodeId].setWorldTransform(_node.getWorldTransform());
                }
            }
        };
        return RDHtreeModelComponent;
    }(leojs.RGraphicsComponent));
    leojs.RDHtreeModelComponent = RDHtreeModelComponent;
})(leojs || (leojs = {}));
