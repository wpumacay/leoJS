

/// <reference path="RDHWorld.ts" />

namespace leojs
{


    export class RDHWorldPlayground extends RDHWorld
    {

        constructor( appWidth : number, appHeight : number )
        {
            super( appWidth, appHeight );
        }

        public reset() : void
        {
            // Release all resources that are going to be created by the user's code
            if ( this.m_dhModel )
            {
                this.m_dhModel.release();
                this.m_dhModel = null;
            }

            if ( this.m_urdfModel )
            {
                this.m_urdfModel.release();
                this.m_urdfModel = null;
            }

            if ( this.m_uiController )
            {
                this.m_uiController.release();
                this.m_uiController = null;
            }
        }

        public rebuild( userDHtable : { [id:string] : any }[] ) : void
        {
            // Clean previous resources
            this.reset();

            // Build new model
            this._buildModel( userDHtable );
            this._buildUI();
        }

        private _buildModel( userDHtable : { [id:string] : any }[] ) : void
        {
            this.m_dhModel = new RDHrobot( this, userDHtable );
            this.m_dhModel.init();
        }

        private _buildUI() : void
        {
            if ( this.m_dhModel )
            {
                this.m_uiController = new RDHguiController( this.m_dhModel );
            }
        }

    }

}