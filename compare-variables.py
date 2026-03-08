#!/usr/bin/env python3
"""Compare API token colors/fonts against Pencil variables."""
import json

with open('/tmp/hearst_tokens_full.json') as f:
    data = json.load(f)

values = data.get('values', {})
primitives = values.get('Primitives/White Label', {})
white_label_alias = values.get('Alias/White Label', {})

def resolve_ref(ref_str, token_set):
    if not isinstance(ref_str, str) or not ref_str.startswith('{'):
        return ref_str
    path = ref_str.strip('{}').split('.')
    for check_set in [token_set, white_label_alias, primitives]:
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
                    return resolve_ref(val, token_set)
                return val
            elif isinstance(current, str):
                if current.startswith('{'):
                    return resolve_ref(current, token_set)
                return current
    return ref_str

brands = [
    "White Label", "Autoweek", "Best Products", "Bicycling", "Biography",
    "Car and Driver", "Cosmopolitan", "Country Living", "Delish", "ELLE",
    "ELLE Decor", "Esquire", "Good Housekeeping", "Harper's BAZAAR",
    "House Beautiful", "Men's Health", "Oprah Daily", "Popular Mechanics",
    "Prevention", "Redbook", "Road & Track", "Runner's World", "Seventeen",
    "The Pioneer Woman", "Town & Country", "Veranda", "Woman's Day", "Women's Health"
]

# Current Pencil variable values (from get_variables output)
pencil_colors = {
    "White Label":        {"1": "#000000", "2": "#ffffff", "3": "#ffffff", "4": "#ffffff", "5": "#ffffff", "6": "#ffffff"},
    "Autoweek":           {"1": "#ffc84e", "2": "#ffffff", "3": "#2c6f74", "4": "#e96c28", "5": "#dae5d3", "6": "#f8f4f5"},
    "Best Products":      {"1": "#1c1c9b", "2": "#ffffff", "3": "#1a847f", "4": "#24adcc", "5": "#f8e4dd", "6": "#eaf6f6"},
    "Bicycling":          {"1": "#067ea7", "2": "#ffffff", "3": "#EF4129", "4": "#ffffff", "5": "#ffffff", "6": "#ffffff"},
    "Biography":          {"1": "#a00000", "2": "#ffffff", "3": "#ffffff", "4": "#ffffff", "5": "#ffffff", "6": "#ffffff"},
    "Car and Driver":     {"1": "#1B5F8A", "2": "#00A4DB", "3": "#D2232A", "4": "#DBCA8B", "5": "#607D8B", "6": "#F1F7F7"},
    "Cosmopolitan":       {"1": "#d70000", "2": "#F6D3E5", "3": "#ffffff", "4": "#ffffff", "5": "#ffffff", "6": "#ffffff"},
    "Country Living":     {"1": "#0a5c80", "2": "#ffffff", "3": "#fff9ed", "4": "#3e93c3", "5": "#78756b", "6": "#9ecde1"},
    "Delish":             {"1": "#004685", "2": "#ffffff", "3": "#ff553e", "4": "#adcf21", "5": "#66cecf", "6": "#c6e9f0"},
    "ELLE":               {"1": "#000000", "2": "#f5f5f4", "3": "#f0ede6", "4": "#ffffff", "5": "#ffffff", "6": "#ffffff"},
    "ELLE Decor":         {"1": "#3777bc", "2": "#ffffff", "3": "#ffffff", "4": "#ffffff", "5": "#ffffff", "6": "#ffffff"},
    "Esquire":            {"1": "#ff3a30", "2": "#f5f6f8", "3": "#15263d", "4": "#ff5a52", "5": "#e00b00", "6": "#ececec"},
    "Good Housekeeping":  {"1": "#53c2be", "2": "#ffffff", "3": "#125c68", "4": "#f8f3f4", "5": "#9e3326", "6": "#d24432"},
    "Harper's BAZAAR":    {"1": "#000000", "2": "#ffffff", "3": "#ff0000", "4": "#77747b", "5": "#ff5e5e", "6": "#ffffff"},
    "House Beautiful":    {"1": "#242d39", "2": "#ffffff", "3": "#f5f2ee", "4": "#ffffff", "5": "#ffffff", "6": "#ffffff"},
    "Men's Health":       {"1": "#d2232e", "2": "#ffffff", "3": "#202020", "4": "#696969", "5": "#878787", "6": "#ffffff"},
    "Oprah Daily":        {"1": "#e61957", "2": "#ffffff", "3": "#bef264", "4": "#fde047", "5": "#4a044e", "6": "#bae6fd"},
    "Popular Mechanics":  {"1": "#1c6a65", "2": "#ffffff", "3": "#fef837", "4": "#595959", "5": "#414141", "6": "#ececec"},
    "Prevention":         {"1": "#44c1c5", "2": "#ffffff", "3": "#fcd029", "4": "#33a0a3", "5": "#088092", "6": "#ffffff"},
    "Redbook":            {"1": "#d30c4f", "2": "#ffffff", "3": "#b2003c", "4": "#f8bbd0", "5": "#ffffff", "6": "#ffffff"},
    "Road & Track":       {"1": "#434343", "2": "#ffffff", "3": "#b4b3b3", "4": "#ffffff", "5": "#668892", "6": "#bb322f"},
    "Runner's World":     {"1": "#59e7ed", "2": "#ffffff", "3": "#17d0d8", "4": "#dffafc", "5": "#cc3d00", "6": "#b2cccb"},
    "Seventeen":          {"1": "#ff92de", "2": "#ffffff", "3": "#f1dce1", "4": "#ffffff", "5": "#ffffff", "6": "#ffffff"},
    "The Pioneer Woman":  {"1": "#8B376C", "2": "#ffffff", "3": "#242424", "4": "#ffffff", "5": "#ffffff", "6": "#ffffff"},
    "Town & Country":     {"1": "#9a0500", "2": "#ffffff", "3": "#f1f2f4", "4": "#092958", "5": "#F1F6FE", "6": "#ffffff"},
    "Veranda":            {"1": "#f3ead9", "2": "#ffffff", "3": "#ffffff", "4": "#ffffff", "5": "#ffffff", "6": "#ffffff"},
    "Woman's Day":        {"1": "#683d85", "2": "#ffffff", "3": "#ee4741", "4": "#ffffff", "5": "#ffffff", "6": "#ffffff"},
    "Women's Health":     {"1": "#1d4ed8", "2": "#ffffff", "3": "#14b8a6", "4": "#e9d5ff", "5": "#f9a8d4", "6": "#ffedd5"},
}

pencil_fonts = {
    "White Label":       {"default": "SF Pro", "serif": "SF Pro"},
    "Autoweek":          {"default": "SF Pro", "serif": "SF Pro"},
    "Best Products":     {"default": "SF Pro", "serif": "SF Pro"},
    "Bicycling":         {"default": "SF Pro", "serif": "SF Pro"},
    "Biography":         {"default": "SF Pro", "serif": "SF Pro"},
    "Car and Driver":    {"default": "Inter", "serif": "Lora"},
    "Cosmopolitan":      {"default": "Basis Grotesque Pro", "serif": "Chronicle Display"},
    "Country Living":    {"default": "SF Pro", "serif": "PlayfairDisplay"},
    "Delish":            {"default": "TT Commons Pro", "serif": "SF Pro"},
    "ELLE":              {"default": "Neue Haas Unica Pro", "serif": "Modern MT Pro"},
    "ELLE Decor":        {"default": "SF Pro", "serif": "SF Pro"},
    "Esquire":           {"default": "Lausanne", "serif": "PlayFair"},
    "Good Housekeeping": {"default": "Barlow Semi Condensed", "serif": "Shippori Mincho"},
    "Harper's BAZAAR":   {"default": "Helvetica Now Text", "serif": "NewParis Text"},
    "House Beautiful":   {"default": "Visuelt Pro", "serif": "Apparel Display"},
    "Men's Health":      {"default": "Manrope", "serif": "SF Pro"},
    "Oprah Daily":       {"default": "SF Pro", "serif": "SF Pro"},
    "Popular Mechanics": {"default": "SF Pro", "serif": "SF Pro"},
    "Prevention":        {"default": "Poppins", "serif": "SF Pro"},
    "Redbook":           {"default": "SF Pro", "serif": "SF Pro"},
    "Road & Track":      {"default": "SF Pro", "serif": "SF Pro"},
    "Runner's World":    {"default": "SF Pro", "serif": "SF Pro"},
    "Seventeen":         {"default": "SF Pro", "serif": "SF Pro"},
    "The Pioneer Woman": {"default": "Livvic", "serif": "Petrona"},
    "Town & Country":    {"default": "Montserrat", "serif": "NewParis Text"},
    "Veranda":           {"default": "SF Pro", "serif": "SF Pro"},
    "Woman's Day":       {"default": "SF Pro", "serif": "SF Pro"},
    "Women's Health":    {"default": "Altone", "serif": "Apparel"},
}

# Now compare
issues = []

for brand in brands:
    alias_key = f"Alias/{brand}"
    brand_tokens = values.get(alias_key, {})
    palette = brand_tokens.get('palette', {}).get('brand', {})
    
    # For brands with numbered palette (1-6), compare directly
    api_colors = {}
    for key in ['1', '2', '3', '4', '5', '6']:
        if key in palette:
            val = palette[key]
            if isinstance(val, dict) and 'value' in val:
                resolved = resolve_ref(val['value'], brand_tokens)
                api_colors[key] = resolved
    
    # For Car and Driver (named palette), already fixed
    if brand == "Car and Driver":
        continue  # Already verified and fixed
    
    pencil = pencil_colors.get(brand, {})
    
    for slot in ['1', '2', '3', '4', '5', '6']:
        api_val = api_colors.get(slot, '#ffffff')
        pencil_val = pencil.get(slot, '#ffffff')
        if api_val.lower() != pencil_val.lower():
            issues.append(f"COLOR MISMATCH: {brand} brand-{slot}: API={api_val} Pencil={pencil_val}")
    
    # Compare fonts
    font = brand_tokens.get('font', {}).get('family', {})
    api_default = None
    api_serif = None
    if 'default' in font and isinstance(font['default'], dict):
        api_default = resolve_ref(font['default'].get('value', ''), brand_tokens)
    elif 'default' in font:
        api_default = font['default']
    if 'serif' in font and isinstance(font['serif'], dict):
        if 'primary' in font['serif'] and isinstance(font['serif']['primary'], dict):
            api_serif = resolve_ref(font['serif']['primary'].get('value', ''), brand_tokens)
    
    pf = pencil_fonts.get(brand, {})
    if api_default and pf.get('default') and api_default != pf['default']:
        issues.append(f"FONT MISMATCH: {brand} default: API={api_default} Pencil={pf['default']}")
    if api_serif and pf.get('serif') and api_serif != pf['serif']:
        issues.append(f"FONT MISMATCH: {brand} serif: API={api_serif} Pencil={pf['serif']}")

if issues:
    print(f"\n=== FOUND {len(issues)} ISSUES ===")
    for issue in issues:
        print(f"  {issue}")
else:
    print("\n=== ALL BRANDS MATCH ===")
