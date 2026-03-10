import { useState, useRef } from 'react';
import type { CartItem } from '../types';
import emailjs from '@emailjs/browser';
import ReCAPTCHA from 'react-google-recaptcha';
import { QRCodeSVG } from 'qrcode.react';
import { generatePixPayload } from '../utils/pix';

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    cartItems: CartItem[];
    onConfirm: (customerData: { name: string; email: string }) => void;
}

export function CheckoutModal({ isOpen, onClose, cartItems, onConfirm }: CheckoutModalProps) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<'pix' | 'later' | ''>('');
    const [whatsapp, setWhatsapp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState<{show: boolean, type: 'success' | 'error' | 'warning', message: string}>({ show: false, type: 'success', message: '' });
    const recaptchaRef = useRef<ReCAPTCHA>(null);

    if (!isOpen) return null;

    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const PIX_KEY = 'vithoria.music@gmail.com'; // Substitua pela sua chave PIX
    const PIX_NAME = 'Lojinha Umadpel';
    const PIX_CITY = 'Pelotas';
    const pixPayload = total > 0 ? generatePixPayload(PIX_KEY, PIX_NAME, PIX_CITY, total, 'PEDIDO') : '';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const recaptchaValue = recaptchaRef.current?.getValue();
        if (!recaptchaValue) {
            setNotification({
                show: true,
                type: 'warning',
                message: 'Por favor, confirme que você não é um robô antes de prosseguir.'
            });
            return;
        }

        // ── Idempotência: gera um ID único para este pedido ──────────────────────
        // Formato: order_<timestamp>_<random> — garante unicidade mesmo em cliques
        // simultâneos no mesmo dispositivo.
        const orderId = `order_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

        // Proteção contra double-submit: se este orderId já foi enviado nesta sessão,
        // bloqueia imediatamente sem disparar nenhuma chamada de rede.
        const sessionKey = `sent_order_${orderId}`;
        if (sessionStorage.getItem(sessionKey)) {
            setNotification({
                show: true,
                type: 'warning',
                message: 'Este pedido já foi enviado. Aguarde a confirmação.'
            });
            return;
        }
        // ─────────────────────────────────────────────────────────────────────────

        setIsLoading(true);

        const itemsList = cartItems.map(item => 
            `${item.quantity}x ${item.name} (Tamanho: ${item.size}) - ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price)} un.`
        ).join('\n');

        const totalFormatted = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total);
        const paymentStatusStr = paymentMethod === 'pix' ? 'Pagamento: Pix Agora' : `Pagamento: Depois. WhatsApp: ${whatsapp}`;

        const templateParams = {
            nome: name,
            email: email,
            itens: itemsList,
            total: totalFormatted,
            pagamento: paymentStatusStr
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
            // O orderId é incluído no payload para rastreabilidade na planilha.
            fetch(import.meta.env.VITE_APPS_SCRIPT_URL, {
                method: 'POST',
                body: JSON.stringify({
                    orderId,                     // ← chave de idempotência
                    customerName: name,
                    customerEmail: email,
                    whatsapp: whatsapp,
                    paymentMethod: paymentMethod === 'pix' ? 'Pix Agora' : 'Pagar Depois',
                    total: totalFormatted,
                    items: cartItems.map(item => ({
                        name: item.name,
                        size: item.size,
                        quantity: item.quantity,
                        price: item.price
                    }))
                })
            })
            .then(() => {
                // Marca o orderId como enviado nesta sessão — impede reenvio acidental
                sessionStorage.setItem(sessionKey, '1');
            })
            .catch(console.error);

            setNotification({
                show: true,
                type: 'success',
                message: `Obrigado, ${name}! Seu pedido foi registrado com sucesso e você receberá um e-mail de confirmação em breve.`
            });
            setName('');
            setEmail('');
            setWhatsapp('');
            setPaymentMethod('');
        } catch (error) {
            console.error('Erro ao enviar pedido:', error);
            setNotification({
                show: true,
                type: 'error',
                message: 'Houve um erro ao processar seu pedido. Por favor, verifique sua conexão ou tente novamente mais tarde.'
            });
        } finally {
            recaptchaRef.current?.reset();
            setIsLoading(false);
        }
    };

    const handleCloseNotification = () => {
        const wasSuccess = notification.type === 'success';
        setNotification({ ...notification, show: false });
        if (wasSuccess) {
            onConfirm({ name, email });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-opacity">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col max-h-[90vh] overflow-hidden transform transition-all animate-fade-in-up relative">
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors z-10"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                
                <div className="bg-brand-gray px-6 py-5 border-b border-gray-100 shrink-0">
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Finalizar Pedido</h2>
                    <p className="text-sm text-gray-500 mt-1">Complete seus dados para confirmar.</p>
                </div>
                
                <div className="p-6 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-gray-200">
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
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5 ml-1">Seu WhatsApp (com DDD)</label>
                                <input 
                                    type="tel" 
                                    required 
                                    className="w-full px-4 py-3 bg-gray-50 border-gray-200 border rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all placeholder-gray-400 text-gray-800"
                                    value={whatsapp}
                                    onChange={(e) => setWhatsapp(e.target.value)}
                                    placeholder="(xx) xxxxx-xxxx"
                                />
                            </div>

                            <div className="pt-2">
                                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3 ml-1">Forma de Pagamento</label>
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    <label className={`cursor-pointer rounded-xl border p-3 flex items-center transition-all ${paymentMethod === 'pix' ? 'bg-brand-primary/5 border-brand-primary ring-1 ring-brand-primary' : 'bg-gray-50 border-gray-200 hover:bg-white hover:border-brand-primary/30'}`}>
                                        <input 
                                            type="radio" 
                                            name="payment" 
                                            value="pix"
                                            className="sr-only"
                                            checked={paymentMethod === 'pix'}
                                            onChange={(e) => setPaymentMethod(e.target.value as any)}
                                        />
                                        <div className="flex-1">
                                            <span className={`block text-sm font-semibold ${paymentMethod === 'pix' ? 'text-brand-primary' : 'text-gray-700'}`}>Pagar no Pix agora</span>
                                        </div>
                                    </label>
                                    
                                    <label className={`cursor-pointer rounded-xl border p-3 flex items-center transition-all ${paymentMethod === 'later' ? 'bg-brand-primary/5 border-brand-primary ring-1 ring-brand-primary' : 'bg-gray-50 border-gray-200 hover:bg-white hover:border-brand-primary/30'}`}>
                                        <input 
                                            type="radio" 
                                            name="payment" 
                                            value="later"
                                            className="sr-only"
                                            checked={paymentMethod === 'later'}
                                            onChange={(e) => setPaymentMethod(e.target.value as any)}
                                        />
                                        <div className="flex-1">
                                            <span className={`block text-sm font-semibold ${paymentMethod === 'later' ? 'text-brand-primary' : 'text-gray-700'}`}>Pagar depois</span>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {paymentMethod === 'pix' && (
                                <div className="mt-4 flex flex-col items-center bg-gray-50 p-4 rounded-xl border border-gray-100 animate-fade-in-up">
                                    <p className="text-sm font-semibold text-gray-700 mb-3 block w-full text-center">Escaneie o QR Code para pagar ({new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)})</p>
                                    <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-200">
                                        <QRCodeSVG value={pixPayload} size={160} />
                                    </div>
                                    <p className="text-xs text-gray-500 text-center mt-3 max-w-[250px]">
                                        Abra o app do seu banco, escolha <strong>Pix por QR Code</strong> e aponte a câmera.
                                    </p>
                                    
                                    <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-700 bg-green-50 px-4 py-2 rounded-lg border border-green-100 w-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#25D366" className="shrink-0">
                                            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 1.829 6.366L0 24l5.807-1.52A12.052 12.052 0 0 0 11.944 24c6.627 0 12-5.373 12-12s-5.373-12-12-12zM12 21.905a9.96 9.96 0 0 1-5.088-1.391l-3.64.954.97-3.541A9.954 9.954 0 0 1 2.056 12C2.056 6.516 6.516 2.056 12 2.056s9.944 4.46 9.944 9.944S17.484 21.905 12 21.905zm5.558-7.584c-.305-.152-1.801-.89-2.079-.99-.279-.102-.482-.152-.686.152-.203.305-.788.99-1.016 1.218-.178.203-.382.254-.686.102-.305-.152-1.286-.474-2.45-1.517-.905-.812-1.515-1.815-1.693-2.12-.178-.305-.019-.47.133-.62.137-.136.305-.355.457-.533.152-.178.203-.305.305-.508.102-.203.051-.382-.025-.533-.076-.152-.686-1.657-.94-2.268-.248-.596-.5-.515-.686-.525-.178-.01-.382-.01-.585-.01-.203 0-.533.076-.813.382-.279.305-1.066 1.042-1.066 2.54 0 1.498 1.092 2.946 1.244 3.15.152.203 2.152 3.284 5.212 4.606 1.947.84 2.503.788 3.164.662.661-.127 2.134-.864 2.438-1.701.305-.837.305-1.55.203-1.701-.102-.152-.382-.254-.686-.406z"/>
                                        </svg>
                                        <span className="text-center">
                                            Envie o comprovante para <a href="https://wa.me/5553991326993" target="_blank" rel="noopener noreferrer" className="font-bold text-green-700 hover:text-green-800 hover:underline">(53) 99132-6993 (Makely)</a>
                                        </span>
                                    </div>
                                </div>
                            )}

                            {paymentMethod === 'later' && (
                                <div className="mt-4 animate-fade-in-up">
                                    <p className="text-sm text-brand-primary p-3 bg-brand-primary/5 rounded-xl border border-brand-primary/20 font-medium">Entraremos em contato com você pelo WhatsApp para combinar o pagamento (Pix, Cartão ou Dinheiro).</p>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-center">
                            <ReCAPTCHA
                                ref={recaptchaRef}
                                sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY || 'dummy_key'}
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={cartItems.length === 0 || isLoading || !paymentMethod || !whatsapp.trim()}
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

            {/* Modal de Notificação */}
            {notification.show && (
                <div className="absolute inset-0 z-60 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center transform transition-all scale-100 animate-fade-in-up">
                        <div className={`mx-auto flex items-center justify-center h-16 w-16 rounded-full mb-4 ${
                            notification.type === 'success' ? 'bg-green-100' : 
                            notification.type === 'error' ? 'bg-red-100' : 'bg-yellow-100'
                        }`}>
                            {notification.type === 'success' && (
                                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                            {notification.type === 'error' && (
                                <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                            {notification.type === 'warning' && (
                                <svg className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            )}
                        </div>
                        <h3 className={`text-xl font-bold mb-2 ${
                            notification.type === 'success' ? 'text-green-800' : 
                            notification.type === 'error' ? 'text-red-800' : 'text-yellow-800'
                        }`}>
                            {notification.type === 'success' ? 'Sucesso!' : 
                             notification.type === 'error' ? 'Ops, algo deu errado' : 'Atenção'}
                        </h3>
                        <p className="text-gray-600 mb-6 text-sm">
                            {notification.message}
                        </p>
                        <button
                            onClick={handleCloseNotification}
                            className={`w-full py-3 px-4 rounded-xl text-white font-bold transition-colors shadow-sm ${
                                notification.type === 'success' ? 'bg-green-600 hover:bg-green-700' : 
                                notification.type === 'error' ? 'bg-red-600 hover:bg-red-700' : 'bg-yellow-500 hover:bg-yellow-600'
                            }`}
                        >
                            Entendi
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
