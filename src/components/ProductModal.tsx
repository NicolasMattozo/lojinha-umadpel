import { useState } from 'react';
import type { Product } from '../types';
import { SizeGuideModal } from './SizeGuideModal';

interface ProductModalProps {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
    onAddToCart: (product: Product, size: string) => void;
}

const SIZES = ['P', 'M', 'G', 'GG', 'XG'];

export function ProductModal({ product, isOpen, onClose, onAddToCart }: ProductModalProps) {
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

    if (!isOpen || !product) return null;

    const isAvailable = product.availableUntil ? new Date() <= new Date(product.availableUntil) : true;

    const handleAddToCart = () => {
        if (!selectedSize) {
            alert('Por favor, selecione um tamanho.');
            return;
        }
        onAddToCart(product, selectedSize);
        onClose();
        setSelectedSize(''); // Reset for next time
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-opacity animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col md:flex-row animate-scaleIn relative">
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-white text-gray-500 hover:text-gray-800 rounded-full transition-colors z-20 backdrop-blur-sm shadow-sm"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Image Section */}
                <div className="w-full md:w-1/2 h-64 md:h-auto relative bg-gray-100">
                    <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Details Section */}
                <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col">
                    <div className="mb-auto">
                        <span className="text-sm font-bold text-brand-primary uppercase tracking-wider mb-2 block">
                            Detalhes do Produto
                        </span>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">
                            {product.name}
                        </h2>
                        <span className="text-3xl font-extrabold text-gray-900 block mb-4">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                        </span>
                        
                        <p className="text-gray-600 leading-relaxed mb-6">
                            {product.description}
                        </p>

                        <div className="mb-6">
                            <div className="flex justify-between items-end mb-3">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Selecione o Tamanho:
                                </label>
                                <button 
                                    onClick={() => setIsSizeGuideOpen(true)}
                                    className="text-xs font-semibold text-brand-primary hover:text-brand-primary-hover flex items-center gap-1 underline underline-offset-2 transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                    Tabela de Medidas
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {SIZES.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-sm transition-all border-2 ${
                                            selectedSize === size
                                                ? 'border-brand-primary bg-brand-primary text-white shadow-lg shadow-brand-primary/30 scale-105'
                                                : 'border-gray-200 text-gray-600 hover:border-brand-primary/50 hover:text-brand-primary'
                                        }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleAddToCart}
                        disabled={!selectedSize || !isAvailable}
                        className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all transform active:scale-95 ${
                            !isAvailable ? 'bg-red-500 text-white cursor-not-allowed shadow-red-500/30' :
                            selectedSize 
                                ? 'bg-brand-primary hover:bg-brand-primary-hover text-white shadow-brand-primary/30 hover:shadow-brand-primary/50 hover:-translate-y-1' 
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                    >
                        <span>{isAvailable ? 'Adicionar ao Carrinho' : 'Vendas Encerradas'}</span>
                        {isAvailable && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            <SizeGuideModal 
                isOpen={isSizeGuideOpen} 
                onClose={() => setIsSizeGuideOpen(false)} 
            />
        </div>
    );
}
