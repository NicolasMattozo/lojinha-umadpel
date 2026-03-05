import { type FC } from 'react';

interface NavbarProps {
  cartCount: number;
  onCartClick: () => void;
}

export const Navbar: FC<NavbarProps> = ({ cartCount, onCartClick }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-primary/95 backdrop-blur-sm text-white shadow-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className="">
                <img src="/logo_1.png" alt="Logo Umadpel" className="h-14 w-auto rounded-lg" />
            </div>
            <div>
              <div className="text-2xl font-bold tracking-tight leading-none">
                <img src="/logo_2.png" alt="Logo Umadpel" className="h-12 w-auto rounded-lg" />
              </div>
            </div>
          </div>

          {/* Search Bar - Hidden on mobile for now or collapsed */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full group">
              <input
                type="text"
                placeholder="Buscar produtos..."
                className="w-full bg-white/10 text-white placeholder-white/60 border border-white/20 rounded-full py-2.5 pl-5 pr-12 focus:outline-none focus:bg-white/20 focus:border-white/40 transition-all font-light"
              />
              <button className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 bg-white text-brand-primary rounded-full hover:scale-105 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            
            <button 
              onClick={onCartClick}
              className="relative p-2 text-white hover:bg-white/10 rounded-full transition-all group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-white text-brand-primary text-xs font-bold h-5 w-5 flex items-center justify-center rounded-full shadow-md group-hover:scale-110 transition-transform">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
