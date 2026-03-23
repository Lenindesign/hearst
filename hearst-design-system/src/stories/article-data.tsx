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
};
