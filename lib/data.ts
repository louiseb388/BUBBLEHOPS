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
// https://www.amazon.co.uk/dp/B0CKXVBC59 — in different colourways, each with
// its own product photo but sharing one panel geometry (base06), traced once
// against that photo (all four are the same mould, so it lines up on each).
export const BASES_IN_STOCK: BaseTrainer[] = [
  {
    id: 'advgreen',
    img: '/photos/bubblehops-adidas-advantage-green-kids-trainer-base.jpg',
    name: 'Adidas Advantage — Green',
    meta: 'Triple velcro · UK kids’ 10 – 2',
    price: 79,
    panel: 'base06',
    ar: 1500 / 720,
    heel: { x: '13%', y: '74%' },
    box: { left: '32%', top: '42%', width: '36%' }
  },
  {
    id: 'advblack',
    img: '/photos/bubblehops-adidas-advantage-black-kids-trainer-base.jpg',
    name: 'Adidas Advantage — Core Black',
    meta: 'Triple velcro · UK kids’ 10 – 2',
    price: 79,
    panel: 'base06',
    ar: 1500 / 720,
    heel: { x: '13%', y: '74%' },
    box: { left: '32%', top: '42%', width: '36%' }
  },
  {
    id: 'advpink',
    img: '/photos/bubblehops-adidas-advantage-pink-kids-trainer-base.jpg',
    name: 'Adidas Advantage — Bliss Pink',
    meta: 'Triple velcro · UK kids’ 10 – 2',
    price: 79,
    panel: 'base06',
    ar: 1500 / 720,
    heel: { x: '13%', y: '74%' },
    box: { left: '32%', top: '42%', width: '36%' }
  },
  {
    id: 'advgrey',
    img: '/photos/bubblehops-adidas-advantage-grey-kids-trainer-base.jpg',
    name: 'Adidas Advantage — Grey One',
    meta: 'Triple velcro · UK kids’ 10 – 2',
    price: 79,
    panel: 'base06',
    ar: 1500 / 720,
    heel: { x: '13%', y: '74%' },
    box: { left: '32%', top: '42%', width: '36%' }
  }
];

export function getBase(id: string): BaseTrainer | undefined {
  return BASES_IN_STOCK.find((b) => b.id === id);
}

export type WordColour = { id: string; value: string; label: string };

// Restricted to the colours of the actual Uni Posca-style markers used to paint orders —
// dropped lilac, orange, yellow and brown since there's no marker for them.
export const WORD_COLOURS: WordColour[] = [
  { id: 'grey', value: '#c0c0c0', label: 'Silver' },
  { id: 'lime', value: '#b6ea16', label: 'Lime' },
  { id: 'green', value: '#1f9d55', label: 'Green' },
  { id: 'teal', value: '#12b5b0', label: 'Teal' },
  { id: 'sky', value: '#4aa8ff', label: 'Sky blue' },
  { id: 'blue', value: '#1f4fd8', label: 'Blue' },
  { id: 'purple', value: 'oklch(0.52 0.22 305)', label: 'Purple' },
  { id: 'pink', value: '#ff7ab8', label: 'Pink' },
  { id: 'red', value: '#e02a1b', label: 'Red' },
  { id: 'gold', value: '#e8b400', label: 'Gold' }
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
// Green/black/pink are marked out of stock (all sizes zeroed) — only grey is
// currently sold. Bump these back up whenever those colourways are restocked.
export const SEED_STOCK: Record<string, Record<string, number>> = {
  advgreen: { 'UK 10': 0, 'UK 11': 0, 'UK 12': 0, 'UK 13': 0, 'UK 1': 0, 'UK 2': 0, 'UK 3': 0, 'UK 4': 0, 'UK 5': 0, 'UK 6': 0 },
  advblack: { 'UK 10': 0, 'UK 11': 0, 'UK 12': 0, 'UK 13': 0, 'UK 1': 0, 'UK 2': 0, 'UK 3': 0, 'UK 4': 0, 'UK 5': 0, 'UK 6': 0 },
  advpink: { 'UK 10': 0, 'UK 11': 0, 'UK 12': 0, 'UK 13': 0, 'UK 1': 0, 'UK 2': 0, 'UK 3': 0, 'UK 4': 0, 'UK 5': 0, 'UK 6': 0 },
  advgrey: { 'UK 10': 3, 'UK 11': 2, 'UK 12': 2, 'UK 13': 3, 'UK 1': 2, 'UK 2': 1, 'UK 3': 2, 'UK 4': 0, 'UK 5': 1, 'UK 6': 1 }
};

export type Faq = { q: string; a: string };

export const FAQS: Faq[] = [
  {
    q: 'How much do custom trainers cost?',
    a: "£79 for a single hand-painted shoe, or £99 for a full pair. The base trainer is bought new in your child's size and included in that price, as is the painting, sealing and free standard UK delivery. Leaving one shoe blank reduces the total."
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

// Shared with app/api/checkout/route.ts, which recomputes delivery cost server-side from
// this same table rather than trusting whatever the client sends — see that file.
export type DeliveryMethod = 'standard' | 'express';
export const DELIVERY_COST: Record<DeliveryMethod, number> = { standard: 0, express: 6 };

export const SITE = {
  name: 'BUBBLEHOPS',
  email: 'studio@bubblehops.com',
  instagramHandle: '@bubblehop_uk',
  instagramUrl: 'https://instagram.com/bubblehop_uk',
  tiktokHandle: '@bubblehop_uk',
  tiktokUrl: 'https://www.tiktok.com/@bubblehop_uk',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://bubblehops.com'
};

export type RouteMeta = { path: string; title: string; desc: string; crumb: string };

export const ROUTES: Record<string, RouteMeta> = {
  home: { path: '/', title: "BUBBLEHOPS | Hand-Painted Custom Kids' Trainers, Made in the UK", desc: "Design hand-painted custom kids' trainers online. Pick a base, add their name in graffiti lettering, and we paint it by hand in the UK. From £79, free UK delivery.", crumb: 'Home' },
  design: { path: '/create-your-own', title: "Create Your Own Custom Kids' Trainers | BUBBLEHOPS", desc: "Design custom kids' trainers in your browser: pick a base, type their name, choose colours and bubble stickers, then we hand-paint the pair in the UK.", crumb: 'Create your own' },
  shop: { path: '/base-trainers', title: 'Base Trainers for Customising | BUBBLEHOPS', desc: "The Adidas Advantage, hand-painted to order in four colourways: Green, Core Black, Bliss Pink and Grey One. UK kids' sizes 10 to 6.", crumb: 'Base trainers' },
  size: { path: '/size', title: 'Choose a Size | BUBBLEHOPS', desc: "Pick your child's UK size and quantity before designing their hand-painted BUBBLEHOPS trainers.", crumb: 'Choose a size' },
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
// connor/anna/imax/nova use dedicated pre-cropped "-hero" variants (see public/photos)
// rather than the originals: the hero banner's very wide desktop aspect ratio meant
// object-position alone ran out of range before the design cleared the lime bar, so the
// source photos are cropped tighter around the design instead.
// On mobile the banner is portrait, so cover-fit shows the image's full height and crops
// width instead — mobilePos is the horizontal focal point for that crop. Where the
// desktop "-hero" crop is too tight to leave enough width to crop from on a narrow
// screen, mobileImg swaps in the wider, less-cropped original for that breakpoint only.
export const HERO_SLIDES = [
  {
    img: '/photos/bubblehops-hand-painted-kids-trainers-connor-hero.jpg',
    pos: '50% 50%',
    mobileImg: '/photos/bubblehops-hand-painted-kids-trainers-connor-mobile.jpg',
    mobilePos: '46% 50%'
  },
  { img: '/photos/bubblehops-custom-kids-trainers-hero.jpg', pos: '50% 35%', mobilePos: '46% 50%' },
  { img: '/photos/bubblehops-hand-painted-tomski-kids-trainers-box.jpg', pos: '55% 38%', mobilePos: '68% 50%' },
  {
    img: '/photos/bubblehops-hand-painted-velcro-kids-trainers-anna-hero.jpg',
    pos: '50% 50%',
    mobileImg: '/photos/bubblehops-hand-painted-velcro-kids-trainers-anna-mobile.jpg',
    mobilePos: '50% 50%'
  },
  { img: '/photos/bubblehops-hand-painted-milo-kids-trainers-box.jpg', pos: '50% 30%', mobilePos: '53% 50%' },
  {
    img: '/photos/bubblehops-hand-painted-kids-trainers-imax-hero.jpg',
    pos: '50% 50%',
    mobileImg: '/photos/bubblehops-hand-painted-kids-trainers-imax-mobile.jpg',
    mobilePos: '44% 50%'
  },
  {
    img: '/photos/bubblehops-hand-painted-kids-trainers-nova-hero.jpg',
    pos: '50% 50%',
    mobileImg: '/photos/bubblehops-hand-painted-kids-trainers-nova-mobile.jpg',
    mobilePos: '52% 50%'
  }
];

export const ABOUT_USES = [
  { label: 'Paint', body: 'Angelus acrylic leather paint, thinned and built in layers. Non-toxic once cured, and it flexes with the leather instead of sitting on top of it.' },
  { label: 'Prep', body: 'Every panel that takes colour is stripped with acetone deglazer first — the step most custom pairs skip, and the reason they crack.' },
  { label: 'Finish', body: 'Two coats of acrylic finisher seal the pair, so the artwork survives play, weather and the school run.' }
];
// PANELS: per-base paintable side-panel silhouette (SVG path, 0-100 viewBox) — used to keep
// word/sticker placement (and drag "bounce back") within the shoe's own canvas area, not for
// visual clipping. base06 is the Adidas Advantage (triple-velcro) shape shared by all four
// colourways above, since they're the same shoe. Traced from the customer-supplied reference
// outline (toe to heel along the upper, scalloped around each strap), with the bottom edge
// nudged down 10 points past that reference (in two 5-point steps) to use more of the panel
// above the sole — now sitting right at the seam between the leather and the textured sole.
export const PANELS: Record<string, string> = {
  "base06": "M 98,42 L 96,33 L 90,36 L 87,34 L 85,30 L 80,34 L 74,33 L 68,27 L 62,14 L 59,13 L 56,15 L 57,25 L 55,30 L 51,30 L 48,25 L 45,28 L 45,34 L 43,38 L 40,40 L 36,36 L 34,39 L 33,44 L 30,51 L 27,50 L 25,44 L 21,48 L 17,57 L 11,86 L 14,88 L 20,91 L 32,92 L 68,83 L 92,79 L 98,75 Z"
};
