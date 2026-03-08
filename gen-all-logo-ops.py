#!/usr/bin/env python3
"""Generate batch_design operations for all brand logos."""
import re
import os
import json
import sys

BRANDS_DIR = "/Users/leninaviles/Projects/hearst/brands"
TARGET_WIDTH = 140

with open("/Users/leninaviles/Projects/hearst/logo-mapping.json") as f:
    brands = json.load(f)

results = []
for brand in brands:
    svg_file = brand.get("svg")
    if not svg_file:
        continue

    filepath = os.path.join(BRANDS_DIR, svg_file)
    if not os.path.exists(filepath):
        print(f"SKIP {brand['brand']}: file not found", file=sys.stderr)
        continue

    fsize = os.path.getsize(filepath)
    if fsize > 100000:
        print(f"SKIP {brand['brand']}: file too large ({fsize})", file=sys.stderr)
        continue

    with open(filepath) as f:
        content = f.read()

    vb_match = re.search(r'viewBox=["\']([^"\']+)["\']', content)
    if not vb_match:
        w_match = re.search(r'width=["\']([0-9.]+)', content)
        h_match = re.search(r'height=["\']([0-9.]+)', content)
        if w_match and h_match:
            vb_w = float(w_match.group(1))
            vb_h = float(h_match.group(1))
        else:
            print(f"SKIP {brand['brand']}: no viewBox/dimensions", file=sys.stderr)
            continue
    else:
        parts = vb_match.group(1).split()
        vb_w = float(parts[2])
        vb_h = float(parts[3])

    paths = re.findall(r'<path[^>]*\bd=["\']([^"\']+)["\']', content)
    if not paths:
        print(f"SKIP {brand['brand']}: no path data", file=sys.stderr)
        continue

    fill_rule = "evenodd" if 'fill-rule="evenodd"' in content else "nonzero"
    geometry = " ".join(paths)

    aspect = vb_h / vb_w
    target_h = round(TARGET_WIDTH * aspect, 1)

    results.append({
        "brand": brand["brand"],
        "logo_area_id": brand["logo_area"],
        "logo_text_id": brand["logo_text"],
        "width": TARGET_WIDTH,
        "height": target_h,
        "fill_rule": fill_rule,
        "geometry": geometry,
    })

json.dump(results, sys.stdout, indent=2)
