import { useEffect, useRef, useState } from 'react';
import type { Product } from '../types/product';
import { ProductCard } from './ProductCard';
import './ProductGrid.scss';

interface ProductGridProps {
  title: string;
  products: Product[];
}

const SCROLL_EPSILON = 4;

const EAGER_LOAD_COUNT = 4;

export function ProductGrid({ title, products }: ProductGridProps) {
  const scrollRef = useRef<HTMLUListElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const updateScrollState = () => {
      const maxScrollLeft = el.scrollWidth - el.clientWidth;
      setCanScrollPrev(el.scrollLeft > SCROLL_EPSILON);
      setCanScrollNext(el.scrollLeft < maxScrollLeft - SCROLL_EPSILON);
    };

    updateScrollState();
    el.addEventListener('scroll', updateScrollState, { passive: true });
    const resizeObserver = new ResizeObserver(updateScrollState);
    resizeObserver.observe(el);

    return () => {
      el.removeEventListener('scroll', updateScrollState);
      resizeObserver.disconnect();
    };
  }, [products]);

  const scrollByCard = (direction: 1 | -1) => {
    const el = scrollRef.current;
    if (!el) return;

    const items = Array.from(el.children) as HTMLElement[];
    const current = el.scrollLeft;
    const target =
      direction === 1
        ? items.find((item) => item.offsetLeft > current + SCROLL_EPSILON)
        : [...items]
            .reverse()
            .find((item) => item.offsetLeft < current - SCROLL_EPSILON);
    if (!target) return;

    const targetIndex = items.indexOf(target);
    const targetProduct = products[targetIndex];
    if (targetProduct) {
      setStatusMessage(`Showing ${targetProduct.name}, product ${targetIndex + 1} of ${products.length}`);
    }

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    el.scrollTo({
      left: target.offsetLeft,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  };

  return (
    <section className='product-grid' aria-labelledby='product-grid-heading'>
      <header className='product-grid__header'>
        <h2 id='product-grid-heading' className='product-grid__title'>
          {title}
        </h2>
        <a className='product-grid__shop-all' href='#'>
          Shop All
        </a>
      </header>

      <div className='product-grid__viewport'>
        <span className='sr-only' aria-live='polite'>
          {statusMessage}
        </span>
        <button
          type='button'
          className='product-grid__arrow product-grid__arrow--prev'
          onClick={() => scrollByCard(-1)}
          disabled={!canScrollPrev}
          aria-label='Previous products'
        >
          <svg viewBox='0 0 24 24' aria-hidden='true' focusable='false'>
            <path
              d='M15 6l-6 6 6 6'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        </button>

        <ul className='product-grid__list' ref={scrollRef}>
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              priority={index < EAGER_LOAD_COUNT}
            />
          ))}
        </ul>

        <button
          type='button'
          className='product-grid__arrow product-grid__arrow--next'
          onClick={() => scrollByCard(1)}
          disabled={!canScrollNext}
          aria-label='Next products'
        >
          <svg viewBox='0 0 24 24' aria-hidden='true' focusable='false'>
            <path
              d='M9 6l6 6-6 6'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        </button>
      </div>
    </section>
  );
}
