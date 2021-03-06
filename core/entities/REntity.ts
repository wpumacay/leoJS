
/// <reference path="../RCommon.ts" />
/// <reference path="../components/RComponent.ts" />


namespace leojs
{


    export class REntity
    {

        public position : core.LVec3;
        public rotation : core.LVec3;// Euler angles

        public deletionRequested : boolean;

        protected m_components : { [id:number] : RComponent };

        constructor()
        {
            this.position = new core.LVec3( 0, 0, 0 );
            this.rotation = new core.LVec3( 0, 0, 0 );

            this.deletionRequested = false;
            
            this.m_components = {};
        }

        public release()
        {
            if ( this.m_components )
            {
                for ( let key in this.m_components )
                {
                    this.m_components[key].release();
                    this.m_components[key] = null;
                }
                this.m_components = null;
            }
        }

        public addComponent( component : RComponent ) : void
        {
            if ( this.m_components[ component.typeId() ] )
            {
                console.warn( 'REntity> this entity already ' +
                              'has a component of type: ' + 
                              component.typeId() );
                return;
            }

            this.m_components[ component.typeId() ] = component;
        }
        public getComponent( componentType : number ) : RComponent
        {
            if ( !this.m_components[ componentType ] )
            {
                return null;
            }

            return this.m_components[ componentType ];
        }

        public update( dt : number ) : void
        {
            if ( !this.m_components )
            {
                return;
            }

            for ( let _key in this.m_components )
            {
                this.m_components[ _key ].update( dt );
            }
        }

        public setVisibility( visible : boolean ) : void
        {
            if ( !this.m_components )
            {
                return;
            }

            if ( this.m_components[ RComponentType.GRAPHICS ] )
            {
                let _graphics = <RGraphicsComponent> this.m_components[ RComponentType.GRAPHICS ];
                _graphics.setVisibility( visible );
            }
        }
    }





}