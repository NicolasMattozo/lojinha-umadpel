import { type FC } from 'react';

export const Hero: FC = () => {
  return (
    <div className="relative pt-40 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      {/* Background with Gradient */}
      <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-linear-to-br from-brand-primary via-brand-secondary to-black opacity-95"></div>
          {/* Abstract pattern or overlay can go here */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <span className="inline-block py-1 px-3 rounded-full bg-white/10 text-white/90 text-sm font-medium tracking-wide mb-6 border border-white/10 backdrop-blur-md animate-fade-in-up">
          COLEÇÃO 2026
        </span>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight mb-6 leading-tight drop-shadow-lg">
          Vista a <span className="text-transparent bg-clip-text bg-linear-to-r from-white to-gray-300">Identidade</span> <br />
          da Nossa Geração
        </h1>
        
        <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-white/80 font-light mb-10 leading-relaxed">
          Camisetas, acessórios e produtos exclusivos da UMADPEL. 
          Qualidade, estilo e propósito em cada detalhe.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="px-8 py-4 bg-white text-brand-primary font-bold rounded-full shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300">
            Ver Produtos
          </button>
          <button className="px-8 py-4 bg-transparent border border-white/30 text-white font-semibold rounded-full hover:bg-white/10 active:scale-95 transition-all duration-300">
            Sobre Nós
          </button>
        </div>
      </div>
    </div>
  );
};
