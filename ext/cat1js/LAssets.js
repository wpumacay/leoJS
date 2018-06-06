/// <reference path="LCommon.ts" />
var assets;
(function (assets) {
    assets.Textures = [
        new core.LTextureAssetInfo(core.FORMAT_PNG, 'res/imgs/img_default.png', 'img_default'),
        new core.LTextureAssetInfo(core.FORMAT_PNG, 'res/imgs/img_container.png', 'img_container'),
        new core.LTextureAssetInfo(core.FORMAT_PNG, 'res/imgs/img_wall.png', 'img_wall'),
        new core.LTextureAssetInfo(core.FORMAT_PNG, 'res/imgs/ss_trex.png', 'ss_trex')
    ];
    assets.Shaders = [
        new core.LShaderAssetInfo('basic3d', core.SHADER_BASIC_3D, 'res/shaders/3d/basic/basicShader3d_vs.glsl', 'res/shaders/3d/basic/basicShader3d_fs.glsl'),
        new core.LShaderAssetInfo('phongLighting3d', core.SHADER_PHONG_LIGHTING_3D, 'res/shaders/3d/basic/phongLighting_vs.glsl', 'res/shaders/3d/basic/phongLighting_fs.glsl'),
        new core.LShaderAssetInfo('debugDrawer3d', core.SHADER_DEBUG_DRAWER_3D, 'res/shaders/3d/debug/debug_3d_vs.glsl', 'res/shaders/3d/debug/debug_3d_fs.glsl'),
        new core.LShaderAssetInfo('simpleTexture3d', core.SHADER_SIMPLE_TEXTURE_3D, 'res/shaders/3d/basic/simpleTexture_vs.glsl', 'res/shaders/3d/basic/simpleTexture_fs.glsl'),
        new core.LShaderAssetInfo('textureLighting3d', core.SHADER_TEXTURE_LIGHTING_3D, 'res/shaders/3d/lighting/phongLightingTexture_vs.glsl', 'res/shaders/3d/lighting/phongLightingTexture_fs.glsl'),
    ];
    assets.Sounds = [];
    assets.Models = [
        new core.LModelInfo('base_link', 'res/models/base_link.dae', core.MODEL_TYPE_COLLADA),
        new core.LModelInfo('link_1', 'res/models/link_1.dae', core.MODEL_TYPE_COLLADA),
        new core.LModelInfo('link_2', 'res/models/link_2.dae', core.MODEL_TYPE_COLLADA),
        new core.LModelInfo('link_3', 'res/models/link_3.dae', core.MODEL_TYPE_COLLADA),
        new core.LModelInfo('link_4', 'res/models/link_4.dae', core.MODEL_TYPE_COLLADA),
        new core.LModelInfo('link_5', 'res/models/link_5.dae', core.MODEL_TYPE_COLLADA),
        new core.LModelInfo('link_6', 'res/models/link_6.dae', core.MODEL_TYPE_COLLADA),
        new core.LModelInfo('kinematics_bin', 'res/models/kinematics_bin.dae', core.MODEL_TYPE_COLLADA),
        new core.LModelInfo('kinematics_shelf', 'res/models/kinematics_shelf.dae', core.MODEL_TYPE_COLLADA)
    ];
    assets.TextAssets = [
        new core.LTextAssetInfo('kr210_urdf', 'res/text/kr210.urdf')
    ];
})(assets || (assets = {}));
