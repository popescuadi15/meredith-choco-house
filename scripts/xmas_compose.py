"""Compose the Christmas set images from the parts cut by xmas_parts.py.
  Little Christmas   = brăduț + globuri
  Meredith Christmas = brăduț + globuri + mini tablete cu zmeură
Usage: python3 scripts/xmas_compose.py <parts_dir> <out_dir>"""
import sys
from PIL import Image

parts, out = sys.argv[1], sys.argv[2]
W, TREE_H = 1900, 1600


def load(name):
    return Image.open(f"{parts}/{name}.png").convert("RGBA")


def bauble(name, hook_right, d):
    # baubles were shot lying around the tree with the hook towards it → stand them up, hook on top
    b = load(name).rotate(90 if hook_right else -90, expand=True, resample=Image.BICUBIC)
    return b.resize((d, round(b.height * d / b.width)), Image.LANCZOS)


def place(canvas, im, cx, cy, angle=0):
    if angle:
        im = im.rotate(angle, expand=True, resample=Image.BICUBIC)
    canvas.alpha_composite(im, (round(cx - im.width / 2), round(cy - im.height / 2)))


def compose(tree, baubles, minis, H, path):
    c = Image.new("RGBA", (W, H))
    t = load(tree)
    t = t.resize((round(t.width * TREE_H / t.height), TREE_H), Image.LANCZOS)
    base = 1660  # tree foot line
    sides, front = baubles[:4], baubles[4:]
    # back pair beside the upper-middle tiers, then a lower pair at the foot
    for (n, hr), (x, y, d, a) in zip(sides, [(230, 1060, 360, -10), (1670, 1060, 360, 12), (330, 1500, 400, 6), (1570, 1500, 400, -8)]):
        place(c, bauble(n, hr, d), x, y, a)
    place(c, t, W / 2, base - TREE_H / 2)
    for (n, hr), (x, y, d, a) in zip(front, [(640, 1700, 420, -6), (1260, 1700, 420, 8)]):
        place(c, bauble(n, hr, d), x, y, a)
    for (n, w, x, y, a) in minis:
        m = load(n)
        m = m.resize((w, round(m.height * w / m.width)), Image.LANCZOS)
        place(c, m, x, y, a)
    bb = c.getbbox()
    c = c.crop((0, max(0, bb[1] - 20), W, min(H, bb[3] + 20)))
    c.save(path, "WEBP", quality=88, method=6)
    print(path, c.size)


# hook_right: True for baubles that sat left of the tree in the photo
compose(
    "alb-0",
    [("alb-7", True), ("alb-3", False), ("alb-4", True), ("alb-1", False), ("alb-6", True), ("alb-2", False)],
    [],
    1960,
    f"{out}/little-christmas.webp",
)
compose(
    "lapte-0",
    [("lapte-3", True), ("lapte-4", False), ("lapte-1", True), ("lapte-2", False)],
    [("mini-2", 500, 560, 1760, 8), ("mini-0", 530, 1350, 1770, -8)],
    2040,
    f"{out}/meredith-christmas.webp",
)
