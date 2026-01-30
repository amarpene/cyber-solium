import React, { useEffect, useState } from 'react';
import { PieChart, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface IsoDashboardStats {
    auditsCount: number;
    lastAudit: any;
}

interface IsoDashboardProps {
    onNavigate?: (page: string) => void;
}

export const Iso27001Dashboard: React.FC<IsoDashboardProps> = ({ onNavigate }) => {
    const { token } = useAuth();
    const [stats, setStats] = useState<IsoDashboardStats>({
        auditsCount: 0,
        lastAudit: null
    });
    const [auditHistory, setAuditHistory] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (token) {
            fetchDashboardData();
        }
    }, [token]);

    useEffect(() => {
        if (token) {
            const interval = setInterval(() => {
                fetchDashboardData();
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [token]);

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
            // Suppose endpoint /api/audit/history?type=iso27001 for ISO audits
            const auditsRes = await fetch('/api/audit/history?type=iso27001', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (auditsRes.ok) {
                const audits = await auditsRes.json();
                setAuditHistory(audits);
                setStats({
                    auditsCount: audits.length,
                    lastAudit: audits[0] || null
                });
            }
        } catch (error) {
            console.error('Erreur chargement données ISO:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const scorePercent = stats.lastAudit ? Math.round((stats.lastAudit.readiness_score / 14) * 100) : 0;

    if (isLoading) {
        return (
            <section className="min-h-screen py-24 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
                    <p className="text-slate-400">Chargement du tableau de bord ISO 27001...</p>
                </div>
            </section>
        );
    }

    return (
        <section className="min-h-screen py-24">
            <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">Tableau de bord ISO 27001</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <div className="glass-panel rounded-xl p-6 border border-slate-700/50">
                        <div className="flex items-center mb-4">
                            <PieChart className="w-8 h-8 text-cyan-400 mr-3" />
                            <span className="text-lg font-semibold text-white">Audits réalisés</span>
                        </div>
                        <div className="text-4xl font-bold text-cyan-400">{stats.auditsCount}</div>
                    </div>
                    <div className="glass-panel rounded-xl p-6 border border-slate-700/50">
                        <div className="flex items-center mb-4">
                            <CheckCircle className="w-8 h-8 text-emerald-400 mr-3" />
                            <span className="text-lg font-semibold text-white">Dernier score</span>
                        </div>
                        <div className="text-4xl font-bold text-emerald-400">{scorePercent}%</div>
                        {stats.lastAudit && (
                            <div className="mt-2 text-slate-400 text-sm">{new Date(stats.lastAudit.created_at).toLocaleString()}</div>
                        )}
                    </div>
                </div>
                <div className="glass-panel rounded-xl p-6 border border-slate-700/50 mt-8">
                    <h2 className="text-xl font-bold text-white mb-4">Historique des audits ISO 27001</h2>
                    <ul className="divide-y divide-slate-800">
                        {auditHistory.length === 0 && <li className="text-slate-500">Aucun audit réalisé.</li>}
                        {auditHistory.map((audit, idx) => (
                            <li key={audit.id || idx} className="py-3 flex items-center justify-between">
                                <span className="text-slate-300">{new Date(audit.created_at).toLocaleString()}</span>
                                <span className="font-semibold text-cyan-400">{Math.round((audit.readiness_score / 14) * 100)}%</span>
                                <span className="text-xs text-slate-500">{audit.sectorName}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
};
