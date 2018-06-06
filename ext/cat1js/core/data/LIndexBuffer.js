/// <reference path="../../Globals.ts" />
var core;
(function (core) {
    var LIndexBuffer = /** @class */ (function () {
        function LIndexBuffer(count, data) {
            this.m_count = count;
            this.m_bufferObj = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.m_bufferObj);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);
        }
        LIndexBuffer.prototype.release = function () {
            gl.deleteBuffer(this.m_bufferObj);
            this.m_bufferObj = null;
        };
        LIndexBuffer.prototype.bind = function () {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.m_bufferObj);
        };
        LIndexBuffer.prototype.unbind = function () {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        };
        LIndexBuffer.prototype.getCount = function () {
            return this.m_count;
        };
        return LIndexBuffer;
    }());
    core.LIndexBuffer = LIndexBuffer;
})(core || (core = {}));
