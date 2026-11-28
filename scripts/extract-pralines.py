"""Cut single pralines out of the box photos (OpenCV GrabCut inside a hand-picked rectangle).
One praline type per filling, as shown in the Meredith Selection box section:
  fistic   = pale green pralines        caramel  = gold-dusted squares
  nocciola = milk domes with gold       cocos    = white painted flowers
Usage: python3 scripts/extract-pralines.py ../assets public/images/pralines"""
import sys, os
import cv2
import numpy as np

src, out = sys.argv[1], sys.argv[2]
os.makedirs(out, exist_ok=True)
BOXES = os.path.join(src, "Cutii praline.jpg")
MIX = os.path.join(src, "IMG_4681.png")
# (file, rect x0,y0,x1,y1, rotate° to square the praline with the box)
PIECES = {
    "fistic": [(BOXES, (3440, 1570, 3665, 1915), -30.5), (BOXES, (3180, 1725, 3395, 2075), -30.5), (BOXES, (2925, 1895, 3140, 2235), -30.5)],
    "caramel": [(MIX, (283, 1793, 467, 1967), 0), (MIX, (283, 2023, 472, 2207), 0), (MIX, (288, 2243, 472, 2417), 0)],
    "nocciola": [(MIX, (708, 1786, 930, 1990), 0), (MIX, (708, 2210, 930, 2420), 0), (MIX, (708, 2436, 930, 2646), 0)],
    "cocos": [(BOXES, (1750, 328, 2005, 568), 0), (BOXES, (2040, 608, 2300, 850), 0), (BOXES, (1455, 610, 1725, 850), 0)],
}


def rotate(rgba, deg):
    h, w = rgba.shape[:2]
    M = cv2.getRotationMatrix2D((w / 2, h / 2), deg, 1)
    cos, sin = abs(M[0, 0]), abs(M[0, 1])
    nw, nh = int(h * sin + w * cos), int(h * cos + w * sin)
    M[0, 2] += nw / 2 - w / 2
    M[1, 2] += nh / 2 - h / 2
    return cv2.warpAffine(rgba, M, (nw, nh), flags=cv2.INTER_CUBIC, borderValue=(0, 0, 0, 0))


def symmetrise(rgba):
    """The green pralines sit half under a box divider: stand the almond upright (long axis
    vertical) and rebuild the clipped half as a mirror of the intact one."""
    ys, xs = np.where(rgba[..., 3] > 128)
    pts = np.stack([xs, ys], 1).astype(np.float64)
    pts -= pts.mean(0)
    _, vecs = np.linalg.eigh(np.cov(pts.T))
    vx, vy = vecs[:, -1]  # long axis
    rgba = rotate(rgba, np.degrees(np.arctan2(vy, vx)) - 90)
    a = rgba[..., 3] > 128
    ys, xs = np.where(a)
    cx = int(round(xs.mean()))
    left, right = a[:, :cx].sum(), a[:, cx:].sum()
    w = min(cx, rgba.shape[1] - cx)
    if right >= left:
        half = rgba[:, cx : cx + w]
        rgba = np.concatenate([half[:, ::-1], half], 1)
    else:
        half = rgba[:, cx - w : cx]
        rgba = np.concatenate([half, half[:, ::-1]], 1)
    rgba = np.ascontiguousarray(rgba)
    # clean almond outline (two circle arcs) over the bounding box; refill the tips from the inside
    ys, xs = np.where(rgba[..., 3] > 128)
    y0, y1, x0, x1 = ys.min(), ys.max(), xs.min(), xs.max()
    rgba = rgba[y0 : y1 + 1, x0 : x1 + 1].copy()
    # the tips sat under the divider (dark smudges): drop the outer 7% at each end
    cut = int(rgba.shape[0] * 0.07)
    rgba = rgba[cut : rgba.shape[0] - cut].copy()
    h, w = rgba.shape[:2]
    a, b = h / 2, w / 2
    R = (a * a + b * b) / (2 * b)  # circle through both tips and the widest point
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float64)
    dy = yy - a
    lens = ((xx - R) ** 2 + dy**2 <= R * R) & ((xx - (w - R)) ** 2 + dy**2 <= R * R)  # left arc's centre sits right, and vice versa
    hole = (lens & (rgba[..., 3] < 200)).astype(np.uint8) * 255
    rgb = cv2.inpaint(np.ascontiguousarray(rgba[..., :3]), hole, 7, cv2.INPAINT_TELEA)
    alpha = cv2.GaussianBlur(lens.astype(np.float32) * 255, (0, 0), 1.2)
    return np.dstack([rgb, alpha.astype(np.uint8)])


cache = {}
for name, items in PIECES.items():
    for k, (path, (x0, y0, x1, y1), rot) in enumerate(items, 1):
        img = cache.setdefault(path, cv2.imread(path, cv2.IMREAD_COLOR))
        pad = 24
        crop = img[y0 - pad : y1 + pad, x0 - pad : x1 + pad].copy()
        mask = np.zeros(crop.shape[:2], np.uint8)
        bg, fg = np.zeros((1, 65), np.float64), np.zeros((1, 65), np.float64)
        cv2.grabCut(crop, mask, (pad, pad, x1 - x0, y1 - y0), bg, fg, 8, cv2.GC_INIT_WITH_RECT)
        m = np.where((mask == cv2.GC_FGD) | (mask == cv2.GC_PR_FGD), 255, 0).astype(np.uint8)
        if name in ("caramel", "nocciola"):
            # brown/gold chocolate vs grey-white box: saturation separates them better than GrabCut
            sat = cv2.cvtColor(crop, cv2.COLOR_BGR2HSV)[..., 1]
            m = np.where(sat > 70, 255, 0).astype(np.uint8)
            m = cv2.morphologyEx(m, cv2.MORPH_OPEN, np.ones((5, 5), np.uint8))
        # keep the biggest blob, fill holes, smooth the edge
        n, lab, stats, _ = cv2.connectedComponentsWithStats(m)
        m = np.where(lab == 1 + np.argmax(stats[1:, cv2.CC_STAT_AREA]), 255, 0).astype(np.uint8)
        cnts, _ = cv2.findContours(m, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
        m = np.zeros_like(m)
        if name in ("caramel", "nocciola"):
            cnts = [cv2.convexHull(max(cnts, key=cv2.contourArea))]
        if name == "nocciola":  # round domes: a fitted ellipse gives the clean outline the shadowed rim hides
            cv2.ellipse(m, cv2.fitEllipse(cnts[0]), 255, -1)
            # …but never past the chocolate itself (no white box showing at the rim)
            hsv = cv2.cvtColor(crop, cv2.COLOR_BGR2HSV)
            choc = ((hsv[..., 1] > 45) | (hsv[..., 2] < 90)).astype(np.uint8) * 255
            m = cv2.bitwise_and(m, cv2.erode(choc, np.ones((3, 3), np.uint8)))
        else:
            cv2.drawContours(m, cnts, -1, 255, -1)
        m = cv2.erode(m, np.ones((3, 3), np.uint8), iterations=2)
        if name == "nocciola":
            # the right rim hides under the box wall: complete the dome as a circle (from its
            # left edge and height) and paint the missing sliver from the surrounding chocolate
            ys, xs = np.where(m > 0)
            r = (ys.max() - ys.min()) / 2
            c = (int(xs.min() + r), int((ys.max() + ys.min()) / 2))
            circ = np.zeros_like(m)
            cv2.circle(circ, c, int(r), 255, -1)
            hole = cv2.bitwise_and(circ, cv2.bitwise_not(m))
            crop = cv2.inpaint(crop, cv2.dilate(hole, np.ones((5, 5), np.uint8)), 9, cv2.INPAINT_TELEA)
            m = circ
        m = cv2.GaussianBlur(m, (0, 0), 1.2)
        rgba = cv2.cvtColor(crop, cv2.COLOR_BGR2BGRA)
        rgba[..., 3] = m
        if rot:
            h, w = rgba.shape[:2]
            M = cv2.getRotationMatrix2D((w / 2, h / 2), rot, 1)
            cos, sin = abs(M[0, 0]), abs(M[0, 1])
            nw, nh = int(h * sin + w * cos), int(h * cos + w * sin)
            M[0, 2] += nw / 2 - w / 2
            M[1, 2] += nh / 2 - h / 2
            rgba = cv2.warpAffine(rgba, M, (nw, nh), flags=cv2.INTER_CUBIC, borderValue=(0, 0, 0, 0))
        if name == "fistic":
            rgba = symmetrise(rgba)
        ys, xs = np.where(rgba[..., 3] > 8)
        rgba = rgba[ys.min() : ys.max() + 1, xs.min() : xs.max() + 1]
        s = 320 / max(rgba.shape[:2])
        rgba = cv2.resize(rgba, None, fx=s, fy=s, interpolation=cv2.INTER_AREA)
        cv2.imwrite(os.path.join(out, f"{name}-{k}.webp"), rgba, [cv2.IMWRITE_WEBP_QUALITY, 92])
        print(name, k, rgba.shape)
