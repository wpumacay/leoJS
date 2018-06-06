/// <reference path="../../core/math/LMath.ts" />
/// <reference path="../../core/data/LVertexBuffer.ts" />
/// <reference path="../../core/assets/LAssetsManager.ts" />
var engine3d;
(function (engine3d) {
    var LDLinePositions = /** @class */ (function () {
        function LDLinePositions() {
            this.vStart = new core.LVec3(0, 0, 0);
            this.vEnd = new core.LVec3(0, 0, 0);
        }
        LDLinePositions.linesToBuffer = function (lines, numActiveLines) {
            var _res = new Float32Array(numActiveLines * 2 * 3);
            var q;
            for (q = 0; q < lines.length; q++) {
                if (q >= numActiveLines) {
                    break;
                }
                _res[6 * q + 0] = lines[q].vStart.x;
                _res[6 * q + 1] = lines[q].vStart.y;
                _res[6 * q + 2] = lines[q].vStart.z;
                _res[6 * q + 3] = lines[q].vEnd.x;
                _res[6 * q + 4] = lines[q].vEnd.y;
                _res[6 * q + 5] = lines[q].vEnd.z;
            }
            return _res;
        };
        return LDLinePositions;
    }());
    ;
    var LDLineColors = /** @class */ (function () {
        function LDLineColors() {
            this.cStart = new core.LVec3(0, 0, 0);
            this.cEnd = new core.LVec3(0, 0, 0);
        }
        LDLineColors.linesToBuffer = function (lines, numActiveLines) {
            var _res = new Float32Array(numActiveLines * 2 * 3);
            var q;
            for (q = 0; q < lines.length; q++) {
                if (q >= numActiveLines) {
                    break;
                }
                _res[6 * q + 0] = lines[q].cStart.x;
                _res[6 * q + 1] = lines[q].cStart.y;
                _res[6 * q + 2] = lines[q].cStart.z;
                _res[6 * q + 3] = lines[q].cEnd.x;
                _res[6 * q + 4] = lines[q].cEnd.y;
                _res[6 * q + 5] = lines[q].cEnd.z;
            }
            return _res;
        };
        return LDLineColors;
    }());
    ;
    var MAX_LINES_PER_BATCH = 1024;
    var LDebugDrawer = /** @class */ (function () {
        function LDebugDrawer() {
            this.m_shaderLinesRef = core.LAssetsManager.INSTANCE.getShader('debugDrawer3d');
            this.m_linesPositions = [];
            this.m_linesColors = [];
            this.m_linesRenderBufferPositions = [];
            this.m_linesRenderBufferColors = [];
            var q;
            for (q = 0; q < MAX_LINES_PER_BATCH; q++) {
                this.m_linesRenderBufferPositions.push(new LDLinePositions());
                this.m_linesRenderBufferColors.push(new LDLineColors());
            }
            this.m_linesPositionsVBO = new core.LVertexBuffer(gl.STREAM_DRAW, 3, new Float32Array(MAX_LINES_PER_BATCH * 2 * 3), 0);
            this.m_linesColorsVBO = new core.LVertexBuffer(gl.STREAM_DRAW, 3, new Float32Array(MAX_LINES_PER_BATCH * 2 * 3), 1);
            this.m_viewMat = null;
            this.m_projMat = null;
        }
        LDebugDrawer.create = function () {
            if (!LDebugDrawer.INSTANCE) {
                LDebugDrawer.INSTANCE = new LDebugDrawer();
            }
            return LDebugDrawer.INSTANCE;
        };
        LDebugDrawer.release = function () {
            LDebugDrawer.INSTANCE = null;
        };
        LDebugDrawer.prototype.drawLine = function (start, end, color) {
            var _linePos = new LDLinePositions();
            _linePos.vStart = start;
            _linePos.vEnd = end;
            this.m_linesPositions.push(_linePos);
            var _lineCol = new LDLineColors();
            _lineCol.cStart = color;
            _lineCol.cEnd = color;
            this.m_linesColors.push(_lineCol);
        };
        LDebugDrawer.prototype.drawArrow = function (start, end, color) {
            this.drawLine(start, end, color);
            var _arrowVec = core.LVec3.minus(end, start);
            var _length = _arrowVec.length();
            var _uf = core.LVec3.normalize(_arrowVec);
            var _ur = core.LVec3.cross(_uf, core.WORLD_UP);
            var _uu = core.LVec3.cross(_ur, _uf);
            var _sidesLength = _length / 10.0;
            _uf.scale(_sidesLength, _sidesLength, _sidesLength);
            _ur.scale(_sidesLength, _sidesLength, _sidesLength);
            _uu.scale(_sidesLength, _sidesLength, _sidesLength);
            var _p0 = core.LVec3.plus(core.LVec3.minus(end, _uf), _ur);
            var _p1 = core.LVec3.plus(core.LVec3.minus(end, _uf), _uu);
            var _p2 = core.LVec3.minus(core.LVec3.minus(end, _uf), _ur);
            var _p3 = core.LVec3.minus(core.LVec3.minus(end, _uf), _uu);
            this.drawLine(end, _p0, color);
            this.drawLine(end, _p1, color);
            this.drawLine(end, _p2, color);
            this.drawLine(end, _p3, color);
        };
        LDebugDrawer.prototype.drawFrame = function (frameMat, axisSize) {
            var _fPos = new core.LVec3(0, 0, 0);
            var _fx = new core.LVec3(0, 0, 0);
            var _fy = new core.LVec3(0, 0, 0);
            var _fz = new core.LVec3(0, 0, 0);
            _fPos.x = frameMat.buff[12];
            _fPos.y = frameMat.buff[13];
            _fPos.z = frameMat.buff[14];
            _fx.x = frameMat.buff[0] * axisSize;
            _fx.y = frameMat.buff[1] * axisSize;
            _fx.z = frameMat.buff[2] * axisSize;
            _fy.x = frameMat.buff[4] * axisSize;
            _fy.y = frameMat.buff[5] * axisSize;
            _fy.z = frameMat.buff[6] * axisSize;
            _fz.x = frameMat.buff[8] * axisSize;
            _fz.y = frameMat.buff[9] * axisSize;
            _fz.z = frameMat.buff[10] * axisSize;
            this.drawLine(_fPos, core.LVec3.plus(_fPos, _fx), core.RED);
            this.drawLine(_fPos, core.LVec3.plus(_fPos, _fy), core.GREEN);
            this.drawLine(_fPos, core.LVec3.plus(_fPos, _fz), core.BLUE);
        };
        LDebugDrawer.prototype.setupMatrices = function (viewMatrix, projMatrix) {
            this.m_viewMat = viewMatrix;
            this.m_projMat = projMatrix;
        };
        LDebugDrawer.prototype.render = function () {
            if (this.m_viewMat == null ||
                this.m_projMat == null) {
                return;
            }
            this._renderLines();
        };
        LDebugDrawer.prototype._renderLines = function () {
            var q;
            for (q = 0; q < this.m_linesPositions.length; q++) {
                this.m_linesRenderBufferPositions[q % MAX_LINES_PER_BATCH] = this.m_linesPositions[q];
                this.m_linesRenderBufferColors[q % MAX_LINES_PER_BATCH] = this.m_linesColors[q];
                if ((q + 1) % MAX_LINES_PER_BATCH == 0) {
                    this._renderLinesBatch(MAX_LINES_PER_BATCH);
                }
            }
            var _numRemainingLines = this.m_linesPositions.length % MAX_LINES_PER_BATCH;
            if (_numRemainingLines != 0) {
                this._renderLinesBatch(_numRemainingLines);
            }
            // Clean up
            this.m_linesPositions = [];
            this.m_linesColors = [];
        };
        LDebugDrawer.prototype._renderLinesBatch = function (countLines) {
            this.m_linesPositionsVBO.updateData(LDLinePositions.linesToBuffer(this.m_linesRenderBufferPositions, countLines));
            this.m_linesColorsVBO.updateData(LDLineColors.linesToBuffer(this.m_linesRenderBufferColors, countLines));
            this.m_shaderLinesRef.bind();
            this.m_shaderLinesRef.setMatView(this.m_viewMat);
            this.m_shaderLinesRef.setMatProj(this.m_projMat);
            this.m_linesPositionsVBO.bind();
            this.m_linesColorsVBO.bind();
            gl.drawArrays(gl.LINES, 0, countLines * 2);
            this.m_linesPositionsVBO.unbind();
            this.m_linesColorsVBO.unbind();
            this.m_shaderLinesRef.unbind();
        };
        LDebugDrawer.INSTANCE = null;
        return LDebugDrawer;
    }());
    engine3d.LDebugDrawer = LDebugDrawer;
})(engine3d || (engine3d = {}));
