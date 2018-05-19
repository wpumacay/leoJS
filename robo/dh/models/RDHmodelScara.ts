
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
    }


}