
precision mediump float;

attribute vec3 vPos;

uniform mat4 u_matModel;
uniform mat4 u_matView;
uniform mat4 u_matProj;

void main()
{
    gl_Position = u_matProj * u_matView * u_matModel * vec4( vPos, 1.0 );
}