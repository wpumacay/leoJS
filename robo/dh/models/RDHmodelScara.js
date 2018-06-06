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
    var RDHmodelScara = /** @class */ (function (_super) {
        __extends(RDHmodelScara, _super);
        function RDHmodelScara(world) {
            return _super.call(this, world) || this;
        }
        RDHmodelScara.prototype._buildDHrepresentation = function () {
            this.m_dhTable.appendEntry(new leojs.RDHentry('joint_1', [true, true, true, false], [0, 0, 0.5, 0], -Math.PI, Math.PI));
            this.m_dhTable.appendEntry(new leojs.RDHentry('joint_2', [true, true, true, false], [0, 0.5, 0, 0], -Math.PI, Math.PI));
            this.m_dhTable.appendEntry(new leojs.RDHentry('joint_3', [true, true, false, true], [0, 0.5, 0, 0], 0, 1, -1, 0));
            this.m_dhTable.appendEntry(new leojs.RDHentry('joint_4', [true, true, true, false], [0, 0, -0.5, 0], -Math.PI, Math.PI));
        };
        RDHmodelScara.prototype.includeInvKinEndEffectorOrientation = function () {
            // Don't use the end effector rotation in IK solver. Just assume ...
            // the same orientation as in not that necessary
            return false;
        };
        RDHmodelScara.prototype._computeEndEffectorOffset = function () {
            var _effOffset = new core.LVec3(0, 0, -0.5);
            this.m_endEffectorCompensation = core.LMat4.translation(_effOffset);
            this.m_endEffectorCompensation = core.mulMatMat44(this.m_endEffectorCompensation, core.ROT_Y_NEG_90);
        };
        RDHmodelScara.prototype._computeMinMaxEstimates = function () {
            // Get the parameters from the dh table
            // l1, l2, l3 -> (+) ; l4 -> (-)
            var l1, l2, l3, l4;
            l1 = this.m_dhTable.entries()[0].getParamValue(leojs.DHparams.d_i);
            l2 = this.m_dhTable.entries()[1].getParamValue(leojs.DHparams.a_i_1);
            l3 = this.m_dhTable.entries()[2].getParamValue(leojs.DHparams.a_i_1);
            l4 = Math.abs(this.m_dhTable.entries()[3].getParamValue(leojs.DHparams.d_i));
            // Get joints ranges
            var q1Min, q2Min, q3Min, q4Min;
            var q1Max, q2Max, q3Max, q4Max;
            q1Min = this.m_dhTable.getMinJointValue(0);
            q2Min = this.m_dhTable.getMinJointValue(1);
            q3Min = this.m_dhTable.getMinJointValue(2);
            q4Min = this.m_dhTable.getMinJointValue(3);
            q1Max = this.m_dhTable.getMaxJointValue(0);
            q2Max = this.m_dhTable.getMaxJointValue(1);
            q3Max = this.m_dhTable.getMaxJointValue(2);
            q4Max = this.m_dhTable.getMaxJointValue(3);
            this.m_xyzMinEstimate.z = l1 - l4 - q3Max;
            this.m_xyzMaxEstimate.z = l1 - l4 - q3Min;
            this.m_xyzMinEstimate.x = -l3 - l2;
            this.m_xyzMaxEstimate.x = l3 + l2;
            this.m_xyzMinEstimate.y = -l3 - l2;
            this.m_xyzMaxEstimate.y = l3 + l2;
        };
        RDHmodelScara.prototype.inverse = function (xyz, rpy) {
            if (!this.isInWorkspace(xyz)) {
                console.log('RDHmodelScara> position not in workspace');
                console.log(xyz);
                // return;
            }
            /* By looking at the total transform :
            *
            *        | c_124  -s_124    0   c_1 * l2 + c_12 * l3 |
            *    T = | s_124   c_124    0   s_1 * l2 + s_12 * l3 |
            *        |   0       0      1      l1 - l4 - q3      |
            *        |   0       0      0           1            |
            *
            *  We can construct q1,q2 and q3 by just using the xyz position ...
            *  of the end effector, as follows :
            *
            *      z = l1 - l4 - q3 -> { q3 = l1 - l4 - z }
            *
            *    By some geometry :
            *
            *
            *                |          ( x, y )
            *                |        /|
            *                |       /b|l3
            *                |      /  |
            *                |     /   |q2_-
            * sqrt( x^2 + y^2 )   /    |_-
            *                |   /   _-
            *                |  /  _-
            *                | /a_-  l2
            *                |/_- q1
            *                ---------------------
            *
            *    Inside the triangle, by cosine properties
            *    a = acos( ( x^2 + y^2 + l2^2 - l3^2 ) / ( 2 * sqrt( x^2 + y^2 ) * l2 ) )
            *    b = acos( ( x^2 + y^2 + l3^2 - l2^2 ) / ( 2 * sqrt( x^2 + y^2 ) * l3 ) )
            *    a + q1 = phi = atan2( y, x )
            *
            *    So :
            *
            *        { q1 = phi - a } and { q2 = a + b }
            *
            *
            *    q4 can be obtained by the orientation of the end effector ( for now, just set to 0 )
            *
            */
            var l1, l2, l3, l4;
            var q1, q2, q3, q4;
            var x, y, z;
            var a, b, phi;
            q4 = 0.0; // For now, just 0 as no orientation given for the end effector
            // Get the parameters from the dh table
            // l1, l2, l3 -> (+) ; l4 -> (-)
            l1 = this.m_dhTable.entries()[0].getParamValue(leojs.DHparams.d_i);
            l2 = this.m_dhTable.entries()[1].getParamValue(leojs.DHparams.a_i_1);
            l3 = this.m_dhTable.entries()[2].getParamValue(leojs.DHparams.a_i_1);
            l4 = Math.abs(this.m_dhTable.entries()[3].getParamValue(leojs.DHparams.d_i));
            x = xyz.x;
            y = xyz.y;
            z = xyz.z;
            // Solve for q3
            q3 = l1 - l4 - z;
            // Solve for q1 and q2
            a = Math.acos((x * x + y * y + l2 * l2 - l3 * l3) /
                (2 * Math.sqrt(x * x + y * y) * l2));
            b = Math.acos((x * x + y * y + l3 * l3 - l2 * l2) /
                (2 * Math.sqrt(x * x + y * y) * l3));
            phi = Math.atan2(y, x);
            q1 = phi - a;
            q2 = a + b;
            // Send the joints to the model
            var _joints = [q1, q2, q3, q4];
            for (var i = 0; i < this.m_dhTable.numJoints(); i++) {
                if (!isFinite(_joints[i]) ||
                    isNaN(_joints[i])) {
                    return null;
                }
                this.m_dhTable.setJointValue(_joints[i], i);
            }
            this.m_dhTable.update(0);
            return _joints;
        };
        RDHmodelScara.prototype.isInWorkspace = function (xyz) {
            // Get the parameters from the dh table
            // l1, l2, l3 -> (+) ; l4 -> (-)
            var l1, l2, l3, l4;
            l1 = this.m_dhTable.entries()[0].getParamValue(leojs.DHparams.d_i);
            l2 = this.m_dhTable.entries()[1].getParamValue(leojs.DHparams.a_i_1);
            l3 = this.m_dhTable.entries()[2].getParamValue(leojs.DHparams.a_i_1);
            l4 = Math.abs(this.m_dhTable.entries()[3].getParamValue(leojs.DHparams.d_i));
            // Get joints ranges
            var q1Min, q2Min, q3Min, q4Min;
            var q1Max, q2Max, q3Max, q4Max;
            q1Min = this.m_dhTable.getMinJointValue(0);
            q2Min = this.m_dhTable.getMinJointValue(1);
            q3Min = this.m_dhTable.getMinJointValue(2);
            q4Min = this.m_dhTable.getMinJointValue(3);
            q1Max = this.m_dhTable.getMaxJointValue(0);
            q2Max = this.m_dhTable.getMaxJointValue(1);
            q3Max = this.m_dhTable.getMaxJointValue(2);
            q4Max = this.m_dhTable.getMaxJointValue(3);
            //// Get x, y, z ranges
            var xmin, ymin, zmin;
            var xmax, ymax, zmax;
            // z range
            zmin = l1 - l4 - q3Max;
            zmax = l1 - l4 - q3Min;
            if (xyz.z < zmin || xyz.z > zmax) {
                return false;
            }
            // x, y range
            var _r = Math.sqrt(xyz.x * xyz.x + xyz.y * xyz.y);
            var _rmin = Math.abs(l3 - l2);
            var _rmax = Math.abs(l3 + l2);
            if (_r < _rmin || _r > _rmax) {
                return false;
            }
            return true;
        };
        return RDHmodelScara;
    }(leojs.RDHmodel));
    leojs.RDHmodelScara = RDHmodelScara;
})(leojs || (leojs = {}));
