
/// <reference path="../RDHmodel.ts" />



namespace leojs
{


    export class RDHmodelKukaKR210 extends RDHmodel
    {

        constructor( world : RDHWorld )
        {
            super( world );
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

        protected _computeEndEffectorOffset() : void
        {
            let _effOffset : core.LVec3 = new core.LVec3( 0, 0, 0.193 + 0.0375 );
            this.m_endEffectorOffset = core.LMat4.translation( _effOffset );
        }

        protected _computeMinMaxEstimates() : void
        {
            // TODO: Implement this part
        }

        public inverse( xyz : core.LVec3 ) : void
        {
            // TODO: Implement this part
        }

        public isInWorkspace( xyz : core.LVec3 ) : boolean
        {
            // TODO: Implement this part
            return false;
        }
    }


}