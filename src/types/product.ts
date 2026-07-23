export type BadgeType = 'new' | 'sale';

export interface Badge {
  type: BadgeType;
  label: string;
}

/** A single selectable color/finish option for a product. */
export interface Swatch {
  id: string;
  label: string;
  /** Hex value used to render the swatch dot and derive placeholder imagery. */
  hex: string;
}

/** Real product photography for one swatch, when available. */
export interface SwatchImage {
  /** Resting/primary shot. */
  image: string;
  /** Alternate-angle shot shown on hover. Falls back to `image` if omitted. */
  hoverImage?: string;
}

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  compareAtPrice?: number;
  badges?: Badge[];
  swatches: Swatch[];
  /**
   * Real photography for this product, keyed by `Swatch.id`. Optional — a
   * swatch with no entry here (or a product that omits this field entirely)
   * falls back to a generated placeholder tile in ProductCard.
   *
   * This is scoped per-Product rather than living on Swatch itself: two
   * products can share the same color list (both have a "black" swatch,
   * say) while each still showing its own distinct photo for that color,
   * since `images` is a per-product lookup, not shared swatch data.
   */
  images?: Record<string, SwatchImage>;
  sizes: string[];
}
