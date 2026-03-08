#!/usr/bin/env python3
"""Output batch operations as JSON for MCP call."""
import json

with open("/Users/leninaviles/Projects/hearst/svg_data.json") as f:
    data = json.load(f)

# Exclude pioneer (Fvyz7) - geometry too large
items = [d for d in data if "error" not in d and d["node_id"] != "Fvyz7"]

def build_op(item):
    geom_escaped = item["geometry"].replace("\\", "\\\\").replace('"', '\\"')
    base = f'type: "path", width: 120, height: {item["height"]}, fill: "#000000", geometry: "{geom_escaped}"'
    if item.get("fill_rule"):
        base = base.replace('geometry:', 'fillRule: "evenodd", geometry:')
    return f'R("{item["node_id"]}", {{{base}}})'

# Create batches of 4
batches = []
for i in range(0, len(items), 4):
    batch = items[i:i+4]
    ops = "\n".join(build_op(b) for b in batch)
    batches.append(ops)

# Output each batch as JSON (for MCP)
for i, ops in enumerate(batches):
    with open(f"/Users/leninaviles/Projects/hearst/batch_{i+1}.json", "w") as f:
        json.dump({"filePath": "/Users/leninaviles/Projects/hearst/pencil-new.pen", "operations": ops}, f)
    print(f"Batch {i+1}: {len(ops)} chars")
