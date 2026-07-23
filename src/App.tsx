import { ProductGrid } from './components/ProductGrid';
import { products } from './data/products';

function App() {
  return (
    <main>
      <ProductGrid title="Best Sellers" products={products} />
    </main>
  );
}

export default App;
