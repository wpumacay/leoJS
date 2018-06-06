
precision mediump float;

attribute vec3 vPos;
attribute vec3 vNormal;
attribute vec2 vTexCoords;

uniform mat4 u_matModel;
uniform mat4 u_matView;
uniform mat4 u_matProj;

varying vec3 fPos;
varying vec3 fNormal;
varying vec2 fTexCoords;

void main()
{
    vec4 _position = u_matModel * vec4( vPos, 1.0 );

    fPos = vec3( _position.x, _position.y, _position.z );
    fNormal = mat3( u_matModel ) * vNormal;
    fTexCoords = vTexCoords;

    gl_Position = u_matProj * u_matView * _position;
}