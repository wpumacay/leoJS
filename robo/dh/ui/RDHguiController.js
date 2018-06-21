/// <reference path="../RDHcommon.ts" />
/// <reference path="../RDHmodel.ts" />
/// <reference path="../../../ext/dat.gui.d.ts" />
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
    var UItype;
    (function (UItype) {
        UItype[UItype["BASE"] = 0] = "BASE";
        UItype[UItype["FOLDER"] = 1] = "FOLDER";
        UItype[UItype["BUTTON"] = 2] = "BUTTON";
        UItype[UItype["TEXT"] = 3] = "TEXT";
        UItype[UItype["SLIDER"] = 4] = "SLIDER";
        UItype[UItype["CHECKBOX"] = 5] = "CHECKBOX";
    })(UItype = leojs.UItype || (leojs.UItype = {}));
    var RUIelement = /** @class */ (function () {
        function RUIelement(uiName) {
            this.m_type = UItype.BASE;
            this.m_name = uiName;
            this.m_controller = null;
        }
        RUIelement.prototype.release = function () {
            this.m_controller = null;
        };
        RUIelement.prototype.assignController = function (controller) { this.m_controller = controller; };
        RUIelement.prototype.controller = function () { return this.m_controller; };
        RUIelement.prototype.name = function () { return this.m_name; };
        RUIelement.prototype.type = function () { return this.m_type; };
        return RUIelement;
    }());
    leojs.RUIelement = RUIelement;
    var RUIbutton = /** @class */ (function (_super) {
        __extends(RUIbutton, _super);
        function RUIbutton(uiName, fcnCallback) {
            var _this = _super.call(this, uiName) || this;
            _this.m_type = UItype.BUTTON;
            _this.m_callback = fcnCallback;
            return _this;
        }
        RUIbutton.prototype.release = function () {
            this.m_callback = null;
            _super.prototype.release.call(this);
        };
        RUIbutton.prototype.callback = function () { return this.m_callback; };
        return RUIbutton;
    }(RUIelement));
    leojs.RUIbutton = RUIbutton;
    var RUItext = /** @class */ (function (_super) {
        __extends(RUItext, _super);
        function RUItext(uiName, uiText) {
            var _this = _super.call(this, uiName) || this;
            _this.m_type = UItype.TEXT;
            _this.m_text = uiText;
            return _this;
        }
        RUItext.prototype.text = function () { return this.m_text; };
        return RUItext;
    }(RUIelement));
    leojs.RUItext = RUItext;
    var RUIslider = /** @class */ (function (_super) {
        __extends(RUIslider, _super);
        function RUIslider(uiName, vMin, vMax, vCurrent, onChangeCallback) {
            var _this = _super.call(this, uiName) || this;
            _this.m_type = UItype.SLIDER;
            _this.m_min = vMin;
            _this.m_max = vMax;
            _this.m_current = vCurrent;
            _this.m_onChangeCallback = onChangeCallback;
            return _this;
        }
        RUIslider.prototype.release = function () {
            this.m_onChangeCallback = null;
            _super.prototype.release.call(this);
        };
        RUIslider.prototype.min = function () { return this.m_min; };
        RUIslider.prototype.max = function () { return this.m_max; };
        RUIslider.prototype.initValue = function () { return this.m_current; };
        RUIslider.prototype.onChangeCallback = function () { return this.m_onChangeCallback; };
        return RUIslider;
    }(RUIelement));
    leojs.RUIslider = RUIslider;
    var RUIcheckbox = /** @class */ (function (_super) {
        __extends(RUIcheckbox, _super);
        function RUIcheckbox(uiName, vState) {
            var _this = _super.call(this, uiName) || this;
            _this.m_type = UItype.CHECKBOX;
            _this.m_state = vState;
            return _this;
        }
        RUIcheckbox.prototype.initState = function () { return this.m_state; };
        return RUIcheckbox;
    }(RUIelement));
    leojs.RUIcheckbox = RUIcheckbox;
    var RUIfolder = /** @class */ (function (_super) {
        __extends(RUIfolder, _super);
        function RUIfolder(uiName) {
            var _this = _super.call(this, uiName) || this;
            _this.m_type = UItype.FOLDER;
            _this.m_children = [];
            return _this;
        }
        RUIfolder.prototype.release = function () {
            if (this.m_children) {
                for (var q = 0; q < this.m_children.length; q++) {
                    this.m_children[q] = null;
                }
                this.m_children = null;
            }
        };
        RUIfolder.prototype.addChild = function (child) {
            this.m_children.push(child);
        };
        RUIfolder.prototype.children = function () { return this.m_children; };
        return RUIfolder;
    }(RUIelement));
    leojs.RUIfolder = RUIfolder;
    var RUIwrapper = /** @class */ (function () {
        function RUIwrapper(dgui) {
            this.m_dgui = dgui;
            this.m_uiDef = {};
            this.m_uiElements = [];
            this.m_uiStorage = {};
        }
        RUIwrapper.prototype.release = function () {
            this.m_dgui = null;
            this.m_uiDef = null;
            if (this.m_uiElements) {
                for (var q = 0; q < this.m_uiElements.length; q++) {
                    this.m_uiElements[q].release();
                    this.m_uiElements[q] = null;
                }
                this.m_uiElements = null;
            }
            if (this.m_uiStorage) {
                for (var key in this.m_uiStorage) {
                    this.m_uiStorage[key] = null;
                }
                this.m_uiStorage = null;
            }
        };
        RUIwrapper.prototype.appendUIelement = function (uiElement) {
            this.m_uiElements.push(uiElement);
        };
        RUIwrapper.prototype.elements = function () { return this.m_uiElements; };
        RUIwrapper.prototype.buildUI = function () {
            for (var q = 0; q < this.m_uiElements.length; q++) {
                this._buildNode(this.m_uiElements[q], this.m_dgui);
            }
        };
        RUIwrapper.prototype._buildNode = function (element, dguiParent) {
            this.m_uiStorage[element.name()] = element;
            if (element.type() == UItype.FOLDER) {
                this._buildFolder(element, dguiParent);
            }
            else if (element.type() == UItype.BUTTON) {
                element.assignController(this._buildButton(element, dguiParent));
            }
            else if (element.type() == UItype.TEXT) {
                element.assignController(this._buildText(element, dguiParent));
            }
            else if (element.type() == UItype.SLIDER) {
                element.assignController(this._buildSlider(element, dguiParent));
            }
            else if (element.type() == UItype.CHECKBOX) {
                element.assignController(this._buildCheckbox(element, dguiParent));
            }
        };
        RUIwrapper.prototype._buildFolder = function (folderElement, dguiParent) {
            var _folderUI = dguiParent.addFolder(folderElement.name());
            var _children = folderElement.children();
            for (var q = 0; q < _children.length; q++) {
                this._buildNode(_children[q], _folderUI);
            }
        };
        RUIwrapper.prototype._buildButton = function (btnElement, dguiParent) {
            this.m_uiDef[btnElement.name()] = btnElement.callback();
            var _controller = dguiParent.add(this.m_uiDef, btnElement.name());
            return _controller;
        };
        RUIwrapper.prototype._buildText = function (txtElement, dguiParent) {
            this.m_uiDef[txtElement.name()] = txtElement.text();
            var _controller = dguiParent.add(this.m_uiDef, txtElement.name());
            return _controller;
        };
        RUIwrapper.prototype._buildSlider = function (sldElement, dguiParent) {
            this.m_uiDef[sldElement.name()] = sldElement.initValue();
            var _controller = dguiParent.add(this.m_uiDef, sldElement.name(), sldElement.min(), sldElement.max());
            _controller.setValue(sldElement.initValue());
            _controller.step(0.001);
            if (sldElement.onChangeCallback()) {
                _controller.onChange(sldElement.onChangeCallback());
            }
            return _controller;
        };
        RUIwrapper.prototype._buildCheckbox = function (chbxElement, dguiParent) {
            this.m_uiDef[chbxElement.name()] = chbxElement.initState();
            var _controller = dguiParent.add(this.m_uiDef, chbxElement.name());
            return _controller;
        };
        RUIwrapper.prototype.getElementByName = function (name) {
            var _element = this.m_uiStorage[name];
            if (_element) {
                return _element;
            }
            console.warn('RUIwrapper> element with id: ' +
                name + ' does not exist');
            return null;
        };
        return RUIwrapper;
    }());
    leojs.RUIwrapper = RUIwrapper;
    ;
    var RDHguiController = /** @class */ (function () {
        function RDHguiController(dhModel) {
            this.m_dgui = new dat.GUI();
            this.m_uiWrapper = new RUIwrapper(this.m_dgui);
            this.m_dhModel = dhModel;
            this.m_dhTable = dhModel.getDHtable();
            this.m_isDHmodelVisible = true;
            this.m_isURDFmodelVisible = true;
            this.m_ikEnabled = false;
            this._initializeMode();
            this._initializeUI();
            this._initializeControllers();
        }
        RDHguiController.prototype.release = function () {
            if (this.m_uiWrapper) {
                this.m_uiWrapper.release();
                this.m_uiWrapper = null;
            }
            if (this.m_dgui) {
                this.m_dgui.destroy();
                this.m_dgui = null;
            }
            this.m_dhModel = null;
            this.m_dhTable = null;
        };
        RDHguiController.prototype._initializeMode = function () {
            if (this.m_dhModel.getWorld().getWorldId() == 'DEMO') {
                this.m_ikEnabled = true;
            }
            else if (this.m_dhModel.getWorld().getWorldId() == 'PLAYGROUND') {
                this.m_ikEnabled = false;
            }
        };
        RDHguiController.prototype._initializeUI = function () {
            var _self = this;
            var _entries = this.m_dhTable.entries();
            // Forward kinematics ***********************************************
            var _fForwardKinematics = new RUIfolder('Forward Kinematics');
            for (var q = 0; q < _entries.length; q++) {
                _fForwardKinematics.addChild(new RUIslider('fk_q' + (q + 1), _entries[q].minJointValue(), _entries[q].maxJointValue(), 0, function () { _self.doForwardKinematics(); }));
            }
            _fForwardKinematics.addChild(new RUItext('fk_x', '' + this.m_dhModel.xyzZeroPosition().x));
            _fForwardKinematics.addChild(new RUItext('fk_y', '' + this.m_dhModel.xyzZeroPosition().y));
            _fForwardKinematics.addChild(new RUItext('fk_z', '' + this.m_dhModel.xyzZeroPosition().z));
            _fForwardKinematics.addChild(new RUItext('fk_roll', '' + this.m_dhModel.rpyZeroPosition().x));
            _fForwardKinematics.addChild(new RUItext('fk_pitch', '' + this.m_dhModel.rpyZeroPosition().y));
            _fForwardKinematics.addChild(new RUItext('fk_yaw', '' + this.m_dhModel.rpyZeroPosition().z));
            // _fForwardKinematics.addChild( new RUIbutton( 'compute FK', () => { _self.doForwardKinematics(); } ) );
            this.m_uiWrapper.appendUIelement(_fForwardKinematics);
            // ******************************************************************
            // Inverse kinematics ***********************************************
            if (this.m_ikEnabled) {
                var _fInverseKinematics = new RUIfolder('Inverse Kinematics');
                for (var q = 0; q < _entries.length; q++) {
                    _fInverseKinematics.addChild(new RUItext('ik_q' + (q + 1), '0'));
                }
                _fInverseKinematics.addChild(new RUIslider('ik_x', this.m_dhModel.xyzMinEstimate().x, this.m_dhModel.xyzMaxEstimate().x, this.m_dhModel.xyzZeroPosition().x, function () { _self.doInverseKinematics(); }));
                _fInverseKinematics.addChild(new RUIslider('ik_y', this.m_dhModel.xyzMinEstimate().y, this.m_dhModel.xyzMaxEstimate().y, this.m_dhModel.xyzZeroPosition().y, function () { _self.doInverseKinematics(); }));
                _fInverseKinematics.addChild(new RUIslider('ik_z', this.m_dhModel.xyzMinEstimate().z, this.m_dhModel.xyzMaxEstimate().z, this.m_dhModel.xyzZeroPosition().z, function () { _self.doInverseKinematics(); }));
                if (this.m_dhModel.includeInvKinEndEffectorOrientation()) {
                    // Allow the GUI to control the end effector orientation
                    _fInverseKinematics.addChild(new RUIslider('ik_roll', -Math.PI, Math.PI, this.m_dhModel.rpyZeroPosition().x, function () { _self.doInverseKinematics(); }));
                    _fInverseKinematics.addChild(new RUIslider('ik_pitch', -Math.PI, Math.PI, this.m_dhModel.rpyZeroPosition().y, function () { _self.doInverseKinematics(); }));
                    _fInverseKinematics.addChild(new RUIslider('ik_yaw', -Math.PI, Math.PI, this.m_dhModel.rpyZeroPosition().z, function () { _self.doInverseKinematics(); }));
                }
                // _fInverseKinematics.addChild( new RUIbutton( 'compute IK', () => { _self.doInverseKinematics(); } ) );
                this.m_uiWrapper.appendUIelement(_fInverseKinematics);
                // ******************************************************************
            }
            // Visibility ******************************************************
            var _fVisibility = new RUIfolder('Visibility');
            _fVisibility.addChild(new RUIcheckbox('DH_model', true));
            _fVisibility.addChild(new RUIcheckbox('URDF_model', true));
            this.m_uiWrapper.appendUIelement(_fVisibility);
            // ******************************************************************
        };
        RDHguiController.prototype._initializeControllers = function () {
            this.m_uiWrapper.buildUI();
        };
        RDHguiController.prototype.isDHmodelVisible = function () { return this.m_isDHmodelVisible; };
        RDHguiController.prototype.isURDFmodelVisible = function () { return this.m_isURDFmodelVisible; };
        RDHguiController.prototype.doForwardKinematics = function () {
            // console.info( 'computing forward kinematics' );
            var _jointValues = [];
            var _entries = this.m_dhTable.entries();
            for (var q = 0; q < _entries.length; q++) {
                var _qSlider = this.m_uiWrapper.getElementByName('fk_q' + (q + 1));
                _jointValues.push(parseFloat(_qSlider.controller().getValue()));
            }
            this.m_dhModel.forward(_jointValues);
        };
        RDHguiController.prototype.doInverseKinematics = function () {
            // console.info( 'computing inverse kinematics' );
            var _xyz = new core.LVec3(0, 0, 0);
            var _xSlider = this.m_uiWrapper.getElementByName('ik_x');
            var _ySlider = this.m_uiWrapper.getElementByName('ik_y');
            var _zSlider = this.m_uiWrapper.getElementByName('ik_z');
            _xyz.x = parseFloat(_xSlider.controller().getValue());
            _xyz.y = parseFloat(_ySlider.controller().getValue());
            _xyz.z = parseFloat(_zSlider.controller().getValue());
            var _rpy = new core.LVec3(0, 0, 0);
            if (this.m_dhModel.includeInvKinEndEffectorOrientation()) {
                var _rollSlider = this.m_uiWrapper.getElementByName('ik_roll');
                var _pitchSlider = this.m_uiWrapper.getElementByName('ik_pitch');
                var _yawSlider = this.m_uiWrapper.getElementByName('ik_yaw');
                _rpy.x = parseFloat(_rollSlider.controller().getValue());
                _rpy.y = parseFloat(_pitchSlider.controller().getValue());
                _rpy.z = parseFloat(_yawSlider.controller().getValue());
            }
            this.m_dhModel.inverse(_xyz, _rpy);
        };
        RDHguiController.prototype.update = function (dt) {
            this._updateFKvalues();
            this._updateIKvalues();
            this._updateVisibilityValues();
        };
        RDHguiController.prototype._updateFKvalues = function () {
            var _xyz = this.m_dhModel.getEndEffectorXYZ();
            var _rpy = this.m_dhModel.getEndEffectorRPY();
            // Update xyz and rpy text UI elements
            var _xText = this.m_uiWrapper.getElementByName('fk_x');
            var _yText = this.m_uiWrapper.getElementByName('fk_y');
            var _zText = this.m_uiWrapper.getElementByName('fk_z');
            var _rollText = this.m_uiWrapper.getElementByName('fk_roll');
            var _pitchText = this.m_uiWrapper.getElementByName('fk_pitch');
            var _yawText = this.m_uiWrapper.getElementByName('fk_yaw');
            _xText.controller().setValue('' + _xyz.x);
            _yText.controller().setValue('' + _xyz.y);
            _zText.controller().setValue('' + _xyz.z);
            _rollText.controller().setValue('' + _rpy.x);
            _pitchText.controller().setValue('' + _rpy.y);
            _yawText.controller().setValue('' + _rpy.z);
        };
        RDHguiController.prototype._updateIKvalues = function () {
            if (this.m_ikEnabled) {
                var _joints = this.m_dhTable.getAllJointValues();
                // Update joints text UI elements
                var _entries = this.m_dhTable.entries();
                for (var q = 0; q < _entries.length; q++) {
                    var _qText = this.m_uiWrapper.getElementByName('ik_q' + (q + 1));
                    _qText.controller().setValue('' + _joints[q]);
                }
            }
        };
        RDHguiController.prototype._updateVisibilityValues = function () {
            var _chbxDHmodel = this.m_uiWrapper.getElementByName('DH_model');
            var _chbxURDFmodel = this.m_uiWrapper.getElementByName('URDF_model');
            this.m_isDHmodelVisible = (_chbxDHmodel.controller().getValue());
            this.m_isURDFmodelVisible = (_chbxURDFmodel.controller().getValue());
        };
        return RDHguiController;
    }());
    leojs.RDHguiController = RDHguiController;
})(leojs || (leojs = {}));
