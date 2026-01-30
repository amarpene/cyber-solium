
import React, { useState, useEffect } from 'react';
import { PieChart, CheckCircle, Building, Shield, BookOpen, FileText, Award, Clock, ChevronRight, Download } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const Dashboard = (props) => {
    const { user, token } = useAuth();
    const [nis2Stats, setNis2Stats] = useState({ audits: [], lastAudit: null });
    const [isoStats, setIsoStats] = useState({ audits: [], lastAudit: null });
    const [isExporting, setIsExporting] = useState(false);
    const [loading, setLoading] = useState(true);

    // Fetch NIS2 audits
    const fetchNis2 = async () => {
        const res = await fetch('/api/audit/history?type=nis2', { headers: { 'Authorization': `Bearer ${token}` } });
        const audits = res.ok ? await res.json() : [];
        setNis2Stats({ audits, lastAudit: audits[0] || null });
    };
    // Fetch ISO audits
    const fetchIso = async () => {
        const res = await fetch('/api/audit/history?type=iso27001', { headers: { 'Authorization': `Bearer ${token}` } });
        const audits = res.ok ? await res.json() : [];
        setIsoStats({ audits, lastAudit: audits[0] || null });
    };

    useEffect(() => {
        setLoading(true);
        Promise.all([fetchNis2(), fetchIso()]).finally(() => setLoading(false));
    }, [user]);

    // Export NIS2
    const handleExportNis2 = async () => {
        if (!nis2Stats.lastAudit) return;
        setIsExporting(true);
        try {
            const url = `/api/certificate/${nis2Stats.lastAudit.id}`;
            const filename = `Certificat_NIS2_${user?.companyName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
            const response = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
            if (response.ok) {
                const blob = await response.blob();
                const urlBlob = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = urlBlob;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(urlBlob);
                document.body.removeChild(a);
            } else {
                alert('Erreur lors du téléchargement du certificat');
            }
        } catch (error) {
            alert('Erreur lors du téléchargement du certificat');
        } finally {
            setIsExporting(false);
        }
    };
    // Export ISO
    const handleExportIso = async () => {
        if (!isoStats.lastAudit) return;
        setIsExporting(true);
        try {
            const url = `/api/certificate-iso27001/${isoStats.lastAudit.id}`;
            const filename = `Certificat_ISO27001_${user?.companyName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
            const response = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
            if (response.ok) {
                const blob = await response.blob();
                const urlBlob = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = urlBlob;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(urlBlob);
                document.body.removeChild(a);
            } else {
                alert('Erreur lors du téléchargement du certificat');
            }
        } catch (error) {
            alert('Erreur lors du téléchargement du certificat');
        } finally {
            setIsExporting(false);
        }
    };

    if (loading) {
        return <div className="text-center py-24">Chargement...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Tableaux de bord</h1>
                    <p className="text-slate-400 text-lg">Bienvenue, <span className="text-cyan-400 font-medium">{user?.email}</span></p>
                </div>
            </div>

            {/* Dashboard NIS2 synthétique */}
            <section className="mb-16">
                <h2 className="text-2xl font-bold text-white mb-4">NIS2</h2>
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex-1">
                        <div className="rounded-xl bg-slate-900 border border-slate-800 p-6 shadow-2xl">
                            <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
                                <div className="flex space-x-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                </div>
                                <div className="text-xs text-slate-500 font-mono">NIS2 COMPLIANCE DASHBOARD</div>
                            </div>
                            {nis2Stats.lastAudit ? (
                                <>
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div className="bg-slate-900 p-4 rounded border border-slate-800">
                                            <div className="text-slate-400 text-xs mb-1">Score de Sécurité</div>
                                            <div className="text-2xl font-bold text-emerald-400">{Math.round((nis2Stats.lastAudit.readiness_score / 16) * 100)}/100</div>
                                            <div className="w-full bg-slate-800 h-1 mt-2 rounded-full overflow-hidden">
                                                <div className="bg-emerald-500 h-full" style={{ width: `${Math.round((nis2Stats.lastAudit.readiness_score / 16) * 100)}%` }}></div>
                                            </div>
                                        </div>
                                        <div className="bg-slate-900 p-4 rounded border border-slate-800">
                                            <div className="text-slate-400 text-xs mb-1">Dernier audit</div>
                                            <div className="text-2xl font-bold text-cyan-400">{new Date(nis2Stats.lastAudit.created_at).toLocaleDateString('fr-FR')}</div>
                                        </div>
                                    </div>
                                    <div className="flex-1 bg-slate-900 rounded border border-slate-800 p-4 overflow-hidden relative">
                                        <div className="space-y-2 relative z-10">
                                            <div className="flex items-center justify-between text-xs py-2 border-b border-slate-800/50">
                                                <span className="text-slate-300">Secteur</span>
                                                <span className="text-emerald-400">{nis2Stats.lastAudit.sector_name}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-xs py-2 border-b border-slate-800/50">
                                                <span className="text-slate-300">Score</span>
                                                <span className="text-emerald-400">{nis2Stats.lastAudit.readiness_score}/16</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-6 flex flex-wrap gap-3">
                                        <button onClick={handleExportNis2} className="px-6 py-3 bg-slate-800 text-white border border-slate-700 font-semibold rounded-lg hover:bg-slate-700 transition-all flex items-center gap-2" disabled={isExporting}>
                                            <Download className="w-4 h-4" /> Exporter le PDF NIS2
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-8">
                                    <Shield className="w-12 h-12 text-cyan-400 mx-auto mb-3" />
                                    <p className="text-slate-500">Aucun audit NIS2 réalisé</p>
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Historique NIS2 */}
                    <div className="flex-1">
                        <div className="rounded-xl bg-slate-900 border border-slate-800 p-6">
                            <h4 className="text-lg font-bold text-white mb-2">Historique des audits NIS2</h4>
                            <ul className="divide-y divide-slate-800">
                                {nis2Stats.audits.length === 0 && <li className="text-slate-500">Aucun audit réalisé.</li>}
                                {nis2Stats.audits.map((audit, idx) => (
                                    <li key={audit.id || idx} className="py-3 flex items-center justify-between">
                                        <span className="text-slate-300">{new Date(audit.created_at).toLocaleString()}</span>
                                        <span className="font-semibold text-cyan-400">{Math.round((audit.readiness_score / 16) * 100)}%</span>
                                        <span className="text-xs text-slate-500">{audit.sector_name}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Dashboard ISO 27001 synthétique */}
            <section>
                <h2 className="text-2xl font-bold text-white mb-4">ISO 27001</h2>
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex-1">
                        <div className="rounded-xl bg-slate-900 border border-slate-800 p-6 shadow-2xl">
                            <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
                                <div className="flex space-x-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                </div>
                                <div className="text-xs text-slate-500 font-mono">ISO 27001 DASHBOARD</div>
                            </div>
                            {isoStats.lastAudit ? (
                                <>
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div className="bg-slate-900 p-4 rounded border border-slate-800">
                                            <div className="text-slate-400 text-xs mb-1">Score de Sécurité</div>
                                            <div className="text-2xl font-bold text-blue-400">{Math.round((isoStats.lastAudit.readiness_score / 14) * 100)}/100</div>
                                            <div className="w-full bg-slate-800 h-1 mt-2 rounded-full overflow-hidden">
                                                <div className="bg-blue-500 h-full" style={{ width: `${Math.round((isoStats.lastAudit.readiness_score / 14) * 100)}%` }}></div>
                                            </div>
                                        </div>
                                        <div className="bg-slate-900 p-4 rounded border border-slate-800">
                                            <div className="text-slate-400 text-xs mb-1">Dernier audit</div>
                                            <div className="text-2xl font-bold text-blue-400">{new Date(isoStats.lastAudit.created_at).toLocaleDateString('fr-FR')}</div>
                                        </div>
                                    </div>
                                    <div className="flex-1 bg-slate-900 rounded border border-slate-800 p-4 overflow-hidden relative">
                                        <div className="space-y-2 relative z-10">
                                            <div className="flex items-center justify-between text-xs py-2 border-b border-slate-800/50">
                                                <span className="text-slate-300">Secteur</span>
                                                <span className="text-blue-400">{isoStats.lastAudit.sector_name}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-xs py-2 border-b border-slate-800/50">
                                                <span className="text-slate-300">Score</span>
                                                <span className="text-blue-400">{isoStats.lastAudit.readiness_score}/14</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-6 flex flex-wrap gap-3">
                                        <button onClick={handleExportIso} className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 transition-all flex items-center gap-2" disabled={isExporting}>
                                            <Download className="w-4 h-4" /> Exporter le PDF ISO 27001
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-8">
                                    <PieChart className="w-12 h-12 text-blue-400 mx-auto mb-3" />
                                    <p className="text-slate-500">Aucun audit ISO 27001 réalisé</p>
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Historique ISO */}
                    <div className="flex-1">
                        <div className="rounded-xl bg-slate-900 border border-slate-800 p-6">
                            <h4 className="text-lg font-bold text-white mb-2">Historique des audits ISO 27001</h4>
                            <ul className="divide-y divide-slate-800">
                                {isoStats.audits.length === 0 && <li className="text-slate-500">Aucun audit réalisé.</li>}
                                {isoStats.audits.map((audit, idx) => (
                                    <li key={audit.id || idx} className="py-3 flex items-center justify-between">
                                        <span className="text-slate-300">{new Date(audit.created_at).toLocaleString()}</span>
                                        <span className="font-semibold text-blue-400">{Math.round((audit.readiness_score / 14) * 100)}%</span>
                                        <span className="text-xs text-slate-500">{audit.sector_name}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </div>
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
