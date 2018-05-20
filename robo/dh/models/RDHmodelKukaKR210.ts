
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
                                                      [ 0, 0, 5.0, 0 ],
                                                      -0.5 * Math.PI, 0.5 * Math.PI ) );
            this.m_dhTable.appendEntry( new RDHentry( [ true, true, true, false ],
                                                      [ 0, 10.0, 0, 0 ],
                                                      -0.5 * Math.PI, 0.5 * Math.PI ) );
            this.m_dhTable.appendEntry( new RDHentry( [ true, true, false, true ],
                                                      [ 0, 5.0, 0, 0 ],
                                                      0, 10,
                                                      -1, 0 ) );
            this.m_dhTable.appendEntry( new RDHentry( [ true, true, true, false ],
                                                      [ 0, 0, -5.0, 0 ],
                                                      -0.5 * Math.PI, 0.5 * Math.PI ) );
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