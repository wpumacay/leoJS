/// <reference path = "../../core/shader/LShader.ts" />
/// <reference path = "../material/LTexturedMaterial.ts" />
/// <reference path = "../lights/LDirectionalLight.ts" />
/// <reference path = "../lights/LPointLight.ts" />
/// <reference path = "../../core/data/LTexture.ts" />
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
var engine3d;
(function (engine3d) {
    var ULightDirectional = /** @class */ (function () {
        function ULightDirectional() {
        }
        return ULightDirectional;
    }());
    ;
    var ULightPoint = /** @class */ (function () {
        function ULightPoint() {
        }
        return ULightPoint;
    }());
    ;
    var UPhongMaterial = /** @class */ (function () {
        function UPhongMaterial() {
        }
        return UPhongMaterial;
    }());
    ;
    var MAX_DIRECTIONAL_LIGHTS = 3;
    var MAX_POINT_LIGHTS = 3;
    var LShaderTextureLighting = /** @class */ (function (_super) {
        __extends(LShaderTextureLighting, _super);
        function LShaderTextureLighting(obj) {
            var _this = _super.call(this, obj) || this;
            _this.bind();
            // Load uniforms
            _this.m_uModel = gl.getUniformLocation(obj, "u_matModel");
            _this.m_uView = gl.getUniformLocation(obj, "u_matView");
            _this.m_uProj = gl.getUniformLocation(obj, "u_matProj");
            _this.m_uMaterial = new UPhongMaterial();
            _this.m_uMaterial.diffuseMap = gl.getUniformLocation(obj, "u_material.diffuseMap");
            _this.m_uMaterial.specular = gl.getUniformLocation(obj, "u_material.specular");
            _this.m_uMaterial.shininess = gl.getUniformLocation(obj, "u_material.shininess");
            _this.m_uViewPos = gl.getUniformLocation(obj, "u_viewPos");
            _this.m_uNumLightsDirectional = gl.getUniformLocation(obj, "u_numDirectionalLights");
            _this.m_uNumLightsPoint = gl.getUniformLocation(obj, "u_numPointLights");
            _this.m_uLightsDirectional = [];
            _this.m_uLightsPoint = [];
            var q;
            for (q = 0; q < MAX_DIRECTIONAL_LIGHTS; q++) {
                _this.m_uLightsDirectional.push(new ULightDirectional());
                var _uLocation = 'u_directionalLights' +
                    '[' + q + ']';
                _this.m_uLightsDirectional[q].direction = gl.getUniformLocation(obj, _uLocation + '.direction');
                _this.m_uLightsDirectional[q].ambient = gl.getUniformLocation(obj, _uLocation + '.ambient');
                _this.m_uLightsDirectional[q].diffuse = gl.getUniformLocation(obj, _uLocation + '.diffuse');
                _this.m_uLightsDirectional[q].specular = gl.getUniformLocation(obj, _uLocation + '.specular');
                _this.m_uLightsDirectional[q].strength = gl.getUniformLocation(obj, _uLocation + '.strength');
            }
            for (q = 0; q < MAX_POINT_LIGHTS; q++) {
                _this.m_uLightsPoint.push(new ULightPoint());
                var _uLocation = 'u_pointLights' +
                    '[' + q + ']';
                _this.m_uLightsPoint[q].position = gl.getUniformLocation(obj, _uLocation + '.position');
                _this.m_uLightsPoint[q].ambient = gl.getUniformLocation(obj, _uLocation + '.ambient');
                _this.m_uLightsPoint[q].diffuse = gl.getUniformLocation(obj, _uLocation + '.diffuse');
                _this.m_uLightsPoint[q].specular = gl.getUniformLocation(obj, _uLocation + '.specular');
                _this.m_uLightsPoint[q].strength = gl.getUniformLocation(obj, _uLocation + '.strength');
            }
            _this.unbind();
            return _this;
        }
        LShaderTextureLighting.prototype.bind = function () {
            _super.prototype.bind.call(this);
            // Just in case, set the default number of lights
            this._setInt(this.m_uNumLightsDirectional, 0);
            this._setInt(this.m_uNumLightsPoint, 0);
        };
        LShaderTextureLighting.prototype.setMatModel = function (matModel) {
            this._setMat4(this.m_uModel, matModel);
        };
        LShaderTextureLighting.prototype.setMatView = function (matView) {
            this._setMat4(this.m_uView, matView);
        };
        LShaderTextureLighting.prototype.setMatProj = function (matProj) {
            this._setMat4(this.m_uProj, matProj);
        };
        LShaderTextureLighting.prototype.setViewPos = function (pos) {
            this._setVec3(this.m_uViewPos, pos);
        };
        LShaderTextureLighting.prototype.setNumDirectionalLights = function (numDirLights) {
            this._setInt(this.m_uNumLightsDirectional, numDirLights);
        };
        LShaderTextureLighting.prototype.setNumPointLights = function (numPointLights) {
            this._setInt(this.m_uNumLightsPoint, numPointLights);
        };
        LShaderTextureLighting.prototype.setMaterial = function (material) {
            this._setInt(this.m_uMaterial.diffuseMap, material.getTexture().getTextureIndx());
            this._setVec3(this.m_uMaterial.specular, material.specular);
            this._setFloat(this.m_uMaterial.shininess, material.shininess);
        };
        LShaderTextureLighting.prototype.setLightDirectional = function (light, lightIndx) {
            if (lightIndx < 0 || lightIndx >= MAX_DIRECTIONAL_LIGHTS) {
                return;
            }
            this._setVec3(this.m_uLightsDirectional[lightIndx].direction, light.getDirection());
            this._setVec3(this.m_uLightsDirectional[lightIndx].ambient, light.ambient);
            this._setVec3(this.m_uLightsDirectional[lightIndx].diffuse, light.diffuse);
            this._setVec3(this.m_uLightsDirectional[lightIndx].specular, light.specular);
            this._setFloat(this.m_uLightsDirectional[lightIndx].strength, light.strength);
        };
        LShaderTextureLighting.prototype.setLightPoint = function (light, lightIndx) {
            if (lightIndx < 0 || lightIndx >= MAX_DIRECTIONAL_LIGHTS) {
                return;
            }
            this._setVec3(this.m_uLightsPoint[lightIndx].position, light.getPosition());
            this._setVec3(this.m_uLightsPoint[lightIndx].ambient, light.ambient);
            this._setVec3(this.m_uLightsPoint[lightIndx].diffuse, light.diffuse);
            this._setVec3(this.m_uLightsPoint[lightIndx].specular, light.specular);
            this._setFloat(this.m_uLightsPoint[lightIndx].strength, light.strength);
        };
        return LShaderTextureLighting;
    }(core.LShader));
    engine3d.LShaderTextureLighting = LShaderTextureLighting;
})(engine3d || (engine3d = {}));
