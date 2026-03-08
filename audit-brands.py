#!/usr/bin/env python3
"""Extract brand colors and fonts from Hearst token API data and compare with Pencil variables."""
import json
import re
import sys

with open('/tmp/hearst_tokens_full.json') as f:
    data = json.load(f)

values = data.get('values', {})
primitives = values.get('Primitives/White Label', {})
white_label_alias = values.get('Alias/White Label', {})

def resolve_ref(ref_str, token_set, fallback_sets=None):
    """Resolve a {reference} token to its actual value."""
    if not isinstance(ref_str, str) or not ref_str.startswith('{'):
        return ref_str
    path = ref_str.strip('{}').split('.')
    
    sets_to_check = [token_set]
    if fallback_sets:
        sets_to_check.extend(fallback_sets)
    sets_to_check.append(white_label_alias)
    sets_to_check.append(primitives)
    
    for check_set in sets_to_check:
        current = check_set
        for part in path:
            if isinstance(current, dict) and part in current:
                current = current[part]
            else:
                current = None
                break
        if current is not None:
            if isinstance(current, dict) and 'value' in current:
                val = current['value']
                if isinstance(val, str) and val.startswith('{'):
                    return resolve_ref(val, token_set, fallback_sets)
                return val
            elif isinstance(current, str):
                if current.startswith('{'):
                    return resolve_ref(current, token_set, fallback_sets)
                return current
    return ref_str

brands_to_check = [
    "White Label", "Autoweek", "Best Products", "Bicycling", "Biography",
    "Car and Driver", "Cosmopolitan", "Country Living", "Delish", "ELLE",
    "ELLE Decor", "Esquire", "Good Housekeeping", "Harper's BAZAAR",
    "House Beautiful", "Men's Health", "Oprah Daily", "Popular Mechanics",
    "Prevention", "Redbook", "Road & Track", "Runner's World", "Seventeen",
    "The Pioneer Woman", "Town & Country", "Veranda", "Woman's Day", "Women's Health"
]

results = {}

for brand in brands_to_check:
    alias_key = f"Alias/{brand}"
    brand_tokens = values.get(alias_key, {})
    
    info = {"colors": {}, "fonts": {}}
    
    # Extract palette.brand colors
    palette = brand_tokens.get('palette', {})
    brand_palette = palette.get('brand', {})
    if brand_palette:
        for color_name, color_data in brand_palette.items():
            if isinstance(color_data, dict) and color_data.get('type') == 'color':
                val = color_data.get('value', '')
                resolved = resolve_ref(val, brand_tokens, [])
                info['colors'][color_name] = resolved
    
    # Extract font families
    font = brand_tokens.get('font', {})
    family = font.get('family', {})
    if family:
        for font_key, font_data in family.items():
            if isinstance(font_data, dict):
                if 'value' in font_data:
                    val = font_data['value']
                    resolved = resolve_ref(val, brand_tokens, [])
                    info['fonts'][font_key] = resolved
                else:
                    for sub_key, sub_data in font_data.items():
                        if isinstance(sub_data, dict) and 'value' in sub_data:
                            val = sub_data['value']
                            resolved = resolve_ref(val, brand_tokens, [])
                            info['fonts'][f"{font_key}.{sub_key}"] = resolved
    
    results[brand] = info

# Print results
for brand, info in results.items():
    print(f"\n=== {brand} ===")
    if info['colors']:
        print("  COLORS:")
        for name, val in sorted(info['colors'].items()):
            print(f"    {name}: {val}")
    else:
        print("  COLORS: (none - uses White Label defaults)")
    if info['fonts']:
        print("  FONTS:")
        for name, val in sorted(info['fonts'].items()):
            print(f"    {name}: {val}")
    else:
        print("  FONTS: (none - uses White Label defaults)")
