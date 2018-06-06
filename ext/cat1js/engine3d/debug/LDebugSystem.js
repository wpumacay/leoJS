/// <reference path="../../core/math/LMath.ts" />
/// <reference path="LDebugDrawer.ts" />
var engine3d;
(function (engine3d) {
    var DebugSystem;
    (function (DebugSystem) {
        function init() {
            engine3d.LDebugDrawer.create();
        }
        DebugSystem.init = init;
        ;
        function drawLine(start, end, color) {
            engine3d.LDebugDrawer.INSTANCE.drawLine(start, end, color);
        }
        DebugSystem.drawLine = drawLine;
        function drawArrow(start, end, color) {
            engine3d.LDebugDrawer.INSTANCE.drawArrow(start, end, color);
        }
        DebugSystem.drawArrow = drawArrow;
        function drawFrame(frameMat, axisSize) {
            engine3d.LDebugDrawer.INSTANCE.drawFrame(frameMat, axisSize);
        }
        DebugSystem.drawFrame = drawFrame;
        function begin(viewMatrix, projMatrix) {
            engine3d.LDebugDrawer.INSTANCE.setupMatrices(viewMatrix, projMatrix);
        }
        DebugSystem.begin = begin;
        function render() {
            engine3d.LDebugDrawer.INSTANCE.render();
        }
        DebugSystem.render = render;
        function release() {
            engine3d.LDebugDrawer.release();
        }
        DebugSystem.release = release;
    })(DebugSystem = engine3d.DebugSystem || (engine3d.DebugSystem = {}));
})(engine3d || (engine3d = {}));
