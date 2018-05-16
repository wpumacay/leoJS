
/// <reference path="../../../ext/cat1js/core/assets/LAssetsManager.ts" />
/// <reference path="../../../ext/cat1js/engine3d/geometry/LGeometryBuilder.ts" />
/// <reference path="../../../ext/cat1js/engine3d/material/LMaterial3d.ts" />
/// <reference path="../../../ext/cat1js/engine3d/material/LPhongMaterial.ts" />
/// <reference path="../../../ext/cat1js/engine3d/material/LTexturedMaterial.ts" />
/// <reference path="../../../ext/cat1js/engine3d/graphics/LMesh.ts" />


namespace leojs
{

    export function buildPrimitive( geoProps : { [id:string] : any },
                                    matProps : { [id:string] : any } ) : engine3d.LMesh
    {
        let _geometry : engine3d.LGeometry3d = null;
        let _material : engine3d.LMaterial3d = null;

        let _shapeType : string = ( geoProps['shape'] ) ? geoProps['shape'] : 'box';

        switch ( _shapeType )
        {

            case 'plane' :
                _geometry = engine3d.LGeometryBuilder.createPlane( geoProps['width'] || 1.0,
                                                                   geoProps['depth'] || 1.0 );
            break;

            case 'box' :
                _geometry = engine3d.LGeometryBuilder.createBox( geoProps['width'] || 1.0,
                                                                 geoProps['height'] || 1.0,
                                                                 geoProps['depth'] || 1.0 );
            break;

            case 'sphere' :
                _geometry = engine3d.LGeometryBuilder.createSphere( geoProps['radius'] || 1.0,
                                                                    geoProps['levelDivision'] || 10,
                                                                    geoProps['numLevels'] || 10 );
            break;

            case 'cylinder' :
                _geometry = engine3d.LGeometryBuilder.createCylinder( geoProps['radius'] || 0.5,
                                                                      geoProps['height'] || 1.0,
                                                                      geoProps['sectionDivision'] | 10 );
            break;

            case 'capsule' :
                _geometry = engine3d.LGeometryBuilder.createCapsule( geoProps['radius'] || 0.5,
                                                                     geoProps['height'] || 1.0,
                                                                     geoProps['sectionDivision'] || 10,
                                                                     geoProps['levels'] || 10 );
            break;

            case 'cone' :
                _geometry = engine3d.LGeometryBuilder.createCone( geoProps['radius'] || 0.5,
                                                                  geoProps['height'] || 1.0,
                                                                  geoProps['sectionDivision'] || 10 );
            break;

            case 'arrow' :
                _geometry = engine3d.LGeometryBuilder.createArrow( geoProps['length'] || 1.0 );
            break;

        }

        let _materialType : string = ( matProps['material'] ) ? matProps['material'] : 'simple';

        switch ( _materialType )
        {
            case 'phong' :
                let _pAmbient : core.LVec3 = ( matProps['ambient'] ) ? ( <core.LVec3> matProps['ambient'] ) : core.DEFAULT_AMBIENT;
                let _pDiffuse : core.LVec3 = ( matProps['diffuse'] ) ? ( <core.LVec3> matProps['diffuse'] ) : core.DEFAULT_DIFFUSE;
                let _pSpecular : core.LVec3 = ( matProps['specular'] ) ? ( <core.LVec3> matProps['specular'] ) : core.DEFAULT_SPECULAR;
                let _pShininess : number = ( matProps['shininess'] ) ? matProps['shininess'] : core.DEFAULT_SHININESS;

                _material = new engine3d.LPhongMaterial( _pAmbient, _pDiffuse, _pSpecular, _pShininess );
            break;

            case 'textured' :
                let _textureId : string = ( matProps['textureId'] ) ? matProps['textureId'] : 'img_default';
                let _texture : core.LTexture = core.LAssetsManager.INSTANCE.getTexture( _textureId );
                if ( !_texture )
                {
                    _texture = core.LAssetsManager.INSTANCE.getTexture( 'img_default' );
                }

                let _specular : core.LVec3 = ( matProps['specular'] ) ? ( <core.LVec3> matProps['specular'] ) : core.DEFAULT_SPECULAR;
                let _shininess : number = ( matProps['shininess'] ) ? matProps['shininess'] : core.DEFAULT_SHININESS;

                _material = new engine3d.LTexturedMaterial( _texture, _specular, _shininess );
            break;

            case 'simple' :
            default:
                let _color : core.LVec3 = ( matProps['color'] ) ? ( <core.LVec3> matProps['color'] ) : core.BLUE;
                _material = new engine3d.LMaterial3d( _color );
            break;

        }

        return new engine3d.LMesh( _geometry, _material );
    }




}