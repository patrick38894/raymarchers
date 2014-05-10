//uniform vec2 screen;
//uniform vec2 zoom;
//uniform vec2 center;
//uniform vec2 fractal;
//uniform vec2 time;


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


vec2 complexmult(vec2 a, vec2 b) {
    return vec2(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
}

float mandelbrot(vec2 c, int i, float step) {
    float sum = 0.0;
    vec2 z = c;
    for (int n = 0; n < i; ++n) {
        z = complexmult(z,z) + c;
	z.x = abs(z.x);
	z.y = abs(z.y);
        if (z.x * z.x + z.y * z.y >= 4.0)
            break;
        sum += step;
    }
    return sum;
}

void main (void)
{
    vec2 position = offset(gl_FragCoord.xy);
    vec2 complex = scale(position);
    float colormap = mandelbrot(complex, 50, .1);
    
        gl_FragColor.r = 3. * colormap ;
        gl_FragColor.g = 20. * mod (colormap, 0.05) ;
        gl_FragColor.b = 1.0; 
        gl_FragColor.a = 1.0;
}

