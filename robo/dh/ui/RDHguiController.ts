
/// <reference path="../RDHcommon.ts" />
/// <reference path="../RDHmodel.ts" />
/// <reference path="../../../ext/dat.gui.d.ts" />


namespace leojs
{

    export enum UItype
    {
        BASE = 0,
        FOLDER = 1,
        BUTTON = 2,
        TEXT = 3,
        SLIDER = 4,
        CHECKBOX = 5
    }

    export class RUIelement
    {
        protected m_type : UItype;
        protected m_name : string;
        protected m_controller : dat.GUIController;

        constructor( uiName : string )
        {
            this.m_type = UItype.BASE;
            this.m_name = uiName;
            this.m_controller = null;
        }

        public assignController( controller : dat.GUIController ) : void { this.m_controller = controller; }
        public controller() : dat.GUIController { return this.m_controller; }
        public name() : string { return this.m_name; }
        public type() : UItype { return this.m_type; }
    }

    export class RUIbutton extends RUIelement
    {
        private m_callback : Function;

        constructor( uiName : string,
                     fcnCallback : Function )
        {
            super( uiName );
            this.m_type = UItype.BUTTON;

            this.m_callback = fcnCallback;
        }

        public callback() : Function { return this.m_callback; }
    }

    export class RUItext extends RUIelement
    {
        private m_text : string;

        constructor( uiName : string,
                     uiText : string )
        {
            super( uiName );
            this.m_type = UItype.TEXT;

            this.m_text = uiText;
        }

        public text() : string { return this.m_text; }
    }

    export class RUIslider extends RUIelement
    {
        private m_min : number;
        private m_max : number;
        private m_current : number;
        private m_onChangeCallback : Function;

        constructor( uiName : string,
                     vMin : number, vMax : number, vCurrent,
                     onChangeCallback : Function )
        {
            super( uiName );
            this.m_type = UItype.SLIDER;

            this.m_min = vMin;
            this.m_max = vMax;
            this.m_current = vCurrent;
            this.m_onChangeCallback = onChangeCallback;
        }

        public min() : number { return this.m_min; }
        public max() : number { return this.m_max; }
        public current() : number { return this.m_current; }
        public onChangeCallback() : Function { return this.m_onChangeCallback; }
    }

    export class RUIcheckbox extends RUIelement
    {
        private m_state : boolean;

        constructor( uiName : string,
                     vState : boolean )
        {
            super( uiName );
            this.m_type = UItype.CHECKBOX;

            this.m_state = vState;
        }

        public state() : boolean { return this.m_state; }
    }

    export class RUIfolder extends RUIelement
    {
        private m_children : RUIelement[];

        constructor( uiName : string )
        {
            super( uiName );
            this.m_type = UItype.FOLDER;

            this.m_children = [];
        }

        public addChild( child : RUIelement ) : void
        {
            this.m_children.push( child );
        }

        public children() : RUIelement[] { return this.m_children; }
    }

    export class RUIwrapper
    {
        private m_dgui : dat.GUI;
        private m_uiDef : any;
        private m_uiElements : RUIelement[];
        private m_uiStorage : { [id:string] : RUIelement };

        constructor( dgui : dat.GUI )
        {
            this.m_dgui = dgui;
            this.m_uiDef = {};
            this.m_uiElements = [];
            this.m_uiStorage = {};
        }

        public appendUIelement( uiElement : RUIelement ) : void
        {
            this.m_uiElements.push( uiElement );
        }

        public elements() : RUIelement[] { return this.m_uiElements; }

        public buildUI() : void
        {
            for ( let q = 0; q < this.m_uiElements.length; q++ )
            {
                this._buildNode( this.m_uiElements[q], this.m_dgui );
            }
        }

        private _buildNode( element : RUIelement, dguiParent : dat.GUI ) : void
        {
            this.m_uiStorage[ element.name() ] = element;

            if ( element.type() == UItype.FOLDER )
            {
                this._buildFolder( <RUIfolder> element, dguiParent );
            }
            else if ( element.type() == UItype.BUTTON )
            {
                element.assignController( this._buildButton( <RUIbutton> element, dguiParent ) );
            }
            else if ( element.type() == UItype.TEXT )
            {
                element.assignController( this._buildText( <RUItext> element, dguiParent ) );
            }
            else if ( element.type() == UItype.SLIDER )
            {
                element.assignController( this._buildSlider( <RUIslider> element, dguiParent ) );
            }
            else if ( element.type() == UItype.CHECKBOX )
            {
                element.assignController( this._buildCheckbox( <RUIcheckbox> element, dguiParent ) );
            }
        }

        private _buildFolder( folderElement : RUIfolder, dguiParent : dat.GUI ) : void
        {
            let _folderUI : dat.GUI = dguiParent.addFolder( folderElement.name() );

            let _children : RUIelement[] = folderElement.children();

            for ( let q = 0; q < _children.length; q++ )
            {
                this._buildNode( _children[q], _folderUI );
            }
        }

        private _buildButton( btnElement : RUIbutton, dguiParent : dat.GUI ) : dat.GUIController
        {
            this.m_uiDef[ btnElement.name() ] = btnElement.callback();

            let _controller : dat.GUIController = dguiParent.add( this.m_uiDef,
                                                                  btnElement.name() );

            return _controller;
        }

        private _buildText( txtElement : RUItext, dguiParent : dat.GUI ) : dat.GUIController
        {
            this.m_uiDef[ txtElement.name() ] = txtElement.text();

            let _controller : dat.GUIController = dguiParent.add( this.m_uiDef,
                                                                  txtElement.name() );

            return _controller;
        }

        private _buildSlider( sldElement : RUIslider, dguiParent : dat.GUI ) : dat.GUIController
        {
            this.m_uiDef[ sldElement.name() ] = sldElement.current();

            let _controller : dat.GUIController = dguiParent.add( this.m_uiDef,
                                                                  sldElement.name(),
                                                                  sldElement.min(),
                                                                  sldElement.max() );
            _controller.setValue( sldElement.current() );
            _controller.step( 0.001 );
            if ( sldElement.onChangeCallback() )
            {
                _controller.onChange( sldElement.onChangeCallback() );
            }

            return _controller;
        }

        private _buildCheckbox( chbxElement : RUIcheckbox, dguiParent : dat.GUI ) : dat.GUIController
        {
            this.m_uiDef[ chbxElement.name() ] = chbxElement.state();

            let _controller : dat.GUIController = dguiParent.add( this.m_uiDef,
                                                                  chbxElement.name() );

            return _controller;
        }

        public getElementByName( name : string ) : RUIelement
        {
            let _element : RUIelement = this.m_uiStorage[ name ];
            if ( _element )
            {
                return _element;
            }

            console.warn( 'RUIwrapper> element with id: ' + 
                          name + ' does not exist'  );
            return null;
        }
    };



    export class RDHguiController
    {
        private m_dgui : dat.GUI;
        private m_uiWrapper : RUIwrapper;

        private m_dhTable : RDHtable;
        private m_dhModel : RDHmodel;

        constructor( dhModel : RDHmodel )
        {
            this.m_dgui = new dat.GUI();
            this.m_uiWrapper = new RUIwrapper( this.m_dgui );

            this.m_dhModel = dhModel;
            this.m_dhTable = dhModel.getDHtable();

            this._initializeUI();
            this._initializeControllers();
        }

        private _initializeUI() : void
        {
            var _self : RDHguiController = this;

            let _entries : RDHentry[] = this.m_dhTable.entries();

            // Forward kinematics ***********************************************
            let _fForwardKinematics = new RUIfolder( 'Forward Kinematics' );
            for ( let q = 0; q < _entries.length; q++ )
            {
                _fForwardKinematics.addChild( new RUIslider( 'fk_q' + ( q + 1 ),
                                                             _entries[q].minJointValue(),
                                                             _entries[q].maxJointValue(),
                                                              0, () => { _self.doForwardKinematics(); } ) );
            }
            _fForwardKinematics.addChild( new RUItext( 'fk_x', '0' ) );
            _fForwardKinematics.addChild( new RUItext( 'fk_y', '0' ) );
            _fForwardKinematics.addChild( new RUItext( 'fk_z', '0' ) );
            // _fForwardKinematics.addChild( new RUIbutton( 'compute FK', () => { _self.doForwardKinematics(); } ) );
            this.m_uiWrapper.appendUIelement( _fForwardKinematics );
            // ******************************************************************

            // Inverse kinematics ***********************************************
            let _fInverseKinematics = new RUIfolder( 'Inverse Kinematics' );
            for ( let q = 0; q < _entries.length; q++ )
            {
                _fInverseKinematics.addChild( new RUItext( 'ik_q' + ( q + 1 ), '0' ) );
            }

            _fInverseKinematics.addChild( new RUIslider( 'ik_x', 
                                                         this.m_dhModel.xyzMinEstimate().x, 
                                                         this.m_dhModel.xyzMaxEstimate().x, 
                                                         this.m_dhModel.xyzZeroPosition().x, 
                                                         () => { _self.doInverseKinematics(); } ) );

            _fInverseKinematics.addChild( new RUIslider( 'ik_y', 
                                                         this.m_dhModel.xyzMinEstimate().y, 
                                                         this.m_dhModel.xyzMaxEstimate().y, 
                                                         this.m_dhModel.xyzZeroPosition().y, 
                                                         () => { _self.doInverseKinematics(); } ) );

            _fInverseKinematics.addChild( new RUIslider( 'ik_z', 
                                                         this.m_dhModel.xyzMinEstimate().z, 
                                                         this.m_dhModel.xyzMaxEstimate().z, 
                                                         this.m_dhModel.xyzZeroPosition().z, 
                                                         () => { _self.doInverseKinematics(); } ) );

            if ( this.m_dhModel.includeInvKinEndEffectorOrientation() )
            {
                // Allow the GUI to control the end effector orientation
                _fInverseKinematics.addChild( new RUIslider( 'ik_roll',
                                                             -Math.PI, Math.PI,
                                                             this.m_dhModel.rpyZeroPosition().x,
                                                             () => { _self.doInverseKinematics(); } ) )
                _fInverseKinematics.addChild( new RUIslider( 'ik_pitch',
                                                             -Math.PI, Math.PI, 
                                                             this.m_dhModel.rpyZeroPosition().y,
                                                             () => { _self.doInverseKinematics(); } ) )
                _fInverseKinematics.addChild( new RUIslider( 'ik_yaw',
                                                             -Math.PI, Math.PI, 
                                                             this.m_dhModel.rpyZeroPosition().z,
                                                             () => { _self.doInverseKinematics(); } ) )
            }
            // _fInverseKinematics.addChild( new RUIbutton( 'compute IK', () => { _self.doInverseKinematics(); } ) );
            this.m_uiWrapper.appendUIelement( _fInverseKinematics );
            // ******************************************************************
        }

        private _initializeControllers() : void
        {
            this.m_uiWrapper.buildUI();
        }

        public getValueFromUI( name : string ) : number
        {
            let _element : RUIelement = this.m_uiWrapper.getElementByName( name );
            if ( !_element )
            {
                console.warn( 'RDHguiController> cant get value from ui: ' + name );
                return 0;
            }

            if ( _element.type() == UItype.SLIDER )
            {
                return ( <RUIslider> _element ).current();
            }
        }

        public doForwardKinematics() : void
        {
            // console.info( 'computing forward kinematics' );
            let _jointValues : number[] = [];
            let _entries : RDHentry[] = this.m_dhTable.entries();

            for ( let q = 0; q < _entries.length; q++ )
            {
                let _qSlider : RUIslider = <RUIslider> this.m_uiWrapper.getElementByName( 'fk_q' + ( q + 1 ) );
                _jointValues.push( parseFloat( _qSlider.controller().getValue() ) );
            }

            this.m_dhModel.forward( _jointValues );
        }

        public doInverseKinematics() : void
        {
            // console.info( 'computing inverse kinematics' );
            let _xyz : core.LVec3 = new core.LVec3( 0, 0, 0 )

            let _xSlider : RUIslider = <RUIslider> this.m_uiWrapper.getElementByName( 'ik_x' );
            let _ySlider : RUIslider = <RUIslider> this.m_uiWrapper.getElementByName( 'ik_y' );
            let _zSlider : RUIslider = <RUIslider> this.m_uiWrapper.getElementByName( 'ik_z' );

            _xyz.x = parseFloat( _xSlider.controller().getValue() );
            _xyz.y = parseFloat( _ySlider.controller().getValue() );
            _xyz.z = parseFloat( _zSlider.controller().getValue() );

            let _rpy : core.LVec3 = new core.LVec3( 0, 0, 0 );

            if ( this.m_dhModel.includeInvKinEndEffectorOrientation() )
            {
                let _rollSlider  = <RUIslider> this.m_uiWrapper.getElementByName( 'ik_roll' );
                let _pitchSlider = <RUIslider> this.m_uiWrapper.getElementByName( 'ik_pitch' );
                let _yawSlider   = <RUIslider> this.m_uiWrapper.getElementByName( 'ik_yaw' );

                _rpy.x = parseFloat( _rollSlider.controller().getValue() );
                _rpy.y = parseFloat( _pitchSlider.controller().getValue() );
                _rpy.z = parseFloat( _yawSlider.controller().getValue() );
            }

            this.m_dhModel.inverse( _xyz, _rpy );
        }

        public update( dt : number ) : void
        {
            this._updateFKvalues();
            this._updateIKvalues();
        }

        private _updateFKvalues() : void
        {
            let _xyz : core.LVec3 = this.m_dhTable.getEndEffectorXYZ();
            // Update xyz text UI elements

            let _xText : RUItext = <RUItext> this.m_uiWrapper.getElementByName( 'fk_x' );
            let _yText : RUItext = <RUItext> this.m_uiWrapper.getElementByName( 'fk_y' );
            let _zText : RUItext = <RUItext> this.m_uiWrapper.getElementByName( 'fk_z' );

            _xText.controller().setValue( '' + _xyz.x );
            _yText.controller().setValue( '' + _xyz.y );
            _zText.controller().setValue( '' + _xyz.z );
        }

        private _updateIKvalues() : void
        {
            let _joints : number[] = this.m_dhTable.getAllJointValues();

            // Update joints text UI elements
            let _entries : RDHentry[] = this.m_dhTable.entries();

            for ( let q = 0; q < _entries.length; q++ )
            {
                let _qText : RUItext = <RUItext> this.m_uiWrapper.getElementByName( 'ik_q' + ( q + 1 ) );
                _qText.controller().setValue( '' + _joints[q] );
            }
        }
    }


}