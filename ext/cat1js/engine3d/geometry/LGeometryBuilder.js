/// <reference path="../geometry/LGeometry3d.ts" />
var engine3d;
(function (engine3d) {
    var LGeometryBuilder = /** @class */ (function () {
        function LGeometryBuilder() {
        }
        LGeometryBuilder.createSphere = function (radius, levelDivision, numLevels) {
            var _geometry = null;
            var _vertices = [];
            var _normals = [];
            var _texCoords = []; // default texCoords for this geometry
            var _indices = [];
            // adapted from here :
            // https://www.opengl.org/discussion_boards/showthread.php/159584-sphere-generation
            var _x, _y, _z, _r;
            var l, d, s;
            // Compute vertices and normals using the given parameters
            for (l = -numLevels; l <= numLevels; l++) {
                _y = Math.sin(0.5 * Math.PI * (l / (numLevels + 1)));
                for (d = 0; d < levelDivision; d++) {
                    _r = Math.sqrt(1.0 - _y * _y);
                    _x = _r * Math.cos(2.0 * Math.PI * (d / levelDivision));
                    _z = _r * Math.sin(2.0 * Math.PI * (d / levelDivision));
                    _vertices.push(new core.LVec3(radius * _x, radius * _y, radius * _z));
                    _normals.push(new core.LVec3(_x, _y, _z));
                    // from here: https://en.wikipedia.org/wiki/UV_mapping#Finding_UV_on_a_sphere
                    var _u = void 0, _v = void 0;
                    _u = 0.5 + (Math.atan2(-_z, -_x) / (2 * Math.PI));
                    _v = 0.5 - (Math.asin(-_y) / Math.PI);
                    _texCoords.push(new core.LVec2(_u, _v));
                }
            }
            // Compute the indices-topology
            for (l = 0; l < 2 * numLevels; l++) {
                var _indxAtLevel = l * levelDivision;
                var _indxAtNextLevel = (l + 1) * levelDivision;
                // Connect sides
                for (s = 0; s < levelDivision; s++) {
                    var _p0 = _indxAtLevel + s;
                    var _p1 = _indxAtLevel + ((s + 1) % levelDivision);
                    var _p0n = _indxAtNextLevel + s;
                    var _p1n = _indxAtNextLevel + ((s + 1) % levelDivision);
                    _indices.push(new core.LInd3(_p0, _p1n, _p0n));
                    _indices.push(new core.LInd3(_p0, _p1, _p1n));
                }
            }
            _geometry = new engine3d.LGeometry3d(_vertices, _normals, _texCoords, _indices);
            return _geometry;
        };
        LGeometryBuilder.createBox = function (width, height, depth) {
            var _geometry = null;
            var _vertices = [];
            var _normals = [];
            var _texCoords = []; // default texCoords for this geometry
            var _indices = [];
            var _normalsSource = [];
            _normalsSource.push(new core.LVec3(0, 0, 1));
            _normalsSource.push(new core.LVec3(0, 0, -1));
            _normalsSource.push(new core.LVec3(0, 1, 0));
            _normalsSource.push(new core.LVec3(0, -1, 0));
            _normalsSource.push(new core.LVec3(1, 0, 0));
            _normalsSource.push(new core.LVec3(-1, 0, 0));
            var _scale = new core.LVec3(0.5 * width, 0.5 * height, 0.5 * depth);
            var q;
            // for each face, compute the vertices that form ...
            // the face perpendicular to that normal
            for (q = 0; q < _normalsSource.length; q++) {
                var _n = _normalsSource[q];
                // form a tri perpendicular right hand system
                var _s1 = new core.LVec3(_n.y, _n.z, _n.x);
                var _s2 = core.LVec3.cross(_n, _s1);
                // Add the indices accordingly
                _indices.push(new core.LInd3(_vertices.length, _vertices.length + 1, _vertices.length + 2));
                _indices.push(new core.LInd3(_vertices.length, _vertices.length + 2, _vertices.length + 3));
                // Generate each vertex of each face ...
                // according to these vectors
                var _v = void 0;
                _v = core.LVec3.minus(core.LVec3.minus(_n, _s1), _s2);
                _v.scale(_scale.x, _scale.y, _scale.z);
                _vertices.push(_v);
                _normals.push(new core.LVec3(_n.x, _n.y, _n.z));
                _texCoords.push(new core.LVec2(1, 1));
                _v = core.LVec3.minus(core.LVec3.plus(_n, _s1), _s2);
                _v.scale(_scale.x, _scale.y, _scale.z);
                _vertices.push(_v);
                _normals.push(new core.LVec3(_n.x, _n.y, _n.z));
                _texCoords.push(new core.LVec2(1, 0));
                _v = core.LVec3.plus(core.LVec3.plus(_n, _s1), _s2);
                _v.scale(_scale.x, _scale.y, _scale.z);
                _vertices.push(_v);
                _normals.push(new core.LVec3(_n.x, _n.y, _n.z));
                _texCoords.push(new core.LVec2(0, 0));
                _v = core.LVec3.plus(core.LVec3.minus(_n, _s1), _s2);
                _v.scale(_scale.x, _scale.y, _scale.z);
                _vertices.push(_v);
                _normals.push(new core.LVec3(_n.x, _n.y, _n.z));
                _texCoords.push(new core.LVec2(0, 1));
            }
            _geometry = new engine3d.LGeometry3d(_vertices, _normals, _texCoords, _indices);
            return _geometry;
        };
        // ************************************************************************************
        LGeometryBuilder.createCylinder = function (radius, height, sectionDivision) {
            var _geometry = null;
            var _vertices = [];
            var _texCoords = [];
            var _normals = [];
            var _indices = [];
            // Start cylinder tessellation
            // calculate section geometry
            var _sectionXZ = [];
            var _stepSectionAngle = 2 * Math.PI / sectionDivision;
            var q = 0;
            for (q = 0; q < sectionDivision; q++) {
                var _x = radius * Math.cos(q * _stepSectionAngle);
                var _z = radius * Math.sin(q * _stepSectionAngle);
                _sectionXZ.push(new core.LVec3(_x, 0, _z));
            }
            // calculate cylinder geometry
            var _baseIndx = 0;
            // up base *****************************************************************
            for (q = 0; q < _sectionXZ.length; q++) {
                _vertices.push(core.LVec3.plus(_sectionXZ[q], new core.LVec3(0, 0.5 * height, 0)));
                _normals.push(new core.LVec3(0, 1, 0));
                _texCoords.push(new core.LVec2(0.5 + (_sectionXZ[q].z / (2 * radius)), 0.5 + (_sectionXZ[q].x / (2 * radius))));
            }
            for (q = 1; q <= _sectionXZ.length - 2; q++) {
                _indices.push(new core.LInd3(_baseIndx, _baseIndx + q, _baseIndx + q + 1));
            }
            _baseIndx += _vertices.length;
            // *************************************************************************
            // body surface ************************************************************
            for (q = 0; q < _sectionXZ.length; q++) {
                // quad vertices
                var _p0 = core.LVec3.plus(_sectionXZ[q], new core.LVec3(0, 0.5 * height, 0));
                var _p1 = core.LVec3.plus(_sectionXZ[(q + 1) % _sectionXZ.length], new core.LVec3(0, 0.5 * height, 0));
                var _p2 = core.LVec3.plus(_sectionXZ[(q + 1) % _sectionXZ.length], new core.LVec3(0, -0.5 * height, 0));
                var _p3 = core.LVec3.plus(_sectionXZ[q], new core.LVec3(0, -0.5 * height, 0));
                _vertices.push(_p0);
                _vertices.push(_p1);
                _vertices.push(_p2);
                _vertices.push(_p3);
                _texCoords.push(new core.LVec2(0.5 + (Math.atan2(_p0.z, _p0.x) / (2 * Math.PI)), 0.5 + _p0.y / height));
                _texCoords.push(new core.LVec2(0.5 + (Math.atan2(_p1.z, _p1.x) / (2 * Math.PI)), 0.5 + _p1.y / height));
                _texCoords.push(new core.LVec2(0.5 + (Math.atan2(_p2.z, _p2.x) / (2 * Math.PI)), 0.5 + _p2.y / height));
                _texCoords.push(new core.LVec2(0.5 + (Math.atan2(_p3.z, _p3.x) / (2 * Math.PI)), 0.5 + _p3.y / height));
                // For "flat" normals
                // let _nx : number = Math.cos( ( q + 0.5 ) * _stepSectionAngle );
                // let _nz : number = Math.sin( ( q + 0.5 ) * _stepSectionAngle );
                // let _nQuad : core.LVec3 = new core.LVec3( _nx, 0, _nz );
                // _normals.push( _nQuad );
                // _normals.push( _nQuad );
                // _normals.push( _nQuad );
                // _normals.push( _nQuad );
                // For "smooth" normals
                var _nx1 = Math.cos((q) * _stepSectionAngle);
                var _nz1 = Math.sin((q) * _stepSectionAngle);
                var _nx2 = Math.cos((q + 1) * _stepSectionAngle);
                var _nz2 = Math.sin((q + 1) * _stepSectionAngle);
                var _nQuad1 = new core.LVec3(_nx1, 0, _nz1);
                var _nQuad2 = new core.LVec3(_nx2, 0, _nz2);
                _normals.push(_nQuad1);
                _normals.push(_nQuad2);
                _normals.push(_nQuad2);
                _normals.push(_nQuad1);
                _indices.push(new core.LInd3(_baseIndx, _baseIndx + 2, _baseIndx + 1));
                _indices.push(new core.LInd3(_baseIndx, _baseIndx + 3, _baseIndx + 2));
                _baseIndx += 4;
            }
            // *************************************************************************
            // down base ***************************************************************
            for (q = 0; q < _sectionXZ.length; q++) {
                _vertices.push(core.LVec3.plus(_sectionXZ[q], new core.LVec3(0, -0.5 * height, 0)));
                _normals.push(new core.LVec3(0, -1, 0));
                _texCoords.push(new core.LVec2(0.5 + (_sectionXZ[q].z / (2 * radius)), 0.5 + (_sectionXZ[q].x / (2 * radius))));
            }
            for (q = 1; q <= _sectionXZ.length - 2; q++) {
                _indices.push(new core.LInd3(_baseIndx, _baseIndx + q + 1, _baseIndx + q));
            }
            _geometry = new engine3d.LGeometry3d(_vertices, _normals, _texCoords, _indices);
            return _geometry;
        };
        LGeometryBuilder.createCone = function (radius, height, sectionDivision) {
            var _geometry = null;
            var _vertices = [];
            var _texCoords = [];
            var _normals = [];
            var _indices = [];
            var q;
            // Build base points
            var _sectionXZ = [];
            var _stepSectionAngle = 2 * Math.PI / sectionDivision;
            for (q = 0; q < sectionDivision; q++) {
                var _x = radius * Math.cos(q * _stepSectionAngle);
                var _z = radius * Math.sin(q * _stepSectionAngle);
                _sectionXZ.push(new core.LVec3(_x, 0, _z));
            }
            // Build surface - tesselate using strips of triangles
            for (q = 0; q < _sectionXZ.length; q++) {
                _indices.push(new core.LInd3(_vertices.length, _vertices.length + 1, _vertices.length + 2));
                var _p0 = core.LVec3.minus(_sectionXZ[q % _sectionXZ.length], new core.LVec3(0, 0.5 * height, 0));
                var _p1 = core.LVec3.minus(_sectionXZ[(q + 1) % _sectionXZ.length], new core.LVec3(0, 0.5 * height, 0));
                var _p2 = new core.LVec3(0, 0.5 * height, 0);
                _vertices.push(_p0);
                _vertices.push(_p1);
                _vertices.push(_p2);
                var _nx0 = Math.cos((q) * _stepSectionAngle);
                var _nz0 = Math.sin((q) * _stepSectionAngle);
                var _nx1 = Math.cos((q + 1) * _stepSectionAngle);
                var _nz1 = Math.sin((q + 1) * _stepSectionAngle);
                var _n0 = new core.LVec3(_nx0, 0, _nz0);
                var _n1 = new core.LVec3(_nx1, 0, _nz1);
                var _n2 = new core.LVec3(0, 1, 0);
                _normals.push(_n0);
                _normals.push(_n1);
                _normals.push(_n2);
                _texCoords.push(new core.LVec2(q / _sectionXZ.length, 1));
                _texCoords.push(new core.LVec2((q + 1) / _sectionXZ.length, 1));
                _texCoords.push(new core.LVec2((q + 0.5) / _sectionXZ.length, 0));
            }
            // Build bottom base
            var _baseIndx = _vertices.length;
            for (q = 0; q < _sectionXZ.length; q++) {
                _vertices.push(core.LVec3.plus(_sectionXZ[q], new core.LVec3(0, -0.5 * height, 0)));
                _normals.push(new core.LVec3(0, -1, 0));
                _texCoords.push(new core.LVec2(0.5 + (_sectionXZ[q].z / (2 * radius)), 0.5 + (_sectionXZ[q].x / (2 * radius))));
            }
            for (q = 1; q <= _sectionXZ.length - 2; q++) {
                _indices.push(new core.LInd3(_baseIndx, _baseIndx + q + 1, _baseIndx + q));
            }
            _geometry = new engine3d.LGeometry3d(_vertices, _normals, _texCoords, _indices);
            return _geometry;
        };
        LGeometryBuilder.createArrow = function (length) {
            var _geometry = null;
            var _vertices = [];
            var _normals = [];
            var _texCoords = [];
            var _indices = [];
            var _sectionDivision = 10;
            // Arrow dimensions
            var _radiusCyl = 0.05 * length;
            var _radiusCone = 0.075 * length;
            var _lengthCyl = 0.8 * length;
            var _lengthCone = 0.2 * length;
            // Tesselate cylinder ***********************************************************************
            // calculate section geometry
            var _sectionXZ = [];
            var _stepSectionAngle = 2 * Math.PI / _sectionDivision;
            var q = 0;
            for (q = 0; q < _sectionDivision; q++) {
                var _x = _radiusCyl * Math.cos(q * _stepSectionAngle);
                var _z = _radiusCyl * Math.sin(q * _stepSectionAngle);
                _sectionXZ.push(new core.LVec3(_x, 0, _z));
            }
            // calculate cylinder geometry
            var _baseIndx = 0;
            // down base ****************************************
            for (q = 0; q < _sectionXZ.length; q++) {
                _vertices.push(_sectionXZ[q]);
                _normals.push(core.AXIS_NEG_Y);
                _texCoords.push(new core.LVec2(0.5 + (_sectionXZ[q].z / (2 * _radiusCyl)), 0.5 + (_sectionXZ[q].x / (2 * _radiusCyl))));
            }
            for (q = 1; q <= _sectionXZ.length - 2; q++) {
                _indices.push(new core.LInd3(_baseIndx, _baseIndx + q, _baseIndx + q + 1));
            }
            _baseIndx += _vertices.length;
            // **************************************************
            // body surface *************************************
            for (q = 0; q < _sectionXZ.length; q++) {
                // quad vertices
                var _p0 = core.LVec3.plus(_sectionXZ[q], new core.LVec3(0, _lengthCyl, 0));
                var _p1 = core.LVec3.plus(_sectionXZ[(q + 1) % _sectionXZ.length], new core.LVec3(0, _lengthCyl, 0));
                var _p2 = core.LVec3.plus(_sectionXZ[(q + 1) % _sectionXZ.length], new core.LVec3(0, 0, 0));
                var _p3 = core.LVec3.plus(_sectionXZ[q], new core.LVec3(0, 0, 0));
                _vertices.push(_p0);
                _vertices.push(_p1);
                _vertices.push(_p2);
                _vertices.push(_p3);
                _texCoords.push(new core.LVec2(0.5 + (Math.atan2(_p0.z, _p0.x) / (2 * Math.PI)), _p0.y / _lengthCyl));
                _texCoords.push(new core.LVec2(0.5 + (Math.atan2(_p1.z, _p1.x) / (2 * Math.PI)), _p1.y / _lengthCyl));
                _texCoords.push(new core.LVec2(0.5 + (Math.atan2(_p2.z, _p2.x) / (2 * Math.PI)), _p2.y / _lengthCyl));
                _texCoords.push(new core.LVec2(0.5 + (Math.atan2(_p3.z, _p3.x) / (2 * Math.PI)), _p3.y / _lengthCyl));
                // For "smooth" normals
                var _nx1 = Math.cos((q) * _stepSectionAngle);
                var _nz1 = Math.sin((q) * _stepSectionAngle);
                var _nx2 = Math.cos((q + 1) * _stepSectionAngle);
                var _nz2 = Math.sin((q + 1) * _stepSectionAngle);
                var _nQuad1 = new core.LVec3(_nx1, 0, _nz1);
                var _nQuad2 = new core.LVec3(_nx2, 0, _nz2);
                _normals.push(_nQuad1);
                _normals.push(_nQuad2);
                _normals.push(_nQuad2);
                _normals.push(_nQuad1);
                _indices.push(new core.LInd3(_baseIndx, _baseIndx + 2, _baseIndx + 1));
                _indices.push(new core.LInd3(_baseIndx, _baseIndx + 3, _baseIndx + 2));
                _baseIndx += 4;
            }
            // **************************************************
            // Tesselate cone ***************************************************************************
            // Build base points
            var _sectionXZCone = [];
            var _sectionXZConeIn = [];
            var _stepSectionAngleCone = 2 * Math.PI / _sectionDivision;
            for (q = 0; q < _sectionDivision; q++) {
                var _x = _radiusCone * Math.cos(q * _stepSectionAngleCone);
                var _z = _radiusCone * Math.sin(q * _stepSectionAngleCone);
                _sectionXZCone.push(new core.LVec3(_x, 0, _z));
                _x = _radiusCyl * Math.cos(q * _stepSectionAngleCone);
                _z = _radiusCyl * Math.sin(q * _stepSectionAngleCone);
                _sectionXZConeIn.push(new core.LVec3(_x, 0, _z));
            }
            // Build surface - tesselate using strips of triangles
            for (q = 0; q < _sectionXZCone.length; q++) {
                _indices.push(new core.LInd3(_vertices.length, _vertices.length + 1, _vertices.length + 2));
                var _p0 = core.LVec3.plus(_sectionXZCone[q % _sectionXZCone.length], new core.LVec3(0, _lengthCyl, 0));
                var _p1 = core.LVec3.plus(_sectionXZCone[(q + 1) % _sectionXZCone.length], new core.LVec3(0, _lengthCyl, 0));
                var _p2 = new core.LVec3(0, _lengthCyl + _lengthCone, 0);
                _vertices.push(_p0);
                _vertices.push(_p1);
                _vertices.push(_p2);
                var _nx0 = Math.cos((q) * _stepSectionAngleCone);
                var _nz0 = Math.sin((q) * _stepSectionAngleCone);
                var _nx1 = Math.cos((q + 1) * _stepSectionAngleCone);
                var _nz1 = Math.sin((q + 1) * _stepSectionAngleCone);
                var _n0 = new core.LVec3(_nx0, 0, _nz0);
                var _n1 = new core.LVec3(_nx1, 0, _nz1);
                var _n2 = new core.LVec3(0, 1, 0);
                _normals.push(_n0);
                _normals.push(_n1);
                _normals.push(_n2);
                _texCoords.push(new core.LVec2(q / _sectionXZCone.length, 1));
                _texCoords.push(new core.LVec2((q + 1) / _sectionXZCone.length, 1));
                _texCoords.push(new core.LVec2((q + 0.5) / _sectionXZCone.length, 0));
            }
            // Build bottom base - strip of "kind of quads" ( ring tessellation )
            _baseIndx = _vertices.length;
            for (q = 0; q < _sectionXZCone.length; q++) {
                var _p0 = core.LVec3.plus(_sectionXZCone[q], new core.LVec3(0, _lengthCyl, 0));
                var _p1 = core.LVec3.plus(_sectionXZConeIn[q], new core.LVec3(0, _lengthCyl, 0));
                var _p2 = core.LVec3.plus(_sectionXZConeIn[(q + 1) % _sectionXZConeIn.length], new core.LVec3(0, _lengthCyl, 0));
                var _p3 = core.LVec3.plus(_sectionXZ[(q + 1) % _sectionXZCone.length], new core.LVec3(0, _lengthCyl, 0));
                _vertices.push(_p0);
                _vertices.push(_p1);
                _vertices.push(_p2);
                _vertices.push(_p3);
                _normals.push(core.AXIS_NEG_Y);
                _normals.push(core.AXIS_NEG_Y);
                _normals.push(core.AXIS_NEG_Y);
                _normals.push(core.AXIS_NEG_Y);
                _texCoords.push(new core.LVec2(0.5 + (_sectionXZCone[q].z / (2 * _radiusCone)), 0.5 + (_sectionXZCone[q].x / (2 * _radiusCone))));
                _texCoords.push(new core.LVec2(0.5 + (_sectionXZConeIn[q].z / (2 * _radiusCone)), 0.5 + (_sectionXZConeIn[q].x / (2 * _radiusCone))));
                _texCoords.push(new core.LVec2(0.5 + (_sectionXZConeIn[(q + 1) % _sectionXZConeIn.length].z / (2 * _radiusCone)), 0.5 + (_sectionXZCone[(q + 1) % _sectionXZConeIn.length].x / (2 * _radiusCone))));
                _texCoords.push(new core.LVec2(0.5 + (_sectionXZCone[(q + 1) % _sectionXZCone.length].z / (2 * _radiusCone)), 0.5 + (_sectionXZCone[(q + 1) % _sectionXZCone.length].x / (2 * _radiusCone))));
                _indices.push(new core.LInd3(_baseIndx, _baseIndx + 2, _baseIndx + 1));
                _indices.push(new core.LInd3(_baseIndx, _baseIndx + 3, _baseIndx + 2));
                _baseIndx += 4;
            }
            _geometry = new engine3d.LGeometry3d(_vertices, _normals, _texCoords, _indices);
            return _geometry;
        };
        LGeometryBuilder.createCapsule = function (radius, height, sectionDivision, capLevels) {
            var _geometry = null;
            var _vertices = [];
            var _normals = [];
            var _texCoords = [];
            var _indices = [];
            // Tessellate using cap-surface-cap approach
            // Build up cap *********************************
            // make vertices
            var _x, _y, _z, _r;
            var _baseIndx = 0;
            var l, d, s, q = 0;
            for (l = 0; l <= capLevels; l++) {
                // _y = ( ( float )l ) / ( numLevels + 1 );
                _y = Math.sin(0.5 * Math.PI * (l) / (capLevels + 1));
                for (d = 0; d < sectionDivision; d++) {
                    _r = Math.sqrt(1.0 - _y * _y);
                    _x = _r * Math.cos(2.0 * Math.PI * (d) / sectionDivision);
                    _z = _r * Math.sin(2.0 * Math.PI * (d) / sectionDivision);
                    var _upOffset = new core.LVec3(0, 0.5 * height, 0);
                    _vertices.push(core.LVec3.plus(new core.LVec3(radius * _x, radius * _y, radius * _z), _upOffset));
                    _normals.push(new core.LVec3(_x, _y, _z));
                }
            }
            for (l = 0; l < capLevels; l++) {
                var _vl = l * sectionDivision;
                var _vlNext = (l + 1) * sectionDivision;
                // Connect sides
                for (s = 0; s < sectionDivision; s++) {
                    var _p0 = _baseIndx + _vl + s;
                    var _p1 = _baseIndx + _vl + ((s + 1) % sectionDivision);
                    var _p0n = _baseIndx + _vlNext + s;
                    var _p1n = _baseIndx + _vlNext + ((s + 1) % sectionDivision);
                    _indices.push(new core.LInd3(_p0, _p1n, _p0n));
                    _indices.push(new core.LInd3(_p0, _p1, _p1n));
                }
            }
            _baseIndx += _vertices.length;
            // Build surface *******************************
            // calculate section geometry
            var _sectionXZ = [];
            var _stepSectionAngle = 2 * Math.PI / sectionDivision;
            for (q = 0; q < sectionDivision; q++) {
                var _x_1 = radius * Math.cos(q * _stepSectionAngle);
                var _z_1 = radius * Math.sin(q * _stepSectionAngle);
                _sectionXZ.push(new core.LVec3(_x_1, 0, _z_1));
            }
            // body surface
            for (q = 0; q < _sectionXZ.length; q++) {
                // quad vertices
                var _p0 = core.LVec3.plus(_sectionXZ[q], new core.LVec3(0, 0.5 * height, 0));
                var _p1 = core.LVec3.plus(_sectionXZ[(q + 1) % _sectionXZ.length], new core.LVec3(0, 0.5 * height, 0));
                var _p2 = core.LVec3.plus(_sectionXZ[(q + 1) % _sectionXZ.length], new core.LVec3(0, -0.5 * height, 0));
                var _p3 = core.LVec3.plus(_sectionXZ[q], new core.LVec3(0, -0.5 * height, 0));
                _vertices.push(_p0);
                _vertices.push(_p1);
                _vertices.push(_p2);
                _vertices.push(_p3);
                // For "flat" normals
                // let _nx : number = Math.cos( ( q + 0.5 ) * _stepSectionAngle );
                // let _nz : number = Math.sin( ( q + 0.5 ) * _stepSectionAngle );
                // let _nQuad : core.LVec3 = new core.LVec3( _nx, 0, _nz );
                // _normals.push( _nQuad );
                // _normals.push( _nQuad );
                // _normals.push( _nQuad );
                // _normals.push( _nQuad );
                // For "smooth" normals
                var _nx1 = Math.cos((q) * _stepSectionAngle);
                var _nz1 = Math.sin((q) * _stepSectionAngle);
                var _nx2 = Math.cos((q + 1) * _stepSectionAngle);
                var _nz2 = Math.sin((q + 1) * _stepSectionAngle);
                var _nQuad1 = new core.LVec3(_nx1, 0, _nz1);
                var _nQuad2 = new core.LVec3(_nx2, 0, _nz2);
                _normals.push(_nQuad1);
                _normals.push(_nQuad2);
                _normals.push(_nQuad2);
                _normals.push(_nQuad1);
                _indices.push(new core.LInd3(_baseIndx, _baseIndx + 2, _baseIndx + 1));
                _indices.push(new core.LInd3(_baseIndx, _baseIndx + 3, _baseIndx + 2));
                _baseIndx += 4;
            }
            // Build down cap ******************************
            // make vertices
            for (l = -capLevels; l <= 0; l++) {
                // _y = ( ( float )l ) / ( numLevels + 1 );
                _y = Math.sin(0.5 * Math.PI * (l) / (capLevels + 1));
                for (d = 0; d < sectionDivision; d++) {
                    _r = Math.sqrt(1.0 - _y * _y);
                    _x = _r * Math.cos(2.0 * Math.PI * (d) / sectionDivision);
                    _z = _r * Math.sin(2.0 * Math.PI * (d) / sectionDivision);
                    var _downOffset = new core.LVec3(0, -0.5 * height, 0);
                    _vertices.push(core.LVec3.plus(new core.LVec3(radius * _x, radius * _y, radius * _z), _downOffset));
                    _normals.push(new core.LVec3(_x, _y, _z));
                }
            }
            for (l = 0; l < capLevels; l++) {
                var _vl = l * sectionDivision;
                var _vlNext = (l + 1) * sectionDivision;
                // Connect sides
                for (s = 0; s < sectionDivision; s++) {
                    var _p0 = _baseIndx + _vl + s;
                    var _p1 = _baseIndx + _vl + ((s + 1) % sectionDivision);
                    var _p0n = _baseIndx + _vlNext + s;
                    var _p1n = _baseIndx + _vlNext + ((s + 1) % sectionDivision);
                    _indices.push(new core.LInd3(_p0, _p1n, _p0n));
                    _indices.push(new core.LInd3(_p0, _p1, _p1n));
                }
            }
            for (q = 0; q < _vertices.length; q++) {
                //// Project capsule onto sphere of radius ( h + 2r )
                // calculate spherical coordinates
                var _rC = Math.sqrt(_vertices[q].x * _vertices[q].x +
                    _vertices[q].y * _vertices[q].y +
                    _vertices[q].z * _vertices[q].z);
                var _thetaC = Math.acos(_vertices[q].z / _rC);
                var _yawC = Math.atan2(_vertices[q].y, _vertices[q].x); // [-pi, pi]
                // convert to coordinates in projection sphere
                var _rS = height + 2 * radius;
                var _thetaS = _thetaC;
                var _yawS = _yawC;
                // Transform to coordinates in sphere
                var _xS = Math.sin(_thetaS) * Math.cos(_yawS);
                var _yS = Math.sin(_thetaS) * Math.sin(_yawS);
                var _zS = Math.cos(_thetaS);
                // Extract UVs from spherical uv wrapping
                var _u = void 0, _v = void 0;
                _u = 0.5 + (Math.atan2(-_zS, -_xS) / (2 * Math.PI));
                _v = 0.5 - (Math.asin(-_yS) / Math.PI);
                _texCoords.push(new core.LVec2(_u, _v));
            }
            _geometry = new engine3d.LGeometry3d(_vertices, _normals, _texCoords, _indices);
            return _geometry;
        };
        LGeometryBuilder.createPlane = function (width, depth, texRangeWidth, texRangeDepth) {
            var _geometry = null;
            var _vertices = [];
            var _normals = [];
            var _texCoords = [];
            var _indices = [];
            texRangeWidth = (texRangeWidth) ? texRangeWidth : 1;
            texRangeDepth = (texRangeDepth) ? texRangeDepth : 1;
            var _n = new core.LVec3(0.0, 1.0, 0.0);
            var _s1 = new core.LVec3(0.0, 0.0, 1.0);
            var _s2 = new core.LVec3(1.0, 0.0, 0.0);
            var _scale = new core.LVec3(0.5 * width, 0.0, 0.5 * depth);
            _indices.push(new core.LInd3(_vertices.length, _vertices.length + 1, _vertices.length + 2));
            _indices.push(new core.LInd3(_vertices.length, _vertices.length + 2, _vertices.length + 3));
            var _v = new core.LVec3(0, 0, 0);
            _v = core.LVec3.minus(core.LVec3.minus(_n, _s1), _s2);
            _v.scale(_scale.x, _scale.y, _scale.z);
            _vertices.push(_v);
            _normals.push(_n);
            _texCoords.push(new core.LVec2(0, 0));
            _v = core.LVec3.plus(core.LVec3.minus(_n, _s1), _s2);
            _v.scale(_scale.x, _scale.y, _scale.z);
            _vertices.push(_v);
            _normals.push(_n);
            _texCoords.push(new core.LVec2(texRangeWidth, 0));
            _v = core.LVec3.plus(core.LVec3.plus(_n, _s1), _s2);
            _v.scale(_scale.x, _scale.y, _scale.z);
            _vertices.push(_v);
            _normals.push(_n);
            _texCoords.push(new core.LVec2(texRangeWidth, texRangeDepth));
            _v = core.LVec3.minus(core.LVec3.plus(_n, _s1), _s2);
            _v.scale(_scale.x, _scale.y, _scale.z);
            _vertices.push(_v);
            _normals.push(_n);
            _texCoords.push(new core.LVec2(0, texRangeDepth));
            _geometry = new engine3d.LGeometry3d(_vertices, _normals, _texCoords, _indices);
            return _geometry;
        };
        LGeometryBuilder.createFromObj = function (filename) {
            var _geometry = null;
            // ifstream _fileHandle( filename );
            // if ( !_fileHandle.is_open() )
            // {
            //     cout << "LGeometryBuilder::createFromObj> couldn't open the file " << filename << endl;
            //     return NULL;
            // }
            // LObjInfo _objInfo;
            // _parseObj( _fileHandle, _objInfo );
            // _geometry = new LGeometry3d( _objInfo.vertices, _objInfo.normals, _objInfo.texCoords );
            return _geometry;
        };
        return LGeometryBuilder;
    }());
    engine3d.LGeometryBuilder = LGeometryBuilder;
})(engine3d || (engine3d = {}));
