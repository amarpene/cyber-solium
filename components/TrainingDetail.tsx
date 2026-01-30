import React, { useState } from 'react';
import {
    GraduationCap,
    ShieldCheck,
    BookOpen,
    AlertTriangle,
    CheckCircle2,
    Calendar,
    Clock,
    Users,
    ArrowRight,
    Package,
    ListChecks,
    Activity,
    CreditCard
} from 'lucide-react';
import { Page } from '../App';
import PaymentModal from './PaymentModal';

interface TrainingDetailProps {
    type: Page;
    onContactClick: (msg: string) => void;
}

const TRAINING_DATA: Record<string, any> = {
    'training-nis2': {
        title: 'NIS2 : mise en conformité opérationnelle',
        subtitle: 'Gouvernance, risques et contrôles',
        description:
            'Un parcours complet pour structurer votre conformité NIS2 : gouvernance, gestion des risques et mise en œuvre des mesures clés.',
        icon: <ShieldCheck className="w-16 h-16 text-cyan-400" />,
        color: 'cyan',
        heroImage:
            'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=1000',
        price: 390,
        duration: '90 min',
        level: 'Intermédiaire',
        format: 'E-learning + support PDF',
        audience: ['DSI / RSSI', 'Direction', 'Responsables conformité'],
        prerequisites: ['Bases sécurité SI', 'Connaissances RGPD'],
        modules: [
            'Panorama NIS2 & responsabilités dirigeant',
            'Gouvernance & documentation obligatoire',
            'Gestion des risques (EBIOS RM simplifié)',
            'Mesures techniques et organisationnelles',
            'Plan d’action & pilotage de conformité'
        ],
        deliverables: [
            'Checklist NIS2',
            'Modèles PSSI & politiques',
            'Plan d’action priorisé',
            'Attestation de suivi'
        ],
        benefits: ['Réduction des risques de non‑conformité', 'Feuille de route claire', 'Gains de temps pour l’audit'],
        cta: 'Accéder à la formation'
    },
    'training-rgpd': {
        title: 'RGPD : les essentiels pour l’entreprise',
        subtitle: 'Conformité et protection des données',
        description:
            'Comprendre les obligations RGPD, mettre en place les bons réflexes et structurer la conformité de votre organisation.',
        icon: <BookOpen className="w-16 h-16 text-emerald-400" />,
        color: 'emerald',
        heroImage:
            'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=1000',
        price: 260,
        duration: '60 min',
        level: 'Débutant',
        format: 'E-learning',
        audience: ['Managers', 'RH', 'Marketing', 'DSI'],
        prerequisites: ['Aucun'],
        modules: [
            'Principes RGPD & bases légales',
            'Registre des traitements',
            'Droits des personnes & procédures',
            'Sécurité des données',
            'Gestion des violations & notifications'
        ],
        deliverables: ['Modèle de registre', 'Checklist conformité', 'Guide opérationnel'],
        benefits: ['Réduction du risque juridique', 'Sensibilisation transversale', 'Conformité opérationnelle'],
        cta: 'Accéder à la formation'
    },
    'training-cyber': {
        title: 'Cybersécurité : bonnes pratiques',
        subtitle: 'Hygiène numérique et prévention',
        description:
            'Un module concret pour réduire les risques au quotidien : mots de passe, phishing, usages sûrs et bonnes pratiques.',
        icon: <GraduationCap className="w-16 h-16 text-purple-400" />,
        color: 'purple',
        heroImage:
            'https://images.unsplash.com/photo-1510511459019-5dda7724fd87?auto=format&fit=crop&q=80&w=1000',
        price: 190,
        duration: '45 min',
        level: 'Débutant',
        format: 'E-learning',
        audience: ['Tous collaborateurs'],
        prerequisites: ['Aucun'],
        modules: [
            'Phishing & ingénierie sociale',
            'Mots de passe & MFA',
            'Postes de travail & mobilité',
            'Partage de fichiers & données sensibles'
        ],
        deliverables: ['Quiz final', 'Attestation de sensibilisation'],
        benefits: ['Réduction des incidents humains', 'Culture sécurité', 'Conformité assurance'],
        cta: 'Accéder à la formation'
    },
    'training-incident': {
        title: 'Gestion des incidents de sécurité',
        subtitle: 'Détection, réponse et reprise',
        description:
            'Préparez vos équipes à réagir vite : scénarios types, communication, escalade et retour à la normale.',
        icon: <AlertTriangle className="w-16 h-16 text-orange-400" />,
        color: 'orange',
        heroImage:
            'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&q=80&w=1000',
        price: 420,
        duration: '75 min',
        level: 'Intermédiaire',
        format: 'E-learning + kit opérationnel',
        audience: ['DSI / RSSI', 'IT', 'Direction'],
        prerequisites: ['Notions sécurité'],
        modules: [
            'Détection & qualification',
            'Process d’escalade',
            'Communication & obligations',
            'Restauration & retour d’expérience'
        ],
        deliverables: ['Plan de réponse', 'Checklists incident', 'Kit communication'],
        benefits: ['Réduction du temps d’impact', 'Conformité notification', 'Maîtrise de crise'],
        cta: 'Accéder à la formation'
    }
};

export const TrainingDetail: React.FC<TrainingDetailProps> = ({ type, onContactClick }) => {
    const content = TRAINING_DATA[type];
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    if (!content) return <div>Formation non trouvée</div>;

    const colorClasses: Record<string, string> = {
        cyan: 'from-cyan-500 to-blue-600 text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
        emerald: 'from-emerald-500 to-teal-600 text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
        purple: 'from-purple-500 to-indigo-600 text-purple-400 border-purple-500/30 bg-purple-500/10',
        orange: 'from-orange-500 to-yellow-600 text-orange-400 border-orange-500/30 bg-orange-500/10'
    };

    const gradient = colorClasses[content.color].split(' ')[0] + ' ' + colorClasses[content.color].split(' ')[1];
    const textColor = colorClasses[content.color].split(' ')[2];
    const borderColor = colorClasses[content.color].split(' ')[3];
    const bgColor = colorClasses[content.color].split(' ')[4];

    return (
        <section className="min-h-screen py-16 relative">
            <div className="absolute top-0 left-0 w-full h-[70vh] z-0">
                <img src={content.heroImage} alt="formation" className="w-full h-full object-cover opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950 to-slate-950"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className={`inline-flex items-center space-x-2 rounded-full px-4 py-1.5 mb-6 border ${borderColor} ${bgColor}`}>
                        <Activity className={`w-4 h-4 ${textColor}`} />
                        <span className={`text-xs font-bold tracking-wide ${textColor}`}>{content.subtitle}</span>
                    </div>
                    <h1 className="text-4xl md:text-7xl font-bold mb-6 text-white leading-tight">{content.title}</h1>
                    <p className="text-xl text-slate-300 max-w-3xl leading-relaxed border-l-4 border-slate-700 pl-6">
                        {content.description}
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-12 mb-20">
                    <div className="lg:col-span-2 space-y-16">
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
                                <ListChecks className={`w-8 h-8 mr-3 ${textColor}`} />
                                Programme
                            </h2>
                            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-8 space-y-4">
                                {content.modules.map((module: string, idx: number) => (
                                    <div key={idx} className="flex items-start">
                                        <CheckCircle2 className={`w-5 h-5 mr-3 ${textColor} mt-0.5`} />
                                        <span className="text-slate-300 font-medium">{module}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
                                <Package className={`w-8 h-8 mr-3 ${textColor}`} />
                                Livrables et supports
                            </h2>
                            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {content.deliverables.map((item: string, idx: number) => (
                                        <div key={idx} className="flex items-center">
                                            <CheckCircle2 className={`w-5 h-5 mr-3 ${textColor}`} />
                                            <span className="text-slate-300 font-medium">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
                                <Users className={`w-8 h-8 mr-3 ${textColor}`} />
                                Public et prérequis
                            </h2>
                            <div className="grid sm:grid-cols-2 gap-6">
                                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
                                    <h3 className="text-white font-bold mb-3">Public</h3>
                                    <ul className="space-y-2">
                                        {content.audience.map((item: string, idx: number) => (
                                            <li key={idx} className="text-slate-300 text-sm flex items-center">
                                                <span className={`w-1.5 h-1.5 rounded-full ${textColor.replace('text', 'bg')} mr-2`}></span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
                                    <h3 className="text-white font-bold mb-3">Prérequis</h3>
                                    <ul className="space-y-2">
                                        {content.prerequisites.map((item: string, idx: number) => (
                                            <li key={idx} className="text-slate-300 text-sm flex items-center">
                                                <span className={`w-1.5 h-1.5 rounded-full ${textColor.replace('text', 'bg')} mr-2`}></span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className={`sticky top-32 p-8 rounded-3xl bg-gradient-to-br ${gradient} bg-opacity-5 border ${borderColor} backdrop-blur-sm`}>
                            <div className="w-16 h-16 bg-black/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md shadow-lg border border-white/5">
                                {content.icon}
                            </div>

                            <div className="space-y-4 mb-6">
                                <div className="flex items-center justify-between text-sm text-slate-300">
                                    <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> Durée</span>
                                    <span className="font-semibold text-white">{content.duration}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm text-slate-300">
                                    <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> Niveau</span>
                                    <span className="font-semibold text-white">{content.level}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm text-slate-300">
                                    <span className="flex items-center gap-2"><BookOpen className="w-4 h-4" /> Format</span>
                                    <span className="font-semibold text-white">{content.format}</span>
                                </div>
                            </div>

                            <div className="mb-6 p-4 bg-slate-900/70 rounded-xl border border-slate-800">
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-400 text-sm">Prix</span>
                                    <span className={`text-3xl font-black ${textColor}`}>{content.price}€</span>
                                </div>
                                <p className="text-xs text-slate-500 mt-2">Paiement fictif pour démo</p>
                            </div>

                            <button
                                onClick={() => setShowPaymentModal(true)}
                                className="w-full py-4 bg-white text-slate-900 font-bold rounded-xl hover:scale-105 transition-transform shadow-lg flex items-center justify-center group"
                            >
                                <CreditCard className="w-4 h-4 mr-2" />
                                {content.cta.toLowerCase()}
                                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>

                            <button
                                onClick={() => onContactClick(`Formation: ${content.title}`)}
                                className="w-full mt-3 py-3 bg-slate-900 text-white border border-slate-700 font-semibold rounded-xl hover:bg-slate-800 transition-all"
                            >
                                Demander un devis équipe
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {showPaymentModal && (
                <PaymentModal
                    trainingTitle={content.title}
                    trainingPrice={content.price}
                    onClose={() => setShowPaymentModal(false)}
                    onConfirm={() => {
                        setShowPaymentModal(false);
                        alert('Paiement fictif validé. Merci !');
                    }}
                />
            )}
        </section>
    );
};