
/// <reference path="../../core/entities/REntity.ts" />
/// <reference path="../../core/components/RComponent.ts" />

/// <reference path="components/RDHtreeModelComponent.ts" />

namespace leojs
{



    export class RManipulator extends REntity
    {
        private m_treeModelRef : RDHtreeModelComponent;

        constructor( urdfStr : string )
        {
            super();

            this.m_treeModelRef = null;

            this._init();
        }

        private _init() : void
        {
            // Parse model from urdf
        }

    }



}