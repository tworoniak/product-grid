import { useEffect, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { img } from '../data/products';
import type { Product, Swatch } from '../types/product';
import './ProductCard.scss';

interface ProductCardProps {
  product: Product;
  /** First-row cards should load eagerly instead of lazily. */
  priority?: boolean;
}

const formatPrice = (value: number) =>
  value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

// Roving-tabindex keyboard behavior for a role="radiogroup" of role="radio"
// buttons: Left/Up moves to the previous item, Right/Down to the next
// (wrapping at the ends), Home/End jump to the first/last. Per the ARIA
// Authoring Practices radio pattern, moving focus also changes the
// selection — Tab only enters/exits the group once.
function handleRadioKeyDown<T>(
  e: KeyboardEvent<HTMLButtonElement>,
  list: T[],
  currentIndex: number,
  select: (item: T) => void,
) {
  let nextIndex: number;
  switch (e.key) {
    case 'ArrowRight':
    case 'ArrowDown':
      nextIndex = (currentIndex + 1) % list.length;
      break;
    case 'ArrowLeft':
    case 'ArrowUp':
      nextIndex = (currentIndex - 1 + list.length) % list.length;
      break;
    case 'Home':
      nextIndex = 0;
      break;
    case 'End':
      nextIndex = list.length - 1;
      break;
    default:
      return;
  }
  e.preventDefault();
  select(list[nextIndex]);
  const group = e.currentTarget.closest('[role="radiogroup"]');
  const radios = group?.querySelectorAll<HTMLButtonElement>('[role="radio"]');
  radios?.[nextIndex]?.focus();
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const [selectedSwatchId, setSelectedSwatchId] = useState(product.swatches[0].id);
  const [previewSwatchId, setPreviewSwatchId] = useState<string | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [quickShopOpen, setQuickShopOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [justAdded, setJustAdded] = useState(false);
  const addedTimeoutRef = useRef<number | null>(null);
  const quickShopToggleRef = useRef<HTMLButtonElement>(null);

  const activeSwatchId = previewSwatchId ?? selectedSwatchId;

  const activeSwatch = useMemo(
    () => product.swatches.find((s) => s.id === activeSwatchId) ?? product.swatches[0],
    [activeSwatchId, product.swatches],
  );

  // Real photography (Product.images) wins when present for the active
  // swatch; otherwise fall back to the generated placeholder tile. In
  // placeholder mode, base and hover are the same tile differentiated with
  // a CSS filter (see `.product-card__image--hover.is-placeholder`) rather
  // than a second image asset.
  const { baseImage, hoverImage, isPlaceholder } = useMemo(() => {
    const real = product.images?.[activeSwatch.id];
    if (real) {
      return { baseImage: real.image, hoverImage: real.hoverImage ?? real.image, isPlaceholder: false };
    }
    const placeholder = img(activeSwatch.hex.slice(1));
    return { baseImage: placeholder, hoverImage: placeholder, isPlaceholder: true };
  }, [product.images, activeSwatch]);

  const visibleSwatches = product.swatches.slice(0, 5);
  const hiddenCount = product.swatches.length - visibleSwatches.length;

  const quickShopPanelId = `quickshop-panel-${product.id}`;
  const colorLabelId = `quickshop-color-label-${product.id}`;
  const sizeLabelId = `quickshop-size-label-${product.id}`;

  useEffect(() => {
    return () => {
      if (addedTimeoutRef.current !== null) window.clearTimeout(addedTimeoutRef.current);
    };
  }, []);

  const handleAddToBag = () => {
    if (!selectedSize) return;
    if (addedTimeoutRef.current !== null) window.clearTimeout(addedTimeoutRef.current);
    setJustAdded(true);
    addedTimeoutRef.current = window.setTimeout(() => setJustAdded(false), 1600);
  };

  const closeCard = () => {
    setIsHovering(false);
    setQuickShopOpen(false);
    setPreviewSwatchId(null);
  };

  const closeQuickShop = () => {
    setQuickShopOpen(false);
    quickShopToggleRef.current?.focus();
  };

  // Returns a render function scoped to `list` — each rendered group (the
  // compact row's first 5, Quick Shop's full set) tracks its own roving
  // tabindex, since they're two independently-navigable radiogroups that
  // happen to share the same underlying selection.
  const renderSwatchGroup = (list: Swatch[]) => {
    const hasSelectionInList = list.some((s) => s.id === selectedSwatchId);
    return (s: Swatch, index: number) => {
      const isSelected = selectedSwatchId === s.id;
      const isTabbable = isSelected || (!hasSelectionInList && index === 0);
      return (
        <button
          key={s.id}
          type="button"
          role="radio"
          className={`swatch-dot ${isSelected ? 'is-active' : ''}`}
          style={{ backgroundColor: s.hex }}
          aria-label={s.label}
          aria-checked={isSelected}
          tabIndex={isTabbable ? 0 : -1}
          onMouseEnter={() => setPreviewSwatchId(s.id)}
          onMouseLeave={() => setPreviewSwatchId(null)}
          onFocus={() => setPreviewSwatchId(s.id)}
          onBlur={() => setPreviewSwatchId(null)}
          onClick={() => setSelectedSwatchId(s.id)}
          onKeyDown={(e) => handleRadioKeyDown(e, list, index, (item) => setSelectedSwatchId(item.id))}
        />
      );
    };
  };

  const renderSizeChip = (list: string[]) => {
    const hasSelectionInList = list.some((size) => size === selectedSize);
    return (size: string, index: number) => {
      const isSelected = selectedSize === size;
      const isTabbable = isSelected || (!hasSelectionInList && index === 0);
      return (
        <button
          key={size}
          type="button"
          role="radio"
          className={`size-chip ${isSelected ? 'is-selected' : ''}`}
          aria-checked={isSelected}
          aria-label={`Size ${size}`}
          tabIndex={isTabbable ? 0 : -1}
          onClick={() => setSelectedSize(size)}
          onKeyDown={(e) => handleRadioKeyDown(e, list, index, (item) => setSelectedSize(item))}
        >
          {size}
        </button>
      );
    };
  };

  return (
    <li
      className="product-card"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={closeCard}
      onFocus={() => setIsHovering(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) closeCard();
      }}
    >
      <div className="product-card__media">
        {product.badges && product.badges.length > 0 && (
          <div className="product-card__badges">
            {product.badges.map((badge) => (
              <span key={badge.type} className={`badge badge--${badge.type}`}>
                {badge.label}
              </span>
            ))}
          </div>
        )}

        <div className="product-card__image-stack">
          <img
            className={`product-card__image product-card__image--base ${
              isPlaceholder ? 'is-placeholder' : ''
            }`}
            src={baseImage}
            alt={`${product.name} in ${activeSwatch.label}`}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
          />
          <img
            className={`product-card__image product-card__image--hover ${
              isPlaceholder ? 'is-placeholder' : ''
            } ${isHovering ? 'is-visible' : ''}`}
            src={hoverImage}
            alt=""
            aria-hidden="true"
            loading="lazy"
          />
          {/* Placeholder-only: real photography identifies the product on
              its own, so this text stand-in only renders when there's no
              real image for the active swatch. */}
          {isPlaceholder && (
            <div className="product-card__image-label" aria-hidden="true">
              <span>{product.name}</span>
            </div>
          )}
        </div>

        <button
          ref={quickShopToggleRef}
          type="button"
          className={`product-card__quickshop-toggle ${quickShopOpen ? 'is-open' : ''}`}
          onClick={() => setQuickShopOpen((open) => !open)}
          aria-expanded={quickShopOpen}
          aria-controls={quickShopPanelId}
          aria-label={`Quick Shop — ${product.name}`}
        >
          Quick Shop
        </button>

        <div
          id={quickShopPanelId}
          className={`product-card__quickshop-panel ${quickShopOpen ? 'is-open' : ''}`}
          inert={!quickShopOpen}
          onKeyDown={(e) => {
            if (e.key === 'Escape') closeQuickShop();
          }}
        >
          {product.swatches.length > 1 && (
            <>
              <p id={colorLabelId} className="product-card__quickshop-label">
                Select a color
              </p>
              <div
                className="product-card__swatches product-card__quickshop-swatches"
                role="radiogroup"
                aria-labelledby={colorLabelId}
              >
                {product.swatches.map(renderSwatchGroup(product.swatches))}
              </div>
            </>
          )}

          <p id={sizeLabelId} className="product-card__quickshop-label">
            Select a size
          </p>
          <div className="product-card__sizes" role="radiogroup" aria-labelledby={sizeLabelId}>
            {product.sizes.map(renderSizeChip(product.sizes))}
          </div>
          <button
            type="button"
            className={`product-card__add-btn ${justAdded ? 'is-added' : ''}`}
            onClick={handleAddToBag}
            disabled={!selectedSize}
            aria-label={`Add ${product.name} to bag`}
          >
            {justAdded ? 'Added ✓' : 'Add to Bag'}
          </button>
          <span className="sr-only" aria-live="polite">
            {justAdded ? `${product.name} added to bag` : ''}
          </span>
        </div>
      </div>

      <div className="product-card__info">
        <h3 className="product-card__name">{product.name}</h3>
        <p className="product-card__subtitle">{activeSwatch.label}</p>

        <div className="product-card__price">
          <span className={product.compareAtPrice ? 'is-sale' : ''}>
            {product.compareAtPrice && <span className="sr-only">Sale price: </span>}
            {formatPrice(product.price)}
          </span>
          {product.compareAtPrice && (
            <span className="product-card__compare-price">
              <span className="sr-only">Regular price: </span>
              <del>{formatPrice(product.compareAtPrice)}</del>
            </span>
          )}
        </div>

        <div className="product-card__swatches">
          <div
            className="product-card__swatches-group"
            role="radiogroup"
            aria-label={`Color: ${activeSwatch.label}`}
          >
            {visibleSwatches.map(renderSwatchGroup(visibleSwatches))}
          </div>
          {hiddenCount > 0 && (
            <button
              type="button"
              className="swatch-more"
              onClick={() => setQuickShopOpen(true)}
              aria-label={`${hiddenCount} more colors — open quick shop`}
            >
              +{hiddenCount}
            </button>
          )}
        </div>
      </div>
    </li>
  );
}
