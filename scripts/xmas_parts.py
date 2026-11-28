"""Cut the tree and the baubles out of the white-background Christmas photos.
Usage: python3 scripts/xmas_parts.py <out_dir>  → writes <name>-<k>.png parts, largest first."""
import sys
import numpy as np
from PIL import Image
from scipy import ndimage as nd

out = sys.argv[1]
SRC = {
    "alb": "public/images/photos/bradut-alb-globuri.jpg",
    "lapte": "public/images/photos/bradut-lapte-globuri.jpg",
}
for name, path in SRC.items():
    im = Image.open(path).convert("RGB")
    a = np.asarray(im).astype(np.float32)
    ink = 255 - a.min(2)  # 0 on the white backdrop
    solid = nd.binary_fill_holes(nd.binary_opening(ink > 14, iterations=2))
    lab, n = nd.label(solid)
    sizes = nd.sum(solid, lab, range(1, n + 1))
    keep = [i + 1 for i in np.argsort(-sizes) if sizes[i] > 4000]
    # soft edge: ramp alpha over the last few px of ink, eroded a touch to drop the white fringe
    soft = np.clip((ink - 6) / 30, 0, 1)
    for k, li in enumerate(keep):
        m = lab == li
        m = nd.binary_erosion(m, iterations=2)
        alpha = np.where(nd.binary_erosion(m, iterations=3), 1.0, soft) * m
        alpha = nd.gaussian_filter(alpha, 0.8)
        ys, xs = np.where(m)
        y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
        rgba = np.dstack([a, alpha * 255]).astype(np.uint8)[y0:y1, x0:x1]
        Image.fromarray(rgba, "RGBA").save(f"{out}/{name}-{k}.png")
        print(name, k, (x0, y0, x1 - x0, y1 - y0))
