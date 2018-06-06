/// <reference path="math/LMath.ts" />
var core;
(function (core) {
    core.KEY_W = 87;
    core.KEY_A = 65;
    core.KEY_S = 83;
    core.KEY_D = 68;
    core.KEY_UP = 38;
    core.KEY_DOWN = 40;
    core.KEY_LEFT = 37;
    core.KEY_RIGHT = 39;
    core.KEY_SPACE = 32;
    core.KEY_ESCAPE = 27;
    core.KEY_ENTER = 13;
    core.MAX_KEYS = 1024;
    core.MOUSE_LEFT = 0;
    core.MOUSE_WHEEL = 1;
    core.MOUSE_RIGHT = 2;
    core.MOUSE_UP = 0;
    core.MOUSE_DOWN = 1;
    core.WHEEL_ACUM_RATIO = 0.01;
    var LInputHandler = /** @class */ (function () {
        function LInputHandler(canvas) {
            this.m_canvas = canvas;
            this.m_cursor = new core.LVec2(0, 0);
            this.m_mouseStates = { 0: core.MOUSE_UP,
                1: core.MOUSE_UP,
                2: core.MOUSE_UP };
            this.m_isMouseDown = false;
            this.m_keys = [];
            var q;
            for (q = 0; q < core.MAX_KEYS; q++) {
                this.m_keys[q] = 0;
            }
            this.m_wheelDelta = new core.LVec3(0, 0, 0);
            this.m_wheelAcumValue = 0;
            this.m_mouseDownCallback = null;
            this.m_mouseUpCallback = null;
            this.m_mouseMoveCallback = null;
            this._registerEvents();
        }
        LInputHandler.prototype._registerEvents = function () {
            this.m_canvas.onmousedown = LInputHandler.onMouseDown;
            this.m_canvas.onmousemove = LInputHandler.onMouseMove;
            this.m_canvas.onmouseup = LInputHandler.onMouseUp;
            document.addEventListener('keydown', LInputHandler.onKeyDown);
            document.addEventListener('keyup', LInputHandler.onKeyUp);
            document.addEventListener('wheel', LInputHandler.onWheelEvent);
        };
        LInputHandler.prototype._isKeyPressed = function (keyId) {
            if (keyId < 0 || keyId >= core.MAX_KEYS) {
                console.warn('LInputHandler> requesting key ' +
                    keyId + ' which is out of range');
                return false;
            }
            return (this.m_keys[keyId] == 1);
        };
        LInputHandler.init = function (canvas) {
            LInputHandler.INSTANCE = new LInputHandler(canvas);
        };
        LInputHandler.wheelAcumValue = function () { return LInputHandler.INSTANCE.m_wheelAcumValue; };
        LInputHandler.cursorXY = function () { return LInputHandler.INSTANCE.m_cursor.clone(); };
        LInputHandler.isKeyPressed = function (keyId) { return LInputHandler.INSTANCE._isKeyPressed(keyId); };
        LInputHandler.isMouseDown = function () { return LInputHandler.INSTANCE.m_isMouseDown; };
        LInputHandler.isMouseButtonDown = function (buttonId) {
            if (0 > buttonId || buttonId > core.MOUSE_RIGHT) {
                console.warn('LInputHandler> button requested: ' + buttonId + ' does not exist');
                return false;
            }
            return LInputHandler.INSTANCE.m_mouseStates[buttonId] == core.MOUSE_DOWN;
        };
        LInputHandler.isMouseButtonUp = function (buttonId) {
            if (0 > buttonId || buttonId > core.MOUSE_RIGHT) {
                console.warn('LInputHandler> button requested: ' + buttonId + ' does not exist');
                return false;
            }
            return LInputHandler.INSTANCE.m_mouseStates[buttonId] == core.MOUSE_UP;
        };
        /**
        * Event callbacks
        */
        LInputHandler.onKeyDown = function (ev) {
            // console.info( 'key: ' + ev.key );
            // console.info( 'keyCode: ' + ev.keyCode );
            var _self = LInputHandler.INSTANCE;
            var _key = ev.keyCode;
            _self.m_keys[_key] = 1;
        };
        LInputHandler.onKeyUp = function (ev) {
            // console.info( 'key: ' + ev.key );
            // console.info( 'keyCode: ' + ev.keyCode );
            var _self = LInputHandler.INSTANCE;
            var _key = ev.keyCode;
            _self.m_keys[_key] = 0;
        };
        LInputHandler.onWheelEvent = function (ev) {
            var _self = LInputHandler.INSTANCE;
            _self.m_wheelDelta.x = ev.deltaX;
            _self.m_wheelDelta.y = ev.deltaY;
            _self.m_wheelDelta.z = ev.deltaZ;
            // check which direction is the one that has actual value
            _self.m_wheelAcumValue -= (_self.m_wheelDelta.x +
                _self.m_wheelDelta.y +
                _self.m_wheelDelta.z) * core.WHEEL_ACUM_RATIO;
        };
        LInputHandler.onMouseDown = function (ev) {
            // console.info( 'MouseDown> ev.x: ' + ev.x + " - ev.y: " + ev.y );
            var _self = LInputHandler.INSTANCE;
            _self.m_isMouseDown = true;
            _self.m_cursor.x = ev.x;
            _self.m_cursor.y = ev.y;
            _self.m_mouseStates[ev.button] = core.MOUSE_DOWN;
        };
        LInputHandler.onMouseUp = function (ev) {
            // console.info( 'MouseUp> ev.x: ' + ev.x + " - ev.y: " + ev.y );
            var _self = LInputHandler.INSTANCE;
            _self.m_isMouseDown = false;
            _self.m_cursor.x = ev.x;
            _self.m_cursor.y = ev.y;
            _self.m_mouseStates[ev.button] = core.MOUSE_UP;
        };
        LInputHandler.onMouseMove = function (ev) {
            // console.info( 'MouseMove> ev.x: ' + ev.x + " - ev.y: " + ev.y );
            var _self = LInputHandler.INSTANCE;
            _self.m_cursor.x = ev.x;
            _self.m_cursor.y = ev.y;
        };
        LInputHandler.INSTANCE = null;
        return LInputHandler;
    }());
    core.LInputHandler = LInputHandler;
})(core || (core = {}));
