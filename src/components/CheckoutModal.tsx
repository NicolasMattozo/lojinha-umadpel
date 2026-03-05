import { useState, useRef } from 'react';
import type { CartItem } from '../types';
import emailjs from '@emailjs/browser';
import ReCAPTCHA from 'react-google-recaptcha';

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    cartItems: CartItem[];
    onConfirm: (customerData: { name: string; email: string }) => void;
}

export function CheckoutModal({ isOpen, onClose, cartItems, onConfirm }: CheckoutModalProps) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const recaptchaRef = useRef<ReCAPTCHA>(null);

    if (!isOpen) return null;

    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const recaptchaValue = recaptchaRef.current?.getValue();
        if (!recaptchaValue) {
            alert('Por favor, confirme que você não é um robô.');
            return;
        }

        setIsLoading(true);

        const itemsList = cartItems.map(item => 
            `${item.quantity}x ${item.name} (Tamanho: ${item.size}) - ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price)} un.`
        ).join('\n');

        const totalFormatted = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total);

        const templateParams = {
            nome: name,
            email: email,
            itens: itemsList,
            total: totalFormatted
        };

        try {
            await emailjs.send(
                import.meta.env.VITE_EMAILJS_SERVICE_ID,
                import.meta.env.VITE_EMAILJS_TEMPLATE_ID_ADMIN,
                templateParams,
                import.meta.env.VITE_EMAILJS_PUBLIC_KEY
            );

            await emailjs.send(
                import.meta.env.VITE_EMAILJS_SERVICE_ID,
                import.meta.env.VITE_EMAILJS_TEMPLATE_ID_CLIENT,
                templateParams,
                import.meta.env.VITE_EMAILJS_PUBLIC_KEY
            );

            // Fire-and-forget para o Google Sheets (Web App)
            fetch(import.meta.env.VITE_APPS_SCRIPT_URL, {
                method: 'POST',
                body: JSON.stringify({
                    customerName: name,
                    customerEmail: email,
                    total: totalFormatted,
                    items: cartItems.map(item => ({
                        name: item.name,
                        size: item.size,
                        quantity: item.quantity,
                        price: item.price
                    }))
                })
            }).catch(console.error);

            alert(`Obrigado, ${name}! Seu pedido foi registrado com sucesso e você receberá um e-mail de confirmação em breve.`);
            setName('');
            setEmail('');
            onConfirm({ name, email });
        } catch (error) {
            console.error('Erro ao enviar pedido:', error);
            alert('Houve um erro ao processar seu pedido. Por favor, tente novamente.');
        } finally {
            recaptchaRef.current?.reset();
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-opacity">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all animate-fade-in-up relative">
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors z-10"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                
                <div className="bg-brand-gray px-6 py-6 border-b border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Finalizar Pedido</h2>
                    <p className="text-sm text-gray-500 mt-1">Complete seus dados para confirmar.</p>
                </div>
                
                <div className="p-6">
                    <div className="mb-6 bg-gray-50 rounded-xl p-4 border border-gray-100">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-500">Resumo</span>
                            <span className="text-sm font-bold text-brand-primary">{cartItems.length} itens</span>
                        </div>
                        {cartItems.length === 0 ? (
                            <p className="text-gray-500 italic text-sm py-2">Seu carrinho está vazio.</p>
                        ) : (
                             <ul className="space-y-2 max-h-32 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200">
                                {cartItems.map((item) => (
                                    <li key={item.id} className="flex justify-between text-sm py-1 border-b border-gray-100 last:border-0">
                                        <span className="text-gray-600 truncate max-w-[60%]">{item.quantity}x {item.name}</span>
                                        <span className="font-medium text-gray-900">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price * item.quantity)}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                        <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center bg-white p-3 rounded-lg shadow-sm">
                            <span className="font-bold text-gray-700">Total</span>
                            <span className="font-extrabold text-xl text-brand-primary">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}
                            </span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5 ml-1">Nome Completo</label>
                                <input 
                                    type="text" 
                                    required 
                                    className="w-full px-4 py-3 bg-gray-50 border-gray-200 border rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all placeholder-gray-400 text-gray-800"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Digite seu nome"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5 ml-1">Email</label>
                                <input 
                                    type="email" 
                                    required 
                                    className="w-full px-4 py-3 bg-gray-50 border-gray-200 border rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all placeholder-gray-400 text-gray-800"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="seu@email.com"
                                />
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <ReCAPTCHA
                                ref={recaptchaRef}
                                sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY || 'dummy_key'}
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={cartItems.length === 0 || isLoading}
                            className="w-full bg-brand-primary hover:bg-brand-primary-hover disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg shadow-brand-primary/30 hover:shadow-brand-primary/50 transform hover:-translate-y-0.5 transition-all active:scale-95 text-lg flex justify-center items-center"
                        >
                            {isLoading ? (
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : null}
                            {isLoading ? 'Processando...' : 'Confirmar Pedido'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
