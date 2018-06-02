
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

        public update( dt : number ) : void
        {
            super.update( dt );

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
                this.m_dhGuiController.update( dt );
            }
        }


    }






}