
/// <reference path="../../core/worlds/RWorld.ts" />

/// <reference path="RDHmodel.ts" />
/// <reference path="models/RDHmodelScara.ts" />
/// <reference path="models/RDHmodelKukaKR210.ts" />
/// <reference path="ui/RDHguiController.ts" />
/// <reference path="RManipulator.ts" />

namespace leojs
{

    export enum RobotId
    {
        SCARA = 0,
        KUKA_KR210 = 1
    }

    export class RDHWorld extends RWorld
    {

        private m_dhModel : RDHmodel;
        private m_dhTable : RDHtable;
        private m_dhGuiController : RDHguiController;
        private m_robotId : RobotId;
        private m_manipulatorRef : RManipulator;

        constructor( appWidth : number, appHeight : number,
                     robotId : RobotId )
        {
            super( appWidth, appHeight );

            this.m_dhModel = null;
            this.m_dhTable = null;
            this.m_dhGuiController = null;
            this.m_robotId = robotId;
            this.m_manipulatorRef = null;

            this._initializeModel();
            this._initializeUI();
            this._initializeEnvironment();
        }

        private _initializeModel() : void
        {
            if ( this.m_robotId == RobotId.SCARA )
            {
                this.m_dhModel = new RDHmodelScara( this );
                this.m_manipulatorRef = null;// TODO: Find a sexy scara urdf :3
            }
            else if ( this.m_robotId == RobotId.KUKA_KR210 )
            {
                this.m_dhModel = new RDHmodelKukaKR210( this );

                let _urdfData = core.LAssetsManager.INSTANCE.getTextAsset( 'kr210_urdf' );
                this.m_manipulatorRef = new RManipulator( _urdfData );
                this.addEntity( this.m_manipulatorRef );
            }
        }

        private _initializeUI() : void
        {
            if ( this.m_dhModel )
            {
                this.m_dhGuiController = new RDHguiController( this.m_dhModel );
            }
        }

        private _initializeEnvironment() : void
        {
            // TODO: Floor with texture looks kind of weird. I mean, the manipulator does ...
            // not stand out in the whole scene, because I haven't ported shadowmapping yet :(.
            // For now, just make it look like RViz, and make a plain grid made of lines

            // let _planeMesh = buildPrimitive( { 'shape' : 'plane',
            //                                    'width' : 40,
            //                                    'depth' : 40,
            //                                    'texRangeWidth' : 10,
            //                                    'texRangeDepth' : 10 },
            //                                  { 'material' : 'textured',
            //                                    'textureId' : 'img_default',
            //                                    'specular' : core.DEFAULT_SPECULAR,
            //                                    'shininess' : core.DEFAULT_SHININESS } );
            // let _planeEntity = new REntity();
            // let _planeGraphics = new RMesh3dComponent( _planeEntity, _planeMesh );
            // _planeEntity.addComponent( _planeGraphics );

            // _planeEntity.rotation.x = 0.5 * Math.PI;

            // this.addEntity( _planeEntity );

            // TODO: Add support for polylists, as it seems the shelf and bin use it :(
            // let _shelfModelInfo = core.LAssetsManager.INSTANCE.getModel( '' )
            // let _binModelInfo = core.LAssetsManager.INSTANCE.getModel( '' );
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

            if ( this.m_manipulatorRef )
            {
                let _kinJoints = this.m_manipulatorRef.getJoints();
                
                for ( let _jointId in _kinJoints )
                {
                    if ( this.m_dhModel.doesJointExist( _jointId ) )
                    {
                        let _jointValue = this.m_dhModel.getJointValueById( _jointId );
                        _kinJoints[ _jointId ].setJointValue( _jointValue );
                    }
                }
            }

            if ( this.m_dhGuiController )
            {
                // Update visibility
                let _isDHmodelVisible = this.m_dhGuiController.isDHmodelVisible();
                let _isURDFmodelVisible = this.m_dhGuiController.isURDFmodelVisible();

                if ( this.m_dhModel )
                {
                    this.m_dhModel.setModelVisibility( _isDHmodelVisible );
                }
                if ( this.m_manipulatorRef )
                {
                    this.m_manipulatorRef.setVisibility( _isURDFmodelVisible );
                }

                this.m_dhGuiController.update( dt );
            }
        }


    }






}