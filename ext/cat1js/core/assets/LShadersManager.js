/// <reference path="../../Globals.ts" />
/// <reference path="../../engine3d/shaders/LShaderBasic3d.ts" />
/// <reference path="../../engine3d/shaders/LShaderPhongLighting.ts" />
/// <reference path="../../engine3d/shaders/LShaderDebugDrawer3d.ts" />
/// <reference path="../../engine3d/shaders/LShaderSimpleTexture.ts" />
/// <reference path="../../engine3d/shaders/LShaderTextureLighting.ts" />
/// <reference path="../shader/LShader.ts" />
var core;
(function (core) {
    var LShaderData = /** @class */ (function () {
        function LShaderData(shaderClassType) {
            this.vertexShaderCode = null;
            this.fragmentShaderCode = null;
            this.loaded = false;
            this.shaderClassType = shaderClassType;
        }
        return LShaderData;
    }());
    core.LShaderData = LShaderData;
    var LShadersManager = /** @class */ (function () {
        function LShadersManager() {
            this.m_programs = {};
            this.m_shaderData = {};
        }
        LShadersManager.prototype.getShader = function (shaderId) {
            if (!this.m_programs[shaderId]) {
                console.warn('LShadersManager> shader with id ' +
                    shaderId + ' does not exist');
                return null;
            }
            return this.m_programs[shaderId];
        };
        LShadersManager.prototype.loadBatch = function (shadersInfo, callback) {
            if (shadersInfo.length < 1) {
                callback();
                return;
            }
            this.m_batchLoadedCallback = callback;
            this.m_isWorking = true;
            this.m_shaderData = {};
            var q;
            for (q = 0; q < shadersInfo.length; q++) {
                this._loadShader(shadersInfo[q]);
            }
        };
        LShadersManager.prototype._loadShader = function (shaderInfo) {
            var _self = this;
            this.m_shaderData[shaderInfo.shaderId] = new LShaderData(shaderInfo.shaderClassType);
            var _xhttp_vs = new XMLHttpRequest();
            _xhttp_vs['shaderInfo'] = shaderInfo;
            _xhttp_vs.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    _self.m_shaderData[this['shaderInfo']['shaderId']].vertexShaderCode = this.responseText;
                }
            };
            _xhttp_vs.open('GET', shaderInfo.fileNameVs, true);
            _xhttp_vs.send();
            var _xhttp_fs = new XMLHttpRequest();
            _xhttp_fs['shaderInfo'] = shaderInfo;
            _xhttp_fs.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    _self.m_shaderData[this['shaderInfo']['shaderId']].fragmentShaderCode = this.responseText;
                }
            };
            _xhttp_fs.open('GET', shaderInfo.fileNameFs, true);
            _xhttp_fs.send();
        };
        LShadersManager.prototype.update = function () {
            if (this.m_isWorking) {
                var _finishedLoading = true;
                var _key = void 0;
                for (_key in this.m_shaderData) {
                    if (this.m_shaderData[_key].vertexShaderCode &&
                        this.m_shaderData[_key].fragmentShaderCode) {
                        // Finished loading the shader code for this instance
                        this.m_shaderData[_key].loaded = true;
                    }
                    if (!this.m_shaderData[_key].loaded) {
                        _finishedLoading = false;
                    }
                }
                if (_finishedLoading) {
                    // Generate shaders
                    var _shaderId = void 0;
                    for (_shaderId in this.m_shaderData) {
                        this.m_programs[_shaderId] = this.generateShader(this.m_shaderData[_shaderId]);
                    }
                    this.m_shaderData = {}; // Clean this dictionary
                    this.m_isWorking = false;
                    if (this.m_batchLoadedCallback) {
                        this.m_batchLoadedCallback();
                    }
                }
            }
        };
        LShadersManager.prototype.generateShader = function (shaderData) {
            var _programObj = this.fromSource(shaderData.vertexShaderCode, shaderData.fragmentShaderCode);
            var _shader;
            switch (shaderData.shaderClassType) {
                case core.SHADER_BASIC_3D:
                    _shader = new engine3d.LShaderBasic3d(_programObj);
                    break;
                case core.SHADER_DEBUG_DRAWER_3D:
                    _shader = new engine3d.LShaderDebugDrawer3d(_programObj);
                    break;
                case core.SHADER_PHONG_LIGHTING_3D:
                    _shader = new engine3d.LShaderPhongLighting(_programObj);
                    break;
                case core.SHADER_SIMPLE_TEXTURE_3D:
                    _shader = new engine3d.LShaderSimpleTexture(_programObj);
                    break;
                case core.SHADER_TEXTURE_LIGHTING_3D:
                    _shader = new engine3d.LShaderTextureLighting(_programObj);
                    break;
                default:
                    _shader = new core.LShader(_programObj);
                    break;
            }
            return _shader;
        };
        LShadersManager.prototype.compileShader = function (type, code) {
            var _shaderObj = gl.createShader(type);
            gl.shaderSource(_shaderObj, code);
            gl.compileShader(_shaderObj);
            if (!gl.getShaderParameter(_shaderObj, gl.COMPILE_STATUS)) {
                console.error('compileShader> ', gl.getShaderInfoLog(_shaderObj));
                console.error('compileShader> shaderType: ', type);
                console.error('compileShader> shaderCode: ', code);
                return null;
            }
            return _shaderObj;
        };
        LShadersManager.prototype.fromSource = function (vsCode, fsCode) {
            var _vs = this.compileShader(gl.VERTEX_SHADER, vsCode);
            var _fs = this.compileShader(gl.FRAGMENT_SHADER, fsCode);
            var _obj = gl.createProgram();
            gl.attachShader(_obj, _vs);
            gl.attachShader(_obj, _fs);
            gl.linkProgram(_obj);
            if (!gl.getProgramParameter(_obj, gl.LINK_STATUS)) {
                console.error('fromSource> link error: ', gl.getProgramInfoLog(_obj));
                return null;
            }
            return _obj;
        };
        LShadersManager.prototype.fromFile = function (vs, fs) {
            var _shader = null;
            var _vsCode = null;
            var _fsCode = null;
            var _xhttp_vs = new XMLHttpRequest();
            _xhttp_vs.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    _vsCode = this.responseText;
                }
            };
            _xhttp_vs.open('GET', vs, false);
            _xhttp_vs.send();
            var _xhttp_fs = new XMLHttpRequest();
            _xhttp_fs.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    _fsCode = this.responseText;
                }
            };
            _xhttp_fs.open('GET', fs, false);
            _xhttp_fs.send();
            return this.fromSource(_vsCode, _fsCode);
        };
        return LShadersManager;
    }());
    core.LShadersManager = LShadersManager;
})(core || (core = {}));
