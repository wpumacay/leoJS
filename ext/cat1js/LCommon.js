var core;
(function (core) {
    core.FORMAT_JPG = "JPG";
    core.FORMAT_PNG = "PNG";
    var LTextureAssetInfo = /** @class */ (function () {
        function LTextureAssetInfo(pFormat, pFileName, pAssetId) {
            this.format = pFormat;
            this.fileName = pFileName;
            this.assetId = pAssetId;
        }
        return LTextureAssetInfo;
    }());
    core.LTextureAssetInfo = LTextureAssetInfo;
    core.SHADER_DEFAULT = 'BaseShader';
    core.SHADER_BASIC_3D = 'ShaderBasic3d';
    core.SHADER_DEBUG_DRAWER_3D = 'DebugDrawer3d';
    core.SHADER_PHONG_LIGHTING_3D = 'PhongLighting3d';
    core.SHADER_SIMPLE_TEXTURE_3D = 'SimpleTexture3d';
    core.SHADER_TEXTURE_LIGHTING_3D = 'TextureLighting3d';
    var LShaderAssetInfo = /** @class */ (function () {
        function LShaderAssetInfo(shaderId, shaderClassType, vsFile, fsFile) {
            this.shaderId = shaderId;
            this.shaderClassType = shaderClassType;
            this.fileNameVs = vsFile;
            this.fileNameFs = fsFile;
        }
        return LShaderAssetInfo;
    }());
    core.LShaderAssetInfo = LShaderAssetInfo;
    var LSoundInfo = /** @class */ (function () {
        function LSoundInfo(soundId, filename) {
            this.soundId = soundId;
            this.filename = filename;
        }
        return LSoundInfo;
    }());
    core.LSoundInfo = LSoundInfo;
    core.MODEL_TYPE_COLLADA = 'dae';
    core.MODEL_TYPE_OBJ = 'obj';
    core.MODEL_TYPE_STL = 'stl';
    var LModelInfo = /** @class */ (function () {
        function LModelInfo(modelId, filename, modelType) {
            this.modelId = modelId;
            this.filename = filename;
            this.modelType = modelType;
        }
        return LModelInfo;
    }());
    core.LModelInfo = LModelInfo;
    var LTextAssetInfo = /** @class */ (function () {
        function LTextAssetInfo(textId, filename) {
            this.textId = textId;
            this.filename = filename;
        }
        return LTextAssetInfo;
    }());
    core.LTextAssetInfo = LTextAssetInfo;
})(core || (core = {}));
