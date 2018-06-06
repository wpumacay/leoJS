/// <reference path="../RCommon.ts" />
/// <reference path="../components/RComponent.ts" />
var leojs;
(function (leojs) {
    var REntity = /** @class */ (function () {
        function REntity() {
            this.position = new core.LVec3(0, 0, 0);
            this.rotation = new core.LVec3(0, 0, 0);
            this.m_components = {};
        }
        REntity.prototype.addComponent = function (component) {
            if (this.m_components[component.typeId()]) {
                console.warn('REntity> this entity already ' +
                    'has a component of type: ' +
                    component.typeId());
                return;
            }
            this.m_components[component.typeId()] = component;
        };
        REntity.prototype.getComponent = function (componentType) {
            if (!this.m_components[componentType]) {
                return null;
            }
            return this.m_components[componentType];
        };
        REntity.prototype.update = function (dt) {
            for (var _key in this.m_components) {
                this.m_components[_key].update(dt);
            }
        };
        REntity.prototype.setVisibility = function (visible) {
            if (this.m_components[leojs.RComponentType.GRAPHICS]) {
                var _graphics = this.m_components[leojs.RComponentType.GRAPHICS];
                _graphics.setVisibility(visible);
            }
        };
        return REntity;
    }());
    leojs.REntity = REntity;
})(leojs || (leojs = {}));
