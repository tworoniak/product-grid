import type { Product, Swatch } from '../types/product';

import professionalBlack from '../assets/professional-black.jpg';
import professionalBlackSide from '../assets/professional-black-side.jpg';

// ---------------------------------------------------------------------------
// Placeholder imagery
// The brief explicitly leaves product photography as an open placeholder, so
// each swatch renders as a solid tinted tile (its own hex) rather than one
// flat gray box, keeping color-driven image switching demonstrable without
// licensed photography.
// ---------------------------------------------------------------------------
export const img = (hex: string) =>
  `https://placehold.co/640x760/${hex}/${hex}`;

const swatch = (id: string, label: string, hex: string): Swatch => ({
  id,
  label,
  hex: `#${hex}`,
});

// Shared across every product below — the first 5 render in each card's
// compact swatch row, the full set renders in the Quick Shop color grid.
const swatches: Swatch[] = [
  swatch('black', 'Black', '2b2622'),
  swatch('honey', 'Honey Distressed', 'b98a55'),
  swatch('rose', 'Rose', 'c98f83'),
  swatch('espresso', 'Espresso', '5a4033'),
  swatch('bone', 'Bone', 'e7ded0'),
  swatch('chestnut', 'Chestnut', '8a5327'),
  swatch('taupe', 'Taupe', 'a89684'),
  swatch('merlot', 'Merlot', '5e2331'),
  swatch('stone', 'Stone', 'b7b0a5'),
];

// ---------------------------------------------------------------------------
// Real photography (not populated yet)
// Add an `images` map to any product below to swap it off the generated
// placeholder — see `Product.images` in `types/product.ts` for why this
// lives per-product rather than on the shared `swatches` list above (two
// products can each show their own distinct photo for the same color).
// ProductCard reads this automatically: a swatch with a real entry uses it,
// any swatch without one still falls back to the placeholder tile, so this
// can be filled in incrementally, one color at a time, without touching
// ProductCard itself.
//
// import marcelleBlack from '../assets/marcelle-black.jpg';
// import marcelleBlackSide from '../assets/marcelle-black-side.jpg';
//
// {
//   id: 'p2',
//   name: 'Marcelle',
//   ...
//   images: {
//     black: { image: marcelleBlack, hoverImage: marcelleBlackSide },
//     // honey, rose, etc. stay on the placeholder until photographed
//   },
// }
// ---------------------------------------------------------------------------

export const products: Product[] = [
  {
    id: 'p1',
    name: 'Professional',
    subtitle: 'Honey Distressed',
    price: 155,
    badges: [],
    sizes: ['6', '7', '8', '9', '10', '11'],
    swatches,
    // This product has real photography for the black swatch, so it swaps off
    // the placeholder tile for that color only. The other swatches still render
    // as solid hex tiles until photographed.
    images: {
      black: { image: professionalBlack, hoverImage: professionalBlackSide },
    },
  },
  {
    id: 'p2',
    name: 'Marcelle',
    subtitle: 'Honey Distressed',
    price: 155,
    badges: [],
    sizes: ['6', '7', '8', '9', '10', '11'],
    swatches,
    images: {
      black: { image: professionalBlack, hoverImage: professionalBlackSide },
    },
  },
  {
    id: 'p3',
    name: 'Wren',
    subtitle: 'Honey Distressed',
    price: 155,
    compareAtPrice: 185,
    badges: [
      { type: 'new', label: 'New' },
      { type: 'sale', label: 'Sale' },
    ],
    sizes: ['6', '7', '8', '9', '10', '11'],
    swatches,
    images: {
      black: { image: professionalBlack, hoverImage: professionalBlackSide },
    },
  },
  {
    id: 'p4',
    name: 'Harlow',
    subtitle: 'Honey Distressed',
    price: 155,
    compareAtPrice: 185,
    badges: [
      { type: 'new', label: 'New' },
      { type: 'sale', label: 'Sale' },
    ],
    sizes: ['6', '7', '8', '9', '10'],
    swatches,
    images: {
      black: { image: professionalBlack, hoverImage: professionalBlackSide },
    },
  },
  {
    id: 'p5',
    name: 'Briar',
    subtitle: 'Honey Distressed',
    price: 155,
    badges: [],
    sizes: ['6', '7', '8', '9', '10', '11'],
    swatches,
    images: {
      black: { image: professionalBlack, hoverImage: professionalBlackSide },
    },
  },
  {
    id: 'p6',
    name: 'Sutton',
    subtitle: 'Honey Distressed',
    price: 155,
    badges: [],
    sizes: ['6', '7', '8', '9', '10', '11'],
    swatches,
    images: {
      black: { image: professionalBlack, hoverImage: professionalBlackSide },
    },
  },
  {
    id: 'p7',
    name: 'Adeline',
    subtitle: 'Honey Distressed',
    price: 155,
    compareAtPrice: 185,
    badges: [{ type: 'sale', label: 'Sale' }],
    sizes: ['6', '7', '8', '9', '10'],
    swatches,
    images: {
      black: { image: professionalBlack, hoverImage: professionalBlackSide },
    },
  },
  {
    id: 'p8',
    name: 'Fenwick',
    subtitle: 'Honey Distressed',
    price: 155,
    badges: [{ type: 'new', label: 'New' }],
    sizes: ['7', '8', '9', '10', '11'],
    swatches,
    images: {
      black: { image: professionalBlack, hoverImage: professionalBlackSide },
    },
  },
  {
    id: 'p9',
    name: 'Rosalind',
    subtitle: 'Honey Distressed',
    price: 155,
    badges: [],
    sizes: ['6', '7', '8', '9'],
    swatches,
    images: {
      black: { image: professionalBlack, hoverImage: professionalBlackSide },
    },
  },
  {
    id: 'p10',
    name: 'Delphine',
    subtitle: 'Honey Distressed',
    price: 155,
    compareAtPrice: 185,
    badges: [
      { type: 'new', label: 'New' },
      { type: 'sale', label: 'Sale' },
    ],
    sizes: ['6', '7', '8', '9', '10', '11'],
    swatches,
    images: {
      black: { image: professionalBlack, hoverImage: professionalBlackSide },
    },
  },
];
