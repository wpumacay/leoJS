/// <reference path="../../Globals.ts" />
/// <reference path="../../LCommon.ts" />
/// <reference path="../math/LMath.ts" />
var core;
(function (core) {
    var LModelGeometryInfo = /** @class */ (function () {
        function LModelGeometryInfo() {
            this.vertices = [];
            this.normals = [];
            this.texCoords = [];
            this.indices = [];
            this.wasParsedCorrectly = false;
        }
        return LModelGeometryInfo;
    }());
    core.LModelGeometryInfo = LModelGeometryInfo;
    var LModelMaterialInfo = /** @class */ (function () {
        function LModelMaterialInfo() {
            this.type = 'none';
            this.properties = {};
            this.wasParsedCorrectly = false;
        }
        return LModelMaterialInfo;
    }());
    core.LModelMaterialInfo = LModelMaterialInfo;
    var LModelConstructInfo = /** @class */ (function () {
        function LModelConstructInfo() {
            this.geometryInfo = new LModelGeometryInfo();
            this.materialInfo = new LModelMaterialInfo();
            this.correctionMat = new core.LMat4();
            this.wasParsedCorrectly = false;
        }
        return LModelConstructInfo;
    }());
    core.LModelConstructInfo = LModelConstructInfo;
})(core || (core = {}));
