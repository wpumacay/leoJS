/// <reference path="../lib/babylon.2.5.d.ts" />

type Dict = {[index:string] : any};
type StringDict<T> = {[index:string] : T};

class URDFmaterial
{
    public id : string;
    public r: number;
    public g: number;
    public b: number;
    public a: number;

    constructor()
    {
        this.id = 'defaultMaterial';
        this.r = 1;
        this.g = 1;
        this.b = 1;
        this.a = 1;
    }
}

class URDFgeometry
{
    public gtype : string;
    public goptions : Dict;

    constructor()
    {
        this.gtype = 'box';
        this.goptions = {};
    }
}

class URDFjoint
{
    public id : string;
    public id_parent : string;
    public id_child : string;
    public jointType : string;
    public xyz : BABYLON.Vector3;
    public rpy : BABYLON.Vector3;

    constructor()
    {
        this.id = 'defaultJoint';
        this.id_parent = '';
        this.id_child = '';
        this.jointType = 'fixed';

        this.xyz = new BABYLON.Vector3( 0, 0, 0 );
        this.rpy = new BABYLON.Vector3( 0, 0, 0 );
    }
}

class URDFnode
{
    public id : string;
    public geometry : URDFgeometry;
    public material : URDFmaterial;
    public xyz : BABYLON.Vector3;
    public rpy : BABYLON.Vector3;

    public joints : Array<URDFjoint>;
    public children : Array<URDFnode>;

    constructor()
    {
        this.id = 'defaultNode';
        this.geometry = new URDFgeometry();
        this.material = new URDFmaterial();
        
        this.xyz = new BABYLON.Vector3( 0, 0, 0 );
        this.rpy = new BABYLON.Vector3( 0, 0, 0 );

        this.joints = [];
        this.children = [];
    }


}

class URDFrobotData
{

    public static MATERIALS : Dict = {};

    public id : string;
    public root : URDFnode;

    constructor()
    {
        this.id = '';
        this.root = null;
    }

    
    public static fromString( urdfData : string ) : URDFrobotData
    {
        let _urdfObj : URDFrobotData = new URDFrobotData();

        let _data = JSON.parse( urdfData );
        
        let _root = _data['robot'];
        _urdfObj.id = _root['@name'];
        
        let q : number;
        let _links : Dict = {};
        let _joints : Dict = {};

        for ( q = 0; q < _root['link'].length; q++ )
        {
            let _link : Dict = URDFrobotData.parseLink( _root['link'][q] );
            _links[_link['name']] = _link;
        }

        for ( q = 0; q < _root['joint'].length; q++ )
        {
            let _joint : Dict = URDFrobotData.parseJoint( _root['joint'][q] );
            _joints[_joint['name']] = _joint;
        }
        
        URDFrobotData.assemble( _links, _joints, _urdfObj );

        return _urdfObj;
    }

    
    public static parseLink( linkInfo : any ) : Dict
    {
        let _linkData : Dict = {};

        let _name : string = <string> linkInfo['@name'];
        _linkData['name'] = _name;

        let _visual : Dict = linkInfo['visual'];

        let _geometry : Dict = _visual['geometry'] || { 'box' : { 'size' : '1 1 1' } };
        let _material : Dict = _visual['material'] || { '@name' : 'white', 'color' : { '@rgba' : '1 1 1 1' } };
        let _origin : Dict = _visual['origin'] || { '@xyz' : '0 0 0', '@rpy' : '0 0 0' };

        // parse the geometry ******************************************
        // use Object.keys to retrieve the geometry type
        let _keys : Array<string> = Object.keys( _geometry );
        let _geometryType : string = _keys[0];
        let _geometryOptions : Dict = _geometry[_keys[0]];
        // clean the geometry data
        let _gkeys : Array<string> = Object.keys( _geometryOptions );
        let _cleanedOptions : Dict = {};
        for ( var q : number = 0; q < _gkeys.length; q++ )
        {
            let _cleanKey : string = _gkeys[q].replace( '@', '' );
            let _dirtyParam : string = _geometryOptions[_gkeys[q]];
            if ( typeof( _dirtyParam ) == 'string' && _dirtyParam.indexOf( ' ' ) != -1 )
            {
                _cleanedOptions[_cleanKey] = _dirtyParam.split( ' ' );
            }
            else
            {
                _cleanedOptions[_cleanKey] = _dirtyParam;
            }
        }
        _cleanedOptions['type'] = _geometryType;
        _linkData['geometry'] = _cleanedOptions;

        // **************************************************************
        
        // parse the material********************************************
        let _materialId : string = _material['@name'];
        if ( _material.hasOwnProperty( 'color' ) &&
             !URDFrobotData.MATERIALS.hasOwnProperty( _materialId ) )
        {
            let _materialOptions : Dict = _material['color'];
            let _materialColorOptions : Array<string> = _materialOptions['@rgba'].split( ' ' );
            let _materialCleanedOptions : Dict = {};
            _materialCleanedOptions['r'] = parseFloat( _materialColorOptions[0] );
            _materialCleanedOptions['g'] = parseFloat( _materialColorOptions[1] );
            _materialCleanedOptions['b'] = parseFloat( _materialColorOptions[2] );
            _materialCleanedOptions['a'] = parseFloat( _materialColorOptions[3] );

            URDFrobotData.MATERIALS[_materialId] = _materialCleanedOptions;
        }
        
        _linkData['material'] = _materialId;
        // **************************************************************
        
        // parse the origin *********************************************
        let _originPositionOptions : Array<string> = _origin['@xyz'].split( ' ' );
        let _originOrientationOptions : Array<string> = _origin['@rpy'].split( ' ' );
        let _originCleanedOptions : Dict = {};
        _originCleanedOptions['x'] = parseFloat( _originPositionOptions[0] );
        _originCleanedOptions['y'] = parseFloat( _originPositionOptions[1] );
        _originCleanedOptions['z'] = parseFloat( _originPositionOptions[2] );
        _originCleanedOptions['roll'] = parseFloat( _originOrientationOptions[0] );
        _originCleanedOptions['pitch'] = parseFloat( _originOrientationOptions[1] );
        _originCleanedOptions['yaw'] = parseFloat( _originOrientationOptions[2] );
        
        _linkData['origin'] = _originCleanedOptions;
        // **************************************************************

        return _linkData;
    }

    public static parseJoint( jointInfo : any ) : Dict
    {
        let _jointData : Dict = {};
        let _name : string = <string> jointInfo['@name'];
        let _type : string = <string> jointInfo['@type'];
        let _parent : string = <string> jointInfo['parent']['@link'];
        let _child : string = <string> jointInfo['child']['@link'];
        let _originOptions : Dict = jointInfo['origin'] || { '@xyz' : '0 0 0', '@rpy' : '0 0 0' };
        _originOptions['@xyz'] = ( _originOptions['@xyz'] || '0 0 0' );
        _originOptions['@rpy'] = ( _originOptions['@rpy'] || '0 0 0' );
        let _originPositionOptions : Array<string> = _originOptions['@xyz'].split( ' ' );
        let _originOrientationOptions : Array<string> = _originOptions['@rpy'].split( ' ' );

        _jointData['name'] = _name;
        _jointData['type'] = _type;
        _jointData['parent'] = _parent;
        _jointData['child'] = _child;
        _jointData['x'] = parseFloat( _originPositionOptions[0] );
        _jointData['y'] = parseFloat( _originPositionOptions[1] );
        _jointData['z'] = parseFloat( _originPositionOptions[2] );
        _jointData['roll'] = parseFloat( _originOrientationOptions[0] );
        _jointData['pitch'] = parseFloat( _originOrientationOptions[1] );
        _jointData['yaw'] = parseFloat( _originOrientationOptions[2] );

        return _jointData;
    }


    public static assemble( links : Dict, joints : Dict, urdfObj : URDFrobotData ) : void
    {
        /// Build the nodes **********
        let _keyName : string;
        let _urdfNodes : StringDict<URDFnode> = {};
        for ( _keyName in links )
        {
            let _link : Dict = links[_keyName];

            let _newNode : URDFnode = new URDFnode();
            _newNode.id = _keyName;

            _newNode.geometry = new URDFgeometry();
            _newNode.geometry.gtype = _link['geometry']['type'];
            _newNode.geometry.goptions = _link['geometry'];

            let _materialInfo : Dict = URDFrobotData.MATERIALS[_link['material']];
            _newNode.material = new URDFmaterial();
            _newNode.material.id = _link['material'];
            _newNode.material.r = <number> _materialInfo['r'];
            _newNode.material.g = <number> _materialInfo['g'];
            _newNode.material.b = <number> _materialInfo['b'];
            _newNode.material.a = <number> _materialInfo['a'];

            _newNode.xyz.x = _link['origin']['x'];
            _newNode.xyz.y = _link['origin']['y'];
            _newNode.xyz.z = _link['origin']['z'];
            _newNode.rpy.x = _link['origin']['roll'];
            _newNode.rpy.y = _link['origin']['pitch'];
            _newNode.rpy.z = _link['origin']['yaw'];
            
            _urdfNodes[_keyName] = _newNode;
        }

        let _urdfJoints : StringDict<URDFjoint> = {};
        for ( _keyName in joints )
        {
            let _joint : Dict = joints[_keyName];

            let _newJoint : URDFjoint = new URDFjoint();
            _newJoint.id = _keyName;
            _newJoint.jointType = _joint['type'];
            _newJoint.id_parent = _joint['parent'];
            _newJoint.id_child = _joint['child'];
            _newJoint.xyz.x = _joint['x'];
            _newJoint.xyz.y = _joint['y'];
            _newJoint.xyz.z = _joint['z'];
            _newJoint.rpy.x = _joint['roll'];
            _newJoint.rpy.y = _joint['pitch'];
            _newJoint.rpy.z = _joint['yaw'];

            _urdfJoints[_keyName] = _newJoint;
        }

        // find the root id
        let _jointKeys : Array<string> = Object.keys( _urdfJoints );
        let _rootId : string = _urdfJoints[_jointKeys[0]].id_parent;
        let q : number;
        for ( q = 1; q < _jointKeys.length; q++ )
        {
            let _testKey : string = _jointKeys[q];
            if ( _urdfJoints[_testKey].id_child == _rootId )
            {
                _rootId = _urdfJoints[_testKey].id_parent;
            }
        }

        /// console.log( 'assemble > root node is: ' + _rootId );

        // build the tree
        var _key : string;
        for ( _key in _urdfJoints )
        {
            let _parentId : string = _urdfJoints[_key].id_parent;
            let _childId : string = _urdfJoints[_key].id_child;
            
            // add the joint and the child to the parent node
            _urdfNodes[_parentId].children.push( _urdfNodes[_childId] );
            _urdfNodes[_parentId].joints.push( _urdfJoints[_key] );
        }

        urdfObj.root = _urdfNodes[_rootId];
    }
}




