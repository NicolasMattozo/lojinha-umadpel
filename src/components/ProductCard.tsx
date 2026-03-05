import type { Product } from '../types';

interface ProductCardProps {
    product: Product;
    onOpenModal: (product: Product) => void;
}

export function ProductCard({ product, onOpenModal }: ProductCardProps) {
    const isAvailable = product.availableUntil ? new Date() <= new Date(product.availableUntil) : true;

    return (
        <div className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full border border-gray-100 overflow-hidden">
            <div className="relative aspect-4/3 overflow-hidden bg-gray-100">
                <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </div>
            
            <div className="p-5 flex flex-col flex-1">
                <div className="mb-2">
                     <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">
                        Oferta
                     </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight group-hover:text-brand-primary transition-colors">
                    {product.name}
                </h3>
                <p className="text-gray-500 text-sm mb-4 flex-1 line-clamp-3 leading-relaxed">
                    {product.description}
                </p>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-400 font-medium">Preço</span>
                        <span className="text-xl font-extrabold text-gray-900">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                        </span>
                    </div>
                    {isAvailable ? (
                        <button 
                            onClick={() => onOpenModal(product)}
                            className="bg-brand-primary/90 hover:bg-brand-primary text-white p-3 rounded-full shadow-lg shadow-brand-primary/20 hover:shadow-brand-primary/40 transform hover:-translate-y-1 transition-all active:scale-95"
                            aria-label="Ver detalhes e comprar"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </button>
                    ) : (
                        <span className="text-xs font-bold text-red-500 uppercase px-3 py-1 bg-red-50 rounded-full border border-red-100">
                            Indisponível
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
