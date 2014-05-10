vec2 offset(vec2 p) {
	vec2 screen = vec2(640,480);
    p.x -= screen.x/2.0;
    p.y -= screen.y/2.0;
    return p;
}

vec2 scale(vec2 p) {
	vec2 screen = vec2(640,480);
	vec2 center = screen * .5;
    p.x /= screen.x/4.;
    p.y /= screen.x/4.;
//    p.x *= zoom.x;
//    p.y *= zoom.y;
    //p += center;
    return p;
}


vec4 quatmult(vec4 a, vec4 b) {
	float real = a.x * b.x - a.y * a.y - a.z * a.z - a.w * a.w;
	float i = a.x * b.y + b.x * a.y + a.z * b.w - a.w * b.z;
	float j = a.x * b.z + a.z * b.x - a.y * b.w + a.w * b.y;
	float k = a.x * b.w + a.w * b.x + a.y * b.z - a.z * b.y;
	return vec4(real, i, j, k);
}

//vec4 point = vec4(x,y,z,w);
//parametric form of a plane
//vec4 s = vec4(a,b,c,d); //these fuckers have to be orthonormal
//vec4 t = vec4(a,b,c,d);

//vec4 whereami = dot(screenpos, o

float iterate(vec4 a, vec4 b, int i) {
    float step = 1.0;
    float sum = 0.0;
    vec4 z  = a;
    for (int n = 0; n < i; ++n) {
        z = quatmult(z,z) + b;
        if (dot(z,z) >= 4.0)
            break;
        sum += step;
    }
    return sum;
}

void main (void)
{
    float c = 1.0;
    vec2 position = offset(gl_FragCoord.xy);
    vec2 complex = scale(position);
    vec4 test = vec4(complex.x, complex.y, c, complex.x + complex.y -c);
    float colormap = iterate(test,test,50);
    
        gl_FragColor.r = 3. * colormap ;
        gl_FragColor.g = 20. * mod (colormap, 0.05) ;
        gl_FragColor.b = 1.0; 
        gl_FragColor.a = 1.0;
}





