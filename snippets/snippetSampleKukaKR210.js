

function buildRobot()
{
    // Build DH table here
    
    let _table = [ { 'alpha' : 0, 'a' : 0,   'd' : 0.75, 'theta' : 0, 'joint' : 'revolute', 
    				 'min' : ( -185 * Math.PI / 180 ), 'max' : ( 185 * Math.PI / 180 ) },

                   { 'alpha' : -0.5 * Math.PI, 'a' : 0.35, 'd' : 0, 'theta' : 0, 'joint' : 'revolute',
                   	 'min' : ( -45 * Math.PI / 180 ), 'max' : ( 85 * Math.PI / 180 ),
                   	 'sign' : 1, 'offset' : -0.5 * Math.PI },

                   { 'alpha' : 0, 'a' : 1.25, 'd' : 0, 'theta' : 0, 'joint' : 'revolute',
                   	 'min' : ( -210 * Math.PI / 180 ), 'max' : ( ( 155 - 90 ) * Math.PI / 180 ) },

                   { 'alpha' : -0.5 * Math.PI, 'a' : -0.054, 'd' : 1.5, 'theta' : 0, 'joint' : 'revolute',
                   	 'min' : -Math.PI, 'max' : Math.PI },

                   { 'alpha' : 0.5 * Math.PI, 'a' : 0, 'd' : 0, 'theta' : 0, 'joint' : 'revolute',
                   	 'min' : -Math.PI, 'max' : Math.PI },

                   { 'alpha' : -0.5 * Math.PI, 'a' : 0, 'd' : 0, 'theta' : 0, 'joint' : 'revolute',
                   	 'min' : -Math.PI, 'max' : Math.PI } ];

    rApp.world().rebuild( _table, 'kr210_urdf' );
}

buildRobot();