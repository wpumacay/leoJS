
/// <reference path="../RDHmodel.ts" />



namespace leojs
{


    export class RDHmodelKukaKR210 extends RDHmodel
    {

        private m_eeOffset : core.LVec3;

        private m_ikEEPosRef : core.LVec3;
        private m_ikWCPosRef : core.LVec3;

        private m_ikEErotMat : core.LMat4;
        private m_ikWCrotMat : core.LMat4;

        private m_ikEEtoWCrot : core.LMat4;
        private m_ikEEtoWCinvrot : core.LMat4;

        private m_R_0_3 : core.LMat4;
        private m_R_0_3_inv : core.LMat4;
        private m_R_3_6 : core.LMat4;

        constructor( world : RDHWorld )
        {
            super( world );

            this.m_eeOffset = new core.LVec3( 0, 0, 0 );

            this.m_ikEEPosRef = new core.LVec3( 0, 0, 0 );
            this.m_ikWCPosRef = new core.LVec3( 0, 0, 0 );

            this.m_ikEErotMat = new core.LMat4();
            this.m_ikWCrotMat = new core.LMat4();

            this.m_ikEEtoWCrot = new core.LMat4();
            this.m_ikEEtoWCinvrot = new core.LMat4();

            this.m_R_0_3 = new core.LMat4();
            this.m_R_0_3_inv = new core.LMat4();
            this.m_R_3_6 = new core.LMat4();

            // Relative transform to place end effector mesh in the correct orientation
            core.LMat4.copy( this.m_ikEEtoWCrot, core.ROT_Y_90 );
            core.inversePureRotationMat44InPlace( this.m_ikEEtoWCinvrot, this.m_ikEEtoWCrot );
        }

        protected _buildDHrepresentation() : void
        {
            this.m_dhTable.appendEntry( new RDHentry( [ true, true, true, false ],
                                                      [ 0, 0, 0.75, 0 ],
                                                      -Math.PI, Math.PI ) );
            this.m_dhTable.appendEntry( new RDHentry( [ true, true, true, false ],
                                                      [ -0.5 * Math.PI, 0.35, 0, 0 ],
                                                      -Math.PI, Math.PI,
                                                      1, -0.5 * Math.PI ) );
            this.m_dhTable.appendEntry( new RDHentry( [ true, true, true, false ],
                                                      [ 0, 1.25, 0, 0 ],
                                                      -Math.PI, Math.PI ) );
            this.m_dhTable.appendEntry( new RDHentry( [ true, true, true, false ],
                                                      [ -0.5 * Math.PI, -0.054, 1.5, 0 ],
                                                      -Math.PI, Math.PI ) );
            this.m_dhTable.appendEntry( new RDHentry( [ true, true, true, false ],
                                                      [ 0.5 * Math.PI, 0, 0, 0 ],
                                                      -Math.PI, Math.PI ) );
            this.m_dhTable.appendEntry( new RDHentry( [ true, true, true, false ],
                                                      [ -0.5 * Math.PI, 0, 0, 0 ],
                                                      -Math.PI, Math.PI ) );
        }

        public includeInvKinEndEffectorOrientation() : boolean
        {
            // Use the end effector rotation in IK solver, as the ...
            // wrist orientation should be calculated
            return true;
        }

        protected _computeEndEffectorOffset() : void
        {
            this.m_eeOffset = new core.LVec3( 0, 0, 0.193 + 0.0375 );
            this.m_endEffectorOffset = core.LMat4.translation( this.m_eeOffset );
        }

        protected _computeMinMaxEstimates() : void
        {
            // TODO: Implement this part
        }

        public inverse( xyz : core.LVec3, rpy : core.LVec3 ) : void
        {
            let _q1, _q2, _q3, _q4, _q5, _q6 : number;

            // Extract info from dh table
            let _d1 = this.m_dhTable.entries()[0].getParamValue( DHparams.d_i );
            let _a1 = this.m_dhTable.entries()[1].getParamValue( DHparams.a_i_1 );
            let _a2 = this.m_dhTable.entries()[2].getParamValue( DHparams.a_i_1 );
            let _a3 = this.m_dhTable.entries()[3].getParamValue( DHparams.a_i_1 );
            let _d4 = this.m_dhTable.entries()[3].getParamValue( DHparams.d_i );

            // Copy the EEffector position
            core.LVec3.copy( this.m_ikEEPosRef, xyz );
            // Compute rotation matrix of the end effector
            core.LMat4.fromEulerInPlace( this.m_ikEErotMat, rpy );

            // Compute wrist orientation - last frame
            core.mulMatMat44InPlace( this.m_ikWCrotMat,
                                     this.m_ikEErotMat,
                                     this.m_ikEEtoWCinvrot );

            // Compute wrist position - last frame
            // From : r_ee = r_wc + R_0_6 * [ 0, 0, d_ee ]
            this.m_ikWCPosRef.x = this.m_ikEEPosRef.x -
                                    ( this.m_ikWCrotMat.buff[0] * this.m_eeOffset.x +
                                      this.m_ikWCrotMat.buff[4] * this.m_eeOffset.y +
                                      this.m_ikWCrotMat.buff[8] * this.m_eeOffset.z );

            this.m_ikWCPosRef.y = this.m_ikEEPosRef.y -
                                    ( this.m_ikWCrotMat.buff[1] * this.m_eeOffset.x +
                                      this.m_ikWCrotMat.buff[5] * this.m_eeOffset.y +
                                      this.m_ikWCrotMat.buff[9] * this.m_eeOffset.z );

            this.m_ikWCPosRef.z = this.m_ikEEPosRef.z -
                                    ( this.m_ikWCrotMat.buff[2] * this.m_eeOffset.x +
                                      this.m_ikWCrotMat.buff[6] * this.m_eeOffset.y +
                                      this.m_ikWCrotMat.buff[10] * this.m_eeOffset.z );

            //////// Compute q1, q2 and q3 using some trigonometry
            //// Compute q1
            _q1 = Math.atan2( this.m_ikWCPosRef.y, this.m_ikWCPosRef.x );
            //// Compute q2 and q3
            // Compute intermediate variables from geometric relationships
            let _phi1, _phi2, _phi3, _phi4 : number;
            _phi1 = Math.atan2( _a1, _d1 );
            _phi2 = Math.atan2( this.m_ikWCPosRef.z,
                                Math.sqrt( this.m_ikWCPosRef.x * this.m_ikWCPosRef.x +
                                           this.m_ikWCPosRef.y * this.m_ikWCPosRef.y ) );
            _phi3 = 0.5 * Math.PI - _phi1 - _phi2;
            _phi4 = 0.5 * Math.PI - _phi1;
            // Compute intermediate variables for cosine law application in ...
            // triangle 0-2-Wc
            let _l1, _l2, _l3, _phi5 : number;
            _l1 = Math.sqrt( _d1 * _d1 + _a1 * _a1 );
            _l2 = this.m_ikWCPosRef.length();

            _l3 = _l1 * _l1 + _l2 * _l2 - 2 * _l1 * _l2 * Math.cos( _phi3 );
            _phi5 = Math.acos( ( _l1 * _l1 + _l3 * _l3 - _l2 * _l2 ) / 
                               ( 2 * _l1 * _l3 ) );

            // Compute intermediate variables for cosine law application in ...
            // triangle 2-3-Wc
            let _l4, _phi6, _phi7, _phi8 : number;
            _l4 = Math.sqrt( _d4 * _d4 + _a3 * _a3 );
            _phi8 = Math.atan2( Math.abs( _a3 ), _d4 );
            _phi6 = Math.acos( ( _l3 * _l3 + _a2 * _a2 - _l4 * _l4  ) / 
                               ( 2 * _l3 * _a2 ) );
            _phi7 = Math.acos( ( _a2 * _a2 + _l4 * _l4 - _l3 * _l3 ) /
                               ( 2 * _a2 * _l4 ) );

            // Compute q2 and q3 with some angles' sums
            _q2 = 2 * Math.PI - _phi4 - _phi5 - _phi6;
            _q3 = 0.5 * Math.PI - _phi7 - _phi8;

            //////// Compute q4, q5 and q6 from the total rotation matrix
            //// Compute R_3_6 ( rotation matrix of frame 6 respect to 3 ) ...
            //// using : R_0_3 * R_3_6 = R_0_6 -> R_3_6 = R_0_3^-1 * R_0_6
            // From T_0_3, R_0_3 is given by :
            let _c1 = Math.cos( _q1 );
            let _s1 = Math.sin( _q1 );
            let _c23 = Math.cos( _q2 + _q3 );
            let _s23 = Math.sin( _q2 + _q3 );

            this.m_R_0_3.buff[0] = _c1 * _s23;
            this.m_R_0_3.buff[1] = _s1 * _s23;
            this.m_R_0_3.buff[2] = _c23;

            this.m_R_0_3.buff[4] = _c1 * _c23;
            this.m_R_0_3.buff[5] = _s1 * _c23;
            this.m_R_0_3.buff[6] = -_s23;

            this.m_R_0_3.buff[8] = -_s1;
            this.m_R_0_3.buff[9] = _c1;
            this.m_R_0_3.buff[10] = 0;
            // From R_3_6 = R_0_3^-1 * R_0_6

            core.inversePureRotationMat44InPlace( this.m_R_0_3_inv,
                                                  this.m_R_0_3 );

            core.mulMatMat44InPlace( this.m_R_3_6,
                                     this.m_R_0_3_inv, this.m_ikWCrotMat );
            //// Compute q4, q5 and q6 from R_3_6 using the FK decomposition for T_3_6
            let _r33 = this.m_R_3_6.get( 2, 2 );
            let _r13 = this.m_R_3_6.get( 0, 2 );
            let _r23 = this.m_R_3_6.get( 1, 2 );
            let _r22 = this.m_R_3_6.get( 1, 1 );
            let _r21 = this.m_R_3_6.get( 1, 0 );

            _q4 = Math.atan2( _r33, -_r13 );
            _q5 = Math.atan2( Math.sqrt( _r13 * _r13 + _r33 * _r33 ), _r23 );
            _q6 = Math.atan2( -_r22, _r21 );

            // Send the joints to the model
            let _joints : number[] = [ _q1, _q2, _q3, _q4, _q5, _q6 ];

            for ( let i = 0; i < this.m_dhTable.numJoints(); i++ )
            {
                if ( !isFinite( _joints[i] ) ||
                     isNaN( _joints[i] ) )
                {
                    return;
                }

                this.m_dhTable.setJointValue( _joints[i], i );
            }

            this.m_dhTable.update( 0 );
        }

        public isInWorkspace( xyz : core.LVec3 ) : boolean
        {
            // TODO: Implement this part
            return false;
        }
    }


}