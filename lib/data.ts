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

// All four are the same Adidas Advantage (triple-velcro) model — see
// https://www.amazon.co.uk/dp/B0CKXVBC59 — in different colourways, so they
// share one photo (swap in each colourway's own product shot as they're
// supplied) and one panel geometry (base06), traced once against that photo.
export const BASES_IN_STOCK: BaseTrainer[] = [
  {
    id: 'advgreen',
    img: '/photos/bubblehops-adidas-advantage-black-kids-trainer-base.jpg',
    name: 'Adidas Advantage — Green',
    meta: 'Triple velcro · UK kids’ 10 – 2',
    price: 80,
    panel: 'base06',
    ar: 1500 / 720,
    heel: { x: '13%', y: '74%' },
    box: { left: '32%', top: '42%', width: '36%' },
    placeholderPhoto: true // TODO: swap in the Cloud White / Cloud White / Green product photo
  },
  {
    id: 'advblack',
    img: '/photos/bubblehops-adidas-advantage-black-kids-trainer-base.jpg',
    name: 'Adidas Advantage — Core Black',
    meta: 'Triple velcro · UK kids’ 10 – 2',
    price: 80,
    panel: 'base06',
    ar: 1500 / 720,
    heel: { x: '13%', y: '74%' },
    box: { left: '32%', top: '42%', width: '36%' }
  },
  {
    id: 'advpink',
    img: '/photos/bubblehops-adidas-advantage-black-kids-trainer-base.jpg',
    name: 'Adidas Advantage — Bliss Pink',
    meta: 'Triple velcro · UK kids’ 10 – 2',
    price: 80,
    panel: 'base06',
    ar: 1500 / 720,
    heel: { x: '13%', y: '74%' },
    box: { left: '32%', top: '42%', width: '36%' },
    placeholderPhoto: true // TODO: swap in the Cloud White / Bliss Pink / Core Black product photo
  },
  {
    id: 'advgrey',
    img: '/photos/bubblehops-adidas-advantage-black-kids-trainer-base.jpg',
    name: 'Adidas Advantage — Grey One',
    meta: 'Triple velcro · UK kids’ 10 – 2',
    price: 80,
    panel: 'base06',
    ar: 1500 / 720,
    heel: { x: '13%', y: '74%' },
    box: { left: '32%', top: '42%', width: '36%' },
    placeholderPhoto: true // TODO: swap in the Cloud White / Cloud White / Grey One product photo
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
  advgreen: { 'UK 10': 3, 'UK 11': 2, 'UK 12': 4, 'UK 13': 2, 'UK 1': 3, 'UK 2': 2, 'UK 3': 1, 'UK 4': 2, 'UK 5': 1, 'UK 6': 2 },
  advblack: { 'UK 10': 4, 'UK 11': 3, 'UK 12': 3, 'UK 13': 2, 'UK 1': 4, 'UK 2': 3, 'UK 3': 2, 'UK 4': 1, 'UK 5': 2, 'UK 6': 1 },
  advpink: { 'UK 10': 2, 'UK 11': 3, 'UK 12': 2, 'UK 13': 1, 'UK 1': 3, 'UK 2': 2, 'UK 3': 1, 'UK 4': 1, 'UK 5': 0, 'UK 6': 2 },
  advgrey: { 'UK 10': 3, 'UK 11': 2, 'UK 12': 2, 'UK 13': 3, 'UK 1': 2, 'UK 2': 1, 'UK 3': 2, 'UK 4': 0, 'UK 5': 1, 'UK 6': 1 }
};

export type Faq = { q: string; a: string };

export const FAQS: Faq[] = [
  {
    q: 'How much do custom trainers cost?',
    a: "£80 for a single hand-painted shoe, or £157 for a full pair. The base trainer is bought new in your child's size and included in that price, as is the painting, sealing and free standard UK delivery. Leaving one shoe blank reduces the total."
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
    a: "We paint on the Adidas Advantage — its smooth leather panel takes paint evenly, and the triple-velcro strap means younger kids can get their own shoes on and off. It comes in four colourways, so you can start from whichever base suits the design. Canvas and knit trainers absorb paint unevenly and we don't recommend them."
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
  home: { path: '/', title: "BUBBLEHOPS | Hand-Painted Custom Kids' Trainers, Made in the UK", desc: "Design hand-painted custom kids' trainers online. Pick a base, add their name in graffiti lettering, and we paint it by hand in the UK. From £80, free UK delivery.", crumb: 'Home' },
  design: { path: '/create-your-own', title: "Create Your Own Custom Kids' Trainers | BUBBLEHOPS", desc: "Design custom kids' trainers in your browser: pick a base, type their name, choose colours and bubble stickers, then we hand-paint the pair in the UK.", crumb: 'Create your own' },
  shop: { path: '/base-trainers', title: 'Base Trainers for Customising | BUBBLEHOPS', desc: "The Adidas Advantage, hand-painted to order in four colourways: Green, Core Black, Bliss Pink and Grey One. UK kids' sizes 10 to 6.", crumb: 'Base trainers' },
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
// against the product photo — used to keep word/sticker placement (and drag "bounce back")
// within the shoe's own canvas area, not for visual clipping. base06 is the Adidas Advantage
// (triple-velcro) shape shared by all four colourways above, since they're the same shoe.
export const PANELS: Record<string, string> = {
  "base06": "M 2,50 L 10,40 L 18,34 L 25,42 L 35,44 L 45,42 L 55,40 L 62,35 L 66,40 L 72,30 L 80,20 L 86,17 L 89,35 L 94,40 L 97,44 L 97,71 L 90,71 L 80,71 L 70,71 L 60,71 L 50,71 L 40,71 L 30,71 L 20,71 L 10,70 L 2,68 Z"
};
