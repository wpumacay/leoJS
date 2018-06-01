
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

            // TODO: Make geometry!!!

            return _rkinGeometry;
        }

    }

    export class RKinNode
    {
        private m_id : string;
        private m_joints : RKinJoint[];
        private m_worldTransform : core.LMat4;
        private m_localTransform : core.LMat4;
        private m_geometry : RKinNodeGeometry;

        constructor( nodeId : string )
        {
            this.m_id = nodeId;
            this.m_joints = [];
            this.m_localTransform = new core.LMat4();
            this.m_worldTransform = new core.LMat4();
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
        public getWorldTransform() : core.LMat4 { return this.m_worldTransform; }
        public getId () : string { return this.m_id; }
        public getJoints() : RKinJoint[] { return this.m_joints; }

        public addJointConnection( joint : RKinJoint ) : void
        {
            this.m_joints.push( joint );
        }

        public updateNode() : void
        {
            // Called recursively to update the nodes in the tree
            // TODO: Implement this part recursively
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
            this.m_jointTransform = new core.LMat4();
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
            // Update the joint ransform here
            // TODO: Implement this part
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