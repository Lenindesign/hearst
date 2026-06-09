import React from "react";
import { type ArticlePageContent, type ImmersiveArticleContent } from "@/components/article-page";
import { ArticleInlineImage, ArticleSubheading, ArticleFootnote } from "@/components/fre/article-body";
import { PullQuote } from "@/components/fre/pull-quote";

const H = "https://hips.hearstapps.com/hmg-prod/images/";

interface BrandArticleData {
  content: ArticlePageContent;
}

function img(id: string, opts = "resize=1200:*") {
  return `${H}${id}?${opts}`;
}
function thumb(id: string) {
  return `${H}${id}?crop=0.666xw:1xh;center,top&resize=200:*`;
}
function card(id: string) {
  return `${H}${id}?crop=0.666xw:1xh;center,top&resize=400:*`;
}

interface SourceEditorialScene {
  eyebrow: string;
  title: string;
  body: string;
  image: string;
  imageAlt: string;
  imageCredit: string;
  imageQuery?: string;
  imageTreatment?: "before-after" | "product";
  quote?: string;
  layout?: "split" | "wide";
  imageFit?: "cover" | "contain";
  imagePosition?: string;
}

interface SourceEditorialConfig {
  displayMode?: ImmersiveArticleContent["displayMode"];
  breadcrumbs: { label: string; href?: string }[];
  headline: string;
  dek: string;
  heroImage: string;
  heroImageQuery?: string;
  heroImageAlt: string;
  heroImageCredit: string;
  heroImageTreatment?: ImmersiveArticleContent["heroImageTreatment"];
  author: string;
  publishedDate: string;
  navLinks: string[];
  immersiveLabel: string;
  immersiveKicker: string;
  introEyebrow: string;
  posterQuoteEyebrow: string;
  visualEssayEyebrow: string;
  visualEssayTitle: string;
  bodyRailEyebrow: string;
  factRail: ImmersiveArticleContent["factRail"];
  scenes: SourceEditorialScene[];
  sourceNote: string;
  bodySubheading: string;
  bodyCopy: string;
  pullQuote: string;
  body?: React.ReactNode;
  relatedArticles?: ImmersiveArticleContent["relatedArticles"];
}

function editorialSceneImageQuery(
  scene: SourceEditorialScene,
  layout: "split" | "wide",
  imageFit: "cover" | "contain",
) {
  if (scene.imageQuery) {
    return scene.imageQuery;
  }

  if (imageFit === "contain" || layout === "wide" || scene.imagePosition) {
    return layout === "wide" ? "resize=1600:*" : "resize=1400:*";
  }

  return "crop=1xw:0.75xh;center,top&resize=1400:*";
}

function editorialMediaImageQuery(scene: SourceEditorialScene) {
  if (scene.imageQuery) {
    return scene.imageQuery;
  }

  if (scene.imageTreatment || scene.imageFit === "contain" || scene.imagePosition) {
    return "resize=1600:*";
  }

  return "crop=1xw:1xh;center,top&resize=1200:*";
}

function editorialRelatedImageQuery(scene: SourceEditorialScene) {
  if (scene.imageTreatment || scene.imageFit === "contain") {
    return "resize=600:*";
  }

  return "crop=0.666xw:1xh;center,top&resize=400:*";
}

function makeSourceEditorialArticle(config: SourceEditorialConfig): ImmersiveArticleContent {
  return {
    displayMode: config.displayMode,
    breadcrumbs: config.breadcrumbs,
    headline: config.headline,
    dek: config.dek,
    heroImage: img(config.heroImage, config.heroImageQuery ?? "resize=1400:*"),
    heroImageAlt: config.heroImageAlt,
    heroImageCredit: config.heroImageCredit,
    heroImageTreatment: config.heroImageTreatment,
    author: config.author,
    publishedDate: config.publishedDate,
    navLinks: config.navLinks,
    immersiveLabel: config.immersiveLabel,
    immersiveKicker: config.immersiveKicker,
    introEyebrow: config.introEyebrow,
    posterQuoteEyebrow: config.posterQuoteEyebrow,
    visualEssayEyebrow: config.visualEssayEyebrow,
    visualEssayTitle: config.visualEssayTitle,
    bodyRailEyebrow: config.bodyRailEyebrow,
    immersiveIntro: (
      <>
        <p>{config.dek}</p>
        <p>{config.immersiveKicker}</p>
      </>
    ),
    factRail: config.factRail,
    scenes: config.scenes.map((scene, index) => {
      const layout = scene.layout ?? (index === 0 ? "wide" : "split");
      const imageFit = scene.imageFit ?? (scene.imageTreatment ? "contain" : "cover");
      return {
        eyebrow: scene.eyebrow,
        title: scene.title,
        body: scene.body,
        image: img(
          scene.image,
          editorialSceneImageQuery(scene, layout, imageFit),
        ),
        imageAlt: scene.imageAlt,
        imageCredit: scene.imageCredit,
        quote: scene.quote,
        layout,
        imageFit,
        imagePosition: scene.imagePosition,
        imageTreatment: scene.imageTreatment,
      };
    }),
    mediaPair: config.scenes.slice(1, 3).map((scene, index) => ({
      src: img(scene.image, editorialMediaImageQuery(scene)),
      alt: scene.imageAlt,
      caption: scene.body,
      credit: scene.imageCredit,
      featured: index === 0,
      fit: scene.imageFit ?? (scene.imageTreatment ? "contain" : undefined),
      position: scene.imagePosition,
      treatment: scene.imageTreatment,
    })),
    body: config.body ?? (
      <>
        <ArticleSubheading>{config.bodySubheading}</ArticleSubheading>
        <p>{config.bodyCopy}</p>
        <PullQuote>{config.pullQuote}</PullQuote>
        <ArticleSubheading>Let the visuals carry the context</ArticleSubheading>
        <p>The template keeps the immersive cover, shared grid, scroll-up navigation, chapter pacing, and visual essay structure consistent while changing the mood, captions, and image choices to match what the writer is communicating.</p>
        <ArticleFootnote number={1}>{config.sourceNote}</ArticleFootnote>
      </>
    ),
    relatedArticles: config.relatedArticles ?? (config.displayMode === "photo-gallery" ? [] : config.scenes.map((scene) => ({
      title: scene.title,
      image: img(scene.image, editorialRelatedImageQuery(scene)),
      imageFit: scene.imageTreatment || scene.imageFit === "contain" ? "contain" : undefined,
    }))),
  };
}

export const COSMOPOLITAN_IMMERSIVE_ARTICLE: ImmersiveArticleContent = {
  breadcrumbs: [{ label: "Pop Culture" }, { label: "Celebs" }, { label: "Music" }],
  headline: "Towa Bird Steps Into Her Own Volume",
  dek: "On the edge of Gentleman, the artist moves through style, softness, guitar noise, and the freedom of refusing a single script.",
  heroImage: img("e90e3b68-21ea-4ac6-a22f-ced89d88f91f.jpg", "crop=1xw:0.5xh;center,top&resize=1600:*"),
  heroImageAlt: "Towa Bird seated for a Cosmopolitan portrait",
  heroImageCredit: "Rona Ahdout // Hearst Owned",
  author: "Alexandra Whittaker",
  photographedBy: "Rona Liana Ahdout",
  publishedDate: "May 14, 2026",
  navLinks: ["Love", "Pop Culture", "Style", "Beauty", "Features", "Astrology", "Shopping"],
  immersiveLabel: "Immersive Profile",
  immersiveKicker: "The room, the word, the sound, and the person carrying all three.",
  immersiveIntro: (
    <>
      <p>There are profiles that begin with a question, and there are profiles that begin with a presence. This one works best when it lets the reader sit with the portrait first: the hair, the tailoring, the stillness, the charge of someone who knows exactly how she is being looked at.</p>
      <p>From there, the story moves in chapters. It follows the public image, then the language around Gentleman, then the instinctive looseness of songs built around guitar, feeling, and refusal.</p>
    </>
  ),
  factRail: [
    { label: "Album", value: "Gentleman" },
    { label: "Release", value: "May 15, 2026" },
    { label: "Focus", value: "Style, songwriting, identity" },
    { label: "Texture", value: "Portraiture, intimacy, guitar noise" },
  ],
  scenes: [
    {
      eyebrow: "Being Seen",
      title: "Start With the Friction",
      body: "To be photographed is one kind of visibility. To be understood is another. The opening image holds both ideas at once: performance on the surface, private calibration underneath.",
      image: img("002a9919-00e9-4a02-87eb-bdc9f436e453.jpg", "crop=1xw:1xh;center,top&resize=1400:*"),
      imageAlt: "Close portrait from the Towa Bird shoot",
      imageCredit: "Rona Ahdout // Hearst Owned",
      quote: "The first beat is not noise. It is attention.",
    },
    {
      eyebrow: "The Word",
      title: "Turn the Theme Into a Chapter",
      body: "Gentleman works as a hinge: softness and bravado, masculinity and femininity, style and vulnerability. The word keeps opening up, then folding back into the person who chose it.",
      image: img("0b597e64-596d-4eda-ada9-60901567f19e.jpg", "resize=1400:*"),
      imageAlt: "Towa Bird in a formal portrait setup",
      imageCredit: "Rona Ahdout // Hearst Owned",
      align: "right",
    },
    {
      eyebrow: "The Sound",
      title: "End on Momentum",
      body: "By the time the story turns toward sound, the frame has loosened. The songs are about guitars, rules, instinct, and the relief of making work that no longer needs permission.",
      image: img("b0208313-8e21-49c8-92e4-50236abedd26.jpg", "crop=1xw:1xh;center,top&resize=1400:*"),
      imageAlt: "Towa Bird holding a skateboard on set",
      imageCredit: "Rona Ahdout // Hearst Owned",
      quote: "The point is not volume for its own sake. It is choosing the dial.",
    },
  ],
  mediaPair: [
    {
      src: img("4d52552e-5946-454d-a50b-d479e75746ca.jpg", "crop=1xw:1xh;center,top&resize=900:*"),
      alt: "Towa Bird portrait with tailored styling",
      caption: "Tailoring keeps the story close to the album's central word.",
      credit: "Rona Ahdout // Hearst Owned",
    },
    {
      src: img("f0238012-6351-4d17-9d56-3da4b44f5a83.jpg", "crop=1xw:1xh;center,top&resize=900:*"),
      alt: "Towa Bird profile portrait",
      caption: "A quieter frame before the conversation moves inward.",
      credit: "Rona Ahdout // Hearst Owned",
    },
  ],
  body: (
    <>
      <ArticleSubheading>The Story Starts Before the First Answer</ArticleSubheading>
      <p>The first question is not spoken out loud. It is built into the room: What happens when the person everyone is watching stops adjusting herself for the watching?</p>
      <p>That pressure gives the conversation its shape. The public version is easy to see: the styling, the guitar, the following, the incoming album. The private version is quieter and more durable, made from the language someone uses when she is deciding what still fits.</p>
      <PullQuote>Atmosphere first, then voice, then stakes.</PullQuote>
      <ArticleSubheading>The Conversation Moves in Turns</ArticleSubheading>
      <p>Some answers need space around them. Some can land fast and sharp. The strongest interview rhythm lets a short exchange sit near an image, then lets a bigger idea arrive with enough quiet around it to feel earned.</p>
      <ArticleInlineImage
        src={img("dadf45db-28bc-4c68-9382-205766bec583.jpg", "resize=1200:*")}
        alt="Towa Bird portrait from the Cosmopolitan shoot"
        caption="The portrait suite keeps returning the story to body language and self-presentation."
        credit="Rona Ahdout // Hearst Owned"
      />
      <ArticleSubheading>Keep the World Close</ArticleSubheading>
      <p>The final movement returns to sound: how a song changes when it stops asking for a conventional shape, how confidence can be loud without losing tenderness, and how an album can turn a contested word into something newly available.</p>
      <ArticleFootnote number={1}>Album timing and profile context are based on the referenced Cosmopolitan feature.</ArticleFootnote>
    </>
  ),
  relatedArticles: [
    { title: "Young Miko Wants to Take You Home", image: card("81c31f6f-6638-4e0f-8465-6971305ed9e0.jpg") },
    { title: "The Best Looks From Music's Biggest Night", image: card("5e6d4136-cb47-4d1b-82fe-a2b289f6595b.jpeg") },
    { title: "Celebrity Style Moments Worth Revisiting", image: card("f4eb21d0-0fc4-494d-ac4c-13b6eebbac5f.jpg") },
    { title: "The Pop Culture Interviews Everyone Is Reading", image: card("doug-699c83837b7c2.jpg") },
  ],
};

export const COSMOPOLITAN_EDITORIAL_ARTICLE: ImmersiveArticleContent = {
  breadcrumbs: [{ label: "Pop Culture" }, { label: "Celebs" }, { label: "Music" }],
  headline: "Towa Bird Thinks We Should Talk About Queer Sex More",
  dek: "Ahead of Gentleman, Bird turns an album interview into a story about visibility, queer desire, and the confidence to make guitar music that refuses the expected shape.",
  heroImage: img("e90e3b68-21ea-4ac6-a22f-ced89d88f91f.jpg", "resize=1200:*"),
  heroImageAlt: "Towa Bird seated for a Cosmopolitan portrait",
  heroImageCredit: "Rona Ahdout // Hearst Owned",
  author: "Alexandra Whittaker",
  photographedBy: "Rona Liana Ahdout",
  publishedDate: "May 14, 2026",
  navLinks: ["Love", "Pop Culture", "Style", "Beauty", "Features", "Astrology", "Shopping"],
  immersiveLabel: "Cosmo Interview",
  immersiveKicker: "A profile about being seen, naming desire, and letting guitar music move like a body under lights.",
  introEyebrow: "Before the interview",
  posterQuoteEyebrow: "Emotional pause",
  visualEssayEyebrow: "Portrait sequence",
  visualEssayTitle: "The images keep identity, style, and desire in the same frame.",
  bodyRailEyebrow: "Emotional path",
  heroImageTreatment: "grid-crop",
  immersiveIntro: (
    <>
      <p>The official Cosmopolitan feature begins in the charged space between being watched and wanting to move through the world without fear. Bird talks about an album, but the deeper rhythm is visibility: how a person carries attention, style, desire, and sound in the same body.</p>
      <p>The portraits echo that movement. A close gaze gives way to tailoring, then to looser frames where the music starts to feel less contained.</p>
    </>
  ),
  factRail: [
    { label: "Album", value: "Gentleman" },
    { label: "Release", value: "May 15, 2026" },
    { label: "Story axis", value: "Visibility, queer desire, freedom" },
    { label: "Photography", value: "Rona Liana Ahdout" },
  ],
  scenes: [
    {
      eyebrow: "Being Seen",
      title: "Visibility Has a Pulse",
      body: "The story starts with the feeling of being perceived: confidence on one side, public self-protection on the other. The close portrait makes that tension immediate before the interview widens into music.",
      image: img("002a9919-00e9-4a02-87eb-bdc9f436e453.jpg", "resize=1400:*"),
      imageAlt: "Close portrait of Towa Bird from the Cosmopolitan shoot",
      imageCredit: "Rona Ahdout // Hearst Owned",
      quote: "Desire is not subtext here. It is the voltage.",
    },
    {
      eyebrow: "The Word",
      title: "Gentleman Splits Open",
      body: "The album title becomes an emotional hinge. It carries softness, masculinity, style, vulnerability, and the refusal to choose only one code for the body.",
      image: img("0b597e64-596d-4eda-ada9-60901567f19e.jpg", "resize=1400:*"),
      imageAlt: "Towa Bird in a formal tailored portrait setup",
      imageCredit: "Rona Ahdout // Hearst Owned",
      align: "right",
      quote: "A word can be outfit, armor, and invitation.",
    },
    {
      eyebrow: "The Sound",
      title: "Freedom Gets Loud",
      body: "The final movement belongs to the songs: guitar forward, less bound by classic structure, and more interested in feeling than permission. The image can breathe here because the record does too.",
      image: img("b0208313-8e21-49c8-92e4-50236abedd26.jpg", "resize=1400:*"),
      imageAlt: "Towa Bird seated with a skateboard on set",
      imageCredit: "Rona Ahdout // Hearst Owned",
      quote: "The ending should feel like a room getting bigger.",
    },
  ],
  mediaPair: [
    {
      src: img("4d52552e-5946-454d-a50b-d479e75746ca.jpg", "resize=900:*"),
      alt: "Towa Bird portrait with tailored styling",
      caption: "Tailoring gives the album title a visual grammar: softness, swagger, and refusal in the same frame.",
      credit: "Rona Ahdout // Hearst Owned",
    },
    {
      src: img("f0238012-6351-4d17-9d56-3da4b44f5a83.jpg", "resize=900:*"),
      alt: "Towa Bird profile portrait",
      caption: "A quieter portrait resets the pace before the story turns back toward intimacy and lyric writing.",
      credit: "Rona Ahdout // Hearst Owned",
    },
  ],
  body: (
    <>
      <ArticleSubheading>Start With the Body in the Room</ArticleSubheading>
      <p>In the original interview, the album is never separated from the question of how Bird moves through the world. The design should make that connection visible: face, clothes, posture, and distance all become part of the reporting.</p>
      <p>That is why the page opens on white space instead of spectacle. The reader gets room to meet the person before the structure starts to move.</p>
      <PullQuote>The word itself is &ldquo;gentle&rdquo; and &ldquo;man.&rdquo;</PullQuote>
      <ArticleSubheading>Make Desire the Center, Not the Aside</ArticleSubheading>
      <p>Cosmopolitan&apos;s strongest context is that Bird talks about queer sex and love without treating them as subtext. Desire becomes a creative subject, a political fact, and a place where the songs get intimate.</p>
      <ArticleInlineImage
        src={img("dadf45db-28bc-4c68-9382-205766bec583.jpg", "resize=1200:*")}
        alt="Towa Bird portrait from the Cosmopolitan shoot"
        caption="The stripped-back frame gives the reader a pause between public visibility and private lyric writing."
        credit="Rona Ahdout // Hearst Owned"
      />
      <ArticleSubheading>Let the Typography Carry Feeling</ArticleSubheading>
      <p>The headline needs room because the story is about naming what usually gets compressed. Large serif forms, restrained red accents, and a narrow reading column let the page feel like an editorial object without trapping the reader in a poster.</p>
      <ArticleSubheading>End Where the Songs Break Open</ArticleSubheading>
      <p>By the time the conversation turns to sound, the layout can loosen. The source story describes an album less tied to classic structure, so the page responds with white space, staggered portraits, and quote scale that feels like feedback after a chord.</p>
      <ArticleFootnote number={1}>Source-grounded prototype based on Cosmopolitan&apos;s May 14, 2026 Towa Bird interview.</ArticleFootnote>
    </>
  ),
  relatedArticles: [
    { title: "Young Miko Wants to Take You Home", image: card("81c31f6f-6638-4e0f-8465-6971305ed9e0.jpg") },
    { title: "The Best Looks From Music's Biggest Night", image: card("5e6d4136-cb47-4d1b-82fe-a2b289f6595b.jpeg") },
    { title: "Celebrity Style Moments Worth Revisiting", image: card("f4eb21d0-0fc4-494d-ac4c-13b6eebbac5f.jpg") },
    { title: "The Pop Culture Interviews Everyone Is Reading", image: card("doug-699c83837b7c2.jpg") },
  ],
};

export const CAR_AND_DRIVER_EDITORIAL_ARTICLE: ImmersiveArticleContent = {
  breadcrumbs: [{ label: "Reviews" }, { label: "Comparison Tests" }, { label: "$30,000 Small Cars" }],
  headline: "Comparison Test: $30,000 Small Cars",
  dek: "Six compact contenders make the same promise in different ways: keep the price near $30,000 and still feel like a real car on a real road.",
  heroImage: img("76471936-3e6b-463e-9551-cb792858ec07.jpg", "resize=1400:*"),
  heroImageAlt: "Six compact cars lined up on a winding California road",
  heroImageCredit: "Michael Simari | Car and Driver",
  author: "K.C. Colwell",
  photographedBy: "Michael Simari and Marc Urbano",
  publishedDate: "May 15, 2026",
  navLinks: ["Research Cars", "Expert Reviews", "Buying Guide", "News", "Gear", "Videos"],
  immersiveLabel: "Comparison Test",
  immersiveKicker: "A road test about value, restraint, and the small cars still worth caring about.",
  introEyebrow: "Before the drive",
  posterQuoteEyebrow: "Road note",
  visualEssayEyebrow: "Evidence board",
  visualEssayTitle: "The proof lives in the route, the cabins, and the score sheet.",
  bodyRailEyebrow: "Test path",
  heroImageTreatment: "overlay",
  heroHeadlineScale: "cover",
  heroHeadlineLines: ["Comparison", "Test:", "$30,000", "Small Cars"],
  flipHeroImage: true,
  immersiveIntro: (
    <>
      <p>The Car and Driver story is not a buyer&apos;s-guide grid dressed up as an article. It is a 600-mile argument, starting in Los Angeles, running up the Pacific Coast Highway, then turning inland toward a proving ground.</p>
      <p>The visuals should work like evidence: six cars in formation, coastal distance, interiors that reveal priorities, and a final score sheet that turns miles into judgment.</p>
    </>
  ),
  factRail: [
    { label: "Field", value: "Civic, K4, Sentra, Impreza, Corolla, Jetta" },
    { label: "Route", value: "L.A. to PCH, Big Sur, Monterey, Central Valley" },
    { label: "Winner", value: "Honda Civic Sport Hybrid Hatchback" },
    { label: "Distance", value: "600-plus miles" },
  ],
  scenes: [
    {
      eyebrow: "The Question",
      title: "What Does $30,000 Buy Now?",
      body: "The test starts with scarcity. Small cars used to be everywhere; now the average new-car price is far higher and the remaining affordable choices have to prove they still matter.",
      image: img("76471936-3e6b-463e-9551-cb792858ec07.jpg", "resize=1400:*"),
      imageAlt: "Six small cars driving through California hills",
      imageCredit: "Michael Simari | Car and Driver",
      quote: "The price is the constraint; the road is the editor.",
    },
    {
      eyebrow: "The Road",
      title: "Let the Coast Sort Them Out",
      body: "A comparison test becomes emotional when the cars share the same light, traffic, climbs, and highway miles. The Pacific Coast Highway frame makes value feel physical, not abstract.",
      image: img("359f30b8-11e6-4c90-b00c-8cfe06e2cf0f.jpg", "resize=1400:*"),
      imageAlt: "The comparison-test cars crossing a coastal bridge",
      imageCredit: "Marc Urbano | Car and Driver",
      align: "right",
    },
    {
      eyebrow: "The Verdict",
      title: "The Civic Changes the Argument",
      body: "The Honda wins because it makes the practical choice feel alive: quickest to 60 mph, strongest observed economy, and the chassis feel that turns a sensible hatchback into the clear answer.",
      image: img("2025-honda-civic-hybrid-hatchback-105-698b62fc3824d.jpg", "resize=1400:*"),
      imageAlt: "Interior of the Honda Civic Sport Hybrid Hatchback",
      imageCredit: "Michael Simari | Car and Driver",
      quote: "A fun affordable car can be a hybrid. That is the twist.",
    },
  ],
  mediaPair: [
    {
      src: img("6de48aff-5d0b-4dab-ab8e-88ca95adea04.jpg", "resize=2400:*"),
      alt: "Final results chart for the compact car comparison test",
      caption: "The final chart gives the story its cleanest turn: Civic first, Jetta second, Corolla third.",
      credit: "Car and Driver",
      featured: true,
    },
    {
      src: img("2026-volkswagen-jetta-sel-113-699c7b9fba635.jpg", "resize=900:*"),
      alt: "Interior of the 2026 Volkswagen Jetta SEL",
      caption: "The Jetta chapter is about traditional refinement: a quiet cabin, sensible controls, and comfort that almost wins the day.",
      credit: "Michael Simari | Car and Driver",
    },
  ],
  body: (
    <>
      <ArticleSubheading>Make the Price the Tension</ArticleSubheading>
      <p>The story works because every car is boxed in by the same expectation. At roughly $30,000, each model has to decide what to protect: speed, comfort, fuel economy, cabin space, warranty, or the simple pleasure of driving.</p>
      <p>That makes the design language sharper. The page should feel measured and road-tested, with big images that preserve the full scene and small data moments that land like lap times.</p>
      <PullQuote>Value is not a discount. It is what still feels good after 600 miles.</PullQuote>
      <ArticleSubheading>Use Interiors as Character Studies</ArticleSubheading>
      <p>The cabins tell the story as clearly as the exterior shots. Nissan leans into comfort and driver-assistance value, Subaru feels practical but plain, Kia brings equipment and shape, Toyota adds attitude, Volkswagen reaches for refinement, and Honda keeps the interface simple enough to let the driving stand out.</p>
      <ArticleInlineImage
        src={img("2026-kia-k4-gt-line-107-698b5faf87293.jpg", "resize=1200:*")}
        alt="Interior of the 2026 Kia K4 Hatchback GT-Line Turbo"
        caption="The K4 cockpit turns the feature conversation toward screens, controls, and the difference between looking sporty and feeling cohesive."
        credit="Michael Simari | Car and Driver"
        variant="wide"
      />
      <ArticleSubheading>Let the Rankings Build Like a Drive</ArticleSubheading>
      <p>The ordering gives the article its pace: Sentra, Impreza, K4, Corolla, Jetta, then Civic. Each step narrows what the best affordable small car has to do until the winner feels less like a surprise and more like a conclusion earned by the route.</p>
      <ArticleSubheading>End With the Car That Expands the Category</ArticleSubheading>
      <p>The Honda&apos;s win matters because it changes the emotional meaning of the segment. A hybrid is not just the efficient answer here; it is the quick, sorted, rewarding one. That is the story the visuals need to support.</p>
      <ArticleFootnote number={1}>Source-grounded prototype based on Car and Driver&apos;s May 15, 2026 comparison test.</ArticleFootnote>
    </>
  ),
  relatedArticles: [
    { title: "2026 Kia K4 GT-Line Turbo vs. Honda Civic Hybrid Hatch", image: card("2026-kia-k4-gt-line-107-698b5faf87293.jpg") },
    { title: "Comparison Test: 2026 Nissan Sentra vs. Volkswagen Jetta", image: card("2026-nissan-sentra-sl-108-699c9026b2949.jpg") },
    { title: "The Right-to-Repair Fight Is Gaining Momentum", image: card("8b2745eb-f915-4283-aa59-bd921a42df99.jpeg") },
    { title: "2012 Lexus LS460 on BaT Is Low-Key Luxury", image: card("311612c5-94a7-4874-b788-f60d39a244c0.jpg") },
  ],
};

export const ELLE_EDITORIAL_ARTICLE: ImmersiveArticleContent = {
  breadcrumbs: [{ label: "Culture" }, { label: "Art & Design" }, { label: "Architecture" }],
  headline: "How Jeanne Gang Gave Hudson Valley Shakespeare an Incredible New Home",
  dek: "The architect turns a theater in Putnam Valley into a study of timber, landscape, public space, and the way a building can make a community feel invited.",
  heroImage: img("deecf73d-8c2d-43f6-aef8-8250301ec74f.jpg", "resize=1400:*"),
  heroImageAlt: "Hudson Valley Shakespeare theater glowing at dusk",
  heroImageCredit: "Jason O'Rear",
  author: "Adrienne Gaffney",
  photographedBy: "Jason O'Rear, John David Pittman, and Studio Gang",
  publishedDate: "May 15, 2026",
  navLinks: ["Fashion", "Beauty", "Culture", "Horoscopes", "Shopping", "News & Politics"],
  immersiveLabel: "Art & Design",
  immersiveKicker: "Architecture as stagecraft, ecology, and an invitation to gather.",
  introEyebrow: "Before opening night",
  posterQuoteEyebrow: "Material note",
  visualEssayEyebrow: "Spatial notes",
  visualEssayTitle: "The theater tells its story through roofline, timber, light, and view.",
  bodyRailEyebrow: "Design path",
  heroImageTreatment: "overlay",
  flipHeroImage: true,
  immersiveIntro: (
    <>
      <p>The ELLE interview is about more than a new theater. Jeanne Gang describes architecture as a social medium: a way to frame how people arrive, gather, perform, and feel welcome in public space.</p>
      <p>The images need to carry that idea. Start with the building as a glowing object in the landscape, then move inside to the stage, the structure, the architect, and the Hudson Valley site that shaped the whole project.</p>
    </>
  ),
  factRail: [
    { label: "Project", value: "Samuel H. Scripps Theater Center" },
    { label: "Place", value: "Putnam Valley, New York" },
    { label: "Architect", value: "Jeanne Gang / Studio Gang" },
    { label: "Site", value: "98 acres in the Hudson Valley" },
  ],
  scenes: [
    {
      eyebrow: "The Site",
      title: "The Landscape Is Part of the Stage",
      body: "Gang's theater is designed around arrival, view, and atmosphere. The Hudson Valley is not backdrop decoration; it is part of what the audience and actors experience.",
      image: img("f8a69379-5993-421f-abc4-6f3156ceac8a.jpg", "resize=1400:*"),
      imageAlt: "Aerial view of the Hudson Valley theater site",
      imageCredit: "Jason O'Rear",
      quote: "The building feels less placed on the land than tuned to it.",
    },
    {
      eyebrow: "The Room",
      title: "A Theater That Opens Outward",
      body: "The interior keeps the performance close to the landscape. Seats, stage, timber, and distant hills work together so the architecture supports both spectacle and intimacy.",
      image: img("7216b5d6-dd56-4c47-9b44-4266ba3aae02.jpg", "resize=1400:*"),
      imageAlt: "Inside the Scripps Theater with the landscape beyond the stage",
      imageCredit: "Jason O'Rear",
      align: "right",
    },
    {
      eyebrow: "The Ethic",
      title: "Public Space Should Feel Like Belonging",
      body: "The conversation turns from theater to civic life: sustainability, social justice, and the idea that beautiful architecture can help people feel ownership of a place.",
      image: img("f1b49acd-a7ee-41da-adef-ec37eb1a3272.jpg", "resize=1200:*"),
      imageAlt: "Portrait of architect Jeanne Gang",
      imageCredit: "John David Pittman",
      quote: "Good architecture changes how people feel inside a shared space.",
    },
  ],
  mediaPair: [
    {
      src: img("d372d396-18de-4ed2-aa89-e8b719d95639.jpg", "resize=1400:*"),
      alt: "Hudson Valley Shakespeare theater exterior at dusk",
      caption: "The exterior establishes the theater as a glowing civic object in the landscape.",
      credit: "Jason O'Rear Photography",
      featured: true,
    },
    {
      src: img("7216b5d6-dd56-4c47-9b44-4266ba3aae02.jpg", "resize=1400:*"),
      alt: "Inside the Scripps Theater with the landscape beyond the stage",
      caption: "Inside the theater, the view beyond the stage keeps the audience aware of place.",
      credit: "Jason O'Rear",
    },
  ],
  body: (
    <>
      <ArticleSubheading>Start With the Roofline</ArticleSubheading>
      <p>The most important visual move is to let the theater breathe. The roof, timber, and valley views are not architectural extras; they explain the story&apos;s emotional stakes before the interview does.</p>
      <p>Gang&apos;s work here reframes a performance space as a civic gesture: a place built for actors and audiences, but also for arrival, comfort, and public welcome.</p>
      <PullQuote>Architecture becomes the quiet choreography before the play begins.</PullQuote>
      <ArticleSubheading>Let Materials Carry Meaning</ArticleSubheading>
      <p>The article turns on a material choice. A timber approach becomes more than an aesthetic solution; it makes the building feel specific to the company, the site, and the sustainability ambitions that drew Gang to the project.</p>
      <ArticleInlineImage
        src={img("9fd7e519-0272-4a4b-b271-6d937e9ae190.jpg", "resize=1200:*")}
        alt="Timber beams and structural supports under the theater roof"
        caption="The timber structure gives the theater its emotional warmth and its sustainable logic."
        credit="Studio Gang"
      />
      <ArticleSubheading>Make Community the Resolution</ArticleSubheading>
      <p>The final movement should leave the building and return to people. Gang talks about museums, community centers, theaters, and public spaces as architecture that can lower barriers and help people feel that a place belongs to them.</p>
      <ArticleFootnote number={1}>Source-grounded prototype based on ELLE&apos;s May 15, 2026 Jeanne Gang interview.</ArticleFootnote>
    </>
  ),
  relatedArticles: [
    { title: "How Frida Escobedo Is Making History at the Met", image: card("f1b49acd-a7ee-41da-adef-ec37eb1a3272.jpg") },
    { title: "The Best Moments at the Venice Biennale", image: card("7216b5d6-dd56-4c47-9b44-4266ba3aae02.jpg") },
    { title: "17 Fashion Highlights From Milan Design Week 2026", image: card("d372d396-18de-4ed2-aa89-e8b719d95639.jpg") },
    { title: "The New Status Symbol? A Painted Portrait", image: card("deecf73d-8c2d-43f6-aef8-8250301ec74f.jpg") },
  ],
};

export const BICYCLING_EDITORIAL_ARTICLE: ImmersiveArticleContent = {
  breadcrumbs: [{ label: "Bikes & Gear" }, { label: "Beach Cruiser Bikes" }],
  headline: "From Boardwalk to Bike Path: 12 Expert-Approved Beach Cruiser Bikes for Laid-Back Rides",
  dek: "A comfort-first gear guide built around upright posture, easy rolling, and the kind of bike that makes a short ride feel like summer.",
  heroImage: img("ef839871-f862-4d7e-a954-5570bfc4008d.jpg", "resize=1400:*"),
  heroImageAlt: "Beach cruiser bike on a sunny path",
  heroImageCredit: "Trevor Raab",
  author: "Tara Seplavy",
  publishedDate: "Updated May 8, 2026",
  navLinks: ["Bikes & Gear", "Training", "Nutrition", "Culture", "News", "Repair"],
  immersiveLabel: "Gear Guide",
  immersiveKicker: "Cruisers are not about racing the clock. They are about fit, comfort, and the feeling of taking the long way home.",
  introEyebrow: "Before the ride",
  posterQuoteEyebrow: "Ride note",
  visualEssayEyebrow: "Bike check",
  visualEssayTitle: "The shape of the bike tells you what kind of ride it wants.",
  bodyRailEyebrow: "Buying path",
  immersiveIntro: (
    <>
      <p>The Bicycling guide is about ease, but not laziness. A good cruiser has a point of view: upright bars, a relaxed saddle, stable tires, and enough practical detail to make the ride feel effortless instead of flimsy.</p>
      <p>The visual system should feel like a boardwalk test ride: bright, graphic, useful, and paced around what the reader needs to compare quickly.</p>
    </>
  ),
  factRail: [
    { label: "Story type", value: "Expert-tested gear guide" },
    { label: "Focus", value: "Comfort, fit, stability, style" },
    { label: "Use case", value: "Boardwalks, bike paths, errands" },
    { label: "Reader need", value: "A cruiser that feels easy to own" },
  ],
  scenes: [
    {
      eyebrow: "The posture",
      title: "Comfort Starts Upright",
      body: "Cruisers work because the riding position changes the whole experience. The point is not aggression; it is a relaxed cockpit that lets the reader imagine rolling, looking around, and staying comfortable.",
      image: "https://hips.hearstapps.com/vader-prod.s3.amazonaws.com/product-images/59a71bce-64f8-48ca-99ef-28de4bcff1f0/a40add19-e82d-41cd-a76d-6bedd9c7ce22.jpg?resize=1200:*",
      imageAlt: "Priority Bicycles Coast beach cruiser bike",
      imageCredit: "Bicycling",
      quote: "The right cruiser should make the first pedal stroke feel obvious.",
      imageTreatment: "product",
      productReview: {
        award: "Best Overall Cruiser",
        name: "Priority Bicycles Coast",
        price: "$679",
        retailer: "Priority Bicycles",
        ctaLabel: "Shop at Priority",
        href: "https://go.redirectingat.com?id=74968X1576257&url=https%3A%2F%2Fwww.prioritybicycles.com%2Fproducts%2Fthecoast",
        pros: [
          "Rust-proof frame and components.",
          "No-maintenance Gates belt drive.",
          "Very light for a cruiser.",
          "Standard diamond frame available.",
        ],
        cons: ["One-size fits most frame."],
      },
    },
    {
      eyebrow: "The frame",
      title: "Style Is Functional Here",
      body: "Step-through frames, swept bars, wide saddles, and color are not just aesthetic cues. They tell the reader how the bike will behave before the spec list does.",
      image: "https://hips.hearstapps.com/vader-prod.s3.amazonaws.com/1744382643-630-around-the-block-67f928f75c201.jpg?resize=1200:*",
      imageAlt: "Beach cruiser bike in profile",
      imageCredit: "Bicycling",
      align: "right",
      imageTreatment: "product",
      productReview: {
        award: "Best Value Cruiser",
        name: "sixthreezero Around The Block",
        price: "$300",
        retailer: "Amazon",
        ctaLabel: "Shop at Amazon",
        href: "https://www.amazon.com/dp/B00AK0S07K",
        pros: [
          "Singlespeed keeps it simple.",
          "Rear rack is standard.",
          "Wide, soft saddle.",
        ],
        cons: ["Single speed not ideal for hilly areas."],
      },
    },
    {
      eyebrow: "The ride",
      title: "Easy Should Still Feel Solid",
      body: "The best cruiser is simple, but not vague. Braking, gearing, tires, and weight decide whether a sunny short ride stays charming after the first mile.",
      image: "https://hips.hearstapps.com/vader-prod.s3.amazonaws.com/1744385820-Chatham7ST3pcCrankMatcha5172_1_2_1.jpg?resize=1200:*",
      imageAlt: "Retrospec Chatham Step Through 7-Speed cruiser bike",
      imageCredit: "Bicycling",
      quote: "Laid-back still needs good engineering.",
      imageTreatment: "product",
      productReview: {
        award: "Best Cruiser with Gears",
        name: "Retrospec Chatham Step Through 7-Speed",
        price: "$340",
        retailer: "Retrospec",
        ctaLabel: "Shop at Retrospec",
        href: "https://retrospec.com/products/chatham-7-step-through-beach-cruiser-bike",
        pros: [
          "Shimano 7-speed shifter and derailleur.",
          "Aluminum rims.",
          "5 great colors.",
        ],
        cons: ["Rack and fenders not included."],
      },
    },
  ],
  mediaPair: [
    {
      src: "https://hips.hearstapps.com/vader-prod.s3.amazonaws.com/1690912212-e-coast-step-mint-hero-1of1-64c944a6e86b2.jpg?resize=1600:*",
      alt: "Priority E-Coast Step-Through electric cruiser bike",
      caption: "Electric assist should still read like a cruiser: upright, easy to understand, and clear about the gear that makes ownership simple.",
      credit: "Bicycling",
      featured: true,
      fit: "contain",
      treatment: "product",
      productReview: {
        award: "Best Overall Cruiser E-Bike",
        name: "Priority E-Coast Step-Through",
        price: "$2,000",
        retailer: "Priority Bicycles",
        ctaLabel: "Shop at Priority",
        href: "https://www.prioritybicycles.com/products/ecoast",
        pros: [
          "Easy maintenance belt drive.",
          "Aluminum frame and fork.",
          "Hydraulic disc brakes.",
          "Fully equipped with rack, fenders, and lights.",
        ],
      },
    },
    {
      src: "https://hips.hearstapps.com/vader-prod.s3.amazonaws.com/product-images/59a71bce-64f8-48ca-99ef-28de4bcff1f0/a40add19-e82d-41cd-a76d-6bedd9c7ce22.jpg?resize=980:*",
      alt: "Beach cruiser product detail",
      caption: "Product details still matter, but they should support the ride story rather than dominate the spread.",
      credit: "Bicycling",
      fit: "contain",
      treatment: "product",
    },
  ],
  body: (
    <>
      <ArticleSubheading>Make Comfort the Main Spec</ArticleSubheading>
      <p>The source guide frames beach cruisers around relaxed riding, not performance theater. The editorial page should make that immediately legible: big profile images, clear comparison moments, and typography that feels energetic without pretending this is a race bike.</p>
      <p>The buying logic is simple but important. Fit, saddle comfort, tire stability, gearing, braking, and weight decide whether a cruiser becomes a weekend habit or a garage ornament.</p>
      <PullQuote>The best cruiser is the one that makes the easy ride feel well designed.</PullQuote>
      <ArticleSubheading>Show the Bikes Like Objects Readers Can Judge</ArticleSubheading>
      <p>Unlike a feature profile, the visuals need to keep returning to product evidence. Frame geometry, handlebar sweep, step-through height, and tire volume carry the story because they help readers understand why one bike feels calmer than another.</p>
      <ArticleFootnote number={1}>Source-grounded prototype based on Bicycling&apos;s beach cruiser bike guide, updated May 8, 2026.</ArticleFootnote>
    </>
  ),
  relatedArticles: [
    { title: "The Best Electric Bikes for Everyday Rides", image: "https://hips.hearstapps.com/hmg-prod/images/electric-bike-co-model-x-grid-1616007259.jpg?resize=600:*", imageFit: "contain" },
    { title: "Priority Cruiser Selects, Tested", image: img("priority-cruiser-selects-0077-1526503152.jpg", "resize=600:*"), imageFit: "contain" },
    { title: "How to Choose the Right Bike Fit", image: img("79256f9c-a527-4b6a-9aeb-86fddb1d6a58.jpg", "resize=600:*"), imageFit: "contain" },
    { title: "Cruiser Bikes Built for Summer Errands", image: "https://hips.hearstapps.com/vader-prod.s3.amazonaws.com/1744382643-630-around-the-block-67f928f75c201.jpg?resize=600:*", imageFit: "contain" },
  ],
};

export const COUNTRY_LIVING_EDITORIAL_ARTICLE: ImmersiveArticleContent = {
  breadcrumbs: [{ label: "Home Design" }, { label: "Decorating Ideas" }, { label: "Yellowstone" }],
  headline: "How to Decorate Like the Duttons, According to Yellowstone's Set Designer",
  dek: "Before Dutton Ranch premieres, Country Living revisits the layered rooms, ranch materials, and Western details that made the Yellowstone sets feel lived in.",
  heroImage: img("4a9e0a82-c066-4b9e-b4ea-46efacb9bb43.jpg", "crop=1xw:0.75xh;0xw,0.056xh&resize=1400:*"),
  heroImageAlt: "Yellowstone-inspired ranch interior with warm wood and Western decor",
  heroImageCredit: "Cam McLeod / Paramount Network",
  author: "Anna Logan",
  publishedDate: "May 14, 2026",
  navLinks: ["Home Design", "Gardening", "Food & Drinks", "Shopping", "DIY", "Travel"],
  immersiveLabel: "Decorating Ideas",
  immersiveKicker: "The Dutton look is not one object. It is leather, patina, firelight, scale, and the feeling that every room has survived a few seasons.",
  introEyebrow: "Before the ranch",
  posterQuoteEyebrow: "Room note",
  visualEssayEyebrow: "Ranch layers",
  visualEssayTitle: "The rooms tell the story through wood, leather, textiles, and history.",
  bodyRailEyebrow: "Decor path",
  immersiveIntro: (
    <>
      <p>The Country Living story works when the design feels collected rather than themed. The Dutton Ranch mood is Western, but the useful lesson is about texture: rough wood, aged leather, Navajo-inspired pattern, utilitarian pieces, and rooms that look inherited instead of installed.</p>
      <p>The article should feel like walking through a cinematic ranch house with a decorator&apos;s eye, pausing on the details that readers can translate into their own homes.</p>
    </>
  ),
  factRail: [
    { label: "Story axis", value: "Set design as decorating lesson" },
    { label: "Mood", value: "Western, weathered, collected" },
    { label: "Materials", value: "Wood, leather, wool, iron" },
    { label: "Reader promise", value: "Bring the ranch feeling home" },
  ],
  scenes: [
    {
      eyebrow: "The palette",
      title: "Start With Weathered Warmth",
      body: "The Dutton look begins with color and material: sun-baked neutrals, tobacco leather, dark beams, stone, and the kind of wood tones that make a room feel anchored.",
      image: img("wilson-wyoming-log-cabin-main-room-desk-1668793118.jpg", "crop=1xw:0.965xh;0xw,0xh&resize=1400:*"),
      imageAlt: "Rustic Wyoming cabin room with wood and Western character",
      imageCredit: "Country Living",
      quote: "The room should feel assembled over time, not bought in a weekend.",
    },
    {
      eyebrow: "The textile",
      title: "Pattern Carries the West",
      body: "Throws, rugs, pillows, and woven motifs do the emotional work. They soften the ranch architecture and make the rooms feel personal, layered, and usable.",
      image: img("531fe15b-1802-4e22-a23d-9582bf347f37.jpg", "crop=1xw:0.834xh;0xw,0.076xh&resize=1400:*"),
      imageAlt: "Rustic interior with layered textiles",
      imageCredit: "Country Living",
      align: "right",
    },
    {
      eyebrow: "The object",
      title: "Use Decor That Looks Earned",
      body: "The strongest pieces are practical first: benches, saddles, lamps, tables, iron hardware, and art that feels connected to landscape and work.",
      image: img("wisconsin-northwoods-cabin-living-room-64f79bd213734.jpg", "crop=1xw:0.999xh;0xw,0xh&resize=1400:*"),
      imageAlt: "Cabin living room with rustic Country Living decor",
      imageCredit: "Country Living",
      quote: "A ranch room needs utility before polish.",
    },
  ],
  mediaPair: [
    {
      src: img("4a9e0a82-c066-4b9e-b4ea-46efacb9bb43.jpg", "crop=1xw:0.75xh;0xw,0.056xh&resize=1400:*"),
      alt: "Yellowstone Dutton Ranch-inspired interior",
      caption: "The set-design lesson is atmosphere: dark wood, strong silhouettes, layered pattern, and a room that feels lived in.",
      credit: "Cam McLeod / Paramount Network",
      featured: true,
    },
    {
      src: "https://hips.hearstapps.com/clv.h-cdn.co/assets/17/05/farmhouse-refresh-fireplace-0317.jpg?crop=1xw:0.833xh;0xw,0.11xh&resize=1200:*",
      alt: "Rustic fireplace with farmhouse decor",
      caption: "Fireplaces and hearths make the ranch mood domestic instead of theatrical.",
      credit: "Country Living",
    },
  ],
  body: (
    <>
      <ArticleSubheading>Translate the Set, Don&apos;t Copy It</ArticleSubheading>
      <p>The useful idea is not to turn every house into a television ranch. It is to borrow the set&apos;s sense of age, weight, and usefulness: sturdy furniture, honest textures, and decorative pieces that feel connected to a place.</p>
      <PullQuote>The Dutton look works because nothing feels too new.</PullQuote>
      <ArticleSubheading>Let Texture Do the Storytelling</ArticleSubheading>
      <p>Country Living&apos;s version should be tactile. Close-ups of wood grain, woven blankets, leather seating, and iron details make the design advice feel attainable without flattening the drama of the source story.</p>
      <ArticleFootnote number={1}>Source-grounded prototype based on Country Living&apos;s May 14, 2026 Yellowstone decorating feature.</ArticleFootnote>
    </>
  ),
  relatedArticles: [
    { title: "Rustic Cabin Ideas That Never Feel Costume-y", image: card("wilson-wyoming-log-cabin-main-room-desk-1668793118.jpg") },
    { title: "The Best Western Decor Details", image: card("531fe15b-1802-4e22-a23d-9582bf347f37.jpg") },
    { title: "Fireplace Ideas With Country Soul", image: "https://hips.hearstapps.com/clv.h-cdn.co/assets/17/05/farmhouse-refresh-fireplace-0317.jpg?crop=1xw:1xh;center,top&resize=400:*" },
    { title: "Cabin Living Rooms Worth Saving", image: card("wisconsin-northwoods-cabin-living-room-64f79bd213734.jpg") },
  ],
};

export const DELISH_EDITORIAL_ARTICLE: ImmersiveArticleContent = {
  breadcrumbs: [{ label: "Cooking" }, { label: "Recipe Ideas" }, { label: "Summer" }],
  headline: "I Can't Wait For Summer, So I'm Making These 14 Warm-Weather Recipes Now",
  dek: "A bright, make-it-now recipe collection for the first impatient weeks of warm-weather cooking.",
  heroImage: img("grilled-coca-cola-chicken-index-web-622-jg-del069925-687fdcd9ae465.jpg", "crop=1xw:0.9996684350132626xh;center,top&resize=1400:*"),
  heroImageAlt: "Grilled Coca-Cola chicken ready for summer",
  heroImageCredit: "Julia Gartland",
  author: "Anya Ptacek",
  publishedDate: "May 14, 2026",
  navLinks: ["Cooking", "Recipes", "Food News", "Kitchen Gear", "Restaurants", "Videos"],
  immersiveLabel: "Summer Recipes",
  immersiveKicker: "The article is a craving list: smoky chicken, cold salads, berry desserts, and the first real feeling that dinner can move outside again.",
  introEyebrow: "Before the first cookout",
  posterQuoteEyebrow: "Craving note",
  visualEssayEyebrow: "Menu board",
  visualEssayTitle: "The story should taste like smoke, citrus, herbs, cold cream, and ripe fruit.",
  bodyRailEyebrow: "Menu path",
  immersiveIntro: (
    <>
      <p>The Delish piece is driven by impatience. Summer is not here yet, but the food can start acting like it is: grilled mains, green salads, fresh berries, seafood, lemon bars, and easy dishes that belong on a warm table.</p>
      <p>Visually, that means abundance without clutter. Big food photography should lead the appetite, while the typography keeps the list energetic, practical, and a little playful.</p>
    </>
  ),
  factRail: [
    { label: "Recipes", value: "14 warm-weather ideas" },
    { label: "Mood", value: "Grilled, bright, chilled, fresh" },
    { label: "Hero dish", value: "Grilled Coca-Cola chicken" },
    { label: "Reader promise", value: "Start summer early" },
  ],
  scenes: [
    {
      eyebrow: "The grill",
      title: "Smoke Starts the Season",
      body: "The hero image should feel like the first cookout: glossy chicken, char, sauce, and the unmistakable signal that dinner has left the oven behind.",
      image: img("grilled-coca-cola-chicken-lead-web-616-jg-del069925-687fdcd53f84b.jpg", "crop=1xw:0.75xh;0xw,0.054xh&resize=1400:*"),
      imageAlt: "Grilled Coca-Cola chicken on a platter",
      imageCredit: "Julia Gartland",
      quote: "The first summer recipe should smell like smoke before you read a word.",
    },
    {
      eyebrow: "The salad",
      title: "Cold, Green, and Fast",
      body: "Pasta salad, romaine wedges, panzanella, and herbs give the piece its lighter rhythm. The page needs moments that feel crisp, easy, and ready for a picnic table.",
      image: img("green-goddess-pasta-salad-third-web-2076-rl-base-del039925-6806c6e20a7f5.jpg", "crop=1xw:1xh;center,top&resize=1200:*"),
      imageAlt: "Green goddess pasta salad",
      imageCredit: "Delish",
      align: "right",
    },
    {
      eyebrow: "The sweet finish",
      title: "End With Fruit and Sun",
      body: "The dessert turn keeps the story emotional: strawberries, cream, lemon, and the kind of bright finish that makes the whole menu feel optimistic.",
      image: img("strawberries-cream-tiramisu-lead-681139e6cc954.jpg", "crop=1xw:1xh;center,top&resize=1200:*"),
      imageAlt: "Strawberries and cream tiramisu",
      imageCredit: "Delish",
      quote: "Summer arrives first as a craving.",
    },
  ],
  mediaPair: [
    {
      src: img("994eba96-3a00-41ba-b186-5cf2b7150ca1.jpg", "crop=1xw:1xh;center,top&resize=1200:*"),
      alt: "Warm-weather recipe from Delish",
      caption: "A recipe roundup should feel browsable, but the images still need to make each dish feel specific.",
      credit: "Delish",
      featured: true,
    },
    {
      src: img("lemon-bars-lead-65ef5aaea38e8.jpg", "crop=1xw:1xh;center,top&resize=1200:*"),
      alt: "Lemon bars for summer dessert",
      caption: "Lemon bars close the menu with brightness and a little nostalgia.",
      credit: "Delish",
    },
  ],
  body: (
    <>
      <ArticleSubheading>Make the Page Feel Hungry</ArticleSubheading>
      <p>Delish needs appetite first. The article is a list, but the editorial treatment should not feel like a directory. It should move from grill smoke to cold salads to fruit and dessert, so the reader feels a menu forming as they scroll.</p>
      <PullQuote>Warm-weather cooking is a mood before it is a meal plan.</PullQuote>
      <ArticleSubheading>Let Color Lead the Story</ArticleSubheading>
      <p>Red sauce, green herbs, golden chicken, pink strawberries, and lemon yellow can do the emotional work. The layout should use those colors as pacing, not decoration.</p>
      <ArticleFootnote number={1}>Source-grounded prototype based on Delish&apos;s May 14, 2026 ready-for-summer recipe collection.</ArticleFootnote>
    </>
  ),
  relatedArticles: [
    { title: "Grilled Coca-Cola Chicken", image: card("grilled-coca-cola-chicken-lead-web-616-jg-del069925-687fdcd53f84b.jpg") },
    { title: "Green Goddess Pasta Salad", image: card("green-goddess-pasta-salad-third-web-2076-rl-base-del039925-6806c6e20a7f5.jpg") },
    { title: "Strawberries and Cream Tiramisu", image: card("strawberries-cream-tiramisu-lead-681139e6cc954.jpg") },
    { title: "Lemon Bars for a Sunny Finish", image: card("lemon-bars-lead-65ef5aaea38e8.jpg") },
  ],
};

export const ESQUIRE_EDITORIAL_ARTICLE: ImmersiveArticleContent = {
  breadcrumbs: [{ label: "Entertainment" }, { label: "Music" }, { label: "A$AP Rocky" }],
  headline: "A$AP Rocky Is Living His American Dream",
  dek: "Hip-hop superstardom, a budding movie career, his own fashion line, and three kids with Rihanna. This is the new picture of success, and there ain't a picket fence in sight.",
  heroImage: img("index-69753a4e634e9.jpg", "crop=0.996xw:1xh;center,top&resize=1400:*"),
  heroImageAlt: "A$AP Rocky photographed for Esquire",
  heroImageCredit: "Erik Carter",
  author: "Esquire Editors",
  publishedDate: "January 28, 2026",
  navLinks: ["Entertainment", "Style", "Food & Drink", "News", "Gear", "Sports"],
  immersiveLabel: "Cover Story",
  immersiveKicker: "The profile is about swagger, family, style, risk, and a version of success that refuses the old American template.",
  introEyebrow: "Before the dream",
  posterQuoteEyebrow: "American note",
  visualEssayEyebrow: "Style sequence",
  visualEssayTitle: "The images should feel like status, motion, fatherhood, and fashion sharing the same frame.",
  bodyRailEyebrow: "Profile path",
  immersiveIntro: (
    <>
      <p>The Esquire story needs to feel controlled and electric. Rocky is moving through several identities at once: artist, actor, designer, father, partner, public figure, and the kind of cultural operator who understands image as power.</p>
      <p>The design should be black, white, red, and cinematic, with the photography carrying scale and the typography behaving like a magazine cover under pressure.</p>
    </>
  ),
  factRail: [
    { label: "Subject", value: "A$AP Rocky" },
    { label: "Album", value: "Don't Be Dumb" },
    { label: "Story axis", value: "Fame, family, fashion, reinvention" },
    { label: "Mood", value: "Sharp, nocturnal, self-possessed" },
  ],
  scenes: [
    {
      eyebrow: "The image",
      title: "Success Without the Picket Fence",
      body: "The American-dream frame is the hook, but Rocky's version is stranger and more interesting: family life, fashion ambition, music mythology, and a refusal to make success look conventional.",
      image: img("esq030126digitalcover-news2-69792a3e86ffb.jpg", "resize=1400:*"),
      imageAlt: "A$AP Rocky Esquire digital cover image",
      imageCredit: "Erik Carter",
      quote: "The dream is recognizable only after he remixes it.",
    },
    {
      eyebrow: "The style",
      title: "Fashion Is Part of the Reporting",
      body: "In an Esquire profile, clothes are not decoration. They are proof of point of view: how Rocky uses tailoring, silhouette, and gesture to control what the camera thinks it knows.",
      image: img("2-6975430c6a2b6.jpg", "resize=1400:*"),
      imageAlt: "A$AP Rocky fashion portrait from Esquire",
      imageCredit: "Erik Carter",
      align: "right",
    },
    {
      eyebrow: "The future",
      title: "A Life Moving in Several Directions",
      body: "The story widens from music into movies, family, business, and public imagination. The page should feel like momentum without losing the intimacy of a profile.",
      image: img("3-697542c8189f7.jpg", "resize=1400:*"),
      imageAlt: "A$AP Rocky portrait from Esquire story",
      imageCredit: "Erik Carter",
      quote: "The next act is not a pivot. It is an expansion.",
    },
  ],
  mediaPair: [
    {
      src: img("4-6975432bacfce.jpg", "crop=0.979xw:1.00xh;0.0207xw,0&resize=1400:*"),
      alt: "A$AP Rocky editorial portrait",
      caption: "The portrait sequence should feel like a fashion portfolio with profile stakes.",
      credit: "Erik Carter",
      featured: true,
    },
    {
      src: img("5-6975435862f00.jpg", "resize=1400:*"),
      alt: "A$AP Rocky photographed for Esquire",
      caption: "The quieter frames keep the story from becoming only spectacle.",
      credit: "Erik Carter",
    },
  ],
  body: (
    <>
      <ArticleSubheading>Make the Profile Feel Like a Cover Story</ArticleSubheading>
      <p>The article is not just a celebrity update. It is an image of modern success: music, fashion, film, family, and brand power all moving together. The page should make those layers visible without flattening Rocky into a list of achievements.</p>
      <PullQuote>The new American dream has no picket fence, but it has immaculate styling.</PullQuote>
      <ArticleSubheading>Let the Photography Set the Temperature</ArticleSubheading>
      <p>Esquire can carry more contrast and more attitude than the service brands. Big black fields, red punctuation, and deliberate white space let the portraits feel expensive and a little dangerous.</p>
      <ArticleFootnote number={1}>Source-grounded prototype based on Esquire&apos;s January 28, 2026 A$AP Rocky cover story.</ArticleFootnote>
    </>
  ),
  relatedArticles: [
    { title: "A$AP Rocky's Esquire Cover Story", image: card("index-69753a4e634e9.jpg") },
    { title: "The Style Portfolio Behind the Profile", image: card("4-6975432bacfce.jpg") },
    { title: "The Esquire Interview Archive", image: card("esq030126digitalcover-news2-69792a3e86ffb.jpg") },
    { title: "The Future of Celebrity Style", image: card("3-697542c8189f7.jpg") },
  ],
};

export const AUTOWEEK_EDITORIAL_ARTICLE = makeSourceEditorialArticle({
  displayMode: "photo-gallery",
  breadcrumbs: [{ label: "News" }, { label: "Concept Cars" }, { label: "Villa d'Este" }],
  headline: "Mama Mia! 'Tutto Rosso' Capricorn 01 Zagato Will Debut at Villa d'Este",
  dek: "The one-off hypercar makes Villa d'Este all the better.",
  heroImage: "15c47f1a-1727-44cb-8258-b432be96a663.jpeg",
  heroImageQuery: "resize=1800:*",
  heroImageAlt: "Capricorn 01 Zagato hypercar in red",
  heroImageCredit: "capricorn",
  author: "Mark Vaughn",
  publishedDate: "May 15, 2026",
  navLinks: ["News", "Reviews", "Racing", "Car Life", "Gear", "EV"],
  immersiveLabel: "Villa d'Este Debut",
  immersiveKicker: "We've seen Capricorns before, most recently at Retromobile in Paris. This Zagato-bodied one-off is a customer commission headed to the Concorso d'Eleganza Villa d'Este.",
  introEyebrow: "The reveal",
  posterQuoteEyebrow: "Coachbuilt note",
  visualEssayEyebrow: "Photo sequence",
  visualEssayTitle: "The car is the page: full-width frames, short context, and no compromised crops.",
  bodyRailEyebrow: "Gallery path",
  factRail: [
    { label: "Car", value: "Capricorn 01 Zagato" },
    { label: "Type", value: "Customer one-off" },
    { label: "Debut", value: "Villa d'Este" },
    { label: "Power", value: "900 hp" },
  ],
  scenes: [
    {
      eyebrow: "All red",
      title: "The Commission Sets the Tone",
      body: "Capricorn presents Tutto Rosso as an all-red customer commission, but the story is not only color. It is also a validation prototype pointing toward series production.",
      image: "936145be-a942-43dd-9eef-90cb3c276c91.jpeg",
      imageAlt: "Capricorn 01 Zagato Tutto Rosso rear three-quarter view",
      imageCredit: "capricorn",
      imageQuery: "resize=1800:*",
      imageFit: "contain",
      layout: "wide",
    },
    {
      eyebrow: "Heritage",
      title: "Red Carries Motorsport Memory",
      body: "The monochrome red treatment nods to Zagato-bodied competition cars and turns the car into a modern reading of coachbuilt Italian drama.",
      image: "2b214a02-0b4f-4289-a91f-5a1f5128af4b.jpeg",
      imageAlt: "Capricorn 01 Zagato profile detail",
      imageCredit: "capricorn",
      imageQuery: "resize=1800:*",
      imageFit: "contain",
      layout: "wide",
    },
    {
      eyebrow: "Intent",
      title: "Enjoyment Beats Numbers",
      body: "The Capricorn 01 is positioned around the feel of driving rather than a single maximum-speed claim. The gallery needs to let that restraint breathe.",
      image: "2b70a5cc-3546-4cfd-abea-3b9701107070.jpeg",
      imageAlt: "Capricorn 01 Zagato detail at debut",
      imageCredit: "capricorn",
      imageQuery: "resize=1800:*",
      imageFit: "contain",
      layout: "wide",
    },
    {
      eyebrow: "Joy",
      title: "The Target Is Smile Per Mile",
      body: "Instead of staging the car like a spec-sheet war, the article keeps returning to the emotional goal: a manual, rear-drive hypercar built to feel joyful.",
      image: "a76dbd18-e4a6-474b-bfc5-e77db6f1078f.jpeg",
      imageAlt: "Capricorn 01 Zagato cockpit and exterior red detail",
      imageCredit: "capricorn",
      imageQuery: "resize=1800:*",
      imageFit: "contain",
      layout: "wide",
      quote: "Back to the joy of driving.",
    },
    {
      eyebrow: "Character",
      title: "The Car Should Feel Human",
      body: "Robertino Wild's point is that intensity should not erase pleasure. The design has to look extreme while still suggesting approachability from the driver's seat.",
      image: "c1493adf-7e23-4b86-bc84-2c5065bf26c4.jpeg",
      imageAlt: "Capricorn 01 Zagato Tutto Rosso front and side detail",
      imageCredit: "capricorn",
      imageQuery: "resize=1800:*",
      imageFit: "contain",
      layout: "wide",
    },
    {
      eyebrow: "Materials",
      title: "Carbon Fiber Does the Heavy Lifting",
      body: "The chassis, body, and much of the cabin use carbon fiber, while the remaining technical pieces lean on milled aluminum and titanium.",
      image: "a4b62ce5-8f25-4037-ac65-4eccb991e8c8.jpeg",
      imageAlt: "Capricorn 01 Zagato red carbon interior detail",
      imageCredit: "capricorn",
      imageQuery: "resize=1800:*",
      imageFit: "contain",
      layout: "wide",
    },
    {
      eyebrow: "Chassis",
      title: "The Suspension Supports the Story",
      body: "A double-wishbone pushrod Bilstein suspension gives the car comfort, sport, and track modes, tying the visual drama back to road behavior.",
      image: "97bfe1d3-f543-411e-84e9-ad330fc9c461.jpeg",
      imageAlt: "Capricorn 01 Zagato mechanical detail",
      imageCredit: "capricorn",
      imageQuery: "resize=1800:*",
      imageFit: "contain",
      layout: "wide",
    },
    {
      eyebrow: "Cockpit",
      title: "The Red Continues Inside",
      body: "The commissioned finish carries through the body, cockpit, components, and visible materials, making the color a system rather than a paint choice.",
      image: "eeb3e979-f4d2-4675-a82d-51fb56d11c99.jpeg",
      imageAlt: "Capricorn 01 Zagato red cockpit detail",
      imageCredit: "capricorn",
      imageQuery: "resize=1800:*",
      imageFit: "contain",
      layout: "wide",
    },
    {
      eyebrow: "Prototype",
      title: "Nearly Every Surface Goes Red",
      body: "The article notes that most visible surfaces are red, with contrast reserved for functional pieces like the shift gate and pedals.",
      image: "83b2be78-652c-47ca-8328-f07fe14d07b7.jpeg",
      imageAlt: "Capricorn 01 Zagato red interior surface detail",
      imageCredit: "capricorn",
      imageQuery: "resize=1800:*",
      imageFit: "contain",
      layout: "wide",
    },
    {
      eyebrow: "Powertrain",
      title: "Manual Drama Meets 900 Horsepower",
      body: "The story lands the specs late: a supercharged 5.2-liter Ford V8, a five-speed manual with a dogleg first gear, 738 lb-ft of torque, and a 223-mph top speed.",
      image: "29c88b8c-61aa-4415-b029-326aff0f4b83.jpeg",
      imageAlt: "Capricorn 01 Zagato red exterior view",
      imageCredit: "capricorn",
      imageQuery: "resize=1800:*",
      imageFit: "contain",
      layout: "wide",
    },
    {
      eyebrow: "Validation",
      title: "A One-Off That Still Teaches the Program",
      body: "The final point is development as much as styling: an extreme customer vision helps Capricorn test how design, materials, and production planning work together.",
      image: "557ac3a8-1144-4df6-a254-3c1087f910e1.png",
      imageAlt: "Capricorn 01 Zagato Tutto Rosso side profile",
      imageCredit: "capricorn",
      imageQuery: "resize=1800:*",
      imageFit: "contain",
      layout: "wide",
    },
  ],
  sourceNote: "Source-grounded prototype based on Autoweek's May 15, 2026 Capricorn 01 Zagato Villa d'Este production article.",
  bodySubheading: "Keep the Gallery Structure",
  bodyCopy: "The article works best as a long vertical image sequence, with the car shown intact and the written context arriving between photographs.",
  pullQuote: "The car is the page.",
  body: (
    <>
      <ArticleFootnote number={1}>Prototype adapted from Autoweek&apos;s May 15, 2026 Capricorn 01 Zagato Villa d&apos;Este production article and image sequence.</ArticleFootnote>
    </>
  ),
});

export const BEST_PRODUCTS_EDITORIAL_ARTICLE = makeSourceEditorialArticle({
  breadcrumbs: [{ label: "Lifestyle" }, { label: "Travel" }, { label: "USA" }],
  headline: "The 50 Best Places to Visit in the U.S., From Napa Valley to Nantucket",
  dek: "A coast-to-coast travel list becomes more useful when the page feels like itinerary, aspiration, and practical discovery at once.",
  heroImage: "aerial-shot-of-bixby-bridge-in-big-sur-state-park-royalty-free-image-1772255087.pjpeg",
  heroImageQuery: "crop=1.00xw:0.752xh;0,0.130xh&resize=1400:*",
  heroImageAlt: "Aerial view of Bixby Bridge in Big Sur",
  heroImageCredit: "Best Products",
  author: "Adam Schubak and Jill Fergus",
  publishedDate: "Jan 19, 2018",
  navLinks: ["Tech", "Home", "Travel", "Style", "Fitness", "Gifts"],
  immersiveLabel: "Travel Guide",
  immersiveKicker: "Best Products should feel bright and useful: a beautifully organized wish list that turns a long roundup into a visual itinerary.",
  introEyebrow: "Before the itinerary",
  posterQuoteEyebrow: "Travel note",
  visualEssayEyebrow: "Route board",
  visualEssayTitle: "The visuals should jump from coast, to desert, to city, to food, so the list feels expansive instead of endless.",
  bodyRailEyebrow: "Route path",
  factRail: [
    { label: "List", value: "50 U.S. destinations" },
    { label: "Promise", value: "Coast-to-coast ideas" },
    { label: "Mood", value: "Useful, bright, escapist" },
    { label: "Reader job", value: "Find the next trip quickly" },
  ],
  scenes: [
    {
      eyebrow: "The coast",
      title: "Start With the Open Road",
      body: "Big Sur gives the story instant scale: ocean, bridge, road, and the fantasy of a trip that begins with a bend in the highway.",
      image: "smathers-beach-in-key-west-royalty-free-image-1772255241.pjpeg",
      imageAlt: "Smathers Beach in Key West",
      imageCredit: "Best Products",
      quote: "A list becomes emotional when the first image feels like departure.",
    },
    {
      eyebrow: "The view",
      title: "Let Landscape Do the Sorting",
      body: "Grand Canyon scale changes the rhythm. The page needs room for visual pause before returning to practical destination logic.",
      image: "sunset-at-desert-view-point-royalty-free-image-1772255359.pjpeg",
      imageAlt: "Grand Canyon at sunset",
      imageCredit: "Best Products",
    },
    {
      eyebrow: "The city",
      title: "End With a Place You Can Taste",
      body: "A destination roundup works when it remembers food, streets, music, and local texture. The final chapter should feel specific enough to act on.",
      image: "11-kansas-city-ribs-1625695631.jpg",
      imageAlt: "Kansas City ribs",
      imageCredit: "Best Products",
      quote: "The best guides make planning feel like already being there.",
    },
  ],
  sourceNote: "Source-grounded prototype based on Best Products' U.S. travel guide.",
  bodySubheading: "Make the List Feel Like a Trip",
  bodyCopy: "The story is long by nature, so the design needs choreography: big scenic moments, quick utility beats, and a rhythm that keeps the reader oriented while still creating desire.",
  pullQuote: "A good travel list should feel browsable, but never generic.",
});

export const BIOGRAPHY_EDITORIAL_ARTICLE = makeSourceEditorialArticle({
  breadcrumbs: [{ label: "Musicians" }, { label: "Taylor Swift" }],
  headline: "Taylor Swift's Docuseries The End of an Era Shows the Singer at Her Most Vulnerable",
  dek: "The profile context is fame, performance, vulnerability, and the emotional aftermath of a global tour lived under extraordinary pressure.",
  heroImage: "taylor-swift-performs-onstage-during-taylor-swift-the-news-photo-1765554835.pjpeg",
  heroImageQuery: "crop=1.00xw:0.770xh;0,0.132xh&resize=1400:*",
  heroImageAlt: "Taylor Swift performing onstage",
  heroImageCredit: "Biography",
  author: "Biography.com Editors",
  publishedDate: "Apr 2, 2014",
  navLinks: ["Musicians", "Actors", "History", "Sports", "News", "Videos"],
  immersiveLabel: "Biography",
  immersiveKicker: "Biography should feel archival and intimate: public scale, private stakes, and a timeline that turns celebrity into a human story.",
  introEyebrow: "Before the archive",
  posterQuoteEyebrow: "Timeline note",
  visualEssayEyebrow: "Life sequence",
  visualEssayTitle: "The visuals should move between stage, red carpet, archive, and cultural afterimage.",
  bodyRailEyebrow: "Life path",
  factRail: [
    { label: "Subject", value: "Taylor Swift" },
    { label: "Lens", value: "Career, vulnerability, cultural scale" },
    { label: "Mood", value: "Archival, human, bright under pressure" },
    { label: "Reader job", value: "Understand the person through the timeline" },
  ],
  scenes: [
    {
      eyebrow: "The stage",
      title: "Scale Comes First",
      body: "The performance image tells the reader what public life looks like at maximum size: lights, crowd, costume, precision.",
      image: "musician-taylor-swift-performs-onstage-during-the-news-photo-1698158476.jpg",
      imageAlt: "Taylor Swift performing during the Eras Tour",
      imageCredit: "Biography",
      quote: "A biography starts with the public image, then asks what it costs.",
      imagePosition: "56% 38%",
    },
    {
      eyebrow: "The lens",
      title: "Fame Has a Close-Up",
      body: "Red-carpet portraiture changes the distance. The story becomes about scrutiny, control, and the way a person manages being interpreted.",
      image: "81st-golden-globe-awards-taylor-swift-on-the-red-carpet-of-news-photo-1719260997.jpg",
      imageAlt: "Taylor Swift on a red carpet",
      imageCredit: "Biography",
      imagePosition: "50% 24%",
    },
    {
      eyebrow: "The record",
      title: "Memory Turns Into Material",
      body: "The visual system should make room for albums, eras, tour images, and the artifacts that turn a career into a cultural record.",
      image: "taylor-swift-merch-660b1a5c550bf.jpg",
      imageQuery: "crop=0.405xw:0.81xh;0.547xw,0.093xh&resize=1400:*",
      imageAlt: "Taylor Swift merchandise and cultural artifacts",
      imageCredit: "Biography",
      quote: "The archive is not static. It keeps being rewritten in public.",
    },
  ],
  sourceNote: "Source-grounded prototype based on Biography's Taylor Swift page and related docuseries update.",
  bodySubheading: "Make the Timeline Feel Human",
  bodyCopy: "Biography needs structure, but it also needs empathy. The editorial variant should move through fame, work, pressure, and memory without feeling like a flat chronology.",
  pullQuote: "The life story is strongest when scale and vulnerability sit in the same frame.",
});

export const ELLE_DECOR_EDITORIAL_ARTICLE = makeSourceEditorialArticle({
  breadcrumbs: [{ label: "Design + Decorate" }, { label: "House Interiors" }],
  headline: "This Northern California Home Captures the Spirit of Joni Mitchell",
  dek: "Commune Design rejuvenates a family retreat through local craft, natural texture, and a design language tuned to landscape and memory.",
  heroImage: "f5c359ae-20fc-4295-860a-1a2a29003de9.jpg",
  heroImageQuery: "crop=1xw:0.747xh;0xw,0.056xh&resize=1400:*",
  heroImageAlt: "Northern California house interior",
  heroImageCredit: "Elle Decor",
  author: "Annie Goldsmith",
  publishedDate: "May 15, 2026",
  navLinks: ["Design", "Decorate", "House Tours", "Shopping", "Culture", "Travel"],
  immersiveLabel: "House Tour",
  immersiveKicker: "Elle Decor should feel composed and transportive: rooms as atmosphere, materials as memory, and craft as the real plot.",
  introEyebrow: "Before the tour",
  posterQuoteEyebrow: "Material note",
  visualEssayEyebrow: "Room sequence",
  visualEssayTitle: "The images should move from architecture to object to texture, letting the house reveal itself slowly.",
  bodyRailEyebrow: "Room path",
  factRail: [
    { label: "Design", value: "Commune Design" },
    { label: "Place", value: "Northern California" },
    { label: "Mood", value: "Crafted, natural, musical" },
    { label: "Story job", value: "Turn interiors into atmosphere" },
  ],
  scenes: [
    {
      eyebrow: "The setting",
      title: "A House Tuned to Landscape",
      body: "The first movement should make the home feel settled into its environment, not dropped onto it.",
      image: "386e567a-8f9d-4545-92e3-f8032fabfe50.jpg",
      imageAlt: "Interior detail from Northern California home",
      imageCredit: "Elle Decor",
      quote: "The room works because the landscape is still present.",
    },
    {
      eyebrow: "The craft",
      title: "Local Hands Give It Warmth",
      body: "The article's emotional center is collaboration: artisans, material intelligence, and the sense that every surface has been considered.",
      image: "27f17431-3ad8-40cc-a7a0-40cc00b6fd79.jpg",
      imageAlt: "Craft detail from Elle Decor house tour",
      imageCredit: "Elle Decor",
    },
    {
      eyebrow: "The feeling",
      title: "Design as a Memory System",
      body: "The Joni Mitchell reference should not feel literal. It should guide the pacing: lyrical, textured, familiar, and quietly radiant.",
      image: "f5c359ae-20fc-4295-860a-1a2a29003de9.jpg",
      imageAlt: "Northern California home by Commune Design",
      imageCredit: "Elle Decor",
      quote: "A house tour becomes memorable when the rooms feel like a chorus.",
    },
  ],
  sourceNote: "Source-grounded prototype based on ELLE Decor's May 15, 2026 Commune Design Northern California house tour.",
  bodySubheading: "Make the Home Feel Composed",
  bodyCopy: "This story asks for quiet confidence: restrained typography, full-width room moments, and captions that make materials part of the narrative rather than decoration.",
  pullQuote: "The design story is not what the room contains. It is how the room holds feeling.",
});

export const GOOD_HOUSEKEEPING_EDITORIAL_ARTICLE = makeSourceEditorialArticle({
  breadcrumbs: [{ label: "Beauty" }, { label: "Hair Tools" }, { label: "Tested" }],
  headline: "Beauty Pros Say These Are the 5 Best Curling Irons for Salon-Worthy Hair",
  dek: "A service story becomes editorial when testing, texture, shine, and the promise of good hair are made visible.",
  heroImage: "be51be81-ae88-4eec-913f-37028692ca0a.png",
  heroImageQuery: "crop=1.00xw:0.835xh;0,0.0759xh&resize=1400:*",
  heroImageAlt: "Curling irons tested by Good Housekeeping",
  heroImageCredit: "Good Housekeeping",
  author: "Sabina Wizemann",
  publishedDate: "May 11, 2026",
  navLinks: ["Home", "Beauty", "Health", "Food", "Shopping", "Holidays"],
  immersiveLabel: "Beauty Lab Tested",
  immersiveKicker: "Good Housekeeping should feel trusted but polished: lab proof, beauty texture, and service clarity with a premium finish.",
  introEyebrow: "Before the test",
  posterQuoteEyebrow: "Lab note",
  visualEssayEyebrow: "Tool board",
  visualEssayTitle: "The visuals should make heat, curl, finish, and trust feel instantly legible.",
  bodyRailEyebrow: "Test path",
  factRail: [
    { label: "Products", value: "5 curling irons" },
    { label: "Source", value: "Beauty Lab testing" },
    { label: "Mood", value: "Practical, polished, trusted" },
    { label: "Reader job", value: "Choose quickly with confidence" },
  ],
  scenes: [
    {
      eyebrow: "The test",
      title: "Proof Before Polish",
      body: "The opening should communicate Good Housekeeping authority: tools tested, results compared, and beauty advice grounded in expertise.",
      image: "18de0283-f311-4645-a7db-ff89c9a129f0.png",
      imageAlt: "Curling iron product detail",
      imageCredit: "Good Housekeeping",
      quote: "A beauty recommendation earns trust before it earns shine.",
      imageTreatment: "before-after",
    },
    {
      eyebrow: "The finish",
      title: "Make the Result Visible",
      body: "The page should show what the reader wants: curl shape, smoothness, heat control, and a tool that feels easy to imagine using.",
      image: "e13ec776-52c0-43f9-afe4-850c71686f4e.png",
      imageAlt: "Curling iron testing product visual",
      imageCredit: "Good Housekeeping",
      imageTreatment: "before-after",
    },
    {
      eyebrow: "The choice",
      title: "Service Can Still Feel Beautiful",
      body: "The design needs shopping utility without collapsing into a grid. Heroic product imagery can make the recommendation feel curated.",
      image: "1bf58840-4e9e-4304-aff0-7b0c5f1700d8.png",
      imageAlt: "Curling iron product still life",
      imageCredit: "Good Housekeeping",
      quote: "The best service journalism makes the decision feel lighter.",
      imageTreatment: "before-after",
    },
  ],
  sourceNote: "Source-grounded prototype based on Good Housekeeping's May 11, 2026 curling irons guide.",
  bodySubheading: "Make Testing Feel Editorial",
  bodyCopy: "Good Housekeeping brings authority. The template should make that authority visible through clean pacing, precise captions, and polished product storytelling.",
  pullQuote: "Trust is the story; shine is the reward.",
});

export const HARPERS_BAZAAR_EDITORIAL_ARTICLE = makeSourceEditorialArticle({
  breadcrumbs: [{ label: "Fashion" }, { label: "Runway" }, { label: "Dior" }],
  headline: "Hooray for Hollywood! And Jonathan Anderson's First Dior Cruise Collection",
  dek: "A Los Angeles show becomes a tribute to fashion, film, arrival, and the charged glamour of a first collection.",
  heroImage: "cc352106-e4fc-4833-b3d2-f7a549da0522.gif",
  heroImageQuery: "crop=1xw:0.888888888889xh;center,top&resize=1400:*",
  heroImageAlt: "Dior Resort 2027 Los Angeles runway moment",
  heroImageCredit: "Launchmetrics",
  author: "Brooke Bobb",
  publishedDate: "May 14, 2026",
  navLinks: ["Fashion", "Beauty", "Culture", "Celebrity", "Shopping", "Runway"],
  immersiveLabel: "Runway Review",
  immersiveKicker: "Bazaar needs fashion theater: cinematic image scale, elegant tension, and typography that feels like an invitation to a front row.",
  introEyebrow: "Before the show",
  posterQuoteEyebrow: "Runway note",
  visualEssayEyebrow: "Look sequence",
  visualEssayTitle: "The visuals should feel like fashion and film sharing the same spotlight.",
  bodyRailEyebrow: "Show path",
  factRail: [
    { label: "House", value: "Dior" },
    { label: "Designer", value: "Jonathan Anderson" },
    { label: "Place", value: "Los Angeles" },
    { label: "Mood", value: "Hollywood, heritage, first act" },
  ],
  scenes: [
    {
      eyebrow: "The entrance",
      title: "Hollywood Sets the Light",
      body: "The opening should make the runway feel cinematic: not just clothes, but place, legacy, and the first charged look at a new chapter.",
      image: "88c34cac-e692-48f2-91a1-541f2d5b1b08.jpg",
      imageAlt: "Dior runway detail",
      imageCredit: "Launchmetrics",
      quote: "A debut collection is a thesis delivered under lights.",
    },
    {
      eyebrow: "The silhouette",
      title: "The Look Carries the Argument",
      body: "A Bazaar treatment should let individual looks breathe, pairing fashion detail with enough white space to feel expensive.",
      image: "788f5d55-14f1-4a39-9c66-a388f608b5c8.jpg",
      imageAlt: "Dior Resort 2027 look",
      imageCredit: "Launchmetrics",
    },
    {
      eyebrow: "The house",
      title: "Heritage Meets First Act",
      body: "The story is about interpretation: what Dior means in Los Angeles and what a new creative lead chooses to emphasize first.",
      image: "cc352106-e4fc-4833-b3d2-f7a549da0522.gif",
      imageAlt: "Dior Resort 2027 runway image",
      imageCredit: "Launchmetrics",
      quote: "The runway is also a letter of intent.",
    },
  ],
  sourceNote: "Source-grounded prototype based on Harper's Bazaar's May 14, 2026 Dior Resort 2027 Los Angeles coverage.",
  bodySubheading: "Make the Review Feel Like a Front Row",
  bodyCopy: "Fashion coverage needs pace and restraint: show scale, look detail, cultural reference, and the quiet authority of a critic choosing what matters.",
  pullQuote: "The collection arrives as cinema before it becomes commerce.",
});

export const HOUSE_BEAUTIFUL_EDITORIAL_ARTICLE = makeSourceEditorialArticle({
  breadcrumbs: [{ label: "Design Inspiration" }, { label: "House Tours" }, { label: "Los Angeles" }],
  headline: "Jeremiah Brent Added Antiques and Ample Seating to This Hosting-Ready L.A. Home",
  dek: "A Los Angeles home tour becomes a story about hospitality, antiques, materials, and rooms made for people to gather.",
  heroImage: "hbx030124jeremiahbrent-002-65f1e164f2a25.jpg",
  heroImageQuery: "crop=1xw:0.72xh;0,0.20xh&resize=1400:*",
  heroImageAlt: "Jeremiah Brent Los Angeles home interior",
  heroImageCredit: "House Beautiful",
  author: "Kelly Allen",
  publishedDate: "May 9, 2026",
  navLinks: ["Design", "House Tours", "Shopping", "Gardening", "Lifestyle", "Color"],
  immersiveLabel: "Digital Home Tour",
  immersiveKicker: "House Beautiful should feel welcoming and layered: hosting as architecture, antiques as warmth, and rooms that invite the reader to stay.",
  introEyebrow: "Before the tour",
  posterQuoteEyebrow: "Hosting note",
  visualEssayEyebrow: "Room sequence",
  visualEssayTitle: "The images should show how seating, texture, and antiques create emotional hospitality.",
  bodyRailEyebrow: "Room path",
  factRail: [
    { label: "Designer", value: "Jeremiah Brent" },
    { label: "Place", value: "Los Angeles" },
    { label: "Mood", value: "Warm, layered, hosting-ready" },
    { label: "Story job", value: "Make rooms feel lived in" },
  ],
  scenes: [
    {
      eyebrow: "The room",
      title: "Hospitality Starts With Scale",
      body: "The first room image should communicate welcome: seating, light, conversation, and enough softness to make design feel human.",
      image: "west-stafford-218-edit-65f1e1a508b1a.jpg",
      imageAlt: "Hosting-ready interior detail",
      imageCredit: "House Beautiful",
      quote: "A beautiful room works hardest when people are in it.",
    },
    {
      eyebrow: "The antiques",
      title: "Old Pieces Add Memory",
      body: "Antiques give the home a narrative before any caption explains it. The layout should use detail images like evidence of life.",
      image: "hbx030124jeremiahbrent-001-65f1e1633e9ba.jpg",
      imageAlt: "Antique detail in Los Angeles home",
      imageCredit: "House Beautiful",
    },
    {
      eyebrow: "The gathering",
      title: "Design for People to Stay",
      body: "The story is strongest when the reader understands the room as an experience: generous, social, and ready for a night that runs long.",
      image: "hbx030124jeremiahbrent-002-65f1e164f2a25.jpg",
      imageAlt: "Jeremiah Brent Los Angeles home",
      imageCredit: "House Beautiful",
      quote: "Hospitality is a design system of its own.",
    },
  ],
  sourceNote: "Source-grounded prototype based on House Beautiful's May 9, 2026 Jeremiah Brent Los Angeles home tour.",
  bodySubheading: "Make the Home Feel Ready for Company",
  bodyCopy: "This story is about design as invitation. The editorial variant should make every image feel like a room the reader can enter, not just a picture to admire.",
  pullQuote: "The best house tour makes you hear the room before it explains the room.",
});

export const MENS_HEALTH_EDITORIAL_ARTICLE = makeSourceEditorialArticle({
  breadcrumbs: [{ label: "Fitness" }, { label: "Gear" }, { label: "Home Gym" }],
  headline: "We Found the Best Adjustable Dumbbells for Every Home Gym",
  dek: "A gear guide becomes more powerful when strength, space, testing, and equipment clarity all show up in the visual system.",
  heroImage: "cthfwkzv-6909141a38163.jpg",
  heroImageQuery: "crop=1.00xw:0.502xh;0,0.359xh&resize=1400:*",
  heroImageAlt: "Adjustable dumbbells for a home gym",
  heroImageCredit: "Men's Health",
  author: "Charles Thorp, NASM",
  publishedDate: "May 11, 2023",
  navLinks: ["Fitness", "Gear", "Health", "Style", "Nutrition", "Workouts"],
  immersiveLabel: "Gear Tested",
  immersiveKicker: "Men's Health should feel direct and muscular: equipment as proof, training space as context, and a buying guide that still has impact.",
  introEyebrow: "Before the lift",
  posterQuoteEyebrow: "Training note",
  visualEssayEyebrow: "Gear sequence",
  visualEssayTitle: "The visuals should make weight, grip, space, and performance immediately legible.",
  bodyRailEyebrow: "Test path",
  factRail: [
    { label: "Gear", value: "Adjustable dumbbells" },
    { label: "Use case", value: "Home gyms" },
    { label: "Mood", value: "Strong, efficient, tested" },
    { label: "Reader job", value: "Pick the right weight system" },
  ],
  scenes: [
    {
      eyebrow: "The setup",
      title: "Space Is the Constraint",
      body: "The guide starts with the problem: too many weights, not enough room, and the need for gear that works hard without taking over.",
      image: "best-adjustable-dumbbells-for-men-69090dfb172e0.jpg",
      imageAlt: "Adjustable dumbbells in a home gym",
      imageCredit: "Men's Health",
      quote: "The best equipment makes a small room feel capable.",
    },
    {
      eyebrow: "The test",
      title: "Grip, Change, Repeat",
      body: "Men's Health credibility comes from use. The page should make adjustment, grip, build, and workout flow visible.",
      image: "best-dumbbells-for-men-6978c9866fd48.jpg",
      imageAlt: "Dumbbell testing image",
      imageCredit: "Men's Health",
    },
    {
      eyebrow: "The build",
      title: "A Better Home Gym Starts Here",
      body: "The final movement should broaden from dumbbells into the room they create: efficient, focused, and ready for consistency.",
      image: "home-gym-gear-68d44bb1eaa9d.jpg",
      imageAlt: "Home gym gear",
      imageCredit: "Men's Health",
      quote: "Strength gear should clarify the workout, not clutter it.",
    },
  ],
  sourceNote: "Source-grounded prototype based on Men's Health's adjustable dumbbells guide.",
  bodySubheading: "Make Gear Feel Tested, Not Listed",
  bodyCopy: "The Men’s Health version needs discipline: big product images, punchy captions, and practical information that feels like coaching rather than catalog copy.",
  pullQuote: "The product story is really a space story.",
});

export const OPRAH_DAILY_EDITORIAL_ARTICLE = makeSourceEditorialArticle({
  breadcrumbs: [{ label: "Life" }, { label: "Health" }, { label: "Menopause" }],
  headline: "Do Your Favorite Foods Suddenly Taste Bland or Bad? It Could Be Perimenopause",
  dek: "A health story about changing taste needs sensitivity, clarity, and a visual rhythm that makes a surprising symptom feel understood.",
  heroImage: "24a9fb5d-e308-488b-b7b2-30afe5754185.jpg",
  heroImageQuery: "crop=1xw:1.0xh;center,top&resize=1400:*",
  heroImageAlt: "Food and taste changes visual",
  heroImageCredit: "Oprah Daily",
  author: "Christina Manian",
  publishedDate: "May 13, 2026",
  navLinks: ["Life", "Health", "Spirit", "Culture", "Books", "Style"],
  immersiveLabel: "Health",
  immersiveKicker: "Oprah Daily should feel personal and wise: surprising body changes explained with warmth, dignity, and enough beauty to invite the reader in.",
  introEyebrow: "Before the symptom",
  posterQuoteEyebrow: "Body note",
  visualEssayEyebrow: "Senses sequence",
  visualEssayTitle: "The visuals should turn taste, memory, body change, and reassurance into a calm emotional path.",
  bodyRailEyebrow: "Health path",
  factRail: [
    { label: "Topic", value: "Taste changes" },
    { label: "Context", value: "Perimenopause" },
    { label: "Mood", value: "Warm, clear, reassuring" },
    { label: "Reader job", value: "Feel informed, not alarmed" },
  ],
  scenes: [
    {
      eyebrow: "The surprise",
      title: "Taste Can Change the Story",
      body: "The opening needs empathy. A favorite food tasting wrong is small on paper, but intimate in real life.",
      image: "8fb195a7-90bd-4e58-b55e-39b7e175b36e.jpg",
      imageAlt: "Food and taste visual",
      imageCredit: "Oprah Daily",
      quote: "A symptom feels less strange when the page makes room for it.",
    },
    {
      eyebrow: "The body",
      title: "Hormones Touch the Everyday",
      body: "The story should connect science to daily life with calm authority, letting the visual design soften complexity without oversimplifying it.",
      image: "menopause-6890c9012285e.png",
      imageAlt: "Menopause health illustration",
      imageCredit: "Oprah Daily",
    },
    {
      eyebrow: "The care",
      title: "Information Can Feel Gentle",
      body: "The final movement should feel like guidance: not a diagnosis machine, but a compassionate path toward understanding what changed.",
      image: "relationships-6890c9389aece.png",
      imageAlt: "Health and relationships illustration",
      imageCredit: "Oprah Daily",
      quote: "Clarity is care when the body starts speaking differently.",
    },
  ],
  sourceNote: "Source-grounded prototype based on Oprah Daily's May 13, 2026 story on taste changes and perimenopause.",
  bodySubheading: "Make Health Feel Human",
  bodyCopy: "This Oprah Daily article needs a slower emotional register than a gear guide or runway story. The template should prioritize reassurance, warmth, and visual calm.",
  pullQuote: "The body story is personal before it is clinical.",
});

export const POPULAR_MECHANICS_EDITORIAL_ARTICLE = makeSourceEditorialArticle({
  breadcrumbs: [{ label: "Science" }, { label: "Animals" }, { label: "Research" }],
  headline: "The Dogs of Chernobyl Are Experiencing Rapid Evolution, Study Suggests",
  dek: "A science story becomes cinematic when the page holds the strangeness of place, the intimacy of animals, and the rigor of genetic research together.",
  heroImage: "stray-dogs-hang-out-near-an-abandoned-partially-completed-news-photo-1764858016.pjpeg",
  heroImageQuery: "crop=1.00xw:0.751xh;0,0.180xh&resize=1400:*",
  heroImageAlt: "Dogs near abandoned buildings around Chernobyl",
  heroImageCredit: "Popular Mechanics",
  author: "Darren Orf",
  publishedDate: "May 7, 2026",
  navLinks: ["Science", "Technology", "Cars", "DIY", "Military", "Space"],
  immersiveLabel: "Science",
  immersiveKicker: "Popular Mechanics should feel investigative: eerie place, living subjects, data, and the question of what adaptation means.",
  introEyebrow: "Before the research",
  posterQuoteEyebrow: "Science note",
  visualEssayEyebrow: "Evidence sequence",
  visualEssayTitle: "The visuals should move from abandoned landscape to animal presence to scientific uncertainty.",
  bodyRailEyebrow: "Evidence path",
  factRail: [
    { label: "Subject", value: "Chernobyl dogs" },
    { label: "Lens", value: "DNA and rapid evolution" },
    { label: "Mood", value: "Eerie, curious, evidence-led" },
    { label: "Reader job", value: "Feel the mystery and the method" },
  ],
  scenes: [
    {
      eyebrow: "The zone",
      title: "Place Makes the Mystery",
      body: "The abandoned landscape should not be background. It is the environmental pressure that makes the research feel urgent.",
      image: "abandoned-street-in-ghost-city-prypyat-in-chernobyl-royalty-free-image-1739990136.pjpeg",
      imageAlt: "Abandoned street in Pripyat near Chernobyl",
      imageCredit: "Popular Mechanics",
      quote: "The setting is part of the experiment.",
    },
    {
      eyebrow: "The animals",
      title: "The Subjects Are Living With the Aftermath",
      body: "The dogs bring intimacy to a story that could otherwise feel abstract. The page should keep them present without sensationalizing them.",
      image: "stray-dogs-hang-out-near-an-abandoned-partially-completed-news-photo-1764858016.pjpeg",
      imageAlt: "Dogs near abandoned Chernobyl structure",
      imageCredit: "Popular Mechanics",
    },
    {
      eyebrow: "The proof",
      title: "Evidence Needs Atmosphere",
      body: "The science is the point, but the storytelling works because evidence and unease move together.",
      image: "cage-full-of-young-essex-hounds-waiting-for-their-first-cub-news-photo-1764211615.pjpeg",
      imageAlt: "Dogs in research context",
      imageCredit: "Popular Mechanics",
      quote: "A good science page lets uncertainty stay visible.",
    },
  ],
  sourceNote: "Source-grounded prototype based on Popular Mechanics' May 7, 2026 Chernobyl dogs DNA research story.",
  bodySubheading: "Make the Evidence Feel Alive",
  bodyCopy: "The Popular Mechanics version should lean into visual investigation: dark scale, clean labels, and story beats that make the reader feel both the mystery and the method.",
  pullQuote: "Science storytelling works when the data has a place to live.",
});

export const PREVENTION_EDITORIAL_ARTICLE = makeSourceEditorialArticle({
  breadcrumbs: [{ label: "Health" }, { label: "Symptoms" }, { label: "Fainting" }],
  headline: "Doctors Share 10 Causes of Feeling Faint or Lightheaded",
  dek: "Dehydration, skipped meals, and heart issues can all be behind that faint feeling.",
  heroImage: "e78289d4-0ae9-45f9-b73a-ebe07756340d.jpeg",
  heroImageQuery: "crop=1xw:0.749xh;0xw,0.05xh&resize=1400:*",
  heroImageAlt: "A woman resting with her hand near her face",
  heroImageCredit: "Prevention",
  author: "Sarah Klein",
  publishedDate: "May 16, 2026",
  navLinks: ["Health", "Fitness", "Food", "Mind", "Beauty", "Aging"],
  immersiveLabel: "Health",
  immersiveKicker: "The page should feel calm and diagnostic: a quiet visual rhythm for a body signal that can mean several different things.",
  introEyebrow: "Before the symptoms",
  posterQuoteEyebrow: "Body signal",
  visualEssayEyebrow: "Symptom notes",
  visualEssayTitle: "The images should make lightheadedness feel legible, not alarming.",
  bodyRailEyebrow: "Care path",
  factRail: [
    { label: "Signal", value: "Faintness or lightheadedness" },
    { label: "Common causes", value: "Hydration, food, blood pressure" },
    { label: "Risk frame", value: "Know when to call a doctor" },
    { label: "Mood", value: "Clear, calm, useful" },
  ],
  scenes: [
    {
      eyebrow: "The signal",
      title: "The Body Asks for Attention",
      body: "The opening image should slow the reader down. Feeling faint is not a dramatic effect here; it is a physical cue that deserves clarity.",
      image: "e78289d4-0ae9-45f9-b73a-ebe07756340d.jpeg",
      imageAlt: "A woman pausing while feeling unwell",
      imageCredit: "Prevention",
      quote: "A health story works best when calm becomes part of the design.",
    },
    {
      eyebrow: "The causes",
      title: "Small Changes Can Shift the Whole System",
      body: "Water, food, sleep, medication, and blood pressure all become part of the same visual field: ordinary details with real physical consequences.",
      image: "e78289d4-0ae9-45f9-b73a-ebe07756340d.jpeg",
      imageAlt: "A quiet health portrait",
      imageCredit: "Prevention",
    },
    {
      eyebrow: "The decision",
      title: "Clarity Is the Service",
      body: "The final movement should guide without panic: understand the likely reasons, watch for warning signs, and know when expert care matters.",
      image: "e78289d4-0ae9-45f9-b73a-ebe07756340d.jpeg",
      imageAlt: "Health portrait used for context",
      imageCredit: "Prevention",
    },
  ],
  sourceNote: "Source-grounded prototype based on Prevention's May 16, 2026 doctor explainer on lightheadedness and fainting.",
  bodySubheading: "Make the Advice Feel Calm",
  bodyCopy: "Prevention needs the immersive template to hold reassurance and seriousness at the same time: generous pacing, calm contrast, and labels that make the symptom path easy to follow.",
  pullQuote: "The story is not fear; the story is listening to the body sooner.",
});

export const REDBOOK_EDITORIAL_ARTICLE = makeSourceEditorialArticle({
  breadcrumbs: [{ label: "Entertainment" }, { label: "TV" }, { label: "Then and Now" }],
  headline: "The Cast of Dawson's Creek Then Vs. Now",
  dek: "A nostalgia story that works through recognition: familiar faces, time, memory, and the strange intimacy of growing up with a cast.",
  heroImage: "dawsons-creek-jen-1516377987.jpg",
  heroImageQuery: "resize=1600:*",
  heroImageAlt: "Dawson's Creek cast member then and now imagery",
  heroImageCredit: "Redbook",
  heroImageTreatment: "contain",
  author: "Nicole Pomarico",
  publishedDate: "Sep 23, 2021",
  navLinks: ["Life", "Home", "Food", "Relationships", "Entertainment", "Style"],
  immersiveLabel: "Then & Now",
  immersiveKicker: "The design should feel like flipping through a memory album with sharper editorial timing.",
  introEyebrow: "Before the rewatch",
  posterQuoteEyebrow: "Nostalgia beat",
  visualEssayEyebrow: "Cast notes",
  visualEssayTitle: "The visual rhythm should make time visible without turning the cast into a gimmick.",
  bodyRailEyebrow: "Memory path",
  factRail: [
    { label: "Series", value: "Dawson's Creek" },
    { label: "Lens", value: "Cast then and now" },
    { label: "Mood", value: "Nostalgic, warm, pop-culture fluent" },
    { label: "Reader feeling", value: "I remember exactly where I was" },
  ],
  scenes: [
    {
      eyebrow: "The memory",
      title: "The First Image Should Feel Familiar",
      body: "A then-and-now story begins with recognition. The layout should honor the viewer's memory before it starts comparing.",
      image: "dawsons-creek-dawson-1516377938.jpg",
      imageAlt: "Dawson's Creek cast comparison",
      imageCredit: "Redbook",
      imageTreatment: "before-after",
      quote: "Nostalgia is strongest when the page gives it space.",
    },
    {
      eyebrow: "The change",
      title: "Time Becomes the Visual Device",
      body: "The portraits do the work: the reader sees age, career, and pop-culture memory in the same glance.",
      image: "dawsons-creek-joey-1516378002.jpg",
      imageAlt: "Dawson's Creek Joey comparison",
      imageCredit: "Redbook",
      imageTreatment: "before-after",
    },
    {
      eyebrow: "The rewatch",
      title: "The Cast Still Carries the Mood",
      body: "The final beat should feel less like a list and more like a rewatch invitation: familiar, affectionate, and a little wistful.",
      image: "dawsons-creek-pacey-1516378003.jpg",
      imageAlt: "Dawson's Creek Pacey comparison",
      imageCredit: "Redbook",
      imageTreatment: "before-after",
    },
  ],
  sourceNote: "Source-grounded prototype based on Redbook's Dawson's Creek cast then-and-now feature.",
  bodySubheading: "Design for Recognition",
  bodyCopy: "Redbook needs a warm version of the immersive system: softer pacing, clearer memory beats, and imagery that lets the reader compare without feeling rushed.",
  pullQuote: "A good nostalgia page gives memory room to catch up.",
});

export const ROAD_AND_TRACK_EDITORIAL_ARTICLE = makeSourceEditorialArticle({
  breadcrumbs: [{ label: "Reviews" }, { label: "Bugatti" }, { label: "Track Test" }],
  headline: "The Bugatti Bolide Is a Race Simulator for Billionaires",
  dek: "The hyperexclusive Bugatti costs a cool $5 million and can only be driven on track. For those who can afford it, the experience is beyond intense.",
  heroImage: "96792d35-8504-429d-b1d1-5fe53ea2cff9.jpg",
  heroImageQuery: "crop=0.575xw:0.459xh;0.155xw,0.395xh&resize=1400:*",
  heroImageAlt: "Bugatti Bolide on track",
  heroImageCredit: "Road & Track",
  author: "Daniel Pund",
  publishedDate: "May 12, 2026",
  navLinks: ["Reviews", "Cars", "Motorsports", "News", "Culture", "Videos"],
  immersiveLabel: "Track Test",
  immersiveKicker: "Road & Track should feel technical and visceral: speed, rarity, intimidation, and control.",
  introEyebrow: "Before the lap",
  posterQuoteEyebrow: "Track note",
  visualEssayEyebrow: "Velocity notes",
  visualEssayTitle: "The design should make the Bolide feel more like an event than a product.",
  bodyRailEyebrow: "Lap path",
  factRail: [
    { label: "Car", value: "Bugatti Bolide" },
    { label: "Price", value: "$5 million" },
    { label: "Use", value: "Track only" },
    { label: "Mood", value: "Extreme, precise, unreal" },
  ],
  scenes: [
    {
      eyebrow: "The machine",
      title: "The Car Should Look Almost Untouchable",
      body: "The image needs scale and menace. This is not transportation; it is a machine built around intensity.",
      image: "96792d35-8504-429d-b1d1-5fe53ea2cff9.jpg",
      imageAlt: "Bugatti Bolide at speed",
      imageCredit: "Road & Track",
      quote: "The fantasy is speed, but the story is control.",
    },
    {
      eyebrow: "The track",
      title: "The Road Disappears Into Physics",
      body: "The module should stretch horizontally for track imagery, letting the car, asphalt, and horizon create the cinematic field.",
      image: "96792d35-8504-429d-b1d1-5fe53ea2cff9.jpg",
      imageAlt: "Bugatti Bolide track context",
      imageCredit: "Road & Track",
    },
    {
      eyebrow: "The limit",
      title: "Luxury Turns Into Nerve",
      body: "The closing beat should feel expensive but not plush: carbon, noise, g-force, and the strange privacy of an impossible car.",
      image: "96792d35-8504-429d-b1d1-5fe53ea2cff9.jpg",
      imageAlt: "Bugatti Bolide detail",
      imageCredit: "Road & Track",
    },
  ],
  sourceNote: "Source-grounded prototype based on Road & Track's May 12, 2026 Bugatti Bolide review.",
  bodySubheading: "Make Speed Feel Designed",
  bodyCopy: "Road & Track needs a darker, harder-edged immersive treatment: big horizontal photography, disciplined labels, and copy that lets engineering feel cinematic.",
  pullQuote: "At this price, performance stops being practical and becomes atmosphere.",
});

export const RUNNERS_WORLD_EDITORIAL_ARTICLE = makeSourceEditorialArticle({
  breadcrumbs: [{ label: "News" }, { label: "Trail Running" }, { label: "Molly Seidel" }],
  headline: "Molly Seidel Reinvents Herself as an Ultra-Distance Trail Runner",
  dek: "Olympic medalist Molly Seidel explains why she left marathoning, how trail running revived her career, and what's next at Western States 100.",
  heroImage: "501e57ba-637a-44c3-bfef-064f03d6563b.jpg",
  heroImageQuery: "crop=0.869xw:0.652xh;0.066xw,0.088xh&resize=1400:*",
  heroImageAlt: "Molly Seidel running on a trail",
  heroImageCredit: "Runner's World",
  author: "Brian Metzler",
  publishedDate: "May 15, 2026",
  navLinks: ["Training", "Shoes", "Nutrition", "News", "Gear", "Races"],
  immersiveLabel: "Trail Running",
  immersiveKicker: "This is a story about changing terrain and changing identity.",
  introEyebrow: "Before the climb",
  posterQuoteEyebrow: "Running note",
  visualEssayEyebrow: "Trail notes",
  visualEssayTitle: "The visuals should move from pressure to relief, from road logic to trail instinct.",
  bodyRailEyebrow: "Trail path",
  factRail: [
    { label: "Athlete", value: "Molly Seidel" },
    { label: "Shift", value: "Marathon to ultra trail" },
    { label: "Race", value: "Western States 100" },
    { label: "Mood", value: "Liberated, gritty, open-air" },
  ],
  scenes: [
    {
      eyebrow: "The turn",
      title: "The Road Was No Longer the Whole Story",
      body: "The opening chapter should feel like a pivot: the pressure of elite marathoning giving way to a wider, rougher landscape.",
      image: "501e57ba-637a-44c3-bfef-064f03d6563b.jpg",
      imageAlt: "Molly Seidel running outdoors",
      imageCredit: "Runner's World",
      quote: "Sometimes the most honest line is not the straightest one.",
    },
    {
      eyebrow: "The terrain",
      title: "Trail Running Changes the Scale",
      body: "The story needs air, grade, dust, and distance. The page should feel like it opens up as the runner does.",
      image: "501e57ba-637a-44c3-bfef-064f03d6563b.jpg",
      imageAlt: "Trail running landscape",
      imageCredit: "Runner's World",
    },
    {
      eyebrow: "The return",
      title: "Joy Becomes a Performance Metric",
      body: "The final beat should make reinvention feel athletic, not sentimental: the body adapts when the mind finds room again.",
      image: "501e57ba-637a-44c3-bfef-064f03d6563b.jpg",
      imageAlt: "Molly Seidel trail portrait",
      imageCredit: "Runner's World",
    },
  ],
  sourceNote: "Source-grounded prototype based on Runner's World's May 15, 2026 Molly Seidel trail-running feature.",
  bodySubheading: "Let the Page Breathe Like a Trail",
  bodyCopy: "Runner's World needs motion and openness: expansive image plates, compact evidence labels, and body copy that makes reinvention feel physical.",
  pullQuote: "The route changes, and the story finally has room to move.",
});

export const SEVENTEEN_EDITORIAL_ARTICLE = makeSourceEditorialArticle({
  breadcrumbs: [{ label: "Celebrity" }, { label: "Fashion" }, { label: "Dior" }],
  headline: "Jisoo Goes Coquettish in Bow Barrettes and a Black Dress at Dior",
  dek: "Hair accessories can go a long way.",
  heroImage: "jisoo-attends-the-christian-dior-haute-couture-spring-news-photo-1737994143.pjpeg",
  heroImageQuery: "crop=1.00xw:0.335xh;0,0.147xh&resize=1400:*",
  heroImageAlt: "Jisoo at Dior's haute couture show",
  heroImageCredit: "Getty Images",
  author: "Alyssa Bailey",
  publishedDate: "Jan 27, 2025",
  navLinks: ["Celebrity", "Fashion", "Beauty", "Life", "Prom", "Quizzes"],
  immersiveLabel: "Front Row",
  immersiveKicker: "The treatment should feel young, polished, and fashion-literate: one accessory detail becomes the whole attitude.",
  introEyebrow: "Before the show",
  posterQuoteEyebrow: "Style note",
  visualEssayEyebrow: "Front-row notes",
  visualEssayTitle: "The visual story should hold the bow, the black dress, and the Dior room in one polished glance.",
  bodyRailEyebrow: "Look path",
  factRail: [
    { label: "Star", value: "Jisoo" },
    { label: "House", value: "Dior" },
    { label: "Detail", value: "Bow barrettes" },
    { label: "Mood", value: "Coquette, sleek, front-row" },
  ],
  scenes: [
    {
      eyebrow: "The detail",
      title: "The Bow Is the Plot Twist",
      body: "Seventeen should make the accessory feel like the emotional hook: small, sweet, and deliberately styled.",
      image: "jisoo-attends-the-christian-dior-haute-couture-spring-news-photo-1737994143.pjpeg",
      imageAlt: "Jisoo wearing bow barrettes",
      imageCredit: "Getty Images",
      quote: "A tiny accessory can change the whole sentence.",
    },
    {
      eyebrow: "The dress",
      title: "Black Keeps the Look Sharp",
      body: "The page needs contrast: the softness of the bows against the sleek authority of a black Dior dress.",
      image: "jisoo-attends-the-christian-dior-haute-couture-spring-news-photo-1737994143.pjpeg",
      imageAlt: "Jisoo in a black dress",
      imageCredit: "Getty Images",
    },
    {
      eyebrow: "The room",
      title: "Front Row Is a Performance",
      body: "The final moment should feel public but intimate, a pop star translating fashion into a readable mood.",
      image: "jisoo-attends-the-christian-dior-haute-couture-spring-news-photo-1737994143.pjpeg",
      imageAlt: "Jisoo at Dior front row",
      imageCredit: "Getty Images",
    },
  ],
  sourceNote: "Source-grounded prototype based on Seventeen's January 27, 2025 Jisoo at Dior story.",
  bodySubheading: "Make the Detail Feel Iconic",
  bodyCopy: "Seventeen needs a bright, fashion-forward version of the system: clear image focus, social-media fluency, and type that feels confident without crowding the look.",
  pullQuote: "The smallest styling choice can be the loudest part of the story.",
});

export const THE_PIONEER_WOMAN_EDITORIAL_ARTICLE = makeSourceEditorialArticle({
  breadcrumbs: [{ label: "Food & Cooking" }, { label: "Meals & Menus" }, { label: "Cake" }],
  headline: "Ree Drummond's Top 5 Best Cake Recipes of All Time",
  dek: "The Pioneer Woman is known for decadent desserts, and her cakes are some of the most-loved.",
  heroImage: "a67fc2b4-cc82-4b69-b6f9-22448655c613.png",
  heroImageQuery: "crop=1xw:1.0xh;center,top&resize=1400:*",
  heroImageAlt: "A slice of cake with frosting",
  heroImageCredit: "The Pioneer Woman",
  author: "Lilly Blomquist",
  publishedDate: "Apr 16, 2026",
  navLinks: ["Food", "Home", "Style", "Beauty", "Holidays", "Life"],
  immersiveLabel: "Baking",
  immersiveKicker: "Comfort food needs warmth, appetite, and the feeling that a favorite recipe has a memory attached.",
  introEyebrow: "Before dessert",
  posterQuoteEyebrow: "Bake note",
  visualEssayEyebrow: "Cake notes",
  visualEssayTitle: "The visuals should feel generous, familiar, and just polished enough to make a classic recipe feel collectible.",
  bodyRailEyebrow: "Cake path",
  factRail: [
    { label: "Subject", value: "Ree Drummond cakes" },
    { label: "Count", value: "Top five" },
    { label: "Feeling", value: "Decadent, familiar, celebratory" },
    { label: "Reader job", value: "Pick the cake to bake first" },
  ],
  scenes: [
    {
      eyebrow: "The slice",
      title: "A Cake Story Starts With Appetite",
      body: "The image should make the reader feel frosting, crumb, and celebration before the list begins.",
      image: "a67fc2b4-cc82-4b69-b6f9-22448655c613.png",
      imageAlt: "Cake close-up",
      imageCredit: "The Pioneer Woman",
      quote: "The first image should taste like the promise of dessert.",
    },
    {
      eyebrow: "The classic",
      title: "Favorites Need Familiarity",
      body: "The design should lean into repetition and comfort: a recipe collection that feels tested, loved, and easy to return to.",
      image: "a67fc2b4-cc82-4b69-b6f9-22448655c613.png",
      imageAlt: "Classic cake detail",
      imageCredit: "The Pioneer Woman",
    },
    {
      eyebrow: "The table",
      title: "Dessert Is the Gathering Point",
      body: "The closing beat should make the cake feel social: a reason to linger, share, and cut one more slice.",
      image: "a67fc2b4-cc82-4b69-b6f9-22448655c613.png",
      imageAlt: "Cake served for a gathering",
      imageCredit: "The Pioneer Woman",
    },
  ],
  sourceNote: "Source-grounded prototype based on The Pioneer Woman's April 16, 2026 Ree Drummond cake recipe story.",
  bodySubheading: "Make Comfort Feel Collectible",
  bodyCopy: "The Pioneer Woman version should be warm and generous but still premium: tactile food photography, inviting labels, and a hero that makes the recipe list feel like an occasion.",
  pullQuote: "A beloved recipe is part instruction, part memory.",
});

export const TOWN_AND_COUNTRY_EDITORIAL_ARTICLE = makeSourceEditorialArticle({
  breadcrumbs: [{ label: "Leisure" }, { label: "Arts & Culture" }, { label: "Interview" }],
  headline: "Stanley Tucci on The Devil Wears Prada 2, Meeting His Wife, and Beating Cancer",
  dek: "Considering how the actor has handled personal trials, professional triumphs, and internet adoration, it actually might be. Gird your loins.",
  heroImage: "839e481e-bbeb-4d01-a4c1-00c69d4b42a0.jpg",
  heroImageQuery: "crop=1xw:0.75xh;center,top&resize=1400:*",
  heroImageAlt: "Stanley Tucci portrait",
  heroImageCredit: "Town & Country",
  author: "Jessica Pressler",
  publishedDate: "Apr 27, 2026",
  navLinks: ["Style", "Society", "Culture", "Travel", "Watches", "Philanthropy"],
  immersiveLabel: "Interview",
  immersiveKicker: "Town & Country should feel urbane, conversational, and quietly glamorous.",
  introEyebrow: "Before the martini",
  posterQuoteEyebrow: "Profile note",
  visualEssayEyebrow: "Portrait notes",
  visualEssayTitle: "The visuals should hold wit, elegance, and a serious life story in balance.",
  bodyRailEyebrow: "Conversation path",
  factRail: [
    { label: "Subject", value: "Stanley Tucci" },
    { label: "Lens", value: "Work, marriage, illness, style" },
    { label: "Tone", value: "Wry, elegant, intimate" },
    { label: "Hook", value: "The Devil Wears Prada 2" },
  ],
  scenes: [
    {
      eyebrow: "The persona",
      title: "Charm Is Only the Surface",
      body: "The opening portrait should feel polished but not shallow. Tucci's public ease is the doorway into a more layered conversation.",
      image: "839e481e-bbeb-4d01-a4c1-00c69d4b42a0.jpg",
      imageAlt: "Stanley Tucci portrait",
      imageCredit: "Town & Country",
      quote: "Elegance works best when it lets complexity show.",
    },
    {
      eyebrow: "The story",
      title: "The Interview Moves Beneath the Joke",
      body: "The page should let humor and vulnerability sit together, because the article is about both persona and survival.",
      image: "0a05d3a4-d745-46c2-adf0-1532abe7614c.jpg",
      imageAlt: "Stanley Tucci seated portrait",
      imageCredit: "Town & Country",
    },
    {
      eyebrow: "The return",
      title: "Pop Culture Becomes Personal History",
      body: "The final beat should feel like a toast: the movie hook is fun, but the resonance is a life lived with style and nerve.",
      image: "839e481e-bbeb-4d01-a4c1-00c69d4b42a0.jpg",
      imageAlt: "Stanley Tucci profile image",
      imageCredit: "Town & Country",
    },
  ],
  sourceNote: "Source-grounded prototype based on Town & Country's April 27, 2026 Stanley Tucci interview.",
  bodySubheading: "Keep Wit and Weight Together",
  bodyCopy: "Town & Country needs refined pacing: glamorous image scale, literary pull quotes, and enough whitespace for the interview to feel sophisticated rather than loud.",
  pullQuote: "The charm opens the door; the life story keeps you there.",
});

export const VERANDA_EDITORIAL_ARTICLE = makeSourceEditorialArticle({
  breadcrumbs: [{ label: "Home Decorators" }, { label: "Design Trends" }, { label: "Sofas" }],
  headline: "The 9 Biggest Couch Trends of 2026, According to Designers",
  dek: "The right sofa can be comfortable and current. Designers share their top couch trends for 2026.",
  heroImage: "hundley-hilton-birmingham-house-tour-living-room-1649708737.jpg",
  heroImageQuery: "crop=1xw:0.75xh;0xw,0.186xh&resize=1400:*",
  heroImageAlt: "Elegant living room with sofa",
  heroImageCredit: "Veranda",
  author: "Kelsey Mulvey",
  publishedDate: "May 8, 2026",
  navLinks: ["Design", "Decorating", "Gardens", "Travel", "Shopping", "Entertaining"],
  immersiveLabel: "Design Trends",
  immersiveKicker: "Veranda should make a trend report feel like a beautifully composed room.",
  introEyebrow: "Before the room",
  posterQuoteEyebrow: "Design note",
  visualEssayEyebrow: "Room notes",
  visualEssayTitle: "The visuals should treat the sofa as architecture, invitation, and mood.",
  bodyRailEyebrow: "Room path",
  factRail: [
    { label: "Subject", value: "Couch trends" },
    { label: "Year", value: "2026" },
    { label: "Lens", value: "Designer guidance" },
    { label: "Mood", value: "Composed, layered, lived-in" },
  ],
  scenes: [
    {
      eyebrow: "The room",
      title: "The Sofa Sets the Whole Tone",
      body: "The first image should read as a room, not a product. Scale, texture, and placement explain the trend before the copy does.",
      image: "hundley-hilton-birmingham-house-tour-living-room-1649708737.jpg",
      imageAlt: "Living room with sofa",
      imageCredit: "Veranda",
      quote: "A sofa trend is really a story about how a room wants to be used.",
    },
    {
      eyebrow: "The texture",
      title: "Comfort Needs Material Evidence",
      body: "The design should get close enough to suggest fabric, cushion, depth, and the reason a piece feels current.",
      image: "hundley-hilton-birmingham-house-tour-living-room-1649708737.jpg",
      imageAlt: "Sofa and living room textile detail",
      imageCredit: "Veranda",
    },
    {
      eyebrow: "The edit",
      title: "Trend Reports Need Taste",
      body: "The closing beat should feel curated, not list-like: a designer's eye guiding the reader through what actually lasts.",
      image: "hundley-hilton-birmingham-house-tour-living-room-1649708737.jpg",
      imageAlt: "Designer living room context",
      imageCredit: "Veranda",
    },
  ],
  sourceNote: "Source-grounded prototype based on Veranda's May 8, 2026 couch trends report.",
  bodySubheading: "Make the Trend Feel Like a Room",
  bodyCopy: "Veranda needs elegant restraint: immersive room photography, composed typography, and chapters that translate trends into atmosphere.",
  pullQuote: "The sofa is never just seating; it is the room's social architecture.",
});

export const WOMANS_DAY_EDITORIAL_ARTICLE = makeSourceEditorialArticle({
  breadcrumbs: [{ label: "Food & Recipes" }, { label: "Food & Drinks" }, { label: "Parfaits" }],
  headline: "20 Easy Parfait Recipes to Eat for Breakfast and Beyond",
  dek: "Whip up a sweet parfait for dessert or opt for a healthy fruit parfait for breakfast at home.",
  heroImage: "layer-dessert-with-coffee-and-chocolate-cream-in-royalty-free-image-1695832013.jpg",
  heroImageQuery: "crop=1.00xw:0.362xh;0,0.514xh&resize=1400:*",
  heroImageAlt: "Layered parfait dessert",
  heroImageCredit: "Woman's Day",
  author: "Kate Franke",
  publishedDate: "Sep 28, 2023",
  navLinks: ["Food", "Health", "Home", "Style", "Holidays", "Relationships"],
  immersiveLabel: "Recipes",
  immersiveKicker: "A parfait story should feel bright, layered, easy, and a little celebratory.",
  introEyebrow: "Before breakfast",
  posterQuoteEyebrow: "Layer note",
  visualEssayEyebrow: "Parfait notes",
  visualEssayTitle: "The visuals should make layers feel like the organizing idea.",
  bodyRailEyebrow: "Recipe path",
  factRail: [
    { label: "Subject", value: "Parfait recipes" },
    { label: "Count", value: "20" },
    { label: "Occasion", value: "Breakfast and dessert" },
    { label: "Mood", value: "Easy, sweet, layered" },
  ],
  scenes: [
    {
      eyebrow: "The layers",
      title: "The Structure Is the Appetite",
      body: "The first visual should make the reader understand parfaits instantly: color, cream, crunch, fruit, and glass.",
      image: "layer-dessert-with-coffee-and-chocolate-cream-in-royalty-free-image-1695832013.jpg",
      imageAlt: "Layered parfait close-up",
      imageCredit: "Woman's Day",
      quote: "The recipe is built visibly, one layer at a time.",
    },
    {
      eyebrow: "The morning",
      title: "Breakfast Can Still Feel Like a Treat",
      body: "The page should balance everyday usefulness with a small sense of delight.",
      image: "layer-dessert-with-coffee-and-chocolate-cream-in-royalty-free-image-1695832013.jpg",
      imageAlt: "Parfait breakfast idea",
      imageCredit: "Woman's Day",
    },
    {
      eyebrow: "The dessert",
      title: "Sweetness Stays Simple",
      body: "The final movement should keep the recipes approachable: pretty enough to crave, easy enough to make.",
      image: "layer-dessert-with-coffee-and-chocolate-cream-in-royalty-free-image-1695832013.jpg",
      imageAlt: "Dessert parfait",
      imageCredit: "Woman's Day",
    },
  ],
  sourceNote: "Source-grounded prototype based on Woman's Day's parfait recipe collection.",
  bodySubheading: "Make the Layers Do the Storytelling",
  bodyCopy: "Woman's Day needs a practical but polished recipe treatment: bright photography, friendly pacing, and visual hierarchy that makes choice feel easy.",
  pullQuote: "A parfait is a recipe you can read before you read the recipe.",
});

export const WOMENS_HEALTH_EDITORIAL_ARTICLE = makeSourceEditorialArticle({
  breadcrumbs: [{ label: "Life" }, { label: "Cover Profile" }, { label: "Eiza Gonzalez" }],
  headline: "Eiza Gonzalez Is Entering Her Strongest Phase Yet",
  dek: "The global star opens up about body dysmorphia, health challenges, and the ongoing journey to make sense of it all.",
  heroImage: "2b5c287e-8b46-46d7-98fd-a8d83502f262.jpg",
  heroImageQuery: "crop=1xw:0.68xh;0xw,0.03xh&resize=1400:*",
  heroImageAlt: "Eiza Gonzalez cover portrait",
  heroImageCredit: "Women's Health",
  author: "Samantha Leal",
  publishedDate: "Apr 7, 2026",
  navLinks: ["Fitness", "Health", "Life", "Beauty", "Sex & Love", "Food"],
  immersiveLabel: "Cover Profile",
  immersiveKicker: "The design should feel strong, vulnerable, and physically present.",
  introEyebrow: "Before the cover",
  posterQuoteEyebrow: "Strength note",
  visualEssayEyebrow: "Profile notes",
  visualEssayTitle: "The visuals should hold glamour, discipline, grief, and recovery without flattening the story.",
  bodyRailEyebrow: "Profile path",
  factRail: [
    { label: "Subject", value: "Eiza Gonzalez" },
    { label: "Lens", value: "Strength, grief, health" },
    { label: "Tone", value: "Direct, polished, human" },
    { label: "Form", value: "Cover profile" },
  ],
  scenes: [
    {
      eyebrow: "The cover",
      title: "Strength Is Not a Pose",
      body: "The opening image should feel athletic and emotionally awake, not just glamorous.",
      image: "2b5c287e-8b46-46d7-98fd-a8d83502f262.jpg",
      imageAlt: "Eiza Gonzalez portrait",
      imageCredit: "Women's Health",
      quote: "The body can be powerful and still have a history.",
    },
    {
      eyebrow: "The pressure",
      title: "The Story Moves Beneath the Image",
      body: "The page should let the profile talk about body image, pain, and resilience without turning vulnerability into decoration.",
      image: "2b5c287e-8b46-46d7-98fd-a8d83502f262.jpg",
      imageAlt: "Eiza Gonzalez profile image",
      imageCredit: "Women's Health",
    },
    {
      eyebrow: "The phase",
      title: "The Ending Feels Like Agency",
      body: "The closing chapter should feel forward-moving: strength as choice, practice, and self-definition.",
      image: "2b5c287e-8b46-46d7-98fd-a8d83502f262.jpg",
      imageAlt: "Eiza Gonzalez cover feature",
      imageCredit: "Women's Health",
    },
  ],
  sourceNote: "Source-grounded prototype based on Women's Health's April 7, 2026 Eiza Gonzalez cover profile.",
  bodySubheading: "Make Strength Feel Human",
  bodyCopy: "Women's Health needs a profile treatment that is polished but not cold: confident type, athletic image scale, and emotional breathing room.",
  pullQuote: "The strongest phase is the one that lets the whole story in.",
});

export const BRAND_ARTICLES: Record<string, BrandArticleData> = {
  cosmopolitan: {
    content: {
      breadcrumbs: [{ label: "Pop Culture" }, { label: "Celebs" }],
      headline: "Young Miko Wants to Take You Home",
      dek: "The rap superstar, cosigned by Bad Bunny and Billie Eilish, opens up about breaking into a genre that wasn\u2019t built for her.",
      heroImage: img("81c31f6f-6638-4e0f-8465-6971305ed9e0.jpg", "crop=0.6666xw:1xh;center,top&resize=1200:*"),
      heroImageAlt: "Young Miko lounging on a bed",
      heroImageCredit: "Mayan Toledano // Hearst Owned",
      author: "Willa Bennett",
      photographedBy: "Mayan Toledano",
      publishedDate: "Mar 23, 2026",
      navLinks: ["Love", "Pop Culture", "Style", "Beauty", "Features", "Astrology", "Shopping"],
      sidebarItems: [
        { title: "The Best (and Worst) of 2026 Oscars Fashion", image: thumb("5e6d4136-cb47-4d1b-82fe-a2b289f6595b.jpeg"), eyebrow: "Style" },
        { title: "Taylor Frankie Paul's Bachelorette Winner Revealed", image: thumb("doug-699c83837b7c2.jpg"), eyebrow: "Pop Culture" },
        { title: "Some '90s Kids Movies You Should Rewatch RTFN", image: thumb("man-of-the-house01-659ee8c6cc9bd.jpg"), eyebrow: "Entertainment" },
        { title: "Celebrity Sightings in West Hollywood", image: thumb("f4eb21d0-0fc4-494d-ac4c-13b6eebbac5f.jpg"), eyebrow: "Celebs" },
        { title: "Taylor's Statement on Bachelorette Cancellation", image: thumb("screenshot-2026-03-01-at-9-58-21-pm-69a4fcef968f5.png"), eyebrow: "Pop Culture" },
      ],
      body: (
        <>
          <p>When we arrive at Lala, the restaurant co-owned by Bad Bunny that&rsquo;s tucked into a San Juan, Puerto Rico, mall, we&rsquo;re immediately swarmed by a crowd of 20-somethings in oversized streetwear. I&rsquo;m pretty sure any of them would kill to interact with Benito Antonio Mart&iacute;nez Ocasio. But tonight, they&rsquo;re awaiting someone just as exciting: music phenomenon Young Miko&mdash;or &ldquo;just Miko, please,&rdquo; as she asks me to call her.</p>
          <ArticleFootnote number={1}>A trademark Young Miko style. Tonight, she&rsquo;s wearing baggy Comme des Gar&ccedil;ons pants and a cropped shirt by an emerging designer from Spain, AAA Studio.</ArticleFootnote>
          <p>What&rsquo;s remarkable about Miko isn&rsquo;t just how quickly she&rsquo;s broken out; it&rsquo;s how fully formed she arrived. She careened into the spotlight with her 2021 breakout hit &ldquo;105 Freestyle.&rdquo; Within two years, she&rsquo;d charted on the Billboard Hot 100, opened for Karol G, and joined Bad Bunny onstage.</p>
          <ArticleInlineImage src={img("1fbdc656-00e0-4226-9ee3-f2766351fa00.jpg")} alt="Young Miko sitting in the back of a truck" caption="Swimsuit and hat Dsquared2, boardshorts Rusty, earrings Hirotaka." credit="Mayan Toledano // Hearst Owned" />
          <PullQuote attribution="Young Miko">I feel lucky that my queerness has been powerful for my career. I now represent something bigger than me.</PullQuote>
          <p>That tension is the point: Miko&rsquo;s subversive and sexually fluid lyrics slice through a genre built on male dominance and heterosexual desire. She&rsquo;s known for confidently rapping about sex with women, wearing a Pride flag as a cape onstage, and standing up for trans rights.</p>
          <ArticleSubheading>Your mom collected magazines growing up. Did you read Cosmopolitan?</ArticleSubheading>
          <p>I did. And now she&rsquo;s piling up magazines again, but this time it&rsquo;s all the covers I&rsquo;ve done. It&rsquo;s really sweet of her.</p>
          <ArticleInlineImage src={img("4a9ff99b-ae70-42f1-80a5-0fcdd6305fb5.jpg")} alt="Young Miko squatting with tattoos" caption="Top and bra Jane Wade, pants Nike, shoes Luar." credit="Mayan Toledano // Hearst Owned" />
          <PullQuote attribution="Young Miko">When my dad said, &ldquo;You&rsquo;re not famous yet because nobody has discovered you,&rdquo; he didn&rsquo;t know what he was doing to my brain. He was helping my delusion.</PullQuote>
          <ArticleSubheading>What do you remember about meeting Bad Bunny?</ArticleSubheading>
          <p>It was so cool. He&rsquo;d gone beneath the stage to get some water. I remember hearing, &ldquo;Miko.&rdquo; He was standing right in front of me. He seemed like a little kid. He was so excited and said, &ldquo;Thank you for coming. You&rsquo;re so fire.&rdquo;</p>
          <ArticleInlineImage src={img("e6bc949b-6b37-4f60-9504-a8dd10a4ffdc.jpg")} alt="Young Miko leaning on a wall in a bar" caption="Shirt ERL, vest Coach, bikini top Christopher John Rogers." credit="Mayan Toledano // Hearst Owned" />
        </>
      ),
      relatedArticles: [
        { title: "The Best (and Worst) of 2026 Oscars Fashion", image: card("5e6d4136-cb47-4d1b-82fe-a2b289f6595b.jpeg") },
        { title: "Every Picture-Perfect Look From the 2026 Oscars", image: card("726e4735-1f3b-4329-a2db-a35c44439c5b.jpeg") },
        { title: "Taylor's Winner Doug Releases Statement", image: card("doug-699c83837b7c2.jpg") },
        { title: "ABC Cancels 'The Bachelorette'", image: card("d3f8e6f2-d609-4161-b9f8-b56af736c3ec.jpeg") },
      ],
    },
  },

  "car-and-driver": {
    content: {
      breadcrumbs: [{ label: "News" }, { label: "2027 Nissan Z NISMO" }],
      headline: "2027 Nissan Z NISMO Revives the Manual and Steals Parts from the GT-R",
      dek: "The stats haven\u2019t changed, but the Z NISMO finally offers an all-important third pedal, and it inherits front brakes from the GT-R.",
      heroImage: img("251217-01-00-z-27my-01-696149a83bf60.jpg"),
      heroImageAlt: "2027 Nissan Z NISMO front three-quarter view",
      heroImageCredit: "Nissan",
      author: "Jack Fitzgerald",
      publishedDate: "Mar 23, 2026",
      navLinks: ["News", "Reviews", "Buying Guide", "Features", "Gear", "Videos"],
      sidebarItems: [
        { title: "2012 Lexus LS460 on BaT Is Low-Key Luxury", image: thumb("311612c5-94a7-4874-b788-f60d39a244c0.jpg"), eyebrow: "News" },
        { title: "Bugatti Will Sell You a Bike That Costs About $24K", image: thumb("88841361-054e-412e-a300-a43fec380de0.jpg"), eyebrow: "Gear" },
        { title: "New GMC Typhoon? 2027 Yukon Gets Supercharged V-8", image: thumb("2025-gmc-yukon-denali-102-6852cef15027e.jpg"), eyebrow: "News" },
        { title: "Hyundai Issues Palisade Stop-Sale After Fatality", image: thumb("2026-hyundai-palisade-hybrid-127-690e25cb9ed9c.jpg"), eyebrow: "News" },
        { title: "Ferrari 12Cilindri Window Tint Is Too Dark", image: thumb("251204-ferrari5277-12d454b8-7e57-4da9-9583-7822aace5769-6971013c4790b.jpg"), eyebrow: "Recall" },
      ],
      body: (
        <>
          <p>The 2027 model year marks the Nissan Z&rsquo;s first real refresh since the model was revived in 2023. While the design changes are restricted to the Z Sport and Performance trims, the range-topping Z NISMO gets a much more important upgrade. Three years after the Z NISMO returned with impressive on-track performance, the hi-po sports car will finally offer a manual transmission.</p>
          <ArticleInlineImage src={img("251217-01-00-z-27my-03-6961493898fee.jpg")} alt="2027 Nissan Z NISMO rear three-quarter" caption="The Z NISMO's new manual transmission features shorter throws and an upgraded clutch." credit="Nissan" />
          <p>Rather than simply porting over the same six-speed box found in the standard Z, Nissan&rsquo;s NISMO team developed a new transmission specific to the range-topper. New shift-lever gearing means shorter throws, while the NISMO&rsquo;s twin-turbocharged 3.0-liter V-6 gets a new tune to improve throttle response and torque delivery for manual-equipped Zs.</p>
          <PullQuote>The NISMO still churns out 420 horsepower and 384 pound-feet of torque.</PullQuote>
          <p>In addition to the new transmission setup, Nissan brought over the two-piece iron-aluminum brake rotors from the GT-R. The design should help with cooling on the race track, and as a bonus, the new setup saves 19 pounds compared with the outgoing brakes.</p>
          <ArticleInlineImage src={img("2024-nissan-z-nismo-149-668d5ce36ae38.jpg")} alt="Nissan Z NISMO on track" caption="The 2024 Z NISMO proved its track credentials; the 2027 adds a manual option." credit="Car and Driver" />
          <p>While changes to the Z NISMO focus on performance, the regular trims focus on visual changes. The 2027 Z Sport and Performance wear a freshly styled bumper, which now displays a &ldquo;Z&rdquo; logo in place of the Nissan badge. According to Nissan, changes to the bumper, grille, and internal ducting improve cooling and reduce aerodynamic lift and drag.</p>
          <ArticleFootnote number={1}>Pricing for the updated Z lineup won&rsquo;t be available until closer to its launch this summer. Nissan will show the lineup at the New York auto show next week.</ArticleFootnote>
        </>
      ),
      relatedArticles: [
        { title: "2012 Lexus LS460 on BaT Is Low-Key Luxury", image: card("311612c5-94a7-4874-b788-f60d39a244c0.jpg") },
        { title: "The USPS Honors Lowrider Culture with New Stamps", image: card("88841361-054e-412e-a300-a43fec380de0.jpg") },
        { title: "1989 Dodge Aries, Chrysler's Boxy Savior, on BaT", image: card("9b63b378-c890-4e37-8a04-1aef1dc3b4b4.jpeg") },
        { title: "The Right-to-Repair Fight Is Gaining Momentum", image: card("8b2745eb-f915-4283-aa59-bd921a42df99.jpeg") },
      ],
    },
  },

  elle: {
    content: {
      breadcrumbs: [{ label: "Fashion" }, { label: "Trends" }],
      headline: "The Spring 2026 Trends That Will Define the Season",
      dek: "From sheer layers to sculptural silhouettes, these are the looks dominating runways and streets alike.",
      heroImage: img("230717-hhh-editorial-hhazzan-02-155-3854hh-a-1-6719092b1b16f.jpg"),
      heroImageAlt: "Model in editorial fashion shoot",
      heroImageCredit: "Hearst Owned",
      author: "Nikki Ogunnaike",
      publishedDate: "Mar 22, 2026",
      navLinks: ["Fashion", "Beauty", "Culture", "Life & Love", "Astrology", "Shopping"],
      sidebarItems: [
        { title: "The Best Street Style From Paris Fashion Week", image: thumb("37ce6338-f3be-4fb1-a9e4-3790fffc8f36.jpeg"), eyebrow: "Street Style" },
        { title: "Every Look From Chanel's Resort Collection", image: thumb("82ada596-afeb-4d1e-832b-afadc01bf4df.jpeg"), eyebrow: "Runway" },
        { title: "The Capsule Wardrobe Pieces Worth Investing In", image: thumb("65b3afe2-6117-496d-a050-a155936b2ed4.jpeg"), eyebrow: "Shopping" },
        { title: "How to Wear the Burgundy Trend This Spring", image: thumb("751eeba2-3a14-4195-9674-c6c6e3c2d24a.jpeg"), eyebrow: "Trends" },
      ],
      body: (
        <>
          <p>Spring 2026 is shaping up to be one of the most exciting fashion seasons in recent memory. Designers are embracing a new sense of freedom, blending the structured with the fluid, the minimal with the maximal. The result is a season that feels both forward-looking and deeply personal.</p>
          <ArticleInlineImage src={img("0468855a-f900-4c2e-bd5c-d0fd69bd1f5d.jpg")} alt="Spring fashion editorial" caption="Sheer layers and sculptural shapes dominated the spring runways." credit="Hearst Owned" />
          <PullQuote>Fashion in 2026 is about contradiction&mdash;structured yet fluid, minimal yet maximal, familiar yet entirely new.</PullQuote>
          <p>The sheer trend that emerged last year has evolved into something more nuanced. Designers like Dries Van Noten and Valentino showed translucent fabrics layered over tailored pieces, creating depth and dimension that feels sophisticated rather than provocative.</p>
          <ArticleSubheading>The Return of the Power Shoulder</ArticleSubheading>
          <p>Sculptural shoulders are back, but this time they&rsquo;re softer. Think less 1980s boardroom and more architectural art piece. Balenciaga and Alexander McQueen led the charge with exaggerated silhouettes that somehow felt wearable.</p>
          <ArticleInlineImage src={img("4ebd8a05-9c92-4bff-b28c-7c7b0f9497f0.jpg")} alt="Fashion trend editorial" caption="The power shoulder returns in a softer, more sculptural form." credit="Hearst Owned" />
          <ArticleSubheading>Color of the Season: Butter Yellow</ArticleSubheading>
          <p>Move over, quiet luxury neutrals. Butter yellow is the color of the moment, appearing everywhere from Bottega Veneta&rsquo;s bags to Prada&rsquo;s ready-to-wear. It&rsquo;s warm, optimistic, and pairs beautifully with the season&rsquo;s other standout: chocolate brown.</p>
        </>
      ),
      relatedArticles: [
        { title: "The Best Street Style From Paris Fashion Week", image: card("37ce6338-f3be-4fb1-a9e4-3790fffc8f36.jpeg") },
        { title: "Every Look From Chanel's Resort Collection", image: card("82ada596-afeb-4d1e-832b-afadc01bf4df.jpeg") },
        { title: "The Capsule Wardrobe Pieces Worth Investing In", image: card("65b3afe2-6117-496d-a050-a155936b2ed4.jpeg") },
        { title: "How to Wear the Burgundy Trend", image: card("751eeba2-3a14-4195-9674-c6c6e3c2d24a.jpeg") },
      ],
    },
  },

  delish: {
    content: {
      breadcrumbs: [{ label: "Cooking" }, { label: "Recipes" }],
      headline: "The 50 Best Spring Recipes to Make Right Now",
      dek: "From asparagus pasta to strawberry shortcake, these seasonal dishes celebrate the best produce of the moment.",
      heroImage: img("brie-asparagus-and-prosciutto-stuffed-chicken-index-67f02e15ac634.jpg"),
      heroImageAlt: "Brie asparagus and prosciutto stuffed chicken",
      heroImageCredit: "Delish",
      author: "Makinze Gore",
      publishedDate: "Mar 21, 2026",
      navLinks: ["Cooking", "Recipes", "Food News", "Kitchen Gear", "Restaurants", "Videos"],
      sidebarItems: [
        { title: "The Best Potato Soup You'll Ever Make", image: thumb("230927-delish-potato-soup-005-ab-hi-res-index-6529d0d908cb1.jpg"), eyebrow: "Soups" },
        { title: "Classic Beef Wellington, Perfected", image: thumb("beef-wellington-index-65149c4448c77.jpg"), eyebrow: "Dinner" },
        { title: "Aperol Spritz Punch for a Crowd", image: thumb("aperol-spritz-punch-index-web-261-rv-del019926-697bddaa60b3c.jpg"), eyebrow: "Drinks" },
        { title: "Baked Feta Frittata Is Your New Brunch Star", image: thumb("baked-feta-frittata-index-67d0a3bc32a6a.jpg"), eyebrow: "Brunch" },
        { title: "Baileys Chocolate Coffee Cake", image: thumb("baileys-chocolate-coffee-cake-index-67b506739ebd0.jpg"), eyebrow: "Dessert" },
      ],
      body: (
        <>
          <p>Spring is finally here, and with it comes a bounty of fresh produce that&rsquo;s begging to be turned into something delicious. We&rsquo;ve rounded up 50 of our absolute favorite spring recipes, from light and bright salads to hearty mains that make the most of seasonal ingredients.</p>
          <ArticleInlineImage src={img("beet-reuben-sandwich-index-web-3917-del029926-69a9f90c9b041.jpg")} alt="Beet reuben sandwich" caption="This beet reuben puts a vegetarian spin on the deli classic." credit="Delish" />
          <PullQuote>The best spring cooking is simple: let the ingredients shine and don&rsquo;t overthink it.</PullQuote>
          <ArticleSubheading>Asparagus Season Is Here</ArticleSubheading>
          <p>Nothing says spring quite like fresh asparagus. Whether you&rsquo;re roasting it with a drizzle of olive oil and a squeeze of lemon, or folding it into a creamy pasta, this versatile vegetable deserves a starring role on your table.</p>
          <ArticleInlineImage src={img("beef-stroganoff-index-652e9646c4d0f.jpg")} alt="Beef stroganoff" caption="Classic beef stroganoff gets a spring refresh with fresh herbs." credit="Delish" />
          <ArticleSubheading>Strawberry Everything</ArticleSubheading>
          <p>Strawberry season is the best season. From classic shortcake to unexpected savory pairings (strawberry balsamic chicken, anyone?), these ruby-red berries are the MVP of spring cooking.</p>
          <ArticleInlineImage src={img("apple-cider-margaritas-index-654a92e4e2e10.jpg")} alt="Apple cider margaritas" caption="These apple cider margaritas transition perfectly from winter to spring." credit="Delish" />
        </>
      ),
      relatedArticles: [
        { title: "The Best Potato Soup You'll Ever Make", image: card("230927-delish-potato-soup-005-ab-hi-res-index-6529d0d908cb1.jpg") },
        { title: "Classic Beef Wellington, Perfected", image: card("beef-wellington-index-65149c4448c77.jpg") },
        { title: "Aperol Spritz Punch for a Crowd", image: card("aperol-spritz-punch-index-web-261-rv-del019926-697bddaa60b3c.jpg") },
        { title: "Baked Feta Frittata", image: card("baked-feta-frittata-index-67d0a3bc32a6a.jpg") },
      ],
    },
  },

  "mens-health": {
    content: {
      breadcrumbs: [{ label: "Fitness" }, { label: "Training" }],
      headline: "The Only Full-Body Workout You Need This Spring",
      dek: "This expert-backed routine builds muscle, torches fat, and takes just 45 minutes. No excuses.",
      heroImage: img("hlh050125fearunning-027-6807f9d90c2fd.jpg"),
      heroImageAlt: "Man running outdoors",
      heroImageCredit: "Men's Health",
      author: "Brett Williams",
      publishedDate: "Mar 20, 2026",
      navLinks: ["Fitness", "Health", "Nutrition", "Style", "Grooming", "Gear"],
      sidebarItems: [
        { title: "The Best Adjustable Dumbbells for Home Gyms", image: thumb("best-adjustable-dumbbells-for-men-69090dfb172e0.jpg"), eyebrow: "Gear" },
        { title: "The Best Cold Plunges, Tested by Experts", image: thumb("best-cold-plunge-for-men-68249d19bf84f.jpg"), eyebrow: "Recovery" },
        { title: "This Guy Lost 50 Pounds With One Simple Change", image: thumb("amire-madison-wlt-67e6d8f4bf9f2.jpg"), eyebrow: "Weight Loss" },
        { title: "The Best Pickleball Shoes for Every Court", image: thumb("mh-4-30-pickleball-shoes-66310fa1e2d1b.jpg"), eyebrow: "Gear" },
      ],
      body: (
        <>
          <p>If you&rsquo;re looking to overhaul your fitness routine this spring, you don&rsquo;t need a complicated split or hours in the gym. What you need is a smart, efficient full-body workout that hits every major muscle group and gets your heart rate up.</p>
          <ArticleInlineImage src={img("dsc01737-1-jpg-68539980992c9.jpg")} alt="Man performing dumbbell exercise" caption="Compound movements are the foundation of an efficient full-body routine." credit="Men's Health" />
          <PullQuote>The best workout is the one you actually do. Consistency beats complexity every single time.</PullQuote>
          <ArticleSubheading>The Warm-Up (5 Minutes)</ArticleSubheading>
          <p>Start with a dynamic warm-up: arm circles, leg swings, bodyweight squats, and inchworms. The goal is to elevate your heart rate and prepare your joints for the work ahead. Skip this at your own peril&mdash;cold muscles are injury-prone muscles.</p>
          <ArticleSubheading>The Main Event (35 Minutes)</ArticleSubheading>
          <p>This workout uses a superset format: pair two exercises back-to-back with minimal rest. You&rsquo;ll hit your chest and back, then your legs and shoulders, then finish with a core-focused finisher that&rsquo;ll leave you feeling accomplished.</p>
          <ArticleInlineImage src={img("maingaining-landingp-6949bb976a6bf.jpg")} alt="Fitness training" caption="Supersets maximize your time in the gym by pairing opposing muscle groups." credit="Men's Health" />
        </>
      ),
      relatedArticles: [
        { title: "Best Adjustable Dumbbells for Home Gyms", image: card("best-adjustable-dumbbells-for-men-69090dfb172e0.jpg") },
        { title: "Best Cold Plunges, Tested by Experts", image: card("best-cold-plunge-for-men-68249d19bf84f.jpg") },
        { title: "This Guy Lost 50 Pounds", image: card("amire-madison-wlt-67e6d8f4bf9f2.jpg") },
        { title: "Best Pickleball Shoes for Every Court", image: card("mh-4-30-pickleball-shoes-66310fa1e2d1b.jpg") },
      ],
    },
  },

  "good-housekeeping": {
    content: {
      breadcrumbs: [{ label: "Home" }, { label: "Organizing" }],
      headline: "The 30-Day Spring Cleaning Challenge That Actually Works",
      dek: "Our experts broke down the entire process into manageable daily tasks so you can deep-clean your whole house without the overwhelm.",
      heroImage: img("663161b6-4f58-4569-a30f-9808e06e4454.jpg"),
      heroImageAlt: "Clean organized home interior",
      heroImageCredit: "Good Housekeeping",
      author: "Carolyn Forte",
      publishedDate: "Mar 19, 2026",
      navLinks: ["Home", "Health", "Food", "Beauty", "Holidays", "Shopping"],
      sidebarItems: [
        { title: "The Best Bedding of 2026, Tested by Our Lab", image: thumb("8dbc4234-6098-49c4-86e2-a42fc70a54c4.jpg"), eyebrow: "Bedding" },
        { title: "Best Bathroom Remodel Ideas on a Budget", image: thumb("92dcee21-67a8-4f7d-a202-f1463aebe735.jpeg"), eyebrow: "Home" },
        { title: "The Cleaning Products Our Experts Actually Use", image: thumb("941e2b83-cd35-4343-a610-9f7d55b62078.jpg"), eyebrow: "Cleaning" },
        { title: "How to Organize Your Pantry Once and for All", image: thumb("b941ac09-4aba-4b13-8fa7-efa4b0c4d5dc.jpg"), eyebrow: "Organizing" },
      ],
      body: (
        <>
          <p>Spring cleaning doesn&rsquo;t have to be a weekend-long marathon that leaves you exhausted and resentful. Our home care experts at the Good Housekeeping Institute have designed a 30-day challenge that breaks the process into bite-sized daily tasks, each taking 30 minutes or less.</p>
          <PullQuote>The secret to spring cleaning is consistency, not intensity. Thirty minutes a day beats eight hours on a Saturday.</PullQuote>
          <ArticleSubheading>Week 1: The Kitchen</ArticleSubheading>
          <p>Start where it matters most. Day one: clean out the refrigerator. Day two: tackle the pantry. Day three: deep-clean the oven. By the end of the week, your kitchen will feel brand new, and you&rsquo;ll have the momentum to keep going.</p>
          <ArticleInlineImage src={img("8d200d0a-0603-4451-90d9-623b7d78475d.jpg")} alt="Organized kitchen" caption="A clean, organized kitchen sets the tone for the rest of your home." credit="Good Housekeeping" />
          <ArticleSubheading>Week 2: Bedrooms and Closets</ArticleSubheading>
          <p>This is where the magic happens. Swap out your winter bedding for lighter layers, rotate your closet, and finally deal with that pile of clothes you&rsquo;ve been meaning to donate. Our experts recommend the &ldquo;one in, one out&rdquo; rule to keep things manageable.</p>
          <ArticleInlineImage src={img("7e5e65ec-40f0-42c5-87d6-10d80b01e263.jpg")} alt="Organized bedroom" caption="Fresh bedding and a decluttered closet make all the difference." credit="Good Housekeeping" />
        </>
      ),
      relatedArticles: [
        { title: "Best Bedding of 2026, Tested by Our Lab", image: card("8dbc4234-6098-49c4-86e2-a42fc70a54c4.jpg") },
        { title: "Best Bathroom Remodel Ideas on a Budget", image: card("92dcee21-67a8-4f7d-a202-f1463aebe735.jpeg") },
        { title: "Cleaning Products Our Experts Actually Use", image: card("941e2b83-cd35-4343-a610-9f7d55b62078.jpg") },
        { title: "How to Organize Your Pantry", image: card("b941ac09-4aba-4b13-8fa7-efa4b0c4d5dc.jpg") },
      ],
    },
  },

  "harpers-bazaar": {
    content: {
      breadcrumbs: [{ label: "Fashion" }, { label: "Trends" }],
      headline: "The Chanel Jacket Is Having Its Biggest Moment Yet",
      dek: "From the runways of Paris to the streets of New York, the iconic tweed jacket is everywhere this season\u2014and it\u2019s never looked better.",
      heroImage: img("0309-chanel-00-69af6befda5d5.jpg"),
      heroImageAlt: "Chanel fashion editorial",
      heroImageCredit: "Harper's Bazaar",
      author: "Kerry Pieri",
      publishedDate: "Mar 22, 2026",
      navLinks: ["Fashion", "Beauty", "Celebrity", "Culture", "Weddings", "Shopping"],
      sidebarItems: [
        { title: "The Best Bag Trends of Spring 2026", image: thumb("0126-bagtrends-00-6977ccf5cddb8.gif"), eyebrow: "Accessories" },
        { title: "The Chicest Flats for Every Occasion", image: thumb("0309-flats-00-69af1a2d34139.jpg"), eyebrow: "Shoes" },
        { title: "How to Wear Chartreuse Like a Fashion Insider", image: thumb("0305-chartreuse-00-69a9dc35b06ee.jpg"), eyebrow: "Trends" },
        { title: "The Best Jackets for Spring Layering", image: thumb("0306-jackets-00-69aadeda3cb25.jpg"), eyebrow: "Shopping" },
      ],
      body: (
        <>
          <p>There are few garments as instantly recognizable as the Chanel jacket. The boucl&eacute; tweed, the braided trim, the structured yet feminine silhouette&mdash;it&rsquo;s been a fashion staple since Coco Chanel first introduced it in the 1950s. But this season, the jacket is experiencing a renaissance.</p>
          <ArticleInlineImage src={img("0306-pfwss-00-69ab3d4488cd8.jpg")} alt="Paris Fashion Week street style" caption="Street style stars at Paris Fashion Week embraced the Chanel jacket in unexpected ways." credit="Harper's Bazaar" />
          <PullQuote>The Chanel jacket isn&rsquo;t just a piece of clothing. It&rsquo;s a statement about who you are and where you&rsquo;re going.</PullQuote>
          <ArticleSubheading>A New Generation Discovers the Classic</ArticleSubheading>
          <p>What&rsquo;s driving the resurgence? A new generation of fashion lovers who are discovering the jacket through vintage shops and resale platforms. They&rsquo;re styling it with jeans and sneakers, subverting its ladylike origins while honoring its craftsmanship.</p>
          <ArticleInlineImage src={img("0306-camileeceline-00-69ab5772d9e99.jpg")} alt="Fashion editorial" caption="The modern Chanel jacket is styled with unexpected pairings." credit="Harper's Bazaar" />
        </>
      ),
      relatedArticles: [
        { title: "The Best Bag Trends of Spring 2026", image: card("0126-bagtrends-00-6977ccf5cddb8.gif") },
        { title: "The Chicest Flats for Every Occasion", image: card("0309-flats-00-69af1a2d34139.jpg") },
        { title: "How to Wear Chartreuse", image: card("0305-chartreuse-00-69a9dc35b06ee.jpg") },
        { title: "Best Jackets for Spring Layering", image: card("0306-jackets-00-69aadeda3cb25.jpg") },
      ],
    },
  },

  "popular-mechanics": {
    content: {
      breadcrumbs: [{ label: "Technology" }, { label: "Science" }],
      headline: "Inside the Race to Build the World\u2019s First Commercial Fusion Reactor",
      dek: "After decades of broken promises, fusion energy is closer than ever. Here\u2019s what\u2019s different this time.",
      heroImage: img("3d-rendering-of-core-of-a-fusion-reactor-royalty-free-image-1771366366.pjpeg"),
      heroImageAlt: "3D rendering of a fusion reactor core",
      heroImageCredit: "Getty Images",
      author: "Tim Newcomb",
      publishedDate: "Mar 21, 2026",
      navLinks: ["Technology", "Science", "Military", "Cars", "Home", "Gear"],
      sidebarItems: [
        { title: "The Best Portable Monitors for Working Anywhere", image: thumb("arzopa-portable-monitor-0053-6489d98a8d475.jpg"), eyebrow: "Gear" },
        { title: "Audio-Technica's Sound Burger Turntable, Reviewed", image: thumb("audio-technica-sound-burger-turntable-005-698e1418e5406.jpg"), eyebrow: "Reviews" },
        { title: "Apple Store Redesign Hints at the Future of Retail", image: thumb("apple-store-69136389cee08.png"), eyebrow: "Tech" },
        { title: "Apple Watch 11 Is Already on Sale", image: thumb("apple-watch-11-sale-amazon-february-2026-6983a9bee4d7b.png"), eyebrow: "Deals" },
      ],
      body: (
        <>
          <p>For as long as most of us have been alive, fusion energy has been &ldquo;30 years away.&rdquo; It&rsquo;s become a punchline in the energy world&mdash;the perpetual promise of unlimited, clean power that never quite materializes. But something has shifted. In the last three years, more than $6 billion in private investment has poured into fusion startups, and several companies are now racing to build the first commercially viable reactor.</p>
          <PullQuote>Fusion isn&rsquo;t 30 years away anymore. The question isn&rsquo;t if, but which approach gets there first.</PullQuote>
          <ArticleSubheading>What Changed?</ArticleSubheading>
          <p>Two breakthroughs converged. First, advances in high-temperature superconducting magnets have made it possible to build smaller, more powerful reactors. Second, machine learning is now being used to predict and control plasma behavior in real time&mdash;solving a problem that has stumped physicists for decades.</p>
          <ArticleInlineImage src={img("4b779565-f6f1-49e5-9942-282a240e151e.jpg")} alt="Technology laboratory" caption="New superconducting magnets are enabling smaller, more powerful fusion reactors." credit="Popular Mechanics" />
          <ArticleSubheading>The Contenders</ArticleSubheading>
          <p>Commonwealth Fusion Systems, backed by Bill Gates and Google, is building a reactor in Massachusetts that could demonstrate net energy gain by 2028. Meanwhile, TAE Technologies in California is pursuing a different approach using hydrogen-boron fuel, which produces no radioactive waste.</p>
        </>
      ),
      relatedArticles: [
        { title: "Best Portable Monitors for Working Anywhere", image: card("arzopa-portable-monitor-0053-6489d98a8d475.jpg") },
        { title: "Audio-Technica Sound Burger Turntable Review", image: card("audio-technica-sound-burger-turntable-005-698e1418e5406.jpg") },
        { title: "Apple Store Redesign Hints at Future of Retail", image: card("apple-store-69136389cee08.png") },
        { title: "Apple Watch 11 Is Already on Sale", image: card("apple-watch-11-sale-amazon-february-2026-6983a9bee4d7b.png") },
      ],
    },
  },

  "country-living": {
    content: {
      breadcrumbs: [{ label: "Home Design" }, { label: "House Tours" }],
      headline: "This Alabama River Cottage Is the Ultimate Spring Retreat",
      dek: "With wide porches, vintage finds, and a view that goes on forever, this charming cottage proves that simple living is the best living.",
      heroImage: img("alabama-river-cottage-home-tour-primary-bath-bathtub-66e8ab4f39d87.jpg"),
      heroImageAlt: "Alabama river cottage bathroom with freestanding tub",
      heroImageCredit: "Country Living",
      author: "Rachel Silva",
      publishedDate: "Mar 20, 2026",
      navLinks: ["Home Design", "Gardening", "Food & Drinks", "Shopping", "DIY", "Travel"],
      sidebarItems: [
        { title: "A Texas Farmhouse That's Pure Perfection", image: thumb("bailey-mccarthy-texas-farmhouse-exterior-1676684039.jpg"), eyebrow: "House Tours" },
        { title: "The Best Bathroom Decor Ideas for Any Budget", image: thumb("bathroom-decor-ideas-gallery-wall-over-tub-6605e8bca46f5.jpeg"), eyebrow: "Decorating" },
        { title: "Before and After: A Stunning Kitchen Makeover", image: thumb("before-after-6595cf8348c46.jpg"), eyebrow: "Renovations" },
        { title: "A Birmingham Home With Southern Charm to Spare", image: thumb("bryant-birmingham-home-powder-room-68ed73f832557.jpg"), eyebrow: "House Tours" },
      ],
      body: (
        <>
          <p>Tucked along the banks of the Alabama River, this 1920s cottage has been lovingly restored by its owners into the kind of retreat that makes you want to slow down and stay awhile. With its wide wraparound porch, original heart-pine floors, and a collection of vintage finds gathered over decades, it&rsquo;s a masterclass in relaxed Southern style.</p>
          <ArticleInlineImage src={img("3188abcc-f748-4273-9624-071a52976c49.jpg")} alt="Country living home interior" caption="Original heart-pine floors and vintage textiles give the cottage its character." credit="Country Living" />
          <PullQuote>A home doesn&rsquo;t need to be grand to be beautiful. Sometimes the simplest spaces hold the most magic.</PullQuote>
          <ArticleSubheading>The Living Room</ArticleSubheading>
          <p>The living room is anchored by a stone fireplace and filled with a mix of antique and modern pieces. Linen slipcovers on the sofas keep things casual, while a collection of landscape paintings by local artists adds color and personality.</p>
          <ArticleInlineImage src={img("beaac1b7-3259-4c23-ae4e-5916c6fd2d46.jpg")} alt="Country cottage living room" caption="Linen slipcovers and local art create a relaxed, collected feel." credit="Country Living" />
        </>
      ),
      relatedArticles: [
        { title: "A Texas Farmhouse That's Pure Perfection", image: card("bailey-mccarthy-texas-farmhouse-exterior-1676684039.jpg") },
        { title: "Best Bathroom Decor Ideas for Any Budget", image: card("bathroom-decor-ideas-gallery-wall-over-tub-6605e8bca46f5.jpeg") },
        { title: "Before and After: A Stunning Kitchen Makeover", image: card("before-after-6595cf8348c46.jpg") },
        { title: "Birmingham Home With Southern Charm", image: card("bryant-birmingham-home-powder-room-68ed73f832557.jpg") },
      ],
    },
  },

  "house-beautiful": {
    content: {
      breadcrumbs: [{ label: "Design Inspiration" }, { label: "House Tours" }],
      headline: "A Wilmette Great Room That Proves Bold Color Always Wins",
      dek: "Designer Jennie Bishop transformed a suburban living space into a vibrant, layered masterpiece.",
      heroImage: img("2025-ht-jennie-bishop-bishop-studio-ph-heather-talbert-bishopstudio-wilmette-great-room-5-web-695d841fadb4b.jpg"),
      heroImageAlt: "Colorful great room designed by Jennie Bishop",
      heroImageCredit: "Heather Talbert",
      author: "Hadley Mendelsohn",
      publishedDate: "Mar 22, 2026",
      navLinks: ["Design", "Rooms", "Renovating", "Gardening", "Shopping", "Lifestyle"],
      sidebarItems: [
        { title: "The Best Paint Colors for Every Room in 2026", image: thumb("300e1b6e-b588-45fd-97a5-ca451c9683f0.jpg"), eyebrow: "Color" },
        { title: "A Rosewood Home With Effortless California Style", image: thumb("09072022-galeana-rosewood-007-66e07dfeeb0ce.jpg"), eyebrow: "House Tours" },
        { title: "Small Living Room Ideas That Maximize Space", image: thumb("3-living2-695d7a6a21c70.jpg"), eyebrow: "Small Spaces" },
      ],
      body: (
        <>
          <p>When Jennie Bishop of Bishop Studio took on this Wilmette, Illinois, great room, the brief was simple: make it feel alive. The homeowners, a young family with two kids, wanted a space that was both sophisticated and kid-friendly&mdash;a tall order that Bishop met with a fearless approach to color and pattern.</p>
          <ArticleInlineImage src={img("06-jgmb-3575-hires-66fb00becc0be.jpg")} alt="Interior design detail" caption="Bold pattern mixing gives the space energy without feeling chaotic." credit="Heather Talbert" />
          <PullQuote>Color is not something to be afraid of. It&rsquo;s the fastest way to make a room feel like home.</PullQuote>
          <p>The result is a room that feels collected rather than decorated, with vintage pieces sitting comfortably alongside custom upholstery and contemporary art. A deep teal sofa anchors the space, while a vintage kilim rug adds warmth and texture underfoot.</p>
        </>
      ),
      relatedArticles: [
        { title: "Best Paint Colors for Every Room in 2026", image: card("300e1b6e-b588-45fd-97a5-ca451c9683f0.jpg") },
        { title: "A Rosewood Home With California Style", image: card("09072022-galeana-rosewood-007-66e07dfeeb0ce.jpg") },
        { title: "Small Living Room Ideas That Maximize Space", image: card("3-living2-695d7a6a21c70.jpg") },
        { title: "The Most Beautiful Kitchens of 2026", image: card("449d9d5e-e056-422a-8ed4-cce19b21f896.jpg") },
      ],
    },
  },

  autoweek: {
    content: {
      breadcrumbs: [{ label: "Racing" }, { label: "Formula 1" }],
      headline: "Why McLaren\u2019s 2026 Car Could Rewrite the Rules of F1 Aero",
      dek: "New ground-effect regulations, a radical sidepod concept, and a driver lineup that\u2019s already turning heads in pre-season testing.",
      heroImage: img("251217-01-00-z-27my-01-696149a83bf60.jpg"),
      heroImageAlt: "McLaren F1 car on track",
      heroImageCredit: "Autoweek / Getty",
      author: "Jake Lingeman",
      publishedDate: "Mar 23, 2026",
      navLinks: ["Racing", "News", "Drives", "Car Life", "Gear", "EV"],
      sidebarItems: [
        { title: "IndyCar 2026 Schedule: What You Need to Know", image: thumb("2024-nissan-z-nismo-149-668d5ce36ae38.jpg"), eyebrow: "IndyCar" },
        { title: "Porsche 963 Gets LMDh Upgrades for Le Mans", image: thumb("2025-gmc-yukon-denali-102-6852cef15027e.jpg"), eyebrow: "Endurance" },
        { title: "Rally Legend Seb Ogier Hints at Retirement", image: thumb("311612c5-94a7-4874-b788-f60d39a244c0.jpg"), eyebrow: "Rally" },
        { title: "The Best Racing Sims You Can Buy Right Now", image: thumb("88841361-054e-412e-a300-a43fec380de0.jpg"), eyebrow: "Gear" },
      ],
      body: (
        <>
          <p>The 2026 Formula 1 regulations represent the biggest shakeup in the sport since the turbo-hybrid era began in 2014. With drastically simplified aerodynamics, active aero elements, and new electrical energy recovery rules, every team is essentially starting from scratch. And McLaren may have found the biggest advantage.</p>
          <PullQuote>It&rsquo;s not about who has the fastest car on day one. It&rsquo;s about who understands the new regs deeply enough to develop fastest.</PullQuote>
          <p>In pre-season testing at Bahrain, McLaren&rsquo;s MCL60 turned heads with a radical sidepod design that no other team attempted. The concept channels airflow beneath the floor in a way that appears to generate significantly more downforce while maintaining the FIA&rsquo;s drag-reduction goals.</p>
          <ArticleSubheading>The Driver Factor</ArticleSubheading>
          <p>Lando Norris, coming off his first championship challenge in 2025, is joined by a hungry Oscar Piastri. The pairing is widely regarded as the strongest on the grid, and both drivers have praised the new car&rsquo;s balance and drivability.</p>
          <ArticleInlineImage src={img("2024-nissan-z-nismo-149-668d5ce36ae38.jpg")} alt="Racing action" caption="McLaren's radical sidepod concept has turned heads in pre-season testing." credit="Autoweek" />
        </>
      ),
      relatedArticles: [
        { title: "IndyCar 2026 Schedule: What to Know", image: card("2024-nissan-z-nismo-149-668d5ce36ae38.jpg") },
        { title: "Porsche 963 Gets LMDh Upgrades", image: card("2025-gmc-yukon-denali-102-6852cef15027e.jpg") },
        { title: "Seb Ogier Hints at Retirement", image: card("311612c5-94a7-4874-b788-f60d39a244c0.jpg") },
        { title: "Best Racing Sims You Can Buy", image: card("88841361-054e-412e-a300-a43fec380de0.jpg") },
      ],
    },
  },

  "best-products": {
    content: {
      breadcrumbs: [{ label: "Tech" }, { label: "Headphones" }],
      headline: "The 12 Best Noise-Canceling Headphones of 2026",
      dek: "We tested over 40 pairs to find the headphones that actually deliver on the promise of silence.",
      heroImage: img("audio-technica-sound-burger-turntable-005-698e1418e5406.jpg"),
      heroImageAlt: "Headphones on a desk",
      heroImageCredit: "Best Products",
      author: "Brandon Carte",
      publishedDate: "Mar 22, 2026",
      navLinks: ["Tech", "Home", "Kitchen", "Fitness", "Outdoors", "Style"],
      sidebarItems: [
        { title: "The Best Robot Vacuums, Tested by Our Lab", image: thumb("arzopa-portable-monitor-0053-6489d98a8d475.jpg"), eyebrow: "Home" },
        { title: "Best Air Purifiers for Allergy Season", image: thumb("apple-watch-11-sale-amazon-february-2026-6983a9bee4d7b.png"), eyebrow: "Home" },
        { title: "The Best Blenders for Smoothies", image: thumb("apple-store-69136389cee08.png"), eyebrow: "Kitchen" },
      ],
      body: (
        <>
          <p>Noise-canceling headphones have become essential gear for commuters, remote workers, and anyone who values a moment of peace. But with so many options on the market&mdash;from $50 budget picks to $600 flagship models&mdash;finding the right pair can feel overwhelming.</p>
          <PullQuote>The best headphones aren&rsquo;t the most expensive ones. They&rsquo;re the ones that fit your life.</PullQuote>
          <ArticleSubheading>How We Test</ArticleSubheading>
          <p>Our testing process involves wearing each pair for at least a week of daily use, measuring active noise cancellation with calibrated microphones, evaluating sound quality across multiple genres, and assessing comfort during marathon listening sessions.</p>
          <ArticleInlineImage src={img("arzopa-portable-monitor-0053-6489d98a8d475.jpg")} alt="Testing headphones" caption="We test every pair in real-world conditions, not just in a lab." credit="Best Products" />
          <ArticleSubheading>Our Top Pick: Sony WH-1000XM6</ArticleSubheading>
          <p>Sony continues to dominate this category with the XM6. The noise cancellation is noticeably better than its predecessor, the battery now lasts 40 hours, and the sound quality is warm, detailed, and balanced across all frequencies.</p>
        </>
      ),
      relatedArticles: [
        { title: "Best Robot Vacuums of 2026", image: card("arzopa-portable-monitor-0053-6489d98a8d475.jpg") },
        { title: "Best Air Purifiers for Allergy Season", image: card("apple-watch-11-sale-amazon-february-2026-6983a9bee4d7b.png") },
        { title: "Best Blenders for Smoothies", image: card("apple-store-69136389cee08.png") },
        { title: "Best Portable Monitors", image: card("audio-technica-sound-burger-turntable-005-698e1418e5406.jpg") },
      ],
    },
  },

  bicycling: {
    content: {
      breadcrumbs: [{ label: "Gear" }, { label: "Road Bikes" }],
      headline: "The 10 Best Road Bikes of 2026 for Every Type of Rider",
      dek: "Whether you\u2019re a beginner or a seasoned racer, these are the bikes worth your investment this year.",
      heroImage: img("hlh050125fearunning-027-6807f9d90c2fd.jpg"),
      heroImageAlt: "Cyclist on a road bike",
      heroImageCredit: "Bicycling",
      author: "Riley Missel",
      publishedDate: "Mar 20, 2026",
      navLinks: ["Gear", "Training", "Nutrition", "Culture", "News", "Repair"],
      sidebarItems: [
        { title: "The Best Cycling Shorts for Long Rides", image: thumb("mh-4-30-pickleball-shoes-66310fa1e2d1b.jpg"), eyebrow: "Gear" },
        { title: "How to Fix a Flat in Under 5 Minutes", image: thumb("best-adjustable-dumbbells-for-men-69090dfb172e0.jpg"), eyebrow: "Repair" },
        { title: "Gravel Bike vs. Road Bike: Which Is Right for You?", image: thumb("best-cold-plunge-for-men-68249d19bf84f.jpg"), eyebrow: "Gear" },
      ],
      body: (
        <>
          <p>The road bike market in 2026 is the most exciting it&rsquo;s been in years. Disc brakes are now universal, electronic shifting has trickled down to mid-range price points, and frame geometry continues to evolve toward a more comfortable, all-day riding position.</p>
          <PullQuote>The best road bike is the one that makes you want to ride more. Everything else is just specs on paper.</PullQuote>
          <ArticleSubheading>Best Overall: Specialized Tarmac SL8</ArticleSubheading>
          <p>The Tarmac SL8 continues to be the benchmark for all-around road bikes. It climbs like a featherweight, descends with confidence, and its ride quality over rough roads is remarkably smooth for such a stiff frame.</p>
          <ArticleInlineImage src={img("dsc01737-1-jpg-68539980992c9.jpg")} alt="Road bike detail" caption="The Tarmac SL8 sets the standard for all-around performance." credit="Bicycling" />
        </>
      ),
      relatedArticles: [
        { title: "Best Cycling Shorts for Long Rides", image: card("mh-4-30-pickleball-shoes-66310fa1e2d1b.jpg") },
        { title: "How to Fix a Flat in 5 Minutes", image: card("best-adjustable-dumbbells-for-men-69090dfb172e0.jpg") },
        { title: "Gravel Bike vs. Road Bike", image: card("best-cold-plunge-for-men-68249d19bf84f.jpg") },
        { title: "Best Bike Helmets of 2026", image: card("maingaining-landingp-6949bb976a6bf.jpg") },
      ],
    },
  },

  biography: {
    content: {
      breadcrumbs: [{ label: "Celebrities" }, { label: "Musicians" }],
      headline: "The Untold Story of Billie Eilish\u2019s Reinvention",
      dek: "From teenage prodigy to cultural icon, how Eilish\u2019s third album marks the most personal chapter of her career.",
      heroImage: img("f4eb21d0-0fc4-494d-ac4c-13b6eebbac5f.jpg"),
      heroImageAlt: "Billie Eilish portrait",
      heroImageCredit: "Getty Images",
      author: "Sara Kettler",
      publishedDate: "Mar 21, 2026",
      navLinks: ["Celebrities", "Historical Figures", "Musicians", "Actors", "Athletes", "Leaders"],
      sidebarItems: [
        { title: "The Fascinating Life of Frida Kahlo", image: thumb("5e6d4136-cb47-4d1b-82fe-a2b289f6595b.jpeg"), eyebrow: "Artists" },
        { title: "How Oprah Winfrey Built Her Empire", image: thumb("726e4735-1f3b-4329-a2db-a35c44439c5b.jpeg"), eyebrow: "Moguls" },
        { title: "The Real Story Behind Johnny Cash", image: thumb("doug-699c83837b7c2.jpg"), eyebrow: "Musicians" },
      ],
      body: (
        <>
          <p>When Billie Eilish burst onto the scene in 2019 with &ldquo;Bad Guy,&rdquo; she was 17 years old and already redefining what pop music could sound like. Six years later, at 24, she&rsquo;s one of the most decorated artists of her generation&mdash;and she&rsquo;s just getting started.</p>
          <PullQuote>I don&rsquo;t want to be the same artist I was at 17. Growth isn&rsquo;t about leaving your past behind&mdash;it&rsquo;s about building on it.</PullQuote>
          <ArticleSubheading>The Early Years</ArticleSubheading>
          <p>Born in Los Angeles to a family of artists, Eilish was homeschooled and began writing songs with her brother Finneas at age 11. Their bedroom recordings had an intimacy that would become the hallmark of her sound.</p>
          <ArticleInlineImage src={img("5e6d4136-cb47-4d1b-82fe-a2b289f6595b.jpeg")} alt="Music industry" caption="Eilish's partnership with Finneas remains one of music's most productive collaborations." credit="Getty Images" />
        </>
      ),
      relatedArticles: [
        { title: "The Fascinating Life of Frida Kahlo", image: card("5e6d4136-cb47-4d1b-82fe-a2b289f6595b.jpeg") },
        { title: "How Oprah Winfrey Built Her Empire", image: card("726e4735-1f3b-4329-a2db-a35c44439c5b.jpeg") },
        { title: "The Real Story Behind Johnny Cash", image: card("doug-699c83837b7c2.jpg") },
        { title: "Beyoncé: From Destiny's Child to Icon", image: card("f4eb21d0-0fc4-494d-ac4c-13b6eebbac5f.jpg") },
      ],
    },
  },

  "elle-decor": {
    content: {
      breadcrumbs: [{ label: "Design" }, { label: "House Tours" }],
      headline: "Inside a Paris Apartment Where Art Deco Meets Minimalism",
      dek: "Architect Joseph Dirand\u2019s latest residential project proves that restraint can be just as luxurious as excess.",
      heroImage: img("2025-ht-jennie-bishop-bishop-studio-ph-heather-talbert-bishopstudio-wilmette-great-room-5-web-695d841fadb4b.jpg"),
      heroImageAlt: "Paris apartment interior",
      heroImageCredit: "Elle Decor / Simon Watson",
      author: "Ingrid Abramovitch",
      publishedDate: "Mar 22, 2026",
      navLinks: ["Design", "House Tours", "Rooms", "Shopping", "Culture", "Travel"],
      sidebarItems: [
        { title: "The Best Interior Designers to Know in 2026", image: thumb("300e1b6e-b588-45fd-97a5-ca451c9683f0.jpg"), eyebrow: "Design" },
        { title: "A Napa Valley Estate With Vineyard Views", image: thumb("09072022-galeana-rosewood-007-66e07dfeeb0ce.jpg"), eyebrow: "House Tours" },
        { title: "The Tile Trends Dominating This Year", image: thumb("3-living2-695d7a6a21c70.jpg"), eyebrow: "Trends" },
      ],
      body: (
        <>
          <p>Joseph Dirand has always had a gift for making the monumental feel intimate. In this 3,200-square-foot apartment in Paris&rsquo;s 7th arrondissement, the architect strips things back to their essence: travertine floors, plaster walls, and furniture that reads more like sculpture than seating.</p>
          <PullQuote>Luxury is not about accumulation. It&rsquo;s about the quality of space, light, and silence.</PullQuote>
          <ArticleSubheading>Living With Art</ArticleSubheading>
          <p>The apartment&rsquo;s collection includes works by Dan Flavin, Donald Judd, and Agnes Martin&mdash;artists whose minimalist sensibility mirrors Dirand&rsquo;s architectural language. Each piece was chosen not to decorate but to punctuate the space.</p>
          <ArticleInlineImage src={img("06-jgmb-3575-hires-66fb00becc0be.jpg")} alt="Interior design detail" caption="Every material choice reflects Dirand's philosophy of purposeful restraint." credit="Simon Watson" />
        </>
      ),
      relatedArticles: [
        { title: "Best Interior Designers to Know in 2026", image: card("300e1b6e-b588-45fd-97a5-ca451c9683f0.jpg") },
        { title: "A Napa Valley Estate With Vineyard Views", image: card("09072022-galeana-rosewood-007-66e07dfeeb0ce.jpg") },
        { title: "Tile Trends Dominating This Year", image: card("3-living2-695d7a6a21c70.jpg") },
        { title: "Stunning Kitchens of 2026", image: card("449d9d5e-e056-422a-8ed4-cce19b21f896.jpg") },
      ],
    },
  },

  esquire: {
    content: {
      breadcrumbs: [{ label: "Culture" }, { label: "TV" }],
      headline: "Why Everybody\u2019s Talking About \u2018The Studio\u2019",
      dek: "Seth Rogen\u2019s new Apple TV+ comedy is the sharpest Hollywood satire since The Player. Here\u2019s why it works.",
      heroImage: img("81c31f6f-6638-4e0f-8465-6971305ed9e0.jpg", "crop=0.6666xw:1xh;center,top&resize=1200:*"),
      heroImageAlt: "The Studio TV show",
      heroImageCredit: "Apple TV+",
      author: "Josh Rosenberg",
      publishedDate: "Mar 23, 2026",
      navLinks: ["Style", "Culture", "Politics", "Food & Drink", "Health", "Gear"],
      sidebarItems: [
        { title: "The Best New Watches of 2026", image: thumb("5e6d4136-cb47-4d1b-82fe-a2b289f6595b.jpeg"), eyebrow: "Style" },
        { title: "What I Learned Drinking Only Water for a Month", image: thumb("726e4735-1f3b-4329-a2db-a35c44439c5b.jpeg"), eyebrow: "Health" },
        { title: "How to Make the Perfect Martini", image: thumb("doug-699c83837b7c2.jpg"), eyebrow: "Food & Drink" },
        { title: "The Best Suits Under $500", image: thumb("man-of-the-house01-659ee8c6cc9bd.jpg"), eyebrow: "Style" },
      ],
      body: (
        <>
          <p>In an era when Hollywood loves nothing more than making fun of itself, Seth Rogen&rsquo;s The Studio manages to find something genuinely new to say. The Apple TV+ comedy, which premiered last month to rave reviews, follows a newly appointed studio head (Rogen) who discovers that running a movie studio in 2026 is essentially an exercise in controlled chaos.</p>
          <PullQuote>The Studio isn&rsquo;t just funny. It&rsquo;s the most accurate depiction of modern Hollywood I&rsquo;ve ever seen on screen.</PullQuote>
          <ArticleSubheading>The Ensemble</ArticleSubheading>
          <p>Rogen is surrounded by a murderer&rsquo;s row of talent: Catherine O&rsquo;Hara as a legendary producer, Ike Barinholtz as a yes-man executive, and a different A-list cameo every episode that keeps viewers guessing.</p>
          <ArticleInlineImage src={img("1fbdc656-00e0-4226-9ee3-f2766351fa00.jpg")} alt="TV production" caption="The show's ensemble cast delivers some of the sharpest comedy writing on TV." credit="Apple TV+" />
        </>
      ),
      relatedArticles: [
        { title: "Best New Watches of 2026", image: card("5e6d4136-cb47-4d1b-82fe-a2b289f6595b.jpeg") },
        { title: "Drinking Only Water for a Month", image: card("726e4735-1f3b-4329-a2db-a35c44439c5b.jpeg") },
        { title: "How to Make the Perfect Martini", image: card("doug-699c83837b7c2.jpg") },
        { title: "The Best Suits Under $500", image: card("man-of-the-house01-659ee8c6cc9bd.jpg") },
      ],
    },
  },

  fre: {
    content: {
      breadcrumbs: [{ label: "Design System" }, { label: "Components" }],
      headline: "Building a Multi-Brand Design System at Scale",
      dek: "How the Hearst Front-end team created a token-driven component library that serves 29 brands from a single codebase.",
      heroImage: img("apple-store-69136389cee08.png"),
      heroImageAlt: "Design system components",
      heroImageCredit: "Hearst FRE",
      author: "Hearst Engineering",
      publishedDate: "Mar 23, 2026",
      navLinks: ["Components", "Tokens", "Patterns", "Guidelines", "Changelog"],
      sidebarItems: [
        { title: "Introducing Semantic Tokens", image: thumb("arzopa-portable-monitor-0053-6489d98a8d475.jpg"), eyebrow: "Tokens" },
        { title: "How We Handle Brand Theming", image: thumb("audio-technica-sound-burger-turntable-005-698e1418e5406.jpg"), eyebrow: "Architecture" },
        { title: "Component Testing Best Practices", image: thumb("apple-watch-11-sale-amazon-february-2026-6983a9bee4d7b.png"), eyebrow: "QA" },
      ],
      body: (
        <>
          <p>When Hearst set out to unify its digital properties under a single design system, the challenge was clear: how do you build components that work for a fashion magazine, an automotive publication, and a food brand&mdash;all from the same codebase?</p>
          <PullQuote>A great design system doesn&rsquo;t constrain creativity. It gives every brand a head start.</PullQuote>
          <ArticleSubheading>The Three-Layer Token Architecture</ArticleSubheading>
          <p>The answer was a three-layer token system. Core tokens define raw values (colors, spacing, typography). Semantic tokens map those values to purpose (primary, secondary, accent). Brand tokens override semantic tokens per brand. The result: components that automatically adapt to any brand context.</p>
          <ArticleInlineImage src={img("arzopa-portable-monitor-0053-6489d98a8d475.jpg")} alt="Design system diagram" caption="Three-layer token architecture enables 29 brands from a single component library." credit="Hearst FRE" />
        </>
      ),
      relatedArticles: [
        { title: "Introducing Semantic Tokens", image: card("arzopa-portable-monitor-0053-6489d98a8d475.jpg") },
        { title: "How We Handle Brand Theming", image: card("audio-technica-sound-burger-turntable-005-698e1418e5406.jpg") },
        { title: "Component Testing Best Practices", image: card("apple-watch-11-sale-amazon-february-2026-6983a9bee4d7b.png") },
        { title: "Design Token Architecture", image: card("apple-store-69136389cee08.png") },
      ],
    },
  },

  "oprah-daily": {
    content: {
      breadcrumbs: [{ label: "Life" }, { label: "Wellness" }],
      headline: "Oprah\u2019s 5 Non-Negotiable Morning Habits for 2026",
      dek: "After decades of self-improvement, these are the practices she swears by every single day.",
      heroImage: img("663161b6-4f58-4569-a30f-9808e06e4454.jpg"),
      heroImageAlt: "Morning wellness routine",
      heroImageCredit: "Oprah Daily",
      author: "Arianna Davis",
      publishedDate: "Mar 21, 2026",
      navLinks: ["Life", "Health", "Food", "Style", "Books", "Oprah's Picks"],
      sidebarItems: [
        { title: "The Books Oprah Is Reading This Spring", image: thumb("8dbc4234-6098-49c4-86e2-a42fc70a54c4.jpg"), eyebrow: "Books" },
        { title: "How to Set Boundaries Without Guilt", image: thumb("92dcee21-67a8-4f7d-a202-f1463aebe735.jpeg"), eyebrow: "Relationships" },
        { title: "The Best Journaling Prompts for Self-Discovery", image: thumb("941e2b83-cd35-4343-a610-9f7d55b62078.jpg"), eyebrow: "Mindfulness" },
      ],
      body: (
        <>
          <p>If there&rsquo;s one thing Oprah Winfrey has learned in her decades-long journey of personal growth, it&rsquo;s that how you start your morning sets the tone for everything that follows. &ldquo;I&rsquo;ve tried every wellness trend there is,&rdquo; she says. &ldquo;These five things are the ones that stuck.&rdquo;</p>
          <PullQuote>The morning is sacred. It&rsquo;s the only part of the day that belongs entirely to you.</PullQuote>
          <ArticleSubheading>1. Gratitude Before Your Feet Hit the Floor</ArticleSubheading>
          <p>Before reaching for her phone, Oprah spends 60 seconds naming three things she&rsquo;s grateful for. &ldquo;It sounds simple because it is,&rdquo; she says. &ldquo;But it rewires your brain to look for the good.&rdquo;</p>
          <ArticleInlineImage src={img("8d200d0a-0603-4451-90d9-623b7d78475d.jpg")} alt="Wellness morning routine" caption="Oprah's morning routine has been refined over decades of experimentation." credit="Oprah Daily" />
        </>
      ),
      relatedArticles: [
        { title: "Books Oprah Is Reading This Spring", image: card("8dbc4234-6098-49c4-86e2-a42fc70a54c4.jpg") },
        { title: "How to Set Boundaries Without Guilt", image: card("92dcee21-67a8-4f7d-a202-f1463aebe735.jpeg") },
        { title: "Best Journaling Prompts", image: card("941e2b83-cd35-4343-a610-9f7d55b62078.jpg") },
        { title: "Oprah's Favorite Things 2026", image: card("b941ac09-4aba-4b13-8fa7-efa4b0c4d5dc.jpg") },
      ],
    },
  },

  prevention: {
    content: {
      breadcrumbs: [{ label: "Health" }, { label: "Heart Health" }],
      headline: "The Simple Walking Routine That Can Add Years to Your Life",
      dek: "New research shows that a specific walking pattern\u2014not just steps\u2014may be the key to longevity.",
      heroImage: img("hlh050125fearunning-027-6807f9d90c2fd.jpg"),
      heroImageAlt: "Person walking outdoors",
      heroImageCredit: "Prevention / Getty",
      author: "Kaitlyn Pirie",
      publishedDate: "Mar 20, 2026",
      navLinks: ["Health", "Fitness", "Nutrition", "Weight Loss", "Beauty", "Mind"],
      sidebarItems: [
        { title: "The 10 Best Anti-Inflammatory Foods", image: thumb("brie-asparagus-and-prosciutto-stuffed-chicken-index-67f02e15ac634.jpg"), eyebrow: "Nutrition" },
        { title: "What Your Blood Pressure Numbers Actually Mean", image: thumb("230927-delish-potato-soup-005-ab-hi-res-index-6529d0d908cb1.jpg"), eyebrow: "Health" },
        { title: "The Best Exercises for Strong Bones", image: thumb("beef-wellington-index-65149c4448c77.jpg"), eyebrow: "Fitness" },
      ],
      body: (
        <>
          <p>You don&rsquo;t need to run a marathon or join a CrossFit box to dramatically improve your health. A growing body of research suggests that a specific type of walking routine&mdash;not just hitting a step count&mdash;could be one of the most powerful tools for longevity.</p>
          <PullQuote>It&rsquo;s not about walking more. It&rsquo;s about walking smarter. Intensity matters more than duration.</PullQuote>
          <ArticleSubheading>The 3-2-1 Method</ArticleSubheading>
          <p>The approach is simple: walk for 30 minutes, three times a week, incorporating two-minute intervals of brisk walking followed by one minute of recovery pace. This interval pattern has been shown to improve cardiovascular health more effectively than steady-state walking.</p>
          <ArticleInlineImage src={img("dsc01737-1-jpg-68539980992c9.jpg")} alt="Walking exercise" caption="Interval walking can improve heart health more than steady-state walking." credit="Prevention" />
        </>
      ),
      relatedArticles: [
        { title: "10 Best Anti-Inflammatory Foods", image: card("brie-asparagus-and-prosciutto-stuffed-chicken-index-67f02e15ac634.jpg") },
        { title: "What Blood Pressure Numbers Mean", image: card("230927-delish-potato-soup-005-ab-hi-res-index-6529d0d908cb1.jpg") },
        { title: "Best Exercises for Strong Bones", image: card("beef-wellington-index-65149c4448c77.jpg") },
        { title: "Symptoms You Shouldn't Ignore", image: card("aperol-spritz-punch-index-web-261-rv-del019926-697bddaa60b3c.jpg") },
      ],
    },
  },

  redbook: {
    content: {
      breadcrumbs: [{ label: "Life" }, { label: "Relationships" }],
      headline: "The Friendship Recession Is Real\u2014Here\u2019s How to Fix It",
      dek: "Experts say adults are lonelier than ever. These science-backed strategies can help you rebuild your social circle.",
      heroImage: img("663161b6-4f58-4569-a30f-9808e06e4454.jpg"),
      heroImageAlt: "Friends gathering",
      heroImageCredit: "Redbook / Getty",
      author: "Sarah Smith",
      publishedDate: "Mar 21, 2026",
      navLinks: ["Life", "Love", "Beauty", "Fashion", "Home", "Food"],
      sidebarItems: [
        { title: "The Best Date Night Ideas for Every Budget", image: thumb("5e6d4136-cb47-4d1b-82fe-a2b289f6595b.jpeg"), eyebrow: "Love" },
        { title: "How to Have Hard Conversations", image: thumb("726e4735-1f3b-4329-a2db-a35c44439c5b.jpeg"), eyebrow: "Relationships" },
        { title: "The Self-Care Routines That Actually Work", image: thumb("screenshot-2026-03-01-at-9-58-21-pm-69a4fcef968f5.png"), eyebrow: "Wellness" },
      ],
      body: (
        <>
          <p>Making friends as an adult is hard. Keeping them is harder. A 2025 survey found that 60% of American adults say they feel lonely at least once a week, and the number of people who report having zero close friends has tripled since the 1990s.</p>
          <PullQuote>Friendship isn&rsquo;t something that just happens to you. After 30, it&rsquo;s something you have to build on purpose.</PullQuote>
          <ArticleSubheading>Why It&rsquo;s Happening</ArticleSubheading>
          <p>The factors are familiar: remote work, social media replacing face-to-face interaction, the demands of parenting, and a culture that prioritizes productivity over connection. But researchers say the solution is simpler than we think.</p>
          <ArticleInlineImage src={img("d3f8e6f2-d609-4161-b9f8-b56af736c3ec.jpeg")} alt="Friends socializing" caption="Experts recommend scheduling regular, low-stakes social time." credit="Redbook" />
        </>
      ),
      relatedArticles: [
        { title: "Best Date Night Ideas for Every Budget", image: card("5e6d4136-cb47-4d1b-82fe-a2b289f6595b.jpeg") },
        { title: "How to Have Hard Conversations", image: card("726e4735-1f3b-4329-a2db-a35c44439c5b.jpeg") },
        { title: "Self-Care Routines That Work", image: card("screenshot-2026-03-01-at-9-58-21-pm-69a4fcef968f5.png") },
        { title: "Rebuilding Your Social Life After 30", image: card("d3f8e6f2-d609-4161-b9f8-b56af736c3ec.jpeg") },
      ],
    },
  },

  "road-and-track": {
    content: {
      breadcrumbs: [{ label: "Features" }, { label: "Driving" }],
      headline: "I Drove the New Porsche 911 GT3 RS on the N\u00fcrburgring. It Changed Me.",
      dek: "The 992.2 GT3 RS isn\u2019t just a faster car. It\u2019s a fundamentally different experience from anything else on sale today.",
      heroImage: img("251217-01-00-z-27my-01-696149a83bf60.jpg"),
      heroImageAlt: "Porsche 911 GT3 RS on the Nürburgring",
      heroImageCredit: "Road & Track",
      author: "Matt Farah",
      publishedDate: "Mar 22, 2026",
      navLinks: ["Features", "Drives", "News", "Motorsport", "Gear", "Culture"],
      sidebarItems: [
        { title: "Every Car Worth Driving in 2026", image: thumb("2024-nissan-z-nismo-149-668d5ce36ae38.jpg"), eyebrow: "Drives" },
        { title: "Why the Manual Transmission Is Having a Revival", image: thumb("311612c5-94a7-4874-b788-f60d39a244c0.jpg"), eyebrow: "Culture" },
        { title: "The 10 Best Driving Roads in America", image: thumb("88841361-054e-412e-a300-a43fec380de0.jpg"), eyebrow: "Features" },
        { title: "The New BMW M3 CS: Better Than the M4?", image: thumb("2025-gmc-yukon-denali-102-6852cef15027e.jpg"), eyebrow: "Drives" },
      ],
      body: (
        <>
          <p>I&rsquo;ve driven a lot of fast cars. I&rsquo;ve been lucky enough to lap the N&uuml;rburgring in everything from a Miata to a McLaren. But nothing&mdash;nothing&mdash;prepared me for what the 2026 Porsche 911 GT3 RS does on the Nordschleife.</p>
          <PullQuote>The GT3 RS doesn&rsquo;t feel like a road car on a track. It feels like a race car that happens to be street legal.</PullQuote>
          <ArticleSubheading>The Numbers Don&rsquo;t Tell the Story</ArticleSubheading>
          <p>On paper, the updates seem incremental: 525 hp (up from 518), a revised DRS-style rear wing, and recalibrated active suspension. But on the N&uuml;rburgring, those changes compound into something transcendent. The car rotates into corners with telepathic precision.</p>
          <ArticleInlineImage src={img("2024-nissan-z-nismo-149-668d5ce36ae38.jpg")} alt="Sports car on track" caption="The GT3 RS's active aero system adjusts the rear wing in real time." credit="Road & Track" />
        </>
      ),
      relatedArticles: [
        { title: "Every Car Worth Driving in 2026", image: card("2024-nissan-z-nismo-149-668d5ce36ae38.jpg") },
        { title: "Manual Transmission Revival", image: card("311612c5-94a7-4874-b788-f60d39a244c0.jpg") },
        { title: "10 Best Driving Roads in America", image: card("88841361-054e-412e-a300-a43fec380de0.jpg") },
        { title: "New BMW M3 CS: Better Than the M4?", image: card("2025-gmc-yukon-denali-102-6852cef15027e.jpg") },
      ],
    },
  },

  "runners-world": {
    content: {
      breadcrumbs: [{ label: "Training" }, { label: "Marathon" }],
      headline: "The 16-Week Marathon Plan That Got Me to a 3:15 Finish",
      dek: "Our running editor breaks down the training program, nutrition strategy, and mental tricks that made the difference.",
      heroImage: img("hlh050125fearunning-027-6807f9d90c2fd.jpg"),
      heroImageAlt: "Runner crossing finish line",
      heroImageCredit: "Runner's World",
      author: "Jeff Dengate",
      publishedDate: "Mar 20, 2026",
      navLinks: ["Training", "Gear", "Nutrition", "Health", "News", "Races"],
      sidebarItems: [
        { title: "The Best Running Shoes of 2026", image: thumb("mh-4-30-pickleball-shoes-66310fa1e2d1b.jpg"), eyebrow: "Gear" },
        { title: "How to Prevent Runner's Knee", image: thumb("best-adjustable-dumbbells-for-men-69090dfb172e0.jpg"), eyebrow: "Health" },
        { title: "The Perfect Pre-Run Fueling Strategy", image: thumb("best-cold-plunge-for-men-68249d19bf84f.jpg"), eyebrow: "Nutrition" },
      ],
      body: (
        <>
          <p>I&rsquo;ve been running for 15 years and have completed 12 marathons. But until last fall, I&rsquo;d never broken 3:20. After years of plateauing, I decided to completely overhaul my approach. The result: a 3:15:42 at the Chicago Marathon.</p>
          <PullQuote>The biggest mistake runners make is running too fast on easy days and too slow on hard days. Polarize your training.</PullQuote>
          <ArticleSubheading>The 80/20 Approach</ArticleSubheading>
          <p>The core philosophy is simple: 80 percent of your weekly mileage should be at an easy, conversational pace. The remaining 20 percent should be genuinely hard&mdash;tempo runs, intervals, and race-pace efforts. Most amateur runners do the opposite.</p>
          <ArticleInlineImage src={img("maingaining-landingp-6949bb976a6bf.jpg")} alt="Marathon training" caption="Polarized training means easy days should feel almost too easy." credit="Runner's World" />
        </>
      ),
      relatedArticles: [
        { title: "Best Running Shoes of 2026", image: card("mh-4-30-pickleball-shoes-66310fa1e2d1b.jpg") },
        { title: "How to Prevent Runner's Knee", image: card("best-adjustable-dumbbells-for-men-69090dfb172e0.jpg") },
        { title: "Perfect Pre-Run Fueling Strategy", image: card("best-cold-plunge-for-men-68249d19bf84f.jpg") },
        { title: "Couch to 5K: The Complete Guide", image: card("amire-madison-wlt-67e6d8f4bf9f2.jpg") },
      ],
    },
  },

  seventeen: {
    content: {
      breadcrumbs: [{ label: "Entertainment" }, { label: "Music" }],
      headline: "Olivia Rodrigo\u2019s Most Iconic Outfits of All Time, Ranked",
      dek: "From Sour-era butterfly tops to her GUTS world tour wardrobe, here\u2019s every look that cemented her as a style icon.",
      heroImage: img("81c31f6f-6638-4e0f-8465-6971305ed9e0.jpg", "crop=0.6666xw:1xh;center,top&resize=1200:*"),
      heroImageAlt: "Olivia Rodrigo fashion",
      heroImageCredit: "Getty Images",
      author: "Leah Campano",
      publishedDate: "Mar 22, 2026",
      navLinks: ["Entertainment", "Beauty", "Fashion", "Love", "Prom", "College"],
      sidebarItems: [
        { title: "The Best Prom Dresses Under $100", image: thumb("5e6d4136-cb47-4d1b-82fe-a2b289f6595b.jpeg"), eyebrow: "Prom" },
        { title: "How to Do the Clean Girl Makeup Look", image: thumb("726e4735-1f3b-4329-a2db-a35c44439c5b.jpeg"), eyebrow: "Beauty" },
        { title: "The Cutest Dorm Room Ideas for 2026", image: thumb("f4eb21d0-0fc4-494d-ac4c-13b6eebbac5f.jpg"), eyebrow: "College" },
      ],
      body: (
        <>
          <p>Olivia Rodrigo didn&rsquo;t just change pop music&mdash;she changed how a generation thinks about personal style. From her early Disney days to sold-out arena tours, Rodrigo&rsquo;s fashion evolution has been as compelling as her discography.</p>
          <PullQuote>Olivia&rsquo;s style secret? She makes everything look effortless, even when it&rsquo;s clearly not.</PullQuote>
          <ArticleSubheading>The GUTS Era</ArticleSubheading>
          <p>If Sour was about heartbreak, GUTS was about reclaiming power&mdash;and Rodrigo&rsquo;s wardrobe reflected that shift. Think: leather, metallics, chunky platforms, and a fearless approach to color that left the all-black phase firmly in the rearview mirror.</p>
          <ArticleInlineImage src={img("f4eb21d0-0fc4-494d-ac4c-13b6eebbac5f.jpg")} alt="Music style" caption="The GUTS era marked a turning point in Rodrigo's fashion confidence." credit="Getty Images" />
        </>
      ),
      relatedArticles: [
        { title: "Best Prom Dresses Under $100", image: card("5e6d4136-cb47-4d1b-82fe-a2b289f6595b.jpeg") },
        { title: "The Clean Girl Makeup Look", image: card("726e4735-1f3b-4329-a2db-a35c44439c5b.jpeg") },
        { title: "Cutest Dorm Room Ideas for 2026", image: card("f4eb21d0-0fc4-494d-ac4c-13b6eebbac5f.jpg") },
        { title: "Best Summer Concerts 2026", image: card("d3f8e6f2-d609-4161-b9f8-b56af736c3ec.jpeg") },
      ],
    },
  },

  "the-pioneer-woman": {
    content: {
      breadcrumbs: [{ label: "Cooking" }, { label: "Family Dinners" }],
      headline: "Ree\u2019s 20-Minute Sheet Pan Dinners for Busy Weeknights",
      dek: "These no-fuss recipes use one pan, simple ingredients, and just 20 minutes of active cooking time.",
      heroImage: img("brie-asparagus-and-prosciutto-stuffed-chicken-index-67f02e15ac634.jpg"),
      heroImageAlt: "Sheet pan dinner",
      heroImageCredit: "The Pioneer Woman",
      author: "Ree Drummond",
      publishedDate: "Mar 21, 2026",
      navLinks: ["Cooking", "Home", "Style", "Entertainment", "Holidays", "Shopping"],
      sidebarItems: [
        { title: "The Best Slow Cooker Recipes for Spring", image: thumb("230927-delish-potato-soup-005-ab-hi-res-index-6529d0d908cb1.jpg"), eyebrow: "Cooking" },
        { title: "Ree's Guide to Easter Brunch", image: thumb("beef-wellington-index-65149c4448c77.jpg"), eyebrow: "Holidays" },
        { title: "The Coziest Throw Blankets for Movie Night", image: thumb("baked-feta-frittata-index-67d0a3bc32a6a.jpg"), eyebrow: "Home" },
      ],
      body: (
        <>
          <p>I know how it goes: you get home from a long day, the kids are hungry, and the last thing you want to do is spend an hour in the kitchen. That&rsquo;s why I&rsquo;ve been perfecting these 20-minute sheet pan dinners. One pan, minimal prep, maximum flavor.</p>
          <PullQuote>The key to a great weeknight dinner isn&rsquo;t a fancy recipe. It&rsquo;s a hot oven and good seasoning.</PullQuote>
          <ArticleSubheading>Sheet Pan Fajitas</ArticleSubheading>
          <p>Slice up some peppers and onions, season your chicken thighs with cumin, chili powder, and a squeeze of lime, and let the oven do the work. Serve with warm tortillas and all the toppings.</p>
          <ArticleInlineImage src={img("beet-reuben-sandwich-index-web-3917-del029926-69a9f90c9b041.jpg")} alt="Sheet pan cooking" caption="Sheet pan meals mean fewer dishes and more time with family." credit="The Pioneer Woman" />
        </>
      ),
      relatedArticles: [
        { title: "Best Slow Cooker Recipes for Spring", image: card("230927-delish-potato-soup-005-ab-hi-res-index-6529d0d908cb1.jpg") },
        { title: "Ree's Guide to Easter Brunch", image: card("beef-wellington-index-65149c4448c77.jpg") },
        { title: "Coziest Throw Blankets for Movie Night", image: card("baked-feta-frittata-index-67d0a3bc32a6a.jpg") },
        { title: "Best Cast Iron Skillets of 2026", image: card("baileys-chocolate-coffee-cake-index-67b506739ebd0.jpg") },
      ],
    },
  },

  "town-and-country": {
    content: {
      breadcrumbs: [{ label: "Society" }, { label: "Royals" }],
      headline: "Inside the Quiet Power Shift at the British Monarchy",
      dek: "As King Charles scales back public duties, Prince William is reshaping the institution in his own image\u2014and not everyone is happy about it.",
      heroImage: img("0309-chanel-00-69af6befda5d5.jpg"),
      heroImageAlt: "British royalty",
      heroImageCredit: "Town & Country / Getty",
      author: "Sam Dangremond",
      publishedDate: "Mar 22, 2026",
      navLinks: ["Society", "Style", "Leisure", "Real Estate", "Travel", "Weddings"],
      sidebarItems: [
        { title: "The Most Expensive Homes Sold in 2026", image: thumb("09072022-galeana-rosewood-007-66e07dfeeb0ce.jpg"), eyebrow: "Real Estate" },
        { title: "A Guide to the Best Private Clubs in New York", image: thumb("300e1b6e-b588-45fd-97a5-ca451c9683f0.jpg"), eyebrow: "Society" },
        { title: "The Chicest Spring Getaways for 2026", image: thumb("3-living2-695d7a6a21c70.jpg"), eyebrow: "Travel" },
      ],
      body: (
        <>
          <p>The transition was supposed to be gradual. When King Charles III ascended to the throne in 2022, the plan was a long, steady handover of responsibilities to Prince William over the course of a decade. But recent events have accelerated the timeline.</p>
          <PullQuote>William isn&rsquo;t trying to modernize the monarchy. He&rsquo;s trying to make it relevant&mdash;and there&rsquo;s a difference.</PullQuote>
          <ArticleSubheading>A Different Kind of Royal</ArticleSubheading>
          <p>Where his father favored formal engagements and environmental causes, William has focused on mental health, technology, and connecting with younger Britons through social media and informal public appearances.</p>
          <ArticleInlineImage src={img("0306-pfwss-00-69ab3d4488cd8.jpg")} alt="Royal event" caption="The Prince of Wales's public engagements have taken on a more informal tone." credit="Town & Country" />
        </>
      ),
      relatedArticles: [
        { title: "Most Expensive Homes Sold in 2026", image: card("09072022-galeana-rosewood-007-66e07dfeeb0ce.jpg") },
        { title: "Best Private Clubs in New York", image: card("300e1b6e-b588-45fd-97a5-ca451c9683f0.jpg") },
        { title: "Chicest Spring Getaways for 2026", image: card("3-living2-695d7a6a21c70.jpg") },
        { title: "Inside the Royal Wedding of the Year", image: card("449d9d5e-e056-422a-8ed4-cce19b21f896.jpg") },
      ],
    },
  },

  veranda: {
    content: {
      breadcrumbs: [{ label: "Decorating" }, { label: "House Tours" }],
      headline: "A Savannah Garden House That Feels Like Stepping Back in Time",
      dek: "Landscape architect Mario Nievera transformed a neglected Savannah property into a lush, romantic retreat anchored by its extraordinary gardens.",
      heroImage: img("alabama-river-cottage-home-tour-primary-bath-bathtub-66e8ab4f39d87.jpg"),
      heroImageAlt: "Savannah garden house",
      heroImageCredit: "Veranda / William Abranowicz",
      author: "Ellen McGauley",
      publishedDate: "Mar 21, 2026",
      navLinks: ["Decorating", "Gardening", "Travel", "Entertaining", "Shopping", "Culture"],
      sidebarItems: [
        { title: "The Best Garden Furniture for Every Style", image: thumb("bailey-mccarthy-texas-farmhouse-exterior-1676684039.jpg"), eyebrow: "Garden" },
        { title: "A Nantucket Cottage With Effortless Charm", image: thumb("bathroom-decor-ideas-gallery-wall-over-tub-6605e8bca46f5.jpeg"), eyebrow: "House Tours" },
        { title: "The Most Beautiful Tablescapes of Spring", image: thumb("before-after-6595cf8348c46.jpg"), eyebrow: "Entertaining" },
      ],
      body: (
        <>
          <p>When Mario Nievera first visited this Savannah property, he saw past the overgrown boxwoods and crumbling brick paths. &ldquo;The bones were extraordinary,&rdquo; he recalls. &ldquo;Two-hundred-year-old live oaks draped in Spanish moss, a creek running along the property line, and the most beautiful natural light I&rsquo;ve ever seen in a Southern garden.&rdquo;</p>
          <PullQuote>A great garden doesn&rsquo;t fight nature. It has a conversation with it.</PullQuote>
          <ArticleSubheading>The Design Philosophy</ArticleSubheading>
          <p>Nievera&rsquo;s approach was to let the site dictate the design. Pathways follow the natural contours of the land. Planting beds are layered to create depth and year-round interest. And the hardscape&mdash;reclaimed Savannah grey brick&mdash;ties the new work to the property&rsquo;s 19th-century origins.</p>
          <ArticleInlineImage src={img("3188abcc-f748-4273-9624-071a52976c49.jpg")} alt="Garden landscape" caption="Reclaimed Savannah grey brick connects the new gardens to the property's history." credit="William Abranowicz" />
        </>
      ),
      relatedArticles: [
        { title: "Best Garden Furniture for Every Style", image: card("bailey-mccarthy-texas-farmhouse-exterior-1676684039.jpg") },
        { title: "Nantucket Cottage With Effortless Charm", image: card("bathroom-decor-ideas-gallery-wall-over-tub-6605e8bca46f5.jpeg") },
        { title: "Most Beautiful Tablescapes of Spring", image: card("before-after-6595cf8348c46.jpg") },
        { title: "A Charleston Home With History", image: card("bryant-birmingham-home-powder-room-68ed73f832557.jpg") },
      ],
    },
  },

  "womans-day": {
    content: {
      breadcrumbs: [{ label: "Life" }, { label: "Money" }],
      headline: "The 5 Money Habits Every Woman Should Start in Her 40s",
      dek: "Financial advisors say these five moves can make the difference between a comfortable retirement and a stressful one.",
      heroImage: img("663161b6-4f58-4569-a30f-9808e06e4454.jpg"),
      heroImageAlt: "Financial planning",
      heroImageCredit: "Woman's Day / Getty",
      author: "Marisa Cohen",
      publishedDate: "Mar 20, 2026",
      navLinks: ["Life", "Health", "Food", "Home", "Style", "Relationships"],
      sidebarItems: [
        { title: "The Easiest Meal Prep Ideas for Busy Families", image: thumb("brie-asparagus-and-prosciutto-stuffed-chicken-index-67f02e15ac634.jpg"), eyebrow: "Food" },
        { title: "How to Talk to Your Kids About Money", image: thumb("8dbc4234-6098-49c4-86e2-a42fc70a54c4.jpg"), eyebrow: "Parenting" },
        { title: "Spring Cleaning Hacks That Save Time", image: thumb("941e2b83-cd35-4343-a610-9f7d55b62078.jpg"), eyebrow: "Home" },
      ],
      body: (
        <>
          <p>Your 40s are a financial turning point. The decisions you make now&mdash;about saving, investing, and planning&mdash;will have an outsized impact on your financial security for decades to come. The good news? It&rsquo;s not too late to start, and the steps are simpler than you think.</p>
          <PullQuote>The best time to start planning for retirement was 20 years ago. The second best time is today.</PullQuote>
          <ArticleSubheading>1. Max Out Your 401(k) Catch-Up Contributions</ArticleSubheading>
          <p>Starting at age 50, you can contribute an additional $7,500 per year to your 401(k) on top of the standard $23,500 limit. But financial advisors say you should start maximizing your standard contributions in your 40s to build the habit and the balance.</p>
          <ArticleInlineImage src={img("8d200d0a-0603-4451-90d9-623b7d78475d.jpg")} alt="Financial planning" caption="Small changes in your 40s can compound into significant retirement savings." credit="Woman's Day" />
        </>
      ),
      relatedArticles: [
        { title: "Easiest Meal Prep Ideas for Families", image: card("brie-asparagus-and-prosciutto-stuffed-chicken-index-67f02e15ac634.jpg") },
        { title: "How to Talk to Kids About Money", image: card("8dbc4234-6098-49c4-86e2-a42fc70a54c4.jpg") },
        { title: "Spring Cleaning Hacks That Save Time", image: card("941e2b83-cd35-4343-a610-9f7d55b62078.jpg") },
        { title: "Best Side Hustles for 2026", image: card("92dcee21-67a8-4f7d-a202-f1463aebe735.jpeg") },
      ],
    },
  },

  "womens-health": {
    content: {
      breadcrumbs: [{ label: "Fitness" }, { label: "Strength Training" }],
      headline: "The Beginner\u2019s Guide to Lifting Heavy (Without Getting Hurt)",
      dek: "A certified trainer breaks down exactly how to start strength training safely, build confidence, and see results fast.",
      heroImage: img("hlh050125fearunning-027-6807f9d90c2fd.jpg"),
      heroImageAlt: "Woman strength training",
      heroImageCredit: "Women's Health",
      author: "Jennifer Nied",
      publishedDate: "Mar 21, 2026",
      navLinks: ["Fitness", "Health", "Food", "Beauty", "Life", "Gear"],
      sidebarItems: [
        { title: "The Best Sports Bras for Every Cup Size", image: thumb("mh-4-30-pickleball-shoes-66310fa1e2d1b.jpg"), eyebrow: "Gear" },
        { title: "How Many Calories Do You Actually Need?", image: thumb("best-adjustable-dumbbells-for-men-69090dfb172e0.jpg"), eyebrow: "Nutrition" },
        { title: "The Best At-Home Workout Equipment", image: thumb("best-cold-plunge-for-men-68249d19bf84f.jpg"), eyebrow: "Gear" },
      ],
      body: (
        <>
          <p>If you&rsquo;ve been curious about strength training but intimidated by the weight room, you&rsquo;re not alone. A recent survey found that 65% of women say they avoid free weights because they don&rsquo;t know where to start. Here&rsquo;s your permission slip: you belong there.</p>
          <PullQuote>Lifting heavy won&rsquo;t make you bulky. It will make you strong, confident, and resilient.</PullQuote>
          <ArticleSubheading>Start With the Big Five</ArticleSubheading>
          <p>Every beginner strength program should be built around five fundamental movement patterns: squat, hinge, push, pull, and carry. These compound movements work multiple muscle groups at once, giving you the most efficient workout possible.</p>
          <ArticleInlineImage src={img("dsc01737-1-jpg-68539980992c9.jpg")} alt="Strength training" caption="Compound movements like squats and deadlifts are the foundation of any strength program." credit="Women's Health" />
          <ArticleSubheading>How Much Weight Should You Start With?</ArticleSubheading>
          <p>The rule of thumb: choose a weight that feels challenging for the last 2&ndash;3 reps of a 10-rep set, but doesn&rsquo;t compromise your form. If you can breeze through all 10 reps, go heavier. If your form breaks down before rep 8, go lighter.</p>
        </>
      ),
      relatedArticles: [
        { title: "Best Sports Bras for Every Cup Size", image: card("mh-4-30-pickleball-shoes-66310fa1e2d1b.jpg") },
        { title: "How Many Calories Do You Need?", image: card("best-adjustable-dumbbells-for-men-69090dfb172e0.jpg") },
        { title: "Best At-Home Workout Equipment", image: card("best-cold-plunge-for-men-68249d19bf84f.jpg") },
        { title: "Yoga vs. Pilates: Which Is Better?", image: card("amire-madison-wlt-67e6d8f4bf9f2.jpg") },
      ],
    },
  },

  "white-label": {
    content: {
      breadcrumbs: [{ label: "Design System" }, { label: "Demo" }],
      headline: "Welcome to the Hearst Design System",
      dek: "A multi-brand, token-driven component library powering 29 digital properties from a single codebase.",
      heroImage: img("apple-store-69136389cee08.png"),
      heroImageAlt: "Design system overview",
      heroImageCredit: "Hearst",
      author: "Hearst Digital",
      publishedDate: "Apr 23, 2026",
      navLinks: ["Home", "Components", "Tokens", "Brands", "Guidelines"],
      sidebarItems: [
        { title: "Getting Started With Tokens", image: thumb("arzopa-portable-monitor-0053-6489d98a8d475.jpg"), eyebrow: "Guide" },
        { title: "Brand Theming Overview", image: thumb("audio-technica-sound-burger-turntable-005-698e1418e5406.jpg"), eyebrow: "Architecture" },
      ],
      body: (
        <>
          <p>The Hearst Design System is a shared foundation for building digital experiences across the Hearst portfolio. It provides a consistent set of components, tokens, and patterns that adapt automatically to each brand&rsquo;s visual identity.</p>
          <PullQuote>One codebase. Twenty-nine brands. Zero compromises.</PullQuote>
          <p>This white-label view shows the system&rsquo;s default styling. Switch brands using the toolbar above to see how the same components transform for Cosmopolitan, Car and Driver, Elle, and more.</p>
        </>
      ),
      relatedArticles: [
        { title: "Getting Started With Tokens", image: card("arzopa-portable-monitor-0053-6489d98a8d475.jpg") },
        { title: "Brand Theming Overview", image: card("audio-technica-sound-burger-turntable-005-698e1418e5406.jpg") },
        { title: "Component Architecture", image: card("apple-store-69136389cee08.png") },
        { title: "Contributing Guide", image: card("apple-watch-11-sale-amazon-february-2026-6983a9bee4d7b.png") },
      ],
    },
  },
};
