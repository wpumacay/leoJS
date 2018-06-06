
precision mediump float;

attribute vec2 vPos;
attribute vec3 vColor;

uniform vec2 u_pos;
uniform float u_rot;

uniform mat4 u_matView;
uniform mat4 u_matProj;

varying vec3 fColor;

void main()
{
	fColor = vColor;
	gl_Position = vec4( vPos, 0.0, 1.0 );
}