
/// <reference path="../../core/worlds/RWorld.ts" />

/// <reference path="RDHmodel.ts" />
/// <reference path="ui/RDHguiController.ts" />
/// <reference path="RManipulator.ts" />

namespace leojs
{

    export class RDHWorld extends RWorld
    {

        protected m_dhModel : RDHmodel;
        protected m_urdfModel : RManipulator;
        protected m_uiController : RDHguiController;

        constructor( appWidth : number, appHeight : number )
        {
            super( appWidth, appHeight );

            this.m_dhModel = null;
            this.m_urdfModel = null;
            this.m_uiController = null;
        }

        public init() : void
        {
            // Override this - Initialize some needed stuff here
        }

        private _drawFloorGrid() : void
        {
            let _gridRangeX = 10;
            let _divX = 5;
            let _stepX = _gridRangeX / _divX;

            let _gridRangeY = 10;
            let _divY = 5;
            let _stepY = _gridRangeY / _divY;

            // Draw lines parallel to x axis
            for ( let q = -_divY; q <= _divY; q++ )
            {
                let _p1 = new core.LVec3( -_gridRangeX, q * _stepY, 0 );
                let _p2 = new core.LVec3( _gridRangeX, q * _stepY, 0 );

                engine3d.DebugSystem.drawLine( _p1, _p2, core.LIGHT_GRAY );
            }

            // Draw lines parallel to y axis
            for ( let q = -_divX; q <= _divX; q++ )
            {
                let _p1 = new core.LVec3( q * _stepY, -_gridRangeY, 0 );
                let _p2 = new core.LVec3( q * _stepY, _gridRangeY, 0 );

                engine3d.DebugSystem.drawLine( _p1, _p2, core.LIGHT_GRAY );
            }
        }

        public update( dt : number ) : void
        {
            super.update( dt );

            this._drawFloorGrid();

            if ( this.m_dhModel )
            {
                this.m_dhModel.update( dt );
            }

            if ( this.m_urdfModel )
            {
                let _kinJoints = this.m_urdfModel.getJoints();
                
                for ( let _jointId in _kinJoints )
                {
                    if ( this.m_dhModel.doesJointExist( _jointId ) )
                    {
                        let _jointValue = this.m_dhModel.getJointValueById( _jointId );
                        _kinJoints[ _jointId ].setJointValue( _jointValue );
                    }
                }
            }

            if ( this.m_uiController )
            {
                // Update visibility
                let _isDHmodelVisible = this.m_uiController.isDHmodelVisible();
                let _isURDFmodelVisible = this.m_uiController.isURDFmodelVisible();

                if ( this.m_dhModel )
                {
                    this.m_dhModel.setModelVisibility( _isDHmodelVisible );
                }
                if ( this.m_urdfModel )
                {
                    this.m_urdfModel.setVisibility( _isURDFmodelVisible );
                }

                this.m_uiController.update( dt );
            }
        }


    }


}