import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";

/**
 * Seed inventory for the Research Cars demo. Ratings and source URLs are
 * transcribed from current Car and Driver model pages / rankings. Vehicle
 * photography is served from Hearst's image CDN.
 */
type ResearchCarSeed = {
  id: string;
  title: string;
  summary: string;
  sourceUrl: string;
  rating: string;
  image: string;
  bodyStyle?: "SUV" | "Sedan" | "Truck" | "Hatchback" | "Coupe";
  powertrain?: "Gas" | "Hybrid" | "Electric";
  startingMsrp?: number;
};

const seeds: ResearchCarSeed[] = [
  { id: "car-and-driver-research-2026-ram-1500", title: "2026 Ram 1500", rating: "10/10", sourceUrl: "https://www.caranddriver.com/ram/1500-2026", summary: "Car and Driver rates the 2026 Ram 1500 10/10. Open its vehicle overview for the source details.", image: "https://hips.hearstapps.com/hmg-prod/images/2025-ram-1500-big-horn-crew-cab-150-67d9a19742138.jpg?crop=0.885xw%3A0.745xh%3B0.0529xw%2C0.188xh&resize=400%3A%2A", bodyStyle: "Truck", powertrain: "Gas", startingMsrp: 44820 },
  { id: "car-and-driver-research-2026-honda-civic", title: "2026 Honda Civic", rating: "10/10", sourceUrl: "https://www.caranddriver.com/honda/civic-2026", summary: "Car and Driver rates the 2026 Honda Civic 10/10. Open its vehicle overview for the source details.", image: "https://hips.hearstapps.com/hmg-prod/images/2025-honda-civic-hybrid-hatchback-106-698b62819cc26.jpg?crop=0.722xw%3A0.614xh%3B0.148xw%2C0.272xh&resize=400%3A%2A", bodyStyle: "Sedan", powertrain: "Hybrid", startingMsrp: 25990 },
  { id: "car-and-driver-research-2026-toyota-prius", title: "2026 Toyota Prius", rating: "10/10", sourceUrl: "https://www.caranddriver.com/toyota/prius-2026", summary: "Car and Driver rates the 2026 Toyota Prius 10/10. Open its vehicle overview for the source details.", image: "https://hips.hearstapps.com/hmg-prod/images/2025-toyota-prius-xle-fwd-lt-470-68654d4ede4ae.jpg?crop=0.750xw%3A0.632xh%3B0.208xw%2C0.284xh&resize=400%3A%2A", bodyStyle: "Hatchback", powertrain: "Hybrid" },
  { id: "car-and-driver-research-2027-honda-cr-v", title: "2027 Honda CR-V", rating: "10/10", sourceUrl: "https://www.caranddriver.com/honda/cr-v", summary: "Car and Driver rates the 2027 Honda CR-V 10/10. Open its vehicle overview for the source details.", image: "https://hips.hearstapps.com/hmg-prod/images/2023-honda-cr-v-ex-l-awd-103-66295ff8362ee.jpg?crop=0.609xw%3A0.514xh%3B0.200xw%2C0.332xh&resize=400%3A%2A", bodyStyle: "SUV", powertrain: "Gas", startingMsrp: 33070 },
  { id: "car-and-driver-research-2026-mazda-cx-50", title: "2026 Mazda CX-50", rating: "9.5/10", sourceUrl: "https://www.caranddriver.com/mazda/cx-50-2026", summary: "Car and Driver rates the 2026 Mazda CX-50 9.5/10. Open its vehicle overview for the source details.", image: "https://hips.hearstapps.com/hmg-prod/images/2026-mazda-cx-50-meridian-178-693c375f403ca.jpg?crop=0.756xw%3A0.635xh%3B0.236xw%2C0.326xh&resize=400%3A%2A" },
  { id: "car-and-driver-research-2026-ford-bronco-sport", title: "2026 Ford Bronco Sport", rating: "9/10", sourceUrl: "https://www.caranddriver.com/ford/bronco-sport-2026", summary: "Car and Driver rates the 2026 Ford Bronco Sport 9/10. Open its vehicle overview for the source details.", image: "https://hips.hearstapps.com/hmg-prod/images/2025-ford-bronco-sport-130-67f4102ee2bde.jpg?crop=0.877xw%3A0.740xh%3B0.123xw%2C0.238xh&resize=400%3A%2A" },
  { id: "car-and-driver-research-2026-chevrolet-tahoe", title: "2026 Chevrolet Tahoe", rating: "10/10", sourceUrl: "https://www.caranddriver.com/chevrolet/tahoe-2026", summary: "Car and Driver rates the 2026 Chevrolet Tahoe 10/10. Open its vehicle overview for the source details.", image: "https://hips.hearstapps.com/hmg-prod/images/2025-chevrolet-tahoe-103-6878f8075387b.jpg?crop=0.824xw%3A0.695xh%3B0.176xw%2C0.254xh&resize=400%3A%2A" },
  { id: "car-and-driver-research-2026-gmc-yukon", title: "2026 GMC Yukon", rating: "10/10", sourceUrl: "https://www.caranddriver.com/gmc/yukon-yukon-xl-2026", summary: "Car and Driver rates the 2026 GMC Yukon 10/10. Open its vehicle overview for the source details.", image: "https://hips.hearstapps.com/hmg-prod/images/2025-gmc-yukon-denali-104-6852ceea84a0f.jpg?crop=0.735xw%3A0.620xh%3B0.0423xw%2C0.329xh&resize=400%3A%2A" },
  { id: "car-and-driver-research-2026-toyota-land-cruiser", title: "2026 Toyota Land Cruiser", rating: "9.5/10", sourceUrl: "https://www.caranddriver.com/toyota/land-cruiser-2026", summary: "Car and Driver rates the 2026 Toyota Land Cruiser 9.5/10. Open its vehicle overview for the source details.", image: "https://hips.hearstapps.com/hmg-prod/images/976ec484-00a8-4bdc-ad18-b9f86659d8b5.jpg?crop=0.864xw%3A0.729xh%3B0.085xw%2C0.216xh&resize=400%3A%2A" },
  { id: "car-and-driver-research-2027-lucid-air", title: "2027 Lucid Air", rating: "10/10", sourceUrl: "https://www.caranddriver.com/lucid-motors/air", summary: "Car and Driver rates the 2027 Lucid Air 10/10. Open its vehicle overview for the source details.", image: "https://hips.hearstapps.com/hmg-prod/images/2024-lucid-air-pure-rwd-101-6581b07732c3e.jpg?crop=0.561xw%3A0.475xh%3B0.296xw%2C0.405xh&resize=400%3A%2A" },
  { id: "car-and-driver-research-2027-lucid-gravity", title: "2027 Lucid Gravity", rating: "10/10", sourceUrl: "https://www.caranddriver.com/lucid-motors/gravity", summary: "Car and Driver rates the 2027 Lucid Gravity 10/10. Open its vehicle overview for the source details.", image: "https://hips.hearstapps.com/hmg-prod/images/2026-lucid-gravity-dream-edition-exterior-68823bfd4a5f3.jpg?crop=0.798xw%3A0.673xh%3B0.182xw%2C0.207xh&resize=400%3A%2A" },
  { id: "car-and-driver-research-2026-tesla-model-3", title: "2026 Tesla Model 3", rating: "10/10", sourceUrl: "https://www.caranddriver.com/tesla/model-3-2026", summary: "Car and Driver rates the 2026 Tesla Model 3 10/10. Open its vehicle overview for the source details.", image: "https://hips.hearstapps.com/hmg-prod/images/2026-tesla-model-3-standard-120-68e3fb1f4d3ec.jpg?crop=0.792xw%3A0.668xh%3B0.159xw%2C0.221xh&resize=400%3A%2A" },
  { id: "car-and-driver-research-2026-hyundai-ioniq-5", title: "2026 Hyundai Ioniq 5", rating: "9.5/10", sourceUrl: "https://www.caranddriver.com/hyundai/ioniq-5-2026", summary: "Car and Driver rates the 2026 Hyundai Ioniq 5 9.5/10. Open its vehicle overview for the source details.", image: "https://hips.hearstapps.com/hmg-prod/images/2025-hyundai-ioniq5-xrt-961-67ed60da7ecbd.jpg?crop=1xw%3A1xh%3Bcenter%2Ctop&resize=400%3A%2A" },
  { id: "car-and-driver-research-2027-kia-telluride", title: "2027 Kia Telluride", rating: "9.5/10", sourceUrl: "https://www.caranddriver.com/kia/telluride", summary: "Car and Driver rates the 2027 Kia Telluride 9.5/10. Open its vehicle overview for the source details.", image: "https://hips.hearstapps.com/hmg-prod/images/2027-kia-telluride-sx-x-line-158-69a6faa2be33b.jpg?crop=0.646xw%3A0.546xh%3B0.115xw%2C0.337xh&resize=400%3A%2A" },
  { id: "car-and-driver-research-2026-chevrolet-corvette-stingray", title: "2026 Chevrolet Corvette Stingray", rating: "10/10", sourceUrl: "https://www.caranddriver.com/chevrolet/corvette-2026", summary: "Car and Driver rates the 2026 Chevrolet Corvette Stingray 10/10. Open its vehicle overview for the source details.", image: "https://hips.hearstapps.com/hmg-prod/images/2023-chevrolet-corvette-stingray-convertible-3lt-z51-681-1665496990.jpg?crop=0.686xw%3A0.578xh%3B0.268xw%2C0.422xh&resize=400%3A%2A" },
  { id: "car-and-driver-research-2026-toyota-gr-supra", title: "2026 Toyota GR Supra", rating: "9.5/10", sourceUrl: "https://www.caranddriver.com/toyota/supra", summary: "Car and Driver rates the 2026 Toyota GR Supra 9.5/10. Open its vehicle overview for the source details.", image: "https://hips.hearstapps.com/hmg-prod/images/3a29138b-1dea-4e34-bc34-0180b8ab748f.jpg?crop=0.883xw%3A0.745xh%3B0.0552xw%2C0.163xh&resize=400%3A%2A" },
  { id: "car-and-driver-research-2027-honda-accord", title: "2027 Honda Accord", rating: "10/10", sourceUrl: "https://www.caranddriver.com/honda/accord", summary: "Car and Driver rates the 2027 Honda Accord 10/10. Open its vehicle overview for the source details.", image: "https://hips.hearstapps.com/hmg-prod/images/2027-honda-accord-pr-102-6984f975a0c17.jpg?crop=0.781xw%3A0.710xh%3B0.124xw%2C0.290xh&resize=400%3A%2A" },
  { id: "car-and-driver-research-2027-honda-passport", title: "2027 Honda Passport", rating: "10/10", sourceUrl: "https://www.caranddriver.com/honda/passport-2027", summary: "Car and Driver rates the 2027 Honda Passport 10/10. Open its vehicle overview for the source details.", image: "https://hips.hearstapps.com/hmg-prod/images/517b52cf-6fbc-43b3-b2e6-f14fdad83f27.jpg?crop=0.836xw%3A0.705xh%3B0.088xw%2C0.011xh&resize=400%3A%2A" },
  { id: "car-and-driver-research-2027-honda-civic-type-r", title: "2027 Honda Civic Type R", rating: "10/10", sourceUrl: "https://www.caranddriver.com/honda/civic-type-r-2027", summary: "Car and Driver rates the 2027 Honda Civic Type R 10/10. Open its vehicle overview for the source details.", image: "https://hips.hearstapps.com/hmg-prod/images/943db90e-06b8-4d6c-8070-964ad8aab8f1.jpg?crop=1xw%3A0.843xh%3B0xw%2C0.157xh&resize=400%3A%2A" },
  { id: "car-and-driver-research-2027-chevrolet-bolt-ev", title: "2027 Chevrolet Bolt EV", rating: "10/10", sourceUrl: "https://www.caranddriver.com/chevrolet/bolt", summary: "Car and Driver rates the 2027 Chevrolet Bolt EV 10/10. Open its vehicle overview for the source details.", image: "https://hips.hearstapps.com/hmg-prod/images/2e32a156-6c51-4bcc-aad4-3a428f0bd4c3.jpg?crop=0.791xw%3A0.592xh%3B0.0935xw%2C0.230xh&resize=400%3A%2A" },
  { id: "car-and-driver-research-2027-chevrolet-suburban", title: "2027 Chevrolet Suburban", rating: "10/10", sourceUrl: "https://www.caranddriver.com/chevrolet/suburban", summary: "Car and Driver rates the 2027 Chevrolet Suburban 10/10. Open its vehicle overview for the source details.", image: "https://hips.hearstapps.com/hmg-prod/images/2025-chevrolet-suburban-high-country-ah-101-697a59ca904be.jpg?crop=1.00xw%3A0.753xh%3B0%2C0.209xh&resize=400%3A%2A" },
  { id: "car-and-driver-research-2027-mazda-cx-30", title: "2027 Mazda CX-30", rating: "9.5/10", sourceUrl: "https://www.caranddriver.com/mazda/cx-30", summary: "Car and Driver rates the 2027 Mazda CX-30 9.5/10. Open its vehicle overview for the source details.", image: "https://hips.hearstapps.com/hmg-prod/images/2026-mazda-cx-30-s-aire-edition-135-69864afcd35c5.jpg?crop=1.00xw%3A0.753xh%3B0%2C0.247xh&resize=400%3A%2A" },
  { id: "car-and-driver-research-2026-hyundai-palisade", title: "2026 Hyundai Palisade", rating: "9/10", sourceUrl: "https://www.caranddriver.com/hyundai/palisade-2026", summary: "Car and Driver rates the 2026 Hyundai Palisade 9/10. Open its vehicle overview for the source details.", image: "https://hips.hearstapps.com/hmg-prod/images/2026-hyundai-palisade-xrt-pro-pr-153-67fec72a91c5f.jpg?crop=1.00xw%3A0.752xh%3B0%2C0.168xh&resize=400%3A%2A" },
  { id: "car-and-driver-research-2027-genesis-gv80", title: "2027 Genesis GV80", rating: "9.5/10", sourceUrl: "https://www.caranddriver.com/genesis/gv80", summary: "Car and Driver rates the 2027 Genesis GV80 9.5/10. Open its vehicle overview for the source details.", image: "https://hips.hearstapps.com/hmg-prod/images/2025-genesis-gv80-3p5t-awd-prestige-184-66ccc284a93d8.jpg?crop=1xw%3A1xh%3Bcenter%2Ctop&resize=400%3A%2A" },
  { id: "car-and-driver-research-2027-volvo-xc90", title: "2027 Volvo XC90", rating: "9.5/10", sourceUrl: "https://www.caranddriver.com/volvo/xc90", summary: "Car and Driver rates the 2027 Volvo XC90 9.5/10. Open its vehicle overview for the source details.", image: "https://hips.hearstapps.com/hmg-prod/images/2025-volvo-xc90-140-67f549bd85ab2.jpg?crop=1xw%3A1xh%3Bcenter%2Ctop&resize=400%3A%2A" },
  { id: "car-and-driver-research-2027-genesis-gv60", title: "2027 Genesis GV60", rating: "9/10", sourceUrl: "https://www.caranddriver.com/genesis/gv60", summary: "Car and Driver rates the 2027 Genesis GV60 9/10. Open its vehicle overview for the source details.", image: "https://hips.hearstapps.com/hmg-prod/images/578d5384-60a0-4d53-9a5a-a948ef8e20fa.jpg?crop=0.833xw%3A0.625xh%3B0.139xw%2C0.311xh&resize=400%3A%2A" },
  // These four began as live-feed stories and rotated out of the daily refresh;
  // they keep their original ids so saved items and ratings still resolve.
  { id: "car-and-driver-kia-ev9-2027", title: "2027 Kia EV9", rating: "10/10", sourceUrl: "https://www.caranddriver.com/kia/ev9-2027", summary: "Car and Driver rates the 2027 Kia EV9 10/10. Open its vehicle overview for the source details.", image: "https://hips.hearstapps.com/hmg-prod/images/a05053e8-2911-4546-9a9e-398b585c0162.jpg" },
  { id: "car-and-driver-ineos-grenadier-quartermaster-2027", title: "2027 Ineos Grenadier Quartermaster", rating: "7.5/10", sourceUrl: "https://www.caranddriver.com/ineos/grenadier-quartermaster-2027", summary: "Car and Driver rates the 2027 Ineos Grenadier Quartermaster 7.5/10. Open its vehicle overview for the source details.", image: "https://hips.hearstapps.com/hmg-prod/images/2025-ineos-grenadier-quartermaster-117-68c05dfdafeae.jpg" },
  { id: "car-and-driver-bmw-3-series", title: "2027 BMW 3-Series", rating: "9.5/10", sourceUrl: "https://www.caranddriver.com/bmw/3-series", summary: "Car and Driver rates the 2027 BMW 3-Series 9.5/10. Open its vehicle overview for the source details.", image: "https://hips.hearstapps.com/hmg-prod/images/f7f09290-27ff-4d9d-a51e-dcb6a1f8c792.jpg" },
  { id: "car-and-driver-nissan-rogue-hybrid", title: "2027 Nissan Rogue Hybrid", rating: "8.5/10", sourceUrl: "https://www.caranddriver.com/nissan/rogue-hybrid", summary: "Car and Driver rates the 2027 Nissan Rogue Hybrid 8.5/10. Open its vehicle overview for the source details.", image: "https://hips.hearstapps.com/hmg-prod/images/de8ddd89-99df-402a-b7df-b15af8ae6418.jpg" },
];

export const hearstAutoResearchCarCatalog: LifestyleRiverStory[] = seeds.map(({ id, title, summary, sourceUrl, image }, index) => ({
  id,
  title,
  summary,
  sourceUrl,
  brand: "Car and Driver",
  brandSlug: "car-and-driver",
  topic: "Research Cars",
  image,
  imageCredit: "Car and Driver",
  byline: "Car and Driver",
  readTime: "Vehicle overview",
  publishedAt: "2026-10-31T12:00:00.000Z",
  popularity: 90 - index,
  signal: "Editor Pick" as const,
  tags: ["research cars", "car and driver", ...title.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean)],
  age: index,
} satisfies LifestyleRiverStory));

export const hearstAutoResearchCarRatings = Object.fromEntries(
  seeds.map(({ id, rating }) => [id, rating]),
);

export type ResearchCarFacet = {
  make: string;
  bodyStyle: ResearchCarSeed["bodyStyle"];
  powertrains: NonNullable<ResearchCarSeed["powertrain"]>[];
  startingMsrp?: number;
  rating?: number;
};

const bodyStyles: Record<string, NonNullable<ResearchCarFacet["bodyStyle"]>> = {
  "ram-1500": "Truck",
  "civic": "Sedan",
  "prius": "Hatchback",
  "cr-v": "SUV",
  "cx-50": "SUV",
  "bronco-sport": "SUV",
  "tahoe": "SUV",
  "yukon": "SUV",
  "land-cruiser": "SUV",
  "lucid-air": "Sedan",
  "lucid-gravity": "SUV",
  "model-3": "Sedan",
  "ioniq-5": "SUV",
  "telluride": "SUV",
  "corvette": "Coupe",
  "supra": "Coupe",
  "accord": "Sedan",
  "passport": "SUV",
  "civic-type-r": "Hatchback",
  "bolt-ev": "Hatchback",
  "suburban": "SUV",
  "cx-30": "SUV",
  "palisade": "SUV",
  "gv80": "SUV",
  "xc90": "SUV",
  "gv60": "SUV",
  "ev9": "SUV",
  "rogue": "SUV",
  "grenadier": "Truck",
  "3-series": "Sedan",
};

const electricModels = ["lucid-air", "lucid-gravity", "model-3", "ioniq-5", "bolt-ev", "gv60", "ev9"];
const hybridModels = ["prius", "civic", "cr-v", "rogue-hybrid"];

export function getResearchCarFacet(story: Pick<LifestyleRiverStory, "id" | "title">): ResearchCarFacet {
  const seed = seeds.find((item) => item.id === story.id);
  const identity = story.title.replace(/^(?:19|20)\d{2}\s+/, "");
  const make = identity.startsWith("Ineos ") ? "Ineos" : identity.split(/\s+/)[0] ?? "";
  const modelKey = seed?.id.replace("car-and-driver-research-", "")
    ?? identity.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const bodyStyle = seed?.bodyStyle ?? Object.entries(bodyStyles)
    .sort(([left], [right]) => right.length - left.length)
    .find(([key]) => modelKey.includes(key))?.[1];
  const powertrains: NonNullable<ResearchCarSeed["powertrain"]>[] = electricModels.some((key) => modelKey.includes(key))
    ? ["Electric"]
    : modelKey.includes("prius") || modelKey.includes("rogue-hybrid") || modelKey.includes("civic-type-r")
      ? ["Hybrid"]
      : hybridModels.some((key) => modelKey.includes(key))
        ? ["Gas", "Hybrid"]
        : [seed?.powertrain ?? "Gas"];
  const knownStartingPrices: Record<string, number> = {
    "car-and-driver-research-2026-ram-1500": 44820,
    "car-and-driver-research-2026-honda-civic": 25990,
    "car-and-driver-research-2027-honda-cr-v": 33070,
    "car-and-driver-kia-ev9-2027": 56635,
  };
  const otherVerifiedRatings: Record<string, string> = {
    "car-and-driver-kia-ev9-2027": "10/10",
    "car-and-driver-ineos-grenadier-quartermaster-2027": "7.5/10",
    "car-and-driver-bmw-3-series": "9.5/10",
    "car-and-driver-nissan-rogue-hybrid": "8.5/10",
  };
  const score = Number.parseFloat(hearstAutoResearchCarRatings[story.id] ?? otherVerifiedRatings[story.id] ?? "");
  return {
    make,
    bodyStyle,
    powertrains,
    startingMsrp: knownStartingPrices[story.id] ?? seed?.startingMsrp,
    rating: Number.isFinite(score) ? score : undefined,
  };
}
