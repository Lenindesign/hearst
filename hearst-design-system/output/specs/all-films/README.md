# Combined specs film

`public/specs/specs-all-films.mp4` plays every chapter's motion film in `/specs/` page order. Each chapter is followed by a recording of its live reference. It appears at the top of `/specs/`, and the chapter start times are in `filmChapters` in `src/app/specs/page.tsx`.

Rebuild it after a chapter film or live reference changes:

1. `python3 cards.py <work>/cards` makes the title cards (PIL, Helvetica Neue).
2. Start the app (`npm run dev`), then `BASE_URL=http://localhost:3000 node record-live.mjs <work>/live` records each live reference at 1920 × 1080.
3. `python3 join2.py <work> <work>/specs-all-films.mp4` joins the cards, films and clips at 1920 × 1080, 30 fps.
4. Re-encode for the web so the file stays under GitHub's 100 MB limit: `ffmpeg -i <in> -c:v libx264 -preset slow -b:v 540k -maxrate 2500k -bufsize 5000k -pass 1 -an -f null /dev/null`, then the same command with `-pass 2 -pix_fmt yuv420p -movflags +faststart public/specs/specs-all-films.mp4`.
5. Update `filmChapters` from the new segment start times, and the poster (`public/specs/specs-all-films-poster.jpg`) if the opening card changed.
