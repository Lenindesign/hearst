#!/usr/bin/env python3
"""Generate batch_design operations for Pencil MCP."""
import json

with open("/Users/leninaviles/Projects/hearst/svg_data.json") as f:
    data = json.load(f)

# Exclude pioneer (Fvyz7) - geometry too large (~294k chars)
items = [d for d in data if "error" not in d and d["node_id"] != "Fvyz7"]

def build_op(item):
    props = f'type: "path", width: 120, height: {item["height"]}, fill: "#000000", geometry: "{item["geometry"]}"'
    if item.get("fill_rule"):
        props = props.replace('geometry:', 'fillRule: "evenodd", geometry:')
    return f'R("{item["node_id"]}", {{{props}}})'

# Create batches of 4
batches = []
for i in range(0, len(items), 4):
    batch = items[i:i+4]
    ops = "\n".join(build_op(b) for b in batch)
    batches.append(([b["node_id"] for b in batch], ops))

for ids, ops in batches:
    print(f"Batch {ids}:")
    print(f"  Length: {len(ops)} chars")
    print()

# Output first batch to file for inspection
with open("/Users/leninaviles/Projects/hearst/batch1_ops.txt", "w") as f:
    f.write(batches[0][1])
print("Wrote batch1_ops.txt (first 4 ops)")
