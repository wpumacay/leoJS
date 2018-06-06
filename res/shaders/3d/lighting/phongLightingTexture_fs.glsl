

precision mediump float;

// Definitions ***********************************************
#define MAX_DIRECTIONAL_LIGHTS 3
struct ULightDirectional
{
    vec3 direction;
    // phong model components
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
    // strength - factor to simulate smooth activations
    float strength;
};

#define MAX_POINT_LIGHTS 3
struct ULightPoint
{
    vec3 position;
    // phong model components
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
    // strength - factor to simulate smooth activations
    float strength;
};

struct UMaterial
{
    sampler2D diffuseMap;
    vec3 specular;
    float shininess;
};

// ***********************************************************

// Uniforms **************************************************
uniform ULightDirectional u_directionalLights[ MAX_DIRECTIONAL_LIGHTS ];
uniform int u_numDirectionalLights;

uniform ULightPoint u_pointLights[ MAX_POINT_LIGHTS ];
uniform int u_numPointLights;

uniform vec3 u_viewPos;

uniform UMaterial u_material;

// ***********************************************************

// INs from vertex shader ************************************

varying vec3 fPos;
varying vec3 fNormal;
varying vec2 fTexCoords;

// ***********************************************************

vec3 _computeDirectionalContribution( ULightDirectional light, 
                                      UMaterial material, 
                                      vec3 normal, 
                                      vec3 viewDir );

vec3 _computePointContribution( ULightPoint light,
                                UMaterial material,
                                vec3 fragPos,
                                vec3 normal,
                                vec3 viewDir );

void main()
{
    vec3 _normal = normalize( fNormal );
    vec3 _viewDir = normalize( u_viewPos - fPos );

    vec3 _fColor = vec3( 0.0, 0.0, 0.0 );

    for ( int q = 0; q < MAX_DIRECTIONAL_LIGHTS; q++ )
    {
        if ( q >= u_numDirectionalLights )
        {
            continue;
        }

        if ( u_directionalLights[q].strength < 0.001 )
        {
            continue;
        }

        _fColor += _computeDirectionalContribution( u_directionalLights[q],
                                                    u_material,
                                                    _normal,
                                                    _viewDir );
    }

    for ( int q = 0; q < MAX_POINT_LIGHTS; q++ )
    {
        if ( q >= u_numPointLights )
        {
            continue;
        }

        if ( u_pointLights[q].strength < 0.001 )
        {
            continue;
        }

        _fColor += _computePointContribution( u_pointLights[q],
                                              u_material,
                                              fPos,
                                              _normal,
                                              _viewDir );
    }

    gl_FragColor = vec4( _fColor, 1.0 );
}


vec3 _computeDirectionalContribution( ULightDirectional light, 
                                      UMaterial material, 
                                      vec3 normal, 
                                      vec3 viewDir )
{
    vec3 _lightDir = normalize( -light.direction );
    // diffuse shadding
    float _diff = max( 0.0, dot( normal, _lightDir ) );
    // specular shading
    vec3 _reflectDir = reflect( _lightDir, normal );
    float _spec = pow( max( 0.0, dot( viewDir, _reflectDir ) ), material.shininess );
    // calculate components
    vec3 _ambient  = light.ambient * vec3( texture2D( material.diffuseMap, fTexCoords ) );
    vec3 _diffuse  = _diff * light.diffuse * vec3( texture2D( material.diffuseMap, fTexCoords ) );
    vec3 _specular = _spec * light.specular * material.specular;
    
    return ( _ambient + _diffuse + _specular ) * light.strength;
}


vec3 _computePointContribution( ULightPoint light,
                                UMaterial material,
                                vec3 fragPos,
                                vec3 normal,
                                vec3 viewDir )
{
    vec3 _lightDir = normalize( light.position - fragPos );
    // diffuse shadding
    float _diff = max( 0.0, dot( normal, _lightDir ) );
    // specular shading
    vec3 _reflectDir = reflect( _lightDir, normal );
    float _spec = pow( max( 0.0, dot( viewDir, _reflectDir ) ), material.shininess );
    // calculate components
    vec3 _ambient  = light.ambient * vec3( texture2D( material.diffuseMap, fTexCoords ) );
    vec3 _diffuse  = _diff * light.diffuse * vec3( texture2D( material.diffuseMap, fTexCoords ) );
    vec3 _specular = _spec * light.specular * material.specular;
    
    return ( _ambient + _diffuse + _specular ) * light.strength;
}