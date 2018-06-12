

/// <reference path="RDHWorld.ts" />

namespace leojs
{


    export class RDHWorldPlayground extends RDHWorld
    {

        constructor( appWidth : number, appHeight : number )
        {
            super( appWidth, appHeight );

            this.m_worldId = 'PLAYGROUND';
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
                this.m_urdfModel.deletionRequested = true;
                this.m_urdfModel = null;
            }

            if ( this.m_uiController )
            {
                this.m_uiController.release();
                this.m_uiController = null;
            }
        }

        /**
        *    Rebuild models in playground
        *
        *    @method rebuild
        *    @param {Array<Dictionary>} userDHtable DH table
        *    @param {string?} userURDFfileId urdfFile of the  manipulator. Empty for none
        */
        public rebuild( userDHtable : { [id:string] : any }[],
                        userURDFfileId? : string ) : void
        {
            // Clean previous resources
            this.reset();

            // Build new model
            this._buildModel( userDHtable );
            this._buildUI();

            if ( userURDFfileId && userURDFfileId != '' )
            {
                let _urdfData = core.LAssetsManager.INSTANCE.getTextAsset( userURDFfileId );
                this.m_urdfModel = new RManipulator( _urdfData );
                this.addEntity( this.m_urdfModel );
            }
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