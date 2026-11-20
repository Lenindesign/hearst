"""Joins the spec films and the recorded live references into one MP4.
Order per chapter: title card, film(s), live title card, live clip."""
import json, os, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
APP = os.path.abspath(os.path.join(HERE, "..", "..", ".."))
P = os.path.join(APP, "public", "specs")
# Work dir holds cards/, live/ (from record-live.mjs) and seg2/. Usage: python3 join2.py <workDir> <out.mp4>
S = sys.argv[1]
OUT = sys.argv[2]
SEG = os.path.join(S, "seg2")
os.makedirs(SEG, exist_ok=True)
clips = json.load(open(os.path.join(S, "live", "clips.json")))
ENC = ["-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p", "-r", "30", "-video_track_timescale", "15360", "-an"]

def ff(*args):
    subprocess.run(["ffmpeg", "-v", "error", "-y", *args], check=True)

def dur(path):
    return float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path]).decode())

def card(name, seconds=2.5):
    out = os.path.join(SEG, f"{name}.mp4")
    fade_out = seconds - 0.3
    ff("-loop", "1", "-t", str(seconds), "-i", os.path.join(S, "cards", f"{name}.png"), "-vf", f"fps=30,fade=in:0:9,fade=out:st={fade_out}:d=0.3", *ENC, out)
    return out

def film(n, slug):
    src = os.path.join(P, f"{slug}-film.mp4")
    out = os.path.join(SEG, f"f{n}.mp4")
    d = dur(src)
    ff("-i", src, "-vf", f"scale=1920:1080:flags=lanczos,fps=30,fade=in:0:9,fade=out:st={d-0.3}:d=0.3", *ENC, out)
    return out

def live(key):
    c = clips[key]
    start = max(0, c["start"] - 0.2)
    length = c["end"] - start + 0.4
    out = os.path.join(SEG, f"live-{key}.mp4")
    ff("-ss", f"{start:.2f}", "-i", c["file"], "-t", f"{length:.2f}", "-vf", f"scale=1920:1080:flags=lanczos,fps=30,fade=in:0:9,fade=out:st={length-0.4:.2f}:d=0.4", *ENC, out)
    return out

chapters = [
    ("cta", [("01", "button")]),
    ("layout", [("02", "layout")]),
    ("type", [("03", "type")]),
    ("tokens", [("04", "token")]),
    ("blocks", [("05", "story-card"), ("06", "blocks")]),
    ("nav", [("07", "nav")]),
    ("reader", [("08", "reader")]),
    ("carousel", [("09", "carousel")]),
    ("system", [("10", "system")]),
    ("river", [("11", "river")]),
]

parts = [card("00-open", 4)]
for i, (key, films) in enumerate(chapters, 1):
    for n, slug in films:
        parts += [card(f"{n}-{slug}"), film(n, slug)]
    parts += [card(f"live-{i:02d}-{key}"), live(key)]

listing = os.path.join(SEG, "list.txt")
with open(listing, "w") as fh:
    fh.writelines(f"file '{p}'\n" for p in parts)
ff("-f", "concat", "-safe", "0", "-i", listing, "-c", "copy", "-movflags", "+faststart", OUT)
print(OUT, round(dur(OUT), 2))
