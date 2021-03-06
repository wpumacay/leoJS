
/// <reference path="REntity.ts" />
/// <reference path="../components/graphics/RReferenceFrameComponent.ts" />


namespace leojs
{


    export class RTestEntity extends REntity
    {

        private m_testRFrame : RReferenceFrameComponent;

        constructor()
        {
            super();

            this.addComponent( new RReferenceFrameComponent( this ) );
        }

        public update( dt : number ) : void
        {
            super.update( dt );

            // Do some testing here :D
            this.rotation.x += dt * 0.001;
            this.rotation.y += dt * 0.001;
            this.rotation.z += dt * 0.001;
        }


    }



}