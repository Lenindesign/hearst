#!/usr/bin/env python3
"""Extract path geometry from SVG files for Pencil batch_design."""
import re
import json

MAPPING = [
    ("hUL7G", "brands/cosmo.svg", 1789, 300, False),
    ("r7X5e", "brands/logo.2856426.svg", 737, 266, False),
    ("BOw2f", "brands/logo.20861e6.svg", 783, 116, False),
    ("N0pbd", "brands/good-housekeeping.svg", 940, 197, True),  # fill-rule evenodd
    ("TSIPI", "brands/harpers.svg", 1167, 300, True),  # fill-rule on g
    ("rkoVR", "brands/house.svg", 717.6, 135.6, False),
    ("V2hOh", "brands/mens.svg", 608, 125, False),
    ("tZ3Ai", "brands/oprah.svg", 388, 138, False),
    ("oK0xr", "brands/popular.svg", 596, 143, True),  # fill-rule evenodd
    ("R7MP1", "brands/prevention.svg", 1571, 300, False),
    ("WTdOz", "brands/redbook.svg", 1491, 300, False),
    ("fRfsJ", "brands/runners.svg", 693, 72, False),
    ("NVk68", "brands/seventeen.svg", 678, 170, False),
    ("EL9xO", "brands/town.svg", 600, 73, True),  # fill-rule evenodd
    ("RQBur", "brands/womans.svg", 1580, 300, False),
    ("8cYGM", "brands/womenshealth.svg", 579.884, 119.077, False),
    ("ikoF5", "brands/delish.svg", 1224, 343.5, False),
    ("9hiRL", "brands/country.svg", 389, 68, False),
    ("6uG9u", "brands/roadandtrack.svg", 425, 150, False),
    ("Fvyz7", "brands/pioneer.svg", 985, 300, False),
    ("iNzWT", "brands/caranddriver.svg", 1364, 263, False),
    ("c7bRY", "brands/biography.svg", 2611, 290, False),
    ("MBIrN", "brands/elle-decor.svg", 1284, 300, True),  # fill-rule evenodd
    ("nnfCV", "brands/veranda.svg", 550.7, 127.1, False),
]

def extract_paths(svg_content):
    """Extract all path d attributes, including from nested elements."""
    paths = re.findall(r'<path[^>]*\sd="([^"]+)"', svg_content, re.DOTALL)
    return paths

def main():
    import os
    base = "/Users/leninaviles/Projects/hearst"
    results = []
    
    for node_id, rel_path, vb_w, vb_h, fill_rule in MAPPING:
        path = os.path.join(base, rel_path)
        if not os.path.exists(path):
            results.append({"node_id": node_id, "error": "File not found", "path": path})
            continue
        try:
            with open(path) as f:
                content = f.read()
            paths = extract_paths(content)
            if not paths:
                results.append({"node_id": node_id, "error": "No paths found", "path": path})
                continue
            geometry = " ".join(paths)
            height = round(120 * vb_h / vb_w, 2)
            results.append({
                "node_id": node_id,
                "geometry": geometry,
                "height": height,
                "fill_rule": fill_rule,
                "geom_len": len(geometry)
            })
        except Exception as e:
            results.append({"node_id": node_id, "error": str(e), "path": path})
    
    with open("/Users/leninaviles/Projects/hearst/svg_data.json", "w") as f:
        json.dump(results, f, indent=2)
    print("Wrote svg_data.json")
    for r in results:
        if "error" in r:
            print(f"  {r['node_id']}: {r['error']}")
        else:
            print(f"  {r['node_id']}: h={r['height']}, geom_len={r['geom_len']}")

if __name__ == "__main__":
    main()
