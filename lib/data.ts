// BUBBLEHOPS content & product data.
// Extracted from the design handoff (source/bubblehops-site.dc.html) so the
// live site matches the approved copy, pricing and geometry exactly.

export type BaseTrainer = {
  id: string;
  img: string;
  name: string;
  meta: string;
  price: number;
  panel: keyof typeof PANELS;
  ar: number; // photo aspect ratio (width / height)
  heel: { x: string; y: string };
  box: { left: string; top: string; width: string };
  /** Marked true where the source used a placeholder photo — swap before shipping. */
  placeholderPhoto?: boolean;
};

export const BASES_IN_STOCK: BaseTrainer[] = [
  {
    id: 'lamorra',
    img: '/photos/bubblehops-kappa-la-morra-kids-trainer-base.jpg',
    name: 'Kappa La Morra',
    meta: 'Chunky sole · UK kids’ 10 – 6',
    price: 78,
    panel: 'base01',
    ar: 759 / 380,
    heel: { x: '13%', y: '80%' },
    box: { left: '32%', top: '40%', width: '36%' }
  },
  {
    id: 'advantage',
    img: '/photos/bubblehops-adidas-advantage-kids-trainer-base.jpg',
    name: 'Adidas Advantage Base',
    meta: 'Lace-up · UK kids’ 10 – 2',
    price: 80,
    panel: 'base05',
    ar: 900 / 442,
    heel: { x: '13%', y: '74%' },
    box: { left: '32%', top: '42%', width: '36%' }
  },
  {
    id: 'boroughmid',
    img: '/photos/bubblehops-nike-court-borough-mid-2-kids-trainer-base.jpg',
    name: 'Nike Court Borough Mid 2',
    meta: 'Mid top · UK kids’ 10 – 6',
    price: 125,
    panel: 'base04',
    ar: 1513 / 954,
    heel: { x: '12%', y: '82%' },
    box: { left: '33%', top: '40%', width: '34%' }
  },
  {
    id: 'airforce',
    img: '/photos/bubblehops-nike-court-borough-kids-trainer-base.jpg',
    name: 'Nike Air Force 1',
    meta: 'High top · UK kids’ 10 – 6',
    price: 135,
    panel: 'base03',
    ar: 328 / 162,
    heel: { x: '13%', y: '79%' },
    box: { left: '33%', top: '40%', width: '34%' },
    placeholderPhoto: true // TODO: swap in the real AF1 product photo before shipping
  }
];

export function getBase(id: string): BaseTrainer | undefined {
  return BASES_IN_STOCK.find((b) => b.id === id);
}

export type WordColour = { id: string; value: string; label: string };

export const WORD_COLOURS: WordColour[] = [
  { id: 'grey', value: '#c0c0c0', label: 'Silver' },
  { id: 'lime', value: '#b6ea16', label: 'Lime' },
  { id: 'green', value: '#1f9d55', label: 'Green' },
  { id: 'teal', value: '#12b5b0', label: 'Teal' },
  { id: 'sky', value: '#4aa8ff', label: 'Sky blue' },
  { id: 'blue', value: '#1f4fd8', label: 'Blue' },
  { id: 'purple', value: 'oklch(0.52 0.22 305)', label: 'Purple' },
  { id: 'lilac', value: '#b98cf0', label: 'Lilac' },
  { id: 'magenta', value: '#d81b8c', label: 'Magenta' },
  { id: 'pink', value: '#ff7ab8', label: 'Pink' },
  { id: 'red', value: '#e02a1b', label: 'Red' },
  { id: 'orange', value: '#ff7a1a', label: 'Orange' },
  { id: 'gold', value: '#e8b400', label: 'Gold' },
  { id: 'yellow', value: '#f7e733', label: 'Yellow' },
  { id: 'brown', value: '#7a4a1e', label: 'Brown' }
];

/** Gloss gradient stops for the two metallic colours — single source of truth for
 * the picker swatch, the painted word's fill (via background-clip:text, using the
 * derived CSS string below) and the sticker's SVG fill (via linearGradient stops
 * built from this same data), so all three stay visually identical. Kept
 * low-contrast (tight band around the base tone) so it still reads as metallic
 * without looking chrome-like or washing out the word. */
export const METALLIC_GRADIENT_STOPS: Record<string, { offset: string; color: string }[]> = {
  grey: [
    { offset: '0%', color: '#b8b8b8' },
    { offset: '30%', color: '#e0e0e0' },
    { offset: '55%', color: '#9c9c9c' },
    { offset: '80%', color: '#d2d2d2' },
    { offset: '100%', color: '#b0b0b0' }
  ],
  gold: [
    { offset: '0%', color: '#cf9f2a' },
    { offset: '30%', color: '#ecd583' },
    { offset: '55%', color: '#a97c0e' },
    { offset: '80%', color: '#ddbd5f' },
    { offset: '100%', color: '#c0930f' }
  ]
};

export const METALLIC_SWATCH_GRADIENT: Record<string, string> = Object.fromEntries(
  Object.entries(METALLIC_GRADIENT_STOPS).map(([id, stops]) => [
    id,
    `linear-gradient(135deg, ${stops.map((s) => `${s.color} ${s.offset}`).join(', ')})`
  ])
);

/** A stroke can't take a CSS gradient, so the metallic outline is faked with a darker
 * base tone plus a thinner lighter tone layered on top, reading as a subtle bevel. */
export const METALLIC_STROKE_TONES: Record<string, { base: string; highlight: string }> = {
  grey: { base: '#a0a0a0', highlight: '#dcdcdc' },
  gold: { base: '#a97c0e', highlight: '#ddbd5f' }
};

export const SIZES = ['UK 10', 'UK 11', 'UK 12', 'UK 13', 'UK 1', 'UK 2', 'UK 3', 'UK 4', 'UK 5', 'UK 6'];

// Seed matching source/inventory.js's FALLBACK_STOCK — used whenever Supabase
// isn't configured (see lib/inventory.ts), so the designer/checkout always work.
export const SEED_STOCK: Record<string, Record<string, number>> = {
  lamorra: { 'UK 10': 2, 'UK 11': 3, 'UK 12': 0, 'UK 13': 4, 'UK 1': 2, 'UK 2': 1, 'UK 3': 0, 'UK 4': 3, 'UK 5': 2, 'UK 6': 1 },
  advantage: { 'UK 10': 4, 'UK 11': 2, 'UK 12': 3, 'UK 13': 2, 'UK 1': 5, 'UK 2': 3, 'UK 3': 0, 'UK 4': 0, 'UK 5': 0, 'UK 6': 0 },
  boroughmid: { 'UK 10': 2, 'UK 11': 1, 'UK 12': 1, 'UK 13': 0, 'UK 1': 2, 'UK 2': 2, 'UK 3': 3, 'UK 4': 1, 'UK 5': 0, 'UK 6': 2 },
  airforce: { 'UK 10': 0, 'UK 11': 0, 'UK 12': 0, 'UK 13': 0, 'UK 1': 0, 'UK 2': 0, 'UK 3': 0, 'UK 4': 0, 'UK 5': 0, 'UK 6': 0 }
};

export type Faq = { q: string; a: string };

export const FAQS: Faq[] = [
  {
    q: 'How much do custom trainers cost?',
    a: "Prices start at £78 for a single hand-painted shoe on a Kappa La Morra base and run to £157 for a full pair on a Nike Court Borough Mid 2. The base trainer is bought new in your child's size and included in that price, as is the painting, sealing and free standard UK delivery. Leaving one shoe blank reduces the total."
  },
  {
    q: 'How are custom trainers made?',
    a: 'Every panel that takes colour is stripped with acetone deglazer first, which is the step most custom pairs skip and the reason they crack. Colour goes on in thin layers of Angelus acrylic leather paint, built up by hand rather than sprayed, then the lettering is outlined and cleaned up. Two coats of acrylic finisher seal the pair, and it cures fully before it is boxed.'
  },
  {
    q: 'How to look after hand-painted trainers',
    a: 'Wipe them with a damp cloth, mild soap and light pressure. Never put painted trainers through a washing machine, however muddy they get. Dry them at room temperature stuffed with paper, away from radiators, because heat lifts the finish. Keep acetone, alcohol wipes and magic erasers away from the paint, as those are designed to remove exactly this kind of coating.'
  },
  {
    q: 'Can I send you my own design?',
    a: "Yes. The online designer covers names, lettering colours and bubble stickers, but if you have a drawing, a character, a logo or a photo in mind, send it over on the contact page and we'll quote for it. Hand-drawn artwork from the child themselves is the one we most enjoy painting."
  },
  {
    q: 'Best trainers to customise',
    a: "Smooth leather uppers take paint best, which is why our base range is built around them. The Adidas Advantage is the most forgiving and the cheapest to start with; the Court Borough Mid 2 adds the ankle panel for more artwork. Canvas and knit trainers absorb paint unevenly and we don't recommend them."
  },
  {
    q: 'How long do custom trainers take to make?',
    a: 'Usually about three days from the date of order, plus two to three days for delivery. Next-day delivery is available at checkout if you need them sooner. You get a photo of the finished pair before it ships and 24 hours to comment.'
  },
  {
    q: 'Can I send these as a gift?',
    a: "Yes. Add a gift note at checkout and we'll write it into the box, leave the invoice out, and ship straight to the recipient's address. If it's for a birthday, tell us the date on the contact form and we'll work back from it."
  },
  {
    q: 'Do you do adult shoe sizes?',
    a: "Yes we do — get in touch to speak with us directly."
  }
];

export const CARE_STEPS = [
  {
    n: '01',
    title: 'Strip and prep',
    body: 'Every panel that takes colour is stripped with acetone deglazer first — the step most custom pairs skip, and the reason they crack.'
  },
  {
    n: '02',
    title: 'Paint by hand',
    body: 'Colour goes on in thin layers of Angelus acrylic leather paint, built up by hand rather than sprayed, then the lettering is outlined and cleaned up.'
  },
  {
    n: '03',
    title: 'Seal and cure',
    body: 'Two coats of acrylic finisher seal the pair, and it cures fully before it is boxed and photographed for you to approve.'
  }
];

export const SITE = {
  name: 'BUBBLEHOPS',
  email: 'studio@bubblehops.com',
  instagramHandle: '@bubblehop_uk',
  instagramUrl: 'https://instagram.com/bubblehop_uk',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://bubblehops.co.uk'
};

export type RouteMeta = { path: string; title: string; desc: string; crumb: string };

export const ROUTES: Record<string, RouteMeta> = {
  home: { path: '/', title: "BUBBLEHOPS | Hand-Painted Custom Kids' Trainers, Made in the UK", desc: "Design hand-painted custom kids' trainers online. Pick a base, add their name in graffiti lettering, and we paint it by hand in the UK. From £78, free UK delivery.", crumb: 'Home' },
  design: { path: '/create-your-own', title: "Create Your Own Custom Kids' Trainers | BUBBLEHOPS", desc: "Design custom kids' trainers in your browser: pick a base, type their name, choose colours and bubble stickers, then we hand-paint the pair in the UK.", crumb: 'Create your own' },
  shop: { path: '/base-trainers', title: 'Base Trainers for Customising | BUBBLEHOPS', desc: "Every base trainer we hand-paint: Kappa La Morra, Adidas Advantage and Court Borough Mid 2. UK kids' sizes 10 to 6.", crumb: 'Base trainers' },
  gallery: { path: '/gallery', title: 'Custom Trainer Gallery | Hand-Painted Pairs | BUBBLEHOPS', desc: "Hand-painted kids' trainers we have made: names, characters and graffiti lettering. Every pair is one of a kind.", crumb: 'Gallery' },
  about: { path: '/about', title: 'About BUBBLEHOPS | Hand-Painted Trainers Since 2006', desc: "BUBBLEHOPS began in 2006 with a single pair of hand-painted Stan Smiths. Today we work to custom order, painting one-of-a-kind kids' trainers by hand.", crumb: 'About' },
  faq: { path: '/sizing-and-care', title: 'Sizing, Care and FAQs | Custom Trainers | BUBBLEHOPS', desc: "UK kids' sizing, how long custom trainers take, how they are made, and how to look after hand-painted trainers.", crumb: 'Sizing & care' },
  contact: { path: '/contact', title: 'Contact BUBBLEHOPS | Custom Trainer Studio', desc: 'Talk to the studio about a custom pair, an existing order or press. Email studio@bubblehops.com, replies within one working day.', crumb: 'Contact' },
  terms: { path: '/terms-and-conditions', title: 'Terms & Conditions | BUBBLEHOPS', desc: 'Terms for ordering hand-painted custom trainers from BUBBLEHOPS, including artwork sign-off and our returns policy.', crumb: 'Terms & conditions' },
  basket: { path: '/basket', title: 'Your basket | BUBBLEHOPS', desc: 'Review the pairs in your basket before checkout.', crumb: 'Basket' },
  checkout: { path: '/checkout', title: 'Checkout | BUBBLEHOPS', desc: 'Choose sizes, delivery and payment for your hand-painted custom trainers.', crumb: 'Checkout' },
  account: { path: '/account', title: 'My account | BUBBLEHOPS', desc: 'Your BUBBLEHOPS orders and saved designs.', crumb: 'Account' },
  signIn: { path: '/sign-in', title: 'Sign in | BUBBLEHOPS', desc: 'Sign in to save designs to your account and track orders.', crumb: 'Sign in' }
};

// Hero carousel — real customer photos, per-slide focal position for cover-fit framing.
export const HERO_SLIDES = [
  { img: '/photos/bubblehops-custom-kids-trainers-hero.jpg', pos: '50% 40%' },
  { img: '/photos/bubblehops-hand-painted-kids-trainers-connor.jpg', pos: '50% 30%' },
  { img: '/photos/bubblehops-hand-painted-stan-smith-kids-trainers-tomski.jpg', pos: '50% 35%' },
  { img: '/photos/bubblehops-hand-painted-velcro-kids-trainers-anna.jpg', pos: '50% 40%' }
];

export const GALLERY_IMAGES = [
  '/photos/bubblehops-hand-painted-custom-kids-trainers-01.jpg',
  '/photos/bubblehops-hand-painted-custom-kids-trainers-02.jpg',
  '/photos/bubblehops-hand-painted-custom-kids-trainers-03.jpg',
  '/photos/bubblehops-hand-painted-custom-kids-trainers-04.jpg',
  '/photos/bubblehops-hand-painted-custom-kids-trainers-05.jpg',
  '/photos/bubblehops-hand-painted-custom-kids-trainers-06.jpg',
  '/photos/bubblehops-hand-painted-custom-kids-trainers-07.jpg',
  '/photos/bubblehops-hand-painted-custom-kids-trainers-08.jpg',
  '/photos/bubblehops-hand-painted-custom-kids-trainers-09.jpg',
  '/photos/bubblehops-hand-painted-kids-trainers-connor.jpg',
  '/photos/bubblehops-hand-painted-stan-smith-kids-trainers-tomski.jpg',
  '/photos/bubblehops-hand-painted-velcro-kids-trainers-anna.jpg',
  '/photos/01.jpg', '/photos/02.jpg', '/photos/03.jpg', '/photos/04.jpg',
  '/photos/05.jpg', '/photos/06.jpg', '/photos/07.jpg', '/photos/08.jpg', '/photos/09.jpg'
];

export const INSTAGRAM_STRIP = [
  '/photos/02.jpg', '/photos/03.jpg', '/photos/04.jpg',
  '/photos/05.jpg', '/photos/06.jpg', '/photos/07.jpg', '/photos/08.jpg', '/photos/09.jpg'
];

export const ABOUT_USES = [
  { label: 'Paint', body: 'Angelus acrylic leather paint, thinned and built in layers. Non-toxic once cured, and it flexes with the leather instead of sitting on top of it.' },
  { label: 'Prep', body: 'Every panel that takes colour is stripped with acetone deglazer first — the step most custom pairs skip, and the reason they crack.' },
  { label: 'Finish', body: 'Two coats of acrylic finisher seal the pair, so the artwork survives play, weather and the school run.' }
];
// PANELS: per-base paintable side-panel silhouette (SVG path, 0-100 viewBox), hand-traced
// against each base's own product photo — the top edge hugs the collar/lace row and excludes
// straps, tongues and pull-loops; the bottom edge hugs the leather-to-midsole seam. These are
// photo-derived geometry, not generic shapes — re-derive them if base photography changes.
// SOLE_CLIP: per-base clip-path polygon so lettering tucks behind the midsole curve.
export const PANELS: Record<string, string> = {
  "base01": "M 4.2,17.8 L 6.4,16.1 L 8.5,15.5 L 10.7,13.5 L 12.9,16.2 L 15.1,19.3 L 17.3,22.7 L 19.5,26.4 L 21.6,28.6 L 23.8,28.3 L 26,26.8 L 28.2,24.5 L 30.4,20.7 L 32.5,16.7 L 34.7,14 L 36.9,12.3 L 39.1,11.8 L 41.3,12.4 L 43.5,13.8 L 45.6,15.8 L 47.8,18 L 50,20.4 L 52.2,22.2 L 54.4,24.3 L 56.5,26.2 L 58.7,28.2 L 60.9,30.2 L 63.1,32 L 65.3,34.1 L 67.5,36.3 L 69.6,38.1 L 71.8,39.6 L 74,41.4 L 76.2,42.8 L 78.4,43.7 L 80.5,44.8 L 82.7,45.6 L 84.9,46.5 L 87.1,47.2 L 89.3,48.5 L 91.5,50.9 L 93.6,51.8 L 95.8,53.1 L 95.8,68.5 L 93.6,68.5 L 91.5,68.5 L 89.3,68.6 L 87.1,68.7 L 84.9,68.8 L 82.7,69 L 80.5,69.2 L 78.4,69.5 L 76.2,69.8 L 74,70.1 L 71.8,70.4 L 69.6,70.7 L 67.5,70.9 L 65.3,71.1 L 63.1,71.2 L 60.9,71.2 L 58.7,71 L 56.5,70.8 L 54.4,70.6 L 52.2,70.2 L 50,69.8 L 47.8,69.3 L 45.6,68.7 L 43.5,68.2 L 41.3,67.6 L 39.1,66.9 L 36.9,66.3 L 34.7,65.7 L 32.5,65.1 L 30.4,64.6 L 28.2,64 L 26,63.5 L 23.8,63.1 L 21.6,62.6 L 19.5,62.3 L 17.3,62 L 15.1,61.8 L 12.9,61.6 L 10.7,61.4 L 8.5,61.4 L 6.4,61.3 L 4.2,61.3 Z",
  "base03": "M 4.2,17.8 L 6.4,16.1 L 8.5,15.5 L 10.7,13.5 L 12.9,16.2 L 15.1,19.3 L 17.3,22.7 L 19.5,26.4 L 21.6,28.6 L 23.8,28.3 L 26,26.8 L 28.2,24.5 L 30.4,20.7 L 32.5,16.7 L 34.7,14 L 36.9,12.3 L 39.1,11.8 L 41.3,12.4 L 43.5,13.8 L 45.6,15.8 L 47.8,18 L 50,20.4 L 52.2,22.2 L 54.4,24.3 L 56.5,26.2 L 58.7,28.2 L 60.9,30.2 L 63.1,32 L 65.3,34.1 L 67.5,36.3 L 69.6,38.1 L 71.8,39.6 L 74,41.4 L 76.2,42.8 L 78.4,43.7 L 80.5,44.8 L 82.7,47 L 84.9,49.4 L 87.1,51.5 L 89.3,54.3 L 91.5,58.1 L 93.6,60.4 L 95.8,63.1 L 95.8,64 L 93.6,64.8 L 91.5,65.5 L 89.3,66.6 L 87.1,66.8 L 84.9,66.9 L 82.7,67 L 80.5,67.2 L 78.4,67.3 L 76.2,67.4 L 74,67.6 L 71.8,67.7 L 69.6,67.8 L 67.5,68 L 65.3,68.1 L 63.1,68.2 L 60.9,68.3 L 58.7,68.5 L 56.5,68.6 L 54.4,68.7 L 52.2,68.9 L 50,69 L 47.8,68.9 L 45.6,68.7 L 43.5,68.6 L 41.3,68.5 L 39.1,68.3 L 36.9,68.2 L 34.7,68.1 L 32.5,68 L 30.4,67.8 L 28.2,67.7 L 26,67.6 L 23.8,67.4 L 21.6,67.3 L 19.5,67.2 L 17.3,67 L 15.1,66.9 L 12.9,66.8 L 10.7,66.6 L 8.5,66.5 L 6.4,66.4 L 4.2,66.3 Z",
  "base04": "M 8,50 L 15,46 L 22,44 L 30,42 L 38,42 L 45,40 L 50,38 L 55,33 L 60,33 L 65,38 L 70,44 L 75,50 L 80,55 L 85,60 L 90,64 L 95,68 L 95,79 L 90,79 L 85,78 L 80,77 L 70,78 L 60,79 L 50,80 L 40,80 L 30,80 L 20,79 L 15,79 L 8,78 Z",
  "base05": "M 13,43 L 15,40 L 22,39 L 30,29 L 38,31 L 46,29 L 52,32 L 58,30 L 65,36 L 70,42 L 76,48 L 80,50 L 85,54 L 90,58 L 96,64 L 96,77 L 90,78 L 85,77 L 80,76 L 70,75 L 60,76 L 50,76 L 40,77 L 30,78 L 20,77 L 15,78 L 13,77 Z"
};

export const SOLE_CLIP: Record<string, string> = {
  "base01": "polygon(100.0% 75.5%,95.0% 75.5%,92.7% 75.5%,90.5% 75.5%,88.3% 75.6%,86.0% 75.7%,83.8% 75.9%,81.5% 76.1%,79.3% 76.4%,77.0% 76.7%,74.8% 77.0%,72.6% 77.3%,70.2% 77.6%,67.9% 77.9%,65.7% 78.1%,63.5% 78.2%,61.2% 78.2%,59.0% 78.1%,56.7% 77.9%,54.5% 77.6%,52.2% 77.2%,50.0% 76.8%,47.8% 76.3%,45.5% 75.7%,43.3% 75.1%,41.0% 74.5%,38.8% 73.8%,36.5% 73.2%,34.3% 72.6%,32.1% 72.0%,29.8% 71.4%,27.4% 70.9%,25.2% 70.4%,23.0% 69.9%,20.7% 69.5%,18.5% 69.2%,16.2% 68.9%,14.0% 68.7%,11.7% 68.5%,9.5% 68.4%,7.3% 68.3%,5.0% 68.3%,0.0% 68.3%,0.0% 112.0%,100.0% 112.0%)",
  "base02": "polygon(100.0% 74.0%,95.0% 74.0%,92.7% 74.2%,90.5% 74.3%,88.3% 74.5%,86.0% 74.9%,83.8% 75.2%,81.5% 75.5%,79.3% 75.9%,77.0% 76.2%,74.8% 76.5%,72.6% 76.7%,70.2% 77.2%,67.9% 78.0%,65.7% 79.2%,63.5% 80.8%,61.2% 82.6%,59.0% 84.4%,56.7% 86.2%,54.5% 87.9%,52.2% 89.6%,50.0% 90.9%,47.8% 91.7%,45.5% 92.2%,43.3% 92.3%,41.0% 92.3%,38.8% 92.2%,36.5% 92.2%,34.3% 92.1%,32.1% 92.1%,29.8% 92.1%,27.4% 92.0%,25.2% 91.9%,23.0% 91.9%,20.7% 91.8%,18.5% 91.7%,16.2% 91.6%,14.0% 91.5%,11.7% 91.4%,9.5% 91.3%,7.3% 91.3%,5.0% 91.3%,0.0% 91.3%,0.0% 112.0%,100.0% 112.0%)",
  "base03": "polygon(100.0% 93.2%,95.0% 93.2%,92.7% 93.2%,90.5% 93.3%,88.3% 93.3%,86.0% 93.4%,83.8% 93.4%,81.5% 93.5%,79.3% 93.6%,77.0% 93.7%,74.8% 93.7%,72.6% 93.8%,70.2% 93.8%,67.9% 93.8%,65.7% 93.8%,63.5% 93.8%,61.2% 93.8%,59.0% 93.8%,56.7% 93.8%,54.5% 93.8%,52.2% 93.6%,50.0% 93.1%,47.8% 92.5%,45.5% 91.5%,43.3% 90.4%,41.0% 89.3%,38.8% 88.1%,36.5% 86.9%,34.3% 85.7%,32.1% 84.8%,29.8% 84.0%,27.4% 83.4%,25.2% 83.0%,23.0% 82.7%,20.7% 82.4%,18.5% 82.2%,16.2% 81.9%,14.0% 81.8%,11.7% 81.7%,9.5% 81.6%,7.3% 81.5%,5.0% 81.5%,0.0% 81.5%,0.0% 112.0%,100.0% 112.0%)",
  "base04": "polygon(100.0% 80.2%,95.0% 80.2%,92.7% 79.8%,90.5% 79.4%,88.3% 78.8%,86.0% 78.0%,83.8% 77.2%,81.5% 76.3%,79.3% 75.4%,77.0% 74.5%,74.8% 73.8%,72.6% 73.3%,70.2% 73.0%,67.9% 72.9%,65.7% 72.8%,63.5% 72.9%,61.2% 73.2%,59.0% 73.5%,56.7% 74.2%,54.5% 75.1%,52.2% 76.2%,50.0% 77.5%,47.8% 78.7%,45.5% 80.0%,43.3% 81.1%,41.0% 82.2%,38.8% 83.0%,36.5% 83.5%,34.3% 83.8%,32.1% 83.9%,29.8% 83.9%,27.4% 83.8%,25.2% 83.7%,23.0% 83.6%,20.7% 83.5%,18.5% 83.5%,16.2% 83.5%,14.0% 83.4%,11.7% 83.4%,9.5% 83.4%,7.3% 83.4%,5.0% 83.4%,0.0% 83.4%,0.0% 112.0%,100.0% 112.0%)",
  "base05": "polygon(100.0% 66.5%,95.0% 66.5%,92.7% 66.6%,90.5% 66.8%,88.3% 67.1%,86.0% 67.5%,83.8% 67.8%,81.5% 68.3%,79.3% 68.8%,77.0% 69.3%,74.8% 69.7%,72.6% 70.2%,70.2% 70.8%,67.9% 71.4%,65.7% 72.1%,63.5% 72.8%,61.2% 73.4%,59.0% 74.0%,56.7% 74.5%,54.5% 74.9%,52.2% 75.2%,50.0% 75.5%,47.8% 76.1%,45.5% 77.1%,43.3% 78.4%,41.0% 80.1%,38.8% 81.6%,36.5% 83.3%,34.3% 84.8%,32.1% 86.3%,29.8% 87.5%,27.4% 88.4%,25.2% 88.7%,23.0% 88.7%,20.7% 88.5%,18.5% 88.4%,16.2% 88.2%,14.0% 88.0%,11.7% 87.9%,9.5% 87.8%,7.3% 87.7%,5.0% 87.7%,0.0% 87.7%,0.0% 112.0%,100.0% 112.0%)"
};

export const SOLE_ABOVE_CLIP: Record<string, string> = {
  "base01": "polygon(0.0% 0.0%,100.0% 0.0%,100.0% 75.5%,95.0% 75.5%,92.7% 75.5%,90.5% 75.5%,88.3% 75.6%,86.0% 75.7%,83.8% 75.9%,81.5% 76.1%,79.3% 76.4%,77.0% 76.7%,74.8% 77.0%,72.6% 77.3%,70.2% 77.6%,67.9% 77.9%,65.7% 78.1%,63.5% 78.2%,61.2% 78.2%,59.0% 78.1%,56.7% 77.9%,54.5% 77.6%,52.2% 77.2%,50.0% 76.8%,47.8% 76.3%,45.5% 75.7%,43.3% 75.1%,41.0% 74.5%,38.8% 73.8%,36.5% 73.2%,34.3% 72.6%,32.1% 72.0%,29.8% 71.4%,27.4% 70.9%,25.2% 70.4%,23.0% 69.9%,20.7% 69.5%,18.5% 69.2%,16.2% 68.9%,14.0% 68.7%,11.7% 68.5%,9.5% 68.4%,7.3% 68.3%,5.0% 68.3%,0.0% 68.3%)",
  "base02": "polygon(0.0% 0.0%,100.0% 0.0%,100.0% 74.0%,95.0% 74.0%,92.7% 74.2%,90.5% 74.3%,88.3% 74.5%,86.0% 74.9%,83.8% 75.2%,81.5% 75.5%,79.3% 75.9%,77.0% 76.2%,74.8% 76.5%,72.6% 76.7%,70.2% 77.2%,67.9% 78.0%,65.7% 79.2%,63.5% 80.8%,61.2% 82.6%,59.0% 84.4%,56.7% 86.2%,54.5% 87.9%,52.2% 89.6%,50.0% 90.9%,47.8% 91.7%,45.5% 92.2%,43.3% 92.3%,41.0% 92.3%,38.8% 92.2%,36.5% 92.2%,34.3% 92.1%,32.1% 92.1%,29.8% 92.1%,27.4% 92.0%,25.2% 91.9%,23.0% 91.9%,20.7% 91.8%,18.5% 91.7%,16.2% 91.6%,14.0% 91.5%,11.7% 91.4%,9.5% 91.3%,7.3% 91.3%,5.0% 91.3%,0.0% 91.3%)",
  "base03": "polygon(0.0% 0.0%,100.0% 0.0%,100.0% 93.2%,95.0% 93.2%,92.7% 93.2%,90.5% 93.3%,88.3% 93.3%,86.0% 93.4%,83.8% 93.4%,81.5% 93.5%,79.3% 93.6%,77.0% 93.7%,74.8% 93.7%,72.6% 93.8%,70.2% 93.8%,67.9% 93.8%,65.7% 93.8%,63.5% 93.8%,61.2% 93.8%,59.0% 93.8%,56.7% 93.8%,54.5% 93.8%,52.2% 93.6%,50.0% 93.1%,47.8% 92.5%,45.5% 91.5%,43.3% 90.4%,41.0% 89.3%,38.8% 88.1%,36.5% 86.9%,34.3% 85.7%,32.1% 84.8%,29.8% 84.0%,27.4% 83.4%,25.2% 83.0%,23.0% 82.7%,20.7% 82.4%,18.5% 82.2%,16.2% 81.9%,14.0% 81.8%,11.7% 81.7%,9.5% 81.6%,7.3% 81.5%,5.0% 81.5%,0.0% 81.5%)",
  "base04": "polygon(0.0% 0.0%,100.0% 0.0%,100.0% 80.2%,95.0% 80.2%,92.7% 79.8%,90.5% 79.4%,88.3% 78.8%,86.0% 78.0%,83.8% 77.2%,81.5% 76.3%,79.3% 75.4%,77.0% 74.5%,74.8% 73.8%,72.6% 73.3%,70.2% 73.0%,67.9% 72.9%,65.7% 72.8%,63.5% 72.9%,61.2% 73.2%,59.0% 73.5%,56.7% 74.2%,54.5% 75.1%,52.2% 76.2%,50.0% 77.5%,47.8% 78.7%,45.5% 80.0%,43.3% 81.1%,41.0% 82.2%,38.8% 83.0%,36.5% 83.5%,34.3% 83.8%,32.1% 83.9%,29.8% 83.9%,27.4% 83.8%,25.2% 83.7%,23.0% 83.6%,20.7% 83.5%,18.5% 83.5%,16.2% 83.5%,14.0% 83.4%,11.7% 83.4%,9.5% 83.4%,7.3% 83.4%,5.0% 83.4%,0.0% 83.4%)",
  "base05": "polygon(0.0% 0.0%,100.0% 0.0%,100.0% 66.5%,95.0% 66.5%,92.7% 66.6%,90.5% 66.8%,88.3% 67.1%,86.0% 67.5%,83.8% 67.8%,81.5% 68.3%,79.3% 68.8%,77.0% 69.3%,74.8% 69.7%,72.6% 70.2%,70.2% 70.8%,67.9% 71.4%,65.7% 72.1%,63.5% 72.8%,61.2% 73.4%,59.0% 74.0%,56.7% 74.5%,54.5% 74.9%,52.2% 75.2%,50.0% 75.5%,47.8% 76.1%,45.5% 77.1%,43.3% 78.4%,41.0% 80.1%,38.8% 81.6%,36.5% 83.3%,34.3% 84.8%,32.1% 86.3%,29.8% 87.5%,27.4% 88.4%,25.2% 88.7%,23.0% 88.7%,20.7% 88.5%,18.5% 88.4%,16.2% 88.2%,14.0% 88.0%,11.7% 87.9%,9.5% 87.8%,7.3% 87.7%,5.0% 87.7%,0.0% 87.7%)"
};
