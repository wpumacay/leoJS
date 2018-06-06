/// <reference path="LModelCommon.ts" />
/// <reference path="LColladaCommon.ts" />
// TODO:
// Just in case, this parser still needs some (lots!) of work. The .dae files I'm targetting ...
// are the kind used in ROS, from here( https://github.com/ros-industrial/kuka_experimental ) ...
// They were exported from blender, but seem to only use some of the Collada format features, which ...
// are the ones I'm implementing here.
// Collada files are nice, as can be used for general sharing between applications, but has A LOT ...
// OF FEATURES
// I'm sorry I haven't been able to make a better parser. My suggestion would be to use assimpjson, but ...
// still there would be some preprocessing steps that need to be done in the pipeline, so, it would be better ...
// if instead of using collada files just use plain .obj files. They work in a very defined way, with some ...
// small variations and small cases ( as far as I have checked )
var core;
(function (core) {
    var LColladaParser = /** @class */ (function () {
        function LColladaParser() {
        }
        LColladaParser.prototype.parseModel = function (rootModelElement) {
            // parse global properties ( scale and correction matrix )
            var _scale = 1;
            var _correctionMat = new core.LMat4();
            var _modelProperties = this._parseModelAssetProperties(rootModelElement);
            // parse geometries
            var _geometriesElm = rootModelElement.getElementsByTagName('library_geometries')[0];
            var _parsedGeometries = this._parseGeometries(_geometriesElm);
            // parse materials
            // TODO: Implement this part
            var _parsedMaterials = {}; // TODO: Implement materials parsing
            // build model info
            var _constructInfo = this._buildConstructionInfo(_parsedGeometries, _parsedMaterials, _modelProperties);
            return _constructInfo;
        };
        LColladaParser.prototype._parseModelAssetProperties = function (rootModelElement) {
            var _modelProperties = new core.LColladaModelProperties();
            var _assetElm = rootModelElement.getElementsByTagName('asset');
            if (_assetElm.length < 1) {
                // Just use default, as it seems there is no information to parse, notify with warn ...
                // as it should be because of the specification
                console.warn('LColladaParser> It seems there is no metadata information');
            }
            else {
                // Units
                var _unitsElms = _assetElm[0].getElementsByTagName('unit');
                if (_unitsElms.length != 0) {
                    _modelProperties.scale = parseFloat(_unitsElms[0].attributes['meter'].nodeValue);
                }
                // Up axis
                var _upaxisElms = _assetElm[0].getElementsByTagName('up_axis');
                if (_upaxisElms.length != 0) {
                    _modelProperties.upAxis = _upaxisElms[0].textContent;
                }
            }
            var _lvsceneElm = rootModelElement.getElementsByTagName('library_visual_scenes');
            if (_lvsceneElm.length < 1) {
                // Just use default, as it seems there is no information to parse
                console.info('LColladaParser> It seems there is no libVisScenes information');
            }
            else {
                // Correction matrix
                // TODO: For now, we are assuming only one model in the file, so there should be ...
                // just one correction matrix. Actually, for a model with lots of parts, it's common ...
                // that each part has its own transformation matrix. In our simple case of the robot files, ...
                // we only deal with a single one per model, but should definitely make a tree and associate ...
                // each correction to the corresponding part
                var _matElms = _lvsceneElm[0].getElementsByTagName('matrix');
                var _matData = _matElms[0].textContent.split(' ').map(Number);
                core.LMat4.fromBufferInPlace(_modelProperties.correctionMatrix, _matData, false);
                _modelProperties.correctionMatrix.buff[12] *= _modelProperties.scale;
                _modelProperties.correctionMatrix.buff[13] *= _modelProperties.scale;
                _modelProperties.correctionMatrix.buff[14] *= _modelProperties.scale;
            }
            return _modelProperties;
        };
        LColladaParser.prototype._parseGeometries = function (geometriesElm) {
            var _parsedGeometries = {};
            var _geoElms = geometriesElm.children;
            for (var q = 0; q < _geoElms.length; q++) {
                var _id = _geoElms[q].id;
                var _colladaGeo = this._parseSingleGeometry(_geoElms[_id]);
                if (_colladaGeo) {
                    _parsedGeometries[_id] = _colladaGeo;
                }
            }
            return _parsedGeometries;
        };
        LColladaParser.prototype._parseSingleGeometry = function (geoElm) {
            var _colladaGeo = new core.LColladaGeometry();
            var _meshElm = geoElm.getElementsByTagName('mesh')[0];
            // Parse buffers' data
            this._parseBuffers(_colladaGeo, _meshElm);
            // Parse buffers' usage
            // this._parseBuffersUsage( _colladaGeo, _meshElm );
            this._parseBuffersUsageAndLayout(_colladaGeo, _meshElm);
            // Parse indices
            var _isGeometrySupported = this._parseFaces(_colladaGeo, _meshElm);
            if (!_isGeometrySupported) {
                return null;
            }
            return _colladaGeo;
        };
        LColladaParser.prototype._parseBuffers = function (targetGeo, meshElm) {
            var _buffElms = meshElm.getElementsByTagName('source');
            for (var q = 0; q < _buffElms.length; q++) {
                var _buffId = _buffElms[q].id;
                var _buffer = new core.LColladaVertexBuffer();
                // Parse data
                var _floatsElm = _buffElms[_buffId].getElementsByTagName('float_array')[0];
                var _data = _floatsElm.textContent.split(' ').map(Number);
                // Parse composition
                var _compositionElm = _buffElms[_buffId]
                    .getElementsByTagName('technique_common')[0]
                    .getElementsByTagName('accessor')[0];
                var _verticesCount = parseInt(_compositionElm.attributes['count'].nodeValue, 10);
                var _componentCount = parseInt(_compositionElm.attributes['stride'].nodeValue, 10);
                _buffer.data = new Float32Array(_data);
                _buffer.size = _verticesCount;
                _buffer.count = _componentCount;
                if (_verticesCount * _componentCount != _data.length) {
                    console.warn('LColladaParser> buffers size mismatch: ' +
                        'data has different length than what composition says');
                }
                targetGeo.buffers[_buffId] = _buffer;
            }
        };
        LColladaParser.prototype._parseBuffersUsageAndLayout = function (targetGeo, meshElm) {
            // Parse the vertices for an alias
            var _verticesElm = meshElm.getElementsByTagName('vertices')[0];
            var _vertChildren = _verticesElm.children;
            var _vertAliasName = _verticesElm.getAttribute('id');
            // Make the alias buffer
            targetGeo.buffers[_vertAliasName] = new core.LColladaVertexBuffer();
            // Parse buffer usage and make an alias out of its children
            for (var q = 0; q < _vertChildren.length; q++) {
                var _usage = _vertChildren[q].getAttribute('semantic');
                var _targetBufferId = _vertChildren[q].getAttribute('source').replace('#', '');
                if (!targetGeo.buffers[_targetBufferId]) {
                    console.warn('LColladaParser> buffer: ' + _targetBufferId + ' does not exist.' +
                        ' Trying to assign semantics when parsing vertices node');
                    continue;
                }
                targetGeo.buffers[_targetBufferId].usage = _usage;
                // Add child to alias
                targetGeo.buffers[_vertAliasName]
                    .children
                    .push(targetGeo.buffers[_targetBufferId]);
            }
            this._parseBuffersLayout(targetGeo, meshElm);
        };
        LColladaParser.prototype._parseBuffersLayout = function (targetGeo, meshElm) {
            // Parse the input nodes inside the triangles or polylist nodes
            var _layoutElms = null;
            if (meshElm.getElementsByTagName('triangles').length > 0) {
                _layoutElms = meshElm.getElementsByTagName('triangles')[0]
                    .getElementsByTagName('input');
            }
            else if (meshElm.getElementsByTagName('polylist').length > 0) {
                _layoutElms = meshElm.getElementsByTagName('polylist')[0]
                    .getElementsByTagName('input');
            }
            else if (meshElm.getElementsByTagName('lines').length > 0) {
                console.info('LColladaParser> Not supporting lines for now');
                return;
            }
            if (!_layoutElms) {
                console.warn('LColladaParser> there is no faces node to get the layout from');
                return;
            }
            for (var q = 0; q < _layoutElms.length; q++) {
                var _semantic = _layoutElms[q].getAttribute('semantic');
                var _sourceId = _layoutElms[q].getAttribute('source').replace('#', '');
                var _offset = parseInt(_layoutElms[q].getAttribute('offset'), 10);
                if (!targetGeo.buffers[_sourceId]) {
                    console.warn('LColladaParser> error when parsing the layout, seems that ' +
                        'there is no buffer with id: ' + _sourceId + '; not even an alias ');
                    continue;
                }
                // Check if we are dealing with an alias
                if (targetGeo.buffers[_sourceId].children.length > 0) {
                    var _layoutEntry = [];
                    // Add layout using the alias data
                    var _childrenBuff = targetGeo.buffers[_sourceId].children;
                    for (var i = 0; i < _childrenBuff.length; i++) {
                        _childrenBuff[i].offset = targetGeo.layout.length;
                        _layoutEntry.push(_childrenBuff[i]);
                    }
                    targetGeo.layout.push(_layoutEntry);
                    // No need to add the semantics, as the vertices node defined it
                }
                else {
                    // Set the offset of this buffer in the layout
                    targetGeo.buffers[_sourceId].offset = targetGeo.layout.length;
                    // Add layout using the buffer data - easier one
                    var _layoutEntry = [targetGeo.buffers[_sourceId]];
                    targetGeo.layout.push(_layoutEntry);
                    // Add the semantics, as this entries are not in the vertices node
                    targetGeo.buffers[_sourceId].usage = _semantic;
                }
            }
        };
        LColladaParser.prototype._parseBuffersUsage = function (targetGeo, meshElm) {
            // TODO: This part kind of freaks me out. The usage is in two places, ...
            // in the vertices node and inside the triangles-polylist node :(.
            // Here I'm parsing an alias ( if there is only one freaking mapping of one ...
            // buffer's name to another .... why????!!!!!! :'( ).
            var _verticesElm = meshElm.getElementsByTagName('vertices')[0];
            var _usageElms = _verticesElm.children;
            var _aliasId = _verticesElm.getAttribute('id');
            for (var q = 0; q < _usageElms.length; q++) {
                // Extract from that "weird feature" what we need :/
                var _usage = _usageElms[q]
                    .attributes['semantic']
                    .nodeValue;
                var _targetBufferId = _usageElms[q]
                    .attributes['source']
                    .nodeValue
                    .replace('#', '');
                // Store usage in dictionary
                if (!targetGeo.buffers[_targetBufferId]) {
                    // console.warn( 'LColladaParser> non used semantic field' );
                    // No warning, as we are not using the usage as stated line above
                    continue;
                }
                targetGeo.buffers[_targetBufferId].usage = _usage;
            }
        };
        LColladaParser.prototype._parseFaces = function (targetGeo, meshElm) {
            if (meshElm.getElementsByTagName('triangles').length < 1 &&
                meshElm.getElementsByTagName('polylist').length < 1) {
                // As only triangles and polylist are supported ...
                // for now, just skip this geometry
                return false;
            }
            if (meshElm.getElementsByTagName('triangles').length > 0) {
                return this._parseFacesTriangles(targetGeo, meshElm);
            }
            else if (meshElm.getElementsByTagName('polylist').length > 0) {
                return this._parseFacesPolylist(targetGeo, meshElm);
            }
            return false;
        };
        LColladaParser.prototype._parseFacesTriangles = function (targetGeo, meshElm) {
            var _triElm = meshElm.getElementsByTagName('triangles')[0];
            // Extract faces properties ( count and material related )
            var _triCount = parseInt(_triElm.attributes['count'].nodeValue, 10);
            var _materialId = _triElm.getAttribute('material');
            // Extract actual "indices" data
            var _triDataElm = _triElm.getElementsByTagName('p')[0];
            var _triBatchData = _triDataElm.textContent.split(' ').map(Number);
            // Make triangles out of this data and the layout
            this._parseFacesTrianglesByLayout(targetGeo, _triBatchData, _triCount);
            return true;
        };
        LColladaParser.prototype._parseFacesTrianglesByLayout = function (targetGeo, triBatchData, triCount) {
            // Actual indices. We have to construct the actual buffers with the layout
            var _triData = [];
            var _layout = targetGeo.layout;
            // This says how many buffers are linked to each index entry in the tribatchdata
            var _layoutSize = _layout.length;
            // This says how many indices form in a triangle in the batch data
            var _layoutIndicesPerTri = 3 * _layoutSize;
            if ((triCount * _layoutIndicesPerTri) != triBatchData.length) {
                console.warn('LColladaParser> faces layout mismatch');
                return;
            }
            // Initialize actual buffers
            targetGeo.positionsBuffer = new core.LColladaVertexBuffer();
            targetGeo.normalsBuffer = new core.LColladaVertexBuffer();
            for (var l = 0; l < _layoutSize; l++) {
                var _layoutEntry = targetGeo.layout[l];
                for (var e = 0; e < _layoutEntry.length; e++) {
                    var _buffer = _layoutEntry[e];
                    if (_buffer.usage == core.BUFFER_USAGE_POSITION ||
                        _buffer.usage == core.BUFFER_USAGE_VERTEX) {
                        targetGeo.positionsBuffer.usage = core.BUFFER_USAGE_POSITION;
                        targetGeo.positionsBuffer.offset = _buffer.offset;
                        targetGeo.positionsBuffer.count = _buffer.count;
                        targetGeo.positionsBuffer.size = triCount * 3;
                        targetGeo.positionsBuffer.data = new Float32Array(triCount * 3 * _buffer.count);
                    }
                    else if (_buffer.usage == core.BUFFER_USAGE_NORMAL) {
                        targetGeo.normalsBuffer.usage = core.BUFFER_USAGE_NORMAL;
                        targetGeo.normalsBuffer.offset = _buffer.offset;
                        targetGeo.normalsBuffer.count = _buffer.count;
                        targetGeo.normalsBuffer.size = triCount * 3;
                        targetGeo.normalsBuffer.data = new Float32Array(triCount * 3 * _buffer.count);
                    }
                }
            }
            // Parsing each face using the layout and making the "actual buffers" as we go
            // ( The actual buffers are the one that are going to be stored in the VBOs, and ...
            //   have to be the same size, which is not generally the case in this format )
            // Sample reference: ( vertex - normal in layout, alias with no children )
            /*
            *    <---------- _layoutIndicesPerTri -------->
            *    <_layoutSize ><_layoutSize ><_layoutSize >
            *     _____  _____  _____  _____  _____  _____
            *    |     ||     ||     ||     ||     ||     |
            *    | v0  || n0  || v1  || n1  || v2  || n2  |
            *    |_____||_____||_____||_____||_____||_____|
            */
            for (var f = 0; f < triCount; f++) {
                for (var i = 0; i < 3; i++) {
                    for (var l = 0; l < _layoutSize; l++) {
                        var _indexInBatch = l + i * _layoutSize + f * _layoutSize * 3;
                        var _vertexIndex = i + f * 3;
                        var _vertexAttribId = triBatchData[_indexInBatch];
                        // This will build a vertex attrib ( or many, according to the layout ) ...
                        // per layout element, and grow the buffers accordingly
                        this._buildFaceTriIndex(targetGeo, _vertexIndex, l, _vertexAttribId);
                    }
                    // For every tri there should be 3 vertices
                    _triData.push(f * 3 + i);
                }
            }
            var _ibuffer = new core.LColladaIndexBuffer();
            _ibuffer.data = new Uint16Array(_triData);
            _ibuffer.size = triCount;
            _ibuffer.count = 3;
            if ((triCount * 3) != _triData.length) {
                console.warn('LColladaParser> faces count mismatch');
            }
            targetGeo.faces = _ibuffer;
        };
        LColladaParser.prototype._buildFaceTriIndex = function (targetGeo, vertexIndex, indexInLayout, vertexAttribId) {
            var _layoutEntry = targetGeo.layout[indexInLayout];
            for (var q = 0; q < _layoutEntry.length; q++) {
                var _buffer = _layoutEntry[q];
                // Number of elements in single vertex
                var _count = _buffer.count;
                // Number of vertices in buffer
                var _size = _buffer.size;
                if (vertexAttribId >= (_size + _count)) {
                    console.warn('LColladaParser> it seems the index provides is out ' +
                        'of this buffer bounds');
                    continue;
                }
                if (_buffer.usage == core.BUFFER_USAGE_POSITION ||
                    _buffer.usage == core.BUFFER_USAGE_VERTEX) {
                    targetGeo.positionsBuffer.data[vertexIndex * 3 + 0] = _buffer.data[3 * vertexAttribId + 0];
                    targetGeo.positionsBuffer.data[vertexIndex * 3 + 1] = _buffer.data[3 * vertexAttribId + 1];
                    targetGeo.positionsBuffer.data[vertexIndex * 3 + 2] = _buffer.data[3 * vertexAttribId + 2];
                }
                else if (_buffer.usage == core.BUFFER_USAGE_NORMAL) {
                    targetGeo.normalsBuffer.data[vertexIndex * 3 + 0] = _buffer.data[3 * vertexAttribId + 0];
                    targetGeo.normalsBuffer.data[vertexIndex * 3 + 1] = _buffer.data[3 * vertexAttribId + 1];
                    targetGeo.normalsBuffer.data[vertexIndex * 3 + 2] = _buffer.data[3 * vertexAttribId + 2];
                }
            }
        };
        LColladaParser.prototype._parseFacesPolylist = function (targetGeo, meshElm) {
            var _plistElm = meshElm.getElementsByTagName('polylist')[0];
            var _count = parseInt(_plistElm.getAttribute('count'), 10);
            // Extract the count of the polygons
            var _vcountElm = _plistElm.getElementsByTagName('vcount')[0];
            var _vcountData = _vcountElm.textContent.split(' ').map(Number);
            // Make sure not adding an extra '0' because of an empty space at the end
            _vcountData = _vcountData.slice(0, _count);
            // Extract the faces count data. In this case the number of edges is not 3, but ...
            // given by the vcount data above
            var _facesDataElm = _plistElm.getElementsByTagName('p')[0];
            var _facesData = _facesDataElm.textContent.split(' ').map(Number);
            // Build the triangles data ( for now, we assume that the count is 3 in every case, and ...
            // skip if not )
            this._parseFacesPolylistByLayout(targetGeo, _vcountData, _facesData);
            return true;
        };
        LColladaParser.prototype._parseFacesPolylistByLayout = function (targetGeo, polys, polyIndexData) {
            // Actual indices. We have to construct the actual buffers with the layout
            var _triData = [];
            var _layout = targetGeo.layout;
            // This says how many buffers are linked to each index entry in the tribatchdata
            var _layoutSize = _layout.length;
            // Compute size that the faces will hold, as potentially every polygons might ...
            // be different size. Of course, we are only supporting 3 sides, so tris only for ...
            // now ( and skipping the rest ). But still, if necessary, just change this part
            var _bufferSize = 0;
            for (var p = 0; p < polys.length; p++) {
                var _nVertsInPoly = polys[p];
                if (_nVertsInPoly != 3) {
                    // Skip non-tris, as stated above
                    continue;
                }
                _bufferSize += _nVertsInPoly;
            }
            // Initialize actual buffers
            targetGeo.positionsBuffer = new core.LColladaVertexBuffer();
            targetGeo.normalsBuffer = new core.LColladaVertexBuffer();
            for (var l = 0; l < _layoutSize; l++) {
                var _layoutEntry = targetGeo.layout[l];
                for (var e = 0; e < _layoutEntry.length; e++) {
                    var _buffer = _layoutEntry[e];
                    if (_buffer.usage == core.BUFFER_USAGE_POSITION ||
                        _buffer.usage == core.BUFFER_USAGE_VERTEX) {
                        targetGeo.positionsBuffer.usage = core.BUFFER_USAGE_POSITION;
                        targetGeo.positionsBuffer.offset = _buffer.offset;
                        targetGeo.positionsBuffer.count = _buffer.count;
                        targetGeo.positionsBuffer.size = _bufferSize;
                        targetGeo.positionsBuffer.data = new Float32Array(_bufferSize * _buffer.count);
                    }
                    else if (_buffer.usage == core.BUFFER_USAGE_NORMAL) {
                        targetGeo.normalsBuffer.usage = core.BUFFER_USAGE_NORMAL;
                        targetGeo.normalsBuffer.offset = _buffer.offset;
                        targetGeo.normalsBuffer.count = _buffer.count;
                        targetGeo.normalsBuffer.size = _bufferSize;
                        targetGeo.normalsBuffer.data = new Float32Array(_bufferSize * _buffer.count);
                    }
                }
            }
            // A pointer to keep track of the start position of the given poly ...
            // in the poly data. If we assume all the polys are the same size ( tris or quads )...
            // as it's probably the case, then we could just make the count in the for loops, ...
            // but still, I'm kind of paranoic right now about this format xD. Just want to get it ...
            // working and it does not break if something not supported comes around. As I've thought ...
            // if there is something weird in the polys, then the code should just skip it and in the ...
            // rendered mesh you should see some holes where the polys were skipped
            var _posStartInPolyData = 0;
            var _posCurrentVertex = 0;
            // Parsing each face using the layout and making the "actual buffers" as we go
            // ( The actual buffers are the one that are going to be stored in the VBOs, and ...
            //   have to be the same size, which is not generally the case in this format )
            // Sample reference: ( vertex - normal in layout, alias with no children )
            /*
            *    <---------- _layoutIndicesPerTri -------->
            *    <_layoutSize ><_layoutSize ><_layoutSize >
            *     _____  _____  _____  _____  _____  _____
            *    |     ||     ||     ||     ||     ||     |
            *    | v0  || n0  || v1  || n1  || v2  || n2  |
            *    |_____||_____||_____||_____||_____||_____|
            */
            for (var p = 0; p < polys.length; p++) {
                var _nVertsInPoly = polys[p];
                if (_nVertsInPoly != 3) {
                    // For now, just support polylists with tris inside
                    continue;
                }
                for (var i = 0; i < _nVertsInPoly; i++) {
                    for (var l = 0; l < _layoutSize; l++) {
                        var _indexInBatch = l + i * _layoutSize + _posStartInPolyData;
                        var _vertexIndex = i + _posCurrentVertex;
                        var _vertexAttribId = polyIndexData[_indexInBatch];
                        // This will build a vertex attrib ( or many, according to the layout ) ...
                        // per layout element, and grow the buffers accordingly
                        this._buildFaceTriIndex(targetGeo, _vertexIndex, l, _vertexAttribId);
                    }
                    // For every tri there should be 3 vertices
                    _triData.push(i + _posCurrentVertex);
                }
                _posCurrentVertex += _nVertsInPoly;
                _posStartInPolyData += _layoutSize * _nVertsInPoly;
            }
            var _ibuffer = new core.LColladaIndexBuffer();
            _ibuffer.data = new Uint16Array(_triData);
            _ibuffer.size = _bufferSize;
            _ibuffer.count = 3;
            targetGeo.faces = _ibuffer;
        };
        LColladaParser.prototype._getBufferByUsage = function (buffers, usage) {
            // Assumming a single buffer per usage, so retrieving first match
            var _key;
            for (_key in buffers) {
                if (buffers[_key].usage == usage) {
                    return buffers[_key];
                }
            }
            return null;
        };
        LColladaParser.prototype._buildConstructionInfo = function (parsedGeometries, parsedMaterials, parsedModelProperties) {
            var _constructInfo = new core.LModelConstructInfo();
            _constructInfo.correctionMat = parsedModelProperties.correctionMatrix;
            //// For now, just build using the parsed geometries, wip: use materials info
            // Generate the global buffers for the model
            var _vertices = [];
            var _normals = [];
            var _texCoords = [];
            var _indices = [];
            var _successfullyParsedGeometry = true;
            var _key;
            for (_key in parsedGeometries) {
                var _cGeometry = parsedGeometries[_key];
                // Collect buffers
                var _positionbuffer = this._getPositionBuffer(_cGeometry);
                var _normalBuffer = this._getNormalBuffer(_cGeometry, _positionbuffer);
                var _texCoordBuffer = this._getTexCoordBuffer(_cGeometry, _positionbuffer);
                if (!_positionbuffer) {
                    _successfullyParsedGeometry = false;
                    continue;
                }
                // Update offset in total buffer, so the indices can be recalculated
                _cGeometry.offsetInGlobalBuffer = _vertices.length;
                // Append buffer to total buffers
                this._appendBufferIntoVec3Array(_positionbuffer, _vertices, parsedModelProperties.scale);
                this._appendBufferIntoVec3Array(_normalBuffer, _normals, 1);
                this._appendBufferIntoVec2Array(_texCoordBuffer, _texCoords);
            }
            // Compensate indices with offsets in total buffer
            // TODO: Doing this separately, as not sure if faces can be associated with ...
            // buffers in a different geometry ( check again .dae format specification )
            for (_key in parsedGeometries) {
                var _cGeometry = parsedGeometries[_key];
                if (!_cGeometry.isOk) {
                    // If the geometry was not parsed correctly, skip these faces
                    continue;
                }
                this._compensateIndices(_cGeometry.faces, _cGeometry.offsetInGlobalBuffer);
                this._appendBufferIntoInd3Array(_cGeometry.faces, _indices);
            }
            // Pass the data to the geometry info
            _constructInfo.geometryInfo.vertices = _vertices;
            _constructInfo.geometryInfo.normals = _normals;
            _constructInfo.geometryInfo.texCoords = _texCoords;
            _constructInfo.geometryInfo.indices = _indices;
            // Set whether or not the geometry was correctly parsed
            _constructInfo.geometryInfo.wasParsedCorrectly = _successfullyParsedGeometry;
            // TODO: build material info. For now, just let the material info by default
            /*
            */
            // Set whether or not the material was correctly parsed
            _constructInfo.materialInfo.wasParsedCorrectly = true;
            // Set whether or not the info is ready for use
            _constructInfo.wasParsedCorrectly = _constructInfo.geometryInfo.wasParsedCorrectly &&
                _constructInfo.materialInfo.wasParsedCorrectly;
            return _constructInfo;
        };
        LColladaParser.prototype._getPositionBuffer = function (colladaGeo) {
            // let _positionbuffer = this._getBufferByUsage( colladaGeo.buffers,
            //                                               BUFFER_USAGE_POSITION );
            // _positionbuffer = ( _positionbuffer == null ) ? 
            //                         this._getBufferByUsage( colladaGeo.buffers,
            //                                                 BUFFER_USAGE_VERTEX ) :
            //                         _positionbuffer;
            var _positionbuffer = colladaGeo.positionsBuffer;
            if (!_positionbuffer) {
                console.warn('LColladaParser> this geometry seems to be broken: ' +
                    'no position buffer found');
                colladaGeo.isOk = false;
            }
            return _positionbuffer;
        };
        LColladaParser.prototype._getNormalBuffer = function (colladaGeo, positionBuffer) {
            if (positionBuffer == null) {
                // There is nothing to do, as the positions could not be parsed
                return null;
            }
            // let _normalBuffer = this._getBufferByUsage( colladaGeo.buffers,
            //                                             BUFFER_USAGE_NORMAL );
            var _normalBuffer = colladaGeo.normalsBuffer;
            if (!_normalBuffer) {
                console.warn('LColladaParser> this geometry seems to not use normals - ' +
                    'creating a default normal buffer with zeros');
                _normalBuffer = new core.LColladaVertexBuffer();
                _normalBuffer.count = positionBuffer.count;
                _normalBuffer.size = positionBuffer.size;
                _normalBuffer.data = new Float32Array(positionBuffer.data.length);
            }
            else if (_normalBuffer.count != positionBuffer.count ||
                _normalBuffer.size != positionBuffer.size) {
                console.warn('LColladaParser> this geometry seems to have buffers of ' +
                    'different sizes ( positions.size != normals.size ) ' +
                    'creating default with zeros instead');
                _normalBuffer = new core.LColladaVertexBuffer();
                _normalBuffer.count = positionBuffer.count;
                _normalBuffer.size = positionBuffer.size;
                _normalBuffer.data = new Float32Array(positionBuffer.data.length);
            }
            return _normalBuffer;
        };
        LColladaParser.prototype._getTexCoordBuffer = function (colladaGeo, positionBuffer) {
            if (positionBuffer == null) {
                // There is nothing to do, as the positions could not be parsed
                return null;
            }
            // let _texCoordBuffer = this._getBufferByUsage( colladaGeo.buffers,
            //                                               BUFFER_USAGE_TEXCOORD );
            var _texCoordBuffer = colladaGeo.texCoordsBuffer;
            if (!_texCoordBuffer) {
                // Just info, as might not need texture coordinates
                console.info('LColladaParser> this geometry seems to not use texture coordinates - ' +
                    'creating a default texCoord buffer with zeros');
                _texCoordBuffer = new core.LColladaVertexBuffer();
                _texCoordBuffer.count = 2;
                _texCoordBuffer.size = positionBuffer.size;
                _texCoordBuffer.data = new Float32Array(2 * positionBuffer.size);
            }
            else if (_texCoordBuffer.count != 2 ||
                _texCoordBuffer.size != positionBuffer.size) {
                console.warn('LColladaParser> this geometry seems to have buffers of ' +
                    'different sizes ( positions.size != texCoord.size ) ' +
                    'creating default with zeros instead');
                _texCoordBuffer = new core.LColladaVertexBuffer();
                _texCoordBuffer.count = 2;
                _texCoordBuffer.size = positionBuffer.size;
                _texCoordBuffer.data = new Float32Array(2 * positionBuffer.size);
            }
            return _texCoordBuffer;
        };
        LColladaParser.prototype._appendBufferIntoVec3Array = function (buffer, vec3Array, scale) {
            if (buffer.count != 3) {
                console.warn('LColladaParser> this buffer cant be appended to vec3 array');
                return false;
            }
            for (var q = 0; q < buffer.size; q++) {
                vec3Array.push(new core.LVec3(buffer.data[3 * q + 0] * scale, buffer.data[3 * q + 1] * scale, buffer.data[3 * q + 2] * scale));
            }
            return true;
        };
        LColladaParser.prototype._appendBufferIntoVec2Array = function (buffer, vec2Array) {
            if (buffer.count != 2) {
                console.warn('LColladaParser> this buffer cant be appended to vec2 array');
                return false;
            }
            for (var q = 0; q < buffer.size; q++) {
                vec2Array.push(new core.LVec2(buffer.data[2 * q + 0], buffer.data[2 * q + 1]));
            }
            return true;
        };
        LColladaParser.prototype._compensateIndices = function (indexBuffer, offset) {
            for (var q = 0; q < indexBuffer.data.length; q++) {
                indexBuffer.data[q] += offset;
            }
        };
        LColladaParser.prototype._appendBufferIntoInd3Array = function (indexBuffer, ind3Array) {
            if (indexBuffer.count != 3) {
                console.warn('LColladaParser> this index buffer cant be appended to ind3 array');
                return false;
            }
            for (var q = 0; q < indexBuffer.size; q++) {
                ind3Array.push(new core.LInd3(indexBuffer.data[3 * q + 0], indexBuffer.data[3 * q + 1], indexBuffer.data[3 * q + 2]));
            }
            return true;
        };
        return LColladaParser;
    }());
    core.LColladaParser = LColladaParser;
})(core || (core = {}));
