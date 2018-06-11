

var MonacoEditor = null;

var EDITOR_CONTAINER_ID = 'editorDiv';
var EDITOR_DEFAULT_SNIPPET = [ 'function hello() {',
                               '\tconsole.log( "Hello World" );',
                               '}' ].join( '\n' );
var EDITOR_LANGUAGE = 'javascript';
var EDITOR_THEME = 'vs-dark';

var EDITOR_DEFAULT_SETTINGS = { value : EDITOR_DEFAULT_SNIPPET,
                                language : EDITOR_LANGUAGE,
                                theme: EDITOR_THEME };


var SNIPPETS = 
{
    'sp_sample_scara' : { 'path' : 'snippetSampleScara.js',
                          'code' : null,
                          'loaded' : false },

    'sp_sample_kuka_kr210' : { 'path' : 'snippetSampleKukaKR210.js',
                               'code' : null,
                               'loaded' : false }
}

function areSnippetsLoaded()
{
    for ( var key in SNIPPETS )
    {
        if ( !SNIPPETS[key]['loaded'] )
        {
            return false;
        }
    }

    return true;
}

function onEditorModulesLoaded()
{

    // Load the definitions from the engine to expose them to the editor
    var _xhr = new XMLHttpRequest();
    _xhr.open( 'GET', 'leojs.d.ts' );

    _xhr.onreadystatechange = function()
    {
        if ( this.readyState == 4 && this.status == 200 )
        {
            monaco.languages.typescript.javascriptDefaults.addExtraLib( this.responseText, 
                                                                        'leojs.d.ts' );

            MonacoEditor = monaco.editor.create( document.getElementById( EDITOR_CONTAINER_ID ),
                                                 EDITOR_DEFAULT_SETTINGS );
        }
    };

    _xhr.send( null );
}

function loadEditorModules()
{
    require.config( { paths: { 'vs': 'extjs/monaco-editor/min/vs' } } );

    require( ['vs/editor/editor.main'], onEditorModulesLoaded );
}

function loadSnippets()
{
    for ( var key in SNIPPETS )
    {
        var _xhr = new XMLHttpRequest();
        _xhr.open( 'GET', 'snippets/' + SNIPPETS[key]['path'] );
        _xhr['snippetInfo'] = SNIPPETS[key];

        _xhr.onreadystatechange = function()
        {
            if ( this.readyState == 4 && this.status == 200 )
            {
                this['snippetInfo']['code'] = this.responseText;
                this['snippetInfo']['loaded'] = true;

                if ( areSnippetsLoaded() )
                {
                    if ( SNIPPETS['sp_sample_scara']['code'] )
                    {
                        // Set default snippet
                        EDITOR_DEFAULT_SETTINGS['value'] = 
                                        SNIPPETS['sp_sample_scara']['code'];
                    }

                    // Load editor resources
                    loadEditorModules();
                }
            }
        }

        _xhr.send( null );
    }
}


function init()
{
    loadSnippets();
}

init();