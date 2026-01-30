import React from 'react';
import { Hero } from './Hero';
import { ShieldCheck, FileText, Server, ArrowRight, Brain, BookOpen } from 'lucide-react';
import { Page } from '../App';

interface HomeProps {
  onNavigate: (page: Page) => void;
  onContactRequest: (msg: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate, onContactRequest }) => {
  return (
    <>
      {/* Introduction NIS2 & ISO27001 */}
      <section className="py-16 bg-slate-950/80">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-10 text-white">Comprendre NIS2 et ISO 27001</h1>
          <div className="grid md:grid-cols-2 gap-8 text-left">
            <div className="rounded-2xl p-8 border bg-cyan-500/10 border-cyan-500/20 shadow-lg">
              <h2 className="text-2xl font-semibold text-cyan-400 mb-2">NIS2</h2>
              <p className="text-slate-300 mb-0">La directive NIS2 est la nouvelle réglementation européenne qui impose des exigences strictes en cybersécurité à de nombreux secteurs. Elle vise à renforcer la résilience des entreprises face aux cybermenaces et à protéger les infrastructures critiques.</p>
            </div>
            <div className="rounded-2xl p-8 border bg-blue-500/10 border-blue-500/20 shadow-lg">
              <h2 className="text-2xl font-semibold text-blue-400 mb-2">ISO 27001</h2>
              <p className="text-slate-300 mb-0">La norme ISO 27001 définit les meilleures pratiques pour la gestion de la sécurité de l'information. Elle permet aux organisations de structurer leur gouvernance, d'identifier les risques et de mettre en place des contrôles adaptés.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tests/Audits NIS2 & ISO27001 */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="rounded-2xl p-8 border bg-emerald-500/10 border-emerald-500/20 shadow-lg mb-10">
            <h2 className="text-3xl font-bold mb-4 text-emerald-400">Testez votre conformité</h2>
            <p className="text-slate-300 mb-8">Évaluez gratuitement votre niveau de conformité NIS2 ou ISO 27001 en quelques minutes et recevez un plan d'action personnalisé.</p>
            <div className="flex flex-col md:flex-row gap-6 justify-center">
              <button onClick={() => onNavigate('nis2')} className="px-8 py-4 bg-cyan-600 text-white rounded-lg font-bold hover:bg-cyan-500 transition-colors">Audit NIS2</button>
              <button onClick={() => onNavigate('iso27001')} className="px-8 py-4 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-500 transition-colors">Audit ISO 27001</button>
            </div>
          </div>
        </div>
      </section>

      {/* Formations */}
      <section className="py-16 bg-slate-900/60">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="rounded-2xl p-8 border bg-purple-500/10 border-purple-500/20 shadow-lg mb-10">
            <h2 className="text-3xl font-bold mb-4 text-purple-400">Nos formations en cybersécurité</h2>
            <p className="text-slate-300 mb-8">Découvrez nos modules de formation pour sensibiliser vos équipes et renforcer vos compétences en conformité et sécurité informatique.</p>
            <button onClick={() => onNavigate('trainings')} className="px-8 py-4 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-500 transition-colors">Voir les formations</button>
          </div>
        </div>
      </section>

      {/* Services (teaser) */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="rounded-2xl p-8 border bg-orange-500/10 border-orange-500/20 shadow-lg mb-10">
            <h2 className="text-3xl font-bold mb-4 text-orange-400">Des solutions concrètes pour votre sécurité</h2>
            <p className="text-slate-300 mb-8">Audit, gouvernance, protection, résilience : découvrez nos services pour accompagner votre conformité et votre sécurité opérationnelle.</p>
            <button onClick={() => onNavigate('services')} className="px-8 py-4 bg-slate-800 text-white rounded-lg font-bold hover:bg-slate-700 transition-colors">Voir les services</button>
          </div>
        </div>
      </section>

      {/* CTA Bar */}
      <div className="mt-20 p-10 rounded-3xl bg-gradient-to-r from-blue-900/40 to-cyan-900/40 border border-cyan-500/20 text-center relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-white mb-4">Prêt à sécuriser votre avenir ?</h2>
          <button
            onClick={() => onContactRequest('Demande depuis Accueil')}
            className="px-8 py-3 bg-white text-slate-900 font-bold rounded-lg hover:bg-cyan-50 transition-colors shadow-lg shadow-white/10"
          >
            Parler à un expert
          </button>
        </div>
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-cyan-500/20 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-blue-500/20 blur-3xl rounded-full"></div>
      </div>
    </>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-cyan-500/30 transition-all duration-300 hover:transform hover:-translate-y-2 group shadow-xl">
    <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300 bg-slate-800/50 w-20 h-20 rounded-2xl flex items-center justify-center">{icon}</div>
    <h3 className="text-xl font-bold mb-4 text-white group-hover:text-cyan-400 transition-colors">{title}</h3>
    <p className="text-slate-400 leading-relaxed text-sm">
      {description}
    </p>
  </div>
);