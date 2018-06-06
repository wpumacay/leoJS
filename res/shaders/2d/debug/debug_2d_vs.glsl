
precision mediump float;

attribute vec3 vPos;
attribute vec3 vColor;

uniform mat4 u_matView;
uniform mat4 u_matProj;

varying vec3 fColor;

void main()
{
    gl_Position = u_matProj * u_matView * vec4( vPos, 1.0 );
    fColor = vColor;
}