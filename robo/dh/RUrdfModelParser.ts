
/// <reference path="RKinTree.ts" />
/// <reference path="../../ext/cat1js/core/assets/LAssetsManager.ts"/>


namespace leojs
{
    export enum RUrdfGeometryType
    {
        BOX = 0,
        CYLINDER = 1,
        SPHERE = 2,
        MESH = 3
    }

    export class RUrdfLinkGeometry
    {
        public type : RUrdfGeometryType;

        // All possible parameters
        public b_width : number;
        public b_height : number;
        public b_depth : number;

        public c_radius : number;
        public c_length : number;

        public s_radius : number;

        public m_meshId : string;

        constructor()
        {
            this.type = RUrdfGeometryType.BOX;

            this.b_width = 1;
            this.b_height = 1;
            this.b_depth = 1;

            this.c_radius = 1;
            this.c_length = 1;

            this.s_radius = 1;

            this.m_meshId = '';
        }

        public toDictProperties() : { [id:string] : any }
        {
            let _res : { [id:string] : any } = {};

            _res['b_width'] = this.b_width;
            _res['b_height'] = this.b_height;
            _res['b_depth'] = this.b_depth;

            _res['c_radius'] = this.c_radius;
            _res['c_length'] = this.c_length;

            _res['s_radius'] = this.s_radius;

            _res['m_meshId'] = this.m_meshId;

            return _res;
        }
    }

    export class RUrdfLink
    {
        public id : string;
        public xyz : core.LVec3;
        public rpy : core.LVec3;
        public geometry : RUrdfLinkGeometry;

        public parentId : string;
        public jointToParentId : string;

        public childId : string;
        public jointToChildId : string;

        constructor()
        {
            this.id = '';
            this.xyz = new core.LVec3( 0, 0, 0 );
            this.rpy = new core.LVec3( 0, 0, 0 );
            this.geometry = new RUrdfLinkGeometry();

            this.parentId = '';
            this.jointToParentId = '',

            this.childId = '';
            this.jointToChildId = '';
        }
    }

    export class RUrdfJoint
    {
        public id : string;
        public xyz : core.LVec3;
        public rpy : core.LVec3;
        public axis : core.LVec3;
        public type : string;
        public parentId : string;
        public childId : string;

        constructor()
        {
            this.id = '';
            this.xyz = new core.LVec3( 0, 0, 0 );
            this.rpy = new core.LVec3( 0, 0, 0 );
            this.axis = new core.LVec3( 0, 0, 1 );// default 'z'
            this.type = 'revolute';
            this.parentId = '';
            this.childId = '';
        }
    }


    export class RUrdfModelParser
    {

        private m_xmlParser : DOMParser;

        constructor()
        {
            this.m_xmlParser = new DOMParser();
        }

        public parse( modelUrdfStr : string ) : RKinTree
        {
            let _doc = this.m_xmlParser.parseFromString( modelUrdfStr, 'text/xml' );
            let _root = _doc.documentElement;

            let _links = this._parseLinks( _root );
            let _joints = this._parseJoints( _root );

            // Assemble the guy
            let _kinTree = this._makeKinTree( _links, _joints );

            return _kinTree;
        }

        private _parseLinks( rootElement : HTMLElement ) : { [id:string] : RUrdfLink }
        {
            let _links : { [id:string] : RUrdfLink } = {};

            let _linkElms = rootElement.getElementsByTagName( 'link' );
            for ( let i = 0; i < _linkElms.length; i++ )
            {
                let _linkId = _linkElms[i].attributes['name'].nodeValue;

                _links[ _linkId ] = this._parseSingleLink( _linkElms[i] );
                _links[ _linkId ].id = _linkId;
            }


            return _links;
        }

        private _parseSingleLink( linkElm : Element ) : RUrdfLink
        {
            let _link = new RUrdfLink();

            // For now, just support visual node
            let _visualElm = linkElm.getElementsByTagName( 'visual' )[0];
            let _originElm = _visualElm.getElementsByTagName( 'origin' )[0];
            let _geoElm = _visualElm.getElementsByTagName( 'geometry' )[0];

            this._parseVisualOrigin( _link, _originElm );
            this._parseVisualGeometry( _link, _geoElm );

            return _link;
        }

        private _parseVisualOrigin( link : RUrdfLink, originElm : Element ) : void
        {
            link.xyz = this._getVec3Attrib( originElm, 'xyz', core.ZERO );
            link.rpy = this._getVec3Attrib( originElm, 'rpy', core.ZERO );
        }

        private _parseVisualGeometry( link : RUrdfLink, geoElm : Element ) : void
        {
            // Check each type of possible geometry
            if ( geoElm.getElementsByTagName( 'box' ).length > 0 )
            {
                let _boxElm = geoElm.getElementsByTagName( 'box' )[0];
                let _boxSize = this._getArrayAttrib( _boxElm, 'size', [1, 1, 1] );

                link.geometry.type = RUrdfGeometryType.BOX;
                link.geometry.b_width  = _boxSize[0];
                link.geometry.b_height = _boxSize[1];
                link.geometry.b_depth  = _boxSize[2];
            }
            else if ( geoElm.getElementsByTagName( 'cylinder' ).length > 0 )
            {
                let _cylElm = geoElm.getElementsByTagName( 'cylinder' )[0];
                let _cylRadius = this._getNumberAttrib( _cylElm, 'radius', 1 );
                let _cylLength = this._getNumberAttrib( _cylElm, 'length', 1 );

                link.geometry.type = RUrdfGeometryType.CYLINDER;
                link.geometry.c_radius = _cylRadius;
                link.geometry.c_length = _cylLength;
            }
            else if ( geoElm.getElementsByTagName( 'sphere' ).length > 0 )
            {
                let _sphElm = geoElm.getElementsByTagName( 'sphere' )[0];
                let _sphRadius = this._getNumberAttrib( _sphElm, 'radius', 1 );

                link.geometry.type = RUrdfGeometryType.SPHERE;
                link.geometry.s_radius = _sphRadius;
            }
            else if ( geoElm.getElementsByTagName( 'mesh' ).length > 0 )
            {
                let _meshElm = geoElm.getElementsByTagName( 'mesh' )[0];
                let _meshFullPath = this._getStringAttrib( _meshElm, 'filename', '' );

                if ( _meshFullPath == '' )
                {
                    console.warn( 'RUrdfModelParser> could not extract filename for mesh geometry' +
                                  '; using box to avoid crashes' );

                    // Use a default box to avoid crashing
                    link.geometry.type = RUrdfGeometryType.BOX;
                    link.geometry.b_width = 1;
                    link.geometry.b_height = 1;
                    link.geometry.b_depth = 1;
                }
                else
                {
                    let _pathSplit = _meshFullPath.split( '/' );
                    let _meshFileName = _pathSplit[ _pathSplit.length - 1 ];
                    let _meshFileNameSplit = _meshFileName.split( '.' );
                    // Assuming files are of type 'meshId.format', so extracting format away
                    let _meshId = _meshFileNameSplit[0];

                    if ( core.LAssetsManager.INSTANCE.getModel( _meshId ) )
                    {
                        // Model exists, so just use it
                        link.geometry.type = RUrdfGeometryType.MESH;
                        link.geometry.m_meshId = _meshId;
                    }
                    else
                    {
                        // Use a default box, as the mesh is not there
                        console.warn( 'RUrdfModelParser> mesh with id: ' + _meshId +
                                      ' does not exist; using box to avoid crashes' );
                        link.geometry.type = RUrdfGeometryType.BOX;
                        link.geometry.b_width = 1;
                        link.geometry.b_height = 1;
                        link.geometry.b_depth = 1;
                    }
                }
            }
        }

        private _parseJoints( rootElement : HTMLElement ) : { [id:string] : RUrdfJoint }
        {
            let _joints : { [id:string] : RUrdfJoint } = {};

            let _jointElms = rootElement.getElementsByTagName( 'link' );
            for ( let i = 0; i < _jointElms.length; i++ )
            {
                let _jointId = _jointElms[i].attributes['name'].nodeValue;

                _joints[ _jointId ] = this._parseSingleJoint( _jointElms[i] );
                _joints[ _jointId ].id = _jointId;
            }

            return _joints;
        }

        private _parseSingleJoint( jointElm : Element ) : RUrdfJoint
        {
            let _joint = new RUrdfJoint();

            this._parseJointOrigin( _joint, jointElm );
            this._parseJointConnection( _joint, jointElm );
            this._parseJointAxis( _joint, jointElm );
            this._parseJointType( _joint, jointElm );

            return _joint;
        }

        private _parseJointOrigin( joint : RUrdfJoint, jointElm : Element ) : void
        {
            if ( jointElm.getElementsByTagName( 'origin' ).length != 0 )
            {
                let _originElm = jointElm.getElementsByTagName( 'origin' )[0];

                joint.xyz = this._getVec3Attrib( _originElm, 'xyz', core.ZERO );
                joint.rpy = this._getVec3Attrib( _originElm, 'rpy', core.ZERO );
            }
            else
            {
                console.warn( 'RUrdfModelParser> there is a joint with no origin' );
            }
        }

        private _parseJointConnection( joint : RUrdfJoint, jointElm : Element ) : void
        {
            if ( jointElm.getElementsByTagName( 'parent' ).length != 0 &&
                 jointElm.getElementsByTagName( 'child' ).length != 0 )
            {
                let _parentElm = jointElm.getElementsByTagName( 'parent' )[0];
                let _childElm  = jointElm.getElementsByTagName( 'parent' )[0];

                joint.parentId = this._getStringAttrib( _parentElm, 'link', '' );
                joint.childId  = this._getStringAttrib( _childElm, 'link', '' );
            }
            else
            {
                console.warn( 'RUrdfModelParser> there is a joint with no parent-child connections' );
            }
        }

        private _parseJointAxis( joint : RUrdfJoint, jointElm : Element ) : void
        {
            if ( jointElm.getElementsByTagName( 'axis' ).length != 0 )
            {
                let _axisElm = jointElm.getElementsByTagName( 'axis' )[0];

                joint.axis = this._getVec3Attrib( _axisElm, 'xyz', core.AXIS_Z );
            }
            else
            {
                console.info( 'RUrdfModelParser> this joint does not use an axis' );
            }
        }

        private _parseJointType( joint : RUrdfJoint, jointElm : Element ) : void
        {
            let _jointTypeStr : string = jointElm.getAttribute( 'type' );
            if ( !_jointTypeStr || _jointTypeStr == '' )
            {
                _jointTypeStr = RKinJointTypeFixed;
            }

            if ( _jointTypeStr != RKinJointTypeFixed &&
                 _jointTypeStr != RKinJointTYpePrismatic &&
                 _jointTypeStr != RKinJointTypeRevolute )
            {
                console.warn( 'RUrdfModelParser> joint with a not' + 
                              ' correctly type: ' + _jointTypeStr +
                              '. Using _fixed_ as default' );
                _jointTypeStr = RKinJointTypeFixed;
            }

            joint.type = _jointTypeStr;
        }

        private _makeKinTree( links : { [id:string] : RUrdfLink },
                              joints : { [id:string] : RUrdfJoint } ) : RKinTree
        {
            // Extract the link that is the root of the ...
            // tree ( has children but not parent in joints )
            let _rootLink = this._getRootLink( links, joints );
            if ( !_rootLink )
            {
                console.warn( 'RUrdfModelParser> this model has no root as the base :(' );
                return null;
            }

            let _kinTree = new RKinTree();
            let _kinNodes = this._makeKinNodes( links );
            let _kinJoints = this._makeKinJoints( joints );
            this._assembleKinTree( _kinTree, _kinNodes, _kinJoints );

            return _kinTree;
        }

        private _getRootLink( links : { [id:string] : RUrdfLink },
                              joints : { [id:string] : RUrdfJoint } ) : RUrdfLink
        {
            let _rootLink : RUrdfLink = null;

            let _keyJoint : string;
            for ( _keyJoint in joints )
            {
                let _childId  = joints[ _keyJoint ].childId;
                let _parentId = joints[ _keyJoint ].parentId;
                // Just in case, check the link exists. The urdf may be messed up
                if ( links[ _childId ] )
                {
                    links[ _childId ].parentId = _parentId;
                    links[ _childId ].jointToParentId = _keyJoint;
                }
                if ( links[ _parentId ] )
                {
                    links[ _parentId ].childId = _childId;
                    links[ _parentId ].jointToChildId = _keyJoint;
                }
            }

            let _keyLink : string;
            for ( _keyLink in links )
            {
                if ( ( links[ _keyLink ].childId == '' ) ||
                     ( links[ _keyLink ].parentId != '' ) )
                {
                    continue;
                }

                // This link must be a root, just check that the urdf does not ...
                // have more than two possible roots, as that should be invalid
                if ( _rootLink )
                {
                    console.warn( 'RUrdfModelParser> this model seems to have more ' +
                                  'than two root links, and that should not happen if this ' +
                                  'model represents a single kintree ( connections are one to one )' );
                    continue;
                }

                _rootLink = links[ _keyLink ];
            }

            return _rootLink;
        }

        private _makeKinNodes( links : { [id:string] : RUrdfLink } ) : { [id:string] : RKinNode }
        {
            let _kinNodes : { [id:string] : RKinNode } = {};

            for ( let _key in links )
            {
                let _link = links[ _key ];

                let _kinNode = new RKinNode( _link.id );
                _kinNode.initNode( _link.xyz, _link.rpy, 
                                   _link.geometry.toDictProperties() );

                _kinNodes[ _kinNode.getId() ] = _kinNode;
            }

            return _kinNodes;
        }

        private _makeKinJoints( joints : { [id:string] : RUrdfJoint } ) : { [id:string] : RKinJoint }
        {
            let _kinJoints : { [id:string] : RKinJoint } = {};

            for ( let _key in joints )
            {
                let _joint = joints[ _key ];

                let _kinJoint = new RKinJoint( _joint.id );
                _kinJoint.initJoint( _joint.xyz, _joint.rpy, 
                                     _joint.axis, _joint.type,
                                     _joint.parentId, _joint.childId );

                _kinJoints[ _kinJoint.getId() ] = _kinJoint;
            }

            return _kinJoints;
        }

        private _assembleKinTree( kinTree : RKinTree, 
                                  kinNodes : { [id:string] : RKinNode },
                                  kinJoints : { [id:string] : RKinJoint } )
        {
            // First, populate with the corresponding connections
            for ( let _key in kinJoints )
            {
                let _parentId = kinJoints[ _key ].getParentId();
                let _childId  = kinJoints[ _key ].getChildId();

                if ( !kinNodes[ _parentId ] ||
                     !kinNodes[ _childId ] )
                {
                    console.warn( 'RUrdfModelParser> there is a joint that ' +
                                  'connects non existent nodes: ' +
                                  'child= ' + _childId + ' - parent= ' + _parentId );
                    continue;
                }

                // Make joint connection
                kinJoints[ _key ].connect( kinNodes[ _parentId ], kinNodes[ _childId ] );
                // Add joint connection to the parent node
                kinNodes[ _parentId ].addJointConnection( kinJoints[ _key ] );
                kinNodes[ _childId ].setParentJointConnection( kinJoints[ _key ] );
            }

            // Add them all
            for ( let _jointId in kinJoints )
            {
                kinTree.addKinJoint( kinJoints[ _jointId ] );
            }
            for ( let _nodeId in kinNodes )
            {
                kinTree.addKinNode( kinNodes[ _nodeId ] );
            }
        }

        // Some helpers
        private _getStringAttrib( elm : Element, attribName : string, defValue : string ) : string
        {
            let _str = elm.getAttribute( attribName );
            if ( !_str || _str == '' )
            {
                console.info( 'RUrdfModelParser> attrib: ' + attribName + ' not found. Using ' +
                              'default value: ' + defValue + ' instead' );                
                return defValue;
            }

            return _str;
        }
        private _getNumberAttrib( elm : Element, attribName : string, defValue : number ) : number
        {
            let _numStr = elm.getAttribute( attribName );

            if ( !_numStr || _numStr == '' )
            {
                console.info( 'RUrdfModelParser> attrib: ' + attribName + ' not found. Using ' +
                              'default value: ' + defValue + ' instead' );
                return defValue;
            }

            let _val = parseFloat( _numStr );
            if ( isNaN( _val ) )
            {
                console.warn( 'RUrdfModelParser> attrib: ' + attribName + ' is not a number, ' +
                              'using default value: ' + defValue + ' instead' );
                return defValue;
            }

            return _val;
        }
        private _getArrayAttrib( elm : Element, attribName : string, defValue : number[] ) : number[]
        {
            let _arrStr = elm.getAttribute( attribName );
            
            if ( !_arrStr || _arrStr == '' )
            {
                console.info( 'RUrdfModelParser> attrib: ' + attribName + ' not found. Using ' +
                              'default value: ' + defValue + ' instead' );
                return defValue;
            }

            let _arr = _arrStr.split( ' ' ).map( Number );
            for ( let q = 0; q < _arr.length; q++ )
            {
                if ( isNaN( _arr[q] ) )
                {
                    console.warn( 'RUrdfModelParser> attrib: ' + attribName + 
                                  ' is not an array of numbers, using default value: ' +
                                  defValue + ' instead' );
                    return defValue;
                }
            }

            if ( _arr.length != defValue.length )
            {
                console.warn( 'RUrdfModelParser> attrib: ' + attribName +
                              ' does not have the expected length, using default value instead' );
                return defValue;
            }

            return _arr;
        }
        private _getVec3Attrib( elm : Element, attribName : string, defValue : core.LVec3 ) : core.LVec3
        {
            let _data = this._getArrayAttrib( elm, attribName, [0, 0, 0] );
            if ( _data.length != 3 )
            {
                console.warn( 'RUrdfModelParser> attrib: ' + attribName + 
                              ' is not a vec3, using default: ' + defValue );
                return defValue.clone();
            }

            return new core.LVec3( _data[0], _data[1], _data[2] );
        }
    }

}