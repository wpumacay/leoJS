/// <reference path="RKinTree.ts" />
/// <reference path="../../ext/cat1js/core/assets/LAssetsManager.ts"/>
var leojs;
(function (leojs) {
    var RUrdfGeometryType;
    (function (RUrdfGeometryType) {
        RUrdfGeometryType["NONE"] = "none";
        RUrdfGeometryType["BOX"] = "box";
        RUrdfGeometryType["CYLINDER"] = "cylinder";
        RUrdfGeometryType["SPHERE"] = "sphere";
        RUrdfGeometryType["MESH"] = "mesh";
    })(RUrdfGeometryType = leojs.RUrdfGeometryType || (leojs.RUrdfGeometryType = {}));
    var RUrdfLinkGeometry = /** @class */ (function () {
        function RUrdfLinkGeometry() {
            this.type = RUrdfGeometryType.NONE;
            this.b_width = 1;
            this.b_height = 1;
            this.b_depth = 1;
            this.c_radius = 1;
            this.c_length = 1;
            this.s_radius = 1;
            this.m_meshId = '';
        }
        RUrdfLinkGeometry.prototype.toDictProperties = function () {
            var _res = {};
            _res['b_width'] = this.b_width;
            _res['b_height'] = this.b_height;
            _res['b_depth'] = this.b_depth;
            _res['c_radius'] = this.c_radius;
            _res['c_length'] = this.c_length;
            _res['s_radius'] = this.s_radius;
            _res['m_meshId'] = this.m_meshId;
            _res['type'] = this.type;
            return _res;
        };
        return RUrdfLinkGeometry;
    }());
    leojs.RUrdfLinkGeometry = RUrdfLinkGeometry;
    var RUrdfLink = /** @class */ (function () {
        function RUrdfLink() {
            this.id = '';
            this.xyz = new core.LVec3(0, 0, 0);
            this.rpy = new core.LVec3(0, 0, 0);
            this.geometry = new RUrdfLinkGeometry();
            this.parentId = '';
            this.jointToParentId = '',
                this.childId = '';
            this.jointToChildId = '';
        }
        return RUrdfLink;
    }());
    leojs.RUrdfLink = RUrdfLink;
    var RUrdfJoint = /** @class */ (function () {
        function RUrdfJoint() {
            this.id = '';
            this.xyz = new core.LVec3(0, 0, 0);
            this.rpy = new core.LVec3(0, 0, 0);
            this.axis = new core.LVec3(0, 0, 1); // default 'z'
            this.type = 'revolute';
            this.parentId = '';
            this.childId = '';
        }
        return RUrdfJoint;
    }());
    leojs.RUrdfJoint = RUrdfJoint;
    var RUrdfModelParser = /** @class */ (function () {
        function RUrdfModelParser() {
            this.m_xmlParser = new DOMParser();
        }
        RUrdfModelParser.prototype.parse = function (modelUrdfStr) {
            var _doc = this.m_xmlParser.parseFromString(modelUrdfStr, 'text/xml');
            var _root = _doc.documentElement;
            var _links = this._parseLinks(_root);
            var _joints = this._parseJoints(_root);
            // Assemble the guy
            var _kinTree = this._makeKinTree(_links, _joints);
            return _kinTree;
        };
        RUrdfModelParser.prototype._parseLinks = function (rootElement) {
            var _links = {};
            var _linkElms = this._getImmediateChildrenByTagName(rootElement, 'link');
            for (var i = 0; i < _linkElms.length; i++) {
                var _linkId = _linkElms[i].getAttribute('name');
                _links[_linkId] = this._parseSingleLink(_linkElms[i]);
                _links[_linkId].id = _linkId;
            }
            return _links;
        };
        RUrdfModelParser.prototype._parseSingleLink = function (linkElm) {
            var _link = new RUrdfLink();
            // Check if has element inside, if not, it might be the root node, if ...
            // not, just return the default link
            if (linkElm.getElementsByTagName('visual').length != 0) {
                // For now, just support visual node
                var _visualElm = linkElm.getElementsByTagName('visual')[0];
                var _originElm = _visualElm.getElementsByTagName('origin')[0];
                var _geoElm = _visualElm.getElementsByTagName('geometry')[0];
                this._parseVisualOrigin(_link, _originElm);
                this._parseVisualGeometry(_link, _geoElm);
            }
            return _link;
        };
        RUrdfModelParser.prototype._parseVisualOrigin = function (link, originElm) {
            link.xyz = this._getVec3Attrib(originElm, 'xyz', core.ZERO);
            link.rpy = this._getVec3Attrib(originElm, 'rpy', core.ZERO);
        };
        RUrdfModelParser.prototype._parseVisualGeometry = function (link, geoElm) {
            // Check each type of possible geometry
            if (geoElm.getElementsByTagName('box').length > 0) {
                var _boxElm = geoElm.getElementsByTagName('box')[0];
                var _boxSize = this._getArrayAttrib(_boxElm, 'size', [1, 1, 1]);
                link.geometry.type = RUrdfGeometryType.BOX;
                link.geometry.b_width = _boxSize[0];
                link.geometry.b_height = _boxSize[1];
                link.geometry.b_depth = _boxSize[2];
            }
            else if (geoElm.getElementsByTagName('cylinder').length > 0) {
                var _cylElm = geoElm.getElementsByTagName('cylinder')[0];
                var _cylRadius = this._getNumberAttrib(_cylElm, 'radius', 1);
                var _cylLength = this._getNumberAttrib(_cylElm, 'length', 1);
                link.geometry.type = RUrdfGeometryType.CYLINDER;
                link.geometry.c_radius = _cylRadius;
                link.geometry.c_length = _cylLength;
            }
            else if (geoElm.getElementsByTagName('sphere').length > 0) {
                var _sphElm = geoElm.getElementsByTagName('sphere')[0];
                var _sphRadius = this._getNumberAttrib(_sphElm, 'radius', 1);
                link.geometry.type = RUrdfGeometryType.SPHERE;
                link.geometry.s_radius = _sphRadius;
            }
            else if (geoElm.getElementsByTagName('mesh').length > 0) {
                var _meshElm = geoElm.getElementsByTagName('mesh')[0];
                var _meshFullPath = this._getStringAttrib(_meshElm, 'filename', '');
                if (_meshFullPath == '') {
                    console.warn('RUrdfModelParser> could not extract filename for mesh geometry' +
                        '; using box to avoid crashes');
                    // Use a default box to avoid crashing
                    link.geometry.type = RUrdfGeometryType.BOX;
                    link.geometry.b_width = 1;
                    link.geometry.b_height = 1;
                    link.geometry.b_depth = 1;
                }
                else {
                    var _pathSplit = _meshFullPath.split('/');
                    var _meshFileName = _pathSplit[_pathSplit.length - 1];
                    var _meshFileNameSplit = _meshFileName.split('.');
                    // Assuming files are of type 'meshId.format', so extracting format away
                    var _meshId = _meshFileNameSplit[0];
                    if (core.LAssetsManager.INSTANCE.getModel(_meshId)) {
                        // Model exists, so just use it
                        link.geometry.type = RUrdfGeometryType.MESH;
                        link.geometry.m_meshId = _meshId;
                    }
                    else {
                        // Use a default box, as the mesh is not there
                        console.warn('RUrdfModelParser> mesh with id: ' + _meshId +
                            ' does not exist; using box to avoid crashes');
                        link.geometry.type = RUrdfGeometryType.BOX;
                        link.geometry.b_width = 1;
                        link.geometry.b_height = 1;
                        link.geometry.b_depth = 1;
                    }
                }
            }
        };
        RUrdfModelParser.prototype._parseJoints = function (rootElement) {
            var _joints = {};
            var _jointElms = this._getImmediateChildrenByTagName(rootElement, 'joint');
            for (var i = 0; i < _jointElms.length; i++) {
                var _jointId = _jointElms[i].attributes['name'].nodeValue;
                _joints[_jointId] = this._parseSingleJoint(_jointElms[i]);
                _joints[_jointId].id = _jointId;
            }
            return _joints;
        };
        RUrdfModelParser.prototype._parseSingleJoint = function (jointElm) {
            var _joint = new RUrdfJoint();
            this._parseJointOrigin(_joint, jointElm);
            this._parseJointConnection(_joint, jointElm);
            this._parseJointAxis(_joint, jointElm);
            this._parseJointType(_joint, jointElm);
            return _joint;
        };
        RUrdfModelParser.prototype._parseJointOrigin = function (joint, jointElm) {
            if (jointElm.getElementsByTagName('origin').length != 0) {
                var _originElm = jointElm.getElementsByTagName('origin')[0];
                joint.xyz = this._getVec3Attrib(_originElm, 'xyz', core.ZERO);
                joint.rpy = this._getVec3Attrib(_originElm, 'rpy', core.ZERO);
            }
            else {
                console.warn('RUrdfModelParser> there is a joint with no origin');
            }
        };
        RUrdfModelParser.prototype._parseJointConnection = function (joint, jointElm) {
            if (jointElm.getElementsByTagName('parent').length != 0 &&
                jointElm.getElementsByTagName('child').length != 0) {
                var _parentElm = jointElm.getElementsByTagName('parent')[0];
                var _childElm = jointElm.getElementsByTagName('child')[0];
                joint.parentId = this._getStringAttrib(_parentElm, 'link', '');
                joint.childId = this._getStringAttrib(_childElm, 'link', '');
            }
            else {
                console.warn('RUrdfModelParser> there is a joint with no parent-child connections');
            }
        };
        RUrdfModelParser.prototype._parseJointAxis = function (joint, jointElm) {
            if (jointElm.getElementsByTagName('axis').length != 0) {
                var _axisElm = jointElm.getElementsByTagName('axis')[0];
                joint.axis = this._getVec3Attrib(_axisElm, 'xyz', core.AXIS_Z);
            }
            else {
                console.info('RUrdfModelParser> this joint does not use an axis');
            }
        };
        RUrdfModelParser.prototype._parseJointType = function (joint, jointElm) {
            var _jointTypeStr = jointElm.getAttribute('type');
            if (!_jointTypeStr || _jointTypeStr == '') {
                _jointTypeStr = leojs.RKinJointTypeFixed;
            }
            if (_jointTypeStr != leojs.RKinJointTypeFixed &&
                _jointTypeStr != leojs.RKinJointTYpePrismatic &&
                _jointTypeStr != leojs.RKinJointTypeRevolute) {
                console.warn('RUrdfModelParser> joint with a not' +
                    ' correctly type: ' + _jointTypeStr +
                    '. Using _fixed_ as default');
                _jointTypeStr = leojs.RKinJointTypeFixed;
            }
            joint.type = _jointTypeStr;
        };
        RUrdfModelParser.prototype._makeKinTree = function (links, joints) {
            // Extract the link that is the root of the ...
            // tree ( has children but not parent in joints )
            var _rootLink = this._getRootLink(links, joints);
            if (!_rootLink) {
                console.warn('RUrdfModelParser> this model has no root as the base :(');
                return null;
            }
            var _kinTree = new leojs.RKinTree();
            var _kinNodes = this._makeKinNodes(links);
            var _kinJoints = this._makeKinJoints(joints);
            this._assembleKinTree(_kinTree, _kinNodes, _kinJoints);
            _kinTree.setRootNode(_kinNodes[_rootLink.id]);
            return _kinTree;
        };
        RUrdfModelParser.prototype._getRootLink = function (links, joints) {
            var _rootLink = null;
            var _keyJoint;
            for (_keyJoint in joints) {
                var _childId = joints[_keyJoint].childId;
                var _parentId = joints[_keyJoint].parentId;
                // Just in case, check the link exists. The urdf may be messed up
                if (links[_childId]) {
                    links[_childId].parentId = _parentId;
                    links[_childId].jointToParentId = _keyJoint;
                }
                if (links[_parentId]) {
                    links[_parentId].childId = _childId;
                    links[_parentId].jointToChildId = _keyJoint;
                }
            }
            var _keyLink;
            for (_keyLink in links) {
                if ((links[_keyLink].childId == '') ||
                    (links[_keyLink].parentId != '')) {
                    continue;
                }
                // This link must be a root, just check that the urdf does not ...
                // have more than two possible roots, as that should be invalid
                if (_rootLink) {
                    console.warn('RUrdfModelParser> this model seems to have more ' +
                        'than two root links, and that should not happen if this ' +
                        'model represents a single kintree ( connections are one to one )');
                    continue;
                }
                _rootLink = links[_keyLink];
            }
            return _rootLink;
        };
        RUrdfModelParser.prototype._makeKinNodes = function (links) {
            var _kinNodes = {};
            for (var _key in links) {
                var _link = links[_key];
                var _kinNode = new leojs.RKinNode(_link.id);
                _kinNode.initNode(_link.xyz, _link.rpy, _link.geometry.toDictProperties());
                _kinNodes[_kinNode.getId()] = _kinNode;
            }
            return _kinNodes;
        };
        RUrdfModelParser.prototype._makeKinJoints = function (joints) {
            var _kinJoints = {};
            for (var _key in joints) {
                var _joint = joints[_key];
                var _kinJoint = new leojs.RKinJoint(_joint.id);
                _kinJoint.initJoint(_joint.xyz, _joint.rpy, _joint.axis, _joint.type, _joint.parentId, _joint.childId);
                _kinJoints[_kinJoint.getId()] = _kinJoint;
            }
            return _kinJoints;
        };
        RUrdfModelParser.prototype._assembleKinTree = function (kinTree, kinNodes, kinJoints) {
            // First, populate with the corresponding connections
            for (var _key in kinJoints) {
                var _parentId = kinJoints[_key].getParentId();
                var _childId = kinJoints[_key].getChildId();
                if (!kinNodes[_parentId] ||
                    !kinNodes[_childId]) {
                    console.warn('RUrdfModelParser> there is a joint that ' +
                        'connects non existent nodes: ' +
                        'child= ' + _childId + ' - parent= ' + _parentId);
                    continue;
                }
                // Make joint connection
                kinJoints[_key].connect(kinNodes[_parentId], kinNodes[_childId]);
                // Add joint connection to the parent node
                kinNodes[_parentId].addJointConnection(kinJoints[_key]);
                kinNodes[_childId].setParentJointConnection(kinJoints[_key]);
            }
            // Add them all
            for (var _jointId in kinJoints) {
                kinTree.addKinJoint(kinJoints[_jointId]);
            }
            for (var _nodeId in kinNodes) {
                kinTree.addKinNode(kinNodes[_nodeId]);
            }
        };
        // Some helpers
        RUrdfModelParser.prototype._getStringAttrib = function (elm, attribName, defValue) {
            var _str = elm.getAttribute(attribName);
            if (!_str || _str == '') {
                console.info('RUrdfModelParser> attrib: ' + attribName + ' not found. Using ' +
                    'default value: ' + defValue + ' instead');
                return defValue;
            }
            return _str;
        };
        RUrdfModelParser.prototype._getNumberAttrib = function (elm, attribName, defValue) {
            var _numStr = elm.getAttribute(attribName);
            if (!_numStr || _numStr == '') {
                console.info('RUrdfModelParser> attrib: ' + attribName + ' not found. Using ' +
                    'default value: ' + defValue + ' instead');
                return defValue;
            }
            var _val = parseFloat(_numStr);
            if (isNaN(_val)) {
                console.warn('RUrdfModelParser> attrib: ' + attribName + ' is not a number, ' +
                    'using default value: ' + defValue + ' instead');
                return defValue;
            }
            return _val;
        };
        RUrdfModelParser.prototype._getArrayAttrib = function (elm, attribName, defValue) {
            var _arrStr = elm.getAttribute(attribName);
            if (!_arrStr || _arrStr == '') {
                console.info('RUrdfModelParser> attrib: ' + attribName + ' not found. Using ' +
                    'default value: ' + defValue + ' instead');
                return defValue;
            }
            var _arr = _arrStr.split(' ').map(Number);
            for (var q = 0; q < _arr.length; q++) {
                if (isNaN(_arr[q])) {
                    console.warn('RUrdfModelParser> attrib: ' + attribName +
                        ' is not an array of numbers, using default value: ' +
                        defValue + ' instead');
                    return defValue;
                }
            }
            if (_arr.length != defValue.length) {
                console.warn('RUrdfModelParser> attrib: ' + attribName +
                    ' does not have the expected length, using default value instead');
                return defValue;
            }
            return _arr;
        };
        RUrdfModelParser.prototype._getVec3Attrib = function (elm, attribName, defValue) {
            var _data = this._getArrayAttrib(elm, attribName, [0, 0, 0]);
            if (_data.length != 3) {
                console.warn('RUrdfModelParser> attrib: ' + attribName +
                    ' is not a vec3, using default: ' + defValue);
                return defValue.clone();
            }
            return new core.LVec3(_data[0], _data[1], _data[2]);
        };
        RUrdfModelParser.prototype._getImmediateChildrenByTagName = function (elm, name) {
            var _res = [];
            var _candidates = elm.children;
            for (var q = 0; q < _candidates.length; q++) {
                if (_candidates[q].tagName == name) {
                    _res.push(_candidates[q]);
                }
            }
            return _res;
        };
        return RUrdfModelParser;
    }());
    leojs.RUrdfModelParser = RUrdfModelParser;
})(leojs || (leojs = {}));
