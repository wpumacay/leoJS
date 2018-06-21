/// <reference path="../../ext/cat1js/core/math/LMath.ts" />
var leojs;
(function (leojs) {
    leojs.RKinGeometryTypeBox = 'box';
    leojs.RKinGeometryTypeCylinder = 'cylinder';
    leojs.RKinGeometryTypeSphere = 'sphere';
    leojs.RKinGeometryTypeMesh = 'mesh';
    leojs.RKinJointTypeFixed = 'fixed';
    leojs.RKinJointTypeRevolute = 'revolute';
    leojs.RKinJointTYpePrismatic = 'prismatic';
    var RKinNodeGeometry = /** @class */ (function () {
        function RKinNodeGeometry() {
            this.type = leojs.RKinGeometryTypeBox;
            this.b_width = 1;
            this.b_height = 1;
            this.b_depth = 1;
            this.c_radius = 1;
            this.c_length = 1;
            this.s_radius = 1;
            this.m_meshId = '';
        }
        RKinNodeGeometry.fromDict = function (geometryProperties) {
            var _rkinGeometry = new RKinNodeGeometry();
            _rkinGeometry.b_width = geometryProperties['b_width'];
            _rkinGeometry.b_height = geometryProperties['b_height'];
            _rkinGeometry.b_depth = geometryProperties['b_depth'];
            _rkinGeometry.c_radius = geometryProperties['c_radius'];
            _rkinGeometry.c_length = geometryProperties['c_length'];
            _rkinGeometry.s_radius = geometryProperties['s_radius'];
            _rkinGeometry.m_meshId = geometryProperties['m_meshId'];
            _rkinGeometry.type = geometryProperties['type'];
            return _rkinGeometry;
        };
        return RKinNodeGeometry;
    }());
    leojs.RKinNodeGeometry = RKinNodeGeometry;
    var RKinNode = /** @class */ (function () {
        function RKinNode(nodeId) {
            this.m_id = nodeId;
            this.m_parentJoint = null;
            this.m_childrenJoints = [];
            this.m_localTransform = new core.LMat4();
            this.m_linkTransform = new core.LMat4();
            this.m_worldTransform = new core.LMat4();
            this.m_geometry = null;
        }
        RKinNode.prototype.release = function () {
            this.m_parentJoint = null;
            if (this.m_childrenJoints) {
                for (var q = 0; q < this.m_childrenJoints.length; q++) {
                    this.m_childrenJoints[q] = null;
                }
                this.m_childrenJoints = null;
            }
            this.m_localTransform = null;
            this.m_linkTransform = null;
            this.m_worldTransform = null;
            this.m_geometry = null;
        };
        RKinNode.prototype.initNode = function (lxyz, lrpy, geometryProperties) {
            core.LMat4.fromPosEulerInPlace(this.m_localTransform, lxyz, lrpy);
            this.m_geometry = RKinNodeGeometry.fromDict(geometryProperties);
        };
        RKinNode.prototype.getGeometry = function () { return this.m_geometry; };
        RKinNode.prototype.getLocalTransform = function () { return this.m_localTransform; };
        RKinNode.prototype.getLinkTransform = function () { return this.m_linkTransform; };
        RKinNode.prototype.getWorldTransform = function () { return this.m_worldTransform; };
        RKinNode.prototype.getId = function () { return this.m_id; };
        RKinNode.prototype.getChildrenJoints = function () { return this.m_childrenJoints; };
        RKinNode.prototype.getParentJoint = function () { return this.m_parentJoint; };
        RKinNode.prototype.addJointConnection = function (joint) {
            this.m_childrenJoints.push(joint);
        };
        RKinNode.prototype.setParentJointConnection = function (parentJoint) {
            this.m_parentJoint = parentJoint;
        };
        RKinNode.prototype.updateNode = function () {
            // Called recursively to update the nodes in the tree
            // Compute total tranform
            if (this.m_parentJoint != null) {
                var _parentTransform = this.m_parentJoint.getParentNode().getLinkTransform();
                var _jointTransform = this.m_parentJoint.getJointTransform();
                core.mulMatMat44InPlace(this.m_linkTransform, _parentTransform, _jointTransform);
            }
            else {
                core.LMat4.setToIdentity(this.m_linkTransform);
            }
            core.mulMatMat44InPlace(this.m_worldTransform, this.m_linkTransform, this.m_localTransform);
            // Update children recursively
            for (var q = 0; q < this.m_childrenJoints.length; q++) {
                var _child = this.m_childrenJoints[q].getChildNode();
                _child.updateNode();
            }
        };
        return RKinNode;
    }());
    leojs.RKinNode = RKinNode;
    var RKinJoint = /** @class */ (function () {
        function RKinJoint(jointId) {
            this.m_id = jointId;
            this.m_parent = null;
            this.m_parentId = '';
            this.m_child = null;
            this.m_childId = '';
            this.m_xyz = new core.LVec3(0, 0, 0);
            this.m_rpy = new core.LVec3(0, 0, 0);
            this.m_axis = new core.LVec3(0, 0, 0);
            this.m_jointValue = 0;
            this.m_jointType = leojs.RKinJointTypeFixed;
            this.m_jointBaseTransform = new core.LMat4();
            this.m_jointVariableTransform = new core.LMat4();
            this.m_jointTransform = new core.LMat4();
        }
        RKinJoint.prototype.release = function () {
            this.m_parent = null;
            this.m_child = null;
            this.m_xyz = null;
            this.m_rpy = null;
            this.m_axis = null;
            this.m_jointBaseTransform = null;
            this.m_jointVariableTransform = null;
            this.m_jointTransform = null;
        };
        RKinJoint.prototype.initJoint = function (jxyz, jrpy, axis, type, parentId, childId) {
            this.m_xyz = jxyz;
            this.m_rpy = jrpy;
            this.m_axis = axis;
            this.m_jointType = type;
            this.m_parentId = parentId;
            this.m_childId = childId;
            core.LMat4.fromPosEulerInPlace(this.m_jointBaseTransform, this.m_xyz, this.m_rpy);
        };
        RKinJoint.prototype.getParentId = function () { return this.m_parentId; };
        RKinJoint.prototype.getChildId = function () { return this.m_childId; };
        RKinJoint.prototype.getId = function () { return this.m_id; };
        RKinJoint.prototype.getParentNode = function () { return this.m_parent; };
        RKinJoint.prototype.getChildNode = function () { return this.m_child; };
        RKinJoint.prototype.getJointTransform = function () { return this.m_jointTransform; };
        RKinJoint.prototype.getJointType = function () { return this.m_jointType; };
        RKinJoint.prototype.getJointAxis = function () { return this.m_axis; };
        RKinJoint.prototype.getJointXYZ = function () { return this.m_xyz; };
        RKinJoint.prototype.getJointRPY = function () { return this.m_rpy; };
        RKinJoint.prototype.connect = function (parentNode, childNode) {
            this.m_parent = parentNode;
            this.m_child = childNode;
        };
        RKinJoint.prototype.setJointValue = function (jointValue) {
            this.m_jointValue = jointValue;
        };
        RKinJoint.prototype.getJointValue = function () {
            return this.m_jointValue;
        };
        RKinJoint.prototype.updateJoint = function () {
            // Update the joint variable transform ( 'transform around axis' )
            if (this.m_jointType == leojs.RKinJointTypeRevolute) {
                core.LMat4.rotationAroundAxisInPlace(this.m_jointVariableTransform, this.m_axis, this.m_jointValue);
            }
            else if (this.m_jointType == leojs.RKinJointTYpePrismatic) {
                core.LMat4.translationAlongAxisInPlace(this.m_jointVariableTransform, this.m_axis, this.m_jointValue);
            }
            // Update the 'total' joint transform
            core.mulMatMat44InPlace(this.m_jointTransform, this.m_jointBaseTransform, this.m_jointVariableTransform);
        };
        return RKinJoint;
    }());
    leojs.RKinJoint = RKinJoint;
    var RKinTree = /** @class */ (function () {
        function RKinTree() {
            this.m_rootNode = null;
            this.m_kinNodes = {};
            this.m_kinJoints = {};
        }
        RKinTree.prototype.release = function () {
            if (this.m_kinNodes) {
                for (var key in this.m_kinNodes) {
                    this.m_kinNodes[key].release();
                    this.m_kinNodes[key] = null;
                }
                this.m_kinNodes = null;
            }
            if (this.m_kinJoints) {
                for (var key in this.m_kinJoints) {
                    this.m_kinJoints[key].release();
                    this.m_kinJoints[key] = null;
                }
                this.m_kinJoints = null;
            }
            this.m_rootNode = null;
        };
        RKinTree.prototype.setRootNode = function (node) {
            if (this.m_rootNode) {
                console.warn('RKinTree> changing the root node ' +
                    'from an already set one');
            }
            this.m_rootNode = node;
        };
        RKinTree.prototype.addKinNode = function (node) {
            if (this.m_kinNodes[node.getId()]) {
                console.warn('RKinTree> a node with id: ' +
                    node.getId() + ' already exists ' +
                    'in the tree. Skipping new one');
                return;
            }
            this.m_kinNodes[node.getId()] = node;
        };
        RKinTree.prototype.addKinJoint = function (joint) {
            if (this.m_kinJoints[joint.getId()]) {
                console.warn('RKinTree> a joint with id: ' +
                    joint.getId() + ' already exists ' +
                    'in the tree. Skipping new one');
                return;
            }
            this.m_kinJoints[joint.getId()] = joint;
        };
        RKinTree.prototype.nodes = function () { return this.m_kinNodes; };
        RKinTree.prototype.joints = function () { return this.m_kinJoints; };
        RKinTree.prototype.update = function () {
            // Update all the nodes so that ...
            // they update their transforms
            for (var _jointId in this.m_kinJoints) {
                this.m_kinJoints[_jointId].updateJoint();
            }
            // Traverse the tree accordingly
            if (this.m_rootNode) {
                this.m_rootNode.updateNode();
            }
        };
        return RKinTree;
    }());
    leojs.RKinTree = RKinTree;
})(leojs || (leojs = {}));
