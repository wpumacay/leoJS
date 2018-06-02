
/// <reference path="../../core/entities/REntity.ts" />
/// <reference path="../../core/components/RComponent.ts" />

/// <reference path="components/RDHtreeModelComponent.ts" />
/// <reference path="RKinTree.ts" />
/// <reference path="RUrdfModelParser.ts" />

namespace leojs
{



    export class RManipulator extends REntity
    {
        private m_kinTree : RKinTree;
        private m_treeModelRef : RDHtreeModelComponent;

        constructor( urdfStr : string )
        {
            super();

            this.m_kinTree = null;
            this.m_treeModelRef = null;

            this._initKinTree( urdfStr );
            this._initTreeModel();
        }

        private _initKinTree( urdfStr : string ) : void
        {
            // Build kintree from urdf
            let _parser = new RUrdfModelParser();
            this.m_kinTree = _parser.parse( urdfStr );
        }
        private _initTreeModel() : void
        {
            if ( this.m_kinTree )
            {
                this.m_treeModelRef = new RDHtreeModelComponent( this, 
                                                                 this.m_kinTree );
            }
            else
            {
                console.warn( 'RManipulator> there is no kintree to create manipulator, ' +
                              ' maybe could not parse the urdf file correctly' );
            }
        }

        public update( dt : number ) : void
        {
            if ( this.m_kinTree )
            {
                this.m_kinTree.update();
            }

            super.update( dt );
        }
    }



}