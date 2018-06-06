/// <reference path="../../core/worlds/RWorld.ts" />
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
/// <reference path="RDHmodel.ts" />
/// <reference path="models/RDHmodelScara.ts" />
/// <reference path="models/RDHmodelKukaKR210.ts" />
/// <reference path="ui/RDHguiController.ts" />
/// <reference path="RManipulator.ts" />
var leojs;
(function (leojs) {
    var RobotId;
    (function (RobotId) {
        RobotId[RobotId["SCARA"] = 0] = "SCARA";
        RobotId[RobotId["KUKA_KR210"] = 1] = "KUKA_KR210";
    })(RobotId = leojs.RobotId || (leojs.RobotId = {}));
    var RDHWorld = /** @class */ (function (_super) {
        __extends(RDHWorld, _super);
        function RDHWorld(appWidth, appHeight, robotId) {
            var _this = _super.call(this, appWidth, appHeight) || this;
            _this.m_dhModel = null;
            _this.m_dhTable = null;
            _this.m_dhGuiController = null;
            _this.m_robotId = robotId;
            _this.m_manipulatorRef = null;
            _this._initializeModel();
            _this._initializeUI();
            _this._initializeEnvironment();
            return _this;
        }
        RDHWorld.prototype._initializeModel = function () {
            if (this.m_robotId == RobotId.SCARA) {
                this.m_dhModel = new leojs.RDHmodelScara(this);
                this.m_manipulatorRef = null; // TODO: Find a sexy scara urdf :3
            }
            else if (this.m_robotId == RobotId.KUKA_KR210) {
                this.m_dhModel = new leojs.RDHmodelKukaKR210(this);
                var _urdfData = core.LAssetsManager.INSTANCE.getTextAsset('kr210_urdf');
                this.m_manipulatorRef = new leojs.RManipulator(_urdfData);
                this.addEntity(this.m_manipulatorRef);
            }
        };
        RDHWorld.prototype._initializeUI = function () {
            if (this.m_dhModel) {
                this.m_dhGuiController = new leojs.RDHguiController(this.m_dhModel);
            }
        };
        RDHWorld.prototype._initializeEnvironment = function () {
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
        RDHWorld.prototype._drawFloorGrid = function () {
            var _gridRangeX = 10;
            var _divX = 5;
            var _stepX = _gridRangeX / _divX;
            var _gridRangeY = 10;
            var _divY = 5;
            var _stepY = _gridRangeY / _divY;
            // Draw lines parallel to x axis
            for (var q = -_divY; q <= _divY; q++) {
                var _p1 = new core.LVec3(-_gridRangeX, q * _stepY, 0);
                var _p2 = new core.LVec3(_gridRangeX, q * _stepY, 0);
                engine3d.DebugSystem.drawLine(_p1, _p2, core.LIGHT_GRAY);
            }
            // Draw lines parallel to y axis
            for (var q = -_divX; q <= _divX; q++) {
                var _p1 = new core.LVec3(q * _stepY, -_gridRangeY, 0);
                var _p2 = new core.LVec3(q * _stepY, _gridRangeY, 0);
                engine3d.DebugSystem.drawLine(_p1, _p2, core.LIGHT_GRAY);
            }
        };
        RDHWorld.prototype.update = function (dt) {
            _super.prototype.update.call(this, dt);
            this._drawFloorGrid();
            if (this.m_dhModel) {
                this.m_dhModel.update(dt);
            }
            if (this.m_manipulatorRef) {
                var _kinJoints = this.m_manipulatorRef.getJoints();
                for (var _jointId in _kinJoints) {
                    if (this.m_dhModel.doesJointExist(_jointId)) {
                        var _jointValue = this.m_dhModel.getJointValueById(_jointId);
                        _kinJoints[_jointId].setJointValue(_jointValue);
                    }
                }
            }
            if (this.m_dhGuiController) {
                // Update visibility
                var _isDHmodelVisible = this.m_dhGuiController.isDHmodelVisible();
                var _isURDFmodelVisible = this.m_dhGuiController.isURDFmodelVisible();
                if (this.m_dhModel) {
                    this.m_dhModel.setModelVisibility(_isDHmodelVisible);
                }
                if (this.m_manipulatorRef) {
                    this.m_manipulatorRef.setVisibility(_isURDFmodelVisible);
                }
                this.m_dhGuiController.update(dt);
            }
        };
        return RDHWorld;
    }(leojs.RWorld));
    leojs.RDHWorld = RDHWorld;
})(leojs || (leojs = {}));
