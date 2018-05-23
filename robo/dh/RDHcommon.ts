

/// <reference path="../../ext/cat1js/core/math/LMath.ts" />



namespace leojs
{
    export enum JointType
    {
        NONE = 0,
        REVOLUTE = 1,
        PRISMATIC = 2
    }

    // 1 Axis -> 1Dof. In mechanical manipulators, it seems that for every axis, ...
    // the related joint has a dof along that axis ( either prismatic of revolute type )

    export const DHjointTypes : JointType[] = [ JointType.NONE,      // alpha_i_1
                                                JointType.NONE,      // a_i_1
                                                JointType.PRISMATIC, // d_i_1
                                                JointType.REVOLUTE ];// theta_i_1

    export enum DHparams
    {
        alpha_i_1 = 0,
        a_i_1 = 1,
        d_i = 2,
        theta_i = 3
    }

    export class RDHentry
    {
        private m_fixed : boolean[];
        private m_values : number[];
        private m_transform : core.LMat4;

        private m_jointSign : number;
        private m_jointOffset : number;
        private m_jointType : JointType;

        private m_minJointValue : number;
        private m_maxJointValue : number;
        private m_rangeJointValue : number;

        constructor( pFixed : boolean[],
                     pValues : number[],
                     pMinJointValue : number,
                     pMaxJointValue : number,
                     jointSign? : number,
                     jointOffset? : number )
        {
            console.assert( pFixed.length == 4, 'wrong length for pFixed parameter' );
            console.assert( pValues.length == 4, 'wrong length for pValues parameter' );

            this.m_fixed = pFixed;
            this.m_values = pValues;
            this.m_transform = new core.LMat4();

            this.m_jointSign = jointSign || 1.0;
            this.m_jointOffset = jointOffset || 0.0;

            this.m_jointType = this._getJointType();

            this.m_minJointValue = pMinJointValue;
            this.m_maxJointValue = pMaxJointValue;
            this.m_rangeJointValue = pMaxJointValue - pMinJointValue;

            this._updateTransform();
        }

        public fixed() : boolean[] { return this.m_fixed; }
        public values() : number[] { return this.m_values; }
        public minJointValue() : number { return this.m_minJointValue; }
        public maxJointValue() : number { return this.m_maxJointValue; }
        public rangeJointValue() : number { return this.m_rangeJointValue; }

        public setParamValue( value : number, indx : DHparams )
        {
            if ( indx < 0 || indx > 3 )
            {
                console.warn( 'RDHEntry> tried to access param with wrong indx: ' + indx );
                return;
            }

            this.m_values[ indx ] = value;
            this._updateTransform();
        }

        public getParamValue( indx : DHparams ) : number
        {
            if ( indx < 0 || indx > 3 )
            {
                console.warn( 'RDHEntry> tried to access param with wrong indx: ' + indx );
                return 0;
            }

            return this.m_values[ indx ];
        }

        // Using Rx( alpha_i_1 ) * Dx( a_i_1 ) * Rz( theta_i ) * Dz( d_i )
        // Recall, Rx * Dx = Dx * Rx as they are applied in the same axis
        private _updateTransform() : void
        {
            let alpha_i_1 : number = this.m_values[ DHparams.alpha_i_1 ];
            let a_i_1     : number = this.m_values[ DHparams.a_i_1 ];
            let theta_i   : number = this.m_values[ DHparams.theta_i ];
            let d_i       : number = this.m_values[ DHparams.d_i ];

            if ( this.m_jointType == JointType.REVOLUTE )
            {
                theta_i = theta_i * this.m_jointSign + this.m_jointOffset;
            }
            else if ( this.m_jointType == JointType.PRISMATIC )
            {
                d_i = d_i * this.m_jointSign + this.m_jointOffset;
            }

            this.m_transform.buff[0] = Math.cos( theta_i );
            this.m_transform.buff[1] = Math.sin( theta_i ) * Math.cos( alpha_i_1 );
            this.m_transform.buff[2] = Math.sin( theta_i ) * Math.sin( alpha_i_1 );
            this.m_transform.buff[3] = 0;

            this.m_transform.buff[4] = -Math.sin( theta_i );
            this.m_transform.buff[5] = Math.cos( theta_i ) * Math.cos( alpha_i_1 );
            this.m_transform.buff[6] = Math.cos( theta_i ) * Math.sin( alpha_i_1 );
            this.m_transform.buff[7] = 0;

            this.m_transform.buff[8]  = 0;
            this.m_transform.buff[9]  = -Math.sin( alpha_i_1 );
            this.m_transform.buff[10] = Math.cos( alpha_i_1 );
            this.m_transform.buff[11] = 0;

            this.m_transform.buff[12] = a_i_1;
            this.m_transform.buff[13] = -Math.sin( alpha_i_1 ) * d_i;
            this.m_transform.buff[14] = Math.cos( alpha_i_1 ) * d_i;
            this.m_transform.buff[15] = 1;
        }

        public getTransform() : core.LMat4 { return this.m_transform; }

        private _getJointType() : JointType
        {
            if ( !this.m_fixed[ DHparams.theta_i ] )
            {
                return JointType.REVOLUTE;
            }
            else if ( !this.m_fixed[ DHparams.d_i ] )
            {
                return JointType.PRISMATIC;
            }

            console.warn( 'RDHentry> there are 0 dof in this joint' );
            return JointType.NONE;
        }

        public getJointType() : JointType
        {
            return this.m_jointType;
        }
    }

    export class RDHtable
    {
        private m_entries : RDHentry[];
        private m_totalTransform : core.LMat4;
        private m_xyz : core.LVec3;

        constructor()
        {
            this.m_entries = [];
            this.m_totalTransform = new core.LMat4();
            this.m_xyz = new core.LVec3( 0, 0, 0 );
        }

        public appendEntry( entry : RDHentry ) : void
        {
            this.m_entries.push( entry );
        }

        public numJoints() : number { return this.m_entries.length; }

        public setJointValue( value : number, indx : number ) : void
        {
            if ( indx < 0 || indx >= this.m_entries.length )
            {
                console.error( 'RDHtable> Trying to set value for out of range indx ' + indx );
                return;
            }

            let _entry : RDHentry = this.m_entries[ indx ];

            if ( _entry.getJointType() == JointType.REVOLUTE )
            {
                value = this.validateJointValue( value, indx );
                _entry.setParamValue( value, DHparams.theta_i );
            }
            else if ( _entry.getJointType() == JointType.PRISMATIC )
            {
                value = this.validateJointValue( value, indx );
                _entry.setParamValue( value, DHparams.d_i );
            }
        }

        public validateJointValue( value : number, indx : number ) : number
        {
            let _entry : RDHentry = this.m_entries[ indx ];

            if ( value < _entry.minJointValue() )
            {
                console.log( 'RDHmodel> min value reached: ' + _entry.minJointValue() );
                value = _entry.minJointValue();
            }
            else if ( value > _entry.maxJointValue() )
            {
                console.log( 'RDHmodel> max value reached: ' + _entry.maxJointValue() );
                value = _entry.maxJointValue();
            }

            return value;
        }

        public getJointValue( indx : number ) : number
        {
            if ( indx < 0 || indx >= this.m_entries.length )
            {
                console.error( 'RDHtable> Trying to set value for out of range indx ' + indx );
                return 0;
            }

            let _entry : RDHentry = this.m_entries[ indx ];

            if ( _entry.getJointType() == JointType.REVOLUTE )
            {
                return _entry.getParamValue( DHparams.theta_i );
            }
            else if ( _entry.getJointType() == JointType.PRISMATIC )
            {
                return _entry.getParamValue( DHparams.d_i );
            }

            console.warn( 'RDHtable> asking joint for non-joint index' );
            return 0;
        }

        public getMinJointValue( indx : number ) : number
        {
            if ( indx < 0 || indx >= this.m_entries.length )
            {
                console.error( 'RDHtable> Trying to set value for out of range indx ' + indx );
                return 0;
            }

            let _entry : RDHentry = this.m_entries[ indx ];

            return _entry.minJointValue();
        }

        public getMaxJointValue( indx : number ) : number
        {
            if ( indx < 0 || indx >= this.m_entries.length )
            {
                console.error( 'RDHtable> Trying to set value for out of range indx ' + indx );
                return 0;
            }

            let _entry : RDHentry = this.m_entries[ indx ];

            return _entry.maxJointValue();
        }

        public getRangeJointValue( indx : number ) : number
        {
            if ( indx < 0 || indx >= this.m_entries.length )
            {
                console.error( 'RDHtable> Trying to set value for out of range indx ' + indx );
                return 0;
            }

            let _entry : RDHentry = this.m_entries[ indx ];

            return _entry.rangeJointValue();
        }

        public getTransform( indx : number ) : core.LMat4
        {
            if ( indx < 0 || indx >= this.m_entries.length )
            {
                console.error( 'RDHtable> Trying to access out of range indx ' + indx );
                return null;
            }

            return this.m_entries[indx].getTransform();
        }

        public getTransformInRange( from : number, to : number ) : core.LMat4
        {
            if ( 0 <= from && from <= to && to <= ( this.m_entries.length - 1 ) )
            {
                let _totalTransform : core.LMat4 = new core.LMat4();

                for ( let q = from; q <= to; q++  )
                {
                    let _transform : core.LMat4 = this.m_entries[q].getTransform();
                    _totalTransform = core.mulMatMat44( _totalTransform, _transform );
                }

                return _totalTransform;
            }

            console.error( 'RDHtable> wrong range provided: ' + from + ' - ' + to );
            return null;
        }

        private _getTotalTransform() : core.LMat4
        {
            return this.getTransformInRange( 0, this.m_entries.length - 1 );
        }

        public entries() : RDHentry[] { return this.m_entries; }
        public getFullTransform() : core.LMat4 { return this.m_totalTransform; }
        public getEndEffectorXYZ() : core.LVec3 { return this.m_xyz; }
        public getAllJointValues() : number[]
        {
            let _jointValues : number[] = [];

            for ( let q = 0; q < this.m_entries.length; q++ )
            {
                _jointValues.push( this.getJointValue( q ) );
            }

            return _jointValues;
        }

        public update( dt : number ) : void
        {
            this.m_totalTransform = this._getTotalTransform();
            core.LMat4.extractPositionInPlace( this.m_xyz, this.m_totalTransform );
        }
    }

}