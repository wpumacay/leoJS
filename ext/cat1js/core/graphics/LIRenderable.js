var core;
(function (core) {
    var LIRenderable = /** @class */ (function () {
        function LIRenderable() {
            this.m_type = 'base';
            this.m_isVisible = true;
            this.m_deletionRequested = false;
        }
        LIRenderable.prototype.release = function () {
            // Override this
        };
        LIRenderable.prototype.update = function () { };
        LIRenderable.prototype.render = function () { };
        LIRenderable.prototype.type = function () { return this.m_type; };
        LIRenderable.prototype.isVisible = function () { return this.m_isVisible; };
        LIRenderable.prototype.setVisibility = function (visibility) { this.m_isVisible = visibility; };
        LIRenderable.prototype.requestDeletion = function () { this.m_deletionRequested = true; };
        LIRenderable.prototype.isDeletionRequested = function () { return this.m_deletionRequested; };
        return LIRenderable;
    }());
    core.LIRenderable = LIRenderable;
})(core || (core = {}));
