
/// <reference path="../RDHmodel.ts" />



namespace leojs
{


    export class RDHrobot extends RDHmodel
    {

        private m_userDHtable : { [id:string] : any }[]

        constructor( world : RDHWorld,
                     userDHtable : { [id:string] : any }[] )
        {
            super( world );

            this.m_userDHtable = userDHtable;
        }

        protected _buildDHrepresentation() : void
        {
            // Build the DH representation from the user data
            for ( let q = 0; q < this.m_userDHtable.length; q++ )
            {
                let _jointName = 'joint_' + ( q + 1 );

                //// Extract info from user entry *****************************
                let _dhUserEntry = this.m_userDHtable[q];

                // Extract which type of joint we are dealing with
                let _fixedParams = [ true, true, true, true ];
                if ( _dhUserEntry[ 'joint' ] == 'revolute' )
                {
                    _fixedParams[3] = false;
                }
                else if ( _dhUserEntry[ 'joint' ] == 'prismatic' )
                {
                    _fixedParams[2] = false;
                }
                else
                {
                    console.warn( 'RDHrobot> this DH entry has no joint, are you sure is this ok?' );
                }

                // Extract dh values
                let _dhvalues = [0, 0, 0, 0];
                _dhvalues[ DHparams.a_i_1 ]     = ( _dhUserEntry['a'] ) ? 
                                                        ( _dhUserEntry['a'] ) : ( 0 );
                _dhvalues[ DHparams.alpha_i_1 ] = ( _dhUserEntry['alpha'] ) ? 
                                                        ( _dhUserEntry['alpha'] ) : ( 0 );
                _dhvalues[ DHparams.d_i ]       = ( _dhUserEntry['d'] ) ? 
                                                        ( _dhUserEntry['d'] ) : ( 0 );
                _dhvalues[ DHparams.theta_i ]   = ( _dhUserEntry['theta'] ) ?
                                                         ( _dhUserEntry['theta'] ) : ( 0 );

                // Extract min-max joint ranges
                let _min = ( _dhUserEntry['min'] ) ? 
                                    ( _dhUserEntry['min'] ) : 
                                    ( this._getDefaultJointMin( _dhUserEntry['joint'] ) );
                let _max = ( _dhUserEntry['max'] ) ? 
                                    ( _dhUserEntry['max'] ) : 
                                    ( this._getDefaultJointMax( _dhUserEntry['joint'] ) );

                // Extract joint's sign and offset
                let _sign = ( _dhUserEntry['sign'] ) ? 
                                    ( _dhUserEntry['sign'] ) : ( 1 );
                let _offset = ( _dhUserEntry['offset'] ) ?
                                    ( _dhUserEntry['offset'] ) : ( 0 );
                //// **********************************************************

                this.m_dhTable.appendEntry( new RDHentry( _jointName,
                                                          _fixedParams,
                                                          _dhvalues,
                                                          _min, _max,
                                                          _sign, _offset ) );
            }
        }

        private _getDefaultJointMin( jointType : string ) : number
        {
            let _min = -1;

            if ( !jointType )
            {
                // Seems the user did not pass a joint type at all
                console.warn( 'RDHrobot> Hey!, where is my joint???!!!!' );
            }
            else
            {
                switch ( jointType ) 
                {
                    case 'revolute' : _min = -Math.PI; break;
                    case 'prismatic' : _min = 0.0; break;

                    default: console.warn( 'RDHrobot> Hey!, this is no valid joint!' );
                }
            }

            return _min;
        }

        private _getDefaultJointMax( jointType : string ) : number
        {
            let _max = -1;

            if ( !jointType )
            {
                // Seems the user did not pass a joint type at all
                console.warn( 'RDHrobot> Hey!, where is my joint???!!!!' );
            }
            else
            {
                switch ( jointType ) 
                {
                    case 'revolute' : _max = Math.PI; break;
                    case 'prismatic' : _max = 2.0; break;

                    default: console.warn( 'RDHrobot> Hey!, this is no valid joint!' );
                }
            }

            return _max;
        }

        public includeInvKinEndEffectorOrientation() : boolean
        {
            return false;
        }

        protected _computeEndEffectorOffset() : void
        {

        }

        protected _computeMinMaxEstimates() : void
        {

        }

        public inverse( xyz : core.LVec3, rpy : core.LVec3 ) : number[]
        {
            return [];
        }    

        public isInWorkspace( xyz : core.LVec3 ) : boolean
        {
            return false;
        }
    }


}