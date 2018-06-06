/// <reference path="LColladaParser.ts" />
var core;
(function (core) {
    var LModelsManager = /** @class */ (function () {
        function LModelsManager() {
            this.m_models = {};
            this.m_batchLoadedCallback = null;
            this.m_xmlParser = new DOMParser();
            this.m_isWorking = false;
            this.m_colladaParser = new core.LColladaParser();
        }
        LModelsManager.prototype.getModel = function (modelId) {
            if (!this.m_models[modelId]) {
                console.warn('LModelsManager> model with id ' +
                    modelId + ' does not exist');
                return null;
            }
            return this.m_models[modelId];
        };
        LModelsManager.prototype.loadBatch = function (modelsInfo, callback) {
            if (modelsInfo.length < 1) {
                callback();
                return;
            }
            this.m_batchLoadedCallback = callback;
            this.m_isWorking = true;
            for (var i = 0; i < modelsInfo.length; i++) {
                this._loadModel(modelsInfo[i]);
            }
        };
        LModelsManager.prototype._loadModel = function (modelInfo) {
            var _self = this;
            this.m_models[modelInfo.modelId] = null;
            var _xhttp = new XMLHttpRequest();
            _xhttp['modelInfo'] = modelInfo;
            _xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    var _model = _self.parseModelFile(this.responseText, this['modelInfo']['modelType']);
                    _self.m_models[this['modelInfo']['modelId']] = _model;
                }
            };
            _xhttp.open('GET', modelInfo.filename, true);
            _xhttp.send();
        };
        LModelsManager.prototype.parseModelFile = function (strModel, modelType) {
            var _model = null;
            if (modelType == core.MODEL_TYPE_COLLADA) {
                _model = this._parseColladaModel(strModel);
            }
            else if (modelType == core.MODEL_TYPE_OBJ) {
                _model = this._parseObjModel(strModel);
            }
            else {
                console.warn('LModelManager> Model type not supported: ' +
                    modelType);
            }
            return _model;
        };
        LModelsManager.prototype._parseColladaModel = function (strModel) {
            var _doc = this.m_xmlParser.parseFromString(strModel, 'text/xml');
            var _root = _doc.documentElement;
            return this.m_colladaParser.parseModel(_root);
        };
        LModelsManager.prototype._parseObjModel = function (strModel) {
            var _model = new core.LModelConstructInfo();
            return _model;
        };
        LModelsManager.prototype.update = function () {
            if (this.m_isWorking) {
                var _finishedLoading = true;
                var _key = void 0;
                for (_key in this.m_models) {
                    if (this.m_models[_key] == null) {
                        // Model still not loaded
                        _finishedLoading = false;
                    }
                }
                if (_finishedLoading) {
                    this.m_isWorking = false;
                    if (this.m_batchLoadedCallback) {
                        this.m_batchLoadedCallback();
                    }
                }
            }
        };
        return LModelsManager;
    }());
    core.LModelsManager = LModelsManager;
})(core || (core = {}));
