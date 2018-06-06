

precision mediump float;

uniform sampler2D u_texture;

varying vec3 fNormal;
varying vec2 fTexCoords;

void main()
{
    gl_FragColor = texture2D( u_texture, fTexCoords );
}