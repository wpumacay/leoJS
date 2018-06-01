
/// <reference path="../../../ext/cat1js/engine3d/graphics/LModel.ts" />
/// <reference path="../../../core/components/graphics/RGraphicsComponent.ts" />
/// <reference path="../../../core/components/graphics/RGraphicsFactory.ts" />
/// <reference path="../RKinTree.ts" />



namespace leojs
{


    export class RDHtreeModelComponent extends RGraphicsComponent
    {

        private m_kinTree : RKinTree;

        constructor( parent : REntity,
                     kinTree : RKinTree )
        {
            super( parent );

            this.m_kinTree = kinTree;

            this._init();
        }

        private _init() : void
        {
            this._initializeLinks();
        }

        private _initializeLinks()
        {
            
        }



    }


}