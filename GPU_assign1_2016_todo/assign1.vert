//============================================================
// STUDENT NAME: Adrian Chan Ee Ray
// MATRIC NO.  : A0122061B
// NUS EMAIL   : acer@u.nus.edu
// COMMENTS TO GRADER:
// <comments to grader, if any>
//
// ============================================================
//	
// FILE: assign1.vert

 
varying vec3 ecPosition; // Vertex's position in eye space.
varying vec3 ecNormal;   // Vertex's normal vector in eye space.
varying vec3 ecTangent;  // Vertex's tangent vector in eye space.

attribute vec3 Tangent;  // Input vertex's tangent vector in model space.


void main( void )
{

    ///////////////////////////
    // WRITE YOUR CODE HERE. //
    ///////////////////////////

	ecNormal = normalize( gl_NormalMatrix * gl_Normal );
	vec4 ecPosition4 = gl_ModelViewMatrix * gl_Vertex;
	ecPosition = vec3( ecPosition4 ) / ecPosition4.w;
    gl_Position = ftransform();
	ecTangent = mat3(gl_ModelViewMatrix) * Tangent;
	gl_TexCoord[0] = gl_MultiTexCoord0;
}
