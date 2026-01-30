import React from 'react';
import { GraduationCap, ShieldCheck, BookOpen, AlertTriangle, ArrowRight } from 'lucide-react';
import { Page } from '../App';

interface TrainingsProps {
    onNavigate?: (page: Page) => void;
}

export const Trainings: React.FC<TrainingsProps> = ({ onNavigate }) => {
    const trainings = [
        {
            page: 'training-nis2' as Page,
            title: 'NIS2 : Mise en conformité opérationnelle',
            color: 'cyan',
            icon: <ShieldCheck className="w-6 h-6" />,
            features: ['Gouvernance & obligations', 'EBIOS RM simplifié', 'Plan d’action', 'Checklist audit'],
            description: 'Structurez votre conformité et sécurisez votre gouvernance NIS2.',
            price: 390
        },
        {
            page: 'training-rgpd' as Page,
            title: 'RGPD : Les essentiels',
            color: 'emerald',
            icon: <BookOpen className="w-6 h-6" />,
            features: ['Registre des traitements', 'Droits des personnes', 'Mesures de sécurité', 'Violations & notifications'],
            description: 'Comprendre le RGPD et mettre en place les bonnes pratiques.',
            price: 260
        },
        {
            page: 'training-cyber' as Page,
            title: 'Cybersécurité : Bonnes pratiques',
            color: 'purple',
            icon: <GraduationCap className="w-6 h-6" />,
            features: ['Phishing & arnaques', 'Mots de passe & MFA', 'Sécurité mobilité', 'Données sensibles'],
            description: 'Renforcez la culture sécurité de vos équipes.',
            price: 190
        },
        {
            page: 'training-incident' as Page,
            title: 'Gestion des incidents',
            color: 'orange',
            icon: <AlertTriangle className="w-6 h-6" />,
            features: ['Détection & qualification', 'Escalade', 'Communication', 'Retour d’expérience'],
            description: 'Préparez vos équipes à gérer un incident majeur.',
            price: 420
        }
    ];

    return (
        <section className="min-h-screen py-24 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="text-center mb-16 animate-in fade-in slide-in-from-top-10 duration-700">
                    <span className="inline-block py-1 px-3 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold tracking-widest mb-6 border border-cyan-500/20">
                        Catalogue de formations
                    </span>
                    <h1 className="text-5xl md:text-7xl font-bold mb-8 text-white tracking-tight">
                        Nos formations <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">professionnelles</span>
                    </h1>
                    <p className="text-slate-400 max-w-3xl mx-auto text-xl leading-relaxed">
                        Cliquez sur une formation pour consulter le programme, les livrables et le tarif.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {trainings.map(training => (
                        <TrainingCard
                            key={training.page}
                            onClick={() => onNavigate?.(training.page)}
                            icon={training.icon}
                            title={training.title}
                            color={training.color}
                            features={training.features}
                            description={training.description}
                            price={training.price}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

const TrainingCard = ({ icon, title, features, description, color, onClick, price }: any) => {
    const colorClasses: any = {
        cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20 group-hover:border-cyan-500/50',
        emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 group-hover:border-emerald-500/50',
        purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20 group-hover:border-purple-500/50',
        orange: 'text-orange-400 bg-orange-500/10 border-orange-500/20 group-hover:border-orange-500/50'
    };

    return (
        <div
            onClick={onClick}
            className={`rounded-2xl p-6 border bg-slate-900/50 backdrop-blur-sm transition-all duration-300 group hover:-translate-y-2 cursor-pointer ${colorClasses[color].split('group')[0]} border-slate-800 hover:border-opacity-100 relative overflow-hidden flex flex-col`}
        >
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

            <div className="mt-5 text-sm font-bold text-slate-300">
                Tarif : <span className={colorClasses[color].split(' ')[0]}>{price}€</span>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800 group-hover:border-white/10 flex items-center text-sm font-bold opacity-60 group-hover:opacity-100 transition-all">
                <span className={colorClasses[color].split(' ')[0]}>Voir la formation</span>
                <ArrowRight className={`w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform ${colorClasses[color].split(' ')[0]}`} />
            </div>
        </div>
    );
};
