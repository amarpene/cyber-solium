import React from 'react';
import { Scale, Stethoscope, Calculator, ShieldCheck, FileKey, Server, ArrowRight } from 'lucide-react';

interface RegulatedSectorsProps {
  onContactClick: () => void;
}

export const RegulatedSectors: React.FC<RegulatedSectorsProps> = ({ onContactClick }) => {
  return (
    <section className="min-h-screen py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <span className="inline-block py-1 px-3 rounded-full bg-teal-500/10 text-teal-400 text-xs font-bold uppercase tracking-widest mb-6 border border-teal-500/20">
            Professions Réglementées
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white tracking-tight">
            Professions Réglementées :<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-500">Santé, Droit & Chiffre</span>
          </h1>
          <p className="text-slate-400 max-w-3xl mx-auto text-xl leading-relaxed">
            Avocats, Experts-Comptables et Professionnels de Santé manipulent les données les plus sensibles. Vos obligations sont strictes.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">

          {/* AVOCATS */}
          <div className="bg-slate-900/50 border border-slate-700 hover:border-red-500/50 rounded-2xl p-8 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-red-500/20 transition-all"></div>
            <div className="w-14 h-14 bg-slate-800 rounded-xl flex items-center justify-center mb-6 border border-slate-700 group-hover:border-red-500/50 transition-colors">
              <Scale className="w-7 h-7 text-red-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Avocats</h3>
            <p className="text-slate-400 text-sm mb-6 min-h-[80px]">
              Secret professionnel et confidentialité absolue. Le CNB recommande fortement le chiffrement des échanges et la sécurisation du Cloud.
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start text-sm text-slate-300">
                <ShieldCheck className="w-4 h-4 text-red-500 mr-2 mt-0.5" />
                <span>Protection RPVA & Clé Avocat</span>
              </li>
              <li className="flex items-start text-sm text-slate-300">
                <FileKey className="w-4 h-4 text-red-500 mr-2 mt-0.5" />
                <span>Chiffrement des dossiers clients</span>
              </li>
              <li className="flex items-start text-sm text-slate-300">
                <Server className="w-4 h-4 text-red-500 mr-2 mt-0.5" />
                <span>Messagerie sécurisée</span>
              </li>
            </ul>
            <button onClick={onContactClick} className="w-full py-3 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white rounded-lg font-bold transition-all text-sm">
              Sécuriser mon Cabinet
            </button>
          </div>

          {/* EXPERTS COMPTABLES */}
          <div className="bg-slate-900/50 border border-slate-700 hover:border-blue-500/50 rounded-2xl p-8 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-500/20 transition-all"></div>
            <div className="w-14 h-14 bg-slate-800 rounded-xl flex items-center justify-center mb-6 border border-slate-700 group-hover:border-blue-500/50 transition-colors">
              <Calculator className="w-7 h-7 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Experts-Comptables</h3>
            <p className="text-slate-400 text-sm mb-6 min-h-[80px]">
              La période fiscale est critique. Une attaque par ransomware à ce moment peut détruire votre cabinet. Le CSOEC impose des normes de sauvegarde.
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start text-sm text-slate-300">
                <ShieldCheck className="w-4 h-4 text-blue-500 mr-2 mt-0.5" />
                <span>Sécurisation JecDeclara / Impots</span>
              </li>
              <li className="flex items-start text-sm text-slate-300">
                <Server className="w-4 h-4 text-blue-500 mr-2 mt-0.5" />
                <span>Sauvegarde immuable (Anti-Crypto)</span>
              </li>
              <li className="flex items-start text-sm text-slate-300">
                <FileKey className="w-4 h-4 text-blue-500 mr-2 mt-0.5" />
                <span>Conformité RGPD Paie/Social</span>
              </li>
            </ul>
            <button onClick={onContactClick} className="w-full py-3 border border-blue-500/30 text-blue-400 hover:bg-blue-500 hover:text-white rounded-lg font-bold transition-all text-sm">
              Protéger mes données clients
            </button>
          </div>

          {/* SANTÉ */}
          <div className="bg-slate-900/50 border border-slate-700 hover:border-emerald-500/50 rounded-2xl p-8 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-emerald-500/20 transition-all"></div>
            <div className="w-14 h-14 bg-slate-800 rounded-xl flex items-center justify-center mb-6 border border-slate-700 group-hover:border-emerald-500/50 transition-colors">
              <Stethoscope className="w-7 h-7 text-emerald-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Santé & HDS</h3>
            <p className="text-slate-400 text-sm mb-6 min-h-[80px]">
              Cliniques, Labos, Médecins. Vos données patients valent de l'or sur le Darknet. La certification HDS et le Ségur du Numérique dictent vos infrastructures.
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start text-sm text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-500 mr-2 mt-0.5" />
                <span>Hébergement HDS obligatoire</span>
              </li>
              <li className="flex items-start text-sm text-slate-300">
                <Server className="w-4 h-4 text-emerald-500 mr-2 mt-0.5" />
                <span>Messagerie Santé Sécurisée (MSS)</span>
              </li>
              <li className="flex items-start text-sm text-slate-300">
                <FileKey className="w-4 h-4 text-emerald-500 mr-2 mt-0.5" />
                <span>Traçabilité des accès dossiers</span>
              </li>
            </ul>
            <button onClick={onContactClick} className="w-full py-3 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-white rounded-lg font-bold transition-all text-sm">
              Audit Conformité Santé
            </button>
          </div>

        </div>

        <div className="bg-slate-900 rounded-3xl p-8 md:p-12 border border-slate-800 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-teal-900/20 to-blue-900/20"></div>
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-white mb-4">Vous exercez une autre profession réglementée ?</h2>
            <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
              Huissiers (Commissaires de Justice), Architectes, Agents Immobiliers... <br />
              Si vous gérez des fonds tiers ou des données sensibles, vous êtes une cible.
            </p>
            <button
              onClick={onContactClick}
              className="inline-flex items-center px-8 py-3 bg-white text-slate-900 font-bold rounded-lg hover:bg-teal-50 transition-colors"
            >
              Consulter nos experts sectoriels
              <ArrowRight className="ml-2 w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};