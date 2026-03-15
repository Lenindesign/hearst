"use client";

import { useTheme } from "./theme-provider";
import { NavBar } from "./nav-bar";
import { BrandLogo } from "./brand-logo";
import { brandLogos } from "@/lib/logos";

const U = "https://images.unsplash.com/photo-";
const H = "https://hips.hearstapps.com/hmg-prod/images/";

const BRAND_IMAGES: Record<string, { hero: string; articles: string[]; rightRail: string[]; trending: string[] }> = {
  "cosmopolitan": {
    hero: `${H}4ab85a6b-6eec-4e56-bdf6-4160a18d9f16.jpeg?crop=0.666xw:1xh;center,top&resize=800:*`,
    articles: [`${H}1b035abd-5197-4304-9386-edb1487ae42e.jpeg?crop=0.763xw:0.509xh;0.11xw,0.071xh&resize=144:*`, `${H}gettyimages-1388107982.jpg?crop=0.829xw:0.553xh;0.087xw,0.093xh&resize=144:*`, `${H}e6f741c3-d2bf-4373-99f3-44b3148c4e1f.jpg?crop=0.666xw:1xh;center,top&resize=144:*`, `${H}kpop-demun-hunters-netflix-68cc1c468e61e.jpg?crop=0.5625xw:1xh;center,top&resize=144:*`, `${H}7342062a-3326-4139-b9bc-49f983bbc96a.jpg?crop=0.497xw:1.00xh;0,0&resize=144:*`],
    rightRail: [`${H}0a2c9db9-552a-469f-9056-46bcb2d1821b.png?crop=0.546xw:0.820xh;0.215xw,0.115xh&resize=200:*`, `${H}8dc0eba4-f459-4500-8a67-87281798dc07.jpg?crop=0.578xw:0.85xh;0.104xw,0.035xh&resize=200:*`, `${H}b8768d08-0199-4472-9913-c19f459daea4.jpeg?crop=0.5625xw:1xh;center,top&resize=200:*`, `${H}screenshot-2026-03-04-at-9-15-02-am-69a83e6a0923f.png?crop=1.00xw:0.798xh;0,0.0611xh&resize=200:*`],
    trending: [`${H}4ab85a6b-6eec-4e56-bdf6-4160a18d9f16.jpeg?crop=0.666xw:1xh;center,top&resize=366:*`, `${H}1b035abd-5197-4304-9386-edb1487ae42e.jpeg?crop=0.763xw:0.509xh;0.11xw,0.071xh&resize=366:*`, `${H}e6f741c3-d2bf-4373-99f3-44b3148c4e1f.jpg?crop=0.666xw:1xh;center,top&resize=366:*`, `${H}kpop-demun-hunters-netflix-68cc1c468e61e.jpg?crop=0.5625xw:1xh;center,top&resize=366:*`, `${H}7342062a-3326-4139-b9bc-49f983bbc96a.jpg?crop=0.497xw:1.00xh;0,0&resize=366:*`],
  },
  "esquire": {
    hero: `${H}6881a9bd-f2c5-4f85-bc6c-169db8285f80.jpeg?crop=0.502xw:0.752xh;0.0785xw,0.00240xh&resize=800:*`,
    articles: [`${H}6d739791-b3b2-4a23-8472-5b254c2af1a2.jpg?crop=0.413xw:0.620xh;0.288xw,0.293xh&resize=144:*`, `${H}28ae9e6e-1fb6-40a8-af31-72b1b3184e1a.jpg?crop=0.502xw:1.00xh;0.255xw,0&resize=144:*`, `${H}f92e30be-61ad-4691-835d-2f398e2036f8.jpeg?crop=0.666xw:1xh;center,top&resize=144:*`, `${H}a86491fd-c67c-43b3-82db-908d7b81c1e7.jpeg?crop=0.317xw:0.753xh;0.452xw,0&resize=144:*`, `${H}screenshot-2025-12-11-at-10-29-57-am-693ae37c0d460.png?crop=0.418xw:1.00xh;0.405xw,0&resize=144:*`],
    rightRail: [`${H}86717c1a-dce6-40ae-87f9-c7ebf2632a42.jpg?crop=0.502xw:1.00xh;0.251xw,0&resize=200:*`, `${H}624cfb51-2992-4519-8292-619466d2882a.jpeg?crop=0.356xw:1.00xh;0.396xw,0&resize=200:*`, `${H}7931e7c9-a5cb-4377-82d2-b598fad37cda.jpeg?crop=0.624xw:0.936xh;0,0&resize=200:*`, `${H}f225bc1c-3959-433f-8a10-17ebe1bf134d.jpg?crop=0.492xw:0.984xh;0,0&resize=200:*`],
    trending: [`${H}6881a9bd-f2c5-4f85-bc6c-169db8285f80.jpeg?crop=0.502xw:0.752xh;0.0785xw,0.00240xh&resize=366:*`, `${H}6d739791-b3b2-4a23-8472-5b254c2af1a2.jpg?crop=0.413xw:0.620xh;0.288xw,0.293xh&resize=366:*`, `${H}f92e30be-61ad-4691-835d-2f398e2036f8.jpeg?crop=0.666xw:1xh;center,top&resize=366:*`, `${H}a86491fd-c67c-43b3-82db-908d7b81c1e7.jpeg?crop=0.317xw:0.753xh;0.452xw,0&resize=366:*`, `${H}86717c1a-dce6-40ae-87f9-c7ebf2632a42.jpg?crop=0.502xw:1.00xh;0.251xw,0&resize=366:*`],
  },
  "car-and-driver": {
    hero: `${H}0016c2fa-7eab-48f6-a699-08bb611535c4.jpg?crop=0.655xw:0.983xh;0.127xw,0&resize=800:*`,
    articles: [
      `${H}d10bac7a-1607-4cc9-809e-1cc5ef8ca2b0.jpg?crop=0.592xw:0.888xh;0.176xw,0.112xh&resize=144:*`,
      `${H}bb08c514-0be0-4aa0-bc6c-10cdbdf1f862.jpg?crop=1.00xw:0.751xh;0,0.145xh&resize=144:*`,
      `${H}buick-wildcat-ev-concept-007-1662311042.jpg?crop=0.668xw:1.00xh;0.167xw,0&resize=144:*`,
      `${H}1f2c5f4e-77e0-487a-b101-ffb8c4294219.jpg?crop=0.420xw:0.936xh;0.162xw,0&resize=144:*`,
      `${H}2023-toyota-highlander-platinum-awd-590-edit-2-6413798219230.jpg?crop=0.668xw:1.00xh;0.167xw,0&resize=144:*`,
    ],
    rightRail: [
      `${H}2025-ram-1500-big-horn-crew-cab-141-67d9a190d3f57.jpg?crop=0.671xw:1.00xh;0.148xw,0&resize=200:*`,
      `${H}1d94a00b-1a22-46f6-8152-703d94d0e526.jpg?crop=0.669xw:1.00xh;0.168xw,0&resize=200:*`,
      `${H}bb6f0f5c-4710-4d1c-ac17-94ab1b0b4164.jpg?crop=0.700xw:0.932xh;0.159xw,0.0684xh&resize=200:*`,
      `${H}ext-design-04-659ec4b5164d4.jpg?crop=0.5625xw:1xh;center,top&resize=200:*`,
    ],
    trending: [
      `${H}2026-porsche-911-turbo-s-104-69a8567611f3c.jpg?crop=0.601xw:0.901xh;0.258xw,0.0817xh&resize=366:*`,
      `${H}2026-dodge-charger-r-t-116-69aae7ec2f465.jpg?crop=0.669xw:1.00xh;0.168xw,0&resize=366:*`,
      `${H}2027-chevrolet-bolt-103-69ab46d4288bf.jpg?crop=0.593xw:0.890xh;0.228xw,0.110xh&resize=366:*`,
      `${H}2024-chevrolet-trax-activ-11243-69270fce67228.jpg?crop=0.669xw:1.00xh;0.124xw,0&resize=366:*`,
      `${H}2024-mazda-cx-90-lt-104-695c143b0d8ef.jpg?crop=0.655xw:0.986xh;0.171xw,0&resize=366:*`,
    ],
  },
  "elle": {
    hero: `${H}sarah-michelle-gellar-attends-the-30th-annual-critics-news-photo-1739124331.pjpeg?crop=0.668xw:1.00xh;0.159xw,0&resize=800:*`,
    articles: [`${H}826ef8ee-b1bc-46de-8128-10e7290f1845.jpeg?crop=0.698xw:1xh;0.183xw,0xh&resize=144:*`, `${H}26db7f38-4797-4bee-bd80-50b41aa0f244.jpg?crop=0.666xw:1xh;center,top&resize=144:*`, `${H}89d32ad3-a2fa-4b10-9e26-5fdb54d8c8fd.jpeg?crop=0.667xw:1xh;0.144xw,0xh&resize=144:*`, `${H}eccda6ca-2efc-41b1-bf81-b3f4bbe8937d.jpeg?crop=0.411xw:0.73xh;0.461xw,0.13xh&resize=144:*`, `${H}88e0f8d3-2ec5-4636-af87-b3106cfc628a.jpeg?crop=0.667xw:1xh;0.198xw,0xh&resize=144:*`],
    rightRail: [`${H}f98034af-095a-468b-86a8-e028b1ed75d4.jpg?crop=0.502xw:1.00xh;0.250xw,0&resize=200:*`, `${H}6309d704-cb9d-49a3-9b73-73d4e7880818.jpeg?crop=0.666xw:1xh;0.101xw,0xh&resize=200:*`, `${H}7d331360-8530-4a7e-9866-7208367829bd.png?crop=1xw:0.8xh;0xw,0.055xh&resize=200:*`, `${H}ef2c488c-d462-4a55-b214-9354e18562fc.jpg?crop=0.548xw:1xh;center,top&resize=200:*`],
    trending: [`${H}sarah-michelle-gellar-attends-the-30th-annual-critics-news-photo-1739124331.pjpeg?crop=0.668xw:1.00xh;0.159xw,0&resize=366:*`, `${H}826ef8ee-b1bc-46de-8128-10e7290f1845.jpeg?crop=0.698xw:1xh;0.183xw,0xh&resize=366:*`, `${H}89d32ad3-a2fa-4b10-9e26-5fdb54d8c8fd.jpeg?crop=0.667xw:1xh;0.144xw,0xh&resize=366:*`, `${H}eccda6ca-2efc-41b1-bf81-b3f4bbe8937d.jpeg?crop=0.411xw:0.73xh;0.461xw,0.13xh&resize=366:*`, `${H}f98034af-095a-468b-86a8-e028b1ed75d4.jpg?crop=0.502xw:1.00xh;0.250xw,0&resize=366:*`],
  },
  "harpers-bazaar": {
    hero: `${H}36bc7a73-362e-4f4f-be3e-a975b3676826.jpeg?crop=1.00xw:0.668xh;0,0.0353xh&resize=800:*`,
    articles: [`${H}0223-mauve-00-699c9971983a6.gif?crop=0.566xw:1.00xh;0,0&resize=144:*`, `${H}7e5a3a41-c343-44f5-962a-d07f50950d46.jpg?crop=0.5624xw:1xh;center,top&resize=144:*`, `${H}two-off-white-color-bathrobes-hanging-in-warmly-royalty-free-image-1772814686.pjpeg?crop=0.668xw:1.00xh;0.167xw,0&resize=144:*`, `${H}3acbb134-da8e-4e68-9d98-bd0b42a000ff.jpg?crop=0.563xw:1.00xh;0.0329xw,0&resize=144:*`, `${H}3b52d965-c966-4d05-84cd-5c7dcb1ebf4c.jpeg?crop=0.742xw:1.00xh;0.0465xw,0&resize=144:*`],
    rightRail: [`${H}2d2497cf-6f9c-4fbd-beff-507032c0b079.jpg?crop=0.5623xw:1xh;center,top&resize=200:*`, `${H}c14fb5f2-1060-4a6a-a801-07674c31f065.jpg?crop=0.5625xw:1xh;center,top&resize=200:*`, `${H}12f00499-a0e8-4a75-830d-5dfb11884354.jpg?crop=0.5624xw:1xh;center,top&resize=200:*`, `${H}hbz030126wellaccessories-012-69af2cc817b0b.jpg?crop=1.00xw:0.820xh;0,0.0734xh&resize=200:*`],
    trending: [`${H}36bc7a73-362e-4f4f-be3e-a975b3676826.jpeg?crop=1.00xw:0.668xh;0,0.0353xh&resize=366:*`, `${H}7e5a3a41-c343-44f5-962a-d07f50950d46.jpg?crop=0.5624xw:1xh;center,top&resize=366:*`, `${H}3acbb134-da8e-4e68-9d98-bd0b42a000ff.jpg?crop=0.563xw:1.00xh;0.0329xw,0&resize=366:*`, `${H}3b52d965-c966-4d05-84cd-5c7dcb1ebf4c.jpeg?crop=0.742xw:1.00xh;0.0465xw,0&resize=366:*`, `${H}2d2497cf-6f9c-4fbd-beff-507032c0b079.jpg?crop=0.5623xw:1xh;center,top&resize=366:*`],
  },
  "good-housekeeping": {
    hero: `${H}ghk-index-espressocoffeecombo-104-web-659b457957f47.jpg?crop=0.671xw:1.00xh;0.169xw,0&resize=800:*`,
    articles: [`${H}ghk-2-up-template-4-67099f555534a.png?crop=0.502xw:1.00xh;0,0&resize=144:*`, `${H}8e00c74c-5dc8-41a4-ad99-c54bfae9eacb.jpg?crop=0.669xw:1.00xh;0.164xw,0&resize=144:*`, `${H}50e8e6fc-9763-48f4-b9f8-4370de220127.jpg?crop=0.666xw:1xh;center,top&resize=144:*`, `${H}865aaee7-9c44-4b32-b305-059dbb6a011f.jpg?crop=0.669xw:1.00xh;0.166xw,0&resize=144:*`, `${H}689518ed-e030-417d-8718-dbae4b86b210.png?crop=0.266xw:0.509xh;0.368xw,0.034xh&resize=144:*`],
    rightRail: [`${H}bedding-awards-index-69ab12c972312.jpg?crop=0.502xw:1.00xh;0.250xw,0&resize=200:*`, `${H}1daf5125-c0ed-40bc-9310-0697c23cc449.png?crop=0.502xw:1.00xh;0.250xw,0&resize=200:*`, `${H}202c005d-bfad-43d6-a77f-ac7779c70b22.jpeg?crop=0.752xw:1.00xh;0.125xw,0&resize=200:*`, `${H}gh-bathroom-remodel-ideas-1676671857.png?crop=0.470xw:0.939xh;0.0385xw,0.0353xh&resize=200:*`],
    trending: [`${H}ghk-index-espressocoffeecombo-104-web-659b457957f47.jpg?crop=0.671xw:1.00xh;0.169xw,0&resize=366:*`, `${H}8e00c74c-5dc8-41a4-ad99-c54bfae9eacb.jpg?crop=0.669xw:1.00xh;0.164xw,0&resize=366:*`, `${H}865aaee7-9c44-4b32-b305-059dbb6a011f.jpg?crop=0.669xw:1.00xh;0.166xw,0&resize=366:*`, `${H}bedding-awards-index-69ab12c972312.jpg?crop=0.502xw:1.00xh;0.250xw,0&resize=366:*`, `${H}202c005d-bfad-43d6-a77f-ac7779c70b22.jpeg?crop=0.752xw:1.00xh;0.125xw,0&resize=366:*`],
  },
  "country-living": {
    hero: `${H}6f324cc1-2238-4f3f-a7c9-e9a9bf59f7b3.jpg?crop=0.5xw:1xh;0xw,0xh&resize=800:*`,
    articles: [`${H}clx020125wellford-003-68703564d1adc.jpg?crop=0.749xw:1xh;center,top&resize=144:*`, `${H}3aef92d2-bffc-44fe-933c-2aecbe1f3fe8.jpeg?crop=0.436xw:0.622xh;0.49xw,0.23xh&resize=144:*`, `${H}87507b5f-4886-4276-a634-51fef448deef.jpg?crop=0.5xw:1xh;center,top&resize=144:*`, `${H}the-lake-effect-bedroom-0718-1533330498.jpg?crop=0.740xw:0.917xh;0.178xw,0.0496xh&resize=144:*`, `${H}693e9818-9b0c-4cb0-86c2-45d987c170da.jpg?crop=0.666xw:1xh;center,top&resize=144:*`],
    rightRail: [`${H}3188abcc-f748-4273-9624-071a52976c49.jpg?crop=1xw:0.772xh;center,top&resize=200:*`, `${H}beaac1b7-3259-4c23-ae4e-5916c6fd2d46.jpg?crop=1xw:0.911xh;0xw,0.035xh&resize=200:*`, `${H}salway-new-york-farmhouse-bedroom-677876ec1fa09.jpg?crop=0.692xw:1.00xh;0.308xw,0&resize=200:*`, `${H}salway-new-york-farmhouse-bedroom-677876ec1fa09.jpg?crop=0.652xw:0.944xh;0.005xw,0.056xh&resize=200:*`],
    trending: [`${H}6f324cc1-2238-4f3f-a7c9-e9a9bf59f7b3.jpg?crop=0.5xw:1xh;0xw,0xh&resize=366:*`, `${H}clx020125wellford-003-68703564d1adc.jpg?crop=0.749xw:1xh;center,top&resize=366:*`, `${H}87507b5f-4886-4276-a634-51fef448deef.jpg?crop=0.5xw:1xh;center,top&resize=366:*`, `${H}693e9818-9b0c-4cb0-86c2-45d987c170da.jpg?crop=0.666xw:1xh;center,top&resize=366:*`, `${H}3188abcc-f748-4273-9624-071a52976c49.jpg?crop=1xw:0.772xh;center,top&resize=366:*`],
  },
  "delish": {
    hero: `${H}pistachio-tiramisu-index-web-3646-jg-del029926-69a7406a37468.jpg?crop=0.499xw:1xh;center,top&resize=800:*`,
    articles: [`${H}sweet-potato-couscous-sunshine-bowls-index-679432a9e1970.jpg?crop=0.503xw:1.00xh;0.0433xw,0&resize=144:*`, `${H}547251bc-b6aa-4730-ac6e-6f91204fef8c.jpeg?crop=0.562xw:1xh;center,top&resize=144:*`, `${H}lemon-asparagus-pasta-index-68028140c6837.jpeg?crop=0.564xw:1.00xh;0.191xw,0&resize=144:*`, `${H}baked-feta-frittata-index-67d0a3bc32a6a.jpg?crop=0.503xw:1.00xh;0.449xw,0&resize=144:*`, `${H}703be5b0-2d02-4f7a-9033-fd6e7509337c.jpg?crop=0.502xw:1.00xh;0,0&resize=144:*`],
    rightRail: [`${H}lucktini-index-web-3452-del029926-jg-69a9b5fa4c4af.jpg?crop=0.500xw:1xh;center,top&resize=200:*`, `${H}228295eb-db45-4e4b-b583-d16b36bfc531.jpg?crop=0.503xw:1.00xh;0.199xw,0&resize=200:*`, `${H}4c30bcd1-e449-4cc3-9749-612a3e96bf56.jpg?crop=0.503xw:1.00xh;0.249xw,0&resize=200:*`, `${H}shrimp-scampi-index-644c0ade03d01.jpg?crop=0.500xw:1.00xh;0.254xw,0&resize=200:*`],
    trending: [`${H}pistachio-tiramisu-index-web-3646-jg-del029926-69a7406a37468.jpg?crop=0.499xw:1xh;center,top&resize=366:*`, `${H}547251bc-b6aa-4730-ac6e-6f91204fef8c.jpeg?crop=0.562xw:1xh;center,top&resize=366:*`, `${H}lemon-asparagus-pasta-index-68028140c6837.jpeg?crop=0.564xw:1.00xh;0.191xw,0&resize=366:*`, `${H}703be5b0-2d02-4f7a-9033-fd6e7509337c.jpg?crop=0.502xw:1.00xh;0,0&resize=366:*`, `${H}lucktini-index-web-3452-del029926-jg-69a9b5fa4c4af.jpg?crop=0.500xw:1xh;center,top&resize=366:*`],
  },
  "mens-health": {
    hero: `${H}7798fc9d-f6f0-4afc-aad9-ad70f6f07633.jpg?crop=0.383xw:0.766xh;0.563xw,0.0483xh&resize=800:*`,
    articles: [`${H}cc1793fa-5440-4ada-b6a0-a8fc75f28ae5.jpg?crop=0.422xw:0.633xh;0.217xw,0.174xh&resize=144:*`, `${H}ad0b9da5-8286-4be8-b6b2-dac651443b65.jpg?crop=0.501xw:1.00xh;0.237xw,0&resize=144:*`, `${H}f018cffd-dfda-47ab-9def-ccd9d5c5adc7.jpg?crop=0.493xw:0.984xh;0.246xw,0&resize=144:*`, `${H}1f45aa6b-da3c-49e0-a386-562843616241.jpg?crop=0.5xw:1xh;center,top&resize=144:*`, `${H}mh-mr-porter-lede-image2-69aefcd8ddb0e.jpg?crop=0.500xw:1.00xh;0.500xw,0&resize=144:*`],
    rightRail: [`${H}4fe2b5cf-8713-4bcc-b8c8-540b5acd2700.jpg?crop=0.5xw:1xh;center,top&resize=200:*`, `${H}eb7891a2-f2cc-46e4-b797-37870cd05793.jpg?crop=0.516xw:0.917xh;0.236xw,0.0456xh&resize=200:*`, `${H}menathome-69aef00db5de7.jpg?crop=0.5xw:1xh;center,top&resize=200:*`, `${H}mh-6-26-form-check-2-667c7871a2628.png?crop=0.502xw:1.00xh;0.250xw,0&resize=200:*`],
    trending: [`${H}7798fc9d-f6f0-4afc-aad9-ad70f6f07633.jpg?crop=0.383xw:0.766xh;0.563xw,0.0483xh&resize=366:*`, `${H}ad0b9da5-8286-4be8-b6b2-dac651443b65.jpg?crop=0.501xw:1.00xh;0.237xw,0&resize=366:*`, `${H}1f45aa6b-da3c-49e0-a386-562843616241.jpg?crop=0.5xw:1xh;center,top&resize=366:*`, `${H}4fe2b5cf-8713-4bcc-b8c8-540b5acd2700.jpg?crop=0.5xw:1xh;center,top&resize=366:*`, `${H}mh-mr-porter-lede-image2-69aefcd8ddb0e.jpg?crop=0.500xw:1.00xh;0.500xw,0&resize=366:*`],
  },
  "house-beautiful": {
    hero: `${H}53bef857-0f56-4bbe-a0be-60f51d27ed82.jpg?crop=0.667xw:1xh;center,top&resize=800:*`,
    articles: [`${H}0e29ce4a-2bb4-4377-970d-e59e9abf2c42.jpeg?crop=0.665xw:1xh;center,top&resize=144:*`, `${H}hbx110125wh-leahoconnell-008-68e6c1cc1563e.jpg?crop=0.904xw:0.679xh;0,0.177xh&resize=144:*`, `${H}000ddf13-f1f2-473e-8657-aaa6ed9a5c1c.jpg?crop=0.500xw:1.00xh;0.252xw,0&resize=144:*`, `${H}ht23-phgievesanderson-nina-garbrias-crosby-250-r1-667ad3eeb54ed.jpg?crop=1xw:0.799xh;center,top&resize=144:*`, `${H}eb83148e-51af-4f17-b048-7affa3bf6f55.jpg?crop=0.693xw:1xh;center,top&resize=144:*`],
    rightRail: [`${H}300e1b6e-b588-45fd-97a5-ca451c9683f0.jpg?crop=1xw:0.75xh;0xw,0.147xh&resize=200:*`, `${H}9ad2bf4a-059b-4e4e-838b-69995ff60125.jpg?crop=0.699xw:1xh;0.116xw,0xh&resize=200:*`, `${H}canvasflow/D251E0A0-5A6D-4708-8FB0097B0064A73D.jpg?crop=0.659xw:1xh;center,top&resize=200:*`, `${H}hbx100125dig-leannefordrt-012-68f9374c71c7e.jpg?crop=0.755xw:1.00xh;0.103xw,0&resize=200:*`],
    trending: [`${H}53bef857-0f56-4bbe-a0be-60f51d27ed82.jpg?crop=0.667xw:1xh;center,top&resize=366:*`, `${H}0e29ce4a-2bb4-4377-970d-e59e9abf2c42.jpeg?crop=0.665xw:1xh;center,top&resize=366:*`, `${H}000ddf13-f1f2-473e-8657-aaa6ed9a5c1c.jpg?crop=0.500xw:1.00xh;0.252xw,0&resize=366:*`, `${H}eb83148e-51af-4f17-b048-7affa3bf6f55.jpg?crop=0.693xw:1xh;center,top&resize=366:*`, `${H}300e1b6e-b588-45fd-97a5-ca451c9683f0.jpg?crop=1xw:0.75xh;0xw,0.147xh&resize=366:*`],
  },
  "bicycling": {
    hero: `${H}b80a4307-ab4f-4ecd-a2c5-c11a073b80dd.jpg?crop=0.666xw:1xh;center,top&resize=800:*`,
    articles: [`${H}twh05555-695e02faa8e71.jpeg?crop=0.669xw:1.00xh;0.178xw,0&resize=144:*`, `${H}trevor-beer-0055-preview-64f8799278c1e.jpg?crop=0.532xw:0.798xh;0.202xw,0&resize=144:*`, `${H}goty-2025-avinox-mp-3-691b9be29d720.jpg?crop=0.667xw:1xh;0.22xw,0xh&resize=144:*`, `${H}375349a7-f128-46b1-ae66-5cd2c5819c2a.jpg?crop=0.666xw:1xh;center,top&resize=144:*`, `${H}ride-stronger-marquee-0977-69121520d3708.jpg?crop=0.669xw:1.00xh;0.0977xw,0&resize=144:*`],
    rightRail: [`${H}ride-stronger-marquee-1686-691215262379c.jpg?crop=0.634xw:0.951xh;0.204xw,0.0318xh&resize=200:*`, `${H}ride-stronger-marquee-0707-6912151fae7e1.jpg?crop=0.670xw:1.00xh;0.167xw,0&resize=200:*`, `${H}ride-stronger-marquee-1626-6912151d90f1d.jpg?crop=0.661xw:0.993xh;0.164xw,0.00733xh&resize=200:*`, `${H}fe0cd244-9455-4aa8-a49b-55814b41da4e.jpg?crop=0.666xw:1xh;center,top&resize=200:*`],
    trending: [`${H}b80a4307-ab4f-4ecd-a2c5-c11a073b80dd.jpg?crop=0.666xw:1xh;center,top&resize=366:*`, `${H}twh05555-695e02faa8e71.jpeg?crop=0.669xw:1.00xh;0.178xw,0&resize=366:*`, `${H}goty-2025-avinox-mp-3-691b9be29d720.jpg?crop=0.667xw:1xh;0.22xw,0xh&resize=366:*`, `${H}375349a7-f128-46b1-ae66-5cd2c5819c2a.jpg?crop=0.666xw:1xh;center,top&resize=366:*`, `${H}fe0cd244-9455-4aa8-a49b-55814b41da4e.jpg?crop=0.666xw:1xh;center,top&resize=366:*`],
  },
  "runners-world": {
    hero: `${H}1701a425-3191-4827-be44-e9ad9f182ef6.jpg?crop=0.628xw:1xh;center,top&resize=800:*`,
    articles: [`${H}4981f167-acc0-47a6-ac3d-6ad5d15bb2ba.jpg?crop=0.670xw:1.00xh;0.167xw,0&resize=144:*`, `${H}ba200192-fda5-4667-8a89-37f683390cba.jpeg?crop=0.666xw:1xh;center,top&resize=144:*`, `${H}eb071826-fb73-4250-8f6a-63e69fdd985d.jpg?crop=0.675xw:1xh;0.181xw,0xh&resize=144:*`, `${H}9c4e52f9-9897-4acb-9155-77ba55660295.jpg?crop=0.5xw:1xh;center,top&resize=144:*`, `${H}636099c8-0493-4f62-bcb1-d7e84b17098f.jpg?crop=0.521xw:0.927xh;0.309xw,0.044xh&resize=144:*`],
    rightRail: [`${H}30003b16-a832-430e-a23b-c70b5ede781f.jpg?crop=0.563xw:0.844xh;0.246xw,0.041xh&resize=200:*`, `${H}50plus-wolff-3-698b767a29338.jpg?crop=0.603xw:0.903xh;0.196xw,0.034xh&resize=200:*`, `${H}50plus-wolff-2-698b767a26e0f.jpg?crop=0.642xw:0.963xh;0.255xw,0.011xh&resize=200:*`, `${H}79830ea9-ffe5-4bec-b139-15efebccce71.jpg?crop=0.629xw:0.943xh;0.335xw,0.051xh&resize=200:*`],
    trending: [`${H}1701a425-3191-4827-be44-e9ad9f182ef6.jpg?crop=0.628xw:1xh;center,top&resize=366:*`, `${H}ba200192-fda5-4667-8a89-37f683390cba.jpeg?crop=0.666xw:1xh;center,top&resize=366:*`, `${H}9c4e52f9-9897-4acb-9155-77ba55660295.jpg?crop=0.5xw:1xh;center,top&resize=366:*`, `${H}50plus-wolff-3-698b767a29338.jpg?crop=0.603xw:0.903xh;0.196xw,0.034xh&resize=366:*`, `${H}79830ea9-ffe5-4bec-b139-15efebccce71.jpg?crop=0.629xw:0.943xh;0.335xw,0.051xh&resize=366:*`],
  },
  "womens-health": {
    hero: `${H}48b1da54-2adc-4eb3-be82-64423152ba54.jpeg?crop=0.573xw:1.00xh;0.197xw,0&resize=800:*`,
    articles: [`${H}whm250111-digital-ecomm-waterflossers-waterpikcordless-040-lead-6930696dec134.jpg?crop=0.497xw:0.994xh;0.240xw,0.00321xh&resize=144:*`, `${H}lead-calvin-klein-686c1289275e6.jpg?crop=0.502xw:1.00xh;0.220xw,0&resize=144:*`, `${H}2f7f2f9f-288e-4dbf-97c0-a6e39a53329b.jpeg?crop=0.670xw:1.00xh;0.240xw,0&resize=144:*`, `${H}dailydesign-itchyscalp-art-1-66f57260b0492.jpg?crop=0.492xw:0.984xh;0,0&resize=144:*`, `${H}gettyimages-1400438882-680292f3a9e37.jpg?crop=0.668xw:1.00xh;0.167xw,0&resize=144:*`],
    rightRail: [`${H}9ec40037-8d62-49c2-96ef-61848a587baf.jpg?crop=0.502xw:1.00xh;0.250xw,0&resize=200:*`, `${H}david-protein-67a364d6aa0fd.jpg?crop=0.670xw:1.00xh;0.173xw,0&resize=200:*`, `${H}8dcfab20-4c2a-4888-90e8-123747fffb1b.png?crop=0.503xw:1.00xh;0.250xw,0&resize=200:*`, `${H}4f34e933-edf9-4a4c-a554-05c4c537aac6.jpg?crop=0.670xw:1.00xh;0.160xw,0&resize=200:*`],
    trending: [`${H}48b1da54-2adc-4eb3-be82-64423152ba54.jpeg?crop=0.573xw:1.00xh;0.197xw,0&resize=366:*`, `${H}lead-calvin-klein-686c1289275e6.jpg?crop=0.502xw:1.00xh;0.220xw,0&resize=366:*`, `${H}gettyimages-1400438882-680292f3a9e37.jpg?crop=0.668xw:1.00xh;0.167xw,0&resize=366:*`, `${H}9ec40037-8d62-49c2-96ef-61848a587baf.jpg?crop=0.502xw:1.00xh;0.250xw,0&resize=366:*`, `${H}david-protein-67a364d6aa0fd.jpg?crop=0.670xw:1.00xh;0.173xw,0&resize=366:*`],
  },
  "oprah-daily": {
    hero: `${H}opr-sleepawards-lead-logo-69af79b769bf1.jpg?crop=0.630xw:0.845xh;0.200xw,0.155xh&resize=800:*`,
    articles: [`${H}opr-odetooversharing-lead-69af0adbc62cc.jpg?crop=0.670xw:1.00xh;0.167xw,0&resize=144:*`, `${H}3cb07c61-bb2f-41e9-9ccc-b60e6c1bf655.jpg?crop=0.5xw:1xh;center,top&resize=144:*`, `${H}opr-glp1checklist-lead-698a13b064334.jpg?crop=0.502xw:1.00xh;0.332xw,0&resize=144:*`, `${H}gettyimages-503013977-0-400-00-00-69a9ee0689481.png?crop=1.00xw:1.00xh;0,0&resize=144:*`, `${H}intention-6-8-23-resized-69a84d0b732d5.png?crop=0.752xw:1.00xh;0,0&resize=144:*`],
    rightRail: [`${H}mg-9492-r1-resized-699f33b98b2e3.jpg?crop=1.00xw:0.669xh;0,0.101xh&resize=200:*`, `${H}ow-bookstore-resized-6983c97803bcb.jpg?crop=1.00xw:0.755xh;0,0.0986xh&resize=200:*`, `${H}opr-aitherapy-2-lead-699f28f92540d.jpg?crop=0.502xw:1.00xh;0.272xw,0&resize=200:*`, `${H}cb4bb5bc-969e-4831-ac9d-7bff00f21438.png?crop=0.515xw:1xh;center,top&resize=200:*`],
    trending: [`${H}opr-sleepawards-lead-logo-69af79b769bf1.jpg?crop=0.630xw:0.845xh;0.200xw,0.155xh&resize=366:*`, `${H}3cb07c61-bb2f-41e9-9ccc-b60e6c1bf655.jpg?crop=0.5xw:1xh;center,top&resize=366:*`, `${H}opr-glp1checklist-lead-698a13b064334.jpg?crop=0.502xw:1.00xh;0.332xw,0&resize=366:*`, `${H}mg-9492-r1-resized-699f33b98b2e3.jpg?crop=1.00xw:0.669xh;0,0.101xh&resize=366:*`, `${H}opr-aitherapy-2-lead-699f28f92540d.jpg?crop=0.502xw:1.00xh;0.272xw,0&resize=366:*`],
  },
  "elle-decor": {
    hero: `${H}opr-sleepawards-lead-logo-69af79b769bf1.jpg?crop=0.630xw:0.845xh;0.200xw,0.155xh&resize=800:*`,
    articles: [`${H}opr-odetooversharing-lead-69af0adbc62cc.jpg?crop=0.670xw:1.00xh;0.167xw,0&resize=144:*`, `${H}3cb07c61-bb2f-41e9-9ccc-b60e6c1bf655.jpg?crop=0.5xw:1xh;center,top&resize=144:*`, `${H}opr-glp1checklist-lead-698a13b064334.jpg?crop=0.502xw:1.00xh;0.332xw,0&resize=144:*`, `${H}gettyimages-503013977-0-400-00-00-69a9ee0689481.png?crop=1.00xw:1.00xh;0,0&resize=144:*`, `${H}intention-6-8-23-resized-69a84d0b732d5.png?crop=0.752xw:1.00xh;0,0&resize=144:*`],
    rightRail: [`${H}mg-9492-r1-resized-699f33b98b2e3.jpg?crop=1.00xw:0.669xh;0,0.101xh&resize=200:*`, `${H}ow-bookstore-resized-6983c97803bcb.jpg?crop=1.00xw:0.755xh;0,0.0986xh&resize=200:*`, `${H}opr-aitherapy-2-lead-699f28f92540d.jpg?crop=0.502xw:1.00xh;0.272xw,0&resize=200:*`, `${H}cb4bb5bc-969e-4831-ac9d-7bff00f21438.png?crop=0.515xw:1xh;center,top&resize=200:*`],
    trending: [`${H}opr-sleepawards-lead-logo-69af79b769bf1.jpg?crop=0.630xw:0.845xh;0.200xw,0.155xh&resize=366:*`, `${H}3cb07c61-bb2f-41e9-9ccc-b60e6c1bf655.jpg?crop=0.5xw:1xh;center,top&resize=366:*`, `${H}opr-glp1checklist-lead-698a13b064334.jpg?crop=0.502xw:1.00xh;0.332xw,0&resize=366:*`, `${H}mg-9492-r1-resized-699f33b98b2e3.jpg?crop=1.00xw:0.669xh;0,0.101xh&resize=366:*`, `${H}opr-aitherapy-2-lead-699f28f92540d.jpg?crop=0.502xw:1.00xh;0.272xw,0&resize=366:*`],
  },
  "prevention": {
    hero: `${H}1-pvn-dream-week-index-69ae3bec26b48.jpg?crop=1.00xw:1.00xh;0,0&resize=800:*`,
    articles: [`${H}cooling-mattress-open-69af1113c9e75.png?crop=0.502xw:1.00xh;0.250xw,0&resize=144:*`, `${H}apollo-neuro-open-67d8817d2527c.png?crop=0.502xw:1.00xh;0.498xw,0&resize=144:*`, `${H}sleep-week-deals-2026-69a70edd2a35a.jpg?crop=0.502xw:1.00xh;0.251xw,0&resize=144:*`, `${H}c45c0ae6-9d3b-4511-a077-fd1e821ed462.jpeg?crop=0.666xw:1xh;center,top&resize=144:*`, `${H}6bc1ab47-e81a-4e5d-9322-593fcbd961cd.jpeg?crop=0.667xw:1xh;0.125xw,0xh&resize=144:*`],
    rightRail: [`${H}cheerful-mom-wraps-up-sandwiches-to-put-in-royalty-free-image-1773091191.pjpeg?crop=0.668xw:1.00xh;0.167xw,0&resize=200:*`, `${H}woman-taking-a-pill-close-up-of-asian-woman-taking-royalty-free-image-1772833857.pjpeg?crop=0.670xw:1.00xh;0.0833xw,0&resize=200:*`, `${H}1a277f1c-44fd-48d5-901d-78a0002e3d33.jpeg?crop=0.666xw:1xh;center,top&resize=200:*`, `${H}saatva-sleep-week-sale-2026-69a889db1d973.jpg?crop=0.503xw:1.00xh;0,0&resize=200:*`],
    trending: [`${H}1-pvn-dream-week-index-69ae3bec26b48.jpg?crop=1.00xw:1.00xh;0,0&resize=366:*`, `${H}c45c0ae6-9d3b-4511-a077-fd1e821ed462.jpeg?crop=0.666xw:1xh;center,top&resize=366:*`, `${H}6bc1ab47-e81a-4e5d-9322-593fcbd961cd.jpeg?crop=0.667xw:1xh;0.125xw,0xh&resize=366:*`, `${H}cheerful-mom-wraps-up-sandwiches-to-put-in-royalty-free-image-1773091191.pjpeg?crop=0.668xw:1.00xh;0.167xw,0&resize=366:*`, `${H}1a277f1c-44fd-48d5-901d-78a0002e3d33.jpeg?crop=0.666xw:1xh;center,top&resize=366:*`],
  },
  "road-and-track": {
    hero: `${H}comparo-ford-mustang-gt-vs-dodge-charger-scat-pack-1-jpg-69a9ad3305bf5.jpg?crop=0.947xw:0.709xh;0.0240xw,0.168xh&resize=800:*`,
    articles: [`${H}07a566f2-f5d2-4258-8e66-2e48a7620ee1.jpeg?crop=0.668xw:1.00xh;0.332xw,0&resize=144:*`, `${H}d3e0fde5-66da-4f88-a37f-2c6d0ac851a3.jpeg?crop=0.666xw:1xh;center,top&resize=144:*`, `${H}ebac9151-296b-48c4-aa49-d998ee536fa7.jpeg?crop=0.670xw:1.00xh;0.228xw,0&resize=144:*`, `${H}8536f058-dc40-4d48-a651-218b9e3833e6.jpeg?crop=0.670xw:1.00xh;0.276xw,0&resize=144:*`, `${H}de5876d1-c693-4554-9183-5f2b45144789.jpeg?crop=0.688xw:1.00xh;0.157xw,0&resize=144:*`],
    rightRail: [`${H}c0c7e218-5cbe-424a-8282-49eb186cb510.jpeg?crop=0.668xw:1.00xh;0.116xw,0&resize=200:*`, `${H}fd9e6081-24d9-4d82-9698-fcb728a70c45.jpeg?crop=0.670xw:1.00xh;0.330xw,0&resize=200:*`, `${H}a0eeb2e8-0634-4387-9d30-de21dcbee5ca.jpg?crop=0.752xw:1.00xh;0.170xw,0&resize=200:*`, `${H}canvasflow/D1F73894-A607-45E3-85D9F2896DE075E4.jpg?crop=0.679xw:1.00xh;0.162xw,0&resize=200:*`],
    trending: [`${H}comparo-ford-mustang-gt-vs-dodge-charger-scat-pack-1-jpg-69a9ad3305bf5.jpg?crop=0.947xw:0.709xh;0.0240xw,0.168xh&resize=366:*`, `${H}07a566f2-f5d2-4258-8e66-2e48a7620ee1.jpeg?crop=0.668xw:1.00xh;0.332xw,0&resize=366:*`, `${H}ebac9151-296b-48c4-aa49-d998ee536fa7.jpeg?crop=0.670xw:1.00xh;0.228xw,0&resize=366:*`, `${H}de5876d1-c693-4554-9183-5f2b45144789.jpeg?crop=0.688xw:1.00xh;0.157xw,0&resize=366:*`, `${H}c0c7e218-5cbe-424a-8282-49eb186cb510.jpeg?crop=0.668xw:1.00xh;0.116xw,0&resize=366:*`],
  },
  "autoweek": {
    hero: `${H}green-tea-cookies-1550241899.jpg?crop=0.481xw:0.321xh;0.449xw,0.532xh&resize=800:*`,
    articles: [`${H}peppermint-shake-wd-0320-1582136246.jpg?crop=1.00xw:0.713xh;0,0.176xh&resize=144:*`, `${H}small-children-standing-outdoors-in-garden-in-royalty-free-image-1719394569.jpg?crop=0.583xw:1.00xh;0.0782xw,0&resize=144:*`, `${H}woman-and-girl-reading-the-bible-royalty-free-image-1718977076.jpg?crop=0.664xw:1.00xh;0.188xw,0&resize=144:*`, `${H}games-for-kids-1544052005.jpg?crop=0.486xw:0.971xh;0.514xw,0.00641xh&resize=144:*`, `${H}beautiful-family-connecting-whilst-playing-games-royalty-free-image-1717003492.jpg?crop=0.668xw:1.00xh;0.147xw,0&resize=144:*`],
    rightRail: [`${H}emt-anglers-bemidji-paulbunyan-babe-the-blue-ox-01-66c33e9ce3a0a.jpg?crop=0.670xw:1.00xh;0.221xw,0&resize=200:*`, `${H}05-cq5dam-web-2000-1125-6682163970008.jpeg?crop=0.565xw:1.00xh;0.381xw,0&resize=200:*`, `${H}side-by-side-pink5-66a10bd14df26.png?crop=0.502xw:1.00xh;0.498xw,0&resize=200:*`, `${H}gifmaker-org-6gowzh-1529440507.gif?crop=0.500xw:1.00xh;0,0&resize=200:*`],
    trending: [`${H}green-tea-cookies-1550241899.jpg?crop=0.481xw:0.321xh;0.449xw,0.532xh&resize=366:*`, `${H}small-children-standing-outdoors-in-garden-in-royalty-free-image-1719394569.jpg?crop=0.583xw:1.00xh;0.0782xw,0&resize=366:*`, `${H}woman-and-girl-reading-the-bible-royalty-free-image-1718977076.jpg?crop=0.664xw:1.00xh;0.188xw,0&resize=366:*`, `${H}emt-anglers-bemidji-paulbunyan-babe-the-blue-ox-01-66c33e9ce3a0a.jpg?crop=0.670xw:1.00xh;0.221xw,0&resize=366:*`, `${H}05-cq5dam-web-2000-1125-6682163970008.jpeg?crop=0.565xw:1.00xh;0.381xw,0&resize=366:*`],
  },
  "popular-mechanics": {
    hero: `${H}d9e5ae92-1bde-496d-9f91-4a39004265d6.jpeg?crop=0.678xw:1.00xh;0.162xw,0&resize=800:*`,
    articles: [`${H}this-photo-taken-on-april-26-2023-shows-terracotta-warriors-news-photo-1717091411.jpg?crop=0.605xw:1xh;center,top&resize=144:*`, `${H}579b43e3-2930-4eaf-ba7d-8336b652a1b3.jpeg?crop=0.777xw:1.00xh;0.112xw,0&resize=144:*`, `${H}70b87d8b-dfbf-4aba-ad27-29d4bd317458.jpeg?crop=0.667xw:1.00xh;0.333xw,0&resize=144:*`, `${H}mental-health-concept-royalty-free-image-1772820238.pjpeg?crop=0.672xw:1.00xh;0.166xw,0&resize=144:*`, `${H}ca739aae-4518-4917-8c0c-a57f57132373.jpg?crop=0.615xw:0.922xh;0.175xw,0xh&resize=144:*`],
    rightRail: [`${H}d87323c9-d9b9-4c6b-9504-0f95bc775946.png?crop=0.5xw:1xh;center,top&resize=200:*`, `${H}bryn-celli-ddu-burial-chamber-anglesey-north-wales-royalty-free-image-1759181153.pjpeg?crop=0.669xw:1.00xh;0.166xw,0&resize=200:*`, `${H}a676ce74-e43b-444d-b44b-f965bdfbe92a.jpeg?crop=0.666xw:1xh;center,top&resize=200:*`, `${H}55de6796-335c-4eda-9f04-e48cb84f0b79.jpeg?crop=0.707xw:1xh;center,top&resize=200:*`],
    trending: [`${H}d9e5ae92-1bde-496d-9f91-4a39004265d6.jpeg?crop=0.678xw:1.00xh;0.162xw,0&resize=366:*`, `${H}579b43e3-2930-4eaf-ba7d-8336b652a1b3.jpeg?crop=0.777xw:1.00xh;0.112xw,0&resize=366:*`, `${H}70b87d8b-dfbf-4aba-ad27-29d4bd317458.jpeg?crop=0.667xw:1.00xh;0.333xw,0&resize=366:*`, `${H}d87323c9-d9b9-4c6b-9504-0f95bc775946.png?crop=0.5xw:1xh;center,top&resize=366:*`, `${H}a676ce74-e43b-444d-b44b-f965bdfbe92a.jpeg?crop=0.666xw:1xh;center,top&resize=366:*`],
  },
  "veranda": {
    hero: `${H}95a92f60-ecd3-4851-b89d-2ab2b0d1a63b.jpg?crop=1xw:0.8xh;center,top&resize=800:*`,
    articles: [`${H}a8c5b5c3-62f3-4beb-aac2-c0588e774198.jpg?crop=0.666xw:1xh;center,top&resize=144:*`, `${H}5efb7719-919a-412d-8412-625ec4f7a364.jpeg?crop=0.531xw:1xh;center,top&resize=144:*`, `${H}c26a0e66-d94e-4f7b-a25f-9d3b3989aec0.jpg?crop=0.5xw:1xh;center,top&resize=144:*`, `${H}summer-thornton-chicago-home-tour-great-hall-china-675382e86fb07.jpg?crop=0.718xw:1.00xh;0.147xw,0&resize=144:*`, `${H}7d6c4bf1-1a5d-41bc-8020-dbb87526e47e.jpg?crop=1xw:0.667xh;0xw,0.292xh&resize=144:*`],
    rightRail: [`${H}young-huh-manhattan-townhouse-screening-room-69728644d5a95.jpg?crop=0.702xw:1.00xh;0.151xw,0&resize=200:*`, `${H}kathryn-ireland-spanish-colonial-home-living-room-698a5a192f6a3.jpg?crop=0.753xw:1.00xh;0.0769xw,0&resize=200:*`, `${H}2021-05-06-katierosenfeld-readmckendree-0018-v1-1628698616.jpg?crop=0.633xw:1.00xh;0.0978xw,0&resize=200:*`, `${H}dsc-9445-68d486647667c.jpg?crop=0.670xw:1.00xh;0.197xw,0&resize=200:*`],
    trending: [`${H}95a92f60-ecd3-4851-b89d-2ab2b0d1a63b.jpg?crop=1xw:0.8xh;center,top&resize=366:*`, `${H}a8c5b5c3-62f3-4beb-aac2-c0588e774198.jpg?crop=0.666xw:1xh;center,top&resize=366:*`, `${H}c26a0e66-d94e-4f7b-a25f-9d3b3989aec0.jpg?crop=0.5xw:1xh;center,top&resize=366:*`, `${H}young-huh-manhattan-townhouse-screening-room-69728644d5a95.jpg?crop=0.702xw:1.00xh;0.151xw,0&resize=366:*`, `${H}kathryn-ireland-spanish-colonial-home-living-room-698a5a192f6a3.jpg?crop=0.753xw:1.00xh;0.0769xw,0&resize=366:*`],
  },
  "town-and-country": {
    hero: `${H}633457ac-7893-465f-a7e5-49a91154c158.jpg?crop=0.667xw:1xh;center,top&resize=800:*`,
    articles: [`${H}063a0097-2baa-4e8c-b968-e7e11877b22e.jpg?crop=0.667xw:1xh;0.299xw,0xh&resize=144:*`, `${H}ols8-803-050824-0157-a-1800x1200-6983a69b7154b.jpg?crop=0.667xw:1xh;0.177xw,0xh&resize=144:*`, `${H}ols8-802-041024-0151-a-f-69af145c1be9d.jpg?crop=0.667xw:1xh;0.311xw,0xh&resize=144:*`, `${H}b9249bc6-bcc5-45ac-8ed8-033f2687babe.jpg?crop=0.563xw:1xh;0.438xw,0xh&resize=144:*`, `${H}352ff96b-c42f-46ca-a148-eabf02dc77ac.jpg?crop=0.5xw:1xh;center,top&resize=144:*`],
    rightRail: [`${H}5aa695b9-c5a0-46a2-a089-d01513e3dd48.jpg?crop=0.5xw:1xh;center,top&resize=200:*`, `${H}6570f22a-920c-439d-b3a2-d0eee2fb13de.jpeg?crop=0.666xw:1xh;center,top&resize=200:*`, `${H}61604562-d1a2-403d-8f75-8761904c9eaa.jpg?crop=0.5625xw:1xh;center,top&resize=200:*`, `${H}aa0b2385-09ea-4a9c-83ca-841d9a9dc6fd.jpg?crop=0.663xw:1xh;0.14xw,0xh&resize=200:*`],
    trending: [`${H}633457ac-7893-465f-a7e5-49a91154c158.jpg?crop=0.667xw:1xh;center,top&resize=366:*`, `${H}063a0097-2baa-4e8c-b968-e7e11877b22e.jpg?crop=0.667xw:1xh;0.299xw,0xh&resize=366:*`, `${H}b9249bc6-bcc5-45ac-8ed8-033f2687babe.jpg?crop=0.563xw:1xh;0.438xw,0xh&resize=366:*`, `${H}5aa695b9-c5a0-46a2-a089-d01513e3dd48.jpg?crop=0.5xw:1xh;center,top&resize=366:*`, `${H}6570f22a-920c-439d-b3a2-d0eee2fb13de.jpeg?crop=0.666xw:1xh;center,top&resize=366:*`],
  },
  "seventeen": {
    hero: `${H}cos120125sombr-006-68ffd67f9cf7c.jpg?crop=1.00xw:0.738xh;0,0&resize=800:*`,
    articles: [`${H}harry-styles-performs-live-on-stage-during-the-brit-awards-news-photo-1768236641.pjpeg?crop=0.806xw:1.00xh;0.0978xw,0&resize=144:*`, `${H}emily-in-paris-season-5-cast-6942c8ab3c3a6.jpg?crop=0.668xw:1.00xh;0.236xw,0&resize=144:*`, `${H}gavin-casalegno-jenny-han-christopher-briney-and-lola-tung-news-photo-1764780880.pjpeg?crop=0.668xw:1.00xh;0.149xw,0&resize=144:*`, `${H}untitled-design-2025-11-12t151553-894-6914f24f0af2a.png?crop=0.478xw:0.956xh;0.512xw,0.0170xh&resize=144:*`, `${H}jennie-dua-67cb1084f18bb.jpg?crop=0.495xw:0.990xh;0,0.00962xh&resize=144:*`],
    rightRail: [`${H}performs-onstage-during-the-2019-billboard-music-awards-at-news-photo-1140669624-1558376766.jpg?crop=0.668xw:1.00xh;0.167xw,0&resize=200:*`, `${H}thai-singer-and-actress-lalisa-manobal-known-as-lisa-member-news-photo-1740077363.pjpeg?crop=0.643xw:1.00xh;0.179xw,0&resize=200:*`, `${H}jisoo-attends-the-christian-dior-haute-couture-spring-news-photo-1737994143.pjpeg?crop=1.00xw:0.668xh;0,0.0545xh&resize=200:*`, `${H}person-waves-a-transgender-pride-flag-during-the-peoples-news-photo-1737495403.pjpeg?crop=0.668xw:1.00xh;0.167xw,0&resize=200:*`],
    trending: [`${H}cos120125sombr-006-68ffd67f9cf7c.jpg?crop=1.00xw:0.738xh;0,0&resize=366:*`, `${H}emily-in-paris-season-5-cast-6942c8ab3c3a6.jpg?crop=0.668xw:1.00xh;0.236xw,0&resize=366:*`, `${H}untitled-design-2025-11-12t151553-894-6914f24f0af2a.png?crop=0.478xw:0.956xh;0.512xw,0.0170xh&resize=366:*`, `${H}performs-onstage-during-the-2019-billboard-music-awards-at-news-photo-1140669624-1558376766.jpg?crop=0.668xw:1.00xh;0.167xw,0&resize=366:*`, `${H}thai-singer-and-actress-lalisa-manobal-known-as-lisa-member-news-photo-1740077363.pjpeg?crop=0.643xw:1.00xh;0.179xw,0&resize=366:*`],
  },
  "womans-day": {
    hero: `${H}green-tea-cookies-1550241899.jpg?crop=0.481xw:0.321xh;0.449xw,0.532xh&resize=800:*`,
    articles: [`${H}peppermint-shake-wd-0320-1582136246.jpg?crop=1.00xw:0.713xh;0,0.176xh&resize=144:*`, `${H}small-children-standing-outdoors-in-garden-in-royalty-free-image-1719394569.jpg?crop=0.583xw:1.00xh;0.0782xw,0&resize=144:*`, `${H}woman-and-girl-reading-the-bible-royalty-free-image-1718977076.jpg?crop=0.664xw:1.00xh;0.188xw,0&resize=144:*`, `${H}games-for-kids-1544052005.jpg?crop=0.486xw:0.971xh;0.514xw,0.00641xh&resize=144:*`, `${H}beautiful-family-connecting-whilst-playing-games-royalty-free-image-1717003492.jpg?crop=0.668xw:1.00xh;0.147xw,0&resize=144:*`],
    rightRail: [`${H}green-tea-cookies-1550241899.jpg?crop=0.668xw:1.00xh;0.167xw,0&resize=200:*`, `${H}beautiful-family-connecting-whilst-playing-games-royalty-free-image-1717003492.jpg?crop=0.668xw:1.00xh;0.147xw,0&resize=200:*`, `${H}woman-and-girl-reading-the-bible-royalty-free-image-1718977076.jpg?crop=0.664xw:1.00xh;0.188xw,0&resize=200:*`, `${H}peppermint-shake-wd-0320-1582136246.jpg?crop=0.502xw:1.00xh;0,0&resize=200:*`],
    trending: [`${H}green-tea-cookies-1550241899.jpg?crop=0.481xw:0.321xh;0.449xw,0.532xh&resize=366:*`, `${H}small-children-standing-outdoors-in-garden-in-royalty-free-image-1719394569.jpg?crop=0.583xw:1.00xh;0.0782xw,0&resize=366:*`, `${H}woman-and-girl-reading-the-bible-royalty-free-image-1718977076.jpg?crop=0.664xw:1.00xh;0.188xw,0&resize=366:*`, `${H}beautiful-family-connecting-whilst-playing-games-royalty-free-image-1717003492.jpg?crop=0.668xw:1.00xh;0.147xw,0&resize=366:*`, `${H}peppermint-shake-wd-0320-1582136246.jpg?crop=0.502xw:1.00xh;0,0&resize=366:*`],
  },
  "best-products": {
    hero: `${H}cos120125sombr-006-68ffd67f9cf7c.jpg?crop=1.00xw:0.738xh;0,0&resize=800:*`,
    articles: [`${H}harry-styles-performs-live-on-stage-during-the-brit-awards-news-photo-1768236641.pjpeg?crop=0.806xw:1.00xh;0.0978xw,0&resize=144:*`, `${H}emily-in-paris-season-5-cast-6942c8ab3c3a6.jpg?crop=0.668xw:1.00xh;0.236xw,0&resize=144:*`, `${H}gavin-casalegno-jenny-han-christopher-briney-and-lola-tung-news-photo-1764780880.pjpeg?crop=0.668xw:1.00xh;0.149xw,0&resize=144:*`, `${H}untitled-design-2025-11-12t151553-894-6914f24f0af2a.png?crop=0.478xw:0.956xh;0.512xw,0.0170xh&resize=144:*`, `${H}jennie-dua-67cb1084f18bb.jpg?crop=0.495xw:0.990xh;0,0.00962xh&resize=144:*`],
    rightRail: [`${H}performs-onstage-during-the-2019-billboard-music-awards-at-news-photo-1140669624-1558376766.jpg?crop=0.668xw:1.00xh;0.167xw,0&resize=200:*`, `${H}thai-singer-and-actress-lalisa-manobal-known-as-lisa-member-news-photo-1740077363.pjpeg?crop=0.643xw:1.00xh;0.179xw,0&resize=200:*`, `${H}jisoo-attends-the-christian-dior-haute-couture-spring-news-photo-1737994143.pjpeg?crop=1.00xw:0.668xh;0,0.0545xh&resize=200:*`, `${H}person-waves-a-transgender-pride-flag-during-the-peoples-news-photo-1737495403.pjpeg?crop=0.668xw:1.00xh;0.167xw,0&resize=200:*`],
    trending: [`${H}cos120125sombr-006-68ffd67f9cf7c.jpg?crop=1.00xw:0.738xh;0,0&resize=366:*`, `${H}emily-in-paris-season-5-cast-6942c8ab3c3a6.jpg?crop=0.668xw:1.00xh;0.236xw,0&resize=366:*`, `${H}untitled-design-2025-11-12t151553-894-6914f24f0af2a.png?crop=0.478xw:0.956xh;0.512xw,0.0170xh&resize=366:*`, `${H}performs-onstage-during-the-2019-billboard-music-awards-at-news-photo-1140669624-1558376766.jpg?crop=0.668xw:1.00xh;0.167xw,0&resize=366:*`, `${H}thai-singer-and-actress-lalisa-manobal-known-as-lisa-member-news-photo-1740077363.pjpeg?crop=0.643xw:1.00xh;0.179xw,0&resize=366:*`],
  },
  "redbook": {
    hero: `${H}rbk-evergreen-marquee-1-1545674660.jpg?crop=0.611xw:1.00xh;0.298xw,0&resize=800:*`,
    articles: [`${H}best-powder-sunscreen-64404e904b76b.jpg?crop=0.494xw:0.987xh;0.438xw,0&resize=144:*`, `${H}pink-aerosol-can-royalty-free-image-1709056959.jpg?crop=0.671xw:1.00xh;0.139xw,0&resize=144:*`, `${H}facial-aesthetics-surgery-treatment-royalty-free-image-1709330919.jpg?crop=0.668xw:1.00xh;0.220xw,0&resize=144:*`, `${H}mexico-city-mexico-polanco-el-palacio-de-hierro-luxury-news-photo-1703867288.jpg?crop=0.668xw:1.00xh;0.0513xw,0&resize=144:*`, `${H}hailey-bieber-attends-the-rhode-uk-launch-party-with-hailey-news-photo-1695762510.jpg?crop=0.668xw:1.00xh;0.160xw,0&resize=144:*`],
    rightRail: [`${H}gettyimages-78697823-1523029296.jpg?crop=0.667xw:0.998xh;0.114xw,0.00245xh&resize=200:*`, `${H}singer-michael-jackson-appears-at-the-balcony-of-the-adlon-news-photo-1683313946.jpg?crop=0.652xw:1.00xh;0.175xw,0&resize=200:*`, `${H}musician-billy-joel-sings-the-national-anthem-prior-to-an-news-photo-1683552089.jpg?crop=1.00xw:0.760xh;0,0&resize=200:*`, `${H}las-vegas-nv-singer-elvis-presley-and-priscilla-ann-news-photo-1569417736.jpg?crop=0.674xw:1.00xh;0.172xw,0&resize=200:*`],
    trending: [`${H}rbk-evergreen-marquee-1-1545674660.jpg?crop=0.611xw:1.00xh;0.298xw,0&resize=366:*`, `${H}pink-aerosol-can-royalty-free-image-1709056959.jpg?crop=0.671xw:1.00xh;0.139xw,0&resize=366:*`, `${H}mexico-city-mexico-polanco-el-palacio-de-hierro-luxury-news-photo-1703867288.jpg?crop=0.668xw:1.00xh;0.0513xw,0&resize=366:*`, `${H}hailey-bieber-attends-the-rhode-uk-launch-party-with-hailey-news-photo-1695762510.jpg?crop=0.668xw:1.00xh;0.160xw,0&resize=366:*`, `${H}gettyimages-78697823-1523029296.jpg?crop=0.667xw:0.998xh;0.114xw,0.00245xh&resize=366:*`],
  },
  "biography": {
    hero: `${H}1b4dda1c-79f9-4936-b908-ea53059ce922.jpg?crop=0.666xw:1xh;center,top&resize=800:*`,
    articles: [`${H}9bcbeb7b-1021-4435-9395-9f9d14f616d0.jpeg?crop=0.684xw:1xh;center,top&resize=144:*`, `${H}hamnet-4238-d045-00238-r-rgb-693b2fe49e8e2.jpg?crop=0.664xw:1xh;center,top&resize=144:*`, `${H}pi-day-cherry-and-apple-pies-royalty-free-image-1741791515.pjpeg?crop=0.670xw:1.00xh;0.255xw,0&resize=144:*`, `${H}the-perfect-neighbor-01-35-20-15-68efb775231dc.png?crop=0.5625xw:1xh;center,top&resize=144:*`, `${H}the-industrys-biggest-reality-fans-and-stars-alike-gathered-news-photo-1762801654.pjpeg?crop=0.454xw:0.680xh;0.269xw,0.118xh&resize=144:*`],
    rightRail: [`${H}d10a0130-3f58-4387-8163-ec743771505b.jpeg?crop=1xw:0.848xh;0xw,0.039xh&resize=200:*`, `${H}051d8bfd-66da-4f6e-866a-0f0f48d8cc56.jpg?crop=0.527xw:1xh;center,top&resize=200:*`, `${H}where-to-watch-and-stream-2026-oscar-nominated-movies-69ab380f44d54.png?crop=0.5xw:1xh;center,top&resize=200:*`, `${H}lainey-wilson-attends-charlize-therons-africa-outreach-news-photo-1746804440.pjpeg?crop=1.00xw:0.668xh;0,0.0684xh&resize=200:*`],
    trending: [`${H}1b4dda1c-79f9-4936-b908-ea53059ce922.jpg?crop=0.666xw:1xh;center,top&resize=366:*`, `${H}hamnet-4238-d045-00238-r-rgb-693b2fe49e8e2.jpg?crop=0.664xw:1xh;center,top&resize=366:*`, `${H}the-perfect-neighbor-01-35-20-15-68efb775231dc.png?crop=0.5625xw:1xh;center,top&resize=366:*`, `${H}d10a0130-3f58-4387-8163-ec743771505b.jpeg?crop=1xw:0.848xh;0xw,0.039xh&resize=366:*`, `${H}lainey-wilson-attends-charlize-therons-africa-outreach-news-photo-1746804440.pjpeg?crop=1.00xw:0.668xh;0,0.0684xh&resize=366:*`],
  },
  "the-pioneer-woman": {
    hero: `${H}5d1c6672-20d3-4271-8d83-aef2370f2e76.jpeg?crop=0.500xw:1xh;center,top&resize=800:*`,
    articles: [`${H}179b8aa9-4761-489e-aa16-e63fe17634f0.png?crop=0.995xw:1xh;center,top&resize=144:*`, `${H}491f278e-f776-4f81-8758-6243c377b371.jpeg?crop=0.5xw:1xh;center,top&resize=144:*`, `${H}485b578b-8d38-4781-b910-88e1b0fa1d7c.jpg?crop=0.5xw:1xh;center,top&resize=144:*`, `${H}irish-cream-poke-cake-recipe-2-69af0f8cdc667.jpg?crop=0.502xw:1.00xh;0.269xw,0&resize=144:*`, `${H}a756bda9-cfdc-4ce0-936b-ea5663119e35.jpeg?crop=0.499xw:1xh;center,top&resize=144:*`],
    rightRail: [`${H}ba8dbe06-dafe-42fc-8629-f5cb9e9044f4.jpeg?crop=0.502xw:1.00xh;0.205xw,0&resize=200:*`, `${H}tpw-irish-coffee-recipe-1x2-2680-69a758ec28377.jpeg?crop=0.502xw:1.00xh;0.208xw,0&resize=200:*`, `${H}irish-mule-recipe-2-67bcae3732d04.jpg?crop=0.502xw:1.00xh;0.205xw,0&resize=200:*`, `${H}chicken-spaghetti-recipe-1633614240.jpg?crop=0.668xw:1.00xh;0.0593xw,0&resize=200:*`],
    trending: [`${H}5d1c6672-20d3-4271-8d83-aef2370f2e76.jpeg?crop=0.500xw:1xh;center,top&resize=366:*`, `${H}491f278e-f776-4f81-8758-6243c377b371.jpeg?crop=0.5xw:1xh;center,top&resize=366:*`, `${H}irish-cream-poke-cake-recipe-2-69af0f8cdc667.jpg?crop=0.502xw:1.00xh;0.269xw,0&resize=366:*`, `${H}ba8dbe06-dafe-42fc-8629-f5cb9e9044f4.jpeg?crop=0.502xw:1.00xh;0.205xw,0&resize=366:*`, `${H}chicken-spaghetti-recipe-1633614240.jpg?crop=0.668xw:1.00xh;0.0593xw,0&resize=366:*`],
  },
};

const DEFAULT_IMAGES = {
  hero: `${U}1495020689067-958852a7765e?w=800&h=500&fit=crop`,
  articles: [`${U}1495020689067-958852a7765e?w=144&h=144&fit=crop`, `${U}1495020689067-958852a7765e?w=144&h=144&fit=crop`, `${U}1521737604893-d14cc237f11d?w=144&h=144&fit=crop`, `${U}1507003211169-0a1dd7228f2d?w=144&h=144&fit=crop`, `${U}1513694203232-719a280e022f?w=144&h=144&fit=crop`],
  rightRail: [`${U}1495020689067-958852a7765e?w=200&h=200&fit=crop`, `${U}1495020689067-958852a7765e?w=200&h=200&fit=crop`, `${U}1521737604893-d14cc237f11d?w=200&h=200&fit=crop`, `${U}1513694203232-719a280e022f?w=200&h=200&fit=crop`],
  trending: [`${U}1495020689067-958852a7765e?w=366&h=366&fit=crop`, `${U}1495020689067-958852a7765e?w=366&h=366&fit=crop`, `${U}1521737604893-d14cc237f11d?w=366&h=366&fit=crop`, `${U}1507003211169-0a1dd7228f2d?w=366&h=366&fit=crop`, `${U}1513694203232-719a280e022f?w=366&h=366&fit=crop`],
};

function getBrandImages(slug: string) {
  return BRAND_IMAGES[slug] || DEFAULT_IMAGES;
}

interface ContentType {
  collectionTitle: string;
  articles: { title: string; time: string; readTime: string }[];
  hero: { eyebrow: string; title: string; desc: string; author: string };
  rightRail: { eyebrow: string; title: string; desc: string; author: string }[];
  trending: { title: string; time: string }[];
  newsletter: { title: string; desc: string };
  navLinks: string[];
  footerCols: string[][];
}

const defaultContent: ContentType = {
  collectionTitle: "Latest News",
  articles: [
    { title: "Breaking Story That\nCaptures Attention", time: "Just Now", readTime: "5 Min Read" },
    { title: "Feature Article on\nTrending Topics", time: "2 hours ago", readTime: "4 Min Read" },
    { title: "In-Depth Report on\nCurrent Events and\nTheir Impact", time: "Yesterday", readTime: "7 Min Read" },
    { title: "Exclusive Interview\nWith Industry Leader", time: "Mar 5, 2026", readTime: "6 Min Read" },
    { title: "Analysis: What This\nMeans for the Future", time: "Mar 4, 2026", readTime: "3 Min Read" },
  ],
  hero: {
    eyebrow: "FEATURED",
    title: "The Definitive Guide to This Season's Most Important Story",
    desc: "An in-depth look at the trends, people, and moments that are shaping our world right now.",
    author: "Editorial Staff",
  },
  rightRail: [
    { eyebrow: "TRENDING", title: "Must-Read Story That\nEveryone Is Talking\nAbout Right Now", desc: "The latest on what matters\nmost to our readers.", author: "Staff Writer" },
    { eyebrow: "GUIDE", title: "Everything You Need\nto Know Before\nMaking a Decision", desc: "Our experts break down\nthe essentials.", author: "Senior Editor" },
    { eyebrow: "NEWS", title: "Breaking Development\nChanges the Landscape\nForever", desc: "What this means for\nthe industry going forward.", author: "News Desk" },
    { eyebrow: "FIRST LOOK", title: "Exclusive Preview of\nWhat's Coming Next\nSeason", desc: "A sneak peek at the most\nanticipated releases.", author: "Features Editor" },
  ],
  trending: [
    { title: "Top Story\nEveryone Is\nReading", time: "3 hours ago" },
    { title: "Surprising\nNew Discovery\nRevealed", time: "5 hours ago" },
    { title: "Expert Tips\nfor Better\nResults", time: "8 hours ago" },
    { title: "Behind the\nScenes Look\nat the Process", time: "12 hours ago" },
    { title: "What Experts\nSay About\nthe Future", time: "1 day ago" },
  ],
  newsletter: {
    title: "Get Our Newsletter",
    desc: "Stay ahead with breaking news, features, and the best stories delivered to your inbox.",
  },
  navLinks: ["Home", "News", "Features", "Culture", "Style", "Health", "Food", "Travel", "Videos"],
  footerCols: [
    ["News", "Features", "Culture", "Lifestyle", "Opinion", "Wellness", "Travel"],
    ["Style", "Beauty", "Food", "Home", "Entertainment", "Shopping", "Tech"],
    ["Videos", "Podcasts", "Newsletters", "Events", "Awards", "Archive", "About"],
    ["Contact", "Careers", "Advertise", "Subscribe", "Press", "Privacy", "Terms"],
  ],
};

const BRAND_CONTENT: Partial<Record<string, Partial<ContentType>>> = {
  "cosmopolitan": {
    collectionTitle: "What's Hot",
    articles: [
      { title: "The K-Pop Group Taking\nOver Netflix Right Now", time: "Just Now", readTime: "4 Min Read" },
      { title: "Your Complete Guide to\nSpring Beauty Trends", time: "2 hours ago", readTime: "5 Min Read" },
      { title: "The Relationship Red Flags\nYou're Ignoring", time: "Yesterday", readTime: "6 Min Read" },
      { title: "How to Build a Capsule\nWardrobe That Actually Works", time: "Mar 5, 2026", readTime: "3 Min Read" },
      { title: "The Celebrity Couples\nWe're Obsessed With", time: "Mar 4, 2026", readTime: "2 Min Read" },
    ],
    hero: { eyebrow: "POP CULTURE", title: "The K-Pop Group Taking Over Netflix Right Now", desc: "Love, beauty, pop culture, and style — the group everyone's talking about and why they're dominating your feed.", author: "Jessica Chen" },
    rightRail: [
      { eyebrow: "BEAUTY", title: "Your Complete Guide\nto Spring Beauty\nTrends", desc: "The looks and products\ndefining the season.", author: "Beauty Editor" },
      { eyebrow: "LOVE", title: "The Relationship Red\nFlags You're\nIgnoring", desc: "What to watch for\nbefore it's too late.", author: "Relationships Editor" },
      { eyebrow: "STYLE", title: "How to Build a Capsule\nWardrobe That Actually\nWorks", desc: "Less is more — the\npieces that mix and match.", author: "Fashion Director" },
      { eyebrow: "CELEBS", title: "The Celebrity Couples\nWe're Obsessed\nWith Right Now", desc: "From red carpet to\nreal life.", author: "Celebrity Editor" },
    ],
    trending: [
      { title: "K-Pop Group\nTaking Over\nNetflix", time: "3 hours ago" },
      { title: "Spring Beauty\nTrends Guide", time: "5 hours ago" },
      { title: "Relationship Red\nFlags to Watch", time: "8 hours ago" },
      { title: "Capsule Wardrobe\nThat Works", time: "12 hours ago" },
      { title: "Celebrity Couples\nWe Love", time: "1 day ago" },
    ],
    navLinks: ["Home", "Style", "Beauty", "Love", "Life", "Celebs", "Culture", "Horoscopes", "Shopping"],
  },
  "esquire": {
    collectionTitle: "Editor's Picks",
    articles: [
      { title: "Margo's Got Money Troubles\nIs the Year's Best Show", time: "Just Now", readTime: "6 Min Read" },
      { title: "The New Rules of Men's\nStyle in 2026", time: "2 hours ago", readTime: "5 Min Read" },
      { title: "The Cocktail That\nChanged Everything", time: "Yesterday", readTime: "4 Min Read" },
      { title: "Inside Hollywood's Most\nSecretive Club", time: "Mar 5, 2026", readTime: "8 Min Read" },
      { title: "The Watch Collection\nEvery Man Needs", time: "Mar 4, 2026", readTime: "7 Min Read" },
    ],
    hero: { eyebrow: "ENTERTAINMENT", title: "Margo's Got Money Troubles Is the Year's Best Show", desc: "Inside the series that's redefining TV — and why it deserves every award coming its way.", author: "Tom Junod" },
    rightRail: [
      { eyebrow: "STYLE", title: "The New Rules of\nMen's Style in\n2026", desc: "Entertainment, style,\nfood & drink, culture.", author: "Style Editor" },
      { eyebrow: "FOOD & DRINK", title: "The Cocktail That\nChanged Everything", desc: "The drink that\nredefined the bar.", author: "Drinks Columnist" },
      { eyebrow: "CULTURE", title: "Inside Hollywood's\nMost Secretive Club", desc: "Where the real\npower players gather.", author: "Culture Editor" },
      { eyebrow: "WATCHES", title: "The Watch Collection\nEvery Man Needs", desc: "Timepieces worth\nthe investment.", author: "Watches Editor" },
    ],
    navLinks: ["Home", "Style", "Culture", "Politics", "Food & Drink", "Watches", "Cars", "Health", "Entertainment"],
  },
  "car-and-driver": {
    collectionTitle: "Latest News",
    articles: [
      { title: "Modern Muscle Showdown:\nCharger vs. Mustang GT", time: "Just Now", readTime: "6 Min Read" },
      { title: "The Ferrari That Redefined\nGrand Touring", time: "2 hours ago", readTime: "8 Min Read" },
      { title: "Why the Manual Transmission\nWill Never Die", time: "Yesterday", readTime: "5 Min Read" },
      { title: "The Forgotten Rally Cars\nof the 1980s", time: "Mar 5, 2026", readTime: "7 Min Read" },
      { title: "Track Day Essentials: What\nto Bring and What to Skip", time: "Mar 4, 2026", readTime: "4 Min Read" },
    ],
    hero: { eyebrow: "COMPARISON", title: "Modern Muscle Showdown: Charger vs. Mustang GT", desc: "Two icons go head-to-head. We put the latest Charger and Mustang GT through their paces to crown the king of American performance.", author: "John Voelcker" },
    rightRail: [
      { eyebrow: "CULTURE", title: "The Ferrari That\nRedefined Grand\nTouring", desc: "A modern classic\nthat changed everything.", author: "Test Team" },
      { eyebrow: "OPINION", title: "Why the Manual\nTransmission Will\nNever Die", desc: "The case for three\npedals in 2026.", author: "Contributing Editor" },
      { eyebrow: "FEATURES", title: "The Forgotten Rally\nCars of the 1980s", desc: "The machines that\nshaped motorsport.", author: "Features Editor" },
      { eyebrow: "GEAR", title: "Track Day Essentials:\nWhat to Bring and\nWhat to Skip", desc: "Pack smarter for\nyour next lapping day.", author: "Gear Editor" },
    ],
    trending: [
      { title: "Charger vs.\nMustang GT\nShowdown", time: "3 hours ago" },
      { title: "Ferrari Grand\nTouring Redefined", time: "5 hours ago" },
      { title: "Manual Transmission\nWill Never Die", time: "8 hours ago" },
      { title: "Forgotten Rally\nCars of the 80s", time: "12 hours ago" },
      { title: "Track Day\nEssentials Guide", time: "1 day ago" },
    ],
    navLinks: ["Home", "Reviews", "News", "Buyer's Guide", "Comparison Tests", "EV", "Features", "Videos", "Podcasts"],
  },
  "elle": {
    collectionTitle: "The Edit",
    articles: [
      { title: "Buffy's Sarah Michelle Gellar\non Her Fashion Evolution", time: "Just Now", readTime: "5 Min Read" },
      { title: "The New Minimalism Defining\nLuxury in 2026", time: "2 hours ago", readTime: "6 Min Read" },
      { title: "Inside the Atelier With\nFashion's Next Star", time: "Yesterday", readTime: "8 Min Read" },
      { title: "The Skincare Routine Derms\nActually Follow", time: "Mar 5, 2026", readTime: "4 Min Read" },
      { title: "Resort 2027: The Collections\nWe're Coveting", time: "Mar 4, 2026", readTime: "3 Min Read" },
    ],
    hero: { eyebrow: "FASHION", title: "Buffy's Sarah Michelle Gellar on Her Fashion Evolution", desc: "From the Slayer to the red carpet — the star opens up about style, reinvention, and what she's wearing now.", author: "Nina Garcia" },
    rightRail: [
      { eyebrow: "FASHION", title: "The New Minimalism\nDefining Luxury\nin 2026", desc: "Fashion, beauty,\nculture.", author: "Fashion Director" },
      { eyebrow: "CULTURE", title: "Inside the Atelier\nWith Fashion's\nNext Star", desc: "Where the next\ngeneration is made.", author: "Culture Writer" },
      { eyebrow: "BEAUTY", title: "The Skincare Routine\nDerms Actually\nFollow", desc: "The routine experts\nswear by.", author: "Beauty Director" },
      { eyebrow: "FASHION", title: "Resort 2027: The\nCollections We're\nCoveting", desc: "Vacation dressing\nat its finest.", author: "Fashion Editor" },
    ],
    navLinks: ["Home", "Fashion", "Beauty", "Culture", "Life & Love", "Astrology", "Shopping", "Videos", "A-List"],
  },
  "good-housekeeping": {
    collectionTitle: "Tested & Approved",
    articles: [
      { title: "The Best Espresso Machines\nfor Every Budget", time: "Just Now", readTime: "6 Min Read" },
      { title: "Our 2026 Bedding Awards\nWinners", time: "2 hours ago", readTime: "4 Min Read" },
      { title: "Bathroom Remodel Ideas\nThat Won't Break the Bank", time: "Yesterday", readTime: "5 Min Read" },
      { title: "The Cleaning Products Our\nEditors Swear By", time: "Mar 5, 2026", readTime: "4 Min Read" },
      { title: "Easy Weeknight Dinners the\nWhole Family Will Love", time: "Mar 4, 2026", readTime: "3 Min Read" },
    ],
    hero: { eyebrow: "GH TESTED", title: "The Best Espresso Machines for Every Budget", desc: "Home, products, food, family — our experts tested dozens of machines to find the ones worth your money.", author: "Rachel Rothman" },
    rightRail: [
      { eyebrow: "PRODUCTS", title: "Our 2026 Bedding\nAwards Winners", desc: "The best sheets,\npillows, and more.", author: "Test Kitchen" },
      { eyebrow: "HOME", title: "Bathroom Remodel\nIdeas That Won't\nBreak the Bank", desc: "Fresh looks for\nevery budget.", author: "Home Editor" },
      { eyebrow: "CLEANING", title: "The Cleaning Products\nOur Editors Swear\nBy", desc: "We tested them so\nyou don't have to.", author: "Cleaning Lab" },
      { eyebrow: "RECIPES", title: "Easy Weeknight Dinners\nthe Whole Family\nWill Love", desc: "Quick, healthy,\nkid-approved.", author: "Test Kitchen" },
    ],
    navLinks: ["Home", "Recipes", "Health", "Beauty", "Cleaning", "Organizing", "Holidays", "Products", "GH Seal"],
  },
  "delish": {
    collectionTitle: "Trending Recipes",
    articles: [
      { title: "Pistachio Tiramisu Is the\nDessert of the Moment", time: "Just Now", readTime: "3 Min Read" },
      { title: "Sweet Potato Couscous\nSunshine Bowls", time: "2 hours ago", readTime: "4 Min Read" },
      { title: "The Lemon Asparagus Pasta\nYou'll Make All Spring", time: "Yesterday", readTime: "3 Min Read" },
      { title: "Baked Feta Frittata: Our New\nFavorite Brunch", time: "Mar 5, 2026", readTime: "4 Min Read" },
      { title: "The St. Patrick's Day Cocktail\nYou Need to Try", time: "Mar 4, 2026", readTime: "2 Min Read" },
    ],
    hero: { eyebrow: "RECIPE OF THE DAY", title: "Pistachio Tiramisu Is the Dessert of the Moment", desc: "Recipes, food trends, kitchen tips — this twist on the classic is taking over dinner parties everywhere.", author: "Makinze Gore" },
    rightRail: [
      { eyebrow: "RECIPES", title: "Sweet Potato Couscous\nSunshine Bowls", desc: "Bright, healthy,\nand delicious.", author: "Recipe Editor" },
      { eyebrow: "PASTA", title: "The Lemon Asparagus\nPasta You'll Make\nAll Spring", desc: "Five ingredients,\n25 minutes.", author: "Pasta Editor" },
      { eyebrow: "BRUNCH", title: "Baked Feta Frittata:\nOur New Favorite\nBrunch", desc: "Creamy, savory,\nand so easy.", author: "Brunch Editor" },
      { eyebrow: "DRINKS", title: "The St. Patrick's Day\nCocktail You Need\nto Try", desc: "The ultimate\nholiday sip.", author: "Drinks Editor" },
    ],
    navLinks: ["Home", "Recipes", "Cooking Tips", "Food News", "Restaurants", "Drinks", "Holidays", "Videos", "Shop"],
  },
  "mens-health": {
    collectionTitle: "Today's Top",
    articles: [
      { title: "The Full-Body Workout That\nBuilds Real Strength", time: "Just Now", readTime: "5 Min Read" },
      { title: "The Mr. Porter Collab Every\nGuy Needs to See", time: "2 hours ago", readTime: "4 Min Read" },
      { title: "The At-Home Routine That\nReplaced My Gym", time: "Yesterday", readTime: "6 Min Read" },
      { title: "The Protein Bar That\nActually Tastes Good", time: "Mar 5, 2026", readTime: "3 Min Read" },
      { title: "Form Check: Are You Doing\nDeadlifts Wrong?", time: "Mar 4, 2026", readTime: "4 Min Read" },
    ],
    hero: { eyebrow: "FITNESS", title: "The Full-Body Workout That Builds Real Strength", desc: "Fitness, health, style, nutrition — the science-backed routine that delivers results without the gym.", author: "Brett Williams, NASM" },
    rightRail: [
      { eyebrow: "STYLE", title: "The Mr. Porter Collab\nEvery Guy Needs\nto See", desc: "Fitness meets\nfashion.", author: "Style Editor" },
      { eyebrow: "FITNESS", title: "The At-Home Routine\nThat Replaced My\nGym", desc: "No equipment?\nNo problem.", author: "Fitness Editor" },
      { eyebrow: "NUTRITION", title: "The Protein Bar That\nActually Tastes\nGood", desc: "Finally, one worth\neating.", author: "Nutrition Editor" },
      { eyebrow: "FORM CHECK", title: "Are You Doing\nDeadlifts Wrong?", desc: "Fix your form for\nbetter gains.", author: "Training Editor" },
    ],
    navLinks: ["Home", "Fitness", "Nutrition", "Health", "Style", "Grooming", "Weight Loss", "Gear", "Entertainment"],
  },
  "house-beautiful": {
    collectionTitle: "Design Inspiration",
    articles: [
      { title: "Leanne Ford's Latest Home\nTransformation", time: "Just Now", readTime: "5 Min Read" },
      { title: "The Color Trend Designers\nCan't Stop Using", time: "2 hours ago", readTime: "4 Min Read" },
      { title: "Small Bathroom Ideas That\nMaximize Every Inch", time: "Yesterday", readTime: "5 Min Read" },
      { title: "The Wallpaper Comeback You\nDidn't See Coming", time: "Mar 5, 2026", readTime: "4 Min Read" },
      { title: "How to Create a Cozy\nScreening Room", time: "Mar 4, 2026", readTime: "6 Min Read" },
    ],
    hero: { eyebrow: "HOME TOUR", title: "Leanne Ford's Latest Home Transformation", desc: "Design, rooms, renovation, lifestyle — the designer's newest project proves why she's the one to watch.", author: "Hadley Mendelsohn" },
    rightRail: [
      { eyebrow: "TRENDS", title: "The Color Trend\nDesigners Can't\nStop Using", desc: "The hue that's\neverywhere.", author: "Design Editor" },
      { eyebrow: "ROOMS", title: "Small Bathroom Ideas\nThat Maximize\nEvery Inch", desc: "Big impact in\ntight spaces.", author: "Rooms Editor" },
      { eyebrow: "TRENDS", title: "The Wallpaper Comeback\nYou Didn't See\nComing", desc: "Bold patterns are\nback.", author: "Design Editor" },
      { eyebrow: "LIFESTYLE", title: "How to Create a Cozy\nScreening Room", desc: "Your home theater\ndreams, realized.", author: "Lifestyle Editor" },
    ],
    navLinks: ["Home", "Rooms", "Decorating", "Gardening", "Shopping", "Renovating", "Design News", "House Tours", "Color"],
  },
  "country-living": {
    collectionTitle: "Country Life",
    articles: [
      { title: "A Charming New York\nFarmhouse Renovation", time: "Just Now", readTime: "5 Min Read" },
      { title: "The Best Perennials for a\nCottage Garden", time: "2 hours ago", readTime: "4 Min Read" },
      { title: "Cozy Bedroom Ideas for\nEvery Season", time: "Yesterday", readTime: "5 Min Read" },
      { title: "DIY Projects That Add\nInstant Charm", time: "Mar 5, 2026", readTime: "4 Min Read" },
      { title: "The Antique Finds Worth\nHunting For", time: "Mar 4, 2026", readTime: "3 Min Read" },
    ],
    hero: { eyebrow: "COUNTRY HOME", title: "A Charming New York Farmhouse Renovation", desc: "Country life, home, garden, DIY — how one family brought a historic property back to life with heart and soul.", author: "Rachel Barrett" },
    rightRail: [
      { eyebrow: "GARDEN", title: "The Best Perennials\nfor a Cottage\nGarden", desc: "Fresh blooms all\nseason long.", author: "Garden Editor" },
      { eyebrow: "HOME", title: "Cozy Bedroom Ideas\nfor Every Season", desc: "Warm, inviting\nspaces year-round.", author: "Home Editor" },
      { eyebrow: "DIY", title: "DIY Projects That\nAdd Instant Charm", desc: "Weekend projects\nthat transform.", author: "Crafts Editor" },
      { eyebrow: "SHOPPING", title: "The Antique Finds\nWorth Hunting For", desc: "What to look for\nat the flea market.", author: "Shopping Editor" },
    ],
    navLinks: ["Home", "Decorating", "Gardening", "Recipes", "Crafts", "Travel", "Shopping", "Entertainment", "Life"],
  },
  "harpers-bazaar": {
    collectionTitle: "The Daily",
    articles: [
      { title: "The Spring Accessories That\nDefine the Season", time: "Just Now", readTime: "4 Min Read" },
      { title: "The New Mauve: Spring's Most\nWearable Color", time: "2 hours ago", readTime: "3 Min Read" },
      { title: "Inside the World's Most\nBeautiful Hotel Bathrobes", time: "Yesterday", readTime: "5 Min Read" },
      { title: "The Art Exhibition Everyone\nIs Talking About", time: "Mar 5, 2026", readTime: "6 Min Read" },
      { title: "The Jewelry Trend That's\nEverywhere Right Now", time: "Mar 4, 2026", readTime: "3 Min Read" },
    ],
    hero: { eyebrow: "FASHION", title: "The Spring Accessories That Define the Season", desc: "Fashion, beauty, celebrity, culture — the pieces that will elevate every outfit in your closet.", author: "Kerry Pieri" },
    rightRail: [
      { eyebrow: "BEAUTY", title: "The New Mauve:\nSpring's Most\nWearable Color", desc: "The shade that\nworks everywhere.", author: "Beauty Director" },
      { eyebrow: "CULTURE", title: "Inside the World's\nMost Beautiful\nHotel Bathrobes", desc: "Luxury in the\ndetails.", author: "Culture Editor" },
      { eyebrow: "ART", title: "The Art Exhibition\nEveryone Is Talking\nAbout", desc: "Don't miss this\ncultural moment.", author: "Arts Editor" },
      { eyebrow: "JEWELRY", title: "The Jewelry Trend\nThat's Everywhere\nRight Now", desc: "The pieces to\ninvest in now.", author: "Jewelry Editor" },
    ],
    navLinks: ["Home", "Fashion", "Beauty", "Celebrity", "Culture", "Weddings", "Shopping", "Travel", "Bazaar Bride"],
  },
  "bicycling": {
    collectionTitle: "Bikes & Gear",
    articles: [
      { title: "The E-Bike That Won Gear\nof the Year", time: "Just Now", readTime: "5 Min Read" },
      { title: "Ride Stronger: A 4-Week\nTraining Plan", time: "2 hours ago", readTime: "6 Min Read" },
      { title: "The Best Gravel Bikes for\nEvery Budget", time: "Yesterday", readTime: "7 Min Read" },
      { title: "Mountain Bike Skills Every\nRider Should Master", time: "Mar 5, 2026", readTime: "5 Min Read" },
      { title: "Tour de France 2026 Preview\nand Predictions", time: "Mar 4, 2026", readTime: "8 Min Read" },
    ],
    hero: { eyebrow: "GEAR OF THE YEAR", title: "The E-Bike That Won Gear of the Year", desc: "Bikes, gear, training, racing — our top pick for 2026 and why it's changing the game.", author: "Test Team" },
    rightRail: [
      { eyebrow: "TRAINING", title: "Ride Stronger: A\n4-Week Training\nPlan", desc: "Build power and\nendurance.", author: "Training Editor" },
      { eyebrow: "GEAR", title: "The Best Gravel\nBikes for Every\nBudget", desc: "From entry-level\nto dream builds.", author: "Gear Editor" },
      { eyebrow: "SKILLS", title: "Mountain Bike Skills\nEvery Rider Should\nMaster", desc: "Level up your\ntechnique.", author: "Skills Editor" },
      { eyebrow: "RACING", title: "Tour de France 2026\nPreview and\nPredictions", desc: "Who to watch\nthis July.", author: "Racing Editor" },
    ],
    navLinks: ["Home", "Bikes", "Gear", "Training", "Racing", "Maintenance", "News", "Videos", "Events"],
  },
  "runners-world": {
    collectionTitle: "Training & Shoes",
    articles: [
      { title: "The Marathon Training Plan\nThat Actually Works", time: "Just Now", readTime: "8 Min Read" },
      { title: "Running After 50: How to Stay\nStrong and Fast", time: "2 hours ago", readTime: "6 Min Read" },
      { title: "The Best Trail Running Shoes\nfor 2026", time: "Yesterday", readTime: "7 Min Read" },
      { title: "How to Prevent Runner's Knee\nfor Good", time: "Mar 5, 2026", readTime: "5 Min Read" },
      { title: "Boston Marathon 2026:\nEverything You Need to Know", time: "Mar 4, 2026", readTime: "6 Min Read" },
    ],
    hero: { eyebrow: "TRAINING", title: "The Marathon Training Plan That Actually Works", desc: "Training, shoes, health, races — the science-backed approach that gets you to the finish line.", author: "Training Editor" },
    rightRail: [
      { eyebrow: "HEALTH", title: "Running After 50:\nHow to Stay Strong\nand Fast", desc: "Age is just a\nnumber.", author: "Health Editor" },
      { eyebrow: "GEAR", title: "The Best Trail\nRunning Shoes for\n2026", desc: "Tested on miles\nof singletrack.", author: "Gear Editor" },
      { eyebrow: "INJURY PREVENTION", title: "How to Prevent\nRunner's Knee for\nGood", desc: "Stay healthy,\nrun longer.", author: "Health Editor" },
      { eyebrow: "RACES", title: "Boston Marathon 2026:\nEverything You Need\nto Know", desc: "Qualifying, logistics,\nand more.", author: "Races Editor" },
    ],
    navLinks: ["Home", "Training", "Shoes & Gear", "Health", "Nutrition", "Races", "News", "Videos", "Events"],
  },
  "womens-health": {
    collectionTitle: "Fitness & Wellness",
    articles: [
      { title: "The Water Flosser That\nChanged My Oral Care Routine", time: "Just Now", readTime: "4 Min Read" },
      { title: "The Calvin Klein Sale You\nDon't Want to Miss", time: "2 hours ago", readTime: "3 Min Read" },
      { title: "Why Your Scalp Care Routine\nMatters More Than You Think", time: "Yesterday", readTime: "5 Min Read" },
      { title: "The Protein Snack\nNutritionists Actually Recommend", time: "Mar 5, 2026", readTime: "4 Min Read" },
      { title: "The Full-Body Workout You Can\nDo Anywhere", time: "Mar 4, 2026", readTime: "5 Min Read" },
    ],
    hero: { eyebrow: "WELLNESS", title: "The Water Flosser That Changed My Oral Care Routine", desc: "Fitness, beauty, food, wellness — the game-changing product our editors can't stop recommending.", author: "Wellness Editor" },
    rightRail: [
      { eyebrow: "SHOPPING", title: "The Calvin Klein\nSale You Don't\nWant to Miss", desc: "Fitness meets\nfashion.", author: "Shopping Editor" },
      { eyebrow: "BEAUTY", title: "Why Your Scalp Care\nRoutine Matters\nMore Than You Think", desc: "Healthy hair starts\nhere.", author: "Beauty Editor" },
      { eyebrow: "NUTRITION", title: "The Protein Snack\nNutritionists Actually\nRecommend", desc: "Smart fuel for\nbusy days.", author: "Nutrition Editor" },
      { eyebrow: "FITNESS", title: "The Full-Body Workout\nYou Can Do\nAnywhere", desc: "No equipment\nrequired.", author: "Fitness Editor" },
    ],
    navLinks: ["Home", "Fitness", "Beauty", "Food", "Wellness", "Weight Loss", "Relationships", "Shopping", "Videos"],
  },
  "prevention": {
    collectionTitle: "Health & Wellness",
    articles: [
      { title: "Dream Week: The Best Sleep\nProducts of 2026", time: "Just Now", readTime: "6 Min Read" },
      { title: "The Cooling Mattress That\nFixed My Night Sweats", time: "2 hours ago", readTime: "5 Min Read" },
      { title: "The Supplements Doctors\nActually Take", time: "Yesterday", readTime: "7 Min Read" },
      { title: "Easy Meal Prep Ideas for Busy\nWeeknights", time: "Mar 5, 2026", readTime: "4 Min Read" },
      { title: "The Walking Routine That\nLowers Blood Pressure", time: "Mar 4, 2026", readTime: "5 Min Read" },
    ],
    hero: { eyebrow: "DREAM WEEK", title: "Dream Week: The Best Sleep Products of 2026", desc: "Health, wellness, nutrition, sleep — our editors tested hundreds of products to find the ones that actually work.", author: "Health Editor" },
    rightRail: [
      { eyebrow: "SLEEP", title: "The Cooling Mattress\nThat Fixed My\nNight Sweats", desc: "Finally, restful\nnights.", author: "Sleep Editor" },
      { eyebrow: "SUPPLEMENTS", title: "The Supplements\nDoctors Actually\nTake", desc: "Evidence-based\nrecommendations.", author: "Health Editor" },
      { eyebrow: "NUTRITION", title: "Easy Meal Prep Ideas\nfor Busy Weeknights", desc: "Healthy eating\nmade simple.", author: "Nutrition Editor" },
      { eyebrow: "FITNESS", title: "The Walking Routine\nThat Lowers Blood\nPressure", desc: "Simple steps for\nbig benefits.", author: "Fitness Editor" },
    ],
    navLinks: ["Home", "Health", "Wellness", "Nutrition", "Fitness", "Sleep", "Recipes", "Mind", "Videos"],
  },
  "road-and-track": {
    collectionTitle: "Cars & Culture",
    articles: [
      { title: "Modern Muscle Showdown:\nCharger vs. Mustang GT", time: "Just Now", readTime: "6 Min Read" },
      { title: "The Ferrari That Redefined\nGrand Touring", time: "2 hours ago", readTime: "8 Min Read" },
      { title: "Why the Manual Transmission\nWill Never Die", time: "Yesterday", readTime: "5 Min Read" },
      { title: "The Forgotten Rally Cars\nof the 1980s", time: "Mar 5, 2026", readTime: "7 Min Read" },
      { title: "Track Day Essentials: What\nto Bring and What to Skip", time: "Mar 4, 2026", readTime: "4 Min Read" },
    ],
    hero: { eyebrow: "COMPARISON", title: "Modern Muscle Showdown: Charger vs. Mustang GT", desc: "Cars, culture, performance, exclusives — two American icons go head-to-head on the track.", author: "Test Team" },
    rightRail: [
      { eyebrow: "CULTURE", title: "The Ferrari That\nRedefined Grand\nTouring", desc: "A modern classic\nthat changed everything.", author: "Culture Editor" },
      { eyebrow: "OPINION", title: "Why the Manual\nTransmission Will\nNever Die", desc: "The case for three\npedals in 2026.", author: "Contributing Editor" },
      { eyebrow: "FEATURES", title: "The Forgotten Rally\nCars of the 1980s", desc: "The machines that\nshaped motorsport.", author: "Features Editor" },
      { eyebrow: "GEAR", title: "Track Day Essentials:\nWhat to Bring and\nWhat to Skip", desc: "Pack smarter for\nyour next lapping day.", author: "Gear Editor" },
    ],
    navLinks: ["Home", "Cars", "Culture", "Performance", "Exclusives", "Racing", "Reviews", "Videos", "Podcasts"],
  },
  "popular-mechanics": {
    collectionTitle: "Science & Technology",
    articles: [
      { title: "The Terracotta Warriors'\nSecret Weapons Revealed", time: "Just Now", readTime: "7 Min Read" },
      { title: "Why Your Brain Needs More\nDowntime Than You Think", time: "2 hours ago", readTime: "5 Min Read" },
      { title: "The Ancient Burial Chamber\nThat Rewrites History", time: "Yesterday", readTime: "8 Min Read" },
      { title: "The DIY Solar Panel Setup\nThat Pays for Itself", time: "Mar 5, 2026", readTime: "6 Min Read" },
      { title: "Inside the Military's Next-Gen\nFighter Jet", time: "Mar 4, 2026", readTime: "7 Min Read" },
    ],
    hero: { eyebrow: "HISTORY", title: "The Terracotta Warriors' Secret Weapons Revealed", desc: "Science, technology, DIY, military — new discoveries shed light on one of history's greatest mysteries.", author: "Science Editor" },
    rightRail: [
      { eyebrow: "SCIENCE", title: "Why Your Brain Needs\nMore Downtime Than\nYou Think", desc: "The science of\nrest and recovery.", author: "Science Editor" },
      { eyebrow: "ARCHAEOLOGY", title: "The Ancient Burial\nChamber That\nRewrites History", desc: "A find that changes\neverything.", author: "History Editor" },
      { eyebrow: "DIY", title: "The DIY Solar Panel\nSetup That Pays\nfor Itself", desc: "Harness the sun,\nsave money.", author: "DIY Editor" },
      { eyebrow: "MILITARY", title: "Inside the Military's\nNext-Gen Fighter\nJet", desc: "The future of\nair combat.", author: "Military Editor" },
    ],
    navLinks: ["Home", "Science", "Technology", "DIY", "Military", "Space", "Cars", "Outdoors", "Videos"],
  },
  "veranda": {
    collectionTitle: "Decorating & Gardens",
    articles: [
      { title: "A Chicago Designer's Stunning\nGreat Hall Renovation", time: "Just Now", readTime: "6 Min Read" },
      { title: "The Manhattan Townhouse With\na Hidden Screening Room", time: "2 hours ago", readTime: "5 Min Read" },
      { title: "Spanish Colonial Style: A\nCalifornia Home Tour", time: "Yesterday", readTime: "7 Min Read" },
      { title: "The Garden Design Trends\nDefining 2026", time: "Mar 5, 2026", readTime: "5 Min Read" },
      { title: "The Most Beautiful Hotels\nOpening This Spring", time: "Mar 4, 2026", readTime: "4 Min Read" },
    ],
    hero: { eyebrow: "HOME TOUR", title: "A Chicago Designer's Stunning Great Hall Renovation", desc: "Decorating, gardens, travel, culture — how one designer transformed a historic space into a masterpiece.", author: "Design Editor" },
    rightRail: [
      { eyebrow: "REAL ESTATE", title: "The Manhattan Townhouse\nWith a Hidden\nScreening Room", desc: "Luxury living at\nits finest.", author: "Real Estate Editor" },
      { eyebrow: "STYLE", title: "Spanish Colonial Style:\nA California Home\nTour", desc: "Timeless elegance\nreimagined.", author: "Style Editor" },
      { eyebrow: "GARDENS", title: "The Garden Design\nTrends Defining\n2026", desc: "What's shaping\noutdoor spaces.", author: "Garden Editor" },
      { eyebrow: "TRAVEL", title: "The Most Beautiful\nHotels Opening\nThis Spring", desc: "Where to stay\nthis season.", author: "Travel Editor" },
    ],
    navLinks: ["Home", "Decorating", "Gardens", "Travel", "Culture", "Real Estate", "Designers", "Shopping", "Videos"],
  },
  "town-and-country": {
    collectionTitle: "Style & Culture",
    articles: [
      { title: "This Linen Sheet Set Will\nChange Your Mind About Bedding", time: "Just Now", readTime: "4 Min Read" },
      { title: "What Editors Are Packing for\nSpring Break", time: "2 hours ago", readTime: "5 Min Read" },
      { title: "The Cooling Mattress Topper\nfor Hot Sleepers", time: "Yesterday", readTime: "4 Min Read" },
      { title: "How to Watch Guillermo del\nToro's Frankenstein", time: "Mar 5, 2026", readTime: "3 Min Read" },
      { title: "The Jeans That Look Like They\nWere Made for Me", time: "Mar 4, 2026", readTime: "4 Min Read" },
    ],
    hero: { eyebrow: "SHOPPING", title: "This Linen Sheet Set Will Change Your Mind About Bedding", desc: "Style, travel, culture, society — the investment that transforms your sleep and your bedroom.", author: "Style Editor" },
    rightRail: [
      { eyebrow: "TRAVEL", title: "What Editors Are\nPacking for Spring\nBreak", desc: "The essentials for\nevery trip.", author: "Travel Editor" },
      { eyebrow: "SLEEP", title: "The Cooling Mattress\nTopper for Hot\nSleepers", desc: "Finally, restful\nnights.", author: "Wellness Editor" },
      { eyebrow: "CULTURE", title: "How to Watch\nGuillermo del Toro's\nFrankenstein", desc: "The must-see\nfilm of the season.", author: "Culture Editor" },
      { eyebrow: "STYLE", title: "The Jeans That Look\nLike They Were\nMade for Me", desc: "The perfect fit,\nfinally.", author: "Style Editor" },
    ],
    navLinks: ["Home", "Style", "Travel", "Culture", "Society", "Weddings", "Real Estate", "Jewelry", "Videos"],
  },
  "oprah-daily": {
    collectionTitle: "Wellness & Books",
    articles: [
      { title: "Dream Big: The Sleep O-wards\n2026", time: "Just Now", readTime: "5 Min Read" },
      { title: "An Ode to Oversharing: Why\nVulnerability Wins", time: "2 hours ago", readTime: "6 Min Read" },
      { title: "The GLP-1 Checklist Your\nDoctor Wants You to See", time: "Yesterday", readTime: "7 Min Read" },
      { title: "Can AI Therapy Actually Help?", time: "Mar 5, 2026", readTime: "5 Min Read" },
      { title: "Oprah's Book Club: The March\nPick", time: "Mar 4, 2026", readTime: "4 Min Read" },
    ],
    hero: { eyebrow: "DREAM WEEK", title: "Dream Big: The Sleep O-wards 2026", desc: "Wellness, books, beauty, lifestyle — our editors' picks for the best sleep products of the year.", author: "Oprah Daily Editors" },
    rightRail: [
      { eyebrow: "WELLNESS", title: "An Ode to Oversharing:\nWhy Vulnerability\nWins", desc: "The power of\nbeing open.", author: "Wellness Editor" },
      { eyebrow: "HEALTH", title: "The GLP-1 Checklist\nYour Doctor Wants\nYou to See", desc: "What to ask before\nstarting.", author: "Health Editor" },
      { eyebrow: "MENTAL HEALTH", title: "Can AI Therapy\nActually Help?", desc: "We put it to\nthe test.", author: "Mental Health Editor" },
      { eyebrow: "BOOK CLUB", title: "Oprah's Book Club:\nThe March Pick", desc: "The book everyone\nwill be reading.", author: "Books Editor" },
    ],
    navLinks: ["Home", "Wellness", "Books", "Beauty", "Lifestyle", "Health", "Relationships", "Spirituality", "Videos"],
  },
  "seventeen": {
    collectionTitle: "Celebs & Beauty",
    articles: [
      { title: "Harry Styles' New Era:\nEverything We Know", time: "Just Now", readTime: "4 Min Read" },
      { title: "Emily in Paris Season 5 Cast\nRevealed", time: "2 hours ago", readTime: "3 Min Read" },
      { title: "The Summer I Turned Pretty\nSeason 4 Updates", time: "Yesterday", readTime: "4 Min Read" },
      { title: "BLACKPINK's Lisa and Jennie\nReunite", time: "Mar 5, 2026", readTime: "3 Min Read" },
      { title: "The Best Prom Dresses Under\n$100", time: "Mar 4, 2026", readTime: "5 Min Read" },
    ],
    hero: { eyebrow: "CELEBS", title: "Harry Styles' New Era: Everything We Know", desc: "Celebs, beauty, fashion, relationships — the latest on the star's next chapter and what to expect.", author: "Celebrity Editor" },
    rightRail: [
      { eyebrow: "TV", title: "Emily in Paris Season 5\nCast Revealed", desc: "Who's joining the\ncast this season.", author: "TV Editor" },
      { eyebrow: "TV", title: "The Summer I Turned\nPretty Season 4\nUpdates", desc: "Everything we know\nso far.", author: "TV Editor" },
      { eyebrow: "MUSIC", title: "BLACKPINK's Lisa and\nJennie Reunite", desc: "The moment Blinks\nhave been waiting for.", author: "Music Editor" },
      { eyebrow: "FASHION", title: "The Best Prom Dresses\nUnder $100", desc: "Stunning looks that\nwon't break the bank.", author: "Fashion Editor" },
    ],
    navLinks: ["Home", "Celebs", "Beauty", "Fashion", "Relationships", "Life", "Entertainment", "Shopping", "Videos"],
  },
  "womans-day": {
    collectionTitle: "Food & Family",
    articles: [
      { title: "Green Tea Cookies That Taste\nLike Spring", time: "Just Now", readTime: "3 Min Read" },
      { title: "The Best Family Games for\nGame Night", time: "2 hours ago", readTime: "4 Min Read" },
      { title: "Bible Verses for Strength and\nComfort", time: "Yesterday", readTime: "5 Min Read" },
      { title: "Fun Outdoor Activities for Kids\nThis Weekend", time: "Mar 5, 2026", readTime: "4 Min Read" },
      { title: "The Peppermint Shake You'll\nCrave All Year", time: "Mar 4, 2026", readTime: "2 Min Read" },
    ],
    hero: { eyebrow: "RECIPES", title: "Green Tea Cookies That Taste Like Spring", desc: "Food, family, health, lifestyle — the sweet treat that's perfect for any occasion.", author: "Food Editor" },
    rightRail: [
      { eyebrow: "FAMILY", title: "The Best Family Games\nfor Game Night", desc: "Fun for all ages.", author: "Family Editor" },
      { eyebrow: "FAITH", title: "Bible Verses for\nStrength and\nComfort", desc: "Words to lean on\nin tough times.", author: "Faith Editor" },
      { eyebrow: "KIDS", title: "Fun Outdoor Activities\nfor Kids This\nWeekend", desc: "Get the whole\nfamily outside.", author: "Family Editor" },
      { eyebrow: "RECIPES", title: "The Peppermint Shake\nYou'll Crave All\nYear", desc: "Refreshing and\ndelicious.", author: "Food Editor" },
    ],
    navLinks: ["Home", "Food", "Family", "Health", "Lifestyle", "Crafts", "Holidays", "Faith", "Videos"],
  },
  "redbook": {
    collectionTitle: "Beauty & Style",
    articles: [
      { title: "The Best Powder Sunscreens for On-the-Go Protection", time: "Just Now", readTime: "5 Min Read" },
      { title: "The Anti-Aging Skincare Routine Derms Recommend After 40", time: "3 hours ago", readTime: "7 Min Read" },
      { title: "Hailey Bieber's Rhode Launch Party Was a Beauty Masterclass", time: "Yesterday", readTime: "4 Min Read" },
      { title: "The Best Luxury Department Stores Around the World", time: "Mar 10, 2026", readTime: "6 Min Read" },
      { title: "Non-Surgical Treatments That Actually Deliver Results", time: "Mar 9, 2026", readTime: "8 Min Read" },
    ],
    hero: { eyebrow: "Fashion", title: "The Spring Style Guide for Every Body Type", desc: "From workwear to weekend looks, these versatile pieces will carry you through the season.", author: "Redbook Editors" },
    rightRail: [
      { eyebrow: "Beauty", title: "The Dry Shampoo That Changed My Hair Routine", desc: "A game-changer for second-day hair.", author: "Beauty Team" },
      { eyebrow: "Love", title: "How to Keep the Spark Alive After 10 Years", desc: "Relationship experts share their best advice.", author: "Sarah Chen" },
      { eyebrow: "Body", title: "The 20-Minute Workout That Fits Any Schedule", desc: "No gym required for this full-body routine.", author: "Fitness Editors" },
      { eyebrow: "Home", title: "Small Kitchen Upgrades With Big Impact", desc: "Budget-friendly changes that transform the space.", author: "Home Team" },
    ],
    navLinks: ["Home", "Beauty", "Fashion", "Body", "Food & Cocktails", "Life", "Love", "Videos"],
  },
  "biography": {
    collectionTitle: "Trending Now",
    articles: [
      { title: "The True Story Behind the New Hamnet Film", time: "Just Now", readTime: "6 Min Read" },
      { title: "The Perfect Neighbor: Everything We Know So Far", time: "2 hours ago", readTime: "5 Min Read" },
      { title: "Where to Watch Every 2026 Oscar-Nominated Film", time: "Yesterday", readTime: "4 Min Read" },
      { title: "Lainey Wilson's Rise From Small Town to Superstardom", time: "Mar 11, 2026", readTime: "7 Min Read" },
      { title: "The Reality TV Stars Who Became Household Names", time: "Mar 10, 2026", readTime: "5 Min Read" },
    ],
    hero: { eyebrow: "Celebrity", title: "The Untold Stories of Hollywood's Biggest Icons", desc: "From silver screen legends to modern-day superstars, the biographies that reveal who they really are.", author: "Biography Staff" },
    rightRail: [
      { eyebrow: "History", title: "Pi Day: The Fascinating History Behind March 14th", desc: "More than just a math holiday.", author: "History Team" },
      { eyebrow: "TV", title: "The Crime Drama Everyone Is Binge-Watching", desc: "A gripping new series takes over streaming.", author: "Entertainment Desk" },
      { eyebrow: "Music", title: "The Country Star Redefining the Genre", desc: "How one artist is bridging tradition and innovation.", author: "Music Editors" },
      { eyebrow: "Film", title: "The Oscar Contenders You Haven't Seen Yet", desc: "Hidden gems from this year's awards season.", author: "Film Team" },
    ],
    navLinks: ["Home", "Celebrities", "History", "TV", "Movies", "Music", "Crime", "News"],
  },
  "the-pioneer-woman": {
    collectionTitle: "Recipes & Cooking",
    articles: [
      { title: "Irish Cream Poke Cake That'll Steal the Show", time: "Just Now", readTime: "4 Min Read" },
      { title: "The Best Chicken Spaghetti You'll Ever Make", time: "2 hours ago", readTime: "5 Min Read" },
      { title: "Ree's Irish Coffee Recipe for St. Patrick's Day", time: "Yesterday", readTime: "3 Min Read" },
      { title: "The Irish Mule: A Festive Twist on a Classic Cocktail", time: "Mar 11, 2026", readTime: "3 Min Read" },
      { title: "Easy Weeknight Dinners the Whole Family Will Love", time: "Mar 10, 2026", readTime: "6 Min Read" },
    ],
    hero: { eyebrow: "Cooking", title: "Ree Drummond's Favorite Spring Recipes", desc: "From hearty casseroles to fresh salads, these are the dishes that define the season on the ranch.", author: "Ree Drummond" },
    rightRail: [
      { eyebrow: "Baking", title: "The Sheet Cake Recipe That Feeds a Crowd", desc: "Perfect for potlucks and parties.", author: "Ree Drummond" },
      { eyebrow: "Entertaining", title: "How to Host a St. Patrick's Day Brunch", desc: "Green-themed recipes and decor ideas.", author: "TPW Editors" },
      { eyebrow: "Ranch Life", title: "Spring on the Ranch: What's Growing Now", desc: "A look at the garden and what's coming up.", author: "Ree Drummond" },
      { eyebrow: "Comfort Food", title: "The One-Pot Pasta Everyone Requests", desc: "Minimal cleanup, maximum flavor.", author: "Recipe Team" },
    ],
    navLinks: ["Home", "Recipes", "Cooking", "Entertainment", "Shopping", "Ranch Life", "Holidays", "Videos"],
  },
};

function getContent(brandSlug: string): ContentType {
  const override = BRAND_CONTENT[brandSlug];
  if (!override) return defaultContent;
  return { ...defaultContent, ...override };
}

function UtilityBar() {
  return (
    <div className="flex items-center justify-between px-3 h-8 text-[11px] font-semibold"
      style={{ backgroundColor: "var(--brand-primary, #000)", color: "#fff" }}>
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1 opacity-90">Shop</span>
        <span className="flex items-center gap-1 opacity-90">Newsletter</span>
        <span className="flex items-center gap-1 opacity-90">Sign In</span>
      </div>
      <button className="px-3 py-0.5 rounded-sm text-[11px] font-semibold"
        style={{ backgroundColor: "var(--palette-neutral-lightest, #fff)", color: "var(--brand-primary, #000)" }}>
        Subscribe
      </button>
    </div>
  );
}

function MainNav({ brandSlug }: { brandSlug: string }) {
  const { brand } = useTheme();
  const logo = brandLogos[brand.slug];
  const content = getContent(brandSlug);

  return (
    <div className="border-b py-2 px-6" style={{ borderColor: "var(--palette-neutral-300, #d6d6d6)" }}>
      <div className="flex items-center justify-between py-2 max-w-[1360px] mx-auto">
        <div className="w-[180px]" />
        <div className="text-center">
          {logo ? (
            <BrandLogo slug={brand.slug} className="[&_svg]:h-10 [&_svg]:w-auto mx-auto" />
          ) : (
            <h1 className="text-2xl tracking-[6px] uppercase headline">
              {brand.name}
            </h1>
          )}
        </div>
        <div className="w-[180px] flex justify-end gap-2">
          <div className="w-7 h-7 rounded border flex items-center justify-center text-xs"
            style={{ borderColor: "var(--palette-neutral-400, #bdbdbd)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-6 py-2 max-w-[1360px] mx-auto overflow-x-auto scrollbar-hide">
        {content.navLinks.map((link) => (
          <span key={link} className="text-[13px] whitespace-nowrap cursor-pointer hover:opacity-70 transition-opacity"
            style={{ color: "var(--palette-neutral-900, #292929)" }}>
            {link}
          </span>
        ))}
      </div>
    </div>
  );
}

function CollectionList({ brandSlug }: { brandSlug: string }) {
  const content = getContent(brandSlug);
  const images = getBrandImages(brandSlug);

  return (
    <div className="w-full lg:w-[320px] shrink-0 space-y-3">
      <div className="space-y-2">
        <h3 className="text-xl uppercase headline"
          style={{ color: "var(--brand-primary, #000)" }}>
          {content.collectionTitle}
        </h3>
        <div className="h-[3px] w-full" style={{ backgroundColor: "var(--brand-primary, #000)" }} />
      </div>
      <div className="space-y-5">
        {content.articles.map((article, i) => (
          <div key={i} className="flex gap-3 group cursor-pointer">
            <div className="w-[72px] h-[72px] rounded shrink-0 relative overflow-hidden"
              style={{ backgroundColor: "var(--palette-neutral-200, #ededed)" }}>
              <img src={images.articles[i % images.articles.length]} alt="" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
              <div className="absolute top-1 left-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                style={{ backgroundColor: "var(--brand-primary, #000)" }}>
                {i + 1}
              </div>
            </div>
            <div className="min-w-0">
              <p className="text-sm leading-snug group-hover:underline whitespace-pre-line headline">
                {article.title}
              </p>
              <div className="flex items-center gap-2 mt-1 text-xs" style={{ color: "var(--palette-neutral-600, #757575)" }}>
                <span>{article.time}</span>
                <span>·</span>
                <span>{article.readTime}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HeroCard({ brandSlug }: { brandSlug: string }) {
  const content = getContent(brandSlug);
  const images = getBrandImages(brandSlug);

  return (
    <div className="flex-1 min-w-0 space-y-2">
      <div className="w-full aspect-square rounded relative overflow-hidden"
        style={{ backgroundColor: "var(--palette-neutral-200, #ededed)" }}>
        <img src={images.hero} alt="" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      </div>
      <div className="space-y-1">
        <span className="text-xs font-semibold uppercase tracking-wide font-brand-secondary"
          style={{ color: "var(--brand-primary, #000)" }}>
          {content.hero.eyebrow}
        </span>
        <h2 className="text-2xl lg:text-[32px] leading-tight headline">
          {content.hero.title}
        </h2>
        <p className="text-base leading-relaxed" style={{ color: "var(--palette-neutral-700, #575757)" }}>
          {content.hero.desc}
        </p>
        <p className="text-[13px] font-semibold">{content.hero.author}</p>
      </div>
    </div>
  );
}

function RightRailCard({
  card,
  image,
}: {
  card: { eyebrow: string; title: string; desc: string; author: string };
  image: string;
}) {
  return (
    <div className="flex gap-3 group cursor-pointer">
      <div className="w-[100px] h-[100px] rounded shrink-0 relative overflow-hidden"
        style={{ backgroundColor: "var(--palette-neutral-200, #ededed)" }}>
        <img src={image} alt="" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
      </div>
      <div className="min-w-0 space-y-1">
        <span className="text-[11px] font-semibold uppercase tracking-wide font-brand-secondary"
          style={{ color: "var(--brand-primary, #000)" }}>
          {card.eyebrow}
        </span>
        <p className="text-sm leading-snug group-hover:underline whitespace-pre-line headline">
          {card.title}
        </p>
        <p className="text-xs leading-relaxed whitespace-pre-line" style={{ color: "var(--palette-neutral-600, #757575)" }}>
          {card.desc}
        </p>
        <p className="text-xs font-semibold">{card.author}</p>
      </div>
    </div>
  );
}

function RightRail({ brandSlug }: { brandSlug: string }) {
  const content = getContent(brandSlug);
  const images = getBrandImages(brandSlug);

  return (
    <div className="w-full lg:w-[321px] shrink-0 space-y-8">
      <div className="space-y-6">
        {content.rightRail.map((card, i) => (
          <RightRailCard key={i} card={card} image={images.rightRail[i % images.rightRail.length]} />
        ))}
      </div>
      <div className="flex flex-col items-center gap-1 py-4 rounded"
        style={{ backgroundColor: "var(--palette-neutral-100, #f5f5f5)" }}>
        <span className="text-[10px] uppercase tracking-wider" style={{ color: "var(--palette-neutral-500, #949494)" }}>
          Advertisement
        </span>
        <div className="w-[300px] h-[250px] rounded flex items-center justify-center text-sm"
          style={{ backgroundColor: "var(--palette-neutral-200, #ededed)", color: "var(--palette-neutral-500, #949494)" }}>
          AD 300 × 250
        </div>
      </div>
    </div>
  );
}

function NewsletterPromo({ brandSlug }: { brandSlug: string }) {
  const { brand } = useTheme();

  return (
    <div className="py-10 px-6 lg:px-12 space-y-6"
      style={{ backgroundColor: "var(--palette-background-subtle-brand, #f5f0e8)" }}>
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-[1.5px] font-brand-secondary"
          style={{ color: "var(--palette-content-default, #121212)" }}>
          Sign up for {brand.name}&rsquo;s Newsletter
        </p>
        <h3 className="text-2xl lg:text-[32px] leading-tight headline">
          Hear from our expert journalists.
        </h3>
      </div>
      <div className="flex flex-col sm:flex-row gap-0">
        <div className="flex items-center gap-2 flex-1 px-4 h-12 border border-r-0 sm:border-r-0"
          style={{ backgroundColor: "#fff", borderColor: "var(--palette-neutral-400, #bdbdbd)" }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--palette-neutral-500, #949494)", flexShrink: 0 }}><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
          <span className="text-sm" style={{ color: "var(--palette-neutral-500, #949494)" }}>Enter your email here.</span>
        </div>
        <button className="h-12 px-6 text-sm font-bold uppercase tracking-[1px] whitespace-nowrap shrink-0"
          style={{ backgroundColor: "var(--brand-primary, #1B5F8A)", color: "#fff" }}>
          Sign Me Up
        </button>
      </div>
      <p className="text-[11px] leading-relaxed"
        style={{ color: "var(--palette-neutral-600, #757575)" }}>
        By signing up, I agree to the <span className="underline cursor-pointer">Terms of Use</span> (including
        the <span className="underline cursor-pointer">dispute resolution procedures</span>) and have reviewed
        the <span className="underline cursor-pointer">Privacy Notice</span>.
        This site is protected by reCAPTCHA and the Google <span className="underline cursor-pointer">Privacy
        Policy</span> and <span className="underline cursor-pointer">Terms of Service</span> apply.
      </p>
    </div>
  );
}

function TrendingCard({ card, index, image }: { card: { title: string; time: string }; index: number; image: string }) {
  return (
    <div className="w-[183px] shrink-0 space-y-2 group cursor-pointer">
      <div className="w-full aspect-square rounded relative overflow-hidden"
        style={{ backgroundColor: "var(--palette-neutral-200, #ededed)" }}>
        <img src={image} alt="" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
        <div className="absolute top-1.5 left-1.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
          style={{ backgroundColor: "var(--brand-primary, #000)" }}>
          {index + 1}
        </div>
      </div>
      <p className="text-sm leading-snug group-hover:underline whitespace-pre-line headline">
        {card.title}
      </p>
      <span className="text-xs" style={{ color: "var(--palette-neutral-600, #757575)" }}>
        {card.time}
      </span>
    </div>
  );
}

function TrendingSection({ brandSlug }: { brandSlug: string }) {
  const content = getContent(brandSlug);
  const images = getBrandImages(brandSlug);

  return (
    <div className="space-y-6">
      <h2 className="text-4xl lg:text-5xl headline">
        Trending
      </h2>
      <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-2">
        {content.trending.map((card, i) => (
          <TrendingCard key={i} card={card} index={i} image={images.trending[i % images.trending.length]} />
        ))}
      </div>
    </div>
  );
}

function Footer({ brandSlug }: { brandSlug: string }) {
  const { brand } = useTheme();
  const logo = brandLogos[brand.slug];
  const content = getContent(brandSlug);

  return (
    <footer className="pt-12 pb-8 space-y-8 max-w-[1360px] mx-auto border-t"
      style={{ borderColor: "var(--palette-neutral-300, #d6d6d6)" }}>
      <div className="flex items-center gap-6">
        {logo ? (
          <BrandLogo slug={brand.slug} className="[&_svg]:h-5 [&_svg]:w-auto" />
        ) : (
          <span className="text-xl tracking-[4px] uppercase headline">
            {brand.name}
          </span>
        )}
        <div className="flex gap-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--palette-content-default, #121212)" }}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--palette-content-default, #121212)" }}><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--palette-content-default, #121212)" }}><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--palette-content-default, #121212)" }}><line x1="12" x2="12" y1="17" y2="22"/><path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"/></svg>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {content.footerCols.map((col, i) => (
          <div key={i} className="space-y-3">
            {col.map((link) => (
              <p key={link} className="text-sm cursor-pointer hover:underline">{link}</p>
            ))}
          </div>
        ))}
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t text-xs"
        style={{ borderColor: "var(--palette-neutral-300, #d6d6d6)", color: "var(--palette-neutral-600, #757575)" }}>
        <div className="flex flex-wrap gap-4">
          <span>© 2026 Hearst Magazine Media, Inc.</span>
          <span className="cursor-pointer hover:underline">Privacy Policy</span>
          <span className="cursor-pointer hover:underline">Terms of Use</span>
        </div>
        <button className="px-3 py-1.5 rounded text-xs font-medium"
          style={{ backgroundColor: "var(--palette-neutral-100, #f5f5f5)" }}>
          Your Privacy Choices
        </button>
      </div>
    </footer>
  );
}

export function BrandHomePage() {
  const { brand } = useTheme();

  return (
    <div className="min-h-screen font-brand" style={{
      backgroundColor: "var(--palette-neutral-lightest, #fff)",
    }}>
      <NavBar />

      <div className="max-w-[1440px] mx-auto">
        {/* Ad Banner */}
        <div className="flex items-center justify-center h-[100px] lg:h-[250px]"
          style={{ backgroundColor: "var(--palette-neutral-100, #f5f5f5)" }}>
          <div className="flex items-center justify-center rounded text-sm"
            style={{ backgroundColor: "var(--palette-neutral-200, #ededed)", color: "var(--palette-neutral-500, #949494)", width: 728, height: 90 }}>
            AD 728 × 90
          </div>
        </div>

        {/* Utility Bar */}
        <UtilityBar />

        {/* Main Nav */}
        <MainNav brandSlug={brand.slug} />

        {/* Page Body */}
        <div className="max-w-[1360px] mx-auto px-4 lg:px-0 pt-8 lg:pt-12 space-y-12 lg:space-y-16">
          {/* Top Section: Collection + Hero + Right Rail */}
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Left Column */}
            <div className="flex-1 min-w-0 space-y-8 lg:space-y-12">
              {/* Collection + Hero */}
              <div className="flex flex-col md:flex-row gap-6 lg:gap-8">
                <CollectionList brandSlug={brand.slug} />
                <HeroCard brandSlug={brand.slug} />
              </div>

              {/* Newsletter + Trending */}
              <NewsletterPromo brandSlug={brand.slug} />
              <TrendingSection brandSlug={brand.slug} />
            </div>

            {/* Right Rail */}
            <RightRail brandSlug={brand.slug} />
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 lg:px-0">
          <Footer brandSlug={brand.slug} />
        </div>
      </div>
    </div>
  );
}
