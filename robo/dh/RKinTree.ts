
/// <reference path="../../ext/cat1js/core/math/LMath.ts" />


namespace leojs
{

    export const RKinGeometryTypeBox : string      = 'box';
    export const RKinGeometryTypeCylinder : string = 'cylinder';
    export const RKinGeometryTypeSphere : string   = 'sphere';
    export const RKinGeometryTypeMesh : string     = 'mesh';

    export const RKinJointTypeFixed : string     = 'fixed';
    export const RKinJointTypeRevolute : string  = 'revolute';
    export const RKinJointTYpePrismatic : string = 'prismatic';

    export class RKinNodeGeometry
    {
        public type : string;

        public b_width : number;
        public b_height : number;
        public b_depth : number;

        public c_radius : number;
        public c_length : number;

        public s_radius : number;

        public m_meshId : string;

        constructor()
        {
            this.type = RKinGeometryTypeBox;

            this.b_width = 1;
            this.b_height = 1;
            this.b_depth = 1;

            this.c_radius = 1;
            this.c_length = 1;

            this.s_radius = 1;

            this.m_meshId = '';
        }


        public static fromDict( geometryProperties : { [id:string] : any } ) : RKinNodeGeometry
        {
            let _rkinGeometry : RKinNodeGeometry = new RKinNodeGeometry();

            _rkinGeometry.b_width = geometryProperties['b_width'];
            _rkinGeometry.b_height = geometryProperties['b_height'];
            _rkinGeometry.b_depth = geometryProperties['b_depth'];

            _rkinGeometry.c_radius = geometryProperties['c_radius'];
            _rkinGeometry.c_length = geometryProperties['c_length'];

            _rkinGeometry.s_radius = geometryProperties['s_radius'];

            _rkinGeometry.m_meshId = geometryProperties['m_meshId'];

            _rkinGeometry.type = geometryProperties['type'];

            return _rkinGeometry;
        }

    }

    export class RKinNode
    {
        private m_id : string;
        private m_parentJoint : RKinJoint;
        private m_childrenJoints : RKinJoint[];
        private m_linkTransform : core.LMat4;
        private m_worldTransform : core.LMat4;
        private m_localTransform : core.LMat4;
        private m_geometry : RKinNodeGeometry;

        constructor( nodeId : string )
        {
            this.m_id = nodeId;
            this.m_parentJoint = null;
            this.m_childrenJoints = [];
            this.m_localTransform = new core.LMat4();
            this.m_linkTransform = new core.LMat4();
            this.m_worldTransform = new core.LMat4();
            this.m_geometry = null;
        }

        public release() : void
        {
            this.m_parentJoint = null;

            if ( this.m_childrenJoints )
            {
                for ( let q = 0; q < this.m_childrenJoints.length; q++ )
                {
                    this.m_childrenJoints[q] = null;
                }
                this.m_childrenJoints = null;
            }

            this.m_localTransform = null;
            this.m_linkTransform = null;
            this.m_worldTransform = null;

            this.m_geometry = null;
        }

        public initNode( lxyz : core.LVec3,
                         lrpy : core.LVec3,
                         geometryProperties : { [id:string] : any } ) : void
        {
            core.LMat4.fromPosEulerInPlace( this.m_localTransform, 
                                            lxyz, lrpy );

            this.m_geometry = RKinNodeGeometry.fromDict( geometryProperties );
        }

        public getGeometry() : RKinNodeGeometry { return this.m_geometry; }
        public getLocalTransform() : core.LMat4 { return this.m_localTransform; }
        public getLinkTransform() : core.LMat4 { return this.m_linkTransform; }
        public getWorldTransform() : core.LMat4 { return this.m_worldTransform; }
        public getId () : string { return this.m_id; }
        public getChildrenJoints() : RKinJoint[] { return this.m_childrenJoints; }
        public getParentJoint() : RKinJoint { return this.m_parentJoint; }

        public addJointConnection( joint : RKinJoint ) : void
        {
            this.m_childrenJoints.push( joint );
        }
        public setParentJointConnection( parentJoint : RKinJoint ) : void
        {
            this.m_parentJoint = parentJoint;
        }

        public updateNode() : void
        {
            // Called recursively to update the nodes in the tree
            // Compute total tranform
            if ( this.m_parentJoint != null )
            {
                let _parentTransform = this.m_parentJoint.getParentNode().getLinkTransform();
                let _jointTransform = this.m_parentJoint.getJointTransform();

                core.mulMatMat44InPlace( this.m_linkTransform,
                                         _parentTransform,
                                         _jointTransform );
            }
            else
            {
                core.LMat4.setToIdentity( this.m_linkTransform );
            }

            core.mulMatMat44InPlace( this.m_worldTransform,
                                     this.m_linkTransform,
                                     this.m_localTransform );

            // Update children recursively
            for ( let q = 0; q < this.m_childrenJoints.length; q++ )
            {
                let _child = this.m_childrenJoints[q].getChildNode();
                _child.updateNode();
            }
        }
    }

    export class RKinJoint
    {
        private m_id : string;
        private m_parent : RKinNode;
        private m_parentId : string;
        private m_child : RKinNode;
        private m_childId : string;

        private m_xyz : core.LVec3;
        private m_rpy : core.LVec3;
        private m_axis : core.LVec3;
        private m_jointValue : number;
        private m_jointType : string;

        private m_jointBaseTransform : core.LMat4;
        private m_jointVariableTransform : core.LMat4;
        private m_jointTransform : core.LMat4;

        constructor( jointId : string )
        {
            this.m_id = jointId;
            this.m_parent = null;
            this.m_parentId = '';
            this.m_child = null;
            this.m_childId = '';

            this.m_xyz = new core.LVec3( 0, 0, 0 );
            this.m_rpy = new core.LVec3( 0, 0, 0 );
            this.m_axis = new core.LVec3( 0, 0, 0 );
            this.m_jointValue = 0;
            this.m_jointType = RKinJointTypeFixed;

            this.m_jointBaseTransform = new core.LMat4();
            this.m_jointVariableTransform = new core.LMat4();
            this.m_jointTransform = new core.LMat4();
        }

        public release() : void
        {
            this.m_parent = null;
            this.m_child = null;

            this.m_xyz = null;
            this.m_rpy = null;
            this.m_axis = null;

            this.m_jointBaseTransform = null;
            this.m_jointVariableTransform = null;
            this.m_jointTransform = null;
        }

        public initJoint( jxyz : core.LVec3, 
                          jrpy : core.LVec3,
                          axis : core.LVec3,
                          type : string,
                          parentId : string, 
                          childId : string ) : void
        {
            this.m_xyz = jxyz;
            this.m_rpy = jrpy;
            this.m_axis = axis;
            this.m_jointType = type;

            this.m_parentId = parentId;
            this.m_childId = childId;

            core.LMat4.fromPosEulerInPlace( this.m_jointBaseTransform,
                                            this.m_xyz, this.m_rpy );
        }

        public getParentId() : string { return this.m_parentId; }
        public getChildId() : string { return this.m_childId; }
        public getId () : string { return this.m_id; }
        public getParentNode() : RKinNode { return this.m_parent; }
        public getChildNode() : RKinNode { return this.m_child; }
        public getJointTransform() : core.LMat4 { return this.m_jointTransform; }
        public getJointType() : string { return this.m_jointType; }
        public getJointAxis() : core.LVec3 { return this.m_axis; }
        public getJointXYZ() : core.LVec3 { return this.m_xyz; }
        public getJointRPY() : core.LVec3 { return this.m_rpy; }

        public connect( parentNode : RKinNode,
                        childNode : RKinNode )
        {
            this.m_parent = parentNode;
            this.m_child = childNode;
        }

        public setJointValue( jointValue : number ) : void
        {
            this.m_jointValue = jointValue;
        }
        public getJointValue() : number
        {
            return this.m_jointValue;
        }

        public updateJoint() : void
        {
            // Update the joint variable transform ( 'transform around axis' )
            if ( this.m_jointType == RKinJointTypeRevolute )
            {
                core.LMat4.rotationAroundAxisInPlace( this.m_jointVariableTransform,
                                                      this.m_axis, this.m_jointValue );
            }
            else if ( this.m_jointType == RKinJointTYpePrismatic )
            {
                core.LMat4.translationAlongAxisInPlace( this.m_jointVariableTransform,
                                                        this.m_axis, this.m_jointValue );
            }

            // Update the 'total' joint transform
            core.mulMatMat44InPlace( this.m_jointTransform,
                                     this.m_jointBaseTransform,
                                     this.m_jointVariableTransform );
        }


    }

    export class RKinTree
    {
        private m_kinNodes : { [id:string] : RKinNode };
        private m_kinJoints : { [id:string] : RKinJoint };
        private m_rootNode : RKinNode;

        constructor()
        {
            this.m_rootNode = null;
            this.m_kinNodes = {};
            this.m_kinJoints = {};
        }

        public release() : void
        {
            if ( this.m_kinNodes )
            {
                for ( let key in this.m_kinNodes )
                {
                    this.m_kinNodes[key].release();
                    this.m_kinNodes[key] = null;
                }
                this.m_kinNodes = null;
            }

            if ( this.m_kinJoints )
            {
                for ( let key in this.m_kinJoints )
                {
                    this.m_kinJoints[key].release();
                    this.m_kinJoints[key] = null;
                }
                this.m_kinJoints = null;
            }

            this.m_rootNode = null;
        }

        public setRootNode( node : RKinNode ) 
        { 
            if ( this.m_rootNode )
            {
                console.warn( 'RKinTree> changing the root node ' +
                              'from an already set one' );
            }
            this.m_rootNode = node; 
        }
        public addKinNode( node : RKinNode ) 
        { 
            if ( this.m_kinNodes[ node.getId() ] )
            {
                console.warn( 'RKinTree> a node with id: ' +
                              node.getId() + ' already exists ' +
                              'in the tree. Skipping new one' );
                return;
            }
            this.m_kinNodes[ node.getId() ] = node; 
        }
        public addKinJoint( joint : RKinJoint ) 
        { 
            if ( this.m_kinJoints[ joint.getId() ] )
            {
                console.warn( 'RKinTree> a joint with id: ' +
                              joint.getId() + ' already exists ' +
                              'in the tree. Skipping new one' );
                return;
            }
            this.m_kinJoints[ joint.getId() ] = joint; 
        }

        public nodes() : { [id:string] : RKinNode } { return this.m_kinNodes; }
        public joints() : { [id:string] : RKinJoint } { return this.m_kinJoints; }

        public update() : void
        {
            // Update all the nodes so that ...
            // they update their transforms
            for ( let _jointId in this.m_kinJoints )
            {
                this.m_kinJoints[ _jointId ].updateJoint();
            }

            // Traverse the tree accordingly
            if ( this.m_rootNode )
            {
                this.m_rootNode.updateNode();
            }
        }
    }

}