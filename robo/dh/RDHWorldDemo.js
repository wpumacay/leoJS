/// <reference path="RDHWorld.ts" />
/// <reference path="models/RDHmodelScara.ts" />
/// <reference path="models/RDHmodelKukaKR210.ts" />
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var leojs;
(function (leojs) {
    var RobotId;
    (function (RobotId) {
        RobotId[RobotId["SCARA"] = 0] = "SCARA";
        RobotId[RobotId["KUKA_KR210"] = 1] = "KUKA_KR210";
    })(RobotId = leojs.RobotId || (leojs.RobotId = {}));
    var RDHWorldDemo = /** @class */ (function (_super) {
        __extends(RDHWorldDemo, _super);
        function RDHWorldDemo(appWidth, appHeight, robotId) {
            var _this = _super.call(this, appWidth, appHeight) || this;
            _this.m_robotId = robotId;
            _this.m_worldId = 'DEMO';
            return _this;
        }
        RDHWorldDemo.prototype.init = function () {
            this._initializeModel();
            this._initializeUI();
            this._initializeEnvironment();
        };
        RDHWorldDemo.prototype._initializeModel = function () {
            if (this.m_robotId == RobotId.SCARA) {
                this.m_dhModel = new leojs.RDHmodelScara(this);
                this.m_dhModel.init();
                this.m_urdfModel = null; // TODO: Find a sexy scara urdf :3
            }
            else if (this.m_robotId == RobotId.KUKA_KR210) {
                this.m_dhModel = new leojs.RDHmodelKukaKR210(this);
                this.m_dhModel.init();
                var _urdfData = core.LAssetsManager.INSTANCE.getTextAsset('kr210_urdf');
                this.m_urdfModel = new leojs.RManipulator(_urdfData);
                this.addEntity(this.m_urdfModel);
            }
        };
        RDHWorldDemo.prototype._initializeUI = function () {
            if (this.m_dhModel) {
                this.m_uiController = new leojs.RDHguiController(this.m_dhModel);
            }
        };
        RDHWorldDemo.prototype._initializeEnvironment = function () {
            // TODO: Floor with texture looks kind of weird. I mean, the manipulator does ...
            // not stand out in the whole scene, because I haven't ported shadowmapping yet :(.
            // For now, just make it look like RViz, and make a plain grid made of lines
            // let _planeMesh = buildPrimitive( { 'shape' : 'plane',
            //                                    'width' : 40,
            //                                    'depth' : 40,
            //                                    'texRangeWidth' : 10,
            //                                    'texRangeDepth' : 10 },
            //                                  { 'material' : 'textured',
            //                                    'textureId' : 'img_default',
            //                                    'specular' : core.DEFAULT_SPECULAR,
            //                                    'shininess' : core.DEFAULT_SHININESS } );
            // let _planeEntity = new REntity();
            // let _planeGraphics = new RMesh3dComponent( _planeEntity, _planeMesh );
            // _planeEntity.addComponent( _planeGraphics );
            // _planeEntity.rotation.x = 0.5 * Math.PI;
            // this.addEntity( _planeEntity );
            // Make bin model ******************************************************************
            var _binModelInfo = core.LAssetsManager.INSTANCE.getModel('kinematics_bin');
            var _geometryBin = new engine3d.LGeometry3d(_binModelInfo.geometryInfo.vertices, _binModelInfo.geometryInfo.normals, _binModelInfo.geometryInfo.texCoords, _binModelInfo.geometryInfo.indices);
            var _materialBin = new engine3d.LPhongMaterial(core.DEFAULT_AMBIENT.clone(), core.DEFAULT_DIFFUSE.clone(), core.DEFAULT_SPECULAR.clone(), core.DEFAULT_SHININESS);
            var _binMesh = new engine3d.LModel(_geometryBin, _materialBin, _binModelInfo.correctionMat);
            var _binEntity = new leojs.REntity();
            var _binGraphics = new leojs.RMesh3dComponent(_binEntity, _binMesh);
            _binEntity.addComponent(_binGraphics);
            _binEntity.position.x = 0.0;
            _binEntity.position.y = 2.5;
            _binEntity.position.z = 0.2048;
            this.addEntity(_binEntity);
            // *********************************************************************************
            // Make shelf model ****************************************************************
            var _shelfModelInfo = core.LAssetsManager.INSTANCE.getModel('kinematics_shelf');
            var _geometryShelf = new engine3d.LGeometry3d(_shelfModelInfo.geometryInfo.vertices, _shelfModelInfo.geometryInfo.normals, _shelfModelInfo.geometryInfo.texCoords, _shelfModelInfo.geometryInfo.indices);
            var _materialShelf = new engine3d.LPhongMaterial(core.DEFAULT_AMBIENT.clone(), core.DEFAULT_DIFFUSE.clone(), core.DEFAULT_SPECULAR.clone(), core.DEFAULT_SHININESS);
            var _shelfMesh = new engine3d.LModel(_geometryShelf, _materialShelf, _shelfModelInfo.correctionMat);
            var _shelfEntity = new leojs.REntity();
            var _shelfGraphics = new leojs.RMesh3dComponent(_shelfEntity, _shelfMesh);
            _shelfEntity.addComponent(_shelfGraphics);
            _shelfEntity.position.x = 2.7;
            _shelfEntity.position.y = 0.0;
            _shelfEntity.position.z = 1.036;
            _shelfEntity.rotation.x = 0.0;
            _shelfEntity.rotation.y = 0.0;
            _shelfEntity.rotation.z = 1.57;
            this.addEntity(_shelfEntity);
            // *********************************************************************************
        };
        return RDHWorldDemo;
    }(leojs.RDHWorld));
    leojs.RDHWorldDemo = RDHWorldDemo;
})(leojs || (leojs = {}));
