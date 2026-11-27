#!/usr/bin/env python3
"""Build the scroll-scrubbed frame sequences (hero + "O zi în atelier") from the atelier clip.

Usage (from web/):  python3 scripts/build-frame-sequences.py "../assets/Clip scurt.mp4" [hero|atelier]

For each sequence writes public/<name>/d/0001.webp… (desktop, 1.85:1), public/<name>/m/0001.webp…
(phones, 4:5, cropped on each shot's subject) and src/lib/<name>-frames.json
(frame count + where each stage starts, 0..1).
"""
import json, os, shutil, subprocess, sys

SRC = sys.argv[1]
ONLY = sys.argv[2] if len(sys.argv) > 2 else None
FPS = 15          # frames per second of footage kept (scrolling blends neighbours)
XF = 0.25         # crossfade between shots, seconds

SEQUENCES = {
    # Shots: (start, end, focal x 0..1 for the crops, stage index)
    "hero": {
        "shots": [
            (42.00, 44.50, 0.42, 0),  # Callebaut 823 bag (desktop) — phones use the W2 bag below
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
        ],
        # Phone-only replacements (start, end, focal x), stretched to the desktop shot's length so
        # stage timings stay identical. The white W2 bag: its whole "CALLEBAUT" label fits in 4:5.
        "mobile_overrides": {0: (33.40, 34.80, 0.43)},
        "stages": 5,
    },
    # A day in the atelier, 07:00 → 22:00 — one moment per hour mark.
    "atelier": {
        "shots": [
            (10.00, 12.80, 0.50, 0),    # 07:00 Monica opens the door and walks in
            (67.75, 69.75, 0.45, 1),    # 10:00 arranging the hand-painted pralines
            (57.50, 59.10, 0.42, 2),    # 13:00 filling the mould
            (75.50, 77.00, 0.45, 3),    # 16:00 pralines placed one by one in the box
            (79.50, 81.25, 0.50, 3),    #       folding the red gift box
            (111.25, 112.90, 0.50, 4),  # 19:00 boxes ready to be picked up
            (0.75, 2.75, 0.45, 5),      # 22:00 outside — "Laborator ciocolată belgiană · Meredith"
        ],
        "mobile_overrides": {},
        "stages": 6,
    },
}

SRC_W, SRC_H = 3840, 1634
M_CROP_W = round(SRC_H * 4 / 5)   # 1307 (phones, 4:5)
D_CROP_W = round(SRC_H * 1.85)    # 3023 (desktop, 1.85:1 — fits 16:9 and 16:10 with little extra crop)


def graph(shots, overrides, kind):
    parts = []
    for i, (a, b, fx, _) in enumerate(shots):
        dur = b - a
        slow = 1.0
        if kind == "m" and i in overrides:
            a, b, fx = overrides[i]
            slow = dur / (b - a)
        f = f"[0:v]trim={a}:{b},setpts={slow:.4f}*(PTS-STARTPTS)"
        cw, out_w = (M_CROP_W, 800) if kind == "m" else (D_CROP_W, 1920)
        x = min(max(round(fx * SRC_W - cw / 2), 0), SRC_W - cw)
        f += f",crop={cw}:{SRC_H}:{x}:0,scale={out_w}:-2:flags=lanczos"
        # Slowed shots get blended in-between frames instead of duplicated ones.
        f += ",minterpolate=fps=25:mi_mode=blend" if slow > 1 else ",fps=25"
        f += f",trim=duration={dur:.3f}"
        parts.append(f + f",format=yuv420p[s{i}]")
    prev, off = "s0", shots[0][1] - shots[0][0]
    for i in range(1, len(shots)):
        off -= XF
        parts.append(f"[{prev}][s{i}]xfade=transition=fade:duration={XF}:offset={off:.3f}[x{i}]")
        prev, off = f"x{i}", off + shots[i][1] - shots[i][0]
    parts.append(f"[{prev}]fps={FPS}[out]")
    return ";".join(parts), off


def dims(path):
    r = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height",
                        "-of", "csv=p=0", path], capture_output=True, text=True, check=True).stdout.strip().split(",")
    return {"w": int(r[0]), "h": int(r[1])}


for name, cfg in SEQUENCES.items():
    if ONLY and name != ONLY:
        continue
    shots = cfg["shots"]
    stage_t, t = {}, 0.0
    for i, (a, b, _, st) in enumerate(shots):
        stage_t.setdefault(st, t if i == 0 else t - XF / 2)
        t += (b - a) - (XF if i else 0)

    root = os.path.join("public", name)
    for kind, quality in (("d", 58), ("m", 60)):
        out = os.path.join(root, kind)
        shutil.rmtree(out, ignore_errors=True)
        os.makedirs(out)
        fc, total = graph(shots, cfg["mobile_overrides"], kind)
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", SRC, "-filter_complex", fc, "-map", "[out]",
                        "-c:v", "libwebp", "-quality", str(quality), "-compression_level", "6",
                        os.path.join(out, "%04d.webp")], check=True)

    count = len(os.listdir(os.path.join(root, "d")))
    assert count == len(os.listdir(os.path.join(root, "m"))), f"{name}: desktop/mobile frame counts differ"
    manifest = {
        "count": count,
        "fps": FPS,
        "stages": [round(stage_t[s] / total, 4) for s in range(cfg["stages"])],
        "desktop": dims(os.path.join(root, "d", "0001.webp")),
        "mobile": dims(os.path.join(root, "m", "0001.webp")),
    }
    with open(os.path.join("src", "lib", f"{name}-frames.json"), "w") as f:
        json.dump(manifest, f, indent=2)
    print(name, json.dumps(manifest))
