import React from 'react';
import { ChevronRight, ShieldCheck } from 'lucide-react';


interface HeroProps {
  onCtaClick: () => void;
  onContactClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onCtaClick, onContactClick }) => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center lg:text-left grid lg:grid-cols-2 gap-12 items-center">

        <div>
          <div className="inline-flex items-center space-x-2 bg-slate-800/50 rounded-full px-3 py-1 mb-6 border border-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-medium text-emerald-400 uppercase tracking-wide">Experts NIS 2 & Sécurité Avancée</span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight">
            La Conformité <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Sans Compromis.
            </span>
          </h1>

          <p className="text-lg text-slate-400 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Protégez votre entreprise et répondez aux exigences de la directive NIS 2.
            Audit, intégration et maintenance par des experts certifiés.
          </p>

          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 justify-center lg:justify-start">
            <button
              onClick={onCtaClick}
              className="px-8 py-4 bg-white text-slate-900 rounded-lg font-bold hover:bg-cyan-50 transition-colors flex items-center group"
            >
              Tester mon éligibilité NIS 2
              <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={onContactClick}
              className="px-8 py-4 bg-slate-800 text-white border border-slate-700 rounded-lg font-semibold hover:bg-slate-700 transition-colors"
            >
              Parler à un expert
            </button>
          </div>

          <div className="mt-10 flex items-center justify-center lg:justify-start space-x-6 text-slate-500 text-sm">
            <div className="flex items-center"><ShieldCheck className="w-4 h-4 mr-2" /> Certifié ISO 27001 Lead</div>
            <div className="flex items-center"><ShieldCheck className="w-4 h-4 mr-2" /> Conformité RGPD</div>
          </div>
        </div>

        {/* Visual / Abstract Dashboard Representation */}
        <div className="relative hidden lg:block">
          <div className="relative rounded-xl bg-slate-900 border border-slate-800 p-2 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-xl pointer-events-none"></div>
            <div className="bg-slate-950 rounded-lg p-6 h-[400px] flex flex-col border border-slate-800">
              <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="text-xs text-slate-500 font-mono">NIS 2 COMPLIANCE DASHBOARD</div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-slate-900 p-4 rounded border border-slate-800">
                  <div className="text-slate-400 text-xs mb-1">Score de Sécurité</div>
                  <div className="text-2xl font-bold text-emerald-400">92/100</div>
                  <div className="w-full bg-slate-800 h-1 mt-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[92%]"></div>
                  </div>
                </div>
                <div className="bg-slate-900 p-4 rounded border border-slate-800">
                  <div className="text-slate-400 text-xs mb-1">Menaces Bloquées</div>
                  <div className="text-2xl font-bold text-cyan-400">1,420</div>
                  <div className="text-xs text-cyan-500/50 mt-1">+12% vs semaine dernière</div>
                </div>
              </div>

              <div className="flex-1 bg-slate-900 rounded border border-slate-800 p-4 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(transparent_95%,rgba(6,182,212,0.1)_95%)] bg-[length:20px_20px]"></div>
                <div className="space-y-2 relative z-10">
                  <div className="flex items-center justify-between text-xs py-2 border-b border-slate-800/50">
                    <span className="text-slate-300">Pare-feu périmétrique</span>
                    <span className="text-emerald-400">Actif ●</span>
                  </div>
                  <div className="flex items-center justify-between text-xs py-2 border-b border-slate-800/50">
                    <span className="text-slate-300">EDR Endpoints</span>
                    <span className="text-emerald-400">Actif ●</span>
                  </div>
                  <div className="flex items-center justify-between text-xs py-2 border-b border-slate-800/50">
                    <span className="text-slate-300">Plan de Reprise (PRA)</span>
                    <span className="text-yellow-400">Révision requise ●</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};