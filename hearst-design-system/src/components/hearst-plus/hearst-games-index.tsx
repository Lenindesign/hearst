"use client";

import React from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LinkComponent } from "@/components/ui/link";
import { ExternalLink, Play, X } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { quietStoryActionButtonClass } from "./story-actions";

const hearstGameConcepts = [
  {
    title: "Car Mash",
    format: "Autos game",
    habit: "2 to 4 min",
    source: "Hearst Car Mash",
    license: "External prototype",
    href: "https://motortrend-carmash.lovable.app/",
    externalHref: "https://motortrend-carmash.lovable.app/",
    proof: "Existing playable autos game prototype that can validate whether quick car-choice loops belong in the Hearst+ habit layer.",
    fit: "Forge the unholy mashup the auto industry won't build. Our AI editors deliver the full road test, invented horsepower, ruthless verdict, and a magazine-cover hero shot in under 30 seconds.",
    status: "Playable site",
    tone: "Autos",
    imageUrl: "/images/games/car-mash.png",
    imagePosition: "center",
    playKind: "external" as const,
  },
  {
    title: "Daily Mini Crossword",
    format: "Word puzzle",
    habit: "3 to 5 min",
    source: "Exolve",
    license: "MIT",
    href: "https://github.com/viresh-ratnakar/exolve",
    proof: "Mature open-source crossword engine with embeddable puzzle markup.",
    fit: "Best editorial fit. Clues can be written from Hearst culture, food, style, home, auto, and wellness coverage.",
    status: "Prototype first",
    tone: "Editorial",
    imageUrl: "https://hips.hearstapps.com/hmg-prod/images/amazon-asuli-bookshelf-6627efda24610.jpg?crop=1.00xw:0.570xh;0,0.375xh&resize=1200:*",
    imagePosition: "center",
    playKind: "mini" as const,
  },
  {
    title: "Tile Merge",
    format: "Number puzzle",
    habit: "2 to 4 min",
    source: "2048",
    license: "MIT",
    href: "https://github.com/gabrielecirulli/2048",
    proof: "Very popular browser game repo with simple mechanics and mobile-friendly play.",
    fit: "Fast daily repeat play. Easy to theme as recipes, products, cars, colors, or trend tiles.",
    status: "Ready to adapt",
    tone: "Daily",
    imageUrl: "https://hips.hearstapps.com/hmg-prod/images/where-to-buy-squishmallows-online-1641911882.jpg?crop=0.939xw:0.939xh;0.0321xw,0.0321xh&resize=1200:*",
    imagePosition: "center",
    playKind: "merge" as const,
  },
  {
    title: "Photo Puzzle",
    format: "Image game",
    habit: "4 to 7 min",
    source: "Puzzle",
    license: "Free HTML5 PWA",
    href: "https://github.com/grrd01/Puzzle",
    proof: "Lightweight browser puzzle pattern that can be driven by editorial imagery.",
    fit: "Strongest visual brand extension. Cars, homes, fashion, food, and travel images become playable.",
    status: "Best visual demo",
    tone: "Visual",
    imageUrl: "https://hips.hearstapps.com/hmg-prod/images/083af0e2-6ac9-4362-9899-ae967559c01c.jpeg",
    imagePosition: "center",
    playKind: "photo" as const,
  },
  {
    title: "Memory Match",
    format: "Card match",
    habit: "2 to 5 min",
    source: "Memory Game",
    license: "MIT",
    href: "https://github.com/kubowania/memory-game",
    proof: "Simple open-source browser memory game, easy to reskin and extend.",
    fit: "Works for product picks, celebrity looks, car badges, recipe ingredients, and home design details.",
    status: "Low effort",
    tone: "Collections",
    imageUrl: "https://hips.hearstapps.com/hmg-prod/images/beautiful-family-connecting-whilst-playing-games-royalty-free-image-1717003492.jpg?crop=0.668xw:1.00xh;0.147xw,0&resize=600:*",
    imagePosition: "center",
    playKind: "memory" as const,
  },
  {
    title: "Arcade Blocks",
    format: "Falling blocks",
    habit: "5 to 8 min",
    source: "React Tetris",
    license: "MIT",
    href: "https://github.com/brandly/react-tetris",
    proof: "React implementation with familiar arcade pacing and compact controls.",
    fit: "Useful as a lightweight arcade card, but should be renamed and visually differentiated before sharing.",
    status: "Needs reskin",
    tone: "Arcade",
    imageUrl: "https://hips.hearstapps.com/hmg-prod/images/ed6cffef-45ed-4c26-be13-d38bfd05ad17.jpg",
    imagePosition: "center",
    playKind: "blocks" as const,
  },
  {
    title: "Daily Game Finder",
    format: "Discovery index",
    habit: "Browse",
    source: "Dles",
    license: "GPL-3.0",
    href: "https://github.com/aukspot/dles",
    proof: "Large curated directory of daily web games for market scanning.",
    fit: "Best used as research input, not copied into the product, because the license has obligations.",
    status: "Research only",
    tone: "Discovery",
    imageUrl: "https://hips.hearstapps.com/hmg-prod/images/green-tea-cookies-1550241899.jpg?crop=0.481xw:0.321xh;0.449xw,0.532xh&resize=600:*",
    imagePosition: "center",
    playKind: "finder" as const,
  },
] as const;

export function HearstGamesIndex() {
  const [activeGame, setActiveGame] = React.useState<(typeof hearstGameConcepts)[number] | null>(null);
  const playableGames = hearstGameConcepts.filter((game) => game.playKind !== "finder");
  const researchGame = hearstGameConcepts.find((game) => game.playKind === "finder") ?? hearstGameConcepts[hearstGameConcepts.length - 1];
  const openGame = (game: (typeof hearstGameConcepts)[number]) => {
    const externalHref = "externalHref" in game ? game.externalHref : null;
    if (externalHref) {
      window.open(externalHref, "_blank", "noopener,noreferrer");
      return;
    }

    setActiveGame(game);
  };

  return (
    <>
      <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[200px_minmax(0,1fr)_260px] xl:grid-cols-[220px_minmax(0,1fr)_280px]">
        <aside className="hidden min-w-0 space-y-5 lg:block">
          <section className="rounded-[8px] border border-border bg-[var(--hp-surface)] p-4 shadow-[var(--hp-shadow-card)]">
            <h2 className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-[var(--hp-sidebar-heading,var(--color-primary,var(--primary)))]">
              Your daily habit
            </h2>
            <div className="mt-4 space-y-4 text-sm">
              {playableGames.slice(0, 3).map((game) => (
                <button
                  key={game.title}
                  type="button"
                  className="block w-full border-b border-border pb-4 text-left transition-colors last:border-b-0 last:pb-0 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                  onClick={() => openGame(game)}
                >
                  <span className="text-xs font-bold text-[var(--hp-section-title)]">{game.format}</span>
                  <span className="mt-1 block font-bold leading-snug">{game.title}</span>
                  <span className="mt-1 block text-xs text-muted-foreground">{game.habit}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-[8px] border border-border bg-[var(--hp-surface)] p-4 shadow-[var(--hp-shadow-card)]">
            <h2 className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-[var(--hp-sidebar-heading,var(--color-primary,var(--primary)))]">
              Game types
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {["Words", "Photos", "Memory", "Pattern", "Arcade"].map((item) => (
                <span key={item} className="rounded-[6px] border border-border px-2 py-1 text-xs text-muted-foreground">
                  {item}
                </span>
              ))}
            </div>
          </section>
        </aside>

        <main className="min-w-0 space-y-4" aria-label="Hearst games river">
          <div className="space-y-4">
            {playableGames.map((game) => {
              const isExternalGame = "externalHref" in game;

              if (isExternalGame) {
                return (
                  <article
                    key={game.title}
                    role="link"
                    tabIndex={0}
                    className="group relative min-w-0 cursor-pointer overflow-hidden rounded-[8px] border border-border bg-[var(--hp-surface)] shadow-[var(--hp-shadow-card)] transition-colors hover:border-primary/45 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/45"
                    onClick={() => openGame(game)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        openGame(game);
                      }
                    }}
                  >
                    <div className="relative grid w-full grid-rows-[auto_112px] bg-black text-left text-white sm:grid-rows-[auto_144px]">
                      <div className="relative isolate">
                        <div className="relative h-[min(128vw,520px)] w-full overflow-hidden sm:h-auto sm:aspect-video">
                          <Image
                            src={game.imageUrl}
                            alt=""
                            fill
                            priority
                            sizes="(max-width: 1024px) calc(100vw - 48px), 680px"
                            className="object-cover transition-transform duration-200 group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                            style={{ objectPosition: game.imagePosition }}
                          />
                          <div
                            aria-hidden="true"
                            data-slider-layer="gradient"
                            className="pointer-events-none absolute inset-x-0 bottom-0 h-[180px] bg-[linear-gradient(to_bottom,transparent_0%,var(--hp-image-scrim-soft)_30%,var(--hp-image-scrim-strong)_72%,var(--hp-image-scrim-solid)_100%)] sm:h-[220px] xl:h-[240px]"
                          />
                        </div>
                      </div>
                      <div data-slider-layer="frame" className="bg-black" />
                    </div>
                    <div className="absolute left-5 right-5 top-5 flex items-center justify-between gap-3">
                      <span className="rounded-full bg-black/45 px-3 py-1 text-sm font-bold uppercase tracking-[0.08em] text-white backdrop-blur">
                        {game.tone}
                      </span>
                      <span className="rounded-full bg-black/45 px-3 py-1 text-sm font-bold text-white backdrop-blur">
                        {game.habit}
                      </span>
                    </div>
                    <div data-slider-content className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-7">
                      <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/80">
                        <span className="font-bold uppercase tracking-[0.14em] text-white">{game.format}</span>
                        <span>{game.status}</span>
                      </div>
                      <h2 className="headline line-clamp-3 max-w-[min(42rem,100%)] break-words text-balance text-[clamp(2rem,4.5vw,2.75rem)] leading-[1.08] text-white transition-colors group-hover:text-[var(--component-navigation-utility-content-accent)] group-focus-visible:text-[var(--component-navigation-utility-content-accent)] sm:text-[clamp(2.25rem,3.25vw,3rem)]">
                        {game.title}
                      </h2>
                      <p className="mt-3 line-clamp-2 max-w-2xl text-sm leading-6 text-white/85 sm:text-base">
                        {game.fit}
                      </p>
                      <div className="relative z-30 mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm" onClick={(event) => event.stopPropagation()}>
                        <Button variant="ghost" size="xs" className="border-0 bg-white px-3 text-black shadow-none hover:bg-white/90 hover:text-black focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-white/70" onClick={() => openGame(game)}>
                          <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                          Open Car Mash
                        </Button>
                        <span className="text-white/80">{game.source} · {game.license}</span>
                      </div>
                    </div>
                  </article>
                );
              }

              return (
                <article
                  key={game.title}
                  role="button"
                  tabIndex={0}
                  className="group relative grid min-w-0 cursor-pointer gap-4 overflow-hidden rounded-[8px] border border-border bg-[var(--hp-surface)] p-4 shadow-[var(--hp-shadow-card)] transition-colors hover:border-primary/45 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/45 sm:grid-cols-[176px_minmax(0,1fr)]"
                  onClick={() => openGame(game)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      openGame(game);
                    }
                  }}
                >
                  <div className="relative aspect-video min-w-0 overflow-hidden rounded-[8px] bg-muted sm:h-full sm:min-h-36 sm:aspect-auto">
                    <Image
                      src={game.imageUrl}
                      alt=""
                      fill
                      sizes="(max-width: 640px) calc(100vw - 48px), 176px"
                      className="object-cover transition-transform duration-200 group-hover:scale-[1.025] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                      style={{ objectPosition: game.imagePosition }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-black/65" />
                    <div className="absolute inset-x-0 top-0 p-3">
                      <span className="rounded-full bg-black/55 px-2.5 py-1 text-xs font-bold uppercase tracking-[0.16em] text-white backdrop-blur-sm">
                        {game.tone}
                      </span>
                    </div>
                  </div>
                  <div className="relative z-20 min-w-0">
                    <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <span className="font-bold uppercase tracking-[0.14em] text-[var(--hp-section-title)]">{game.format}</span>
                      <span>{game.habit}</span>
                      <span>{game.status}</span>
                    </div>
                    <h2 className="headline text-2xl leading-tight text-[var(--hp-text-headline)] transition-colors group-hover:text-primary group-focus-visible:text-primary">
                      {game.title}
                    </h2>
                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">
                      {game.fit}
                    </p>
                    <div className="relative z-30 mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm" onClick={(event) => event.stopPropagation()}>
                      <Button variant="ghost" size="xs" className={quietStoryActionButtonClass} onClick={() => openGame(game)}>
                        <Play className="h-3.5 w-3.5" aria-hidden />
                        Play
                      </Button>
                      <span className="text-muted-foreground">{game.source} · {game.license}</span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </main>

        <aside className="min-w-0 space-y-5 lg:sticky lg:top-[112px] lg:self-start">
          <section className="rounded-[8px] border border-border bg-[var(--hp-surface)] p-4 shadow-[var(--hp-shadow-card)]">
            <h2 className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-[var(--hp-sidebar-heading,var(--color-primary,var(--primary)))]">
              Why games
            </h2>
            <div className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
              <p>They create a repeatable daily touchpoint without replacing the story river.</p>
              <p>Each game can inherit topic and brand signals from the reader profile.</p>
            </div>
          </section>

          <section className="rounded-[8px] border border-border bg-[var(--hp-surface)] p-4 shadow-[var(--hp-shadow-card)]">
            <h2 className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-[var(--hp-sidebar-heading,var(--color-primary,var(--primary)))]">
              Source review
            </h2>
            <div className="mt-4 space-y-4 text-sm">
              {hearstGameConcepts.map((game) => (
                <div key={game.title} className="border-b border-border pb-3 last:border-b-0 last:pb-0">
                  <p className="font-bold">{game.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{game.source} · {game.license}</p>
                  <LinkComponent
                    href={game.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="neutral"
                    underline={false}
                    size="sm"
                    className="mt-2 inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary"
                  >
                    View source
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                  </LinkComponent>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[8px] border border-border bg-[var(--hp-surface)] p-4 shadow-[var(--hp-shadow-card)]">
            <h2 className="text-sm font-bold text-foreground">Research only</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {researchGame.source} is useful for market scanning, but its {researchGame.license} license means it should stay a reference unless legal approves a compliant use.
            </p>
          </section>
        </aside>
      </div>
      <HearstGameModal game={activeGame} onClose={() => setActiveGame(null)} />
    </>
  );
}

function HearstGameModal({
  game,
  onClose,
}: {
  game: (typeof hearstGameConcepts)[number] | null;
  onClose: () => void;
}) {
  React.useEffect(() => {
    if (!game) return;

    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [game, onClose]);

  if (!game) return null;

  return createPortal(
    <div className="fixed inset-0 z-[220] flex items-center justify-center bg-black/55 p-4" role="dialog" aria-modal="true" aria-label={`${game.title} game`}>
      <button type="button" className="absolute inset-0" onClick={onClose} aria-label="Close game" />
      <div className="relative max-h-[min(820px,92dvh)] w-full max-w-3xl overflow-y-auto rounded-[12px] bg-background shadow-2xl">
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-border bg-background/95 px-5 py-4 backdrop-blur">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--hp-section-title)]">{game.format}</p>
            <h2 className="headline mt-1 text-3xl leading-tight">{game.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{game.habit} · Prototype game</p>
          </div>
          <button
            type="button"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            onClick={onClose}
            aria-label="Close game"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>
        <div className="p-5 sm:p-6">
          <HearstGamePlayable game={game} />
          <div className="mt-6 rounded-[8px] border border-border bg-muted/35 p-4 text-sm leading-6 text-muted-foreground">
            <p className="font-bold text-foreground">Prototype note</p>
            <p className="mt-1">
              This modal uses Hearst-owned demo logic. The referenced repo remains a source and license review input before any production implementation.
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

function HearstGamePlayable({ game }: { game: (typeof hearstGameConcepts)[number] }) {
  if (game.playKind === "mini") return <DailyMiniGame />;
  if (game.playKind === "merge") return <TileMergeGame />;
  if (game.playKind === "photo") return <PhotoPuzzleGame />;
  if (game.playKind === "memory") return <MemoryMatchGame />;
  return <ArcadeBlocksGame />;
}

function DailyMiniGame() {
  const [answers, setAnswers] = React.useState(["", "", ""]);
  const expected = ["style", "road", "home"];
  const solved = answers.filter((answer, index) => answer.trim().toLowerCase() === expected[index]).length;

  return (
    <div>
      <p className="text-sm leading-6 text-muted-foreground">
        A tiny editorial clue set. Fill the three answers to complete today&rsquo;s mini.
      </p>
      <div className="mt-5 space-y-3">
        {[
          "Fashion and beauty coverage often starts with this five-letter section.",
          "The autos brand pairing in Road & Track starts with this word.",
          "Country Living and House Beautiful share this reader intent.",
        ].map((clue, index) => (
          <label key={clue} className="block rounded-[8px] border border-border p-3">
            <span className="text-sm font-bold">{clue}</span>
            <Input
              value={answers[index]}
              onChange={(event) => setAnswers((current) => current.map((value, answerIndex) => answerIndex === index ? event.target.value : value))}
              className="mt-2"
              aria-label={`Answer ${index + 1}`}
            />
          </label>
        ))}
      </div>
      <p className="mt-4 text-sm font-bold text-[var(--hp-section-title)]">{solved} of 3 solved</p>
    </div>
  );
}

function TileMergeGame() {
  const [tiles, setTiles] = React.useState([2, 2, 4, 8, 4, 16, 8, 2, 32, 4, 2, 0, 0, 0, 0, 0]);
  const score = tiles.reduce((sum, tile) => sum + tile, 0);
  const mergeTiles = () => {
    setTiles((current) => {
      const compact = current.filter(Boolean);
      const next: number[] = [];
      for (let index = 0; index < compact.length; index += 1) {
        if (compact[index] === compact[index + 1]) {
          next.push(compact[index] * 2);
          index += 1;
        } else {
          next.push(compact[index]);
        }
      }
      return [...next, 2, ...Array.from({ length: Math.max(0, 15 - next.length) }, () => 0)].slice(0, 16);
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">Merge matching tiles into a higher-value daily pattern.</p>
        <p className="shrink-0 text-sm font-bold">Score {score}</p>
      </div>
      <div className="mt-4 grid grid-cols-4 gap-2 rounded-[8px] bg-muted p-2">
        {tiles.map((tile, index) => (
          <div key={`${tile}-${index}`} className="flex aspect-square items-center justify-center rounded-[6px] bg-background text-xl font-black text-[var(--hp-text-headline)]">
            {tile || ""}
          </div>
        ))}
      </div>
      <Button className="mt-4" onClick={mergeTiles}>Merge row</Button>
    </div>
  );
}

function PhotoPuzzleGame() {
  const [tiles, setTiles] = React.useState(["Home", "Style", "Cars", "Food", "Wellness", "Travel"]);

  return (
    <div>
      <p className="text-sm leading-6 text-muted-foreground">
        A photo puzzle would use Hearst imagery. This prototype uses topic tiles to show the interaction model.
      </p>
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {tiles.map((tile) => (
          <button
            key={tile}
            type="button"
            className="aspect-[4/3] rounded-[8px] border border-border bg-muted text-lg font-black transition-colors hover:border-primary hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
            onClick={() => setTiles((current) => [...current.slice(1), current[0]])}
          >
            {tile}
          </button>
        ))}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">Tap any tile to reshuffle the editorial image board.</p>
    </div>
  );
}

function MemoryMatchGame() {
  const cards = ["Car", "Car", "Home", "Home", "Style", "Style", "Food", "Food"];
  const [revealed, setRevealed] = React.useState<number[]>([]);
  const [matched, setMatched] = React.useState<string[]>([]);

  const reveal = (index: number) => {
    if (revealed.includes(index) || matched.includes(cards[index])) return;
    const next = revealed.length === 2 ? [index] : [...revealed, index];
    if (next.length === 2 && cards[next[0]] === cards[next[1]]) {
      setMatched((current) => [...current, cards[index]]);
      setRevealed([]);
      return;
    }
    setRevealed(next);
  };

  return (
    <div>
      <p className="text-sm text-muted-foreground">Match reader interests to clear the board.</p>
      <div className="mt-4 grid grid-cols-4 gap-2">
        {cards.map((card, index) => {
          const open = revealed.includes(index) || matched.includes(card);
          return (
            <button
              key={`${card}-${index}`}
              type="button"
              className={cn(
                "aspect-square rounded-[8px] border border-border text-sm font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40",
                open ? "bg-background text-primary" : "bg-muted text-muted-foreground hover:border-primary"
              )}
              onClick={() => reveal(index)}
            >
              {open ? card : "Hearst"}
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-sm font-bold text-[var(--hp-section-title)]">{matched.length} of 4 matches</p>
    </div>
  );
}

function ArcadeBlocksGame() {
  const [score, setScore] = React.useState(0);
  const blocks = ["Style", "Cars", "Food", "Home", "Gear", "Life"];

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">A renamed falling-blocks concept, shown here as a simple scoring prototype.</p>
        <p className="text-sm font-bold">Score {score}</p>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {blocks.map((block) => (
          <button
            key={block}
            type="button"
            className="h-20 rounded-[8px] border border-border bg-muted font-bold transition-colors hover:border-primary hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
            onClick={() => setScore((current) => current + 10)}
          >
            {block}
          </button>
        ))}
      </div>
    </div>
  );
}
