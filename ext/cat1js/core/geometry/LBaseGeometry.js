/// <reference path="../math/LMath.ts" />
/// <reference path="../data/LVertexBuffer.ts" />
/// <reference path="../data/LIndexBuffer.ts" />
var core;
(function (core) {
    var LBaseGeometry = /** @class */ (function () {
        function LBaseGeometry() {
            this.m_vbos = [];
            this.m_ibo = null;
        }
        LBaseGeometry.prototype.release = function () {
            if (this.m_vbos) {
                for (var q = 0; q < this.m_vbos.length; q++) {
                    this.m_vbos[q].release();
                    this.m_vbos[q] = null;
                }
                this.m_vbos = null;
            }
            if (this.m_ibo) {
                this.m_ibo.release();
                this.m_ibo = null;
            }
        };
        /**
        *    Creates and adds a new VBO object with the given data
        *    @method addVbo
        */
        LBaseGeometry.prototype.addVbo = function (componentCount, data, attribIndx) {
            this.m_vbos.push(new core.LVertexBuffer(gl.STATIC_DRAW, componentCount, data, attribIndx));
        };
        /**
        *    Create a new IBO object with the given properties
        *    @method setIbo
        */
        LBaseGeometry.prototype.setIbo = function (indicesCount, data) {
            this.m_ibo = new core.LIndexBuffer(indicesCount, data);
        };
        /**
        *    Get number of indices in IBO buffer
        *    @method getIndexCount
        */
        LBaseGeometry.prototype.getIndexCount = function () {
            return this.m_ibo.getCount();
        };
        /**
        *    Bind all data in this geometry
        *    @method bind
        */
        LBaseGeometry.prototype.bind = function () {
            var i;
            for (i = 0; i < this.m_vbos.length; i++) {
                this.m_vbos[i].bind();
            }
            this.m_ibo.bind();
        };
        /**
        *    Unbind all data in this geometry
        *    @method unbind
        */
        LBaseGeometry.prototype.unbind = function () {
            this.m_ibo.unbind();
            var i;
            for (i = 0; i < this.m_vbos.length; i++) {
                this.m_vbos[i].unbind();
            }
        };
        return LBaseGeometry;
    }());
    core.LBaseGeometry = LBaseGeometry;
})(core || (core = {}));
