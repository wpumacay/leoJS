

/// <reference path="RComponent.ts" />



namespace leojs
{


    export class RTestComponent extends RComponent
    {

        public static CLASS_ID : string = 'test';

        constructor( parent : REntity )
        {
            super( parent );

            this.m_typeId = RComponentType.NEUTRAL;
            this.m_classId = RTestComponent.CLASS_ID;
        }

        public update( dt : number ) : void
        {
            // Do some testing here :D
        }


    }



}