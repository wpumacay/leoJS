
/// <reference path="RWorld.ts" />
/// <reference path="../robo/RDHmodel.ts" />
/// <reference path="../robo/RDHguiController.ts" />

namespace leojs
{


    export class RDHWorld extends RWorld
    {

        private m_dhModel : RDHmodel;
        private m_dhTable : RDHtable;
        private m_dhGuiController : RDHguiController;

        constructor( appWidth : number, appHeight : number )
        {
            super( appWidth, appHeight );

            this.m_dhModel = null;
            this.m_dhTable = null;
            this.m_dhGuiController = null;

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
        private _initializeModel() : void
        {
            this.m_dhModel = new RDHmodel( this, this.m_dhTable );
            this.m_dhGuiController = new RDHguiController( this.m_dhModel );
        }


        public update( dt : number ) : void
        {
            super.update( dt );

            if ( this.m_dhModel )
            {
                this.m_dhModel.update( dt );
            }

            if ( this.m_dhGuiController )
            {
                this.m_dhGuiController.update( dt );
            }
        }


    }






}