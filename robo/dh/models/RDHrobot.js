/// <reference path="../RDHmodel.ts" />
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var leojs;
(function (leojs) {
    var RDHrobot = /** @class */ (function (_super) {
        __extends(RDHrobot, _super);
        function RDHrobot(world, userDHtable) {
            var _this = _super.call(this, world) || this;
            _this.m_userDHtable = userDHtable;
            // Don't show end effector, as user might need ...
            // to add compensation
            _this.m_showEndEffector = false;
            return _this;
        }
        RDHrobot.prototype._buildDHrepresentation = function () {
            // Build the DH representation from the user data
            for (var q = 0; q < this.m_userDHtable.length; q++) {
                var _jointName = 'joint_' + (q + 1);
                //// Extract info from user entry *****************************
                var _dhUserEntry = this.m_userDHtable[q];
                // Extract which type of joint we are dealing with
                var _fixedParams = [true, true, true, true];
                if (_dhUserEntry['joint'] == 'revolute') {
                    _fixedParams[3] = false;
                }
                else if (_dhUserEntry['joint'] == 'prismatic') {
                    _fixedParams[2] = false;
                }
                else {
                    console.warn('RDHrobot> this DH entry has no joint, are you sure is this ok?');
                }
                // Extract dh values
                var _dhvalues = [0, 0, 0, 0];
                _dhvalues[leojs.DHparams.a_i_1] = (_dhUserEntry['a']) ?
                    (_dhUserEntry['a']) : (0);
                _dhvalues[leojs.DHparams.alpha_i_1] = (_dhUserEntry['alpha']) ?
                    (_dhUserEntry['alpha']) : (0);
                _dhvalues[leojs.DHparams.d_i] = (_dhUserEntry['d']) ?
                    (_dhUserEntry['d']) : (0);
                _dhvalues[leojs.DHparams.theta_i] = (_dhUserEntry['theta']) ?
                    (_dhUserEntry['theta']) : (0);
                // Extract min-max joint ranges
                var _min = (_dhUserEntry['min']) ?
                    (_dhUserEntry['min']) :
                    (this._getDefaultJointMin(_dhUserEntry['joint']));
                var _max = (_dhUserEntry['max']) ?
                    (_dhUserEntry['max']) :
                    (this._getDefaultJointMax(_dhUserEntry['joint']));
                // Extract joint's sign and offset
                var _sign = (_dhUserEntry['sign']) ?
                    (_dhUserEntry['sign']) : (1);
                var _offset = (_dhUserEntry['offset']) ?
                    (_dhUserEntry['offset']) : (0);
                //// **********************************************************
                this.m_dhTable.appendEntry(new leojs.RDHentry(_jointName, _fixedParams, _dhvalues, _min, _max, _sign, _offset));
            }
        };
        RDHrobot.prototype._computeEndEffectorOffset = function () {
            // TODO: Re-route this part to be user assignable
        };
        RDHrobot.prototype._computeMinMaxEstimates = function () {
            // TODO: Re-route this part to be user assignable
        };
        RDHrobot.prototype.inverse = function (xyz, rpy) {
            return [];
        };
        // Some helpers ********************************************************************
        RDHrobot.prototype._getDefaultJointMin = function (jointType) {
            var _min = -1;
            if (!jointType) {
                // Seems the user did not pass a joint type at all
                console.warn('RDHrobot> Hey!, where is my joint???!!!!');
            }
            else {
                switch (jointType) {
                    case 'revolute':
                        _min = -Math.PI;
                        break;
                    case 'prismatic':
                        _min = 0.0;
                        break;
                    default: console.warn('RDHrobot> Hey!, this is no valid joint!');
                }
            }
            return _min;
        };
        RDHrobot.prototype._getDefaultJointMax = function (jointType) {
            var _max = -1;
            if (!jointType) {
                // Seems the user did not pass a joint type at all
                console.warn('RDHrobot> Hey!, where is my joint???!!!!');
            }
            else {
                switch (jointType) {
                    case 'revolute':
                        _max = Math.PI;
                        break;
                    case 'prismatic':
                        _max = 2.0;
                        break;
                    default: console.warn('RDHrobot> Hey!, this is no valid joint!');
                }
            }
            return _max;
        };
        return RDHrobot;
    }(leojs.RDHmodel));
    leojs.RDHrobot = RDHrobot;
})(leojs || (leojs = {}));
