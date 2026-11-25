"use client";

import { useEffect, useRef } from "react";

/**
 * Procedural liquid chocolate rendered with a WebGL2 fragment shader.
 * `progress` (0..1, written by the parent from scroll) drives the story:
 * dark pour → slow melt → tempering swirl → white chocolate with hand-painted drops.
 */

const VERT = `#version 300 es
in vec2 a;
void main(){ gl_Position = vec4(a,0.,1.); }`;

const FRAG = `#version 300 es
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform float uP;
uniform vec2 uMouse;
out vec4 o;

vec2 hash2(vec2 p){
  p = vec2(dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)));
  return -1.0 + 2.0*fract(sin(p)*43758.5453123);
}
float hash1(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233)))*43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f*f*(3.0-2.0*f);
  return mix(mix(dot(hash2(i), f), dot(hash2(i+vec2(1,0)), f-vec2(1,0)), u.x),
             mix(dot(hash2(i+vec2(0,1)), f-vec2(0,1)), dot(hash2(i+vec2(1,1)), f-vec2(1,1)), u.x), u.y);
}
float fbm(vec2 p){
  float f = 0.0, a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for(int i=0;i<4;i++){ f += a*noise(p); p = m*p; a *= 0.5; }
  return f;
}

// Hand-painted cocoa-butter drops (like the painted tablets & trees)
vec4 paint(vec2 uv, float amt){
  vec4 acc = vec4(0.0);
  for(int k=0;k<3;k++){
    float sc = 3.0 + float(k)*2.3;
    vec2 g = uv*sc + float(k)*7.31;
    vec2 id = floor(g), f = fract(g) - 0.5;
    float r = hash1(id + float(k));
    if (r > amt*0.32) continue;
    vec2 off = (vec2(hash1(id+3.1), hash1(id+5.7)) - 0.5)*0.5;
    float wob = noise(g*3.0 + float(k))*0.12;
    float rad = 0.05 + 0.11*hash1(id+9.2)*hash1(id+2.7);
    float d = length((f - off)*vec2(1.0, 1.0 + 0.6*hash1(id+1.3))) - rad + wob;
    float m = 1.0 - smoothstep(-0.02, 0.02, d);
    float rr = r/max(amt*0.32, 0.001);
    vec3 c = rr < 0.4 ? vec3(0.80,0.62,0.30) : (rr < 0.7 ? vec3(0.58,0.12,0.18) : (rr < 0.88 ? vec3(0.36,0.50,0.32) : vec3(0.16,0.10,0.08)));
    acc = mix(acc, vec4(c, 1.0), m);
  }
  return acc;
}

void main(){
  vec2 uv = (gl_FragCoord.xy - 0.5*uRes) / uRes.y;
  float t = uTime;
  float P = uP;

  // Stage weights
  float sPour  = 1.0 - smoothstep(0.16, 0.32, P);
  float sSwirl = smoothstep(0.34, 0.5, P) * (1.0 - smoothstep(0.62, 0.74, P));
  float sWhite = smoothstep(0.58, 0.74, P);
  float sPaint = smoothstep(0.64, 0.82, P);

  // Tempering swirl: rotate space around centre, stronger near the middle
  float r2 = dot(uv, uv);
  float ang = sSwirl * 2.4 * exp(-r2*1.6) + 0.15*sin(t*0.2);
  ang += (uMouse.x - 0.5) * 0.25 * exp(-r2*2.0);
  mat2 rot = mat2(cos(ang), -sin(ang), sin(ang), cos(ang));
  vec2 p = rot * uv * 1.55;

  // Domain-warped liquid surface
  float speed = mix(0.09, 0.05, sSwirl);
  vec2 q = vec2(fbm(p + vec2(0.0, t*speed)), fbm(p + vec2(5.2, 1.3) - t*speed*0.8));
  vec2 r = vec2(fbm(p + 2.8*q + vec2(1.7, 9.2) + t*speed*1.2), fbm(p + 2.8*q + vec2(8.3, 2.8)));
  float h = fbm(p + 2.4*r) * 0.9 + 0.5;

  // Pouring ribbon + ripples where it lands
  vec2 impact = vec2(0.08*sin(t*0.4), -0.05);
  float wob = 0.03*sin(uv.y*6.0 - t*2.0) + 0.02*noise(vec2(uv.y*3.0, t*0.7));
  float sx = abs(uv.x - impact.x - wob);
  float w = 0.06 + 0.015*sin(uv.y*9.0 + t*3.0);
  float ribbon = exp(-(sx/w)*(sx/w)*1.6) * smoothstep(impact.y - 0.02, impact.y + 0.06, uv.y) * sPour;
  float d = length((uv - impact) * vec2(1.0, 1.7));
  float ripple = sin(d*34.0 - t*3.2) * exp(-d*3.2) * 0.12 * sPour;
  h += ripple + ribbon*0.55;

  // Normals from screen-space derivatives
  float k = uRes.y * 0.018;
  vec3 n = normalize(vec3(-dFdx(h)*k, -dFdy(h)*k, 1.0));

  // Chocolate colours: dark → milk → white
  vec3 dark  = vec3(0.24, 0.12, 0.07);
  vec3 milk  = vec3(0.52, 0.30, 0.17);
  vec3 white = vec3(0.97, 0.91, 0.80);
  vec3 base = mix(dark, milk, smoothstep(0.18, 0.42, P));
  base = mix(base, white, sWhite);

  // Painted drops sit on top of the white chocolate
  vec4 pt = paint(p*0.9 + r*0.15, sPaint);
  base = mix(base, pt.rgb, pt.a * sPaint);

  vec3 L = normalize(vec3(-0.5, 0.6, 0.6));
  vec3 V = vec3(0.0, 0.0, 1.0);
  vec3 H = normalize(L + V);
  float diff = clamp(dot(n, L), 0.0, 1.0);
  float gloss = mix(38.0, 60.0, sSwirl);
  float spec = pow(clamp(dot(n, H), 0.0, 1.0), gloss);
  float spec2 = pow(clamp(dot(n, normalize(vec3(0.6, -0.2, 1.0))), 0.0, 1.0), 18.0);
  float fres = pow(1.0 - clamp(n.z, 0.0, 1.0), 2.0);

  vec3 col = base * (0.28 + 1.0*diff);
  col += spec * mix(vec3(1.0, 0.86, 0.66), vec3(1.0), sWhite) * mix(1.25, 0.7, sWhite);
  col += spec2 * base * 0.6;
  col += fres * vec3(0.85, 0.62, 0.36) * 0.22;
  col *= mix(0.72 + 0.4*h, 0.9 + 0.15*h, sWhite);

  // Vignette, subtle warm grade and film grain
  float vig = smoothstep(1.25, 0.25, length(uv*vec2(0.9, 1.1)));
  col *= mix(0.55, 1.0, vig);
  col = pow(col, vec3(0.95));
  col += (hash1(gl_FragCoord.xy + fract(t)*100.0) - 0.5) * 0.025;

  o = vec4(col, 1.0);
}`;

export default function ChocolateCanvas({ progress }: { progress: React.RefObject<number> }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const gl = canvas.getContext("webgl2", { antialias: false, alpha: false, powerPreference: "high-performance" });
    if (!gl || gl.isContextLost()) {
      canvas.dataset.fallback = "true";
      return;
    }

    const sh = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.warn("shader:", gl.getShaderInfoLog(s));
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.warn("program:", gl.getProgramInfoLog(prog));
      canvas.dataset.fallback = "true";
      return;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "a");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "uRes");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uP = gl.getUniformLocation(prog, "uP");
    const uMouse = gl.getUniformLocation(prog, "uMouse");

    const mobile = window.matchMedia("(max-width: 760px)").matches;
    const scale = Math.max(0.75, Math.min(window.devicePixelRatio || 1, 2) * (mobile ? 0.5 : 0.6));

    const resize = () => {
      const w = Math.max(1, Math.round(canvas.clientWidth * scale));
      const h = Math.max(1, Math.round(canvas.clientHeight * scale));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
    const onMove = (e: PointerEvent) => {
      mouse.tx = e.clientX / window.innerWidth;
      mouse.ty = e.clientY / window.innerHeight;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let raf = 0;
    let visible = true;
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(frame);
    });
    io.observe(canvas);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let p = progress.current ?? 0;
    const start = performance.now();

    function frame(now: number) {
      raf = 0;
      if (!visible || document.hidden) return;
      const target = progress.current ?? 0;
      p = reduced ? target : p + (target - p) * 0.08;
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;
      gl!.uniform2f(uRes, canvas.width, canvas.height);
      gl!.uniform1f(uTime, reduced ? 12 : (now - start) / 1000);
      gl!.uniform1f(uP, p);
      gl!.uniform2f(uMouse, mouse.x, mouse.y);
      gl!.drawArrays(gl!.TRIANGLES, 0, 3);
      if (!reduced) raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    const onVis = () => {
      if (!document.hidden && !raf) raf = requestAnimationFrame(frame);
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVis);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
    };
  }, [progress]);

  return <canvas ref={ref} aria-hidden="true" />;
}
