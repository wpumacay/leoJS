
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

        public addJointConnection() : void
        {
            // Called after the joints of the tree have been created
        }

        public updateNode() : void
        {
            // Called recursively to update the nodes in the tree
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
        private m_jointValue : core.LVec3;
        private m_jointType : string;
        private m_jointTransform : core.LMat4;

        constructor( jointId : string )
        {
            this.m_id = jointId;
            this.m_jointTransform = new core.LMat4();
            this.m_parent = null;
            this.m_parentId = '';
            this.m_child = null;
            this.m_childId = '';
        }

        public initJoint( jxyz : core.LVec3, 
                          jrpy : core.LVec3,
                          axis : core.LVec3,
                          parentId : string, 
                          childId : string ) : void
        {
            this.m_xyz = jxyz;
            this.m_rpy = jrpy;
            this.m_axis = axis;

            this.m_parentId = parentId;
            this.m_childId = childId;
        }

        public getParentId() : string { return this.m_parentId; }
        public getChildId() : string { return this.m_childId; }

        public connect( parentNode : RKinNode,
                        childNode : RKinNode )
        {
            this.m_parent = parentNode;
            this.m_child = childNode;
        }

        public setJointValue( jointValue : number ) : void
        {

        }
    }

    export class RKinTree
    {
        private m_kinNodes : RKinNode[];
        private m_kinJoints : RKinJoint[];
        private m_rootNode : RKinNode;

        constructor()
        {
            this.m_rootNode = null;
            this.m_kinNodes = [];
            this.m_kinJoints = [];
        }

        public setRootNode( node : RKinNode ) { this.m_rootNode = node; }
        public addKinNode( node : RKinNode ) { this.m_kinNodes.push( node ); }

        public update() : void
        {
            if ( this.m_rootNode )
            {
                this.m_rootNode.updateNode();
            }
        }
    }

}