import { useState, useEffect } from 'react';
import type { Product, CartItem } from './types';
import { ProductCard } from './components/ProductCard';
import { CheckoutModal } from './components/CheckoutModal';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Footer } from './components/Footer';
import { ProductModal } from './components/ProductModal';

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // URL do novo Google Apps Script (products-script.js) ou do principal
    const productsUrl = import.meta.env.VITE_PRODUCTS_SCRIPT_URL || import.meta.env.VITE_APPS_SCRIPT_URL;
    
    if (productsUrl) {
      fetch(productsUrl)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setProducts(data);
          } else {
            console.error("Erro na resposta da planilha (não é uma lista):", data);
            import('./data/products').then(module => setProducts(module.products));
          }
        })
        .catch(err => {
          console.error("Erro de rede ao buscar produtos. Usando fallback local.", err);
          import('./data/products').then(module => setProducts(module.products));
        })
        .finally(() => setIsLoadingProducts(false));
    } else {
      import('./data/products').then(module => {
        setProducts(module.products);
        setIsLoadingProducts(false);
      });
    }
  }, []);

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
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="flex-1 w-full">
        <Hero />
        
        <section id="produtos" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 scroll-mt-24">
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
            {isLoadingProducts ? (
              // Esqueleto/Loading
              [1, 2, 3, 4].map(idx => (
                <div key={idx} className="bg-white rounded-xl shadow-sm h-96 animate-pulse border border-gray-100 flex flex-col">
                  <div className="w-full h-48 bg-gray-200 rounded-t-xl"></div>
                  <div className="p-5 flex-1 space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="space-y-2">
                       <div className="h-3 bg-gray-200 rounded w-full"></div>
                       <div className="h-3 bg-gray-200 rounded w-full"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : products.length > 0 ? (
              products
                .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase()))
                .map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onOpenModal={handleOpenProduct} 
                />
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500 py-10">Nenhum produto encontrado na planilha.</p>
            )}
            
            {!isLoadingProducts && products.length > 0 && products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
              <p className="col-span-full text-center text-gray-500 py-10 w-full">Nenhum produto encontrado na sua busca.</p>
            )}
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
