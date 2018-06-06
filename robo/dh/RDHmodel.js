/// <reference path="../../core/entities/REntity.ts" />
/// <reference path="../../core/components/graphics/RReferenceFrameComponent.ts" />
/// <reference path="../../core/components/graphics/RMesh3dComponent.ts" />
/// <reference path="../../ext/cat1js/engine3d/debug/LDebugSystem.ts" />
/// <reference path="RDHcommon.ts" />
/// <reference path="RDHWorld.ts" />
/// <reference path="components/RDHendEffectorComponent.ts" />
/// <reference path="components/RDHjointRevoluteComponent.ts" />
/// <reference path="components/RDHjointPrismaticComponent.ts" />
var leojs;
(function (leojs) {
    var RDHmodel = /** @class */ (function () {
        function RDHmodel(world) {
            this.m_dhTable = new leojs.RDHtable();
            this.m_frames = [];
            this.m_joints = [];
            this.m_world = world;
            this.m_time = 0.0;
            this.m_xyzMinEstimate = new core.LVec3(0, 0, 0);
            this.m_xyzMaxEstimate = new core.LVec3(0, 0, 0);
            this.m_xyzZeroPosition = new core.LVec3(0, 0, 0);
            this.m_rpyZeroPosition = new core.LVec3(0, 0, 0);
            this.m_visibility = true;
            this.m_endEffectorTotalTransform = new core.LMat4();
            this.m_endEffectorCompensation = new core.LMat4();
            this._buildDHrepresentation();
            this._buildModel();
            this._computeEndEffectorOffset();
            this._computeMinMaxEstimates();
            this._computeXYZzeroPosition();
        }
        RDHmodel.prototype.xyzMinEstimate = function () { return this.m_xyzMinEstimate; };
        RDHmodel.prototype.xyzMaxEstimate = function () { return this.m_xyzMaxEstimate; };
        RDHmodel.prototype.xyzZeroPosition = function () { return this.m_xyzZeroPosition; };
        RDHmodel.prototype.rpyZeroPosition = function () { return this.m_rpyZeroPosition; };
        RDHmodel.prototype._computeXYZzeroPosition = function () {
            // Initialize transform with default zero joint values
            this.m_dhTable.update(0);
            // Get the zero position from this initial configuration
            // Update end effector
            core.mulMatMat44InPlace(this.m_endEffectorTotalTransform, this.m_dhTable.getFullTransform(), this.m_endEffectorCompensation);
            core.LMat4.extractPositionInPlace(this.m_xyzZeroPosition, this.m_endEffectorTotalTransform);
            core.LMat4.extractEulerFromRotationInPlace(this.m_rpyZeroPosition, this.m_endEffectorTotalTransform);
        };
        RDHmodel.prototype._buildModel = function () {
            var _baseMesh = leojs.buildPrimitive({ 'shape': 'box',
                'width': 0.25,
                'depth': 0.5,
                'height': 0.25 }, { 'material': 'simple',
                'color': core.GRAY });
            this.m_base = new leojs.REntity();
            this.m_base.addComponent(new leojs.RMesh3dComponent(this.m_base, _baseMesh));
            this.m_world.addEntity(this.m_base);
            this.m_endEffector = new leojs.REntity();
            this.m_endEffector.addComponent(new leojs.RDHendEffectorComponent(this.m_endEffector));
            this.m_world.addEntity(this.m_endEffector);
            var _entries = this.m_dhTable.entries();
            for (var q = 0; q < _entries.length; q++) {
                // Build frame entity to track the link's pos and rot
                var _frameEntity = new leojs.REntity();
                var _frameGraphicsComponent = new leojs.RReferenceFrameComponent(_frameEntity);
                _frameEntity.addComponent(_frameGraphicsComponent);
                this.m_world.addEntity(_frameEntity);
                this.m_frames.push(_frameEntity);
                // Build the joint for visualization purposes
                var _jType = _entries[q].getJointType();
                var _jointEntity = this._buildJoint(_jType);
                this.m_world.addEntity(_jointEntity);
                this.m_joints.push(_jointEntity);
            }
            this._updateModel();
        };
        RDHmodel.prototype._buildJoint = function (type) {
            var _jointEntity = new leojs.REntity();
            if (type == leojs.JointType.PRISMATIC) {
                _jointEntity.addComponent(new leojs.RDHjointPrismaticComponent(_jointEntity));
            }
            else if (type == leojs.JointType.REVOLUTE) {
                _jointEntity.addComponent(new leojs.RDHjointRevoluteComponent(_jointEntity));
            }
            return _jointEntity;
        };
        RDHmodel.prototype._updateModel = function () {
            var _entries = this.m_dhTable.entries();
            if (_entries.length > 0) {
                if (this.m_visibility) {
                    engine3d.DebugSystem.drawLine(this.m_base.position, this.m_frames[0].position, core.CYAN);
                }
            }
            for (var q = 0; q < _entries.length; q++) {
                var _frameEntity = this.m_frames[q];
                var _jointEntity = this.m_joints[q];
                var _transform = this.m_dhTable.getTransformInRange(0, q);
                core.LMat4.extractPositionInPlace(_frameEntity.position, _transform);
                core.LMat4.extractEulerFromRotationInPlace(_frameEntity.rotation, _transform);
                if (q < (_entries.length - 1)) {
                    if (this.m_visibility) {
                        engine3d.DebugSystem.drawLine(this.m_frames[q].position, this.m_frames[q + 1].position, core.CYAN);
                    }
                }
                core.LMat4.extractPositionInPlace(_jointEntity.position, _transform);
                core.LMat4.extractEulerFromRotationInPlace(_jointEntity.rotation, _transform);
                if (_entries[q].getJointType() == leojs.JointType.REVOLUTE) {
                    var _revJointComp = _jointEntity.getComponent(leojs.RComponentType.GRAPHICS);
                    _revJointComp.setJointValue(this.m_dhTable.getJointValue(q));
                }
                else if (_entries[q].getJointType() == leojs.JointType.PRISMATIC) {
                    var _priJointComp = _jointEntity.getComponent(leojs.RComponentType.GRAPHICS);
                    _priJointComp.setJointValue(this.m_dhTable.getJointValue(q));
                }
            }
            // Update end effector
            core.mulMatMat44InPlace(this.m_endEffectorTotalTransform, this.m_dhTable.getFullTransform(), this.m_endEffectorCompensation);
            core.LMat4.extractPositionInPlace(this.m_endEffector.position, this.m_endEffectorTotalTransform);
            core.LMat4.extractEulerFromRotationInPlace(this.m_endEffector.rotation, this.m_endEffectorTotalTransform);
        };
        RDHmodel.prototype.forward = function (jointValues) {
            // Check if the right number of joints has been provided
            if (jointValues.length == this.m_dhTable.numJoints()) {
                for (var q = 0; q < this.m_dhTable.numJoints(); q++) {
                    this.m_dhTable.setJointValue(jointValues[q], q);
                }
            }
            else {
                console.warn('RDHmodel> wrong number of joints sent for forward kinematics');
            }
            this.m_dhTable.update(0);
            return this.m_dhTable.getEndEffectorXYZ().clone();
        };
        RDHmodel.prototype.update = function (dt) {
            this.m_time += dt * 0.001;
            // this.m_dhTable.setJointValue( this.m_dhTable.getJointValue( 0 ) + dt * 0.00025, 0 );
            // this.m_dhTable.setJointValue( this.m_dhTable.getJointValue( 1 ) + dt * 0.00025, 1 );
            // this.m_dhTable.setJointValue( 2.5 * ( Math.sin( this.m_time * 0.5 ) + 1 ) , 2 );
            // Update internal states of the robot representation
            this.m_dhTable.update(dt);
            // Update model of the robot using the before updated representation
            this._updateModel();
        };
        RDHmodel.prototype.getDHtable = function () { return this.m_dhTable; };
        RDHmodel.prototype.getJointValueById = function (jointId) {
            return this.m_dhTable.getJointValueById(jointId);
        };
        RDHmodel.prototype.doesJointExist = function (jointId) {
            return this.m_dhTable.doesJointExist(jointId);
        };
        RDHmodel.prototype.getEndEffectorXYZ = function () {
            var _pos = new core.LVec3(0, 0, 0);
            core.LMat4.extractPositionInPlace(_pos, this.m_endEffectorTotalTransform);
            return _pos;
        };
        RDHmodel.prototype.getEndEffectorRPY = function () {
            var _rpy = new core.LVec3(0, 0, 0);
            core.LMat4.extractEulerFromRotationInPlace(_rpy, this.m_endEffectorTotalTransform);
            return _rpy;
        };
        RDHmodel.prototype.setModelVisibility = function (visible) {
            this.m_visibility = visible;
            for (var _i = 0, _a = this.m_frames; _i < _a.length; _i++) {
                var _frame = _a[_i];
                _frame.setVisibility(visible);
            }
            for (var _b = 0, _c = this.m_joints; _b < _c.length; _b++) {
                var _joint = _c[_b];
                _joint.setVisibility(visible);
            }
            if (this.m_endEffector) {
                this.m_endEffector.setVisibility(visible);
            }
            if (this.m_base) {
                this.m_base.setVisibility(visible);
            }
        };
        return RDHmodel;
    }());
    leojs.RDHmodel = RDHmodel;
})(leojs || (leojs = {}));
