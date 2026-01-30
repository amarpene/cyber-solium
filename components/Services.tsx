import React from 'react';
import { Shield, Monitor, FileText, Server, ArrowRight } from 'lucide-react';
import { Page } from '../App';

interface ServicesProps {
  onContactClick: () => void;
  onNavigate: (page: Page) => void;
}

export const Services: React.FC<ServicesProps> = ({ onContactClick, onNavigate }) => {
  return (
    <section className="min-h-screen py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="text-center mb-20 animate-in fade-in slide-in-from-top-10 duration-700">
          <span className="inline-block py-1 px-3 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-6 border border-indigo-500/20">
            Offres DSI / RSSI
          </span>
          <h1 className="text-5xl md:text-7xl font-bold mb-8 text-white tracking-tight">
            Expertise <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">Ciblée</span>
          </h1>
          <p className="text-slate-400 max-w-3xl mx-auto text-xl leading-relaxed">
            Des offres conçues pour les responsables IT : gouvernance, protection, audits et résilience.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          <ServiceCard
            onClick={() => onNavigate('service-compliance')}
            icon={<FileText className="w-6 h-6" />}
            title="Gouvernance & Conformité"
            color="cyan"
            features={["Audit de maturité", "PSSI & politiques", "Gestion des risques", "Plan d'action"]}
            description="Pilotez votre conformité NIS2/RGPD et structurez votre gouvernance sécurité."
          />

          <ServiceCard
            onClick={() => onNavigate('service-soc')}
            icon={<Shield className="w-6 h-6" />}
            title="Protection SOC & EDR"
            color="emerald"
            features={["EDR/XDR managé", "Surveillance 24/7", "Détection & réponse", "Threat hunting"]}
            description="Surveillance active et remédiation pour réduire le risque opérationnel."
          />

          <ServiceCard
            onClick={() => onNavigate('service-pentest')}
            icon={<Monitor className="w-6 h-6" />}
            title="Pentest & Audit Technique"
            color="red"
            features={["Tests d'intrusion", "Audit AD", "Scan vulnérabilités", "Audit applicatif"]}
            description="Identifiez les failles critiques avant les attaquants."
          />

          <ServiceCard
            onClick={() => onNavigate('service-infra')}
            icon={<Server className="w-6 h-6" />}
            title="Résilience & Continuité"
            color="orange"
            features={["Sauvegardes immuables", "PRA/PCA", "Hardening", "Tests de restauration"]}
            description="Assurez la continuité d'activité et la reprise après incident."
          />

        </div>

        <div className="mt-20 text-center">
          <button onClick={onContactClick} className="px-10 py-4 bg-white text-slate-900 text-lg font-bold rounded-xl shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-105 transition-transform">
            Demander un devis sur mesure
          </button>
        </div>

      </div>
    </section>
  );
};

const ServiceCard = ({ icon, title, features, description, color, onClick }: any) => {
  const colorClasses: any = {
    cyan: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20 group-hover:border-cyan-500/50",
    emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20 group-hover:border-emerald-500/50",
    purple: "text-purple-400 bg-purple-500/10 border-purple-500/20 group-hover:border-purple-500/50",
    red: "text-red-400 bg-red-500/10 border-red-500/20 group-hover:border-red-500/50",
    orange: "text-orange-400 bg-orange-500/10 border-orange-500/20 group-hover:border-orange-500/50",
    teal: "text-teal-400 bg-teal-500/10 border-teal-500/20 group-hover:border-teal-500/50",
    yellow: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20 group-hover:border-yellow-500/50",
    blue: "text-blue-400 bg-blue-500/10 border-blue-500/20 group-hover:border-blue-500/50",
  };

  return (
    <div
      onClick={onClick}
      className={`rounded-2xl p-6 border bg-slate-900/50 backdrop-blur-sm transition-all duration-300 group hover:-translate-y-2 cursor-pointer ${colorClasses[color].split('group')[0]} border-slate-800 hover:border-opacity-100 relative overflow-hidden flex flex-col`}
    >
      {/* Hover gradient effect */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br from-transparent to-${color}-500`}></div>

      <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-6 ${colorClasses[color]} border relative z-10`}>
        {icon}
      </div>

      <div className="flex justify-between items-start mb-3 relative z-10">
        <h3 className="text-xl font-bold text-white group-hover:text-white transition-colors">{title}</h3>
      </div>

      <p className="text-slate-400 text-sm mb-6 leading-relaxed flex-grow relative z-10 group-hover:text-slate-300 transition-colors">
        {description}
      </p>
      <ul className="space-y-2 relative z-10 mt-auto">
        {features.map((f: string, i: number) => (
          <li key={i} className="text-xs text-slate-400 group-hover:text-slate-200 transition-colors flex items-start">
            <span className={`w-1.5 h-1.5 rounded-full mt-1.5 mr-2 flex-shrink-0 ${colorClasses[color].split(' ')[0].replace('text', 'bg')}`}></span>
            {f}
          </li>
        ))}
      </ul>

      <div className="mt-6 pt-4 border-t border-slate-800 group-hover:border-white/10 flex items-center text-sm font-bold opacity-60 group-hover:opacity-100 transition-all">
        <span className={colorClasses[color].split(' ')[0]}>Découvrir l'offre</span>
        <ArrowRight className={`w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform ${colorClasses[color].split(' ')[0]}`} />
      </div>
    </div>
  );
};