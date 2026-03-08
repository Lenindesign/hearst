#!/usr/bin/env python3
"""Extract SVG path data for Pencil batch_design operations."""
import re
import os
import json
import sys

BRANDS_DIR = "/Users/leninaviles/Projects/hearst/brands"

BRAND_MAP = {
    "Cosmopolitan": {"file": "cosmo.svg", "instance": "1qiHT"},
    "White Label": {"file": None, "instance": "3kKnY"},
    "Autoweek": {"file": "autoweek.svg", "instance": "as0Gx"},
    "Best Products": {"file": "bestproducts.svg", "instance": "pXDB0"},
    "Bicycling": {"file": "logo.063cc2c.svg", "instance": "yngcV"},
    "Biography": {"file": "biography.svg", "instance": "tKxCy"},
    "Car and Driver": {"file": "caranddriver.svg", "instance": "pg1XZ"},
    "Country Living": {"file": "country.svg", "instance": "ZwpPM"},
    "Delish": {"file": "delish.svg", "instance": "ROV71"},
    "ELLE": {"file": "logo.2856426.svg", "instance": "mIPHq"},
    "ELLE Decor": {"file": "elle-decor.svg", "instance": "tB3Aa"},
    "Esquire": {"file": "logo.20861e6.svg", "instance": "qZVWj"},
    "Good Housekeeping": {"file": "good-housekeeping.svg", "instance": "j8w1W"},
    "Harper's BAZAAR": {"file": "harpers.svg", "instance": "XFgzb"},
    "House Beautiful": {"file": "house.svg", "instance": "YQSAc"},
    "Men's Health": {"file": "mens.svg", "instance": "IZ5dR"},
    "Oprah Daily": {"file": "oprah.svg", "instance": "jTDkD"},
    "Popular Mechanics": {"file": "popular.svg", "instance": "Kadcf"},
    "Prevention": {"file": "prevention.svg", "instance": "1rou8"},
    "Redbook": {"file": "redbook.svg", "instance": "LV0pM"},
    "Road & Track": {"file": "roadandtrack.svg", "instance": "TJiAS"},
    "Runner's World": {"file": "runners.svg", "instance": "aJDNW"},
    "Seventeen": {"file": "seventeen.svg", "instance": "ouDor"},
    "The Pioneer Woman": {"file": "pioneer.svg", "instance": "ivUD2"},
    "Town & Country": {"file": "town.svg", "instance": "bJu2J"},
    "Veranda": {"file": "veranda.svg", "instance": "pm8Dt"},
    "Woman's Day": {"file": "womans.svg", "instance": "0gz7r"},
    "Women's Health": {"file": "womenshealth.svg", "instance": "Le3JX"},
}

TARGET_WIDTH = 140
LOGO_FILL = "#ffffff"

def extract_svg_data(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    vb_match = re.search(r'viewBox=["\']([^"\']+)["\']', content)
    if not vb_match:
        w_match = re.search(r'width=["\']([0-9.]+)', content)
        h_match = re.search(r'height=["\']([0-9.]+)', content)
        if w_match and h_match:
            vb_w = float(w_match.group(1))
            vb_h = float(h_match.group(1))
        else:
            return None
    else:
        parts = vb_match.group(1).split()
        vb_w = float(parts[2])
        vb_h = float(parts[3])

    paths = re.findall(r'<path[^>]*\bd=["\']([^"\']+)["\']', content)
    if not paths:
        return None

    fill_rule = "evenodd" if 'fill-rule="evenodd"' in content or "fill-rule='evenodd'" in content else "nonzero"

    geometry = " ".join(paths)

    aspect = vb_h / vb_w
    target_h = round(TARGET_WIDTH * aspect, 1)

    return {
        "viewBox_w": vb_w,
        "viewBox_h": vb_h,
        "geometry": geometry,
        "fillRule": fill_rule,
        "width": TARGET_WIDTH,
        "height": target_h,
    }

results = []
for brand, info in BRAND_MAP.items():
    if info["file"] is None:
        continue
    filepath = os.path.join(BRANDS_DIR, info["file"])
    if not os.path.exists(filepath):
        print(f"SKIP {brand}: file not found {info['file']}", file=sys.stderr)
        continue
    fsize = os.path.getsize(filepath)
    if fsize > 50000:
        print(f"LARGE {brand}: {info['file']} ({fsize} bytes) - path may be too long", file=sys.stderr)
        continue

    data = extract_svg_data(filepath)
    if data is None:
        print(f"SKIP {brand}: no path data", file=sys.stderr)
        continue

    results.append({
        "brand": brand,
        "instance": info["instance"],
        "file": info["file"],
        **data,
    })

json.dump(results, sys.stdout, indent=2)
