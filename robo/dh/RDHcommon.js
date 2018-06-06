/// <reference path="../../ext/cat1js/core/math/LMath.ts" />
var leojs;
(function (leojs) {
    var JointType;
    (function (JointType) {
        JointType[JointType["NONE"] = 0] = "NONE";
        JointType[JointType["REVOLUTE"] = 1] = "REVOLUTE";
        JointType[JointType["PRISMATIC"] = 2] = "PRISMATIC";
    })(JointType = leojs.JointType || (leojs.JointType = {}));
    // 1 Axis -> 1Dof. In mechanical manipulators, it seems that for every axis, ...
    // the related joint has a dof along that axis ( either prismatic of revolute type )
    leojs.DHjointTypes = [JointType.NONE,
        JointType.NONE,
        JointType.PRISMATIC,
        JointType.REVOLUTE]; // theta_i_1
    var DHparams;
    (function (DHparams) {
        DHparams[DHparams["alpha_i_1"] = 0] = "alpha_i_1";
        DHparams[DHparams["a_i_1"] = 1] = "a_i_1";
        DHparams[DHparams["d_i"] = 2] = "d_i";
        DHparams[DHparams["theta_i"] = 3] = "theta_i";
    })(DHparams = leojs.DHparams || (leojs.DHparams = {}));
    var RDHentry = /** @class */ (function () {
        function RDHentry(jointId, pFixed, pValues, pMinJointValue, pMaxJointValue, jointSign, jointOffset) {
            console.assert(pFixed.length == 4, 'wrong length for pFixed parameter');
            console.assert(pValues.length == 4, 'wrong length for pValues parameter');
            this.m_jointId = jointId;
            this.m_fixed = pFixed;
            this.m_values = pValues;
            this.m_transform = new core.LMat4();
            this.m_jointSign = jointSign || 1.0;
            this.m_jointOffset = jointOffset || 0.0;
            this.m_jointType = this._getJointType();
            this.m_minJointValue = pMinJointValue;
            this.m_maxJointValue = pMaxJointValue;
            this.m_rangeJointValue = pMaxJointValue - pMinJointValue;
            this._updateTransform();
        }
        RDHentry.prototype.jointId = function () { return this.m_jointId; };
        RDHentry.prototype.fixed = function () { return this.m_fixed; };
        RDHentry.prototype.values = function () { return this.m_values; };
        RDHentry.prototype.minJointValue = function () { return this.m_minJointValue; };
        RDHentry.prototype.maxJointValue = function () { return this.m_maxJointValue; };
        RDHentry.prototype.rangeJointValue = function () { return this.m_rangeJointValue; };
        RDHentry.prototype.setParamValue = function (value, indx) {
            if (indx < 0 || indx > 3) {
                console.warn('RDHEntry> tried to access param with wrong indx: ' + indx);
                return;
            }
            this.m_values[indx] = value;
            this._updateTransform();
        };
        RDHentry.prototype.getParamValue = function (indx) {
            if (indx < 0 || indx > 3) {
                console.warn('RDHEntry> tried to access param with wrong indx: ' + indx);
                return 0;
            }
            return this.m_values[indx];
        };
        // Using Rx( alpha_i_1 ) * Dx( a_i_1 ) * Rz( theta_i ) * Dz( d_i )
        // Recall, Rx * Dx = Dx * Rx as they are applied in the same axis
        RDHentry.prototype._updateTransform = function () {
            var alpha_i_1 = this.m_values[DHparams.alpha_i_1];
            var a_i_1 = this.m_values[DHparams.a_i_1];
            var theta_i = this.m_values[DHparams.theta_i];
            var d_i = this.m_values[DHparams.d_i];
            if (this.m_jointType == JointType.REVOLUTE) {
                theta_i = theta_i * this.m_jointSign + this.m_jointOffset;
            }
            else if (this.m_jointType == JointType.PRISMATIC) {
                d_i = d_i * this.m_jointSign + this.m_jointOffset;
            }
            this.m_transform.buff[0] = Math.cos(theta_i);
            this.m_transform.buff[1] = Math.sin(theta_i) * Math.cos(alpha_i_1);
            this.m_transform.buff[2] = Math.sin(theta_i) * Math.sin(alpha_i_1);
            this.m_transform.buff[3] = 0;
            this.m_transform.buff[4] = -Math.sin(theta_i);
            this.m_transform.buff[5] = Math.cos(theta_i) * Math.cos(alpha_i_1);
            this.m_transform.buff[6] = Math.cos(theta_i) * Math.sin(alpha_i_1);
            this.m_transform.buff[7] = 0;
            this.m_transform.buff[8] = 0;
            this.m_transform.buff[9] = -Math.sin(alpha_i_1);
            this.m_transform.buff[10] = Math.cos(alpha_i_1);
            this.m_transform.buff[11] = 0;
            this.m_transform.buff[12] = a_i_1;
            this.m_transform.buff[13] = -Math.sin(alpha_i_1) * d_i;
            this.m_transform.buff[14] = Math.cos(alpha_i_1) * d_i;
            this.m_transform.buff[15] = 1;
        };
        RDHentry.prototype.getTransform = function () { return this.m_transform; };
        RDHentry.prototype._getJointType = function () {
            if (!this.m_fixed[DHparams.theta_i]) {
                return JointType.REVOLUTE;
            }
            else if (!this.m_fixed[DHparams.d_i]) {
                return JointType.PRISMATIC;
            }
            console.warn('RDHentry> there are 0 dof in this joint');
            return JointType.NONE;
        };
        RDHentry.prototype.getJointType = function () {
            return this.m_jointType;
        };
        return RDHentry;
    }());
    leojs.RDHentry = RDHentry;
    var RDHtable = /** @class */ (function () {
        function RDHtable() {
            this.m_entries = [];
            this.m_entriesById = {};
            this.m_totalTransform = new core.LMat4();
            this.m_xyz = new core.LVec3(0, 0, 0);
            this.m_rpy = new core.LVec3(0, 0, 0);
        }
        RDHtable.prototype.appendEntry = function (entry) {
            this.m_entries.push(entry);
            this.m_entriesById[entry.jointId()] = entry;
        };
        RDHtable.prototype.numJoints = function () { return this.m_entries.length; };
        RDHtable.prototype.setJointValue = function (value, indx) {
            if (indx < 0 || indx >= this.m_entries.length) {
                console.error('RDHtable> Trying to set value for out of range indx ' + indx);
                return;
            }
            var _entry = this.m_entries[indx];
            if (_entry.getJointType() == JointType.REVOLUTE) {
                value = this.validateJointValue(value, indx);
                _entry.setParamValue(value, DHparams.theta_i);
            }
            else if (_entry.getJointType() == JointType.PRISMATIC) {
                value = this.validateJointValue(value, indx);
                _entry.setParamValue(value, DHparams.d_i);
            }
        };
        RDHtable.prototype.validateJointValue = function (value, indx) {
            var _entry = this.m_entries[indx];
            if (value < _entry.minJointValue()) {
                console.log('RDHmodel> min value reached: ' + _entry.minJointValue());
                value = _entry.minJointValue();
            }
            else if (value > _entry.maxJointValue()) {
                console.log('RDHmodel> max value reached: ' + _entry.maxJointValue());
                value = _entry.maxJointValue();
            }
            return value;
        };
        RDHtable.prototype.getJointValue = function (indx) {
            if (indx < 0 || indx >= this.m_entries.length) {
                console.error('RDHtable> Trying to set value for out of range indx ' + indx);
                return 0;
            }
            var _entry = this.m_entries[indx];
            if (_entry.getJointType() == JointType.REVOLUTE) {
                return _entry.getParamValue(DHparams.theta_i);
            }
            else if (_entry.getJointType() == JointType.PRISMATIC) {
                return _entry.getParamValue(DHparams.d_i);
            }
            console.warn('RDHtable> asking joint for non-joint index');
            return 0;
        };
        RDHtable.prototype.doesJointExist = function (jointId) {
            if (this.m_entriesById[jointId]) {
                return true;
            }
            return false;
        };
        RDHtable.prototype.getJointValueById = function (jointId) {
            if (this.m_entriesById[jointId]) {
                var _entry = this.m_entriesById[jointId];
                if (_entry.getJointType() == JointType.REVOLUTE) {
                    return _entry.getParamValue(DHparams.theta_i);
                }
                else if (_entry.getJointType() == JointType.PRISMATIC) {
                    return _entry.getParamValue(DHparams.d_i);
                }
                console.warn('RDHtable> asking joint for non-joint index');
                return 0;
            }
            console.warn('RDHtable> asking for a non-existent joint with id: ' + jointId);
            return 0;
        };
        RDHtable.prototype.getMinJointValue = function (indx) {
            if (indx < 0 || indx >= this.m_entries.length) {
                console.error('RDHtable> Trying to set value for out of range indx ' + indx);
                return 0;
            }
            var _entry = this.m_entries[indx];
            return _entry.minJointValue();
        };
        RDHtable.prototype.getMaxJointValue = function (indx) {
            if (indx < 0 || indx >= this.m_entries.length) {
                console.error('RDHtable> Trying to set value for out of range indx ' + indx);
                return 0;
            }
            var _entry = this.m_entries[indx];
            return _entry.maxJointValue();
        };
        RDHtable.prototype.getRangeJointValue = function (indx) {
            if (indx < 0 || indx >= this.m_entries.length) {
                console.error('RDHtable> Trying to set value for out of range indx ' + indx);
                return 0;
            }
            var _entry = this.m_entries[indx];
            return _entry.rangeJointValue();
        };
        RDHtable.prototype.getTransform = function (indx) {
            if (indx < 0 || indx >= this.m_entries.length) {
                console.error('RDHtable> Trying to access out of range indx ' + indx);
                return null;
            }
            return this.m_entries[indx].getTransform();
        };
        RDHtable.prototype.getTransformInRange = function (from, to) {
            if (0 <= from && from <= to && to <= (this.m_entries.length - 1)) {
                var _totalTransform = new core.LMat4();
                for (var q = from; q <= to; q++) {
                    var _transform = this.m_entries[q].getTransform();
                    _totalTransform = core.mulMatMat44(_totalTransform, _transform);
                }
                return _totalTransform;
            }
            console.error('RDHtable> wrong range provided: ' + from + ' - ' + to);
            return null;
        };
        RDHtable.prototype._getTotalTransform = function () {
            return this.getTransformInRange(0, this.m_entries.length - 1);
        };
        RDHtable.prototype.entries = function () { return this.m_entries; };
        RDHtable.prototype.getFullTransform = function () { return this.m_totalTransform; };
        RDHtable.prototype.getEndEffectorXYZ = function () { return this.m_xyz; };
        RDHtable.prototype.getEndEffectorRPY = function () { return this.m_rpy; };
        RDHtable.prototype.getAllJointValues = function () {
            var _jointValues = [];
            for (var q = 0; q < this.m_entries.length; q++) {
                _jointValues.push(this.getJointValue(q));
            }
            return _jointValues;
        };
        RDHtable.prototype.update = function (dt) {
            this.m_totalTransform = this._getTotalTransform();
            core.LMat4.extractPositionInPlace(this.m_xyz, this.m_totalTransform);
            core.LMat4.extractEulerFromRotationInPlace(this.m_rpy, this.m_totalTransform);
        };
        return RDHtable;
    }());
    leojs.RDHtable = RDHtable;
})(leojs || (leojs = {}));
