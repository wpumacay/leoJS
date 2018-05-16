
/// <reference path="RBoot.ts" />

namespace leojs
{

    export class REntryPoint
    {

        public static include( file : string ) : void
        {
            document.write( '<script type="text/javascript" languaje="javascript" src="' +        
                            file + '"></script>' );
        }

        private static begin() : void
        {
            let _files : string[] = leojs.EntryPointFiles;

            let _i : number;

            for ( _i = 0; _i < _files.length; _i++ )
            {
                REntryPoint.include( _files[_i] );
            }
        }

    }

}
