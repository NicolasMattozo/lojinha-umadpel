import { useState } from 'react';
import { products } from './data/products';
import type { Product, CartItem } from './types';
import { ProductCard } from './components/ProductCard';
import { CheckoutModal } from './components/CheckoutModal';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Footer } from './components/Footer';
import { ProductModal } from './components/ProductModal';

function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  const handleOpenProduct = (product: Product) => {
      setSelectedProduct(product);
      setIsProductModalOpen(true);
  };

  const handleAddToCart = (product: Product, size: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && item.size === size);
      
      if (existing) {
        return prev.map(item => 
          (item.id === product.id && item.size === size)
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { ...product, quantity: 1, size }];
    });
  };

  const handleCheckout = (customerData: { name: string; email: string }) => {
    console.log("Pedido Finalizado no Frontend!", {
      customer: customerData,
      items: cart,
      date: new Date().toISOString()
    });
    setCart([]);
    setIsCheckoutOpen(false);
  };

  return (
    <div className="min-h-screen bg-brand-gray flex flex-col font-sans selection:bg-brand-primary selection:text-white">
      <Navbar 
        cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)} 
        onCartClick={() => setIsCheckoutOpen(true)}
      />

      <main className="flex-1 w-full">
        <Hero />
        
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
              Nossos Produtos
            </h2>
            <div className="h-1 w-20 bg-brand-primary mx-auto rounded-full"></div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore nossa coleção exclusiva desenhada para expressar sua fé e identidade.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onOpenModal={handleOpenProduct} 
              />
            ))}
          </div>
        </section>
      </main>

      <Footer />

      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
        cartItems={cart}
        onConfirm={handleCheckout}
      />

      <ProductModal 
        product={selectedProduct}
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}

export default App;
