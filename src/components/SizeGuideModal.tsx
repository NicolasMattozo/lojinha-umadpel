interface SizeGuideModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SizeGuideModal({ isOpen, onClose }: SizeGuideModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-opacity animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col animate-scaleIn relative max-h-[90vh]">
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-colors z-20"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="px-6 py-5 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 tracking-tight">Tabela de Medidas</h2>
                    <p className="text-sm text-gray-500 mt-1">Consulte as dimensões para escolher o tamanho ideal.</p>
                </div>

                <div className="p-6 overflow-y-auto space-y-8">
                    
                    {/* Camiseta Adulta Masculina */}
                    <div className="space-y-3">
                        <h3 className="font-bold text-brand-primary uppercase text-sm tracking-wider">Camiseta Adulta Masculina / Unissex</h3>
                        <div className="overflow-x-auto rounded-xl border border-gray-200">
                            <table className="w-full text-sm text-center">
                                <thead className="bg-gray-50 text-gray-700">
                                    <tr>
                                        <th className="px-4 py-3 border-b border-r border-gray-200 font-semibold text-left">Tamanho</th>
                                        <th className="px-3 py-3 border-b border-gray-200">PP</th>
                                        <th className="px-3 py-3 border-b border-gray-200">P</th>
                                        <th className="px-3 py-3 border-b border-gray-200">M</th>
                                        <th className="px-3 py-3 border-b border-gray-200">G</th>
                                        <th className="px-3 py-3 border-b border-gray-200">GG</th>
                                        <th className="px-3 py-3 border-b border-gray-200">XL</th>
                                        <th className="px-3 py-3 border-b border-gray-200">XLX</th>
                                        <th className="px-3 py-3 border-b border-gray-200">XLXX</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b border-gray-50">
                                        <td className="px-4 py-3 border-r border-gray-200 font-medium text-left bg-gray-50/50">Comprimento</td>
                                        <td className="px-3 py-3">67cm</td>
                                        <td className="px-3 py-3">69cm</td>
                                        <td className="px-3 py-3">72cm</td>
                                        <td className="px-3 py-3">74cm</td>
                                        <td className="px-3 py-3">78cm</td>
                                        <td className="px-3 py-3">82cm</td>
                                        <td className="px-3 py-3">85cm</td>
                                        <td className="px-3 py-3">88cm</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3 border-r border-gray-200 font-medium text-left bg-gray-50/50">Largura</td>
                                        <td className="px-3 py-3">48cm</td>
                                        <td className="px-3 py-3">50cm</td>
                                        <td className="px-3 py-3">53cm</td>
                                        <td className="px-3 py-3">56cm</td>
                                        <td className="px-3 py-3">60cm</td>
                                        <td className="px-3 py-3">64cm</td>
                                        <td className="px-3 py-3">70cm</td>
                                        <td className="px-3 py-3">80cm</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Camiseta Baby Look */}
                    <div className="space-y-3">
                        <h3 className="font-bold text-brand-primary uppercase text-sm tracking-wider">Camiseta Baby Look</h3>
                        <div className="overflow-x-auto rounded-xl border border-gray-200">
                            <table className="w-full text-sm text-center">
                                <thead className="bg-gray-50 text-gray-700">
                                    <tr>
                                        <th className="px-4 py-3 border-b border-r border-gray-200 font-semibold text-left">Tamanho</th>
                                        <th className="px-3 py-3 border-b border-gray-200">PP</th>
                                        <th className="px-3 py-3 border-b border-gray-200">P</th>
                                        <th className="px-3 py-3 border-b border-gray-200">M</th>
                                        <th className="px-3 py-3 border-b border-gray-200">G</th>
                                        <th className="px-3 py-3 border-b border-gray-200">GG</th>
                                        <th className="px-3 py-3 border-b border-gray-200">XL</th>
                                        <th className="px-3 py-3 border-b border-gray-200">XLX</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b border-gray-50">
                                        <td className="px-4 py-3 border-r border-gray-200 font-medium text-left bg-gray-50/50">Comprimento</td>
                                        <td className="px-3 py-3">55cm</td>
                                        <td className="px-3 py-3">57cm</td>
                                        <td className="px-3 py-3">59cm</td>
                                        <td className="px-3 py-3">61cm</td>
                                        <td className="px-3 py-3">63cm</td>
                                        <td className="px-3 py-3">68cm</td>
                                        <td className="px-3 py-3">70cm</td>
                                    </tr>
                                    <tr className="border-b border-gray-50">
                                        <td className="px-4 py-3 border-r border-gray-200 font-medium text-left bg-gray-50/50">Largura (Busto)</td>
                                        <td className="px-3 py-3">40cm</td>
                                        <td className="px-3 py-3">42cm</td>
                                        <td className="px-3 py-3">44cm</td>
                                        <td className="px-3 py-3">46cm</td>
                                        <td className="px-3 py-3">49cm</td>
                                        <td className="px-3 py-3">54cm</td>
                                        <td className="px-3 py-3">58cm</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3 border-r border-gray-200 font-medium text-left bg-gray-50/50">Quadril</td>
                                        <td className="px-3 py-3">42cm</td>
                                        <td className="px-3 py-3">44cm</td>
                                        <td className="px-3 py-3">46cm</td>
                                        <td className="px-3 py-3">48cm</td>
                                        <td className="px-3 py-3">52cm</td>
                                        <td className="px-3 py-3">57cm</td>
                                        <td className="px-3 py-3">62cm</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Camiseta Infantil */}
                    <div className="space-y-3">
                        <h3 className="font-bold text-brand-primary uppercase text-sm tracking-wider">Camiseta Infantil</h3>
                        <div className="overflow-x-auto rounded-xl border border-gray-200">
                            <table className="w-full text-sm text-center">
                                <thead className="bg-gray-50 text-gray-700">
                                    <tr>
                                        <th className="px-4 py-3 border-b border-r border-gray-200 font-semibold text-left">Tamanho</th>
                                        <th className="px-3 py-3 border-b border-gray-200">2</th>
                                        <th className="px-3 py-3 border-b border-gray-200">4</th>
                                        <th className="px-3 py-3 border-b border-gray-200">6</th>
                                        <th className="px-3 py-3 border-b border-gray-200">8</th>
                                        <th className="px-3 py-3 border-b border-gray-200">10</th>
                                        <th className="px-3 py-3 border-b border-gray-200">12</th>
                                        <th className="px-3 py-3 border-b border-gray-200">14</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b border-gray-50">
                                        <td className="px-4 py-3 border-r border-gray-200 font-medium text-left bg-gray-50/50">Comprimento</td>
                                        <td className="px-3 py-3">41cm</td>
                                        <td className="px-3 py-3">45cm</td>
                                        <td className="px-3 py-3">48cm</td>
                                        <td className="px-3 py-3">52cm</td>
                                        <td className="px-3 py-3">55cm</td>
                                        <td className="px-3 py-3">59cm</td>
                                        <td className="px-3 py-3">62cm</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3 border-r border-gray-200 font-medium text-left bg-gray-50/50">Largura</td>
                                        <td className="px-3 py-3">32cm</td>
                                        <td className="px-3 py-3">36cm</td>
                                        <td className="px-3 py-3">38cm</td>
                                        <td className="px-3 py-3">40cm</td>
                                        <td className="px-3 py-3">42cm</td>
                                        <td className="px-3 py-3">45cm</td>
                                        <td className="px-3 py-3">48cm</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
