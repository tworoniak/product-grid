# Product Grid — Best Sellers

A front-end assessment build: a "Best Sellers" product grid component in **React + TypeScript + SCSS**.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build to /dist
```

[Live Demo](https://product-grid-hazel.vercel.app/)

## What's implemented

**Carousel**

- The row is a horizontally-scrolling rail (native CSS scroll-snap), not a wrapping grid — card widths are sized under an even fraction so the next card always peeks at the edge, signaling there's more to scroll to.
- Prev/Next arrow buttons page one card at a time, disable at each end, and respect `prefers-reduced-motion` (instant jump instead of smooth scroll). Hidden on mobile, where swipe/drag is the primary interaction.
- Keyboard-accessible for free: tabbing through a card's swatches or Quick Shop button auto-scrolls the rail to keep the focused card in view — standard browser behavior for an overflow container, no extra JS needed.
- 10 placeholder products in the catalog so there's enough to actually page through.

**Bring it to life on hover**

- Image swap: each card holds two stacked images that crossfade on hover/focus (`ProductCard__image--base` / `--hover`), simulating a second angle shot.
- Quick Shop reveal: a "Quick Shop" affordance slides up from the bottom of the tile on hover/focus, and expands into a full color + size-selection + Add to Bag panel on click.
- Badge lift and swatch/price transitions all share one easing curve (`$ease-out-quart`) so the tile feels like a single coherent object rather than a pile of separate effects.

**Added flair**

- Color swatches are interactive, not decorative: hovering/focusing a swatch previews that color's image and subtitle without disturbing your actual selection; clicking commits it (with an active-swatch ring). Moving off the swatch — or off the card — reverts the preview back to what's actually selected.
- Each product has 9 colors and its own name (Professional, Marcelle, Wren, Harlow...). The compact row shows the first 5 plus a "+4" affordance that's a real button — clicking it jumps straight into Quick Shop, which has a "Select a color" grid of all 9 (larger dots, better touch target). Both rows share the same selection state, so choosing a color in either place updates the other.
- Size chips in the Quick Shop panel are selectable; Add to Bag is disabled until a size is chosen, then shows a brief "Added ✓" confirmation state.
- Sale badge pairs with a struck-through compare-at price.
- `prefers-reduced-motion` is respected across every transform in the component (image scale, Quick Shop slide, badge lift, swatch hover, carousel scroll) — motion collapses to simple opacity fades or instant jumps.
- First-row cards load eagerly (`loading="eager"`, `fetchPriority="high"`); the rest lazy-load as they scroll into view.

**Accessibility**

- The Quick Shop panel is `inert` while closed — its color/size/Add-to-Bag controls are unreachable by keyboard and hidden from assistive tech until the panel is actually open, not just visually hidden behind a CSS transform.
- Color and size selection use the full ARIA `radiogroup`/`radio` pattern, including roving tabindex and arrow-key navigation (Left/Right, Up/Down, Home/End move focus _and_ selection together, matching the ARIA Authoring Practices radio pattern) — not just a `role="group"` of independently-tabbable buttons.
- Sale pricing uses semantic `<del>` plus screen-reader-only "Sale price" / "Regular price" labels, so the relationship between the two numbers is actually conveyed, not just implied by a CSS strikethrough.
- Adding to bag and paging the carousel both announce through visually-hidden `aria-live="polite"` status regions (`.sr-only`, defined once in `index.scss`), so the "Added ✓" confirmation and "Showing X, product N of 10" aren't visual-only feedback.
- The product-name overlay on placeholder tiles carries a dark scrim behind the text — checked against contrast math for all 9 swatch hexes, since a few of the lighter colors (Bone, Stone, Taupe) would otherwise put white text under the 4.5:1 WCAG minimum.
- Escape closes an open Quick Shop panel and returns focus to its toggle button; swatch dots and the "+N" button carry extra invisible hit-area padding toward the 24×24 touch-target guideline.
- Every interactive control has a name that stays meaningful out of context (e.g. `aria-label="Quick Shop — Marcelle"`, `"Size 8"`), since a screen reader's elements list would otherwise show 10 identical "Quick Shop" buttons with no product attached.

**Interpreted, not replicated**

- Product photography isn't available for most of this exercise, so each color swatch generates its own tinted placeholder (see `src/data/products.ts`) rather than reusing one flat gray box — this keeps the color-driven image-swap behavior demonstrable while making clear it's a placeholder. All 10 products share one 9-color swatch set rather than each defining its own copy, since the placeholder imagery makes per-product color variety meaningless — the shared list is a single edit point instead of 10 duplicated ones.
- **Real photography is supported, one product proves it out.** `Product.images` (see `types/product.ts`) is an optional per-product, per-swatch lookup — a swatch with a real photo uses it, any swatch without one still falls back to the generated placeholder automatically, so a catalog can be photographed incrementally. `Professional`'s Black colorway uses `src/assets/professional-black.jpg` / `-side.jpg` as a live example: real photos render with `object-fit: contain` (never cropped) and skip both the text-overlay label and the CSS hover-filter trick, since a real photo already identifies the product and a real second-angle shot doesn't need a fake one.
- Typography pairs a serif display face (Fraunces) for product names against a neutral sans (Inter) for price/UI text, matching the heritage-leather tone of the brief's own "Best Sellers" heading.

## Structure

```
src/
  components/
    ProductGrid.tsx      carousel shell: section header, scroll-snap rail, arrow controls, live status region
    ProductCard.tsx       single tile: media, badges, quick shop, swatches, radiogroup keyboard handling
  data/products.ts        mock product data, placeholder image generation, real-photo extension point
  types/product.ts        Product / Swatch / SwatchImage / Badge types
  assets/                 the one real photo pair used to demonstrate Product.images
  styles/
    _variables.scss       color, type, spacing, motion tokens
    _mixins.scss          focus ring, reduced-motion, visually-hidden
    index.scss             global reset + font import + shared .sr-only utility
```

Each component owns a co-located `.scss` file (no CSS-in-JS, no utility framework) per the requested SASS/SCSS stack.
