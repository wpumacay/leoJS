

var MonacoEditor = null;

// // Structure of the playground exposed functionality
// function dhModel()
// {
//     // Create dh table here

// }

// function inverseKinematics()
// {
//     // Create inverse kinematics here
// }

var EDITOR_CONTAINER_ID = 'containerEditor';
var EDITOR_DEFAULT_SNIPPET = [ 'function hello() {',
                               '\tconsole.log( "Hello World" );',
                               '}' ].join( '\n' );
var EDITOR_LANGUAGE = 'javascript';
var EDITOR_THEME = 'vs-dark';

var EDITOR_DEFAULT_SETTINGS = { value : EDITOR_DEFAULT_SNIPPET,
                                language : EDITOR_LANGUAGE,
                                theme: EDITOR_THEME };


function onModulesLoaded()
{

    // Load the definitions from the engine to expose them to the editor
    var _xhr = new XMLHttpRequest();
    _xhr.open( 'GET', 'leojs.d.ts' );

    _xhr.onreadystatechange = function()
    {
        if ( _xhr.readyState == 4 && _xhr.status == 200 )
        {
            monaco.languages.typescript.javascriptDefaults.addExtraLib( _xhr.responseText, 
                                                                        'leojs.d.ts' );

            MonacoEditor = monaco.editor.create( document.getElementById( EDITOR_CONTAINER_ID ),
                                                 EDITOR_DEFAULT_SETTINGS );
        }
    };

    _xhr.send( null );
}

require.config( { paths: { 'vs': 'extjs/monaco-editor/min/vs' } } );

require( ['vs/editor/editor.main'], onModulesLoaded );