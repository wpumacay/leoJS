var core;
(function (core) {
    var LIRenderable = /** @class */ (function () {
        function LIRenderable() {
            this.m_type = 'base';
            this.m_isVisible = true;
        }
        LIRenderable.prototype.update = function () { };
        LIRenderable.prototype.render = function () { };
        LIRenderable.prototype.type = function () { return this.m_type; };
        LIRenderable.prototype.isVisible = function () { return this.m_isVisible; };
        LIRenderable.prototype.setVisibility = function (visibility) { this.m_isVisible = visibility; };
        return LIRenderable;
    }());
    core.LIRenderable = LIRenderable;
})(core || (core = {}));
