var core;
(function (core) {
    var LVec2 = /** @class */ (function () {
        function LVec2(x, y) {
            this.x = x;
            this.y = y;
        }
        LVec2.prototype.clone = function () {
            return new LVec2(this.x, this.y);
        };
        LVec2.arrayToBuffer = function (arrayOfVec2) {
            var _totalBuff = new Float32Array(arrayOfVec2.length * 2);
            var q;
            for (q = 0; q < arrayOfVec2.length; q++) {
                _totalBuff[q * 2 + 0] = arrayOfVec2[q].x;
                _totalBuff[q * 2 + 1] = arrayOfVec2[q].y;
            }
            return _totalBuff;
        };
        LVec2.createDefaultArray = function (size) {
            var _res = [];
            for (var i = 0; i < size; i++) {
                _res.push(new LVec2(0, 0));
            }
            return _res;
        };
        return LVec2;
    }());
    core.LVec2 = LVec2;
    var LVec3 = /** @class */ (function () {
        function LVec3(x, y, z) {
            this.x = x;
            this.y = y;
            this.z = z;
        }
        LVec3.prototype.clone = function () {
            return new LVec3(this.x, this.y, this.z);
        };
        LVec3.prototype.add = function (other) {
            this.x += other.x;
            this.y += other.y;
            this.z += other.z;
        };
        LVec3.prototype.subs = function (other) {
            this.x -= other.x;
            this.y -= other.y;
            this.z -= other.z;
        };
        LVec3.prototype.scale = function (sx, sy, sz) {
            this.x *= sx;
            this.y *= sy;
            this.z *= sz;
        };
        LVec3.prototype.length = function () {
            return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        };
        /* static methods ******************************/
        LVec3.createDefaultArray = function (size) {
            var _res = [];
            for (var i = 0; i < size; i++) {
                _res.push(new LVec3(0, 0, 0));
            }
            return _res;
        };
        LVec3.copy = function (outVec, inVec) {
            outVec.x = inVec.x;
            outVec.y = inVec.y;
            outVec.z = inVec.z;
        };
        LVec3.plus = function (v1, v2) {
            var _res = new LVec3(0, 0, 0);
            _res.x = v1.x + v2.x;
            _res.y = v1.y + v2.y;
            _res.z = v1.z + v2.z;
            return _res;
        };
        LVec3.minus = function (v1, v2) {
            var _res = new LVec3(0, 0, 0);
            _res.x = v1.x - v2.x;
            _res.y = v1.y - v2.y;
            _res.z = v1.z - v2.z;
            return _res;
        };
        LVec3.dot = function (v1, v2) {
            return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
        };
        LVec3.cross = function (v1, v2) {
            var _res = new LVec3(0, 0, 0);
            _res.x = v1.y * v2.z - v2.y * v1.z;
            _res.y = -v1.x * v2.z + v2.x * v1.z;
            _res.z = v1.x * v2.y - v2.x * v1.y;
            return _res;
        };
        LVec3.normalize = function (v) {
            var _len = v.length();
            var _v = new LVec3(v.x, v.y, v.z);
            _v.x = _v.x / _len;
            _v.y = _v.y / _len;
            _v.z = _v.z / _len;
            return _v;
        };
        LVec3.flip = function (v) {
            return new LVec3(-v.x, -v.y, -v.z);
            ;
        };
        LVec3.arrayToBuffer = function (arrayOfVec3) {
            var _totalBuff = new Float32Array(arrayOfVec3.length * 3);
            var q;
            for (q = 0; q < arrayOfVec3.length; q++) {
                _totalBuff[q * 3 + 0] = arrayOfVec3[q].x;
                _totalBuff[q * 3 + 1] = arrayOfVec3[q].y;
                _totalBuff[q * 3 + 2] = arrayOfVec3[q].z;
            }
            return _totalBuff;
        };
        return LVec3;
    }());
    core.LVec3 = LVec3;
    var LVec4 = /** @class */ (function () {
        function LVec4(x, y, z, w) {
            this.x = x;
            this.y = y;
            this.z = z;
            this.w = w;
        }
        return LVec4;
    }());
    core.LVec4 = LVec4;
    var LMat4 = /** @class */ (function () {
        function LMat4() {
            this.buff = new Float32Array(16);
            this.buff[0] = 1;
            this.buff[1] = 0;
            this.buff[2] = 0;
            this.buff[3] = 0;
            this.buff[4] = 0;
            this.buff[5] = 1;
            this.buff[6] = 0;
            this.buff[7] = 0;
            this.buff[8] = 0;
            this.buff[9] = 0;
            this.buff[10] = 1;
            this.buff[11] = 0;
            this.buff[12] = 0;
            this.buff[13] = 0;
            this.buff[14] = 0;
            this.buff[15] = 1;
        }
        LMat4.prototype.set = function (row, col, val) {
            this.buff[row + col * 4] = val;
        };
        LMat4.prototype.get = function (row, col) {
            return this.buff[row + col * 4];
        };
        LMat4.setToIdentity = function (outMat) {
            outMat.buff[0] = 1;
            outMat.buff[1] = 0;
            outMat.buff[2] = 0;
            outMat.buff[3] = 0;
            outMat.buff[4] = 0;
            outMat.buff[5] = 1;
            outMat.buff[6] = 0;
            outMat.buff[7] = 0;
            outMat.buff[8] = 0;
            outMat.buff[9] = 0;
            outMat.buff[10] = 1;
            outMat.buff[11] = 0;
            outMat.buff[12] = 0;
            outMat.buff[13] = 0;
            outMat.buff[14] = 0;
            outMat.buff[15] = 1;
        };
        LMat4.fromBufferInPlace = function (outMat, data, isColumnMajor) {
            for (var i = 0; i < 4; i++) {
                for (var j = 0; j < 4; j++) {
                    var _dataIndx = (isColumnMajor) ? (i + j * 4) : (j + i * 4);
                    outMat.buff[i + j * 4] = data[_dataIndx];
                }
            }
        };
        LMat4.fromBuffer = function (data, isColumnMajor) {
            var _res = new LMat4();
            LMat4.fromBufferInPlace(_res, data, isColumnMajor);
            return _res;
        };
        LMat4.copy = function (outMat, inMat) {
            var i, j;
            for (i = 0; i < 4; i++) {
                for (j = 0; j < 4; j++) {
                    var _indx = i + j * 4;
                    outMat.buff[_indx] = inMat.buff[_indx];
                }
            }
        };
        LMat4.dot = function (mat1, mat2) {
            var _res = new LMat4();
            var i;
            var j;
            var c;
            for (i = 0; i < 4; i++) {
                for (j = 0; j < 4; j++) {
                    for (c = 0; c < 4; c++) {
                        _res.set(i, j, _res.get(i, j) + mat1.get(i, c) * mat2.get(c, j));
                    }
                }
            }
            return _res;
        };
        LMat4.translationInPlace = function (outMat, t) {
            outMat.buff[12] = t.x;
            outMat.buff[13] = t.y;
            outMat.buff[14] = t.z;
        };
        LMat4.translation = function (t) {
            var _res = new LMat4();
            LMat4.translationInPlace(_res, t);
            return _res;
        };
        LMat4.rotationX = function (ang) {
            var _res = new LMat4();
            var _c = Math.cos(ang);
            var _s = Math.sin(ang);
            _res.buff[0] = 1;
            _res.buff[4] = 0;
            _res.buff[8] = 0;
            _res.buff[1] = 0;
            _res.buff[5] = _c;
            _res.buff[9] = -_s;
            _res.buff[2] = 0;
            _res.buff[6] = _s;
            _res.buff[10] = _c;
            return _res;
        };
        LMat4.rotationY = function (ang) {
            var _res = new LMat4();
            var _c = Math.cos(ang);
            var _s = Math.sin(ang);
            _res.buff[0] = _c;
            _res.buff[4] = 0;
            _res.buff[8] = _s;
            _res.buff[1] = 0;
            _res.buff[5] = 1;
            _res.buff[9] = 0;
            _res.buff[2] = -_s;
            _res.buff[6] = 0;
            _res.buff[10] = _c;
            return _res;
        };
        LMat4.rotationZ = function (ang) {
            var _res = new LMat4();
            var _c = Math.cos(ang);
            var _s = Math.sin(ang);
            _res.buff[0] = _c;
            _res.buff[4] = -_s;
            _res.buff[8] = 0;
            _res.buff[1] = _s;
            _res.buff[5] = _c;
            _res.buff[9] = 0;
            _res.buff[2] = 0;
            _res.buff[6] = 0;
            _res.buff[10] = 1;
            return _res;
        };
        LMat4.rotationAroundAxisInPlace = function (outMat, axis, angle) {
            var _nAxis = LVec3.normalize(axis);
            var _c = Math.cos(angle);
            var _s = Math.sin(angle);
            var _ux = _nAxis.x;
            var _uy = _nAxis.y;
            var _uz = _nAxis.z;
            outMat.buff[0] = _c + _ux * _ux * (1 - _c);
            outMat.buff[1] = _ux * _uy * (1 - _c) + _uz * _s;
            outMat.buff[2] = _uz * _ux * (1 - _c) - _uy * _s;
            outMat.buff[4] = _ux * _uy * (1 - _c) - _uz * _s;
            outMat.buff[5] = _c + _uy * _uy * (1 - _c);
            outMat.buff[6] = _uz * _uy * (1 - _c) + _ux * _s;
            outMat.buff[8] = _ux * _uz * (1 - _c) + _uy * _s;
            outMat.buff[9] = _uy * _uz * (1 - _c) - _ux * _s;
            outMat.buff[10] = _c + _uz * _uz * (1 - _c);
        };
        LMat4.rotationAroundAxis = function (axis, angle) {
            var _res = new LMat4();
            LMat4.rotationAroundAxisInPlace(_res, axis, angle);
            return _res;
        };
        LMat4.translationAlongAxisInPlace = function (outMat, axis, dist) {
            outMat.buff[12] = axis.x * dist;
            outMat.buff[13] = axis.y * dist;
            outMat.buff[14] = axis.z * dist;
        };
        LMat4.translationAlongAxis = function (axis, dist) {
            var _res = new LMat4();
            LMat4.translationAlongAxisInPlace(_res, axis, dist);
            return _res;
        };
        LMat4.scale = function (sx, sy, sz) {
            var _res = new LMat4();
            _res.buff[0] = sx;
            _res.buff[4] = 0;
            _res.buff[8] = 0;
            _res.buff[1] = 0;
            _res.buff[5] = sy;
            _res.buff[9] = 0;
            _res.buff[2] = 0;
            _res.buff[6] = 0;
            _res.buff[10] = sz;
            return _res;
        };
        LMat4.perspective = function (fov, aspect, zNear, zFar) {
            var _res = new LMat4();
            var _ht = Math.tan((fov / 2) * (Math.PI / 180));
            _res.buff[0] = 1 / (_ht * aspect);
            _res.buff[4] = 0;
            _res.buff[8] = 0;
            _res.buff[12] = 0;
            _res.buff[1] = 0;
            _res.buff[5] = 1 / _ht;
            _res.buff[9] = 0;
            _res.buff[13] = 0;
            _res.buff[2] = 0;
            _res.buff[6] = 0;
            _res.buff[10] = -(zFar + zNear) / (zFar - zNear);
            _res.buff[14] = -2 * (zFar * zNear) / (zFar - zNear);
            _res.buff[3] = 0;
            _res.buff[7] = 0;
            _res.buff[11] = -1;
            _res.buff[15] = 0;
            return _res;
        };
        LMat4.ortho = function (width, height, zNear, zFar) {
            var _res = new LMat4();
            _res.buff[0] = 1 / (width / 2);
            _res.buff[4] = 0;
            _res.buff[8] = 0;
            _res.buff[12] = 0;
            _res.buff[1] = 0;
            _res.buff[5] = 1 / (height / 2);
            _res.buff[9] = 0;
            _res.buff[13] = 0;
            _res.buff[2] = 0;
            _res.buff[6] = 0;
            _res.buff[10] = -2 / (zFar - zNear);
            _res.buff[14] = -(zFar + zNear) / (zFar - zNear);
            _res.buff[3] = 0;
            _res.buff[7] = 0;
            _res.buff[11] = 0;
            _res.buff[15] = 1;
            return _res;
        };
        LMat4.fromEuler = function (euler) {
            var _res = new LMat4();
            var _c1, _c2, _c3 = 0.0;
            var _s1, _s2, _s3 = 0.0;
            _c1 = Math.cos(euler.z);
            _s1 = Math.sin(euler.z);
            _c2 = Math.cos(euler.y);
            _s2 = Math.sin(euler.y);
            _c3 = Math.cos(euler.x);
            _s3 = Math.sin(euler.x);
            _res.buff[0] = _c1 * _c2;
            _res.buff[1] = _s1 * _c2;
            _res.buff[2] = -_s2;
            _res.buff[3] = 0;
            _res.buff[4] = _c1 * _s2 * _s3 - _s1 * _c3;
            _res.buff[5] = _c1 * _c3 + _s1 * _s2 * _s3;
            _res.buff[6] = _c2 * _s3;
            _res.buff[7] = 0;
            _res.buff[8] = _s1 * _s3 + _c1 * _s2 * _c3;
            _res.buff[9] = _s1 * _s2 * _c3 - _c1 * _s3;
            _res.buff[10] = _c2 * _c3;
            _res.buff[11] = 0;
            return _res;
        };
        LMat4.fromEulerInPlace = function (outMat, euler) {
            var _c1, _c2, _c3 = 0.0;
            var _s1, _s2, _s3 = 0.0;
            _c1 = Math.cos(euler.z);
            _s1 = Math.sin(euler.z);
            _c2 = Math.cos(euler.y);
            _s2 = Math.sin(euler.y);
            _c3 = Math.cos(euler.x);
            _s3 = Math.sin(euler.x);
            // X-Y-Z
            outMat.buff[0] = _c1 * _c2;
            outMat.buff[1] = _c2 * _s1;
            outMat.buff[2] = -_s2;
            outMat.buff[3] = 0;
            outMat.buff[4] = _c1 * _s2 * _s3 - _c3 * _s1;
            outMat.buff[5] = _c1 * _c3 + _s1 * _s2 * _s3;
            outMat.buff[6] = _c2 * _s3;
            outMat.buff[7] = 0;
            outMat.buff[8] = _s1 * _s3 + _c1 * _c3 * _s2;
            outMat.buff[9] = _c3 * _s1 * _s2 - _c1 * _s3;
            outMat.buff[10] = _c2 * _c3;
            outMat.buff[11] = 0;
        };
        LMat4.fromPosEuler = function (pos, euler) {
            var _res = new LMat4();
            var _c1, _c2, _c3 = 0.0;
            var _s1, _s2, _s3 = 0.0;
            _c1 = Math.cos(euler.z);
            _s1 = Math.sin(euler.z);
            _c2 = Math.cos(euler.y);
            _s2 = Math.sin(euler.y);
            _c3 = Math.cos(euler.x);
            _s3 = Math.sin(euler.x);
            _res.buff[0] = _c1 * _c2;
            _res.buff[1] = _c2 * _s1;
            _res.buff[2] = -_s2;
            _res.buff[3] = 0;
            _res.buff[4] = _c1 * _s2 * _s3 - _c3 * _s1;
            _res.buff[5] = _c1 * _c3 + _s1 * _s2 * _s3;
            _res.buff[6] = _c2 * _s3;
            _res.buff[7] = 0;
            _res.buff[8] = _s1 * _s3 + _c1 * _c3 * _s2;
            _res.buff[9] = _c3 * _s1 * _s2 - _c1 * _s3;
            _res.buff[10] = _c2 * _c3;
            _res.buff[11] = 0;
            _res.buff[12] = pos.x;
            _res.buff[13] = pos.y;
            _res.buff[14] = pos.z;
            _res.buff[15] = 1;
            return _res;
        };
        LMat4.fromPosEulerInPlace = function (outMat, pos, euler) {
            var _c1, _c2, _c3 = 0.0;
            var _s1, _s2, _s3 = 0.0;
            _c1 = Math.cos(euler.z);
            _s1 = Math.sin(euler.z);
            _c2 = Math.cos(euler.y);
            _s2 = Math.sin(euler.y);
            _c3 = Math.cos(euler.x);
            _s3 = Math.sin(euler.x);
            outMat.buff[0] = _c1 * _c2;
            outMat.buff[1] = _c2 * _s1;
            outMat.buff[2] = -_s2;
            outMat.buff[3] = 0;
            outMat.buff[4] = _c1 * _s2 * _s3 - _s1 * _c3;
            outMat.buff[5] = _c1 * _c3 + _s1 * _s2 * _s3;
            outMat.buff[6] = _c2 * _s3;
            outMat.buff[7] = 0;
            outMat.buff[8] = _s1 * _s3 + _c1 * _s2 * _c3;
            outMat.buff[9] = _s1 * _s2 * _c3 - _c1 * _s3;
            outMat.buff[10] = _c2 * _c3;
            outMat.buff[11] = 0;
            outMat.buff[12] = pos.x;
            outMat.buff[13] = pos.y;
            outMat.buff[14] = pos.z;
            outMat.buff[15] = 1;
        };
        LMat4.fromPosRotMat = function (pos, rotMat) {
            var _res = new LMat4();
            _res.buff[0] = rotMat.buff[0];
            _res.buff[1] = rotMat.buff[1];
            _res.buff[2] = rotMat.buff[2];
            _res.buff[3] = 0;
            _res.buff[4] = rotMat.buff[4];
            _res.buff[5] = rotMat.buff[5];
            _res.buff[6] = rotMat.buff[6];
            _res.buff[7] = 0;
            _res.buff[8] = rotMat.buff[8];
            _res.buff[9] = rotMat.buff[9];
            _res.buff[10] = rotMat.buff[10];
            _res.buff[11] = 0;
            _res.buff[12] = pos.x;
            _res.buff[13] = pos.y;
            _res.buff[14] = pos.z;
            _res.buff[15] = 1;
            return _res;
        };
        LMat4.fromPosRotMatInPlace = function (outMat, pos, rotMat) {
            outMat.buff[0] = rotMat.buff[0];
            outMat.buff[1] = rotMat.buff[1];
            outMat.buff[2] = rotMat.buff[2];
            outMat.buff[3] = 0;
            outMat.buff[4] = rotMat.buff[4];
            outMat.buff[5] = rotMat.buff[5];
            outMat.buff[6] = rotMat.buff[6];
            outMat.buff[7] = 0;
            outMat.buff[8] = rotMat.buff[8];
            outMat.buff[9] = rotMat.buff[9];
            outMat.buff[10] = rotMat.buff[10];
            outMat.buff[11] = 0;
            outMat.buff[12] = pos.x;
            outMat.buff[13] = pos.y;
            outMat.buff[14] = pos.z;
            outMat.buff[15] = 1;
        };
        LMat4.fromPosRotScale = function (pos, rotMat, scale) {
            var _res = new LMat4();
            _res.buff[0] = scale.x * rotMat.buff[0];
            _res.buff[1] = scale.x * rotMat.buff[1];
            _res.buff[2] = scale.x * rotMat.buff[2];
            _res.buff[3] = 0;
            _res.buff[4] = scale.y * rotMat.buff[4];
            _res.buff[5] = scale.y * rotMat.buff[5];
            _res.buff[6] = scale.y * rotMat.buff[6];
            _res.buff[7] = 0;
            _res.buff[8] = scale.z * rotMat.buff[8];
            _res.buff[9] = scale.z * rotMat.buff[9];
            _res.buff[10] = scale.z * rotMat.buff[10];
            _res.buff[11] = 0;
            _res.buff[12] = pos.x;
            _res.buff[13] = pos.y;
            _res.buff[14] = pos.z;
            _res.buff[15] = 1;
            return _res;
        };
        LMat4.fromPosRotScaleInPlace = function (outMat, pos, rotMat, scale) {
            outMat.buff[0] = scale.x * rotMat.buff[0];
            outMat.buff[1] = scale.x * rotMat.buff[1];
            outMat.buff[2] = scale.x * rotMat.buff[2];
            outMat.buff[3] = 0;
            outMat.buff[4] = scale.y * rotMat.buff[4];
            outMat.buff[5] = scale.y * rotMat.buff[5];
            outMat.buff[6] = scale.y * rotMat.buff[6];
            outMat.buff[7] = 0;
            outMat.buff[8] = scale.z * rotMat.buff[8];
            outMat.buff[9] = scale.z * rotMat.buff[9];
            outMat.buff[10] = scale.z * rotMat.buff[10];
            outMat.buff[11] = 0;
            outMat.buff[12] = pos.x;
            outMat.buff[13] = pos.y;
            outMat.buff[14] = pos.z;
            outMat.buff[15] = 1;
        };
        LMat4.extractColumn = function (mat, columnIndx) {
            var _res = new LVec3(0, 0, 0);
            if (columnIndx < 0 || columnIndx > 3) {
                console.warn('LMat4> trying to extract column ' +
                    columnIndx + ' which is out of range');
                return _res;
            }
            _res.x = mat.buff[4 * columnIndx + 0];
            _res.y = mat.buff[4 * columnIndx + 1];
            _res.z = mat.buff[4 * columnIndx + 2];
            return _res;
        };
        LMat4.extractColumnInPlace = function (outVec, mat, columnIndx) {
            if (columnIndx < 0 || columnIndx > 3) {
                console.warn('LMat4> trying to extract column ' +
                    columnIndx + ' which is out of range');
                return;
            }
            outVec.x = mat.buff[4 * columnIndx + 0];
            outVec.y = mat.buff[4 * columnIndx + 1];
            outVec.z = mat.buff[4 * columnIndx + 2];
        };
        LMat4.extractPosition = function (mat) {
            return LMat4.extractColumn(mat, 3);
        };
        LMat4.extractPositionInPlace = function (outVec, mat) {
            LMat4.extractColumnInPlace(outVec, mat, 3);
        };
        /*
        * extract euler angles from rotation matrix, asumming ...
        * tiat bryan angles and xyz extrinsic convention
        * TODO: Check cases for y angle, as we may be throwing away ...
        * the sign in the sqrt calculation
        */
        LMat4.extractEulerFromRotation = function (mat) {
            var _res = new LVec3(0, 0, 0);
            var _r11 = mat.get(0, 0);
            var _r21 = mat.get(1, 0);
            var _r31 = mat.get(2, 0);
            var _r32 = mat.get(2, 1);
            var _r33 = mat.get(2, 2);
            _res.x = Math.atan2(_r32, _r33);
            _res.y = Math.atan2(-_r31, Math.sqrt(_r11 * _r11 + _r21 * _r21));
            _res.z = Math.atan2(_r21, _r11);
            return _res;
        };
        LMat4.extractEulerFromRotationInPlace = function (outVec, mat) {
            var _r11 = mat.get(0, 0);
            var _r21 = mat.get(1, 0);
            var _r31 = mat.get(2, 0);
            var _r32 = mat.get(2, 1);
            var _r33 = mat.get(2, 2);
            outVec.x = Math.atan2(_r32, _r33);
            outVec.y = Math.atan2(-_r31, Math.sqrt(_r11 * _r11 + _r21 * _r21));
            outVec.z = Math.atan2(_r21, _r11);
        };
        LMat4.extractRotation = function (inMat) {
            var _res = new LMat4();
            _res.buff[0] = inMat.buff[0];
            _res.buff[1] = inMat.buff[1];
            _res.buff[2] = inMat.buff[2];
            _res.buff[4] = inMat.buff[4];
            _res.buff[5] = inMat.buff[5];
            _res.buff[6] = inMat.buff[6];
            _res.buff[8] = inMat.buff[8];
            _res.buff[9] = inMat.buff[9];
            _res.buff[10] = inMat.buff[10];
            return _res;
        };
        LMat4.extractRotationInPlace = function (outMat, inMat) {
            outMat.buff[0] = inMat.buff[0];
            outMat.buff[1] = inMat.buff[1];
            outMat.buff[2] = inMat.buff[2];
            outMat.buff[4] = inMat.buff[4];
            outMat.buff[5] = inMat.buff[5];
            outMat.buff[6] = inMat.buff[6];
            outMat.buff[8] = inMat.buff[8];
            outMat.buff[9] = inMat.buff[9];
            outMat.buff[10] = inMat.buff[10];
        };
        return LMat4;
    }());
    core.LMat4 = LMat4;
    function transposeMat44(mat) {
        var _res = new LMat4();
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                _res.buff[i + j * 4] = mat.buff[j + i * 4];
            }
        }
        return _res;
    }
    core.transposeMat44 = transposeMat44;
    function transposeMat44InPlace(outMat, mat) {
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                outMat.buff[i + j * 4] = mat.buff[j + i * 4];
            }
        }
    }
    core.transposeMat44InPlace = transposeMat44InPlace;
    function inversePureRotationMat44(mat) {
        return transposeMat44(mat);
    }
    core.inversePureRotationMat44 = inversePureRotationMat44;
    function inversePureRotationMat44InPlace(outMat, mat) {
        transposeMat44InPlace(outMat, mat);
    }
    core.inversePureRotationMat44InPlace = inversePureRotationMat44InPlace;
    function inverseRigidBodyTransformMat44(mat) {
        var _R = LMat4.extractRotation(mat);
        var _t = LMat4.extractPosition(mat);
        var _Rinv = transposeMat44(_R);
        var _tinv = new LVec3(0, 0, 0);
        _tinv.x = _Rinv.get(0, 0) * _t.x + _Rinv.get(0, 1) * _t.y + _Rinv.get(0, 2) * _t.z;
        _tinv.y = _Rinv.get(1, 0) * _t.x + _Rinv.get(1, 1) * _t.y + _Rinv.get(1, 2) * _t.z;
        _tinv.z = _Rinv.get(2, 0) * _t.x + _Rinv.get(2, 1) * _t.y + _Rinv.get(2, 2) * _t.z;
        var _invMat = new LMat4();
        // Put rotation part
        LMat4.copy(_invMat, _Rinv);
        // Put translation part
        _invMat.set(0, 3, _tinv.x);
        _invMat.set(1, 3, _tinv.y);
        _invMat.set(2, 3, _tinv.z);
        return _invMat;
    }
    core.inverseRigidBodyTransformMat44 = inverseRigidBodyTransformMat44;
    function inverseRigidBodyTransformMat44InPlace(outMat, mat) {
        transposeMat44InPlace(outMat, mat);
        outMat.buff[12] = -(outMat.buff[0] * mat.buff[12] + outMat.buff[4] * mat.buff[13] + outMat.buff[8] * mat.buff[14]);
        outMat.buff[13] = -(outMat.buff[1] * mat.buff[12] + outMat.buff[5] * mat.buff[13] + outMat.buff[9] * mat.buff[14]);
        outMat.buff[14] = -(outMat.buff[2] * mat.buff[12] + outMat.buff[6] * mat.buff[13] + outMat.buff[10] * mat.buff[14]);
    }
    core.inverseRigidBodyTransformMat44InPlace = inverseRigidBodyTransformMat44InPlace;
    function inverseMat44(mat) {
        var _res = new LMat4();
        var _r11 = mat.get(0, 0);
        var _r12 = mat.get(0, 1);
        var _r21 = mat.get(1, 0);
        var _r22 = mat.get(1, 1);
        var _r31 = mat.get(2, 0);
        var _r32 = mat.get(2, 1);
        var _r41 = mat.get(3, 0);
        var _r42 = mat.get(3, 1);
        var _r13 = mat.get(0, 2);
        var _r14 = mat.get(0, 3);
        var _r23 = mat.get(1, 2);
        var _r24 = mat.get(1, 3);
        var _r33 = mat.get(2, 2);
        var _r34 = mat.get(2, 3);
        var _r43 = mat.get(3, 2);
        var _r44 = mat.get(3, 3);
        // Calculate some intermediate values - "minors" of order 2
        var _m3434 = _r33 * _r44 - _r43 * _r34;
        var _m2434 = _r23 * _r44 - _r43 * _r24;
        var _m1434 = _r13 * _r44 - _r43 * _r14;
        var _m2334 = _r23 * _r34 - _r33 * _r24;
        var _m1334 = _r13 * _r34 - _r33 * _r14;
        var _m1234 = _r13 * _r24 - _r23 * _r14;
        var _m2312 = _r21 * _r32 - _r31 * _r22;
        var _m2412 = _r21 * _r42 - _r41 * _r22;
        var _m3412 = _r31 * _r42 - _r41 * _r32;
        var _m1312 = _r11 * _r32 - _r31 * _r12;
        var _m1412 = _r11 * _r42 - _r41 * _r12;
        var _m1212 = _r11 * _r22 - _r21 * _r12;
        var _det = _r11 * (_r22 * _m3434 - _r32 * _m2434 + _r42 * _m2334) -
            _r21 * (_r12 * _m3434 - _r32 * _m1434 + _r42 * _m1334) +
            _r31 * (_r12 * _m2434 - _r22 * _m1434 + _r42 * _m1234) -
            _r41 * (_r12 * _m2334 - _r22 * _m1334 + _r32 * _m1234);
        var _invdet = 1 / _det;
        // Generate transpose of "cofactors" matrix ( also divide by determinant ) in place
        _res.set(0, 0, (_r22 * _m3434 - _r32 * _m2434 + _r42 * _m2334) * _invdet);
        _res.set(0, 1, (_r12 * _m3434 - _r32 * _m1434 + _r42 * _m1334) * -_invdet);
        _res.set(0, 2, (_r12 * _m2434 - _r22 * _m1434 + _r42 * _m1234) * _invdet);
        _res.set(0, 3, (_r12 * _m2334 - _r22 * _m1334 + _r32 * _m1234) * -_invdet);
        _res.set(1, 0, (_r21 * _m3434 - _r31 * _m2434 + _r41 * _m2334) * -_invdet);
        _res.set(1, 1, (_r11 * _m3434 - _r31 * _m1434 + _r41 * _m1334) * _invdet);
        _res.set(1, 2, (_r11 * _m2434 - _r21 * _m1434 + _r41 * _m1234) * -_invdet);
        _res.set(1, 3, (_r11 * _m2334 - _r21 * _m1334 + _r31 * _m1234) * _invdet);
        _res.set(2, 0, (_r44 * _m2312 - _r34 * _m2412 + _r24 * _m3412) * _invdet);
        _res.set(2, 1, (_r44 * _m1312 - _r34 * _m1412 + _r14 * _m3412) * -_invdet);
        _res.set(2, 2, (_r44 * _m1212 - _r24 * _m1412 + _r14 * _m2412) * _invdet);
        _res.set(2, 3, (_r34 * _m1212 - _r24 * _m1312 + _r14 * _m2312) * -_invdet);
        _res.set(3, 0, (_r43 * _m2312 - _r33 * _m2412 + _r23 * _m3412) * -_invdet);
        _res.set(3, 1, (_r43 * _m1312 - _r33 * _m1412 + _r13 * _m3412) * _invdet);
        _res.set(3, 2, (_r43 * _m1212 - _r23 * _m1412 + _r13 * _m2412) * -_invdet);
        _res.set(3, 3, (_r33 * _m1212 - _r23 * _m1312 + _r13 * _m2312) * _invdet);
        return _res;
    }
    core.inverseMat44 = inverseMat44;
    function inverseMat44InPlace(outMat, mat) {
        var _r11 = mat.get(0, 0);
        var _r12 = mat.get(0, 1);
        var _r21 = mat.get(1, 0);
        var _r22 = mat.get(1, 1);
        var _r31 = mat.get(2, 0);
        var _r32 = mat.get(2, 1);
        var _r41 = mat.get(3, 0);
        var _r42 = mat.get(3, 1);
        var _r13 = mat.get(0, 2);
        var _r14 = mat.get(0, 3);
        var _r23 = mat.get(1, 2);
        var _r24 = mat.get(1, 3);
        var _r33 = mat.get(2, 2);
        var _r34 = mat.get(2, 3);
        var _r43 = mat.get(3, 2);
        var _r44 = mat.get(3, 3);
        // Calculate some intermediate values - "minors" of order 2
        var _m3434 = _r33 * _r44 - _r43 * _r34;
        var _m2434 = _r23 * _r44 - _r43 * _r24;
        var _m1434 = _r13 * _r44 - _r43 * _r14;
        var _m2334 = _r23 * _r34 - _r33 * _r24;
        var _m1334 = _r13 * _r34 - _r33 * _r14;
        var _m1234 = _r13 * _r24 - _r23 * _r14;
        var _m2312 = _r21 * _r32 - _r31 * _r22;
        var _m2412 = _r21 * _r42 - _r41 * _r22;
        var _m3412 = _r31 * _r42 - _r41 * _r32;
        var _m1312 = _r11 * _r32 - _r31 * _r12;
        var _m1412 = _r11 * _r42 - _r41 * _r12;
        var _m1212 = _r11 * _r22 - _r21 * _r12;
        var _det = _r11 * (_r22 * _m3434 - _r32 * _m2434 + _r42 * _m2334) -
            _r21 * (_r12 * _m3434 - _r32 * _m1434 + _r42 * _m1334) +
            _r31 * (_r12 * _m2434 - _r22 * _m1434 + _r42 * _m1234) -
            _r41 * (_r12 * _m2334 - _r22 * _m1334 + _r32 * _m1234);
        var _invdet = 1 / _det;
        // Generate transpose of "cofactors" matrix ( also divide by determinant ) in place
        outMat.set(0, 0, (_r22 * _m3434 - _r32 * _m2434 + _r42 * _m2334) * _invdet);
        outMat.set(0, 1, (_r12 * _m3434 - _r32 * _m1434 + _r42 * _m1334) * -_invdet);
        outMat.set(0, 2, (_r12 * _m2434 - _r22 * _m1434 + _r42 * _m1234) * _invdet);
        outMat.set(0, 3, (_r12 * _m2334 - _r22 * _m1334 + _r32 * _m1234) * -_invdet);
        outMat.set(1, 0, (_r21 * _m3434 - _r31 * _m2434 + _r41 * _m2334) * -_invdet);
        outMat.set(1, 1, (_r11 * _m3434 - _r31 * _m1434 + _r41 * _m1334) * _invdet);
        outMat.set(1, 2, (_r11 * _m2434 - _r21 * _m1434 + _r41 * _m1234) * -_invdet);
        outMat.set(1, 3, (_r11 * _m2334 - _r21 * _m1334 + _r31 * _m1234) * _invdet);
        outMat.set(2, 0, (_r44 * _m2312 - _r34 * _m2412 + _r24 * _m3412) * _invdet);
        outMat.set(2, 1, (_r44 * _m1312 - _r34 * _m1412 + _r14 * _m3412) * -_invdet);
        outMat.set(2, 2, (_r44 * _m1212 - _r24 * _m1412 + _r14 * _m2412) * _invdet);
        outMat.set(2, 3, (_r34 * _m1212 - _r24 * _m1312 + _r14 * _m2312) * -_invdet);
        outMat.set(3, 0, (_r43 * _m2312 - _r33 * _m2412 + _r23 * _m3412) * -_invdet);
        outMat.set(3, 1, (_r43 * _m1312 - _r33 * _m1412 + _r13 * _m3412) * _invdet);
        outMat.set(3, 2, (_r43 * _m1212 - _r23 * _m1412 + _r13 * _m2412) * -_invdet);
        outMat.set(3, 3, (_r33 * _m1212 - _r23 * _m1312 + _r13 * _m2312) * _invdet);
    }
    core.inverseMat44InPlace = inverseMat44InPlace;
    function mulMatVec44(mat, vec) {
        var _res = new LVec4(0, 0, 0, 0);
        return _res;
    }
    core.mulMatVec44 = mulMatVec44;
    function mulMatMat44(mat1, mat2) {
        var _res = new LMat4();
        var i, j, k = 0;
        for (i = 0; i < 4; i++) {
            for (j = 0; j < 4; j++) {
                _res.buff[i + j * 4] = 0;
                for (k = 0; k < 4; k++) {
                    // Matrices are stored in column major form, so ...
                    // we use this indexing for the multiplication
                    // k + 4 * (fixed) -> over column
                    // (fixed) + 4 * k -> over row
                    _res.buff[i + j * 4] += mat1.buff[i + k * 4] *
                        mat2.buff[k + j * 4];
                }
            }
        }
        return _res;
    }
    core.mulMatMat44 = mulMatMat44;
    function mulMatMat44InPlace(outMat, mat1, mat2) {
        var i, j, k = 0;
        for (i = 0; i < 4; i++) {
            for (j = 0; j < 4; j++) {
                outMat.buff[i + j * 4] = 0;
                for (k = 0; k < 4; k++) {
                    // Matrices are stored in column major form, so ...
                    // we use this indexing for the multiplication
                    // k + 4 * (fixed) -> over column
                    // (fixed) + 4 * k -> over row
                    outMat.buff[i + j * 4] += mat1.buff[i + k * 4] *
                        mat2.buff[k + j * 4];
                }
            }
        }
    }
    core.mulMatMat44InPlace = mulMatMat44InPlace;
    function degrees(rads) {
        return rads * 180.0 / Math.PI;
    }
    core.degrees = degrees;
    function radians(deg) {
        return deg * Math.PI / 180.0;
    }
    core.radians = radians;
    var LInd3 = /** @class */ (function () {
        function LInd3(i1, i2, i3) {
            this.buff = new Uint16Array(3);
            this.buff[0] = i1;
            this.buff[1] = i2;
            this.buff[2] = i3;
        }
        LInd3.arrayToBuffer = function (arrayOfInd3) {
            var _totalBuff = new Uint16Array(arrayOfInd3.length * 3);
            var q;
            for (q = 0; q < arrayOfInd3.length; q++) {
                _totalBuff[q * 3 + 0] = arrayOfInd3[q].buff[0];
                _totalBuff[q * 3 + 1] = arrayOfInd3[q].buff[1];
                _totalBuff[q * 3 + 2] = arrayOfInd3[q].buff[2];
            }
            return _totalBuff;
        };
        return LInd3;
    }());
    core.LInd3 = LInd3;
    core.WORLD_UP = new LVec3(0, 0, 0);
    core.AXIS_X = new LVec3(1, 0, 0);
    core.AXIS_Y = new LVec3(0, 1, 0);
    core.AXIS_Z = new LVec3(0, 0, 1);
    core.AXIS_NEG_X = new LVec3(-1, 0, 0);
    core.AXIS_NEG_Y = new LVec3(0, -1, 0);
    core.AXIS_NEG_Z = new LVec3(0, 0, -1);
    core.ROT_X_90 = LMat4.rotationX(0.5 * Math.PI);
    core.ROT_Y_90 = LMat4.rotationY(0.5 * Math.PI);
    core.ROT_Z_90 = LMat4.rotationZ(0.5 * Math.PI);
    core.ROT_X_NEG_90 = LMat4.rotationX(-0.5 * Math.PI);
    core.ROT_Y_NEG_90 = LMat4.rotationY(-0.5 * Math.PI);
    core.ROT_Z_NEG_90 = LMat4.rotationZ(-0.5 * Math.PI);
    core.ROT_X_180 = LMat4.rotationX(Math.PI);
    core.ROT_Y_180 = LMat4.rotationY(Math.PI);
    core.ROT_Z_180 = LMat4.rotationZ(Math.PI);
    core.ROT_X_NEG_180 = LMat4.rotationX(-Math.PI);
    core.ROT_Y_NEG_180 = LMat4.rotationY(-Math.PI);
    core.ROT_Z_NEG_180 = LMat4.rotationZ(-Math.PI);
    core.RED = new LVec3(1, 0, 0);
    core.GREEN = new LVec3(0, 1, 0);
    core.BLUE = new LVec3(0, 0, 1);
    core.CYAN = new LVec3(0, 1, 1);
    core.MAGENTA = new LVec3(1, 0, 1);
    core.YELLOW = new LVec3(1, 1, 0);
    core.GRAY = new LVec3(0.4, 0.4, 0.4);
    core.LIGHT_GRAY = new LVec3(0.701, 0.706, 0.658);
    core.DEFAULT_AMBIENT = new LVec3(0.701, 0.706, 0.658);
    core.DEFAULT_DIFFUSE = new LVec3(0.701, 0.706, 0.658);
    core.DEFAULT_SPECULAR = new LVec3(0.701, 0.706, 0.658);
    core.DEFAULT_SHININESS = 32.0;
    core.ORIGIN = new LVec3(0, 0, 0);
    core.ZERO = new LVec3(0, 0, 0);
})(core || (core = {}));
