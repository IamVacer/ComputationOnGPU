//============================================================
// STUDENT NAME: Adrian Chan Ee Ray
// MATRIC NO.  : A0122061B
// NUS EMAIL   : acer@u.nus.edu
// COMMENTS TO GRADER:
// <comments to grader, if any>
//
// ============================================================
//
// FILE: assign1.frag


//============================================================================
// Eye-space position and vectors for setting up a tangent space at the fragment.
//============================================================================

varying vec3 ecPosition;    // Fragment's 3D position in eye space.
varying vec3 ecNormal;      // Fragment's normal vector in eye space.
varying vec3 ecTangent;     // Frgament's tangent vector in eye space.


//============================================================================
// TileDensity specifies the number of tiles to span across each dimension when the
// texture coordinates gl_TexCoord[0].s and gl_TexCoord[0].t range from 0.0 to 1.0.
//============================================================================

uniform float TileDensity;  // (0.0, inf)


//============================================================================
// TubeRadius is the radius of the semi-circular mirror tubes that run along 
// the boundary of each tile. The radius is relative to the tile size, which 
// is considered to be 1.0 x 1.0.
//============================================================================

uniform float TubeRadius;  // (0.0, 0.5]


//============================================================================
// StickerWidth is the width of the square sticker. The entire square sticker 
// must appear at the center of each tile. The width is relative to the 
// tile size, which is considered to be 1.0 x 1.0.
//============================================================================

uniform float StickerWidth;  // (0.0, 1.0]


//============================================================================
// EnvMap references the environment cubemap for reflection mapping.
//============================================================================

uniform samplerCube EnvMap;


//============================================================================
// DiffuseTex1 references the wood texture map whose color is used to 
// modulate the ambient and diffuse lighting components on the non-mirror and
// non-sticker regions.
//============================================================================

uniform sampler2D DiffuseTex1;


//============================================================================
// DiffuseTex2 references the sticker texture map whose color is used to 
// modulate the ambient and diffuse lighting components on the sticker regions.
//============================================================================

uniform sampler2D DiffuseTex2;




void main()
{
    vec2 c = TileDensity * gl_TexCoord[0].st;
    vec2 p = fract( c ) - vec2( 0.5 );

    // Some useful eye-space vectors.
    vec3 ecNNormal = normalize( ecNormal );
    vec3 ecViewVec = -normalize( ecPosition );


    //////////////////////////////////////////////////////////
    // REPLACE THE CONDITION IN THE FOLLOWING IF STATEMENT. //
    //////////////////////////////////////////////////////////


    if ( !gl_FrontFacing )
    {
        //======================================================================
        // In here, fragment is backfacing or in the non-bump region.
        //======================================================================

        // For the lighting computation, use the half-vector approach 
        // to compute the specular component.


        ///////////////////////////
        // WRITE YOUR CODE HERE. //
        ///////////////////////////
        vec3 viewVec = -normalize( ecPosition );
        vec3 necNormal = -normalize( ecNormal );
        vec3 lightPos = vec3( gl_LightSource[0].position ) / gl_LightSource[0].position.w;
        vec3 lightVec = normalize( lightPos - ecPosition );
        vec3 halfVector = normalize( lightVec + viewVec );

        float N_dot_L = max( 0.0, dot( necNormal, lightVec ) );
        float N_dot_H = max( 0.0, dot( necNormal, halfVector ) );

        float pf = ( N_dot_H == 0.0 )? 0.0 : pow( N_dot_H, gl_FrontMaterial.shininess );
        vec4 wood = texture2D(DiffuseTex1, vec2(gl_TexCoord[0]));
        gl_FragColor= gl_FrontLightModelProduct.sceneColor * wood +
                    gl_LightSource[0].ambient * gl_FrontMaterial.ambient * wood +
                    gl_LightSource[0].diffuse * gl_FrontMaterial.diffuse * N_dot_L * wood +
                    gl_LightSource[0].specular * gl_FrontMaterial.specular * pf;
    }
    else
    {
        //======================================================================
        // In here, fragment is front-facing and in the mirror-like bump region.
        //======================================================================
        vec3 viewVec = -normalize( ecPosition );
        vec3 necNormal = normalize( ecNormal );
        vec3 lightPos = vec3( gl_LightSource[0].position ) / gl_LightSource[0].position.w;
        vec3 lightVec = normalize( lightPos - ecPosition );
        vec3 halfVector = normalize( lightVec + viewVec );


        float N_dot_L = max( 0.0, dot( necNormal, lightVec ) );
        float N_dot_H = max( 0.0, dot( necNormal, halfVector ) );

        float pf = ( N_dot_H == 0.0 )? 0.0 : pow( N_dot_H, gl_FrontMaterial.shininess );
        vec3 N = ecNNormal;
        vec3 B = normalize( cross( N, ecTangent ) ); //Bitangent
        vec3 T = cross( B, N );

        vec3 tanPerturbedNormal;  // The perturbed normal vector in tangent space of fragment.
        vec3 ecPerturbedNormal;   // The perturbed normal vector in eye space.
        vec3 ecReflectVec;        // The mirror reflection vector in eye space.


        ///////////////////////////
        // WRITE YOUR CODE HERE. //
        ///////////////////////////
		vec4 wood = texture2D(DiffuseTex1, vec2(gl_TexCoord[0]));
        vec4 sticker = texture2D(DiffuseTex2, vec2(p/StickerWidth + 0.5));
        
        bool bump_range =  abs(p.x)<(0.5 - TubeRadius) && 
                            abs(p.y)<(0.5 - TubeRadius);

        if (StickerWidth/2 > abs(p.x) && StickerWidth/2 > abs(p.y)) { //Sticker side
            gl_FragColor= gl_FrontLightModelProduct.sceneColor * sticker +
                        gl_LightSource[0].ambient * gl_FrontMaterial.ambient * sticker +
                        gl_LightSource[0].diffuse * gl_FrontMaterial.diffuse * N_dot_L * sticker +
                        gl_LightSource[0].specular * gl_FrontMaterial.specular * pf;
        } else if (bump_range) { //wood side
            gl_FragColor = gl_FrontLightModelProduct.sceneColor * wood +
                        gl_LightSource[0].ambient * gl_FrontMaterial.ambient * wood +
                        gl_LightSource[0].diffuse * gl_FrontMaterial.diffuse * N_dot_L * wood +
                        gl_LightSource[0].specular * gl_FrontMaterial.specular * pf;
        } else { // BUMP
            if (abs(p.x) > abs(p.y)){ //manipulating x sides
                float x = (abs(p.x) - 0.5) / TubeRadius;
                float z = sqrt(1.0 - x * x);
                if (p.x < 0.0) { //negative side
                    x = -x;
                }
                tanPerturbedNormal = normalize(vec3(x, 0, z));
            } else {// abs(p.x) <= abs(p.y) //manipulating y sides
                float y = (abs(p.y) - 0.5) / TubeRadius;
                float z = sqrt(1.0 - y * y);
                if (p.y < 0.0) { //negative side
                    y = -y;
                }
                tanPerturbedNormal = normalize(vec3(0, y, z));
            }
            ecPerturbedNormal = tanPerturbedNormal.x * T + tanPerturbedNormal.y * B + tanPerturbedNormal.z * N;
            ecReflectVec = reflect(-ecViewVec, ecPerturbedNormal);
            gl_FragColor = textureCube(EnvMap, ecReflectVec);

        }
        
    }

}
