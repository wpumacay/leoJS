
/// <reference path="../RDHmodel.ts" />



namespace leojs
{


    export class RDHmodelScara extends RDHmodel
    {

        constructor( world : RDHWorld )
        {
            super( world );
        }

        protected _buildDHrepresentation() : void
        {
            this.m_dhTable.appendEntry( new RDHentry( [ true, true, true, false ],
                                                      [ 0, 0, 0.5, 0 ],
                                                      -Math.PI, Math.PI ) );
            this.m_dhTable.appendEntry( new RDHentry( [ true, true, true, false ],
                                                      [ 0, 0.5, 0, 0 ],
                                                      -Math.PI, Math.PI ) );
            this.m_dhTable.appendEntry( new RDHentry( [ true, true, false, true ],
                                                      [ 0, 0.5, 0, 0 ],
                                                      0, 1,
                                                      -1, 0 ) );
            this.m_dhTable.appendEntry( new RDHentry( [ true, true, true, false ],
                                                      [ 0, 0, -0.5, 0 ],
                                                      -Math.PI, Math.PI ) );
        }

        protected _computeEndEffectorOffset() : void
        {
            let _effOffset : core.LVec3 = new core.LVec3( 0, 0, -0.5 );
            this.m_endEffectorOffset = core.LMat4.translation( _effOffset );
            this.m_endEffectorOffset = core.mulMatMat44( this.m_endEffectorOffset,
                                                         core.ROT_Y_180 );
        }

        protected _computeMinMaxEstimates() : void
        {
            // Get the parameters from the dh table
            // l1, l2, l3 -> (+) ; l4 -> (-)
            let l1, l2, l3, l4 : number;

            l1 = this.m_dhTable.entries()[0].getParamValue( DHparams.d_i );
            l2 = this.m_dhTable.entries()[1].getParamValue( DHparams.a_i_1 );
            l3 = this.m_dhTable.entries()[2].getParamValue( DHparams.a_i_1 );
            l4 = Math.abs( this.m_dhTable.entries()[3].getParamValue( DHparams.d_i ) );

            // Get joints ranges
            let q1Min, q2Min, q3Min, q4Min : number;
            let q1Max, q2Max, q3Max, q4Max : number;

            q1Min = this.m_dhTable.getMinJointValue( 0 );
            q2Min = this.m_dhTable.getMinJointValue( 1 );
            q3Min = this.m_dhTable.getMinJointValue( 2 );
            q4Min = this.m_dhTable.getMinJointValue( 3 );

            q1Max = this.m_dhTable.getMaxJointValue( 0 );
            q2Max = this.m_dhTable.getMaxJointValue( 1 );
            q3Max = this.m_dhTable.getMaxJointValue( 2 );
            q4Max = this.m_dhTable.getMaxJointValue( 3 );

            this.m_xyzMinEstimate.z = l1 - l4 - q3Max;
            this.m_xyzMaxEstimate.z = l1 - l4 - q3Min;

            this.m_xyzMinEstimate.x = -l3 - l2;
            this.m_xyzMaxEstimate.x = l3 + l2;

            this.m_xyzMinEstimate.y = -l3 - l2;
            this.m_xyzMaxEstimate.y = l3 + l2;
        }

        public inverse( xyz : core.LVec3 ) : void
        {
            if ( !this.isInWorkspace( xyz ) )
            {
                console.log( 'RDHmodelScara> position not in workspace' );
                console.log( xyz );
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

            let l1, l2, l3, l4 : number;
            let q1, q2, q3, q4 : number;
            let x, y, z : number;
            let a, b, phi : number;

            q4 = 0.0; // For now, just 0 as no orientation given for the end effector

            // Get the parameters from the dh table
            // l1, l2, l3 -> (+) ; l4 -> (-)
            l1 = this.m_dhTable.entries()[0].getParamValue( DHparams.d_i );
            l2 = this.m_dhTable.entries()[1].getParamValue( DHparams.a_i_1 );
            l3 = this.m_dhTable.entries()[2].getParamValue( DHparams.a_i_1 );
            l4 = Math.abs( this.m_dhTable.entries()[3].getParamValue( DHparams.d_i ) );

            x = xyz.x; y = xyz.y; z = xyz.z;

            // Solve for q3
            q3 = l1 - l4 - z;

            // Solve for q1 and q2
            a = Math.acos( ( x * x + y * y + l2 * l2 - l3 * l3 ) /
                           ( 2 * Math.sqrt( x * x + y * y ) * l2 ) );
            b = Math.acos( ( x * x + y * y + l3 * l3 - l2 * l2 ) /
                           ( 2 * Math.sqrt( x * x + y * y ) * l3 ) );
            phi = Math.atan2( y, x );

            q1 = phi - a;
            q2 = a + b;

            // Send the joints to the model
            let _joints : number[] = [ q1, q2, q3, q4 ];

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
            // Get the parameters from the dh table
            // l1, l2, l3 -> (+) ; l4 -> (-)
            let l1, l2, l3, l4 : number;

            l1 = this.m_dhTable.entries()[0].getParamValue( DHparams.d_i );
            l2 = this.m_dhTable.entries()[1].getParamValue( DHparams.a_i_1 );
            l3 = this.m_dhTable.entries()[2].getParamValue( DHparams.a_i_1 );
            l4 = Math.abs( this.m_dhTable.entries()[3].getParamValue( DHparams.d_i ) );

            // Get joints ranges
            let q1Min, q2Min, q3Min, q4Min : number;
            let q1Max, q2Max, q3Max, q4Max : number;

            q1Min = this.m_dhTable.getMinJointValue( 0 );
            q2Min = this.m_dhTable.getMinJointValue( 1 );
            q3Min = this.m_dhTable.getMinJointValue( 2 );
            q4Min = this.m_dhTable.getMinJointValue( 3 );

            q1Max = this.m_dhTable.getMaxJointValue( 0 );
            q2Max = this.m_dhTable.getMaxJointValue( 1 );
            q3Max = this.m_dhTable.getMaxJointValue( 2 );
            q4Max = this.m_dhTable.getMaxJointValue( 3 );            

            //// Get x, y, z ranges
            let xmin, ymin, zmin : number;
            let xmax, ymax, zmax : number;
            // z range
            zmin = l1 - l4 - q3Max;
            zmax = l1 - l4 - q3Min;

            if ( xyz.z < zmin || xyz.z > zmax )
            {
                return false;
            }

            // x, y range
            let _r : number = Math.sqrt( xyz.x * xyz.x + xyz.y * xyz.y );
            let _rmin : number = Math.abs( l3 - l2 );
            let _rmax : number = Math.abs( l3 + l2 );

            if ( _r < _rmin || _r > _rmax )
            {
                return false;
            }

            return true;
        }
    }


}