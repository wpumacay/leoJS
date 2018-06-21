

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

function onButtonClean()
{
    console.log( 'Cleaning scene' );

    if ( rApp )
    {
        rApp.world().reset();
    }
}

function onListDHchanged()
{
    var _listDHsamples = document.getElementById( 'listDHsamples' );
    var _dhSample = _listDHsamples.value;

    console.log( 'Selected> ' + _dhSample );

    if ( !MonacoEditor )
    {
        return;
    }

    if ( _dhSample == 'DH_SCARA' )
    {
        MonacoEditor.setValue( SNIPPETS['sp_sample_scara']['code'] );
    }
    else if ( _dhSample == 'DH_KUKA_KR210' )
    {
        MonacoEditor.setValue( SNIPPETS['sp_sample_kuka_kr210']['code'] );
    }
}