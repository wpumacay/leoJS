/// <reference path="../../LCommon.ts" />
/// <reference path="../../Globals.ts" />
var core;
(function (core) {
    var LTexture = /** @class */ (function () {
        function LTexture() {
            this.m_textureObj = gl.createTexture();
            this.m_textureIndx = 0;
            this.m_width = 0;
            this.m_height = 0;
            this.m_texAssetInfo = null;
        }
        LTexture.prototype.setTexAssetInfo = function (assetInfo) {
            this.m_texAssetInfo = assetInfo;
        };
        LTexture.prototype.getTexAssetInfo = function () {
            return this.m_texAssetInfo;
        };
        LTexture.prototype.setData = function (data, format) {
            this.m_width = data.width;
            this.m_height = data.height;
            gl.bindTexture(gl.TEXTURE_2D, this.m_textureObj);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, data);
            // gl.generateMipmap( gl.TEXTURE_2D );
        };
        LTexture.prototype.width = function () { return this.m_width; };
        LTexture.prototype.height = function () { return this.m_height; };
        LTexture.prototype.setTextureIndx = function (textureIndx) { this.m_textureIndx = textureIndx; };
        LTexture.prototype.getTextureIndx = function () { return this.m_textureIndx; };
        LTexture.prototype.bind = function () {
            gl.activeTexture(gl.TEXTURE0 + this.m_textureIndx);
            gl.bindTexture(gl.TEXTURE_2D, this.m_textureObj);
        };
        LTexture.prototype.unbind = function () {
            // gl.bindTexture( gl.TEXTURE_2D, null );
        };
        return LTexture;
    }());
    core.LTexture = LTexture;
})(core || (core = {}));
