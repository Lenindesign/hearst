from PIL import Image, ImageDraw, ImageFont
import sys
# Usage: python3 cards.py <workDir>/cards
out = sys.argv[1]
F = "/System/Library/Fonts/HelveticaNeue.ttc"
def font(size, idx=0): return ImageFont.truetype(F, size, index=idx)
def spaced(d, xy, text, f, fill, track):
    x, y = xy
    for ch in text:
        d.text((x, y), ch, font=f, fill=fill); x += d.textlength(ch, font=f) + track
def card(name, kicker, title, sub, right):
    im = Image.new("RGB", (1920, 1080), "white"); d = ImageDraw.Draw(im)
    small = font(26)
    spaced(d, (120, 72), kicker, small, (17,17,17), 4)
    w = sum(d.textlength(c, font=small) + 4 for c in right) - 4
    spaced(d, (1800 - w, 72), right, small, (17,17,17), 4)
    d.line([(120, 500), (1800, 500)], fill=(210,210,210), width=2)
    d.text((120, 530), title, font=font(96), fill=(17,17,17))
    d.text((124, 670), sub, font=font(40), fill=(110,110,110))
    im.save(f"{out}/{name}.png")
films = [("button","CTAs","UI-BTN-001 · Action button"),("layout","Breakpoints & grid","Watch the layout reflow"),
 ("type","Type metrics","Watch the standard explained"),("token","Tokens & brands","Watch a token travel"),
 ("story-card","Blocks","Story card film"),("blocks","Blocks","Every block pattern"),("nav","Nav","How the header works"),
 ("reader","Reader","How the reader works"),("carousel","Carousel","How the carousel works"),("system","System","How the system works")]
chap = {"CTAs":1,"Breakpoints & grid":2,"Type metrics":3,"Tokens & brands":4,"Blocks":5,"Nav":6,"Reader":7,"Carousel":8,"System":9}
card("00-open","HEARST DESIGN SYSTEM · HEARST+","Specifications","Every spec film, in chapter order · 9 chapters · 10 films","THE FILMS")
for i,(slug,c,sub) in enumerate(films,1):
    card(f"{i:02d}-{slug}", f"CHAPTER {chap[c]:02d} · {c.upper()}", c, sub, f"FILM {i} OF 10")

lives = [("cta","CTAs","Live reference · the production Button under four brands"),
 ("layout","Breakpoints & grid","Live reference · the real home from 390 to 1440 px"),
 ("type","Type metrics","Live reference · the real story card and reader"),
 ("tokens","Tokens & brands","Live reference · tokens the browser resolved"),
 ("blocks","Blocks","Live reference · real blocks with real stories"),
 ("nav","Nav","Live reference · the real header at three widths"),
 ("reader","Reader","Live reference · a story open in the real reader"),
 ("carousel","Carousel","Live reference · the real featured carousel"),
 ("system","System","Live reference · the vault, read at build time")]
for i,(slug,c,sub) in enumerate(lives,1):
    card(f"live-{i:02d}-{slug}", f"CHAPTER {chap[c]:02d} · {c.upper()}", c, sub, f"LIVE {i} OF 9")
card("00-open","HEARST DESIGN SYSTEM · HEARST+","Specifications","Every spec film and live reference, in chapter order · 9 chapters","THE FILMS")
