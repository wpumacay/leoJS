
precision mediump float;

attribute vec3 vPos;
attribute vec3 vNormal;
attribute vec2 vTexCoords;

uniform mat4 u_matModel;
uniform mat4 u_matView;
uniform mat4 u_matProj;

varying vec3 fNormal;
varying vec2 fTexCoords;

void main()
{
    gl_Position = u_matProj * u_matView * u_matModel * vec4( vPos, 1.0 );
    fTexCoords = vTexCoords;
    fNormal = vNormal;
}