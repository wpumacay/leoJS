declare namespace core {
    const FORMAT_JPG: string;
    const FORMAT_PNG: string;
    class LTextureAssetInfo {
        format: string;
        fileName: string;
        assetId: string;
        constructor(pFormat: string, pFileName: string, pAssetId: string);
    }
    const SHADER_DEFAULT: string;
    const SHADER_BASIC_3D: string;
    const SHADER_DEBUG_DRAWER_3D: string;
    const SHADER_PHONG_LIGHTING_3D: string;
    const SHADER_SIMPLE_TEXTURE_3D: string;
    const SHADER_TEXTURE_LIGHTING_3D: string;
    class LShaderAssetInfo {
        fileNameVs: string;
        fileNameFs: string;
        shaderId: string;
        shaderClassType: string;
        constructor(shaderId: string, shaderClassType: string, vsFile: string, fsFile: string);
    }
    class LSoundInfo {
        filename: string;
        soundId: string;
        constructor(soundId: string, filename: string);
    }
    const MODEL_TYPE_COLLADA: string;
    const MODEL_TYPE_OBJ: string;
    const MODEL_TYPE_STL: string;
    class LModelInfo {
        modelId: string;
        filename: string;
        modelType: string;
        constructor(modelId: string, filename: string, modelType: string);
    }
    class LTextAssetInfo {
        textId: string;
        filename: string;
        constructor(textId: string, filename: string);
    }
}
/// <reference path="LCommon.d.ts" />
declare namespace assets {
    const Textures: core.LTextureAssetInfo[];
    const Shaders: core.LShaderAssetInfo[];
    const Sounds: string[];
    const Models: core.LModelInfo[];
    const TextAssets: core.LTextAssetInfo[];
}
declare namespace core {
    class LVec2 {
        x: number;
        y: number;
        constructor(x: number, y: number);
        clone(): LVec2;
        static arrayToBuffer(arrayOfVec2: LVec2[]): Float32Array;
        static createDefaultArray(size: number): LVec2[];
    }
    class LVec3 {
        x: number;
        y: number;
        z: number;
        constructor(x: number, y: number, z: number);
        clone(): LVec3;
        add(other: LVec3): void;
        subs(other: LVec3): void;
        scale(sx: number, sy: number, sz: number): void;
        length(): number;
        static createDefaultArray(size: number): LVec3[];
        static copy(outVec: LVec3, inVec: LVec3): void;
        static plus(v1: LVec3, v2: LVec3): LVec3;
        static minus(v1: LVec3, v2: LVec3): LVec3;
        static dot(v1: LVec3, v2: LVec3): number;
        static cross(v1: LVec3, v2: LVec3): LVec3;
        static normalize(v: LVec3): LVec3;
        static flip(v: LVec3): LVec3;
        static arrayToBuffer(arrayOfVec3: Array<LVec3>): Float32Array;
    }
    class LVec4 {
        x: number;
        y: number;
        z: number;
        w: number;
        constructor(x: number, y: number, z: number, w: number);
    }
    class LMat4 {
        buff: Float32Array;
        constructor();
        set(row: number, col: number, val: number): void;
        get(row: number, col: number): number;
        static setToIdentity(outMat: LMat4): void;
        static fromBufferInPlace(outMat: LMat4, data: number[], isColumnMajor: boolean): void;
        static fromBuffer(data: number[], isColumnMajor: boolean): LMat4;
        static copy(outMat: LMat4, inMat: LMat4): void;
        static dot(mat1: LMat4, mat2: LMat4): LMat4;
        static translationInPlace(outMat: LMat4, t: LVec3): void;
        static translation(t: LVec3): LMat4;
        static rotationX(ang: number): LMat4;
        static rotationY(ang: number): LMat4;
        static rotationZ(ang: number): LMat4;
        static rotationAroundAxisInPlace(outMat: LMat4, axis: LVec3, angle: number): void;
        static rotationAroundAxis(axis: LVec3, angle: number): LMat4;
        static translationAlongAxisInPlace(outMat: LMat4, axis: LVec3, dist: number): void;
        static translationAlongAxis(axis: LVec3, dist: number): LMat4;
        static scale(sx: number, sy: number, sz: number): LMat4;
        static perspective(fov: number, aspect: number, zNear: number, zFar: number): LMat4;
        static ortho(width: number, height: number, zNear: number, zFar: number): LMat4;
        static fromEuler(euler: LVec3): LMat4;
        static fromEulerInPlace(outMat: LMat4, euler: LVec3): void;
        static fromPosEuler(pos: LVec3, euler: LVec3): LMat4;
        static fromPosEulerInPlace(outMat: LMat4, pos: LVec3, euler: LVec3): void;
        static fromPosRotMat(pos: LVec3, rotMat: LMat4): LMat4;
        static fromPosRotMatInPlace(outMat: LMat4, pos: LVec3, rotMat: LMat4): void;
        static fromPosRotScale(pos: LVec3, rotMat: LMat4, scale: LVec3): LMat4;
        static fromPosRotScaleInPlace(outMat: LMat4, pos: LVec3, rotMat: LMat4, scale: LVec3): void;
        static extractColumn(mat: LMat4, columnIndx: number): LVec3;
        static extractColumnInPlace(outVec: LVec3, mat: LMat4, columnIndx: number): void;
        static extractPosition(mat: LMat4): LVec3;
        static extractPositionInPlace(outVec: LVec3, mat: LMat4): void;
        static extractEulerFromRotation(mat: LMat4): LVec3;
        static extractEulerFromRotationInPlace(outVec: LVec3, mat: LMat4): void;
        static extractRotation(inMat: LMat4): LMat4;
        static extractRotationInPlace(outMat: LMat4, inMat: LMat4): void;
    }
    function transposeMat44(mat: LMat4): LMat4;
    function transposeMat44InPlace(outMat: LMat4, mat: LMat4): void;
    function inversePureRotationMat44(mat: LMat4): LMat4;
    function inversePureRotationMat44InPlace(outMat: LMat4, mat: LMat4): void;
    function inverseRigidBodyTransformMat44(mat: LMat4): LMat4;
    function inverseRigidBodyTransformMat44InPlace(outMat: LMat4, mat: LMat4): void;
    function inverseMat44(mat: LMat4): LMat4;
    function inverseMat44InPlace(outMat: LMat4, mat: LMat4): void;
    function mulMatVec44(mat: LMat4, vec: LVec4): LVec4;
    function mulMatMat44(mat1: LMat4, mat2: LMat4): LMat4;
    function mulMatMat44InPlace(outMat: LMat4, mat1: LMat4, mat2: LMat4): void;
    function degrees(rads: number): number;
    function radians(deg: number): number;
    class LInd3 {
        buff: Uint16Array;
        constructor(i1: number, i2: number, i3: number);
        static arrayToBuffer(arrayOfInd3: Array<LInd3>): Uint16Array;
    }
    const WORLD_UP: LVec3;
    const AXIS_X: LVec3;
    const AXIS_Y: LVec3;
    const AXIS_Z: LVec3;
    const AXIS_NEG_X: LVec3;
    const AXIS_NEG_Y: LVec3;
    const AXIS_NEG_Z: LVec3;
    const ROT_X_90: LMat4;
    const ROT_Y_90: LMat4;
    const ROT_Z_90: LMat4;
    const ROT_X_NEG_90: LMat4;
    const ROT_Y_NEG_90: LMat4;
    const ROT_Z_NEG_90: LMat4;
    const ROT_X_180: LMat4;
    const ROT_Y_180: LMat4;
    const ROT_Z_180: LMat4;
    const ROT_X_NEG_180: LMat4;
    const ROT_Y_NEG_180: LMat4;
    const ROT_Z_NEG_180: LMat4;
    const RED: LVec3;
    const GREEN: LVec3;
    const BLUE: LVec3;
    const CYAN: LVec3;
    const MAGENTA: LVec3;
    const YELLOW: LVec3;
    const GRAY: LVec3;
    const LIGHT_GRAY: LVec3;
    const DEFAULT_AMBIENT: LVec3;
    const DEFAULT_DIFFUSE: LVec3;
    const DEFAULT_SPECULAR: LVec3;
    const DEFAULT_SHININESS: number;
    const ORIGIN: LVec3;
    const ZERO: LVec3;
}
declare var canvas: HTMLCanvasElement;
declare var gl: WebGLRenderingContext;
/// <reference path="../../Globals.d.ts" />
declare namespace core {
    class LVertexBuffer {
        private m_bufferObj;
        private m_usage;
        private m_componentCount;
        private m_attribIndex;
        /**
        *   Abstraction of a vertexbuffer object.
        *
        *   @class LVertexBuffer
        *   @constructor
        *   @param {Number} componentCount Number of float that represent a vertex attribute
        *   @param {Float32Array} data Memory buffer of floats
        *   @param {Number} attribIndex Attribute
        */
        constructor(usage: number, componentCount: number, data: Float32Array, attribIndex: number);
        /**
        *   Release resources method.
        *
        *   @method release
        */
        release(): void;
        /**
        *   Bind this object's vbo data.
        *
        *   @method bind
        */
        bind(): void;
        /**
        *   Unbind this object's vbo data.
        *
        *   @method unbind
        */
        unbind(): void;
        /**
        *   Updated the buffer with new data ( best if usage is dynamic or stream )
        *
        *   @method updateData
        */
        updateData(data: Float32Array): void;
        /**
        *   Gets the number of float that represent an attribute in this buffer
        *
        *   @method getComponentCount
        */
        getComponentCount(): number;
        /**
        *   Gets the index of the attribute it represents
        *
        *   @method getComponentCount
        */
        getAttribIndex(): number;
        /**
        *   Gets the reference to the inner vbo
        *
        *   @method getVBO
        */
        getVBO(): WebGLBuffer;
    }
}
/// <reference path="../../Globals.d.ts" />
declare namespace core {
    class LIndexBuffer {
        private m_bufferObj;
        private m_count;
        constructor(count: number, data: Uint16Array);
        release(): void;
        bind(): void;
        unbind(): void;
        getCount(): number;
    }
}
/// <reference path="../../LCommon.d.ts" />
/// <reference path="../../Globals.d.ts" />
declare namespace core {
    class LTexture {
        private m_textureObj;
        private m_textureIndx;
        private m_width;
        private m_height;
        private m_texAssetInfo;
        constructor();
        setTexAssetInfo(assetInfo: LTextureAssetInfo): void;
        getTexAssetInfo(): LTextureAssetInfo;
        setData(data: ImageBitmap | ImageData | HTMLVideoElement | HTMLImageElement | HTMLCanvasElement, format: number): void;
        width(): number;
        height(): number;
        setTextureIndx(textureIndx: number): void;
        getTextureIndx(): number;
        bind(): void;
        unbind(): void;
    }
}
/// <reference path="../math/LMath.d.ts" />
/// <reference path="../../Globals.d.ts" />
declare namespace core {
    class LShader {
        protected m_obj: WebGLProgram;
        constructor(obj: WebGLProgram);
        setObj(obj: WebGLProgram): void;
        getObj(): WebGLProgram;
        release(): void;
        bind(): void;
        unbind(): void;
        setInt(uName: string, val: number): void;
        setFloat(uName: string, val: number): void;
        setVec2(uName: string, v: LVec2): void;
        setVec3(uName: string, v: LVec3): void;
        setVec4(uName: string, v: LVec4): void;
        setMat4(uName: string, mat: LMat4): void;
        protected _setInt(unifLoc: WebGLUniformLocation, val: number): void;
        protected _setFloat(unifLoc: WebGLUniformLocation, val: number): void;
        protected _setVec2(unifLoc: WebGLUniformLocation, v: LVec2): void;
        protected _setVec3(unifLoc: WebGLUniformLocation, v: LVec3): void;
        protected _setVec4(unifLoc: WebGLUniformLocation, v: LVec4): void;
        protected _setMat4(unifLoc: WebGLUniformLocation, mat: LMat4): void;
    }
}
/// <reference path="../../core/shader/LShader.d.ts" />
declare namespace engine3d {
    class LShaderBasic3d extends core.LShader {
        private m_uModel;
        private m_uView;
        private m_uProj;
        private m_uColor;
        constructor(obj: WebGLProgram);
        setMatModel(matModel: core.LMat4): void;
        setMatView(matView: core.LMat4): void;
        setMatProj(matProj: core.LMat4): void;
        setColor(vecColor: core.LVec3): void;
    }
}
/// <reference path="../math/LMath.d.ts" />
declare namespace core {
    class LBaseMaterial {
        color: LVec3;
        protected m_type: string;
        constructor(color: LVec3);
        release(): void;
        bind(): void;
        unbind(): void;
        type(): string;
    }
}
/// <reference path="../../core/material/LBaseMaterial.d.ts" />
declare namespace engine3d {
    class LMaterial3d extends core.LBaseMaterial {
        constructor(color: core.LVec3);
        static staticType(): string;
    }
}
/// <reference path="LMaterial3d.d.ts" />
declare namespace engine3d {
    class LPhongMaterial extends LMaterial3d {
        ambient: core.LVec3;
        diffuse: core.LVec3;
        specular: core.LVec3;
        shininess: number;
        constructor(ambient: core.LVec3, diffuse: core.LVec3, specular: core.LVec3, shininess: number);
        release(): void;
        static staticType(): string;
    }
}
/// <reference path="../math/LMath.d.ts" />
declare namespace core {
    class LBaseLight {
        color: LVec3;
        protected m_type: string;
        constructor(color: LVec3);
        type(): string;
    }
}
/// <reference path="../../core/lights/LBaseLight.d.ts" />
declare namespace engine3d {
    class LLight3d extends core.LBaseLight {
        ambient: core.LVec3;
        diffuse: core.LVec3;
        specular: core.LVec3;
        strength: number;
        constructor(ambient: core.LVec3, diffuse: core.LVec3, specular: core.LVec3);
        static staticType(): string;
    }
}
/// <reference path="LLight3d.d.ts" />
declare namespace engine3d {
    class LDirectionalLight extends LLight3d {
        private m_direction;
        constructor(direction: core.LVec3, ambient: core.LVec3, diffuse: core.LVec3, specular: core.LVec3);
        setDirection(direction: core.LVec3): void;
        getDirection(): core.LVec3;
        static staticType(): string;
    }
}
/// <reference path="LLight3d.d.ts" />
declare namespace engine3d {
    class LPointLight extends LLight3d {
        private m_position;
        constructor(position: core.LVec3, ambient: core.LVec3, diffuse: core.LVec3, specular: core.LVec3);
        setPosition(position: core.LVec3): void;
        getPosition(): core.LVec3;
        static staticType(): string;
    }
}
/// <reference path="../../core/shader/LShader.d.ts" />
/// <reference path="../material/LPhongMaterial.d.ts" />
/// <reference path="../lights/LDirectionalLight.d.ts" />
/// <reference path="../lights/LPointLight.d.ts" />
declare namespace engine3d {
    class LShaderPhongLighting extends core.LShader {
        private m_uModel;
        private m_uView;
        private m_uProj;
        private m_uViewPos;
        private m_uLightsDirectional;
        private m_uLightsPoint;
        private m_uMaterial;
        private m_uNumLightsDirectional;
        private m_uNumLightsPoint;
        constructor(obj: WebGLProgram);
        bind(): void;
        setMatModel(matModel: core.LMat4): void;
        setMatView(matView: core.LMat4): void;
        setMatProj(matProj: core.LMat4): void;
        setViewPos(pos: core.LVec3): void;
        setNumDirectionalLights(numDirLights: number): void;
        setNumPointLights(numPointLights: number): void;
        setMaterial(material: LPhongMaterial | LMaterial3d): void;
        setLightDirectional(light: LDirectionalLight, lightIndx: number): void;
        setLightPoint(light: LPointLight, lightIndx: number): void;
    }
}
/// <reference path="../../core/shader/LShader.d.ts" />
declare namespace engine3d {
    class LShaderDebugDrawer3d extends core.LShader {
        private m_uView;
        private m_uProj;
        constructor(obj: WebGLProgram);
        setMatView(matView: core.LMat4): void;
        setMatProj(matProj: core.LMat4): void;
    }
}
/// <reference path="../../core/shader/LShader.d.ts" />
/// <reference path="../../core/data/LTexture.d.ts" />
declare namespace engine3d {
    class LShaderSimpleTexture extends core.LShader {
        private m_uModel;
        private m_uView;
        private m_uProj;
        private m_uTexture;
        constructor(obj: WebGLProgram);
        setMatModel(matModel: core.LMat4): void;
        setMatView(matView: core.LMat4): void;
        setMatProj(matProj: core.LMat4): void;
        setTexture(texture: core.LTexture): void;
    }
}
/// <reference path="LMaterial3d.d.ts" />
/// <reference path="../../core/data/LTexture.d.ts" />
declare namespace engine3d {
    class LTexturedMaterial extends LMaterial3d {
        private m_diffuseMap;
        specular: core.LVec3;
        shininess: number;
        constructor(diffuseMap: core.LTexture, specular: core.LVec3, shininess: number);
        bind(): void;
        getTexture(): core.LTexture;
        unbind(): void;
        static staticType(): string;
    }
}
/// <reference path="../../core/shader/LShader.d.ts" />
/// <reference path="../material/LTexturedMaterial.d.ts" />
/// <reference path="../lights/LDirectionalLight.d.ts" />
/// <reference path="../lights/LPointLight.d.ts" />
/// <reference path="../../core/data/LTexture.d.ts" />
declare namespace engine3d {
    class LShaderTextureLighting extends core.LShader {
        private m_uModel;
        private m_uView;
        private m_uProj;
        private m_uViewPos;
        private m_uLightsDirectional;
        private m_uLightsPoint;
        private m_uMaterial;
        private m_uNumLightsDirectional;
        private m_uNumLightsPoint;
        constructor(obj: WebGLProgram);
        bind(): void;
        setMatModel(matModel: core.LMat4): void;
        setMatView(matView: core.LMat4): void;
        setMatProj(matProj: core.LMat4): void;
        setViewPos(pos: core.LVec3): void;
        setNumDirectionalLights(numDirLights: number): void;
        setNumPointLights(numPointLights: number): void;
        setMaterial(material: LTexturedMaterial): void;
        setLightDirectional(light: LDirectionalLight, lightIndx: number): void;
        setLightPoint(light: LPointLight, lightIndx: number): void;
    }
}
/// <reference path="../../Globals.d.ts" />
/// <reference path="../../engine3d/shaders/LShaderBasic3d.d.ts" />
/// <reference path="../../engine3d/shaders/LShaderPhongLighting.d.ts" />
/// <reference path="../../engine3d/shaders/LShaderDebugDrawer3d.d.ts" />
/// <reference path="../../engine3d/shaders/LShaderSimpleTexture.d.ts" />
/// <reference path="../../engine3d/shaders/LShaderTextureLighting.d.ts" />
/// <reference path="../shader/LShader.d.ts" />
declare namespace core {
    class LShaderData {
        vertexShaderCode: string;
        fragmentShaderCode: string;
        shaderClassType: string;
        loaded: boolean;
        constructor(shaderClassType: string);
    }
    class LShadersManager {
        private m_programs;
        private m_shaderData;
        private m_batchLoadedCallback;
        private m_isWorking;
        constructor();
        getShader(shaderId: string): LShader;
        loadBatch(shadersInfo: LShaderAssetInfo[], callback: Function): void;
        private _loadShader;
        update(): void;
        generateShader(shaderData: LShaderData): LShader;
        compileShader(type: number, code: string): WebGLShader;
        fromSource(vsCode: string, fsCode: string): WebGLProgram;
        fromFile(vs: string, fs: string): WebGLProgram;
    }
}
/// <reference path="../../Globals.d.ts" />
/// <reference path="../../LCommon.d.ts" />
/// <reference path="../data/LTexture.d.ts" />
declare namespace core {
    class LTexturesManager {
        private m_textures;
        private m_batchLoadedCallback;
        private m_numTexturesToLoad;
        private m_numTexturesLoaded;
        private m_isWorking;
        constructor();
        loadBatch(imgsInfo: LTextureAssetInfo[], callback: Function): void;
        private _loadImage;
        getTexture(textureId: string): LTexture;
        update(): void;
    }
}
/// <reference path="../../Globals.d.ts" />
/// <reference path="../../LCommon.d.ts" />
/// <reference path="../math/LMath.d.ts" />
declare namespace core {
    class LModelGeometryInfo {
        vertices: LVec3[];
        normals: LVec3[];
        texCoords: LVec2[];
        indices: LInd3[];
        wasParsedCorrectly: boolean;
        constructor();
    }
    class LModelMaterialInfo {
        type: string;
        properties: {
            [id: string]: any;
        };
        wasParsedCorrectly: boolean;
        constructor();
    }
    class LModelConstructInfo {
        geometryInfo: LModelGeometryInfo;
        materialInfo: LModelMaterialInfo;
        correctionMat: LMat4;
        wasParsedCorrectly: boolean;
        constructor();
    }
}
declare namespace core {
    const BUFFER_USAGE_POSITION: string;
    const BUFFER_USAGE_VERTEX: string;
    const BUFFER_USAGE_NORMAL: string;
    const BUFFER_USAGE_TEXCOORD: string;
    const BUFFER_USAGE_COLOR: string;
    class LColladaVertexBuffer {
        size: number;
        count: number;
        data: Float32Array;
        usage: string;
        offset: number;
        children: LColladaVertexBuffer[];
        constructor();
    }
    class LColladaIndexBuffer {
        size: number;
        count: number;
        data: Uint16Array;
        constructor();
    }
    class LColladaGeometry {
        buffers: {
            [id: string]: LColladaVertexBuffer;
        };
        layout: LColladaVertexBuffer[][];
        positionsBuffer: LColladaVertexBuffer;
        normalsBuffer: LColladaVertexBuffer;
        texCoordsBuffer: LColladaVertexBuffer;
        colorBuffer: LColladaVertexBuffer;
        offsetInGlobalBuffer: number;
        faces: LColladaIndexBuffer;
        scale: number;
        isOk: boolean;
        constructor();
    }
    enum UpAxis {
        X = "X_UP",
        Y = "Y_UP",
        Z = "Z_UP"
    }
    class LColladaModelProperties {
        scale: number;
        correctionMatrix: LMat4;
        upAxis: UpAxis;
        constructor();
    }
}
/// <reference path="LModelCommon.d.ts" />
/// <reference path="LColladaCommon.d.ts" />
declare namespace core {
    class LColladaParser {
        constructor();
        parseModel(rootModelElement: HTMLElement): LModelConstructInfo;
        private _parseModelAssetProperties;
        private _parseGeometries;
        private _parseSingleGeometry;
        private _parseBuffers;
        private _parseBuffersUsageAndLayout;
        private _parseBuffersLayout;
        private _parseBuffersUsage;
        private _parseFaces;
        private _parseFacesTriangles;
        private _parseFacesTrianglesByLayout;
        private _buildFaceTriIndex;
        private _parseFacesPolylist;
        private _parseFacesPolylistByLayout;
        private _getBufferByUsage;
        private _buildConstructionInfo;
        private _getPositionBuffer;
        private _getNormalBuffer;
        private _getTexCoordBuffer;
        private _appendBufferIntoVec3Array;
        private _appendBufferIntoVec2Array;
        private _compensateIndices;
        private _appendBufferIntoInd3Array;
    }
}
/// <reference path="LColladaParser.d.ts" />
declare namespace core {
    class LModelsManager {
        private m_models;
        private m_batchLoadedCallback;
        private m_isWorking;
        private m_xmlParser;
        private m_colladaParser;
        constructor();
        getModel(modelId: string): LModelConstructInfo;
        loadBatch(modelsInfo: LModelInfo[], callback: Function): void;
        private _loadModel;
        parseModelFile(strModel: string, modelType: string): LModelConstructInfo;
        private _parseColladaModel;
        private _parseObjModel;
        update(): void;
    }
}
/// <reference path="../../Globals.d.ts" />
/// <reference path="../../LCommon.d.ts" />
declare namespace core {
    class LTextAssetsManager {
        private m_textAssets;
        private m_batchLoadedCallback;
        private m_isWorking;
        constructor();
        getTextAsset(textId: string): string;
        loadBatch(textAssetsInfo: LTextAssetInfo[], callback: Function): void;
        private _loadTextAsset;
        update(): void;
    }
}
/// <reference path="../../Globals.d.ts" />
/// <reference path="LTexturesManager.d.ts" />
/// <reference path="LShadersManager.d.ts" />
/// <reference path="LModelsManager.d.ts" />
/// <reference path="LTextAssetsManager.d.ts" />
declare namespace core {
    class LAssetsManager {
        static INSTANCE: LAssetsManager;
        private m_texturesManager;
        private m_shadersManager;
        private m_modelsManager;
        private m_textAssetsManager;
        constructor();
        static create(): LAssetsManager;
        static release(): void;
        update(): void;
        loadTextures(imgsInfo: LTextureAssetInfo[], texturesCallback: Function): void;
        getTexture(textureId: string): LTexture;
        loadShaders(shadersInfo: LShaderAssetInfo[], shadersCallback: Function): void;
        getShader(shaderId: string): LShader;
        loadModels(modelsInfo: LModelInfo[], modelsCallback: Function): void;
        getModel(modelId: string): LModelConstructInfo;
        loadTextAssets(textAssetsInfo: LTextAssetInfo[], textAssetsCallback: Function): void;
        getTextAsset(textId: string): string;
    }
}
/// <reference path="../math/LMath.d.ts" />
/// <reference path="../data/LVertexBuffer.d.ts" />
/// <reference path="../data/LIndexBuffer.d.ts" />
declare namespace core {
    class LBaseGeometry {
        protected m_ibo: LIndexBuffer;
        protected m_vbos: LVertexBuffer[];
        constructor();
        release(): void;
        /**
        *    Creates and adds a new VBO object with the given data
        *    @method addVbo
        */
        addVbo(componentCount: number, data: Float32Array, attribIndx: number): void;
        /**
        *    Create a new IBO object with the given properties
        *    @method setIbo
        */
        setIbo(indicesCount: number, data: Uint16Array): void;
        /**
        *    Get number of indices in IBO buffer
        *    @method getIndexCount
        */
        getIndexCount(): number;
        /**
        *    Bind all data in this geometry
        *    @method bind
        */
        bind(): void;
        /**
        *    Unbind all data in this geometry
        *    @method unbind
        */
        unbind(): void;
    }
}
declare namespace core {
    class LIRenderable {
        protected m_type: string;
        protected m_isVisible: boolean;
        protected m_deletionRequested: boolean;
        constructor();
        release(): void;
        update(): void;
        render(): void;
        type(): string;
        isVisible(): boolean;
        setVisibility(visibility: boolean): void;
        requestDeletion(): void;
        isDeletionRequested(): boolean;
    }
}
/// <reference path="../math/LMath.d.ts" />
/// <reference path="../data/LVertexBuffer.d.ts" />
/// <reference path="../data/LIndexBuffer.d.ts" />
/// <reference path="../material/LBaseMaterial.d.ts" />
/// <reference path="../geometry/LBaseGeometry.d.ts" />
/// <reference path="LIRenderable.d.ts" />
declare namespace core {
    class LBaseMesh extends LIRenderable {
        protected m_material: LBaseMaterial;
        protected m_geometry: LBaseGeometry;
        constructor();
        update(): void;
        render(): void;
        getGeometry(): LBaseGeometry;
        getMaterial(): LBaseMaterial;
    }
}
/// <reference path="../math/LMath.d.ts" />
/// <reference path="../../Globals.d.ts" />
declare namespace core {
    enum ProjectionMode {
        PERSPECTIVE = 0,
        ORTHOGRAPHIC = 1
    }
    class LBaseCamera {
        protected m_pos: LVec3;
        protected m_worldUp: LVec3;
        protected m_front: LVec3;
        protected m_up: LVec3;
        protected m_right: LVec3;
        protected m_fov: number;
        protected m_aspectRatio: number;
        protected m_zNear: number;
        protected m_zFar: number;
        protected m_type: string;
        protected m_id: string;
        protected m_viewMat: LMat4;
        protected m_projMat: LMat4;
        protected m_projMode: ProjectionMode;
        protected m_viewportWidth: number;
        protected m_viewportHeight: number;
        constructor(pos: LVec3, worldUp: LVec3, width: number, height: number, zNear: number, zFar: number, fov: number, projMode: ProjectionMode, type: string, id: string);
        protected _updateSystem(): void;
        update(dt: number): void;
        setProjMode(projMode: ProjectionMode): void;
        /**
        *   Build the view matrix based on "calculated" ...
        *   ( should calculate yourself in each camera implementation ) ...
        *   camera vectors ( right-x, up-y, front-z )
        *
        *   @method _buildViewMatrix
        */
        protected _buildViewMatrix(): void;
        getStaticType(): string;
        getType(): string;
        getId(): string;
        setPosition(pos: LVec3): void;
        getPosition(): LVec3;
        getFov(): number;
        getZNear(): number;
        getZFar(): number;
        getViewMatrix(): LMat4;
        getProjectionMatrix(): LMat4;
        onResize(appWidth: number, appHeight: number): void;
    }
}
/// <reference path="../graphics/LIRenderable.d.ts" />
/// <reference path="../camera/LBaseCamera.d.ts" />
/// <reference path="../lights/LBaseLight.d.ts" />
declare namespace core {
    class LScene {
        private m_renderables;
        private m_cameras;
        private m_currentCamera;
        private m_lights;
        private m_id;
        constructor(sceneId: string);
        addRenderable(renderable: LIRenderable): void;
        getRenderables(): LIRenderable[];
        addCamera(camera: LBaseCamera): void;
        changeToCamera(id: string): void;
        getCameraById(id: string): LBaseCamera;
        getCurrentCamera(): LBaseCamera;
        addLight(light: LBaseLight): void;
        getLights(type: string): LBaseLight[];
        update(dt: number): void;
        onResize(appWidth: number, appHeight: number): void;
        id(): string;
    }
}
/// <reference path="../../core/geometry/LBaseGeometry.d.ts" />
declare namespace engine3d {
    class LGeometry3d extends core.LBaseGeometry {
        constructor(vertices: core.LVec3[], normals: core.LVec3[], texCoords: core.LVec2[], indices: core.LInd3[]);
    }
}
/// <reference path="LGeometry3d.d.ts" />
declare namespace engine3d {
    class LGeometryBuilder {
        static createSphere(radius: number, levelDivision: number, numLevels: number): LGeometry3d;
        static createBox(width: number, height: number, depth: number): LGeometry3d;
        static createCylinder(radius: number, height: number, sectionDivision: number): LGeometry3d;
        static createCone(radius: number, height: number, sectionDivision: number): LGeometry3d;
        static createArrow(length: number): LGeometry3d;
        static createCapsule(radius: number, height: number, sectionDivision: number, capLevels: number): LGeometry3d;
        static createPlane(width: number, depth: number, texRangeWidth?: number, texRangeDepth?: number): LGeometry3d;
        static createFromObj(filename: string): LGeometry3d;
    }
}
/// <reference path="../../core/graphics/LBaseMesh.d.ts" />
/// <reference path="../geometry/LGeometry3d.d.ts" />
/// <reference path="../material/LMaterial3d.d.ts" />
declare namespace engine3d {
    const RENDERABLE_TYPE_MESH_3D: string;
    class LMesh extends core.LBaseMesh {
        protected m_pos: core.LVec3;
        protected m_rotEuler: core.LVec3;
        protected m_rotMat: core.LMat4;
        protected m_scale: core.LVec3;
        protected m_calcMat: core.LMat4;
        protected m_modelCompensation: core.LMat4;
        protected m_modelMatrix: core.LMat4;
        protected m_isWireframe: boolean;
        constructor(geometry: LGeometry3d, material: LMaterial3d, modelCompensation?: core.LMat4);
        release(): void;
        setRotEuler(euler: core.LVec3): void;
        setRotEulerX(eulerX: number): void;
        setRotEulerY(eulerY: number): void;
        setRotEulerZ(eulerZ: number): void;
        getRotEuler(): core.LVec3;
        getRotEulerX(): number;
        getRotEulerY(): number;
        getRotEulerZ(): number;
        setRotMat(mat: core.LMat4): void;
        getRotMat(): core.LMat4;
        setPos(pos: core.LVec3): void;
        setPosX(x: number): void;
        setPosY(y: number): void;
        setPosZ(z: number): void;
        getPos(): core.LVec3;
        getPosX(): number;
        getPosY(): number;
        getPosZ(): number;
        setScale(scale: core.LVec3): void;
        getScale(): core.LVec3;
        setWorldTransform(mat: core.LMat4): void;
        protected _updateModelMatrix(): void;
        getModelMatrix(): core.LMat4;
        update(): void;
    }
}
/// <reference path="../../core/camera/LBaseCamera.d.ts" />
declare namespace engine3d {
    class LFixedPointCamera extends core.LBaseCamera {
        private m_targetPoint;
        constructor(pos: core.LVec3, targetPoint: core.LVec3, worldUp: core.LVec3, width: number, height: number, zNear: number, zFar: number, fov: number, projMode: core.ProjectionMode, id: string);
        setTargetPoint(targetPoint: core.LVec3): void;
        protected _updateSystem(): void;
        static GetStaticType(): string;
    }
}
/// <reference path="../../core/camera/LBaseCamera.d.ts" />
declare namespace engine3d {
    class LFixedDirectionCamera extends core.LBaseCamera {
        private m_targetDir;
        constructor(pos: core.LVec3, targetDir: core.LVec3, worldUp: core.LVec3, width: number, height: number, zNear: number, zFar: number, fov: number, projMode: core.ProjectionMode, id: string);
        setTargetDir(targetDir: core.LVec3): void;
        protected _updateSystem(): void;
        static GetStaticType(): string;
    }
}
/// <reference path="math/LMath.d.ts" />
declare namespace core {
    const KEY_W: number;
    const KEY_A: number;
    const KEY_S: number;
    const KEY_D: number;
    const KEY_UP: number;
    const KEY_DOWN: number;
    const KEY_LEFT: number;
    const KEY_RIGHT: number;
    const KEY_SPACE: number;
    const KEY_ESCAPE: number;
    const KEY_ENTER: number;
    const MAX_KEYS: number;
    const MOUSE_LEFT: number;
    const MOUSE_WHEEL: number;
    const MOUSE_RIGHT: number;
    const MOUSE_UP: number;
    const MOUSE_DOWN: number;
    const WHEEL_ACUM_RATIO: number;
    class LInputHandler {
        private static INSTANCE;
        private m_canvas;
        private m_cursor;
        private m_mouseStates;
        private m_isMouseDown;
        private m_keys;
        private m_wheelDelta;
        private m_wheelAcumValue;
        private m_mouseDownCallback;
        private m_mouseUpCallback;
        private m_mouseMoveCallback;
        constructor(canvas: HTMLCanvasElement);
        private _registerEvents;
        private _isKeyPressed;
        static init(canvas: HTMLCanvasElement): void;
        static wheelAcumValue(): number;
        static cursorXY(): LVec2;
        static isKeyPressed(keyId: number): boolean;
        static isMouseDown(): boolean;
        static isMouseButtonDown(buttonId: number): boolean;
        static isMouseButtonUp(buttonId: number): boolean;
        /**
        * Event callbacks
        */
        static onKeyDown(ev: KeyboardEvent): void;
        static onKeyUp(ev: KeyboardEvent): void;
        static onWheelEvent(ev: WheelEvent): void;
        static onMouseDown(ev: MouseEvent): void;
        static onMouseUp(ev: MouseEvent): void;
        static onMouseMove(ev: MouseEvent): void;
    }
}
/// <reference path="../../core/camera/LBaseCamera.d.ts" />
/// <reference path="../../core/LInputHandler.d.ts" />
declare namespace engine3d {
    enum OrbitCameraState {
        IDLE = 0,
        DRAGGING = 1,
        MOVING_TARGET = 2
    }
    class LOrbitCamera extends core.LBaseCamera {
        private m_rho;
        private m_theta;
        private m_phi;
        private m_rho0;
        private m_theta0;
        private m_phi0;
        private m_r;
        private m_targetPoint;
        private m_startTargetPoint;
        private m_camState;
        private m_mouseCurrentXY;
        private m_mouseStartXY;
        constructor(pos: core.LVec3, targetPoint: core.LVec3, worldUp: core.LVec3, width: number, height: number, zNear: number, zFar: number, fov: number, projMode: core.ProjectionMode, id: string);
        private _computeSphericalsFromPosition;
        private _computePositionFromSphericals;
        setTargetPoint(targetPoint: core.LVec3): void;
        getTargetPoint(): core.LVec3;
        rho(): number;
        phi(): number;
        theta(): number;
        protected _updateSystem(): void;
        static GetStaticType(): string;
        update(dt: number): void;
    }
}
/// <reference path="../../core/math/LMath.d.ts" />
/// <reference path="../../core/data/LVertexBuffer.d.ts" />
/// <reference path="../../core/assets/LAssetsManager.d.ts" />
declare namespace engine3d {
    class LDebugDrawer {
        static INSTANCE: LDebugDrawer;
        private m_linesRenderBufferPositions;
        private m_linesRenderBufferColors;
        private m_linesPositions;
        private m_linesColors;
        private m_linesPositionsVBO;
        private m_linesColorsVBO;
        private m_shaderLinesRef;
        private m_viewMat;
        private m_projMat;
        constructor();
        static create(): LDebugDrawer;
        static release(): void;
        drawLine(start: core.LVec3, end: core.LVec3, color: core.LVec3): void;
        drawArrow(start: core.LVec3, end: core.LVec3, color: core.LVec3): void;
        drawFrame(frameMat: core.LMat4, axisSize: number): void;
        setupMatrices(viewMatrix: core.LMat4, projMatrix: core.LMat4): void;
        render(): void;
        private _renderLines;
        private _renderLinesBatch;
    }
}
/// <reference path="../../core/math/LMath.d.ts" />
/// <reference path="LDebugDrawer.d.ts" />
declare namespace engine3d {
    namespace DebugSystem {
        function init(): void;
        function drawLine(start: core.LVec3, end: core.LVec3, color: core.LVec3): void;
        function drawArrow(start: core.LVec3, end: core.LVec3, color: core.LVec3): void;
        function drawFrame(frameMat: core.LMat4, axisSize: number): void;
        function begin(viewMatrix: core.LMat4, projMatrix: core.LMat4): void;
        function render(): void;
        function release(): void;
    }
}
/// <reference path="LMesh.d.ts" />
declare namespace engine3d {
    const RENDERABLE_TYPE_MODEL: string;
    class LModel extends LMesh {
        constructor(geometry: LGeometry3d, material: LMaterial3d, compensationMat: core.LMat4);
        protected _updateModelMatrix(): void;
    }
}
/// <reference path="../graphics/LMesh.d.ts" />
/// <reference path="../graphics/LModel.d.ts" />
/// <reference path="../../core/scene/LScene.d.ts" />
/// <reference path="../../core/assets/LAssetsManager.d.ts" />
declare namespace engine3d {
    class LMeshRenderer {
        private m_texturedMeshes;
        private m_nonTexturedMeshes;
        private m_isLightingEnabled;
        constructor();
        setLightingMode(lightingMode: boolean): void;
        isLightingEnabled(): boolean;
        begin(meshes: LMesh[]): void;
        render(scene: core.LScene): void;
        private _renderWithLighting;
        private _renderNoLighting;
        end(): void;
    }
}
/// <reference path="../math/LMath.d.ts" />
/// <reference path="../scene/LScene.d.ts" />
/// <reference path="../../engine3d/renderers/LMeshRenderer.d.ts" />
declare namespace core {
    class LMasterRenderer {
        private m_meshes;
        private m_meshRenderer;
        constructor();
        begin(scene: LScene): void;
        render(scene: LScene): void;
        end(): void;
    }
}
/// <reference path="../LCommon.d.ts" />
declare namespace core {
    class LApplicationData {
        assets: LTextureAssetInfo[];
        shaders: LShaderAssetInfo[];
        models: LModelInfo[];
        textAssets: LTextAssetInfo[];
        constructor(assetsList: LTextureAssetInfo[], shadersList: LShaderAssetInfo[], modelsList: LModelInfo[], textAssetsList: LTextAssetInfo[]);
    }
}
/// <reference path="../engine3d/debug/LDebugSystem.d.ts" />
/// <reference path="assets/LAssetsManager.d.ts" />
/// <reference path="renderer/LMasterRenderer.d.ts" />
/// <reference path="scene/LScene.d.ts" />
/// <reference path="LInputHandler.d.ts" />
/// <reference path="LApplicationData.d.ts" />
declare namespace core {
    const MAX_DELTA: number;
    class LApplication {
        static INSTANCE: LApplication;
        canvas: HTMLCanvasElement;
        gl: WebGLRenderingContext;
        protected m_appWidth: number;
        protected m_appHeight: number;
        protected m_userResizeCallback: Function;
        protected m_isReady: boolean;
        protected m_currentScene: LScene;
        protected m_scenes: {
            [id: string]: LScene;
        };
        protected m_masterRenderer: LMasterRenderer;
        protected m_assetsManager: LAssetsManager;
        protected m_tNow: number;
        protected m_tBef: number;
        protected m_tDelta: number;
        private m_hasLoadedTextures;
        private m_hasLoadedShaders;
        private m_hasLoadedModels;
        private m_hasLoadedTextAssets;
        private m_initializationCallback;
        private m_updateCallback;
        constructor(canvas: HTMLCanvasElement, glContext: WebGLRenderingContext, appConfigData: LApplicationData, initializationCallback: Function, updateCallback: Function);
        protected _initialize(): void;
        addScene(scene: LScene): void;
        changeToScene(sceneId: string): void;
        getScene(sceneId: string): LScene;
        getCurrentScene(): LScene;
        addUserResizeCallback(callback: Function): void;
        onTick(): void;
        update(dt: number): void;
        render(): void;
        onResize(): void;
        onShadersLoaded(): void;
        onTexturesLoaded(): void;
        onModelsLoaded(): void;
        onTextAssetsLoaded(): void;
        isReady(): boolean;
        width(): number;
        height(): number;
    }
}
/// <reference path="../ext/cat1js/core/math/LMath.d.ts" />
declare namespace leojs {
}
/// <reference path="../RCommon.d.ts" />
/// <reference path="../components/RComponent.d.ts" />
declare namespace leojs {
    class REntity {
        position: core.LVec3;
        rotation: core.LVec3;
        deletionRequested: boolean;
        protected m_components: {
            [id: number]: RComponent;
        };
        constructor();
        release(): void;
        addComponent(component: RComponent): void;
        getComponent(componentType: number): RComponent;
        update(dt: number): void;
        setVisibility(visible: boolean): void;
    }
}
/// <reference path="../RCommon.d.ts" />
/// <reference path="../entities/REntity.d.ts" />
declare namespace leojs {
    /**
    * Simple types that the components can be part of
    */
    enum RComponentType {
        NEUTRAL = 0,
        GRAPHICS = 1,
        PHYSICS = 2
    }
    class RComponent {
        static CLASS_ID: string;
        protected m_parent: REntity;
        protected m_classId: string;
        protected m_typeId: RComponentType;
        constructor(parent: REntity);
        release(): void;
        typeId(): RComponentType;
        classId(): string;
        update(dt: number): void;
    }
}
/// <reference path="../../../ext/cat1js/core/graphics/LIRenderable.d.ts" />
/// <reference path="../RComponent.d.ts" />
declare namespace leojs {
    class RGraphicsComponent extends RComponent {
        static CLASS_ID: string;
        protected m_renderables: core.LIRenderable[];
        constructor(parent: REntity);
        release(): void;
        renderables(): core.LIRenderable[];
        update(dt: number): void;
        setVisibility(visible: boolean): void;
    }
}
/// <reference path="../../../ext/cat1js/engine3d/graphics/LMesh.d.ts" />
/// <reference path="RGraphicsComponent.d.ts" />
declare namespace leojs {
    class RMesh3dComponent extends RGraphicsComponent {
        constructor(parent: REntity, mesh3d: engine3d.LMesh);
        appendMesh(mesh: engine3d.LMesh): void;
        getMesh(indx: number): engine3d.LMesh;
        update(dt: number): void;
    }
}
/// <reference path="../../../ext/cat1js/core/assets/LAssetsManager.d.ts" />
/// <reference path="../../../ext/cat1js/engine3d/geometry/LGeometryBuilder.d.ts" />
/// <reference path="../../../ext/cat1js/engine3d/material/LMaterial3d.d.ts" />
/// <reference path="../../../ext/cat1js/engine3d/material/LPhongMaterial.d.ts" />
/// <reference path="../../../ext/cat1js/engine3d/material/LTexturedMaterial.d.ts" />
/// <reference path="../../../ext/cat1js/engine3d/graphics/LMesh.d.ts" />
declare namespace leojs {
    function buildPrimitive(geoProps: {
        [id: string]: any;
    }, matProps: {
        [id: string]: any;
    }): engine3d.LMesh;
}
/// <reference path="../../../ext/cat1js/engine3d/graphics/LMesh.d.ts" />
/// <reference path="RGraphicsComponent.d.ts" />
/// <reference path="RGraphicsFactory.d.ts" />
declare namespace leojs {
    const RF_BASE_DIM: number;
    const RF_SPHERE_RADIUS: number;
    const RF_ARROW_LENGTH: number;
    const RF_AXIS_X_INDX: number;
    const RF_AXIS_Y_INDX: number;
    const RF_AXIS_Z_INDX: number;
    const RF_CENTER_INDX: number;
    class RReferenceFrameComponent extends RGraphicsComponent {
        private m_posXYZ;
        private m_rotEuler;
        private m_rotMat;
        private m_frameMatrix;
        private m_axisX;
        private m_axisY;
        private m_axisZ;
        private m_rotArrowX;
        private m_rotArrowY;
        private m_rotArrowZ;
        /**
        * @constructor
        * @param {REntity} parent entity this component belongs to
        * @param {core.LVec3} pos frame's position
        * @param {core.LVec3} euler frame's Tait-Bryan zyx angles
        */
        constructor(parent: REntity, pos?: core.LVec3, euler?: core.LVec3);
        release(): void;
        private _initGraphics;
        private _updateGraphicsPosition;
        private _updateGraphicsOrientation;
        private _updateAxes;
        setPosition(pos: core.LVec3): void;
        setOrientation(euler: core.LVec3): void;
        setFrameMatrix(mat: core.LMat4): void;
        getFrameMatrix(): core.LMat4;
        update(dt: number): void;
    }
}
/// <reference path="RComponent.d.ts" />
declare namespace leojs {
    class RTestComponent extends RComponent {
        static CLASS_ID: string;
        constructor(parent: REntity);
        update(dt: number): void;
    }
}
/// <reference path="REntity.d.ts" />
/// <reference path="../components/graphics/RReferenceFrameComponent.d.ts" />
declare namespace leojs {
    class RTestEntity extends REntity {
        private m_testRFrame;
        constructor();
        update(dt: number): void;
    }
}
/// <reference path="../RCommon.d.ts" />
/// <reference path="../../ext/cat1js/core/scene/LScene.d.ts" />
/// <reference path="../../ext/cat1js/engine3d/camera/LFixedPointCamera.d.ts" />
/// <reference path="../../ext/cat1js/engine3d/camera/LOrbitCamera.d.ts" />
/// <reference path="../../ext/cat1js/engine3d/lights/LDirectionalLight.d.ts" />
/// <reference path="../entities/REntity.d.ts" />
declare namespace leojs {
    class RWorld {
        protected m_entities: REntity[];
        protected m_scene: core.LScene;
        protected m_appWidth: number;
        protected m_appHeight: number;
        constructor(appWidth: number, appHeight: number);
        protected _initScene(): void;
        scene(): core.LScene;
        resizeWorld(appWidth: number, appHeight: number): void;
        addEntity(entity: REntity): void;
        protected _collectRenderables(entity: REntity): void;
        update(dt: number): void;
    }
}
/// <reference path="../../ext/cat1js/core/math/LMath.d.ts" />
declare namespace leojs {
    enum JointType {
        NONE = 0,
        REVOLUTE = 1,
        PRISMATIC = 2
    }
    const DHjointTypes: JointType[];
    enum DHparams {
        alpha_i_1 = 0,
        a_i_1 = 1,
        d_i = 2,
        theta_i = 3
    }
    class RDHentry {
        private m_jointId;
        private m_fixed;
        private m_values;
        private m_transform;
        private m_jointSign;
        private m_jointOffset;
        private m_jointType;
        private m_minJointValue;
        private m_maxJointValue;
        private m_rangeJointValue;
        constructor(jointId: string, pFixed: boolean[], pValues: number[], pMinJointValue: number, pMaxJointValue: number, jointSign?: number, jointOffset?: number);
        release(): void;
        jointId(): string;
        fixed(): boolean[];
        values(): number[];
        minJointValue(): number;
        maxJointValue(): number;
        rangeJointValue(): number;
        setParamValue(value: number, indx: DHparams): void;
        getParamValue(indx: DHparams): number;
        private _updateTransform;
        getTransform(): core.LMat4;
        private _getJointType;
        getJointType(): JointType;
    }
    class RDHtable {
        private m_entries;
        private m_entriesById;
        private m_totalTransform;
        private m_xyz;
        private m_rpy;
        constructor();
        release(): void;
        appendEntry(entry: RDHentry): void;
        numJoints(): number;
        setJointValue(value: number, indx: number): void;
        validateJointValue(value: number, indx: number): number;
        getJointValue(indx: number): number;
        doesJointExist(jointId: string): boolean;
        getJointValueById(jointId: string): number;
        getMinJointValue(indx: number): number;
        getMaxJointValue(indx: number): number;
        getRangeJointValue(indx: number): number;
        getTransform(indx: number): core.LMat4;
        getTransformInRange(from: number, to: number): core.LMat4;
        private _getTotalTransform;
        entries(): RDHentry[];
        getFullTransform(): core.LMat4;
        getEndEffectorXYZ(): core.LVec3;
        getEndEffectorRPY(): core.LVec3;
        getAllJointValues(): number[];
        update(dt: number): void;
    }
}
/// <reference path="../../../ext/cat1js/engine3d/graphics/LMesh.d.ts" />
/// <reference path="../../../core/components/graphics/RGraphicsComponent.d.ts" />
/// <reference path="../../../core/components/graphics/RGraphicsFactory.d.ts" />
declare namespace leojs {
    const EF_BASE_DIM: number;
    const EF_ROOT_SIZE: number;
    const EF_GRIP_WIDTH: number;
    const EF_GRIP_HEIGHT: number;
    const EF_GRIP_DEPTH: number;
    class RDHendEffectorComponent extends RGraphicsComponent {
        private m_effRootMesh;
        private m_effLeftMesh;
        private m_effRighttMesh;
        private m_transformBase;
        private m_leftGripTotalTransform;
        private m_rightGripTotalTransform;
        private m_leftGripTotalTransformToRoot;
        private m_rightGripTotalTransformToRoot;
        constructor(parent: REntity);
        release(): void;
        private _initializeEndEffector;
        update(dt: number): void;
    }
}
/// <reference path="../../../ext/cat1js/engine3d/graphics/LMesh.d.ts" />
/// <reference path="../../../core/components/graphics/RGraphicsComponent.d.ts" />
/// <reference path="../../../core/components/graphics/RGraphicsFactory.d.ts" />
declare namespace leojs {
    class RDHjointPrismaticComponent extends RGraphicsComponent {
        private m_jointFixedMeshRef;
        private m_jointMovingMeshRef;
        private m_jointTransformBase;
        private m_jointTransformTotal;
        private m_jointValue;
        constructor(parent: REntity);
        release(): void;
        private _initializePrismaticJoint;
        setJointValue(jointValue: number): void;
        update(dt: number): void;
    }
}
/// <reference path="../../../ext/cat1js/engine3d/graphics/LMesh.d.ts" />
/// <reference path="../../../core/components/graphics/RGraphicsComponent.d.ts" />
/// <reference path="../../../core/components/graphics/RGraphicsFactory.d.ts" />
declare namespace leojs {
    class RDHjointRevoluteComponent extends RGraphicsComponent {
        private m_jointMeshRef;
        private m_jointRotMatBase;
        private m_jointRotMatTotal;
        private m_jointValue;
        constructor(parent: REntity);
        release(): void;
        private _initializeRevoluteJoint;
        setJointValue(jointValue: number): void;
        update(dt: number): void;
    }
}
/// <reference path="../../ext/cat1js/core/math/LMath.d.ts" />
declare namespace leojs {
    const RKinGeometryTypeBox: string;
    const RKinGeometryTypeCylinder: string;
    const RKinGeometryTypeSphere: string;
    const RKinGeometryTypeMesh: string;
    const RKinJointTypeFixed: string;
    const RKinJointTypeRevolute: string;
    const RKinJointTYpePrismatic: string;
    class RKinNodeGeometry {
        type: string;
        b_width: number;
        b_height: number;
        b_depth: number;
        c_radius: number;
        c_length: number;
        s_radius: number;
        m_meshId: string;
        constructor();
        static fromDict(geometryProperties: {
            [id: string]: any;
        }): RKinNodeGeometry;
    }
    class RKinNode {
        private m_id;
        private m_parentJoint;
        private m_childrenJoints;
        private m_linkTransform;
        private m_worldTransform;
        private m_localTransform;
        private m_geometry;
        constructor(nodeId: string);
        release(): void;
        initNode(lxyz: core.LVec3, lrpy: core.LVec3, geometryProperties: {
            [id: string]: any;
        }): void;
        getGeometry(): RKinNodeGeometry;
        getLocalTransform(): core.LMat4;
        getLinkTransform(): core.LMat4;
        getWorldTransform(): core.LMat4;
        getId(): string;
        getChildrenJoints(): RKinJoint[];
        getParentJoint(): RKinJoint;
        addJointConnection(joint: RKinJoint): void;
        setParentJointConnection(parentJoint: RKinJoint): void;
        updateNode(): void;
    }
    class RKinJoint {
        private m_id;
        private m_parent;
        private m_parentId;
        private m_child;
        private m_childId;
        private m_xyz;
        private m_rpy;
        private m_axis;
        private m_jointValue;
        private m_jointType;
        private m_jointBaseTransform;
        private m_jointVariableTransform;
        private m_jointTransform;
        constructor(jointId: string);
        release(): void;
        initJoint(jxyz: core.LVec3, jrpy: core.LVec3, axis: core.LVec3, type: string, parentId: string, childId: string): void;
        getParentId(): string;
        getChildId(): string;
        getId(): string;
        getParentNode(): RKinNode;
        getChildNode(): RKinNode;
        getJointTransform(): core.LMat4;
        getJointType(): string;
        getJointAxis(): core.LVec3;
        getJointXYZ(): core.LVec3;
        getJointRPY(): core.LVec3;
        connect(parentNode: RKinNode, childNode: RKinNode): void;
        setJointValue(jointValue: number): void;
        getJointValue(): number;
        updateJoint(): void;
    }
    class RKinTree {
        private m_kinNodes;
        private m_kinJoints;
        private m_rootNode;
        constructor();
        release(): void;
        setRootNode(node: RKinNode): void;
        addKinNode(node: RKinNode): void;
        addKinJoint(joint: RKinJoint): void;
        nodes(): {
            [id: string]: RKinNode;
        };
        joints(): {
            [id: string]: RKinJoint;
        };
        update(): void;
    }
}
/// <reference path="../../../ext/cat1js/engine3d/graphics/LModel.d.ts" />
/// <reference path="../../../core/components/graphics/RGraphicsComponent.d.ts" />
/// <reference path="../../../core/components/graphics/RGraphicsFactory.d.ts" />
/// <reference path="../RKinTree.d.ts" />
declare namespace leojs {
    class RDHtreeModelComponent extends RGraphicsComponent {
        private m_meshes;
        private m_kinTreeRef;
        constructor(parent: REntity, kinTree: RKinTree);
        release(): void;
        private _init;
        private _initializeLinks;
        private _createLinkFromGeometry;
        update(dt: number): void;
    }
}
declare module 'leojs/ext/dat.gui' {
	// Type definitions for dat.GUI 0.7
	// Project: https://github.com/dataarts/dat.gui
	// Definitions by: Satoru Kimura <https://github.com/gyohk>, ZongJing Lu <https://github.com/sonic3d>, Richard Roylance <https://github.com/rroylance>
	// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

	export as namespace dat;

	export interface GUIParams {
	    /**
	     * Handles GUI's element placement for you.
	     * @default true
	     */
	    autoPlace?: boolean;
	    /**
	     * If true, starts closed.
	     * @default false
	     */
	    closed?: boolean;
	    /**
	     * If true, close/open button shows on top of the GUI.
	     * @default false
	     */
	    closeOnTop?: boolean;
	    /**
	     * If true, GUI is closed by the "h" keypress.
	     * @default false
	     */
	    hideable?: boolean;
	    /**
	     * JSON object representing the saved state of this GUI.
	     */
	    load?: any;
	    /**
	     * The name of this GUI.
	     */
	    name?: string;
	    /**
	     * The identifier for a set of saved values.
	     */
	    preset?: string;
	    /**
	     * The width of GUI element.
	     */
	    width?: number;
	}

	export class GUI {
	    constructor(option?: GUIParams);

	    __controllers: GUIController[];
	    __folders: GUI[];
	    domElement: HTMLElement;

	    add(target: Object, propName:string): GUIController;
	    add(target: Object, propName:string, min: number, max: number): GUIController;
	    add(target: Object, propName:string, status: boolean): GUIController;
	    add(target: Object, propName:string, items:string[]): GUIController;
	    add(target: Object, propName:string, items:number[]): GUIController;
	    add(target: Object, propName:string, items:Object): GUIController;

	    addColor(target: Object, propName:string): GUIController;

	    remove(controller: GUIController): void;
	    destroy(): void;

	    addFolder(propName:string): GUI;

	    open(): void;
	    close(): void;

	    remember(target: Object, ...additionalTargets: Object[]): void;
	    getRoot(): GUI;

	    getSaveObject(): Object;
	    save(): void;
	    saveAs(presetName:string): void;
	    revert(gui:GUI): void;

	    listen(controller: GUIController): void;
	    updateDisplay(): void;

	    // gui properties in dat/gui/GUI.js
	    readonly parent: GUI;
	    readonly scrollable: boolean;
	    readonly autoPlace: boolean;
	    preset: string;
	    width: number;
	    name: string;
	    closed: boolean;
	    readonly load: Object;
	    useLocalStorage: boolean;
	}

	export class GUIController {
	    destroy(): void;

	    // Controller
	    onChange: (value?: any) => void;
	    onFinishChange: (value?: any) => void;

	    setValue(value: any): GUIController;
	    getValue(): any;
	    updateDisplay(): void;
	    isModified(): boolean;

	    // NumberController
	    min(n: number): GUIController;
	    max(n: number): GUIController;
	    step(n: number): GUIController;

	    // FunctionController
	    fire(): GUIController;

	    // augmentController in dat/gui/GUI.js
	    options(option:any):GUIController;
	    name(s: string): GUIController;
	    listen(): GUIController;
	    remove(): GUIController;
	}

}
/// <reference path="../RDHcommon.d.ts" />
/// <reference path="../RDHmodel.d.ts" />
/// <reference path="../../../../ext/dat.gui.d.ts" />
declare namespace leojs {
    enum UItype {
        BASE = 0,
        FOLDER = 1,
        BUTTON = 2,
        TEXT = 3,
        SLIDER = 4,
        CHECKBOX = 5
    }
    class RUIelement {
        protected m_type: UItype;
        protected m_name: string;
        protected m_controller: dat.GUIController;
        constructor(uiName: string);
        release(): void;
        assignController(controller: dat.GUIController): void;
        controller(): dat.GUIController;
        name(): string;
        type(): UItype;
    }
    class RUIbutton extends RUIelement {
        private m_callback;
        constructor(uiName: string, fcnCallback: Function);
        release(): void;
        callback(): Function;
    }
    class RUItext extends RUIelement {
        private m_text;
        constructor(uiName: string, uiText: string);
        text(): string;
    }
    class RUIslider extends RUIelement {
        private m_min;
        private m_max;
        private m_current;
        private m_onChangeCallback;
        constructor(uiName: string, vMin: number, vMax: number, vCurrent: number, onChangeCallback: Function);
        release(): void;
        min(): number;
        max(): number;
        initValue(): number;
        onChangeCallback(): Function;
    }
    class RUIcheckbox extends RUIelement {
        private m_state;
        constructor(uiName: string, vState: boolean);
        initState(): boolean;
    }
    class RUIfolder extends RUIelement {
        private m_children;
        constructor(uiName: string);
        release(): void;
        addChild(child: RUIelement): void;
        children(): RUIelement[];
    }
    class RUIwrapper {
        private m_dgui;
        private m_uiDef;
        private m_uiElements;
        private m_uiStorage;
        constructor(dgui: dat.GUI);
        release(): void;
        appendUIelement(uiElement: RUIelement): void;
        elements(): RUIelement[];
        buildUI(): void;
        private _buildNode;
        private _buildFolder;
        private _buildButton;
        private _buildText;
        private _buildSlider;
        private _buildCheckbox;
        getElementByName(name: string): RUIelement;
    }
    class RDHguiController {
        private m_dgui;
        private m_uiWrapper;
        private m_dhTable;
        private m_dhModel;
        private m_isDHmodelVisible;
        private m_isURDFmodelVisible;
        private m_ikEnabled;
        constructor(dhModel: RDHmodel);
        release(): void;
        _initializeMode(): void;
        private _initializeUI;
        private _initializeControllers;
        isDHmodelVisible(): boolean;
        isURDFmodelVisible(): boolean;
        doForwardKinematics(): void;
        doInverseKinematics(): void;
        update(dt: number): void;
        private _updateFKvalues;
        private _updateIKvalues;
        private _updateVisibilityValues;
    }
}
/// <reference path="RKinTree.d.ts" />
/// <reference path="../../ext/cat1js/core/assets/LAssetsManager.d.ts" />
declare namespace leojs {
    enum RUrdfGeometryType {
        NONE = "none",
        BOX = "box",
        CYLINDER = "cylinder",
        SPHERE = "sphere",
        MESH = "mesh"
    }
    class RUrdfLinkGeometry {
        type: RUrdfGeometryType;
        b_width: number;
        b_height: number;
        b_depth: number;
        c_radius: number;
        c_length: number;
        s_radius: number;
        m_meshId: string;
        constructor();
        toDictProperties(): {
            [id: string]: any;
        };
    }
    class RUrdfLink {
        id: string;
        xyz: core.LVec3;
        rpy: core.LVec3;
        geometry: RUrdfLinkGeometry;
        parentId: string;
        jointToParentId: string;
        childId: string;
        jointToChildId: string;
        constructor();
    }
    class RUrdfJoint {
        id: string;
        xyz: core.LVec3;
        rpy: core.LVec3;
        axis: core.LVec3;
        type: string;
        parentId: string;
        childId: string;
        constructor();
    }
    class RUrdfModelParser {
        private m_xmlParser;
        constructor();
        parse(modelUrdfStr: string): RKinTree;
        private _parseLinks;
        private _parseSingleLink;
        private _parseVisualOrigin;
        private _parseVisualGeometry;
        private _parseJoints;
        private _parseSingleJoint;
        private _parseJointOrigin;
        private _parseJointConnection;
        private _parseJointAxis;
        private _parseJointType;
        private _makeKinTree;
        private _getRootLink;
        private _makeKinNodes;
        private _makeKinJoints;
        private _assembleKinTree;
        private _getStringAttrib;
        private _getNumberAttrib;
        private _getArrayAttrib;
        private _getVec3Attrib;
        private _getImmediateChildrenByTagName;
    }
}
/// <reference path="../../core/entities/REntity.d.ts" />
/// <reference path="../../core/components/RComponent.d.ts" />
/// <reference path="components/RDHtreeModelComponent.d.ts" />
/// <reference path="RKinTree.d.ts" />
/// <reference path="RUrdfModelParser.d.ts" />
declare namespace leojs {
    class RManipulator extends REntity {
        private m_kinTree;
        private m_treeModelRef;
        constructor(urdfStr: string);
        release(): void;
        private _initKinTree;
        private _initTreeModel;
        update(dt: number): void;
        getJoints(): {
            [id: string]: RKinJoint;
        };
        getNodes(): {
            [id: string]: RKinNode;
        };
    }
}
/// <reference path="../../core/worlds/RWorld.d.ts" />
/// <reference path="RDHmodel.d.ts" />
/// <reference path="ui/RDHguiController.d.ts" />
/// <reference path="RManipulator.d.ts" />
declare namespace leojs {
    class RDHWorld extends RWorld {
        protected m_dhModel: RDHmodel;
        protected m_urdfModel: RManipulator;
        protected m_uiController: RDHguiController;
        protected m_worldId: string;
        constructor(appWidth: number, appHeight: number);
        init(): void;
        getWorldId(): string;
        private _drawFloorGrid;
        update(dt: number): void;
    }
}
/// <reference path="../../core/entities/REntity.d.ts" />
/// <reference path="../../core/components/graphics/RReferenceFrameComponent.d.ts" />
/// <reference path="../../core/components/graphics/RMesh3dComponent.d.ts" />
/// <reference path="../../ext/cat1js/engine3d/debug/LDebugSystem.d.ts" />
/// <reference path="RDHcommon.d.ts" />
/// <reference path="RDHWorld.d.ts" />
/// <reference path="components/RDHendEffectorComponent.d.ts" />
/// <reference path="components/RDHjointRevoluteComponent.d.ts" />
/// <reference path="components/RDHjointPrismaticComponent.d.ts" />
declare namespace leojs {
    abstract class RDHmodel {
        protected m_dhTable: RDHtable;
        protected m_frames: REntity[];
        protected m_base: REntity;
        protected m_joints: REntity[];
        protected m_endEffector: REntity;
        protected m_endEffectorTotalTransform: core.LMat4;
        protected m_endEffectorCompensation: core.LMat4;
        protected m_world: RDHWorld;
        protected m_time: number;
        protected m_xyzMinEstimate: core.LVec3;
        protected m_xyzMaxEstimate: core.LVec3;
        protected m_xyzZeroPosition: core.LVec3;
        protected m_rpyZeroPosition: core.LVec3;
        protected m_showEndEffector: boolean;
        protected m_visibility: boolean;
        constructor(world: RDHWorld);
        init(): void;
        release(): void;
        xyzMinEstimate(): core.LVec3;
        xyzMaxEstimate(): core.LVec3;
        xyzZeroPosition(): core.LVec3;
        rpyZeroPosition(): core.LVec3;
        private _computeXYZzeroPosition;
        private _buildModel;
        private _buildJoint;
        private _updateModel;
        forward(jointValues: number[]): core.LVec3;
        /**
        *    IK solver manipulator-specific implementation.
        *    Implement inverse kinematics computation here
        *
        *    @method inverse
        *    @param {core.LVec3} xyz requested position
        *    @param {core.LVec3} rpy requested orientation
        *
        */
        abstract inverse(xyz: core.LVec3, rpy: core.LVec3): number[];
        /**
        *    Initialize the end effector compensation matrix to take ...
        *    into account the end effector orientation relative to the ...
        *    manipulator's last DH joint frame
        *
        *    @method _computeEndEffectorOffset
        */
        protected abstract _computeEndEffectorOffset(): void;
        /**
        *    Define the DH-table here
        *
        *    @method _buildDHrepresentation
        */
        protected abstract _buildDHrepresentation(): void;
        /**
        *    Define the min-max estimates here, just as a hint ...
        *    for the ranges for the UI controls
        *
        *    @method _computeMinMaxEstimates
        */
        protected abstract _computeMinMaxEstimates(): void;
        /**
        *    Robot specific method to check if roll-pitch-yaw is actually ...
        *    used by the robot-specific IK solver. Used only by the UI to ...
        *    create or not the RollPitchYaw controls
        *
        *    @method isInWorkspace
        *    @param {core.LVec3} xyz position to be evaluated
        */
        includeInvKinEndEffectorOrientation(): boolean;
        /**
        *    Robot specific method to check if in workspace
        *
        *    @method isInWorkspace
        *    @param {core.LVec3} xyz position to be evaluated
        */
        isInWorkspace(xyz: core.LVec3): boolean;
        update(dt: number): void;
        getDHtable(): RDHtable;
        getWorld(): RDHWorld;
        getJointValueById(jointId: string): number;
        doesJointExist(jointId: string): boolean;
        getEndEffectorXYZ(): core.LVec3;
        getEndEffectorRPY(): core.LVec3;
        setModelVisibility(visible: boolean): void;
    }
}
/// <reference path="../RDHmodel.d.ts" />
declare namespace leojs {
    class RDHrobot extends RDHmodel {
        private m_userDHtable;
        constructor(world: RDHWorld, userDHtable: {
            [id: string]: any;
        }[]);
        protected _buildDHrepresentation(): void;
        protected _computeEndEffectorOffset(): void;
        protected _computeMinMaxEstimates(): void;
        inverse(xyz: core.LVec3, rpy: core.LVec3): number[];
        private _getDefaultJointMin;
        private _getDefaultJointMax;
    }
}
/// <reference path="../RDHmodel.d.ts" />
declare namespace leojs {
    class RDHmodelScara extends RDHmodel {
        constructor(world: RDHWorld);
        protected _buildDHrepresentation(): void;
        includeInvKinEndEffectorOrientation(): boolean;
        protected _computeEndEffectorOffset(): void;
        protected _computeMinMaxEstimates(): void;
        inverse(xyz: core.LVec3, rpy: core.LVec3): number[];
        isInWorkspace(xyz: core.LVec3): boolean;
    }
}
/// <reference path="../RDHmodel.d.ts" />
declare namespace leojs {
    class RDHmodelKukaKR210 extends RDHmodel {
        private m_eeOffset;
        private m_ikEEPosRef;
        private m_ikWCPosRef;
        private m_ikEErotMat;
        private m_ikWCrotMat;
        private m_ikEEtoWCrot;
        private m_ikEEtoWCinvrot;
        private m_R_0_3;
        private m_R_0_3_inv;
        private m_R_3_6;
        constructor(world: RDHWorld);
        protected _buildDHrepresentation(): void;
        includeInvKinEndEffectorOrientation(): boolean;
        protected _computeEndEffectorOffset(): void;
        protected _computeMinMaxEstimates(): void;
        inverse(xyz: core.LVec3, rpy: core.LVec3): number[];
        isInWorkspace(xyz: core.LVec3): boolean;
        update(dt: number): void;
    }
}
/// <reference path="RDHWorld.d.ts" />
/// <reference path="models/RDHmodelScara.d.ts" />
/// <reference path="models/RDHmodelKukaKR210.d.ts" />
declare namespace leojs {
    enum RobotId {
        SCARA = 0,
        KUKA_KR210 = 1
    }
    class RDHWorldDemo extends RDHWorld {
        private m_robotId;
        constructor(appWidth: number, appHeight: number, robotId: RobotId);
        init(): void;
        private _initializeModel;
        private _initializeUI;
        private _initializeEnvironment;
    }
}
/// <reference path="RDHWorld.d.ts" />
declare namespace leojs {
    class RDHWorldPlayground extends RDHWorld {
        constructor(appWidth: number, appHeight: number);
        reset(): void;
        /**
        *    Rebuild models in playground
        *
        *    @method rebuild
        *    @param {Array<Dictionary>} userDHtable DH table
        *    @param {string?} userURDFfileId urdfFile of the  manipulator. Empty for none
        */
        rebuild(userDHtable: {
            [id: string]: any;
        }[], userURDFfileId?: string): void;
        private _buildModel;
        private _buildUI;
    }
}
/// <reference path="ext/cat1js/LCommon.d.ts" />
declare namespace leojs {
    const Textures: core.LTextureAssetInfo[];
    const Shaders: core.LShaderAssetInfo[];
    const Sounds: core.LSoundInfo[];
    const Models: core.LModelInfo[];
    const TextAssets: core.LTextAssetInfo[];
}
/// <reference path="../ext/cat1js/core/LApplication.d.ts" />
/// <reference path="../ext/cat1js/engine3d/debug/LDebugSystem.d.ts" />
/// <reference path="../ext/cat1js/LAssets.d.ts" />
/// <reference path="../RAssets.d.ts" />
/// <reference path="RCommon.d.ts" />
/// <reference path="worlds/RWorld.d.ts" />
/// <reference path="entities/RTestEntity.d.ts" />
/// <reference path="../robo/dh/RDHWorldDemo.d.ts" />
/// <reference path="../robo/dh/RDHWorldPlayground.d.ts" />
declare namespace leojs {
    abstract class RApp {
        static INSTANCE: RApp;
        protected m_gApp: core.LApplication;
        protected m_canvas: HTMLCanvasElement;
        protected m_gl: WebGLRenderingContext;
        protected m_world: RWorld;
        constructor(canvas: HTMLCanvasElement, glContext: WebGLRenderingContext);
        initializeApp(): void;
        _onInit(): void;
        _onUpdate(dt: number): void;
        _onResize(appWidth: number, appHeight: number): void;
        /**
         * Initialize the world and scene here
         */
        protected abstract _init(): void;
        protected _update(dt: number): void;
        protected _resizeApp(appWidth: number, appHeight: number): void;
        world(): RWorld;
    }
}
/// <reference path="../../core/RApp.d.ts" />
declare namespace leojs {
    enum RDHApplicationMode {
        DEMO = 0,
        PLAYGROUND = 1
    }
    class RDHApp extends RApp {
        private m_appMode;
        constructor(canvas: HTMLCanvasElement, glContext: WebGLRenderingContext, appMode: RDHApplicationMode);
        protected _init(): void;
    }
}
declare namespace leojs {
    const EntryPointFiles: string[];
}
/// <reference path="RBoot.d.ts" />
declare namespace leojs {
    class REntryPoint {
        static include(file: string): void;
        private static begin;
    }
}
/// <reference path="ext/cat1js/Globals.d.ts" />
/// <reference path="robo/dh/RDHApp.d.ts" />
declare var rApp: leojs.RDHApp;
/// <reference path="ext/cat1js/Globals.d.ts" />
/// <reference path="robo/dh/RDHApp.d.ts" />
declare var rApp: leojs.RDHApp;
