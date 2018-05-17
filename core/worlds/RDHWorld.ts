
/// <reference path="RWorld.ts" />
/// <reference path="../robo/RDHmodel.ts" />


namespace leojs
{


    export class RDHWorld extends RWorld
    {

        private m_dhModel : RDHmodel;
        private m_dhTable : RDHtable;

        constructor( appWidth : number, appHeight : number )
        {
            super( appWidth, appHeight );

            this.m_dhModel = null;
            this.m_dhTable = null;

            this._initialize();
        }

        private _initialize() : void
        {
            this._initializeTable();
            this._initializeModel();
        }
        private _initializeTable() : void
        {
            this.m_dhTable = new RDHtable();

            // For testing, add a scara robot definition
            // this.m_dhTable.appendEntry( new RDHentry( [ true, true, true, false ],
            //                                           [ 0, 0, 0, 0 ] ) );
            // this.m_dhTable.appendEntry( new RDHentry( [ true, true, true, false ],
            //                                           [ 0, 10.0, 0, 0 ] ) );
            // this.m_dhTable.appendEntry( new RDHentry( [ true, true, false, true ],
            //                                           [ 0, 5.0, 0, 0 ] ) );
            // this.m_dhTable.appendEntry( new RDHentry( [ true, true, true, false ],
            //                                           [ 0, 0, 0, 0 ] ) );

            // For testing, add a scara robot definition - a kind of similar one
            this.m_dhTable.appendEntry( new RDHentry( [ true, true, true, false ],
                                                      [ 0, 0, 5.0, 0 ] ) );
            this.m_dhTable.appendEntry( new RDHentry( [ true, true, true, false ],
                                                      [ 0, 10.0, 0, 0 ] ) );
            this.m_dhTable.appendEntry( new RDHentry( [ true, true, false, true ],
                                                      [ 0, 5.0, 0, 0 ] ) );
            this.m_dhTable.appendEntry( new RDHentry( [ true, true, true, false ],
                                                      [ 0, 0, -5.0, 0 ] ) );
        }
        private _initializeModel() : void
        {
            this.m_dhModel = new RDHmodel( this, this.m_dhTable );
        }


        public update( dt : number ) : void
        {
            super.update( dt );

            if ( this.m_dhModel )
            {
                this.m_dhModel.update( dt );
            }
        }


    }






}