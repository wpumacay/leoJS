/// <reference path="../../../ext/cat1js/core/assets/LAssetsManager.ts" />
/// <reference path="../../../ext/cat1js/engine3d/geometry/LGeometryBuilder.ts" />
/// <reference path="../../../ext/cat1js/engine3d/material/LMaterial3d.ts" />
/// <reference path="../../../ext/cat1js/engine3d/material/LPhongMaterial.ts" />
/// <reference path="../../../ext/cat1js/engine3d/material/LTexturedMaterial.ts" />
/// <reference path="../../../ext/cat1js/engine3d/graphics/LMesh.ts" />
var leojs;
(function (leojs) {
    function buildPrimitive(geoProps, matProps) {
        var _geometry = null;
        var _material = null;
        var _shapeType = (geoProps['shape']) ? geoProps['shape'] : 'box';
        switch (_shapeType) {
            case 'plane':
                _geometry = engine3d.LGeometryBuilder.createPlane(geoProps['width'] || 1.0, geoProps['depth'] || 1.0, geoProps['texRangeWidth'] || 1.0, geoProps['texRangeDepth'] || 1.0);
                break;
            case 'box':
                _geometry = engine3d.LGeometryBuilder.createBox(geoProps['width'] || 1.0, geoProps['height'] || 1.0, geoProps['depth'] || 1.0);
                break;
            case 'sphere':
                _geometry = engine3d.LGeometryBuilder.createSphere(geoProps['radius'] || 1.0, geoProps['levelDivision'] || 10, geoProps['numLevels'] || 10);
                break;
            case 'cylinder':
                _geometry = engine3d.LGeometryBuilder.createCylinder(geoProps['radius'] || 0.5, geoProps['height'] || 1.0, geoProps['sectionDivision'] | 10);
                break;
            case 'capsule':
                _geometry = engine3d.LGeometryBuilder.createCapsule(geoProps['radius'] || 0.5, geoProps['height'] || 1.0, geoProps['sectionDivision'] || 10, geoProps['levels'] || 10);
                break;
            case 'cone':
                _geometry = engine3d.LGeometryBuilder.createCone(geoProps['radius'] || 0.5, geoProps['height'] || 1.0, geoProps['sectionDivision'] || 10);
                break;
            case 'arrow':
                _geometry = engine3d.LGeometryBuilder.createArrow(geoProps['length'] || 1.0);
                break;
        }
        var _materialType = (matProps['material']) ? matProps['material'] : 'simple';
        switch (_materialType) {
            case 'phong':
                var _pAmbient = (matProps['ambient']) ? matProps['ambient'] : core.DEFAULT_AMBIENT;
                var _pDiffuse = (matProps['diffuse']) ? matProps['diffuse'] : core.DEFAULT_DIFFUSE;
                var _pSpecular = (matProps['specular']) ? matProps['specular'] : core.DEFAULT_SPECULAR;
                var _pShininess = (matProps['shininess']) ? matProps['shininess'] : core.DEFAULT_SHININESS;
                _material = new engine3d.LPhongMaterial(_pAmbient, _pDiffuse, _pSpecular, _pShininess);
                break;
            case 'textured':
                var _textureId = (matProps['textureId']) ? matProps['textureId'] : 'img_default';
                var _texture = core.LAssetsManager.INSTANCE.getTexture(_textureId);
                if (!_texture) {
                    _texture = core.LAssetsManager.INSTANCE.getTexture('img_default');
                }
                var _specular = (matProps['specular']) ? matProps['specular'] : core.DEFAULT_SPECULAR;
                var _shininess = (matProps['shininess']) ? matProps['shininess'] : core.DEFAULT_SHININESS;
                _material = new engine3d.LTexturedMaterial(_texture, _specular, _shininess);
                break;
            case 'simple':
            default:
                var _color = (matProps['color']) ? matProps['color'] : core.BLUE;
                _material = new engine3d.LMaterial3d(_color);
                break;
        }
        return new engine3d.LMesh(_geometry, _material);
    }
    leojs.buildPrimitive = buildPrimitive;
})(leojs || (leojs = {}));
