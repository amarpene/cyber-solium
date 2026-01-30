import React, { useEffect, useState } from 'react';
import {
    ArrowRight,
    AlertTriangle,
    XCircle,
    RefreshCw,
    Shield,
    Lock,
    Server,
    FileText,
    Users,
    PieChart,
    Check,
    ShieldCheck,
    Briefcase,
    ArrowLeft,
    ClipboardList,
    Eye,
    Smartphone
} from 'lucide-react';
import logo from '../logo.png';
import { useAuth } from '../contexts/AuthContext';

interface Iso27001CalculatorProps {
    onContactRequest: (msg: string) => void;
}

const SECTORS_HIGH_CRITICALITY = [
    { name: 'Énergie', detail: 'Électricité, Gaz, Pétrole, Hydrogène', type: 'critical' },
    { name: 'Transports', detail: 'Aérien, Ferroviaire, Maritime, Routier', type: 'critical' },
    { name: 'Banque & Finance', detail: 'Banques, Marchés financiers', type: 'critical' },
    { name: 'Santé', detail: 'Hôpitaux, Labos, Pharma', type: 'critical' },
    { name: 'Eau', detail: 'Potable et Eaux usées', type: 'critical' },
    { name: 'Numérique', detail: 'Cloud, Data Center, Télécoms', type: 'critical' },
    { name: 'Services TIC', detail: 'Infogérance (MSP), Sécurité gérée', type: 'critical' },
    { name: 'Administration', detail: 'Publique, Centrale, Régionale', type: 'critical' },
    { name: 'Espace', detail: 'Opérateurs infrastructures sol', type: 'critical' }
];

const SECTORS_OTHER_CRITICAL = [
    { name: 'Services Postaux', detail: 'Courrier et expédition', type: 'important' },
    { name: 'Déchets', detail: 'Gestion et traitement', type: 'important' },
    { name: 'Chimie', detail: 'Fabrication et distribution', type: 'important' },
    { name: 'Agroalimentaire', detail: 'Production et transformation', type: 'important' },
    { name: 'Industrie', detail: 'Fabrication (Médical, Machines, Véhicules...)', type: 'important' },
    { name: 'Fournisseurs Web', detail: 'Places de marché, Moteurs de recherche', type: 'important' },
    { name: 'Recherche', detail: 'Instituts et organismes', type: 'important' }
];

const ISO_MEASURES = [
    { id: 'isms', type: 'governance', label: 'SMSI & politique de sécurité', desc: 'Périmètre, objectifs et politique formalisés.', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'risk', type: 'governance', label: 'Analyse de risques', desc: 'Méthodo, registre des risques, traitement documenté.', icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'roles', type: 'governance', label: 'Rôles & responsabilités', desc: 'Responsabilités SSI définies et communiquées.', icon: <Users className="w-4 h-4" /> },
    { id: 'docs', type: 'governance', label: 'Documentation & procédures', desc: 'Procédures écrites, versionnées, accessibles.', icon: <FileText className="w-4 h-4" /> },
    { id: 'audit', type: 'governance', label: 'Audits internes', desc: 'Plan d’audit et revues de direction.', icon: <ClipboardList className="w-4 h-4" /> },
    { id: 'improve', type: 'governance', label: 'Amélioration continue', desc: 'Actions correctives et suivi des KPI.', icon: <RefreshCw className="w-4 h-4" /> },

    { id: 'asset', type: 'ops', label: 'Gestion des actifs', desc: 'Inventaire et classification des actifs.', icon: <Server className="w-4 h-4" /> },
    { id: 'access', type: 'ops', label: 'Contrôle d’accès', desc: 'MFA, moindre privilège, revues périodiques.', icon: <Lock className="w-4 h-4" /> },
    { id: 'logging', type: 'ops', label: 'Journalisation & surveillance', desc: 'Logs centralisés, alertes, corrélation.', icon: <Eye className="w-4 h-4" /> },
    { id: 'incident', type: 'ops', label: 'Gestion des incidents', desc: 'Procédures, escalade, post-mortem.', icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'backup', type: 'ops', label: 'Sauvegardes & reprise', desc: 'PRA/PCA et tests de restauration.', icon: <Server className="w-4 h-4" /> },
    { id: 'supplier', type: 'ops', label: 'Fournisseurs & sous-traitants', desc: 'Clauses sécurité et évaluations.', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'awareness', type: 'ops', label: 'Sensibilisation', desc: 'Formations et campagnes régulières.', icon: <Users className="w-4 h-4" /> },
    { id: 'crypto', type: 'ops', label: 'Protection des données', desc: 'Chiffrement, durcissement, MDM.', icon: <Smartphone className="w-4 h-4" /> }
];

const TOTAL_MEASURES = ISO_MEASURES.length;

type Step = 'start' | 'sector' | 'size' | 'readiness' | 'result';

export const Iso27001Calculator: React.FC<Iso27001CalculatorProps> = ({ onContactRequest }) => {
    const { token, isAuthenticated } = useAuth();
    const [step, setStep] = useState<Step>('start');
    const [data, setData] = useState({
        sectorName: '',
        sectorType: '',
        size: '',
        readinessScore: 0,
        missingItems: [] as string[]
    });
    const [auditSaved, setAuditSaved] = useState(false);

    const handleStart = () => setStep('sector');

    const handleSector = (sector: { name: string; type: string }) => {
        setData(prev => ({ ...prev, sectorName: sector.name, sectorType: sector.type }));
        setStep('size');
    };

    const handleSize = (size: string) => {
        setData(prev => ({ ...prev, size }));
        setStep('readiness');
    };

    const handleReadiness = (score: number, missing: string[]) => {
        setData(prev => ({ ...prev, readinessScore: score, missingItems: missing }));
        setStep('result');
    };

    const saveAudit = async () => {
        if (!isAuthenticated || !token || auditSaved) return;

        try {
            const response = await fetch('/api/audit/save', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    sectorName: data.sectorName,
                    sectorType: data.sectorType,
                    size: data.size,
                    readinessScore: data.readinessScore,
                    missingItems: data.missingItems
                })
            });

            if (response.ok) {
                setAuditSaved(true);
                window.dispatchEvent(new Event('auditCompleted'));
            }
        } catch (error) {
            console.error('Erreur sauvegarde audit ISO:', error);
        }
    };

    useEffect(() => {
        if (step === 'result' && isAuthenticated && !auditSaved) {
            saveAudit();
        }
    }, [step, isAuthenticated]);

    const reset = () => {
        setStep('start');
        setData({ sectorName: '', sectorType: '', size: '', readinessScore: 0, missingItems: [] });
        setAuditSaved(false);
    };

    const scorePercent = Math.round((data.readinessScore / TOTAL_MEASURES) * 100);

    const getResult = () => {
        if (scorePercent >= 80) return {
            status: 'Certification Prête',
            color: 'text-emerald-400',
            bg: 'bg-emerald-900/20',
            msg: 'Votre SMSI est solide. Une préparation finale peut lancer la certification ISO 27001.'
        };
        if (scorePercent >= 60) return {
            status: 'À Renforcer',
            color: 'text-yellow-400',
            bg: 'bg-yellow-900/20',
            msg: 'Votre base est correcte, mais des écarts restent à combler avant la certification.'
        };
        return {
            status: 'Prioritaire',
            color: 'text-red-400',
            bg: 'bg-red-900/20',
            msg: 'Votre organisation doit structurer le SMSI et sécuriser les contrôles clés avant toute certification.'
        };
    };

    const result = getResult();

    const handleBack = () => {
        if (step === 'result') setStep('readiness');
        else if (step === 'readiness') setStep('size');
        else if (step === 'size') setStep('sector');
        else if (step === 'sector') setStep('start');
    };

    return (
        <div className="glass-panel rounded-2xl border border-cyan-900/30 shadow-2xl relative overflow-hidden transition-all duration-500 flex flex-col min-h-[750px]">
            {step !== 'start' && (
                <button
                    onClick={handleBack}
                    className="absolute top-4 left-4 z-30 flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors bg-slate-900/80 backdrop-blur px-3 py-2 rounded-lg"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-sm font-medium">Retour</span>
                </button>
            )}

            <div className="absolute top-0 left-0 h-1 bg-slate-800 w-full z-20">
                <div
                    className="h-full bg-cyan-500 transition-all duration-500"
                    style={{ width: step === 'start' ? '0%' : step === 'sector' ? '25%' : step === 'size' ? '50%' : step === 'readiness' ? '75%' : '100%' }}
                ></div>
            </div>

            <div className="p-6 md:p-10 flex-grow flex flex-col">
                {step === 'start' && (
                    <div className="text-center py-8 my-auto animate-in fade-in zoom-in duration-500">
                        <div className="w-24 h-24 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
                            <img src={logo} alt="Cyber Solium" className="w-16 h-16 object-contain" />
                        </div>
                        <h3 className="text-3xl font-bold mb-4">Diagnostic de Sécurité & Conformité</h3>
                        <p className="text-slate-400 mb-8 max-w-lg mx-auto text-lg leading-relaxed">
                            Votre entreprise est-elle protégée ? <br />
                            <span className="text-white font-medium">Vérifiez vos obligations légales et votre niveau de sécurité réel en 2 minutes.</span>
                        </p>
                        <button onClick={handleStart} className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-10 py-4 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg shadow-cyan-900/50 text-lg">
                            Démarrer le test
                        </button>
                    </div>
                )}

                {step === 'sector' && (
                    <div className="animate-in fade-in slide-in-from-right duration-500 flex flex-col h-full">
                        <h3 className="text-2xl font-bold mb-2 text-center md:text-left">Votre Secteur d'Activité</h3>
                        <p className="text-slate-400 text-sm mb-6 text-center md:text-left">Sélectionnez votre domaine principal.</p>

                        <div className="overflow-y-auto pr-2 custom-scrollbar flex-grow -mx-2 px-2 pb-20">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div>
                                    <div className="flex items-center space-x-2 mb-3 sticky top-0 bg-slate-900/95 backdrop-blur py-2 z-10 border-b border-red-500/30">
                                        <AlertTriangle className="text-red-400 w-5 h-5" />
                                        <h4 className="font-semibold text-red-100">Secteurs Hautement Critiques</h4>
                                    </div>
                                    <div className="space-y-2">
                                        {SECTORS_HIGH_CRITICALITY.map((s, i) => (
                                            <SectorButton sector={s} onClick={() => handleSector(s)} />
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center space-x-2 mb-3 sticky top-0 bg-slate-900/95 backdrop-blur py-2 z-10 border-b border-orange-500/30">
                                        <Briefcase className="text-orange-400 w-5 h-5" />
                                        <h4 className="font-semibold text-orange-100">Autres Secteurs Régulés</h4>
                                    </div>
                                    <div className="space-y-2">
                                        {SECTORS_OTHER_CRITICAL.map((s, i) => (
                                            <SectorButton sector={s} onClick={() => handleSector(s)} />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-4 border-t border-slate-800">
                                <button
                                    onClick={() => handleSector({ name: 'Autre', type: 'none' })}
                                    className="w-full text-center p-3 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-sm"
                                >
                                    Mon activité n'est pas dans la liste
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {step === 'size' && (
                    <div className="animate-in fade-in slide-in-from-right duration-500 my-auto">
                        <h3 className="text-2xl font-bold mb-2">Taille de l'entreprise</h3>
                        <p className="text-slate-400 text-sm mb-8">Ce critère aide à adapter la charge de conformité ISO 27001.</p>

                        <div className="space-y-4 max-w-xl mx-auto">
                            <OptionButton
                                label="Grande Entreprise"
                                sub="≥ 250 employés OU Chiffre d'Affaires > 50M€"
                                onClick={() => handleSize('large')}
                            />
                            <OptionButton
                                label="Moyenne Entreprise"
                                sub="50 à 249 employés"
                                onClick={() => handleSize('medium')}
                            />
                            <OptionButton
                                label="Petite / Micro Entreprise"
                                sub="Moins de 50 employés"
                                onClick={() => handleSize('small')}
                            />
                        </div>
                    </div>
                )}

                {step === 'readiness' && (
                    <div className="my-auto w-full h-full flex flex-col">
                        <ReadinessCheck onFinish={handleReadiness} />
                    </div>
                )}

                {step === 'result' && (
                    <div className="animate-in zoom-in duration-500 text-center my-auto w-full">
                        <div className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold mb-6 ${result.bg} ${result.color} border border-current uppercase tracking-wider`}>
                            {result.status}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 items-center">
                            <div className="flex flex-col items-center justify-center p-6 bg-slate-900/50 rounded-2xl border border-slate-700 relative">
                                <div className="relative w-40 h-40 flex items-center justify-center">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-slate-800" />
                                        <circle
                                            cx="80" cy="80" r="70"
                                            stroke="currentColor"
                                            strokeWidth="10"
                                            fill="transparent"
                                            strokeDasharray={440}
                                            strokeDashoffset={440 - (440 * scorePercent) / 100}
                                            className={`${scorePercent < 50 ? 'text-red-500' : scorePercent < 80 ? 'text-yellow-500' : 'text-emerald-500'} transition-all duration-1000 ease-out`}
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-4xl font-bold text-white">{scorePercent}%</span>
                                        <span className="text-xs text-slate-400 uppercase">Préparation</span>
                                    </div>
                                </div>
                                <div className="mt-4 text-center">
                                    <p className="text-slate-300 font-medium">Score: {data.readinessScore}/{TOTAL_MEASURES}</p>
                                    <p className="text-xs text-slate-500 mt-1">Maturité ISO 27001</p>
                                </div>
                            </div>

                            <div className="text-left space-y-4">
                                <h3 className="text-2xl font-bold text-white mb-2">Verdict Expert</h3>
                                <p className="text-slate-300 text-sm leading-relaxed mb-4 border-l-2 border-slate-600 pl-4">
                                    {result.msg}
                                </p>

                                {data.readinessScore < TOTAL_MEASURES && (
                                    <div className="bg-slate-800/50 rounded-lg p-4 border border-cyan-500/30">
                                        <p className="text-xs font-bold text-cyan-400 uppercase mb-2">Points à prioriser</p>
                                        <ul className="text-sm text-slate-300 space-y-1">
                                            {data.missingItems.slice(0, 3).map((item, idx) => (
                                                <li key={idx} className="flex items-center"><XCircle className="w-3 h-3 text-red-400 mr-2 shrink-0" /> {item}</li>
                                            ))}
                                            {data.missingItems.length > 3 && <li className="text-xs text-slate-500 italic pl-5">...et {data.missingItems.length - 3} autres points.</li>}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                            <button
                                onClick={() => onContactRequest(`Audit ISO 27001. Score: ${data.readinessScore}/${TOTAL_MEASURES} (${scorePercent}%). Manquants: ${data.missingItems.join(', ')}`)}
                                className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-cyan-900/50 transition-all flex items-center justify-center group text-lg"
                            >
                                Exporter mon rapport
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button
                                onClick={reset}
                                className="text-slate-400 hover:text-white px-6 py-4 font-medium transition-colors"
                            >
                                Recommencer
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const SectorButton = ({ sector, onClick }: { sector: any; onClick: () => void }) => (
    <button
        onClick={onClick}
        className="w-full text-left p-3 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-cyan-500 hover:bg-slate-800 transition-all group relative overflow-hidden"
    >
        <div className="relative z-10">
            <div className="font-semibold text-slate-200 group-hover:text-cyan-400 text-sm">{sector.name}</div>
            <div className="text-xs text-slate-500 mt-0.5 truncate">{sector.detail}</div>
        </div>
        <div className="absolute left-0 top-0 h-full w-1 bg-transparent group-hover:bg-cyan-500 transition-colors"></div>
    </button>
);

const OptionButton = ({ label, sub, onClick }: { label: string; sub?: string; onClick: () => void }) => (
    <button
        onClick={onClick}
        className="w-full text-left p-5 rounded-xl bg-slate-800 border border-slate-700 hover:border-cyan-500 hover:bg-slate-800/80 transition-all group shadow-lg"
    >
        <div className="font-bold text-lg text-white group-hover:text-cyan-400 transition-colors">{label}</div>
        {sub && <div className="text-sm text-slate-400 mt-1">{sub}</div>}
    </button>
);

const ReadinessCheck = ({ onFinish }: { onFinish: (score: number, missing: string[]) => void }) => {
    const [checked, setChecked] = useState<Set<string>>(new Set());

    const toggle = (id: string) => {
        const newChecked = new Set(checked);
        if (newChecked.has(id)) newChecked.delete(id);
        else newChecked.add(id);
        setChecked(newChecked);
    };

    const currentScore = checked.size;

    const handleFinish = () => {
        const missing = ISO_MEASURES.filter(m => !checked.has(m.id)).map(m => m.label);
        onFinish(currentScore, missing);
    };

    const governanceMeasures = ISO_MEASURES.filter(m => m.type === 'governance');
    const opsMeasures = ISO_MEASURES.filter(m => m.type === 'ops');

    return (
        <div className="animate-in fade-in slide-in-from-right duration-500 w-full h-full flex flex-col">
            <div className="text-center mb-4 flex-shrink-0">
                <h3 className="text-xl font-bold">Audit ISO 27001 (14 points)</h3>
                <p className="text-slate-400 text-sm">Cochez UNIQUEMENT les mesures qui sont <span className="text-white font-semibold">déjà en place et fonctionnelles</span>.</p>
            </div>

            <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar -mx-2 px-2 mb-4">
                <div className="mb-6">
                    <div className="flex items-center space-x-2 mb-3 border-b border-blue-500/30 pb-1">
                        <ShieldCheck className="w-4 h-4 text-blue-400" />
                        <h4 className="text-sm font-bold text-blue-100 uppercase tracking-wide">1. Gouvernance & SMSI</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {governanceMeasures.map((item) => (
                            <MeasureItem item={item} checked={checked.has(item.id)} onToggle={() => toggle(item.id)} />
                        ))}
                    </div>
                </div>

                <div>
                    <div className="flex items-center space-x-2 mb-3 border-b border-cyan-500/30 pb-1">
                        <Shield className="w-4 h-4 text-cyan-400" />
                        <h4 className="text-sm font-bold text-cyan-100 uppercase tracking-wide">2. Sécurité opérationnelle</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {opsMeasures.map((item) => (
                            <MeasureItem item={item} checked={checked.has(item.id)} onToggle={() => toggle(item.id)} />
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex-shrink-0 pt-4 border-t border-slate-800 flex flex-col items-center">
                <div className="mb-4 flex items-center space-x-3">
                    <div className="text-3xl font-bold text-white">{currentScore} <span className="text-lg text-slate-500 font-normal">/ {TOTAL_MEASURES}</span></div>
                    <div className="h-8 w-px bg-slate-700"></div>
                    <div className="text-xs text-slate-400 max-w-[150px] leading-tight">Mesures validées</div>
                </div>
                <button
                    onClick={handleFinish}
                    className="w-full max-w-md bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-cyan-900/30 flex items-center justify-center"
                >
                    <PieChart className="w-5 h-5 mr-2" />
                    Calculer mon Score
                </button>
            </div>
        </div>
    );
};

const MeasureItem = ({ item, checked, onToggle }: { item: any; checked: boolean; onToggle: () => void }) => (
    <label className={`flex items-start p-3 rounded-xl cursor-pointer border transition-all ${checked ? 'bg-cyan-900/20 border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.1)]' : 'bg-slate-800/40 border-slate-700/50 hover:border-slate-600 hover:bg-slate-800'}`}>
        <div className={`mt-1 shrink-0 w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${checked ? 'bg-cyan-500 border-cyan-500' : 'border-slate-600 bg-slate-900'}`}>
            {checked && <Check className="w-4 h-4 text-white" />}
        </div>
        <div className="ml-3">
            <div className="flex items-center space-x-2 mb-0.5">
                <span className={`text-sm font-bold ${checked ? 'text-white' : 'text-slate-300'}`}>{item.label}</span>
            </div>
            <span className="text-xs text-slate-500 leading-tight block">{item.desc}</span>
        </div>
        <input type="checkbox" className="hidden" checked={checked} onChange={onToggle} />
    </label>
);