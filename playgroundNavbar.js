

function onButtonRun()
{
    console.log( 'Run!!!!' );

    if ( MonacoEditor )
    {
        var _currentCode = MonacoEditor.getValue();
        try
        {
            eval( _currentCode );
        }
        catch( e )
        {
            console.info( 'CompilationError> ' + e );
        }
    }
}