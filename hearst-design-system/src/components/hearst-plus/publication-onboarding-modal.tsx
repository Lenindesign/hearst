"use client";

/* eslint-disable @next/next/no-img-element -- Decorative onboarding artwork uses external Fluent Emoji library assets. */

import React from "react";
import { createPortal } from "react-dom";
import { BrandLogo } from "@/components/brand-logo";
import { fluentEmojiPngForIcon } from "@/components/hearst-plus/fluent-emoji-art";
import type { HearstOnboardingResult } from "@/components/hearst-plus/onboarding-modal";
import { Button } from "@/components/ui/button";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  MapPin,
  X,
} from "@/components/ui/icons";
import { useBodyPortalTarget, useModalIsolation } from "@/components/ui/use-modal-isolation";
import { cn } from "@/lib/utils";

export const publicationOnboardingBrandSlugs = [
  "cosmopolitan",
  "country-living",
  "car-and-driver",
  "womens-health",
  "oprah-daily",
  "house-beautiful",
  "good-housekeeping",
  "pioneer-woman",
  "prevention",
  "redbook",
  "seventeen",
  "womans-day",
  "autoweek",
  "bring-a-trailer",
  "hot-rod",
  "road-and-track",
  "elle",
  "elle-decor",
  "esquire",
  "harpers-bazaar",
  "town-and-country",
  "veranda",
  "best-products",
  "bicycling",
  "mens-health",
  "popular-mechanics",
  "runners-world",
] as const;

export type PublicationOnboardingBrandSlug = typeof publicationOnboardingBrandSlugs[number];

export const publicationOnboardingStorageKeyPrefix = "hearst-publication-onboarding";

const publicationIconColors = {
  cosmopolitan: "#D70000",
  "country-living": "#0A5C80",
  "car-and-driver": "#1B5F8A",
  "womens-health": "#1D4ED8",
  "oprah-daily": "#E61957",
  "house-beautiful": "#242D39",
  "good-housekeeping": "#198294",
  "pioneer-woman": "#8B376C",
  prevention: "#168C91",
  redbook: "#D30C4F",
  seventeen: "#C9008D",
  "womans-day": "#683D85",
  autoweek: "#A66000",
  "bring-a-trailer": "#D40013",
  "hot-rod": "#C11B17",
  "road-and-track": "#434343",
  elle: "#111827",
  "elle-decor": "#3777BC",
  esquire: "#D42D25",
  "harpers-bazaar": "#000000",
  "town-and-country": "#9A0500",
  veranda: "#7B5F31",
  "best-products": "#1C1C9B",
  bicycling: "#067EA7",
  "mens-health": "#D2232E",
  "popular-mechanics": "#1C6A65",
  "runners-world": "#07858A",
} as const satisfies Record<PublicationOnboardingBrandSlug, string>;
const cosmoIcon = publicationIconColors.cosmopolitan;
const countryIcon = publicationIconColors["country-living"];
const carDriverIcon = publicationIconColors["car-and-driver"];
const womensHealthIcon = publicationIconColors["womens-health"];
const oprahIcon = publicationIconColors["oprah-daily"];
const houseBeautifulIcon = publicationIconColors["house-beautiful"];
const goodHousekeepingIcon = publicationIconColors["good-housekeeping"];
const pioneerWomanIcon = publicationIconColors["pioneer-woman"];
const preventionIcon = publicationIconColors.prevention;
const redbookIcon = publicationIconColors.redbook;
const seventeenIcon = publicationIconColors.seventeen;
const womansDayIcon = publicationIconColors["womans-day"];
const autoweekIcon = publicationIconColors.autoweek;
const bringATrailerIcon = publicationIconColors["bring-a-trailer"];
const hotRodIcon = publicationIconColors["hot-rod"];
const roadAndTrackIcon = publicationIconColors["road-and-track"];
const elleIcon = publicationIconColors.elle;
const elleDecorIcon = publicationIconColors["elle-decor"];
const esquireIcon = publicationIconColors.esquire;
const harpersBazaarIcon = publicationIconColors["harpers-bazaar"];
const townAndCountryIcon = publicationIconColors["town-and-country"];
const verandaIcon = publicationIconColors.veranda;
const bestProductsIcon = publicationIconColors["best-products"];
const bicyclingIcon = publicationIconColors.bicycling;
const mensHealthIcon = publicationIconColors["mens-health"];
const popularMechanicsIcon = publicationIconColors["popular-mechanics"];
const runnersWorldIcon = publicationIconColors["runners-world"];

type PublicationPathId = "first" | "second" | "third";

type PublicationOnboardingAnswers = {
  name: string;
  location: string;
  path: PublicationPathId | null;
  favorites: string[];
  discoveries: string[];
  newsletters: string[];
};

type PublicationPath = {
  id: PublicationPathId;
  title: string;
  description: string;
  illustrationSrc: string;
};

type PublicationChoiceOption = {
  label: string;
  illustrationSrc: string;
};

type PublicationNewsletterOption = {
  id: string;
  title: string;
  description: string;
  illustrationSrc: string;
};

type PublicationOnboardingConfig = {
  slug: PublicationOnboardingBrandSlug;
  brandName: string;
  cardTitle: string;
  primary: string;
  secondary: string;
  ink: string;
  muted: string;
  line: string;
  surface: string;
  pale: string;
  headlineFont: string;
  bodyFont?: string;
  introIllustrationSrc: string;
  stepIllustrationSrc: string;
  cardIllustrationSrc: string;
  intro: string;
  stepLabels: {
    first: string;
    second: string;
    third: string;
    fourth: string;
  };
  stepDescriptions: {
    first: string;
    second: string;
    third: string;
    fourth: string;
  };
  paths: readonly PublicationPath[];
  favorites: readonly PublicationChoiceOption[];
  discoveries: readonly PublicationChoiceOption[];
  newsletters: readonly PublicationNewsletterOption[];
  baseTags: readonly string[];
  fallbackLocation: string;
  fallbackPriority: string;
};

const iconifyHuge = (name: string, color: string) => {
  void color;
  return fluentEmojiPngForIcon(name);
};

const choice = (label: string, iconName: string, color: string): PublicationChoiceOption => ({
  label,
  illustrationSrc: iconifyHuge(iconName, color),
});

const newsletter = (
  id: string,
  title: string,
  description: string,
  iconName: string,
  color: string,
): PublicationNewsletterOption => ({
  id,
  title,
  description,
  illustrationSrc: iconifyHuge(iconName, color),
});

type PublicationConfigInput = Omit<
  PublicationOnboardingConfig,
  | "line"
  | "muted"
  | "paths"
  | "favorites"
  | "discoveries"
  | "newsletters"
  | "stepLabels"
  | "stepDescriptions"
> & {
  line?: string;
  muted?: string;
  stepLabels: readonly [string, string, string, string];
  stepDescriptions: readonly [string, string, string, string];
  paths: readonly [PublicationPathId, string, string, string][];
  favorites: readonly [string, string][];
  discoveries: readonly [string, string][];
  newsletters: readonly [string, string, string, string][];
};

function publicationConfig(input: PublicationConfigInput): PublicationOnboardingConfig {
  const [firstLabel, secondLabel, thirdLabel, fourthLabel] = input.stepLabels;
  const [firstDescription, secondDescription, thirdDescription, fourthDescription] =
    input.stepDescriptions;

  return {
    ...input,
    muted: input.muted ?? "#5F6672",
    line: input.line ?? `${input.primary}33`,
    stepLabels: {
      first: firstLabel,
      second: secondLabel,
      third: thirdLabel,
      fourth: fourthLabel,
    },
    stepDescriptions: {
      first: firstDescription,
      second: secondDescription,
      third: thirdDescription,
      fourth: fourthDescription,
    },
    paths: input.paths.map(([id, title, description, iconName]) => ({
      id,
      title,
      description,
      illustrationSrc: iconifyHuge(iconName, input.primary),
    })),
    favorites: input.favorites.map(([label, iconName]) =>
      choice(label, iconName, input.primary),
    ),
    discoveries: input.discoveries.map(([label, iconName]) =>
      choice(label, iconName, input.primary),
    ),
    newsletters: input.newsletters.map(([id, title, description, iconName]) =>
      newsletter(id, title, description, iconName, input.primary),
    ),
  };
}

type PublicationOnboardingModalProps = {
  open: boolean;
  brandSlug: PublicationOnboardingBrandSlug;
  onClose: () => void;
  onComplete: (result: HearstOnboardingResult) => void;
  onCreateProfile: (result: HearstOnboardingResult) => void;
  onSignIn: () => void;
};

export const publicationOnboardingConfigs: Record<
  PublicationOnboardingBrandSlug,
  PublicationOnboardingConfig
> = {
  cosmopolitan: {
    slug: "cosmopolitan",
    brandName: "Cosmopolitan",
    cardTitle: "Cosmo Pass",
    primary: cosmoIcon,
    secondary: "#F6D3E5",
    ink: "#171014",
    muted: "#6B4D5C",
    line: "#E8BED3",
    surface: "#FFF7FB",
    pale: "#FCE7F1",
    headlineFont: '"Chronicle Display", Georgia, serif',
    bodyFont: '"Basis Grotesque Pro", system-ui, sans-serif',
    introIllustrationSrc: iconifyHuge("sparkles", cosmoIcon),
    stepIllustrationSrc: iconifyHuge("in-love", cosmoIcon),
    cardIllustrationSrc: iconifyHuge("heart-check", cosmoIcon),
    intro: "Tune your edition for the pop culture, style, beauty, and relationship reads you actually want.",
    stepLabels: {
      first: "Set your vibe",
      second: "Pick your Cosmo mode",
      third: "Choose your obsessions",
      fourth: "Pick your newsletters",
    },
    stepDescriptions: {
      first: "A little context helps the feed feel more like yours.",
      second: "Choose the lane you want Cosmo to lead with today.",
      third: "Choose what you already love and what you want Cosmo to find for you.",
      fourth: "Pick the Cosmo newsletters you want in your edition.",
    },
    paths: [
      {
        id: "first",
        title: "Style energy",
        description: "Outfits, beauty, shopping, and getting-ready ideas.",
        illustrationSrc: iconifyHuge("shopping-bag-favorite", cosmoIcon),
      },
      {
        id: "second",
        title: "Culture radar",
        description: "Celebs, shows, internet moments, and the group-chat read.",
        illustrationSrc: iconifyHuge("camera-smile-02", cosmoIcon),
      },
      {
        id: "third",
        title: "Love and life",
        description: "Dating, friendship, advice, and confidence boosts.",
        illustrationSrc: iconifyHuge("heart-add", cosmoIcon),
      },
    ],
    favorites: [
      choice("Style", "dress-03", cosmoIcon),
      choice("Beauty", "dressing-table-02", cosmoIcon),
      choice("Celebrity", "camera-smile-02", cosmoIcon),
      choice("Shopping", "shopping-bag-favorite", cosmoIcon),
      choice("Dating", "in-love", cosmoIcon),
      choice("Entertainment", "camera-video", cosmoIcon),
    ],
    discoveries: [
      choice("Affordable finds", "money-bag-02", cosmoIcon),
      choice("Editor tested", "checkmark-badge-02", cosmoIcon),
      choice("Quick reads", "news-01", cosmoIcon),
      choice("Deep dives", "book-open-02", cosmoIcon),
      choice("Trending now", "sparkles", cosmoIcon),
      choice("Astrology", "stars", cosmoIcon),
    ],
    newsletters: [
      newsletter("cosmo-daily", "Cosmo Daily", "A quick hit of style, beauty, celebrities, and conversation starters.", "mail-love-02", cosmoIcon),
      newsletter("cosmo-shopping", "Cosmo Shopping", "Editor-picked deals, outfit ideas, beauty finds, and things worth adding to cart.", "shopping-bag-check", cosmoIcon),
      newsletter("cosmo-weekend", "The Weekend Text", "Going-out ideas, watch lists, dating reads, and the stories everyone is sending.", "smart-phone-03", cosmoIcon),
    ],
    baseTags: ["cosmopolitan", "style", "beauty", "culture", "relationships"],
    fallbackLocation: "Your scene",
    fallbackPriority: "Style and culture picks",
  },
  "country-living": {
    slug: "country-living",
    brandName: "Country Living",
    cardTitle: "Weekend Plan",
    primary: countryIcon,
    secondary: "#CDE5F0",
    ink: "#152B36",
    muted: "#566B73",
    line: "#B8D3DD",
    surface: "#F6FBFD",
    pale: "#E4F2F7",
    headlineFont: '"Playfair Display", Georgia, serif',
    bodyFont: "Montserrat, system-ui, sans-serif",
    introIllustrationSrc: iconifyHuge("house-heart", countryIcon),
    stepIllustrationSrc: iconifyHuge("tree-06", countryIcon),
    cardIllustrationSrc: iconifyHuge("flower-pot", countryIcon),
    intro: "Build a gentler home-and-weekend feed around projects, recipes, gardens, antiques, and small joys.",
    stepLabels: {
      first: "Set your home base",
      second: "Pick your weekend lane",
      third: "Choose what feels useful",
      fourth: "Pick your newsletters",
    },
    stepDescriptions: {
      first: "Tell Country Living where to anchor seasonal ideas.",
      second: "Choose the kind of inspiration you want first.",
      third: "Choose the home ideas you love and the ones you want to try next.",
      fourth: "Pick the Country Living newsletters for your weekend plan.",
    },
    paths: [
      {
        id: "first",
        title: "Home keeper",
        description: "Decorating, organizing, antiques, and cozy rooms.",
        illustrationSrc: iconifyHuge("house-heart", countryIcon),
      },
      {
        id: "second",
        title: "Kitchen table",
        description: "Simple recipes, baking, gatherings, and seasonal menus.",
        illustrationSrc: iconifyHuge("spoon-and-fork", countryIcon),
      },
      {
        id: "third",
        title: "Garden day",
        description: "Porches, plots, outdoor projects, and weekend plans.",
        illustrationSrc: iconifyHuge("tree-06", countryIcon),
      },
    ],
    favorites: [
      choice("Home", "house-heart", countryIcon),
      choice("Decorating", "dressing-table-01", countryIcon),
      choice("Gardening", "flower-pot", countryIcon),
      choice("Recipes", "spoon-and-fork", countryIcon),
      choice("Antiques", "clock-01", countryIcon),
      choice("Crafts", "paint-board", countryIcon),
    ],
    discoveries: [
      choice("Budget-friendly", "money-saving-jar", countryIcon),
      choice("Small spaces", "home-04", countryIcon),
      choice("Seasonal", "leaf-03", countryIcon),
      choice("Weekend projects", "tools", countryIcon),
      choice("Family-friendly", "user-group-03", countryIcon),
      choice("Outdoor hosting", "tent-tree", countryIcon),
    ],
    newsletters: [
      newsletter("country-daily", "Country Living Daily", "Home ideas, recipes, decorating finds, and simple seasonal inspiration.", "mail-open", countryIcon),
      newsletter("country-weekend", "Weekend Projects", "Porches, gardens, crafts, antiques, and small projects to save for Saturday.", "tools", countryIcon),
      newsletter("country-kitchen", "The Country Kitchen", "Recipes, baking ideas, and hosting notes with a cozy, practical feel.", "spoon-and-fork", countryIcon),
    ],
    baseTags: ["country living", "home", "garden", "recipes", "weekend"],
    fallbackLocation: "Home",
    fallbackPriority: "Weekend home ideas",
  },
  "car-and-driver": {
    slug: "car-and-driver",
    brandName: "Car and Driver",
    cardTitle: "Drive Brief",
    primary: carDriverIcon,
    secondary: "#00A4DB",
    ink: "#101820",
    muted: "#516170",
    line: "#B8CDD9",
    surface: "#F5FAFD",
    pale: "#E0F1F8",
    headlineFont: 'Inter, system-ui, sans-serif',
    bodyFont: 'Inter, system-ui, sans-serif',
    introIllustrationSrc: iconifyHuge("car-03", carDriverIcon),
    stepIllustrationSrc: iconifyHuge("road-02", carDriverIcon),
    cardIllustrationSrc: iconifyHuge("streering-wheel", carDriverIcon),
    intro: "Shape your edition around reviews, buying advice, EVs, performance, and the cars you want to understand better.",
    stepLabels: {
      first: "Set your garage",
      second: "Pick your drive mode",
      third: "Choose your car signals",
      fourth: "Pick your newsletters",
    },
    stepDescriptions: {
      first: "A little context helps Car and Driver sort the useful from the noise.",
      second: "Choose the lane you want the feed to lead with.",
      third: "Choose the cars, tests, and buying signals you want to track.",
      fourth: "Pick the Car and Driver newsletters for your garage.",
    },
    paths: [
      {
        id: "first",
        title: "Buying mode",
        description: "Reviews, comparisons, pricing, and ownership advice.",
        illustrationSrc: iconifyHuge("car-03", carDriverIcon),
      },
      {
        id: "second",
        title: "Performance mode",
        description: "Fast cars, tests, specs, road trips, and driver stories.",
        illustrationSrc: iconifyHuge("energy", carDriverIcon),
      },
      {
        id: "third",
        title: "Garage mode",
        description: "Maintenance, tech, tools, and practical upgrades.",
        illustrationSrc: iconifyHuge("tools", carDriverIcon),
      },
    ],
    favorites: [
      choice("Reviews", "car-03", carDriverIcon),
      choice("Buying Guides", "clipboard", carDriverIcon),
      choice("EVs", "automotive-battery-02", carDriverIcon),
      choice("Performance", "car-signal", carDriverIcon),
      choice("Trucks", "truck-delivery", carDriverIcon),
      choice("Classics", "streering-wheel", carDriverIcon),
    ],
    discoveries: [
      choice("Budget-aware", "money-saving-jar", carDriverIcon),
      choice("Family car", "user-group-03", carDriverIcon),
      choice("Daily driver", "seat-selector", carDriverIcon),
      choice("Road trip", "road-location-02", carDriverIcon),
      choice("Enthusiast picks", "car-signal", carDriverIcon),
      choice("Garage tips", "tools", carDriverIcon),
    ],
    newsletters: [
      newsletter("cad-daily", "C/D Daily", "Reviews, industry news, buying advice, and the latest from the test track.", "mail-open", carDriverIcon),
      newsletter("cad-buying", "Buying Guide", "Rankings, comparisons, pricing notes, and practical ownership help.", "clipboard", carDriverIcon),
      newsletter("cad-performance", "Test Track", "Performance cars, EVs, road tests, and the enthusiast stories worth saving.", "car-signal", carDriverIcon),
    ],
    baseTags: ["car and driver", "autos", "reviews", "buying", "ev"],
    fallbackLocation: "Your garage",
    fallbackPriority: "Car reviews and buying advice",
  },
  "womens-health": {
    slug: "womens-health",
    brandName: "Women's Health",
    cardTitle: "Wellness Mix",
    primary: womensHealthIcon,
    secondary: "#EBFF7C",
    ink: "#111827",
    muted: "#4B5875",
    line: "#BDD0F6",
    surface: "#F7FAFF",
    pale: "#E8F0FF",
    headlineFont: '"Altone", system-ui, sans-serif',
    bodyFont: '"Altone", system-ui, sans-serif',
    introIllustrationSrc: iconifyHuge("wellness", womensHealthIcon),
    stepIllustrationSrc: iconifyHuge("dumbbell-02", womensHealthIcon),
    cardIllustrationSrc: iconifyHuge("heart-check", womensHealthIcon),
    intro: "Build a practical wellness feed for workouts, nutrition, recovery, beauty, and routines that fit real life.",
    stepLabels: {
      first: "Set your rhythm",
      second: "Pick your focus",
      third: "Choose your wellness mix",
      fourth: "Pick your newsletters",
    },
    stepDescriptions: {
      first: "Tell Women's Health enough to make the first edition feel relevant.",
      second: "Choose what kind of support should come first.",
      third: "Choose the routines you love and the goals you want to explore.",
      fourth: "Pick the Women's Health newsletters for your weekly rhythm.",
    },
    paths: [
      {
        id: "first",
        title: "Training plan",
        description: "Workouts, strength, cardio, gear, and progress.",
        illustrationSrc: iconifyHuge("dumbbell-02", womensHealthIcon),
      },
      {
        id: "second",
        title: "Feel-good routine",
        description: "Recovery, sleep, stress, beauty, and daily care.",
        illustrationSrc: iconifyHuge("yoga-03", womensHealthIcon),
      },
      {
        id: "third",
        title: "Food fuel",
        description: "Nutrition, protein, meal ideas, and smart habits.",
        illustrationSrc: iconifyHuge("salad", womensHealthIcon),
      },
    ],
    favorites: [
      choice("Fitness", "dumbbell-02", womensHealthIcon),
      choice("Nutrition", "salad", womensHealthIcon),
      choice("Wellness", "wellness", womensHealthIcon),
      choice("Beauty", "dressing-table-02", womensHealthIcon),
      choice("Gear", "running-shoes", womensHealthIcon),
      choice("Mental Health", "heart-check", womensHealthIcon),
    ],
    discoveries: [
      choice("Beginner-friendly", "leaf-02", womensHealthIcon),
      choice("Quick workouts", "workout-run", womensHealthIcon),
      choice("Strength", "dumbbell-03", womensHealthIcon),
      choice("Low impact", "walking", womensHealthIcon),
      choice("Expert-backed", "checkmark-badge-02", womensHealthIcon),
      choice("Recovery", "sleeping", womensHealthIcon),
    ],
    newsletters: [
      newsletter("wh-daily", "Women's Health Daily", "Fitness, wellness, beauty, and nutrition ideas you can actually use.", "mail-open", womensHealthIcon),
      newsletter("wh-fitness", "The Workout Edit", "Strength plans, walking workouts, gear, and movement ideas for your week.", "dumbbell-02", womensHealthIcon),
      newsletter("wh-wellness", "Feel-Good Reset", "Recovery, sleep, stress, nutrition, and routines with expert-backed guidance.", "wellness", womensHealthIcon),
    ],
    baseTags: ["women's health", "fitness", "wellness", "nutrition", "health"],
    fallbackLocation: "Your routine",
    fallbackPriority: "Fitness and wellness goals",
  },
  "oprah-daily": {
    slug: "oprah-daily",
    brandName: "Oprah Daily",
    cardTitle: "Joy Queue",
    primary: oprahIcon,
    secondary: "#166534",
    ink: "#21151A",
    muted: "#66535A",
    line: "#F0C3D0",
    surface: "#FFF8FA",
    pale: "#FCE6ED",
    headlineFont: '"Juana", Georgia, serif',
    bodyFont: "system-ui, sans-serif",
    introIllustrationSrc: iconifyHuge("book-heart", oprahIcon),
    stepIllustrationSrc: iconifyHuge("sparkles", oprahIcon),
    cardIllustrationSrc: iconifyHuge("book-open-02", oprahIcon),
    intro: "Create a warmer daily edition for books, culture, wellness, beauty, and ideas worth carrying with you.",
    stepLabels: {
      first: "Set your daily note",
      second: "Pick your Oprah Daily lane",
      third: "Choose what feeds you",
      fourth: "Pick your newsletters",
    },
    stepDescriptions: {
      first: "A little context gives your edition a more personal beginning.",
      second: "Choose the kind of story you want first.",
      third: "Choose the reads you love and the ideas you want to discover.",
      fourth: "Pick the Oprah Daily newsletters for your joy queue.",
    },
    paths: [
      {
        id: "first",
        title: "Book club mood",
        description: "Books, authors, essays, and reading-list momentum.",
        illustrationSrc: iconifyHuge("book-heart", oprahIcon),
      },
      {
        id: "second",
        title: "Better day",
        description: "Wellness, reflection, routines, and small resets.",
        illustrationSrc: iconifyHuge("sparkles", oprahIcon),
      },
      {
        id: "third",
        title: "Culture and beauty",
        description: "People, products, conversations, and inspiration.",
        illustrationSrc: iconifyHuge("heart-check", oprahIcon),
      },
    ],
    favorites: [
      choice("Books", "book-heart", oprahIcon),
      choice("Wellness", "wellness", oprahIcon),
      choice("Culture", "camera-video", oprahIcon),
      choice("Beauty", "dressing-table-02", oprahIcon),
      choice("Life", "flower", oprahIcon),
      choice("Inspiration", "sparkles", oprahIcon),
    ],
    discoveries: [
      choice("Short reads", "news-01", oprahIcon),
      choice("Deep essays", "pen-tool-01", oprahIcon),
      choice("Book lists", "book-open-02", oprahIcon),
      choice("Editor's picks", "star-award-02", oprahIcon),
      choice("Gentle routines", "coffee-02", oprahIcon),
      choice("Author interviews", "mic-02", oprahIcon),
    ],
    newsletters: [
      newsletter("oprah-daily", "Oprah Daily", "Books, wellness, culture, beauty, and thoughtful stories for the day.", "mail-open", oprahIcon),
      newsletter("oprah-book-club", "Book Club Notes", "Reading-list momentum, author conversations, and stories to share.", "book-open-02", oprahIcon),
      newsletter("oprah-joy", "The Joy Letter", "Small resets, beauty finds, self-care rituals, and inspiration with warmth.", "sparkles", oprahIcon),
    ],
    baseTags: ["oprah daily", "books", "wellness", "culture", "beauty"],
    fallbackLocation: "Your day",
    fallbackPriority: "Books and meaningful daily reads",
  },
  "house-beautiful": publicationConfig({
    slug: "house-beautiful",
    brandName: "House Beautiful",
    cardTitle: "Design Plan",
    primary: houseBeautifulIcon,
    secondary: "#DDE6EF",
    ink: "#17202B",
    surface: "#F7FAFC",
    pale: "#E8EEF5",
    headlineFont: '"SangBleu Sunrise", Georgia, serif',
    bodyFont: '"Visuelt Pro", system-ui, sans-serif',
    introIllustrationSrc: iconifyHuge("house-heart", houseBeautifulIcon),
    stepIllustrationSrc: iconifyHuge("sofa-02", houseBeautifulIcon),
    cardIllustrationSrc: iconifyHuge("paint-board", houseBeautifulIcon),
    intro: "Shape a design-minded edition around rooms, decorating ideas, renovation notes, and pieces worth saving.",
    stepLabels: ["Set your space", "Pick your design mode", "Choose your design mix", "Pick your newsletters"],
    stepDescriptions: [
      "A little context helps House Beautiful understand the home you are shaping.",
      "Choose the kind of design inspiration you want first.",
      "Choose the spaces you love and the ideas you want to discover next.",
      "Pick the House Beautiful newsletters for your design plan.",
    ],
    paths: [
      ["first", "Room refresh", "Decorating ideas, furniture, paint, and styling details.", "sofa-02"],
      ["second", "Renovation notes", "Projects, materials, layouts, and practical design guidance.", "tools"],
      ["third", "Design shopping", "Beautiful finds, editor picks, and pieces worth bookmarking.", "shopping-bag-favorite"],
    ],
    favorites: [
      ["Decorating", "paint-board"],
      ["Living rooms", "sofa-02"],
      ["Bedrooms", "bed-double"],
      ["Kitchens", "kitchen-utensils"],
      ["Shopping", "shopping-bag-favorite"],
      ["House tours", "house-heart"],
    ],
    discoveries: [
      ["Small spaces", "home-04"],
      ["Color ideas", "paint-bucket"],
      ["Renovation help", "tools"],
      ["Designer rooms", "star-award-02"],
      ["Budget finds", "money-saving-jar"],
      ["Garden rooms", "flower-pot"],
    ],
    newsletters: [
      ["house-daily", "House Beautiful Daily", "Decorating ideas, room inspiration, renovation notes, and design finds.", "mail-open"],
      ["house-shopping", "The Design Edit", "Furniture, decor, paint ideas, and pieces editors would actually save.", "shopping-bag-check"],
      ["house-weekend", "Weekend Room Reset", "Small projects, organizing ideas, and fresh ways to make a space feel finished.", "sofa-02"],
    ],
    baseTags: ["house beautiful", "home", "design", "decorating", "renovation"],
    fallbackLocation: "Your space",
    fallbackPriority: "Design and decorating ideas",
  }),
  "good-housekeeping": publicationConfig({
    slug: "good-housekeeping",
    brandName: "Good Housekeeping",
    cardTitle: "Home Edit",
    primary: goodHousekeepingIcon,
    secondary: "#D6F0EF",
    ink: "#101828",
    muted: "#5A6472",
    line: "#B9CDD0",
    surface: "#F5FAFA",
    pale: "#E3F5F4",
    headlineFont: '"Barlow Semi Condensed", system-ui, sans-serif',
    bodyFont: "Inter, system-ui, sans-serif",
    introIllustrationSrc: iconifyHuge("house-heart", goodHousekeepingIcon),
    stepIllustrationSrc: iconifyHuge("checkmark-badge-02", goodHousekeepingIcon),
    cardIllustrationSrc: iconifyHuge("shield-check", goodHousekeepingIcon),
    intro: "Build a helpful edition for tested products, cleaning, organizing, recipes, wellness, and routines that make home easier.",
    stepLabels: ["Set your home base", "Pick your GH mode", "Choose your helpful mix", "Pick your newsletters"],
    stepDescriptions: [
      "A little context helps Good Housekeeping bring practical home ideas forward.",
      "Choose the kind of everyday help you want first.",
      "Choose what you already use and what you want to discover next.",
      "Pick the Good Housekeeping newsletters for your home edit.",
    ],
    paths: [
      ["first", "Efficient home", "Cleaning, organizing, laundry, and time-saving routines.", "house-heart"],
      ["second", "Tested shopper", "Lab-backed products, appliances, deals, and buys worth trusting.", "shield-check"],
      ["third", "Family rhythm", "Food, wellness, holidays, kids, and everyday support.", "user-group-03"],
    ],
    favorites: [
      ["Cleaning", "cleaning-bucket"],
      ["Organizing", "clipboard"],
      ["Recipes", "cook-book"],
      ["Product tests", "shield-check"],
      ["Beauty", "dressing-table-02"],
      ["Wellness", "wellness"],
    ],
    discoveries: [
      ["Quick wins", "stop-watch"],
      ["Budget finds", "money-saving-jar"],
      ["Family ideas", "user-group-03"],
      ["Small spaces", "house-03"],
      ["Lab picks", "checkmark-badge-02"],
      ["Holiday help", "calendar-love-02"],
    ],
    newsletters: [
      ["gh-daily", "Good Housekeeping Daily", "Tested products, practical home ideas, recipes, cleaning tips, and wellness guidance.", "mail-open"],
      ["gh-home", "The Home Edit", "Cleaning, organizing, laundry, small-space ideas, and routines that make home easier.", "house-heart"],
      ["gh-tested", "GH Tested", "Lab-backed appliances, beauty, gear, and product picks before you buy.", "shield-check"],
    ],
    baseTags: ["good housekeeping", "home", "cleaning", "recipes", "product tests"],
    fallbackLocation: "Your home base",
    fallbackPriority: "Practical home ideas",
  }),
  "pioneer-woman": publicationConfig({
    slug: "pioneer-woman",
    brandName: "The Pioneer Woman",
    cardTitle: "Kitchen List",
    primary: pioneerWomanIcon,
    secondary: "#F4EDD8",
    ink: "#251520",
    surface: "#FFF9F0",
    pale: "#F5E8F0",
    headlineFont: "Livvic, system-ui, sans-serif",
    bodyFont: "Livvic, system-ui, sans-serif",
    introIllustrationSrc: iconifyHuge("cook-book", pioneerWomanIcon),
    stepIllustrationSrc: iconifyHuge("spoon-and-fork", pioneerWomanIcon),
    cardIllustrationSrc: iconifyHuge("flower-pot", pioneerWomanIcon),
    intro: "Build a cozy edition for recipes, family dinners, home finds, holiday ideas, and practical country-life inspiration.",
    stepLabels: ["Set your table", "Pick your kitchen mode", "Choose your favorites", "Pick your newsletters"],
    stepDescriptions: [
      "Tell The Pioneer Woman enough to make the first edition feel useful.",
      "Choose the kind of help you want to lead with.",
      "Choose what you already love and what you want to try next.",
      "Pick The Pioneer Woman newsletters for your kitchen list.",
    ],
    paths: [
      ["first", "Dinner helper", "Weeknight meals, comfort food, and family-friendly recipes.", "spoon-and-fork"],
      ["second", "Home and hosting", "Decor, holidays, gatherings, and easy ways to make it welcoming.", "house-heart"],
      ["third", "Shopping finds", "Kitchen gear, gifts, and practical picks worth adding to cart.", "shopping-bag-favorite"],
    ],
    favorites: [
      ["Recipes", "cook-book"],
      ["Dinner", "spoon-and-fork"],
      ["Desserts", "cookie"],
      ["Holidays", "calendar-love-02"],
      ["Home", "house-heart"],
      ["Shopping", "shopping-bag-favorite"],
    ],
    discoveries: [
      ["Quick meals", "stop-watch"],
      ["Budget dinners", "money-saving-jar"],
      ["Family ideas", "user-group-03"],
      ["Weekend baking", "cookie"],
      ["Gift picks", "gift"],
      ["Seasonal decor", "flower"],
    ],
    newsletters: [
      ["pioneer-daily", "The Pioneer Woman Daily", "Recipes, home ideas, shopping finds, and seasonal inspiration.", "mail-open"],
      ["pioneer-recipes", "Recipe Box", "Dinner ideas, desserts, comfort food, and make-ahead favorites.", "cook-book"],
      ["pioneer-weekend", "Weekend at Home", "Hosting, holidays, family ideas, and simple ways to make home feel warm.", "house-heart"],
    ],
    baseTags: ["the pioneer woman", "recipes", "home", "family", "shopping"],
    fallbackLocation: "Your table",
    fallbackPriority: "Recipes and home ideas",
  }),
  prevention: publicationConfig({
    slug: "prevention",
    brandName: "Prevention",
    cardTitle: "Health Plan",
    primary: preventionIcon,
    secondary: "#EAF4F5",
    ink: "#153437",
    surface: "#F6FBFB",
    pale: "#E2F2F3",
    headlineFont: "Poppins, system-ui, sans-serif",
    bodyFont: "Poppins, system-ui, sans-serif",
    introIllustrationSrc: iconifyHuge("health", preventionIcon),
    stepIllustrationSrc: iconifyHuge("wellness", preventionIcon),
    cardIllustrationSrc: iconifyHuge("heart-check", preventionIcon),
    intro: "Create a practical health edition for prevention, movement, nutrition, sleep, aging well, and expert guidance.",
    stepLabels: ["Set your health focus", "Pick your support mode", "Choose your health mix", "Pick your newsletters"],
    stepDescriptions: [
      "A little context helps Prevention bring the right guidance forward.",
      "Choose the kind of health support you want first.",
      "Choose the routines you value and the topics you want to learn next.",
      "Pick the Prevention newsletters for your health plan.",
    ],
    paths: [
      ["first", "Everyday health", "Expert-backed habits, screenings, symptoms, and practical prevention.", "health"],
      ["second", "Move and feel better", "Movement, mobility, sleep, and simple ways to feel stronger.", "walking"],
      ["third", "Food and longevity", "Nutrition, supplements, heart health, and aging-well ideas.", "salad"],
    ],
    favorites: [
      ["Health", "health"],
      ["Nutrition", "salad"],
      ["Fitness", "walking"],
      ["Sleep", "sleeping"],
      ["Aging well", "heart-check"],
      ["Expert advice", "checkmark-badge-02"],
    ],
    discoveries: [
      ["Simple habits", "check-list"],
      ["Heart health", "heart-check"],
      ["Mobility", "walking"],
      ["Brain health", "book-open-02"],
      ["Natural remedies", "leaf-02"],
      ["Condition explainers", "medical-file"],
    ],
    newsletters: [
      ["prevention-daily", "Prevention Daily", "Health guidance, prevention tips, nutrition ideas, and expert explainers.", "mail-open"],
      ["prevention-wellness", "Wellness Reset", "Movement, sleep, stress, and routines that fit into real life.", "wellness"],
      ["prevention-health", "Ask Prevention", "Clear answers on symptoms, screenings, longevity, and everyday health decisions.", "health"],
    ],
    baseTags: ["prevention", "health", "wellness", "nutrition", "longevity"],
    fallbackLocation: "Your routine",
    fallbackPriority: "Practical health guidance",
  }),
  redbook: publicationConfig({
    slug: "redbook",
    brandName: "Redbook",
    cardTitle: "Life Edit",
    primary: redbookIcon,
    secondary: "#DFF8F1",
    ink: "#25121A",
    surface: "#FFF7FA",
    pale: "#FBE5EE",
    headlineFont: "Inter, system-ui, sans-serif",
    bodyFont: "Inter, system-ui, sans-serif",
    introIllustrationSrc: iconifyHuge("heart-check", redbookIcon),
    stepIllustrationSrc: iconifyHuge("user-group-03", redbookIcon),
    cardIllustrationSrc: iconifyHuge("sparkles", redbookIcon),
    intro: "Tune a practical lifestyle edition around family, relationships, home, wellness, holidays, and useful ideas.",
    stepLabels: ["Set your season", "Pick your life mode", "Choose your mix", "Pick your newsletters"],
    stepDescriptions: [
      "A little context helps Redbook serve the stories that fit your week.",
      "Choose the kind of life edit you want first.",
      "Choose what feels useful now and what you want to discover next.",
      "Pick the Redbook newsletters for your life edit.",
    ],
    paths: [
      ["first", "Family rhythm", "Parenting, relationships, holidays, and everyday routines.", "user-group-03"],
      ["second", "Home reset", "Decorating, cleaning, organizing, and simple home upgrades.", "house-heart"],
      ["third", "Feel-good finds", "Wellness, beauty, shopping, and little boosts for the week.", "shopping-bag-favorite"],
    ],
    favorites: [
      ["Family", "user-group-03"],
      ["Relationships", "heart-add"],
      ["Home", "house-heart"],
      ["Wellness", "wellness"],
      ["Beauty", "dressing-table-02"],
      ["Holidays", "calendar-love-02"],
    ],
    discoveries: [
      ["Quick tips", "check-list"],
      ["Budget ideas", "money-saving-jar"],
      ["Gift guides", "gift"],
      ["Organizing", "clipboard"],
      ["Dinner help", "spoon-and-fork"],
      ["Shopping finds", "shopping-bag-check"],
    ],
    newsletters: [
      ["redbook-daily", "Redbook Daily", "Family, home, relationships, wellness, and helpful reads for the week.", "mail-open"],
      ["redbook-home", "Home and Family", "Simple routines, seasonal ideas, and practical ways to make life run smoother.", "house-heart"],
      ["redbook-finds", "Useful Finds", "Shopping, beauty, gifts, and small upgrades editors would recommend.", "shopping-bag-check"],
    ],
    baseTags: ["redbook", "family", "home", "relationships", "wellness"],
    fallbackLocation: "Your week",
    fallbackPriority: "Family, home, and wellness ideas",
  }),
  seventeen: publicationConfig({
    slug: "seventeen",
    brandName: "Seventeen",
    cardTitle: "Trend Pass",
    primary: seventeenIcon,
    secondary: "#EEFFAE",
    ink: "#24101E",
    surface: "#FFF7FD",
    pale: "#FFE4F6",
    headlineFont: "Inter, system-ui, sans-serif",
    bodyFont: "Inter, system-ui, sans-serif",
    introIllustrationSrc: iconifyHuge("sparkles", seventeenIcon),
    stepIllustrationSrc: iconifyHuge("star-face", seventeenIcon),
    cardIllustrationSrc: iconifyHuge("in-love", seventeenIcon),
    intro: "Build a bright edition for style, beauty, entertainment, college life, shopping, and the trends worth sending.",
    stepLabels: ["Set your vibe", "Pick your trend mode", "Choose your obsessions", "Pick your newsletters"],
    stepDescriptions: [
      "A little context helps Seventeen make the feed feel like yours.",
      "Choose the lane you want Seventeen to lead with today.",
      "Choose what you already love and what you want to find next.",
      "Pick the Seventeen newsletters for your trend pass.",
    ],
    paths: [
      ["first", "Style and beauty", "Outfits, hair, makeup, skincare, and shopping ideas.", "dress-03"],
      ["second", "Culture and celebs", "Entertainment, internet moments, stars, and watch-list ideas.", "camera-smile-02"],
      ["third", "Life stuff", "College, friendship, confidence, and practical advice.", "heart-check"],
    ],
    favorites: [
      ["Fashion", "dress-03"],
      ["Beauty", "dressing-table-02"],
      ["Celebs", "camera-smile-02"],
      ["College", "book-open-02"],
      ["Shopping", "shopping-bag-favorite"],
      ["Friends", "user-group-03"],
    ],
    discoveries: [
      ["Affordable finds", "money-saving-jar"],
      ["Trend alerts", "sparkles"],
      ["Confidence", "star-face"],
      ["Quick reads", "news-01"],
      ["Gift ideas", "gift"],
      ["Watch list", "camera-video"],
    ],
    newsletters: [
      ["seventeen-daily", "Seventeen Daily", "Style, beauty, celebs, life advice, and trend reads for the day.", "mail-open"],
      ["seventeen-style", "Style Crush", "Outfit ideas, beauty finds, and shopping picks editors are watching.", "dress-03"],
      ["seventeen-weekend", "Weekend Glow-Up", "Entertainment, friends, confidence reads, and ideas worth sending.", "sparkles"],
    ],
    baseTags: ["seventeen", "style", "beauty", "college", "entertainment"],
    fallbackLocation: "Your scene",
    fallbackPriority: "Style, beauty, and culture picks",
  }),
  "womans-day": publicationConfig({
    slug: "womans-day",
    brandName: "Woman's Day",
    cardTitle: "Daily Plan",
    primary: womansDayIcon,
    secondary: "#F2E7F7",
    ink: "#24172C",
    surface: "#FBF8FC",
    pale: "#EFE4F4",
    headlineFont: '"League Spartan", system-ui, sans-serif',
    bodyFont: "Inter, system-ui, sans-serif",
    introIllustrationSrc: iconifyHuge("calendar-love-02", womansDayIcon),
    stepIllustrationSrc: iconifyHuge("house-heart", womansDayIcon),
    cardIllustrationSrc: iconifyHuge("flower", womansDayIcon),
    intro: "Create a helpful daily edition for recipes, home, family, health, holidays, and little moments of joy.",
    stepLabels: ["Set your day", "Pick your daily mode", "Choose your helpful mix", "Pick your newsletters"],
    stepDescriptions: [
      "A little context helps Woman's Day tune ideas to your household and week.",
      "Choose the kind of help you want first.",
      "Choose what already matters and what you want to discover next.",
      "Pick the Woman's Day newsletters for your daily plan.",
    ],
    paths: [
      ["first", "Home rhythm", "Cleaning, organizing, family routines, and small home wins.", "house-heart"],
      ["second", "Meal plan", "Recipes, dinners, desserts, and easy hosting ideas.", "spoon-and-fork"],
      ["third", "Joy and wellness", "Health, holidays, inspiration, and ways to make the day lighter.", "flower"],
    ],
    favorites: [
      ["Recipes", "cook-book"],
      ["Home", "house-heart"],
      ["Family", "user-group-03"],
      ["Health", "health"],
      ["Holidays", "calendar-love-02"],
      ["Inspiration", "sparkles"],
    ],
    discoveries: [
      ["Quick dinners", "stop-watch"],
      ["Cleaning tips", "check-list"],
      ["Budget help", "money-saving-jar"],
      ["Gift ideas", "gift"],
      ["Faith and joy", "heart-check"],
      ["Seasonal ideas", "flower"],
    ],
    newsletters: [
      ["wd-daily", "Woman's Day Daily", "Recipes, family ideas, health, holidays, and useful reads for the day.", "mail-open"],
      ["wd-recipes", "Easy Meals", "Dinner ideas, desserts, make-ahead favorites, and simple hosting notes.", "cook-book"],
      ["wd-home", "Home and Heart", "Cleaning, organizing, family routines, and joyful seasonal ideas.", "house-heart"],
    ],
    baseTags: ["woman's day", "recipes", "home", "family", "health"],
    fallbackLocation: "Your day",
    fallbackPriority: "Recipes, home, and family ideas",
  }),
  autoweek: publicationConfig({
    slug: "autoweek",
    brandName: "Autoweek",
    cardTitle: "Garage Brief",
    primary: autoweekIcon,
    secondary: "#FFE7A6",
    ink: "#171717",
    surface: "#FFF9EA",
    pale: "#FBECC8",
    headlineFont: "Inter, system-ui, sans-serif",
    bodyFont: "Inter, system-ui, sans-serif",
    introIllustrationSrc: iconifyHuge("car-03", autoweekIcon),
    stepIllustrationSrc: iconifyHuge("calendar-03", autoweekIcon),
    cardIllustrationSrc: iconifyHuge("streering-wheel", autoweekIcon),
    intro: "Shape your autos edition around racing, future cars, enthusiast stories, events, and what is worth watching next.",
    stepLabels: ["Set your garage", "Pick your auto mode", "Choose your signals", "Pick your newsletters"],
    stepDescriptions: [
      "A little context helps Autoweek bring the right stories forward.",
      "Choose what should lead your autos feed.",
      "Choose what you follow and what you want Autoweek to surface next.",
      "Pick the Autoweek newsletters for your garage brief.",
    ],
    paths: [
      ["first", "Racing calendar", "Motorsports, event previews, results, and track-side stories.", "calendar-03"],
      ["second", "Future cars", "New models, EVs, prototypes, and industry shifts.", "car-signal"],
      ["third", "Enthusiast life", "Garage stories, classics, road trips, and car culture.", "streering-wheel"],
    ],
    favorites: [
      ["Racing", "calendar-03"],
      ["Future cars", "car-signal"],
      ["EVs", "automotive-battery-02"],
      ["Classics", "streering-wheel"],
      ["Car culture", "car-03"],
      ["Events", "map-pin"],
    ],
    discoveries: [
      ["Quick news", "news-01"],
      ["Track notes", "road-02"],
      ["Garage tips", "tools"],
      ["Buying signals", "clipboard"],
      ["Performance", "energy"],
      ["Weekend reads", "book-open-02"],
    ],
    newsletters: [
      ["autoweek-daily", "Autoweek Daily", "Racing, future cars, car culture, and stories worth saving.", "mail-open"],
      ["autoweek-racing", "Racing Line", "Motorsports calendars, event notes, results, and track-side coverage.", "calendar-03"],
      ["autoweek-garage", "Garage Watch", "Enthusiast reads, classics, future cars, and practical car-culture picks.", "streering-wheel"],
    ],
    baseTags: ["autoweek", "autos", "racing", "future cars", "car culture"],
    fallbackLocation: "Your garage",
    fallbackPriority: "Racing and enthusiast car stories",
  }),
  "bring-a-trailer": publicationConfig({
    slug: "bring-a-trailer",
    brandName: "Bring a Trailer",
    cardTitle: "Auction Watch",
    primary: bringATrailerIcon,
    secondary: "#F5F5F5",
    ink: "#171717",
    surface: "#FAFAFA",
    pale: "#F2E2E4",
    headlineFont: '"Open Sans", system-ui, sans-serif',
    bodyFont: '"Open Sans", system-ui, sans-serif',
    introIllustrationSrc: iconifyHuge("auction", bringATrailerIcon),
    stepIllustrationSrc: iconifyHuge("car-03", bringATrailerIcon),
    cardIllustrationSrc: iconifyHuge("truck-delivery", bringATrailerIcon),
    intro: "Create an auction-focused edition for listings, watchlists, market signals, garage finds, and cars worth studying.",
    stepLabels: ["Set your watchlist", "Pick your auction mode", "Choose your signals", "Pick your newsletters"],
    stepDescriptions: [
      "A little context helps Bring a Trailer tune the lots and market notes you see first.",
      "Choose what should lead your auction feed.",
      "Choose the categories you follow and the signals you want surfaced next.",
      "Pick the Bring a Trailer newsletters for your auction watch.",
    ],
    paths: [
      ["first", "Auction watch", "Listings, bids, final prices, and standout lots.", "auction"],
      ["second", "Market read", "Trends, values, comparisons, and what collectors are watching.", "money-03"],
      ["third", "Garage finds", "Driver-quality cars, projects, trucks, and rare details.", "truck-delivery"],
    ],
    favorites: [
      ["Auctions", "auction"],
      ["Classics", "streering-wheel"],
      ["Trucks", "truck-delivery"],
      ["Sports cars", "car-signal"],
      ["Market data", "money-03"],
      ["Watchlists", "bookmark-check-02"],
    ],
    discoveries: [
      ["No reserve", "checkmark-badge-02"],
      ["Driver quality", "seat-selector"],
      ["Low mileage", "dashboard-speed-01"],
      ["Project cars", "tools"],
      ["Recent sales", "chart-line-data-01"],
      ["Hidden gems", "star-award-02"],
    ],
    newsletters: [
      ["bat-daily", "Bring a Trailer Daily", "Featured auctions, standout listings, market notes, and results worth watching.", "mail-open"],
      ["bat-watchlist", "Auction Watchlist", "Lots to follow, final prices, and category signals for collectors.", "auction"],
      ["bat-garage", "Garage Finds", "Interesting drivers, trucks, projects, and rare cars with good stories.", "truck-delivery"],
    ],
    baseTags: ["bring a trailer", "auctions", "cars", "market", "collectors"],
    fallbackLocation: "Your watchlist",
    fallbackPriority: "Auction and market signals",
  }),
  "hot-rod": publicationConfig({
    slug: "hot-rod",
    brandName: "HOT ROD",
    cardTitle: "Build Sheet",
    primary: hotRodIcon,
    secondary: "#F3D6D4",
    ink: "#151515",
    surface: "#FFF8F7",
    pale: "#F8E3E1",
    headlineFont: '"Barlow Condensed", system-ui, sans-serif',
    bodyFont: "Geist, system-ui, sans-serif",
    introIllustrationSrc: iconifyHuge("engine", hotRodIcon),
    stepIllustrationSrc: iconifyHuge("car-signal", hotRodIcon),
    cardIllustrationSrc: iconifyHuge("tools", hotRodIcon),
    intro: "Build a performance-minded edition for engine stories, project cars, events, tech, and muscle worth tracking.",
    stepLabels: ["Set your garage", "Pick your build mode", "Choose your signals", "Pick your newsletters"],
    stepDescriptions: [
      "A little context helps HOT ROD tune the build sheet to your interests.",
      "Choose the kind of performance coverage you want first.",
      "Choose what you follow and what you want HOT ROD to find next.",
      "Pick the HOT ROD newsletters for your build sheet.",
    ],
    paths: [
      ["first", "Project car", "Builds, swaps, garage tech, and practical upgrades.", "tools"],
      ["second", "Muscle and performance", "Power, engines, drag strips, and fast-car stories.", "engine"],
      ["third", "Events and culture", "Shows, tours, track days, and community stories.", "calendar-03"],
    ],
    favorites: [
      ["Builds", "tools"],
      ["Engines", "engine"],
      ["Muscle cars", "car-signal"],
      ["Events", "calendar-03"],
      ["Garage tech", "toolbox"],
      ["Classics", "streering-wheel"],
    ],
    discoveries: [
      ["Budget builds", "money-saving-jar"],
      ["Track notes", "road-02"],
      ["How-to", "check-list"],
      ["Parts", "tool-case"],
      ["Drag week", "map-pin"],
      ["Performance tips", "energy"],
    ],
    newsletters: [
      ["hotrod-daily", "HOT ROD Daily", "Builds, performance stories, garage tech, and event coverage.", "mail-open"],
      ["hotrod-build", "Build Sheet", "Project cars, parts, engine notes, and hands-on garage ideas.", "tools"],
      ["hotrod-events", "Event Line", "Shows, tours, track stories, and community coverage worth following.", "calendar-03"],
    ],
    baseTags: ["hot rod", "autos", "performance", "builds", "events"],
    fallbackLocation: "Your garage",
    fallbackPriority: "Builds and performance stories",
  }),
  "road-and-track": publicationConfig({
    slug: "road-and-track",
    brandName: "Road & Track",
    cardTitle: "Driver Notes",
    primary: roadAndTrackIcon,
    secondary: "#E7E7E7",
    ink: "#181818",
    surface: "#F8F8F8",
    pale: "#EDEDED",
    headlineFont: "Buzz, Inter, system-ui, sans-serif",
    bodyFont: "Inter, system-ui, sans-serif",
    introIllustrationSrc: iconifyHuge("road-02", roadAndTrackIcon),
    stepIllustrationSrc: iconifyHuge("car-signal", roadAndTrackIcon),
    cardIllustrationSrc: iconifyHuge("streering-wheel", roadAndTrackIcon),
    intro: "Tune a driver-first edition for performance, road tests, motorsport, design, and cars with a point of view.",
    stepLabels: ["Set your road", "Pick your drive mode", "Choose your signals", "Pick your newsletters"],
    stepDescriptions: [
      "A little context helps Road & Track know what kind of drive matters to you.",
      "Choose what should lead your edition.",
      "Choose what you follow and what you want to discover next.",
      "Pick the Road & Track newsletters for your driver notes.",
    ],
    paths: [
      ["first", "Road test", "Reviews, comparisons, handling notes, and driver impressions.", "road-02"],
      ["second", "Performance culture", "Fast cars, motorsport, design, and enthusiast stories.", "car-signal"],
      ["third", "Collectible watch", "Classics, rare cars, values, and garage-worthy details.", "star-award-02"],
    ],
    favorites: [
      ["Road tests", "road-02"],
      ["Performance", "energy"],
      ["Motorsport", "calendar-03"],
      ["Design", "pencil-ruler"],
      ["Classics", "streering-wheel"],
      ["EVs", "automotive-battery-02"],
    ],
    discoveries: [
      ["Driver stories", "book-open-02"],
      ["Track analysis", "chart-line-data-01"],
      ["Buying signals", "clipboard"],
      ["Garage picks", "tools"],
      ["Long reads", "book-open-02"],
      ["Future icons", "star-award-02"],
    ],
    newsletters: [
      ["rt-daily", "Road & Track Daily", "Road tests, performance stories, motorsport, design, and driver notes.", "mail-open"],
      ["rt-drive", "The Drive Line", "Reviews, road tests, handling notes, and enthusiast reads.", "road-02"],
      ["rt-garage", "Collectible Watch", "Classics, future icons, market signals, and garage-worthy stories.", "star-award-02"],
    ],
    baseTags: ["road and track", "autos", "performance", "motorsport", "reviews"],
    fallbackLocation: "Your road",
    fallbackPriority: "Driver-focused car stories",
  }),
  elle: publicationConfig({
    slug: "elle",
    brandName: "ELLE",
    cardTitle: "Style Edit",
    primary: elleIcon,
    secondary: "#E7E8EC",
    ink: "#111827",
    surface: "#F7F7F8",
    pale: "#ECEEF2",
    headlineFont: '"Modern MT Pro", Georgia, serif',
    bodyFont: '"Neue Haas Unica Pro", Inter, system-ui, sans-serif',
    introIllustrationSrc: iconifyHuge("dress-03", elleIcon),
    stepIllustrationSrc: iconifyHuge("sparkles", elleIcon),
    cardIllustrationSrc: iconifyHuge("shopping-bag-favorite", elleIcon),
    intro: "Create a sharp ELLE edition for fashion, beauty, culture, celebrity, shopping, and the stories setting the mood.",
    stepLabels: ["Set your style lane", "Pick your ELLE mode", "Choose your edit", "Pick your newsletters"],
    stepDescriptions: [
      "A little context helps ELLE shape fashion, beauty, and culture around your taste.",
      "Choose the kind of story you want ELLE to lead with first.",
      "Choose what you follow now and what you want to discover next.",
      "Pick the ELLE newsletters for your style edit.",
    ],
    paths: [
      ["first", "Fashion first", "Runway, trends, outfits, shopping, and pieces worth saving.", "dress-03"],
      ["second", "Beauty mood", "Skin, makeup, hair, fragrance, and editor-tested routines.", "dressing-table-02"],
      ["third", "Culture radar", "Celebrity, film, books, music, and the conversations shaping style.", "camera-video"],
    ],
    favorites: [
      ["Fashion", "dress-03"],
      ["Beauty", "dressing-table-02"],
      ["Shopping", "shopping-bag-favorite"],
      ["Celebrity", "camera-smile-02"],
      ["Culture", "camera-video"],
      ["Runway", "sparkles"],
    ],
    discoveries: [
      ["Editor picks", "checkmark-badge-02"],
      ["New designers", "star-award-02"],
      ["Fragrance", "perfume"],
      ["Red carpet", "dress-03"],
      ["Long reads", "book-open-02"],
      ["Weekend plans", "calendar-03"],
    ],
    newsletters: [
      ["elle-daily", "ELLE Daily", "Fashion, beauty, celebrity, culture, and the stories everyone is talking about.", "mail-open"],
      ["elle-style", "The Style Edit", "Trends, shopping finds, runway notes, and pieces worth adding to your list.", "shopping-bag-favorite"],
      ["elle-beauty", "Beauty Brief", "Skin, makeup, hair, fragrance, and editor-tested routines.", "dressing-table-02"],
    ],
    baseTags: ["elle", "fashion", "beauty", "culture", "celebrity"],
    fallbackLocation: "Your style lane",
    fallbackPriority: "Fashion, beauty, and culture",
  }),
  "elle-decor": publicationConfig({
    slug: "elle-decor",
    brandName: "ELLE Decor",
    cardTitle: "Design Edit",
    primary: elleDecorIcon,
    secondary: "#E7F0FA",
    ink: "#142233",
    surface: "#F7FAFE",
    pale: "#E5EFF9",
    headlineFont: '"Modern MT Pro", Georgia, serif',
    bodyFont: "Inter, system-ui, sans-serif",
    introIllustrationSrc: iconifyHuge("paint-board", elleDecorIcon),
    stepIllustrationSrc: iconifyHuge("sofa-03", elleDecorIcon),
    cardIllustrationSrc: iconifyHuge("house-heart", elleDecorIcon),
    intro: "Create a refined design edition for interiors, architecture, art, travel, gardens, and homes with strong taste.",
    stepLabels: ["Set your design lens", "Pick your decor mode", "Choose your design mix", "Pick your newsletters"],
    stepDescriptions: [
      "A little context helps ELLE Decor understand the rooms and references you care about.",
      "Choose the kind of design story you want first.",
      "Choose your favorite design worlds and what you want to discover next.",
      "Pick the ELLE Decor newsletters for your design edit.",
    ],
    paths: [
      ["first", "Interior study", "Rooms, houses, materials, and designer references.", "sofa-03"],
      ["second", "Art and travel", "Culture, hotels, galleries, and design destinations.", "maps-global-02"],
      ["third", "Garden and table", "Outdoor rooms, entertaining, and beautiful details.", "flower-pot"],
    ],
    favorites: [
      ["Interiors", "sofa-03"],
      ["Architecture", "building-06"],
      ["Art", "paint-board"],
      ["Gardens", "flower-pot"],
      ["Travel", "maps-global-02"],
      ["Shopping", "shopping-bag-favorite"],
    ],
    discoveries: [
      ["House tours", "house-heart"],
      ["Designer rooms", "star-award-02"],
      ["Color ideas", "paint-bucket"],
      ["Small luxuries", "gift"],
      ["Tabletop", "spoon-and-fork"],
      ["Weekend escapes", "travel-bag"],
    ],
    newsletters: [
      ["ed-daily", "ELLE Decor Daily", "Interiors, architecture, art, travel, gardens, and refined design ideas.", "mail-open"],
      ["ed-design", "The Design Edit", "Rooms, designer references, shopping finds, and ideas worth saving.", "sofa-03"],
      ["ed-travel", "Artful Escapes", "Travel, culture, gardens, hotels, and design destinations.", "maps-global-02"],
    ],
    baseTags: ["elle decor", "design", "interiors", "architecture", "travel"],
    fallbackLocation: "Your design lens",
    fallbackPriority: "Interiors and design inspiration",
  }),
  esquire: publicationConfig({
    slug: "esquire",
    brandName: "Esquire",
    cardTitle: "Culture List",
    primary: esquireIcon,
    secondary: "#F5F6F8",
    ink: "#171717",
    surface: "#FAFAFB",
    pale: "#F0E6E5",
    headlineFont: "Lausanne, Inter, system-ui, sans-serif",
    bodyFont: "Lausanne, Inter, system-ui, sans-serif",
    introIllustrationSrc: iconifyHuge("suit-02", esquireIcon),
    stepIllustrationSrc: iconifyHuge("book-open-02", esquireIcon),
    cardIllustrationSrc: iconifyHuge("camera-video", esquireIcon),
    intro: "Build a sharp edition for culture, style, entertainment, politics, gear, and the stories worth arguing about.",
    stepLabels: ["Set your taste", "Pick your Esquire mode", "Choose your culture mix", "Pick your newsletters"],
    stepDescriptions: [
      "A little context helps Esquire tune the signal to your taste.",
      "Choose the kind of story you want first.",
      "Choose what you already follow and what you want Esquire to surface next.",
      "Pick the Esquire newsletters for your culture list.",
    ],
    paths: [
      ["first", "Culture brief", "Movies, TV, books, politics, and sharp commentary.", "book-open-02"],
      ["second", "Style and gear", "Clothes, watches, grooming, drinks, and things worth buying.", "suit-02"],
      ["third", "Long reads", "Profiles, essays, big swings, and reported stories.", "news-01"],
    ],
    favorites: [
      ["Culture", "book-open-02"],
      ["Style", "suit-02"],
      ["Entertainment", "camera-video"],
      ["Gear", "shopping-bag-favorite"],
      ["Drinks", "coffee-02"],
      ["Long reads", "news-01"],
    ],
    discoveries: [
      ["Editor's picks", "star-award-02"],
      ["Watch list", "camera-video"],
      ["Grooming", "dressing-table-02"],
      ["Books", "book-heart"],
      ["Politics", "court-house"],
      ["Conversation starters", "bubble-chat-spark"],
    ],
    newsletters: [
      ["esquire-daily", "Esquire Daily", "Culture, style, entertainment, gear, and long reads worth your time.", "mail-open"],
      ["esquire-style", "Style and Gear", "Clothes, grooming, watches, drinks, and useful things to buy.", "suit-02"],
      ["esquire-culture", "Culture List", "Movies, TV, books, profiles, and stories people will talk about.", "camera-video"],
    ],
    baseTags: ["esquire", "culture", "style", "entertainment", "gear"],
    fallbackLocation: "Your taste",
    fallbackPriority: "Culture, style, and long reads",
  }),
  "harpers-bazaar": publicationConfig({
    slug: "harpers-bazaar",
    brandName: "Harper's BAZAAR",
    cardTitle: "Style Brief",
    primary: harpersBazaarIcon,
    secondary: "#F3E8E8",
    ink: "#111111",
    surface: "#FAFAFA",
    pale: "#F1E4E4",
    headlineFont: '"NewParis Text", Georgia, serif',
    bodyFont: '"Helvetica Now Text", system-ui, sans-serif',
    introIllustrationSrc: iconifyHuge("crown", harpersBazaarIcon),
    stepIllustrationSrc: iconifyHuge("dress-03", harpersBazaarIcon),
    cardIllustrationSrc: iconifyHuge("star-award-02", harpersBazaarIcon),
    intro: "Create an elevated edition for fashion, beauty, culture, runway, shopping, and the people shaping style.",
    stepLabels: ["Set your style lens", "Pick your BAZAAR mode", "Choose your style mix", "Pick your newsletters"],
    stepDescriptions: [
      "A little context helps BAZAAR understand the style and culture stories you want.",
      "Choose what should lead your edition.",
      "Choose what you love and what you want BAZAAR to discover next.",
      "Pick the BAZAAR newsletters for your style brief.",
    ],
    paths: [
      ["first", "Fashion first", "Runway, trends, designers, and shopping intelligence.", "dress-03"],
      ["second", "Beauty authority", "Skin, makeup, hair, fragrance, and expert-led routines.", "dressing-table-02"],
      ["third", "Culture and people", "Profiles, art, film, travel, and the style conversation.", "camera-video"],
    ],
    favorites: [
      ["Fashion", "dress-03"],
      ["Beauty", "dressing-table-02"],
      ["Runway", "crown"],
      ["Shopping", "shopping-bag-favorite"],
      ["Culture", "camera-video"],
      ["Travel", "maps-global-02"],
    ],
    discoveries: [
      ["Editor's picks", "star-award-02"],
      ["Luxury finds", "gift"],
      ["Trend reports", "sparkles"],
      ["Profiles", "user-star-02"],
      ["Beauty tested", "checkmark-badge-02"],
      ["Long reads", "book-open-02"],
    ],
    newsletters: [
      ["bazaar-daily", "BAZAAR Daily", "Fashion, beauty, culture, shopping, and style stories worth knowing.", "mail-open"],
      ["bazaar-style", "The Style Brief", "Runway, trends, designer news, and shopping intelligence.", "dress-03"],
      ["bazaar-beauty", "Beauty Edit", "Skin, hair, makeup, fragrance, and expert-led routines.", "dressing-table-02"],
    ],
    baseTags: ["harper's bazaar", "fashion", "beauty", "culture", "style"],
    fallbackLocation: "Your style lens",
    fallbackPriority: "Fashion, beauty, and culture",
  }),
  "town-and-country": publicationConfig({
    slug: "town-and-country",
    brandName: "Town & Country",
    cardTitle: "Society Notes",
    primary: townAndCountryIcon,
    secondary: "#F1F2F4",
    ink: "#12152A",
    surface: "#F9FAFB",
    pale: "#F2E5E5",
    headlineFont: "Montserrat, system-ui, sans-serif",
    bodyFont: "Montserrat, system-ui, sans-serif",
    introIllustrationSrc: iconifyHuge("crown-02", townAndCountryIcon),
    stepIllustrationSrc: iconifyHuge("travel-bag", townAndCountryIcon),
    cardIllustrationSrc: iconifyHuge("gift", townAndCountryIcon),
    intro: "Shape a polished edition for culture, travel, philanthropy, style, society, jewelry, and elevated ideas.",
    stepLabels: ["Set your circle", "Pick your T&C mode", "Choose your interests", "Pick your newsletters"],
    stepDescriptions: [
      "A little context helps Town & Country tune the right mix of culture and style.",
      "Choose the kind of story you want first.",
      "Choose what you follow and what you want to discover next.",
      "Pick the Town & Country newsletters for your society notes.",
    ],
    paths: [
      ["first", "Culture and society", "People, philanthropy, etiquette, and notable conversations.", "crown-02"],
      ["second", "Travel and places", "Hotels, destinations, escapes, and polished itineraries.", "travel-bag"],
      ["third", "Style and gifts", "Jewelry, watches, shopping, and things with taste.", "gift"],
    ],
    favorites: [
      ["Society", "crown-02"],
      ["Travel", "travel-bag"],
      ["Culture", "book-open-02"],
      ["Style", "suit-02"],
      ["Jewelry", "star-award-02"],
      ["Gifts", "gift"],
    ],
    discoveries: [
      ["Weekend escapes", "maps-global-02"],
      ["Notable people", "user-star-02"],
      ["Philanthropy", "heart-check"],
      ["Entertaining", "spoon-and-fork"],
      ["Shopping edits", "shopping-bag-check"],
      ["Long reads", "news-01"],
    ],
    newsletters: [
      ["tc-daily", "Town & Country Daily", "Culture, society, travel, style, philanthropy, and polished ideas.", "mail-open"],
      ["tc-travel", "T&C Travel", "Hotels, destinations, weekend escapes, and itineraries worth saving.", "travel-bag"],
      ["tc-style", "Style and Gifts", "Jewelry, watches, entertaining, and elegant shopping edits.", "gift"],
    ],
    baseTags: ["town and country", "culture", "travel", "style", "society"],
    fallbackLocation: "Your circle",
    fallbackPriority: "Culture, travel, and style",
  }),
  veranda: publicationConfig({
    slug: "veranda",
    brandName: "Veranda",
    cardTitle: "Elegance Edit",
    primary: verandaIcon,
    secondary: "#F3EAD9",
    ink: "#241E16",
    surface: "#FBF8F1",
    pale: "#EFE3CF",
    headlineFont: '"Playfair Display", Georgia, serif',
    bodyFont: "Inter, system-ui, sans-serif",
    introIllustrationSrc: iconifyHuge("flower-pot", verandaIcon),
    stepIllustrationSrc: iconifyHuge("sofa-01", verandaIcon),
    cardIllustrationSrc: iconifyHuge("house-heart", verandaIcon),
    intro: "Create a graceful edition for interiors, gardens, travel, collecting, entertaining, and timeless design.",
    stepLabels: ["Set your point of view", "Pick your Veranda mode", "Choose your elegance mix", "Pick your newsletters"],
    stepDescriptions: [
      "A little context helps Veranda tune design inspiration to your taste.",
      "Choose the kind of elegance you want first.",
      "Choose what you love and what you want to discover next.",
      "Pick the Veranda newsletters for your elegance edit.",
    ],
    paths: [
      ["first", "Interiors", "Rooms, antiques, designers, collecting, and layered style.", "sofa-01"],
      ["second", "Gardens", "Outdoor rooms, landscapes, flowers, and seasonal beauty.", "flower-pot"],
      ["third", "Travel and table", "Destinations, entertaining, tabletop, and beautiful rituals.", "travel-bag"],
    ],
    favorites: [
      ["Interiors", "sofa-01"],
      ["Gardens", "flower-pot"],
      ["Antiques", "vintage-clock"],
      ["Travel", "travel-bag"],
      ["Entertaining", "spoon-and-fork"],
      ["Shopping", "shopping-bag-favorite"],
    ],
    discoveries: [
      ["House tours", "house-heart"],
      ["Collector finds", "star-award-02"],
      ["Color palettes", "paint-bucket"],
      ["Outdoor rooms", "tree-06"],
      ["Tablescapes", "spoon-and-fork"],
      ["Weekend escapes", "maps-global-02"],
    ],
    newsletters: [
      ["veranda-daily", "Veranda Daily", "Interiors, gardens, travel, entertaining, and timeless design ideas.", "mail-open"],
      ["veranda-design", "The Elegance Edit", "Rooms, antiques, designers, collecting, and beautiful details.", "sofa-01"],
      ["veranda-garden", "Garden and Table", "Outdoor rooms, flowers, entertaining, and seasonal inspiration.", "flower-pot"],
    ],
    baseTags: ["veranda", "interiors", "gardens", "travel", "entertaining"],
    fallbackLocation: "Your point of view",
    fallbackPriority: "Interiors, gardens, and entertaining",
  }),
  "best-products": publicationConfig({
    slug: "best-products",
    brandName: "Best Products",
    cardTitle: "Buy List",
    primary: bestProductsIcon,
    secondary: "#E8E8FF",
    ink: "#151633",
    surface: "#F8F8FF",
    pale: "#E6E7FF",
    headlineFont: "Inter, system-ui, sans-serif",
    bodyFont: "Inter, system-ui, sans-serif",
    introIllustrationSrc: iconifyHuge("shopping-bag-favorite", bestProductsIcon),
    stepIllustrationSrc: iconifyHuge("checkmark-badge-02", bestProductsIcon),
    cardIllustrationSrc: iconifyHuge("gift", bestProductsIcon),
    intro: "Build a smart shopping edition for tested picks, deals, gifts, home upgrades, tech, and useful things to buy.",
    stepLabels: ["Set your shopping lane", "Pick your buying mode", "Choose your wish list", "Pick your newsletters"],
    stepDescriptions: [
      "A little context helps Best Products know what is worth surfacing.",
      "Choose the kind of buying help you want first.",
      "Choose what you shop for and what you want editors to find next.",
      "Pick the Best Products newsletters for your buy list.",
    ],
    paths: [
      ["first", "Deals and finds", "Sales, editor picks, and smart things worth adding to cart.", "shopping-bag-check"],
      ["second", "Tested picks", "Products, reviews, comparisons, and practical recommendations.", "checkmark-badge-02"],
      ["third", "Gifts and home", "Gift guides, home upgrades, tech, and everyday problem-solvers.", "gift"],
    ],
    favorites: [
      ["Deals", "hot-price"],
      ["Gifts", "gift"],
      ["Home", "house-heart"],
      ["Tech", "smart-phone-03"],
      ["Beauty", "dressing-table-02"],
      ["Outdoor", "tent-tree"],
    ],
    discoveries: [
      ["Editor tested", "checkmark-badge-02"],
      ["Budget picks", "money-saving-jar"],
      ["Trending products", "sparkles"],
      ["Amazon finds", "shopping-bag-favorite"],
      ["Gift guides", "gift-card"],
      ["Buying advice", "clipboard"],
    ],
    newsletters: [
      ["bp-daily", "Best Products Daily", "Deals, tested picks, gift ideas, tech, home, and shopping guidance.", "mail-open"],
      ["bp-deals", "Deals Worth It", "Sales, smart buys, and editor-approved picks worth acting on.", "hot-price"],
      ["bp-gifts", "Gift Guide", "Gift ideas, home upgrades, tech, and useful things people actually want.", "gift"],
    ],
    baseTags: ["best products", "shopping", "deals", "gifts", "reviews"],
    fallbackLocation: "Your shopping lane",
    fallbackPriority: "Deals, gifts, and tested picks",
  }),
  bicycling: publicationConfig({
    slug: "bicycling",
    brandName: "Bicycling",
    cardTitle: "Ride Plan",
    primary: bicyclingIcon,
    secondary: "#E6F7FB",
    ink: "#102832",
    surface: "#F5FBFD",
    pale: "#DFF2F7",
    headlineFont: '"Velo Serif Display", Georgia, serif',
    bodyFont: "Inter, system-ui, sans-serif",
    introIllustrationSrc: iconifyHuge("bicycle", bicyclingIcon),
    stepIllustrationSrc: iconifyHuge("road-02", bicyclingIcon),
    cardIllustrationSrc: iconifyHuge("maps-location-02", bicyclingIcon),
    intro: "Create a ride-ready edition for training, gear, routes, maintenance, racing, and the joy of getting outside.",
    stepLabels: ["Set your ride", "Pick your cycling mode", "Choose your ride mix", "Pick your newsletters"],
    stepDescriptions: [
      "A little context helps Bicycling tune stories to the way you ride.",
      "Choose what kind of cycling support should lead.",
      "Choose what you love and what you want to discover next.",
      "Pick the Bicycling newsletters for your ride plan.",
    ],
    paths: [
      ["first", "Training ride", "Fitness, workouts, endurance, and plans for getting stronger.", "bicycle"],
      ["second", "Gear check", "Bikes, accessories, maintenance, and buying advice.", "tools"],
      ["third", "Routes and racing", "Places to ride, events, racing, and cycling culture.", "maps-location-02"],
    ],
    favorites: [
      ["Training", "bicycle"],
      ["Gear", "toolbox"],
      ["Maintenance", "tools"],
      ["Routes", "maps-location-02"],
      ["Racing", "calendar-03"],
      ["Fitness", "heart-check"],
    ],
    discoveries: [
      ["Beginner help", "leaf-02"],
      ["Long rides", "road-02"],
      ["Bike reviews", "clipboard"],
      ["Nutrition", "salad"],
      ["Commuting", "map-pin"],
      ["Deals", "shopping-bag-check"],
    ],
    newsletters: [
      ["bicycling-daily", "Bicycling Daily", "Training, gear, routes, maintenance, racing, and cycling culture.", "mail-open"],
      ["bicycling-training", "Ride Stronger", "Workouts, fitness, nutrition, and practical training ideas.", "bicycle"],
      ["bicycling-gear", "Gear Check", "Bike reviews, maintenance notes, accessories, and useful buying advice.", "tools"],
    ],
    baseTags: ["bicycling", "cycling", "training", "gear", "routes"],
    fallbackLocation: "Your ride",
    fallbackPriority: "Training, gear, and ride ideas",
  }),
  "mens-health": publicationConfig({
    slug: "mens-health",
    brandName: "Men's Health",
    cardTitle: "Strength Plan",
    primary: mensHealthIcon,
    secondary: "#FFF7BE",
    ink: "#191313",
    surface: "#FFFDF2",
    pale: "#FBE4E6",
    headlineFont: "Manrope, system-ui, sans-serif",
    bodyFont: "Manrope, system-ui, sans-serif",
    introIllustrationSrc: iconifyHuge("dumbbell-03", mensHealthIcon),
    stepIllustrationSrc: iconifyHuge("health", mensHealthIcon),
    cardIllustrationSrc: iconifyHuge("heart-check", mensHealthIcon),
    intro: "Build a practical edition for strength, health, nutrition, gear, relationships, and routines that hold up.",
    stepLabels: ["Set your goal", "Pick your training mode", "Choose your strength mix", "Pick your newsletters"],
    stepDescriptions: [
      "A little context helps Men's Health tune the first edition to your goals.",
      "Choose the kind of support you want first.",
      "Choose the routines you follow and the topics you want to explore next.",
      "Pick the Men's Health newsletters for your strength plan.",
    ],
    paths: [
      ["first", "Strength plan", "Workouts, muscle, performance, and training structure.", "dumbbell-03"],
      ["second", "Health reset", "Longevity, sleep, mental health, and expert guidance.", "health"],
      ["third", "Fuel and gear", "Nutrition, protein, tech, and useful buying advice.", "salad"],
    ],
    favorites: [
      ["Fitness", "dumbbell-03"],
      ["Health", "health"],
      ["Nutrition", "salad"],
      ["Mental health", "heart-check"],
      ["Gear", "smart-watch-03"],
      ["Relationships", "heart-add"],
    ],
    discoveries: [
      ["Quick workouts", "workout-run"],
      ["Strength", "dumbbell-02"],
      ["Longevity", "heart-check"],
      ["Recovery", "sleeping"],
      ["Expert-backed", "checkmark-badge-02"],
      ["Shopping", "shopping-bag-check"],
    ],
    newsletters: [
      ["mh-daily", "Men's Health Daily", "Fitness, health, nutrition, gear, and useful routines.", "mail-open"],
      ["mh-fitness", "The Workout Edit", "Strength plans, quick workouts, recovery, and training ideas.", "dumbbell-03"],
      ["mh-health", "Health and Fuel", "Nutrition, longevity, sleep, mental health, and expert-backed guidance.", "health"],
    ],
    baseTags: ["men's health", "fitness", "health", "nutrition", "gear"],
    fallbackLocation: "Your goal",
    fallbackPriority: "Strength, health, and nutrition",
  }),
  "popular-mechanics": publicationConfig({
    slug: "popular-mechanics",
    brandName: "Popular Mechanics",
    cardTitle: "Build Brief",
    primary: popularMechanicsIcon,
    secondary: "#DDF3F0",
    ink: "#102826",
    surface: "#F5FBFA",
    pale: "#DFF0EE",
    headlineFont: '"United Sans Cd", Inter, system-ui, sans-serif',
    bodyFont: "Inter, system-ui, sans-serif",
    introIllustrationSrc: iconifyHuge("tools", popularMechanicsIcon),
    stepIllustrationSrc: iconifyHuge("engine", popularMechanicsIcon),
    cardIllustrationSrc: iconifyHuge("pencil-ruler", popularMechanicsIcon),
    intro: "Create a hands-on edition for tech, science, tools, DIY, engineering, gear, and how things work.",
    stepLabels: ["Set your project bench", "Pick your maker mode", "Choose your build mix", "Pick your newsletters"],
    stepDescriptions: [
      "A little context helps Popular Mechanics tune ideas to your curiosity and projects.",
      "Choose the kind of practical coverage you want first.",
      "Choose what you follow and what you want to learn next.",
      "Pick the Popular Mechanics newsletters for your build brief.",
    ],
    paths: [
      ["first", "Tools and DIY", "Projects, repairs, tools, and hands-on problem solving.", "tools"],
      ["second", "Science and tech", "Engineering, space, energy, gadgets, and big ideas explained.", "engine"],
      ["third", "Gear and home", "Useful products, home systems, outdoor gear, and tested advice.", "toolbox"],
    ],
    favorites: [
      ["DIY", "tools"],
      ["Tools", "toolbox"],
      ["Science", "microscope"],
      ["Tech", "microchip"],
      ["Engineering", "engine"],
      ["Gear", "shopping-bag-favorite"],
    ],
    discoveries: [
      ["How-to", "check-list"],
      ["Space", "stars"],
      ["Outdoor gear", "tent-tree"],
      ["Home projects", "house-heart"],
      ["Future tech", "sparkles"],
      ["Buying advice", "clipboard"],
    ],
    newsletters: [
      ["pm-daily", "Popular Mechanics Daily", "Science, tech, tools, DIY, engineering, and how things work.", "mail-open"],
      ["pm-projects", "The Build Brief", "Projects, tools, repairs, and practical how-to guidance.", "tools"],
      ["pm-tech", "Future Lab", "Science, engineering, space, gadgets, and useful tech explainers.", "microchip"],
    ],
    baseTags: ["popular mechanics", "science", "tech", "tools", "diy"],
    fallbackLocation: "Your project bench",
    fallbackPriority: "Tools, science, and practical tech",
  }),
  "runners-world": publicationConfig({
    slug: "runners-world",
    brandName: "Runner's World",
    cardTitle: "Run Plan",
    primary: runnersWorldIcon,
    secondary: "#E0FAFB",
    ink: "#10272A",
    surface: "#F5FCFC",
    pale: "#DFF5F6",
    headlineFont: '"League Gothic", Inter, system-ui, sans-serif',
    bodyFont: "Inter, system-ui, sans-serif",
    introIllustrationSrc: iconifyHuge("running-shoes", runnersWorldIcon),
    stepIllustrationSrc: iconifyHuge("workout-run", runnersWorldIcon),
    cardIllustrationSrc: iconifyHuge("stop-watch", runnersWorldIcon),
    intro: "Build a running edition for training, shoes, races, nutrition, recovery, and motivation that fits your miles.",
    stepLabels: ["Set your miles", "Pick your run mode", "Choose your run mix", "Pick your newsletters"],
    stepDescriptions: [
      "A little context helps Runner's World tune the plan to your pace and goals.",
      "Choose the kind of running support you want first.",
      "Choose what you love and what you want to discover next.",
      "Pick the Runner's World newsletters for your run plan.",
    ],
    paths: [
      ["first", "Training plan", "Workouts, race prep, mileage, and getting stronger.", "workout-run"],
      ["second", "Shoe wall", "Shoe reviews, gear, apparel, and buying advice.", "running-shoes"],
      ["third", "Recovery and fuel", "Nutrition, injury prevention, sleep, and staying consistent.", "salad"],
    ],
    favorites: [
      ["Training", "workout-run"],
      ["Shoes", "running-shoes"],
      ["Races", "calendar-03"],
      ["Nutrition", "salad"],
      ["Recovery", "sleeping"],
      ["Motivation", "sparkles"],
    ],
    discoveries: [
      ["Beginner plans", "leaf-02"],
      ["Speed work", "stop-watch"],
      ["Long runs", "road-02"],
      ["Injury prevention", "heart-check"],
      ["Gear deals", "shopping-bag-check"],
      ["Race stories", "book-open-02"],
    ],
    newsletters: [
      ["rw-daily", "Runner's World Daily", "Training, shoes, races, nutrition, recovery, and motivation.", "mail-open"],
      ["rw-training", "Run Stronger", "Workouts, plans, race prep, recovery, and consistency tips.", "workout-run"],
      ["rw-gear", "Shoe and Gear Lab", "Shoe reviews, apparel, buying advice, and useful running gear.", "running-shoes"],
    ],
    baseTags: ["runner's world", "running", "training", "shoes", "races"],
    fallbackLocation: "Your miles",
    fallbackPriority: "Training, shoes, and recovery",
  }),
};

function unique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

export function isPublicationOnboardingBrandSlug(
  brandSlug: string | null | undefined,
): brandSlug is PublicationOnboardingBrandSlug {
  return Boolean(
    brandSlug
    && publicationOnboardingBrandSlugs.includes(brandSlug as PublicationOnboardingBrandSlug),
  );
}

function buildPublicationOnboardingResult(
  config: PublicationOnboardingConfig,
  answers: PublicationOnboardingAnswers,
): HearstOnboardingResult {
  const selectedPath = config.paths.find((path) => path.id === answers.path);
  const interests = unique([
    ...(selectedPath ? [selectedPath.title] : []),
    ...answers.favorites,
    ...answers.discoveries,
    ...answers.newsletters,
  ]);

  return {
    id: Date.now(),
    interests,
    brands: [config.brandName],
    tags: unique([
      ...config.baseTags,
      answers.location.toLowerCase(),
      ...interests.map((interest) => interest.toLowerCase()),
    ]),
  };
}

export function PublicationOnboardingModal({
  open,
  brandSlug,
  ...props
}: PublicationOnboardingModalProps) {
  const portalTarget = useBodyPortalTarget();

  if (!open || !portalTarget) return null;

  return (
    <PublicationOnboardingModalContent
      {...props}
      brandSlug={brandSlug}
      portalTarget={portalTarget}
    />
  );
}

type PublicationOnboardingModalContentProps = Omit<
  PublicationOnboardingModalProps,
  "open"
> & {
  portalTarget: HTMLElement;
};

function PublicationOnboardingModalContent({
  brandSlug,
  onClose,
  onComplete,
  onCreateProfile,
  onSignIn,
  portalTarget,
}: PublicationOnboardingModalContentProps) {
  const config = publicationOnboardingConfigs[brandSlug];
  const [step, setStep] = React.useState<1 | 2 | 3 | 4>(1);
  const [showWelcome, setShowWelcome] = React.useState(false);
  const [readerName, setReaderName] = React.useState("");
  const [readerLocation, setReaderLocation] = React.useState("");
  const [isDetectingLocation, setIsDetectingLocation] = React.useState(false);
  const [locationMessage, setLocationMessage] = React.useState("");
  const [selectedPath, setSelectedPath] = React.useState<PublicationPathId | null>(null);
  const [selectedFavorites, setSelectedFavorites] = React.useState<string[]>([]);
  const [selectedDiscoveries, setSelectedDiscoveries] = React.useState<string[]>([]);
  const [selectedNewsletterIds, setSelectedNewsletterIds] = React.useState<string[]>(() => [
    publicationOnboardingConfigs[brandSlug].newsletters[0]?.id ?? "",
  ].filter(Boolean));
  const dialogRef = React.useRef<HTMLElement | null>(null);
  const headingRef = React.useRef<HTMLHeadingElement | null>(null);
  const restoreFocusRef = React.useRef<HTMLElement | null>(null);
  const skipFocusRestoreRef = React.useRef(false);

  React.useEffect(() => {
    restoreFocusRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    return () => {
      const restoreTarget = restoreFocusRef.current;
      restoreFocusRef.current = null;
      if (!skipFocusRestoreRef.current) {
        window.requestAnimationFrame(() => restoreTarget?.focus());
      }
    };
  }, []);

  React.useEffect(() => {
    const frame = window.requestAnimationFrame(() => headingRef.current?.focus());
    return () => window.cancelAnimationFrame(frame);
  }, [showWelcome, step]);

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const dialog = dialogRef.current;
      if (!dialog) return;
      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter(
        (element) =>
          element.getAttribute("aria-hidden") !== "true"
          && !element.closest('[inert], [aria-hidden="true"]'),
      );

      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable.at(-1)!;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  useModalIsolation(true, dialogRef);

  const answers = React.useMemo<PublicationOnboardingAnswers>(() => ({
    name: readerName.trim(),
    location: readerLocation.trim(),
    path: selectedPath,
    favorites: selectedFavorites,
    discoveries: selectedDiscoveries,
    newsletters: config.newsletters
      .filter((item) => selectedNewsletterIds.includes(item.id))
      .map((item) => item.title),
  }), [config.newsletters, readerLocation, readerName, selectedDiscoveries, selectedFavorites, selectedNewsletterIds, selectedPath]);

  const toggleLimitedSelection = (
    value: string,
    setValue: React.Dispatch<React.SetStateAction<string[]>>,
    limit = 5,
  ) => {
    setValue((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : current.length < limit
          ? [...current, value]
          : current,
    );
  };

  const toggleNewsletter = (id: string) => {
    setSelectedNewsletterIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  const detectLocation = async () => {
    if (!navigator.geolocation) {
      setLocationMessage("Location detection is not supported in this browser.");
      return;
    }

    setIsDetectingLocation(true);
    setLocationMessage("Detecting your location...");

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000,
        });
      });
      const { latitude, longitude } = position.coords;

      try {
        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
        );
        if (!response.ok) throw new Error("Reverse geocoding failed");

        const data = await response.json() as {
          city?: string;
          locality?: string;
          principalSubdivision?: string;
        };

        if (data.city && data.principalSubdivision) {
          setReaderLocation(`${data.city}, ${data.principalSubdivision}`);
        } else if (data.locality) {
          setReaderLocation(data.locality);
        } else {
          setReaderLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        }
        setLocationMessage("Location added.");
      } catch {
        setReaderLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        setLocationMessage("Location added from your coordinates.");
      }
    } catch {
      setLocationMessage("Unable to detect location. You can enter it manually.");
    } finally {
      setIsDetectingLocation(false);
    }
  };

  const saveAnswers = (result: HearstOnboardingResult) => {
    try {
      window.localStorage.setItem(
        `${publicationOnboardingStorageKeyPrefix}-${config.slug}-v1`,
        JSON.stringify({ completed: true, answers, result }),
      );
    } catch {
      // The session still receives the personalization result when local storage is unavailable.
    }
  };

  const finish = (createProfile: boolean) => {
    const result = buildPublicationOnboardingResult(config, answers);
    saveAnswers(result);
    skipFocusRestoreRef.current = createProfile;
    if (createProfile) {
      onCreateProfile(result);
    } else {
      onComplete(result);
      onClose();
    }
  };

  const goToNextStep = () => setStep((current) => Math.min(4, current + 1) as 1 | 2 | 3 | 4);
  const goToPreviousStep = () => setStep((current) => Math.max(1, current - 1) as 1 | 2 | 3 | 4);

  const canContinue = step === 1
    ? readerName.trim().length > 0
    : step === 2
      ? Boolean(selectedPath)
      : step === 3
        ? selectedFavorites.length + selectedDiscoveries.length > 0
        : selectedNewsletterIds.length > 0;
  const heading = step === 1
    ? config.stepLabels.first
    : step === 2
      ? config.stepLabels.second
      : step === 3
        ? config.stepLabels.third
        : config.stepLabels.fourth;
  const description = step === 1
    ? config.stepDescriptions.first
    : step === 2
      ? config.stepDescriptions.second
      : step === 3
        ? config.stepDescriptions.third
        : config.stepDescriptions.fourth;
  const selectedPathTitle =
    config.paths.find((option) => option.id === selectedPath)?.title ?? `${config.brandName} reader`;
  const selectedNewsletterTitles = config.newsletters
    .filter((item) => selectedNewsletterIds.includes(item.id))
    .map((item) => item.title);
  const welcomeName = readerName.trim().split(/\s+/)[0] || "there";

  return createPortal(
    <div className="fixed inset-0 z-[130] flex items-center justify-center bg-[#15171D]/88 p-3 backdrop-blur-sm sm:p-6">
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${config.slug}-onboarding-title`}
        aria-describedby={`${config.slug}-onboarding-description`}
        className="relative z-10 flex max-h-[calc(100dvh-1rem)] w-full max-w-[640px] flex-col overflow-hidden rounded-[12px] bg-[var(--publication-surface)] text-[var(--publication-ink)] shadow-2xl sm:max-h-[calc(100dvh-2rem)]"
        style={{
          "--publication-primary": config.primary,
          "--publication-secondary": config.secondary,
          "--publication-ink": config.ink,
          "--publication-muted": config.muted,
          "--publication-line": config.line,
          "--publication-surface": config.surface,
          "--publication-pale": config.pale,
          fontFamily: config.bodyFont,
        } as React.CSSProperties}
      >
        <Button
          data-modal-close
          variant="outline"
          size="icon-lg"
          className="absolute right-3 top-3 z-20 size-9 rounded-full border-[var(--publication-line)] bg-white text-[var(--publication-ink)] hover:bg-[var(--publication-pale)] sm:right-4 sm:top-4"
          onClick={onClose}
          aria-label={`Close ${config.brandName} onboarding`}
        >
          <X className="size-4" aria-hidden />
        </Button>

        {showWelcome ? (
          <PublicationWelcomeStep
            config={config}
            name={welcomeName}
            cardName={readerName.trim() || `${config.brandName} Reader`}
            location={readerLocation.trim() || config.fallbackLocation}
            path={selectedPathTitle}
            favorites={selectedFavorites}
            discoveries={selectedDiscoveries}
            newsletters={selectedNewsletterTitles.length > 0 ? selectedNewsletterTitles : [config.fallbackPriority]}
            headingRef={headingRef}
            onBack={() => setShowWelcome(false)}
            onClose={() => finish(false)}
          />
        ) : (
          <>
            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
              <div className="mx-auto flex max-w-[560px] flex-col items-center">
                <PublicationStepMarker
                  config={config}
                  step={step}
                  activeIllustrationSrc={
                    step === 2 && selectedPath
                      ? config.paths.find((path) => path.id === selectedPath)?.illustrationSrc
                      : undefined
                  }
                />

                <div className="mt-3 text-center">
                  <h2
                    ref={headingRef}
                    id={`${config.slug}-onboarding-title`}
                    tabIndex={-1}
                    className="text-balance text-[1.65rem] font-black leading-[1.05] tracking-normal text-[var(--publication-primary)] outline-none sm:text-[2rem]"
                    style={{ fontFamily: config.headlineFont }}
                  >
                    {heading}
                  </h2>
                  <p
                    id={`${config.slug}-onboarding-description`}
                    className="mx-auto mt-2 max-w-[44ch] text-sm leading-5 text-[var(--publication-muted)] sm:text-base sm:leading-6"
                  >
                    {description}
                  </p>
                </div>

                {step === 1 ? (
                  <div className="mt-4 w-full rounded-[12px] bg-white px-4 py-4 shadow-[0_10px_22px_rgba(16,24,40,0.07)]">
                    <div className="mb-4 flex items-center gap-3 rounded-[10px] bg-[var(--publication-pale)] px-3 py-3 text-left">
                      <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white text-[var(--publication-primary)] shadow-[0_6px_14px_rgba(16,24,40,0.07)]">
                        <img
                          src={config.introIllustrationSrc}
                          alt=""
                          className="size-8 object-contain"
                          aria-hidden="true"
                        />
                      </span>
                      <p className="text-sm font-semibold leading-5 text-[var(--publication-ink)]">
                        {config.intro}
                      </p>
                    </div>
                    <label className="block text-sm font-semibold text-[var(--publication-ink)]">
                      What is your name?
                      <input
                        className="mt-2 h-11 w-full rounded-[9px] border border-[var(--publication-line)] bg-white px-3 text-base font-medium text-[var(--publication-ink)] outline-none transition-colors placeholder:text-[#7A828C] focus:border-[var(--publication-primary)] focus:ring-4 focus:ring-[var(--publication-secondary)]/35"
                        placeholder="Name"
                        value={readerName}
                        onChange={(event) => setReaderName(event.target.value)}
                        autoComplete="given-name"
                      />
                    </label>
                    <label className="mt-4 block text-sm font-semibold text-[var(--publication-ink)]">
                      Where should we anchor your edition? <span className="text-[var(--publication-muted)]">(Optional)</span>
                      <span className="relative mt-2 block">
                        <input
                          className="h-11 w-full rounded-[9px] border border-[var(--publication-line)] bg-white px-3 pr-11 text-base font-medium text-[var(--publication-ink)] outline-none transition-colors placeholder:text-[#7A828C] focus:border-[var(--publication-primary)] focus:ring-4 focus:ring-[var(--publication-secondary)]/35"
                          placeholder="City, region, or routine"
                          value={readerLocation}
                          onChange={(event) => {
                            setReaderLocation(event.target.value);
                            setLocationMessage("");
                          }}
                          autoComplete="address-level2"
                        />
                        <button
                          type="button"
                          className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-[var(--publication-ink)] transition-colors hover:bg-[var(--publication-pale)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--publication-primary)] disabled:cursor-wait disabled:opacity-60"
                          onClick={detectLocation}
                          disabled={isDetectingLocation}
                          aria-label={isDetectingLocation ? "Detecting location" : "Auto-detect location"}
                        >
                          <MapPin
                            className={cn("size-5", isDetectingLocation && "animate-pulse text-[var(--publication-primary)]")}
                            aria-hidden
                          />
                        </button>
                      </span>
                      {locationMessage ? (
                        <span className="mt-2 block text-sm font-semibold text-[var(--publication-muted)]" aria-live="polite">
                          {locationMessage}
                        </span>
                      ) : null}
                    </label>
                  </div>
                ) : null}

                {step === 2 ? (
                  <div className="mt-4 grid w-full gap-3 sm:grid-cols-3">
                    {config.paths.map(({ id, title, description: optionDescription, illustrationSrc }) => {
                      const selected = selectedPath === id;
                      return (
                        <button
                          key={id}
                          type="button"
                          aria-pressed={selected}
                          onClick={() => setSelectedPath(id)}
                          className={cn(
                            "group flex min-h-[112px] flex-row items-center justify-start gap-3 rounded-[10px] border bg-white p-3 text-left shadow-[0_8px_16px_rgba(16,24,40,0.04)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--publication-primary)] motion-reduce:transition-none sm:min-h-[178px] sm:flex-col sm:justify-between sm:px-4 sm:py-4 sm:text-center",
                            selected
                              ? "border-[var(--publication-primary)] text-[var(--publication-ink)] ring-2 ring-[var(--publication-primary)]/15"
                              : "border-[var(--publication-line)] text-[var(--publication-ink)] hover:border-[var(--publication-primary)]",
                          )}
                        >
                          <span className="flex min-w-0 flex-1 items-center gap-4 sm:flex-col sm:gap-0">
                            <span className={cn(
                              "flex size-16 shrink-0 items-center justify-center rounded-[14px] border text-[var(--publication-primary)] transition-colors sm:size-20",
                              selected
                                ? "border-[var(--publication-primary)] bg-[var(--publication-pale)]"
                                : "border-[var(--publication-line)] bg-[var(--publication-surface)] group-hover:bg-[var(--publication-pale)]",
                            )}>
                              <img
                                src={illustrationSrc}
                                alt=""
                                className="size-11 object-contain sm:size-14"
                                aria-hidden="true"
                              />
                            </span>
                            <span className="min-w-0 sm:mt-3">
                            <span className="block text-base font-black">{title}</span>
                            <span className="mt-1.5 block text-sm leading-5 text-[var(--publication-muted)]">
                              {optionDescription}
                            </span>
                          </span>
                          </span>
                          <span
                            className={cn(
                              "flex size-7 shrink-0 items-center justify-center rounded-full border-2 transition-colors sm:mt-3",
                              selected
                                ? "border-[var(--publication-primary)] bg-[var(--publication-primary)] text-white"
                                : "border-[var(--publication-line)] bg-white text-transparent",
                            )}
                            aria-hidden="true"
                          >
                            <Check className="size-3.5" />
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ) : null}

                {step === 3 ? (
                  <div className="mt-4 grid w-full gap-3 lg:grid-cols-2">
                    <PublicationPlateSection
                      title="Your favorites"
                      subtitle="Choose up to 5"
                      markerIllustrationSrc={config.cardIllustrationSrc}
                      options={config.favorites}
                      selected={selectedFavorites}
                      onToggle={(label) =>
                        toggleLimitedSelection(label, setSelectedFavorites)
                      }
                    />
                    <PublicationPlateSection
                      title="Discover next"
                      subtitle="Choose up to 5"
                      markerIllustrationSrc={config.stepIllustrationSrc}
                      options={config.discoveries}
                      selected={selectedDiscoveries}
                      onToggle={(label) =>
                        toggleLimitedSelection(label, setSelectedDiscoveries)
                      }
                    />
                  </div>
                ) : null}

                {step === 4 ? (
                  <div className="mt-4 w-full space-y-2.5">
                    {config.newsletters.map((newsletterOption) => (
                      <PublicationNewsletterOption
                        key={newsletterOption.id}
                        option={newsletterOption}
                        selected={selectedNewsletterIds.includes(newsletterOption.id)}
                        onToggle={() => toggleNewsletter(newsletterOption.id)}
                      />
                    ))}

                    <div className="flex items-center gap-3 rounded-[10px] bg-white px-4 py-3 text-left shadow-[0_8px_18px_rgba(16,24,40,0.05)]">
                      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[var(--publication-pale)]">
                        <img
                          src={config.cardIllustrationSrc}
                          alt=""
                          className="size-7 object-contain"
                          aria-hidden="true"
                        />
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-black text-[var(--publication-ink)]">
                          Your choices stay in this prototype
                        </p>
                        <p className="mt-0.5 text-sm leading-5 text-[var(--publication-muted)]">
                          Newsletters personalize this demo flow and keep the brand experience contextual.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            <footer className="bg-[var(--publication-surface)] px-4 pb-4 pt-1 sm:px-6">
              <div className="mx-auto grid max-w-[560px] grid-cols-2 items-center gap-3 sm:grid-cols-[140px_1fr_140px]">
                {step > 1 ? (
                  <Button
                    type="button"
                    variant="outline"
                    className="min-h-11 w-full rounded-[4px] border-[var(--publication-primary)] bg-white text-sm font-black text-[var(--publication-primary)] hover:bg-[var(--publication-pale)] hover:text-[var(--publication-primary)]"
                    onClick={goToPreviousStep}
                  >
                    <ChevronLeft className="mr-2 size-4" aria-hidden />
                    Back
                  </Button>
                ) : (
                  <div className="hidden sm:block" aria-hidden="true" />
                )}

                <button
                  type="button"
                  className="col-span-2 row-start-2 min-h-9 justify-self-center px-2 text-sm font-bold text-[var(--publication-muted)] underline underline-offset-2 hover:text-[var(--publication-ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--publication-primary)] sm:col-span-1 sm:col-start-2 sm:row-start-1"
                  onClick={() => {
                    if (step < 4) goToNextStep();
                    else setShowWelcome(true);
                  }}
                >
                  Skip this step
                </button>

                <Button
                  type="button"
                  className="min-h-11 w-full rounded-[4px] bg-[var(--publication-ink)] px-4 text-sm font-black text-white hover:bg-[var(--publication-primary)] sm:col-start-3"
                  disabled={!canContinue}
                  onClick={() => {
                    if (step < 4) goToNextStep();
                    else setShowWelcome(true);
                  }}
                >
                  {step === 4 ? "Complete" : "Next"}
                  <ChevronRight className="ml-2 size-4" aria-hidden />
                </Button>
              </div>
              {step === 1 ? (
                <button
                  type="button"
                  onClick={() => {
                    skipFocusRestoreRef.current = true;
                    onSignIn();
                  }}
                  className="mx-auto mt-3 flex min-h-9 items-center justify-center text-sm font-medium text-[var(--publication-ink)] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--publication-primary)]"
                >
                  Already have a profile? Sign in
                </button>
              ) : null}
            </footer>
          </>
        )}
      </section>
    </div>,
    portalTarget,
  );
}

function PublicationStepMarker({
  config,
  step,
  activeIllustrationSrc,
}: {
  config: PublicationOnboardingConfig;
  step: 1 | 2 | 3 | 4;
  activeIllustrationSrc?: string;
}) {
  const defaultIllustrationSrc =
    step === 4
      ? iconifyHuge("mail-open", config.primary)
      : step === 3
        ? config.cardIllustrationSrc
        : step === 2
          ? config.stepIllustrationSrc
          : config.introIllustrationSrc;
  const illustrationSrc = activeIllustrationSrc ?? defaultIllustrationSrc;

  return (
    <div
      className="flex flex-col items-center"
      aria-label={`Step ${step} of 4`}
    >
      <div className="relative h-[92px] w-[108px]" aria-hidden="true">
        <span className="absolute left-1/2 top-0 flex size-[70px] -translate-x-1/2 items-center justify-center rounded-[18px] border border-[var(--publication-line)] bg-white text-[var(--publication-primary)] shadow-[0_10px_22px_rgba(16,24,40,0.07)]">
          <span className="absolute inset-1.5 rounded-[13px] bg-[var(--publication-pale)]" aria-hidden="true" />
          <img
            src={illustrationSrc}
            alt=""
            className="relative z-10 size-12 object-contain"
            aria-hidden="true"
          />
        </span>
        <span className="absolute left-1/2 top-[54px] flex size-7 -translate-x-1/2 items-center justify-center rounded-full bg-[var(--publication-primary)] text-[0.62rem] font-black leading-none text-white shadow-[0_6px_14px_rgba(16,24,40,0.16)]">
          {step}/4
        </span>
      </div>
      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--publication-ink)]">
        Step {step}
      </p>
    </div>
  );
}

function PublicationPlateSection({
  title,
  subtitle,
  markerIllustrationSrc,
  options,
  selected,
  onToggle,
}: {
  title: string;
  subtitle: string;
  markerIllustrationSrc: string;
  options: readonly PublicationChoiceOption[];
  selected: string[];
  onToggle: (label: string) => void;
}) {
  return (
    <section className="rounded-[10px] border border-[var(--publication-line)] bg-white/95 p-3 shadow-[0_8px_18px_rgba(16,24,40,0.05)] sm:p-4">
      <div className="flex items-start gap-2.5">
        <span
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--publication-pale)]"
          aria-hidden="true"
        >
          <img
            src={markerIllustrationSrc}
            alt=""
            className="size-6 object-contain"
            aria-hidden="true"
          />
        </span>
        <div className="min-w-0 text-left">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--publication-primary)]">
            {title}
          </p>
          <p className="mt-0.5 text-xs font-medium text-[var(--publication-muted)]">{subtitle}</p>
        </div>
      </div>
      <div className="mt-3 grid gap-2">
        {options.map(({ label, illustrationSrc }) => {
          const isSelected = selected.includes(label);
          const limitReached = selected.length >= 5 && !isSelected;

          return (
            <button
              key={label}
              type="button"
              disabled={limitReached}
              aria-pressed={isSelected}
              onClick={() => onToggle(label)}
              className={cn(
                "flex min-h-10 items-center gap-2.5 rounded-[8px] border bg-white px-3 py-2 text-left text-sm font-bold text-[var(--publication-ink)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--publication-primary)] disabled:cursor-not-allowed disabled:opacity-45 motion-reduce:transition-none",
                isSelected
                  ? "border-[var(--publication-primary)] bg-[var(--publication-pale)]"
                  : "border-[var(--publication-line)] hover:border-[var(--publication-primary)]",
              )}
            >
              <span
                className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--publication-surface)]"
                aria-hidden="true"
              >
                <img
                  src={illustrationSrc}
                  alt=""
                  className="size-5.5 object-contain"
                  aria-hidden="true"
                />
              </span>
              <span className="min-w-0 flex-1">{label}</span>
              <span
                className={cn(
                  "flex size-5.5 shrink-0 items-center justify-center rounded-full border-2",
                  isSelected
                    ? "border-[var(--publication-primary)] bg-[var(--publication-primary)]"
                    : "border-[var(--publication-line)] bg-white",
                )}
                aria-hidden="true"
              >
                {isSelected ? <Check className="size-3 text-white" /> : null}
              </span>
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-xs font-semibold text-[var(--publication-muted)]" aria-live="polite">
        {selected.length} of 5 selected
      </p>
    </section>
  );
}

function PublicationNewsletterOption({
  option,
  selected,
  onToggle,
}: {
  option: PublicationNewsletterOption;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onToggle}
      className={cn(
        "flex w-full items-center gap-3 rounded-[10px] border bg-white px-4 py-3 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--publication-primary)] motion-reduce:transition-none",
        selected
          ? "border-[var(--publication-primary)] bg-[var(--publication-pale)]"
          : "border-[var(--publication-line)] hover:border-[var(--publication-primary)]",
      )}
    >
      <img
        src={option.illustrationSrc}
        alt=""
        className="size-12 shrink-0 object-contain sm:size-[52px]"
        aria-hidden="true"
      />
      <span
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-[6px] border-2 transition-colors",
          selected
            ? "border-[var(--publication-primary)] bg-[var(--publication-primary)] text-white"
            : "border-[var(--publication-line)] bg-white text-transparent",
        )}
        aria-hidden="true"
      >
        <Check className="size-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-base font-black leading-tight text-[var(--publication-ink)] sm:text-lg">
          {option.title}
        </span>
        <span className="mt-1 block max-w-[42ch] text-sm leading-5 text-[var(--publication-muted)]">
          {option.description}
        </span>
      </span>
    </button>
  );
}

function PublicationWelcomeStep({
  config,
  name,
  cardName,
  location,
  path,
  favorites,
  discoveries,
  newsletters,
  headingRef,
  onBack,
  onClose,
}: {
  config: PublicationOnboardingConfig;
  name: string;
  cardName: string;
  location: string;
  path: string;
  favorites: string[];
  discoveries: string[];
  newsletters: string[];
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  onBack: () => void;
  onClose: () => void;
}) {
  return (
    <>
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
        <div className="mx-auto flex max-w-[560px] flex-col items-center text-center">
          <BrandLogo
            slug={config.slug}
            color={config.ink}
            decorative
            className="w-[150px] max-w-[64%] [&_svg]:h-auto [&_svg]:w-full sm:w-[190px]"
          />
          <h2
            ref={headingRef}
            id={`${config.slug}-onboarding-title`}
            tabIndex={-1}
            className="mt-4 text-balance text-[1.9rem] font-black leading-[1.03] tracking-normal text-[var(--publication-ink)] outline-none sm:text-[2.4rem]"
            style={{ fontFamily: config.headlineFont }}
          >
            Welcome, {name}.
          </h2>
          <p
            id={`${config.slug}-onboarding-description`}
            className="mt-2 text-base leading-6 text-[var(--publication-muted)] sm:text-lg"
          >
            Your {config.brandName} edition is ready.
          </p>
          <div className="mt-5 w-full max-w-[500px]">
            <PublicationMembershipCard
              config={config}
              name={cardName}
              location={location}
              path={path}
              favorites={favorites}
              discoveries={discoveries}
              newsletters={newsletters}
            />
          </div>
        </div>
      </div>
      <footer className="bg-[var(--publication-surface)] px-4 pb-4 pt-1 sm:px-6">
        <div className="mx-auto grid max-w-[560px] grid-cols-2 gap-3">
          <Button
            type="button"
            variant="outline"
            className="min-h-11 rounded-[4px] border-[var(--publication-line)] bg-white text-sm font-black text-[var(--publication-muted)] hover:bg-white hover:text-[var(--publication-ink)]"
            onClick={onBack}
          >
            <ChevronLeft className="mr-2 size-4" aria-hidden />
            Back
          </Button>
          <Button
            type="button"
            className="min-h-11 rounded-[4px] bg-[var(--publication-ink)] px-4 text-sm font-black text-white hover:bg-[var(--publication-primary)]"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </footer>
    </>
  );
}

function PublicationMembershipCard({
  config,
  name,
  location,
  path,
  favorites,
  discoveries,
  newsletters,
}: {
  config: PublicationOnboardingConfig;
  name: string;
  location: string;
  path: string;
  favorites: string[];
  discoveries: string[];
  newsletters: string[];
}) {
  const firstFavorites = favorites.length > 0 ? favorites.join(", ") : "New favorites";
  const firstDiscoveries = discoveries.length > 0 ? discoveries.join(", ") : "Fresh ideas";
  const firstNewsletters = newsletters.length > 0 ? newsletters.join(", ") : config.fallbackPriority;

  return (
    <section className="relative min-h-[250px] overflow-hidden rounded-[14px] bg-[var(--publication-ink)] p-5 text-white shadow-[0_12px_26px_rgba(0,0,0,0.24)] sm:min-h-[280px] sm:p-6">
      <div className="absolute -right-12 -top-12 size-36 rounded-full bg-[var(--publication-primary)]/65" aria-hidden />
      <div className="absolute -bottom-16 left-8 size-44 rounded-full bg-[var(--publication-secondary)]/25" aria-hidden />
      <div className="relative z-10 flex h-full flex-col">
        <div className="flex items-center gap-3">
          <div className="flex size-[52px] shrink-0 items-center justify-center rounded-[10px] bg-white text-[1.25rem] font-black leading-none text-[var(--publication-ink)] sm:size-14">
            {config.brandName
              .split(/\s+/)
              .map((word) => word[0])
              .join("")
              .slice(0, 3)}
          </div>
          <div className="text-left">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[var(--publication-secondary)]">
              {config.brandName}
            </p>
            <h3
              className="mt-1 text-2xl font-black leading-none text-white sm:text-[1.75rem]"
              style={{ fontFamily: config.headlineFont }}
            >
              {config.cardTitle}
            </h3>
          </div>
        </div>
        <div className="mt-8 grid gap-4 text-left sm:mt-12 sm:grid-cols-2">
          <CardDetail label="Name" value={name} />
          <CardDetail label="Anchor" value={location} />
          <CardDetail label="Reader mode" value={path} />
          <CardDetail label="Favorites" value={firstFavorites} />
          <CardDetail label="Discover next" value={firstDiscoveries} />
          <CardDetail label="Newsletters" value={firstNewsletters} />
        </div>
        <img
          src={config.cardIllustrationSrc}
          alt=""
          className="pointer-events-none absolute bottom-4 right-4 size-20 object-contain opacity-15"
          aria-hidden="true"
        />
      </div>
    </section>
  );
}

function CardDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 text-left">
      <p className="text-xs font-bold text-white/60">{label}</p>
      <p className="mt-1 break-words text-base font-black leading-tight text-white">{value}</p>
    </div>
  );
}
