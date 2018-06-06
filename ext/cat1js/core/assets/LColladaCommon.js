var core;
(function (core) {
    core.BUFFER_USAGE_POSITION = 'POSITION';
    core.BUFFER_USAGE_VERTEX = 'VERTEX';
    core.BUFFER_USAGE_NORMAL = 'NORMAL';
    core.BUFFER_USAGE_TEXCOORD = 'TEXCOORD';
    core.BUFFER_USAGE_COLOR = 'COLOR';
    var LColladaVertexBuffer = /** @class */ (function () {
        function LColladaVertexBuffer() {
            this.size = -1;
            this.count = -1;
            this.data = null;
            this.usage = '';
            this.offset = 0;
            this.children = [];
        }
        return LColladaVertexBuffer;
    }());
    core.LColladaVertexBuffer = LColladaVertexBuffer;
    var LColladaIndexBuffer = /** @class */ (function () {
        function LColladaIndexBuffer() {
            this.size = -1;
            this.count = -1;
            this.data = null;
        }
        return LColladaIndexBuffer;
    }());
    core.LColladaIndexBuffer = LColladaIndexBuffer;
    var LColladaGeometry = /** @class */ (function () {
        function LColladaGeometry() {
            this.buffers = {};
            this.layout = [];
            this.positionsBuffer = null;
            this.normalsBuffer = null;
            this.texCoordsBuffer = null;
            this.colorBuffer = null;
            this.offsetInGlobalBuffer = 0;
            this.faces = null;
            this.scale = 1.0;
            this.isOk = true;
        }
        return LColladaGeometry;
    }());
    core.LColladaGeometry = LColladaGeometry;
    var UpAxis;
    (function (UpAxis) {
        UpAxis["X"] = "X_UP";
        UpAxis["Y"] = "Y_UP";
        UpAxis["Z"] = "Z_UP";
    })(UpAxis = core.UpAxis || (core.UpAxis = {}));
    var LColladaModelProperties = /** @class */ (function () {
        function LColladaModelProperties() {
            this.scale = 1;
            this.correctionMatrix = new core.LMat4();
            this.upAxis = UpAxis.Y;
        }
        return LColladaModelProperties;
    }());
    core.LColladaModelProperties = LColladaModelProperties;
})(core || (core = {}));
