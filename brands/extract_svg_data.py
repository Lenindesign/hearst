#!/usr/bin/env python3
"""Extract path geometry data from SVG files."""
import re
import xml.etree.ElementTree as ET

FILES = [
    "mens.svg", "oprah.svg", "popular.svg", "prevention.svg", "redbook.svg",
    "roadandtrack.svg", "runners.svg", "seventeen.svg", "town.svg",
    "veranda.svg", "womans.svg", "womenshealth.svg"
]
BASE = "/Users/leninaviles/Projects/hearst/brands"

def extract_svg_data(filepath):
    tree = ET.parse(filepath)
    root = tree.getroot()
    
    # Get viewBox
    viewbox = root.get("viewBox", "")
    if viewbox:
        parts = viewbox.split()
        width, height = parts[2], parts[3] if len(parts) >= 4 else "0"
    else:
        width = root.get("width", "0").replace("px", "")
        height = root.get("height", "0").replace("px", "")
    
    # Check for fill-rule="evenodd" (on svg or any path)
    fill_rule = "nonzero"
    for elem in root.iter():
        if elem.get("fill-rule") == "evenodd" or elem.get("{http://www.w3.org/2000/svg}fill-rule") == "evenodd":
            fill_rule = "evenodd"
            break
    
    # Get all path d attributes
    ns = {"svg": "http://www.w3.org/2000/svg"}
    paths = root.findall(".//svg:path", ns)
    if not paths:
        paths = root.findall(".//path")
    
    d_values = []
    for p in paths:
        d = p.get("d") or p.get("{http://www.w3.org/2000/svg}d")
        if d:
            d_values.append(d)
    
    path_str = " ".join(d_values) if d_values else ""
    return width, height, fill_rule, path_str

def main():
    with open(f"{BASE}/svg-extracted-data.txt", "w") as out:
        out.write("SVG Path Geometry Extraction Results\n")
        out.write("=====================================\n\n")
        
        for fname in FILES:
            try:
                width, height, fill_rule, path_str = extract_svg_data(f"{BASE}/{fname}")
                out.write(f"{fname}: {width}x{height}, fillRule: {fill_rule}\n")
                out.write(f"PATH: {path_str}\n\n")
            except Exception as e:
                out.write(f"{fname}: ERROR - {e}\n\n")

if __name__ == "__main__":
    main()
    print("Extraction complete. See svg-extracted-data.txt")
