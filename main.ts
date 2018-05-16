

/// <reference path="ext/cat1js/Globals.ts" />
/// <reference path="core/RApp.ts" />


// Define globals
canvas = <HTMLCanvasElement> document.getElementById( 'glCanvas' );
gl = canvas.getContext( 'webgl' );

var rApp : leojs.RApp = new leojs.RApp( canvas, gl );
