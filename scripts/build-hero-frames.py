#!/usr/bin/env python3
"""Build the scroll-scrubbed hero frame sequences from the atelier clip.

Usage (from web/):  python3 scripts/build-hero-frames.py "../assets/Clip scurt.mp4"

Writes public/hero/d/0001.webp… (desktop, wide), public/hero/m/0001.webp… (mobile, 4:5,
cropped on each shot's subject) and src/lib/hero-frames.json (frame count + stage starts).
"""
import json, os, shutil, subprocess, sys

SRC = sys.argv[1]
FPS = 15          # frames per second of footage kept (scrolling blends neighbours)
XF = 0.25         # crossfade between shots, seconds

# (start, end, focal x 0..1 for the mobile crop, hero stage 0..4)
SHOTS = [
    (42.00, 44.50, 0.42, 0),  # Callebaut bag
    (37.75, 39.20, 0.45, 1),  # callets poured into the melter
    (40.95, 41.95, 0.45, 1),  # callets pile up
    (54.75, 55.95, 0.49, 2),  # chocolate stream
    (56.00, 57.50, 0.42, 2),  # filling the mould
    (61.50, 62.90, 0.45, 3),  # tree out of the mould
    (65.50, 66.70, 0.40, 3),  # painted pralines
    (73.75, 75.40, 0.50, 3),  # painted almond-shaped pralines
    (85.50, 86.90, 0.40, 4),  # Selection box
    (87.00, 88.10, 0.48, 4),  # gold tree with baubles
    (83.25, 84.10, 0.42, 4),  # red box with the Meredith logo
]

SRC_W, SRC_H = 3840, 1634
M_CROP_W = round(SRC_H * 4 / 5)   # 1307 (mobile, 4:5 — shown in the top part of the phone screen)
D_CROP_W = round(SRC_H * 1.85)      # 3023 (desktop, 1.85:1 — fits 16:9 and 16:10 screens with little extra crop)

def graph(kind):
    parts = []
    for i, (a, b, fx, _) in enumerate(SHOTS):
        f = f"[0:v]trim={a}:{b},setpts=PTS-STARTPTS,fps=25"
        cw, out_w = (M_CROP_W, 800) if kind == "m" else (D_CROP_W, 1920)
        x = min(max(round(fx * SRC_W - cw / 2), 0), SRC_W - cw)
        f += f",crop={cw}:{SRC_H}:{x}:0,scale={out_w}:-2:flags=lanczos"
        parts.append(f + f",format=yuv420p[s{i}]")
    prev, off = "s0", SHOTS[0][1] - SHOTS[0][0]
    for i in range(1, len(SHOTS)):
        off -= XF
        parts.append(f"[{prev}][s{i}]xfade=transition=fade:duration={XF}:offset={off:.3f}[x{i}]")
        prev, off = f"x{i}", off + SHOTS[i][1] - SHOTS[i][0]
    parts.append(f"[{prev}]fps={FPS}[out]")
    return ";".join(parts), off

stage_t = {}
t = 0.0
for i, (a, b, _, st) in enumerate(SHOTS):
    stage_t.setdefault(st, t if i == 0 else t - XF / 2)
    t += (b - a) - (XF if i else 0)

for kind, quality in (("d", 58), ("m", 60)):
    out = os.path.join("public", "hero", kind)
    shutil.rmtree(out, ignore_errors=True)
    os.makedirs(out)
    fc, total = graph(kind)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", SRC, "-filter_complex", fc, "-map", "[out]",
                    "-c:v", "libwebp", "-quality", str(quality), "-compression_level", "6",
                    os.path.join(out, "%04d.webp")], check=True)

def dims(path):
    r = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height",
                        "-of", "csv=p=0", path], capture_output=True, text=True, check=True).stdout.strip().split(",")
    return {"w": int(r[0]), "h": int(r[1])}

count = len(os.listdir(os.path.join("public", "hero", "d")))
assert count == len(os.listdir(os.path.join("public", "hero", "m"))), "desktop/mobile frame counts differ"
manifest = {
    "count": count,
    "fps": FPS,
    "stages": [round(stage_t[s] / total, 4) for s in range(5)],
    "desktop": dims(os.path.join("public", "hero", "d", "0001.webp")),
    "mobile": dims(os.path.join("public", "hero", "m", "0001.webp")),
}
with open(os.path.join("src", "lib", "hero-frames.json"), "w") as f:
    json.dump(manifest, f, indent=2)
print(json.dumps(manifest))
