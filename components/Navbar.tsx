import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronRight, User, LogOut, LayoutDashboard } from 'lucide-react';
import { Page } from '../App';
import { useAuth } from '../contexts/AuthContext';
import logo from '../logo.png';

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onContactClick: () => void;
  onAuthClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate, onContactClick, onAuthClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navClasses = `fixed w-full z-50 transition-all duration-500 border-b ${isScrolled
    ? 'bg-slate-950/80 backdrop-blur-xl border-slate-800 py-3'
    : 'bg-transparent border-transparent py-6'
    }`;

  const linkBaseClass = "text-sm font-medium transition-all duration-300 relative px-1 group cursor-pointer";

  // Fonction helper pour savoir si un lien est actif (y compris les sous-pages services)
  const isServicesActive = currentPage.startsWith('service') || currentPage === 'services';

  return (
    <nav className={navClasses}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        {/* Logo */}
        <div
          className="flex items-center space-x-3 cursor-pointer group"
          onClick={() => onNavigate('home')}
        >
          <div className="w-12 h-12 bg-slate-900/60 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all duration-300 border border-slate-800">
            <img src={logo} alt="Cyber Solium" className="w-9 h-9 object-contain" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-white leading-none">
              Cyber <span className="text-cyan-400">Solium</span>
            </span>
            <span className="text-[10px] text-slate-400 tracking-widest uppercase mt-0.5">Sécurité Offensive & Audit</span>
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
          <NavButton active={currentPage === 'home'} onClick={() => onNavigate('home')} label="Accueil" />
          <NavButton active={currentPage === 'nis2'} onClick={() => onNavigate('nis2')} label="Test Audit" />
          <NavButton active={currentPage === 'iso27001'} onClick={() => onNavigate('iso27001')} label="Test ISO27001" />
          <NavButton active={isServicesActive} onClick={() => onNavigate('services')} label="Nos Services" />
          <NavButton active={currentPage === 'blog'} onClick={() => onNavigate('blog')} label="Blog" />
          <NavButton active={currentPage === 'trainings'} onClick={() => onNavigate('trainings')} label="Nos formations" />

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate('dashboard')}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-700 transition-all"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="text-sm font-medium">Tableau de bord</span>
              </button>
              <button
                onClick={logout}
                className="p-2 text-slate-400 hover:text-white transition-colors"
                title="Déconnexion"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={onAuthClick}
                className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:text-white transition-colors"
              >
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">Connexion</span>
              </button>
              {/* Devis Gratuit button removed as requested */}
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-slate-300 hover:text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full h-screen bg-slate-950/95 backdrop-blur-xl border-t border-slate-800 p-6 flex flex-col space-y-6 animate-in slide-in-from-top-10">
          <MobileNavLink onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }} label="Accueil" active={currentPage === 'home'} />
          <MobileNavLink onClick={() => { onNavigate('nis2'); setMobileMenuOpen(false); }} label="Test Audit" active={currentPage === 'nis2'} />
          <MobileNavLink onClick={() => { onNavigate('iso27001'); setMobileMenuOpen(false); }} label="Test ISO27001" active={currentPage === 'iso27001'} />
          <MobileNavLink onClick={() => { onNavigate('services'); setMobileMenuOpen(false); }} label="Services & Solutions" active={isServicesActive} />
          <MobileNavLink onClick={() => { onNavigate('blog'); setMobileMenuOpen(false); }} label="Blog" active={currentPage === 'blog'} />
          <MobileNavLink onClick={() => { onNavigate('trainings'); setMobileMenuOpen(false); }} label="Nos formations" active={currentPage === 'trainings'} />
          <MobileNavLink onClick={() => { onNavigate('contact'); setMobileMenuOpen(false); }} label="Contact" active={currentPage === 'contact'} />

          <button
            onClick={() => {
              onContactClick();
              setMobileMenuOpen(false);
            }}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold shadow-lg mt-4"
          >
            Obtenir un Devis
          </button>
        </div>
      )}
    </nav>
  );
};

const NavButton = ({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) => (
  <button
    onClick={onClick}
    className={`text-sm font-medium transition-all duration-300 relative group py-2 ${active ? 'text-white' : 'text-slate-400 hover:text-white'}`}
  >
    {label}
    <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400 transform transition-transform duration-300 ${active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-50'}`}></span>
  </button>
);

const MobileNavLink = ({ onClick, label, active }: { onClick: () => void, label: string, active: boolean }) => (
  <button
    onClick={onClick}
    className={`text-2xl font-bold text-left ${active ? 'text-cyan-400' : 'text-slate-300'}`}
  >
    {label}
  </button>
);