/// <reference path="../math/LMath.ts" />
/// <reference path="../../Globals.ts" />
var core;
(function (core) {
    var LShader = /** @class */ (function () {
        function LShader(obj) {
            this.m_obj = obj;
        }
        LShader.prototype.setObj = function (obj) {
            this.m_obj = obj;
        };
        LShader.prototype.getObj = function () {
            return this.m_obj;
        };
        LShader.prototype.release = function () {
            gl.deleteProgram(this.m_obj);
        };
        LShader.prototype.bind = function () {
            gl.useProgram(this.m_obj);
        };
        LShader.prototype.unbind = function () {
            gl.useProgram(null);
        };
        LShader.prototype.setInt = function (uName, val) {
            gl.uniform1i(gl.getUniformLocation(this.m_obj, uName), val);
        };
        LShader.prototype.setFloat = function (uName, val) {
            gl.uniform1f(gl.getUniformLocation(this.m_obj, uName), val);
        };
        LShader.prototype.setVec2 = function (uName, v) {
            gl.uniform2f(gl.getUniformLocation(this.m_obj, uName), v.x, v.y);
        };
        LShader.prototype.setVec3 = function (uName, v) {
            gl.uniform3f(gl.getUniformLocation(this.m_obj, uName), v.x, v.y, v.z);
        };
        LShader.prototype.setVec4 = function (uName, v) {
            gl.uniform4f(gl.getUniformLocation(this.m_obj, uName), v.x, v.y, v.z, v.w);
        };
        LShader.prototype.setMat4 = function (uName, mat) {
            gl.uniformMatrix4fv(gl.getUniformLocation(this.m_obj, uName), false, mat.buff);
        };
        // To be used internally
        LShader.prototype._setInt = function (unifLoc, val) {
            gl.uniform1i(unifLoc, val);
        };
        LShader.prototype._setFloat = function (unifLoc, val) {
            gl.uniform1f(unifLoc, val);
        };
        LShader.prototype._setVec2 = function (unifLoc, v) {
            gl.uniform2f(unifLoc, v.x, v.y);
        };
        LShader.prototype._setVec3 = function (unifLoc, v) {
            gl.uniform3f(unifLoc, v.x, v.y, v.z);
        };
        LShader.prototype._setVec4 = function (unifLoc, v) {
            gl.uniform4f(unifLoc, v.x, v.y, v.z, v.w);
        };
        LShader.prototype._setMat4 = function (unifLoc, mat) {
            gl.uniformMatrix4fv(unifLoc, false, mat.buff);
        };
        return LShader;
    }());
    core.LShader = LShader;
})(core || (core = {}));
