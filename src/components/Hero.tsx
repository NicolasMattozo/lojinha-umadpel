import { type FC } from 'react';

export const Hero: FC = () => {
  return (
    <div className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden flex flex-col justify-center min-h-[85vh]">
      {/* Dynamic Background with Modern Gradients */}
      <div className="absolute inset-0 z-0 bg-black">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-primary/40 via-black to-black opacity-90"></div>
        
        {/* Animated Glowing Spheres */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-primary/30 rounded-full mix-blend-screen filter blur-[100px] animate-pulse" style={{ animationDuration: '4s' }}></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-brand-secondary/20 rounded-full mix-blend-screen filter blur-[100px] animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }}></div>
        
        {/* Subtle texture overlay */}
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] mix-blend-overlay"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="flex flex-col items-center justify-center text-center">
          
          {/* Top Badge */}
          <div className="animate-fade-in-up md:delay-100 flex items-center gap-2 py-1.5 px-4 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
            <span className="flex h-2 w-2 rounded-full bg-brand-primary animate-ping"></span>
            <span className="text-white/90 text-xs md:text-sm font-semibold tracking-[0.2em] uppercase">
              Coleção 2026 UMADPEL
            </span>
          </div>
          
          {/* Main Title - Modern Typography */}
          <h1 className="animate-fade-in-up md:delay-200 text-5xl md:text-7xl lg:text-[5.5rem] font-black text-white tracking-tighter mb-6 leading-[1.1] drop-shadow-2xl">
            Viva a vida <br className="hidden md:block"/>
            <span className="relative inline-block mt-2 md:mt-0">
              <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-brand-primary to-orange-400">
                Por Inteiro
              </span>
              <span className="absolute -inset-1 blur-2xl bg-brand-primary/30 z-0 rounded-full"></span>
            </span>
          </h1>
          
          {/* Thematic Quote */}
          <div className="animate-fade-in-up md:delay-300 mt-6 max-w-2xl mx-auto relative">
            <div className="absolute -left-6 -top-4 text-brand-primary/30 text-6xl font-serif">"</div>
            <p className="text-xl md:text-2xl text-white font-medium italic mb-2 tracking-wide text-shadow-sm">
              Pois nele vivemos, nos movemos e existimos.
            </p>
            <p className="text-sm md:text-base text-white/50 font-mono tracking-widest uppercase mb-8">
              — Atos 17:28
            </p>
          </div>

          <p className="animate-fade-in-up md:delay-400 max-w-xl mx-auto text-base md:text-lg text-white/70 font-light mb-12 leading-relaxed">
            Vista o propósito da nossa geração. Peças exclusivas desenhadas para expressar sua fé com autenticidade e estilo.
          </p>
          
          {/* Action Buttons with Glassmorphism */}
          <div className="animate-fade-in-up md:delay-500 flex flex-col sm:flex-row justify-center items-center gap-5 w-full sm:w-auto">
            <a 
              href="#produtos"
              onClick={(e) => { e.preventDefault(); document.getElementById('produtos')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="group relative w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-white text-brand-primary font-bold rounded-full shadow-[0_0_40px_rgba(208,70,46,0.3)] hover:shadow-[0_0_60px_rgba(208,70,46,0.5)] hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10">Explorar Produtos</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 relative z-10 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
              <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </a>
            
            <a 
              href="#sobre"
              onClick={(e) => { e.preventDefault(); document.getElementById('sobre')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="group w-full sm:w-auto px-8 py-4 bg-white/5 backdrop-blur-md border border-white/10 text-white font-semibold rounded-full hover:bg-white/10 hover:border-white/30 active:scale-95 transition-all duration-300"
            >
              Conheça a Coleção
            </a>
          </div>
          
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce flex flex-col items-center opacity-50 hidden md:flex">
        <span className="text-white/60 text-xs uppercase tracking-widest mb-2 font-semibold">Deslize</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </div>
  );
};
