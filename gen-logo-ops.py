#!/usr/bin/env python3
"""Generate batch_design operations to replace text logos with SVG paths."""
import re
import os
import json
import sys

BRANDS_DIR = "/Users/leninaviles/Projects/hearst/brands"

BRAND_MAP = [
    ("Cosmopolitan", "cosmo.svg", "1qiHT"),
    ("Autoweek", "autoweek.svg", "as0Gx"),
    ("Best Products", "bestproducts.svg", "pXDB0"),
    ("Bicycling", "logo.063cc2c.svg", "yngcV"),
    ("Biography", "biography.svg", "tKxCy"),
    ("Car and Driver", "caranddriver.svg", "pg1XZ"),
    ("Country Living", "country.svg", "ZwpPM"),
    ("Delish", "delish.svg", "ROV71"),
    ("ELLE", "logo.2856426.svg", "mIPHq"),
    ("ELLE Decor", "elle-decor.svg", "tB3Aa"),
    ("Esquire", "logo.20861e6.svg", "qZVWj"),
    ("Good Housekeeping", "good-housekeeping.svg", "j8w1W"),
    ("Harper's BAZAAR", "harpers.svg", "XFgzb"),
    ("House Beautiful", "house.svg", "YQSAc"),
    ("Men's Health", "mens.svg", "IZ5dR"),
    ("Oprah Daily", "oprah.svg", "jTDkD"),
    ("Popular Mechanics", "popular.svg", "Kadcf"),
    ("Prevention", "prevention.svg", "1rou8"),
    ("Redbook", "redbook.svg", "LV0pM"),
    ("Road & Track", "roadandtrack.svg", "TJiAS"),
    ("Runner's World", "runners.svg", "aJDNW"),
    ("Seventeen", "seventeen.svg", "ouDor"),
    ("Town & Country", "town.svg", "bJu2J"),
    ("Veranda", "veranda.svg", "pm8Dt"),
    ("Woman's Day", "womans.svg", "0gz7r"),
    ("Women's Health", "womenshealth.svg", "Le3JX"),
]

TARGET_WIDTH = 140

for brand, svg_file, instance_id in BRAND_MAP:
    filepath = os.path.join(BRANDS_DIR, svg_file)
    if not os.path.exists(filepath):
        continue
    fsize = os.path.getsize(filepath)
    if fsize > 50000:
        continue

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
            continue
    else:
        parts = vb_match.group(1).split()
        vb_w = float(parts[2])
        vb_h = float(parts[3])

    paths = re.findall(r'<path[^>]*\bd=["\']([^"\']+)["\']', content)
    if not paths:
        continue

    fill_rule = "evenodd" if 'fill-rule="evenodd"' in content else "nonzero"
    geometry = " ".join(paths)

    aspect = vb_h / vb_w
    target_h = round(TARGET_WIDTH * aspect, 1)

    fr_prop = ""
    if fill_rule == "evenodd":
        fr_prop = ', fillRule: "evenodd"'

    safe_name = brand.lower().replace(" ", "-").replace("'", "")
    op = f'R("{instance_id}/YljN2", {{type: "path", name: "{safe_name}-logo", width: {TARGET_WIDTH}, height: {target_h}, fill: "#ffffff"{fr_prop}, geometry: "{geometry}"}})'
    print(f"### {brand} (instance: {instance_id})")
    print(op)
    print()
