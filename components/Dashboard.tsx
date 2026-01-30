import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Page } from '../App';
import {
    Building, Shield, BookOpen, FileText,
    Award, Clock, Activity, ChevronRight, Download,
    AlertOctagon
} from 'lucide-react';

interface DashboardStats {
    auditsCount: number;
    trainingsInProgress: number;
    trainingsCompleted: number;
    lastAudit: any;
}

interface DashboardProps {
    onNavigate?: (page: Page) => void;
    onContactClick?: (msg?: string) => void;
    type?: 'nis2' | 'iso27001';
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate, onContactClick, type = 'nis2' }) => {
    const { user, token } = useAuth();
    const [stats, setStats] = useState<DashboardStats>({
        auditsCount: 0,
        trainingsInProgress: 0,
        trainingsCompleted: 0,
        lastAudit: null
    });
    const [auditHistory, setAuditHistory] = useState<any[]>([]);
    const [trainingProgress, setTrainingProgress] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Calcul du score de conformité et du niveau de risque (version sobre)
    const getComplianceLevel = () => {
        if (!stats.lastAudit) return null;
        const scorePercent = Math.round((stats.lastAudit.readiness_score / 16) * 100);

        if (scorePercent >= 80) {
            return {
                level: 'Conforme',
                color: 'emerald',
                textColor: 'text-emerald-400',
                barColor: 'bg-emerald-500',
                pillClass: 'bg-emerald-900/30 border-emerald-600 text-emerald-300',
                riskLevel: 'Faible'
            };
        } else if (scorePercent >= 60) {
            return {
                level: 'À renforcer',
                color: 'yellow',
                textColor: 'text-yellow-400',
                barColor: 'bg-yellow-500',
                pillClass: 'bg-yellow-900/30 border-yellow-600 text-yellow-300',
                riskLevel: 'Modéré'
            };
        }

        return {
            level: 'Prioritaire',
            color: 'red',
            textColor: 'text-red-400',
            barColor: 'bg-red-500',
            pillClass: 'bg-red-900/30 border-red-600 text-red-300',
            riskLevel: 'Élevé'
        };
    };

    const complianceLevel = getComplianceLevel();
    const scorePercent = stats.lastAudit ? Math.round((stats.lastAudit.readiness_score / 16) * 100) : 0;
    const missingPoints = stats.lastAudit ? Math.max(0, 16 - stats.lastAudit.readiness_score) : 0;

    useEffect(() => {
        if (token) {
            fetchDashboardData();
        }
    }, [token]);

    // Polling pour mise à jour automatique toutes les 5 secondes
    useEffect(() => {
        if (token) {
            const interval = setInterval(() => {
                fetchDashboardData();
            }, 5000);

            return () => clearInterval(interval);
        }
    }, [token]);

    // Écouter l'événement de complétion d'audit pour mise à jour immédiate
    useEffect(() => {
        const handleAuditCompleted = () => {
            if (token) {
                fetchDashboardData();
            }
        };

        window.addEventListener('auditCompleted', handleAuditCompleted);
        return () => window.removeEventListener('auditCompleted', handleAuditCompleted);
    }, [token]);

    const fetchDashboardData = async () => {
        try {
            const [auditsRes, progressRes] = await Promise.all([
                fetch(`/api/audit/history${type === 'iso27001' ? '?type=iso27001' : ''}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch('/api/trainings/user/progress', {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
            ]);

            if (auditsRes.ok && progressRes.ok) {
                const audits = await auditsRes.json();
                const progress = await progressRes.json();

                setAuditHistory(audits);
                setTrainingProgress(progress);

                setStats({
                    auditsCount: audits.length,
                    trainingsInProgress: progress.filter((p: any) => !p.completed).length,
                    trainingsCompleted: progress.filter((p: any) => p.completed).length,
                    lastAudit: audits[0] || null
                });
            }
        } catch (error) {
            console.error('Erreur chargement données:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const downloadCertificate = async () => {
        if (!stats.lastAudit) return;

        try {
            const response = await fetch(`/api/certificate/${stats.lastAudit.id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Certificat_NIS2_${user?.companyName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            } else {
                alert('Erreur lors du téléchargement du certificat');
            }
        } catch (error) {
            console.error('Erreur téléchargement certificat:', error);
            alert('Erreur lors du téléchargement du certificat');
        }
    };

    if (isLoading) {
        return (
            <section className="min-h-screen py-24 relative flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
                    <p className="text-slate-400">Chargement de votre espace...</p>
                </div>
            </section>
        );
    }

    return (
        <section className="min-h-screen py-24 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header avec infos utilisateur */}
                <div className="mb-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                            Tableau de bord
                        </h1>
                        <p className="text-slate-400 text-lg">
                            Bienvenue, <span className="text-cyan-400 font-medium">{user?.email}</span>
                        </p>
                    </div>
                </div>

                {/* Infos entreprise */}
                <div className="glass-panel rounded-2xl p-6 mb-8 border border-slate-700/50">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
                            <Building className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">{user?.companyName}</h2>
                            <p className="text-cyan-400">Compte {user?.role === 'admin' ? 'Administrateur' : 'Utilisateur'}</p>
                        </div>
                    </div>
                </div>

                {/* Score de Conformité - Tableau de bord sobre */}
                {stats.lastAudit ? (
                    complianceLevel && (
                        <div className="glass-panel rounded-2xl p-8 mb-8 border border-slate-700/50">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Synthèse conformité</h2>
                                    <p className="text-slate-400">Vue d'ensemble claire de votre audit NIS2</p>
                                </div>
                                <div className={`inline-flex items-center px-4 py-2 rounded-lg border text-sm font-semibold ${complianceLevel.pillClass} ${complianceLevel.color === 'red' ? 'bg-red-700/60 border-red-400 text-white animate-pulse' : ''}`}>
                                    {complianceLevel.color === 'red' ? 'Risque élevé' : `Statut : ${complianceLevel.level}`}
                                </div>
                            </div>

                            <div className="bg-slate-950 rounded-lg p-6 border border-slate-800">
                                <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
                                    <div className="flex space-x-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    </div>
                                    <div className="text-xs text-slate-500 font-mono">NIS2 COMPLIANCE DASHBOARD</div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    <div className="bg-slate-900 p-5 rounded border border-slate-800">
                                        <div className="text-slate-400 text-xs mb-2">Score de préparation</div>
                                        <div className={`text-4xl font-bold ${complianceLevel.textColor}`}>{scorePercent}%</div>
                                        <div className="w-full bg-slate-800 h-2 mt-4 rounded-full overflow-hidden">
                                            <div className={`${complianceLevel.barColor} h-full`} style={{ width: `${scorePercent}%` }}></div>
                                        </div>
                                        <div className="text-xs text-slate-500 mt-3">{stats.lastAudit.readiness_score}/16 mesures en place</div>
                                    </div>

                                    <div className="bg-slate-900 p-5 rounded border border-slate-800 space-y-3">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-slate-400">Secteur</span>
                                            <span className="text-white font-medium">{stats.lastAudit.sector_name}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-slate-400">Type d'entité</span>
                                            <span className={`${stats.lastAudit.sector_type === 'critical' ? 'text-red-400' : stats.lastAudit.sector_type === 'important' ? 'text-orange-400' : 'text-slate-300'} font-medium`}>
                                                {stats.lastAudit.sector_type === 'critical' ? 'Critique' : stats.lastAudit.sector_type === 'important' ? 'Important' : 'Hors périmètre'}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-slate-400">Risque</span>
                                            <span className={`${complianceLevel.textColor} font-semibold`}>{complianceLevel.riskLevel}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-slate-400">Dernier audit</span>
                                            <span className="text-slate-200">
                                                {new Date(stats.lastAudit.created_at).toLocaleDateString('fr-FR')}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="bg-slate-900 p-5 rounded border border-slate-800">
                                        <div className="text-slate-400 text-xs mb-3">Indicateurs clés</div>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-slate-300">Audits réalisés</span>
                                                <span className="text-white font-semibold">{stats.auditsCount}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-slate-300">Formations en cours</span>
                                                <span className="text-white font-semibold">{stats.trainingsInProgress}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-slate-300">Formations complétées</span>
                                                <span className="text-white font-semibold">{stats.trainingsCompleted}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-slate-300">Mesures manquantes</span>
                                                <span className="text-white font-semibold">{missingPoints}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 flex flex-wrap gap-3">
                                    <button
                                        disabled
                                        className="px-6 py-3 bg-slate-800 text-white border border-slate-700 font-semibold rounded-lg opacity-60 cursor-not-allowed"
                                    >
                                        Nouvel audit
                                    </button>
                                    <button
                                        onClick={downloadCertificate}
                                        className="px-6 py-3 bg-slate-800 text-white border border-slate-700 font-semibold rounded-lg hover:bg-slate-700 transition-all flex items-center gap-2"
                                    >
                                        <Download className="w-4 h-4" />
                                        Rapport d'audit PDF
                                    </button>
                                    <button
                                        onClick={() => onContactClick && onContactClick('Contact depuis dashboard')}
                                        className="px-6 py-3 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-500 transition-all"
                                    >
                                        Contactez-nous
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                ) : (
                    <div className="glass-panel rounded-2xl p-8 mb-8 border border-slate-700/50">
                        <div className="text-center py-8">
                            <div className="w-20 h-20 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-cyan-500/30">
                                <Shield className="w-10 h-10 text-cyan-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">Évaluez votre Conformité NIS2</h3>
                            <p className="text-slate-400 max-w-2xl mx-auto mb-6 leading-relaxed">
                                Vous n'avez pas encore réalisé d'audit de conformité. Commencez maintenant pour connaître votre niveau de préparation face aux exigences de la directive NIS2.
                            </p>
                            <button
                                onClick={() => onNavigate?.('nis2')}
                                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded-lg hover:from-cyan-500 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/20"
                            >
                                Démarrer mon premier audit
                                <ChevronRight className="ml-2 w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Statistiques */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <StatCard
                        icon={<Shield className="w-6 h-6 text-cyan-400" />}
                        title="Audits réalisés"
                        value={stats.auditsCount.toString()}
                        trend="Historique complet"
                        color="cyan"
                        highlight={false}
                    />
                    <StatCard
                        icon={<BookOpen className="w-6 h-6 text-yellow-400" />}
                        title="Formations en cours"
                        value={stats.trainingsInProgress.toString()}
                        trend={stats.trainingsInProgress > 0 ? "⚡ À terminer d'urgence" : "Aucune en cours"}
                        color="yellow"
                        highlight={stats.trainingsInProgress > 0}
                    />
                    <StatCard
                        icon={<Award className="w-6 h-6 text-emerald-400" />}
                        title="Formations complétées"
                        value={stats.trainingsCompleted.toString()}
                        trend="Certifications obtenues"
                        color="emerald"
                        highlight={false}
                    />
                    <StatCard
                        icon={stats.lastAudit && (stats.lastAudit.readiness_score / 16) < 0.6 ?
                            <AlertOctagon className="w-6 h-6 text-red-400" /> :
                            <Activity className="w-6 h-6 text-purple-400" />
                        }
                        title="Mesures en place"
                        value={stats.lastAudit ? `${stats.lastAudit.readiness_score}/16` : 'N/A'}
                        trend={stats.lastAudit ?
                            (stats.lastAudit.readiness_score / 16) >= 0.8 ? '✅ Excellent' :
                                (stats.lastAudit.readiness_score / 16) >= 0.6 ? '⚠️ Insuffisant' :
                                    '🚨 CRITIQUE' : 'Aucun audit'}
                        color={stats.lastAudit ?
                            (stats.lastAudit.readiness_score / 16) >= 0.8 ? 'emerald' :
                                (stats.lastAudit.readiness_score / 16) >= 0.6 ? 'yellow' :
                                    'red' : 'purple'}
                        highlight={stats.lastAudit && (stats.lastAudit.readiness_score / 16) < 0.8}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Dernier audit */}
                    <div className="glass-panel rounded-2xl p-6 border border-slate-700/50">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <Shield className="w-6 h-6 text-cyan-400" />
                                Dernier Audit NIS2
                            </h3>
                        </div>

                        {stats.lastAudit ? (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-4 bg-slate-800 rounded-lg">
                                    <div>
                                        <p className="text-slate-400 text-sm">Secteur</p>
                                        <p className="text-white font-medium">{stats.lastAudit.sector_name}</p>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${stats.lastAudit.sector_type === 'critical' ? 'bg-red-900/20 text-red-400' :
                                        stats.lastAudit.sector_type === 'important' ? 'bg-orange-900/20 text-orange-400' :
                                            'bg-slate-800 text-slate-400'
                                        }`}>
                                        {stats.lastAudit.sector_type === 'critical' ? 'Critique' :
                                            stats.lastAudit.sector_type === 'important' ? 'Important' :
                                                'Hors périmètre'}
                                    </div>
                                </div>

                                <div className="p-4 bg-slate-800 rounded-lg">
                                    <p className="text-slate-400 text-sm mb-2">Score de préparation</p>
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1 bg-slate-700 rounded-full h-3 overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full transition-all duration-500"
                                                style={{ width: `${(stats.lastAudit.readiness_score / 16) * 100}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-white font-bold">{stats.lastAudit.readiness_score}/16</span>
                                    </div>
                                </div>

                                <p className="text-slate-400 text-sm">
                                    Réalisé le {new Date(stats.lastAudit.created_at).toLocaleDateString('fr-FR')}
                                </p>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <Shield className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                                <p className="text-slate-500">Aucun audit réalisé</p>
                                <p className="text-slate-600 text-sm mt-2">Commencez votre premier audit NIS2</p>
                            </div>
                        )}
                    </div>

                    {/* Formations récentes */}
                    <div className="glass-panel rounded-2xl p-6 border border-slate-700/50">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <BookOpen className="w-6 h-6 text-cyan-400" />
                                Formations Récentes
                            </h3>
                        </div>

                        {trainingProgress.length > 0 ? (
                            <div className="space-y-3">
                                {trainingProgress.slice(0, 5).map((progress: any) => (
                                    <div key={progress.id} className="p-4 bg-slate-800 rounded-lg hover:bg-slate-750 transition-colors">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="text-white font-medium text-sm">{progress.title}</h4>
                                            {progress.completed ? (
                                                <Award className="w-5 h-5 text-green-400" />
                                            ) : (
                                                <Clock className="w-5 h-5 text-yellow-400" />
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 bg-slate-700 rounded-full h-2 overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-500 ${progress.completed ? 'bg-green-500' : 'bg-yellow-500'
                                                        }`}
                                                    style={{ width: `${progress.progress}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-slate-400 text-xs font-medium">{progress.progress}%</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <BookOpen className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                                <p className="text-slate-500">Aucune formation commencée</p>
                                <p className="text-slate-600 text-sm mt-2">Explorez notre catalogue</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Actions rapides */}
                <div className="mt-12">
                    <h3 className="text-2xl font-bold text-white mb-6">Actions Rapides</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <ActionCard
                            icon={<Shield className="w-8 h-8 text-cyan-400" />}
                            title="Nouvel audit NIS2"
                            description="Évaluez votre conformité"
                            onClick={() => onNavigate?.('nis2')}
                        />
                        <ActionCard
                            icon={<BookOpen className="w-8 h-8 text-purple-400" />}
                            title="Parcourir les formations"
                            description="Développez vos compétences"
                            onClick={() => onNavigate?.('trainings')}
                        />
                        <ActionCard
                            icon={<FileText className="w-8 h-8 text-green-400" />}
                            title="Demander un devis"
                            description="Solutions personnalisées"
                            onClick={() => onContactClick && onContactClick('Demande de devis depuis dashboard')}
                        />
                    </div>
                </div>

            </div>
        </section>
    );
};

const StatCard = ({ icon, title, value, trend, color, highlight }: any) => (
    <div className={`glass-panel rounded-xl p-6 border transition-all ${highlight
        ? color === 'red'
            ? 'border-red-500/70 shadow-lg shadow-red-500/30'
            : color === 'yellow'
                ? 'border-yellow-500/70 shadow-lg shadow-yellow-500/20'
                : 'border-slate-700/50 hover:border-cyan-500/30'
        : 'border-slate-700/50 hover:border-cyan-500/30'
        }`}>
        <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center border ${highlight && color === 'red' ? 'bg-red-950/50 border-red-700' :
                highlight && color === 'yellow' ? 'bg-yellow-950/50 border-yellow-700' :
                    'bg-slate-800/50 border-slate-700'
                }`}>
                {icon}
            </div>
            {highlight && (
                <span className="text-2xl">
                    {color === 'red' ? '🚨' : '⚠️'}
                </span>
            )}
        </div>
        <h3 className={`text-3xl font-bold mb-1 ${highlight && color === 'red' ? 'text-red-400' :
            highlight && color === 'yellow' ? 'text-yellow-400' :
                'text-white'
            }`}>
            {value}
        </h3>
        <p className="text-slate-400 text-sm">{title}</p>
        <p className={`text-xs mt-2 font-semibold ${highlight && color === 'red' ? 'text-red-400' :
            highlight && color === 'yellow' ? 'text-yellow-400' :
                'text-slate-500'
            }`}>
            {trend}
        </p>
    </div>
);

const ActionCard = ({ icon, title, description, onClick }: any) => (
    <button
        onClick={onClick}
        className="group glass-panel rounded-xl p-6 border border-slate-700/50 hover:border-cyan-500/50 transition-all hover:shadow-lg hover:shadow-cyan-500/10 text-left"
    >
        <div className="mb-4">{icon}</div>
        <h4 className="text-white font-bold text-lg mb-2 group-hover:text-cyan-400 transition-colors">
            {title}
        </h4>
        <p className="text-slate-400 text-sm mb-4">{description}</p>
        <div className="flex items-center text-cyan-400 text-sm font-medium group-hover:translate-x-2 transition-transform">
            <span>Accéder</span>
            <ChevronRight className="w-4 h-4 ml-1" />
        </div>
    </button>
);
