
/// <reference path="../RCommon.ts" />
/// <reference path="../entities/REntity.ts" />



namespace leojs
{

    /**
    * Simple types that the components can be part of
    */
    export enum RComponentType
    {
        NEUTRAL = 0,
        GRAPHICS = 1,
        PHYSICS = 2
    };

    export class RComponent
    {
        public static CLASS_ID : string = 'base';

        protected m_parent : REntity;
        protected m_classId : string;
        protected m_typeId : RComponentType;

        constructor( parent : REntity )
        {
            this.m_parent = parent;
            this.m_typeId = RComponentType.NEUTRAL;
            this.m_classId = RComponent.CLASS_ID;
        }

        public release() : void
        {
            this.m_parent = null;
        }

        public typeId() : RComponentType { return this.m_typeId; }
        public classId() : string { return this.m_classId; }

        public update( dt : number ) : void
        {
            // Override this
        }
    }



}