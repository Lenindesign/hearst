import React from "react";
import { type ArticlePageContent, type SidebarItem } from "@/components/article-page";
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
