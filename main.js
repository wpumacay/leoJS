/// <reference path="ext/cat1js/Globals.ts" />
/// <reference path="robo/dh/RDHApp.ts" />
// Define globals
canvas = document.getElementById('glCanvas');
gl = canvas.getContext('webgl');
var rApp = new leojs.RDHApp(canvas, gl, leojs.RDHApplicationMode.DEMO);
rApp.initializeApp();
