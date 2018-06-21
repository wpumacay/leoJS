

function buildRobot()
{
    // Build DH table here
    
    let _table = [ { 'alpha' : 0, 'a' : 0,   'd' : 0.5,  'theta' : 0, 'joint' : 'revolute' },
                   { 'alpha' : 0, 'a' : 0.5, 'd' : 0,    'theta' : 0, 'joint' : 'revolute' },
                   { 'alpha' : 0, 'a' : 0.5, 'd' : 0,    'theta' : 0, 'joint' : 'prismatic', 'sign' : -1 },
                   { 'alpha' : 0, 'a' : 0,   'd' : -0.5, 'theta' : 0, 'joint' : 'revolute' } ];

    rApp.world().rebuild( _table );
}

buildRobot();