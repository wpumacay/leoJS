
/// <reference path="../lib/babylon.2.5.d.ts" />
/// <reference path="RRobotURDFData.ts" />



class RRobot
{
    private m_urdfStrData : string = '';
    private m_urdfData : URDFrobotData = null;

    constructor( urdfData : string )
    { 
        this.initFromData( urdfData );
    }

    private initFromData( urdfStrData : string ) : void
    {
        this.m_urdfStrData = urdfStrData;
        this.m_urdfData = URDFrobotData.fromString( this.m_urdfStrData );

        this.createVisualComponent();
    }

    private createVisualComponent() : void
    {
        
    }

    public static fromString( urdfStrData : string ) : RRobot
    {
        return new RRobot( urdfStrData );
    }


}
